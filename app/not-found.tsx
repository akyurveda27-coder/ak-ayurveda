import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      {/* Logo mark */}
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md mb-6">
        <span className="text-white text-xl font-bold font-display">AK</span>
      </div>

      {/* 404 */}
      <p className="font-display text-7xl font-bold text-primary/20 leading-none mb-2">404</p>

      {/* Heading */}
      <h1 className="font-display text-3xl font-bold text-primary mb-3">
        Page Not Found
      </h1>

      {/* Subtext */}
      <p className="font-body text-sage text-base max-w-sm mx-auto mb-8 leading-relaxed">
        This path doesn&apos;t exist — but your wellness journey does. Let&apos;s get you back on track.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
        <Link
          href="/"
          className="btn-primary text-center px-8 py-3"
        >
          ← Back to Home
        </Link>
        <Link
          href="/#book-appointment"
          className="btn-outline text-center px-8 py-3"
        >
          Book Appointment
        </Link>
      </div>

      {/* Decorative leaf */}
      <div className="mt-16 text-5xl opacity-20 select-none" aria-hidden="true">🌿</div>
    </main>
  )
}
