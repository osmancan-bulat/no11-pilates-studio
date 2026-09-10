(function(){
  'use strict';
  var inReports=false;

  document.addEventListener('click',function(e){
    var page=e.target&&e.target.closest?e.target.closest('[data-page]'):null;
    if(page){
      inReports=page.dataset.page==='reports';
      if(!inReports){
        requestAnimationFrame(function(){
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
    if(inReports)return;
    var nav=document.querySelector('.n11-main-side nav');
    if(!nav)return;
    var report=nav.querySelector('[data-page="reports"]');
    if(report)report.classList.remove('active');
  });

  function start(){
    var main=document.querySelector('main.n11-v4');
    if(!main){setTimeout(start,120);return;}
    observer.observe(main,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
