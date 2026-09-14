(function(){
  'use strict';

  var TEAM_KEY='no11-team';
  var OVERLAY_ID='no11-team-isolated-editor';
  var locked=false;

  function readTeam(){try{var value=JSON.parse(localStorage.getItem(TEAM_KEY)||'[]');return Array.isArray(value)?value:[]}catch(e){return []}}
  function saveTeam(team){localStorage.setItem(TEAM_KEY,JSON.stringify(team));return fetch('/api/no11-team',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({team:team})}).then(function(r){if(!r.ok)throw new Error('save');return r.json()})}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function closeEditor(){var old=document.getElementById(OVERLAY_ID);if(old)old.remove()}

  function openEditor(id,card){
    closeEditor();
    var team=readTeam();
    var item=team.find(function(x){return String(x.id)===String(id)});
    if(!item&&card){var title=card.querySelector('h2'),role=card.querySelector('p'),bio=card.querySelector('small'),img=card.querySelector('img');item={id:id,name:title?title.textContent.trim():'',role:role?role.textContent.trim():'',bio:bio?bio.textContent.trim():'',active:true,image:img?img.src:''}}
    if(!item)return;

    var host=document.querySelector('main.n11-v4')||document.body;
    var dark=host.classList&&host.classList.contains('n11-dark');
    var overlay=document.createElement('div');
    overlay.id=OVERLAY_ID;
    overlay.className=dark?'dark':'';
    overlay.innerHTML='<div class="n11iso-card" role="dialog" aria-modal="true" aria-label="Ekip üyesini düzenle"><button type="button" class="n11iso-close" aria-label="Kapat">×</button><p class="n11iso-eye">EKİP YÖNETİMİ</p><h2>Ekip üyesini düzenle</h2><form><div class="n11iso-photo"><div class="n11iso-preview">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'Fotoğraf yok')+'</div><label>Fotoğraf seç<input type="file" accept="image/jpeg,image/png,image/webp"></label></div><label>Ad soyad<input name="name" required value="'+esc(item.name)+'"></label><label>Görev<input name="role" required value="'+esc(item.role)+'"></label><label>Biyografi<textarea name="bio">'+esc(item.bio||'')+'</textarea></label><label class="n11iso-check">Aktif<input name="active" type="checkbox" '+(item.active!==false?'checked':'')+'></label><button class="n11iso-save" type="submit">Kaydet</button></form></div>';

    var style=document.createElement('style');
    style.textContent='#'+OVERLAY_ID+'{visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:fixed!important;inset:0!important;z-index:2147483647!important;display:grid!important;place-items:center!important;padding:24px!important;background:transparent!important;font-family:Arial,sans-serif!important}#'+OVERLAY_ID+' .n11iso-card{visibility:visible!important;opacity:1!important;pointer-events:auto!important;display:block!important;position:relative!important;width:min(620px,calc(100vw - 48px))!important;max-height:90vh!important;overflow:auto!important;box-sizing:border-box!important;padding:30px!important;border-radius:20px!important;border:1px solid #e4ded8!important;background:#fff!important;color:#211d20!important;box-shadow:0 28px 80px rgba(0,0,0,.28)!important}#'+OVERLAY_ID+'.dark .n11iso-card{background:#242126!important;color:#f6f1f5!important;border-color:#403a43!important}#'+OVERLAY_ID+' .n11iso-close{position:absolute!important;right:18px!important;top:16px!important;width:38px!important;height:38px!important;border:1px solid #ddd4cf!important;border-radius:10px!important;background:transparent!important;color:inherit!important;font-size:24px!important;cursor:pointer!important}#'+OVERLAY_ID+' .n11iso-eye{margin:0 0 8px!important;font-size:10px!important;font-weight:700!important;letter-spacing:.25em!important;color:#b67d28!important}#'+OVERLAY_ID+' h2{margin:0 0 24px!important;font:30px/1.1 Georgia,serif!important;color:inherit!important}#'+OVERLAY_ID+' form{display:grid!important;gap:16px!important}#'+OVERLAY_ID+' label{display:grid!important;gap:7px!important;font-size:11px!important;font-weight:700!important;letter-spacing:.06em!important;color:inherit!important}#'+OVERLAY_ID+' input,#'+OVERLAY_ID+' textarea{box-sizing:border-box!important;width:100%!important;border:1px solid #ddd4cf!important;border-radius:10px!important;background:#fbfaf9!important;color:#211d20!important;padding:12px 13px!important;font:14px Arial,sans-serif!important}#'+OVERLAY_ID+'.dark input,#'+OVERLAY_ID+'.dark textarea{background:#1d1a1f!important;color:#f4eff4!important;border-color:#474149!important}#'+OVERLAY_ID+' textarea{min-height:110px!important;resize:vertical!important}#'+OVERLAY_ID+' .n11iso-check{grid-template-columns:1fr auto!important;align-items:center!important}#'+OVERLAY_ID+' .n11iso-check input{width:18px!important;height:18px!important}#'+OVERLAY_ID+' .n11iso-photo{display:grid!important;grid-template-columns:86px 1fr!important;gap:16px!important;align-items:center!important}#'+OVERLAY_ID+' .n11iso-preview{width:82px!important;height:82px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:#eee8e1!important;font-size:11px!important;color:#756c66!important}#'+OVERLAY_ID+' .n11iso-preview img{width:100%!important;height:100%!important;object-fit:cover!important}#'+OVERLAY_ID+' .n11iso-save{height:48px!important;border:0!important;border-radius:11px!important;background:#b67d28!important;color:#fff!important;font-weight:700!important;cursor:pointer!important}#'+OVERLAY_ID+' .n11iso-save:disabled{opacity:.65!important;cursor:wait!important}.n11-v4 .n11-team-grid,.n11-v4 .n11-team-card,.n11-v4 [data-edit-team],.n11-v4 [data-remove-team]{position:relative!important;z-index:200!important;pointer-events:auto!important}@media(max-width:640px){#'+OVERLAY_ID+'{padding:0!important;align-items:end!important}#'+OVERLAY_ID+' .n11iso-card{width:100%!important;max-height:92vh!important;border-radius:22px 22px 0 0!important;padding:26px 20px!important}}';
    overlay.appendChild(style);
    host.appendChild(overlay);

    var form=overlay.querySelector('form'),fileInput=overlay.querySelector('input[type=file]'),preview=overlay.querySelector('.n11iso-preview'),pendingImage=item.image||'';
    fileInput.addEventListener('change',function(){var file=fileInput.files&&fileInput.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){pendingImage=reader.result;preview.innerHTML='<img src="'+esc(pendingImage)+'" alt="">'};reader.readAsDataURL(file)});
    overlay.querySelector('.n11iso-close').onclick=closeEditor;
    overlay.addEventListener('click',function(e){if(e.target===overlay)closeEditor()});
    form.onsubmit=function(e){e.preventDefault();var data=new FormData(form),button=form.querySelector('.n11iso-save');button.disabled=true;button.textContent='Kaydediliyor…';var next=readTeam(),index=next.findIndex(function(x){return String(x.id)===String(id)}),base=index>=0?next[index]:item;var updated=Object.assign({},base,{id:id,name:String(data.get('name')||'').trim(),role:String(data.get('role')||'').trim(),bio:String(data.get('bio')||'').trim(),active:data.get('active')==='on'});if(pendingImage)updated.image=pendingImage;if(index>=0)next[index]=updated;else next.push(updated);saveTeam(next).then(function(){location.reload()}).catch(function(){button.disabled=false;button.textContent='Kaydet';alert('Kaydedilemedi. Lütfen tekrar deneyin.')})};
    var first=form.querySelector('input[name=name]');if(first)first.focus();
  }

  function intercept(event){
    if(document.getElementById(OVERLAY_ID))return;
    var button=event.target&&event.target.closest&&event.target.closest('[data-edit-team]');
    if(!button)return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();button.type='button';
    if(locked)return;locked=true;
    openEditor(button.dataset.editTeam,button.closest('.n11-team-card'));
    setTimeout(function(){locked=false},350);
  }

  window.addEventListener('pointerdown',intercept,true);
  window.addEventListener('click',intercept,true);
  function normalize(){document.querySelectorAll('[data-edit-team],[data-remove-team]').forEach(function(b){b.type='button'})}
  normalize();new MutationObserver(normalize).observe(document.documentElement,{subtree:true,childList:true});
})();