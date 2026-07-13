'use client'

// Rider/driver session context for the website. Backed by the spinrvm
// FastAPI backend (see lib/spinr-api.js) — completely separate from the
// admin CMS auth (/spinr-internal, Supabase).
//
// status: 'loading' (initial resume attempt) | 'authed' | 'anon'
// user:   UserProfile from GET /auth/me (includes driver_onboarding_status
//         / _detail / _next_screen when the user is a driver applicant).

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  getMe,
  hasSessionHint,
  logout as apiLogout,
  refreshSession,
} from '@/lib/spinr-api'

const AuthContext = createContext({
  user: null,
  status: 'loading',
  setUser: () => {},
  reload: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')

  const reload = useCallback(async () => {
    try {
      const me = await getMe()
      setUser(me)
      setStatus('authed')
      return me
    } catch {
      setUser(null)
      setStatus('anon')
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function resume() {
      // First-time visitors have no refresh cookie — skip the doomed call.
      if (!hasSessionHint()) {
        setStatus('anon')
        return
      }
      try {
        await refreshSession()
        const me = await getMe()
        if (!cancelled) {
          setUser(me)
          setStatus('authed')
        }
      } catch {
        if (!cancelled) {
          setUser(null)
          setStatus('anon')
        }
      }
    }
    resume()
    return () => {
      cancelled = true
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // Session state is cleared client-side regardless.
    }
    setUser(null)
    setStatus('anon')
  }, [])

  const value = { user, status, setUser, reload, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
