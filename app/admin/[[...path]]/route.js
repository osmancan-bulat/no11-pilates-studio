import { isAdminRequest } from '../../../lib/no11-admin-auth.js';

const ORIGIN = 'https://no11-pilates-studio-2eta1urgj-osmancanbulat197-7442s-projects.vercel.app';

function loginPage() {
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="robots" content="noindex,nofollow">
  <title>Yönetici Girişi | No.11 Pilates Studio</title>
  <style>
    :root{color-scheme:light;--ink:#292624;--muted:#817971;--line:rgba(73,62,54,.19);--accent:#8f1821;--ivory:rgba(249,245,239,.94)}
    *{box-sizing:border-box}
    html,body{margin:0;width:100%;height:100%;overflow:hidden}
    body{background:#181513;color:var(--ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    button,input{font:inherit}
    .page{position:relative;display:flex;align-items:center;justify-content:flex-end;width:100%;min-height:100svh;padding:clamp(24px,4vw,70px);overflow:hidden;background:linear-gradient(90deg,rgba(21,17,14,.28),rgba(21,17,14,.04) 56%,rgba(21,17,14,.16)),url('/no11-studio-main.jpeg') center/cover no-repeat}
    .brand{position:absolute;top:clamp(40px,7vh,82px);left:clamp(36px,8vw,146px);z-index:2;display:flex;width:max-content;flex-direction:column;align-items:center;color:#fff;text-decoration:none;text-shadow:0 2px 18px rgba(0,0,0,.25)}
    .brand strong{font:400 clamp(48px,5vw,70px)/.95 Georgia,serif;letter-spacing:-.055em}
    .brand span{margin-top:12px;font-size:clamp(8px,.75vw,11px);font-weight:600;letter-spacing:.38em}
    .panel{width:min(100%,468px);padding:48px 40px 36px;border:1px solid rgba(255,255,255,.72);border-radius:24px;background:var(--ivory);box-shadow:0 25px 80px rgba(30,20,14,.26);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}
    .eyebrow{margin:0 0 18px;text-align:center;color:#806e62;font-size:10px;font-weight:700;letter-spacing:.34em}
    h1{margin:0;text-align:center;font:400 42px/1.08 Georgia,serif;letter-spacing:-.035em}
    .rule{width:42px;height:1px;margin:24px auto 32px;background:#bda892}
    form{display:grid;gap:13px}
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    .field{position:relative}
    .field-icon{position:absolute;top:50%;left:17px;width:21px;height:21px;transform:translateY(-50%);fill:none;stroke:#393633;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
    input{width:100%;height:57px;padding:0 52px;border:1px solid var(--line);border-radius:11px;background:rgba(255,255,255,.78);color:var(--ink);font-size:15px;outline:0;transition:border-color .2s,box-shadow .2s,background .2s}
    input::placeholder{color:#8b8580;opacity:1}
    input:focus{border-color:rgba(143,24,33,.65);background:#fff;box-shadow:0 0 0 3px rgba(143,24,33,.08)}
    .password input{padding-right:57px}
    .peek{position:absolute;top:50%;right:8px;display:grid;width:44px;height:44px;padding:0;place-items:center;transform:translateY(-50%);border:0;border-radius:9px;background:transparent;color:#34312f;cursor:pointer}
    .peek:hover,.peek:focus-visible{background:rgba(143,24,33,.06);outline:0}
    .peek svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .error{min-height:17px;margin-top:-1px;color:#9c3034;font-size:11px;text-align:center}
    .submit{height:58px;border:0;border-radius:11px;background:linear-gradient(105deg,#85151e,#981e27);box-shadow:0 10px 24px rgba(116,15,23,.17);color:#fff;cursor:pointer;font:400 17px Georgia,serif;transition:transform .2s,filter .2s}
    .submit:hover{filter:brightness(.94);transform:translateY(-1px)}
    .submit:disabled{opacity:.65;cursor:wait;transform:none}
    .back{display:block;width:max-content;margin:25px auto 0;color:#77716c;font-size:12px;text-decoration:none}
    .back:hover{color:#302d2a}
    @media(max-width:820px){
      .page{align-items:center;justify-content:center;min-height:var(--viewport-height,100svh);padding:max(20px,env(safe-area-inset-top)) 20px max(20px,env(safe-area-inset-bottom));background-position:38% center;transition:min-height .2s}
      .page:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(24,19,16,.18),rgba(24,19,16,.03) 34%,rgba(24,19,16,.34));pointer-events:none}
      .brand{top:max(28px,env(safe-area-inset-top));left:50%;z-index:2;transform:translateX(-50%)}
      .brand strong{font-size:48px}.brand span{margin-top:8px;font-size:8px}
      .panel{position:relative;z-index:2;width:100%;max-width:430px;margin-top:96px;padding:31px 22px 25px;border-radius:22px;transition:margin .2s,padding .2s,transform .2s}
      .eyebrow{margin-bottom:13px;font-size:9px}h1{font-size:36px}.rule{margin:17px auto 23px}
      input{height:55px}.submit{height:56px}.back{margin-top:20px}
      body.keyboard-open .page{align-items:flex-start;padding-top:max(8px,env(safe-area-inset-top))}
      body.keyboard-open .brand{top:max(8px,env(safe-area-inset-top))}
      body.keyboard-open .brand strong{font-size:30px}
      body.keyboard-open .brand span{display:none}
      body.keyboard-open .panel{margin-top:47px;padding:18px 18px 15px;border-radius:18px}
      body.keyboard-open .eyebrow{display:none}
      body.keyboard-open h1{font-size:27px}
      body.keyboard-open .rule{margin:10px auto 13px}
      body.keyboard-open form{gap:8px}
      body.keyboard-open input{height:49px}
      body.keyboard-open .submit{height:49px}
      body.keyboard-open .error{min-height:12px;font-size:10px}
      body.keyboard-open .back{display:none}
    }
    @media(max-width:380px){.panel{padding-left:17px;padding-right:17px}h1{font-size:33px}}
  </style>
</head>
<body>
  <main class="page">
    <a class="brand" href="/" aria-label="Ana sayfaya dön"><strong>No.11</strong><span>PILATES STUDIO</span></a>
    <section class="panel">
      <p class="eyebrow">YÖNETİCİ PANELİ</p>
      <h1>Yönetici Girişi</h1>
      <div class="rule" aria-hidden="true"></div>
      <form id="login-form">
        <label class="sr-only" for="username">Kullanıcı adı</label>
        <div class="field">
          <svg class="field-icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2.2c0-3.5 2.8-6.3 6.3-6.3h1.4c3.5 0 6.3 2.8 6.3 6.3V21"/></svg>
          <input id="username" name="username" placeholder="Kullanıcı adı" autocomplete="username" autocapitalize="none" required>
        </div>
        <label class="sr-only" for="password">Şifre</label>
        <div class="field password">
          <svg class="field-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 15v2"/></svg>
          <input id="password" name="password" type="password" placeholder="Şifre" autocomplete="current-password" required>
          <button class="peek" type="button" aria-label="Şifreyi göster"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2.5"/></svg></button>
        </div>
        <div class="error" id="error" role="alert"></div>
        <button class="submit" type="submit">Giriş Yap</button>
      </form>
      <a class="back" href="/">←&nbsp;&nbsp; Ana siteye dön</a>
    </section>
  </main>
  <script>
    const form=document.getElementById('login-form'),error=document.getElementById('error'),password=document.getElementById('password'),peek=document.querySelector('.peek');
    peek.addEventListener('click',()=>{const visible=password.type==='text';password.type=visible?'password':'text';peek.setAttribute('aria-label',visible?'Şifreyi göster':'Şifreyi gizle')});
    const fullViewportHeight=window.innerHeight;
    const syncViewport=()=>{const viewport=window.visualViewport;const height=viewport?viewport.height:window.innerHeight;document.documentElement.style.setProperty('--viewport-height',height+'px');document.body.classList.toggle('keyboard-open',window.innerWidth<=820&&height<Math.max(fullViewportHeight,window.innerHeight)-120)};
    syncViewport();window.addEventListener('resize',syncViewport);if(window.visualViewport){window.visualViewport.addEventListener('resize',syncViewport);window.visualViewport.addEventListener('scroll',syncViewport)}
    form.addEventListener('submit',async(event)=>{event.preventDefault();error.textContent='';const button=form.querySelector('.submit');button.disabled=true;button.textContent='Giriş yapılıyor…';const data=new FormData(form);try{const response=await fetch('/api/no11-admin-login',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify({username:data.get('username'),password:data.get('password')})});if(!response.ok){error.textContent=response.status===401?'Kullanıcı adı veya şifre hatalı.':'Giriş sırasında bir sorun oluştu.';return}location.reload()}catch{error.textContent='Bağlantı kurulamadı. Lütfen tekrar deneyin.'}finally{button.disabled=false;button.textContent='Giriş Yap'}});
  </script>
</body>
</html>`;
}

const mobileSafetyFix = `<style id="n11-mobile-safety-fix">
@media(max-width:760px){
  .n11-v4,.n11-v4 .n11-main-content{max-width:100vw!important;overflow-x:hidden!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout){padding:18px 14px 42px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout)>.n11-page-top{display:grid!important;grid-template-columns:44px minmax(0,1fr) 44px!important;grid-template-rows:auto auto!important;gap:10px 12px!important;align-items:start!important;margin:0 0 18px!important;min-height:0!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout)>.n11-page-top>.n11-mobile-menu{grid-column:1!important;grid-row:1!important;width:44px!important;height:44px!important;margin:0!important;display:grid!important;place-items:center!important;border-radius:11px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout)>.n11-page-top>div:first-of-type{grid-column:2!important;grid-row:1!important;min-width:0!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout)>.n11-page-top h1{font-size:39px!important;line-height:1!important;white-space:nowrap!important;margin:0!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout)>.n11-page-top p{margin:9px 0 0!important;font-size:9px!important;letter-spacing:.22em!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout)>.n11-page-top>.n11-page-actions{display:contents!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout)>.n11-page-top .n11-theme-wrap{grid-column:3!important;grid-row:1!important;width:44px!important;height:44px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout)>.n11-page-top .n11-theme{width:44px!important;height:44px!important;border-radius:11px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-search{grid-column:1/3!important;grid-row:2!important;width:100%!important;height:46px!important;min-width:0!important;box-sizing:border-box!important;border-radius:12px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-date-field{grid-column:3!important;grid-row:2!important;width:44px!important;height:46px!important;min-width:44px!important;padding:0!important;margin:0!important;display:grid!important;place-items:center!important;border-radius:12px!important;overflow:hidden!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-date-field>span{display:none!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-date-search{width:44px!important;height:44px!important;min-width:44px!important;padding:7px!important;border:0!important;background:transparent!important;color:transparent!important;font-size:0!important;box-sizing:border-box!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appointments-layout{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:14px!important;width:100%!important;min-width:0!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appointments{order:2!important;width:100%!important;min-width:0!important;padding:14px!important;box-sizing:border-box!important;border-radius:16px!important;overflow:hidden!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-summary{order:1!important;width:100%!important;min-width:0!important;min-height:0!important;padding:17px 12px 12px!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:0!important;border-radius:16px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-summary>h3{grid-column:1/-1!important;margin:0 0 13px!important;padding:0 6px 12px!important;border-bottom:1px solid var(--n11-line)!important;font-size:10px!important;letter-spacing:.18em!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-summary>div{min-width:0!important;padding:10px 5px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:6px!important;text-align:center!important;border:0!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-summary>div+div{border-left:1px solid var(--n11-line)!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-summary i{width:38px!important;height:38px!important;display:grid!important;place-items:center!important;margin:0 auto!important;border-radius:50%!important;font-size:16px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-summary span{display:block!important;font-size:12px!important;line-height:1.2!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-summary b{display:block!important;margin:4px 0 1px!important;font:25px/1 Georgia,serif!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-summary small{display:block!important;font-size:10px!important;line-height:1.2!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-filter{display:flex!important;gap:7px!important;overflow-x:auto!important;padding:0 0 13px!important;margin:0!important;-webkit-overflow-scrolling:touch;scrollbar-width:none!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-filter::-webkit-scrollbar{display:none!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-filter button{flex:0 0 auto!important;min-width:92px!important;height:42px!important;padding:0 13px!important;white-space:nowrap!important;border-radius:10px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-list{display:grid!important;gap:10px!important;width:100%!important;min-width:0!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row{display:grid!important;grid-template-columns:8px 58px minmax(0,1fr) auto!important;grid-template-rows:auto auto auto auto!important;gap:7px 9px!important;align-items:center!important;width:100%!important;min-width:0!important;min-height:0!important;padding:15px 8px!important;box-sizing:border-box!important;border:1px solid var(--n11-line)!important;border-radius:14px!important;background:var(--n11-card)!important;overflow:hidden!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row>.n11-dot{grid-column:1!important;grid-row:1/5!important;align-self:stretch!important;margin:auto!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row>time{grid-column:2!important;grid-row:1!important;font-size:16px!important;white-space:nowrap!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row>b{grid-column:3!important;grid-row:1!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font:17px/1.2 Georgia,serif!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row>.n11-status{grid-column:4!important;grid-row:1!important;justify-self:end!important;font-size:10px!important;padding:6px 8px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-service{grid-column:3/5!important;grid-row:2!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:12px!important;color:var(--n11-muted)!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-note-icon{grid-column:2!important;grid-row:2!important;justify-self:start!important;font-size:16px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row button[data-detail]{grid-column:2/4!important;grid-row:3!important;width:100%!important;height:40px!important;border-radius:10px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row .n11-approve{grid-column:4!important;grid-row:3!important;height:40px!important;min-width:82px!important;border-radius:10px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row button.danger{grid-column:2/4!important;grid-row:4!important;width:100%!important;height:38px!important;border-radius:10px!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row .n11-whatsapp{grid-column:4!important;grid-row:4!important;width:100%!important;height:38px!important;display:grid!important;place-items:center!important;border-radius:10px!important;text-decoration:none!important}
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row:not(:has(.n11-approve)) .n11-whatsapp{grid-column:2/5!important;grid-row:3!important}
}
</style>`;

const calendarThemeGuard = `<script id="n11-calendar-theme-guard">
(function(){
  var KEY='no11-admin-theme',savedTheme=null,savedDark=null;
  function isCalendarTarget(target){return !!(target&&target.closest&&target.closest('.n11-calendar,.n11-date-field,.n11-date-switch'))}
  function remember(){var main=document.querySelector('main.n11-v4');savedTheme=localStorage.getItem(KEY);savedDark=main?main.classList.contains('n11-dark'):null}
  function restore(){var main=document.querySelector('main.n11-v4');if(savedTheme===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,savedTheme);if(main&&savedDark!==null)main.classList.toggle('n11-dark',savedDark)}
  document.addEventListener('pointerdown',function(e){if(isCalendarTarget(e.target))remember()},true);
  document.addEventListener('click',function(e){if(isCalendarTarget(e.target))setTimeout(restore,0)},true);
  document.addEventListener('change',function(e){if(isCalendarTarget(e.target))setTimeout(restore,0)},true);
})();
</script>`;

async function proxy(request, context) {
  if (request.method === 'GET' && !isAdminRequest(request)) {
    return new Response(loginPage(), {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store, no-cache, must-revalidate',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  }

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
      .replaceAll('href="/_next/', `href="${ORIGIN}/_next/`)
      .replaceAll('src="/_next/', `src="${ORIGIN}/_next/`)
      .replaceAll('href="/"', 'href="/api/no11-admin-logout"');

    html = html.replace(
      '</head>',
      `<script id="n11-admin-exit-guard">document.addEventListener('click',function(event){var link=event.target.closest&&event.target.closest('a.n11-site-return,a.n11-side-logo');if(!link)return;event.preventDefault();event.stopImmediatePropagation();location.assign('/api/no11-admin-logout')},true)</script><script src="${incoming.origin}/no11-admin-live-sync.js?v=15" defer></script><script src="${incoming.origin}/no11-admin-fresh.js?v=9" defer></script><script src="${incoming.origin}/no11-admin-loader.js?v=20260910-7" defer></script><script src="${incoming.origin}/no11-mobile-program-sync.js?v=2" defer></script></head>`,
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
