(function(){
  'use strict';
  var months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  var schedule=null;
  var rendering=false;

  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function read(key){try{var value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch(e){return []}}
  function status(value){value=String(value||'pending').toLowerCase();return value==='confirmed'?'Onaylandı':value==='rejected'?'Reddedildi':'Bekliyor'}
  function dateKey(){
    var text=String((document.querySelector('.n11-date-switch')||{}).textContent||'').replace(/\s+/g,' ').trim();
    var match=text.match(/(\d{1,2})\s+(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)(?:\s+(\d{4}))?/i);
    if(!match)return '';
    var month=months.map(function(x){return x.toLocaleLowerCase('tr-TR')}).indexOf(match[2].toLocaleLowerCase('tr-TR'));
    var calendarText=String((document.querySelector('.n11-calendar header h2')||{}).textContent||'');
    var calendarYear=calendarText.match(/\b(20\d{2})\b/);
    var year=Number(match[3]||(calendarYear&&calendarYear[1])||new Date().getFullYear());
    return year+'-'+String(month+1).padStart(2,'0')+'-'+String(Number(match[1])).padStart(2,'0');
  }
  function source(){
    var slots=schedule&&Array.isArray(schedule.slots)?schedule.slots:read('no11-appointment-slots');
    var hours=schedule&&Array.isArray(schedule.hours)?schedule.hours:read('no11-hours');
    return {slots:slots.filter(function(x){return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(x))}),hours:hours};
  }
  function render(){
    if(rendering||!(window.matchMedia&&window.matchMedia('(max-width:760px)').matches))return;
    var title=document.querySelector('.n11-program-head h1');
    var list=document.querySelector('.n11-program-mobile .n11-mobile-slot-list');
    if(!title||title.textContent.trim()!=='Günlük Program'||!list)return;
    var key=dateKey();if(!key)return;
    var data=source(),date=new Date(key+'T12:00:00'),day=data.hours[(date.getDay()+6)%7],closed=!!(day&&day.closed);
    var slots=closed?[]:data.slots.filter(function(x){return !day||!day.open||!day.close||(x>=day.open&&x<day.close)});
    var appointments=read('no11-appointments').filter(function(x){return String(x&&x.date||'')===key&&/^([01]\d|2[0-3]):[0-5]\d$/.test(String(x&&x.time||''))}).sort(function(a,b){return String(a.time).localeCompare(String(b.time))||String(a.createdAt||'').localeCompare(String(b.createdAt||''))});
    appointments.forEach(function(x){if(slots.indexOf(String(x.time))<0)slots.push(String(x.time))});slots.sort();
    var signature=key+'|'+closed+'|'+slots.join(',')+'|'+appointments.map(function(x){return [x.id,x.time,x.name,x.service,x.status].join(':')}).join('|');
    if(list.dataset.mobileProgramSync===signature&&list.querySelector('[data-mobile-program-row]'))return;
    rendering=true;
    list.dataset.mobileProgramSync=signature;
    if(closed){list.innerHTML='<div data-mobile-program-row style="padding:42px 18px;text-align:center"><strong style="display:block;font:26px Georgia,serif">Stüdyomuz kapalı</strong><small style="display:block;margin-top:8px;color:var(--n11-muted)">Pazar günü hizmet vermiyoruz.</small></div>';rendering=false;return}
    function row(slot){
      var found=appointments.filter(function(x){return String(x.time)===slot});
      if(!found.length)return '<div class="n11-mobile-slot is-free" data-mobile-program-row><time>'+esc(slot)+'</time><i></i><div><b>Müsait</b><small>Randevu bulunmuyor</small></div><span>Boş</span></div>';
      return found.map(function(x){var state=String(x.status||'pending').toLowerCase();return '<button type="button" class="n11-mobile-slot is-booked" data-mobile-program-row data-id="'+esc(x.id)+'" data-n11-program-id="'+esc(x.id)+'"><time>'+esc(slot)+'</time><i class="'+esc(state)+'"></i><div><b>'+esc(x.name||'İsimsiz')+'</b><small>'+esc(x.service||x.lesson||'Pilates')+'</small></div><span class="n11-status '+esc(state)+'">'+status(state)+'</span><em>›</em></button>'}).join('');
    }
    list.innerHTML=slots.map(row).join('');
    rendering=false;
  }
  function loadSchedule(){fetch('/api/no11-schedule?ts='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(data){schedule=data;render()}).catch(function(){render()})}
  var observer=new MutationObserver(function(){setTimeout(render,0)});
  function start(){observer.observe(document.body,{childList:true,subtree:true});loadSchedule();render();setInterval(render,500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
