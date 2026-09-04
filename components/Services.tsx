'use client'

import Link from 'next/link'

interface ServiceItem {
  icon: string
  name: string
  description: string
  slug: string
}

const defaultServices: ServiceItem[] = [
  {
    icon: '🌿',
    name: 'Ayurvedic Consultation & Personalised Wellness Guidance',
    description: 'A personalised Ayurvedic consultation based on your individual Prakriti (constitution) and Vikriti (current imbalance).',
    slug: 'ayurvedic-consultation',
  },
  {
    icon: '💆',
    name: 'Abhyanga – Full Body Ayurvedic Massage',
    description: 'A traditional full-body Ayurvedic oil massage using warm herbal oils and rhythmic techniques to support relaxation and overall wellbeing.',
    slug: 'abhyanga',
  },
  {
    icon: '🔥',
    name: 'Abhyanga with Kizhi – Massage with Hot Herbal Bundles',
    description: 'A combination of Abhyanga and Kizhi, using warm herbal bundles applied with rhythmic massage techniques for soothing warmth.',
    slug: 'abhyanga-kizhi',
  },
  {
    icon: '💧',
    name: 'Shirodhara – Ayurvedic Oil Flow Therapy',
    description: 'A continuous, gentle stream of warm herbal oil poured over the forehead to support deep relaxation and calm.',
    slug: 'shirodhara',
  },
  {
    icon: '🌾',
    name: 'Udvartana – Herbal Powder Body Therapy',
    description: 'An invigorating dry herbal powder massage traditionally used to support circulation and skin vitality.',
    slug: 'udvartana',
  },
  {
    icon: '👑',
    name: 'Shiroabhyanga – Ayurvedic Head & Scalp Massage',
    description: 'A calming head, neck, and shoulder massage using warm herbal oils to support relaxation and ease tension.',
    slug: 'shiroabhyanga',
  },
]

interface ServicesProps {
  services?: Array<{ id: string; name: string; description: string; icon: string; hero_image?: string | null; card_image?: string | null }>
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Services({ services }: ServicesProps) {
  const data: (ServiceItem & { hero_image?: string | null; card_image?: string | null })[] = services && services.length > 0
    ? services.map((s) => ({ icon: s.icon, name: s.name, description: s.description, slug: toSlug(s.name), hero_image: s.hero_image, card_image: s.card_image }))
    : defaultServices

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((service) => (
        // Card is a div, not a link: the "Learn more" link below is stretched over the
        // whole card instead, so "Book" stays a separate link and the HTML stays valid.
        <div
          key={service.slug}
          className="group relative rounded-2xl border border-[#E0F0EB] bg-white p-6 shadow-sm transition hover:shadow-md overflow-hidden"
        >
          {/* Subtle background image — card_image preferred, fallback to hero_image */}
          {((service as ServiceItem & { card_image?: string | null; hero_image?: string | null }).card_image || (service as ServiceItem & { hero_image?: string | null }).hero_image) && (
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundImage: `url(${(service as ServiceItem & { card_image?: string | null; hero_image?: string | null }).card_image || (service as ServiceItem & { hero_image?: string | null }).hero_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.08,
              }}
            />
          )}
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FAF7] text-2xl">
            {service.icon}
          </div>
          <h3 className="relative z-10 mt-4 font-display text-2xl font-semibold text-primary">
            {service.name}
          </h3>
          <p className="relative z-10 mt-3 text-sm leading-relaxed text-gray-600">
            {service.description}
          </p>
          <div className="relative z-10 mt-4 flex items-center gap-4 text-sm font-medium text-primary">
            <Link
              href={`/services/${service.slug}`}
              className="hover:underline after:absolute after:inset-0 after:content-['']"
            >
              Learn more →
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/book" className="relative z-20 hover:underline">
              Book
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
