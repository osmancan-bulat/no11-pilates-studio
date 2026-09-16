(function(){
  'use strict';
  var months=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  var selected='';
  var applying=false;

  function dateLabel(value){
    var m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!m)return '';
    return Number(m[3])+' '+months[Number(m[2])-1];
  }

  function apply(){
    if(applying)return;
    var input=document.querySelector('.n11-date-search');
    if(!input)return;
    selected=input.value||selected;
    var wanted=dateLabel(selected);
    var list=document.querySelector('.n11-appt-list');
    if(!list)return;
    applying=true;
    var rows=Array.prototype.slice.call(list.querySelectorAll('.n11-appt-row'));
    rows.forEach(function(row){
      if(!wanted){row.style.removeProperty('display');return}
      var text=String(row.textContent||'').replace(/\s+/g,' ');
      row.style.setProperty('display',text.indexOf(wanted)>-1?'':'none','important');
    });
    var visible=rows.filter(function(row){return row.style.display!=='none'}).length;
    var old=list.querySelector('.n11-date-filter-empty');
    if(old)old.remove();
    if(wanted&&rows.length&&visible===0){
      var empty=document.createElement('div');
      empty.className='n11-empty n11-date-filter-empty';
      empty.innerHTML='<i>N.11</i><b>Bu tarihte randevu bulunmuyor</b><span>Başka bir tarih seçebilirsiniz.</span>';
      list.appendChild(empty);
    }
    applying=false;
  }

  document.addEventListener('change',function(e){
    if(!e.target||!e.target.matches('.n11-date-search'))return;
    selected=e.target.value||'';
    setTimeout(apply,0);
    setTimeout(apply,80);
  },true);
  document.addEventListener('input',function(e){
    if(!e.target||!e.target.matches('.n11-date-search'))return;
    selected=e.target.value||'';
    setTimeout(apply,0);
  },true);

  new MutationObserver(function(){
    if(applying)return;
    if(document.querySelector('.n11-date-search'))setTimeout(apply,0);
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
