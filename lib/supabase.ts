import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dgppbgbawwzkofwbjzsg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncHBiZ2Jhd3d6a29md2JqenNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MTY1NzAsImV4cCI6MjA5OTE5MjU3MH0.sYxvlE0OGa2JH4blhuopP7crmyP82EiTIv1GPB-yj3Q'

// Hardcoded fallbacks so build never fails due to missing env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

// Public client — for frontend reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — for API routes (bypasses RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
