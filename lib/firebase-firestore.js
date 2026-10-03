import crypto from 'node:crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FIRESTORE_SCOPE = 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/firebase.messaging';
const COLLECTION = 'no11Appointments';
const SLOT_COLLECTION = 'no11AppointmentSlots';
const PUSH_COLLECTION = 'no11PushDevices';

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function credentials() {
  const projectId = String(process.env.FIREBASE_PROJECT_ID || '').trim();
  const clientEmail = String(process.env.FIREBASE_CLIENT_EMAIL || '').trim();
  const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  return { projectId, clientEmail, privateKey };
}

export function firebaseConfigured() {
  const { projectId, clientEmail, privateKey } = credentials();
  return Boolean(projectId && clientEmail && privateKey);
}

async function accessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt - 60_000) return cachedToken;

  const { clientEmail, privateKey } = credentials();
  if (!clientEmail || !privateKey) throw new Error('firebase_not_configured');

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    sub: clientEmail,
    aud: TOKEN_URL,
    scope: FIRESTORE_SCOPE,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(privateKey).toString('base64url')}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Firebase token error:', response.status, text.slice(0, 300));
    throw new Error('firebase_auth_failed');
  }

  const data = await response.json();
  cachedToken = data.access_token;
  cachedTokenExpiresAt = Date.now() + Number(data.expires_in || 3600) * 1000;
  return cachedToken;
}

function firestoreBase() {
  const { projectId } = credentials();
  if (!projectId) throw new Error('firebase_not_configured');
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;
}

