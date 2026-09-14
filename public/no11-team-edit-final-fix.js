(function(){
  'use strict';

  var TEAM_KEY='no11-team';
  var OVERLAY_ID='no11-team-isolated-editor';

  function readTeam(){
    try{var value=JSON.parse(localStorage.getItem(TEAM_KEY)||'[]');return Array.isArray(value)?value:[]}catch(e){return []}
  }

  function saveTeam(team){
    localStorage.setItem(TEAM_KEY,JSON.stringify(team));
    return fetch('/api/no11-team',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({team:team})}).then(function(r){if(!r.ok)throw new Error('save');return r.json()})
  }

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

  function closeEditor(){var old=document.getElementById(OVERLAY_ID);if(old)old.remove()}

  function openEditor(id,card){
    closeEditor();
    var team=readTeam();
    var item=team.find(function(x){return String(x.id)===String(id)});
    if(!item&&card){
      var title=card.querySelector('h2'),role=card.querySelector('p'),bio=card.querySelector('small'),img=card.querySelector('img');
      item={id:id,name:title?title.textContent.trim():'',role:role?role.textContent.trim():'',bio:bio?bio.textContent.trim():'',active:true,image:img?img.src:''};
    }
    if(!item)return;

    var dark=!!document.querySelector('main.n11-v4.n11-dark');
    var overlay=document.createElement('div');
    overlay.id=OVERLAY_ID;
    overlay.className=dark?'dark':'';
    overlay.innerHTML='<div class="n11iso-card" role="dialog" aria-modal="true" aria-label="Ekip üyesini düzenle">'+
      '<button type="button" class="n11iso-close" aria-label="Kapat">×</button>'+
      '<p class="n11iso-eye">EKİP YÖNETİMİ</p><h2>Ekip üyesini düzenle</h2>'+
      '<form><div class="n11iso-photo"><div class="n11iso-preview">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'Fotoğraf yok')+'</div><label>Fotoğraf seç<input type="file" accept="image/jpeg,image/png,image/webp"></label></div>'+
      '<label>Ad soyad<input name="name" required value="'+esc(item.name)+'"></label>'+
      '<label>Görev<input name="role" required value="'+esc(item.role)+'"></label>'+
      '<label>Biyografi<textarea name="bio">'+esc(item.bio||'')+'</textarea></label>'+
      '<label class="n11iso-check">Aktif<input name="active" type="checkbox" '+(item.active!==false?'checked':'')+'></label>'+
      '<button class="n11iso-save" type="submit">Kaydet</button></form></div>';

    var style=document.createElement('style');
    style.textContent='#'+OVERLAY_ID+'{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:24px;background:rgba(17,15,18,.28);backdrop-filter:blur(3px);font-family:Arial,sans-serif}#'+OVERLAY_ID+' .n11iso-card{position:relative;width:min(620px,100%);max-height:90vh;overflow:auto;box-sizing:border-box;padding:30px;border-radius:20px;border:1px solid #e4ded8;background:#fff;color:#211d20;box-shadow:0 28px 80px rgba(0,0,0,.22)}#'+OVERLAY_ID+'.dark .n11iso-card{background:#242126;color:#f6f1f5;border-color:#403a43}#'+OVERLAY_ID+' .n11iso-close{position:absolute;right:18px;top:16px;width:38px;height:38px;border:1px solid #ddd4cf;border-radius:10px;background:transparent;color:inherit;font-size:24px;cursor:pointer}#'+OVERLAY_ID+' .n11iso-eye{margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:.25em;color:#b67d28}#'+OVERLAY_ID+' h2{margin:0 0 24px;font:30px/1.1 Georgia,serif}#'+OVERLAY_ID+' form{display:grid;gap:16px}#'+OVERLAY_ID+' label{display:grid;gap:7px;font-size:11px;font-weight:700;letter-spacing:.06em}#'+OVERLAY_ID+' input,#'+OVERLAY_ID+' textarea{box-sizing:border-box;width:100%;border:1px solid #ddd4cf;border-radius:10px;background:#fbfaf9;color:#211d20;padding:12px 13px;font:14px Arial,sans-serif}#'+OVERLAY_ID+'.dark input,#'+OVERLAY_ID+'.dark textarea{background:#1d1a1f;color:#f4eff4;border-color:#474149}#'+OVERLAY_ID+' textarea{min-height:110px;resize:vertical}#'+OVERLAY_ID+' .n11iso-check{grid-template-columns:1fr auto;align-items:center}#'+OVERLAY_ID+' .n11iso-check input{width:18px;height:18px}#'+OVERLAY_ID+' .n11iso-photo{display:grid;grid-template-columns:86px 1fr;gap:16px;align-items:center}#'+OVERLAY_ID+' .n11iso-preview{width:82px;height:82px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:#eee8e1;font-size:11px;color:#756c66}#'+OVERLAY_ID+' .n11iso-preview img{width:100%;height:100%;object-fit:cover}#'+OVERLAY_ID+' .n11iso-save{height:48px;border:0;border-radius:11px;background:#b67d28;color:#fff;font-weight:700;cursor:pointer}#'+OVERLAY_ID+' .n11iso-save:disabled{opacity:.65;cursor:wait}@media(max-width:640px){#'+OVERLAY_ID+'{padding:0;align-items:end}#'+OVERLAY_ID+' .n11iso-card{width:100%;max-height:92vh;border-radius:22px 22px 0 0;padding:26px 20px}}';
    overlay.appendChild(style);
    document.body.appendChild(overlay);

    var form=overlay.querySelector('form'),fileInput=overlay.querySelector('input[type=file]'),preview=overlay.querySelector('.n11iso-preview'),pendingImage=item.image||'';
    fileInput.addEventListener('change',function(){var file=fileInput.files&&fileInput.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){pendingImage=reader.result;preview.innerHTML='<img src="'+esc(pendingImage)+'" alt="">'};reader.readAsDataURL(file)});
    overlay.querySelector('.n11iso-close').onclick=closeEditor;
    overlay.addEventListener('click',function(e){if(e.target===overlay)closeEditor()});
    form.onsubmit=function(e){
      e.preventDefault();
      var data=new FormData(form),button=form.querySelector('.n11iso-save');
      button.disabled=true;button.textContent='Kaydediliyor…';
      var next=readTeam(),index=next.findIndex(function(x){return String(x.id)===String(id)}),base=index>=0?next[index]:item;
      var updated=Object.assign({},base,{id:id,name:String(data.get('name')||'').trim(),role:String(data.get('role')||'').trim(),bio:String(data.get('bio')||'').trim(),active:data.get('active')==='on'});
      if(pendingImage)updated.image=pendingImage;
      if(index>=0)next[index]=updated;else next.push(updated);
      saveTeam(next).then(function(){location.reload()}).catch(function(){button.disabled=false;button.textContent='Kaydet';alert('Kaydedilemedi. Lütfen tekrar deneyin.')});
    };
    var first=form.querySelector('input[name=name]');if(first)first.focus();
  }

  document.addEventListener('click',function(event){
    var button=event.target&&event.target.closest&&event.target.closest('[data-edit-team]');
    if(!button)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    button.type='button';
    openEditor(button.dataset.editTeam,button.closest('.n11-team-card'));
  },true);

  function normalize(){document.querySelectorAll('[data-edit-team],[data-remove-team]').forEach(function(b){b.type='button'})}
  normalize();
  new MutationObserver(normalize).observe(document.documentElement,{subtree:true,childList:true});
})();