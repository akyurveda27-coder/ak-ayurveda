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
      'Conveniently located in London, we bring the healing wisdom of India to the heart of the United Kingdom.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-primary/5 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-body font-semibold tracking-widest text-accent uppercase mb-3">
            Why AK Ayurveda
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary">
            The AK Difference
          </h2>
        </div>

        {/* Cards grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-50 flex flex-col items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                {card.emoji}
              </div>
              <div>
                <h3 className="font-display font-semibold text-primary text-lg leading-snug mb-2">
                  {card.title}
                </h3>
                <p className="font-body text-sage text-sm leading-relaxed">
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
