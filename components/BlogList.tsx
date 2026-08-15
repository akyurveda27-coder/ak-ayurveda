'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string | null
  image_url: string | null
  category: string | null
  created_at: string | null
}

const CATEGORIES = [
  'All',
  'Ayurveda Basics',
  'Treatments',
  'Skincare',
  'Lifestyle',
  'Nutrition',
  'Seasonal Wellness',
]

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Ayurveda Basics':    { bg: '#dcfce7', color: '#166534' },
  'Treatments':         { bg: '#d1fae5', color: '#065f46' },
  'Skincare':           { bg: '#ffe4e6', color: '#9f1239' },
  'Lifestyle':          { bg: '#fef3c7', color: '#92400e' },
  'Nutrition':          { bg: '#ffedd5', color: '#9a3412' },
  'Seasonal Wellness':  { bg: '#e0f2fe', color: '#075985' },
}

function estimateReadTime(content: string | null): number {
  if (!content) return 3
  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BlogList({ blogs }: { blogs: Blog[] }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? blogs
      : blogs.filter((b) => b.category === activeCategory)

  // ── Zero blogs at all ──────────────────────────────────────────────────────
  if (blogs.length === 0) {
    return (
      <section className="bg-white py-20 px-4 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="font-display text-3xl font-bold mb-3" style={{ color: '#1B6E5C' }}>
          Coming Soon
        </h2>
        <p className="font-body text-gray-500 text-lg max-w-md mx-auto">
          Our journal is being lovingly written. Check back soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 text-white px-6 py-3 rounded-full font-body text-sm font-medium transition-colors"
          style={{ background: '#1B6E5C' }}
        >
          ← Back to Home
        </Link>
      </section>
    )
  }

  const showFeatured = activeCategory === 'All' && filtered.length > 0
  const featured = showFeatured ? filtered[0] : null
  const gridBlogs = showFeatured ? filtered.slice(1) : filtered

  return (
    <>
      {/* ── Category Filter Strip ─────────────────────────────────────────── */}
      <section
        className="bg-white sticky top-16 z-10"
        style={{ borderBottom: '1px solid #D0EDE6' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 whitespace-nowrap border"
                style={
                  activeCategory === cat
                    ? { background: '#0F3D34', color: '#fff', borderColor: '#0F3D34' }
                    : { background: '#fff', color: '#3D8B7A', borderColor: '#D0EDE6' }
                }
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({blogs.filter((b) => b.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Empty state for filtered category */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-gray-500 text-lg">
                No articles in this category yet.
              </p>
              <button
                onClick={() => setActiveCategory('All')}
                className="mt-4 font-body text-sm font-medium hover:underline"
                style={{ color: '#1B6E5C' }}
              >
                View all articles →
              </button>
            </div>
          ) : (
            <>
              {/* Result count */}
              <p className="font-body text-gray-400 text-sm mb-8">
                Showing{' '}
                <strong style={{ color: '#0F3D34' }}>{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'article' : 'articles'}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              </p>

              {/* ── Featured Article ─────────────────────────────────────── */}
              {featured && (
                <article
                  className="rounded-2xl overflow-hidden mb-12 flex flex-col md:flex-row"
                  style={{ background: '#0F3D34' }}
                >
                  {/* Mobile image (top) */}
                  <div className="md:hidden h-56 overflow-hidden">
                    {featured.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: 'radial-gradient(circle, #1B6E5C, #0F3D34)',
                        }}
                      >
                        <span className="text-7xl opacity-40">🌿</span>
                      </div>
                    )}
                  </div>

                  {/* Content — 60% */}
                  <div className="flex-1 p-8 md:p-12 flex flex-col justify-center md:w-3/5">
                    <p
                      className="font-body text-xs font-semibold tracking-widest uppercase mb-4"
                      style={{ color: '#D4A853' }}
                    >
                      ✦ Featured Article ✦
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4 line-clamp-3">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="font-body text-base leading-relaxed mb-6 line-clamp-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {featured.created_at && (
                        <span className="font-body text-sm">{formatDate(featured.created_at)}</span>
                      )}
                      <span className="text-xs">•</span>
                      <span className="font-body text-sm">⏱ {estimateReadTime(featured.content)} min read</span>
                    </div>
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="inline-flex items-center gap-2 font-body text-sm font-bold transition-opacity hover:opacity-80 self-start"
                      style={{ color: '#D4A853' }}
                    >
                      Read Article →
                    </Link>
                  </div>

                  {/* Desktop image — 40%, right corners rounded */}
                  <div className="hidden md:block md:w-2/5 overflow-hidden rounded-r-2xl">
                    {featured.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: 'radial-gradient(circle, #1B6E5C, #0F3D34)',
                        }}
                      >
                        <span className="text-9xl opacity-30">🌿</span>
                      </div>
                    )}
                  </div>
                </article>
              )}

              {/* ── Articles Grid ─────────────────────────────────────────── */}
              {gridBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridBlogs.map((blog) => {
                    const readTime = estimateReadTime(blog.content)
                    const catStyle = blog.category
                      ? (CATEGORY_COLORS[blog.category] ?? { bg: '#f3f4f6', color: '#374151' })
                      : { bg: '#f3f4f6', color: '#374151' }

                    return (
                      <article
                        key={blog.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                      >
                        {/* Image area */}
                        <div className="relative h-52 overflow-hidden">
                          {blog.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={blog.image_url}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center bg-mint"
                            >
                              <span className="text-5xl opacity-30">🌿</span>
                            </div>
                          )}

                          {/* Category badge */}
                          {blog.category && (
                            <div className="absolute top-3 left-3">
                              <span
                                className="inline-block text-xs font-body font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: catStyle.bg, color: catStyle.color }}
                              >
                                {blog.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card content */}
                        <div className="p-6 flex flex-col flex-1">
                          {/* Date + read time */}
                          <div className="flex items-center gap-2 mb-3">
                            {blog.created_at && (
                              <span className="font-body text-xs text-gray-400">
                                {formatDate(blog.created_at)}
                              </span>
                            )}
                            <span className="text-gray-300 text-xs">•</span>
                            <span className="font-body text-xs text-gray-400">
                              ⏱ {readTime} min read
                            </span>
                          </div>

                          {/* Title */}
                          <h2
                            className="font-display text-xl font-semibold leading-snug line-clamp-2 mb-3"
                            style={{ color: '#0F3D34' }}
                          >
                            {blog.title}
                          </h2>

                          {/* Excerpt */}
                          {blog.excerpt && (
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5 flex-1">
                              {blog.excerpt}
                            </p>
                          )}

                          {/* CTA */}
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="inline-flex items-center gap-1.5 font-body text-sm font-semibold mt-auto transition-all hover:underline underline-offset-2"
                            style={{ color: '#D4A853', textDecorationColor: '#D4A853' }}
                          >
                            Read Article →
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
