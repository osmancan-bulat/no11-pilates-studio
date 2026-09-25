(function(){
  'use strict';

  var TEAM_KEY='no11-team';
  var EDITOR_ID='no11-team-editor-fixed';

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function readTeam(){try{var x=JSON.parse(localStorage.getItem(TEAM_KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
  function closeEditor(){var old=document.getElementById(EDITOR_ID);if(old)old.remove()}

  function stripPremiumTeamEditHandlers(){
    document.querySelectorAll('[data-edit-team]').forEach(function(btn){
      btn.type='button';
      btn.removeAttribute('form');
    });
    document.querySelectorAll('[data-remove-team]').forEach(function(btn){btn.type='button'});
  }

  function closePremiumModal(){
    document.querySelectorAll('.n11-modal.open').forEach(function(modal){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
    });
  }

  function resolveItem(id,card){
    var team=readTeam();
    var item=team.find(function(x){return String(x.id)===String(id)});
    if(item)return item;
    if(!card)return null;
    var name=card.querySelector('h2'),role=card.querySelector('p'),bio=card.querySelector('small'),img=card.querySelector('img');
    return {id:id,name:name?name.textContent.trim():'',role:role?role.textContent.trim():'',bio:bio?bio.textContent.trim():'',active:true,image:img?img.src:''};
  }

  function openEditor(id,card){
    closePremiumModal();
    closeEditor();
    var item=resolveItem(id,card);if(!item)return;
    var dark=!!document.querySelector('main.n11-v4.n11-dark');
    var editor=document.createElement('div');
    editor.id=EDITOR_ID;
    editor.className=dark?'dark':'';
    editor.innerHTML='<style>\
#'+EDITOR_ID+'{position:fixed!important;inset:0!important;z-index:2147483647!important;display:grid!important;place-items:center!important;padding:24px!important;background:transparent!important;pointer-events:none!important;font-family:Arial,sans-serif!important}\
#'+EDITOR_ID+' .n11te-card{pointer-events:auto!important;position:relative!important;width:min(620px,calc(100vw - 48px))!important;max-height:90vh!important;overflow:auto!important;box-sizing:border-box!important;padding:30px!important;border:1px solid #e4ded8!important;border-radius:20px!important;background:#fff!important;color:#211d20!important;box-shadow:0 28px 80px rgba(0,0,0,.28)!important}\
#'+EDITOR_ID+'.dark .n11te-card{background:#242126!important;color:#f6f1f5!important;border-color:#403a43!important}\
#'+EDITOR_ID+' .n11te-close{position:absolute!important;right:18px!important;top:16px!important;width:38px!important;height:38px!important;border:1px solid #ddd4cf!important;border-radius:10px!important;background:transparent!important;color:inherit!important;font-size:24px!important;cursor:pointer!important}\
#'+EDITOR_ID+' .n11te-eye{margin:0 0 8px!important;color:#b67d28!important;font:700 10px/1 Arial,sans-serif!important;letter-spacing:.25em!important}\
#'+EDITOR_ID+' h2{margin:0 0 24px!important;color:inherit!important;font:30px/1.1 Georgia,serif!important}\
#'+EDITOR_ID+' form{display:grid!important;gap:16px!important}\
#'+EDITOR_ID+' label{display:grid!important;gap:7px!important;color:inherit!important;font:700 11px/1.3 Arial,sans-serif!important;letter-spacing:.06em!important}\
#'+EDITOR_ID+' input,#'+EDITOR_ID+' textarea{box-sizing:border-box!important;width:100%!important;border:1px solid #ddd4cf!important;border-radius:10px!important;background:#fbfaf9!important;color:#211d20!important;padding:12px 13px!important;font:14px Arial,sans-serif!important}\
#'+EDITOR_ID+'.dark input,#'+EDITOR_ID+'.dark textarea{background:#1d1a1f!important;color:#f4eff4!important;border-color:#474149!important}\
#'+EDITOR_ID+' textarea{min-height:110px!important;resize:vertical!important}\
#'+EDITOR_ID+' .n11te-photo{display:grid!important;grid-template-columns:86px 1fr!important;gap:16px!important;align-items:center!important}\
#'+EDITOR_ID+' .n11te-preview{width:82px!important;height:82px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:#eee8e1!important;color:#756c66!important;font-size:11px!important}\
#'+EDITOR_ID+' .n11te-preview img{width:100%!important;height:100%!important;object-fit:cover!important}\
#'+EDITOR_ID+' .n11te-check{grid-template-columns:1fr auto!important;align-items:center!important}\
#'+EDITOR_ID+' .n11te-check input{width:18px!important;height:18px!important}\
#'+EDITOR_ID+' .n11te-save{height:48px!important;border:0!important;border-radius:11px!important;background:#b67d28!important;color:#fff!important;font-weight:700!important;cursor:pointer!important}\
@media(max-width:640px){#'+EDITOR_ID+'{padding:12px!important;align-items:end!important}#'+EDITOR_ID+' .n11te-card{width:100%!important;max-height:92vh!important;border-radius:22px!important;padding:26px 20px!important}}\
</style><div class="n11te-card" role="dialog" aria-modal="true" aria-label="Ekip üyesini düzenle"><button type="button" class="n11te-close">×</button><p class="n11te-eye">EKİP YÖNETİMİ</p><h2>Ekip üyesini düzenle</h2><form><div class="n11te-photo"><div class="n11te-preview">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'Fotoğraf yok')+'</div><label>Fotoğraf seç<input type="file" accept="image/jpeg,image/png,image/webp"></label></div><label>Ad soyad<input name="name" required value="'+esc(item.name)+'"></label><label>Görev<input name="role" required value="'+esc(item.role)+'"></label><label>Biyografi<textarea name="bio">'+esc(item.bio||'')+'</textarea></label><label class="n11te-check">Aktif<input name="active" type="checkbox" '+(item.active!==false?'checked':'')+'></label><button type="submit" class="n11te-save">Kaydet</button></form></div>';
    document.body.appendChild(editor);

    var form=editor.querySelector('form'),file=editor.querySelector('input[type=file]'),preview=editor.querySelector('.n11te-preview'),pendingImage=item.image||'';
    editor.querySelector('.n11te-close').onclick=closeEditor;
    file.onchange=function(){var f=file.files&&file.files[0];if(!f)return;var reader=new FileReader();reader.onload=function(){pendingImage=reader.result;preview.innerHTML='<img src="'+esc(pendingImage)+'" alt="">'};reader.readAsDataURL(f)};
    form.onsubmit=function(e){
      e.preventDefault();
      var data=new FormData(form),button=form.querySelector('.n11te-save');button.disabled=true;button.textContent='Kaydediliyor…';
      var team=readTeam(),index=team.findIndex(function(x){return String(x.id)===String(id)}),base=index>=0?team[index]:item;
      var updated=Object.assign({},base,{id:id,name:String(data.get('name')||'').trim(),role:String(data.get('role')||'').trim(),bio:String(data.get('bio')||'').trim(),active:data.get('active')==='on'});
      if(pendingImage)updated.image=pendingImage;
      if(index>=0)team[index]=updated;else team.push(updated);
      localStorage.setItem(TEAM_KEY,JSON.stringify(team));
      fetch('/api/no11-team',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({team:team})}).then(function(r){if(!r.ok)throw new Error('save');location.reload()}).catch(function(){button.disabled=false;button.textContent='Kaydet';alert('Kaydedilemedi. Lütfen tekrar deneyin.')});
    };
    var first=form.querySelector('input[name=name]');if(first)first.focus();
  }

  stripPremiumTeamEditHandlers();
  new MutationObserver(function(){stripPremiumTeamEditHandlers()}).observe(document.documentElement,{subtree:true,childList:true});
})();
