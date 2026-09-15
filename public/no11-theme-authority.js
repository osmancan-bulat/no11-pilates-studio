(function(){
  'use strict';
  var MOBILE='(max-width: 767px)';
  var KEY='no11-admin-theme';
  var stable=(localStorage.getItem(KEY)==='dark')?'dark':'light';
  var themeGesture=false;

  function isMobile(){return window.matchMedia&&window.matchMedia(MOBILE).matches}
  function isTheme(target){return !!(target&&target.closest&&target.closest('.n11-theme'))}
  function restore(){
    if(isMobile()||themeGesture)return;
    if(stable==='dark')localStorage.setItem(KEY,'dark');
    else localStorage.setItem(KEY,'light');
    var main=document.querySelector('main.n11-v4');
    if(main)main.classList.toggle('n11-dark',stable==='dark');
  }
  function settle(){
    setTimeout(restore,0);
    setTimeout(restore,32);
    setTimeout(restore,120);
  }

  // A desktop theme change is valid only when the pointer/keyboard gesture
  // starts on the real theme control. Every other admin interaction keeps the
  // last known theme, even if the proxied legacy app tries to change it.
  document.addEventListener('pointerdown',function(e){
    if(isMobile())return;
    themeGesture=isTheme(e.target);
    if(!themeGesture)settle();
  },true);

  document.addEventListener('keydown',function(e){
    if(isMobile())return;
    themeGesture=(e.key==='Enter'||e.key===' ')&&isTheme(e.target);
  },true);

  document.addEventListener('click',function(e){
    if(isMobile())return;
    if(isTheme(e.target)){
      // Exact admin's button handler runs before this document bubble handler.
      setTimeout(function(){
        stable=(localStorage.getItem(KEY)==='dark')?'dark':'light';
        themeGesture=false;
      },0);
      return;
    }
    themeGesture=false;
    restore();
    settle();
  },false);
})();
