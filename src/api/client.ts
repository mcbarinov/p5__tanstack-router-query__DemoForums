import ky, { HTTPError } from "ky"

import type { Forum, Post, Comment, LoginCredentials, AuthResponse, CreatePostRequest } from "../types"

// Session storage for client
const SESSION_KEY = "tanstack.auth.session"

function getStoredSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

function setStoredSessionId(sessionId: string | null) {
  if (sessionId) {
    localStorage.setItem(SESSION_KEY, sessionId)
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

// HTTP client with automatic session handling
const apiClient = ky.create({
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
        // Handle 401 responses by clearing session
        if (response.status === 401) {
          setStoredSessionId(null)
          // Trigger auth state update by dispatching custom event
          window.dispatchEvent(new CustomEvent("auth:logout"))
        }
        return response
      },
    ],
  },
})

// Mock data (moved to end for better organization)
const mockForums: Forum[] = [
  { id: 1, name: "General Discussion", description: "Talk about anything and everything", category: "Technology" },
  { id: 2, name: "Tech Support", description: "Get help with technical issues", category: "Technology" },
  { id: 3, name: "Feature Requests", description: "Suggest new features for the platform", category: "Technology" },
  { id: 4, name: "Bug Reports", description: "Report bugs and issues you've encountered", category: "Technology" },
  { id: 5, name: "Off-Topic", description: "Random conversations and off-topic discussions", category: "Art" },
]

const mockPosts: Post[] = [
  {
    id: 1,
    forumId: 1,
    title: "Welcome to the forum!",
    content: "This is the first post in our new forum. Feel free to introduce yourself!",
    tags: ["welcome", "introduction", "announcement"],
    author: "admin",
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-01-01T10:00:00Z"),
  },
  {
    id: 2,
    forumId: 1,
    title: "How to get started?",
    content: "I'm new here and wondering where to begin. Any tips for newcomers?",
    tags: ["help", "newcomer", "getting-started"],
    author: "user123",
    createdAt: new Date("2024-01-02T14:30:00Z"),
    updatedAt: new Date("2024-01-02T14:30:00Z"),
  },
  {
    id: 3,
    forumId: 1,
    title: "Share your thoughts",
    content: "What do you think about the new design? I'd love to hear your feedback.",
    tags: ["feedback", "design", "discussion"],
    author: "alice",
    createdAt: new Date("2024-01-03T09:15:00Z"),
    updatedAt: new Date("2024-01-03T09:15:00Z"),
  },
  {
    id: 4,
    forumId: 2,
    title: "Installation issues on Windows",
    content: "Having trouble installing the software on Windows 11. Getting error code 0x80070057.",
    tags: ["windows", "installation", "error", "troubleshooting"],
    author: "techuser",
    createdAt: new Date("2024-01-04T16:45:00Z"),
    updatedAt: new Date("2024-01-04T16:45:00Z"),
  },
  {
    id: 5,
    forumId: 2,
    title: "How to reset password?",
    content: "I forgot my password and can't find the reset option. Please help!",
    tags: ["password", "reset", "help", "account"],
    author: "forgetful",
    createdAt: new Date("2024-01-05T11:20:00Z"),
    updatedAt: new Date("2024-01-05T11:20:00Z"),
  },
  {
    id: 6,
    forumId: 3,
    title: "Dark mode please!",
    content: "Would love to see a dark mode option. My eyes would thank you!",
    tags: ["dark-mode", "ui", "feature-request", "accessibility"],
    author: "nightowl",
    createdAt: new Date("2024-01-06T22:00:00Z"),
    updatedAt: new Date("2024-01-06T22:00:00Z"),
  },
  {
    id: 7,
    forumId: 3,
    title: "Mobile app suggestion",
    content: "A native mobile app would be amazing for on-the-go access.",
    tags: ["mobile", "app", "feature-request", "ios", "android"],
    author: "mobilefan",
    createdAt: new Date("2024-01-07T08:30:00Z"),
    updatedAt: new Date("2024-01-07T08:30:00Z"),
  },
  {
    id: 8,
    forumId: 4,
    title: "Login button not working",
    content: "The login button on the homepage doesn't respond to clicks. Using Chrome 120.",
    tags: ["bug", "login", "chrome", "ui", "critical"],
    author: "bugfinder",
    createdAt: new Date("2024-01-08T13:15:00Z"),
    updatedAt: new Date("2024-01-08T13:15:00Z"),
  },
  {
    id: 9,
    forumId: 5,
    title: "What's your favorite movie?",
    content: "Let's have some fun! Share your all-time favorite movie and why you love it.",
    tags: ["movies", "entertainment", "discussion", "fun"],
    author: "moviebuff",
    createdAt: new Date("2024-01-09T19:30:00Z"),
    updatedAt: new Date("2024-01-09T19:30:00Z"),
  },
  {
    id: 10,
    forumId: 5,
    title: "Weekend plans?",
    content: "Anyone doing anything exciting this weekend? I'm thinking of going hiking.",
    tags: ["weekend", "plans", "hiking", "outdoor", "social"],
    author: "weekender",
    createdAt: new Date("2024-01-10T17:00:00Z"),
    updatedAt: new Date("2024-01-10T17:00:00Z"),
  },
]

const mockComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    content: "Welcome! Excited to be part of this community.",
    author: "newbie",
    createdAt: new Date("2024-01-01T11:00:00Z"),
    updatedAt: new Date("2024-01-01T11:00:00Z"),
  },
  {
    id: 2,
    postId: 1,
    content: "Thanks for setting this up! Looking forward to great discussions.",
    author: "enthusiast",
    createdAt: new Date("2024-01-01T12:30:00Z"),
    updatedAt: new Date("2024-01-01T12:30:00Z"),
  },
  {
    id: 3,
    postId: 2,
    content: "Check out the guidelines in the pinned post. That helped me a lot!",
    author: "helper",
    createdAt: new Date("2024-01-02T15:00:00Z"),
    updatedAt: new Date("2024-01-02T15:00:00Z"),
  },
  {
    id: 4,
    postId: 2,
    content: "Start by exploring different forums and joining conversations that interest you.",
    author: "veteran",
    createdAt: new Date("2024-01-02T16:15:00Z"),
    updatedAt: new Date("2024-01-02T16:15:00Z"),
  },
  {
    id: 5,
    postId: 3,
    content: "I love the new design! It's so clean and modern.",
    author: "designer",
    createdAt: new Date("2024-01-03T10:00:00Z"),
    updatedAt: new Date("2024-01-03T10:00:00Z"),
  },
  {
    id: 6,
    postId: 4,
    content: "Try running the installer as administrator. That fixed it for me.",
    author: "techsupport",
    createdAt: new Date("2024-01-04T17:00:00Z"),
    updatedAt: new Date("2024-01-04T17:00:00Z"),
  },
  {
    id: 7,
    postId: 4,
    content: "Make sure you have .NET Framework 4.8 installed first.",
    author: "windowspro",
    createdAt: new Date("2024-01-04T18:30:00Z"),
    updatedAt: new Date("2024-01-04T18:30:00Z"),
  },
  {
    id: 8,
    postId: 6,
    content: "Yes! Dark mode is essential. +1 from me.",
    author: "darkmodeuser",
    createdAt: new Date("2024-01-06T23:00:00Z"),
    updatedAt: new Date("2024-01-06T23:00:00Z"),
  },
  {
    id: 9,
    postId: 9,
    content: "The Shawshank Redemption. It's a masterpiece of storytelling!",
    author: "filmcritic",
    createdAt: new Date("2024-01-09T20:00:00Z"),
    updatedAt: new Date("2024-01-09T20:00:00Z"),
  },
  {
    id: 10,
    postId: 9,
    content: "Inception for me. Love the mind-bending plot!",
    author: "scifilan",
    createdAt: new Date("2024-01-09T21:15:00Z"),
    updatedAt: new Date("2024-01-09T21:15:00Z"),
  },
]

export const api = {
  // Session management
  getSessionId: getStoredSessionId,
  setSessionId: setStoredSessionId,

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("auth/login", { json: credentials }).json<AuthResponse>()
      setStoredSessionId(response.sessionId)
      return response
    } catch (error) {
      // Handle 401 authentication errors
      if (error instanceof HTTPError && error.response.status === 401) {
        throw new Error("Invalid username or password")
      }
      throw new Error("Login failed. Please try again.")
    }
  },

  async logout(): Promise<void> {
    await apiClient.post("auth/logout")
    setStoredSessionId(null)
  },

  // Forum endpoints - fallback to mock data for now
  getForums(): Promise<Forum[]> {
    return Promise.resolve([...mockForums])
  },

  getForum(id: number): Promise<Forum | undefined> {
    return Promise.resolve(mockForums.find((f) => f.id === id))
  },

  getPostsByForum(forumId: number): Promise<Post[]> {
    return Promise.resolve(mockPosts.filter((p) => p.forumId === forumId))
  },

  getPost(id: number): Promise<Post | undefined> {
    return Promise.resolve(mockPosts.find((p) => p.id === id))
  },

  getCommentsByPost(postId: number): Promise<Comment[]> {
    return Promise.resolve(mockComments.filter((c) => c.postId === postId))
  },

  createPost(request: CreatePostRequest): Promise<Post> {
    const newId = Math.max(...mockPosts.map((p) => p.id)) + 1
    const now = new Date()

    const newPost: Post = {
      id: newId,
      forumId: request.forumId,
      title: request.title,
      content: request.content,
      tags: request.tags,
      author: request.author,
      createdAt: now,
      updatedAt: now,
    }

    mockPosts.push(newPost)
    return Promise.resolve(newPost)
  },
}
