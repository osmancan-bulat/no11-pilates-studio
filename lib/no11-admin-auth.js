import crypto from 'node:crypto';

const COOKIE_NAME = 'no11_admin_session';
const USERNAME = 'eda';
const PASSWORD_HASH = 'a5cb7881236fa3e847324fd5de286d4e717e8ed155ea5a0de30cb239ff841a23';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  return String(process.env.NO11_ADMIN_API_KEY || '').trim();
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  return left.length === right.length && left.length > 0 && crypto.timingSafeEqual(left, right);
}

function signature(payload) {
  const key = secret();
  if (!key) return '';
  return crypto.createHmac('sha256', key).update(payload).digest('base64url');
}

function cookieValue(request) {
  const raw = String(request.headers.get('cookie') || '');
  const entry = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return entry ? decodeURIComponent(entry.slice(COOKIE_NAME.length + 1)) : '';
}

export function verifyAdminLogin(username, password) {
  if (String(username || '').trim().toLowerCase() !== USERNAME) return false;
  const hash = crypto.createHash('sha256').update(String(password || '')).digest('hex');
  return safeEqual(hash, PASSWORD_HASH);
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${expires}`;
  return `${payload}.${signature(payload)}`;
}

export function isAdminRequest(request) {
  const key = secret();
  if (!key) return false;

  const headerKey = String(request.headers.get('x-no11-admin-key') || '').trim();
  if (headerKey && safeEqual(headerKey, key)) return true;

  const token = cookieValue(request);
  const match = /^v1\.(\d+)\.([A-Za-z0-9_-]+)$/.exec(token);
  if (!match) return false;
  const expires = Number(match[1]);
  if (!Number.isFinite(expires) || expires <= Math.floor(Date.now() / 1000)) return false;
  const payload = `v1.${expires}`;
  return safeEqual(match[2], signature(payload));
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function clearAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  };
}

export { COOKIE_NAME };
