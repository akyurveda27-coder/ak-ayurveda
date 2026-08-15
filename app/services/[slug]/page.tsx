import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookButton from '@/components/BookButton'

export const revalidate = 60

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function getIdealForEmoji(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('muscle') || t.includes('tension') || t.includes('tight')) return '💆'
  if (t.includes('sleep') || t.includes('insomnia') || t.includes('rest')) return '😴'
  if (t.includes('stress') || t.includes('anxiety') || t.includes('mind')) return '🌬️'
  if (t.includes('new') || t.includes('beginner') || t.includes('first') || t.includes('intro')) return '🌱'
  if (t.includes('joint') || t.includes('arthritis') || t.includes('stiff')) return '🦴'
  if (t.includes('digestion') || t.includes('gut') || t.includes('bloat')) return '🫐'
  if (t.includes('skin') || t.includes('dry') || t.includes('nourish')) return '✨'
  if (t.includes('circulation') || t.includes('blood') || t.includes('heart')) return '❤️'
  if (t.includes('energy') || t.includes('fatigue') || t.includes('tired')) return '⚡'
  if (t.includes('detox') || t.includes('cleanse') || t.includes('purif')) return '🌿'
  if (t.includes('back') || t.includes('lower') || t.includes('spine')) return '🧘'
  if (t.includes('head') || t.includes('migraine') || t.includes('sinus')) return '🧠'
  const fallbacks = ['💆', '🌿', '✨', '🌸', '🌬️', '🧘', '💫', '🌱']
  return fallbacks[0]
}

const HERO_FALLBACK = 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop'

const DEFAULT_FAQS = [
  {
    question: 'What should I expect during my first visit?',
    answer: 'Your first visit includes a brief consultation to understand your health goals and dosha, followed by your treatment tailored to your current needs.',
  },
  {
    question: 'How often should I have this treatment?',
    answer: 'Weekly sessions are ideal during periods of high stress, while a monthly treatment supports general maintenance and balance.',
  },
  {
    question: 'What should I wear or bring?',
    answer: 'Loose, comfortable clothing is recommended for before and after your session — we provide everything needed for the treatment itself.',
  },
]

