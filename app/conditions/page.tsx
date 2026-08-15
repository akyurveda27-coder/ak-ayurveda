import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { defaultConditions } from '@/components/Conditions'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Conditions We Support | Ayurvedic Wellness London | AK Ayurveda',
  description: 'Ayurveda may support stress, digestive issues, sleep disorders, skin concerns, joint discomfort & more. Discover a holistic approach to wellness at AK Ayurveda London.',
  keywords: 'ayurvedic treatment for stress uk, ayurvedic treatment for back pain uk, ayurvedic skincare uk, ayurveda for sleep uk, digestive wellness london, holistic health london',
}

interface ConditionItem {
  emoji: string
  label: string
  image_url?: string | null
}

const defaultConditionsPage = {
  hero_eyebrow: 'Conditions We Support',
  hero_heading: 'Conditions We Support',
  hero_subtext: 'At our London Ayurvedic clinic, we offer holistic support for a wide range of wellness concerns through personalised treatments.',
  intro_text:
    'In Ayurveda, every condition is understood through the lens of your unique constitution (Prakriti) and current imbalances (Vikriti). Rather than treating symptoms in isolation, we work to restore the underlying balance of Vata, Pitta, and Kapha — allowing the body to heal naturally.',
}

export default async function ConditionsPage() {
  const [conditionsRow, pageRow] = await Promise.all([
    supabase.from('site_content').select('content').eq('key', 'conditions').single(),
    supabase.from('site_content').select('content').eq('key', 'conditions_page').single(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: ConditionItem[] = (conditionsRow.data?.content as any[]) ?? defaultConditions

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedPage = (pageRow.data?.content as Record<string, any>) ?? {}
  const p = { ...defaultConditionsPage, ...savedPage }

  const cardItems = conditions.filter((c) => c.image_url)
  const chipItems = conditions.filter((c) => !c.image_url)

  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* ============================================================ */}
      {/* 1. HERO */}
      {/* ============================================================ */}
      <section className="w-full bg-[#0F3D34] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#D4A853' }}>
            ✦ {p.hero_eyebrow} ✦
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-6xl">
            {p.hero_heading}
          </h1>
          <p className="mt-5 text-lg text-white/70">{p.hero_subtext}</p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. INTRO PARAGRAPH */}
      {/* ============================================================ */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p
            className="font-display text-xl italic leading-relaxed text-gray-700 md:text-2xl"
            style={{ color: '#0F3D34' }}
          >
            {p.intro_text}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. STATS STRIP */}
      {/* ============================================================ */}
      <section className="w-full bg-white pb-0 pt-0">
        <div className="mx-auto max-w-4xl px-6 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
            {[
              { num: '18+', label: 'Therapies Offered' },
              { num: '50+', label: 'Conditions Supported' },
              { num: '5000', label: 'Years of Tradition' },
              { num: '500+', label: 'Happy Clients' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-5 text-center" style={{ background: '#F0FAF7', border: '1px solid #D0EDE6' }}>
                <p className="font-display text-3xl font-bold" style={{ color: '#1B6E5C' }}>{stat.num}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CONDITIONS GRID */}
      {/* ============================================================ */}
      <section className="w-full bg-mint py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl" style={{ color: '#0F3D34' }}>
              Explore All Conditions
            </h2>
            <p className="mt-3 text-gray-600">
              Traditional Ayurvedic therapies tailored to your unique constitution and health needs.
            </p>
          </div>

          {/* Image cards — conditions with image_url */}
          {cardItems.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {cardItems.map((c) => (
                <div
                  key={c.label}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image_url!}
                    alt={c.label}
                    style={{ height: 180, width: '100%', objectFit: 'cover' }}
                    className="rounded-t-2xl"
                  />
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold" style={{ color: '#0F3D34' }}>
                      {c.emoji} {c.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Emoji chip grid — conditions without image_url */}
          {chipItems.length > 0 && (
            <div
              className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${
                cardItems.length > 0 ? 'mt-8' : 'mt-10'
              }`}
            >
              {chipItems.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
                >
                  <span className="block text-4xl">{c.emoji}</span>
                  <p className="mt-3 text-sm font-medium" style={{ color: '#0F3D34' }}>
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. DISCLAIMER NOTE */}
      {/* ============================================================ */}
      <section className="w-full bg-white py-12">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-[#D0EDE6] p-8">
            <p className="flex gap-3 text-[15px] leading-relaxed text-gray-600">
              <span className="mt-0.5 text-xl">ℹ️</span>
              <span>
                <strong className="font-semibold" style={{ color: '#0F3D34' }}>Please note:</strong>{' '}
                Ayurvedic therapies are complementary wellness practices and are not a substitute for
                medical treatment. Always consult your GP for medical concerns. AK Ayurveda therapies
                are designed to support wellbeing alongside conventional healthcare.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. BOOK CTA */}
      {/* ============================================================ */}
      <section className="w-full bg-[#0F3D34] py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
            Ready to Address Your Wellness Concerns?
          </h2>
          <p className="mt-4 text-white/70">
            Our practitioners will guide you to the right Ayurvedic therapies for your individual needs.
          </p>
          <a
            href="/book"
            className="mt-8 inline-block rounded-full px-10 py-3.5 font-semibold transition hover:brightness-95"
            style={{ backgroundColor: '#D4A853', color: '#0F3D34' }}
          >
            Book a Consultation
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
