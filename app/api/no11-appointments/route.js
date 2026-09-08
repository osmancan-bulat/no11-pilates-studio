import { NextResponse } from 'next/server';
import {
  firebaseConfigured,
  listAppointments,
  saveAppointment,
  deleteAppointment,
} from '../../../lib/firebase-firestore.js';

const LEGACY_ORIGIN =
  'https://no11-pilates-studio-2eta1urgj-osmancanbulat197-7442s-projects.vercel.app';

export const dynamic = 'force-dynamic';

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'cache-control': 'no-store, max-age=0' },
  });
}

function normalizeAppointment(input = {}, { publicCreate = false } = {}) {
  const now = new Date().toISOString();
  const appointment = {
    ...input,
    id: String(input.id || `apt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    name: String(input.name || '').trim(),
    phone: String(input.phone || '').trim(),
    service: String(input.service || input.lesson || 'Pilates').trim(),
    date: String(input.date || '').trim(),
    time: String(input.time || '').trim(),
    studentNote: String(input.studentNote || input.note || '').trim(),
    managerNote: String(input.managerNote || '').trim(),
    status: ['pending', 'confirmed', 'rejected'].includes(input.status) ? input.status : 'pending',
    createdAt: input.createdAt || now,
  };

  if (publicCreate) {
    appointment.status = 'pending';
    appointment.managerNote = '';
  }

  return appointment;
}

async function legacyAppointments() {
  try {
    const response = await fetch(new URL('/api/no11-appointments', LEGACY_ORIGIN), {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`legacy_get_${response.status}`);
    const data = await response.json();
    return Array.isArray(data?.appointments) ? data.appointments : [];
  } catch (error) {
    console.error('Legacy appointments GET failed:', error);
    return [];
  }
}

export async function GET() {
  try {
    const [legacy, firebase] = await Promise.all([
      legacyAppointments(),
      firebaseConfigured() ? listAppointments() : Promise.resolve([]),
    ]);
    const merged = new Map();
    legacy.forEach((item) => merged.set(String(item.id), item));
    firebase.forEach((item) => merged.set(String(item.id), item));
    const appointments = Array.from(merged.values()).sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
    );
    return json({ appointments, persistent: true });
  } catch (error) {
    console.error('Appointments GET failed:', error);
    return json({ error: 'appointments_load_failed' }, 500);
  }
}

export async function POST(request) {
  if (!firebaseConfigured()) return json({ error: 'firebase_not_configured' }, 503);
  try {
    const appointment = normalizeAppointment(await request.json(), { publicCreate: true });
    if (!appointment.name || !appointment.phone || !appointment.date || !appointment.time) {
      return json({ error: 'missing_required_fields' }, 400);
    }
    const [firebase, legacy] = await Promise.all([listAppointments(), legacyAppointments()]);
    const occupied = [...firebase, ...legacy].some((item) =>
      item?.status !== 'rejected' &&
      String(item?.date || '') === appointment.date &&
      String(item?.time || '') === appointment.time
    );
    if (occupied) return json({ error: 'appointment_slot_occupied' }, 409);
    const saved = await saveAppointment(appointment);
    return json({ ok: true, appointment: saved }, 201);
  } catch (error) {
    console.error('Appointments POST failed:', error);
    return json({ error: 'appointment_create_failed' }, 500);
  }
}

export async function PUT(request) {
  if (!firebaseConfigured()) return json({ error: 'firebase_not_configured' }, 503);
  try {
    const body = await request.json();
    if (Array.isArray(body?.appointments)) {
      const saved = await Promise.all(
        body.appointments
          .filter((item) => item?.id)
          .map((item) => saveAppointment(normalizeAppointment(item))),
      );
      return json({ ok: true, appointments: saved });
    }
    if (!body?.id) return json({ error: 'missing_id' }, 400);
    const saved = await saveAppointment(normalizeAppointment(body));
    return json({ ok: true, appointment: saved });
  } catch (error) {
    console.error('Appointments PUT failed:', error);
    return json({ error: 'appointment_update_failed' }, 500);
  }
}

export async function DELETE(request) {
  if (!firebaseConfigured()) return json({ error: 'firebase_not_configured' }, 503);
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'missing_id' }, 400);
    await deleteAppointment(id);
    return json({ ok: true });
  } catch (error) {
    console.error('Appointments DELETE failed:', error);
    return json({ error: 'appointment_delete_failed' }, 500);
  }
}
