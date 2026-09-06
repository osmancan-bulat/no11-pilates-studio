import { NextResponse } from 'next/server';
import { COOKIE_NAME, adminCookieOptions, clearAdminCookieOptions, createAdminSession, isAdminRequest, verifyAdminLogin } from '../../../lib/no11-admin-auth.js';

export const dynamic = 'force-dynamic';

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'cache-control': 'no-store, max-age=0' },
  });
}

export async function GET(request) {
  return json({ authenticated: isAdminRequest(request) });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!verifyAdminLogin(body?.username, body?.password)) {
      return json({ error: 'invalid_credentials' }, 401);
    }

    const response = json({ ok: true, authenticated: true });
    response.cookies.set(COOKIE_NAME, createAdminSession(), adminCookieOptions());
    return response;
  } catch {
    return json({ error: 'invalid_request' }, 400);
  }
}

export async function DELETE() {
  const response = json({ ok: true, authenticated: false });
  response.cookies.set(COOKIE_NAME, '', clearAdminCookieOptions());
  return response;
}
