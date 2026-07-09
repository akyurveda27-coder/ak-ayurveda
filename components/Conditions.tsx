'use client'

import { Condition } from '@/lib/types'
import { defaultConditions } from '@/lib/defaults'

interface ConditionsProps {
  conditions?: Condition[]
}

export default function Conditions({ conditions }: ConditionsProps) {
  const data = conditions && conditions.length > 0
    ? conditions
    : defaultConditions.map((c, i) => ({ ...c, id: String(i) }))

  return (
    <section id="conditions" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-accent text-sm font-body font-semibold tracking-widest uppercase mb-3">
            What We Treat
          </span>
          <h2 className="section-title">Conditions We Heal</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Ayurveda addresses the root cause of disease, not just symptoms. We treat a wide range of chronic and acute conditions.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.map((condition) => (
            <div
              key={condition.id}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-green-50 hover:border-accent/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-colors">
                {condition.icon}
              </div>
              <span className="font-body text-sm font-semibold text-textMain text-center leading-tight">
                {condition.name}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="font-body text-sage text-sm mb-4">Not sure if Ayurveda is right for your condition?</p>
          <a href="#book-appointment" className="btn-outline inline-block">
            Book a Free Consultation
          </a>
        </div>
      </div>
    </section>
  )
}
