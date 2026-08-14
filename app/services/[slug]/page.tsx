'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
  hero_image?: string
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
  testimonials?: { quote: string; name: string; location?: string; stars: number }[]
  pricing?: { d: string; p: string }[]
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
:root{
  --primary:#2D5016;--primary-dark:#1F3A10;--accent:#C9A84C;
  --cream:#FDFBF5;--sage:#6B7B4F;--text:#1A1A1A;
  --card-radius:20px;--shadow:0 2px 12px rgba(45,80,22,0.06);
  --shadow-lift:0 12px 32px rgba(45,80,22,0.12);
}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#FDFBF5;color:#1A1A1A;-webkit-font-smoothing:antialiased;}
h1,h2,h3,h4{font-family:'Fraunces',serif;font-weight:500;letter-spacing:-0.01em;color:#1F3A10;}
a{text-decoration:none;color:inherit;}
.italic-gold{font-style:italic;color:#C9A84C;font-weight:400;}
.btn-gold{background:linear-gradient(135deg,#C9A84C,#b3903a);color:#fff;padding:13px 28px;border-radius:100px;font-size:14px;font-weight:600;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(201,168,76,0.35);transition:transform .25s,box-shadow .25s;display:inline-block;text-align:center;}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(201,168,76,0.45);}
.btn-outline{background:transparent;color:#2D5016;padding:13px 28px;border-radius:100px;font-size:14px;font-weight:600;border:2px solid #2D5016;cursor:pointer;transition:all .25s;display:inline-block;text-align:center;}
.btn-outline:hover{background:#2D5016;color:#fff;}
.wrap{max-width:1200px;margin:0 auto;padding:0 32px;}
.ornament{display:flex;align-items:center;gap:14px;color:#C9A84C;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;margin-bottom:18px;}
.ornament::before,.ornament::after{content:"✦";font-size:10px;opacity:0.7;}
.fade-up{animation:fadeInUp 0.7s cubic-bezier(.22,.9,.32,1) forwards;}
@keyframes fadeInUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.d1{animation-delay:.05s;}.d2{animation-delay:.12s;}.d3{animation-delay:.22s;}.d4{animation-delay:.32s;}.d5{animation-delay:.42s;}

/* ── BREADCRUMB ── */
.breadcrumb{padding:18px 0 0;font-size:13px;color:#6B7B4F;}
.breadcrumb a{opacity:0.8;transition:opacity .2s;}
.breadcrumb a:hover{opacity:1;color:#2D5016;}
.breadcrumb .sep{margin:0 8px;opacity:0.4;}
.breadcrumb .current{color:#1F3A10;font-weight:600;}

/* ── HERO ── */
.hero{position:relative;padding:60px 0 72px;overflow:hidden;}
.hero::before{content:"";position:absolute;inset:-10% -10% auto -10%;height:600px;background:radial-gradient(circle at 15% 20%,rgba(201,168,76,0.14),transparent 55%),radial-gradient(circle at 85% 10%,rgba(45,80,22,0.09),transparent 50%);z-index:0;pointer-events:none;}
.hero-split{position:relative;z-index:1;display:grid;grid-template-columns:1fr 440px;gap:64px;align-items:center;}
.hero-text{}
.eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(45,80,22,0.07);color:#2D5016;padding:7px 16px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:24px;}
.eyebrow::before{content:"✦";color:#C9A84C;}
.hero h1{font-size:clamp(34px,4.5vw,54px);line-height:1.1;margin-bottom:20px;}
.hero p.lead{font-size:17px;color:#3f3f3f;max-width:560px;margin-bottom:30px;line-height:1.7;}
.hero-actions{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:32px;}
.meta-chips{display:flex;flex-wrap:wrap;gap:10px;}
.chip{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid rgba(45,80,22,0.10);padding:9px 18px;border-radius:100px;font-size:13px;font-weight:600;color:#1F3A10;box-shadow:0 2px 6px rgba(45,80,22,0.04);}
.chip .ic{color:#C9A84C;font-size:13px;}
.hero-image-wrap{border-radius:24px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 20px 60px rgba(45,80,22,0.16);}
.hero-image-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease;}
.hero-image-wrap:hover img{transform:scale(1.04);}

/* ── QUICK INFO BAR ── */
.info-bar{background:#1F3A10;padding:24px 0;}
.info-bar-inner{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:center;}
.info-chip{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);color:#fff;padding:10px 22px;border-radius:100px;font-size:13.5px;font-weight:600;border:1px solid rgba(255,255,255,0.15);}
.info-chip .ic{color:#C9A84C;}
.info-sep{width:1px;height:28px;background:rgba(255,255,255,0.15);}

/* ── SECTION LAYOUT ── */
.content-layout{display:grid;grid-template-columns:1fr 340px;gap:56px;padding:76px 0 40px;align-items:start;}
section.block{margin-bottom:68px;}
section.block:last-child{margin-bottom:0;}
.block h2{font-size:clamp(24px,2.8vw,32px);margin-bottom:14px;}
.block>.intro{color:#4a4a4a;max-width:580px;margin-bottom:32px;font-size:15px;line-height:1.7;}

/* ── BENEFITS ── */
.benefits-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.benefit-card{background:#fff;border-radius:16px;padding:24px;box-shadow:var(--shadow);border:1px solid rgba(45,80,22,0.06);display:flex;gap:16px;align-items:flex-start;transition:box-shadow .25s,transform .25s;}
.benefit-card:hover{box-shadow:var(--shadow-lift);transform:translateY(-2px);}
.benefit-check{flex:none;width:34px;height:34px;border-radius:50%;background:rgba(45,80,22,0.08);display:flex;align-items:center;justify-content:center;}
.benefit-check svg{width:16px;height:16px;color:#2D5016;stroke:#2D5016;}
.benefit-text h4{font-size:15px;font-family:'Inter',sans-serif;font-weight:700;color:#1A1A1A;margin-bottom:5px;}
.benefit-text p{font-size:13.5px;color:#5a5a5a;line-height:1.6;}

/* ── TIMELINE ── */
.timeline{position:relative;padding-left:4px;}
.tl-step{position:relative;padding-left:56px;padding-bottom:44px;}
.tl-step:last-child{padding-bottom:0;}
.tl-step::before{content:"";position:absolute;left:19px;top:42px;bottom:0;width:2px;background:linear-gradient(to bottom,rgba(45,80,22,0.18),rgba(45,80,22,0.03));}
.tl-step:last-child::before{display:none;}
.tl-dot{position:absolute;left:0;top:0;width:40px;height:40px;border-radius:50%;background:#fff;border:2px solid #2D5016;color:#2D5016;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:600;font-size:15px;}
.tl-content h4{font-size:16px;font-family:'Inter',sans-serif;font-weight:700;color:#1A1A1A;margin-bottom:4px;}
.tl-duration{display:inline-block;font-size:11px;color:#6B7B4F;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:7px;background:rgba(107,123,79,0.1);padding:3px 10px;border-radius:100px;}
.tl-content p{font-size:14px;color:#5a5a5a;max-width:520px;line-height:1.65;}

/* ── IDEAL FOR ── */
.pill-cloud{display:flex;flex-wrap:wrap;gap:10px;}
.tag-pill{background:#fff;border:1px solid rgba(45,80,22,0.15);color:#1F3A10;padding:10px 20px;border-radius:100px;font-size:14px;font-weight:500;transition:all .25s;cursor:default;display:flex;align-items:center;gap:8px;}
.tag-pill::before{content:"✓";color:#C9A84C;font-weight:700;font-size:12px;}
.tag-pill:hover{background:#2D5016;color:#fff;border-color:#2D5016;}
.tag-pill:hover::before{color:#C9A84C;}

/* ── FAQs ── */
.faq-item{background:#fff;border-radius:14px;border:1px solid rgba(45,80,22,0.08);overflow:hidden;margin-bottom:10px;transition:box-shadow .2s;}
.faq-item.open{box-shadow:var(--shadow-lift);}
.faq-q{width:100%;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;background:none;border:none;cursor:pointer;text-align:left;font-size:15.5px;font-weight:600;color:#1F3A10;font-family:'Inter',sans-serif;gap:16px;}
.faq-icon{flex:none;width:28px;height:28px;border-radius:50%;background:rgba(201,168,76,0.12);display:flex;align-items:center;justify-content:center;color:#C9A84C;font-size:18px;font-weight:400;transition:transform .25s;}
.faq-a{padding:0 24px 18px;font-size:14.5px;color:#4a4a4a;line-height:1.7;border-top:1px solid rgba(45,80,22,0.06);padding-top:14px;}

/* ── TESTIMONIALS ── */
.testimonial-card{background:#fff;border-left:4px solid #C9A84C;border-radius:20px;padding:36px 40px;box-shadow:var(--shadow);}
.testimonial-card .quote{font-family:'Fraunces',serif;font-style:italic;font-size:18px;line-height:1.6;color:#1A1A1A;margin-bottom:20px;}
.testimonial-footer{display:flex;align-items:center;justify-content:space-between;}
.patient{font-size:14px;font-weight:600;color:#1F3A10;}
.patient span{display:block;font-weight:400;color:#6B7B4F;font-size:12px;margin-top:2px;}
.stars{color:#C9A84C;letter-spacing:2px;font-size:14px;}

/* ── SIDEBAR ── */
.sidebar{position:sticky;top:96px;display:flex;flex-direction:column;gap:20px;}
.cta-card{background:linear-gradient(160deg,#2D5016 0%,#1F3A10 100%);border-radius:20px;padding:32px 28px;color:#fff;box-shadow:0 12px 32px rgba(45,80,22,0.14);position:relative;overflow:hidden;}
.cta-card::before{content:"";position:absolute;top:-40px;right:-40px;width:150px;height:150px;border-radius:50%;background:rgba(201,168,76,0.10);}
.cta-icon{width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:18px;position:relative;z-index:1;}
.cta-card h3{color:#fff;font-size:21px;margin-bottom:5px;position:relative;z-index:1;line-height:1.2;}
.cta-sub{color:rgba(253,251,245,0.70);font-size:13.5px;margin-bottom:22px;position:relative;z-index:1;line-height:1.6;}
.cta-card .btn-gold{width:100%;position:relative;z-index:1;}
.cta-divider{height:1px;background:rgba(255,255,255,0.14);margin:20px 0 16px;position:relative;z-index:1;}
.detail-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;font-size:13px;position:relative;z-index:1;}
.detail-row .k{color:rgba(255,255,255,0.55);display:flex;align-items:center;gap:7px;}
.detail-row .v{font-weight:600;color:#fff;}

/* ── RELATED TREATMENTS (sidebar) ── */
.related-card{background:#fff;border-radius:18px;padding:26px;box-shadow:var(--shadow);border:1px solid rgba(45,80,22,0.06);}
.related-title{font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#6B7B4F;font-weight:700;margin-bottom:16px;}
.related-item{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid rgba(45,80,22,0.07);transition:transform .2s;}
.related-item:hover{transform:translateX(3px);}
.related-item:last-child{border-bottom:none;padding-bottom:0;}
.related-item:first-child{padding-top:0;}
.related-ic{flex:none;width:36px;height:36px;border-radius:10px;background:rgba(45,80,22,0.07);display:flex;align-items:center;justify-content:center;font-size:16px;}
.related-name{font-size:13.5px;font-weight:600;color:#1F3A10;margin-bottom:2px;}
.related-desc{font-size:12px;color:#7a7a7a;line-height:1.4;}

/* ── RELATED TREATMENTS (full section) ── */
.related-section{padding:64px 0;background:#fff;border-top:1px solid rgba(45,80,22,0.06);}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px;}
.related-full-card{background:#FDFBF5;border-radius:20px;padding:28px;border:1px solid rgba(45,80,22,0.08);transition:box-shadow .25s,transform .25s;display:flex;flex-direction:column;gap:14px;}
.related-full-card:hover{box-shadow:var(--shadow-lift);transform:translateY(-4px);}
.related-full-icon{width:52px;height:52px;border-radius:14px;background:rgba(45,80,22,0.07);display:flex;align-items:center;justify-content:center;font-size:24px;}
.related-full-name{font-size:17px;font-family:'Fraunces',serif;font-weight:500;color:#1F3A10;line-height:1.3;}
.related-full-desc{font-size:13.5px;color:#5a5a5a;line-height:1.6;flex:1;}
.related-full-meta{display:flex;gap:10px;flex-wrap:wrap;}
.related-chip{font-size:12px;color:#6B7B4F;background:rgba(107,123,79,0.1);padding:4px 12px;border-radius:100px;font-weight:600;}
.related-link{display:inline-flex;align-items:center;gap:6px;color:#C9A84C;font-size:13px;font-weight:700;margin-top:4px;}
.related-link::after{content:"→";}

/* ── BOOK CTA BANNER ── */
.book-banner{background:linear-gradient(135deg,#1F3A10 0%,#2D5016 60%,#3a6b1e 100%);padding:80px 0;text-align:center;position:relative;overflow:hidden;}
.book-banner::before{content:"";position:absolute;top:-60px;left:-60px;width:300px;height:300px;border-radius:50%;background:rgba(201,168,76,0.08);}
.book-banner::after{content:"";position:absolute;bottom:-80px;right:-80px;width:350px;height:350px;border-radius:50%;background:rgba(201,168,76,0.06);}
.book-banner-inner{position:relative;z-index:1;}
.book-banner h2{color:#fff;font-size:clamp(28px,4vw,44px);margin-bottom:14px;}
.book-banner p{color:rgba(253,251,245,0.72);font-size:17px;max-width:480px;margin:0 auto 36px;line-height:1.6;}
.book-banner-actions{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;}

/* ── REVIEW FORM ── */
.review-wrap{background:#fff;border-radius:20px;padding:36px;box-shadow:var(--shadow);border:1px solid rgba(45,80,22,0.06);}
.review-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:16px;padding:28px 32px;text-align:center;}
.star-btn{font-size:26px;background:none;border:none;cursor:pointer;transition:color .15s;padding:2px;}

/* ── TRUST STRIP ── */
.trust-strip{background:#1F3A10;padding:38px 0;}
.trust-grid{display:grid;gap:24px;text-align:center;}
.trust-grid .num{font-family:'Fraunces',serif;font-size:32px;color:#C9A84C;font-weight:500;}
.trust-grid .label{font-size:12px;color:rgba(253,251,245,0.72);letter-spacing:0.06em;text-transform:uppercase;margin-top:4px;}
.trust-divider{width:1px;background:rgba(255,255,255,0.12);}

/* ── PRICING OPTIONS ── */
.pricing-section{margin-bottom:28px;}
.pricing-label{font-size:11.5px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6B7B4F;margin-bottom:10px;}
.pricing-options{display:flex;gap:10px;flex-wrap:wrap;}
.pricing-card{background:#fff;border:2px solid rgba(45,80,22,0.12);border-radius:14px;padding:14px 22px;text-align:center;min-width:100px;cursor:pointer;transition:border-color .2s,box-shadow .2s,background .2s;}
.pricing-card:hover{border-color:#2D5016;box-shadow:0 4px 16px rgba(45,80,22,0.12);}
.pricing-card.selected{border-color:#2D5016;background:rgba(45,80,22,0.04);box-shadow:0 4px 16px rgba(45,80,22,0.10);}
.pricing-duration{font-size:13px;font-weight:600;color:#6B7B4F;margin-bottom:4px;}
.pricing-price{font-family:'Fraunces',serif;font-size:22px;font-weight:500;color:#1F3A10;}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .hero-split{grid-template-columns:1fr;gap:40px;}
  .hero-image-wrap{max-width:480px;}
  .content-layout{grid-template-columns:1fr;}
  .sidebar{position:static;}
  .benefits-grid{grid-template-columns:1fr;}
  .related-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:768px){
  .trust-grid{grid-template-columns:repeat(2,1fr) !important;}
  .trust-divider{display:none;}
  .related-grid{grid-template-columns:1fr;}
  .book-banner{padding:56px 0;}
  .hero{padding:40px 0 56px;}
  .content-layout{padding:48px 0 32px;}
}
@media(max-width:600px){
  .wrap{padding:0 20px;}
  .benefits-grid{grid-template-columns:1fr;}
  .book-banner-actions{flex-direction:column;align-items:center;}
  .hero-actions{flex-direction:column;align-items:flex-start;}
}
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
  const [selectedPricingIndex, setSelectedPricingIndex] = useState(0)

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

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: '3px solid #2D5016', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  /* ── Not found ── */
  if (!service) return (
    <div style={{ minHeight: '100vh', background: '#FDFBF5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <style>{CSS}</style>
      <Navbar />
      <p style={{ fontFamily: "'Fraunces',serif", fontSize: 28, color: '#2D5016' }}>Treatment not found</p>
      <Link href="/#services" style={{ color: '#6B7B4F', fontSize: 14 }}>← Back to all treatments</Link>
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

  const testimonials = (() => {
    const arr = (service.testimonials ?? []) as {quote:string;name:string;location?:string;stars:number}[]
    if (arr.length > 0) return arr
    if (service.testimonial_quote) return [{
      quote: service.testimonial_quote,
      name: service.testimonial_name ?? '',
      location: service.testimonial_location,
      stars: service.testimonial_stars ?? 5,
    }]
    return []
  })()

  return (
    <>
      <style>{CSS}</style>

      {/* 1. Shared Navbar */}
      <div style={{ marginBottom: 80 }}>
        <Navbar />
      </div>

      {/* 2. Breadcrumb */}
      <div className="wrap breadcrumb fade-up d1">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href="/#services">Treatments</Link>
        <span className="sep">/</span>
        <span className="current">{service.name}</span>
      </div>

      {/* 3. Hero Section */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-split">
            {/* Hero text */}
            <div className="hero-text">
              <div className="eyebrow fade-up d1">Ayurvedic Treatment</div>
              <h1 className="fade-up d2">{service.name}</h1>
              <p className="lead fade-up d3">{service.description}</p>

              {/* Pricing Options — interactive cards */}
              {service.pricing && service.pricing.length > 0 ? (
                <div className="pricing-section fade-up d4">
                  <div className="pricing-label">Choose Duration</div>
                  <div className="pricing-options">
                    {service.pricing.map((opt, i) => (
                      <div
                        key={i}
                        className={`pricing-card${selectedPricingIndex === i ? ' selected' : ''}`}
                        onClick={() => setSelectedPricingIndex(i)}
                      >
                        <div className="pricing-duration">{opt.d}</div>
                        <div className="pricing-price">{opt.p}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="hero-actions fade-up d4">
                <button
                  className="btn-gold"
                  onClick={() => {
                    if (service.pricing && service.pricing.length > 0) {
                      const opt = service.pricing[selectedPricingIndex]
                      sessionStorage.setItem('book_service', service.name)
                      sessionStorage.setItem('book_duration', opt.d)
                      sessionStorage.setItem('book_price', opt.p)
                    } else {
                      sessionStorage.setItem('book_service', service.name)
                      sessionStorage.removeItem('book_duration')
                      sessionStorage.removeItem('book_price')
                    }
                    document.getElementById('book-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Book This Treatment
                </button>
                <Link href="/#services" className="btn-outline">View All Treatments</Link>
              </div>
              <div className="meta-chips fade-up d5">
                {/* Show duration chip only when no pricing array */}
                {!(service.pricing && service.pricing.length > 0) && service.duration && (
                  <div className="chip">
                    <span className="ic">◷</span> {service.duration}
                  </div>
                )}
                {/* Show price chip only when no pricing array */}
                {!(service.pricing && service.pricing.length > 0) && service.price_from && (
                  <div className="chip">
                    <span className="ic">£</span> From {service.price_from}
                  </div>
                )}
                {service.location && (
                  <div className="chip">
                    <span className="ic">◎</span> {service.location}
                  </div>
                )}
              </div>
            </div>

            {/* Hero image */}
            {service.hero_image && (
              <div className="hero-image-wrap fade-up d3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.hero_image} alt={service.name} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Quick Info Bar */}
      {(service.pricing?.length || service.duration || service.price_from || service.location) && (() => {
        const hasPricing = service.pricing && service.pricing.length > 0
        const fromPrice = hasPricing ? service.pricing![0].p : service.price_from
        const durationDisplay = hasPricing
          ? (service.pricing!.length === 1
              ? service.pricing![0].d
              : `${service.pricing![0].d} – ${service.pricing![service.pricing!.length - 1].d}`)
          : service.duration
        return (
          <div className="info-bar">
            <div className="wrap info-bar-inner">
              {durationDisplay && (
                <div className="info-chip">
                  <span className="ic">◷</span> {durationDisplay}
                </div>
              )}
              {durationDisplay && fromPrice && <div className="info-sep" />}
              {fromPrice && (
                <div className="info-chip">
                  <span className="ic">£</span> From {fromPrice}
                </div>
              )}
              {service.location && (
                <>
                  <div className="info-sep" />
                  <div className="info-chip">
                    <span className="ic">◎</span> {service.location}
                  </div>
                </>
              )}
              {service.phone && (
                <>
                  <div className="info-sep" />
                  <div className="info-chip">
                    <span className="ic">☏</span> {service.phone}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })()}

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
                {i < trustStats.length - 1 && <div key={`d${i}`} className="trust-divider" />}
              </>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div className="wrap content-layout">
        <main>

          {/* 5. Benefits Section */}
          {benefits.length > 0 && (
            <section className="block">
              <div className="ornament">Benefits</div>
              <h2>Why choose {service.icon} {service.name.split('–')[0].trim()}</h2>
              <p className="intro">Every treatment at AK Ayurveda is tailored to your prakriti and current imbalance.</p>
              <div className="benefits-grid">
                {benefits.map((b, i) => (
                  <div key={i} className="benefit-card">
                    <div className="benefit-check">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="benefit-text">
                      <h4>{b}</h4>
                      {benefitDescs[i] && <p>{benefitDescs[i]}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. How It Works / What to Expect */}
          {steps.length > 0 && (
            <section className="block">
              <div className="ornament">What to Expect</div>
              <h2>How your session unfolds</h2>
              <p className="intro">A step-by-step walkthrough of your treatment, from arrival to completion.</p>
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

          {/* 7. Ideal For */}
          {idealFor.length > 0 && (
            <section className="block">
              <div className="ornament">Ideal For</div>
              <h2>Who benefits most</h2>
              <p className="intro" style={{ marginBottom: 24 }}>This treatment is particularly suited to those experiencing:</p>
              <div className="pill-cloud">
                {idealFor.map((item, i) => (
                  <span key={i} className="tag-pill">{item}</span>
                ))}
              </div>
            </section>
          )}

          {/* Testimonials */}
          {testimonials.length > 0 && (
            <section className="block">
              <div className="ornament">Client Stories</div>
              <h2>In their words</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 28 }}>
                {testimonials.map((t, i) => (
                  <div key={i} className="testimonial-card">
                    <p className="quote">&ldquo;{t.quote}&rdquo;</p>
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
          )}

          {/* Approved customer reviews */}
          {approvedReviews.length > 0 && (
            <section className="block">
              <div className="ornament">Verified Reviews</div>
              <h2>What our clients say</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
                {approvedReviews.map(r => (
                  <div key={r.id} className="testimonial-card">
                    <p className="quote">&ldquo;{r.quote}&rdquo;</p>
                    <div className="testimonial-footer">
                      <div className="patient">{r.name}{r.location && <span>{r.location}</span>}</div>
                      <div className="stars">{'★'.repeat(r.stars)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 8. FAQs */}
          {faqs.length > 0 && (
            <section className="block">
              <div className="ornament">FAQ</div>
              <h2>Frequently asked questions</h2>
              <div style={{ marginTop: 28 }}>
                {faqs.map((faq, i) => (
                  <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                    <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{faq.q}</span>
                      <div className="faq-icon" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform .25s' }}>+</div>
                    </button>
                    {openFaq === i && <div className="faq-a">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Leave a Review */}
          <section className="block">
            <div className="ornament">Share Your Experience</div>
            <h2>Leave a review</h2>
            <p className="intro" style={{ marginBottom: 28 }}>Had a session with us? We&apos;d love to hear your experience.</p>
            {reviewDone ? (
              <div className="review-success">
                <div style={{ fontSize: 32, marginBottom: 12 }}>🙏</div>
                <p style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: '#1F3A10', marginBottom: 8 }}>Thank you for your review!</p>
                <p style={{ fontSize: 14, color: '#6B7B4F' }}>Your review is pending approval and will appear on this page shortly.</p>
                <button onClick={() => setReviewDone(false)} style={{ marginTop: 16, fontSize: 13, color: '#2D5016', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}>Write another review</button>
              </div>
            ) : (
              <div className="review-wrap">
                {/* Stars */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7B4F', display: 'block', marginBottom: 10 }}>Your Rating</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setReviewForm(p => ({ ...p, stars: n }))} className="star-btn"
                        style={{ color: n <= reviewForm.stars ? '#C9A84C' : '#e5e7eb' }}>★</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7B4F', display: 'block', marginBottom: 6 }}>Your Name *</label>
                    <input value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Sarah Johnson"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', fontSize: 14, outline: 'none', fontFamily: 'Inter,sans-serif' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7B4F', display: 'block', marginBottom: 6 }}>Location</label>
                    <input value={reviewForm.location} onChange={e => setReviewForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="London"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', fontSize: 14, outline: 'none', fontFamily: 'Inter,sans-serif' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B7B4F', display: 'block', marginBottom: 6 }}>Your Experience *</label>
                  <textarea value={reviewForm.quote} onChange={e => setReviewForm(p => ({ ...p, quote: e.target.value }))}
                    rows={4} placeholder="Share how this treatment helped you..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', fontSize: 14, outline: 'none', fontFamily: 'Inter,sans-serif', resize: 'none' }} />
                </div>
                <button onClick={submitReview} disabled={reviewSubmitting || !reviewForm.name || !reviewForm.quote}
                  className="btn-gold" style={{ opacity: (!reviewForm.name || !reviewForm.quote) ? 0.5 : 1 }}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>Reviews are moderated and appear after approval.</p>
              </div>
            )}
          </section>

        </main>

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          {/* CTA Card */}
          <div className="cta-card" id="book-section">
            <div className="cta-icon">{service.icon}</div>
            <h3>{service.name.split('–')[0].trim()}</h3>
            <p className="cta-sub">Ready to begin your wellness journey? Reserve your appointment today.</p>
            <button
              className="btn-gold"
              onClick={() => {
                if (service.pricing && service.pricing.length > 0) {
                  const opt = service.pricing[selectedPricingIndex]
                  sessionStorage.setItem('book_service', service.name)
                  sessionStorage.setItem('book_duration', opt.d)
                  sessionStorage.setItem('book_price', opt.p)
                } else {
                  sessionStorage.setItem('book_service', service.name)
                  sessionStorage.removeItem('book_duration')
                  sessionStorage.removeItem('book_price')
                }
                document.getElementById('book-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Book Appointment
            </button>
            <div className="cta-divider" />
            {(service.pricing && service.pricing.length > 0) ? (
              <>
                <div className="detail-row">
                  <span className="k">◷ Duration</span>
                  <span className="v">
                    {service.pricing.length === 1
                      ? service.pricing[0].d
                      : `${service.pricing[0].d} – ${service.pricing[service.pricing.length - 1].d}`}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="k">£ From</span>
                  <span className="v">{service.pricing[0].p}</span>
                </div>
              </>
            ) : (
              <>
                {service.duration && (
                  <div className="detail-row">
                    <span className="k">◷ Duration</span>
                    <span className="v">{service.duration}</span>
                  </div>
                )}
                {service.price_from && (
                  <div className="detail-row">
                    <span className="k">£ From</span>
                    <span className="v">{service.price_from}</span>
                  </div>
                )}
              </>
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

          {/* Related Treatments (sidebar) */}
          {related.length > 0 && (
            <div className="related-card">
              <div className="related-title">You May Also Like</div>
              {related.map((s) => (
                <div key={s.id} className="related-item">
                  <Link href={`/services/${toSlug(s.name)}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', width: '100%' }}>
                    <div className="related-ic">{s.icon}</div>
                    <div>
                      <div className="related-name">{s.name.split('–')[0].trim()}</div>
                      <div className="related-desc">{s.description?.substring(0, 60)}…</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* 9. Related Treatments — full width section */}
      {related.length > 0 && (
        <div className="related-section">
          <div className="wrap">
            <div className="ornament" style={{ justifyContent: 'center' }}>You May Also Like</div>
            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Related Treatments</h2>
            <p style={{ textAlign: 'center', color: '#6B7B4F', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              Explore other healing therapies that complement your wellness journey.
            </p>
            <div className="related-grid">
              {related.map((s) => (
                <div key={s.id} className="related-full-card">
                  <div className="related-full-icon">{s.icon}</div>
                  <div className="related-full-name">{s.name}</div>
                  <div className="related-full-desc">{s.description}</div>
                  <div className="related-full-meta">
                    {s.duration && <span className="related-chip">◷ {s.duration}</span>}
                    {s.price_from && <span className="related-chip">From {s.price_from}</span>}
                  </div>
                  <Link href={`/services/${toSlug(s.name)}`} className="related-link">
                    View Treatment
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. Book CTA Banner */}
      <div className="book-banner">
        <div className="wrap book-banner-inner">
          <div className="ornament" style={{ justifyContent: 'center', color: 'rgba(201,168,76,0.9)' }}>Begin Your Journey</div>
          <h2>Ready to Begin Your Wellness Journey?</h2>
          <p>Experience the restorative traditions of authentic Ayurvedic care. Our practitioners are here to guide you toward everyday balance and lasting wellbeing.</p>
          <div className="book-banner-actions">
            <button
              className="btn-gold"
              style={{ fontSize: 15, padding: '14px 36px' }}
              onClick={() => {
                if (service.pricing && service.pricing.length > 0) {
                  const opt = service.pricing[selectedPricingIndex]
                  sessionStorage.setItem('book_service', service.name)
                  sessionStorage.setItem('book_duration', opt.d)
                  sessionStorage.setItem('book_price', opt.p)
                } else {
                  sessionStorage.setItem('book_service', service.name)
                  sessionStorage.removeItem('book_duration')
                  sessionStorage.removeItem('book_price')
                }
                document.getElementById('book-section')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Book Appointment
            </button>
            <Link href="/#services" className="btn-outline" style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)', fontSize: 15, padding: '14px 36px' }}>
              Explore All Treatments
            </Link>
          </div>
        </div>
      </div>

      {/* 11. Footer */}
      <Footer />
    </>
  )
}
