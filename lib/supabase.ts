import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public client — for frontend reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — for API routes (bypasses RLS)
// Uses service role key only on server side; falls back to anon key on client
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
