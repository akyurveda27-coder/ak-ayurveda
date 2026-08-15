export const revalidate = 3600

import Navbar from '@/components/Navbar'
import BookAppointment from '@/components/BookAppointment'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Ayurvedic Treatment London | AK Ayurveda',
  description: 'Book your Ayurvedic treatment or consultation at AK Ayurveda London. Choose from 18 therapies including Abhyanga, Shirodhara, Panchakarma & more.',
  keywords: 'book ayurvedic treatment london, ayurvedic appointment london, shirodhara booking london, abhyanga massage booking london',
}

export default async function BookPage() {
  const { data: servicesData } = await supabase.from('services').select('name').order('id')
  const serviceNames = servicesData?.map((s: { name: string }) => s.name) ?? []

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

      {/* Booking Form — passes real service names from DB */}
      <BookAppointment services={serviceNames} />

      <Footer />
    </main>
  )
}
