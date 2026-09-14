(function(){
  'use strict';
  function apply(){
    if(window.matchMedia&&window.matchMedia('(max-width:760px)').matches)return;
    var headings=document.querySelectorAll('h1');
    var title=null;
    for(var i=0;i<headings.length;i++){
      if((headings[i].textContent||'').trim()==='Site Ayarları'){title=headings[i];break;}
    }
    if(!title)return;
    var root=title.closest('main')||document.querySelector('main')||document.body;
    root.classList.add('n11-settings-desktop-repair');

    var content=title.closest('.n11-main-content')||title.parentElement&&title.parentElement.parentElement||root;
    var form=content.querySelector('form');
    if(!form)return;
    form.classList.add('n11-settings-desktop-repair-form');

    var fields=form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea, select');
    for(var j=0;j<fields.length;j++){
      var field=fields[j];
      var row=field.closest('label');
      if(row)row.classList.add('n11-settings-desktop-repair-row');
    }
  }

  function start(){
    apply();
    var obs=new MutationObserver(function(){setTimeout(apply,0)});
    obs.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('resize',apply);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
