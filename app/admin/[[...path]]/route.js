const ORIGIN = 'https://no11-pilates-studio-2eta1urgj-osmancanbulat197-7442s-projects.vercel.app';

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
  .n11-v4 .n11-main-content:has(.n11-appointments-layout) .n11-appt-row .n11-dash{display:none!important}
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
      .replaceAll('src="/_next/', `src="${ORIGIN}/_next/`);

    html = html.replace(
      '</head>',
      `<script src="${incoming.origin}/no11-admin-live-sync.js?v=13" defer></script><script src="${incoming.origin}/no11-admin-fresh.js?v=10" defer></script></head>`,
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
