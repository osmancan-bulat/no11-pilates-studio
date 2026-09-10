(function(){
  'use strict';

  function isSidebarLogo(target){
    return !!(target && target.closest && target.closest('.n11-main-side .n11-side-logo'));
  }

  function isSiteBack(target){
    return target && target.closest ? target.closest('.n11-main-side .n11-side-user') : null;
  }

  document.addEventListener('click',function(event){
    if(isSidebarLogo(event.target)){
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    var back=isSiteBack(event.target);
    if(!back)return;
    event.preventDefault();
    event.stopPropagation();
    window.location.assign('/');
  },true);

  document.addEventListener('keydown',function(event){
    if(event.key!=='Enter'&&event.key!==' ')return;
    var back=isSiteBack(event.target);
    if(!back)return;
    event.preventDefault();
    window.location.assign('/');
  },true);

  function prepare(){
    var logo=document.querySelector('.n11-main-side .n11-side-logo');
    if(logo){
      logo.removeAttribute('href');
      logo.setAttribute('aria-label','No.11 Pilates Studio');
    }

    var back=document.querySelector('.n11-main-side .n11-side-user');
    if(back){
      back.setAttribute('role','link');
      back.setAttribute('tabindex','0');
      back.setAttribute('aria-label','Siteye dön');
    }
  }

  prepare();
  new MutationObserver(prepare).observe(document.documentElement,{childList:true,subtree:true});
})();