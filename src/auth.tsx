import * as React from "react"

import { api } from "./api/client"
import type { User } from "./types"

export interface AuthContext {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  user: User | null
}

const AuthContext = React.createContext<AuthContext | null>(null)

const key = "tanstack.auth.user"

function getStoredUser(): User | null {
  const stored = localStorage.getItem(key)
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    return null
  }
}

function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(key, JSON.stringify(user))
  } else {
    localStorage.removeItem(key)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(getStoredUser())
  const isAuthenticated = !!user

  const logout = React.useCallback(async () => {
    await api.logout()
    setStoredUser(null)
    setUser(null)
  }, [])

  const login = React.useCallback(async (username: string, password: string) => {
    const response = await api.login({ username, password })
    setStoredUser(response.user)
    setUser(response.user)
  }, [])

  React.useEffect(() => {
    setUser(getStoredUser())
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
