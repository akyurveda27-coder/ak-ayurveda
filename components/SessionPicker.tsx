'use client'

import { useEffect, useRef, useState } from 'react'
import BookButton from '@/components/BookButton'
import { formatDuration, formatPrice, type PricingOption } from '@/lib/pricing'

// Quick-info strip under the treatment hero. With more than one session option
// from admin, the length becomes a segmented control and the price follows it.
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
  const choosable = options.length > 1
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Remember the choice so the Book buttons on this page carry it into /book.
  useEffect(() => {
    if (!selected) return
    try {
      sessionStorage.setItem('book_option_service', serviceName)
      sessionStorage.setItem('book_duration', formatDuration(selected.d))
      sessionStorage.setItem('book_price', formatPrice(selected.p))
    } catch { /* ignore */ }
  }, [selected, serviceName])

  // Left/right arrows move between options, as a radio group should.
  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = e.key === 'ArrowRight' ? (i + 1) % options.length : (i - 1 + options.length) % options.length
    setIndex(next)
    optionRefs.current[next]?.focus()
  }

  const label = 'text-[11px] font-semibold tracking-[0.14em] text-black/40 uppercase'

  return (
    <section style={{ background: '#F0FAF7' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session — length picker + the price it maps to */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0F0EB] shadow-[0_1px_3px_rgba(15,61,52,0.05)] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={label}>{choosable ? 'Choose your session' : 'Session'}</p>

              {choosable ? (
                <div
                  role="radiogroup"
                  aria-label="Session length"
                  className="mt-3 inline-flex gap-1 rounded-full p-1"
                  style={{ background: '#E3F1EC' }}
                >
                  {options.map((o, i) => {
                    const active = i === index
                    return (
                      <button
                        key={i}
                        ref={(el) => { optionRefs.current[i] = el }}
                        role="radio"
                        aria-checked={active}
                        tabIndex={active ? 0 : -1}
                        onClick={() => setIndex(i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className={`rounded-full px-6 py-3 font-body text-[15px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] ${
                          active
                            ? 'bg-white shadow-[0_2px_8px_rgba(15,61,52,0.12)]'
                            : 'text-[#1B6E5C]/70 hover:text-[#0F3D34]'
                        }`}
                        style={active ? { color: '#0F3D34' } : undefined}
                      >
                        {formatDuration(o.d) || 'Session'}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-2 font-display text-3xl font-semibold" style={{ color: '#0F3D34' }}>
                  {selected ? formatDuration(selected.d) : durationFallback}
                </p>
              )}
            </div>

            {/* Price for the selected length */}
            <div className="sm:border-l sm:border-[#E0F0EB] sm:pl-8">
              <p className={label}>Price</p>
              <p key={index} className="mt-1.5 flex items-baseline gap-2 animate-priceIn">
                <span className="font-display text-4xl font-semibold leading-none" style={{ color: '#0F3D34' }}>
                  {selected && formatPrice(selected.p) ? formatPrice(selected.p) : priceFallback}
                </span>
                <span className="text-xs text-black/40">per session</span>
              </p>
            </div>

            <BookButton
              serviceName={serviceName}
              duration={selected ? formatDuration(selected.d) : undefined}
              price={selected ? formatPrice(selected.p) : undefined}
              className="w-full sm:w-auto whitespace-nowrap rounded-full px-7 py-3.5 font-body text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-[1.03]"
              style={{ background: '#D4A853', color: '#0F3D34' }}
            >
              Book This Session
            </BookButton>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-[#E0F0EB] shadow-[0_1px_3px_rgba(15,61,52,0.05)] px-6 py-6 sm:px-8 flex items-center gap-4">
          <span
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'rgba(27,110,92,0.1)' }}
          >
            🌿
          </span>
          <div>
            <p className={label}>Category</p>
            <p className="mt-1 font-display text-xl sm:text-2xl font-semibold whitespace-nowrap" style={{ color: '#0F3D34' }}>
              Ayurvedic Therapy
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
