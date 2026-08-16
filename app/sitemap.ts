import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dgppbgbawwzkofwbjzsg.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncHBiZ2Jhd3d6a29md2JqenNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTY1NzAsImV4cCI6MjA5OTE5MjU3MH0.sYxvlE0OGa2JH4blhuopP7crmyP82EiTIv1GPB-yj3Q'

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://ak-ayurveda.vercel.app'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/conditions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/book`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  // Fetch blog slugs
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, created_at')
    .eq('published', true)

  const blogPages: MetadataRoute.Sitemap = (blogs ?? []).map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Fetch service names → slugs
  const { data: services } = await supabase
    .from('services')
    .select('name')

  const servicePages: MetadataRoute.Sitemap = (services ?? []).map((s) => ({
    url: `${base}/services/${toSlug(s.name)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages, ...servicePages]
}
