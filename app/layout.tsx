import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AK Ayurveda London | Authentic Ayurvedic Clinic',
    template: '%s | AK Ayurveda London',
  },
  description: 'London\'s authentic Ayurvedic clinic offering personalised treatments rooted in 5,000 years of Vedic wisdom.',
  keywords: 'ayurveda london, ayurvedic clinic london, ayurvedic massage london, holistic wellness london, ayurveda uk',
  metadataBase: new URL('https://ak-ayurveda.vercel.app'),
  openGraph: {
    siteName: 'AK Ayurveda London',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dgppbgbawwzkofwbjzsg.supabase.co" />
      </head>
      <body className="antialiased font-body">{children}</body>
    </html>
  )
}
