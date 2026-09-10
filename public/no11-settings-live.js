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
    var nameInput=form.querySelector('input[name="name"]');
    var phoneInput=form.querySelector('input[name="phone"]');
    var dateInput=form.querySelector('input[name="date"]');
    var selectedService=selects[0]&&(selects[0].value||(selects[0].selectedOptions[0]&&selects[0].selectedOptions[0].textContent))||'';
    var selectedTime=selects[1]&&selects[1].value||'';
    var selectedTimeText=selects[1]&&selects[1].selectedOptions[0]&&selects[1].selectedOptions[0].textContent||'';
    var serviceLabel=selects[0]&&selects[0].previousElementSibling&&selects[0].previousElementSibling.textContent.trim()||'';
    var timeLabel=selects[1]&&selects[1].previousElementSibling&&selects[1].previousElementSibling.textContent.trim()||'';
    if(!selectedService&&!/seç/i.test(serviceLabel))selectedService=serviceLabel;
    if(!selectedTime){var timeMatch=timeLabel.match(/(?:^|\s)([0-2]\d:[0-5]\d)(?:\s|$)/);if(timeMatch)selectedTime=timeMatch[1]}
    var normalizedTime=(String(selectedTime)+' '+String(selectedTimeText)+' '+String(timeLabel)).match(/(?:^|\s)([0-2]\d:[0-5]\d)(?:\s|$)/);
    selectedTime=normalizedTime?normalizedTime[1]:'';
    return {
      id:'apt-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),
      name:String(data.get('name')||(nameInput&&nameInput.value)||'').trim(),
      phone:String(document.documentElement.dataset.no11BookingPhone||data.get('phone')||(phoneInput&&phoneInput.value)||'').trim(),
      service:String(data.get('service')||data.get('lesson')||selectedService||'Pilates').trim(),
      date:String(data.get('date')||(dateInput&&dateInput.value)||'').trim(),
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
  function dateLabel(value){
    var m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return value||'—';
    var d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));
    return new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',weekday:'long'}).format(d);
  }
  function ensureSuccessStyle(){
    if(document.getElementById('n11-booking-success-style'))return;
    var style=document.createElement('style');style.id='n11-booking-success-style';
    style.textContent='#n11-booking-success{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:24px;background:rgba(24,20,18,.42);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-sizing:border-box}#n11-booking-success .n11-bs-card{width:min(520px,100%);background:#f8f5f1;border:1px solid rgba(90,72,58,.16);border-radius:24px;padding:34px;box-sizing:border-box;box-shadow:0 28px 80px rgba(31,25,21,.22);color:#2d2926;text-align:left}#n11-booking-success .n11-bs-mark{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;margin:0 0 22px;background:#2d2926;color:#fff;font:24px Georgia,serif}#n11-booking-success .n11-bs-eye{margin:0 0 8px;color:#9a7a69;font:700 10px/1.2 Arial,sans-serif;letter-spacing:.22em}#n11-booking-success h2{margin:0;font:34px/1.08 Georgia,serif;font-weight:400;color:#2d2926}#n11-booking-success .n11-bs-copy{margin:13px 0 24px;color:#766b63;font:15px/1.6 Arial,sans-serif}#n11-booking-success .n11-bs-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 24px}#n11-booking-success .n11-bs-item{padding:15px 16px;border:1px solid #e5ddd6;border-radius:14px;background:#fff}#n11-booking-success .n11-bs-item span{display:block;margin-bottom:5px;color:#9a7a69;font:700 9px/1.2 Arial,sans-serif;letter-spacing:.12em}#n11-booking-success .n11-bs-item b{display:block;color:#2d2926;font:17px/1.25 Georgia,serif;font-weight:400;overflow-wrap:anywhere}#n11-booking-success .n11-bs-close{width:100%;min-height:48px;border:0;border-radius:14px;background:#2d2926;color:#fff;font:700 11px/1 Arial,sans-serif;letter-spacing:.12em;cursor:pointer}body.n11-booking-success-open{overflow:hidden}@media(max-width:560px){#n11-booking-success{padding:16px}#n11-booking-success .n11-bs-card{padding:27px 22px;border-radius:21px}#n11-booking-success h2{font-size:30px}#n11-booking-success .n11-bs-grid{grid-template-columns:1fr}#n11-booking-success .n11-bs-item{padding:13px 14px}}';
    document.head.appendChild(style);
  }
  function showBookingSuccess(payload){
    ensureSuccessStyle();var old=document.getElementById('n11-booking-success');if(old)old.remove();
    var overlay=document.createElement('div');overlay.id='n11-booking-success';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Randevu talebi alındı');
    var card=document.createElement('div');card.className='n11-bs-card';
    var mark=document.createElement('div');mark.className='n11-bs-mark';mark.textContent='✓';
    var eye=document.createElement('p');eye.className='n11-bs-eye';eye.textContent='RANDEVU TALEBİ ALINDI';
    var title=document.createElement('h2');title.textContent='Teşekkür ederiz, '+payload.name+'.';
    var copy=document.createElement('p');copy.className='n11-bs-copy';copy.textContent='Randevu talebiniz bize ulaştı. No.11 ekibi talebinizi kontrol edip sizinle iletişime geçecek.';
    var grid=document.createElement('div');grid.className='n11-bs-grid';
    [['DERS',payload.service],['TARİH',dateLabel(payload.date)],['SAAT',payload.time],['TELEFON',payload.phone]].forEach(function(item){var box=document.createElement('div');box.className='n11-bs-item';var s=document.createElement('span');s.textContent=item[0];var b=document.createElement('b');b.textContent=item[1]||'—';box.appendChild(s);box.appendChild(b);grid.appendChild(box)});
    var close=document.createElement('button');close.type='button';close.className='n11-bs-close';close.textContent='TAMAM';
    function dismiss(){overlay.remove();document.body.classList.remove('n11-booking-success-open')}
    close.onclick=dismiss;overlay.addEventListener('click',function(e){if(e.target===overlay)dismiss()});
    document.addEventListener('keydown',function escClose(e){if(e.key==='Escape'&&document.getElementById('n11-booking-success')){dismiss();document.removeEventListener('keydown',escClose)}});
    card.appendChild(mark);card.appendChild(eye);card.appendChild(title);card.appendChild(copy);card.appendChild(grid);card.appendChild(close);overlay.appendChild(card);document.body.appendChild(overlay);document.body.classList.add('n11-booking-success-open');setTimeout(function(){close.focus()},20);
  }
  function bindBooking(){var form=document.querySelector('#randevu form');if(!form||form.dataset.n11SettingsBound)return;form.dataset.n11SettingsBound='1';form.addEventListener('submit',function(event){
    if(!settings)return;
    event.preventDefault();event.stopImmediatePropagation();
    var payload=appointmentPayload(form);
    if(!payload.name||!payload.phone||!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(payload.time)){bookingMessage(form,'Lütfen ad, telefon, tarih ve saat alanlarını eksiksiz seçin.',true);form.reportValidity();return}
    bookingMessage(form,'Randevu talebiniz kaydediliyor…',false);
    saveAppointment(payload).then(function(){bookingMessage(form,'Randevu talebiniz başarıyla alındı.',false);showBookingSuccess(payload)}).catch(function(){bookingMessage(form,'Randevu kaydedilemedi. Lütfen tekrar deneyin.',true)});
    var message='Merhaba, No.11 Pilates Studio için randevu talebi oluşturmak istiyorum.\n\nAd Soyad: '+payload.name+'\nTelefon: '+payload.phone+'\nTarih: '+payload.date+(payload.time?'\nSaat: '+payload.time:'')+(payload.studentNote?'\nNot: '+payload.studentNote:'');
    window.open('https://wa.me/'+digits(settings.whatsapp||settings.phone)+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  },true)}
  function start(){fetch('/api/no11-settings?ts='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('load');return r.json()}).then(function(data){settings=data.settings;apply();bindBooking()}).catch(function(){})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
