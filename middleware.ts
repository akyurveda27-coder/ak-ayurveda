import { NextRequest, NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/site'

// The app answers on both the vercel.app host and the real domain, which shows
// search engines two copies of the same site. Send visitors to the real domain;
// the admin panel and the APIs keep working on either host.
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const canonicalHost = new URL(SITE_URL).host

  if (!host.endsWith('.vercel.app') || host === canonicalHost) return NextResponse.next()

  const { pathname, search } = request.nextUrl
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return NextResponse.next()

  return NextResponse.redirect(`${SITE_URL}${pathname}${search}`, 308)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)'],
}
