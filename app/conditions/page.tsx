import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { defaultConditions } from '@/components/Conditions'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface ConditionItem {
  emoji: string
  label: string
  image_url?: string | null
}

export default async function ConditionsPage() {
  const { data: conditionsRow } = await supabase
    .from('site_content')
    .select('content')
    .eq('key', 'conditions')
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: ConditionItem[] = (conditionsRow?.content as any[]) ?? defaultConditions

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
            ✦ Conditions We Support ✦
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-6xl">
            Conditions We Support
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Ayurveda offers a holistic approach to many modern health challenges.
          </p>
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
            Ayurveda does not simply treat disease — it works with the body&apos;s own intelligence,
            gently restoring the natural balance between <em>Vata</em>, <em>Pitta</em>, and{' '}
            <em>Kapha</em>. By addressing the root cause of imbalance, these ancient therapies
            support lasting wellbeing across a wide spectrum of modern health concerns.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CONDITIONS GRID */}
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
