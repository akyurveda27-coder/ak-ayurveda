'use client'

import { HeroContent } from '@/lib/types'
import { defaultHero } from '@/lib/defaults'

interface HeroProps {
  content?: HeroContent
}

export default function Hero({ content }: HeroProps) {
  const data = content ?? defaultHero

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-20">
      {/* Decorative botanical SVG — top right */}
      <svg
        className="absolute top-16 right-0 w-64 md:w-96 text-primary opacity-5 pointer-events-none"
        viewBox="0 0 400 400"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="300" cy="80" r="120" />
        <circle cx="350" cy="200" r="80" />
        <ellipse cx="200" cy="300" rx="60" ry="120" />
        <circle cx="380" cy="350" r="60" />
      </svg>

      {/* Decorative botanical SVG — bottom left */}
      <svg
        className="absolute bottom-0 left-0 w-48 md:w-72 text-sage opacity-10 pointer-events-none"
        viewBox="0 0 300 300"
        fill="currentColor"
        aria-hidden="true"
      >
        <ellipse cx="50" cy="250" rx="40" ry="100" transform="rotate(-20 50 250)" />
        <ellipse cx="100" cy="220" rx="35" ry="90" transform="rotate(10 100 220)" />
        <ellipse cx="150" cy="260" rx="30" ry="80" transform="rotate(-10 150 260)" />
        <circle cx="80" cy="130" r="25" />
        <circle cx="130" cy="150" r="18" />
      </svg>

      {/* Floating leaf SVG */}
      <svg
        className="absolute top-1/3 right-1/4 w-12 text-accent opacity-20 animate-float pointer-events-none hidden lg:block"
        viewBox="0 0 50 50"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M25 5 C10 15 5 30 25 45 C45 30 40 15 25 5Z" />
        <line x1="25" y1="5" x2="25" y2="45" stroke="white" strokeWidth="1" />
      </svg>

      {/* Accent circle background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary opacity-[0.03] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-1.5 rounded-full text-sm font-body font-medium mb-6 animate-fadeInUp">
          <span>🌿</span>
          <span>Authentic Ayurvedic Medicine</span>
        </div>

        {/* Main heading */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] mb-6 animate-fadeInUp">
          {data.heading}
        </h1>

        {/* Subheading */}
        <p className="font-body text-lg md:text-xl text-sage max-w-2xl mx-auto leading-relaxed mb-10 animate-fadeInUp">
          {data.subheading}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp">
          <a href={data.cta1_link} className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
            {data.cta1_text}
          </a>
          <a href={data.cta2_link} className="btn-outline text-base px-8 py-4 w-full sm:w-auto">
            {data.cta2_text}
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm font-body text-sage animate-fadeInUp">
          <span className="flex items-center gap-2">
            <span className="text-accent">✓</span> Certified Ayurvedic Physicians
          </span>
          <span className="flex items-center gap-2">
            <span className="text-accent">✓</span> 100% Natural Treatments
          </span>
          <span className="flex items-center gap-2">
            <span className="text-accent">✓</span> Personalized Care Plans
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-sage text-xs font-body">Scroll</span>
        <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
