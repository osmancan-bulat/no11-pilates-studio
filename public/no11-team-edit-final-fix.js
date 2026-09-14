(function(){
  'use strict';

  var THEME_KEY='no11-admin-theme';
  var STYLE_ID='no11-team-edit-safe-style';

  function injectStyle(){
    if(document.getElementById(STYLE_ID))return;
    var style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent='\
.n11-v4 .n11-modal.n11-team-edit-safe{background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}\
.n11-v4 .n11-modal.n11-team-edit-safe .n11-modal-card{background:#fff!important;color:#171319!important;border:1px solid #e7e2e2!important;box-shadow:0 24px 70px rgba(31,24,34,.18)!important}\
.n11-v4 .n11-modal.n11-team-edit-safe .n11-modal-card input,.n11-v4 .n11-modal.n11-team-edit-safe .n11-modal-card textarea,.n11-v4 .n11-modal.n11-team-edit-safe .n11-modal-card select{background:#fbfaf9!important;color:#171319!important;border-color:#e7e2e2!important}\
.n11-v4 .n11-modal.n11-team-edit-safe .n11-modal-close{color:#171319!important;border-color:#e7e2e2!important}\
';
    document.head.appendChild(style);
  }

  function snapshotTheme(){
    var main=document.querySelector('main.n11-v4');
    return {
      dark:!!(main&&main.classList.contains('n11-dark')),
      stored:localStorage.getItem(THEME_KEY)
    };
  }

  function restoreTheme(before){
    var main=document.querySelector('main.n11-v4');
    if(main)main.classList.toggle('n11-dark',before.dark);
    if(before.stored==null)localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY,before.stored);
  }

  function markOpenTeamModal(){
    var modal=document.querySelector('.n11-modal.open');
    if(!modal)return;
    var form=modal.querySelector('.n11-modal-card');
    if(form&&form.dataset.type==='team')modal.classList.add('n11-team-edit-safe');
  }

  function normalizeButtons(){
    document.querySelectorAll('[data-edit-team],[data-remove-team]').forEach(function(button){
      button.type='button';
    });
  }

  /*
   * Important: intercept the physical click before it can reach any other
   * admin/document click listener. Then call only the existing team-edit
   * onclick function directly. That preserves the approved editor while
   * making it impossible for this click event to hit the appearance menu.
   */
  document.addEventListener('click',function(event){
    var button=event.target&&event.target.closest&&event.target.closest('[data-edit-team]');
    if(!button)return;

    var original=button.onclick;
    var before=snapshotTheme();

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    button.type='button';

    restoreTheme(before);

    setTimeout(function(){
      if(typeof original==='function')original.call(button);
      restoreTheme(before);
      markOpenTeamModal();
    },0);

    setTimeout(function(){
      restoreTheme(before);
      markOpenTeamModal();
    },50);
  },true);

  injectStyle();
  normalizeButtons();
  new MutationObserver(function(){normalizeButtons()}).observe(document.documentElement,{subtree:true,childList:true});
})();