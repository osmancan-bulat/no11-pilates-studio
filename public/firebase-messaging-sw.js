self.addEventListener('push',function(event){
  var data={};
  try{data=event.data?event.data.json():{};}catch(e){data={body:event.data?event.data.text():''};}
  var appointmentId=String(data.appointmentId||'');
  var url=data.url||'/admin';
  if(appointmentId&&url.indexOf('appointment=')===-1){
    url='/admin?appointment='+encodeURIComponent(appointmentId);
  }
  event.waitUntil(self.registration.showNotification(data.title||'Yeni Randevu Talebi ✨',{
    body:data.body||'',
    icon:'/favicon.ico',
    badge:'/favicon.ico',
    data:{url:url,appointmentId:appointmentId},
    tag:appointmentId?('no11-'+appointmentId):'no11-booking'
  }));
});
self.addEventListener('notificationclick',function(event){
  event.notification.close();
  var data=event.notification.data||{};
  var appointmentId=String(data.appointmentId||'');
  var path=data.url||'/admin';
  if(appointmentId&&path.indexOf('appointment=')===-1){
    path='/admin?appointment='+encodeURIComponent(appointmentId);
  }
  var targetUrl=new URL(path,self.location.origin).href;
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(async function(list){
    for(var i=0;i<list.length;i++){
      var client=list[i];
      try{
        if('navigate'in client)await client.navigate(targetUrl);
        if('focus'in client)return client.focus();
      }catch(e){}
    }
    return clients.openWindow?clients.openWindow(targetUrl):undefined;
  }));
});
