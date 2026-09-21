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
    if (process.env.VERCEL_ENV === 'preview') {
      const upstream = await fetch('https://no11-pilates-studio-azukoqij1-osmancanbulat197-7442s-projects.vercel.app/api/no11-admin-login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
      });
      const data = await upstream.text();
      const response = new NextResponse(data, {
        status: upstream.status,
        headers: { 'content-type': upstream.headers.get('content-type') || 'application/json', 'cache-control': 'no-store, max-age=0' },
      });
      const setCookie = upstream.headers.get('set-cookie');
      if (setCookie) response.headers.set('set-cookie', setCookie);
      return response;
    }
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
