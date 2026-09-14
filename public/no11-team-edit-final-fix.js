(function(){
  'use strict';

  var THEME_KEY='no11-admin-theme';
  var styleId='no11-team-edit-final-fix-style';

  function injectStyle(){
    if(document.getElementById(styleId))return;
    var style=document.createElement('style');
    style.id=styleId;
    style.textContent='\
.n11-v4 .n11-modal.n11-team-edit-modal{background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;align-items:center!important;justify-content:center!important;pointer-events:none!important}\
.n11-v4 .n11-modal.n11-team-edit-modal .n11-modal-card{pointer-events:auto!important;display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:2!important;background:#fff!important;color:#171319!important;border:1px solid #e7e2e2!important;box-shadow:0 24px 70px rgba(31,24,34,.22)!important}\
.n11-v4 .n11-modal.n11-team-edit-modal .n11-modal-card input,.n11-v4 .n11-modal.n11-team-edit-modal .n11-modal-card textarea{background:#fbfaf9!important;color:#171319!important}\
@media(max-width:760px){.n11-v4 .n11-modal.n11-team-edit-modal{align-items:end!important}.n11-v4 .n11-modal.n11-team-edit-modal .n11-modal-card{width:100%!important}}';
    document.head.appendChild(style);
  }

  function themeSnapshot(){
    var main=document.querySelector('main.n11-v4');
    return {dark:!!(main&&main.classList.contains('n11-dark')),stored:localStorage.getItem(THEME_KEY)};
  }

  function restoreTheme(before){
    var main=document.querySelector('main.n11-v4');
    if(main)main.classList.toggle('n11-dark',before.dark);
    if(before.stored==null)localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY,before.stored);
  }

  function markModal(){
    document.querySelectorAll('.n11-modal').forEach(function(modal){
      var form=modal.querySelector('.n11-modal-card');
      var teamOpen=modal.classList.contains('open')&&form&&form.dataset.type==='team';
      modal.classList.toggle('n11-team-edit-modal',!!teamOpen);
    });
  }

  function normalizeButtons(){
    document.querySelectorAll('[data-edit-team],[data-remove-team]').forEach(function(button){button.type='button'});
  }

  document.addEventListener('click',function(event){
    var button=event.target&&event.target.closest&&event.target.closest('[data-edit-team]');
    if(!button)return;
    button.type='button';
    var before=themeSnapshot();
    setTimeout(function(){restoreTheme(before);markModal()},0);
    setTimeout(function(){restoreTheme(before);markModal()},60);
    setTimeout(function(){restoreTheme(before);markModal()},250);
  },true);

  injectStyle();
  normalizeButtons();
  markModal();
  new MutationObserver(function(){normalizeButtons();markModal()}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-type']});
})();