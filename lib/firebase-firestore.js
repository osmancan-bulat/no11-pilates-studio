import crypto from 'node:crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FIRESTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';
const COLLECTION = 'no11Appointments';

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
    throw error;
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function documentId(id) {
  return encodeURIComponent(String(id).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 180));
}

function documentToAppointment(doc) {
  try {
    return JSON.parse(doc?.fields?.payload?.stringValue || '{}');
  } catch {
    return null;
  }
}

export async function saveAppointment(appointment) {
  const now = new Date().toISOString();
  const payload = { ...appointment, updatedAt: now };
  const id = documentId(payload.id);

  await firestoreFetch(`/${COLLECTION}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: {
        payload: { stringValue: JSON.stringify(payload) },
        status: { stringValue: String(payload.status || 'pending') },
        updatedAt: { timestampValue: now },
        createdAt: { timestampValue: payload.createdAt || now },
      },
    }),
  });

  return payload;
}

export async function listAppointments() {
  const data = await firestoreFetch(`/${COLLECTION}?pageSize=1000`, { method: 'GET' });
  return (data?.documents || [])
    .map(documentToAppointment)
    .filter(Boolean)
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}

export async function deleteAppointment(id) {
  await firestoreFetch(`/${COLLECTION}/${documentId(id)}`, { method: 'DELETE' });
  return true;
}
