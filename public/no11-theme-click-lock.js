(function(){
  'use strict';
  var KEY='no11-admin-theme';
  var before=null;

  function main(){return document.querySelector('main.n11-v4')}
  function isRealThemeClick(event){
    var button=event.target&&event.target.closest?event.target.closest('.n11-theme'):null;
    if(!button)return false;
    var actions=button.closest('.n11-page-actions,.n11-program-head');
    if(!actions)return false;
    var rect=button.getBoundingClientRect();
    if(rect.width>80||rect.height>80||rect.width<20||rect.height<20)return false;
    if(typeof event.clientX==='number'&&typeof event.clientY==='number'&&(event.clientX||event.clientY)){
      return event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;
    }
    return true;
  }
  function snapshot(){
    var root=main();
    before={stored:localStorage.getItem(KEY),dark:!!(root&&root.classList.contains('n11-dark'))};
  }
  function restore(){
    if(!before)return;
    var root=main();
    if(before.stored===null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,before.stored);
    if(root)root.classList.toggle('n11-dark',before.dark);
  }
  function protect(event){
    if(isRealThemeClick(event)){before=null;return;}
    snapshot();
    setTimeout(restore,0);
    requestAnimationFrame(function(){restore();requestAnimationFrame(restore)});
  }

  document.addEventListener('pointerdown',function(event){
    if(!isRealThemeClick(event))snapshot();else before=null;
  },true);
  document.addEventListener('click',protect,true);
  document.addEventListener('change',function(event){
    if(event.target&&event.target.closest&&event.target.closest('.n11-theme'))return;
    if(!before)snapshot();
    setTimeout(restore,0);
  },true);
})();
