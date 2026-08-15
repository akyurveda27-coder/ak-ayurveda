'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ContactContent } from '@/lib/types'

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

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [contact, setContact] = useState<ContactContent | undefined>(undefined)
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase
        .from('blogs')
        .select('id, title, slug, excerpt, content, image_url, category, created_at')
        .eq('published', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('site_content')
        .select('value')
        .eq('key', 'contact')
        .single(),
    ]).then(([blogsRes, contactRes]) => {
      setBlogs((blogsRes.data ?? []) as Blog[])
      setContact((contactRes.data?.value as ContactContent) ?? undefined)
      setLoading(false)
    })
  }, [])

  const filtered =
    activeCategory === 'All'
      ? blogs
      : blogs.filter((b) => b.category === activeCategory)

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-primary pt-28 pb-16 px-4 text-center">
        <span className="inline-block text-xs font-body font-semibold tracking-widest text-accent uppercase mb-3">
          Our Journal
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
          Wisdom &amp; Wellbeing
        </h1>
        <p className="font-body text-green-200 text-lg max-w-xl mx-auto">
          Articles on Ayurveda, holistic health, and the ancient science of living well.
        </p>
      </section>

      {/* Category filter */}
      {!loading && blogs.length > 0 && (
        <section className="bg-white border-b border-green-50 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                    activeCategory === cat
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-sage border-green-100 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-green-200' : 'text-gray-400'}`}>
                      ({blogs.filter((b) => b.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog grid */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌿</div>
              <h2 className="font-display text-3xl font-bold text-primary mb-3">Coming Soon</h2>
              <p className="font-body text-sage text-lg max-w-md mx-auto">
                Our journal is being lovingly written. Check back soon for articles on Ayurveda and holistic wellbeing.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-8 bg-primary text-white px-6 py-3 rounded-full font-body text-sm font-medium hover:bg-primaryDark transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-sage text-lg">No articles in this category yet.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="mt-4 text-primary font-body text-sm font-medium hover:underline"
              >
                View all articles →
              </button>
            </div>
          ) : (
            <>
              {/* Result count */}
              <p className="font-body text-sage text-sm mb-6">
                Showing <strong className="text-primary">{filtered.length}</strong>{' '}
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
                      {/* Image / Placeholder */}
                      <div className="relative h-48 overflow-hidden">
                        {blog.image_url ? (
                          <Image
                            src={blog.image_url}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <span className="text-5xl opacity-30">🌿</span>
                          </div>
                        )}
                        {/* Category badge overlay */}
                        {blog.category && (
                          <div className="absolute top-3 left-3">
                            <span className={`inline-block text-xs font-body font-semibold px-2.5 py-1 rounded-full ${catColor}`}>
                              {blog.category}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        {/* Meta row */}
                        <div className="flex items-center gap-3 mb-2.5">
                          {blog.created_at && (
                            <span className="text-xs font-body text-sage">
                              {new Date(blog.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                          <span className="text-sage opacity-30 text-xs">•</span>
                          <span className="text-xs font-body text-sage flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                            </svg>
                            {readTime} min read
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-display font-semibold text-primary text-lg leading-snug mb-2.5 line-clamp-2 group-hover:text-accent transition-colors">
                          {blog.title}
                        </h2>

                        {/* Excerpt */}
                        {blog.excerpt && (
                          <p className="font-body text-sage text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                            {blog.excerpt}
                          </p>
                        )}

                        {/* Read more */}
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-primary hover:text-accent transition-colors mt-auto group/link"
                        >
                          Read Article
                          <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
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

      <Footer contact={contact} />
    </main>
  )
}
