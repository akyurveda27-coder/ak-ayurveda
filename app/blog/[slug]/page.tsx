import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
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
  published: boolean
  published_at: string | null
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) return { title: 'Article Not Found — AK Ayurveda' }
  return {
    title: `${blog.title} — AK Ayurveda`,
    description: blog.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [blog, contact] = await Promise.all([getBlogBySlug(params.slug), getContact()])

  if (!blog) notFound()

  return (
    <main>
      <Navbar />

      <article className="bg-background min-h-screen">
        {/* Hero */}
        <div className="bg-primary pt-28 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-green-300 hover:text-white font-body text-sm transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Journal
            </Link>

            {blog.category && (
              <span className="inline-block text-xs font-body font-semibold tracking-widest text-accent uppercase mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="font-body text-green-200 text-lg leading-relaxed">
                {blog.excerpt}
              </p>
            )}
            {blog.published_at && (
              <p className="font-body text-green-300 text-sm mt-4">
                Published{' '}
                {new Date(blog.published_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="max-w-4xl mx-auto px-4 -mt-10 mb-10">
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={blog.image_url}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 pb-20">
          {blog.content ? (
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-display prose-headings:text-primary
                prose-p:font-body prose-p:text-sage prose-p:leading-relaxed
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-primary prose-strong:font-semibold
                prose-ul:text-sage prose-ol:text-sage
                prose-blockquote:border-l-accent prose-blockquote:text-sage prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-sage text-lg">Full article content coming soon.</p>
            </div>
          )}

          {/* Footer nav */}
          <div className="mt-16 pt-8 border-t border-green-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Articles
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-body text-sm font-medium hover:bg-primaryDark transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </article>

      <Footer contact={contact ?? undefined} />
    </main>
  )
}
