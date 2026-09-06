import { NextResponse } from 'next/server';
import { firebaseConfigured, checkFirestore } from '../../../lib/firebase-firestore.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!firebaseConfigured()) {
    return NextResponse.json(
      { configured: false, firestore: false },
      { status: 503, headers: { 'cache-control': 'no-store, max-age=0' } },
    );
  }

  try {
    const ok = await checkFirestore();
    return NextResponse.json(
      { configured: true, firestore: Boolean(ok) },
      { status: 200, headers: { 'cache-control': 'no-store, max-age=0' } },
    );
  } catch (error) {
    console.error('Firestore health check failed:', error);
    return NextResponse.json(
      { configured: true, firestore: false },
      { status: 500, headers: { 'cache-control': 'no-store, max-age=0' } },
    );
  }
}
