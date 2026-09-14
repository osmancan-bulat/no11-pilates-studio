(function(){
  'use strict';
  function isDesktop(){return !(window.matchMedia&&window.matchMedia('(max-width:760px)').matches)}
  function findTitle(){return Array.from(document.querySelectorAll('h1')).find(function(h){return (h.textContent||'').trim()==='Site Ayarları'})||null}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function mount(){
    if(!isDesktop())return;
    var title=findTitle(); if(!title)return;
    var content=title.closest('.n11-main-content')||title.parentElement&&title.parentElement.parentElement; if(!content)return;
    if(content.querySelector('.n11-settings-clean-panel'))return;
    Array.from(content.children).forEach(function(child){if(!child.classList.contains('n11-page-top'))child.classList.add('n11-settings-clean-hidden')});
    var shell=document.createElement('section'); shell.className='n11-settings-clean-panel';
    shell.innerHTML='<div class="n11-settings-clean-intro"><span>İLETİŞİM BİLGİLERİ</span><h2>İletişim Bilgileri</h2><p>Ana sitede ziyaretçilerin göreceği iletişim bilgilerini düzenleyin.</p></div><form class="n11-settings-clean-form"><label><div><b>Telefon</b><small>Sitenin iletişim bölümünde görünür.</small></div><input name="phone" autocomplete="tel"></label><label><div><b>Randevu WhatsApp numarası</b><small>Randevu talebi bu numaraya gönderilir.</small></div><input name="whatsapp" autocomplete="tel"></label><label><div><b>Instagram</b><small>Sitedeki Instagram bağlantısında kullanılır.</small></div><input name="instagram" autocomplete="off"></label><label><div><b>Adres</b><small>İletişim alanında gösterilir.</small></div><textarea name="address" rows="3"></textarea></label><div class="n11-settings-clean-actions"><button type="submit">Değişiklikleri kaydet</button><span aria-live="polite"></span></div></form>';
    content.appendChild(shell);
    var form=shell.querySelector('form'),status=shell.querySelector('.n11-settings-clean-actions span');
    fetch('/api/no11-settings?ts='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error();return r.json()}).then(function(data){var s=data.settings||{};['phone','whatsapp','instagram','address'].forEach(function(k){if(form.elements[k])form.elements[k].value=s[k]||''});form.dataset.base=JSON.stringify(s)}).catch(function(){try{var s=JSON.parse(localStorage.getItem('no11-site-settings')||'{}');['phone','whatsapp','instagram','address'].forEach(function(k){if(form.elements[k])form.elements[k].value=s[k]||''});form.dataset.base=JSON.stringify(s)}catch(e){}});
    form.addEventListener('submit',function(e){e.preventDefault();var base={};try{base=JSON.parse(form.dataset.base||'{}')}catch(err){};['phone','whatsapp','instagram','address'].forEach(function(k){base[k]=String(form.elements[k].value||'').trim()});status.textContent='Kaydediliyor…';fetch('/api/no11-settings',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(base)}).then(function(r){if(!r.ok)throw new Error();return r.json()}).then(function(data){var s=data.settings||base;localStorage.setItem('no11-site-settings',JSON.stringify(s));form.dataset.base=JSON.stringify(s);status.textContent='Kaydedildi ✓';setTimeout(function(){status.textContent=''},2200)}).catch(function(){status.textContent='Kaydedilemedi';});});
  }
  function start(){mount();var o=new MutationObserver(function(){setTimeout(mount,30)});o.observe(document.body,{childList:true,subtree:true});window.addEventListener('resize',function(){if(isDesktop())mount()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
