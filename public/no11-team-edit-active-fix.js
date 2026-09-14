(function(){
  'use strict';

  var TEAM_KEY='no11-team';
  var THEME_KEY='no11-admin-theme';

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function readTeam(){try{var x=JSON.parse(localStorage.getItem(TEAM_KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
  function currentTheme(){var main=document.querySelector('main.n11-v4');return {stored:localStorage.getItem(THEME_KEY),dark:!!(main&&main.classList.contains('n11-dark'))}}
  function restoreTheme(t){var main=document.querySelector('main.n11-v4');if(main)main.classList.toggle('n11-dark',t.dark);if(t.stored==null)localStorage.removeItem(THEME_KEY);else localStorage.setItem(THEME_KEY,t.stored)}

  function closeEditor(){var old=document.getElementById('n11-team-edit-isolated');if(old)old.remove()}

  function openEditor(id,button){
    closeEditor();
    var team=readTeam();
    var item=team.find(function(x){return String(x.id)===String(id)})||{};
    var card=button&&button.closest('.n11-team-card');
    if(!item.name&&card){var h=card.querySelector('h2'),p=card.querySelector('p'),s=card.querySelector('small');item={id:id,name:h?h.textContent.trim():'',role:p?p.textContent.trim():'',bio:s?s.textContent.trim():'',active:true}}

    var overlay=document.createElement('div');
    overlay.id='n11-team-edit-isolated';
    overlay.innerHTML='<form class="n11-team-edit-card">'+
      '<button type="button" class="n11-team-edit-close" aria-label="Kapat">×</button>'+
      '<p>EKİP YÖNETİMİ</p><h2>Ekip üyesini düzenle</h2>'+
      '<label>Ad soyad<input name="name" required value="'+esc(item.name||'')+'"></label>'+
      '<label>Görev<input name="role" required value="'+esc(item.role||'')+'"></label>'+
      '<label>Biyografi<textarea name="bio">'+esc(item.bio||'')+'</textarea></label>'+
      '<label class="n11-team-edit-check"><span>Aktif</span><input type="checkbox" name="active" '+(item.active!==false?'checked':'')+'></label>'+
      '<button type="submit" class="n11-team-edit-save">Kaydet</button>'+
      '</form>';
    overlay.style.cssText='position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:24px;background:rgba(25,18,28,.52);box-sizing:border-box';
    var style=document.createElement('style');
    style.textContent='#n11-team-edit-isolated .n11-team-edit-card{position:relative;width:min(540px,100%);max-height:calc(100vh - 48px);overflow:auto;box-sizing:border-box;padding:30px;border:1px solid #e6e0dc;border-radius:18px;background:#fff;color:#261f28;box-shadow:0 28px 90px rgba(0,0,0,.28);font-family:Arial,sans-serif}#n11-team-edit-isolated p{margin:0;color:#a86549;font-size:10px;letter-spacing:.2em}#n11-team-edit-isolated h2{margin:8px 0 24px;font:30px Georgia,serif}#n11-team-edit-isolated label{display:grid;gap:7px;margin:0 0 14px;font-size:13px;color:#514952}#n11-team-edit-isolated input,#n11-team-edit-isolated textarea{width:100%;box-sizing:border-box;border:1px solid #ddd6dc;border-radius:9px;background:#fbfaf9;color:#211b24;padding:11px 12px;font:14px Arial,sans-serif}#n11-team-edit-isolated textarea{min-height:100px;resize:vertical}#n11-team-edit-isolated .n11-team-edit-check{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-top:1px solid #eee8ec}#n11-team-edit-isolated .n11-team-edit-check input{width:20px;height:20px}#n11-team-edit-isolated .n11-team-edit-save{width:100%;height:48px;margin-top:8px;border:0;border-radius:9px;background:#2b202e;color:#fff;font-weight:700;cursor:pointer}#n11-team-edit-isolated .n11-team-edit-close{position:absolute;right:18px;top:18px;width:38px;height:38px;border:1px solid #ddd6dc;border-radius:50%;background:#fff;color:#312833;font-size:24px;cursor:pointer}@media(max-width:600px){#n11-team-edit-isolated{padding:0;align-items:end}#n11-team-edit-isolated .n11-team-edit-card{width:100%;max-height:92vh;border-radius:18px 18px 0 0}}';
    overlay.appendChild(style);
    document.body.appendChild(overlay);

    overlay.querySelector('.n11-team-edit-close').onclick=closeEditor;
    overlay.addEventListener('click',function(e){if(e.target===overlay)closeEditor()});
    var form=overlay.querySelector('form');
    form.onsubmit=function(e){
      e.preventDefault();
      var d=new FormData(form),all=readTeam(),existing=all.find(function(x){return String(x.id)===String(id)})||item;
      var updated=Object.assign({},existing,{id:id,name:String(d.get('name')||'').trim(),role:String(d.get('role')||'').trim(),bio:String(d.get('bio')||'').trim(),active:d.get('active')==='on'});
      var next=all.some(function(x){return String(x.id)===String(id)})?all.map(function(x){return String(x.id)===String(id)?updated:x}):all.concat(updated);
      localStorage.setItem(TEAM_KEY,JSON.stringify(next));
      var save=form.querySelector('.n11-team-edit-save');save.disabled=true;save.textContent='Kaydediliyor…';
      fetch('/api/no11-team',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({team:next})}).then(function(r){if(!r.ok)throw new Error('save');return r.json()}).then(function(){closeEditor();location.reload()}).catch(function(){save.disabled=false;save.textContent='Kaydet';alert('Kaydetme sırasında bir sorun oluştu. Lütfen tekrar deneyin.')});
    };
    setTimeout(function(){var input=form.querySelector('input[name="name"]');if(input)input.focus()},0);
  }

  document.addEventListener('click',function(e){
    var button=e.target&&e.target.closest?e.target.closest('[data-edit-team]'):null;
    if(!button)return;
    var before=currentTheme();
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openEditor(button.dataset.editTeam,button);
    restoreTheme(before);
    setTimeout(function(){restoreTheme(before)},0);
  },true);
})();