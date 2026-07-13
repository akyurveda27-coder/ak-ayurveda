'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Service } from '@/lib/types'

// ─── Slug helper ─────────────────────────────────────────────────────────────
function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── Static benefit/detail content per service name ──────────────────────────
const serviceDetails: Record<string, {
  duration: string
  benefits: string[]
  process: string[]
  ideal_for: string[]
  price_from: string
}> = {
  default: {
    duration: '60–90 minutes',
    benefits: ['Detoxifies the body', 'Restores doshic balance', 'Strengthens immunity', 'Improves overall wellbeing'],
    process: ['Initial consultation & Prakriti assessment', 'Customized treatment plan', 'Therapy session with medicated oils', 'Post-treatment guidance & diet plan'],
    ideal_for: ['Chronic conditions', 'Preventive wellness', 'Stress & fatigue', 'Detoxification'],
    price_from: 'Consultation required',
  },
  panchakarma: {
    duration: '7–21 days program',
    benefits: ['Deep systemic detoxification', 'Reverses chronic diseases', 'Restores cellular intelligence', 'Anti-aging & rejuvenation', 'Clears blocked energy channels'],
    process: ['Detailed Prakriti & Vikriti assessment', 'Purvakarma: Snehana (internal/external oleation)', 'Svedana (therapeutic sweating)', 'Main Panchakarma procedures (Vamana, Virechana, Basti, Nasya, Raktamokshana)', 'Paschatkarma: dietary & lifestyle guidance'],
    ideal_for: ['Autoimmune conditions', 'Chronic digestive disorders', 'Joint & musculoskeletal issues', 'Neurological conditions', 'Annual preventive detox'],
    price_from: '₹15,000 (7-day program)',
  },
  abhyanga: {
    duration: '60–75 minutes',
    benefits: ['Nourishes all 7 dhatus (tissues)', 'Improves blood & lymph circulation', 'Reduces Vata-related dryness & stiffness', 'Deep relaxation of nervous system', 'Improves skin tone & texture'],
    process: ['Dosha-specific medicated oil selection', 'Warm oil application in specific marma strokes', 'Full-body synchronized massage', 'Steam therapy (optional)', 'Rest period & aftercare guidance'],
    ideal_for: ['Anxiety & stress', 'Dry skin & fatigue', 'Insomnia', 'Muscle aches & joint stiffness', 'General rejuvenation'],
    price_from: '₹2,500 per session',
  },
  shirodhara: {
    duration: '45–60 minutes',
    benefits: ['Activates the hypothalamus & pituitary gland', 'Deeply calms the mind', 'Relieves chronic headaches & migraines', 'Improves sleep quality', 'Reduces anxiety & depression'],
    process: ['Scalp & neck oil massage (15 min)', 'Continuous warm oil stream over the "third eye" point', 'Duration adjusted to constitution', 'Post-therapy head wrap & rest'],
    ideal_for: ['Insomnia & sleep disorders', 'Migraines', 'Anxiety & mental fatigue', 'Hypertension', 'Post-burnout recovery'],
    price_from: '₹3,000 per session',
  },
  'herbal-medicine': {
    duration: 'Ongoing (review every 4–6 weeks)',
    benefits: ['Addresses root cause — not just symptoms', 'No chemical side effects', 'Synergistic classical formulations', 'Customized to your constitution', 'Complements modern medicine safely'],
    process: ['Detailed case history & pulse diagnosis (Nadi Pariksha)', 'Identification of doshic imbalance', 'Classical formulation selection (kashaya, churna, ghrita, tablet)', 'Dispensing with clear dosage & anupana (vehicle)', 'Follow-up at 4–6 week intervals'],
    ideal_for: ['Digestive disorders', 'Hormonal imbalances', 'Skin conditions', 'Immunity building', 'Chronic disease management'],
    price_from: '₹800–₹2,500 / month',
  },
  'diet-nutrition': {
    duration: '45-minute consultation + plan',
    benefits: ['Food customized to your Prakriti', 'Seasonal Ritucharya guidelines', 'Addresses nutritional deficiencies', 'Supports ongoing treatment', 'Sustainable long-term changes'],
    process: ['Prakriti & current Vikriti analysis', 'Review of current diet & lifestyle', 'Personalized Ahara plan', 'Recipes & substitution guidance', 'Monthly check-in & plan revision'],
    ideal_for: ['Weight management', 'Digestive health', 'Diabetics & pre-diabetics', 'Athletes & active individuals', 'Preventive wellness'],
    price_from: '₹1,500 per consultation',
  },
  'yoga-pranayama': {
    duration: '60 minutes per session',
    benefits: ['Regulates prana (life force)', 'Strengthens the respiratory system', 'Balances the autonomic nervous system', 'Complements Ayurvedic treatments', 'Improves flexibility, strength & calm'],
    process: ['Assessment of current fitness & health', 'Dosha-specific asana selection', 'Pranayama sequence design', 'Meditation & relaxation techniques', 'Home practice plan provided'],
    ideal_for: ['Respiratory conditions', 'Stress & anxiety', 'Spinal & postural issues', 'Post-Panchakarma maintenance', 'General preventive wellness'],
    price_from: '₹1,200 per session',
  },
}

