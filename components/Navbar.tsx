'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Conditions', href: '/conditions' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-[#E0F0EB] transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-white/90 backdrop-blur'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-semibold text-white" style={{ background: '#1B6E5C' }}>
            AK
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-medium" style={{ color: '#1B6E5C' }}>AK Ayurveda</span>
            <span className="block text-[9px] tracking-widest text-gray-400">HEALING CLINIC</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-normal text-gray-600 transition hover:text-[#1B6E5C]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side — Search + Book */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search bar */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search treatments..."
                className="w-48 rounded-full border border-[#D0EDE6] px-4 py-1.5 text-sm outline-none focus:border-[#1B6E5C] transition"
              />
              <button type="submit" className="text-sm px-3 py-1.5 rounded-full text-white" style={{ background: '#1B6E5C' }}>
                Go
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1B6E5C] transition px-2 py-1.5"
              aria-label="Search treatments"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span className="text-xs">Search</span>
            </button>
          )}

          <a
            href="/book"
            className="rounded-full px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: '#1B6E5C' }}
          >
            Book Appointment
          </a>
        </div>

        {/* Mobile: search icon + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-gray-500"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-1.5 p-2 min-h-[44px] min-w-[44px]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 transition-all duration-200 ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} style={{ background: '#1B6E5C' }} />
            <span className={`block h-0.5 w-5 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#1B6E5C' }} />
            <span className={`block h-0.5 w-5 transition-all duration-200 ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} style={{ background: '#1B6E5C' }} />
          </button>
        </div>
      </nav>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="border-t border-[#E0F0EB] px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search treatments (e.g. Abhyanga, Shirodhara)..."
              className="flex-1 rounded-full border border-[#D0EDE6] px-4 py-2 text-sm outline-none"
            />
            <button type="submit" className="px-4 py-2 rounded-full text-white text-sm" style={{ background: '#1B6E5C' }}>Search</button>
          </form>
        </div>
      )}

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
              className="text-sm font-normal text-gray-700 transition hover:text-[#1B6E5C]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/book"
            className="mt-1 inline-block rounded-full px-5 py-2.5 text-center text-sm font-medium text-white"
            style={{ background: '#1B6E5C' }}
          >
            Book Appointment
          </a>
        </div>
      </div>
    </header>
  )
}
