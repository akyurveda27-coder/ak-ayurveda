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
  title: 'AK Ayurveda — Ancient Wisdom, Modern Healing',
  description: 'Experience authentic Ayurvedic treatments by Dr. Anjali Kumar. Panchakarma, Abhyanga, Shirodhara, Herbal Medicine & more. Book your consultation today.',
  keywords: 'ayurveda, panchakarma, abhyanga, shirodhara, herbal medicine, holistic healing, Dr Anjali Kumar',
  openGraph: {
    title: 'AK Ayurveda — Ancient Wisdom, Modern Healing',
    description: 'Holistic Ayurvedic treatments rooted in 5000 years of Vedic science.',
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
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
