import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B6E5C',
        primaryDark: '#0F3D34',
        accent: '#D4A853',
        background: '#FFFFFF',
        textMain: '#1A1A1A',
        sage: '#3D8B7A',
        mint: '#F0FAF7',
        mintBorder: '#D0EDE6',
        sectionBorder: '#E0F0EB',
      },
      // next/font generates hashed family names and exposes them as these CSS
      // variables; the literal names are never defined, so use the variables.
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        heading: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Helvetica Neue', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        priceIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease forwards',
        float: 'float 4s ease-in-out infinite',
        priceIn: 'priceIn 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
