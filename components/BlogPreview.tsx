'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  image_url: string | null
  category: string | null
  published: boolean
  published_at: string | null
}

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('blogs')
      .select('id, title, slug, excerpt, image_url, category, published, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setBlogs((data ?? []) as Blog[])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="bg-background py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 bg-green-100 rounded-lg animate-pulse mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-green-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-green-50 rounded w-1/3" />
                  <div className="h-5 bg-green-100 rounded w-4/5" />
                  <div className="h-4 bg-green-50 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Empty state
  if (blogs.length === 0) {
    return (
      <section className="bg-background py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block text-xs font-body font-semibold tracking-widest text-accent uppercase mb-3">
            Our Journal
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            Coming Soon
          </h2>
          <p className="font-body text-sage text-lg max-w-md mx-auto mb-8">
            We&apos;re busy writing thoughtful articles on Ayurveda, wellbeing, and holistic living.
            Check back soon — our journal is almost ready.
          </p>
          <div className="w-24 h-1 bg-accent rounded-full mx-auto" />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-body font-semibold tracking-widest text-accent uppercase mb-3">
              Our Journal
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary">
              Wisdom &amp; Wellbeing
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary hover:text-accent transition-colors shrink-0"
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-50 flex flex-col group"
            >
              {/* Image / Placeholder */}
              <div className="relative h-48 overflow-hidden">
                {blog.image_url ? (
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-sage/20 flex items-center justify-center">
                    <span className="text-4xl opacity-40">🌿</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {blog.category && (
                  <span className="inline-block text-xs font-body font-semibold text-accent uppercase tracking-wide mb-2">
                    {blog.category}
                  </span>
                )}
                <h3 className="font-display font-semibold text-primary text-lg leading-snug mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="font-body text-sage text-sm leading-relaxed mb-4 flex-1">
                    {blog.excerpt.length > 100 ? blog.excerpt.slice(0, 100) + '…' : blog.excerpt}
                  </p>
                )}
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary hover:text-accent transition-colors mt-auto"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
