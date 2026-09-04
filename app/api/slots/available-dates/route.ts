export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { londonNow } from '@/lib/clinicTime'

// GET /api/slots/available-dates?month=YYYY-MM
// Returns dates in the given month that have at least one available (non-blocked, non-booked) slot
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') // "YYYY-MM"

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'month param required (YYYY-MM)' }, { status: 400 })
  }

  const [year, monthNum] = month.split('-').map(Number)
  const startDate = `${month}-01`
  const lastDay = new Date(year, monthNum, 0).getDate()
  const endDate = `${month}-${String(lastDay).padStart(2, '0')}`

  // "Now" in clinic time (London), not UTC — otherwise British Summer Time makes
  // the cut-off an hour early and slots that have already passed look available.
  const { todayStr, currentTimeStr } = londonNow()

  // Fetch ALL non-blocked slots for the month (including today)
  const { data: slots, error } = await supabase
    .from('time_slots')
    .select('id, date, start_time, hold_until')
    .eq('is_blocked', false)
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!slots || slots.length === 0) return NextResponse.json({ dates: [] })

  // Filter: past dates out, but for today only filter past time slots
  const futureSlots = slots.filter(s => {
    if (s.date > todayStr) return true  // future date — always include
    if (s.date === todayStr) return s.start_time >= currentTimeStr  // today — only future times
    return false  // past date — exclude
  })

  if (futureSlots.length === 0) return NextResponse.json({ dates: [] })

  // Find which slots are already booked (via appointments)
  const slotIds = futureSlots.map(s => s.id)
  const { data: bookedAppts } = await supabaseAdmin
    .from('appointments')
    .select('slot_id')
    .in('slot_id', slotIds)
    .neq('status', 'cancelled')

  const bookedSlotIds = new Set(
    ((bookedAppts ?? []).map(a => a.slot_id).filter(Boolean)) as string[]
  )

  // A date is "available" if it has at least one slot that is neither booked
  // nor currently held by another customer.
  const nowMs = Date.now()
  const availableDates = new Set<string>()
  for (const slot of futureSlots) {
    const held = slot.hold_until && new Date(slot.hold_until).getTime() > nowMs
    if (!bookedSlotIds.has(slot.id) && !held) {
      availableDates.add(slot.date)
    }
  }

  return NextResponse.json({ dates: Array.from(availableDates).sort() })
}
