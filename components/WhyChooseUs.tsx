const cards = [
  {
    emoji: '🌿',
    title: 'Authentic Treatments',
    description:
      'Every therapy follows classical Ayurvedic protocols passed down through generations — no shortcuts, no compromises.',
  },
  {
    emoji: '👩‍⚕️',
    title: 'Personalised Care',
    description:
      'We begin with a thorough Prakriti assessment to craft a treatment plan uniquely tailored to your constitution and needs.',
  },
  {
    emoji: '🏆',
    title: 'Experienced Practitioners',
    description:
      'Our Ayurvedic physicians hold advanced qualifications and bring decades of combined clinical expertise to every consultation.',
  },
  {
    emoji: '🇬🇧',
    title: 'Based in London, UK',
    description:
      'Conveniently located in London, we bring the ancient wellness wisdom of India to the heart of the United Kingdom.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-12 px-4" style={{ background: '#F0FAF7' }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-body font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4A853' }}>
            Why AK Ayurveda
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#0F3D34' }}>
            The AK Difference
          </h2>
        </div>

        {/* Cards grid — 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#D0EDE6] flex flex-row sm:flex-col items-start gap-4 group"
            >
              <div className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-xl" style={{ background: '#E8F5F1' }}>
                {card.emoji}
              </div>
              <div>
                <h3 className="font-display font-semibold text-base leading-snug mb-1" style={{ color: '#0F3D34' }}>
                  {card.title}
                </h3>
                <p className="font-body text-gray-500 text-xs leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
