const KEY='no11:site-settings';
const DEFAULT_SETTINGS={
  businessName:'No.11 Pilates Studio',
  description:'Zihninle bedenini buluştur.\nGüçlü, esnek ve dengede bir sen için buradayız.',
  phone:'0 532 515 92 11',
  whatsapp:'+90 532 515 92 11',
  instagram:'@no11.pilatesstudio',
  address:'Balat Mh. Alan Sk. No:9B, Nilüfer / Bursa',
  maps:'https://www.google.com/maps/place/No.11+pilates+studio/@40.259696,28.941868,17z',
  email:'',siteVisible:true,contactVisible:true,appointmentInterval:'60'
};
function env(){return {url:process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN}}
async function command(args){const e=env();if(!e.url||!e.token)throw new Error('storage');const response=await fetch(e.url,{method:'POST',headers:{authorization:'Bearer '+e.token,'content-type':'application/json'},body:JSON.stringify(args),cache:'no-store'});if(!response.ok)throw new Error('storage');return (await response.json()).result}
function text(value,max){return String(value||'').trim().slice(0,max)}
function clean(body){
  if(!body||typeof body!=='object')throw new Error('invalid');
  const data={...DEFAULT_SETTINGS};
  data.businessName=text(body.businessName,100)||DEFAULT_SETTINGS.businessName;
  data.description=text(body.description,500);
  data.phone=text(body.phone,40);
  data.whatsapp=text(body.whatsapp,40)||data.phone;
  data.instagram=text(body.instagram,120);
  data.address=text(body.address,300);
  data.maps=text(body.maps,500);
  data.email=text(body.email,160);
  data.siteVisible=body.siteVisible!==false;
  data.contactVisible=body.contactVisible!==false;
  data.appointmentInterval=text(body.appointmentInterval,10)||'60';
  if(data.maps&&!/^https:\/\//i.test(data.maps))throw new Error('invalid maps');
  return data;
}
export async function GET(){try{const raw=await command(['GET',KEY]);const settings=raw?clean(JSON.parse(raw)):DEFAULT_SETTINGS;return Response.json({settings,persistent:true},{headers:{'cache-control':'no-store'}})}catch(error){return Response.json({settings:DEFAULT_SETTINGS,persistent:false},{headers:{'cache-control':'no-store'}})}}
export async function PUT(request){try{const settings=clean(await request.json());await command(['SET',KEY,JSON.stringify(settings)]);return Response.json({ok:true,settings,persistent:true},{headers:{'cache-control':'no-store'}})}catch(error){return Response.json({error:'save failed'},{status:400,headers:{'cache-control':'no-store'}})}}
