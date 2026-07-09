'use client'

import { useState } from 'react'
import { Testimonial } from '@/lib/types'

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

const defaultTestimonials: Testimonial[] = [
  { id: '1', quote: 'After years of struggling with arthritis, Dr. Anjali\'s Panchakarma treatment gave me my life back. The pain has reduced by 80% and I feel younger than ever.', patient_name: 'Ramesh Nair', city: 'Bengaluru', stars: 5, is_active: true, created_at: '' },
  { id: '2', quote: 'Shirodhara has been transformative for my anxiety. I was skeptical at first, but after 3 sessions, my sleep improved dramatically and I feel genuinely calm.', patient_name: 'Priya Sharma', city: 'Mumbai', stars: 5, is_active: true, created_at: '' },
  { id: '3', quote: 'My digestive issues of 10 years were resolved with a customised herbal regimen and diet plan. The holistic approach here is truly unlike anything I\'ve experienced.', patient_name: 'Kavitha Menon', city: 'Chennai', stars: 5, is_active: true, created_at: '' },
  { id: '4', quote: 'The Abhyanga massage combined with medicated oils has completely transformed my skin. My chronic eczema is 90% better. Dr. Kumar is exceptional.', patient_name: 'Arjun Mehta', city: 'Pune', stars: 5, is_active: true, created_at: '' },
]

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < stars ? 'text-accent' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0)

  const activeTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials.filter((t) => t.is_active)
      : defaultTestimonials

  if (activeTestimonials.length === 0) return null

  const prev = () => setCurrent((c) => (c === 0 ? activeTestimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === activeTestimonials.length - 1 ? 0 : c + 1))

  const t = activeTestimonials[current]

  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-accent text-sm font-body font-semibold tracking-widest uppercase mb-3">
            Patient Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Transformations That Speak
          </h2>
        </div>

        {/* Carousel */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center relative">
          {/* Quote icon */}
          <svg className="w-10 h-10 text-accent/50 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <blockquote className="font-display text-xl md:text-2xl text-white font-light italic leading-relaxed mb-8">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          <div className="flex flex-col items-center gap-2">
            <StarRating stars={t.stars} />
            <p className="font-body font-semibold text-white text-base mt-2">{t.patient_name}</p>
            <p className="font-body text-green-300 text-sm">{t.city}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {activeTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === current ? 'w-6 h-2.5 bg-accent' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
