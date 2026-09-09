(function(){
  'use strict';
  document.documentElement.dataset.no11BookingPhone='';
  function sync(proxy,original){
    var value=(proxy.textContent||'').replace(/\s+/g,'').trim();
    document.documentElement.dataset.no11BookingPhone=value;
    if(original)original.value=value;
  }
  function install(){
    var original=document.querySelector('input[name="phone"]');
    if(!original||original.dataset.no11PhoneOriginal)return;
    var proxy=document.createElement('div');
    proxy.className=original.className;
    proxy.id='no11-booking-phone-visible';
    proxy.contentEditable='true';
    proxy.setAttribute('role','textbox');
    proxy.setAttribute('aria-label','Telefon');
    proxy.setAttribute('data-placeholder',original.placeholder||'Telefon numaranız');
    proxy.textContent=document.documentElement.dataset.no11BookingPhone||original.value||'';
    var computed=getComputedStyle(original);
    ['display','width','height','padding','margin','border','borderRadius','font','fontSize','fontFamily','fontWeight','lineHeight','letterSpacing','color','background','boxSizing','outline','minHeight','maxWidth'].forEach(function(key){proxy.style[key]=computed[key]});
    proxy.style.whiteSpace='nowrap';proxy.style.overflow='hidden';
    original.dataset.no11PhoneOriginal='1';original.type='hidden';original.required=false;original.tabIndex=-1;original.style.cssText+=';display:none!important';
    original.parentNode.insertBefore(proxy,original);
    proxy.addEventListener('input',function(){sync(proxy,original)},true);
    proxy.addEventListener('inputkeydown',function(event){if(event.key==='Enter')event.preventDefault()});
    if(!document.getElementById('no11-phone-proxy-style')){var style=document.createElement('style');style.id='no11-phone-proxy-style';style.textContent='#no11-booking-phone-visible:empty:before{content:attr(data-placeholder);color:#8b817b;pointer-events:none}';document.head.appendChild(style)}
  }
  function start(){install();new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
