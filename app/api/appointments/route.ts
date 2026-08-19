export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const CLINIC_EMAIL = 'contact.classie@gmail.com' // Resend verified email (free tier)
// Lazy init — env var only available at runtime, not build time
const getResend = () => new Resend(process.env.RESEND_API_KEY ?? '')

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(t: string) {
  // t = "09:00:00" → "9:00 AM"
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function formatDate(d: string) {
  // d = "2026-08-20" → "Thu, 20 Aug 2026"
  const date = new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── POST /api/appointments ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name, phone, email, service,
      preferred_date, message,
      selected_duration, selected_price,
      slot_id,
    } = body

    if (!name || !phone || !email || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ── Slot race condition protection ────────────────────────────────────────
    if (slot_id) {
      // Step 1: quick check — is there already a live appointment for this slot?
      const { data: existingAppts } = await supabaseAdmin
        .from('appointments')
        .select('id')
        .eq('slot_id', slot_id)
        .neq('status', 'cancelled')
        .limit(1)

      if (existingAppts && existingAppts.length > 0) {
        return NextResponse.json(
          { error: 'This slot was just taken. Please select another.' },
          { status: 409 }
        )
      }

      // Step 2: atomically claim slot — UPDATE only if it's free (hold expired or null)
      // This is the race condition fence: two concurrent requests racing here will
      // only ONE succeed in updating the row (Postgres row-level locking).
      const now = new Date().toISOString()
      const holdUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString()
      const holdId = crypto.randomUUID()

      const { data: claimed, error: claimErr } = await supabaseAdmin
        .from('time_slots')
        .update({ hold_until: holdUntil, hold_booking_id: holdId })
        .eq('id', slot_id)
        .eq('is_blocked', false)
        .or(`hold_until.is.null,hold_until.lt.${now}`)
        .select('id')

      if (claimErr || !claimed || claimed.length === 0) {
        return NextResponse.json(
          { error: 'This slot was just taken. Please select another.' },
          { status: 409 }
        )
      }
    }

    // ── Fetch slot details for email ──────────────────────────────────────────
    let slotDateStr = ''
    let slotTimeStr = ''
    if (slot_id) {
      const { data: slotData } = await supabaseAdmin
        .from('time_slots')
        .select('date, start_time, end_time')
        .eq('id', slot_id)
        .single()

      if (slotData) {
        slotDateStr = formatDate(slotData.date)
        slotTimeStr = `${formatTime(slotData.start_time)} – ${formatTime(slotData.end_time)}`
      }
    }

    // ── Insert appointment ────────────────────────────────────────────────────
    const { data: newAppt, error: insertErr } = await supabaseAdmin
      .from('appointments')
      .insert({
        name, phone, email, service,
        preferred_date: preferred_date || (slot_id ? slotDateStr : null) || null,
        message: message || '',
        status: 'pending',
        selected_duration: selected_duration || null,
        selected_price: selected_price || null,
        slot_id: slot_id || null,
      })
      .select('id')
      .single()

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

    // ── Clear the hold now that appointment is properly saved ─────────────────
    if (slot_id) {
      await supabaseAdmin
        .from('time_slots')
        .update({ hold_until: null, hold_booking_id: null })
        .eq('id', slot_id)
    }

    const bookingId = newAppt?.id ?? ''
    const displayDate = slotDateStr || preferred_date || 'TBD'
    const displayTime = slotTimeStr || ''

    // ── Email to clinic ───────────────────────────────────────────────────────
    await getResend().emails.send({
      from: 'AK Ayurveda Bookings <onboarding@resend.dev>',
      to: [CLINIC_EMAIL],
      subject: `New Booking — ${service}${slotDateStr ? ` · ${slotDateStr}` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0F3D34;border-bottom:2px solid #D4A853;padding-bottom:12px">
            New Appointment Request 📅
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr><td style="padding:8px 0;color:#666;width:140px">Name</td><td style="padding:8px 0;font-weight:600;color:#1A1A1A">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0;font-weight:600;color:#1A1A1A">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0;font-weight:600;color:#1A1A1A">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Service</td><td style="padding:8px 0;font-weight:600;color:#1B6E5C">${service}</td></tr>
            ${selected_duration ? `<tr><td style="padding:8px 0;color:#666">Duration</td><td style="padding:8px 0;font-weight:600;color:#1A1A1A">${selected_duration}</td></tr>` : ''}
            ${selected_price ? `<tr><td style="padding:8px 0;color:#666">Price</td><td style="padding:8px 0;font-weight:600;color:#D4A853">${selected_price}</td></tr>` : ''}
            ${slotDateStr ? `<tr><td style="padding:8px 0;color:#666">Slot Date</td><td style="padding:8px 0;font-weight:600;color:#1A1A1A">${slotDateStr}</td></tr>` : ''}
            ${slotTimeStr ? `<tr><td style="padding:8px 0;color:#666">Slot Time</td><td style="padding:8px 0;font-weight:600;color:#1A1A1A">${slotTimeStr}</td></tr>` : ''}
            ${message ? `<tr><td style="padding:8px 0;color:#666">Message</td><td style="padding:8px 0;color:#1A1A1A">${message}</td></tr>` : ''}
          </table>
          <div style="margin-top:24px;padding:16px;background:#F0FAF7;border-radius:12px;border-left:4px solid #1B6E5C">
            <p style="margin:0;color:#0F3D34;font-weight:600">Booking ID: ${bookingId}</p>
          </div>
          <p style="margin-top:24px;color:#999;font-size:12px">AK Ayurveda — London, UK | care@akayurveda.co.uk</p>
        </div>
      `,
    }).catch(() => {})

    // ── Confirmation email to customer ────────────────────────────────────────
    await getResend().emails.send({
      from: 'AK Ayurveda <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Booking Confirmed — AK Ayurveda',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <div style="text-align:center;padding:24px;background:#0F3D34;border-radius:16px 16px 0 0">
            <h1 style="color:#D4A853;font-size:28px;margin:0">AK Ayurveda</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0">Traditional Ayurvedic Wellness · London, UK</p>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #E0F0EB;border-top:none;border-radius:0 0 16px 16px">
            <h2 style="color:#0F3D34;margin-top:0">Thank you, ${name}! 🌿</h2>
            <p style="color:#555;line-height:1.6">Your appointment for <strong style="color:#1B6E5C">${service}</strong> has been received. We will confirm within 24 hours.</p>
            <div style="background:#F0FAF7;border-radius:12px;padding:20px;margin:24px 0">
              <h3 style="color:#0F3D34;margin:0 0 12px">Booking Details</h3>
              <p style="margin:4px 0;color:#555">📋 Service: <strong>${service}</strong></p>
              ${selected_duration ? `<p style="margin:4px 0;color:#555">⏱ Duration: <strong>${selected_duration}</strong></p>` : ''}
              ${selected_price ? `<p style="margin:4px 0;color:#555">💷 Price: <strong>${selected_price}</strong></p>` : ''}
              ${slotDateStr ? `<p style="margin:4px 0;color:#555">📅 Date: <strong>${slotDateStr}</strong></p>` : ''}
              ${slotTimeStr ? `<p style="margin:4px 0;color:#555">🕐 Time: <strong>${slotTimeStr}</strong></p>` : ''}
              <p style="margin:8px 0 0;color:#999;font-size:12px">Booking ref: ${bookingId}</p>
            </div>
            <p style="color:#555;line-height:1.6">Questions? Call <strong>+44 20 7946 0958</strong> or reply to this email.</p>
            <p style="color:#999;font-size:13px;margin-top:32px">AK Ayurveda · London, UK · Mon–Sat 9AM–7PM</p>
          </div>
        </div>
      `,
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully!',
      booking_id: bookingId,
      slot_date: slotDateStr,
      slot_time: slotTimeStr,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── GET /api/appointments ────────────────────────────────────────────────────
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, slot:time_slots(date, start_time, end_time)')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
