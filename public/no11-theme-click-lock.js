(function(){
  'use strict';
  var MOBILE='(max-width: 767px)';

  function isMobile(){return window.matchMedia&&window.matchMedia(MOBILE).matches}
  function root(){return document.querySelector('main.n11-v4')}
  function isDashboard(){var main=root();return !!(main&&main.querySelector('.n11-dashboard-summary'))}

  function blockThemeOutsideDashboard(event){
    if(isMobile()||isDashboard())return;
    var theme=event.target&&event.target.closest?event.target.closest('.n11-theme'):null;
    if(!theme)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  document.addEventListener('pointerdown',blockThemeOutsideDashboard,true);
  document.addEventListener('pointerup',blockThemeOutsideDashboard,true);
  document.addEventListener('click',blockThemeOutsideDashboard,true);
})();
