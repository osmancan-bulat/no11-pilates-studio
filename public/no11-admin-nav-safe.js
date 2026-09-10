(function(){
  'use strict';

  var PAGE_KEY='no11-admin-current-page-v1';

  function isSidebarLogo(target){
    return !!(target && target.closest && target.closest('.n11-main-side .n11-side-logo'));
  }

  function isSiteBack(target){
    return target && target.closest ? target.closest('.n11-main-side .n11-side-user') : null;
  }

  function closeMobileMenu(){
    var main=document.querySelector('main');
    if(main)main.classList.remove('n11-menu-open');
  }

  function rememberPage(page){
    if(!page)return;
    try{sessionStorage.setItem(PAGE_KEY,page)}catch(e){}
  }

  document.addEventListener('click',function(event){
    if(isSidebarLogo(event.target)){
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    var back=isSiteBack(event.target);
    if(back){
      event.preventDefault();
      event.stopPropagation();
      window.location.assign('/');
      return;
    }

    var page=event.target&&event.target.closest?event.target.closest('[data-page]'):null;
    if(page&&page.dataset&&page.dataset.page){
      rememberPage(page.dataset.page);
      closeMobileMenu();
    }
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