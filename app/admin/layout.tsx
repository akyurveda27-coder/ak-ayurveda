import type { Metadata } from 'next'

// The admin panel must never appear in search results.
export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
