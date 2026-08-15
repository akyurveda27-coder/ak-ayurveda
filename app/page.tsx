import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Services from '@/components/Services'
import Conditions, { defaultConditions } from '@/components/Conditions'
import BlogPreview from '@/components/BlogPreview'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { defaultHero, defaultStats } from '@/lib/defaults'
import type { HeroContent, StatsContent } from '@/lib/types'

export const metadata: Metadata = {
  title: 'AK Ayurveda London | Authentic Ayurvedic Clinic & Treatments',
  description: 'London\'s trusted Ayurvedic clinic offering Abhyanga, Shirodhara, Panchakarma & personalised wellness consultations. Book your Ayurvedic treatment in London today.',
  keywords: 'ayurveda london, ayurvedic clinic london, ayurvedic massage london, shirodhara london, abhyanga london, panchakarma london, ayurveda uk, holistic wellness london',
  openGraph: {
    title: 'AK Ayurveda London | Authentic Ayurvedic Clinic',
    description: 'London\'s trusted Ayurvedic clinic. Abhyanga, Shirodhara, Panchakarma & personalised wellness consultations.',
    type: 'website',
    url: 'https://ak-ayurveda.vercel.app',
  },
}

export const revalidate = 60 // revalidate every 60 seconds

export default async function HomePage() {
  // Fetch hero + stats + conditions from admin (site_content table)
  const [heroRow, statsRow, servicesRow, conditionsRow] = await Promise.all([
    supabase.from('site_content').select('value').eq('key', 'hero').single(),
    supabase.from('site_content').select('value').eq('key', 'stats').single(),
    supabase.from('services').select('id, name, description, icon, hero_image, card_image').order('sort_order', { ascending: true }).limit(6),
    supabase.from('site_content').select('content').eq('key', 'conditions').single(),
  ])
  const hero: HeroContent = (heroRow.data?.value as HeroContent) ?? defaultHero
  const stats: StatsContent = (statsRow.data?.value as StatsContent) ?? defaultStats
  const services = servicesRow.data ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditionsData = (conditionsRow.data?.content as any[]) ?? null

  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* ============================================================ */}
      {/* 1. HERO */}
      {/* ============================================================ */}
      <section className="relative w-full overflow-hidden bg-white">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-70 blur-3xl z-0"
          style={{ background: 'radial-gradient(circle, rgba(27,110,92,0.15) 0%, rgba(240,250,247,0.4) 60%, transparent 80%)' }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-20 pb-12 md:grid-cols-5 md:px-10">

          {/* Left — 60% */}
          <div className="md:col-span-3">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              London&rsquo;s Authentic Ayurvedic Clinic · London, UK
            </span>

            <h1 className="mt-6 font-display text-[36px] font-semibold leading-[1.1] text-[#1A1A1A] md:text-[64px]">
              {hero.heading}
            </h1>

            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-gray-600">
              {hero.subheading}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/book"
                className="w-full rounded-full bg-primary px-8 py-3.5 text-center font-medium text-white transition hover:bg-[#155A4A] sm:w-auto"
              >
                {hero.cta1_text || 'Book a Consultation'}
              </a>
              <a
                href="/services"
                className="w-full rounded-full border-2 px-8 py-3.5 text-center font-medium transition sm:w-auto"
                style={{ color: '#1B6E5C', borderColor: '#1B6E5C' }}
              >
                {hero.cta2_text || 'Explore Treatments'}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <span>🌿 100% Natural Ingredients</span>
              <span>✓ UK Registered Clinic</span>
              <span>⭐ Traditional Ayurvedic Methods</span>
            </div>
          </div>

          {/* Right — 40%, hidden on mobile */}
          <div className="relative hidden md:col-span-2 md:block">
            <div className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(27,110,92,0.2)]">
              <Image
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80&auto=format&fit=crop"
                alt="Ayurvedic wellness practice"
                width={800}
                height={560}
                className="h-[560px] w-full object-cover"
                priority={true}
                sizes="(max-width: 768px) 0vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. STATS STRIP — 4 columns */}
      {/* ============================================================ */}
      <section className="w-full border-t border-b border-mintBorder bg-mint py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center lg:grid-cols-4">
          {[
            { value: stats.stat1_value, label: stats.stat1_label },
            { value: stats.stat2_value, label: stats.stat2_label },
            { value: stats.stat3_value, label: stats.stat3_label },
            { value: stats.stat4_value, label: stats.stat4_label },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-display text-4xl font-semibold text-primary md:text-5xl">{s.value}</div>
              <p className="mt-1 text-sm text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SERVICES */}
      {/* ============================================================ */}
      <section id="services" className="w-full border-b border-sectionBorder bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Our Treatments</span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">Time-Honoured Therapies</h2>
            <p className="mt-4 text-[17px] text-gray-600">
              Choose from 18 traditional Ayurvedic therapies, each personalised to your individual needs and constitution.
            </p>
          </div>
          <div className="mt-10">
            <Services services={services} />
          </div>
          <div className="mt-10 text-center">
            <a
              href="/services"
              className="inline-block rounded-full border-2 px-8 py-3 font-medium transition"
              style={{ color: '#1B6E5C', borderColor: '#1B6E5C' }}
            >
              View All Treatments →
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. WHY CHOOSE US — dark */}
      {/* ============================================================ */}
      <section id="about" className="w-full py-12 md:py-16" style={{ background: '#0F3D34' }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Why AK Ayurveda</span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">Why Choose AK Ayurveda</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🎓', title: 'Qualified Therapists', desc: 'Our practitioners hold advanced qualifications and bring decades of combined clinical expertise to every consultation.' },
              { icon: '🌿', title: 'Authentic Techniques', desc: 'Every therapy follows classical Ayurvedic protocols passed down through generations — no shortcuts, no compromises.' },
              { icon: '💊', title: 'No Harsh Chemicals', desc: 'We use pure, natural herbal formulations and oils, free from synthetic additives or harsh chemical ingredients.' },
              { icon: '🤝', title: 'Personalised Care', desc: 'We begin with a thorough assessment to craft a wellness plan uniquely tailored to your constitution and needs.' },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border p-8 transition hover:bg-white/[0.1]"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)' }}
              >
                <div className="text-3xl text-accent">{card.icon}</div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. GALLERY STRIP */}
      {/* ============================================================ */}
      <section className="w-full overflow-hidden">
        {/* Mobile: horizontal scroll | Desktop: flex strip */}
        <div className="flex gap-1 h-52 md:h-72 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=500&q=80&auto=format&fit=crop', label: 'Abhyanga' },
            { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=80&auto=format&fit=crop', label: 'Shirodhara' },
            { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&q=80&auto=format&fit=crop', label: 'Head Massage' },
            { src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500&q=80&auto=format&fit=crop', label: 'Wellness' },
            { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80&auto=format&fit=crop', label: 'Consultation' },
            { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80&auto=format&fit=crop', label: 'Face Care' },
            { src: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80&auto=format&fit=crop', label: 'Herbal' },
          ].map((item, i) => (
            <div key={i} className="relative flex-shrink-0 snap-start overflow-hidden group" style={{ width: 'calc(70vw)', minWidth: '200px', flex: '1 0 auto' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={`AK Ayurveda ${item.label}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-3">
                <span className="text-white text-xs font-semibold tracking-wider uppercase">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CONDITIONS */}
      {/* ============================================================ */}
      <section id="conditions" className="w-full py-10" style={{ backgroundColor: '#F0FAF7' }}>
        <Conditions conditions={conditionsData ?? defaultConditions} />
      </section>

      {/* ============================================================ */}
      {/* 7. TESTIMONIALS */}
      {/* ============================================================ */}
      <section className="w-full bg-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4A853' }}>✦ What Our Clients Say ✦</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: '#0F3D34' }}>Stories of Transformation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "The Shirodhara treatment was unlike anything I've experienced. I left feeling completely calm and centred. Truly transformative.", name: "Sarah M.", location: "London, UK", avatar: "S" },
              { quote: "Dr. Anjali's consultation was thorough and deeply personalised. The dietary recommendations have made a huge difference to my energy levels.", name: "James T.", location: "Surrey, UK", avatar: "J" },
              { quote: "I've tried many wellness clinics in London but AK Ayurveda feels genuinely authentic. The Abhyanga massage is something I look forward to every month.", name: "Priya K.", location: "London, UK", avatar: "P" },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl p-6 border border-[#D0EDE6]" style={{ background: '#F0FAF7' }}>
                <p className="text-3xl mb-3" style={{ color: '#D4A853' }}>&ldquo;</p>
                <p className="text-gray-600 leading-relaxed text-sm mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-white text-sm" style={{ background: '#1B6E5C' }}>{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#0F3D34' }}>{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. BLOG PREVIEW */}
      {/* ============================================================ */}
      <section id="journal" className="w-full bg-white">
        <BlogPreview />
      </section>

      {/* ============================================================ */}
      {/* 7. BOOK BANNER */}
      {/* ============================================================ */}
      <section className="w-full py-12" style={{ background: '#0F3D34' }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-[32px] font-semibold text-white md:text-[42px]">
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="mt-4 text-white/70">
            Take the first step towards holistic wellbeing. We&apos;ll confirm your appointment within 24 hours.
          </p>
          <a
            href="/book"
            className="mt-8 inline-block rounded-full bg-accent px-10 py-3.5 font-semibold text-[#0F3D34] transition hover:brightness-95"
          >
            Book a Consultation
          </a>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FAQ */}
      {/* ============================================================ */}
      <section id="faq" className="w-full bg-mint py-10">
        <FAQ />
      </section>

      {/* Schema markup for Google — LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HealthAndBeautyBusiness",
            "name": "AK Ayurveda",
            "description": "Authentic Ayurvedic clinic in London offering Abhyanga, Shirodhara, Panchakarma and personalised Ayurvedic consultations.",
            "url": "https://ak-ayurveda.vercel.app",
            "telephone": "+44-20-7946-0958",
            "email": "info@akayurveda.co.uk",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "London",
              "addressLocality": "London",
              "addressCountry": "GB"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                "opens": "09:00",
                "closes": "19:00"
              }
            ],
            "priceRange": "££",
            "currenciesAccepted": "GBP",
            "hasMap": "https://maps.google.com/?q=London+Ayurveda+Clinic",
            "sameAs": [],
            "serviceArea": {
              "@type": "City",
              "name": "London"
            }
          })
        }}
      />

      {/* Schema markup for Google — FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Ayurveda?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "An ancient holistic wellness tradition developed over 5,000 years ago in India, focused on balancing the body, mind, and spirit through natural therapies and lifestyle practices."
                }
              },
              {
                "@type": "Question",
                "name": "How long does an Ayurvedic session take at AK Ayurveda London?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most sessions run between 45 and 90 minutes, depending on the therapy selected. Your practitioner will advise the ideal duration during your initial consultation."
                }
              },
              {
                "@type": "Question",
                "name": "Is Ayurvedic treatment safe alongside modern healthcare?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our therapies are designed to complement your existing routine. We recommend discussing any concerns with your GP, and our practitioners will always ask about your current health before treatment."
                }
              },
              {
                "@type": "Question",
                "name": "How many Ayurvedic sessions are recommended?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This varies by individual. Your practitioner will suggest a personalised plan after your first consultation, taking into account your constitution and wellness goals."
                }
              },
              {
                "@type": "Question",
                "name": "Are online Ayurvedic consultations available?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we offer online consultations for clients who are unable to visit us in person. Please select 'General Consultation' when booking."
                }
              }
            ]
          })
        }}
      />

      <Footer />
    </main>
  )
}
