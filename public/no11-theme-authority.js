(function(){
  'use strict';
  var MOBILE='(max-width: 767px)';
  var MARK='data-no11-click-isolated';

  function isMobile(){return window.matchMedia&&window.matchMedia(MOBILE).matches}

  // The proxied upstream admin still has a document-level click handler.
  // Our exact admin UI owns its own controls, so desktop clicks must not
  // bubble back into that stale upstream handler. Stop bubbling only after
  // the real target/button handler has run; this keeps Edit, Approve, nav,
  // forms and the theme button working normally inside the exact UI.
  function isolate(root){
    if(!root||root.getAttribute(MARK)==='1')return;
    root.setAttribute(MARK,'1');
    root.addEventListener('click',function(e){
      if(isMobile())return;
      e.stopPropagation();
    },false);
  }

  function attach(){
    if(isMobile())return;
    var main=document.querySelector('main.n11-v4');
    if(!main)return;
    isolate(main.querySelector('.n11-main-content'));
    isolate(main.querySelector('.n11-main-side'));
    isolate(main.querySelector('.n11-modal'));
  }

  attach();
  var main=document.querySelector('main');
  if(main){
    new MutationObserver(attach).observe(main,{childList:true});
  }else{
    var mountObserver=new MutationObserver(function(){
      var mounted=document.querySelector('main');
      if(!mounted)return;
      mountObserver.disconnect();
      attach();
      new MutationObserver(attach).observe(mounted,{childList:true});
    });
    mountObserver.observe(document.documentElement,{childList:true,subtree:true});
  }
})();
