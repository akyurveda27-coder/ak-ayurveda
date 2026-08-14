import Link from 'next/link'
import Image from 'next/image'

export default function AboutIntro() {
  return (
    <section className="bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-xs font-body font-semibold tracking-widest text-accent uppercase mb-4">
              Ancient Wisdom · Modern Wellbeing
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary leading-tight mb-6">
              Rooted in 5,000 Years of Vedic Science
            </h2>
            <p className="font-body text-sage text-lg leading-relaxed mb-4">
              AK Ayurveda is London&apos;s trusted Ayurvedic clinic, offering authentic, personalised treatments
              grounded in the ancient science of Ayurveda. Our practitioners bring centuries of Vedic knowledge
              to the heart of the UK, helping you restore balance, vitality, and inner harmony.
            </p>
            <p className="font-body text-sage leading-relaxed mb-8">
              Whether you seek relief from a chronic condition or simply wish to deepen your wellbeing,
              our holistic approach treats the whole person — mind, body, and spirit — using time-tested
              therapies and pure herbal formulations.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-body font-medium text-sm hover:bg-primaryDark transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right — Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
                alt="Authentic Ayurvedic treatment at AK Ayurveda London"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl bg-accent/20 -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-primary/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
