'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: 'N/A',
          service: 'General Enquiry',
          message: form.message,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-2xl px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <p
            className="font-display text-sm tracking-[0.2em] uppercase mb-2"
            style={{ color: '#D4A853' }}
          >
            ✦ Quick Message ✦
          </p>
          <h2
            className="font-display text-3xl md:text-4xl font-semibold"
            style={{ color: '#0F3D34' }}
          >
            Send Us a Message
          </h2>
          <p className="mt-3 font-body text-gray-500 text-sm">
            We&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="name"
                className="block font-body text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5"
              >
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': '#1B6E5C40' } as React.CSSProperties}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block font-body text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': '#1B6E5C40' } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block font-body text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us how we can help you…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-body text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
              style={{ '--tw-ring-color': '#1B6E5C40' } as React.CSSProperties}
            />
          </div>

          {/* Status messages */}
          {status === 'sent' && (
            <p className="text-sm font-body font-medium" style={{ color: '#1B6E5C' }}>
              ✓ Message sent! We&apos;ll be in touch soon.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm font-body font-medium text-red-500">
              Something went wrong. Please try again or call us directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3.5 rounded-xl font-body font-medium text-sm text-white transition-all disabled:opacity-60"
            style={{ background: status === 'sending' ? '#1B6E5C99' : '#1B6E5C' }}
          >
            {status === 'sending' ? 'Sending…' : 'Send Message →'}
          </button>
        </form>
      </div>
    </section>
  )
}
