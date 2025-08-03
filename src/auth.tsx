import * as React from "react"

import { api } from "@/api/client"
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
    const sessionId = api.getSessionId()
    const storedUser = api.getUser()

    // If either is missing, clear all auth data and force re-login
    if (!sessionId || !storedUser) {
      api.clearAuthData()
      return null
    }

    return storedUser
  })
  const isAuthenticated = !!user

  const logout = React.useCallback(async () => {
    await api.logout()
    setUser(null)
  }, [])

  const login = React.useCallback(async (username: string, password: string) => {
    const response = await api.login({ username, password })
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
