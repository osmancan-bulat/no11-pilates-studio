const ORIGIN = 'https://no11-pilates-studio-aihbdj6zg-osmancanbulat197-7442s-projects.vercel.app';
const STYLE_ORIGIN = 'https://no11-pilates-studio-rfj4dz9b5-osmancanbulat197-7442s-projects.vercel.app';

async function proxy(request, context) {
  const incoming = new URL(request.url);
  const params = await context.params;
  const tail = Array.isArray(params?.path) ? params.path.join('/') : '';
  const target = new URL(`${ORIGIN}/admin${tail ? `/${tail}` : ''}${incoming.search}`);

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');

  const init = { method: request.method, headers, redirect: 'manual' };
  if (!['GET', 'HEAD'].includes(request.method)) init.body = await request.arrayBuffer();

  const upstream = await fetch(target, init);
  const responseHeaders = new Headers(upstream.headers);
  ['content-encoding', 'content-length', 'transfer-encoding', 'connection'].forEach((h) => responseHeaders.delete(h));

  if ((upstream.headers.get('content-type') || '').includes('text/html')) {
    let html = await upstream.text();
    html = html
      .split(`${ORIGIN}/_next/`).join(`${incoming.origin}/__old1/_next/`)
      .split(`${STYLE_ORIGIN}/_next/`).join(`${incoming.origin}/__old2/_next/`);

    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(
      '</head>',
      `<style id="n11-admin-boot">body>*{visibility:hidden!important}body:before{content:'No.11';visibility:visible;position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#f7f6f8;color:#2b212e;font:52px Georgia,serif;letter-spacing:-.04em}</style><link rel="stylesheet" href="${incoming.origin}/no11-admin-premium.css?v=21"><link rel="stylesheet" href="${incoming.origin}/no11-admin-calendar-fix.css?v=21"><script src="${incoming.origin}/no11-admin-firebase.js?v=1" defer></script></head>`,
    );
    responseHeaders.set('cache-control', 'no-store, no-cache, must-revalidate');
    return new Response(html, { status: upstream.status, headers: responseHeaders });
  }

  return new Response(await upstream.arrayBuffer(), { status: upstream.status, headers: responseHeaders });
}

export const dynamic = 'force-dynamic';
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
