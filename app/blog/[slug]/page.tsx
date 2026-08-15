import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

function optimizeUrl(url: string, w: number): string {
  if (!url) return url
  if (url.includes('unsplash.com')) {
    return `${url.split('?')[0]}?w=${w}&q=75&auto=format&fit=crop`
  }
  return url
}
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ContactContent } from '@/lib/types'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  image_url: string | null
  category: string | null
  author: string | null
  published: boolean
  created_at: string | null
}

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

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    return (data as Blog) ?? null
  } catch {
    return null
  }
}

async function getRelatedBlogs(category: string | null, excludeId: string): Promise<Blog[]> {
  if (!category) return []
  try {
    const { data } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, content, image_url, category, created_at')
      .eq('published', true)
      .eq('category', category)
      .neq('id', excludeId)
      .order('created_at', { ascending: false })
      .limit(3)
    return (data ?? []) as Blog[]
  } catch {
    return []
  }
}

async function getContact(): Promise<ContactContent | null> {
  try {
    const { data } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'contact')
      .single()
    return (data?.value as ContactContent) ?? null
  } catch {
    return null
  }
}

export const revalidate = 0

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) return { title: 'Blog | AK Ayurveda' }
  return {
    title: `${blog.title} | AK Ayurveda London`,
    description: blog.excerpt ?? blog.content?.replace(/<[^>]+>/g, '').slice(0, 160),
    keywords: `${blog.category?.toLowerCase() ?? ''}, ayurveda london, ayurvedic wellness uk, ${blog.title.toLowerCase()}`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt ?? '',
      images: blog.image_url ? [{ url: blog.image_url }] : [],
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [blog, contact] = await Promise.all([getBlogBySlug(params.slug), getContact()])

  if (!blog) notFound()

  const [related] = await Promise.all([getRelatedBlogs(blog.category, blog.id)])

  const readTime = estimateReadTime(blog.content)
  const catColor = blog.category
    ? (CATEGORY_COLORS[blog.category] ?? 'bg-gray-100 text-gray-700')
    : null

  return (
    <main>
      <Navbar />

      <article className="bg-white min-h-screen">
        {/* Hero */}
        <div className="pt-20 pb-10 px-4" style={{ background: '#1B6E5C' }}>
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-green-300 hover:text-white font-body text-sm transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Journal
            </Link>

            {/* Category badge */}
            {blog.category && catColor && (
              <span className={`inline-block text-xs font-body font-semibold px-3 py-1 rounded-full mb-4 ${catColor}`}>
                {blog.category}
              </span>
            )}

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="font-body text-green-200 text-lg leading-relaxed mb-5">
                {blog.excerpt}
              </p>
            )}

            {/* Meta row: author · date · read time */}
            <div className="flex flex-wrap items-center gap-4 font-body text-sm text-green-300">
              {(blog.author || 'AK Ayurveda') && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {blog.author ?? 'AK Ayurveda'}
                </span>
              )}
              {blog.created_at && (
                <>
                  <span className="opacity-30">·</span>
                  <span>
                    {new Date(blog.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </>
              )}
              <span className="opacity-30">·</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
                {readTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="max-w-4xl mx-auto px-4 -mt-10 mb-10">
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={optimizeUrl(blog.image_url, 896)}
                alt={blog.title}
                width={896}
                height={384}
                className="w-full h-full object-cover"
                priority={true}
                sizes="(max-width: 1200px) 100vw, 896px"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 pb-8">
          {blog.content ? (
            <div
              className="prose prose-base md:prose-lg max-w-none
              prose-headings:font-display prose-headings:leading-snug
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[#D0EDE6]
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:font-body prose-p:text-[#4a4a4a] prose-p:leading-[1.85] prose-p:mb-5
              prose-strong:font-semibold
              prose-ul:text-[#4a4a4a] prose-ol:text-[#4a4a4a]
              prose-li:mb-2 prose-li:leading-relaxed
              prose-blockquote:border-l-4 prose-blockquote:border-[#D4A853]
              prose-blockquote:bg-[#F0FAF7] prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-lg
              "
              style={{ color: '#4a4a4a' }}
              dangerouslySetInnerHTML={{ __html: blog.content ?? '' }}
            />
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-sage text-lg">Full article content coming soon.</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-10 p-4 bg-green-50 border border-green-100 rounded-xl">
            <p className="font-body text-xs text-sage leading-relaxed">
              <strong className="text-primary">Wellbeing Disclaimer:</strong> The information in this article is for general educational purposes and reflects traditional Ayurvedic knowledge. It is not intended as medical advice. Always consult a qualified healthcare professional before making changes to your health routine or if you have an existing medical condition.
            </p>
          </div>

          {/* Footer nav */}
          <div className="mt-6 pt-6 border-t border-green-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-body text-sm font-medium transition-colors" style={{ color: '#1B6E5C' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Articles
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-body text-sm font-medium transition-colors" style={{ background: '#1B6E5C' }}
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="bg-white border-t border-green-50 py-10 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <span className="inline-block text-xs font-body font-semibold tracking-widest text-accent uppercase mb-3">
                  Keep Reading
                </span>
                <h2 className="font-display text-3xl font-bold text-primary">
                  More in {blog.category}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => {
                  const relReadTime = estimateReadTime(rel.content)
                  const relCatColor = rel.category
                    ? (CATEGORY_COLORS[rel.category] ?? 'bg-gray-100 text-gray-700')
                    : 'bg-gray-100 text-gray-700'
                  return (
                    <article
                      key={rel.id}
                      className="bg-[#F0FAF7] rounded-2xl overflow-hidden border border-teal-50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative h-40 overflow-hidden">
                        {rel.image_url ? (
                          <Image
                            src={optimizeUrl(rel.image_url, 400)}
                            alt={rel.title}
                            width={400}
                            height={160}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <span className="text-4xl opacity-30">🌿</span>
                          </div>
                        )}
                        {rel.category && (
                          <div className="absolute top-2 left-2">
                            <span className={`inline-block text-xs font-body font-semibold px-2 py-0.5 rounded-full ${relCatColor}`}>
                              {rel.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <span className="text-xs font-body text-sage mb-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                          </svg>
                          {relReadTime} min read
                        </span>
                        <h3 className="font-display font-semibold text-primary text-base leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                          {rel.title}
                        </h3>
                        {rel.excerpt && (
                          <p className="font-body text-sage text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
                            {rel.excerpt}
                          </p>
                        )}
                        <Link
                          href={`/blog/${rel.slug}`}
                          className="inline-flex items-center gap-1 font-body text-xs font-semibold text-primary hover:text-accent transition-colors mt-auto"
                        >
                          Read Article
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  )
}
