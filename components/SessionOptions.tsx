import BookButton from '@/components/BookButton'
import { formatDuration, formatPrice, type PricingOption } from '@/lib/pricing'

export default function SessionOptions({
  serviceName,
  options,
}: {
  serviceName: string
  options: PricingOption[]
}) {
  if (options.length === 0) return null

  return (
    <section style={{ background: '#F0FAF7', borderTop: '1px solid #E0F0EB' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-4 pb-20">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase mb-3" style={{ color: '#D4A853', letterSpacing: '0.14em' }}>
            ✦ Session Options
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: '#0F3D34' }}>
            Choose Your Session
          </h2>
          <p className="text-black/55 mt-4 leading-relaxed">
            Each session is tailored to your constitution — select the length that suits you.
          </p>
        </div>

        <div
          className={`mt-10 grid gap-6 ${
            options.length === 1
              ? 'max-w-sm'
              : options.length === 2
                ? 'sm:grid-cols-2 max-w-3xl'
                : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {options.map((opt, i) => (
            <div
              key={i}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-7 sm:p-8 border border-[#E0F0EB] shadow-[0_1px_3px_rgba(15,61,52,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A853] hover:shadow-[0_18px_50px_rgba(15,61,52,0.14)]"
            >
              {/* Gold accent line, revealed on hover */}
              <span
                className="absolute inset-x-0 top-0 h-[3px] scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ background: 'linear-gradient(90deg, #D4A853, #E4C486)' }}
              />

              <span
                className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide"
                style={{ background: 'rgba(27,110,92,0.08)', color: '#1B6E5C' }}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {formatDuration(opt.d) || 'Session'}
              </span>

              <div className="mt-7 flex items-baseline gap-2">
                <span className="font-display text-5xl font-semibold leading-none" style={{ color: '#0F3D34' }}>
                  {formatPrice(opt.p) || '—'}
                </span>
                <span className="text-sm text-black/40">per session</span>
              </div>

              <div className="my-7 h-px w-full" style={{ background: '#E0F0EB' }} />

              <BookButton
                serviceName={serviceName}
                duration={formatDuration(opt.d)}
                price={formatPrice(opt.p)}
                className="mt-auto w-full whitespace-nowrap rounded-full px-6 py-3.5 font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-[1.03]"
                style={{ background: '#D4A853', color: '#0F3D34' }}
              >
                Book This Session
              </BookButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