function getDetails(name: string) {
  const slug = toSlug(name)
  return serviceDetails[slug] || serviceDetails.default
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicePage() {
  const params = useParams()
  const slug = params.slug as string

  const [service, setService] = useState<Service | null>(null)
  const [allServices, setAllServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      const all = data ?? []
      setAllServices(all)
      const found = all.find((s) => toSlug(s.name) === slug)
      setService(found ?? null)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl text-primary font-bold">Service not found</p>
        <Link href="/#services" className="font-body text-sm text-sage hover:text-primary transition-colors">← Back to services</Link>
      </div>
    )
  }

  const details = getDetails(service.name)
  const otherServices = allServices.filter((s) => s.id !== service.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-primary text-lg">AK Ayurveda</Link>
          <Link href="/#book-appointment" className="bg-primary text-white px-4 py-2 rounded-xl font-body text-sm font-medium hover:bg-primaryDark transition-colors">
            Book Appointment
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-green-100">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
          <Link href="/#services" className="inline-flex items-center gap-1.5 font-body text-sm text-sage hover:text-primary transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Treatments
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
              {service.icon}
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">{service.name}</h1>
              <p className="font-body text-textSecondary mt-2 text-base md:text-lg max-w-2xl">{service.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="inline-flex items-center gap-1.5 font-body text-sm text-sage bg-white border border-green-100 px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {details.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-sm text-sage bg-white border border-green-100 px-3 py-1.5 rounded-full">
                  💰 {details.price_from}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {/* Main */}
        <div className="md:col-span-2 space-y-8">
          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-primary mb-4">Key Benefits</h2>
            <ul className="space-y-3">
              {details.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-sm text-textMain">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{i + 1}</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-primary mb-4">What to Expect</h2>
            <ol className="space-y-4">
              {details.process.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-display text-xs font-bold">{i + 1}</div>
                  <p className="font-body text-sm text-textMain pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Ideal for */}
          <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
            <h2 className="font-display text-xl font-bold text-primary mb-4">Ideal For</h2>
            <div className="flex flex-wrap gap-2">
              {details.ideal_for.map((item, i) => (
                <span key={i} className="bg-white border border-green-100 text-textMain font-body text-sm px-3 py-1.5 rounded-full shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* CTA Card */}
          <div className="bg-primary rounded-2xl p-6 text-white shadow-md sticky top-20">
            <h3 className="font-display text-lg font-bold mb-2">Book {service.name}</h3>
            <p className="font-body text-sm text-green-200 mb-5">Consult with Dr. Anjali Kumar and start your healing journey today.</p>
            <Link
              href="/#book-appointment"
              className="block w-full bg-white text-primary text-center py-3 rounded-xl font-body font-semibold text-sm hover:bg-green-50 transition-colors"
            >
              Book Appointment →
            </Link>
            <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
              <div className="flex items-center gap-2 font-body text-xs text-green-200">
                <span>⏱</span> {details.duration}
              </div>
              <div className="flex items-center gap-2 font-body text-xs text-green-200">
                <span>💰</span> Starting {details.price_from}
              </div>
              <div className="flex items-center gap-2 font-body text-xs text-green-200">
                <span>📍</span> In-clinic, Bengaluru
              </div>
            </div>
          </div>

          {/* Other services */}
          {otherServices.length > 0 && (
            <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
              <h3 className="font-display text-base font-bold text-primary mb-3">Other Treatments</h3>
              <div className="space-y-2">
                {otherServices.map((s) => (
                  <Link
                    key={s.id}
                    href={`/services/${toSlug(s.name)}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-green-50 transition-colors group"
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="font-body text-sm font-semibold text-textMain group-hover:text-primary transition-colors">{s.name}</p>
                      <p className="font-body text-xs text-sage truncate">{s.description.slice(0, 40)}…</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/#services" className="block text-center font-body text-xs text-primary hover:underline mt-3">
                View all treatments →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primaryDark text-white py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="font-display font-bold text-lg">AK Ayurveda</p>
          <p className="font-body text-green-300 text-sm mt-1">Ancient Wisdom, Modern Healing</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="font-body text-xs text-green-300 hover:text-white transition-colors">Home</Link>
            <Link href="/#services" className="font-body text-xs text-green-300 hover:text-white transition-colors">Treatments</Link>
            <Link href="/#book-appointment" className="font-body text-xs text-green-300 hover:text-white transition-colors">Book</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
