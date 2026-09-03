(function(){
  'use strict';
  function esc(value){return String(value||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function render(team){
    var section=document.querySelector('#ekip');if(!section)return;
    var people=(Array.isArray(team)?team:[]).filter(function(member){return member.active!==false});
    if(!people.length){section.hidden=true;return} section.hidden=false;
    var lead=people.find(function(member){return member.featured})||people[0];
    var others=people.filter(function(member){return member.id!==lead.id});
    section.dataset.no11LiveTeam='1';
    section.innerHTML='<p class="eyebrow">UZMAN REHBERLİK</p><div class="founder"><div class="founder-image"><img src="'+esc(lead.image)+'" alt="'+esc(lead.name)+'" loading="lazy"></div><div class="founder-copy"><span>'+esc(lead.role)+'</span><h2>'+esc(lead.name)+'</h2><p>'+esc(lead.bio)+'</p></div></div>'+(others.length?'<div class="team-cards">'+others.map(function(member){return '<article><img src="'+esc(member.image)+'" alt="'+esc(member.name)+'" loading="lazy"><div><span>'+esc(member.role)+'</span><h3>'+esc(member.name)+'</h3><p>'+esc(member.bio)+'</p></div></article>'}).join('')+'</div>':'');
  }
  function sync(){fetch('/api/no11-team?ts='+Date.now(),{cache:'no-store'}).then(function(response){return response.json()}).then(function(data){render(data.team||[])}).catch(function(){})}
  function start(){sync();setTimeout(sync,1400)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('pageshow',function(event){if(event.persisted)sync()});
})();
