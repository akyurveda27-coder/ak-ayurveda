export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE, SESSION_MAX_AGE, createSessionToken, isAdminConfigured,
  isAdminRequest, sessionCookieOptions, verifyPassword,
} from '@/lib/adminAuth'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAdminRequest(request),
    configured: isAdminConfigured(),
  })
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'Admin password is not configured on the server. Set ADMIN_PASSWORD in your Vercel environment variables.' },
      { status: 503 }
    )
  }

  let password = ''
  try {
    password = (await request.json())?.password ?? ''
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (typeof password !== 'string' || !verifyPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 })
  }

  const token = createSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'Session could not be created' }, { status: 500 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE))
  return response
}
