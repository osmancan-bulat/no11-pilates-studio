const APPOINTMENTS_ORIGIN =
  'https://no11-pilates-studio-2eta1urgj-osmancanbulat197-7442s-projects.vercel.app';

async function proxy(request) {
  const incoming = new URL(request.url);
  const target = new URL('/api/no11-appointments', APPOINTMENTS_ORIGIN);
  target.search = incoming.search;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const init = { method: request.method, headers, cache: 'no-store' };
  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const responseHeaders = new Headers({
    'content-type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const dynamic = 'force-dynamic';
export const GET = proxy;
export const PUT = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
