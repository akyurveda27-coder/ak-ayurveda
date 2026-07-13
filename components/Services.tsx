'use client'

import Link from 'next/link'
import { Service } from '@/lib/types'
import { defaultServices } from '@/lib/defaults'

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface ServicesProps {
  services?: Service[]
}

export default function Services({ services }: ServicesProps) {
  const data = services && services.length > 0
    ? services
    : defaultServices.map((s, i) => ({ ...s, id: String(i) }))

  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-accent text-sm font-body font-semibold tracking-widest uppercase mb-3">
            Our Treatments
          </span>
          <h2 className="section-title">Time-Honoured Therapies</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Each treatment is rooted in classical Ayurvedic texts and adapted for your individual constitution and health goals.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((service) => (
            <div
              key={service.id}
              className="card group hover:border-accent/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                {service.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-primary mb-2">
                {service.name}
              </h3>
              <p className="font-body text-sm text-sage leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Link
                  href={`/services/${toSlug(service.name)}`}
                  className="inline-flex items-center gap-1 text-accent text-sm font-medium font-body hover:gap-2 transition-all duration-200"
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <span className="text-green-200">·</span>
                <a
                  href="#book-appointment"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium font-body hover:text-primaryDark transition-colors"
                >
                  Book
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
