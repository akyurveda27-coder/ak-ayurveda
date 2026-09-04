import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { SITE_URL } from '@/lib/site'


function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL

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
