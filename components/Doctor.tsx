'use client'

import Image from 'next/image'
import { DoctorContent } from '@/lib/types'
import { defaultDoctor } from '@/lib/defaults'

interface DoctorProps {
  content?: DoctorContent
}

export default function Doctor({ content }: DoctorProps) {
  const data = content ?? defaultDoctor

  const credentials = [
    { icon: '🎓', label: data.degree },
    { icon: '⏱️', label: data.experience },
    { icon: '🌿', label: data.specialization },
  ]

  return (
    <section id="doctor" className="py-20 md:py-28 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={data.photo_url}
                alt={data.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <p className="font-display font-bold text-primary text-lg">{data.name}</p>
                <p className="font-body text-sage text-sm">{data.title}</p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-accent/20 -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-primary/10 -z-10" />
          </div>

          {/* Content */}
          <div>
            <span className="inline-block text-accent text-sm font-body font-semibold tracking-widest uppercase mb-3">
              Meet Your Doctor
            </span>
            <h2 className="section-title mb-2">{data.name}</h2>
            <p className="font-body text-accent font-semibold text-base mb-6">{data.degree} · {data.title}</p>

            <p className="font-body text-sage leading-relaxed text-base mb-8">{data.bio}</p>

            {/* Credentials */}
            <div className="flex flex-col gap-4 mb-8">
              {credentials.map((cred, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{cred.icon}</span>
                  <span className="font-body text-textMain text-sm">{cred.label}</span>
                </div>
              ))}
            </div>

            <a href="#book-appointment" className="btn-primary inline-flex items-center gap-2">
              Book a Consultation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