async function firestoreFetch(path, options = {}) {
  const token = await accessToken();
  const response = await fetch(`${firestoreBase()}${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Firestore error:', response.status, text.slice(0, 500));
    const error = new Error('firestore_request_failed');
    error.status = response.status;
    try {
      error.firestoreStatus = JSON.parse(text)?.error?.status || '';
    } catch {}
    throw error;
  }

  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  }
}

function documentId(id) {
  return encodeURIComponent(String(id).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 180));
}

function documentName(collection, id) {
  return `${firestoreBase()}/${collection}/${documentId(id)}`;
}

function slotDocumentName(date, time) {
  return documentName(SLOT_COLLECTION, `${date}_${time}`);
}

function appointmentFields(payload, now) {
  return {
    payload: { stringValue: JSON.stringify(payload) },
    status: { stringValue: String(payload.status || 'pending') },
    updatedAt: { timestampValue: now },
    createdAt: { timestampValue: payload.createdAt || now },
  };
}

function slotFields(payload, now) {
  return {
    appointmentId: { stringValue: String(payload.id) },
    date: { stringValue: String(payload.date) },
    time: { stringValue: String(payload.time) },
    status: { stringValue: String(payload.status || 'pending') },
    updatedAt: { timestampValue: now },
  };
}

function activeAppointment(appointment) {
  return Boolean(appointment?.date && appointment?.time && appointment?.status !== 'rejected');
}

function slotOwner(document) {
  return String(document?.fields?.appointmentId?.stringValue || '');
}

function conflict(error) {
  return error?.status === 409 || error?.status === 412 ||
    ['ABORTED', 'ALREADY_EXISTS', 'FAILED_PRECONDITION'].includes(error?.firestoreStatus);
}

function occupiedError() {
  const error = new Error('appointment_slot_occupied');
  error.code = 'appointment_slot_occupied';
  return error;
}

async function beginTransaction() {
  const data = await firestoreFetch(':beginTransaction', {
    method: 'POST',
    body: JSON.stringify({ options: { readWrite: {} } }),
  });
  return data?.transaction;
}

async function transactionDocuments(transaction, names) {
  if (!names.length) return new Map();
  const data = await firestoreFetch(':batchGet', {
    method: 'POST',
    body: JSON.stringify({ documents: names, transaction }),
  });
  const documents = new Map();
  for (const item of Array.isArray(data) ? data : [data]) {
    if (item?.found?.name) documents.set(item.found.name, item.found);
    if (item?.missing) documents.set(item.missing, null);
  }
  return documents;
}

async function commitTransaction(transaction, writes) {
  return firestoreFetch(':commit', {
    method: 'POST',
    body: JSON.stringify({ transaction, writes }),
  });
}

async function rollbackTransaction(transaction) {
  if (!transaction) return;
  await firestoreFetch(':rollback', {
    method: 'POST',
    body: JSON.stringify({ transaction }),
  }).catch(() => {});
}

function documentToAppointment(doc) {
  try {
    return JSON.parse(doc?.fields?.payload?.stringValue || '{}');
  } catch {
    return null;
  }
}

function documentToPushDevice(doc) {
  try {
    return JSON.parse(doc?.fields?.payload?.stringValue || '{}');
  } catch {
    return null;
  }
}

export async function checkFirestore() {
  if (!firebaseConfigured()) return false;
  await firestoreFetch(`/${COLLECTION}?pageSize=1`, { method: 'GET' });
  return true;
}

export async function saveAppointment(appointment) {
  const now = new Date().toISOString();
  const payload = { ...appointment, updatedAt: now };
  const appointmentName = documentName(COLLECTION, payload.id);
  const transaction = await beginTransaction();

  try {
    const appointmentDocuments = await transactionDocuments(transaction, [appointmentName]);
    const previousDocument = appointmentDocuments.get(appointmentName);
    const previous = documentToAppointment(previousDocument);
    const previousSlotName = activeAppointment(previous) ? slotDocumentName(previous.date, previous.time) : '';
    const nextSlotName = activeAppointment(payload) ? slotDocumentName(payload.date, payload.time) : '';
    const slotNames = [...new Set([previousSlotName, nextSlotName].filter(Boolean))];
    const slotDocuments = await transactionDocuments(transaction, slotNames);
    const nextSlotDocument = nextSlotName ? slotDocuments.get(nextSlotName) : null;

    if (nextSlotDocument && slotOwner(nextSlotDocument) !== String(payload.id)) throw occupiedError();

    const writes = [{
      update: { name: appointmentName, fields: appointmentFields(payload, now) },
      currentDocument: previousDocument?.updateTime
        ? { updateTime: previousDocument.updateTime }
        : { exists: false },
    }];

    if (previousSlotName && previousSlotName !== nextSlotName) {
      const previousSlotDocument = slotDocuments.get(previousSlotName);
      if (previousSlotDocument && slotOwner(previousSlotDocument) === String(payload.id)) {
        writes.push({
          delete: previousSlotName,
          currentDocument: { updateTime: previousSlotDocument.updateTime },
        });
      }
    }

    if (nextSlotName) {
      writes.push({
        update: { name: nextSlotName, fields: slotFields(payload, now) },
        currentDocument: nextSlotDocument?.updateTime
          ? { updateTime: nextSlotDocument.updateTime }
          : { exists: false },
      });
    }

    await commitTransaction(transaction, writes);
    return payload;
  } catch (error) {
    await rollbackTransaction(transaction);
    if (error?.code === 'appointment_slot_occupied' || conflict(error)) throw occupiedError();
    throw error;
  }
}

export async function listAppointments() {
  const data = await firestoreFetch(`/${COLLECTION}?pageSize=1000`, { method: 'GET' });
  return (data?.documents || [])
    .map(documentToAppointment)
    .filter(Boolean)
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function deleteAppointment(id) {
  const appointmentName = documentName(COLLECTION, id);
  const transaction = await beginTransaction();

  try {
    const appointmentDocuments = await transactionDocuments(transaction, [appointmentName]);
    const appointmentDocument = appointmentDocuments.get(appointmentName);
    if (!appointmentDocument) {
      await rollbackTransaction(transaction);
      return true;
    }

    const appointment = documentToAppointment(appointmentDocument);
    const slotName = activeAppointment(appointment) ? slotDocumentName(appointment.date, appointment.time) : '';
    const slotDocuments = await transactionDocuments(transaction, slotName ? [slotName] : []);
    const slotDocument = slotName ? slotDocuments.get(slotName) : null;
    const writes = [{
      delete: appointmentName,
      currentDocument: { updateTime: appointmentDocument.updateTime },
    }];

    if (slotDocument && slotOwner(slotDocument) === String(id)) {
      writes.push({ delete: slotName, currentDocument: { updateTime: slotDocument.updateTime } });
    }

    await commitTransaction(transaction, writes);
    return true;
  } catch (error) {
    await rollbackTransaction(transaction);
    throw error;
  }
}

export async function savePushDevice(token, label = 'Yönetici telefonu', extra = {}) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken) throw new Error('missing_push_token');
  const now = new Date().toISOString();
  const id = crypto.createHash('sha256').update(cleanToken).digest('hex').slice(0, 40);
  const payload = {
    token: cleanToken,
    label: String(label || 'Yönetici telefonu').slice(0, 80),
    type: extra?.type || 'fcm',
    subscription: extra?.subscription || null,
    updatedAt: now,
  };
  await firestoreFetch(`/${PUSH_COLLECTION}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields: { payload: { stringValue: JSON.stringify(payload) }, updatedAt: { timestampValue: now } } }),
  });
  return { id, label: payload.label };
}

