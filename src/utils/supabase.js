import { createClient } from '@supabase/supabase-js'

// Setup koneksi supabase by Joan
// Jangan dibocorin anjir key nya

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
