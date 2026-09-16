import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../lib/no11-admin-auth.js';
import { firebaseConfigured, savePushDevice, deletePushDeviceByToken } from '../../../lib/firebase-firestore.js';

export const dynamic='force-dynamic';
function json(data,status=200){return NextResponse.json(data,{status,headers:{'cache-control':'no-store, max-age=0'}});}
export async function GET(request){
  if(!isAdminRequest(request))return json({error:'unauthorized'},401);
  const vapidKey=String(process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_KEY||'').trim();
  return json({enabled:firebaseConfigured()&&Boolean(vapidKey&&process.env.WEB_PUSH_VAPID_PRIVATE_KEY),vapidKey});
}
export async function POST(request){
  if(!isAdminRequest(request))return json({error:'unauthorized'},401);
  if(!firebaseConfigured())return json({error:'firebase_not_configured'},503);
  try{
    const body=await request.json();
    const subscription=body?.subscription;
    const token=String(body?.token||subscription?.endpoint||'').trim();
    const saved=await savePushDevice(token,body?.label||'Osman iPhone',{type:'webpush',subscription});
    return json({ok:true,device:saved},201);
  }catch(error){console.error('Push subscribe failed:',error);return json({error:'push_subscribe_failed'},500);}
}
export async function DELETE(request){
  if(!isAdminRequest(request))return json({error:'unauthorized'},401);
  try{const body=await request.json();await deletePushDeviceByToken(body?.token);return json({ok:true});}catch(error){console.error('Push unsubscribe failed:',error);return json({error:'push_unsubscribe_failed'},500);}
}