export async function listPushDevices() {
  const data = await firestoreFetch(`/${PUSH_COLLECTION}?pageSize=100`, { method: 'GET' });
  return (data?.documents || []).map(documentToPushDevice).filter((item) => item?.token);
}

export async function deletePushDeviceByToken(token) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken) return false;
  const id = crypto.createHash('sha256').update(cleanToken).digest('hex').slice(0, 40);
  try {
    await firestoreFetch(`/${PUSH_COLLECTION}/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    if (error?.status === 404) return false;
    throw error;
  }
}

async function sendNativeWebPush(device, payload) {
  const publicKey = String(process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_KEY || '').trim();
  const privateKey = String(process.env.WEB_PUSH_VAPID_PRIVATE_KEY || '').trim();
  if (!publicKey || !privateKey || !device?.subscription?.endpoint) throw new Error('web_push_not_configured');
  const webpush = (await import('web-push')).default;
  return webpush.sendNotification(device.subscription, JSON.stringify(payload), {
    TTL: 300,
    urgency: 'high',
    vapidDetails: {
      subject: 'https://no11-pilates-studio.vercel.app',
      publicKey,
      privateKey,
    },
  });
}

export async function sendPushToAdmins(appointment) {
  const devices = await listPushDevices();
  if (!devices.length) return { sent: 0, failed: 0 };
  const title = 'Yeni Randevu Talebi ✨';
  const body = [appointment?.name, appointment?.service, appointment?.date, appointment?.time].filter(Boolean).join(' • ');
  const url = `/admin?appointment=${encodeURIComponent(String(appointment?.id || ''))}`;
  let sent = 0;
  let failed = 0;
  let fcmToken = null;
  let projectId = null;

  for (const device of devices) {
    try {
      if (device.type === 'webpush' && device.subscription) {
        await sendNativeWebPush(device, { title, body, url, appointmentId: String(appointment?.id || '') });
        sent++;
        continue;
      }
      if (!fcmToken) {
        fcmToken = await accessToken();
        projectId = credentials().projectId;
      }
      const response = await fetch(`https://fcm.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/messages:send`, {
        method: 'POST',
        headers: { authorization: `Bearer ${fcmToken}`, 'content-type': 'application/json' },
        body: JSON.stringify({ message: { token: device.token, notification: { title, body }, data: { appointmentId: String(appointment?.id || ''), url }, webpush: { fcmOptions: { link: url } } } }),
        cache: 'no-store',
      });
      if (response.ok) {
        sent++;
        continue;
      }
      failed++;
      const text = await response.text();
      console.error('FCM send failed:', response.status, text.slice(0, 400));
      if (response.status === 404 || response.status === 410 || text.includes('UNREGISTERED')) {
        await deletePushDeviceByToken(device.token).catch(() => {});
      }
    } catch (error) {
      failed++;
      console.error('Push send error:', error?.statusCode || '', error?.body || error);
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await deletePushDeviceByToken(device.token).catch(() => {});
      }
    }
  }
  return { sent, failed };
}
