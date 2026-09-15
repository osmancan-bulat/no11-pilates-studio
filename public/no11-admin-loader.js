(function(){
  // The admin HTML comes from an older proxied build. Replace its React root so
  // root-owned listeners are discarded, then fence bubbling clicks at the new
  // root. Target/button handlers still run normally; stale document-level
  // bubble handlers from the proxied build can no longer react to admin clicks.
  var upstreamRoot = document.getElementById('__next');
  if (upstreamRoot && upstreamRoot.parentNode) {
    var cleanRoot = upstreamRoot.cloneNode(true);
    cleanRoot.addEventListener('click', function(event){
      event.stopPropagation();
    }, false);
    upstreamRoot.parentNode.replaceChild(cleanRoot, upstreamRoot);
  }

  if (!document.querySelector('link[data-no11-premium]')) {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/no11-admin-exact-20.css?v=20260915-2';
    style.dataset.no11Premium = '1';
    document.head.appendChild(style);
  }
  if (!document.querySelector('link[data-no11-settings-desktop-clean]')) {
    var settingsDesktopClean = document.createElement('link');
    settingsDesktopClean.rel = 'stylesheet';
    settingsDesktopClean.href = '/no11-settings-desktop-clean.css?v=20260914-1';
    settingsDesktopClean.dataset.no11SettingsDesktopClean = '1';
    document.head.appendChild(settingsDesktopClean);
  }
  if (!document.querySelector('link[data-no11-reports]')) {
    var reportStyle = document.createElement('link');
    reportStyle.rel = 'stylesheet';
    reportStyle.href = '/no11-admin-reports.css?v=20260910-4';
    reportStyle.dataset.no11Reports = '1';
    document.head.appendChild(reportStyle);
  }
  if (!document.querySelector('link[data-no11-reports-theme-fix]')) {
    var reportThemeFix = document.createElement('link');
    reportThemeFix.rel = 'stylesheet';
    reportThemeFix.href = '/no11-reports-theme-fix.css?v=20260914-1';
    reportThemeFix.dataset.no11ReportsThemeFix = '1';
    document.head.appendChild(reportThemeFix);
  }
  if (!document.querySelector('link[data-no11-reports-mobile-v2]')) {
    var mobileReportStyle = document.createElement('link');
    mobileReportStyle.rel = 'stylesheet';
    mobileReportStyle.href = '/no11-admin-reports-mobile-v2.css?v=20260910-4';
    mobileReportStyle.dataset.no11ReportsMobileV2 = '1';
    document.head.appendChild(mobileReportStyle);
  }

  function ensureReportsNav(){
    var nav=document.querySelector('.n11-main-side nav');
    if(!nav||nav.querySelector('[data-page="reports"]'))return;
    var btn=document.createElement('button');
    btn.type='button';
    btn.dataset.page='reports';
    btn.innerHTML='<b>▤</b><span>Raporlar</span>';
    var appointments=nav.querySelector('[data-page="appointments"]');
    if(appointments&&appointments.nextSibling)nav.insertBefore(btn,appointments.nextSibling);
    else nav.appendChild(btn);
  }

  var themeAuthority = document.createElement('script');
  themeAuthority.src = '/no11-theme-authority.js?v=20260915-6';
  themeAuthority.defer = true;
  document.head.appendChild(themeAuthority);

  var script = document.createElement('script');
  script.src = '/no11-admin-exact-20.js?v=20260915-5';
  script.defer = true;
  document.head.appendChild(script);

  var settingsClean = document.createElement('script');
  settingsClean.src = '/no11-settings-desktop-clean.js?v=20260914-1';
  settingsClean.defer = true;
  document.head.appendChild(settingsClean);

  var reportScript = document.createElement('script');
  reportScript.src = '/no11-admin-reports.js?v=20260910-5';
  reportScript.defer = true;
  document.head.appendChild(reportScript);

  var reportGuard = document.createElement('script');
  reportGuard.src = '/no11-admin-reports-guard.js?v=20260910-6';
  reportGuard.defer = true;
  document.head.appendChild(reportGuard);

  var navSafe = document.createElement('script');
  navSafe.src = '/no11-admin-nav-safe.js?v=20260910-2';
  navSafe.defer = true;
  document.head.appendChild(navSafe);

  var reportsStability = document.createElement('script');
  reportsStability.src = '/no11-admin-reports-stability.js?v=20260910-1';
  reportsStability.defer = true;
  document.head.appendChild(reportsStability);

  ensureReportsNav();
  setTimeout(ensureReportsNav,100);
  setTimeout(ensureReportsNav,300);
  setTimeout(ensureReportsNav,750);
  setInterval(ensureReportsNav,1000);
})();