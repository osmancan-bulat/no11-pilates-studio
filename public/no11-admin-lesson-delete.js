(function(){
  function closeModal(){
    var modal=document.querySelector('.n11-modal');
    if(!modal)return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }
  function toast(message){
    var existing=document.querySelector('.n11-lesson-delete-toast');
    if(existing)existing.remove();
    var node=document.createElement('div');
    node.className='n11-lesson-delete-toast';
    node.textContent=message;
    node.style.cssText='position:fixed;right:24px;bottom:24px;z-index:2147483647;padding:13px 17px;border-radius:12px;background:#2b212e;color:#fff;font:600 13px Arial,sans-serif;box-shadow:0 12px 32px rgba(0,0,0,.18)';
    document.body.appendChild(node);
    setTimeout(function(){node.remove()},2600);
  }
  function addDeleteButton(editButton){
    setTimeout(function(){
      var modal=document.querySelector('.n11-modal');
      var form=modal&&modal.querySelector('form');
      if(!modal||!form||form.dataset.type!=='lesson'||!form.dataset.id)return;
      var footer=form.querySelector('.n11-modal-actions')||form;
      var existing=form.querySelector('[data-delete-lesson]');
      if(existing)existing.remove();
      var button=document.createElement('button');
      button.type='button';
      button.dataset.deleteLesson=form.dataset.id;
      button.textContent='Dersi Sil';
      button.style.cssText='margin-left:10px;border:1px solid rgba(143,24,33,.28);background:rgba(143,24,33,.06);color:#8f1821;border-radius:10px;padding:12px 16px;font:600 13px Arial,sans-serif;cursor:pointer';
      footer.appendChild(button);
      button.onclick=async function(){
        if(!confirm('Bu dersi silmek istediğinize emin misiniz?'))return;
        button.disabled=true;
        button.textContent='Siliniyor…';
        try{
          var response=await fetch('/api/no11-schedule?ts='+Date.now(),{cache:'no-store'});
          if(!response.ok)throw new Error('load');
          var data=await response.json();
          var lessons=Array.isArray(data.lessons)?data.lessons.filter(function(x){return String(x.id)!==String(form.dataset.id)}):[];
          if(!lessons.length)throw new Error('last');
          var saved=await fetch('/api/no11-schedule',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({lessons:lessons,slots:Array.isArray(data.slots)?data.slots:[],hours:Array.isArray(data.hours)?data.hours:[]})});
          if(!saved.ok)throw new Error('save');
          localStorage.setItem('no11-lessons',JSON.stringify(lessons));
          closeModal();
          toast('Ders silindi');
          setTimeout(function(){location.reload()},350);
        }catch(error){
          button.disabled=false;
          button.textContent='Dersi Sil';
          toast(error&&error.message==='last'?'En az bir ders kalmalı.':'Ders silinemedi, tekrar deneyin.');
        }
      };
    },40);
  }
  document.addEventListener('click',function(event){
    var edit=event.target&&event.target.closest&&event.target.closest('[data-edit-lesson]');
    if(edit)addDeleteButton(edit);
    var add=event.target&&event.target.closest&&event.target.closest('[data-open="lesson"]');
    if(add)setTimeout(function(){var old=document.querySelector('[data-delete-lesson]');if(old)old.remove()},40);
  },true);
})();
