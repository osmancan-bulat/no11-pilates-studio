(function(){
  'use strict';

  function attachSwipe(toast){
    if(!toast||toast.dataset.n11SwipeReady==='1')return;
    toast.dataset.n11SwipeReady='1';
    var startX=0,startY=0,dx=0,dragging=false,moved=false;

    function begin(e){
      if(!e.touches||e.touches.length!==1)return;
      startX=e.touches[0].clientX;startY=e.touches[0].clientY;dx=0;dragging=true;moved=false;
      toast.style.setProperty('transition','none','important');
    }
    function move(e){
      if(!dragging||!e.touches||e.touches.length!==1)return;
      var x=e.touches[0].clientX-startX,y=e.touches[0].clientY-startY;
      if(Math.abs(y)>Math.abs(x)&&Math.abs(y)>12){dragging=false;return;}
      dx=x;
      if(Math.abs(dx)>8)moved=true;
      if(moved){
        e.preventDefault();
        toast.style.setProperty('transform','translateX('+dx+'px)','important');
        toast.style.setProperty('opacity',String(Math.max(.35,1-Math.abs(dx)/280)),'important');
      }
    }
    function end(){
      if(!dragging&&!moved)return;
      dragging=false;
      toast.style.setProperty('transition','transform .2s ease, opacity .2s ease','important');
      if(Math.abs(dx)>=70){
        toast.style.setProperty('transform','translateX('+(dx<0?'-120%':'120%')+')','important');
        toast.style.setProperty('opacity','0','important');
        setTimeout(function(){if(toast.isConnected)toast.remove()},210);
      }else{
        toast.style.setProperty('transform','none','important');
        toast.style.setProperty('opacity','1','important');
      }
      setTimeout(function(){moved=false;dx=0},230);
    }
    toast.addEventListener('touchstart',begin,{passive:true});
    toast.addEventListener('touchmove',move,{passive:false});
    toast.addEventListener('touchend',end,{passive:true});
    toast.addEventListener('touchcancel',end,{passive:true});
    toast.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopImmediatePropagation();}},true);
  }

  function scan(){document.querySelectorAll('.n11-live-toast').forEach(attachSwipe)}
  var observer=new MutationObserver(scan);
  function start(){
    scan();observer.observe(document.body,{childList:true,subtree:true});
    if('serviceWorker'in navigator){navigator.serviceWorker.getRegistration('/').then(function(reg){if(reg)reg.update().catch(function(){})}).catch(function(){})}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
