import { NextResponse } from 'next/server';
import { firebaseConfigured, listAppointments, saveAppointment, deleteAppointment } from '../../../lib/firebase-firestore.js';
import { isAdminRequest } from '../../../lib/no11-admin-auth.js';

export const dynamic = 'force-dynamic';

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'cache-control': 'no-store, max-age=0' },
  });
}

function normalizeAppointment(input = {}, { publicCreate = false } = {}) {
  const id = String(input.id || `apt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const normalized = {
    ...input,
    id,
    name: String(input.name || '').trim(),
    phone: String(input.phone || '').trim(),
    service: String(input.service || input.lesson || 'Pilates').trim(),
    date: String(input.date || '').trim(),
    time: String(input.time || '').trim(),
    status: ['pending', 'confirmed', 'rejected'].includes(input.status) ? input.status : 'pending',
    studentNote: String(input.studentNote || input.note || '').trim(),
    managerNote: String(input.managerNote || '').trim(),
    createdAt: input.createdAt || new Date().toISOString(),
  };

  if (publicCreate) {
    normalized.status = 'pending';
    normalized.managerNote = '';
  }

  return normalized;
}

export async function GET(request) {
  if (!isAdminRequest(request)) return json({ error: 'unauthorized' }, 401);
  if (!firebaseConfigured()) return json({ configured: false, appointments: [] }, 503);
  try {
    const appointments = await listAppointments();
    return json({ configured: true, appointments });
  } catch (error) {
    console.error('Appointments GET failed:', error);
    return json({ error: 'appointments_load_failed' }, 500);
  }
}

export async function POST(request) {
  if (!firebaseConfigured()) return json({ error: 'firebase_not_configured' }, 503);
  try {
    const body = await request.json();
    const appointment = normalizeAppointment(body, { publicCreate: true });
    if (!appointment.name || !appointment.phone) return json({ error: 'missing_required_fields' }, 400);
    const saved = await saveAppointment(appointment);
    return json({ ok: true, appointment: { id: saved.id, status: saved.status } }, 201);
  } catch (error) {
    console.error('Appointments POST failed:', error);
    return json({ error: 'appointment_create_failed' }, 500);
  }
}

export async function PUT(request) {
  if (!isAdminRequest(request)) return json({ error: 'unauthorized' }, 401);
  if (!firebaseConfigured()) return json({ error: 'firebase_not_configured' }, 503);
  try {
    const body = await request.json();
    if (!body?.id) return json({ error: 'missing_id' }, 400);
    const saved = await saveAppointment(normalizeAppointment(body));
    return json({ ok: true, appointment: saved });
  } catch (error) {
    console.error('Appointments PUT failed:', error);
    return json({ error: 'appointment_update_failed' }, 500);
  }
}

export async function DELETE(request) {
  if (!isAdminRequest(request)) return json({ error: 'unauthorized' }, 401);
  if (!firebaseConfigured()) return json({ error: 'firebase_not_configured' }, 503);
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return json({ error: 'missing_id' }, 400);
    await deleteAppointment(id);
    return json({ ok: true });
  } catch (error) {
    console.error('Appointments DELETE failed:', error);
    return json({ error: 'appointment_delete_failed' }, 500);
  }
}
