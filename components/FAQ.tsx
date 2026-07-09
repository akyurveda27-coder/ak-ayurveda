'use client'

import { useState } from 'react'
import { FAQ as FAQType } from '@/lib/types'
import { defaultFAQs } from '@/lib/defaults'

interface FAQProps {
  faqs?: FAQType[]
}

export default function FAQ({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const data = faqs && faqs.length > 0
    ? faqs
    : defaultFAQs.map((f, i) => ({ ...f, id: String(i) }))

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-accent text-sm font-body font-semibold tracking-widest uppercase mb-3">
            Questions Answered
          </span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Everything you need to know before starting your Ayurvedic journey with us.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {data.map((faq, index) => (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openIndex === index
                  ? 'border-primary/30 shadow-sm'
                  : 'border-green-100 hover:border-green-200'
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white"
                aria-expanded={openIndex === index}
              >
                <span className="font-body font-semibold text-base text-textMain pr-4">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    openIndex === index ? 'bg-primary text-white rotate-180' : 'bg-green-50 text-primary'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 pt-0 bg-white">
                  <div className="h-px bg-green-50 mb-4" />
                  <p className="font-body text-sage text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="font-body text-sage text-sm mb-3">Still have questions?</p>
          <a href="tel:+919876543210" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Us Now
          </a>
        </div>
      </div>
    </section>
  )
}
