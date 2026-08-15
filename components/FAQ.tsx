'use client'

const faqs = [
  {
    question: 'What is Ayurveda?',
    answer: 'An ancient holistic wellness tradition developed over 5,000 years ago in India, focused on balancing the body, mind, and spirit through natural therapies and lifestyle practices.',
  },
  {
    question: 'How long does a session take?',
    answer: 'Most sessions run between 45 and 90 minutes, depending on the therapy selected. Your practitioner will advise the ideal duration during your initial consultation.',
  },
  {
    question: 'Is it safe alongside modern healthcare?',
    answer: 'Our therapies are designed to complement your existing routine. We recommend discussing any concerns with your GP, and our practitioners will always ask about your current health before treatment.',
  },
  {
    question: 'How many sessions are recommended?',
    answer: 'This varies by individual. Your practitioner will suggest a personalised plan after your first consultation, taking into account your constitution and wellness goals.',
  },
  {
    question: 'Are online consultations available?',
    answer: 'Yes, we offer online consultations for clients who are unable to visit us in person. Please select "General Consultation" when booking.',
  },
]

export default function FAQ() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">Questions Answered</span>
        <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-[17px] text-gray-600">
          Everything you need to know before starting your Ayurvedic journey with us.
        </p>
      </div>

      {/* Accordion — native details/summary, no JS state needed */}
      <div className="mt-12 space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-[#D0EDE6] bg-white p-6 open:shadow-sm"
            {...(i === 0 ? { open: true } : {})}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-[#1A1A1A]">
              {faq.question}
              <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0FAF7] text-primary transition-transform duration-200 group-open:rotate-180">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
          </details>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 text-center">
        <p className="text-sm text-gray-600">Still have questions?</p>
        <a
          href="tel:+442079460958"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-[#155A4A]"
        >
          📞 Call Us Now
        </a>
      </div>
    </div>
  )
}
