export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// ─── PATCH /api/slots/[id] ────────────────────────────────────────────────────
// Admin: block or unblock a slot
// Body: { is_blocked: boolean }
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { is_blocked } = body as { is_blocked: boolean }

    const { error } = await supabaseAdmin
      .from('time_slots')
      .update({ is_blocked })
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── DELETE /api/slots/[id] ───────────────────────────────────────────────────
// Admin: permanently delete a slot (only if not booked)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Safety check: don't delete if a live appointment is attached
    const { data: attached } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('slot_id', params.id)
      .neq('status', 'cancelled')
      .limit(1)

    if (attached && attached.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete slot — an active appointment is attached' },
        { status: 409 }
      )
    }

    const { error } = await supabaseAdmin
      .from('time_slots')
      .delete()
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
