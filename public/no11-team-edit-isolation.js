(function(){
  'use strict';

  var THEME_KEY='no11-admin-theme';
  var MARK='data-no11-team-edit-isolated';

  function snapshotTheme(){
    var main=document.querySelector('main.n11-v4');
    return {
      dark:!!(main&&main.classList.contains('n11-dark')),
      stored:localStorage.getItem(THEME_KEY)
    };
  }

  function restoreTheme(before){
    var main=document.querySelector('main.n11-v4');
    if(main)main.classList.toggle('n11-dark',before.dark);
    if(before.stored===null)localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY,before.stored);
  }

  function isolate(button){
    if(!button||button.hasAttribute(MARK))return;
    button.type='button';

    button.addEventListener('click',function(event){
      event.preventDefault();
      event.stopPropagation();
    },true);

    var original=button.onclick;
    if(typeof original==='function'){
      button.onclick=function(event){
        var before=snapshotTheme();
        var result=original.call(this,event);
        restoreTheme(before);
        requestAnimationFrame(function(){restoreTheme(before)});
        setTimeout(function(){restoreTheme(before)},0);
        return result;
      };
    }

    button.setAttribute(MARK,'1');
  }

  function scan(){
    document.querySelectorAll('[data-edit-team],[data-remove-team]').forEach(isolate);
  }

  scan();
  new MutationObserver(function(){setTimeout(scan,0)}).observe(document.documentElement,{childList:true,subtree:true});
})();
