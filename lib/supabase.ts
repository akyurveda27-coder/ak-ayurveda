import { createClient } from '@supabase/supabase-js'

// No production fallback on purpose: a deployment with missing environment
// variables must fail visibly, never quietly attach itself to another site's
// database. The placeholder host simply cannot resolve to a real project.
const PLACEHOLDER_URL = 'https://supabase-not-configured.invalid'

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!envUrl || !envAnonKey) {
  console.error(
    'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

export const SUPABASE_URL = envUrl || PLACEHOLDER_URL

// Public client — frontend reads, limited by row level security
export const supabase = createClient(SUPABASE_URL, envAnonKey || 'anon-key-not-configured')

// Admin client — server routes only, bypasses row level security
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!serviceKey && typeof window === 'undefined') {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set — admin writes will be rejected.')
}

export const supabaseAdmin = createClient(
  SUPABASE_URL,
  serviceKey || envAnonKey || 'service-key-not-configured'
)
