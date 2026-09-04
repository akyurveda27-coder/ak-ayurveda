export type PricingOption = { d: string; p: string }

// Structural shape so both lib/types Service and the page-local ones fit.
type PricedService = {
  pricing?: PricingOption[] | null
  price_from?: string | number | null
  duration?: string | number | null
}

// Admin lets prices be typed either way ("£40" or "40") — always show one "£".
export function formatPrice(value?: string | number | null): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  const stripped = raw.replace(/^£+/, '').trim()
  return stripped ? `£${stripped}` : ''
}

// Durations are typed freely too ("60", "60 min", "60 minutes").
export function formatDuration(value?: string | number | null): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  return /^\d+$/.test(raw) ? `${raw} min` : raw
}

export function pricingOptions(service?: PricedService | null): PricingOption[] {
  return ((service?.pricing ?? []) as PricingOption[]).filter(
    (o) => String(o?.d ?? '').trim() || String(o?.p ?? '').trim()
  )
}

// Lowest price across the options, falling back to the service's price_from column.
export function priceFromLabel(service?: PricedService | null): string {
  const options = pricingOptions(service)
  const amounts = options
    .map((o) => Number(String(o.p ?? '').replace(/[^0-9.]/g, '')))
    .filter((n) => Number.isFinite(n) && n > 0)

  if (amounts.length > 0) return `From ${formatPrice(String(Math.min(...amounts)))}`
  const fallback = formatPrice(service?.price_from)
  return fallback ? `From ${fallback}` : 'From £30'
}

export function durationLabel(service?: PricedService | null): string {
  const options = pricingOptions(service)
  const durations = options.map((o) => formatDuration(o.d)).filter(Boolean)

  if (durations.length > 0) return Array.from(new Set(durations)).join(' · ')
  return formatDuration(service?.duration) || '60–90 min'
}
