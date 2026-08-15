'use client'

import Navbar from '@/components/Navbar'
import Services from '@/components/Services'
import Conditions from '@/components/Conditions'
import BlogPreview from '@/components/BlogPreview'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* ============================================================ */}
      {/* 1. HERO */}
      {/* ============================================================ */}
      <section className="relative flex min-h-[90vh] w-full items-center overflow-hidden bg-white">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-70 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(27,110,92,0.15) 0%, rgba(240,250,247,0.4) 60%, transparent 80%)' }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-20 pb-16 md:grid-cols-5 md:px-10 md:pt-24">

          {/* Left — 60% */}
          <div className="md:col-span-3">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Traditional Ayurvedic Clinic · London, UK
            </span>

            <h1 className="mt-6 font-display text-[36px] font-semibold leading-[1.1] text-[#1A1A1A] md:text-[64px]">
              Restore Balance. Reconnect with Ancient Wellness.
            </h1>

            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-gray-600">
              Experience personalised Ayurvedic therapies rooted in 5,000 years of tradition — designed to support your body, mind, and spirit.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/book"
                className="w-full rounded-full bg-primary px-8 py-3.5 text-center font-medium text-white transition hover:bg-[#155A4A] sm:w-auto"
              >
                Book a Consultation
              </a>
              <a
                href="#services"
                className="w-full rounded-full border-2 border-primary px-8 py-3.5 text-center font-medium text-primary transition hover:bg-primary/5 sm:w-auto"
              >
                Explore Treatments
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <span>🌿 18 Years Experience</span>
              <span>✓ UK Registered</span>
              <span>⭐ 200+ Happy Clients</span>
            </div>
          </div>

          {/* Right — 40%, hidden on mobile */}
          <div className="relative hidden md:col-span-2 md:block">
            <div className="overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(27,110,92,0.2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"
                alt="Ayurvedic wellness practice"
                className="h-[560px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. STATS STRIP — 4 columns */}
      {/* ============================================================ */}
      <section className="w-full border-t border-b border-[#D0EDE6] bg-[#F0FAF7] py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 text-center lg:grid-cols-4">
          <div>
            <div className="font-display text-4xl font-semibold text-primary md:text-5xl">5,000+</div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary md:text-sm">Years</p>
            <p className="mt-1 text-sm text-gray-600">Of Vedic Tradition</p>
          </div>
          <div>
            <div className="font-display text-4xl font-semibold text-primary md:text-5xl">18</div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary md:text-sm">Treatments</p>
            <p className="mt-1 text-sm text-gray-600">Traditional Therapies</p>
          </div>
          <div>
            <div className="font-display text-4xl font-semibold text-primary md:text-5xl">100%</div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary md:text-sm">Natural</p>
            <p className="mt-1 text-sm text-gray-600">Herbal Ingredients</p>
          </div>
          <div>
            <div className="font-display text-4xl font-semibold text-primary md:text-5xl">London</div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary md:text-sm">UK</p>
            <p className="mt-1 text-sm text-gray-600">Based Clinic</p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SERVICES */}
      {/* ============================================================ */}
      <section id="services" className="w-full border-b border-[#E0F0EB] bg-white py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Our Treatments</span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">Time-Honoured Therapies</h2>
            <p className="mt-4 text-[17px] text-gray-600">
              Choose from 18 traditional Ayurvedic therapies, each personalised to your individual needs and constitution.
            </p>
          </div>
          <div className="mt-16">
            <Services />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. WHY CHOOSE US — dark */}
      {/* ============================================================ */}
      <section id="about" className="w-full bg-[#0F3D34] py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">Why AK Ayurveda</span>
            <h2 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">Why Choose AK Ayurveda</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      {/* 5. CONDITIONS */}
      {/* ============================================================ */}
      <section id="conditions" className="w-full bg-[#F0FAF7] py-24 md:py-28">
        <Conditions />
      </section>

      {/* ============================================================ */}
      {/* 6. BLOG PREVIEW */}
      {/* ============================================================ */}
      <section id="journal" className="w-full border-t border-[#E0F0EB] bg-white py-24 md:py-28">
        <BlogPreview />
      </section>

      {/* ============================================================ */}
      {/* 7. BOOK BANNER */}
      {/* ============================================================ */}
      <section className="w-full bg-[#0F3D34] py-20">
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
      <section id="faq" className="w-full bg-[#F0FAF7] py-24 md:py-28">
        <FAQ />
      </section>

      {/* ============================================================ */}
      {/* 9. BOOK APPOINTMENT + FOOTER */}
      {/* ============================================================ */}
      
      <Footer />
    </main>
  )
}
