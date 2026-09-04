'use client'

import { useEffect, useState } from 'react'
import { formatDuration, formatPrice, type PricingOption } from '@/lib/pricing'

// Quick-info strip. When the service has session options from admin, the
// Duration card becomes a picker and the Price card follows the choice.
export default function SessionPicker({
  serviceName,
  options,
  durationFallback,
  priceFallback,
}: {
  serviceName: string
  options: PricingOption[]
  durationFallback: string
  priceFallback: string
}) {
  const [index, setIndex] = useState(0)
  const selected = options[index]

  // Remember the choice so the Book buttons on this page carry it into /book.
  useEffect(() => {
    if (!selected) return
    try {
      sessionStorage.setItem('book_option_service', serviceName)
      sessionStorage.setItem('book_duration', formatDuration(selected.d))
      sessionStorage.setItem('book_price', formatPrice(selected.p))
    } catch { /* ignore */ }
  }, [selected, serviceName])

  const cardClass = 'flex items-center gap-4 bg-white rounded-2xl px-6 py-5 shadow-sm'
  const iconClass = 'w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0'

  return (
    <section style={{ background: '#F0FAF7' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Duration — a picker when there are options to choose from */}
        <div
          className={`${cardClass} transition-all duration-200 ${
            options.length > 1 ? 'hover:shadow-md ring-1 ring-transparent hover:ring-[#D4A853]/40' : ''
          }`}
        >
          <span className={iconClass} style={{ background: 'rgba(27,110,92,0.1)', color: '#1B6E5C' }}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs tracking-wide text-black/40 uppercase">Duration</p>

            {options.length > 1 ? (
              <>
              <div className="relative -ml-1 inline-block">
                <select
                  value={index}
                  onChange={(e) => setIndex(Number(e.target.value))}
                  aria-label="Choose session length"
                  className="w-auto appearance-none cursor-pointer bg-transparent pl-1 pr-7 font-display text-2xl font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]"
                  style={{ color: '#0F3D34' }}
                >
                  {options.map((o, i) => (
                    <option key={i} value={i}>
                      {formatDuration(o.d) || 'Session'}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform duration-200 group-hover:translate-y-[-40%]"
                  viewBox="0 0 24 24" fill="none" stroke="#D4A853" strokeWidth={2.5} aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[11px] text-black/35 mt-0.5">{options.length} session lengths available</p>
              </>
            ) : (
              <p className="font-display text-2xl font-semibold" style={{ color: '#0F3D34' }}>
                {selected ? formatDuration(selected.d) : durationFallback}
              </p>
            )}
          </div>
        </div>

        {/* Price — follows the chosen option */}
        <div className={cardClass}>
          <span className={iconClass} style={{ background: 'rgba(212,168,83,0.14)', color: '#D4A853' }}>
            £
          </span>
          <div>
            <p className="text-xs tracking-wide text-black/40 uppercase">Price</p>
            <p className="font-display text-2xl font-semibold" style={{ color: '#0F3D34' }}>
              {selected && formatPrice(selected.p) ? formatPrice(selected.p) : priceFallback}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className={cardClass}>
          <span className={iconClass} style={{ background: 'rgba(27,110,92,0.1)', color: '#1B6E5C' }}>
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
  )
}
