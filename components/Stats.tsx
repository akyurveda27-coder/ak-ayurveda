'use client'

import { StatsContent } from '@/lib/types'
import { defaultStats } from '@/lib/defaults'

interface StatsProps {
  content?: StatsContent
}

export default function Stats({ content }: StatsProps) {
  const data = content ?? defaultStats

  const stats = [
    { value: data.stat1_value, label: data.stat1_label },
    { value: data.stat2_value, label: data.stat2_label },
    { value: data.stat3_value, label: data.stat3_label },
    { value: data.stat4_value, label: data.stat4_label },
  ]

  return (
    <section className="bg-primary py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2 group-hover:scale-105 transition-transform duration-200">
                {stat.value}
              </div>
              <div className="font-body text-green-200 text-sm md:text-base font-medium tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
