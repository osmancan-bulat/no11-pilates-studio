(function(){
  'use strict';

  var REPORT_PAGE='reports';
  var APPOINTMENTS_KEY='no11-appointments';
  var THEME_KEY='no11-admin-theme';
  var active=false;
  var reportMode='daily';
  var cache=[];
  var rendering=false;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function pad(n){return String(n).padStart(2,'0')}
  function nowTR(){
    var parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    var o={};parts.forEach(function(p){o[p.type]=p.value});return {date:o.year+'-'+o.month+'-'+o.day,time:o.hour+':'+o.minute,month:o.year+'-'+o.month};
  }
  function trDate(dateKey){
    var d=new Date(dateKey+'T12:00:00+03:00');
    return new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',day:'numeric',month:'long',year:'numeric',weekday:'long'}).format(d);
  }
  function tomorrowKey(dateKey){var d=new Date(dateKey+'T12:00:00+03:00');d.setDate(d.getDate()+1);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
  function isLastDayOfMonth(dateKey){var d=new Date(dateKey+'T12:00:00+03:00'),next=new Date(d);next.setDate(d.getDate()+1);return next.getMonth()!==d.getMonth()}
  function normalize(x){return Object.assign({status:'pending',name:'',phone:'',service:x&&x.lesson||'Pilates',date:'',time:'',createdAt:''},x||{},{service:(x&&x.service)||(x&&x.lesson)||'Pilates'})}
  function localItems(){try{return (JSON.parse(localStorage.getItem(APPOINTMENTS_KEY)||'[]')||[]).map(normalize)}catch(e){return []}}
  function fetchItems(){
    return fetch('/api/no11-appointments',{credentials:'same-origin',cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('api');return r.json()}).then(function(data){var arr=Array.isArray(data)?data:(data&&Array.isArray(data.appointments)?data.appointments:[]);cache=arr.map(normalize);return cache}).catch(function(){cache=localItems();return cache});
  }
  function statusCounts(items){return {
    confirmed:items.filter(function(x){return x.status==='confirmed'}).length,
    pending:items.filter(function(x){return x.status==='pending'}).length,
    rejected:items.filter(function(x){return x.status==='rejected'}).length
  }}
  function distribution(items,key){var m={};items.forEach(function(x){var k=String(x[key]||'Belirtilmedi');m[k]=(m[k]||0)+1});return Object.keys(m).map(function(k){return {name:k,count:m[k]}}).sort(function(a,b){return b.count-a.count||a.name.localeCompare(b.name,'tr')})}
  function createdOn(x,key){if(!x.createdAt)return false;var d=new Date(x.createdAt);if(isNaN(d))return String(x.createdAt).slice(0,key.length)===key;var parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d),o={};parts.forEach(function(p){o[p.type]=p.value});var dk=o.year+'-'+o.month+'-'+o.day;return key.length===7?dk.slice(0,7)===key:dk===key}
  function sortTime(a,b){return String(a.time||'99:99').localeCompare(String(b.time||'99:99'))}
  function emptyState(text){return '<div class="n11-rp-empty">'+esc(text)+'</div>'}
  function serviceRows(items){var rows=distribution(items,'service'),max=rows.length?rows[0].count:1;if(!rows.length)return emptyState('Bu dönem için randevu bulunmuyor.');return '<div class="n11-rp-services">'+rows.slice(0,7).map(function(r){return '<div class="n11-rp-service"><b>'+esc(r.name)+'</b><span><i style="width:'+Math.round(r.count/max*100)+'%"></i></span><strong>'+r.count+'</strong></div>'}).join('')+'</div>'}
  function hourChart(items){var rows=distribution(items,'time').filter(function(r){return /^\d{2}:\d{2}$/.test(r.name)}).sort(function(a,b){return a.name.localeCompare(b.name)}),max=rows.reduce(function(m,r){return Math.max(m,r.count)},1);if(!rows.length)return emptyState('Saat yoğunluğu için veri bulunmuyor.');return '<div class="n11-rp-hours">'+rows.map(function(r){var peak=r.count===max;return '<div class="n11-rp-hour '+(peak?'peak':'')+'"><div><i style="height:'+Math.max(14,Math.round(r.count/max*100))+'%"></i></div><label>'+esc(r.name)+'</label><small>'+r.count+'</small></div>'}).join('')+'</div>'}
  function timeline(items){var a=items.slice().sort(sortTime);if(!a.length)return emptyState('Bugün için randevu bulunmuyor.');return '<div class="n11-rp-timeline">'+a.map(function(x){var st=x.status==='confirmed'?'Onay':x.status==='rejected'?'Red':'Bekliyor';return '<div class="n11-rp-row"><time>'+esc(x.time||'—')+'</time><div><b>'+esc(x.service||'Pilates')+'</b><small>'+esc(x.name||'İsimsiz')+'</small></div><em class="'+esc(x.status)+'">'+st+'</em></div>'}).join('')+'</div>'}
  function topBar(title,dateText){return '<header class="n11-page-top n11-rp-top"><button class="n11-mobile-menu" aria-label="Menüyü aç">☰</button><div><h1>'+title+'</h1><p>'+esc(dateText).toLocaleUpperCase('tr-TR')+'</p></div><div class="n11-page-actions"><button class="n11-theme n11-rp-theme" aria-label="Temayı değiştir"><span><i>☀</i><i>☾</i></span></button><div class="n11-rp-tabs"><button data-report-mode="daily" class="'+(reportMode==='daily'?'active':'')+'">Günlük Rapor</button><button data-report-mode="monthly" class="'+(reportMode==='monthly'?'active':'')+'">Aylık Rapor</button></div></div></header>'}
  function kpi(label,value,note,primary){return '<article class="n11-rp-kpi '+(primary?'primary':'')+'"><span>'+label+'</span><strong>'+esc(value)+'</strong><small>'+esc(note||'')+'</small></article>'}
  function daily(items){
    var n=nowTR(),today=items.filter(function(x){return x.date===n.date}),tomKey=tomorrowKey(n.date),tom=items.filter(function(x){return x.date===tomKey}),sc=statusCounts(today),services=distribution(today,'service'),hours=distribution(today,'time'),topService=services[0],topHour=hours.filter(function(r){return /^\d{2}:\d{2}$/.test(r.name)}).sort(function(a,b){return b.count-a.count})[0],newToday=items.filter(function(x){return createdOn(x,n.date)}).length,ordered=today.slice().sort(sortTime),first=ordered[0],last=ordered[ordered.length-1],rate=today.length?Math.round(sc.confirmed/today.length*100):0;
    return topBar('Günlük Rapor',trDate(n.date))+
    '<section class="n11-rp-kpis">'+
      kpi('BUGÜN TOPLAM',today.length,'randevu',true)+kpi('ONAYLANDI',sc.confirmed,'%'+rate)+kpi('BEKLİYOR',sc.pending,sc.pending?'işlem gerekiyor':'işlem yok')+kpi('REDDEDİLDİ',sc.rejected,'bugünkü kayıt')+kpi('YENİ TALEP',newToday,'bugün geldi')+kpi('YARIN',tom.length,statusCounts(tom).pending+' bekleyen')+
    '</section>'+
    '<section class="n11-rp-grid">'+
      '<article class="n11-rp-card"><header><div><p>DERS DAĞILIMI</p><h2>Bugünkü talep dağılımı</h2></div><span>'+today.length+' toplam</span></header>'+serviceRows(today)+'</article>'+
      '<article class="n11-rp-card"><header><div><p>SAAT YOĞUNLUĞU</p><h2>Randevu yoğunluğu</h2></div><span>'+(topHour?esc(topHour.name)+' zirve':'—')+'</span></header>'+hourChart(today)+'</article>'+
    '</section>'+
    '<section class="n11-rp-grid">'+
      '<article class="n11-rp-card"><header><div><p>BUGÜNÜN PROGRAMI</p><h2>Saat saat görünüm</h2></div><span>'+(first?esc(first.time):'—')+' → '+(last?esc(last.time):'—')+'</span></header>'+timeline(today)+'</article>'+
      '<article class="n11-rp-card"><header><div><p>DİKKAT GEREKTİRENLER</p><h2>Eda Hanım için</h2></div></header><div class="n11-rp-attention">'+
        '<div><span>BUGÜN</span><b>Bekleyen randevu</b><small>Onay bekleyen bugünkü talepler</small><strong>'+sc.pending+'</strong></div>'+
        '<div><span>YARIN</span><b>Bekleyen talepler</b><small>Yarın için onay kontrolü</small><strong>'+statusCounts(tom).pending+'</strong></div>'+
        '<div><span>YENİ TALEP</span><b>Bugün gelen kayıtlar</b><small>Sisteme bugün gelen talepler</small><strong>'+newToday+'</strong></div>'+
      '</div></article>'+
    '</section>'+
    '<section class="n11-rp-summary"><span>GÜNLÜK ÖZET</span><strong>'+today.length+' randevu · '+sc.confirmed+' onay'+(topService?' · '+esc(topService.name)+' önde':'')+(topHour?' · '+esc(topHour.name)+' en yoğun saat':'')+'</strong><small>Rapor hazır</small></section>';
  }
  function monthly(items){
    var n=nowTR(),monthItems=items.filter(function(x){return String(x.date||'').slice(0,7)===n.month}),sc=statusCounts(monthItems),services=distribution(monthItems,'service'),hours=distribution(monthItems,'time').filter(function(r){return /^\d{2}:\d{2}$/.test(r.name)}).sort(function(a,b){return b.count-a.count}),topService=services[0],topHour=hours[0],rate=monthItems.length?Math.round(sc.confirmed/monthItems.length*100):0,newMonth=items.filter(function(x){return createdOn(x,n.month)}).length;
    var label=new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',month:'long',year:'numeric'}).format(new Date(n.date+'T12:00:00+03:00'));
    return topBar('Aylık Rapor',label)+
    '<section class="n11-rp-kpis">'+kpi('AYLIK TOPLAM',monthItems.length,'randevu',true)+kpi('ONAYLANDI',sc.confirmed,'%'+rate)+kpi('BEKLİYOR',sc.pending,'işlem gerekiyor')+kpi('REDDEDİLDİ',sc.rejected,'aylık kayıt')+kpi('YENİ TALEP',newMonth,'bu ay geldi')+kpi('EN YOĞUN SAAT',topHour?topHour.name:'—',topHour?topHour.count+' randevu':'veri yok')+'</section>'+
    '<section class="n11-rp-grid"><article class="n11-rp-card"><header><div><p>AYLIK DERS DAĞILIMI</p><h2>Talep sıralaması</h2></div><span>'+monthItems.length+' toplam</span></header>'+serviceRows(monthItems)+'</article><article class="n11-rp-card"><header><div><p>AYLIK SAAT YOĞUNLUĞU</p><h2>Randevu yoğunluğu</h2></div><span>'+(topHour?esc(topHour.name)+' zirve':'—')+'</span></header>'+hourChart(monthItems)+'</article></section>'+
    '<section class="n11-rp-summary"><span>AYLIK ÖZET</span><strong>'+monthItems.length+' randevu · '+sc.confirmed+' onay'+(topService?' · '+esc(topService.name)+' önde':'')+(topHour?' · '+esc(topHour.name)+' en yoğun saat':'')+'</strong><small>%'+rate+' onay</small></section>';
  }
  function injectNav(){
    var nav=document.querySelector('.n11-main-side nav');if(!nav||nav.querySelector('[data-page="reports"]'))return;
    var btn=document.createElement('button');btn.type='button';btn.dataset.page='reports';btn.innerHTML='<b>▤</b><span>Raporlar</span>';
    var appt=nav.querySelector('[data-page="appointments"]');if(appt&&appt.nextSibling)nav.insertBefore(btn,appt.nextSibling);else nav.appendChild(btn);
    if(active){nav.querySelectorAll('button').forEach(function(x){x.classList.toggle('active',x.dataset.page==='reports')})}
  }
  function bindReport(){
    document.querySelectorAll('[data-report-mode]').forEach(function(b){b.onclick=function(){reportMode=b.dataset.reportMode;renderReport()}});
    var t=document.querySelector('.n11-rp-theme');if(t)t.onclick=function(){var main=document.querySelector('main.n11-v4');var dark=!(main&&main.classList.contains('n11-dark'));localStorage.setItem(THEME_KEY,dark?'dark':'light');if(main)main.classList.toggle('n11-dark',dark)};
    var menu=document.querySelector('.n11-rp-top .n11-mobile-menu');if(menu)menu.onclick=function(){var main=document.querySelector('main');if(main)main.classList.add('n11-menu-open')};
  }
  function renderReport(){
    if(rendering)return;rendering=true;active=true;injectNav();
    var content=document.querySelector('.n11-main-content');if(!content){rendering=false;return}
    content.innerHTML='<div class="n11-rp-loading">Rapor hazırlanıyor…</div>';
    fetchItems().then(function(items){content.innerHTML=reportMode==='daily'?daily(items):monthly(items);injectNav();bindReport();rendering=false}).catch(function(){content.innerHTML=emptyState('Rapor verileri yüklenemedi.');rendering=false});
  }
  function openReports(e){
    var target=e.target&&e.target.closest?e.target.closest('[data-page="reports"]'):null;if(!target)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();renderReport();
  }
  function showReadyToast(kind,key){
    var toast=document.createElement('button');toast.className='n11-rp-ready';
    if(kind==='monthly'){
      toast.innerHTML='<b>Aylık raporunuz hazır, Eda Hanım.</b><span>Ayın özetini görüntüleyin →</span>';
      toast.onclick=function(){toast.remove();reportMode='monthly';renderReport()};
    }else{
      toast.innerHTML='<b>Günlük raporunuz hazır, Eda Hanım.</b><span>Bugünün özetini görüntüleyin →</span>';
      toast.onclick=function(){toast.remove();reportMode='daily';renderReport()};
    }
    sessionStorage.setItem(key,'1');document.body.appendChild(toast);setTimeout(function(){if(toast.parentNode)toast.remove()},12000);
  }
  function checkReady(){
    if(active||document.querySelector('.n11-rp-ready'))return;
    var n=nowTR(),items=cache.length?cache:localItems(),today=items.filter(function(x){return x.date===n.date&&/^\d{2}:\d{2}$/.test(x.time||'')});
    var dayFinished=false;
    if(today.length){var last=today.slice().sort(sortTime).pop().time;dayFinished=n.time>=last}
    var dailyKey='no11-report-ready-'+n.date;
    if(dayFinished&&!sessionStorage.getItem(dailyKey)){showReadyToast('daily',dailyKey);return}
    if(isLastDayOfMonth(n.date)){
      var monthFinished=dayFinished||(!today.length&&n.time>='21:00');
      var monthlyKey='no11-monthly-report-ready-'+n.month;
      if(monthFinished&&!sessionStorage.getItem(monthlyKey)){showReadyToast('monthly',monthlyKey)}
    }
  }
  document.addEventListener('click',openReports,true);
  var observer=new MutationObserver(function(){injectNav();if(!document.querySelector('.n11-rp-ready'))checkReady()});
  function start(){var main=document.querySelector('main');if(!main){setTimeout(start,120);return}observer.observe(main,{childList:true,subtree:true});injectNav();fetchItems().then(function(){checkReady()});setInterval(checkReady,60000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
