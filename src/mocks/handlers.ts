import { http, HttpResponse } from "msw"

import type { User, LoginCredentials, AuthResponse } from "@/types"

// Mock user database
const mockUsers: (User & { password: string })[] = [
  { id: 1, username: "admin", password: "admin", role: "admin" },
  { id: 2, username: "user1", password: "user1", role: "user" },
  { id: 3, username: "alice", password: "alice", role: "user" },
  { id: 4, username: "bob", password: "bob", role: "user" },
]

// In-memory session storage
const activeSessions = new Map<string, User>()

// Generate random sessionId
function generateSessionId(): string {
  return crypto.randomUUID()
}

// Helper to get sessionId from Authorization header
function getSessionId(request: Request): string | null {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7) // Remove "Bearer " prefix
}

export const handlers = [
  // Login endpoint
  http.post("/api/auth/login", async ({ request }) => {
    const credentials = (await request.json()) as LoginCredentials

    // Find user by credentials
    const user = mockUsers.find((u) => u.username === credentials.username && u.password === credentials.password)

    if (!user) {
      return HttpResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Generate session
    const sessionId = generateSessionId()
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      role: user.role,
    }

    // Store session
    activeSessions.set(sessionId, userWithoutPassword)

    const response: AuthResponse = {
      user: userWithoutPassword,
      sessionId,
    }

    return HttpResponse.json(response)
  }),

  // Logout endpoint
  http.post("/api/auth/logout", ({ request }) => {
    const sessionId = getSessionId(request)

    if (sessionId && activeSessions.has(sessionId)) {
      activeSessions.delete(sessionId)
    }

    return HttpResponse.json({ success: true })
  }),
]
