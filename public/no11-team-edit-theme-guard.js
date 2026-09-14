(function(){
  'use strict';

  var THEME_KEY='no11-admin-theme';
  var WRAPPED='data-no11-team-theme-guard';

  function themeState(){
    var main=document.querySelector('main.n11-v4');
    return {
      dark:!!(main&&main.classList.contains('n11-dark')),
      stored:localStorage.getItem(THEME_KEY)
    };
  }

  function restoreTheme(before){
    var main=document.querySelector('main.n11-v4');
    if(main)main.classList.toggle('n11-dark',before.dark);
    if(before.stored==null)localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY,before.stored);
  }

  function protect(button){
    if(!button||button.hasAttribute(WRAPPED)||typeof button.onclick!=='function')return;
    var original=button.onclick;
    button.onclick=function(event){
      var before=themeState();
      var result=original.call(this,event);
      restoreTheme(before);
      setTimeout(function(){restoreTheme(before)},0);
      return result;
    };
    button.setAttribute(WRAPPED,'1');
  }

  function scan(){
    document.querySelectorAll('[data-edit-team]').forEach(protect);
  }

  scan();
  new MutationObserver(function(){setTimeout(scan,0)}).observe(document.documentElement,{childList:true,subtree:true});
})();
