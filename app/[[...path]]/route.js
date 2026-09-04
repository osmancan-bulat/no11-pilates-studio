const ORIGIN = "https://no11-pilates-studio-aihbdj6zg-osmancanbulat197-7442s-projects.vercel.app";
const STYLE_ORIGIN = "https://no11-pilates-studio-rfj4dz9b5-osmancanbulat197-7442s-projects.vercel.app";

function deferHeroVideos(html) {
  return html.replace(
    /<video([^>]*\bhero-video--(?:desktop|mobile)\b[^>]*)>([\s\S]*?)<\/video>/gi,
    (_match, rawAttributes, rawContent) => {
      let attributes = rawAttributes
        .replace(/\sautoplay(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, "")
        .replace(/\spreload=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/\ssrc=("[^"]*"|'[^']*')/gi, " data-no11-src=$1");
      const content = rawContent.replace(/\ssrc=("[^"]*"|'[^']*')/gi, " data-no11-src=$1");
      attributes += ' preload="none"';
      return `<video${attributes}>${content}</video>`;
    },
  );
}

const desktopHeroScript = `<script id="no11-desktop-hero-swap">
(function(){
  var desktopVideoUrl='https://github.com/osmancan-bulat/no11-pilates-studio/releases/download/video-v1/no11-desktop-full-quality.mp4';
  var desktopQuery=window.matchMedia('(min-width: 901px)');
  function activeVideo(){return document.querySelector(window.matchMedia('(min-width: 901px)').matches?'.hero-video--desktop':'.hero-video--mobile')}
  function syncControl(){
    var control=document.querySelector('.no11-video-control'),video=activeVideo();if(!control||!video)return;
    if(video.paused){control.setAttribute('aria-label','Videoyu oynat');control.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.6v10.8c0 .7.8 1.1 1.4.7l8-5.4a.85.85 0 0 0 0-1.4l-8-5.4A.85.85 0 0 0 4 2.6Z"></path></svg>'}
    else{control.setAttribute('aria-label','Videoyu durdur');control.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3" height="12" rx="1"></rect><rect x="10" y="2" width="3" height="12" rx="1"></rect></svg>'}
  }
  function enhanceControls(){
    var hero=document.querySelector('.hero'),videos=document.querySelectorAll('.hero-video');if(!hero||!videos.length)return;
    videos.forEach(function(video){video.defaultPlaybackRate=.9;video.playbackRate=.9;if(!video.dataset.no11ControlEvents){video.dataset.no11ControlEvents='1';video.addEventListener('play',syncControl);video.addEventListener('pause',syncControl)}});
    if(!document.getElementById('no11-hero-video-controls-style')){
      var style=document.createElement('style');style.id='no11-hero-video-controls-style';
      style.textContent='.hero{position:relative!important}.no11-video-control{position:absolute!important;right:28px!important;bottom:28px!important;z-index:999!important;width:44px!important;height:44px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;border:1px solid rgba(255,255,255,.7)!important;border-radius:50%!important;background:rgba(24,20,18,.38)!important;color:#fff!important;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);cursor:pointer!important;pointer-events:auto!important;transition:background .2s ease,transform .2s ease,border-color .2s ease}.no11-video-control:hover{background:rgba(24,20,18,.55)!important;transform:scale(1.04)}.no11-video-control:focus-visible{outline:2px solid #fff;outline-offset:3px}.no11-video-control svg{width:15px;height:15px;fill:currentColor}@media(max-width:900px){.no11-video-control{right:18px!important;bottom:20px!important;width:42px!important;height:42px!important}}';document.head.appendChild(style);
    }
    if(!hero.querySelector('.no11-video-control')){
      var control=document.createElement('button');control.type='button';control.className='no11-video-control';
      control.addEventListener('click',function(){var video=activeVideo();if(!video)return;if(video.paused)video.play().catch(function(){});else video.pause()});hero.appendChild(control);
    }
    syncControl();
  }
  function unloadVideo(video){
    if(!video)return;
    video.pause();video.removeAttribute('src');video.querySelectorAll('source').forEach(function(source){source.removeAttribute('src')});
    video.autoplay=false;video.preload='none';video.load();video.dataset.no11Active='0';
  }
  function loadVideo(video,forcedUrl){
    if(!video||video.dataset.no11Active==='1')return;
    if(forcedUrl){video.querySelectorAll('source').forEach(function(source){source.remove()});video.src=forcedUrl}
    else if(video.dataset.no11Src){video.src=video.dataset.no11Src}
    else video.querySelectorAll('source[data-no11-src]').forEach(function(source){source.src=source.dataset.no11Src});
    video.muted=true;
    video.loop=true;
    video.autoplay=true;
    video.playsInline=true;
    video.preload='auto';
    video.defaultPlaybackRate=.9;
    video.playbackRate=.9;
    video.dataset.no11Active='1';
    video.load();
    var playPromise=video.play();
    if(playPromise && playPromise.catch) playPromise.catch(function(){});
  }
  function selectHeroVideo(){
    var desktop=document.querySelector('.hero-video--desktop'),mobile=document.querySelector('.hero-video--mobile');
    if(!desktop&&!mobile)return;
    if(desktopQuery.matches){
      unloadVideo(mobile);
      if(desktop){desktop.poster='/no11-desktop-poster.webp';desktop.style.setProperty('display','block','important');desktop.style.setProperty('visibility','visible','important');desktop.style.setProperty('opacity','1','important')}
      var desktopStill=document.querySelector('.hero-desktop-still');if(desktopStill)desktopStill.style.setProperty('display','none','important');
      loadVideo(desktop,desktopVideoUrl);
    }else{
      unloadVideo(desktop);loadVideo(mobile);
    }
    enhanceControls();syncControl();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',selectHeroVideo);
  else selectHeroVideo();
  window.addEventListener('resize',syncControl);
  if(desktopQuery.addEventListener)desktopQuery.addEventListener('change',selectHeroVideo);else desktopQuery.addListener(selectHeroVideo);
  window.addEventListener('pageshow',selectHeroVideo,{once:true});
})();
</script>`;

const mobileStorySpacing = `<style id="no11-mobile-story-spacing">
@media (max-width:900px){.story h2{margin-bottom:2.75rem!important}}
</style>`;

const adminPolish = `<style id="no11-admin-polish">
@media (min-width:761px){.appointment-card{border-radius:18px!important;padding:24px!important;border-color:#e6ded5!important;box-shadow:0 8px 30px rgba(49,40,34,.045)!important;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease!important}.appointment-card:hover{transform:translateY(-2px)!important;border-color:#d8c9bd!important;box-shadow:0 16px 40px rgba(49,40,34,.08)!important}}
.filters{padding:4px!important;border:1px solid #e5ddd5!important;border-radius:14px!important;background:#f7f3ef!important;gap:3px!important}.filters button{border:0!important;border-radius:10px!important;padding:10px 15px!important;color:#756a63!important;font-weight:600!important;transition:all .2s ease!important}.filters button.active{background:#292522!important;color:#fff!important;box-shadow:0 5px 13px rgba(41,37,34,.17)!important}.appointment-tools>label{border-radius:13px!important;border-color:#e3dbd3!important;box-shadow:0 4px 16px rgba(49,40,34,.035)!important}
.appointment-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;max-width:288px!important;width:288px!important}.appointment-actions a,.appointment-actions button{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;min-height:40px!important;padding:10px 12px!important;border-radius:11px!important;font-size:9px!important;font-weight:700!important;letter-spacing:.045em!important;white-space:nowrap!important;transition:transform .18s ease,box-shadow .18s ease,background .18s ease!important}.appointment-actions a:hover,.appointment-actions button:hover{transform:translateY(-1px)!important}.appointment-actions .whatsapp{color:#246344!important;background:#e7f2eb!important;border-color:#cee4d6!important}.appointment-actions .whatsapp:hover{background:#dcece2!important;box-shadow:0 6px 14px rgba(36,99,68,.12)!important}.appointment-actions a:not(.whatsapp){color:#554c46!important;background:#f8f5f2!important;border-color:#e5ddd6!important}.appointment-actions .approve{grid-column:1/-1!important;color:#fff!important;background:linear-gradient(135deg,#302b27,#171513)!important;border-color:#171513!important;box-shadow:0 7px 16px rgba(23,21,19,.16)!important}.appointment-actions .delete{grid-column:1/-1!important;color:#9a514b!important;background:#fff8f7!important;border-color:#ecd8d5!important}.appointment-actions .delete:hover{background:#faeeec!important}.appointment-actions b{font-size:13px!important;font-weight:400!important}
@media (max-width:1100px){.appointment-actions{width:100%!important;max-width:480px!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}.appointment-actions .approve,.appointment-actions .delete{grid-column:auto!important}}
@media (max-width:760px){.appointment-card{border-radius:16px!important;padding:18px!important;box-shadow:0 8px 25px rgba(49,40,34,.05)!important}.filters{overflow-x:auto!important;width:100%!important}.filters button{flex:1!important;min-width:max-content!important}.appointment-tools>label{width:100%!important;margin-top:10px!important}.appointment-actions{grid-template-columns:repeat(2,minmax(0,1fr))!important;max-width:none!important;width:100%!important;gap:8px!important;margin-top:4px!important}.appointment-actions .approve{grid-column:1/-1!important;grid-row:1!important;min-height:46px!important}.appointment-actions .whatsapp,.appointment-actions a:not(.whatsapp){grid-row:2!important}.appointment-actions .delete{grid-column:1/-1!important;grid-row:3!important;background:transparent!important;border-color:transparent!important;min-height:34px!important}}
.appointment-card{cursor:pointer!important;position:relative!important;padding-bottom:72px!important}.appointment-card .appointment-actions{cursor:default!important}
.no11-detail-trigger{position:absolute!important;right:24px!important;bottom:20px!important;z-index:3!important;display:flex!important;align-items:center!important;justify-content:center!important;min-width:142px!important;height:40px!important;border:1px solid #26221f!important;border-radius:11px!important;background:#26221f!important;color:#fff!important;padding:0 18px!important;text-align:center!important;font-size:9px!important;font-weight:700!important;letter-spacing:.11em!important;cursor:pointer!important;box-shadow:0 8px 18px rgba(38,34,31,.16)!important;transition:transform .18s ease,box-shadow .18s ease!important}.no11-detail-trigger:hover{transform:translateY(-2px)!important;box-shadow:0 12px 22px rgba(38,34,31,.22)!important}
.no11-detail-backdrop{position:fixed;inset:0;z-index:998;background:rgba(25,21,18,.36);backdrop-filter:blur(5px);opacity:0;pointer-events:none;transition:opacity .3s ease}.no11-detail-backdrop.is-open{opacity:1;pointer-events:auto}
.no11-detail-drawer{position:fixed;z-index:999;top:0;right:0;width:min(490px,94vw);height:100svh;background:#f8f5f1;box-shadow:-24px 0 70px rgba(30,24,20,.18);transform:translateX(102%);transition:transform .38s cubic-bezier(.22,1,.36,1);overflow:auto}.no11-detail-drawer.is-open{transform:none}
.no11-detail-top{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:24px 28px 18px;background:rgba(248,245,241,.92);backdrop-filter:blur(14px);border-bottom:1px solid #e7ded6}.no11-detail-top div{display:grid;gap:5px}.no11-detail-top span{font-size:8px;letter-spacing:.2em;color:#9a7a69;font-weight:700}.no11-detail-top strong{font:26px/1.1 Georgia,serif;color:#2d2926}.no11-detail-close{width:40px;height:40px;border:1px solid #ded4cb;border-radius:50%;background:#fff;color:#544b45;font-size:24px;font-weight:300;cursor:pointer}
.no11-detail-content{padding:26px 28px 36px}.no11-detail-content>.appointment-card{display:grid!important;grid-template-columns:1fr!important;gap:22px!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;transform:none!important;cursor:default!important}.no11-detail-content .appointment-card-head{display:flex!important;align-items:center!important;justify-content:space-between!important;padding-bottom:20px!important;border-bottom:1px solid #e4dad2!important}.no11-detail-content .appointment-person>div{width:54px!important;height:54px!important;font-size:17px!important}.no11-detail-content .appointment-person p strong{font:22px/1.2 Georgia,serif!important}.no11-detail-content .appointment-person a{font-size:12px!important}.no11-detail-content .appointment-card-body{display:grid!important;gap:22px!important}.no11-detail-content dl{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:10px!important}.no11-detail-content dl div{padding:17px 14px!important;border-radius:13px!important;background:#fff!important;border:1px solid #e7dfd8!important}.no11-detail-content dd{font-size:14px!important;margin-top:4px!important}.no11-detail-content .appointment-note{display:grid!important;padding:18px!important;border-radius:13px!important;background:#efe8e1!important;font-size:14px!important}.no11-detail-content .appointment-actions{display:grid!important;width:100%!important;max-width:none!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}.no11-detail-content .appointment-actions .approve,.no11-detail-content .appointment-actions .delete{grid-column:1/-1!important}.no11-detail-content .no11-detail-trigger{display:none!important}
body.no11-detail-open{overflow:hidden}
@media(max-width:600px){.appointment-card{padding-bottom:76px!important}.no11-detail-trigger{left:18px!important;right:18px!important;bottom:17px!important;width:auto!important}.no11-detail-drawer{width:100vw}.no11-detail-top{padding:20px}.no11-detail-content{padding:22px 18px 32px}.no11-detail-content dl{grid-template-columns:1fr!important}.no11-detail-content dl div{display:flex!important;justify-content:space-between!important;align-items:center!important}.no11-detail-content .appointment-card-head{align-items:flex-start!important;gap:12px!important}.no11-detail-content .appointment-status{justify-items:end!important}}
</style>`;

const adminScript = `(function(){
  var selectedCard=null;
  function ensureDrawer(){
    if(document.querySelector('.no11-detail-drawer')) return;
    var backdrop=document.createElement('div');backdrop.className='no11-detail-backdrop';
    var drawer=document.createElement('aside');drawer.className='no11-detail-drawer';drawer.setAttribute('aria-hidden','true');
    drawer.innerHTML='<div class="no11-detail-top"><div><span>RANDEVU DETAYI</span><strong>Öğrenci bilgileri</strong></div><button class="no11-detail-close" aria-label="Detay panelini kapat">×</button></div><div class="no11-detail-content"></div>';
    document.body.appendChild(backdrop);document.body.appendChild(drawer);
    backdrop.addEventListener('click',closeDrawer);drawer.querySelector('.no11-detail-close').addEventListener('click',closeDrawer);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDrawer()});
  }
  function closeDrawer(){var d=document.querySelector('.no11-detail-drawer'),b=document.querySelector('.no11-detail-backdrop');if(d)d.classList.remove('is-open');if(b)b.classList.remove('is-open');document.body.classList.remove('no11-detail-open');if(d)d.setAttribute('aria-hidden','true')}
  function openDrawer(card){
    ensureDrawer();selectedCard=card;var content=document.querySelector('.no11-detail-content');var clone=card.cloneNode(true);content.innerHTML='';content.appendChild(clone);
    var approve=clone.querySelector('.approve'),del=clone.querySelector('.delete');
    if(approve)approve.addEventListener('click',function(){var original=selectedCard&&selectedCard.querySelector('.approve');if(original)original.click();setTimeout(closeDrawer,120)});
    if(del)del.addEventListener('click',function(){var original=selectedCard&&selectedCard.querySelector('.delete');if(original)original.click();setTimeout(closeDrawer,120)});
    var d=document.querySelector('.no11-detail-drawer'),b=document.querySelector('.no11-detail-backdrop');d.classList.add('is-open');b.classList.add('is-open');d.setAttribute('aria-hidden','false');document.body.classList.add('no11-detail-open');
  }
  function enhance(){
    document.querySelectorAll('.appointment-list .appointment-card').forEach(function(card){
      if(card.dataset.detailReady)return;card.dataset.detailReady='1';
      var trigger=document.createElement('button');trigger.className='no11-detail-trigger';trigger.textContent='DETAYLARI GÖR  →';trigger.addEventListener('click',function(e){e.stopPropagation();openDrawer(card)});card.appendChild(trigger);
      card.addEventListener('click',function(e){if(e.target.closest('a,button'))return;openDrawer(card)});
    });
  }
  function start(){ensureDrawer();enhance();new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});setInterval(enhance,700)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
`;

async function proxy(request, context) {
  const parts = (await context.params).path || [];
  const path = parts.join("/");
  const incoming = new URL(request.url);
  let upstreamOrigin = ORIGIN;
  let upstreamPath = path;
  if (path.startsWith("__old1/")) upstreamPath = path.slice(7);
  if (path.startsWith("__old2/")) { upstreamOrigin = STYLE_ORIGIN; upstreamPath = path.slice(7); }
  const target = new URL(`/${upstreamPath}${incoming.search}`, upstreamOrigin);
  if (path === "no11-admin-detail.js") return new Response(adminScript, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-store" } });
  const headers = new Headers(request.headers);
  headers.set("host", target.host);
  headers.delete("content-length");
  const init = { method: request.method, headers, redirect: "manual" };
  if (!["GET", "HEAD"].includes(request.method)) init.body = await request.arrayBuffer();
  const upstream = await fetch(target, init);
  const responseHeaders = new Headers(upstream.headers);
  ["content-encoding","content-length","transfer-encoding","connection"].forEach(h => responseHeaders.delete(h));
  if ((upstream.headers.get("content-type") || "").includes("text/html")) {
    let html = await upstream.text();
    html = html
      .split(`${ORIGIN}/_next/`).join(`${incoming.origin}/__old1/_next/`)
      .split(`${STYLE_ORIGIN}/_next/`).join(`${incoming.origin}/__old2/_next/`);
    if (path === "") {
      html = deferHeroVideos(html);
      html = html
      .replace(/(<video class="hero-video hero-video--desktop"[^>]* poster=")[^"]*(")/, `$1${incoming.origin}/no11-desktop-poster.webp$2`)
      .replace("</head>", `<link rel="preload" href="${incoming.origin}/no11-desktop-poster.webp" as="image">${mobileStorySpacing}<link rel="stylesheet" href="${incoming.origin}/no11-team-live.css?v=4"><link rel="stylesheet" href="${incoming.origin}/no11-studio-gallery.css?v=1"><script src="${incoming.origin}/no11-team-live.js?v=3" defer></script><script src="${incoming.origin}/no11-studio-gallery.js?v=1" defer></script></head>`)
      .replace("</body>", `${desktopHeroScript}</body>`);
    }
    if (path === "admin" || path.startsWith("admin/")) {
      // The premium admin owns the page. Prevent the proxied Next.js client from
      // hydrating the same DOM and repeatedly fighting the admin renderer.
      html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      html = html.replace(
        "</head>",
        `<style id="n11-admin-boot">body>*{visibility:hidden!important}body:before{content:'No.11';visibility:visible;position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#f7f6f8;color:#2b212e;font:52px Georgia,serif;letter-spacing:-.04em}</style><link rel="stylesheet" href="${incoming.origin}/no11-admin-premium.css?v=13"><link rel="stylesheet" href="${incoming.origin}/no11-admin-calendar-fix.css?v=13"><script src="${incoming.origin}/no11-admin-premium.js?v=13" defer></script></head>`,
      );
    }
    return new Response(html, { status: upstream.status, headers: responseHeaders });
  }
  return new Response(await upstream.arrayBuffer(), { status: upstream.status, headers: responseHeaders });
}

export const dynamic = "force-dynamic";
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
