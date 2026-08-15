export const revalidate = 3600

import Navbar from '@/components/Navbar'
import BookAppointment from '@/components/BookAppointment'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book an Appointment — AK Ayurveda',
  description: 'Book your personalised Ayurvedic wellness consultation at AK Ayurveda, London. Choose your treatment and preferred date.',
}

export default function BookPage() {
  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="w-full bg-[#0F3D34] py-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#D4A853]">Get Started</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
          Book Your Appointment
        </h1>
        <p className="mt-4 text-white/70 text-[17px] max-w-lg mx-auto">
          Take the first step towards holistic wellbeing. We&apos;ll confirm your appointment within 24 hours.
        </p>
      </section>

      {/* Booking Form */}
      <BookAppointment />

      <Footer />
    </main>
  )
}
