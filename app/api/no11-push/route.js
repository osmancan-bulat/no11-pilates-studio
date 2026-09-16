import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../lib/no11-admin-auth.js';
import { firebaseConfigured, savePushDevice, deletePushDeviceByToken } from '../../../lib/firebase-firestore.js';

export const dynamic='force-dynamic';
function json(data,status=200){return NextResponse.json(data,{status,headers:{'cache-control':'no-store, max-age=0'}});}
export async function GET(request){
  if(!isAdminRequest(request))return json({error:'unauthorized'},401);
  return json({enabled:firebaseConfigured()&&Boolean(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY),vapidKey:String(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY||'')});
}
export async function POST(request){
  if(!isAdminRequest(request))return json({error:'unauthorized'},401);
  if(!firebaseConfigured())return json({error:'firebase_not_configured'},503);
  try{const body=await request.json();const saved=await savePushDevice(body?.token,body?.label||'Osman iPhone');return json({ok:true,device:saved},201);}catch(error){console.error('Push subscribe failed:',error);return json({error:'push_subscribe_failed'},500);}
}
export async function DELETE(request){
  if(!isAdminRequest(request))return json({error:'unauthorized'},401);
  try{const body=await request.json();await deletePushDeviceByToken(body?.token);return json({ok:true});}catch(error){console.error('Push unsubscribe failed:',error);return json({error:'push_unsubscribe_failed'},500);}
}
