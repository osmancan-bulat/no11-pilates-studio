import { NextResponse } from 'next/server';
import { clearRateLimit, deleteAppointment } from '../../../lib/firebase-firestore.js';
import { rateLimitIdentity } from '../../../lib/no11-rate-limit.js';

const TEST_TOKEN = '860637348d52545b200fd8c382721fffa0a97d009dedff32';

export async function DELETE(request) {
  if (process.env.VERCEL_ENV !== 'preview' || request.headers.get('x-no11-test-token') !== TEST_TOKEN) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  for (const scope of ['admin-login', 'appointment-create']) {
    const identity = rateLimitIdentity(request, scope);
    await clearRateLimit({ scope, key: identity.key });
  }

  const body = await request.json().catch(() => ({}));
  const ids = Array.isArray(body?.ids)
    ? body.ids.map((id) => String(id)).filter((id) => id.startsWith('rate-')).slice(0, 20)
    : [];
  await Promise.all(ids.map((id) => deleteAppointment(id)));

  return NextResponse.json({ ok: true, deleted: ids.length });
}
