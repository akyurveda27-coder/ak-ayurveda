export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// ─── GET /api/slots/available-dates?month=YYYY-MM ────────────────────────────
// Returns dates in the given month that have at least one available (non-blocked,
// non-booked) slot. Used by the booking calendar to highlight clickable days.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') // "YYYY-MM"

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'month param required (YYYY-MM)' }, { status: 400 })
  }

  const [year, monthNum] = month.split('-').map(Number)
  const startDate = `${month}-01`
  // Last day of the month
  const lastDay = new Date(year, monthNum, 0).getDate()
  const endDate = `${month}-${String(lastDay).padStart(2, '0')}`

  // Fetch all non-blocked slots for the month
  const { data: slots, error } = await supabase
    .from('time_slots')
    .select('id, date')
    .eq('is_blocked', false)
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!slots || slots.length === 0) {
    return NextResponse.json({ dates: [] })
  }

  // Find which of those slots are already booked (via appointments)
  const slotIds = slots.map((s) => s.id)

  const { data: bookedAppts } = await supabase
    .from('appointments')
    .select('slot_id')
    .in('slot_id', slotIds)
    .neq('status', 'cancelled')

  const bookedSlotIds = new Set(
    ((bookedAppts ?? []).map((a) => a.slot_id).filter(Boolean)) as string[]
  )

  // A date is "available" if it has at least one slot that is NOT booked
  const availableDates = new Set<string>()
  for (const slot of slots) {
    if (!bookedSlotIds.has(slot.id)) {
      availableDates.add(slot.date)
    }
  }

  return NextResponse.json({ dates: Array.from(availableDates).sort() })
}
