export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const HOLD_MINUTES = 10

// ─── POST /api/slots/[id]/hold ───────────────────────────────────────────────
// Reserves a slot while the customer fills in their details. Succeeds only if
// the slot is free: not blocked, not already booked, and not held by someone else.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const now = new Date().toISOString()
    const holdUntil = new Date(Date.now() + HOLD_MINUTES * 60 * 1000).toISOString()
    const holdId = crypto.randomUUID()

    const { data: booked } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('slot_id', params.id)
      .neq('status', 'cancelled')
      .limit(1)

    if (booked && booked.length > 0) {
      return NextResponse.json({ error: 'This slot has already been booked.' }, { status: 409 })
    }

    // Only one request can win this update, which is what makes the hold safe.
    const { data: claimed, error } = await supabaseAdmin
      .from('time_slots')
      .update({ hold_until: holdUntil, hold_booking_id: holdId })
      .eq('id', params.id)
      .eq('is_blocked', false)
      .or(`hold_until.is.null,hold_until.lt.${now}`)
      .select('id')

    if (error || !claimed || claimed.length === 0) {
      return NextResponse.json(
        { error: 'Someone else is booking this slot right now. Please choose another.' },
        { status: 409 }
      )
    }

    return NextResponse.json({ hold_id: holdId, expires_at: holdUntil })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── DELETE /api/slots/[id]/hold?hold=<id> ───────────────────────────────────
// Releases a hold when the customer steps back, so the slot frees up immediately.
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const holdId = new URL(request.url).searchParams.get('hold')
  if (!holdId) return NextResponse.json({ error: 'hold param required' }, { status: 400 })

  await supabaseAdmin
    .from('time_slots')
    .update({ hold_until: null, hold_booking_id: null })
    .eq('id', params.id)
    .eq('hold_booking_id', holdId)

  return NextResponse.json({ success: true })
}
