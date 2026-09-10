(function(){
  'use strict';
  var inReports=false;

  function ensureReportNav(){
    var nav=document.querySelector('.n11-main-side nav');
    if(!nav||nav.querySelector('[data-page="reports"]'))return;
    var btn=document.createElement('button');
    btn.type='button';
    btn.dataset.page='reports';
    btn.innerHTML='<b>▤</b><span>Raporlar</span>';
    var appointments=nav.querySelector('[data-page="appointments"]');
    if(appointments&&appointments.nextSibling)nav.insertBefore(btn,appointments.nextSibling);
    else nav.appendChild(btn);
  }

  document.addEventListener('click',function(e){
    var page=e.target&&e.target.closest?e.target.closest('[data-page]'):null;
    if(page){
      inReports=page.dataset.page==='reports';
      if(!inReports){
        requestAnimationFrame(function(){
          ensureReportNav();
          var nav=document.querySelector('.n11-main-side nav');
          if(!nav)return;
          var report=nav.querySelector('[data-page="reports"]');
          if(report)report.classList.remove('active');
          var current=nav.querySelector('[data-page].active');
          if(!current){
            var wanted=page.dataset.page;
            var next=nav.querySelector('[data-page="'+wanted+'"]');
            if(next)next.classList.add('active');
          }
        });
      }
    }

    var theme=e.target&&e.target.closest?e.target.closest('.n11-rp-theme'):null;
    if(theme){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var main=document.querySelector('main.n11-v4');
      if(main)main.classList.toggle('n11-dark');
    }
  },true);

  var observer=new MutationObserver(function(){
    ensureReportNav();
    if(inReports)return;
    var nav=document.querySelector('.n11-main-side nav');
    if(!nav)return;
    var report=nav.querySelector('[data-page="reports"]');
    if(report)report.classList.remove('active');
  });

  function start(){
    if(!document.body){setTimeout(start,120);return;}
    observer.observe(document.body,{childList:true,subtree:true});
    ensureReportNav();
    setTimeout(ensureReportNav,250);
    setTimeout(ensureReportNav,750);
    setTimeout(ensureReportNav,1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