export default async function TreatmentPage({ params }: { params: { slug: string } }) {
  const { data: allServices } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  const service = allServices?.find(s => toSlug(s.name) === params.slug) ?? null
  const related = allServices?.filter(s => toSlug(s.name) !== params.slug).slice(0, 3) ?? []

  if (!service) {
    return (
      <main>
        <Navbar />
        <section className="w-full bg-mint py-32 text-center">
          <div className="text-4xl mb-6">🌿</div>
          <h1 className="font-display text-4xl font-semibold mb-4" style={{ color: '#0F3D34' }}>
            Treatment Not Found
          </h1>
          <p className="text-gray-500 mb-8">This treatment page doesn&apos;t exist or may have moved.</p>
          <Link
            href="/services"
            className="inline-block rounded-full px-8 py-3 font-medium text-white transition"
            style={{ background: '#1B6E5C' }}
          >
            ← View All Treatments
          </Link>
        </section>
        <Footer />
      </main>
    )
  }

  const benefits = (Array.isArray(service.benefits) && service.benefits.length > 0) ? service.benefits : ['Deep muscle relaxation', 'Improves circulation', 'Calms the nervous system', 'Nourishes skin']
  const benefitDescs = (Array.isArray(service.benefit_descriptions) && service.benefit_descriptions.length > 0) ? service.benefit_descriptions : ['Rhythmic strokes ease tension.', 'Encourages healthy blood flow.', 'Quiets an overactive mind.', 'Leaves skin soft and hydrated.']
  const hasValidProcess = Array.isArray(service.process) && service.process.some((s: string) => s && s.trim().length > 0)
  const steps = hasValidProcess ? service.process : ['Welcome & Consultation', 'Oil Selection', 'Full Body Treatment', 'Rest & Aftercare']
  const hasValidStepDescs = Array.isArray(service.process_descriptions) && service.process_descriptions.some((s: string) => s && s.trim().length > 0)
  const stepDescs = hasValidStepDescs ? service.process_descriptions : ['A brief conversation about your current health and areas of tension.', 'A warm herbal oil is chosen to suit your dosha and current imbalance.', 'The full treatment session using traditional Ayurvedic techniques.', 'A short rest period followed by aftercare guidance for the rest of your day.']
  const idealForRaw = (Array.isArray(service.ideal_for) && service.ideal_for.length > 0) ? service.ideal_for : ['Muscle tension', 'Poor sleep', 'Stress & anxiety', 'New to Ayurveda']
  const idealFor = idealForRaw
  const faqs: { question?: string; q?: string; answer?: string; a?: string }[] = service.faqs ?? []

  const faqList = faqs.length > 0 ? faqs : DEFAULT_FAQS

  return (
    <>
      <style>{`
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        details[open] .chev { transform: rotate(180deg); }
        .glass-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(6px); }
        @media (min-width: 768px) {
          .step-line-h { background: linear-gradient(90deg, rgba(27,110,92,0.35), rgba(27,110,92,0.08)); }
        }
      `}</style>

      {/* ── 1. NAVBAR ── */}
      <Navbar />

      {/* ── 2. HERO ── */}
      <section className="relative overflow-hidden" style={{ background: '#0F3D34' }}>
        {/* Decorative glows */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1B6E5C, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4A853, transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-16 md:pt-14 md:pb-24">
          {/* Breadcrumb */}
          <p className="text-white/60 text-sm mb-8" style={{ letterSpacing: '0.02em' }}>
            <Link href="/" className="hover:text-white/90 transition">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/services" className="hover:text-white/90 transition">Services</Link>
            <span className="mx-1">/</span>
            <span className="text-white/90 font-medium">{service.name}</span>
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
                style={{ background: 'rgba(212,168,83,0.14)', color: '#D4A853', letterSpacing: '0.1em' }}
              >
                ✦ AYURVEDIC TREATMENT
              </span>
              <h1 className="font-display text-white mt-6 mb-6" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', lineHeight: 1.08 }}>
                {service.name}
              </h1>
              <p className="text-white/70 text-lg leading-relaxed max-w-md mb-8">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <BookButton
                  serviceName={service.name}
                  className="inline-flex items-center rounded-full px-7 py-3.5 font-semibold shadow-lg hover:brightness-105 transition"
                  style={{ background: '#D4A853', color: '#0F3D34' }}
                >
                  Book This Treatment
                </BookButton>
                <Link
                  href="/services"
                  className="inline-flex items-center rounded-full px-7 py-3.5 font-semibold text-white border border-white/40 hover:bg-white/10 transition"
                >
                  View All Treatments
                </Link>
              </div>
            </div>

            {/* Right: image + floating badge */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.hero_image || HERO_FALLBACK}
                alt={`${service.name} Ayurvedic treatment`}
                className="rounded-2xl shadow-2xl w-full object-cover"
                style={{ height: '420px' }}
                loading="eager"
              />

            </div>
          </div>
        </div>
      </section>

      {/* ── 3. QUICK INFO STRIP ── */}
      <section style={{ background: '#F0FAF7' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Duration */}
          <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 shadow-sm">
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(27,110,92,0.1)', color: '#1B6E5C' }}
            >
              ⏱
            </span>
            <div>
              <p className="text-xs tracking-wide text-black/40 uppercase">Duration</p>
              <p className="font-display text-2xl font-semibold" style={{ color: '#0F3D34' }}>
                {service.duration || '60–90 min'}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 shadow-sm">
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
              style={{ background: 'rgba(212,168,83,0.14)', color: '#D4A853' }}
            >
              £
            </span>
            <div>
              <p className="text-xs tracking-wide text-black/40 uppercase">Price</p>
              <p className="font-display text-2xl font-semibold" style={{ color: '#0F3D34' }}>
                {service.price_from ? `From ${String(service.price_from).replace(/^£+/, '£')}` : 'From £30'}
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 shadow-sm">
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(27,110,92,0.1)', color: '#1B6E5C' }}
            >
              🌿
            </span>
            <div>
              <p className="text-xs tracking-wide text-black/40 uppercase">Category</p>
              <p className="font-display text-2xl font-semibold" style={{ color: '#0F3D34' }}>
                Ayurvedic Therapy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BENEFITS ── */}
      <section style={{ background: '#F0FAF7', borderTop: '1px solid #E0F0EB' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-14 items-start">
          {/* Left: header */}
          <div>
            <p
              className="text-xs font-bold uppercase mb-3"
              style={{ color: '#D4A853', letterSpacing: '0.14em' }}
            >
              ✦ Benefits
            </p>
            <h2
              className="font-display text-4xl md:text-5xl leading-tight"
              style={{ color: '#0F3D34' }}
            >
              Why This Treatment?
            </h2>
            <p className="text-black/60 mt-5 max-w-sm leading-relaxed">
              {service.name} is one of the most revered Ayurvedic therapies — a warm-oil ritual designed to calm the nervous system while nourishing skin, muscle and joint.
            </p>
          </div>

          {/* Right: benefit cards grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {(benefits as string[]).map((benefit: string, i: number) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full mb-4"
                  style={{ background: 'rgba(27,110,92,0.1)', color: '#1B6E5C' }}
                >
                  ✓
                </span>
                <h3 className="font-semibold text-[15px] mb-1" style={{ color: '#0F3D34' }}>
                  {benefit}
                </h3>
                {benefitDescs[i] && (
                  <p className="text-sm text-black/55 leading-relaxed">{benefitDescs[i]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PROCESS ── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
          {/* Centered header */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <p
              className="text-xs font-bold uppercase mb-3"
              style={{ color: '#D4A853', letterSpacing: '0.14em' }}
            >
              ✦ The Process ✦
            </p>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: '#0F3D34' }}>
              What To Expect
            </h2>
            <p className="text-black/60 mt-4">
              A step-by-step walkthrough of your treatment, from arrival to completion.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid md:grid-cols-4 gap-10 md:gap-6 relative">
            {/* Horizontal connector line (desktop only) — behind circles */}
            <div
              className="hidden md:block absolute h-[2px]"
              style={{ top: '24px', left: '10%', right: '10%', background: 'rgba(27,110,92,0.25)' }}
            />

            {(steps as string[]).map((step: string, i: number) => (
              <div key={i} className="relative text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl font-semibold text-white mx-auto mb-5 relative z-10"
                  style={{ background: '#1B6E5C' }}
                >
                  {i + 1}
                </div>
                <p
                  className="text-xs font-semibold tracking-wide uppercase mb-1"
                  style={{ color: '#D4A853' }}
                >
                  Step {i + 1}
                </p>
                <h3 className="font-semibold mb-2 text-primaryDark">
                  {step || `Step ${i + 1}`}
                </h3>
                {stepDescs[i] && (
                  <p className="text-sm text-black/55 leading-relaxed">{stepDescs[i]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. IDEAL FOR ── */}
      <section className="relative overflow-hidden" style={{ background: '#0F3D34' }}>
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4A853, transparent 70%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-20">
          {/* Centered header */}
          <div className="text-center max-w-xl mx-auto mb-14">
            <p
              className="text-xs font-bold uppercase mb-3"
              style={{ color: '#D4A853', letterSpacing: '0.14em' }}
            >
              ✦ Ideal For ✦
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Who Is This For?
            </h2>
          </div>

          {/* Glass cards grid — 1 col mobile, 2 tablet, up to 5 desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {(idealFor as string[]).map((item: string, i: number) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <span className="text-3xl block mb-4">{getIdealForEmoji(item)}</span>
                <h3 className="font-semibold text-white mb-1">{item}</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Beneficial for those experiencing {item.toLowerCase()}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section style={{ background: '#F0FAF7' }}>
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-20">
          {/* Centered header */}
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase mb-3"
              style={{ color: '#D4A853', letterSpacing: '0.14em' }}
            >
              ✦ FAQ ✦
            </p>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: '#0F3D34' }}>
              Frequently Asked Questions
            </h2>
          </div>

          {/* Native accordion */}
          <div className="space-y-4">
            {(faqList as Array<{question:string;answer:string}>).map((faq: {question:string;answer:string}, i: number) => (
              <details key={i} className="bg-white rounded-2xl px-6 py-5 shadow-sm">
                <summary
                  className="flex items-center justify-between cursor-pointer font-semibold"
                  style={{ color: '#0F3D34' }}
                >
                  <span>{faq.question ?? (faq as { q?: string }).q}</span>
                  <span className="chev transition-transform text-lg" style={{ color: '#D4A853' }}>
                    ⌄
                  </span>
                </summary>
                <p className="text-sm text-black/60 mt-3 leading-relaxed">
                  {faq.answer ?? (faq as { a?: string }).a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. RELATED TREATMENTS ── */}
      {related.length > 0 && (
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
            {/* Centered header */}
            <div className="text-center max-w-xl mx-auto mb-14">
              <p
                className="text-xs font-bold uppercase mb-3"
                style={{ color: '#D4A853', letterSpacing: '0.14em' }}
              >
                ✦ You May Also Like ✦
              </p>
              <h2 className="font-display text-4xl md:text-5xl" style={{ color: '#0F3D34' }}>
                Related Treatments
              </h2>
            </div>

            {/* 3-col grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {(related as Array<{id:string;name:string;description:string;icon:string}>).map((r: {id:string;name:string;description:string;icon:string}) => (
                <div
                  key={r.id}
                  className="border border-black/10 rounded-2xl p-7 hover:shadow-lg transition"
                >
                  {/* Mint icon box */}
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                    style={{ background: '#F0FAF7', display: 'inline-flex' }}
                  >
                    {r.icon ?? '🌿'}
                  </span>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: '#0F3D34' }}>
                    {r.name}
                  </h3>
                  <p className="text-sm text-black/55 leading-relaxed mb-5">
                    {r.description?.substring(0, 120)}
                    {r.description && r.description.length > 120 ? '…' : ''}
                  </p>
                  <Link
                    href={`/services/${toSlug(r.name)}`}
                    className="text-sm font-semibold hover:opacity-80 transition"
                    style={{ color: '#D4A853' }}
                  >
                    View Treatment →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. BOOK BANNER ── */}
      <section className="relative overflow-hidden" style={{ background: '#0F3D34' }}>
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1B6E5C, transparent 70%)' }}
        />
        <div className="relative max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
          <p
            className="text-xs font-bold uppercase mb-4"
            style={{ color: '#D4A853', letterSpacing: '0.14em' }}
          >
            ✦ Begin Your Journey ✦
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
            Ready to Book?
          </h2>
          <p className="text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
            Experience the restorative traditions of authentic Ayurvedic care. Our practitioners are here to guide you toward everyday balance and lasting wellbeing.
          </p>
          <BookButton
            serviceName={service.name}
            className="inline-flex items-center rounded-full px-8 py-3.5 font-semibold shadow-lg hover:brightness-105 transition"
            style={{ background: '#D4A853', color: '#0F3D34' }}
          >
            Book an Appointment
          </BookButton>
        </div>
      </section>

      {/* ── 10. FOOTER ── */}
      <Footer />
    </>
  )
}
