import { NextResponse } from 'next/server';
import { COOKIE_NAME, adminCookieOptions, clearAdminCookieOptions, createAdminSession, isAdminRequest, verifyAdminLogin } from '../../../lib/no11-admin-auth.js';
import { consumeRateLimit, getRateLimitStatus } from '../../../lib/firebase-firestore.js';
import { rateLimitIdentity } from '../../../lib/no11-rate-limit.js';

export const dynamic = 'force-dynamic';

const LOGIN_RATE_LIMIT = {
  scope: 'admin-login',
  limit: 5,
  windowMs: 15 * 60_000,
};

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'cache-control': 'no-store, max-age=0' },
  });
}

function tooManyRequests(retryAfterSeconds) {
  const response = json({ error: 'too_many_login_attempts' }, 429);
  response.headers.set('retry-after', String(retryAfterSeconds));
  return response;
}

export async function GET(request) {
  return json({ authenticated: isAdminRequest(request) });
}

export async function POST(request) {
  try {
    const identity = rateLimitIdentity(request, LOGIN_RATE_LIMIT.scope);
    const status = await getRateLimitStatus({ ...LOGIN_RATE_LIMIT, key: identity.key });
    if (!status.allowed) return tooManyRequests(status.retryAfterSeconds);
    const body = await request.json();
    if (!verifyAdminLogin(body?.username, body?.password)) {
      const attempt = await consumeRateLimit({ ...LOGIN_RATE_LIMIT, key: identity.key });
      if (!attempt.allowed) return tooManyRequests(attempt.retryAfterSeconds);
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
