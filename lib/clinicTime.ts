// The clinic runs on London time. Slot dates and times are stored as plain
// local values, so "now" has to be read in that zone (BST is UTC+1 in summer).
export const CLINIC_TIMEZONE = 'Europe/London'

export function londonNow(date: Date = new Date()): { todayStr: string; currentTimeStr: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CLINIC_TIMEZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'

  return {
    todayStr: `${get('year')}-${get('month')}-${get('day')}`,
    currentTimeStr: `${get('hour')}:${get('minute')}`,
  }
}
