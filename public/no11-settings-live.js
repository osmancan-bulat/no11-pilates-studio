(function(){
  'use strict';
  var settings=null;
  function digits(value){var d=String(value||'').replace(/\D/g,'');if(d.indexOf('00')===0)d=d.slice(2);if(d.length===11&&d[0]==='0')d='90'+d.slice(1);if(d.length===10)d='90'+d;return d}
  function instagram(value){var raw=String(value||'').trim(),match=raw.match(/instagram\.com\/([^/?#]+)/i),handle=(match?match[1]:raw).replace(/^@/,'').replace(/\/$/,'');return {handle:handle,url:handle?'https://instagram.com/'+handle:''}}
  function addressHtml(value){return String(value||'').trim().replace(/\s*,\s*/g,'<br>').replace(/Nilüfer\s*\/\s*Bursa/i,'<span>Nilüfer / Bursa</span>')}
  function apply(){if(!settings)return;
    var phoneDigits=digits(settings.phone),waDigits=digits(settings.whatsapp||settings.phone),ig=instagram(settings.instagram);
    document.querySelectorAll('a[href^="tel:"]').forEach(function(a){a.href='tel:+'+phoneDigits;var strong=a.querySelector('strong');if(strong)strong.textContent=settings.phone});
    document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp.com"]').forEach(function(a){try{var u=new URL(a.href);u.hostname='wa.me';u.pathname='/'+waDigits;a.href=u.toString()}catch(e){a.href='https://wa.me/'+waDigits}});
    document.querySelectorAll('a[href*="instagram.com"]').forEach(function(a){if(ig.url)a.href=ig.url;var strong=a.querySelector('strong');if(strong)strong.textContent='@'+ig.handle});
    var address=document.querySelector('.footer-address address');if(address&&settings.address)address.innerHTML=addressHtml(settings.address);
    var map=document.querySelector('a.footer-map');if(map&&settings.maps)map.href=settings.maps;
    var contact=document.querySelector('.footer-contact-grid');var links=document.querySelector('.footer-links');
    if(contact)contact.style.display=settings.contactVisible?'':'none';if(links)links.style.display=settings.contactVisible?'':'none';
  }
  function appointmentPayload(form){
    var data=new FormData(form),now=new Date().toISOString();
    var selects=form.querySelectorAll('select');
    var selectedService=selects[0]&&selects[0].value||'';
    var selectedTime=selects[1]&&selects[1].value||'';
    var serviceLabel=selects[0]&&selects[0].previousElementSibling&&selects[0].previousElementSibling.textContent.trim()||'';
    var timeLabel=selects[1]&&selects[1].previousElementSibling&&selects[1].previousElementSibling.textContent.trim()||'';
    if(!selectedService&&!/seç/i.test(serviceLabel))selectedService=serviceLabel;
    if(!selectedTime){var timeMatch=timeLabel.match(/(?:^|\s)([0-2]\d:[0-5]\d)(?:\s|$)/);if(timeMatch)selectedTime=timeMatch[1]}
    return {
      id:'apt-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),
      name:String(data.get('name')||'').trim(),
      phone:String(data.get('phone')||'').trim(),
      service:String(data.get('service')||data.get('lesson')||selectedService||'Pilates').trim(),
      date:String(data.get('date')||'').trim(),
      time:String(data.get('time')||selectedTime||'').trim(),
      studentNote:String(data.get('note')||'').trim(),
      managerNote:'',
      status:'pending',
      createdAt:now
    };
  }
  function saveAppointment(payload){
    return fetch('/api/no11-appointments',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(payload),
      keepalive:true
    }).then(function(r){if(!r.ok)throw new Error('save');return r.json()});
  }
  function bookingMessage(form,message,error){
    var node=form.querySelector('.n11-booking-message');
    if(!node){node=document.createElement('p');node.className='n11-booking-message';node.style.cssText='margin:10px 0 0;font:600 13px/1.4 Arial,sans-serif';form.querySelector('button[type="submit"]').insertAdjacentElement('beforebegin',node)}
    node.style.color=error?'#a3243f':'#367047';node.textContent=message;
  }
  function bindBooking(){var form=document.querySelector('#randevu form');if(!form||form.dataset.n11SettingsBound)return;form.dataset.n11SettingsBound='1';form.addEventListener('submit',function(event){
    if(!settings)return;
    event.preventDefault();event.stopImmediatePropagation();
    var payload=appointmentPayload(form);
    if(!payload.name||!payload.phone||!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(payload.time)){bookingMessage(form,'Lütfen ad, telefon, tarih ve saat alanlarını eksiksiz seçin.',true);form.reportValidity();return}
    bookingMessage(form,'Randevu talebiniz kaydediliyor…',false);
    saveAppointment(payload).then(function(){bookingMessage(form,'Randevu talebiniz başarıyla alındı.',false)}).catch(function(){bookingMessage(form,'Randevu kaydedilemedi. Lütfen tekrar deneyin.',true)});
    var message='Merhaba, No.11 Pilates Studio için randevu talebi oluşturmak istiyorum.\n\nAd Soyad: '+payload.name+'\nTelefon: '+payload.phone+'\nTarih: '+payload.date+(payload.time?'\nSaat: '+payload.time:'')+(payload.studentNote?'\nNot: '+payload.studentNote:'');
    window.open('https://wa.me/'+digits(settings.whatsapp||settings.phone)+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  },true)}
  function start(){fetch('/api/no11-settings?ts='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('load');return r.json()}).then(function(data){settings=data.settings;apply();bindBooking()}).catch(function(){})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
