const ORIGIN = "https://no11-pilates-studio-ro9kcm7fd-osmancanbulat197-7442s-projects.vercel.app";
const STYLE_ORIGIN = "https://no11-pilates-studio-ro9kcm7fd-osmancanbulat197-7442s-projects.vercel.app";
const ASSET_ORIGIN = "https://no11-pilates-studio-bgda5k3cp-osmancanbulat197-7442s-projects.vercel.app";

function deferHeroVideos(html) {
  return html.replace(
    /<video([^>]*\bhero-video--(?:desktop|mobile)\b[^>]*)>([\s\S]*?)<\/video>/gi,
    (_match, rawAttributes, rawContent) => {
      let attributes = rawAttributes
        .replace(/\sautoplay(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, "")
        .replace(/\scontrols(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, "")
        .replace(/\scontrolslist=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/\spreload=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/\ssrc=("[^"]*"|'[^']*')/gi, " data-no11-src=$1");
      const content = rawContent.replace(/\ssrc=("[^"]*"|'[^']*')/gi, " data-no11-src=$1");
      attributes += ' preload="none" muted playsinline webkit-playsinline';
      return `<video${attributes}>${content}</video>`;
    },
  );
}

const desktopHeroScript = `<script id="no11-desktop-hero-swap">
(function(){
  var desktopVideoUrl='/no11-desktop-full-quality.mp4';
  var mobileVideoUrl='/no11-mobile-full-quality.mp4';
  var desktopQuery=window.matchMedia('(min-width: 901px)');
  function activeVideo(){return document.querySelector(window.matchMedia('(min-width: 901px)').matches?'.hero-video--desktop':'.hero-video--mobile')}
  function hardenVideo(video){
    if(!video)return;
    video.removeAttribute('controls');
    video.removeAttribute('controlslist');
    video.controls=false;
    video.muted=true;
    video.defaultMuted=true;
    video.autoplay=true;
    video.loop=true;
    video.playsInline=true;
    video.setAttribute('muted','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
  }
  function ensureNativeControlsHidden(){
    if(document.getElementById('no11-hero-native-controls-fix'))return;
    var style=document.createElement('style');style.id='no11-hero-native-controls-fix';
    style.textContent='.hero-video::-webkit-media-controls,.hero-video::-webkit-media-controls-panel,.hero-video::-webkit-media-controls-play-button,.hero-video::-webkit-media-controls-start-playback-button{display:none!important;-webkit-appearance:none!important;opacity:0!important;pointer-events:none!important}.hero-video{pointer-events:none!important}';
    document.head.appendChild(style);
  }
  function syncControl(){
    var control=document.querySelector('.no11-video-control'),video=activeVideo();if(!control||!video)return;
    if(video.paused){control.setAttribute('aria-label','Videoyu oynat');control.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.6v10.8c0 .7.8 1.1 1.4.7l8-5.4a.85.85 0 0 0 0-1.4l-8-5.4A.85.85 0 0 0 4 2.6Z"></path></svg>'}
    else{control.setAttribute('aria-label','Videoyu durdur');control.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3" height="12" rx="1"></rect><rect x="10" y="2" width="3" height="12" rx="1"></rect></svg>'}
  }
  function enhanceControls(){
    var hero=document.querySelector('.hero'),videos=document.querySelectorAll('.hero-video');if(!hero||!videos.length)return;
    ensureNativeControlsHidden();
    videos.forEach(function(video){hardenVideo(video);video.defaultPlaybackRate=.9;video.playbackRate=.9;if(!video.dataset.no11ControlEvents){video.dataset.no11ControlEvents='1';video.addEventListener('play',syncControl);video.addEventListener('pause',syncControl)}});
    var existingControl=hero.querySelector('.no11-video-control');
    if(!desktopQuery.matches){if(existingControl)existingControl.remove();return}
    if(!document.getElementById('no11-hero-video-controls-style')){
      var style=document.createElement('style');style.id='no11-hero-video-controls-style';
      style.textContent='.hero{position:relative!important}.no11-video-control{position:absolute!important;right:28px!important;bottom:28px!important;z-index:999!important;width:44px!important;height:44px!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;border:1px solid rgba(255,255,255,.7)!important;border-radius:50%!important;background:rgba(24,20,18,.38)!important;color:#fff!important;backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);cursor:pointer!important;pointer-events:auto!important;transition:background .2s ease,transform .2s ease,border-color .2s ease}.no11-video-control:hover{background:rgba(24,20,18,.55)!important;transform:scale(1.04)}.no11-video-control:focus-visible{outline:2px solid #fff;outline-offset:3px}.no11-video-control svg{width:15px;height:15px;fill:currentColor}@media(max-width:900px){.no11-video-control{display:none!important}}';document.head.appendChild(style);
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
  function tryPlay(video,attempt){
    hardenVideo(video);
    var playPromise=video.play();
    if(playPromise&&playPromise.catch){
      playPromise.catch(function(){
        if(attempt<2){setTimeout(function(){tryPlay(video,attempt+1)},350*(attempt+1));return}
        video.pause();
        video.removeAttribute('controls');
        video.controls=false;
      });
    }
  }
  function loadVideo(video,forcedUrl){
    if(!video||video.dataset.no11Active==='1')return;
    if(forcedUrl){video.querySelectorAll('source').forEach(function(source){source.remove()});video.src=forcedUrl}
    else if(video.dataset.no11Src){video.src=video.dataset.no11Src}
    else video.querySelectorAll('source[data-no11-src]').forEach(function(source){source.src=source.dataset.no11Src});
    hardenVideo(video);
    video.preload='auto';
    video.defaultPlaybackRate=.9;
    video.playbackRate=.9;
    video.dataset.no11Active='1';
    video.load();
    tryPlay(video,0);
  }
  function selectHeroVideo(){
    var desktop=document.querySelector('.hero-video--desktop'),mobile=document.querySelector('.hero-video--mobile');
    if(!desktop&&!mobile)return;
    ensureNativeControlsHidden();
    if(desktopQuery.matches){
      unloadVideo(mobile);
      if(desktop){desktop.poster='/no11-desktop-poster.webp';desktop.style.setProperty('display','block','important');desktop.style.setProperty('visibility','visible','important');desktop.style.setProperty('opacity','1','important')}
      var desktopStill=document.querySelector('.hero-desktop-still');if(desktopStill)desktopStill.style.setProperty('display','none','important');
      loadVideo(desktop,desktopVideoUrl);
    }else{
      unloadVideo(desktop);loadVideo(mobile,mobileVideoUrl);
    }
    enhanceControls();syncControl();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',selectHeroVideo);
  else selectHeroVideo();
  window.addEventListener('resize',syncControl);
  window.addEventListener('focus',function(){var video=activeVideo();if(video&&video.paused)tryPlay(video,0)});
  document.addEventListener('visibilitychange',function(){if(!document.hidden){var video=activeVideo();if(video&&video.paused)tryPlay(video,0)}});
  if(desktopQuery.addEventListener)desktopQuery.addEventListener('change',selectHeroVideo);else desktopQuery.addListener(selectHeroVideo);
  window.addEventListener('pageshow',selectHeroVideo,{once:true});
})();
</script>`;

const phoneInputGuard = `<script id="no11-phone-input-guard">
(function(){
  function digits(v){return String(v||'').replace(/\D/g,'').slice(0,10)}
  function bind(input){
    if(!input||input.dataset.no11PhoneGuard)return;
    input.dataset.no11PhoneGuard='1';
    input.setAttribute('inputmode','numeric');
    input.setAttribute('maxlength','10');
    input.setAttribute('pattern','[0-9]{10}');
    input.setAttribute('placeholder','5XXXXXXXXX');
    input.addEventListener('input',function(){var d=digits(input.value);if(input.value!==d)input.value=d});
    input.addEventListener('paste',function(){setTimeout(function(){input.value=digits(input.value)},0)});
  }
  function scan(){document.querySelectorAll('input[type="tel"],input[name="phone"],input[name="telephone"]').forEach(bind)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
})();
</script>`;

const mobileStorySpacing = `<style id="no11-mobile-story-spacing">
@media (max-width: 900px) {
  .story-image-wrap { margin-bottom: 34px !important; }
  .story-content { padding-top: 14px !important; }
}
</style>`;

const adminScript = `
(function(){
  function enhance(){
    var root=document.querySelector('.n11-v4');if(!root)return;
    root.querySelectorAll('.n11-record').forEach(function(row){
      var b=row.querySelector('button');if(b&&!b.dataset.no11Detail){b.dataset.no11Detail='1';b.addEventListener('click',function(){setTimeout(function(){var d=document.querySelector('.n11-detail');if(d)d.scrollIntoView({behavior:'smooth',block:'start'})},40)})}
    });
  }
  function ensureDrawer(){
    if(document.querySelector('.n11-drawer'))return;
    var d=document.createElement('div');d.className='n11-drawer';d.innerHTML='<button class="n11-drawer-close">×</button><div class="n11-drawer-body"></div>';document.body.appendChild(d);
    d.querySelector('button').onclick=function(){d.classList.remove('open')};
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
  if (/^no11-(?:desktop-poster\.webp|desktop-new\.mp4|studio-(?:main|detail-0[1-4])\.jpeg)$/.test(path)) upstreamOrigin = ASSET_ORIGIN;
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
      .replace("</head>", `<link rel="preload" href="${incoming.origin}/no11-desktop-poster.webp" as="image">${mobileStorySpacing}<link rel="stylesheet" href="${incoming.origin}/no11-team-live.css?v=4"><link rel="stylesheet" href="${incoming.origin}/no11-studio-gallery.css?v=1"><script src="${incoming.origin}/no11-team-live.js?v=3" defer></script><script src="${incoming.origin}/no11-studio-gallery.js?v=1" defer></script><script src="${incoming.origin}/no11-schedule-live.js?v=2" defer></script><script src="${incoming.origin}/no11-settings-live.js?v=6" defer></script>${phoneInputGuard}</head>`)
      .replace("</body>", `${desktopHeroScript}</body>`);
    }
    if (path === "admin" || path.startsWith("admin/")) {
      // The premium admin owns the page. Prevent the proxied Next.js client from
      // hydrating the same DOM and repeatedly fighting the admin renderer.
      html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      html = html.replace(
        "</head>",
        `<style id="n11-admin-boot">body>*{visibility:hidden!important}body:before{content:'No.11';visibility:visible;position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#f7f6f8;color:#2b212e;font:52px Georgia,serif;letter-spacing:-.04em}</style><link rel="stylesheet" href="${incoming.origin}/no11-admin-premium.css?v=31"><link rel="stylesheet" href="${incoming.origin}/no11-admin-calendar-fix.css?v=31"><link rel="stylesheet" href="${incoming.origin}/no11-team-edit-modal-fix.css?v=20260914-3"><script src="${incoming.origin}/no11-admin-firebase.js?v=2" defer></script><script src="${incoming.origin}/no11-admin-fresh.js?v=1" defer></script></head>`,
      );
      responseHeaders.set("cache-control", "no-store, no-cache, must-revalidate");
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