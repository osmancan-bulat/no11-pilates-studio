'use client';
import {useEffect,useMemo,useState} from 'react';

const seed=[
 {id:'NO11-241',time:'10:30',name:'Selin Yılmaz',phone:'905551112233',service:'Reformer Pilates',status:'confirmed',studentNote:'Bel bölgemde hassasiyet var, dikkat edelim.',managerNote:'İlk ders — postür analizi yapılacak.'},
 {id:'NO11-242',time:'14:00',name:'Zeynep Akın',phone:'905552223344',service:'Hamile Pilatesi',status:'pending',studentNote:'22. haftadayım, doktor onayım var.',managerNote:''},
 {id:'NO11-243',time:'18:00',name:'Derya Şahin',phone:'905553334455',service:'Birebir Pilates',status:'confirmed',studentNote:'Omuz hareketliliğimi geliştirmek istiyorum.',managerNote:'Akşam seansı tercih ediyor.'}
];
const statusText=s=>s==='confirmed'?'Onaylandı':'Bekliyor';
export default function AdminApp(){
 const [items,setItems]=useState([]),[selectedId,setSelectedId]=useState(''),[dark,setDark]=useState(false),[mobileDetail,setMobileDetail]=useState(false),[toast,setToast]=useState('');
 useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem('no11-appointments')||'[]');const normalized=raw.map(x=>({...x,studentNote:x.studentNote??x.note??'',managerNote:x.managerNote??localStorage.getItem('no11-manager-note-'+x.id)??''}));const value=normalized.length?normalized:seed;setItems(value);setSelectedId(value[0].id);setDark(localStorage.getItem('no11-admin-theme')==='dark')}catch{setItems(seed);setSelectedId(seed[0].id)}},[]);
 const selected=useMemo(()=>items.find(x=>x.id===selectedId)||items[0],[items,selectedId]);
 function save(next=items,msg){setItems(next);localStorage.setItem('no11-appointments',JSON.stringify(next));if(msg){setToast(msg);setTimeout(()=>setToast(''),1800)}}
 function update(patch,msg){save(items.map(x=>x.id===selected.id?{...x,...patch}:x),msg)}
 function choose(id){setSelectedId(id);setMobileDetail(true)}
 function toggleTheme(){const v=!dark;setDark(v);localStorage.setItem('no11-admin-theme',v?'dark':'light')}
 return <main className={'admin-app'+(dark?' admin-dark':'')}>
  <aside className="admin-side"><a className="admin-logo" href="/">No.11<small>PILATES STUDIO</small></a><nav><button>⌂ <span>Genel Bakış</span></button><button className="active">▣ <span>Günlük Program</span></button><button>□ <span>Randevular</span></button><button>♙ <span>Ekip</span></button><button>⚙ <span>Site Ayarları</span></button></nav><div className="side-foot"><b>Eda Dinçer</b><small>Yönetici</small></div></aside>
  <section className={'admin-shell'+(mobileDetail?' show-detail':'')}>
   <header className="admin-mobile-head"><button onClick={()=>setMobileDetail(false)}>{mobileDetail?'←':'No.11'}</button><h1>{mobileDetail?'Randevu Detayı':'Program'}</h1><button onClick={toggleTheme}>◐</button></header>
   <header className="admin-top"><div><p className="admin-eyebrow">YÖNETİCİ PANELİ</p><h1>Günlük Program</h1></div><div className="admin-date">‹ <span>▣ &nbsp; Bugün</span> ›</div><button className="theme-btn" onClick={toggleTheme}>◐</button><button className="new-btn">＋ Yeni randevu</button></header>
   <div className="mobile-days">{['Pzt 31','Sal 1','Çar 2','Per 3','Cum 4'].map((x,i)=><span className={i===3?'active':''} key={x}>{x.split(' ')[0]}<b>{x.split(' ')[1]}</b></span>)}</div>
   <section className="schedule panel"><p className="admin-eyebrow">BUGÜN</p>{items.map((a,i)=><div className="schedule-row" key={a.id}><span className="period">{i===0?'SABAH':i===1?'ÖĞLE':'AKŞAM'}</span><span className="line"/><article onClick={()=>choose(a.id)} className={'appointment '+a.status+(selectedId===a.id?' selected':'')}><time>{a.time||'—'}</time><div><h3>{a.name}</h3><p>{a.service}</p></div><span className={'badge '+a.status}>{statusText(a.status)}</span>{(a.studentNote||a.managerNote)&&<small>◯ Not var</small>}</article></div>)}</section>
   <section className="admin-center"><div className="calendar panel"><header>‹ <b>EYLÜL 2026</b> ›</header><div className="calendar-grid">{['P','S','Ç','P','C','C','P'].map((x,i)=><small key={i}>{x}</small>)}{Array.from({length:30},(_,i)=><span className={i===2?'active':i===10?'today':''} key={i}>{i+1}</span>)}</div></div><div className="today panel"><p className="admin-eyebrow">BUGÜNÜN RANDEVULARI</p>{items.map(a=><button key={a.id} onClick={()=>choose(a.id)}><time>{a.time}</time><span><b>{a.name}</b><small>{a.service}</small></span><em className={a.status}>{statusText(a.status)}</em></button>)}</div></section>
   {selected&&<aside className="detail panel"><div className="detail-mobile-back"><button onClick={()=>setMobileDetail(false)}>← Programa dön</button></div><p className="admin-eyebrow">RANDEVU DETAYI</p><div className="monogram"><span>N.11</span></div><div className="person"><time>{selected.time||'—'}</time><div><h2>{selected.name}</h2><p>{selected.service}</p></div><span className={'badge '+selected.status}>{statusText(selected.status)}</span></div><section><h3>Öğrencinin notu</h3><div className="student-note">{selected.studentNote||'Öğrenci not bırakmadı.'}</div></section><section><h3>Yönetici notu</h3><textarea value={selected.managerNote||''} onChange={e=>update({managerNote:e.target.value})} placeholder="Randevu hakkında özel not ekleyin…"/><button className="save-btn" onClick={()=>save(items,'Yönetici notu kaydedildi')}>Notu kaydet</button></section><div className="contact"><a href={'https://wa.me/'+selected.phone} target="_blank">◉ WhatsApp</a><a href={'tel:+'+selected.phone}>⌕ Ara</a></div><button className="confirm" onClick={()=>update({status:'confirmed'},'Randevu onaylandı')}>Randevuyu onayla</button></aside>}
   <nav className="bottom-nav"><button>⌂<small>Ana Sayfa</small></button><button className="active">▣<small>Program</small></button><button>□<small>Randevular</small></button><button>⚙<small>Ayarlar</small></button></nav>
  </section>{toast&&<div className="admin-toast">{toast}</div>}
 </main>
}
