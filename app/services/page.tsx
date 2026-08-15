import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Treatments — AK Ayurveda',
  description: 'Explore our full range of 18 traditional Ayurvedic treatments at AK Ayurveda, London.',
}

export const revalidate = 60

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface Service {
  id: string
  name: string
  description: string
  icon?: string
  price_from?: number
}

export default async function ServicesPage() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  const list: Service[] = services ?? []

  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="w-full bg-primaryDark py-16 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">Our Treatments</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
          All Ayurvedic Therapies
        </h1>
        <p className="mt-4 text-white/70 text-[17px] max-w-lg mx-auto">
          Choose from {list.length || 18} traditional Ayurvedic therapies, each personalised to your individual needs and constitution.
        </p>
      </section>

      {/* Services Grid */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((service) => {
              const slug = slugify(service.name)
              return (
                <div
                  key={service.id}
                  className="rounded-2xl border border-sectionBorder bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint text-2xl">
                    {service.icon || '🌿'}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-primary leading-snug">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3">
                    {service.description}
                  </p>
                  {service.price_from && (
                    <p className="mt-3 text-sm font-semibold text-accent">From £{service.price_from}</p>
                  )}
                  <div className="mt-5 flex items-center gap-4 text-sm font-medium text-primary">
                    <Link href={`/services/${slug}`} className="hover:underline">
                      Learn more →
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link href="/book" className="hover:underline">
                      Book
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {list.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <p className="text-lg">Treatments coming soon...</p>
              <Link href="/book" className="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-white">
                Book a Consultation
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-mint py-14 text-center">
        <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
          Not sure which therapy is right for you?
        </h2>
        <p className="mt-3 text-gray-600">Book a consultation and our practitioner will guide you.</p>
        <Link
          href="/book"
          className="mt-8 inline-block rounded-full bg-primary px-10 py-3.5 font-semibold text-white transition hover:bg-primaryDark"
        >
          Book a Free Consultation
        </Link>
      </section>

      <Footer />
    </main>
  )
}
