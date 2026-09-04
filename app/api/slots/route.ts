export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { isAdminRequest, unauthorized } from '@/lib/adminAuth'
import { londonNow } from '@/lib/clinicTime'

// ─── GET /api/slots?date=YYYY-MM-DD ─────────────────────────────────────────
// Returns all slots for a date, each enriched with is_booked (derived)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) return NextResponse.json({ error: 'date param required (YYYY-MM-DD)' }, { status: 400 })

  const { data: slots, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('date', date)
    .order('start_time')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const slotIds = (slots ?? []).map((s) => s.id)
  let bookedIds: string[] = []

  if (slotIds.length > 0) {
    const { data: appts } = await supabaseAdmin
      .from('appointments')
      .select('slot_id')
      .in('slot_id', slotIds)
      .neq('status', 'cancelled')

    bookedIds = ((appts ?? []).map((a) => a.slot_id).filter(Boolean)) as string[]
  }

  // A slot is unavailable if it is booked, if it is being held by someone else
  // right now, or if its start time has already passed today (clinic time).
  const myHold = searchParams.get('hold')
  const { todayStr, currentTimeStr } = londonNow()
  const now = Date.now()

  return NextResponse.json({
    slots: (slots ?? []).map((s) => ({
      ...s,
      is_booked: bookedIds.includes(s.id),
      is_held: Boolean(
        s.hold_until && new Date(s.hold_until).getTime() > now && s.hold_booking_id !== myHold
      ),
      is_past: date < todayStr || (date === todayStr && String(s.start_time).slice(0, 5) <= currentTimeStr),
    })),
  })
}

// ─── POST /api/slots ─────────────────────────────────────────────────────────
// Admin: bulk-create slots for a set of dates with a given time range + duration
// Body: { dates: string[], start_time: string, end_time: string, duration_minutes: number }
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized()

  try {
    const body = await request.json()
    const { dates, start_time, end_time, duration_minutes } = body as {
      dates: string[]
      start_time: string
      end_time: string
      duration_minutes: number
    }

    if (!dates?.length || !start_time || !end_time || !duration_minutes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fmt = (totalMins: number) => {
      const h = Math.floor(totalMins / 60)
      const m = totalMins % 60
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
    }

    const slotsToCreate: { date: string; start_time: string; end_time: string }[] = []

    for (const date of dates) {
      const [startH, startM] = start_time.split(':').map(Number)
      const [endH, endM] = end_time.split(':').map(Number)
      let cur = startH * 60 + startM
      const endTotal = endH * 60 + endM

      while (cur + duration_minutes <= endTotal) {
        slotsToCreate.push({
          date,
          start_time: fmt(cur),
          end_time: fmt(cur + duration_minutes),
        })
        cur += duration_minutes
      }
    }

    if (slotsToCreate.length === 0) {
      return NextResponse.json({ error: 'No slots generated — check time range vs duration' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('time_slots')
      .upsert(slotsToCreate, { onConflict: 'date,start_time', ignoreDuplicates: true })
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, created: data?.length ?? 0 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
