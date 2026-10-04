import crypto from 'node:crypto';

const COOKIE_NAME = 'no11_admin_session';
const DEFAULT_USERNAME = 'eda';
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const TEMP_ADMIN_OPEN = false;

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

function scrypt(value, salt, length) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(value, salt, length, { N: 16384, r: 8, p: 1 }, (error, derived) => {
      if (error) reject(error);
      else resolve(derived);
    });
  });
}

export async function verifyAdminLogin(username, password) {
  const expectedUsername = String(process.env.NO11_ADMIN_USERNAME || DEFAULT_USERNAME).trim().toLowerCase();
  if (!safeEqual(String(username || '').trim().toLowerCase(), expectedUsername)) return false;

  const encoded = String(process.env.NO11_ADMIN_PASSWORD_SCRYPT || '').trim();
  const match = /^scrypt\$([A-Za-z0-9_-]+)\$([A-Za-z0-9_-]+)$/.exec(encoded);
  if (match) {
    const salt = Buffer.from(match[1], 'base64url');
    const expected = Buffer.from(match[2], 'base64url');
    if (salt.length < 16 || expected.length !== 32) return false;
    const actual = await scrypt(String(password || ''), salt, expected.length);
    return crypto.timingSafeEqual(actual, expected);
  }

  // Migration fallback: the verifier remains secret-managed and never lives in source.
  const legacyVerifier = String(process.env.NO11_ADMIN_PASSWORD_HASH || '').trim();
  if (!/^[a-f0-9]{64}$/i.test(legacyVerifier)) return false;
  const actual = crypto.createHash('sha256').update(String(password || '')).digest('hex');
  return safeEqual(actual, legacyVerifier);
}

export function createAdminSession() {
  const issued = Math.floor(Date.now() / 1000);
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const nonce = crypto.randomBytes(16).toString('base64url');
  const payload = `v2.${issued}.${expires}.${nonce}`;
  return `${payload}.${signature(payload)}`;
}

export function isAdminRequest(request) {
  if (TEMP_ADMIN_OPEN) return true;

  const key = secret();
  if (!key) return false;

  const headerKey = String(request.headers.get('x-no11-admin-key') || '').trim();
  if (headerKey && safeEqual(headerKey, key)) return true;

  const token = cookieValue(request);
  const match = /^v2\.(\d+)\.(\d+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(token);
  if (!match) return false;
  const issued = Number(match[1]);
  const expires = Number(match[2]);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(issued) || !Number.isFinite(expires) || issued > now + 60 || expires <= now) return false;
  const payload = `v2.${issued}.${expires}.${match[3]}`;
  return safeEqual(match[4], signature(payload));
}

export function isAdminMutationRequest(request) {
  if (!isAdminRequest(request)) return false;
  const key = secret();
  const headerKey = String(request.headers.get('x-no11-admin-key') || '').trim();
  if (headerKey && key && safeEqual(headerKey, key)) return true;

  return hasValidMutationOrigin(request);
}

export function hasValidMutationOrigin(request) {
  const origin = String(request.headers.get('origin') || '').trim();
  if (!origin) return false;
  if (origin === 'https://no11pilates.com') return true;
  try {
    const originUrl = new URL(origin);
    const forwardedHost = String(request.headers.get('x-forwarded-host') || '').split(',')[0].trim();
    const requestHost = forwardedHost || String(request.headers.get('host') || '').trim();
    return Boolean(requestHost && originUrl.host === requestHost);
  } catch {
    return false;
  }
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
