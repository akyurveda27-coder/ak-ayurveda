// Canonical public address of the site. Everything Google and social networks
// see (sitemap, canonical URLs, OpenGraph, structured data) must use this.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.akayurveda.co.uk').replace(/\/$/, '')
