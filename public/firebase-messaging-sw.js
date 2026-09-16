importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey:'AIzaSyCYKh4ntWdrKRLQxhufdCYZioEagg32gpw',
  authDomain:'no11-pilates-studio.firebaseapp.com',
  projectId:'no11-pilates-studio',
  storageBucket:'no11-pilates-studio.firebasestorage.app',
  messagingSenderId:'50773786185',
  appId:'1:50773786185:web:a1733ed1daffd8e2cc4998'
});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(function(payload){
  const n=payload.notification||{};const d=payload.data||{};
  self.registration.showNotification(n.title||'Yeni Randevu Talebi ✨',{body:n.body||'',icon:'/favicon.ico',badge:'/favicon.ico',data:{url:d.url||'/admin',appointmentId:d.appointmentId||''},tag:d.appointmentId?`no11-${d.appointmentId}`:'no11-booking'});
});
self.addEventListener('notificationclick',function(event){event.notification.close();const url=(event.notification.data&&event.notification.data.url)||'/admin';event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){for(const client of list){if('focus'in client){client.navigate(url);return client.focus();}}return clients.openWindow?clients.openWindow(url):undefined;}));});
