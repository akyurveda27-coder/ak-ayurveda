export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const CLINIC_EMAIL = 'contact.classie@gmail.com' // Resend verified email (free tier)
// Lazy init — env var only available at runtime, not build time
const getResend = () => new Resend(process.env.RESEND_API_KEY ?? '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, service, preferred_date, message, selected_duration, selected_price } = body

    if (!name || !phone || !email || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Save to DB
    const { error } = await supabaseAdmin.from('appointments').insert({
      name, phone, email, service,
      preferred_date: preferred_date || null,
      message: message || '',
      status: 'pending',
      selected_duration: selected_duration || null,
      selected_price: selected_price || null,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // 2. Email to clinic (notification)
    await getResend().emails.send({
      from: 'AK Ayurveda Bookings <onboarding@resend.dev>',
      to: [CLINIC_EMAIL],
      subject: `New Booking Request — ${service}`,
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
            ${preferred_date ? `<tr><td style="padding:8px 0;color:#666">Preferred Date</td><td style="padding:8px 0;font-weight:600;color:#1A1A1A">${preferred_date}</td></tr>` : ''}
            ${message ? `<tr><td style="padding:8px 0;color:#666">Message</td><td style="padding:8px 0;color:#1A1A1A">${message}</td></tr>` : ''}
          </table>
          <div style="margin-top:24px;padding:16px;background:#F0FAF7;border-radius:12px;border-left:4px solid #1B6E5C">
            <p style="margin:0;color:#0F3D34;font-weight:600">Action Required: Confirm appointment within 24 hours</p>
          </div>
          <p style="margin-top:24px;color:#999;font-size:12px">AK Ayurveda — London, UK | care@akayurveda.co.uk</p>
        </div>
      `,
    }).catch(() => {}) // don't fail booking if email fails

    // 3. Confirmation email to customer
    await getResend().emails.send({
      from: 'AK Ayurveda <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Booking Request Received — AK Ayurveda',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <div style="text-align:center;padding:24px;background:#0F3D34;border-radius:16px 16px 0 0">
            <h1 style="color:#D4A853;font-size:28px;margin:0">AK Ayurveda</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0">Traditional Ayurvedic Wellness · London, UK</p>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #E0F0EB;border-top:none;border-radius:0 0 16px 16px">
            <h2 style="color:#0F3D34;margin-top:0">Thank you, ${name}! 🌿</h2>
            <p style="color:#555;line-height:1.6">We've received your booking request for <strong style="color:#1B6E5C">${service}</strong>. Our team will review your request and confirm your appointment within 24 hours.</p>
            <div style="background:#F0FAF7;border-radius:12px;padding:20px;margin:24px 0">
              <h3 style="color:#0F3D34;margin:0 0 12px">Your Booking Details</h3>
              <p style="margin:4px 0;color:#555">📋 Service: <strong>${service}</strong></p>
              ${selected_duration ? `<p style="margin:4px 0;color:#555">⏱ Duration: <strong>${selected_duration}</strong></p>` : ''}
              ${selected_price ? `<p style="margin:4px 0;color:#555">💷 Price: <strong>${selected_price}</strong></p>` : ''}
              ${preferred_date ? `<p style="margin:4px 0;color:#555">📅 Preferred Date: <strong>${preferred_date}</strong></p>` : ''}
            </div>
            <p style="color:#555;line-height:1.6">If you have any questions, call us at <strong>+44 20 7946 0958</strong> or reply to this email.</p>
            <p style="color:#999;font-size:13px;margin-top:32px">AK Ayurveda · London, UK · Mon–Sat 9AM–7PM</p>
          </div>
        </div>
      `,
    }).catch(() => {}) // don't fail booking if email fails

    return NextResponse.json({ success: true, message: 'Appointment booked successfully!' })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// resend env reload Sat Aug 15 19:20:56 UTC 2026
