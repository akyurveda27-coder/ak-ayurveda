import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

function optimizeUrl(url: string, w: number): string {
  if (!url) return url
  if (url.includes('unsplash.com')) {
    return `${url.split('?')[0]}?w=${w}&q=75&auto=format&fit=crop`
  }
  return url
}

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About AK Ayurveda | London\'s Authentic Ayurvedic Clinic',
  description: 'Learn about AK Ayurveda — London\'s authentic Ayurvedic clinic rooted in 5,000 years of Vedic tradition. Meet our practitioners and discover our approach to holistic wellness.',
  keywords: 'ayurvedic clinic london, ayurvedic doctor london, best ayurvedic clinic london, ayurveda uk, holistic wellness london, vedic medicine london',
}

const defaultAbout = {
  hero_eyebrow: 'Our Story',
  hero_heading: 'About AK Ayurveda — London\'s Ayurvedic Clinic',
  hero_subtext: 'Rooted in 5,000 years of Vedic wisdom, practised in the heart of London.',
  mission1_icon: '🌿',
  mission1_title: 'Our Mission',
  mission1_text: 'To restore balance and wellbeing through the timeless principles of Ayurveda, tailored to modern life.',
  mission2_icon: '🏛️',
  mission2_title: 'Our Heritage',
  mission2_text: 'Drawing from over 5,000 years of Vedic wisdom, our treatments are rooted in authentic Ayurvedic tradition.',
  mission3_icon: '🌍',
  mission3_title: 'Our Reach',
  mission3_text: 'Based in London, we serve clients from across the UK and beyond who seek genuine Ayurvedic care.',
  story_heading: 'Our Journey',
  story_para1:
    'AK Ayurveda was founded with a single purpose: to bring authentic Ayurvedic healing to London. Frustrated by the lack of genuine, personalised Ayurvedic care in the UK, our founders set out to create a clinic that honours the full depth of this ancient science.',
  story_para2:
    'Every treatment at AK Ayurveda is rooted in classical Ayurvedic texts and delivered with modern sensitivity. We believe true healing addresses not just symptoms, but the root imbalances that cause them.',
  story_para3:
    'Today, AK Ayurveda serves hundreds of clients seeking relief from stress, digestive issues, sleep disorders, and more — through therapies that have stood the test of thousands of years.',
  story_image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
  practitioner_name: 'Dr. Anjali Kumar',
  practitioner_title: 'Chief Ayurvedic Practitioner',
  practitioner_bio:
    'Dr. Anjali Kumar trained at the Ayurvedic Medical College in Kerala and has over 15 years of clinical experience. She has treated thousands of patients across India and the UK, specialising in Panchakarma and chronic lifestyle disorders.',
  practitioner_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
}

