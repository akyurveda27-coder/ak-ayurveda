import { getFAQs } from '@/lib/siteContent'

// Questions come from the admin FAQs tab (falling back to the defaults).
export default async function FAQ() {
  const faqs = await getFAQs()

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
      <div className="mt-6 space-y-4">
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


    </div>
  )
}
