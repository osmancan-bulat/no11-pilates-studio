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
  function bindBooking(){var form=document.querySelector('#randevu form');if(!form||form.dataset.n11SettingsBound)return;form.dataset.n11SettingsBound='1';form.addEventListener('submit',function(event){if(!settings)return;event.preventDefault();event.stopImmediatePropagation();var data=new FormData(form),name=data.get('name')||'',phone=data.get('phone')||'',date=data.get('date')||'',note=data.get('note')||'',message='Merhaba, No.11 Pilates Studio için randevu talebi oluşturmak istiyorum.\n\nAd Soyad: '+name+'\nTelefon: '+phone+'\nTarih: '+date+(note?'\nNot: '+note:'');window.open('https://wa.me/'+digits(settings.whatsapp||settings.phone)+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer')},true)}
  function start(){fetch('/api/no11-settings?ts='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('load');return r.json()}).then(function(data){settings=data.settings;apply();bindBooking()}).catch(function(){})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
