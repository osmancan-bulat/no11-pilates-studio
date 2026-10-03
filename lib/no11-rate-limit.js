import crypto from 'node:crypto';

function firstAddress(value) {
  return String(value || '').split(',')[0].trim();
}

function platformAddress(request) {
  if (process.env.VERCEL) {
    return {
      address: firstAddress(request.headers.get('x-vercel-forwarded-for')),
      platform: 'vercel',
    };
  }

  if (process.env.NETLIFY) {
    return {
      address: firstAddress(request.headers.get('x-nf-client-connection-ip')),
      platform: 'netlify',
    };
  }

  return { address: '', platform: 'unknown' };
}

export function rateLimitIdentity(request, scope) {
  const { address, platform } = platformAddress(request);
  const secret = String(process.env.NO11_ADMIN_API_KEY || '').trim();
  const reliable = Boolean(address && secret);
  const source = reliable
    ? address
    : `unresolved:${platform}:${request.headers.get('host') || 'unknown'}`;
  const key = secret
    ? crypto.createHmac('sha256', secret).update(`${scope}:${source}`).digest('hex')
    : crypto.createHash('sha256').update(`${scope}:${source}`).digest('hex');

  return { key: key.slice(0, 48), platform, reliable };
}
