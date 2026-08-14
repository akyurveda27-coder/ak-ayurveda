import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ContactContent } from '@/lib/types'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  image_url: string | null
  category: string | null
  published_at: string | null
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const { data } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, image_url, category, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
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

export default async function BlogPage() {
  const [blogs, contact] = await Promise.all([getBlogs(), getContact()])

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

      {/* Blog grid */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {blogs.length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-50 flex flex-col group"
                >
                  <div className="relative h-52 overflow-hidden">
                    {blog.image_url ? (
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-sage/20 flex items-center justify-center">
                        <span className="text-5xl opacity-40">🌿</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {blog.category && (
                        <span className="text-xs font-body font-semibold text-accent uppercase tracking-wide">
                          {blog.category}
                        </span>
                      )}
                      {blog.published_at && (
                        <span className="text-xs font-body text-sage">
                          {new Date(blog.published_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display font-semibold text-primary text-xl leading-snug mb-3 line-clamp-2">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="font-body text-sage text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary hover:text-accent transition-colors mt-auto"
                    >
                      Read Article
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer contact={contact ?? undefined} />
    </main>
  )
}
