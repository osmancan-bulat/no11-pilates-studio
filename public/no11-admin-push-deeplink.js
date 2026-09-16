(function(){
  'use strict';
  var params=new URLSearchParams(location.search);
  var appointmentId=params.get('appointment');
  if(!appointmentId)return;
  var finished=false,attempts=0;
  function cleanUrl(){try{var url=new URL(location.href);url.searchParams.delete('appointment');history.replaceState(null,'',url.pathname+(url.searchParams.toString()?'?'+url.searchParams.toString():'')+url.hash);}catch(e){}}
  function openAppointment(){
    if(finished)return;attempts++;
    var pageButton=document.querySelector('[data-page="appointments"]');
    if(pageButton&&!pageButton.classList.contains('active')){pageButton.click();setTimeout(openAppointment,120);return;}
    var selector='[data-detail="'+(window.CSS&&CSS.escape?CSS.escape(appointmentId):appointmentId.replace(/["\\]/g,'\\$&'))+'"]';
    var detailButton=document.querySelector(selector);
    if(detailButton){finished=true;detailButton.click();cleanUrl();setTimeout(function(){var detail=document.querySelector('.n11-detail,.n11-appointment-detail,[role="dialog"]');if(detail&&detail.scrollIntoView)detail.scrollIntoView({block:'start',behavior:'smooth'});},180);return;}
    if(attempts<40)setTimeout(openAppointment,150);else cleanUrl();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(openAppointment,100);},{once:true});else setTimeout(openAppointment,100);
})();
