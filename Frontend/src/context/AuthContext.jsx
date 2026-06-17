import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, logoutUser, getProfile, registerUser } from '../api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'blog_token'
const USER_KEY  = 'blog_user'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [token, setToken]     = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [loading, setLoading] = useState(true)   // resolving initial session
  const [error, setError]     = useState(null)

  // On mount: if a token exists, verify it by fetching profile
  useEffect(() => {
    if (!token) { setLoading(false); return }
    getProfile()
      .then(({ data }) => {
        setUser(data.profile)
        localStorage.setItem(USER_KEY, JSON.stringify(data.profile))
      })
      .catch(() => {
        // Token invalid or expired
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (credentials) => {
    setError(null)
    const { data } = await loginUser(credentials)
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    // Fetch full profile after login
    const profile = await getProfile()
    setUser(profile.data.profile)
    localStorage.setItem(USER_KEY, JSON.stringify(profile.data.profile))
    return data
  }, [])

  const register = useCallback(async (payload) => {
    setError(null)
    const { data } = await registerUser(payload)
    return data
  }, [])

  const logout = useCallback(async () => {
    try { await logoutUser() } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  // Convenience flag: is the current user a writer or admin?
  const canWrite = user?.role === 'writer' || user?.role === 'admin'

  const value = {
    user,
    token,
    loading,
    error,
    setError,
    isAuthenticated: !!token && !!user,
    canWrite,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}