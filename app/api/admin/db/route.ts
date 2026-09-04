export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminRequest, unauthorized } from '@/lib/adminAuth'

type Action = 'select' | 'insert' | 'update' | 'upsert' | 'delete'

// Only these tables/actions can ever be reached through the admin panel.
const ALLOWED: Record<string, Action[]> = {
  site_content: ['upsert'],
  services: ['insert', 'update', 'delete'],
  conditions: ['insert', 'update', 'delete'],
  testimonials: ['insert', 'update', 'delete'],
  faqs: ['insert', 'update', 'delete'],
  blogs: ['insert', 'update', 'delete'],
  // Customer data — never readable with the public anon key.
  reviews: ['select', 'update', 'delete'],
  appointments: ['select', 'update', 'delete'],
}

function isPlainValue(v: unknown): boolean {
  return v === null || ['string', 'number', 'boolean'].includes(typeof v)
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized()

  let body: {
    table?: string
    action?: Action
    values?: Record<string, unknown> | Record<string, unknown>[]
    match?: Record<string, unknown>
    onConflict?: string
    returning?: 'single' | 'rows'
    select?: string
    order?: { column: string; ascending?: boolean }
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { table, action, values, match, onConflict, returning, select, order } = body

  if (!table || !action || !ALLOWED[table]?.includes(action)) {
    return NextResponse.json({ error: 'Operation not allowed' }, { status: 403 })
  }

  const needsMatch = action === 'update' || action === 'delete'
  const matchEntries = Object.entries(match ?? {})

  if (needsMatch && (matchEntries.length === 0 || !matchEntries.every(([, v]) => isPlainValue(v)))) {
    return NextResponse.json({ error: 'A valid match filter is required' }, { status: 400 })
  }

  if (action !== 'delete' && action !== 'select' && (values === undefined || values === null)) {
    return NextResponse.json({ error: 'values are required' }, { status: 400 })
  }

  const query = supabaseAdmin.from(table)

  try {
    let result

    if (action === 'select') {
      let q = query.select(select ?? '*')
      if (order?.column) q = q.order(order.column, { ascending: order.ascending ?? true })
      result = await q
    } else if (action === 'insert') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = query.insert(values as any)
      result = returning === 'single' ? await q.select().single() : await q
    } else if (action === 'upsert') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = query.upsert(values as any, onConflict ? { onConflict } : undefined)
      result = returning === 'single' ? await q.select().single() : await q
    } else if (action === 'update') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = await query.update(values as any).match(match as Record<string, any>)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = await query.delete().match(match as Record<string, any>)
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result.data ?? null })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
