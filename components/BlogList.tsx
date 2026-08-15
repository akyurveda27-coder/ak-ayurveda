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

const CATEGORY_COLORS: Record<string, string> = {
  'Ayurveda Basics': 'bg-green-100 text-green-800',
  'Treatments': 'bg-emerald-100 text-emerald-800',
  'Skincare': 'bg-rose-100 text-rose-800',
  'Lifestyle': 'bg-amber-100 text-amber-800',
  'Nutrition': 'bg-orange-100 text-orange-800',
  'Seasonal Wellness': 'bg-sky-100 text-sky-800',
}

function estimateReadTime(content: string | null): number {
  if (!content) return 3
  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

export default function BlogList({ blogs }: { blogs: Blog[] }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? blogs
      : blogs.filter((b) => b.category === activeCategory)

  if (blogs.length === 0) {
    return (
      <section className="bg-white py-20 px-4 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h2 className="font-display text-3xl font-bold mb-3" style={{ color: '#1B6E5C' }}>Coming Soon</h2>
        <p className="font-body text-gray-500 text-lg max-w-md mx-auto">
          Our journal is being lovingly written. Check back soon.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 mt-8 text-white px-6 py-3 rounded-full font-body text-sm font-medium transition-colors" style={{ background: '#1B6E5C' }}>
          ← Back to Home
        </Link>
      </section>
    )
  }

  return (
    <>
      {/* Category filter — sticky */}
      <section className="bg-white border-b border-green-50 sticky top-16 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 whitespace-nowrap border"
                style={
                  activeCategory === cat
                    ? { background: '#1B6E5C', color: '#fff', borderColor: '#1B6E5C' }
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

      {/* Blog grid */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-gray-500 text-lg">No articles in this category yet.</p>
              <button onClick={() => setActiveCategory('All')} className="mt-4 font-body text-sm font-medium hover:underline" style={{ color: '#1B6E5C' }}>
                View all articles →
              </button>
            </div>
          ) : (
            <>
              <p className="font-body text-gray-500 text-sm mb-6">
                Showing <strong style={{ color: '#1B6E5C' }}>{filtered.length}</strong>{' '}
                {filtered.length === 1 ? 'article' : 'articles'}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((blog) => {
                  const readTime = estimateReadTime(blog.content)
                  const catColor = blog.category
                    ? (CATEGORY_COLORS[blog.category] ?? 'bg-gray-100 text-gray-700')
                    : 'bg-gray-100 text-gray-700'

                  return (
                    <article
                      key={blog.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-green-50 flex flex-col group hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {blog.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(27,110,92,0.1), rgba(212,168,83,0.1))' }}>
                            <span className="text-5xl opacity-30">🌿</span>
                          </div>
                        )}
                        {blog.category && (
                          <div className="absolute top-3 left-3">
                            <span className={`inline-block text-xs font-body font-semibold px-2.5 py-1 rounded-full ${catColor}`}>
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-2.5">
                          {blog.created_at && (
                            <span className="text-xs font-body text-gray-400">
                              {new Date(blog.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                          <span className="text-gray-300 text-xs">•</span>
                          <span className="text-xs font-body text-gray-400">⏱ {readTime} min read</span>
                        </div>

                        <h2 className="font-display font-semibold text-lg leading-snug mb-2.5 line-clamp-2" style={{ color: '#1B6E5C' }}>
                          {blog.title}
                        </h2>

                        {blog.excerpt && (
                          <p className="font-body text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                            {blog.excerpt}
                          </p>
                        )}

                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-1.5 font-body text-sm font-semibold mt-auto transition-colors"
                          style={{ color: '#1B6E5C' }}
                        >
                          Read Article →
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