export default async function AboutPage() {
  const { data: row } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', 'about')
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saved = (row?.value as Record<string, any>) ?? {}
  const c = { ...defaultAbout, ...saved }

  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* ============================================================ */}
      {/* 1. HERO */}
      {/* ============================================================ */}
      <section className="w-full bg-[#0F3D34] pt-10 pb-8">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#D4A853' }}>
            ✦ {c.hero_eyebrow} ✦
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-6xl">
            {c.hero_heading}
          </h1>
          <p className="mt-5 text-lg text-white/70">{c.hero_subtext}</p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MISSION STRIP */}
      {/* ============================================================ */}
      <section className="w-full bg-white py-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
            {[
              { icon: c.mission1_icon, title: c.mission1_title, desc: c.mission1_text },
              { icon: c.mission2_icon, title: c.mission2_title, desc: c.mission2_text },
              { icon: c.mission3_icon, title: c.mission3_title, desc: c.mission3_text },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <span className="text-5xl">{item.icon}</span>
                <h3 className="mt-4 font-display text-xl font-semibold" style={{ color: '#0F3D34' }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. STORY SECTION */}
      {/* ============================================================ */}
      <section className="w-full bg-mint py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Left — Text */}
            <div>
              <h2
                className="font-display text-4xl font-semibold md:text-5xl"
                style={{ color: '#0F3D34' }}
              >
                {c.story_heading}
              </h2>
              <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-gray-600">
                <p>{c.story_para1}</p>
                <p>{c.story_para2}</p>
                <p>{c.story_para3}</p>
              </div>
            </div>

            {/* Right — Image */}
            <div>
              <Image
                src={optimizeUrl(c.story_image, 800)}
                alt="Ayurvedic wellness practice"
                width={800}
                height={384}
                className="h-80 w-full rounded-2xl object-cover shadow-lg md:h-96"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. VALUES SECTION (static) */}
      {/* ============================================================ */}
      <section className="w-full bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-semibold md:text-5xl" style={{ color: '#0F3D34' }}>
              Our Values
            </h2>
            <p className="mt-4 text-[17px] text-gray-600">
              The principles that guide every consultation, every treatment, every interaction.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: '🙏',
                title: 'Authenticity',
                desc: 'We honour the classical Ayurvedic texts and never dilute the integrity of ancient protocols for commercial convenience.',
              },
              {
                icon: '🎯',
                title: 'Personalisation',
                desc: 'No two bodies are the same. Every treatment plan is individually crafted to suit your unique constitution and health goals.',
              },
              {
                icon: '💚',
                title: 'Holistic Healing',
                desc: 'We treat the whole person — physical, emotional, mental, and spiritual — not just isolated symptoms.',
              },
              {
                icon: '🔬',
                title: 'Scientific Approach',
                desc: 'Ancient wisdom meets modern understanding. We integrate evidence-informed insights with traditional Ayurvedic knowledge.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-[#D0EDE6] bg-white p-6 transition hover:shadow-md"
              >
                <span className="text-4xl">{card.icon}</span>
                <h3 className="mt-4 font-display text-xl font-semibold" style={{ color: '#0F3D34' }}>
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PRACTITIONER SECTION — hidden if name is blank in admin */}
      {/* ============================================================ */}
      {c.practitioner_name?.trim() && <section className="w-full bg-mint py-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Left — Text */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#D4A853' }}>
                Meet Our Lead Practitioner
              </p>
              <h2
                className="mt-3 font-display text-3xl font-semibold md:text-4xl"
                style={{ color: '#0F3D34' }}
              >
                {c.practitioner_name}
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-500">{c.practitioner_title}</p>
              <p className="mt-5 text-[17px] leading-relaxed text-gray-600">{c.practitioner_bio}</p>
            </div>

            {/* Right — Circular image with credentials */}
            <div className="flex flex-col items-center">
              <div className="relative w-56 h-56 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optimizeUrl(c.practitioner_image, 400)}
                  alt={c.practitioner_name}
                  className="w-full h-full object-cover rounded-full"
                  style={{ border: '4px solid #D4A853' }}
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold text-white whitespace-nowrap" style={{ background: '#1B6E5C' }}>
                  ✦ Chief Practitioner
                </div>
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold" style={{ color: '#0F3D34' }}>{c.practitioner_name}</h3>
              <p className="text-sm mb-4" style={{ color: '#1B6E5C' }}>{c.practitioner_title}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['BAMS Certified', '15+ Years', 'London Clinic', 'Panchakarma Expert'].map((badge) => (
                  <span key={badge} className="rounded-full bg-white border border-[#D0EDE6] px-3 py-1 text-xs font-medium" style={{ color: '#1B6E5C' }}>{badge}</span>
                ))}
              </div>
              <p className="text-center text-gray-600 leading-relaxed text-sm max-w-xs">{c.practitioner_bio}</p>
            </div>
          </div>
        </div>
      </section>}

      {/* ============================================================ */}
      {/* 6. BOOK CTA BANNER */}
      {/* ============================================================ */}
      <section className="w-full bg-[#0F3D34] py-10">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
            Begin Your Wellness Journey
          </h2>
          <p className="mt-4 text-white/70">
            Take the first step towards holistic wellbeing. We&apos;ll confirm your appointment within 24 hours.
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
