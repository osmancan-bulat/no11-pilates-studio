(function(){
  'use strict';
  var KEY='no11-admin-theme';
  var MOBILE='(max-width: 767px)';
  var lastAllowed=null;

  function root(){return document.querySelector('main.n11-v4')}
  function isMobile(){return window.matchMedia&&window.matchMedia(MOBILE).matches}
  function isDashboard(){
    var main=root();
    return !!(main&&main.querySelector('.n11-dashboard-summary'));
  }
  function allowedThemeButton(target){
    var button=target&&target.closest?target.closest('.n11-theme'):null;
    if(!button)return null;
    if(isMobile())return button;
    return isDashboard()?button:null;
  }
  function snapshot(){
    var main=root();
    return {stored:localStorage.getItem(KEY),dark:!!(main&&main.classList.contains('n11-dark'))};
  }
  function restore(before){
    if(!before)return;
    var main=root();
    if(before.stored===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,before.stored);
    if(main)main.classList.toggle('n11-dark',before.dark);
  }
  function hideDesktopThemeOutsideDashboard(){
    if(isMobile())return;
    var main=root();
    if(!main)return;
    main.querySelectorAll('.n11-theme').forEach(function(button){
      button.style.display=isDashboard()?'':'none';
      button.setAttribute('aria-hidden',isDashboard()?'false':'true');
      button.tabIndex=isDashboard()?0:-1;
    });
  }
  function guard(event){
    if(allowedThemeButton(event.target)){
      lastAllowed=null;
      return;
    }
    var before=snapshot();
    lastAllowed=before;
    setTimeout(function(){restore(before);hideDesktopThemeOutsideDashboard()},0);
    requestAnimationFrame(function(){restore(before);hideDesktopThemeOutsideDashboard();requestAnimationFrame(function(){restore(before);hideDesktopThemeOutsideDashboard()})});
  }

  document.addEventListener('pointerdown',function(event){
    if(allowedThemeButton(event.target)){lastAllowed=null;return;}
    lastAllowed=snapshot();
  },true);
  document.addEventListener('click',guard,true);
  document.addEventListener('change',function(event){
    if(allowedThemeButton(event.target))return;
    var before=lastAllowed||snapshot();
    setTimeout(function(){restore(before);hideDesktopThemeOutsideDashboard()},0);
  },true);

  var observer=new MutationObserver(function(){hideDesktopThemeOutsideDashboard()});
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('resize',hideDesktopThemeOutsideDashboard);
  hideDesktopThemeOutsideDashboard();
})();
