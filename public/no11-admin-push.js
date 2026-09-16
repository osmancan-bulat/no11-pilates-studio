(function(){
'use strict';
if(window.__NO11_ADMIN_PUSH_LOADED__)return;window.__NO11_ADMIN_PUSH_LOADED__=true;
function isIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent);}
function standalone(){return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}
function toast(text){var x=document.createElement('div');x.textContent=text;x.style.cssText='position:fixed;left:50%;bottom:76px;z-index:2147483647;transform:translateX(-50%);padding:12px 16px;border-radius:14px;background:#292624;color:#fff;font:600 13px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;box-shadow:0 12px 35px rgba(0,0,0,.25);max-width:88vw;text-align:center';document.body.appendChild(x);setTimeout(function(){x.remove();},6000);}
function button(){var b=document.getElementById('n11-push-enable');if(!b){b=document.createElement('button');b.id='n11-push-enable';b.type='button';document.body.appendChild(b);}b.style.cssText='position:fixed!important;right:16px!important;bottom:16px!important;z-index:2147483646!important;display:block!important;visibility:visible!important;opacity:1!important;border:1px solid rgba(143,24,33,.25);border-radius:999px;padding:12px 17px;background:#fff;color:#85151e;box-shadow:0 8px 28px rgba(0,0,0,.18);font:600 13px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;cursor:pointer';b.textContent=(window.Notification&&Notification.permission==='granted')?'Bildirimi Etkinleştir':'Bildirimleri Aç';return b;}
function b64urlToUint8Array(value){var padding='='.repeat((4-value.length%4)%4);var base64=(value+padding).replace(/-/g,'+').replace(/_/g,'/');var raw=atob(base64);var out=new Uint8Array(raw.length);for(var i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;}
async function enable(){
 if(!('serviceWorker'in navigator)||!('Notification'in window)||!('PushManager'in window))throw new Error('unsupported');
 if(isIOS()&&!standalone())throw new Error('not_standalone');
 var permission=Notification.permission;if(permission!=='granted')permission=await Notification.requestPermission();if(permission!=='granted')throw new Error('permission_'+permission);
 toast('Bildirim kuruluyor…');
 var cfg=await fetch('/api/no11-push',{credentials:'same-origin',cache:'no-store'});if(!cfg.ok)throw new Error('config_'+cfg.status);var info=await cfg.json();if(!info.enabled||!info.vapidKey)throw new Error('config_missing');
 var reg=await navigator.serviceWorker.register('/firebase-messaging-sw.js?v=20260916-native-1',{scope:'/'});await navigator.serviceWorker.ready;
 var sub=await reg.pushManager.getSubscription();if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64urlToUint8Array(info.vapidKey)});
 if(!sub)throw new Error('subscription_missing');
 var token=JSON.stringify(sub.toJSON());
 var save=await fetch('/api/no11-push',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify({token:token,label:'Osman iPhone',type:'webpush',subscription:sub.toJSON()})});if(!save.ok)throw new Error('save_'+save.status);
 localStorage.setItem('no11_push_subscription',token);var b=button();b.textContent='Bildirimler Açık ✓';toast('Telefon kaydedildi ✓');
}
function explain(e){var m=String(e&&e.message||e);console.error('No11 push:',e);if(m==='not_standalone')return 'iPhone’da No11’i Ana Ekrandaki simgesinden aç.';if(m.indexOf('permission_denied')>=0)return 'Bildirim izni kapalı. iPhone Ayarlar > Bildirimler > No11 bölümünden aç.';if(m==='unsupported')return 'Bu iPhone/iOS sürümünde web push kullanılamıyor.';return 'Bildirim kurulamadı: '+m;}
function init(){var b=button();if(b.dataset.pushBound==='1')return;b.dataset.pushBound='1';b.addEventListener('click',function(){b.disabled=true;enable().catch(function(e){toast(explain(e));}).finally(function(){b.disabled=false;});});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
