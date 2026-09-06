(function(){
  'use strict';

  var months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  var days=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  var viewDate=new Date();
  var busy=false;

  function label(date){return date.getDate()+' '+months[date.getMonth()]+' '+days[date.getDay()]}
  function monthTitle(date){return months[date.getMonth()].toLocaleUpperCase('tr-TR')+' '+date.getFullYear()}

  function buildCalendar(grid,date){
    if(!grid)return;
    var year=date.getFullYear(),month=date.getMonth();
    var first=new Date(year,month,1),count=new Date(year,month+1,0).getDate();
    var offset=(first.getDay()+6)%7;
    var today=new Date();
    var html='';
    ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].forEach(function(d){html+='<b>'+d+'</b>'});
    for(var i=0;i<offset;i++)html+='<span class="n11-cal-empty" aria-hidden="true"></span>';
    for(var day=1;day<=count;day++){
      var isSelected=day===date.getDate();
      var isToday=day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
      html+='<span class="'+(isSelected?'active ':'')+(isToday?'today':'')+'" data-no11-calendar-day="'+day+'">'+day+'</span>';
    }
    grid.innerHTML=html;
  }

  function apply(){
    if(busy)return;busy=true;
    try{
      var title=document.querySelector('.n11-page-top h1');
      if(title&&title.textContent.trim()==='Genel Bakış'){
        var p=title.parentElement&&title.parentElement.querySelector('p');
        if(p)p.textContent=label(new Date());
      }
      var program=document.querySelector('.n11-program-head h1');
      if(program){
        var switchLabel=document.querySelector('.n11-date-switch span');
        if(switchLabel)switchLabel.textContent='▣  '+label(viewDate);
        var calTitle=document.querySelector('.n11-calendar header h2');
        if(calTitle)calTitle.textContent=monthTitle(viewDate);
        buildCalendar(document.querySelector('.n11-cal-grid'),viewDate);
      }
    }finally{busy=false}
  }

  document.addEventListener('click',function(event){
    var monthButton=event.target.closest&&event.target.closest('[data-month]');
    if(monthButton){
      viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+Number(monthButton.dataset.month||0),Math.min(viewDate.getDate(),28));
      setTimeout(apply,0);return;
    }
    var day=event.target.closest&&event.target.closest('[data-no11-calendar-day]');
    if(day){viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth(),Number(day.dataset.no11CalendarDay));setTimeout(apply,0);return}
    var switcher=event.target.closest&&event.target.closest('.n11-date-switch button');
    if(switcher){
      var buttons=Array.from(document.querySelectorAll('.n11-date-switch button'));
      var delta=buttons.indexOf(switcher)===0?-1:1;
      viewDate.setDate(viewDate.getDate()+delta);
      setTimeout(apply,0);
    }
  },true);

  var observer=new MutationObserver(function(){setTimeout(apply,0)});
  function start(){if(document.body)observer.observe(document.body,{childList:true,subtree:true});apply()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
