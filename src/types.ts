export type Category = "Technology" | "Science" | "Art"

export interface Forum {
  id: number
  name: string
  description: string
  category: Category
}

export interface Post {
  id: number
  forumId: number
  title: string
  content: string
  tags: string[]
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

export type Role = "admin" | "user"

export interface User {
  id: number
  username: string
  role: Role
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token?: string
}
