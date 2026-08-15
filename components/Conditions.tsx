interface ConditionItem {
  emoji: string
  label: string
  image_url?: string | null
}

export const defaultConditions: ConditionItem[] = [
  { emoji: '😓', label: 'Stress & Anxiety' },
  { emoji: '💤', label: 'Insomnia & Poor Sleep' },
  { emoji: '🔥', label: 'Digestive Issues' },
  { emoji: '🦴', label: 'Joint Pain & Stiffness' },
  { emoji: '🧠', label: 'Mental Fatigue' },
  { emoji: '💆', label: 'Chronic Headaches' },
  { emoji: '⚡', label: 'Low Energy & Fatigue' },
  { emoji: '🌸', label: 'Skin Conditions' },
  { emoji: '⚖️', label: 'Weight Imbalance' },
  { emoji: '🌬️', label: 'Respiratory Issues' },
  { emoji: '💪', label: 'Muscle Tension' },
  { emoji: '🩺', label: 'Hormonal Imbalance' },
]

export default function Conditions({ conditions = defaultConditions }: { conditions?: ConditionItem[] }) {
  const cardItems = conditions.filter((c) => c.image_url)
  const chipItems = conditions.filter((c) => !c.image_url)

  return (
    <div className="mx-auto max-w-7xl px-6">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: '#D4A853' }}
        >
          ✦ Conditions We Support ✦
        </p>
        <h2
          className="mt-3 font-display text-3xl font-semibold md:text-5xl"
          style={{ color: '#0F3D34' }}
        >
          Conditions We Support
        </h2>
        <p className="mt-4 text-[17px] text-gray-600">
          Traditional Ayurvedic therapies tailored to your needs — from stress and sleeplessness to
          chronic pain and hormonal balance.
        </p>
      </div>

      {/* Image Cards — items that have image_url */}
      {cardItems.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {cardItems.map((c) => (
            <div
              key={c.label}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image_url!}
                alt={c.label}
                style={{ height: 180, width: '100%', objectFit: 'cover' }}
                className="rounded-t-2xl"
              />
              <div className="px-4 py-3">
                <p
                  className="font-semibold text-sm"
                  style={{ color: '#0F3D34' }}
                >
                  {c.emoji} {c.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Chips — items without image_url */}
      {chipItems.length > 0 && (
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${cardItems.length > 0 ? 'mt-6' : 'mt-10'}`}>
          {chipItems.map((c) => (
            <span
              key={c.label}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm shadow-sm w-full justify-center"
              style={{ color: '#0F3D34' }}
            >
              <span>{c.emoji}</span>
              <span className="font-medium">{c.label}</span>
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">Not sure if Ayurveda is right for you?</p>
        <a
          href="/book"
          className="mt-4 inline-block rounded-full border-2 px-7 py-3 text-sm font-medium transition hover:opacity-80"
          style={{ color: '#1B6E5C', borderColor: '#1B6E5C' }}
        >
          Book a Consultation
        </a>
      </div>
    </div>
  )
}
