(function(){
'use strict';
if(window.__NO11_ADMIN_PUSH_LOADED__)return;window.__NO11_ADMIN_PUSH_LOADED__=true;
var FIREBASE_APP='https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js';
var FIREBASE_MSG='https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js';
var config={apiKey:'AIzaSyCYKh4ntWdrKRLQxhufdCYZioEagg32gpw',authDomain:'no11-pilates-studio.firebaseapp.com',projectId:'no11-pilates-studio',storageBucket:'no11-pilates-studio.firebasestorage.app',messagingSenderId:'50773786185',appId:'1:50773786185:web:a1733ed1daffd8e2cc4998'};
function load(src,ready){return new Promise(function(resolve,reject){if(ready&&ready())return resolve();var old=document.querySelector('script[src="'+src+'"]');if(old){var n=0,t=setInterval(function(){if(!ready||ready()){clearInterval(t);resolve();}else if(++n>160){clearInterval(t);reject(new Error('sdk_timeout'));}},50);return;}var s=document.createElement('script');s.src=src;s.onload=function(){resolve();};s.onerror=function(){reject(new Error('sdk_load_failed'));};document.head.appendChild(s);});}
function isIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent);}
function standalone(){return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}
function toast(text){var x=document.createElement('div');x.textContent=text;x.style.cssText='position:fixed;left:50%;bottom:76px;z-index:2147483647;transform:translateX(-50%);padding:12px 16px;border-radius:14px;background:#292624;color:#fff;font:600 13px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;box-shadow:0 12px 35px rgba(0,0,0,.25);max-width:88vw;text-align:center';document.body.appendChild(x);setTimeout(function(){x.remove();},5000);}
function button(){var b=document.getElementById('n11-push-enable');if(!b){b=document.createElement('button');b.id='n11-push-enable';b.type='button';b.style.cssText='position:fixed;right:18px;bottom:18px;z-index:2147483000;border:1px solid rgba(143,24,33,.25);border-radius:999px;padding:11px 16px;background:#fff;color:#85151e;box-shadow:0 8px 28px rgba(0,0,0,.14);font:600 12px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;cursor:pointer';document.body.appendChild(b);}b.textContent=(window.Notification&&Notification.permission==='granted')?'Bildirimi Etkinleştir':'Bildirimleri Aç';return b;}
async function enable(){
  if(!('serviceWorker'in navigator)||!('Notification'in window)){throw new Error('unsupported');}
  if(isIOS()&&!standalone()){throw new Error('not_standalone');}
  var permission=Notification.permission;
  if(permission!=='granted')permission=await Notification.requestPermission();
  if(permission!=='granted')throw new Error('permission_'+permission);
  toast('Bildirim kuruluyor…');
  var cfg=await fetch('/api/no11-push',{credentials:'same-origin',cache:'no-store'});if(!cfg.ok)throw new Error('config_'+cfg.status);var info=await cfg.json();if(!info.enabled||!info.vapidKey)throw new Error('config_missing');
  var reg=await navigator.serviceWorker.register('/firebase-messaging-sw.js',{scope:'/'});await navigator.serviceWorker.ready;
  await load(FIREBASE_APP,function(){return !!window.firebase;});
  await load(FIREBASE_MSG,function(){return !!(window.firebase&&firebase.messaging);});
  if(!firebase.apps.length)firebase.initializeApp(config);
  if(!firebase.messaging.isSupported())throw new Error('messaging_unsupported');
  var token=await firebase.messaging().getToken({vapidKey:info.vapidKey,serviceWorkerRegistration:reg});if(!token)throw new Error('token_missing');
  var save=await fetch('/api/no11-push',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',body:JSON.stringify({token:token,label:'Osman iPhone'})});if(!save.ok)throw new Error('save_'+save.status);
  localStorage.setItem('no11_push_token',token);button().textContent='Bildirimler Açık ✓';toast('Telefon kaydedildi. Test bildirimi gönderiliyor…');
  var test=await fetch('/api/no11-push-test',{method:'POST',credentials:'same-origin',cache:'no-store'});var result={};try{result=await test.json();}catch(e){}if(!test.ok)throw new Error('test_'+test.status);if(!result.sent)throw new Error('test_no_recipient');
  toast('Test bildirimi gönderildi ✓');
}
function explain(e){var m=String(e&&e.message||e);console.error('No11 push:',e);if(m==='not_standalone')return 'iPhone’da No11’i Ana Ekrandaki simgesinden aç.';if(m.indexOf('permission_denied')>=0)return 'Bildirim izni kapalı. iPhone Ayarlar > Bildirimler > No11 bölümünden aç.';if(m==='unsupported'||m==='messaging_unsupported')return 'Bu iPhone/iOS sürümünde web push kullanılamıyor.';return 'Bildirim kurulamadı: '+m;}
function init(){var b=button();if(b.dataset.pushBound==='1')return;b.dataset.pushBound='1';b.addEventListener('click',function(){b.disabled=true;enable().catch(function(e){toast(explain(e));}).finally(function(){b.disabled=false;});});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
