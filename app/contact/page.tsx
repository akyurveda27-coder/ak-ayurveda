export const revalidate = 60

import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactForm from './ContactForm'
import { defaultContact } from '@/lib/defaults'
import { ContactContent } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Contact AK Ayurveda London | Book Ayurvedic Consultation',
  description: 'Contact AK Ayurveda in London to book an Ayurvedic consultation or treatment. Located in London, UK. Mon–Sat 9AM–7PM. Call +44 20 7946 0958.',
  keywords: 'ayurvedic clinic london contact, book ayurvedic consultation london, ayurvedic massage near me london, ayurveda appointment london',
}

const tiles = [
  {
    emoji: '📍',
    label: 'Address',
    key: 'address' as keyof ContactContent,
  },
  {
    emoji: '📞',
    label: 'Phone',
    key: 'phone' as keyof ContactContent,
  },
  {
    emoji: '✉️',
    label: 'Email',
    key: 'email' as keyof ContactContent,
  },
  {
    emoji: '🕐',
    label: 'Opening Hours',
    key: 'hours' as keyof ContactContent,
  },
]

export default async function ContactPage() {
  // Fetch contact content from Supabase server-side
  let contact: ContactContent = defaultContact

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'contact')
      .single()
    if (data?.value) {
      contact = { ...defaultContact, ...(data.value as ContactContent) }
    }
  } catch {
    // silently fall back to defaults
  }

  const mapUrl = contact.map_url || defaultContact.map_url

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-[#0F3D34] py-20 text-center px-6">
        <p
          className="font-display text-sm tracking-[0.25em] uppercase mb-4"
          style={{ color: '#D4A853' }}
        >
          ✦ Contact Us ✦
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
          Get In Touch
        </h1>
        <p className="font-body text-white/70 max-w-xl mx-auto text-base leading-relaxed">
          We&apos;d love to hear from you. Reach out to book a consultation,
          ask a question, or simply learn more about our Ayurvedic therapies.
        </p>
      </section>

      {/* ── Contact Tiles ────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: '#F0FAF7' }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiles.map((tile) => {
              const value = contact[tile.key] as string
              return (
                <div
                  key={tile.key}
                  className="bg-white rounded-2xl shadow-sm p-7 flex items-start gap-5 border border-white"
                >
                  {/* Gold emoji circle */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ background: '#D4A85320' }}
                  >
                    <span>{tile.emoji}</span>
                  </div>
                  <div>
                    <h3
                      className="font-display text-lg font-semibold mb-1"
                      style={{ color: '#0F3D34' }}
                    >
                      {tile.label}
                    </h3>
                    <p className="font-body text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                      {value || '—'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Google Map ───────────────────────────────────────── */}
      <section className="py-10 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl shadow-lg" style={{ height: 400 }}>
            <iframe
              src={mapUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AK Ayurveda Location"
            />
          </div>
        </div>
      </section>

      {/* ── Quick Message Form ───────────────────────────────── */}
      <ContactForm />

      <Footer />
    </main>
  )
}
