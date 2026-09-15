import { NextResponse } from 'next/server';
import { COOKIE_NAME, clearAdminCookieOptions } from '../../../lib/no11-admin-auth.js';

export const dynamic = 'force-dynamic';

export function GET(request) {
  const incoming = new URL(request.url);
  const destination = incoming.searchParams.get('next') === '/admin' ? '/admin' : '/';
  const response = NextResponse.redirect(new URL(destination, request.url), 303);
  response.cookies.set(COOKIE_NAME, '', clearAdminCookieOptions());
  response.headers.set('cache-control', 'no-store, max-age=0');
  return response;
}
