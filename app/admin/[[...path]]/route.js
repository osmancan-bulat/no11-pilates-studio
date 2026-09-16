import { isAdminRequest } from '../../../lib/no11-admin-auth.js';

const ORIGIN = 'https://no11-pilates-studio-2eta1urgj-osmancanbulat197-7442s-projects.vercel.app';

function loginPage() {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>Yönetici Girişi | No.11 Pilates Studio</title></head><body><form id="login"><input name="username" autocomplete="username"><input name="password" type="password" autocomplete="current-password"><button>Giriş Yap</button><p id="error"></p></form><script>const form=document.getElementById('login'),error=document.getElementById('error');form.addEventListener('submit',async(e)=>{e.preventDefault();const d=new FormData(form);const r=await fetch('/api/no11-admin-login',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify({username:d.get('username'),password:d.get('password')})});if(r.ok)location.reload();else error.textContent='Kullanıcı adı veya şifre hatalı.'});</script></body></html>`;
}

async function proxy(request, context) {
  if (request.method === 'GET' && !isAdminRequest(request)) return new Response(loginPage(), { status: 200, headers: { 'content-type':'text/html; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','x-robots-tag':'noindex, nofollow' } });
  const incoming=new URL(request.url);const params=await context.params;const tail=Array.isArray(params?.path)?params.path.join('/'):'';const target=new URL(`${ORIGIN}/admin${tail?`/${tail}`:''}${incoming.search}`);
  const headers=new Headers(request.headers);headers.delete('host');headers.delete('content-length');const init={method:request.method,headers,redirect:'manual'};if(!['GET','HEAD'].includes(request.method))init.body=await request.arrayBuffer();
  const upstream=await fetch(target,init);const responseHeaders=new Headers(upstream.headers);['content-encoding','content-length','transfer-encoding','connection'].forEach(h=>responseHeaders.delete(h));
  if((upstream.headers.get('content-type')||'').includes('text/html')){
    let html=await upstream.text();
    html=html.replaceAll('href="/_next/',`href="${ORIGIN}/_next/`).replaceAll('src="/_next/',`src="${ORIGIN}/_next/`).replace(/\/no11-admin-exact-20\.js(?:\?[^"' ]*)?/g,`${incoming.origin}/no11-admin-exact-20.js?v=20260915-date-2`);
    html=html.replace('</head>',`<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate"><script>window.__NO11_EXACT_ADMIN__=true;localStorage.setItem('no11-admin-theme','light')</script><script id="n11-admin-exit-guard">document.addEventListener('click',function(event){var target=event.target.closest&&event.target.closest('.n11-side-logo,.n11-site-return,.n11-side-user');if(!target)return;event.preventDefault();event.stopImmediatePropagation();if(!target.classList.contains('n11-side-logo'))location.assign('/')},true)</script><script src="${incoming.origin}/no11-admin-live-sync.js?v=15" defer></script><script src="${incoming.origin}/no11-admin-fresh.js?v=14" defer></script><script src="${incoming.origin}/no11-admin-loader.js?v=20260916-push-4" defer></script><script src="${incoming.origin}/no11-admin-push.js?v=20260916-silent-sync-1" defer></script><script src="${incoming.origin}/no11-admin-push-deeplink.js?v=20260916-1" defer></script><script src="${incoming.origin}/no11-admin-notification-behavior.js?v=20260916-1" defer></script><script src="${incoming.origin}/no11-mobile-program-sync.js?v=2" defer></script></head>`);
    html=html.replace('</body>',`<button id="n11-push-enable" type="button" style="position:fixed!important;right:16px!important;bottom:16px!important;z-index:2147483646!important;display:block!important;visibility:visible!important;opacity:1!important;border:1px solid rgba(143,24,33,.25);border-radius:999px;padding:12px 17px;background:#fff;color:#85151e;box-shadow:0 8px 28px rgba(0,0,0,.18);font:600 13px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;cursor:pointer">Bildirimleri Aç</button></body>`);
    responseHeaders.set('cache-control','no-store, no-cache, must-revalidate, max-age=0');responseHeaders.set('pragma','no-cache');responseHeaders.set('expires','0');
    return new Response(html,{status:upstream.status,headers:responseHeaders});
  }
  return new Response(await upstream.arrayBuffer(),{status:upstream.status,headers:responseHeaders});
}
export const dynamic='force-dynamic';export const revalidate=0;export const GET=proxy;export const POST=proxy;export const PUT=proxy;export const PATCH=proxy;export const DELETE=proxy;export const HEAD=proxy;
