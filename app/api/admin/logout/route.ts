export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, sessionCookieOptions } from '@/lib/adminAuth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, '', sessionCookieOptions(0))
  return response
}
