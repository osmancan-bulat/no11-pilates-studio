import { isAdminRequest } from '../../../lib/no11-admin-auth.js';

const ORIGIN = 'https://no11-pilates-studio-2eta1urgj-osmancanbulat197-7442s-projects.vercel.app';

function loginPage() {
  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>Yönetici Girişi | No.11 Pilates Studio</title><style>:root{color-scheme:light;--ink:#292624;--muted:#817971;--line:rgba(73,62,54,.19);--accent:#8f1821;--ivory:rgba(249,245,239,.94)}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}body{background:#181513;color:var(--ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input{font:inherit}.page{position:relative;display:flex;align-items:center;justify-content:flex-end;width:100%;min-height:100svh;padding:clamp(24px,4vw,70px);overflow:hidden;background:linear-gradient(90deg,rgba(21,17,14,.28),rgba(21,17,14,.04) 56%,rgba(21,17,14,.16)),url('/no11-studio-main.jpeg') center/cover no-repeat}.brand{position:absolute;top:clamp(40px,7vh,82px);left:clamp(36px,8vw,146px);z-index:2;display:flex;width:max-content;flex-direction:column;align-items:center;color:#fff;text-decoration:none}.brand strong{font:400 clamp(48px,5vw,70px)/.95 Georgia,serif}.brand span{margin-top:12px;font-size:10px;font-weight:600;letter-spacing:.38em}.panel{width:min(100%,468px);padding:48px 40px 36px;border:1px solid rgba(255,255,255,.72);border-radius:24px;background:var(--ivory);box-shadow:0 25px 80px rgba(30,20,14,.26);backdrop-filter:blur(22px)}h1{margin:0;text-align:center;font:400 42px/1.08 Georgia,serif}.eyebrow{text-align:center;color:#806e62;font-size:10px;font-weight:700;letter-spacing:.34em}.rule{width:42px;height:1px;margin:24px auto 32px;background:#bda892}form{display:grid;gap:13px}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden}.field{position:relative}input{width:100%;height:57px;padding:0 17px;border:1px solid var(--line);border-radius:11px;background:rgba(255,255,255,.78);font-size:15px}.submit{height:58px;border:0;border-radius:11px;background:#8f1821;color:#fff;cursor:pointer}.back{display:block;width:max-content;margin:25px auto 0;color:#77716c;font-size:12px;text-decoration:none}.error{min-height:17px;color:#9c3034;font-size:11px;text-align:center}@media(max-width:820px){.page{justify-content:center;padding:20px}.brand{top:28px;left:50%;transform:translateX(-50%)}.panel{width:100%;max-width:430px;margin-top:96px;padding:31px 22px 25px}}</style></head><body><main class="page"><a class="brand" href="/"><strong>No.11</strong><span>PILATES STUDIO</span></a><section class="panel"><p class="eyebrow">YÖNETİCİ PANELİ</p><h1>Yönetici Girişi</h1><div class="rule"></div><form id="login-form"><label class="sr-only" for="username">Kullanıcı adı</label><div class="field"><input id="username" name="username" placeholder="Kullanıcı adı" autocomplete="username" required></div><label class="sr-only" for="password">Şifre</label><div class="field"><input id="password" name="password" type="password" placeholder="Şifre" autocomplete="current-password" required></div><div class="error" id="error"></div><button class="submit" type="submit">Giriş Yap</button></form><a class="back" href="/">← Ana siteye dön</a></section></main><script>const form=document.getElementById('login-form'),error=document.getElementById('error');form.addEventListener('submit',async(e)=>{e.preventDefault();error.textContent='';const data=new FormData(form);const r=await fetch('/api/no11-admin-login',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify({username:data.get('username'),password:data.get('password')})});if(r.ok)location.reload();else error.textContent=r.status===401?'Kullanıcı adı veya şifre hatalı.':'Giriş sırasında bir sorun oluştu.'});</script></body></html>`;
}

async function proxy(request, context) {
  if (request.method === 'GET' && !isAdminRequest(request)) {
    return new Response(loginPage(), { status: 200, headers: { 'content-type':'text/html; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','x-robots-tag':'noindex, nofollow' } });
  }

  const incoming = new URL(request.url);
  const params = await context.params;
  const tail = Array.isArray(params?.path) ? params.path.join('/') : '';
  const target = new URL(`${ORIGIN}/admin${tail ? `/${tail}` : ''}${incoming.search}`);
  const headers = new Headers(request.headers);
  headers.delete('host'); headers.delete('content-length');
  const init = { method: request.method, headers, redirect: 'manual' };
  if (!['GET','HEAD'].includes(request.method)) init.body = await request.arrayBuffer();
  const upstream = await fetch(target, init);
  const responseHeaders = new Headers(upstream.headers);
  ['content-encoding','content-length','transfer-encoding','connection'].forEach(h=>responseHeaders.delete(h));

  if ((upstream.headers.get('content-type') || '').includes('text/html')) {
    let html = await upstream.text();
    // Desktop exact-admin owns its UI. Do not execute the proxied build's Next
    // runtime there: it was still receiving clicks and mutating the old theme.
    // Mobile keeps the upstream runtime unchanged.
    html = html.replace('</head>', `<script>window.__NO11_EXACT_ADMIN__=true;if(matchMedia('(min-width: 768px)').matches){document.querySelectorAll('script[src*="/_next/"]').forEach(function(s){s.type='application/no11-disabled'})}</script></head>`);
    html = html
      .replaceAll('href="/_next/', `href="${ORIGIN}/_next/`)
      .replaceAll('src="/_next/', `src="${ORIGIN}/_next/`)
      .replaceAll('/no11-admin-firebase.js?v=2', '/no11-admin-firebase.js?v=3')
      .replaceAll('href="/"', 'href="/api/no11-admin-logout"');
    html = html.replace('</head>', `<script id="n11-admin-exit-guard">document.addEventListener('click',function(event){var link=event.target.closest&&event.target.closest('a.n11-site-return,a.n11-side-logo');if(!link)return;event.preventDefault();event.stopImmediatePropagation();location.assign('/api/no11-admin-logout')},true)</script><script src="${incoming.origin}/no11-admin-live-sync.js?v=15" defer></script><script src="${incoming.origin}/no11-admin-fresh.js?v=9" defer></script><script src="${incoming.origin}/no11-admin-loader.js?v=20260915-8" defer></script><script src="${incoming.origin}/no11-mobile-program-sync.js?v=2" defer></script></head>`);
    responseHeaders.set('cache-control','no-store, no-cache, must-revalidate');
    return new Response(html,{status:upstream.status,headers:responseHeaders});
  }
  return new Response(await upstream.arrayBuffer(),{status:upstream.status,headers:responseHeaders});
}

export const dynamic='force-dynamic';
export const GET=proxy; export const POST=proxy; export const PUT=proxy; export const PATCH=proxy; export const DELETE=proxy; export const HEAD=proxy;
