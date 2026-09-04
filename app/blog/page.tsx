export const revalidate = 60

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogList from '@/components/BlogList'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: 'Ayurveda Blog UK | Wellness Articles | AK Ayurveda London',
  description: 'Expert articles on Ayurveda, holistic health, dosha types, Ayurvedic nutrition & seasonal wellness. Written for UK readers exploring Ayurvedic living.',
  keywords: 'ayurveda blog uk, ayurvedic tips uk, dosha test uk, ayurvedic nutrition uk, holistic health articles, ayurveda for beginners uk',
}

export default async function BlogPage() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, content, image_url, category, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-10 pb-8 px-4 text-center" style={{ background: '#1B6E5C' }}>
        <span className="inline-block text-xs font-body font-semibold tracking-widest uppercase mb-3" style={{ color: '#D4A853' }}>
          Our Journal
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
          Wisdom &amp; Wellbeing
        </h1>
        <p className="font-body text-white/70 text-lg max-w-xl mx-auto">
          Articles on Ayurveda, holistic health, and the ancient science of living well.
        </p>
      </section>

      {/* Blog list with client-side category filter */}
      <BlogList blogs={blogs ?? []} />

      <Footer />
    </main>
  )
}
// force deploy Sat Aug 15 18:54:14 UTC 2026
