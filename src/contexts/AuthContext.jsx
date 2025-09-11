import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext({})

// Demo mode - set to true for demo login
const DEMO_MODE = false

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (DEMO_MODE) {
      // In demo mode, check if user was previously logged in
      const demoUser = localStorage.getItem('demo-user')
      if (demoUser) {
        setUser(JSON.parse(demoUser))
      }
      setLoading(false)
      return
    }

    // Get initial session from Supabase
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (DEMO_MODE) {
      // Demo mode - accept any credentials
      if (email && password) {
        const demoUser = {
          id: 'demo-user-id',
          email: email,
          user_metadata: {
            full_name: 'Demo User'
          }
        }
        setUser(demoUser)
        localStorage.setItem('demo-user', JSON.stringify(demoUser))
        return { data: { user: demoUser }, error: null }
      } else {
        return { data: null, error: { message: 'Please enter email and password' } }
      }
    }

    // Real Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    if (DEMO_MODE) {
      // In demo mode, sign up is same as sign in
      return signIn(email, password)
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    if (DEMO_MODE) {
      setUser(null)
      localStorage.removeItem('demo-user')
      return { error: null }
    }

    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}