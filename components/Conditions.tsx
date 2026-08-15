'use client'

const conditions = [
  { icon: '😴', name: 'Sleep & Relaxation' },
  { icon: '🦴', name: 'Joint & Muscle Comfort' },
  { icon: '🧘', name: 'Stress & Balance' },
  { icon: '✨', name: 'Skin & Vitality' },
  { icon: '🍃', name: 'Digestive Wellbeing' },
  { icon: '💪', name: 'Energy & Immunity' },
  { icon: '🧠', name: 'Mental Clarity' },
  { icon: '🌸', name: "Women's Wellness" },
]

export default function Conditions() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">Wellness Areas</span>
        <h2 className="mt-3 font-display text-4xl font-semibold text-primary md:text-5xl">
          Conditions We Support
        </h2>
        <p className="mt-4 text-[17px] text-gray-600">
          We offer a range of traditional Ayurvedic wellness therapies to support your everyday health and wellbeing.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {conditions.map((c) => (
          <div
            key={c.name}
            className="rounded-xl border border-[#D0EDE6] bg-white px-5 py-6 text-center shadow-sm transition hover:shadow-md"
          >
            <div className="text-2xl">{c.icon}</div>
            <p className="mt-2 text-sm font-medium text-[#1A1A1A]">{c.name}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">Not sure if Ayurveda is right for you?</p>
        <a
          href="/book"
          className="mt-4 inline-block rounded-full border-2 border-primary px-7 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
        >
          Book a Consultation
        </a>
      </div>
    </div>
  )
}
