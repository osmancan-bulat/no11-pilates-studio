(function(){
  'use strict';

  var KEY='no11-appointments';
  var SEEN_PENDING_KEY='no11-admin-seen-pending-v1';
  var syncing=false;
  var ready=false;
  var polling=false;
  var savingUntil=0;
  var knownSignature='';
  var knownPending={};
  var nativeGetItem=Storage.prototype.getItem;
  var nativeSetItem=Storage.prototype.setItem;
  var nativeRemoveItem=Storage.prototype.removeItem;

  function parse(value){
    try{
      var data=JSON.parse(value||'[]');
      return Array.isArray(data)?data:[];
    }catch(e){return []}
  }

  function byId(items){
    var out={};
    items.forEach(function(item){
      if(item&&item.id)out[String(item.id)]=item;
    });
    return out;
  }

  function signature(items){
    return JSON.stringify((Array.isArray(items)?items:[]).map(function(item){
      item=item||{};
      return {
        id:String(item.id||''),
        name:String(item.name||''),
        phone:String(item.phone||''),
        service:String(item.service||item.lesson||'Pilates'),
        date:String(item.date||''),
        time:String(item.time||''),
        studentNote:String(item.studentNote||item.note||''),
        managerNote:String(item.managerNote||''),
        status:String(item.status||'pending').toLowerCase(),
        createdAt:String(item.createdAt||'')
      };
    }).sort(function(a,b){
      return a.id.localeCompare(b.id);
    }));
  }

  function pendingIds(items){
    var out={};
    items.forEach(function(item){
      if(item&&item.id&&String(item.status||'pending').toLowerCase()==='pending'){
        out[String(item.id)]=true;
      }
    });
    return out;
  }

  function readSeenPending(){
    var raw=nativeGetItem.call(localStorage,SEEN_PENDING_KEY);
    if(raw===null)return null;
    try{
      var ids=JSON.parse(raw);
      return ids&&typeof ids==='object'?ids:{};
    }catch(e){return {}}
  }

  function rememberPending(ids){
    nativeSetItem.call(localStorage,SEEN_PENDING_KEY,JSON.stringify(ids||{}));
  }

  function recentPendingId(items){
    var cutoff=Date.now()-120000;
    var recent=(Array.isArray(items)?items:[]).filter(function(item){
      return item&&item.id&&String(item.status||'pending').toLowerCase()==='pending'&&Date.parse(item.createdAt||0)>=cutoff;
    }).sort(function(a,b){
      return Date.parse(b.createdAt||0)-Date.parse(a.createdAt||0);
    });
    return recent[0]?String(recent[0].id):'';
  }

  function request(url,options){
    options=options||{};
    options.cache='no-store';
    options.credentials='same-origin';
    options.headers=Object.assign({'content-type':'application/json'},options.headers||{});
    return fetch(url,options).then(function(response){
      if(!response.ok)throw new Error('request_'+response.status);
      return response.status===204?null:response.json();
    });
  }

  function showToast(){
    var old=document.querySelector('.n11-live-toast');
    if(old)old.remove();
    var toast=document.createElement('div');
    toast.className='n11-live-toast';
    toast.setAttribute('role','status');
    toast.setAttribute('aria-live','assertive');
    toast.textContent='Yeni randevu geldi';
    toast.style.setProperty('position','fixed','important');
    toast.style.setProperty('left','16px','important');
    toast.style.setProperty('right','16px','important');
    toast.style.setProperty('top','max(16px, env(safe-area-inset-top))','important');
    toast.style.setProperty('bottom','auto','important');
    toast.style.setProperty('z-index','2147483647','important');
    toast.style.setProperty('display','block','important');
    toast.style.setProperty('visibility','visible','important');
    toast.style.setProperty('opacity','1','important');
    toast.style.setProperty('transform','none','important');
    toast.style.setProperty('padding','18px 20px','important');
    toast.style.setProperty('border-radius','14px','important');
    toast.style.setProperty('background','#281e2b','important');
    toast.style.setProperty('color','#ffffff','important');
    toast.style.setProperty('border','1px solid #d3af5f','important');
    toast.style.setProperty('box-shadow','0 18px 48px rgba(25,18,28,.4)','important');
    toast.style.setProperty('font','700 16px/1.25 Arial,sans-serif','important');
    toast.style.setProperty('text-align','center','important');
    document.body.appendChild(toast);
    toast.classList.add('show');
    setTimeout(function(){
      toast.classList.remove('show');
      setTimeout(function(){toast.remove()},220);
    },15000);
  }

  function activePage(){
    var button=document.querySelector('.n11-main-side [data-page].active');
    return button&&button.dataset.page||'dashboard';
  }

  function reloadOn(page,delay){
    sessionStorage.setItem('no11-admin-return-page',page||activePage());
    setTimeout(function(){location.reload()},delay);
  }

  function restorePage(){
    var page=sessionStorage.getItem('no11-admin-return-page');
    if(!page)return;
    sessionStorage.removeItem('no11-admin-return-page');
    var attempts=0;
    var timer=setInterval(function(){
      attempts++;
      var button=document.querySelector('.n11-main-side [data-page="'+page+'"]');
      if(button){
        clearInterval(timer);
        button.click();
      }else if(attempts>30){
        clearInterval(timer);
      }
    },100);
  }

  function applyRemote(items){
    syncing=true;
    nativeSetItem.call(localStorage,KEY,JSON.stringify(items));
    syncing=false;
    window.dispatchEvent(new CustomEvent('no11-appointments-updated'));
  }

  function saveChanges(previous,next){
    if(syncing||!ready)return;
    var before=byId(previous),after=byId(next),jobs=[];
    Object.keys(after).forEach(function(id){
      if(!before[id]||signature([before[id]])!==signature([after[id]])){
        jobs.push(request('/api/no11-appointments',{
          method:'PUT',
          body:JSON.stringify(after[id])
        }));
      }
    });
    Object.keys(before).forEach(function(id){
      if(!after[id]){
        jobs.push(request('/api/no11-appointments?id='+encodeURIComponent(id),{method:'DELETE'}));
      }
    });
    if(!jobs.length)return;
    savingUntil=Date.now()+3500;
    Promise.allSettled(jobs).then(function(){
      knownSignature=signature(next);
      knownPending=pendingIds(next);
      savingUntil=Date.now()+700;
    });
  }

  Storage.prototype.setItem=function(key,value){
    if(this===localStorage&&key===KEY){
      var previous=parse(nativeGetItem.call(localStorage,KEY));
      nativeSetItem.call(this,key,value);
      saveChanges(previous,parse(value));
      return;
    }
    return nativeSetItem.call(this,key,value);
  };

  Storage.prototype.removeItem=function(key){
    if(this===localStorage&&key===KEY){
      var previous=parse(nativeGetItem.call(localStorage,KEY));
      nativeRemoveItem.call(this,key);
      saveChanges(previous,[]);
      return;
    }
    return nativeRemoveItem.call(this,key);
  };

  function fetchRemote(initial){
    if(polling||document.hidden||Date.now()<savingUntil)return;
    polling=true;
    request('/api/no11-appointments?ts='+Date.now())
      .then(function(data){
        var remote=Array.isArray(data&&data.appointments)?data.appointments:[];
        var nextSignature=signature(remote);
        var nextPending=pendingIds(remote);
        if(initial){
          var seenPending=readSeenPending();
          var recentId=recentPendingId(remote);
          var lastNotified=sessionStorage.getItem('no11-admin-last-notified');
          var hasNewSinceLastVisit=seenPending!==null&&Object.keys(nextPending).some(function(id){
            return !seenPending[id];
          });
          if(recentId&&recentId!==lastNotified)hasNewSinceLastVisit=true;
          knownSignature=nextSignature;
          knownPending=nextPending;
          rememberPending(nextPending);
          ready=true;
          var localSignature=signature(parse(localStorage.getItem(KEY)));
          var initialMarker=sessionStorage.getItem('no11-admin-initial-sync');
          if(hasNewSinceLastVisit){
            if(localSignature!==nextSignature)applyRemote(remote);
            sessionStorage.removeItem('no11-admin-initial-sync');
            if(recentId)sessionStorage.setItem('no11-admin-last-notified',recentId);
            showToast();
            reloadOn(activePage(),15250);
            return;
          }
          if(localSignature!==nextSignature){
            applyRemote(remote);
            if(initialMarker!==nextSignature){
              sessionStorage.setItem('no11-admin-initial-sync',nextSignature);
              reloadOn(activePage(),80);
            }else{
              sessionStorage.removeItem('no11-admin-initial-sync');
            }
          }else{
            sessionStorage.removeItem('no11-admin-initial-sync');
          }
          return;
        }
        if(nextSignature===knownSignature)return;
        var hasNew=Object.keys(nextPending).some(function(id){return !knownPending[id]});
        knownSignature=nextSignature;
        knownPending=nextPending;
        rememberPending(nextPending);
        applyRemote(remote);
        if(hasNew){
          showToast();
          reloadOn(activePage(),15250);
        }else{
          reloadOn(activePage(),120);
        }
      })
      .catch(function(){})
      .then(function(){polling=false});
  }

  function addStyle(){
    if(document.getElementById('n11-live-sync-style'))return;
    var style=document.createElement('style');
    style.id='n11-live-sync-style';
    style.textContent='.n11-live-toast{position:fixed;right:24px;top:24px;z-index:2147483000;padding:17px 22px;border-radius:13px;background:#281e2b;color:#fff;border:1px solid rgba(211,175,95,.65);box-shadow:0 18px 48px rgba(25,18,28,.35);font:700 15px/1.2 Arial,sans-serif;letter-spacing:.01em;opacity:0;transform:translateY(-10px);transition:opacity .2s ease,transform .2s ease}.n11-live-toast.show{opacity:1;transform:none}@media(max-width:760px){.n11-live-toast{left:16px;right:16px;top:16px;text-align:center;padding:18px 20px;font-size:16px}}';
    document.head.appendChild(style);
  }

  function start(){
    addStyle();
    restorePage();
    fetchRemote(true);
    setInterval(function(){fetchRemote(false)},4000);
    document.addEventListener('visibilitychange',function(){
      if(!document.hidden)fetchRemote(false);
    });
    window.addEventListener('focus',function(){fetchRemote(false)});
    window.addEventListener('pageshow',function(){fetchRemote(false)});
    window.addEventListener('online',function(){fetchRemote(false)});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }
})();
