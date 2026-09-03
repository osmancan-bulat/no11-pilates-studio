(function(){
  'use strict';
  var main='/no11-studio-main.jpeg';
  function prepare(){
    var image=document.querySelector('#studyo .gallery-main img');
    if(!image||image.dataset.no11Main==='1')return;
    image.dataset.no11Main='1';image.src=main;image.removeAttribute('srcset');image.alt='No.11 Pilates Studio gün ışığı alan iç mekânı';
  }
  function close(){var viewer=document.querySelector('.no11-gallery-viewer');if(viewer)viewer.remove();document.body.classList.remove('no11-gallery-open')}
  function open(source){
    close();var viewer=document.createElement('div');viewer.className='no11-gallery-viewer';viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');
    var image=document.createElement('img');image.src=source.currentSrc||source.src;image.alt=source.alt||'';
    var button=document.createElement('button');button.type='button';button.className='no11-gallery-viewer-close';button.setAttribute('aria-label','Fotoğrafı kapat');button.textContent='×';
    button.addEventListener('click',close);viewer.appendChild(image);viewer.appendChild(button);document.body.appendChild(viewer);document.body.classList.add('no11-gallery-open');button.focus();
  }
  document.addEventListener('click',function(event){
    var photo=event.target.closest('#studyo .gallery-photo');if(!photo)return;
    var image=photo.querySelector('img');if(!image)return;
    event.preventDefault();event.stopImmediatePropagation();open(image);
  },true);
  document.addEventListener('keydown',function(event){if(event.key==='Escape')close()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepare,{once:true});else prepare();
})();
