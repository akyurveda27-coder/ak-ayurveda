'use client'
import Link from 'next/link'

const quickLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Appointment', href: '/book' },
]

const contact = [
  { icon: '📍', text: '42, Ayurveda Lane, London, UK' },
  { icon: '📞', text: '+44 20 7946 0958', href: 'tel:+442079460958' },
  { icon: '✉️', text: 'care@akayurveda.co.uk', href: 'mailto:care@akayurveda.co.uk' },
  { icon: '🕐', text: 'Mon–Sat: 9AM–7PM' },
]

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-[#0F3D34] py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-3 md:px-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-[#0F3D34]">
              AK
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-semibold text-white">AK Ayurveda</span>
              <span className="block text-[10px] tracking-widest text-white/60">HEALING CLINIC</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Authentic Ayurvedic wellness rooted in 5,000 years of Vedic wisdom. Supporting the body, calming the mind, nourishing the soul.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-lg font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-lg font-semibold text-white">Contact Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {contact.map((item) => (
              <li key={item.text}>
                {item.href ? (
                  <a href={item.href} className="transition hover:text-accent">
                    {item.icon} {item.text}
                  </a>
                ) : (
                  <span>{item.icon} {item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-6 pt-8 text-xs text-white/40 md:flex-row md:px-10">
        <p>© {new Date().getFullYear()} AK Ayurveda. All rights reserved.</p>
        <p>Designed for holistic wellness.</p>
      </div>
    </footer>
  )
}
