export interface Forum {
  id: number
  name: string
  description: string
}

export interface Post {
  id: number
  forumId: number
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: number
  postId: number
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: number
  username: string
  role: "admin" | "user"
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token?: string
}
