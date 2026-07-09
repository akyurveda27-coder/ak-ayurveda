import { supabase } from '@/lib/supabase'
import { HeroContent, StatsContent, DoctorContent, ContactContent, Service, Condition, Testimonial, FAQ } from '@/lib/types'


import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import Doctor from '@/components/Doctor'
import Conditions from '@/components/Conditions'
import Testimonials from '@/components/Testimonials'
import BookAppointment from '@/components/BookAppointment'
import FAQComponent from '@/components/FAQ'
import Footer from '@/components/Footer'

async function getSiteContent() {
  try {
    const { data } = await supabase
      .from('site_content')
      .select('key, value')

    const content: Record<string, unknown> = {}
    for (const row of data ?? []) {
      content[row.key] = row.value
    }
    return content
  } catch {
    return {}
  }
}

async function getServices(): Promise<Service[]> {
  try {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

async function getConditions(): Promise<Condition[]> {
  try {
    const { data } = await supabase
      .from('conditions')
      .select('*')
      .order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

async function getFAQs(): Promise<FAQ[]> {
  try {
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

export const revalidate = 0 // Always fresh — no cache

export default async function HomePage() {
  const [content, services, conditions, testimonials, faqs] = await Promise.all([
    getSiteContent(),
    getServices(),
    getConditions(),
    getTestimonials(),
    getFAQs(),
  ])

  const hero = content.hero as HeroContent | undefined
  const stats = content.stats as StatsContent | undefined
  const doctor = content.doctor as DoctorContent | undefined
  const contactInfo = content.contact as ContactContent | undefined

  return (
    <main>
      <Navbar />
      <Hero content={hero} />
      <Stats content={stats} />
      <Services services={services} />
      <Doctor content={doctor} />
      <Conditions conditions={conditions} />
      <Testimonials testimonials={testimonials} />
      <BookAppointment services={services.map((s) => s.name)} />
      <FAQComponent faqs={faqs} />
      <Footer contact={contactInfo} />
    </main>
  )
}
