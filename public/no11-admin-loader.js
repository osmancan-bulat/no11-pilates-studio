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
    reportStyle.href = '/no11-admin-reports.css';
    reportStyle.dataset.no11Reports = '1';
    document.head.appendChild(reportStyle);
  }
  var script = document.createElement('script');
  script.src = '/no11-admin-exact-20.js';
  script.defer = true;
  document.head.appendChild(script);

  var reportScript = document.createElement('script');
  reportScript.src = '/no11-admin-reports.js';
  reportScript.defer = true;
  document.head.appendChild(reportScript);
})();
