(function(){
  // The admin HTML comes from an older proxied build. Replace its React root so
  // root-owned listeners are discarded, then fence bubbling clicks at the new
  // root. Target/button handlers still run normally; stale document-level
  // bubble handlers from the proxied build can no longer react to admin clicks.
  var upstreamRoot = document.getElementById('__next');
  if (upstreamRoot && upstreamRoot.parentNode) {
    var cleanRoot = upstreamRoot.cloneNode(true);
    cleanRoot.addEventListener('click', function(event){ event.stopPropagation(); }, false);
    upstreamRoot.parentNode.replaceChild(cleanRoot, upstreamRoot);
  }

  function addStyle(href,key){if(document.querySelector('link['+key+']'))return;var l=document.createElement('link');l.rel='stylesheet';l.href=href;l.setAttribute(key,'1');document.head.appendChild(l)}
  addStyle('/no11-admin-exact-20.css?v=20260915-2','data-no11-premium');
  addStyle('/no11-settings-desktop-clean.css?v=20260914-1','data-no11-settings-desktop-clean');
  addStyle('/no11-admin-reports.css?v=20260910-4','data-no11-reports');
  addStyle('/no11-reports-theme-fix.css?v=20260914-1','data-no11-reports-theme-fix');
  addStyle('/no11-admin-reports-mobile-v2.css?v=20260910-4','data-no11-reports-mobile-v2');

  function addScript(src){var s=document.createElement('script');s.src=src;s.defer=true;document.head.appendChild(s)}
  addScript('/no11-theme-authority.js?v=20260915-6');
  addScript('/no11-admin-exact-20.js?v=20260915-5');
  addScript('/no11-appointments-date-filter.js?v=20260916-1');
  addScript('/no11-settings-desktop-clean.js?v=20260914-1');
  addScript('/no11-admin-reports.js?v=20260910-5');
  addScript('/no11-admin-reports-guard.js?v=20260910-6');
  addScript('/no11-admin-nav-safe.js?v=20260910-2');
  addScript('/no11-admin-reports-stability.js?v=20260910-1');

  function ensureReportsNav(){
    var nav=document.querySelector('.n11-main-side nav');
    if(!nav||nav.querySelector('[data-page="reports"]'))return;
    var btn=document.createElement('button');btn.type='button';btn.dataset.page='reports';btn.innerHTML='<b>▤</b><span>Raporlar</span>';
    var appointments=nav.querySelector('[data-page="appointments"]');
    if(appointments&&appointments.nextSibling)nav.insertBefore(btn,appointments.nextSibling);else nav.appendChild(btn);
  }
  ensureReportsNav();setTimeout(ensureReportsNav,100);setTimeout(ensureReportsNav,300);setTimeout(ensureReportsNav,750);setInterval(ensureReportsNav,1000);
})();