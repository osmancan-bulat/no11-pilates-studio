(function(){
  'use strict';
  var data=null;
  function option(value,label){var o=document.createElement('option');o.value=value;o.textContent=label||value;return o}
  function selects(){var form=document.querySelector('.booking-form');if(!form)return null;var all=form.querySelectorAll('select');return all.length>=2?{form:form,lesson:all[0],time:all[1],date:form.querySelector('input[name="date"]')}:null}
  function fill(select,values,placeholder){var current=select.value;select.innerHTML='';var first=option('',placeholder);first.disabled=true;select.appendChild(first);values.forEach(function(x){select.appendChild(option(x.value||x.name,x.label||x.name||x))});select.value=values.some(function(x){return (x.value||x.name||x)===current})?current:'';var display=select.previousElementSibling;if(display&&display.classList.contains('premium-select')){var span=display.querySelector('span');if(span)span.textContent=select.value||placeholder}}
  function availableSlots(dateValue){if(!data)return[];if(!dateValue)return data.slots;var date=new Date(dateValue+'T12:00:00'),day=(date.getDay()+6)%7,h=data.hours[day];if(!h||h.closed)return[];return data.slots.filter(function(t){return t>=h.open&&t<h.close})}
  function apply(){var s=selects();if(!s||!data)return;fill(s.lesson,data.lessons.map(function(x){return {value:x.name,label:x.name+' · '+x.duration+' dk'}}),'Bir ders türü seçin');fill(s.time,availableSlots(s.date&&s.date.value),'Saat seçin');if(s.date&&!s.date.dataset.no11Schedule){s.date.dataset.no11Schedule='1';s.date.addEventListener('change',function(){fill(s.time,availableSlots(s.date.value),'Saat seçin')})}}
  function start(){fetch('/api/no11-schedule?ts='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(x){data=x;apply();setTimeout(apply,800);setTimeout(apply,2200)}).catch(function(){})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
