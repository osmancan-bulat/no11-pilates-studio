(function(){
  'use strict';
  var months=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  function format(value){var m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?(Number(m[3])+' '+months[Number(m[2])-1]+' '+m[1]):'Tarih seçin'}
  function sync(){var input=document.querySelector('.n11-date-search');if(!input)return;var label=input.closest('.n11-date-field'),span=label&&label.querySelector('span');if(span)span.textContent=format(input.value)}
  document.addEventListener('change',function(e){if(e.target&&e.target.matches&&e.target.matches('.n11-date-search'))setTimeout(sync,0)},true);
  document.addEventListener('input',function(e){if(e.target&&e.target.matches&&e.target.matches('.n11-date-search'))setTimeout(sync,0)},true);
  document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('[data-page="appointments"]'))setTimeout(sync,0)},true);
  setTimeout(sync,250);
})();