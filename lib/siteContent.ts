import { supabase } from './supabase'
import { defaultContact, defaultFAQs } from './defaults'
import type { ContactContent, FAQ } from './types'

// Shared server-side readers, so every page shows the same admin-managed values
// instead of its own hardcoded copy.

export async function getContactContent(): Promise<ContactContent> {
  try {
    const { data } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'contact')
      .single()

    return data?.value ? { ...defaultContact, ...(data.value as ContactContent) } : defaultContact
  } catch {
    return defaultContact
  }
}

export async function getFAQs(): Promise<Pick<FAQ, 'question' | 'answer'>[]> {
  try {
    const { data } = await supabase
      .from('faqs')
      .select('question, answer')
      .order('sort_order', { ascending: true })

    return data && data.length > 0 ? data : defaultFAQs
  } catch {
    return defaultFAQs
  }
}

// "Mon–Sat: 9:00 AM – 7:00 PM\nSun: Closed" → a single readable line.
export function formatHours(hours?: string): string {
  return (hours ?? '').split('\n').map((l) => l.trim()).filter(Boolean).join(' · ')
}

export function telHref(phone?: string): string {
  return `tel:${String(phone ?? '').replace(/[^\d+]/g, '')}`
}
