self.addEventListener('push',function(event){
  var data={};
  try{data=event.data?event.data.json():{};}catch(e){data={body:event.data?event.data.text():''};}
  event.waitUntil(self.registration.showNotification(data.title||'Yeni Randevu Talebi ✨',{
    body:data.body||'',
    icon:'/favicon.ico',
    badge:'/favicon.ico',
    data:{url:data.url||'/admin',appointmentId:data.appointmentId||''},
    tag:data.appointmentId?('no11-'+data.appointmentId):'no11-booking'
  }));
});
self.addEventListener('notificationclick',function(event){
  event.notification.close();
  var url=(event.notification.data&&event.notification.data.url)||'/admin';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){var client=list[i];if('focus'in client){client.navigate(url);return client.focus();}}
    return clients.openWindow?clients.openWindow(url):undefined;
  }));
});
