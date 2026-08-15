'use client'

import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/#about' },
    { label: 'Conditions', href: '/#conditions' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-[#E0F0EB] transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-white/90 backdrop-blur'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-sm font-semibold text-white">
            AK
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-primary">AK Ayurveda</span>
            <span className="block text-[10px] tracking-widest text-gray-500">HEALING CLINIC</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Book CTA */}
        <a
          href="/book"
          className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#155A4A] md:block"
        >
          Book Appointment
        </a>

        {/* Mobile Hamburger */}
        <button
          className="flex flex-col items-center justify-center gap-1.5 p-3 md:hidden min-h-[44px] min-w-[44px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-primary transition-all duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-primary transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-primary transition-all duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-[#E0F0EB] bg-white transition-all duration-300 md:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-4 px-6 py-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-gray-700 transition hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#155A4A]"
          >
            Book Appointment
          </a>
        </div>
      </div>
    </header>
  )
}
