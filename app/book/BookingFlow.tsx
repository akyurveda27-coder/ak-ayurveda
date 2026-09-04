'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Service, TimeSlot } from '@/lib/types'
import { pricingOptions, formatDuration, formatPrice, type PricingOption } from '@/lib/pricing'

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

/** Returns Mon=0 … Sun=6 offset for the first day of month */
function getMonthOffset(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function toYYYYMMDD(d: Date) {
  return d.toISOString().split('T')[0]
}

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function formatDisplayTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

function formatDisplayDate(d: string) {
  const date = new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── ICS download ─────────────────────────────────────────────────────────────

function downloadICS(slot: TimeSlot, serviceName: string) {
  const fmtDT = (date: string, time: string) =>
    date.replace(/-/g, '') + 'T' + time.replace(/:/g, '').slice(0, 6)

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AK Ayurveda//Booking//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmtDT(slot.date, slot.start_time)}`,
    `DTEND:${fmtDT(slot.date, slot.end_time)}`,
    `SUMMARY:AK Ayurveda — ${serviceName}`,
    'LOCATION:AK Ayurveda\\, London\\, UK',
    'DESCRIPTION:Your Ayurvedic appointment at AK Ayurveda.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ak-ayurveda-appointment.ics'
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ['Service', 'Date & Time', 'Your Details', 'Confirmed']
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
      {steps.map((label, i) => {
        const num = i + 1
        const active = num === step
        const done = num < step
        return (
          <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#1B6E5C' : active ? '#0F3D34' : '#E0F0EB',
                color: done || active ? '#fff' : '#9CA3AF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                border: active ? '2px solid #D4A853' : 'none',
                transition: 'all 0.2s',
              }}>
                {done ? '✓' : num}
              </div>
              <span style={{
                fontSize: 11, fontWeight: active ? 700 : 500,
                color: active ? '#0F3D34' : done ? '#1B6E5C' : '#9CA3AF',
                whiteSpace: 'nowrap',
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 40, height: 2, background: done ? '#1B6E5C' : '#E0F0EB',
                margin: '0 4px', marginBottom: 20, flexShrink: 0,
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Service Selection ────────────────────────────────────────────────

function ServiceStep({
  services,
  onSelect,
}: {
  services: Service[]
  onSelect: (s: Service) => void
}) {
  return (
    <div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 28, color: '#0F3D34', marginBottom: 8, fontWeight: 700 }}>
        Choose Your Treatment
      </h2>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>
        Select the Ayurvedic treatment you&apos;d like to book.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '16px', borderRadius: 14,
              border: '1.5px solid #D0EDE6',
              background: '#FAFFFE', cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1B6E5C'
              e.currentTarget.style.background = '#F0FAF7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D0EDE6'
              e.currentTarget.style.background = '#FAFFFE'
            }}
          >
            <span style={{ fontSize: 28, marginBottom: 8 }}>{s.icon || '🌿'}</span>
            <span style={{ fontWeight: 700, color: '#0F3D34', fontSize: 14, marginBottom: 4 }}>{s.name}</span>
            <span style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.4 }}>
              {s.description?.slice(0, 60)}{s.description && s.description.length > 60 ? '…' : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Pre-select the option a treatment page sent over; auto-select when there is only one.
function matchOption(service: Service | null, duration: string | null, price: string | null): PricingOption | null {
  const options = pricingOptions(service)
  if (options.length === 0) return null

  const wanted = options.find(
    (o) =>
      (duration && formatDuration(o.d) === formatDuration(duration)) ||
      (price && formatPrice(o.p) === formatPrice(price))
  )
  if (wanted) return wanted
  return options.length === 1 ? options[0] : null
}

// ─── Step 2a: Session option (duration + price) ──────────────────────────────

function OptionStep({
  options,
  selectedOption,
  onSelect,
}: {
  options: PricingOption[]
  selectedOption: PricingOption | null
  onSelect: (o: PricingOption) => void
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, color: '#0F3D34', marginBottom: 4, fontWeight: 700 }}>
        Choose Your Session
      </h3>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 14 }}>
        Pick the length of your treatment.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {options.map((o, i) => {
          const active = selectedOption === o
          return (
            <button
              key={i}
              onClick={() => onSelect(o)}
              style={{
                padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
                border: `1.5px solid ${active ? '#1B6E5C' : '#D0EDE6'}`,
                background: active ? '#F0FAF7' : '#fff',
                textAlign: 'left', minWidth: 140,
              }}
            >
              <span style={{ display: 'block', fontWeight: 700, color: '#0F3D34', fontSize: 15 }}>
                {formatDuration(o.d) || 'Session'}
              </span>
              {formatPrice(o.p) && (
                <span style={{ display: 'block', color: '#1B6E5C', fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                  {formatPrice(o.p)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 2: Date & Slot picker ───────────────────────────────────────────────

function DateSlotStep({
  selectedDate,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
}: {
  selectedDate: string | null
  selectedSlot: TimeSlot | null
  onDateSelect: (d: string) => void
  onSlotSelect: (s: TimeSlot) => void
}) {
  const today = toYYYYMMDD(new Date())
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [loadingDates, setLoadingDates] = useState(false)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const fetchAvailableDates = useCallback(async (year: number, month: number) => {
    setLoadingDates(true)
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    try {
      const res = await fetch(`/api/slots/available-dates?month=${monthStr}`)
      const json = await res.json()
      setAvailableDates(json.dates ?? [])
    } catch {
      setAvailableDates([])
    } finally {
      setLoadingDates(false)
    }
  }, [])

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true)
    setSlots([])
    try {
      const res = await fetch(`/api/slots?date=${date}`)
      const json = await res.json()
      setSlots(json.slots ?? [])
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    fetchAvailableDates(calMonth.year, calMonth.month)
  }, [calMonth, fetchAvailableDates])

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate)
  }, [selectedDate, fetchSlots])

  const prevMonth = () => {
    setCalMonth((p) => {
      if (p.month === 0) return { year: p.year - 1, month: 11 }
      return { year: p.year, month: p.month - 1 }
    })
  }
  const nextMonth = () => {
    setCalMonth((p) => {
      if (p.month === 11) return { year: p.year + 1, month: 0 }
      return { year: p.year, month: p.month + 1 }
    })
  }

  const daysInMonth = getDaysInMonth(calMonth.year, calMonth.month)
  const offset = getMonthOffset(calMonth.year, calMonth.month)
  const cells = Array.from({ length: offset + daysInMonth }, (_, i) => {
    if (i < offset) return null
    return i - offset + 1
  })

  const availableCount = slots.filter((s) => !s.is_booked && !s.is_blocked).length

  return (
    <div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 28, color: '#0F3D34', marginBottom: 8, fontWeight: 700 }}>
        Pick a Date & Time
      </h2>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 24 }}>
        Green dates have available slots. Select one to see times.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── Calendar ── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #D0EDE6', padding: 20 }}>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <button
              onClick={prevMonth}
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: '1.5px solid #D0EDE6', background: '#F0FAF7',
                cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >‹</button>
            <span style={{ fontWeight: 700, color: '#0F3D34', fontSize: 15 }}>
              {MONTH_NAMES[calMonth.month]} {calMonth.year}
              {loadingDates && <span style={{ color: '#9CA3AF', fontSize: 12, marginLeft: 6 }}>…</span>}
            </span>
            <button
              onClick={nextMonth}
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: '1.5px solid #D0EDE6', background: '#F0FAF7',
                cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >›</button>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAY_LABELS.map((d) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', fontWeight: 700, padding: '4px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isPast = dateStr < today
              const isToday = dateStr === today
              const isAvailable = availableDates.includes(dateStr)
              const isSelected = dateStr === selectedDate
              const isClickable = isAvailable && !isPast

              return (
                <button
                  key={day}
                  disabled={!isClickable}
                  onClick={() => { if (isClickable) onDateSelect(dateStr) }}
                  style={{
                    minHeight: 36, borderRadius: 8, fontSize: 13, fontWeight: isSelected ? 700 : 500,
                    border: isToday ? '2px solid #D4A853' : isSelected ? '2px solid #0F3D34' : '1.5px solid transparent',
                    background: isSelected ? '#0F3D34' : isAvailable && !isPast ? '#D0EDE6' : 'transparent',
                    color: isSelected ? '#fff' : isPast ? '#D1D5DB' : isAvailable ? '#0F3D34' : '#6B7280',
                    cursor: isClickable ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.1s',
                  }}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: '#D0EDE6' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: '#0F3D34' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>Selected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, border: '2px solid #D4A853', background: 'transparent' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>Today</span>
            </div>
          </div>
        </div>

        {/* ── Slots ── */}
        <div>
          {!selectedDate ? (
            <div style={{
              background: '#F0FAF7', borderRadius: 16, border: '1.5px solid #D0EDE6',
              padding: 24, textAlign: 'center', minHeight: 200,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 32 }}>📅</span>
              <p style={{ color: '#6B7280', fontSize: 14 }}>Select a date to see available time slots</p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontWeight: 700, color: '#0F3D34', fontSize: 14, marginBottom: 2 }}>
                  {formatDisplayDate(selectedDate)}
                </p>
                {!loadingSlots && (
                  <p style={{ color: availableCount > 0 ? '#1B6E5C' : '#EF4444', fontSize: 13 }}>
                    {availableCount > 0
                      ? `${availableCount} slot${availableCount !== 1 ? 's' : ''} available`
                      : 'No slots available — try another date'}
                  </p>
                )}
              </div>

              {loadingSlots ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[1,2,3,4,5,6].map((n) => (
                    <div key={n} style={{ height: 44, borderRadius: 10, background: '#F0FAF7', animation: 'pulse 1.5s infinite' }} />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div style={{
                  background: '#FEF2F2', borderRadius: 12, padding: 20, textAlign: 'center',
                  border: '1px solid #FECACA',
                }}>
                  <p style={{ color: '#EF4444', fontSize: 14 }}>No slots found for this date.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}
                  className="slots-grid"
                >
                  {slots.map((slot) => {
                    const isBooked = slot.is_booked || slot.is_blocked
                    const isSelected = selectedSlot?.id === slot.id

                    return (
                      <button
                        key={slot.id}
                        disabled={isBooked}
                        onClick={() => !isBooked && onSlotSelect(slot)}
                        style={{
                          padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                          border: isSelected ? '2px solid #0F3D34' : '1.5px solid ' + (isBooked ? '#E5E7EB' : '#D0EDE6'),
                          background: isSelected ? '#0F3D34' : isBooked ? '#F9FAFB' : '#F0FAF7',
                          color: isSelected ? '#fff' : isBooked ? '#D1D5DB' : '#1B6E5C',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          textDecoration: isBooked ? 'line-through' : 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                          minHeight: 44, transition: 'all 0.1s',
                        }}
                      >
                        {isSelected && <span>✓</span>}
                        {formatDisplayTime(slot.start_time)}
                      </button>
                    )
                  })}
                </div>
              )}

              {selectedSlot && (
                <div style={{
                  marginTop: 16, padding: '12px 16px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #F0FAF7, #E8F7F2)',
                  border: '1.5px solid #1B6E5C',
                }}>
                  <p style={{ fontSize: 13, color: '#0F3D34', fontWeight: 700, marginBottom: 2 }}>✓ Selected</p>
                  <p style={{ fontSize: 14, color: '#1B6E5C', fontWeight: 600 }}>
                    {formatDisplayTime(selectedSlot.start_time)} – {formatDisplayTime(selectedSlot.end_time)}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{formatDisplayDate(selectedDate)}</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Responsive: stacked on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .slots-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .slots-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

// ─── Step 3: Contact form ─────────────────────────────────────────────────────

function ContactStep({
  selectedService,
  selectedOption,
  selectedSlot,
  selectedDate,
  onSubmit,
  submitting,
  submitError,
}: {
  selectedService: Service | null
  selectedOption: PricingOption | null
  selectedSlot: TimeSlot | null
  selectedDate: string | null
  onSubmit: (form: { name: string; email: string; phone: string; notes: string }) => void
  submitting: boolean
  submitError: string
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })

  useEffect(() => {
    // Pre-fill from sessionStorage if recent (from service pages)
    try {
      const ts = parseInt(sessionStorage.getItem('book_ts') ?? '0')
      if (Date.now() - ts < 5 * 60 * 1000) {
        const name = sessionStorage.getItem('book_name') ?? ''
        const email = sessionStorage.getItem('book_email') ?? ''
        const phone = sessionStorage.getItem('book_phone') ?? ''
        setForm((p) => ({ ...p, name: name || p.name, email: email || p.email, phone: phone || p.phone }))
      }
    } catch { /* ok */ }
  }, [])

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1.5px solid #D0EDE6', background: '#fff',
    fontSize: 15, color: '#1A1A1A', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'DM Sans, Helvetica Neue, sans-serif',
    transition: 'border-color 0.15s',
  }
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 700,
    color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
    marginBottom: 6,
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 28, color: '#0F3D34', marginBottom: 8, fontWeight: 700 }}>
        Your Details
      </h2>

      {/* Slot confirmation banner */}
      {selectedSlot && selectedDate && (
        <div style={{
          padding: '14px 18px', borderRadius: 12, marginBottom: 20,
          background: 'linear-gradient(135deg, #F0FAF7, #E8F7F2)',
          border: '1.5px solid #1B6E5C',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <p style={{ fontWeight: 700, color: '#0F3D34', fontSize: 14, margin: 0 }}>
              {formatDisplayDate(selectedDate)}
            </p>
            <p style={{ color: '#1B6E5C', fontSize: 13, margin: 0 }}>
              {formatDisplayTime(selectedSlot.start_time)} – {formatDisplayTime(selectedSlot.end_time)}
            </p>
          </div>
          {selectedService && (
            <div style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' }}>
              <span style={{
                background: '#D0EDE6', color: '#0F3D34',
                padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              }}>
                {selectedService.icon} {selectedService.name}
              </span>
              {selectedOption && (
                <span style={{
                  background: '#FDF3DC', color: '#7A5B12',
                  padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                }}>
                  {[formatDuration(selectedOption.d), formatPrice(selectedOption.p)].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hold notice */}
      <div style={{
        padding: '10px 14px', borderRadius: 10, marginBottom: 24,
        background: '#FFFBEB', border: '1.5px solid #FDE68A',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>🔒</span>
        <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>
          Slot held for 10 minutes while you complete this form.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={lbl}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
            <input
              value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your full name" required style={inp}
              onFocus={(e) => (e.target.style.borderColor = '#1B6E5C')}
              onBlur={(e) => (e.target.style.borderColor = '#D0EDE6')}
            />
          </div>
          <div>
            <label style={lbl}>Phone <span style={{ color: '#EF4444' }}>*</span></label>
            <input
              type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+44 7700 000000" required style={inp}
              onFocus={(e) => (e.target.style.borderColor = '#1B6E5C')}
              onBlur={(e) => (e.target.style.borderColor = '#D0EDE6')}
            />
          </div>
        </div>

        <div>
          <label style={lbl}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
          <input
            type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@email.com" required style={{ ...inp, width: '100%' }}
            onFocus={(e) => (e.target.style.borderColor = '#1B6E5C')}
            onBlur={(e) => (e.target.style.borderColor = '#D0EDE6')}
          />
        </div>

        <div>
          <label style={lbl}>Notes / Health Concerns <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
          <textarea
            value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Briefly describe any health concerns, allergies, or questions…"
            rows={4}
            style={{ ...inp, resize: 'vertical' }}
            onFocus={(e) => (e.target.style.borderColor = '#1B6E5C')}
            onBlur={(e) => (e.target.style.borderColor = '#D0EDE6')}
          />
        </div>

        {submitError && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: '#FEF2F2', border: '1px solid #FECACA',
          }}>
            <p style={{ color: '#EF4444', fontSize: 14, margin: 0 }}>⚠️ {submitError}</p>
          </div>
        )}

        <button
          onClick={() => onSubmit(form)}
          disabled={submitting || !form.name || !form.email || !form.phone}
          style={{
            padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700,
            background: submitting || !form.name || !form.email || !form.phone ? '#D1D5DB' : '#1B6E5C',
            color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.15s',
          }}
        >
          {submitting ? (
            <>
              <svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Booking…
            </>
          ) : 'Confirm Booking'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
          We respect your privacy. Your information is never shared.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ─── Step 4: Confirmation ─────────────────────────────────────────────────────

function ConfirmationStep({
  bookingId,
  selectedService,
  selectedSlot,
  selectedDate,
  customerName,
}: {
  bookingId: string
  selectedService: Service | null
  selectedSlot: TimeSlot | null
  selectedDate: string | null
  customerName: string
}) {
  const [confettiDone, setConfettiDone] = useState(false)
  useEffect(() => { setTimeout(() => setConfettiDone(true), 3000) }, [])

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Animated checkmark */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, #1B6E5C, #0F3D34)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
          <path stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 32, color: '#0F3D34', marginBottom: 8, fontWeight: 700 }}>
        You&apos;re Booked, {customerName.split(' ')[0]}! 🌿
      </h2>
      <p style={{ color: '#6B7280', fontSize: 16, marginBottom: 28 }}>
        Your appointment request has been received. We&apos;ll confirm within 24 hours.
      </p>

      {/* Booking card */}
      <div style={{
        background: '#F0FAF7', borderRadius: 20, padding: 28, marginBottom: 24,
        border: '1.5px solid #D0EDE6', textAlign: 'left',
      }}>
        {selectedService && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 28 }}>{selectedService.icon || '🌿'}</span>
            <div>
              <p style={{ fontWeight: 700, color: '#0F3D34', fontSize: 16, margin: 0 }}>{selectedService.name}</p>
              <p style={{ color: '#1B6E5C', fontSize: 13, margin: 0 }}>AK Ayurveda, London</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {selectedDate && (
            <div style={{ padding: '12px 16px', background: '#fff', borderRadius: 12, border: '1px solid #D0EDE6' }}>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Date</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0F3D34', margin: 0 }}>{formatDisplayDate(selectedDate)}</p>
            </div>
          )}
          {selectedSlot && (
            <div style={{ padding: '12px 16px', background: '#fff', borderRadius: 12, border: '1px solid #D0EDE6' }}>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Time</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0F3D34', margin: 0 }}>
                {formatDisplayTime(selectedSlot.start_time)} – {formatDisplayTime(selectedSlot.end_time)}
              </p>
            </div>
          )}
        </div>

        <div style={{
          marginTop: 14, padding: '8px 12px', borderRadius: 8,
          background: 'rgba(27,110,92,0.08)', display: 'inline-block',
        }}>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
            Booking ref: <strong style={{ color: '#0F3D34', fontFamily: 'monospace' }}>{bookingId.slice(0, 8).toUpperCase()}</strong>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {selectedSlot && selectedDate && selectedService && (
          <button
            onClick={() => downloadICS(selectedSlot, selectedService.name)}
            style={{
              padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
              background: '#0F3D34', color: '#D4A853', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            📅 Add to Calendar
          </button>
        )}
        <a
          href="/"
          style={{
            padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: '#F0FAF7', color: '#1B6E5C',
            border: '1.5px solid #D0EDE6', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          ← Back to Home
        </a>
      </div>

      <style>{`@keyframes popIn { 0% { opacity:0; transform:scale(0.5) } 100% { opacity:1; transform:scale(1) } }`}</style>
    </div>
  )
}

// ─── Main BookingFlow ─────────────────────────────────────────────────────────

export default function BookingFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedOption, setSelectedOption] = useState<PricingOption | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [customerName, setCustomerName] = useState('')

  // Load services + check sessionStorage pre-selection
  useEffect(() => {
    supabase.from('services').select('*').order('sort_order').then(({ data }) => {
      const list = (data ?? []) as Service[]
      setServices(list)

      // Check sessionStorage for pre-selected service (from treatment page)
      try {
        const ts = parseInt(sessionStorage.getItem('book_ts') ?? '0')
        const isRecent = Date.now() - ts < 5 * 60 * 1000
        if (isRecent) {
          const svcName = sessionStorage.getItem('book_service')
          if (svcName) {
            const found = list.find((s) => s.name === svcName)
            if (found) {
              setSelectedService(found)
              setSelectedOption(matchOption(found, sessionStorage.getItem('book_duration'), sessionStorage.getItem('book_price')))
              setStep(2) // skip service selection
            }
          }
        }
      } catch { /* ok */ }
    })
  }, [])

  const serviceOptions = pricingOptions(selectedService)
  const needsOption = serviceOptions.length > 0 && !selectedOption

  const handleServiceSelect = (s: Service) => {
    setSelectedService(s)
    setSelectedOption(matchOption(s, null, null))
    setStep(2)
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null) // clear slot when date changes
  }

  const handleContactSubmit = async (form: { name: string; email: string; phone: string; notes: string }) => {
    if (!selectedService || !selectedDate || !selectedSlot) return
    setSubmitting(true)
    setSubmitError('')
    setCustomerName(form.name)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.notes,
          service: selectedService.name,
          preferred_date: selectedDate,
          slot_id: selectedSlot.id,
          selected_duration: selectedOption ? formatDuration(selectedOption.d) : formatDuration(selectedService.duration),
          selected_price: selectedOption ? formatPrice(selectedOption.p) : formatPrice(selectedService.price_from),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setSubmitError(data.error || 'This slot was just taken. Please go back and choose another.')
        } else {
          setSubmitError(data.error || 'Something went wrong. Please try again.')
        }
        return
      }

      setBookingId(data.booking_id || '')
      // Clear sessionStorage
      try {
        ;['book_service','book_duration','book_price','book_ts','book_name','book_email','book_phone'].forEach(
          (k) => sessionStorage.removeItem(k)
        )
      } catch { /* ok */ }

      setStep(4)
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0FAF7' }}>
      {/* Banner */}
      <section style={{ background: '#0F3D34', padding: '40px 16px', textAlign: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4A853' }}>
          Get Started
        </span>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700,
          color: '#fff', margin: '12px 0 8px',
        }}>
          Book Your Appointment
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
          Choose a time that suits you. We&apos;ll confirm within 24 hours.
        </p>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 16px 80px' }}>
        {step < 4 && <StepIndicator step={step} />}

        <div style={{
          background: '#fff', borderRadius: 24,
          boxShadow: '0 2px 24px rgba(27,110,92,0.08)',
          border: '1.5px solid #D0EDE6', padding: 'clamp(20px, 4vw, 40px)',
        }}>
          {step === 1 && (
            <ServiceStep services={services} onSelect={handleServiceSelect} />
          )}

          {step === 2 && (
            <div>
              {/* Service badge + change */}
              {selectedService && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      background: '#D0EDE6', color: '#0F3D34',
                      padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700,
                    }}>
                      {selectedService.icon} {selectedService.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    style={{ fontSize: 12, color: '#1B6E5C', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Change service
                  </button>
                </div>
              )}
              {serviceOptions.length > 0 && (
                <OptionStep
                  options={serviceOptions}
                  selectedOption={selectedOption}
                  onSelect={setSelectedOption}
                />
              )}
              <DateSlotStep
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onDateSelect={handleDateSelect}
                onSlotSelect={handleSlotSelect}
              />
              {selectedSlot && (
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 14 }}>
                  {needsOption && (
                    <span style={{ fontSize: 13, color: '#92400E' }}>
                      Please choose a session length above.
                    </span>
                  )}
                  <button
                    disabled={needsOption}
                    onClick={() => setStep(3)}
                    style={{
                      padding: '12px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                      background: '#1B6E5C', color: '#fff', border: 'none',
                      cursor: needsOption ? 'not-allowed' : 'pointer',
                      opacity: needsOption ? 0.5 : 1,
                    }}
                  >
                    Continue →
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <button
                onClick={() => setStep(2)}
                style={{ fontSize: 13, color: '#1B6E5C', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginBottom: 16 }}
              >
                ← Back to time selection
              </button>
              <ContactStep
                selectedService={selectedService}
                selectedOption={selectedOption}
                selectedSlot={selectedSlot}
                selectedDate={selectedDate}
                onSubmit={handleContactSubmit}
                submitting={submitting}
                submitError={submitError}
              />
            </div>
          )}

          {step === 4 && (
            <ConfirmationStep
              bookingId={bookingId}
              selectedService={selectedService}
              selectedSlot={selectedSlot}
              selectedDate={selectedDate}
              customerName={customerName}
            />
          )}
        </div>
      </div>
    </div>
  )
}
