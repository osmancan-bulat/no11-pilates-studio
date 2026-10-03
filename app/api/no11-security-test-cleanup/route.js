import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  clearRateLimit,
  deleteAppointment,
  listAppointments,
} from '../../../lib/firebase-firestore.js';
import { rateLimitIdentity } from '../../../lib/no11-rate-limit.js';

const TEST_TOKEN = 'no11-security-final-20261003-e4f2a71c9d';
const TEST_PREFIX = 'SECURITY FINAL TEST';

function authorized(request) {
  return process.env.VERCEL_ENV === 'preview' && request.headers.get('x-no11-test-token') === TEST_TOKEN;
}

export async function POST(request) {
  if (!authorized(request)) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const appointments = await listAppointments();
  const tests = appointments.filter((item) => String(item?.name || '').startsWith(TEST_PREFIX));
  const existing = appointments.filter((item) => !String(item?.name || '').startsWith(TEST_PREFIX));
  const integrityHash = crypto.createHash('sha256')
    .update(JSON.stringify(existing.sort((a, b) => String(a.id).localeCompare(String(b.id)))))
    .digest('hex');
  return NextResponse.json({ appointments: tests, existingCount: existing.length, integrityHash });
}

export async function DELETE(request) {
  if (!authorized(request)) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  const requested = new Set(Array.isArray(body?.ids) ? body.ids.map(String) : []);
  const appointments = await listAppointments();
  const safeIds = appointments
    .filter((item) => requested.has(String(item?.id)) && String(item?.name || '').startsWith(TEST_PREFIX))
    .map((item) => String(item.id));
  await Promise.all(safeIds.map((id) => deleteAppointment(id)));
  for (const scope of ['admin-login', 'appointment-create']) {
    const identity = rateLimitIdentity(request, scope);
    await clearRateLimit({ scope, key: identity.key });
  }
  return NextResponse.json({ ok: true, deleted: safeIds.length });
}
