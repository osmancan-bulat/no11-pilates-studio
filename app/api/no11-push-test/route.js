import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../lib/no11-admin-auth.js';
import { sendPushToAdmins } from '../../../lib/firebase-firestore.js';

export const dynamic = 'force-dynamic';

async function run(request) {
  if (process.env.VERCEL_ENV !== 'preview') {
    return NextResponse.json({ error: 'preview_only' }, { status: 404 });
  }
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    const result = await sendPushToAdmins({
      id: `push-test-${Date.now()}`,
      name: 'Test Randevusu',
      service: 'Pilates',
      date: 'Bildirim testi',
      time: 'Şimdi',
    });
    return NextResponse.json({ ok: true, ...result }, { headers: { 'cache-control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('Push test failed:', error);
    return NextResponse.json({ error: 'push_test_failed' }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
