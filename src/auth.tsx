import * as React from "react"

import { api } from "@/lib/api"
import { getStoredSessionId, getStoredUser, clearAuthData, setStoredSessionId, setStoredUser } from "@/lib/auth-storage"
import type { User } from "@/types"

export interface AuthContext {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  user: User | null
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    // Validate both sessionId and user data exist
    const sessionId = getStoredSessionId()
    const storedUser = getStoredUser()

    // If either is missing, clear all auth data and force re-login
    if (!sessionId || !storedUser) {
      clearAuthData()
      return null
    }

    return storedUser
  })
  const isAuthenticated = !!user

  const logout = React.useCallback(async () => {
    await api.logout()
    clearAuthData()
    setUser(null)
  }, [])

  const login = React.useCallback(async (username: string, password: string) => {
    const response = await api.login({ username, password })
    // Handle storage after successful API call
    setStoredSessionId(response.sessionId)
    setStoredUser(response.user)
    setUser(response.user)
  }, [])

  // Listen for automatic logout events from API client
  React.useEffect(() => {
    const handleAutoLogout = () => {
      setUser(null)
    }

    window.addEventListener("auth:logout", handleAutoLogout)
    return () => window.removeEventListener("auth:logout", handleAutoLogout)
  }, [])

  const value = React.useMemo(() => ({ isAuthenticated, user, login, logout }), [isAuthenticated, user, login, logout])

  return <AuthContext value={value}>{children}</AuthContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.use(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
