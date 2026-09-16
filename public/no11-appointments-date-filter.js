(function(){
  'use strict';
  if(window.__NO11_APPOINTMENT_DATE_FILTER_FIX__)return;
  window.__NO11_APPOINTMENT_DATE_FILTER_FIX__=true;

  var selected='';
  var months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

  function formatDate(value){
    var m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m)return 'Tarih seçin';
    return Number(m[3])+' '+months[Number(m[2])-1]+' '+m[1];
  }

  function syncLabel(){
    var input=document.querySelector('.n11-date-search');
    var label=input&&input.closest('.n11-date-field');
    var span=label&&label.querySelector('span');
    if(input&&input.value)selected=input.value;
    if(span)span.textContent=selected?formatDate(selected):'Tarih seçin';
  }

  function apply(value){
    selected=String(value||'').slice(0,10);
    if(typeof window.__NO11_SET_APPOINTMENT_DATE_FILTER__==='function'){
      window.__NO11_SET_APPOINTMENT_DATE_FILTER__(selected);
      requestAnimationFrame(syncLabel);
    }
  }

  document.addEventListener('input',function(event){
    if(event.target&&event.target.matches&&event.target.matches('.n11-date-search'))apply(event.target.value);
  },true);

  document.addEventListener('change',function(event){
    if(event.target&&event.target.matches&&event.target.matches('.n11-date-search'))apply(event.target.value);
  },true);

  document.addEventListener('click',function(event){
    var page=event.target&&event.target.closest&&event.target.closest('[data-page="appointments"]');
    if(page)setTimeout(syncLabel,0);
  },true);

  window.addEventListener('no11-appointments-updated',function(){setTimeout(syncLabel,0)});
  setTimeout(syncLabel,250);
})();
