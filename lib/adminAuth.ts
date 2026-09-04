import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'ak_admin_session'
const SESSION_DAYS = 7

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  return secret && secret.length > 0 ? secret : null
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD)
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return safeEqual(password, expected)
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function createSessionToken(): string | null {
  const secret = getSecret()
  if (!secret) return null
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  return `${expiresAt}.${sign(String(expiresAt), secret)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = getSecret()
  if (!secret || !token) return false

  const [expiresAt, signature] = token.split('.')
  if (!expiresAt || !signature) return false
  if (!safeEqual(signature, sign(expiresAt, secret))) return false

  return Number(expiresAt) > Date.now()
}

export function isAdminRequest(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value)
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized — admin login required' }, { status: 401 })
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60
