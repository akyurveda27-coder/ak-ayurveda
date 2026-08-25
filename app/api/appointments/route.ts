export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const CLINIC_EMAIL = 'akyurveda27@gmail.com' // clinic notification email
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
      from: 'AK Ayurveda Bookings <bookings@akayurveda.co.uk>',
      to: [CLINIC_EMAIL],
      subject: `New Booking — ${service}${slotDateStr ? ` · ${slotDateStr}` : ''}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
          <!-- Header -->
          <div style="background:#0F3D34;padding:28px 32px;text-align:center">
            <p style="color:#D4A853;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 6px">AK Ayurveda · London</p>
            <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:600">🗓 New Booking Request</h1>
          </div>
          <!-- Alert strip -->
          <div style="background:#D4A853;padding:12px 32px;text-align:center">
            <p style="margin:0;color:#0F3D34;font-weight:700;font-size:14px">Action Required — Review &amp; Confirm</p>
          </div>
          <!-- Body -->
          <div style="padding:32px">
            <!-- Patient info -->
            <div style="background:#F0FAF7;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #D0EDE6">
              <p style="color:#1B6E5C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 14px">Patient Details</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#666;font-size:13px;width:120px">👤 Name</td><td style="padding:6px 0;font-weight:700;color:#0F3D34;font-size:14px">${name}</td></tr>
                <tr><td style="padding:6px 0;color:#666;font-size:13px">📞 Phone</td><td style="padding:6px 0;font-weight:600;color:#1A1A1A;font-size:14px">${phone}</td></tr>
                <tr><td style="padding:6px 0;color:#666;font-size:13px">✉️ Email</td><td style="padding:6px 0;font-weight:600;color:#1B6E5C;font-size:14px">${email}</td></tr>
                ${message ? `<tr><td style="padding:6px 0;color:#666;font-size:13px;vertical-align:top">💬 Note</td><td style="padding:6px 0;color:#555;font-size:13px;line-height:1.5">${message}</td></tr>` : ''}
              </table>
            </div>
            <!-- Booking info -->
            <div style="background:#0F3D34;border-radius:12px;padding:20px;margin-bottom:20px">
              <p style="color:#D4A853;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 14px">Booking Details</p>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:rgba(255,255,255,0.6);font-size:13px;width:120px">🌿 Service</td><td style="padding:6px 0;font-weight:700;color:#D4A853;font-size:15px">${service}</td></tr>
                ${slotDateStr ? `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.6);font-size:13px">📅 Date</td><td style="padding:6px 0;font-weight:600;color:#ffffff;font-size:14px">${slotDateStr}</td></tr>` : ''}
                ${slotTimeStr ? `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.6);font-size:13px">🕐 Time</td><td style="padding:6px 0;font-weight:600;color:#ffffff;font-size:14px">${slotTimeStr}</td></tr>` : ''}
                ${selected_duration ? `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.6);font-size:13px">⏱ Duration</td><td style="padding:6px 0;font-weight:600;color:#ffffff;font-size:14px">${selected_duration}</td></tr>` : ''}
                ${selected_price ? `<tr><td style="padding:6px 0;color:rgba(255,255,255,0.6);font-size:13px">💷 Price</td><td style="padding:6px 0;font-weight:700;color:#D4A853;font-size:14px">${selected_price}</td></tr>` : ''}
              </table>
            </div>
            <!-- Booking ID -->
            <div style="border:2px dashed #D0EDE6;border-radius:10px;padding:14px 20px;text-align:center;margin-bottom:24px">
              <p style="margin:0;color:#999;font-size:11px;letter-spacing:1px;text-transform:uppercase">Booking Reference</p>
              <p style="margin:4px 0 0;color:#0F3D34;font-weight:800;font-size:18px;letter-spacing:2px">${bookingId.toUpperCase()}</p>
            </div>
            <!-- CTA -->
            <div style="text-align:center">
              <a href="https://ak-ayurveda.vercel.app/admin" style="display:inline-block;background:#1B6E5C;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px">View in Admin Dashboard →</a>
            </div>
          </div>
          <!-- Footer -->
          <div style="background:#F9FAFB;padding:16px 32px;text-align:center;border-top:1px solid #E5E7EB">
            <p style="margin:0;color:#9CA3AF;font-size:11px">AK Ayurveda · London, UK · bookings@akayurveda.co.uk</p>
          </div>
        </div>
      `,
    }).catch(() => {})

    // ── Confirmation email to customer ────────────────────────────────────────
    await getResend().emails.send({
      from: 'AK Ayurveda <noreply@akayurveda.co.uk>',
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
