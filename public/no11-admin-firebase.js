(function(){
  'use strict';

  var APPOINTMENTS_KEY='no11-appointments';
  var syncing=false;
  var authenticated=false;
  var nativeSetItem=Storage.prototype.setItem;
  var nativeRemoveItem=Storage.prototype.removeItem;

  function parse(value){try{var data=JSON.parse(value||'[]');return Array.isArray(data)?data:[]}catch(e){return []}}
  function same(a,b){try{return JSON.stringify(a)===JSON.stringify(b)}catch(e){return false}}
  function byId(items){var out={};items.forEach(function(x){if(x&&x.id)out[String(x.id)]=x});return out}

  function request(url,options){
    options=options||{};
    options.headers=Object.assign({'content-type':'application/json'},options.headers||{});
    options.cache='no-store';
    options.credentials='same-origin';
    return fetch(url,options).then(function(r){
      if(r.status===401){var e=new Error('unauthorized');e.status=401;throw e}
      if(!r.ok){var err=new Error('request_'+r.status);err.status=r.status;throw err}
      return r.status===204?null:r.json();
    });
  }

  function saveOne(item){
    if(!item||!item.id||!authenticated)return Promise.resolve();
    return request('/api/no11-appointments',{method:'PUT',body:JSON.stringify(item)}).catch(function(){});
  }

  function removeOne(id){
    if(!id||!authenticated)return Promise.resolve();
    return request('/api/no11-appointments?id='+encodeURIComponent(id),{method:'DELETE'}).catch(function(){});
  }

  function syncChange(previous,next){
    if(syncing||!authenticated)return;
    var before=byId(previous),after=byId(next);
    Object.keys(after).forEach(function(id){if(!before[id]||!same(before[id],after[id]))saveOne(after[id])});
    Object.keys(before).forEach(function(id){if(!after[id])removeOne(id)});
  }

  Storage.prototype.setItem=function(k,v){
    if(this===localStorage&&k===APPOINTMENTS_KEY){
      var previous=parse(localStorage.getItem(APPOINTMENTS_KEY));
      nativeSetItem.call(this,k,v);
      syncChange(previous,parse(v));
      return;
    }
    return nativeSetItem.call(this,k,v);
  };

  Storage.prototype.removeItem=function(k){
    if(this===localStorage&&k===APPOINTMENTS_KEY){
      var previous=parse(localStorage.getItem(APPOINTMENTS_KEY));
      nativeRemoveItem.call(this,k);
      syncChange(previous,[]);
      return;
    }
    return nativeRemoveItem.call(this,k);
  };

  function mergeAndMigrate(remote){
    var local=parse(localStorage.getItem(APPOINTMENTS_KEY));
    var remoteMap=byId(remote),merged=[];
    remote.forEach(function(item){if(item&&item.id)merged.push(item)});
    local.forEach(function(item){
      if(!item||!item.id)return;
      if(!remoteMap[String(item.id)]){merged.push(item);saveOne(item)}
    });
    syncing=true;
    nativeSetItem.call(localStorage,APPOINTMENTS_KEY,JSON.stringify(merged));
    syncing=false;
  }

  function loadPremium(){
    if(document.querySelector('script[data-no11-premium-loader]'))return;
    var script=document.createElement('script');
    script.src='/no11-admin-premium.js?v=31';
    script.defer=true;
    script.dataset.no11PremiumLoader='1';
    document.head.appendChild(script);
  }

  function clearBoot(){
    var boot=document.getElementById('n11-admin-boot');
    if(boot)boot.remove();
  }

  function showLogin(){
    clearBoot();
    if(document.getElementById('no11-admin-login-overlay'))return;

    var overlay=document.createElement('div');
    overlay.id='no11-admin-login-overlay';
    overlay.innerHTML='\
      <div class="no11-login-card">\
        <div class="no11-login-mark">No.11</div>\
        <div class="no11-login-kicker">YÖNETİCİ PANELİ</div>\
        <h1>Hoş geldiniz</h1>\
        <p>Devam etmek için yönetici bilgilerinizi girin.</p>\
        <form id="no11-admin-login-form" autocomplete="on">\
          <label>Kullanıcı adı<input name="username" autocomplete="username" autocapitalize="none" required></label>\
          <label>Şifre<input name="password" type="password" autocomplete="current-password" required></label>\
          <div id="no11-login-error" role="alert"></div>\
          <button type="submit">Giriş Yap</button>\
        </form>\
      </div>';

    var style=document.createElement('style');
    style.id='no11-admin-login-style';
    style.textContent='#no11-admin-login-overlay{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:24px;background:#f4f1ed;font-family:Inter,Arial,sans-serif;color:#2b2724}#no11-admin-login-overlay:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 20%,rgba(255,255,255,.95),rgba(244,241,237,.72) 48%,rgba(235,229,223,.88));pointer-events:none}.no11-login-card{position:relative;width:min(100%,420px);padding:42px 38px 36px;border:1px solid #ded6cf;border-radius:22px;background:rgba(255,255,255,.92);box-shadow:0 28px 70px rgba(48,39,33,.12)}.no11-login-mark{font:36px/1 Georgia,serif;letter-spacing:-.055em}.no11-login-kicker{margin-top:22px;font-size:9px;font-weight:800;letter-spacing:.22em;color:#9c8272}.no11-login-card h1{margin:10px 0 6px;font:32px/1.15 Georgia,serif}.no11-login-card p{margin:0 0 26px;color:#776e67;font-size:13px;line-height:1.6}.no11-login-card form{display:grid;gap:16px}.no11-login-card label{display:grid;gap:7px;font-size:10px;font-weight:700;letter-spacing:.08em;color:#665c55;text-transform:uppercase}.no11-login-card input{width:100%;height:48px;box-sizing:border-box;padding:0 14px;border:1px solid #d9d0c8;border-radius:11px;background:#fff;color:#292522;font-size:15px;outline:none}.no11-login-card input:focus{border-color:#7e6a5e;box-shadow:0 0 0 3px rgba(126,106,94,.1)}#no11-login-error{min-height:16px;color:#a34f47;font-size:12px}.no11-login-card button{height:50px;border:0;border-radius:11px;background:#282421;color:#fff;font-weight:700;letter-spacing:.04em;cursor:pointer}.no11-login-card button:disabled{opacity:.6;cursor:wait}@media(max-width:520px){.no11-login-card{padding:34px 24px 28px;border-radius:18px}.no11-login-card h1{font-size:28px}}';
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    var form=document.getElementById('no11-admin-login-form');
    var errorBox=document.getElementById('no11-login-error');
    form.addEventListener('submit',function(event){
      event.preventDefault();
      errorBox.textContent='';
      var button=form.querySelector('button');button.disabled=true;button.textContent='Giriş yapılıyor…';
      var data=new FormData(form);
      request('/api/no11-admin-login',{method:'POST',body:JSON.stringify({username:data.get('username'),password:data.get('password')})})
        .then(function(){
          authenticated=true;
          overlay.remove();
          if(style.parentNode)style.remove();
          return loadAppointments();
        })
        .catch(function(err){
          if(err&&err.status===401)errorBox.textContent='Kullanıcı adı veya şifre hatalı.';
          else errorBox.textContent='Giriş sırasında bir sorun oluştu. Lütfen tekrar deneyin.';
          button.disabled=false;button.textContent='Giriş Yap';
        });
    });
  }

  function loadAppointments(){
    return request('/api/no11-appointments?ts='+Date.now())
      .then(function(data){
        authenticated=true;
        mergeAndMigrate(Array.isArray(data.appointments)?data.appointments:[]);
        loadPremium();
      })
      .catch(function(err){
        if(err&&err.status===401){authenticated=false;showLogin();return}
        clearBoot();
        loadPremium();
      });
  }

  function boot(){loadAppointments()}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
