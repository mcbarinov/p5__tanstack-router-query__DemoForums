import ky from "ky"

import { getStoredSessionId, clearAuthData } from "@/lib/auth-storage"

// HTTP client with automatic session handling
export const httpClient = ky.create({
  prefixUrl: "/api",
  hooks: {
    beforeRequest: [
      (request) => {
        const sessionId = getStoredSessionId()
        if (sessionId) {
          request.headers.set("Authorization", `Bearer ${sessionId}`)
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        // Handle 401 responses by clearing all auth data
        if (response.status === 401) {
          clearAuthData()
          // Trigger auth state update by dispatching custom event
          window.dispatchEvent(new CustomEvent("auth:logout"))
        }
        return response
      },
    ],
  },
})
