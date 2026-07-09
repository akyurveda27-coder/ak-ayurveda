import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  try {
    if (key) {
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', key)
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data?.value ?? null)
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('key, value')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const result: Record<string, unknown> = {}
    for (const row of data ?? []) {
      result[row.key] = row.value
    }
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
    }

    // Use admin client to bypass RLS
    const { error } = await supabaseAdmin
      .from('site_content')
      .upsert({ key, value, updated_at: new Date().toISOString() })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
