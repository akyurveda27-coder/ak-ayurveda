import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* ============================================================ */}
      {/* 1. HERO */}
      {/* ============================================================ */}
      <section className="w-full bg-[#0F3D34] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#D4A853' }}>
            ✦ Our Story ✦
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-6xl">
            About AK Ayurveda
          </h1>
          <p className="mt-5 text-lg text-white/70">
            Rooted in 5,000 years of Vedic wisdom, practised in the heart of London.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MISSION STRIP */}
      {/* ============================================================ */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
            {[
              {
                icon: '🌿',
                title: 'Our Mission',
                desc: 'To heal through ancient wisdom — addressing root causes rather than symptoms, restoring balance to mind, body, and soul.',
              },
              {
                icon: '🏛️',
                title: 'Our Heritage',
                desc: '5,000 years of Ayurvedic tradition form the foundation of every therapy we offer — timeless science, modern care.',
              },
              {
                icon: '🌍',
                title: 'Our Reach',
                desc: 'London-based clinic proudly serving clients from across the globe seeking authentic Ayurvedic wellness.',
              },
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
      <section className="w-full bg-mint py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Left — Text */}
            <div>
              <h2
                className="font-display text-4xl font-semibold md:text-5xl"
                style={{ color: '#0F3D34' }}
              >
                Our Journey
              </h2>
              <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-gray-600">
                <p>
                  AK Ayurveda was founded with a singular vision: to bring the transformative power of classical
                  Ayurvedic medicine to the heart of London. Born from a deep reverence for Vedic traditions and
                  a passion for holistic health, our clinic opened its doors to offer something truly different —
                  an approach grounded in over 5,000 years of time-tested healing wisdom.
                </p>
                <p>
                  Our philosophy centres on the individual. We believe every person carries a unique
                  constitutional blueprint — their <em>prakriti</em> — and that sustainable wellness begins
                  when treatments are crafted in harmony with this blueprint. From your first consultation,
                  we listen, assess, and design a personalised pathway to balance.
                </p>
                <p>
                  Today, AK Ayurveda serves clients from across the UK and around the world, combining
                  authentic Ayurvedic therapies with a warm, welcoming environment where healing is not
                  just a treatment — it is an experience.
                </p>
              </div>
            </div>

            {/* Right — Image */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
                alt="Ayurvedic wellness practice"
                className="h-80 w-full rounded-2xl object-cover shadow-lg md:h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. VALUES SECTION */}
      {/* ============================================================ */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-semibold md:text-5xl" style={{ color: '#0F3D34' }}>
              Our Values
            </h2>
            <p className="mt-4 text-[17px] text-gray-600">
              The principles that guide every consultation, every treatment, every interaction.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      {/* 5. PRACTITIONER SECTION */}
      {/* ============================================================ */}
      <section className="w-full bg-mint py-16">
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
                Dr. Anjali Kumar
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-500">Chief Ayurvedic Practitioner</p>
              <ul className="mt-4 space-y-1 text-sm text-gray-600">
                <li>🎓 BAMS (Bachelor of Ayurvedic Medicine &amp; Surgery)</li>
                <li>🎓 MD Ayurveda — Kerala Ayurveda Academy</li>
                <li>🏅 15+ years of clinical practice</li>
                <li>🌍 Trained across India, Sri Lanka &amp; the UK</li>
              </ul>
              <p className="mt-5 text-[17px] leading-relaxed text-gray-600">
                Dr. Anjali Kumar brings over fifteen years of clinical experience spanning three continents.
                Her approach weaves classical Ayurvedic diagnostics — pulse reading, constitution assessment,
                and lifestyle analysis — with compassionate, patient-centred care. She believes healing is a
                partnership between practitioner and patient, grounded in trust, patience, and deep listening.
              </p>
            </div>

            {/* Right — Image */}
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80"
                alt="Dr. Anjali Kumar — Chief Ayurvedic Practitioner"
                className="h-64 w-64 rounded-full object-cover shadow-xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BOOK CTA BANNER */}
      {/* ============================================================ */}
      <section className="w-full bg-[#0F3D34] py-16">
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
