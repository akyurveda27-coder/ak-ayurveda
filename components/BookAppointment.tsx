'use client'

import { useState, FormEvent } from 'react'

interface BookAppointmentProps {
  services?: string[]
}

const defaultServices = [
  'Panchakarma',
  'Abhyanga',
  'Shirodhara',
  'Herbal Medicine',
  'Diet & Nutrition',
  'Yoga & Pranayama',
  'General Consultation',
]

export default function BookAppointment({ services }: BookAppointmentProps) {
  const serviceList = services && services.length > 0 ? services : defaultServices

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    preferred_date: '',
    message: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      } else {
        setStatus('success')
        setForm({ name: '', phone: '', email: '', service: '', preferred_date: '', message: '' })
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-green-100 bg-white font-body text-sm text-textMain placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200'

  return (
    <section id="book-appointment" className="py-20 md:py-28 bg-[#F5F0E8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-accent text-sm font-body font-semibold tracking-widest uppercase mb-3">
            Get Started
          </span>
          <h2 className="section-title">Book Your Appointment</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Take the first step towards holistic wellness. We&apos;ll confirm your appointment within 24 hours.
          </p>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold text-primary mb-2">Appointment Requested!</h3>
            <p className="font-body text-sage text-base mb-6">
              Thank you! We&apos;ve received your request and will confirm your appointment within 24 hours.
            </p>
            <button onClick={() => setStatus('idle')} className="btn-outline">
              Book Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-sm font-medium text-textMain mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Dr. / Mr. / Ms. Your Name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-textMain mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-sm font-medium text-textMain mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-textMain mb-1.5">
                  Service <span className="text-red-400">*</span>
                </label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select a treatment</option>
                  {serviceList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block font-body text-sm font-medium text-textMain mb-1.5">
                Preferred Date
              </label>
              <input
                type="date"
                name="preferred_date"
                value={form.preferred_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={inputClass}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block font-body text-sm font-medium text-textMain mb-1.5">
                Message / Health Concerns
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Briefly describe your health concerns or questions..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Error */}
            {status === 'error' && (
              <p className="text-red-500 text-sm font-body">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Request Appointment'
              )}
            </button>

            <p className="text-center font-body text-xs text-sage">
              We respect your privacy. Your information is never shared.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
