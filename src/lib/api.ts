import { HTTPError } from "ky"

import type { Forum, Post, Comment } from "@/types"
import { httpClient } from "@/lib/http-client"

// API Request/Response Types
export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    username: string
    role: "admin" | "user"
  }
  sessionId: string
}

export interface CreatePostRequest {
  forumId: number
  title: string
  content: string
  tags: string[]
}

export const api = {
  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      return await httpClient.post("auth/login", { json: credentials }).json<AuthResponse>()
    } catch (error) {
      // Handle 401 authentication errors
      if (error instanceof HTTPError && error.response.status === 401) {
        throw new Error("Invalid username or password")
      }
      throw new Error("Login failed. Please try again.")
    }
  },

  async logout(): Promise<void> {
    await httpClient.post("auth/logout")
  },

  // Forum endpoints
  async getForums(): Promise<Forum[]> {
    return httpClient.get("forums").json<Forum[]>()
  },

  async getForum(id: number): Promise<Forum> {
    return httpClient.get(`forums/${id}`).json<Forum>()
  },

  async getPostsByForum(forumId: number): Promise<Post[]> {
    return httpClient.get(`forums/${forumId}/posts`).json<Post[]>()
  },

  async getPost(id: number): Promise<Post> {
    return httpClient.get(`posts/${id}`).json<Post>()
  },

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return httpClient.get(`posts/${postId}/comments`).json<Comment[]>()
  },

  async createPost(request: CreatePostRequest): Promise<Post> {
    return httpClient.post("posts", { json: request }).json<Post>()
  },
}
