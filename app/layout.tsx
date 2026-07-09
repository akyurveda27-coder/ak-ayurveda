import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
