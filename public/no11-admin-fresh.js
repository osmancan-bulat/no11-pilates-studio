(function(){
  'use strict';

  var months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  var days=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  var viewDate=new Date();
  var busy=false;
  var lastMobileSignature='';

  function label(date){return date.getDate()+' '+months[date.getMonth()]+' '+days[date.getDay()]}
  function monthTitle(date){return months[date.getMonth()].toLocaleUpperCase('tr-TR')+' '+date.getFullYear()}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function readArray(key){try{var value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch(e){return []}}
  function setText(node,value){value=String(value==null?'':value);if(node&&node.textContent!==value)node.textContent=value}

  function turkeyNow(){
    var formatter=new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit',weekday:'long',hour:'2-digit',hourCycle:'h23'});
    var parts={};formatter.formatToParts(new Date()).forEach(function(x){parts[x.type]=x.value});
    var year=parts.year||String(new Date().getFullYear());
    var month=parts.month||String(new Date().getMonth()+1).padStart(2,'0');
    var day=parts.day||String(new Date().getDate()).padStart(2,'0');
    return {dateKey:year+'-'+month+'-'+day,monthKey:year+'-'+month,day:Number(day),month:Number(month)-1,year:Number(year),weekday:parts.weekday||'',hour:Number(parts.hour||0)};
  }

  function turkeyLabel(info){return info.day+' '+months[info.month]+' '+(info.weekday?info.weekday.charAt(0).toLocaleUpperCase('tr-TR')+info.weekday.slice(1):'')}
  function greeting(hour){return hour<12?'Günaydın':hour<18?'İyi günler':'İyi akşamlar'}
  function normalizedStatus(x){return String(x&&x.status||'pending').toLowerCase()}
  function timeValue(x){return String(x&&x.time||'99:99')}

  function buildCalendar(grid,date){
    if(!grid)return;
    var year=date.getFullYear(),month=date.getMonth();
    var first=new Date(year,month,1),count=new Date(year,month+1,0).getDate();
    var offset=(first.getDay()+6)%7;
    var today=new Date();
    var html='';
    ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].forEach(function(d){html+='<b>'+d+'</b>'});
    for(var i=0;i<offset;i++)html+='<span class="n11-cal-empty" aria-hidden="true"></span>';
    for(var day=1;day<=count;day++){
      var isSelected=day===date.getDate();
      var isToday=day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
      html+='<span class="'+(isSelected?'active ':'')+(isToday?'today':'')+'" data-no11-calendar-day="'+day+'">'+day+'</span>';
    }
    grid.innerHTML=html;
  }

  function injectEnhancementStyle(){
    if(document.getElementById('n11-final-mobile-dashboard-style'))return;
    var style=document.createElement('style');
    style.id='n11-final-mobile-dashboard-style';
    style.textContent='\
@media(max-width:760px){\
  .n11-v4 .n11-main-content.n11-final-mobile-host{padding:20px 18px 46px!important;overflow-x:hidden!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top{display:grid!important;grid-template-columns:46px minmax(0,1fr) 46px!important;align-items:start!important;gap:14px!important;margin:0 0 22px!important;min-height:104px!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top .n11-mobile-menu{grid-column:1!important;display:grid!important;place-items:center!important;position:relative!important;width:46px!important;height:46px!important;margin:0!important;padding:0!important;border:1px solid var(--n11-line)!important;border-radius:13px!important;background:var(--n11-card)!important;color:var(--n11-ink)!important;font-size:0!important;line-height:0!important;box-shadow:0 5px 18px rgba(30,22,32,.04)!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top .n11-mobile-menu:after{content:"";display:block!important;position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;width:18px!important;height:14px!important;margin:0!important;background:linear-gradient(var(--n11-ink),var(--n11-ink)) 0 0/18px 1.5px no-repeat,linear-gradient(var(--n11-ink),var(--n11-ink)) 0 6px/18px 1.5px no-repeat,linear-gradient(var(--n11-ink),var(--n11-ink)) 0 12px/18px 1.5px no-repeat}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top>div:nth-of-type(1){grid-column:2!important;min-width:0!important;padding-top:0!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top h1{font:42px/.95 Georgia,serif!important;letter-spacing:-.045em!important;white-space:nowrap!important;margin:0!important;color:var(--n11-ink)!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top>div:nth-of-type(1)>p{margin:17px 0 0!important;color:#b56727!important;font:600 11px/1.35 Arial,sans-serif!important;letter-spacing:.29em!important;text-transform:none!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top .n11-page-actions{grid-column:3!important;display:block!important;margin:0!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top .n11-theme-wrap{display:block!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top .n11-theme{width:46px!important;height:46px!important;border-radius:13px!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top .n11-dashboard-new,.n11-v4 .n11-final-mobile-host>.n11-dashboard-summary,.n11-v4 .n11-final-mobile-host>.n11-dashboard-kpis,.n11-v4 .n11-final-mobile-host>.n11-dashboard-lists{display:none!important}\
  .n11-final-mobile-dashboard{display:grid;gap:18px;width:100%;box-sizing:border-box;color:var(--n11-ink)}\
  .n11-final-card{background:var(--n11-card);border:1px solid var(--n11-line);border-radius:22px;box-shadow:0 12px 34px rgba(42,30,35,.035);overflow:hidden}\
  .n11-final-hero{position:relative;min-height:240px;padding:30px 26px 28px 35px;box-sizing:border-box;display:flex;align-items:center}\
  .n11-final-hero:before{content:"";position:absolute;left:22px;top:53px;width:2px;height:82px;background:linear-gradient(#17324c 0 58%,#d48a46 58% 100%);border-radius:10px}\
  .n11-final-hero-copy{position:relative;z-index:2;max-width:78%}\
  .n11-final-eyebrow{margin:0 0 17px;color:#c97b13;font:700 11px/1.2 Arial,sans-serif;letter-spacing:.28em}\
  .n11-final-hero h2{margin:0 0 13px;font:34px/1.12 Georgia,serif;letter-spacing:-.025em;color:var(--n11-ink)}\
  .n11-final-hero p:last-child{margin:0;color:#7486bd;font:20px/1.42 Georgia,serif}\
  .n11-final-leaf{position:absolute;right:15px;top:25px;width:92px;height:165px;opacity:.82;color:#c88732}\
  .n11-final-leaf path{fill:none;stroke:currentColor;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}\
  .n11-final-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));padding:26px 12px}\
  .n11-final-kpi{text-align:center;padding:2px 10px;min-width:0}\
  .n11-final-kpi+.n11-final-kpi{border-left:1px solid #ead8c9}\
  .n11-final-icon{width:58px;height:58px;margin:0 auto 12px;border-radius:50%;display:grid;place-items:center;background:#fbf7f2;font:30px/1 Georgia,serif;color:#ca8613}\
  .n11-final-kpi:first-child .n11-final-icon{color:#b21325;background:#fff5f5}\
  .n11-final-kpi h3{margin:0 0 7px;color:#7589c6;font:18px/1.25 Georgia,serif;font-weight:400}\
  .n11-final-kpi strong{display:block;margin:0;color:var(--n11-ink);font:48px/.95 Georgia,serif;font-weight:400;white-space:nowrap}\
  .n11-final-kpi small{display:block;margin-top:11px;color:#7589c6;font:13px/1.35 Georgia,serif}\
  .n11-final-first-last{display:grid;grid-template-columns:1fr 1fr;padding:24px 14px}\
  .n11-final-lesson{display:grid;grid-template-columns:64px 1fr;gap:13px;align-items:center;padding:0 12px;min-width:0}\
  .n11-final-lesson+.n11-final-lesson{border-left:1px solid #ead8c9}\
  .n11-final-lesson .n11-final-icon{margin:0;width:58px;height:58px;font-size:30px}\
  .n11-final-lesson h3{margin:0 0 4px;font:18px/1.2 Georgia,serif;font-weight:400;color:var(--n11-ink)}\
  .n11-final-lesson strong{display:block;font:26px/1.1 Georgia,serif;font-weight:400;color:var(--n11-ink)}\
  .n11-final-lesson small{display:block;margin-top:5px;color:#7486bd;font:13px/1.3 Georgia,serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
  .n11-final-section{padding:26px 26px 24px}\
  .n11-final-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding-bottom:17px;border-bottom:1px solid #eadfd6}\
  .n11-final-section-head h3{margin:0 0 7px;color:#c97b13;font:700 18px/1.15 Arial,sans-serif;letter-spacing:.24em}\
  .n11-final-section-head p{margin:0;color:#7486bd;font:17px/1.3 Georgia,serif}\
  .n11-final-link{flex:0 0 auto;min-height:44px;padding:0 17px;border:1.5px solid #e09a28;border-radius:14px;background:transparent;color:var(--n11-ink);font:16px Georgia,serif;white-space:nowrap}\
  .n11-final-empty{padding:42px 12px 28px;text-align:center}\
  .n11-final-empty .n11-final-icon{width:70px;height:70px;font-size:32px}\
  .n11-final-empty h4{margin:13px 0 8px;font:25px/1.18 Georgia,serif;font-weight:400;color:var(--n11-ink)}\
  .n11-final-empty p{margin:0 auto;color:#7486bd;font:18px/1.45 Georgia,serif;max-width:285px}\
  .n11-final-flow{display:grid;grid-template-columns:58px 18px minmax(0,1fr);gap:11px;align-items:start;padding:22px 0 7px}\
  .n11-final-flow time{color:#7486bd;font:16px Georgia,serif;padding-top:10px}\
  .n11-final-flow-line{position:relative;min-height:69px;border-left:1px solid #ead7c3;margin-left:7px}\
  .n11-final-flow-line:before{content:"";position:absolute;left:-7px;top:11px;width:12px;height:12px;border:2px solid #eeb567;border-radius:50%;background:var(--n11-card)}\
  .n11-final-flow-person{padding:8px 0 18px;border-bottom:1px solid #f0e8e1}\
  .n11-final-flow-person b{display:block;font:19px Georgia,serif;color:var(--n11-ink)}\
  .n11-final-flow-person small{display:block;margin-top:4px;color:#7486bd;font:13px Georgia,serif}\
  .n11-final-pending-row{display:grid;grid-template-columns:58px minmax(0,1fr) auto;gap:14px;align-items:center;padding:21px 3px 3px}\
  .n11-final-pending-row .n11-final-icon{margin:0;width:54px;height:54px;font-size:25px;color:#b21325;background:#fff5f5}\
  .n11-final-pending-row b{display:block;font:19px Georgia,serif;color:var(--n11-ink)}\
  .n11-final-pending-row small{display:block;margin-top:5px;color:#7486bd;font:13px Georgia,serif}\
  .n11-final-mini{border:0;background:transparent;color:#c97b13;font-size:24px;padding:8px}\
  .n11-v4.n11-dark .n11-final-hero p:last-child,.n11-v4.n11-dark .n11-final-kpi h3,.n11-v4.n11-dark .n11-final-kpi small,.n11-v4.n11-dark .n11-final-lesson small,.n11-v4.n11-dark .n11-final-section-head p,.n11-v4.n11-dark .n11-final-empty p,.n11-v4.n11-dark .n11-final-flow time,.n11-v4.n11-dark .n11-final-flow-person small,.n11-v4.n11-dark .n11-final-pending-row small{color:#b8c0da!important}\
}\
@media(max-width:410px){\
  .n11-v4 .n11-main-content.n11-final-mobile-host{padding-left:14px!important;padding-right:14px!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top{grid-template-columns:43px minmax(0,1fr) 43px!important;gap:10px!important}\
  .n11-v4 .n11-final-mobile-host>.n11-page-top h1{font-size:37px!important}\
  .n11-final-hero{padding-left:30px;padding-right:18px}.n11-final-hero-copy{max-width:82%}.n11-final-leaf{right:4px;width:78px}\
  .n11-final-kpis{padding-left:4px;padding-right:4px}.n11-final-kpi{padding-left:5px;padding-right:5px}.n11-final-kpi h3{font-size:15px}.n11-final-kpi strong{font-size:40px}.n11-final-kpi small{font-size:11px}\
  .n11-final-first-last{padding-left:7px;padding-right:7px}.n11-final-lesson{grid-template-columns:50px 1fr;padding:0 7px;gap:9px}.n11-final-lesson .n11-final-icon{width:46px;height:46px;font-size:25px}.n11-final-lesson strong{font-size:23px}\
  .n11-final-section{padding:23px 19px}.n11-final-section-head h3{font-size:15px}.n11-final-section-head p{font-size:15px}.n11-final-link{padding:0 12px;font-size:14px}\
}\
.n11-v4 .n11-appt-row{position:relative;overflow:visible!important}\
.n11-v4 .n11-appt-menu{position:relative;grid-column:-2/-1!important;justify-self:end!important;z-index:12}\
.n11-v4 .n11-appt-more{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;min-width:42px!important;padding:0!important;border:1px solid var(--n11-line)!important;border-radius:11px!important;background:var(--n11-card)!important;color:var(--n11-ink)!important;font:700 22px/1 Arial,sans-serif!important;letter-spacing:1px!important}\
.n11-v4 .n11-appt-more>span{display:block!important;width:18px!important;height:4px!important;font-size:0!important;background:radial-gradient(circle at 2px 2px,currentColor 1.7px,transparent 1.8px),radial-gradient(circle at 9px 2px,currentColor 1.7px,transparent 1.8px),radial-gradient(circle at 16px 2px,currentColor 1.7px,transparent 1.8px)}\
.n11-v4 .n11-appt-menu-panel{position:absolute;right:0;top:calc(100% + 7px);display:none;min-width:190px;padding:7px;border:1px solid var(--n11-line);border-radius:12px;background:var(--n11-card);box-shadow:0 18px 45px rgba(30,22,32,.18);z-index:200}\
.n11-v4 .n11-appt-menu.open .n11-appt-menu-panel{display:grid;gap:5px}\
.n11-v4 .n11-appt-menu-panel button,.n11-v4 .n11-appt-menu-panel a{display:flex!important;align-items:center!important;justify-content:flex-start!important;width:100%!important;height:42px!important;padding:0 13px!important;border:0!important;border-radius:8px!important;background:transparent!important;color:var(--n11-ink)!important;text-decoration:none!important;font:13px Arial,sans-serif!important;white-space:nowrap!important}\
.n11-v4 .n11-appt-menu-panel button:hover,.n11-v4 .n11-appt-menu-panel a:hover{background:var(--n11-bg)!important}\
.n11-v4 .n11-appt-menu-panel .danger{color:#a3243f!important}\
@media(max-width:760px){.n11-v4 .n11-appt-menu{grid-column:4!important;grid-row:3!important}.n11-v4 .n11-appt-menu-panel{position:fixed;right:16px;left:16px;top:auto;bottom:18px;min-width:0;padding:10px;border-radius:16px}.n11-v4 .n11-appt-menu-panel button,.n11-v4 .n11-appt-menu-panel a{height:48px!important}}\
';
    document.head.appendChild(style);
  }

  function botanical(){return '<svg class="n11-final-leaf" viewBox="0 0 100 180" aria-hidden="true"><path d="M50 172C57 135 55 104 62 73C68 46 78 24 87 9"/><path d="M60 83C45 74 39 59 39 43C54 51 62 63 60 83Z"/><path d="M66 62C72 45 82 37 94 31C92 47 82 57 66 62Z"/><path d="M55 112C40 104 31 91 28 76C43 81 54 93 55 112Z"/><path d="M58 132C44 128 33 119 26 106C42 108 54 117 58 132Z"/><path d="M72 42C71 29 76 17 86 8C87 22 82 35 72 42Z"/></svg>'}

  function mobileSignature(items,info){
    return info.dateKey+'|'+items.map(function(x){return [x.id,x.status,x.date,x.time,x.name,x.service].join(':')}).join('|')+'|'+String(localStorage.getItem('no11-appointment-slots')||'');
  }

  function renderMobileDashboard(){
    var mobile=window.matchMedia&&window.matchMedia('(max-width:760px)').matches;
    var title=document.querySelector('.n11-page-top h1');
    var main=document.querySelector('.n11-main-content');
    var existing=document.querySelector('.n11-final-mobile-dashboard');
    if(!mobile||!title||title.textContent.trim()!=='Genel Bakış'||!main){
      if(existing)existing.remove();
      if(main)main.classList.remove('n11-final-mobile-host');
      lastMobileSignature='';
      return;
    }

    injectEnhancementStyle();
    main.classList.add('n11-final-mobile-host');
    var info=turkeyNow();
    var dateText=turkeyLabel(info);
    var dateNode=title.parentElement&&title.parentElement.querySelector('p');
    setText(dateNode,dateText);

    var items=readArray('no11-appointments');
    var signature=mobileSignature(items,info);
    if(existing&&signature===lastMobileSignature)return;
    lastMobileSignature=signature;

    var pending=items.filter(function(x){return normalizedStatus(x)==='pending'});
    var todayConfirmed=items.filter(function(x){return normalizedStatus(x)==='confirmed'&&String(x.date||'')===info.dateKey}).sort(function(a,b){return timeValue(a).localeCompare(timeValue(b))});
    var monthConfirmed=items.filter(function(x){return normalizedStatus(x)==='confirmed'&&String(x.date||'').indexOf(info.monthKey)===0});
    var first=todayConfirmed[0]||null;
    var last=todayConfirmed.length?todayConfirmed[todayConfirmed.length-1]:null;
    var slots=readArray('no11-appointment-slots');
    var capacity=Math.max(slots.length||6,1);
    var occupancy=Math.min(100,Math.round(todayConfirmed.length/capacity*100));

    var flowHtml=todayConfirmed.length?todayConfirmed.slice(0,4).map(function(x){return '<div class="n11-final-flow"><time>'+esc(x.time||'—')+'</time><span class="n11-final-flow-line"></span><div class="n11-final-flow-person"><b>'+esc(x.name||'İsimsiz')+'</b><small>'+esc(x.service||'Pilates')+'</small></div></div>'}).join(''):'<div class="n11-final-empty"><div class="n11-final-icon">▣</div><h4>Bugün onaylı ders yok</h4><p>Yeni bir randevu onaylandığında burada görünecek.</p></div>';
    var pendingHtml=pending.length?pending.slice(0,3).map(function(x){return '<div class="n11-final-pending-row"><div class="n11-final-icon">▤</div><div><b>'+esc(x.name||'Yeni talep')+'</b><small>'+esc((x.date||'')+(x.time?' · '+x.time:'')+(x.service?' · '+x.service:''))+'</small></div><button class="n11-final-mini" type="button" data-final-page="appointments" aria-label="Randevuları aç">›</button></div>'}).join(''):'<div class="n11-final-empty"><div class="n11-final-icon">▤</div><h4>Yeni talep bulunmuyor</h4><p>Onayınızı bekleyen yeni bir talep yok.</p></div>';

    var node=document.createElement('section');
    node.className='n11-final-mobile-dashboard';
    node.innerHTML='\
      <article class="n11-final-card n11-final-hero">\
        <div class="n11-final-hero-copy"><p class="n11-final-eyebrow">BUGÜNÜN ÖZETİ</p><h2>'+greeting(info.hour)+', Eda Hanım.</h2><p>Bugün '+todayConfirmed.length+' onaylı dersiniz var. '+pending.length+' yeni talep onayınızı bekliyor.</p></div>'+botanical()+'\
      </article>\
      <article class="n11-final-card n11-final-kpis">\
        <div class="n11-final-kpi"><div class="n11-final-icon">◷</div><h3>Bekleyen Talep</h3><strong>'+pending.length+'</strong><small>Onay bekleyen yeni talep</small></div>\
        <div class="n11-final-kpi"><div class="n11-final-icon">▥</div><h3>Bu Ay Toplam</h3><strong>'+monthConfirmed.length+'</strong><small>Bu ayki onaylı ders sayısı</small></div>\
        <div class="n11-final-kpi"><div class="n11-final-icon">◔</div><h3>Günlük Doluluk</h3><strong>%'+occupancy+'</strong><small>Bugünkü doluluk oranı</small></div>\
      </article>\
      <article class="n11-final-card n11-final-first-last">\
        <div class="n11-final-lesson"><div class="n11-final-icon">☀</div><div><h3>İlk Ders</h3><strong>'+(first?esc(first.time||'—'):'—')+'</strong><small>'+(first?esc(first.name||''):'Bugün ders yok')+'</small></div></div>\
        <div class="n11-final-lesson"><div class="n11-final-icon">☀</div><div><h3>Son Ders</h3><strong>'+(last?esc(last.time||'—'):'—')+'</strong><small>'+(last?esc(last.name||''):'Bugün ders yok')+'</small></div></div>\
      </article>\
      <article class="n11-final-card n11-final-section">\
        <div class="n11-final-section-head"><div><h3>BUGÜNÜN AKIŞI</h3><p>Bugünkü onaylı dersleriniz</p></div><button type="button" class="n11-final-link" data-final-page="program">Tüm program　→</button></div>'+flowHtml+'\
      </article>\
      <article class="n11-final-card n11-final-section">\
        <div class="n11-final-section-head"><div><h3>ONAY BEKLEYENLER</h3><p>Onayınızı bekleyen yeni talepler</p></div><button type="button" class="n11-final-link" data-final-page="appointments">Tümünü gör　→</button></div>'+pendingHtml+'\
      </article>';

    if(existing)existing.replaceWith(node);else{
      var top=document.querySelector('.n11-page-top');
      if(top&&top.parentNode)top.parentNode.insertBefore(node,top.nextSibling);
    }
  }

  function desktopMetrics(){
    if(window.matchMedia&&window.matchMedia('(max-width:760px)').matches)return;
    var title=document.querySelector('.n11-page-top h1');
    if(!title||title.textContent.trim()!=='Genel Bakış')return;

    var info=turkeyNow();
    var items=readArray('no11-appointments');
    var pending=items.filter(function(x){return normalizedStatus(x)==='pending'});
    var todayConfirmed=items.filter(function(x){
      return normalizedStatus(x)==='confirmed'&&String(x.date||'')===info.dateKey;
    }).sort(function(a,b){return timeValue(a).localeCompare(timeValue(b))});
    var monthConfirmed=items.filter(function(x){
      return normalizedStatus(x)==='confirmed'&&String(x.date||'').indexOf(info.monthKey)===0;
    });
    var slots=readArray('no11-appointment-slots');
    var capacity=Math.max(slots.length||6,1);
    var occupancy=Math.min(100,Math.round(todayConfirmed.length/capacity*100));
    var first=todayConfirmed[0]||null;
    var last=todayConfirmed.length?todayConfirmed[todayConfirmed.length-1]:null;

    var summaryCopy=document.querySelector('.n11-dashboard-summary .n11-summary-copy');
    if(summaryCopy){
      var heading=summaryCopy.querySelector('h2');
      var sub=summaryCopy.querySelector('span');
      setText(heading,todayConfirmed.length+' onaylı dersiniz var.');
      setText(sub,pending.length+' yeni talep onayınızı bekliyor.');
    }

    var summaryItems=document.querySelectorAll('.n11-dashboard-summary dl>div');
    if(summaryItems[0]){
      var confirmedValue=summaryItems[0].querySelector('dd');
      setText(confirmedValue,todayConfirmed.length);
    }
    if(summaryItems[1]){
      var pendingValue=summaryItems[1].querySelector('dd');
      setText(pendingValue,pending.length);
    }
    if(summaryItems[2]){
      var firstTime=summaryItems[2].querySelector('dd');
      var firstName=summaryItems[2].querySelector('small');
      setText(firstTime,first?first.time||'—':'—');
      setText(firstName,first?first.name||'':'Bugün ders yok');
    }
    if(summaryItems[3]){
      var lastTime=summaryItems[3].querySelector('dd');
      var lastName=summaryItems[3].querySelector('small');
      setText(lastTime,last?last.time||'—':'—');
      setText(lastName,last?last.name||'':'Bugün ders yok');
    }

    var kpis=document.querySelectorAll('.n11-dashboard-kpis button b');
    setText(kpis[0],pending.length);
    setText(kpis[1],monthConfirmed.length);
    setText(kpis[2],'%'+occupancy);

    var todayIds={};
    todayConfirmed.forEach(function(item){todayIds[String(item.id)]=true});
    document.querySelectorAll('.n11-dashboard-lists .n11-flow-list .n11-record').forEach(function(row){
      var shouldHide=!todayIds[String(row.dataset.id||'')];
      if(row.hidden!==shouldHide)row.hidden=shouldHide;
    });
  }

  function enhanceAppointmentMenus(){
    var mobile=window.matchMedia&&window.matchMedia('(max-width:760px)').matches;
    if(!mobile){
      document.querySelectorAll('.n11-appt-menu').forEach(function(menu){
        var row=menu.closest('.n11-appt-row');
        var panel=menu.querySelector('.n11-appt-menu-panel');
        if(row&&panel){
          Array.from(panel.children).forEach(function(action){
            if(action.matches('a.n11-whatsapp'))action.textContent='◉';
            row.insertBefore(action,menu);
          });
        }
        menu.remove();
      });
      return;
    }
    document.querySelectorAll('.n11-appt-row').forEach(function(row){
      if(row.querySelector('.n11-appt-menu'))return;
      var actions=[];
      row.querySelectorAll(':scope>button[data-detail],:scope>button[data-approve],:scope>button[data-reject],:scope>a.n11-whatsapp').forEach(function(action){
        actions.push(action);
      });
      if(!actions.length)return;
      row.querySelectorAll(':scope>.n11-dash').forEach(function(dash){dash.remove()});
      var wrap=document.createElement('div');
      wrap.className='n11-appt-menu';
      var more=document.createElement('button');
      more.type='button';
      more.className='n11-appt-more';
      more.dataset.no11ApptMore='1';
      more.setAttribute('aria-label','Randevu işlemleri');
      more.setAttribute('aria-expanded','false');
      more.innerHTML='<span aria-hidden="true">•••</span>';
      var panel=document.createElement('div');
      panel.className='n11-appt-menu-panel';
      actions.forEach(function(action){
        if(action.matches('a.n11-whatsapp'))action.textContent='WhatsApp';
        panel.appendChild(action);
      });
      wrap.appendChild(more);
      wrap.appendChild(panel);
      row.appendChild(wrap);
    });
  }

  function apply(){
    if(busy)return;busy=true;
    try{
      injectEnhancementStyle();
      var title=document.querySelector('.n11-page-top h1');
      if(title&&title.textContent.trim()==='Genel Bakış'){
        var p=title.parentElement&&title.parentElement.querySelector('p');
        setText(p,label(new Date()));
      }
      renderMobileDashboard();
      desktopMetrics();
      enhanceAppointmentMenus();
    }finally{busy=false}
  }

  document.addEventListener('click',function(event){
    var more=event.target.closest&&event.target.closest('[data-no11-appt-more]');
    if(more){
      event.preventDefault();
      event.stopPropagation();
      var menu=more.closest('.n11-appt-menu');
      document.querySelectorAll('.n11-appt-menu.open').forEach(function(other){
        if(other!==menu){
          other.classList.remove('open');
          var otherButton=other.querySelector('[data-no11-appt-more]');
          if(otherButton)otherButton.setAttribute('aria-expanded','false');
        }
      });
      var open=menu.classList.toggle('open');
      more.setAttribute('aria-expanded',open?'true':'false');
      return;
    }
    if(!(event.target.closest&&event.target.closest('.n11-appt-menu-panel'))){
      document.querySelectorAll('.n11-appt-menu.open').forEach(function(menu){
        menu.classList.remove('open');
        var button=menu.querySelector('[data-no11-appt-more]');
        if(button)button.setAttribute('aria-expanded','false');
      });
    }
    var finalPage=event.target.closest&&event.target.closest('[data-final-page]');
    if(finalPage){
      var target=document.querySelector('.n11-main-side [data-page="'+finalPage.dataset.finalPage+'"]');
      if(target)target.click();
      return;
    }
  },true);

  window.addEventListener('resize',function(){setTimeout(apply,60)});
  window.addEventListener('storage',function(e){if(e.key==='no11-appointments'||e.key==='no11-appointment-slots')setTimeout(apply,0)});
  window.addEventListener('no11-appointments-updated',function(){setTimeout(apply,0)});
  var observer=new MutationObserver(function(){setTimeout(apply,0)});
  function start(){if(document.body)observer.observe(document.body,{childList:true,subtree:true});apply()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
