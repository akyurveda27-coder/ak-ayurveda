'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
  benefit_descriptions?: string[]
  process?: string[]
  process_days?: string[]
  process_descriptions?: string[]
  ideal_for?: string[]
  faqs?: FAQ[]
  trust_stats?: TrustStat[]
  location?: string
  phone?: string
  testimonial_quote?: string
  testimonial_name?: string
  testimonial_location?: string
  testimonial_stars?: number
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
:root{--primary:#2D5016;--primary-dark:#1F3A10;--accent:#C9A84C;--cream:#FDFBF5;--sage:#6B7B4F;--text:#1A1A1A;--card-radius:20px;--pill-radius:100px;--shadow:0 2px 12px rgba(45,80,22,0.04);--shadow-lift:0 12px 32px rgba(45,80,22,0.10);}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#FDFBF5;color:#1A1A1A;-webkit-font-smoothing:antialiased;}
h1,h2,h3,h4{font-family:'Fraunces',serif;font-weight:500;letter-spacing:-0.01em;color:#1F3A10;}
a{text-decoration:none;color:inherit;}
.italic-gold{font-style:italic;color:#C9A84C;font-weight:400;}
.btn-gold{background:linear-gradient(135deg,#C9A84C,#b3903a);color:#fff;padding:13px 28px;border-radius:100px;font-size:14px;font-weight:600;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(201,168,76,0.35);transition:transform .25s,box-shadow .25s;display:inline-block;text-align:center;}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(201,168,76,0.45);}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px;}
.ornament{display:flex;align-items:center;gap:14px;color:#C9A84C;font-size:13px;letter-spacing:0.22em;text-transform:uppercase;font-weight:600;margin-bottom:22px;}
.ornament::before,.ornament::after{content:"✦";font-size:11px;opacity:0.6;}
.fade-up{animation:fadeInUp 0.8s cubic-bezier(.22,.9,.32,1) forwards;}
@keyframes fadeInUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.d1{animation-delay:.05s;}.d2{animation-delay:.15s;}.d3{animation-delay:.25s;}.d4{animation-delay:.35s;}
/* navbar */
header.navbar{position:sticky;top:0;z-index:100;background:rgba(253,251,245,0.88);backdrop-filter:blur(10px);border-bottom:1px solid rgba(45,80,22,0.08);}
.nav-inner{max-width:1200px;margin:0 auto;padding:18px 32px;display:flex;align-items:center;justify-content:space-between;}
.logo{font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:#1F3A10;display:flex;align-items:baseline;gap:6px;}
.logo .mark{color:#C9A84C;font-style:italic;font-weight:400;}
.nav-links{display:flex;gap:34px;font-size:14.5px;font-weight:500;}
.nav-links a{color:#1F3A10;opacity:0.75;transition:opacity .2s;}
.nav-links a:hover{opacity:1;}
/* breadcrumb */
.breadcrumb{padding:18px 0 0;font-size:13px;color:#6B7B4F;letter-spacing:0.02em;}
.breadcrumb a{opacity:0.8;transition:opacity .2s;}
.breadcrumb .sep{margin:0 8px;opacity:0.5;}
.breadcrumb .current{color:#1F3A10;font-weight:600;}
/* hero */
.hero{position:relative;padding:64px 0 76px;overflow:hidden;}
.hero::before{content:"";position:absolute;inset:-20% -10% auto -10%;height:640px;background:radial-gradient(circle at 18% 20%,rgba(201,168,76,0.16),transparent 55%),radial-gradient(circle at 82% 10%,rgba(45,80,22,0.10),transparent 50%);z-index:0;pointer-events:none;}
.hero-inner{position:relative;z-index:1;max-width:760px;}
.eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(45,80,22,0.06);color:#2D5016;padding:8px 18px;border-radius:100px;font-size:12.5px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:26px;}
.eyebrow::before{content:"✦";color:#C9A84C;}
.hero h1{font-size:clamp(38px,5.4vw,60px);line-height:1.08;margin-bottom:22px;}
.hero p.lead{font-size:18px;color:#3f3f3f;max-width:600px;margin-bottom:34px;line-height:1.65;}
.meta-chips{display:flex;flex-wrap:wrap;gap:12px;}
.chip{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(45,80,22,0.10);padding:10px 20px;border-radius:100px;font-size:13.5px;font-weight:600;color:#1F3A10;box-shadow:0 2px 8px rgba(45,80,22,0.04);}
.chip .ic{color:#C9A84C;font-size:14px;}
/* trust */
.trust-strip{background:#1F3A10;padding:40px 0;}
.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center;}
.trust-grid .num{font-family:'Fraunces',serif;font-size:34px;color:#C9A84C;font-weight:500;}
.trust-grid .label{font-size:12.5px;color:rgba(253,251,245,0.75);letter-spacing:0.06em;text-transform:uppercase;margin-top:4px;}
.trust-grid .divider{width:1px;background:rgba(253,251,245,0.14);}
/* layout */
.content-layout{display:grid;grid-template-columns:1fr 360px;gap:56px;padding:76px 0 100px;align-items:start;}
section.block{margin-bottom:72px;}
section.block:last-child{margin-bottom:0;}
.block h2{font-size:clamp(26px,3vw,34px);margin-bottom:16px;}
.block>.intro{color:#4a4a4a;max-width:600px;margin-bottom:36px;font-size:15.5px;}
/* benefits */
.benefits-card{background:#fff;border-radius:20px;padding:44px;box-shadow:0 2px 12px rgba(45,80,22,0.04);border:1px solid rgba(45,80,22,0.06);}
.benefit-row{display:flex;gap:20px;align-items:flex-start;padding:20px 0;border-bottom:1px solid rgba(45,80,22,0.07);}
.benefit-row:first-child{padding-top:0;}
.benefit-row:last-child{border-bottom:none;padding-bottom:0;}
.num-circle{flex:none;width:38px;height:38px;border-radius:50%;background:#2D5016;color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:15px;font-weight:500;}
.benefit-text h4{font-size:16.5px;margin-bottom:5px;color:#1A1A1A;font-weight:600;font-family:'Inter',sans-serif;}
.benefit-text p{font-size:14.5px;color:#5a5a5a;line-height:1.6;}
/* timeline */
.timeline{position:relative;padding-left:6px;}
.tl-step{position:relative;padding-left:56px;padding-bottom:46px;}
.tl-step:last-child{padding-bottom:0;}
.tl-step::before{content:"";position:absolute;left:19px;top:40px;bottom:0;width:2px;background:linear-gradient(to bottom,rgba(45,80,22,0.18),rgba(45,80,22,0.05));}
.tl-step:last-child::before{display:none;}
.tl-dot{position:absolute;left:0;top:0;width:40px;height:40px;border-radius:50%;background:#fff;border:2px solid #2D5016;color:#2D5016;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:600;font-size:15px;}
.tl-content h4{font-size:17px;font-family:'Inter',sans-serif;font-weight:600;color:#1A1A1A;margin-bottom:6px;}
.tl-duration{display:inline-block;font-size:12px;color:#6B7B4F;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:8px;}
.tl-content p{font-size:14.5px;color:#5a5a5a;max-width:520px;line-height:1.6;}
/* pills */
.pill-cloud{display:flex;flex-wrap:wrap;gap:12px;}
.tag-pill{background:#fff;border:1px solid rgba(45,80,22,0.14);color:#1F3A10;padding:12px 22px;border-radius:100px;font-size:14px;font-weight:500;transition:all .25s;cursor:default;}
.tag-pill:hover{background:#2D5016;color:#fff;border-color:#2D5016;transform:translateY(-2px);}
/* testimonial */
.testimonial-card{background:#fff;border-left:4px solid #C9A84C;border-radius:20px;padding:40px 44px;box-shadow:0 2px 12px rgba(45,80,22,0.04);}
.testimonial-card .quote{font-family:'Fraunces',serif;font-style:italic;font-size:19px;line-height:1.55;color:#1A1A1A;margin-bottom:22px;}
.testimonial-footer{display:flex;align-items:center;justify-content:space-between;}
.patient{font-size:14px;font-weight:600;color:#1F3A10;}
.patient span{display:block;font-weight:400;color:#6B7B4F;font-size:12.5px;margin-top:2px;}
.stars{color:#C9A84C;letter-spacing:2px;font-size:14px;}
/* faq */
.faq-item{background:#fff;border-radius:16px;border:1px solid rgba(45,80,22,0.08);overflow:hidden;box-shadow:0 2px 8px rgba(45,80,22,0.03);margin-bottom:10px;}
.faq-q{width:100%;padding:20px 28px;display:flex;justify-content:space-between;align-items:center;background:none;border:none;cursor:pointer;text-align:left;font-size:16px;font-weight:600;color:#1F3A10;font-family:'Inter',sans-serif;}
.faq-a{padding:0 28px 22px;font-size:15px;color:#4a4a4a;line-height:1.7;}
/* sidebar */
.sidebar{position:sticky;top:96px;display:flex;flex-direction:column;gap:24px;}
.cta-card{background:linear-gradient(160deg,#2D5016 0%,#1F3A10 100%);border-radius:20px;padding:36px 32px;color:#fff;box-shadow:0 12px 32px rgba(45,80,22,0.10);position:relative;overflow:hidden;}
.cta-card::before{content:"";position:absolute;top:-40px;right:-40px;width:150px;height:150px;border-radius:50%;background:rgba(201,168,76,0.12);}
.cta-icon{width:52px;height:52px;border-radius:14px;background:rgba(253,251,245,0.12);display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px;position:relative;z-index:1;}
.cta-card h3{color:#fff;font-size:23px;margin-bottom:6px;position:relative;z-index:1;}
.cta-sub{color:rgba(253,251,245,0.72);font-size:14px;margin-bottom:26px;position:relative;z-index:1;line-height:1.6;}
.cta-card .btn-gold{width:100%;position:relative;z-index:1;}
.cta-divider{height:1px;background:rgba(253,251,245,0.16);margin:26px 0 20px;position:relative;z-index:1;}
.detail-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;font-size:13.5px;position:relative;z-index:1;}
.detail-row .k{color:rgba(253,251,245,0.6);display:flex;align-items:center;gap:8px;}
.detail-row .v{font-weight:600;color:#fff;}
.related-card{background:#fff;border-radius:20px;padding:30px;box-shadow:0 2px 12px rgba(45,80,22,0.04);border:1px solid rgba(45,80,22,0.06);}
.related-card .r-title{font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#6B7B4F;font-family:'Inter',sans-serif;font-weight:600;margin-bottom:20px;}
.related-item{display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid rgba(45,80,22,0.07);transition:transform .2s;}
.related-item:hover{transform:translateX(3px);}
.related-item:last-child{border-bottom:none;padding-bottom:0;}
.related-item:first-child{padding-top:0;}
.related-ic{flex:none;width:38px;height:38px;border-radius:10px;background:rgba(45,80,22,0.07);display:flex;align-items:center;justify-content:center;font-size:17px;}
.related-name{font-size:14.5px;font-weight:600;color:#1F3A10;margin-bottom:2px;}
.related-desc{font-size:12.5px;color:#7a7a7a;}
/* footer */
footer.site-footer{background:#1F3A10;color:rgba(253,251,245,0.85);padding:56px 0 32px;}
.footer-inner{display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px;}
.footer-logo{font-family:'Fraunces',serif;font-size:24px;color:#fff;font-weight:600;}
.footer-tag{font-size:13.5px;color:rgba(253,251,245,0.55);max-width:400px;}
.footer-links{display:flex;gap:30px;font-size:13.5px;font-weight:500;}
.footer-links a{opacity:0.75;transition:opacity .2s;}
.footer-links a:hover{opacity:1;}
.footer-rule{width:100%;max-width:1136px;height:1px;background:rgba(253,251,245,0.1);}
.footer-copy{font-size:12px;color:rgba(253,251,245,0.4);}
/* responsive */
@media(max-width:960px){.content-layout{grid-template-columns:1fr;}.sidebar{position:static;}.trust-grid{grid-template-columns:repeat(2,1fr);}.trust-grid .divider{display:none;}.nav-links{display:none;}}
@media(max-width:600px){.wrap{padding:0 20px;}.hero{padding:44px 0 56px;}.benefits-card,.testimonial-card{padding:28px 22px;}}
`

export default function ServicePage() {
  const params = useParams()
  const slug = params.slug as string
  const [service, setService] = useState<Service | null>(null)
  const [allServices, setAllServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [reviewForm, setReviewForm] = useState({ name: '', location: '', quote: '', stars: 5 })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)
  const [approvedReviews, setApprovedReviews] = useState<{id:string;name:string;location?:string;quote:string;stars:number}[]>([])

  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      const all = (data ?? []) as Service[]
      setAllServices(all)
      const found = all.find((s) => toSlug(s.name) === slug) ?? null
      setService(found)
      setLoading(false)
      if (found) {
        supabase.from('reviews').select('id,name,location,quote,stars')
          .eq('service_name', found.name).eq('status', 'approved')
          .order('created_at', { ascending: false })
          .then(({ data: rd }) => setApprovedReviews(rd ?? []))
      }
    })
  }, [slug])

  const submitReview = async () => {
    if (!reviewForm.name || !reviewForm.quote || !service) return
    setReviewSubmitting(true)
    await supabase.from('reviews').insert({
      service_name: service.name,
      name: reviewForm.name,
      location: reviewForm.location || null,
      quote: reviewForm.quote,
      stars: reviewForm.stars,
      status: 'pending',
    })
    setReviewSubmitting(false)
    setReviewDone(true)
    setReviewForm({ name: '', location: '', quote: '', stars: 5 })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: '3px solid #2D5016', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!service) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <style>{CSS}</style>
      <p style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: '#2D5016' }}>Service not found</p>
      <Link href="/#services" style={{ color: '#6B7B4F', fontSize: 14 }}>← Back to services</Link>
    </div>
  )

  const related = allServices.filter((s) => s.id !== service.id).slice(0, 3)
  const benefits = service.benefits ?? []
  const benefitDescs = service.benefit_descriptions ?? []
  const steps = service.process ?? []
  const stepDays = service.process_days ?? []
  const stepDescs = service.process_descriptions ?? []
  const idealFor = service.ideal_for ?? []
  const faqs = service.faqs ?? []
  const trustStats = service.trust_stats ?? []
  const stars = service.testimonial_stars ?? 5

  return (
    <>
      <style>{CSS}</style>

      {/* Navbar */}
      <header className="navbar">
        <div className="nav-inner">
          <Link href="/" className="logo">AK <span className="mark">Ayurveda</span></Link>
          <nav className="nav-links">
            <Link href="/#services">Treatments</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
          <Link href="/#book-appointment" className="btn-gold" style={{ fontSize: 13, padding: '10px 22px' }}>Book Appointment</Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="wrap breadcrumb">
        <Link href="/">Home</Link><span className="sep">/</span>
        <Link href="/#services">Treatments</Link><span className="sep">/</span>
        <span className="current">{service.name}</span>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="wrap hero-inner">
          <div className="eyebrow fade-up d1">Ayurvedic Treatment</div>
          <h1 className="fade-up d2">{service.name} — <span className="italic-gold">ancient healing, modern care</span></h1>
          <p className="lead fade-up d3">{service.description}</p>
          <div className="meta-chips fade-up d4">
            {service.duration && <div className="chip"><span className="ic">◷</span> {service.duration}</div>}
            {service.price_from && <div className="chip"><span className="ic">₹</span> From {service.price_from}</div>}
            {service.location && <div className="chip"><span className="ic">◎</span> {service.location}</div>}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      {trustStats.length > 0 && (
        <div className="trust-strip">
          <div className="wrap trust-grid" style={{ gridTemplateColumns: `repeat(${Math.min(trustStats.length * 2 - 1, 7)}, auto)` }}>
            {trustStats.map((s, i) => (
              <>
                <div key={`s${i}`}>
                  <div className="num">{s.num}</div>
                  <div className="label">{s.label}</div>
                </div>
                {i < trustStats.length - 1 && <div key={`d${i}`} className="divider" />}
              </>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="wrap content-layout">
        <main>

          {/* Benefits */}
          {benefits.length > 0 && (
            <section className="block">
              <div className="ornament">Why {service.name}</div>
              <h2>Benefits you&apos;ll feel</h2>
              <p className="intro">Every treatment at AK Ayurveda is tailored to your prakriti and current imbalance.</p>
              <div className="benefits-card">
                {benefits.map((b, i) => (
                  <div key={i} className="benefit-row">
                    <div className="num-circle">{i + 1}</div>
                    <div className="benefit-text">
                      <h4>{b}</h4>
                      {benefitDescs[i] && <p>{benefitDescs[i]}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Process Timeline */}
          {steps.length > 0 && (
            <section className="block">
              <div className="ornament">The Journey</div>
              <h2>How your programme unfolds</h2>
              <p className="intro">A step-by-step walkthrough of your treatment, under continuous supervision of your assigned vaidya.</p>
              <div className="timeline">
                {steps.map((step, i) => (
                  <div key={i} className="tl-step">
                    <div className="tl-dot">{i + 1}</div>
                    <div className="tl-content">
                      {stepDays[i] && <span className="tl-duration">{stepDays[i]}</span>}
                      <h4>{step}</h4>
                      {stepDescs[i] && <p>{stepDescs[i]}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ideal For */}
          {idealFor.length > 0 && (
            <section className="block">
              <div className="ornament">Suited For</div>
              <h2>Ideal for those experiencing</h2>
              <div className="pill-cloud">
                {idealFor.map((item, i) => <span key={i} className="tag-pill">{item}</span>)}
              </div>
            </section>
          )}

          {/* Testimonials — array (new) + legacy single */}
          {(() => {
            const arr = (service.testimonials ?? []) as {quote:string;name:string;location?:string;stars:number}[]
            const legacyQuote = service.testimonial_quote
            const hasAny = arr.length > 0 || !!legacyQuote
            if (!hasAny) return null
            const items = arr.length > 0 ? arr : [{
              quote: legacyQuote!,
              name: service.testimonial_name ?? '',
              location: service.testimonial_location,
              stars: service.testimonial_stars ?? 5,
            }]
            return (
              <section className="block">
                <div className="ornament">Patient Stories</div>
                <h2>In their words</h2>
                <div style={{display:'flex',flexDirection:'column',gap:20,marginTop:28}}>
                  {items.map((t, i) => (
                    <div key={i} className="testimonial-card">
                      <p className="quote">{t.quote}</p>
                      <div className="testimonial-footer">
                        <div className="patient">
                          {t.name}
                          {t.location && <span>{t.location}</span>}
                        </div>
                        <div className="stars">{'★'.repeat(t.stars ?? 5)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })()}

          {/* FAQs */}
          {faqs.length > 0 && (
            <section className="block">
              <div className="ornament">FAQ</div>
              <h2>Common Questions</h2>
              <div style={{ marginTop: 28 }}>
                {faqs.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      {faq.q}
                      <span style={{ color: '#C9A84C', fontSize: 22, marginLeft: 16, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform .25s', display: 'inline-block' }}>+</span>
                    </button>
                    {openFaq === i && <div className="faq-a">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Approved customer reviews */}
          {approvedReviews.length > 0 && (
            <section className="block">
              <div className="ornament">What Our Patients Say</div>
              <h2>Patient Reviews</h2>
              <div style={{display:'flex',flexDirection:'column',gap:16,marginTop:28}}>
                {approvedReviews.map(r => (
                  <div key={r.id} className="testimonial-card">
                    <p className="quote">{r.quote}</p>
                    <div className="testimonial-footer">
                      <div className="patient">{r.name}{r.location && <span>{r.location}</span>}</div>
                      <div className="stars">{'★'.repeat(r.stars)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Leave a Review */}
          <section className="block">
            <div className="ornament">Share Your Experience</div>
            <h2>Leave a Review</h2>
            <p className="intro" style={{marginBottom: 28}}>Had a treatment with us? We&apos;d love to hear your experience.</p>
            {reviewDone ? (
              <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:16,padding:'28px 32px',textAlign:'center'}}>
                <div style={{fontSize:32,marginBottom:12}}>🙏</div>
                <p style={{fontFamily:"'Fraunces',serif",fontSize:20,color:'#1F3A10',marginBottom:8}}>Thank you for your review!</p>
                <p style={{fontSize:14,color:'#6B7B4F'}}>Your review is pending approval and will appear on this page shortly.</p>
                <button onClick={() => setReviewDone(false)} style={{marginTop:16,fontSize:13,color:'#2D5016',cursor:'pointer',background:'none',border:'none',textDecoration:'underline'}}>Write another review</button>
              </div>
            ) : (
              <div style={{background:'#fff',borderRadius:20,padding:'36px 40px',boxShadow:'0 2px 12px rgba(45,80,22,0.04)',border:'1px solid rgba(45,80,22,0.06)'}}>
                {/* Stars */}
                <div style={{marginBottom:20}}>
                  <label style={{fontSize:12,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#6B7B4F',display:'block',marginBottom:10}}>Your Rating</label>
                  <div style={{display:'flex',gap:8}}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setReviewForm(p => ({...p, stars: n}))}
                        style={{fontSize:28,color: n <= reviewForm.stars ? '#C9A84C' : '#e5e7eb',background:'none',border:'none',cursor:'pointer',transition:'color .15s'}}>★</button>
                    ))}
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#6B7B4F',display:'block',marginBottom:6}}>Your Name *</label>
                    <input value={reviewForm.name} onChange={e => setReviewForm(p => ({...p, name: e.target.value}))}
                      placeholder="Meera Kapoor"
                      style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1px solid rgba(45,80,22,0.15)',fontSize:14,outline:'none',fontFamily:'Inter,sans-serif'}} />
                  </div>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#6B7B4F',display:'block',marginBottom:6}}>City / Location</label>
                    <input value={reviewForm.location} onChange={e => setReviewForm(p => ({...p, location: e.target.value}))}
                      placeholder="Delhi"
                      style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1px solid rgba(45,80,22,0.15)',fontSize:14,outline:'none',fontFamily:'Inter,sans-serif'}} />
                  </div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{fontSize:12,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#6B7B4F',display:'block',marginBottom:6}}>Your Experience *</label>
                  <textarea value={reviewForm.quote} onChange={e => setReviewForm(p => ({...p, quote: e.target.value}))}
                    rows={4} placeholder="Share how the treatment helped you..."
                    style={{width:'100%',padding:'12px 14px',borderRadius:10,border:'1px solid rgba(45,80,22,0.15)',fontSize:14,outline:'none',fontFamily:'Inter,sans-serif',resize:'none'}} />
                </div>
                <button onClick={submitReview} disabled={reviewSubmitting || !reviewForm.name || !reviewForm.quote}
                  className="btn-gold" style={{opacity: (!reviewForm.name || !reviewForm.quote) ? 0.5 : 1}}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <p style={{fontSize:12,color:'#9ca3af',marginTop:12}}>Reviews are moderated and appear after approval.</p>
              </div>
            )}
          </section>

        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* CTA Card */}
          <div className="cta-card">
            <div className="cta-icon">{service.icon}</div>
            <h3>{service.name}</h3>
            <p className="cta-sub">Reserve your consultation and begin your personalised programme.</p>
            <Link href="/#book-appointment" className="btn-gold">Book Appointment</Link>
            <div className="cta-divider" />
            {service.duration && (
              <div className="detail-row">
                <span className="k">◷ Duration</span>
                <span className="v">{service.duration}</span>
              </div>
            )}
            {service.price_from && (
              <div className="detail-row">
                <span className="k">₹ Starting At</span>
                <span className="v">{service.price_from}</span>
              </div>
            )}
            {service.location && (
              <div className="detail-row">
                <span className="k">◎ Location</span>
                <span className="v">{service.location}</span>
              </div>
            )}
            {service.phone && (
              <div className="detail-row">
                <span className="k">☏ Phone</span>
                <span className="v">{service.phone}</span>
              </div>
            )}
          </div>

          {/* Related Treatments */}
          {related.length > 0 && (
            <div className="related-card">
              <div className="r-title">Related Treatments</div>
              {related.map((s) => (
                <div key={s.id} className="related-item">
                  <Link href={`/services/${toSlug(s.name)}`} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', width: '100%' }}>
                    <div className="related-ic">{s.icon}</div>
                    <div>
                      <div className="related-name">{s.name}</div>
                      <div className="related-desc">{s.description?.substring(0, 55)}…</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div className="footer-logo">AK <span className="mark">Ayurveda</span></div>
          <p className="footer-tag">Traditional healing, precisely practised — rooted in classical Ayurvedic texts, guided by modern care.</p>
          <div className="footer-links">
            <Link href="/#services">Treatments</Link>
            <Link href="/#about">About</Link>
            <Link href="/#contact">Contact</Link>
          </div>
          <div className="footer-rule" />
          <div className="footer-copy">© {new Date().getFullYear()} AK Ayurveda. All rights reserved.</div>
        </div>
      </footer>
    </>
  )
}
