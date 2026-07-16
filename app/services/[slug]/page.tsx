'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────
interface FAQ { q: string; a: string }
interface TrustStat { num: string; label: string }

interface Service {
  id: string
  name: string
  description: string
  icon: string
  sort_order: number
  duration?: string
  price_from?: string
  benefits?: string[]
  process?: string[]
  ideal_for?: string[]
  faqs?: FAQ[]
  trust_stats?: TrustStat[]
  hero_image?: string
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ServicePage() {
  const params = useParams()
  const slug = params.slug as string

  const [service, setService] = useState<Service | null>(null)
  const [allServices, setAllServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      const all = (data ?? []) as Service[]
      setAllServices(all)
      const found = all.find((s) => toSlug(s.name) === slug)
      setService(found ?? null)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDFBF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #2D5016', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', background: '#FDFBF5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: '#2D5016' }}>Service not found</p>
        <Link href="/#services" style={{ color: '#6B7B4F', fontSize: 14 }}>← Back to services</Link>
      </div>
    )
  }

  const otherServices = allServices.filter((s) => s.id !== service.id).slice(0, 3)
  const benefits = service.benefits ?? []
  const process = service.process ?? []
  const idealFor = service.ideal_for ?? []
  const faqs = service.faqs ?? []
  const trustStats = service.trust_stats ?? []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
        :root{--primary:#2D5016;--primary-dark:#1F3A10;--accent:#C9A84C;--cream:#FDFBF5;--sage:#6B7B4F;--text:#1A1A1A;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Inter',sans-serif;background:#FDFBF5;color:#1A1A1A;-webkit-font-smoothing:antialiased;}
        h1,h2,h3,h4{font-family:'Fraunces',serif;}
        a{text-decoration:none;color:inherit;}
        .fade-in{animation:fadeUp 0.7s ease forwards;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .btn-gold{background:linear-gradient(135deg,#C9A84C,#b3903a);color:#fff;padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(201,168,76,0.35);transition:transform .25s,box-shadow .25s;display:inline-block;}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(201,168,76,0.45);}
        .btn-outline{background:transparent;color:var(--primary);padding:14px 32px;border-radius:100px;font-size:14px;font-weight:600;border:2px solid var(--primary);cursor:pointer;transition:all .25s;display:inline-block;}
        .btn-outline:hover{background:var(--primary);color:#fff;}
        .chip{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(45,80,22,0.10);padding:10px 20px;border-radius:100px;font-size:13.5px;font-weight:600;color:var(--primary-dark);box-shadow:0 2px 8px rgba(45,80,22,0.04);}
        .tag-pill{background:#fff;border:1px solid rgba(45,80,22,0.14);color:var(--primary-dark);padding:12px 22px;border-radius:100px;font-size:14px;font-weight:500;transition:all .25s;}
        .tag-pill:hover{background:var(--primary);color:#fff;border-color:var(--primary);transform:translateY(-2px);}
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(253,251,245,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(45,80,22,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: '#1F3A10' }}>
            AK <span style={{ fontStyle: 'italic', color: '#C9A84C', fontWeight: 400 }}>Ayurveda</span>
          </Link>
          <nav style={{ display: 'flex', gap: 32, fontSize: 14.5, fontWeight: 500 }}>
            <Link href="/#services" style={{ color: '#1F3A10', opacity: 0.75 }}>Services</Link>
            <Link href="/#about" style={{ color: '#1F3A10', opacity: 0.75 }}>About</Link>
            <Link href="/#contact" style={{ color: '#1F3A10', opacity: 0.75 }}>Contact</Link>
          </nav>
          <Link href="/#book-appointment" className="btn-gold" style={{ fontSize: 13, padding: '10px 22px' }}>Book Appointment</Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '64px 0 76px', overflow: 'hidden', background: '#FDFBF5' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 20%, rgba(201,168,76,0.14), transparent 55%), radial-gradient(circle at 82% 10%, rgba(45,80,22,0.09), transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: 28, fontSize: 13, color: '#6B7B4F' }}>
            <Link href="/" style={{ opacity: 0.8 }}>Home</Link>
            <span style={{ margin: '0 8px', opacity: 0.5 }}>›</span>
            <Link href="/#services" style={{ opacity: 0.8 }}>Services</Link>
            <span style={{ margin: '0 8px', opacity: 0.5 }}>›</span>
            <span style={{ color: '#1F3A10', fontWeight: 600 }}>{service.name}</span>
          </div>

          <div className="fade-in" style={{ maxWidth: 760 }}>
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(45,80,22,0.06)', color: '#2D5016', padding: '8px 18px', borderRadius: 100, fontSize: 12.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24 }}>
              <span style={{ color: '#C9A84C' }}>✦</span> Ancient Ayurvedic Treatment
            </div>

            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(38px, 5.4vw, 60px)', lineHeight: 1.08, color: '#1F3A10', marginBottom: 22, fontWeight: 500 }}>
              {service.name}
            </h1>
            <p style={{ fontSize: 18, color: '#3f3f3f', maxWidth: 600, marginBottom: 34, lineHeight: 1.65 }}>
              {service.description}
            </p>

            {/* Meta chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
              {service.duration && (
                <span className="chip">
                  <span style={{ color: '#C9A84C' }}>⏱</span> {service.duration}
                </span>
              )}
              {service.price_from && (
                <span className="chip">
                  <span style={{ color: '#C9A84C' }}>₹</span> From {service.price_from}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/#book-appointment" className="btn-gold">Book This Treatment</Link>
              <Link href="/#contact" className="btn-outline">Ask a Question</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      {trustStats.length > 0 && (
        <div style={{ background: '#1F3A10', padding: '40px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${trustStats.length}, 1fr)`, gap: 24, textAlign: 'center' }}>
              {trustStats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 34, color: '#C9A84C', fontWeight: 500 }}>{s.num}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(253,251,245,0.75)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content + Sidebar ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '76px 32px 100px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 56, alignItems: 'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Benefits */}
          {benefits.length > 0 && (
            <section style={{ marginBottom: 72 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#C9A84C', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 22 }}>
                <span>✦</span><span style={{ color: '#6B7B4F' }}>Benefits</span><span>✦</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 34px)', color: '#1F3A10', marginBottom: 8, fontWeight: 500 }}>
                Why Choose This Treatment
              </h2>
              <p style={{ color: '#4a4a4a', marginBottom: 36, fontSize: 15.5 }}>Evidence-based outcomes from classical Ayurvedic practice.</p>
              <div style={{ background: '#fff', borderRadius: 20, padding: 44, boxShadow: '0 2px 12px rgba(45,80,22,0.04)', border: '1px solid rgba(45,80,22,0.06)' }}>
                {benefits.map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '20px 0', borderBottom: i < benefits.length - 1 ? '1px solid rgba(45,80,22,0.07)' : 'none' }}>
                    <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '50%', background: '#2D5016', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 500 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 16.5, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{b}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Process */}
          {process.length > 0 && (
            <section style={{ marginBottom: 72 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#C9A84C', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 22 }}>
                <span>✦</span><span style={{ color: '#6B7B4F' }}>The Process</span><span>✦</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 34px)', color: '#1F3A10', marginBottom: 8, fontWeight: 500 }}>
                What to Expect
              </h2>
              <p style={{ color: '#4a4a4a', marginBottom: 36, fontSize: 15.5 }}>A step-by-step walkthrough of your treatment journey.</p>
              <div style={{ paddingLeft: 6 }}>
                {process.map((step, i) => (
                  <div key={i} style={{ position: 'relative', paddingLeft: 56, paddingBottom: i < process.length - 1 ? 46 : 0 }}>
                    {i < process.length - 1 && (
                      <div style={{ position: 'absolute', left: 19, top: 40, bottom: 0, width: 2, background: 'linear-gradient(to bottom, rgba(45,80,22,0.18), rgba(45,80,22,0.04))' }} />
                    )}
                    <div style={{ position: 'absolute', left: 0, top: 0, width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '2px solid #2D5016', color: '#2D5016', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15 }}>{i + 1}</div>
                    <div style={{ paddingTop: 8 }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>{step}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ideal For */}
          {idealFor.length > 0 && (
            <section style={{ marginBottom: 72 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#C9A84C', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 22 }}>
                <span>✦</span><span style={{ color: '#6B7B4F' }}>Ideal For</span><span>✦</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 34px)', color: '#1F3A10', marginBottom: 8, fontWeight: 500 }}>
                Who Benefits Most
              </h2>
              <p style={{ color: '#4a4a4a', marginBottom: 36, fontSize: 15.5 }}>This treatment is especially recommended for the following conditions.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {idealFor.map((item, i) => (
                  <span key={i} className="tag-pill">{item}</span>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {faqs.length > 0 && (
            <section style={{ marginBottom: 72 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#C9A84C', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 22 }}>
                <span>✦</span><span style={{ color: '#6B7B4F' }}>FAQ</span><span>✦</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 34px)', color: '#1F3A10', marginBottom: 36, fontWeight: 500 }}>
                Common Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(45,80,22,0.08)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(45,80,22,0.03)' }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#1F3A10', fontFamily: "'Inter', sans-serif" }}>{faq.q}</span>
                      <span style={{ color: '#C9A84C', fontSize: 20, flexShrink: 0, marginLeft: 16, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .25s' }}>+</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: '0 28px 24px', fontSize: 15, color: '#4a4a4a', lineHeight: 1.7 }}>{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other services */}
          {otherServices.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#C9A84C', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 22 }}>
                <span>✦</span><span style={{ color: '#6B7B4F' }}>Explore More</span><span>✦</span>
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 3vw, 34px)', color: '#1F3A10', marginBottom: 36, fontWeight: 500 }}>Other Treatments</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {otherServices.map((s) => (
                  <Link key={s.id} href={`/services/${toSlug(s.name)}`} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', border: '1px solid rgba(45,80,22,0.08)', boxShadow: '0 2px 8px rgba(45,80,22,0.04)', transition: 'transform .25s, box-shadow .25s', display: 'block' }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: '#1F3A10', marginBottom: 8, fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: '#6B7B4F' }}>{s.description?.substring(0, 60)}…</div>
                    <div style={{ marginTop: 16, fontSize: 13, color: '#C9A84C', fontWeight: 600 }}>Learn more →</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <aside style={{ position: 'sticky', top: 90 }}>
          {/* Book card */}
          <div style={{ background: '#1F3A10', borderRadius: 20, padding: '36px 32px', color: '#FDFBF5', marginBottom: 20 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 8, fontWeight: 500 }}>Ready to Begin?</div>
            <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 24, lineHeight: 1.6 }}>Book a consultation and start your healing journey today.</p>
            <Link href="/#book-appointment" className="btn-gold" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Book Appointment</Link>
            <Link href="/#contact" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'rgba(253,251,245,0.65)' }}>Or contact us first →</Link>
          </div>

          {/* Details card */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid rgba(45,80,22,0.08)', boxShadow: '0 2px 12px rgba(45,80,22,0.04)' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: '#1F3A10', marginBottom: 20, fontWeight: 500 }}>Treatment Details</div>
            {service.duration && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(45,80,22,0.07)', fontSize: 14 }}>
                <span style={{ color: '#6B7B4F', fontWeight: 500 }}>Duration</span>
                <span style={{ color: '#1F3A10', fontWeight: 600 }}>{service.duration}</span>
              </div>
            )}
            {service.price_from && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(45,80,22,0.07)', fontSize: 14 }}>
                <span style={{ color: '#6B7B4F', fontWeight: 500 }}>Starting from</span>
                <span style={{ color: '#1F3A10', fontWeight: 600 }}>{service.price_from}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', fontSize: 14 }}>
              <span style={{ color: '#6B7B4F', fontWeight: 500 }}>Available</span>
              <span style={{ color: '#2D5016', fontWeight: 600 }}>✓ By appointment</span>
            </div>
          </div>

          {/* Guarantee */}
          <div style={{ background: 'rgba(201,168,76,0.08)', borderRadius: 16, padding: '24px', marginTop: 20, border: '1px solid rgba(201,168,76,0.2)' }}>
            <div style={{ color: '#C9A84C', fontSize: 20, marginBottom: 8 }}>✦</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: '#1F3A10', marginBottom: 8, fontWeight: 500 }}>Classical Protocols</div>
            <p style={{ fontSize: 13, color: '#6B7B4F', lineHeight: 1.6 }}>All treatments follow authentic Ayurvedic classical texts — not modern adaptations.</p>
          </div>
        </aside>
      </div>

      {/* ── CTA Banner ── */}
      <section style={{ background: 'linear-gradient(135deg, #2D5016, #1F3A10)', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ color: '#C9A84C', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 20 }}>✦ Begin Your Journey ✦</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#FDFBF5', marginBottom: 16, fontWeight: 400 }}>
            Experience the Power of <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>{service.name}</em>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(253,251,245,0.75)', marginBottom: 36, lineHeight: 1.7 }}>
            Book your consultation today and take the first step towards holistic healing.
          </p>
          <Link href="/#book-appointment" className="btn-gold" style={{ fontSize: 15, padding: '16px 40px' }}>Book Your Appointment</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#111', padding: '28px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>© {new Date().getFullYear()} AK Ayurveda. All rights reserved.</p>
      </footer>
    </>
  )
}
