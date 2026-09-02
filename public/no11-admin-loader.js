(function(){
  if (!document.querySelector('link[data-no11-premium]')) {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/no11-admin-premium.css?v=18';
    style.dataset.no11Premium = '1';
    document.head.appendChild(style);
  }
  var script = document.createElement('script');
  script.src = '/no11-admin-premium.js?v=18';
  script.defer = true;
  document.head.appendChild(script);
})();
