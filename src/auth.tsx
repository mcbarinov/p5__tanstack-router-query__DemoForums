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
    // Initialize user based on sessionId presence
    const sessionId = localStorage.getItem("tanstack.auth.session")
    if (sessionId) {
      // Create minimal user object - real validation happens on first API call
      return { id: 0, username: "authenticated", role: "user" } as User
    }
    return null
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
