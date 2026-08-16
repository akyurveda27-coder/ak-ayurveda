import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ayurvedic Treatments London | 18 Therapies | AK Ayurveda',
  description: 'Explore 18 authentic Ayurvedic treatments in London — Abhyanga, Shirodhara, Kati Vasti, Udvartana, Indian Head Massage & more. Personalised to your constitution.',
  keywords: 'ayurvedic treatments london, abhyanga massage london, shirodhara london, kati vasti london, udvartana london, indian head massage london, ayurvedic facial london, janu vasti london',
}

export const revalidate = 60

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const toSlug = slugify

interface Service {
  id: string
  name: string
  description: string
  icon?: string
  price_from?: string | number | null
  card_image?: string | null
  hero_image?: string | null
}

export default async function ServicesPage({ searchParams }: { searchParams?: { search?: string } }) {
  const searchQuery = searchParams?.search?.toLowerCase() || ''
  const { data: allServices } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  const services = searchQuery
    ? allServices?.filter(s =>
        s.name?.toLowerCase().includes(searchQuery) ||
        s.description?.toLowerCase().includes(searchQuery)
      )
    : allServices

  const list: Service[] = services ?? []

  return (
    <main className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="w-full pt-10 pb-8 text-center" style={{ backgroundColor: '#0F3D34' }}>
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">Our Treatments</span>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
          Ayurvedic Treatments in London
        </h1>
        <p className="mt-4 text-white/70 text-[17px] max-w-lg mx-auto">
          18 authentic Ayurvedic therapies at our London clinic, each personalised to your individual constitution.
        </p>
      </section>

      {/* Services Grid */}
      <section className="w-full bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          {searchQuery && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {services?.length ?? 0} result{(services?.length ?? 0) !== 1 ? 's' : ''} for <strong>&ldquo;{searchParams?.search}&rdquo;</strong>
              </span>
              <a href="/services" className="text-xs underline" style={{ color: '#1B6E5C' }}>Clear search</a>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((service) => (
              <div key={service.id} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-[#E0F0EB]">
                {/* Image top */}
                <div className="relative h-48 overflow-hidden">
                  {(service.card_image || service.hero_image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${(service.card_image || service.hero_image)!.split('?')[0]}?w=400&q=75&auto=format&fit=crop`}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1B6E5C, #0F3D34)' }}>
                      <span className="text-5xl opacity-40">{service.icon || '🌿'}</span>
                    </div>
                  )}
                  {/* Price badge */}
                  {service.price_from && (
                    <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold" style={{ color: '#1B6E5C' }}>
                      From {String(service.price_from).replace(/^£+/, '£')}
                    </span>
                  )}
                </div>
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{service.icon || '🌿'}</span>
                    <h3 className="font-display text-lg font-semibold leading-snug" style={{ color: '#0F3D34' }}>{service.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm font-semibold" style={{ color: '#1B6E5C' }}>
                    <a href={`/services/${toSlug(service.name)}`} className="hover:underline">Learn more →</a>
                    <span className="text-gray-200">|</span>
                    <a href="/book" className="hover:underline">Book</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {list.length === 0 && (
            <div className="py-10 text-center text-gray-400">
              <p className="text-lg">Treatments coming soon...</p>
              <a href="/book" className="mt-6 inline-block rounded-full px-8 py-3 text-white" style={{ backgroundColor: '#1B6E5C' }}>
                Book a Consultation
              </a>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-mint py-10 text-center">
        <h2 className="font-display text-3xl font-semibold md:text-4xl" style={{ color: '#1B6E5C' }}>
          Not sure which therapy is right for you?
        </h2>
        <p className="mt-3 text-gray-600">Book a consultation and our practitioner will guide you.</p>
        <a
          href="/book"
          className="mt-8 inline-block rounded-full px-10 py-3.5 font-semibold text-white transition hover:bg-[#0F3D34]"
          style={{ backgroundColor: '#1B6E5C' }}
        >
          Book a Free Consultation
        </a>
      </section>

      <Footer />
    </main>
  )
}
