(function(){
  'use strict';
  var MOBILE='(max-width: 767px)';

  function isMobile(){return window.matchMedia&&window.matchMedia(MOBILE).matches}

  // The upstream React event root is detached by the admin loader. Keep this
  // guard intentionally narrow: only the genuine theme control owns a theme
  // click, and normal admin controls are left completely untouched.
  document.addEventListener('click',function(e){
    if(isMobile())return;
    var themeButton=e.target&&e.target.closest?e.target.closest('.n11-theme'):null;
    if(!themeButton)return;
    e.stopPropagation();
  },false);
})();
