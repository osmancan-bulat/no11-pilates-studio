(function(){
  'use strict';

  var PAGE_KEY='no11-admin-current-page-v1';
  var restoring=false;
  var restoreTimer=0;

  function main(){return document.querySelector('main.n11-v4')||document.querySelector('main')}
  function isReportsWanted(){return sessionStorage.getItem(PAGE_KEY)==='reports'}
  function isReportsVisible(){return !!document.querySelector('.n11-main-content .n11-rp-top')}
  function closeMenu(){var m=main();if(m)m.classList.remove('n11-menu-open')}

  function openReports(){
    if(restoring||!isReportsWanted()||isReportsVisible())return;
    var button=document.querySelector('.n11-main-side [data-page="reports"]');
    if(!button)return;
    restoring=true;
    closeMenu();
    try{button.click()}catch(e){}
    setTimeout(function(){restoring=false},80);
  }

  function scheduleRestore(){
    if(restoreTimer)clearTimeout(restoreTimer);
    restoreTimer=setTimeout(function(){restoreTimer=0;openReports()},0);
  }

  document.addEventListener('click',function(event){
    var page=event.target&&event.target.closest?event.target.closest('[data-page]'):null;
    if(page&&page.dataset.page){
      sessionStorage.setItem(PAGE_KEY,page.dataset.page);
      if(page.dataset.page==='reports')scheduleRestore();
      else restoring=false;
    }
  },true);

  document.addEventListener('click',function(event){
    if(!isReportsWanted())return;
    if(event.target&&event.target.closest&&event.target.closest('.n11-rp-theme,[data-report-mode]')){
      sessionStorage.setItem(PAGE_KEY,'reports');
      setTimeout(scheduleRestore,0);
    }
  },true);

  function start(){
    if(!document.body){setTimeout(start,100);return}
    var observer=new MutationObserver(function(){
      if(isReportsWanted()&&!isReportsVisible())scheduleRestore();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    if(isReportsWanted())scheduleRestore();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
