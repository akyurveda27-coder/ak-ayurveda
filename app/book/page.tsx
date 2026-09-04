import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingFlow from './BookingFlow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/book' },
  title: 'Book Ayurvedic Treatment London | AK Ayurveda',
  description:
    'Book your Ayurvedic treatment or consultation at AK Ayurveda London. Choose your date and time slot online. Same-day confirmation.',
  keywords:
    'book ayurvedic treatment london, ayurvedic appointment london, shirodhara booking london, abhyanga massage booking london',
}

export default function BookPage() {
  return (
    <main className="w-full overflow-x-hidden">
      <Navbar />
      <BookingFlow />
      <Footer />
    </main>
  )
}
