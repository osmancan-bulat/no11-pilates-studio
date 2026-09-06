(function(){
  'use strict';

  var APPOINTMENTS_KEY='no11-appointments';
  var ADMIN_KEY_STORAGE='no11-admin-api-key';
  var syncing=false;
  var nativeSetItem=Storage.prototype.setItem;
  var nativeRemoveItem=Storage.prototype.removeItem;

  function parse(value){try{var data=JSON.parse(value||'[]');return Array.isArray(data)?data:[]}catch(e){return []}}
  function key(){return sessionStorage.getItem(ADMIN_KEY_STORAGE)||''}
  function headers(){return {'content-type':'application/json','x-no11-admin-key':key()}}
  function same(a,b){try{return JSON.stringify(a)===JSON.stringify(b)}catch(e){return false}}
  function byId(items){var out={};items.forEach(function(x){if(x&&x.id)out[String(x.id)]=x});return out}

  function request(url,options){
    options=options||{};
    options.headers=Object.assign({},headers(),options.headers||{});
    options.cache='no-store';
    return fetch(url,options).then(function(r){
      if(r.status===401){sessionStorage.removeItem(ADMIN_KEY_STORAGE);throw new Error('unauthorized')}
      if(!r.ok)throw new Error('request_'+r.status);
      return r.status===204?null:r.json();
    });
  }

  function saveOne(item){
    if(!item||!item.id||!key())return Promise.resolve();
    return request('/api/no11-appointments',{method:'PUT',body:JSON.stringify(item)}).catch(function(){});
  }

  function removeOne(id){
    if(!id||!key())return Promise.resolve();
    return request('/api/no11-appointments?id='+encodeURIComponent(id),{method:'DELETE'}).catch(function(){});
  }

  function syncChange(previous,next){
    if(syncing||!key())return;
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
    var localMap=byId(local),remoteMap=byId(remote),merged=[];
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
    script.src='/no11-admin-premium.js?v=22';
    script.defer=true;
    script.dataset.no11PremiumLoader='1';
    document.head.appendChild(script);
  }

  function boot(){
    var adminKey=key();
    if(!adminKey){
      adminKey=window.prompt('No.11 Yönetici Erişim Anahtarı');
      if(adminKey)sessionStorage.setItem(ADMIN_KEY_STORAGE,adminKey.trim());
    }
    if(!key()){loadPremium();return}
    request('/api/no11-appointments?ts='+Date.now())
      .then(function(data){mergeAndMigrate(Array.isArray(data.appointments)?data.appointments:[])})
      .catch(function(){})
      .finally(loadPremium);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
