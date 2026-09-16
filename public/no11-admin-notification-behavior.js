(function(){
  'use strict';

  function attachSwipe(toast){
    if(!toast||toast.dataset.n11SwipeReady==='1')return;
    toast.dataset.n11SwipeReady='1';
    var startX=0,startY=0,dx=0,tracking=false,moved=false;

    function point(e){return e.touches&&e.touches[0]?e.touches[0]:(e.changedTouches&&e.changedTouches[0]?e.changedTouches[0]:null)}
    function begin(e){
      var p=point(e);if(!p)return;
      startX=p.clientX;startY=p.clientY;dx=0;tracking=true;moved=false;
      toast.style.setProperty('transition','none','important');
      toast.style.setProperty('touch-action','pan-y','important');
    }
    function move(e){
      if(!tracking)return;var p=point(e);if(!p)return;
      var x=p.clientX-startX,y=p.clientY-startY;
      if(!moved&&Math.abs(y)>Math.abs(x)&&Math.abs(y)>10){tracking=false;return}
      dx=x;if(Math.abs(dx)>6)moved=true;
      if(moved){e.preventDefault();toast.style.setProperty('transform','translate3d('+dx+'px,0,0)','important');toast.style.setProperty('opacity',String(Math.max(.25,1-Math.abs(dx)/240)),'important')}
    }
    function end(e){
      if(!tracking&&!moved)return;var p=point(e);if(p)dx=p.clientX-startX;tracking=false;
      toast.style.setProperty('transition','transform .18s ease, opacity .18s ease','important');
      if(Math.abs(dx)>=45){
        moved=true;toast.style.setProperty('transform','translate3d('+(dx<0?'-120vw':'120vw')+',0,0)','important');toast.style.setProperty('opacity','0','important');
        setTimeout(function(){if(toast.isConnected)toast.remove()},190);
      }else{
        toast.style.setProperty('transform','translate3d(0,0,0)','important');toast.style.setProperty('opacity','1','important');
        setTimeout(function(){moved=false;dx=0},220);
      }
    }
    toast.addEventListener('touchstart',begin,{passive:true});
    toast.addEventListener('touchmove',move,{passive:false});
    toast.addEventListener('touchend',end,{passive:true});
    toast.addEventListener('touchcancel',end,{passive:true});
    toast.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopImmediatePropagation()}},true);
  }

  function scan(){document.querySelectorAll('.n11-live-toast').forEach(attachSwipe)}
  var observer=new MutationObserver(scan);
  function start(){scan();observer.observe(document.body,{childList:true,subtree:true});if('serviceWorker'in navigator){navigator.serviceWorker.getRegistration('/').then(function(reg){if(reg)reg.update().catch(function(){})}).catch(function(){})}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
