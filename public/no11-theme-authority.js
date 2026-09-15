(function(){
  'use strict';
  var KEY='no11-admin-theme';
  var MOBILE='(max-width: 767px)';
  var nativeSet=Storage.prototype.setItem;
  var nativeRemove=Storage.prototype.removeItem;
  var authorizedUntil=0;
  var restoring=false;

  function isMobile(){return window.matchMedia&&window.matchMedia(MOBILE).matches}
  function main(){return document.querySelector('main.n11-v4')}
  function isDashboard(){var el=main();return !!(el&&el.querySelector('.n11-dashboard-summary'))}
  function allowedTarget(target){return !!(!isMobile()&&isDashboard()&&target&&target.closest&&target.closest('.n11-theme'))}
  function authorize(){authorizedUntil=Date.now()+250}
  function authorized(){return isMobile()||Date.now()<=authorizedUntil}
  function storedDark(){return localStorage.getItem(KEY)==='dark'}
  function enforce(){
    if(isMobile()||restoring)return;
    var el=main();
    if(!el)return;
    var shouldDark=storedDark();
    if(el.classList.contains('n11-dark')!==shouldDark){
      restoring=true;
      el.classList.toggle('n11-dark',shouldDark);
      restoring=false;
    }
  }

  document.addEventListener('pointerdown',function(e){if(allowedTarget(e.target))authorize()},true);
  document.addEventListener('click',function(e){if(allowedTarget(e.target))authorize()},true);

  Storage.prototype.setItem=function(key,value){
    if(key===KEY&&!authorized())return;
    return nativeSet.apply(this,arguments);
  };
  Storage.prototype.removeItem=function(key){
    if(key===KEY&&!authorized())return;
    return nativeRemove.apply(this,arguments);
  };

  var observer=new MutationObserver(function(mutations){
    if(isMobile()||restoring)return;
    for(var i=0;i<mutations.length;i++){
      if(mutations[i].type==='attributes'&&mutations[i].attributeName==='class'){
        enforce();
        break;
      }
    }
  });

  function attach(){
    var el=main();
    if(!el)return false;
    observer.disconnect();
    observer.observe(el,{attributes:true,attributeFilter:['class']});
    enforce();
    return true;
  }

  if(!attach()){
    var mountObserver=new MutationObserver(function(){if(attach())mountObserver.disconnect()});
    mountObserver.observe(document.documentElement,{childList:true,subtree:true});
  }
  window.addEventListener('resize',enforce);
})();
