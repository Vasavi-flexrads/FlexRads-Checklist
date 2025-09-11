import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// For demo mode, we can use placeholder values if env vars are missing
const defaultUrl = supabaseUrl || 'https://demo.supabase.co'
const defaultKey = supabaseAnonKey || 'demo-key'

let supabase = null

try {
  supabase = createClient(defaultUrl, defaultKey)
} catch (error) {
  console.warn('Supabase client creation failed, running in demo mode only:', error)
  // Create a mock supabase client for demo mode
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Demo mode only' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Demo mode only' } }),
      signOut: () => Promise.resolve({ error: null })
    }
  }
}

export { supabase }