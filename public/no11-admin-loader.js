(function(){
  if (!document.querySelector('link[data-no11-premium]')) {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/no11-admin-exact-20.css';
    style.dataset.no11Premium = '1';
    document.head.appendChild(style);
  }
  if (!document.querySelector('link[data-no11-reports]')) {
    var reportStyle = document.createElement('link');
    reportStyle.rel = 'stylesheet';
    reportStyle.href = '/no11-admin-reports.css?v=20260910-4';
    reportStyle.dataset.no11Reports = '1';
    document.head.appendChild(reportStyle);
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

  var script = document.createElement('script');
  script.src = '/no11-admin-exact-20.js';
  script.defer = true;
  document.head.appendChild(script);

  var reportScript = document.createElement('script');
  reportScript.src = '/no11-admin-reports.js?v=20260910-5';
  reportScript.defer = true;
  document.head.appendChild(reportScript);

  var reportGuard = document.createElement('script');
  reportGuard.src = '/no11-admin-reports-guard.js?v=20260910-6';
  reportGuard.defer = true;
  document.head.appendChild(reportGuard);

  var navSafe = document.createElement('script');
  navSafe.src = '/no11-admin-nav-safe.js?v=20260910-1';
  navSafe.defer = true;
  document.head.appendChild(navSafe);

  ensureReportsNav();
  setTimeout(ensureReportsNav,100);
  setTimeout(ensureReportsNav,300);
  setTimeout(ensureReportsNav,750);
  setInterval(ensureReportsNav,1000);
})();