(function(){
  'use strict';
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function readTeam(){try{var x=JSON.parse(localStorage.getItem('no11-team')||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
  document.addEventListener('click',function(event){
    var button=event.target&&event.target.closest&&event.target.closest('[data-edit-team]');
    if(!button||typeof button.onclick==='function')return;
    var modal=document.querySelector('.n11-modal'),form=modal&&modal.querySelector('form'),fields=modal&&modal.querySelector('.n11-modal-fields');
    if(!modal||!form||!fields)return;
    var item=readTeam().find(function(x){return String(x.id)===String(button.dataset.editTeam)});
    if(!item){
      var card=button.closest('.n11-team-card');
      item={id:button.dataset.editTeam,name:card&&card.querySelector('h2')?card.querySelector('h2').textContent.trim():'',role:card&&card.querySelector('p')?card.querySelector('p').textContent.trim():'',bio:card&&card.querySelector('small')?card.querySelector('small').textContent.trim():'',active:true,image:''};
    }
    form.dataset.type='team';form.dataset.id=item.id||button.dataset.editTeam||'';
    var eye=modal.querySelector('.n11-modal-eye'),title=modal.querySelector('.n11-modal-title');
    if(eye)eye.textContent='EKİP YÖNETİMİ';
    if(title)title.textContent='Ekip üyesini düzenle';
    fields.innerHTML='<div class="n11-photo-field"><div class="n11-photo-preview">'+(item.image?'<img src="'+esc(item.image)+'" alt="Fotoğraf önizleme">':'<span>Fotoğraf yok</span>')+'</div><div><b>Profil fotoğrafı</b><small>Fotoğraf 4:5 oranında hazırlanır.</small></div></div><label>Ad soyad<input name="name" required value="'+esc(item.name)+'"></label><label>Görev<input name="role" required value="'+esc(item.role)+'"></label><label>Biyografi<textarea name="bio">'+esc(item.bio||'')+'</textarea></label><label class="n11-check">Aktif<input type="checkbox" name="active" '+(item.active!==false?'checked':'')+'></label>';
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');
    setTimeout(function(){var first=fields.querySelector('input[name="name"]');if(first)first.focus()},20);
  },false);
})();