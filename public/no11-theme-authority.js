(function(){
  'use strict';
  var MOBILE='(max-width: 767px)';

  function isMobile(){return window.matchMedia&&window.matchMedia(MOBILE).matches}

  // Desktop theme state is owned exclusively by the exact admin renderer's
  // .n11-theme click handler. Do not intercept storage writes or mutate the
  // main class here; those guards could desynchronise the icon and theme.
  // Mobile keeps its existing behaviour untouched.
  document.addEventListener('click',function(e){
    if(isMobile())return;
    var themeButton=e.target&&e.target.closest?e.target.closest('.n11-theme'):null;
    if(!themeButton)return;
    e.stopPropagation();
  },false);
})();
