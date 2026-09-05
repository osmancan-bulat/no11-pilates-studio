const KEY='no11:schedule';
const DEFAULT_DATA={
  lessons:[{id:'lesson-1',name:'Birebir Pilates',duration:50},{id:'lesson-2',name:'Tanışma Dersi',duration:50},{id:'lesson-3',name:'Duet / İkili Pilates',duration:50},{id:'lesson-4',name:'Omurga Odaklı Pilates',duration:50},{id:'lesson-5',name:'Hamile Pilatesi',duration:50}],
  slots:['09:00','10:30','12:00','14:00','16:30','18:00','19:30'],
  hours:['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'].map((day,i)=>({day,open:i===6?'':i===5?'09:00':'07:00',close:i===6?'':i===5?'18:00':'21:00',closed:i===6}))
};
function env(){return {url:process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN}}
async function command(args){const e=env();if(!e.url||!e.token)throw new Error('storage');const response=await fetch(e.url,{method:'POST',headers:{authorization:'Bearer '+e.token,'content-type':'application/json'},body:JSON.stringify(args),cache:'no-store'});if(!response.ok)throw new Error('storage');return (await response.json()).result}
function validTime(value){return typeof value==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(value)}
function clean(body){
  if(!body||!Array.isArray(body.lessons)||!Array.isArray(body.slots)||!Array.isArray(body.hours))throw new Error('invalid');
  const lessons=body.lessons.slice(0,20).map((x,i)=>({id:String(x.id||'lesson-'+i),name:String(x.name||'').trim().slice(0,80),duration:Math.max(15,Math.min(240,Number(x.duration)||50))})).filter(x=>x.name);
  const slots=[...new Set(body.slots.filter(validTime))].sort().slice(0,40);
  const hours=DEFAULT_DATA.hours.map((base,i)=>{const x=body.hours[i]||base;const closed=!!x.closed;return {day:base.day,open:closed?'':validTime(x.open)?x.open:base.open,close:closed?'':validTime(x.close)?x.close:base.close,closed}});
  if(!lessons.length||!slots.length)throw new Error('invalid');return {lessons,slots,hours};
}
export async function GET(){try{const raw=await command(['GET',KEY]);return Response.json(raw?JSON.parse(raw):DEFAULT_DATA,{headers:{'cache-control':'no-store'}})}catch(error){return Response.json(DEFAULT_DATA,{headers:{'cache-control':'no-store'}})}}
export async function PUT(request){try{const data=clean(await request.json());await command(['SET',KEY,JSON.stringify(data)]);return Response.json({...data,persistent:true},{headers:{'cache-control':'no-store'}})}catch(error){return Response.json({error:'save failed'},{status:400})}}
