import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type { CreatePostRequest, CreateCommentRequest } from "@/lib/api"

// Query Options - following TanStack example pattern exactly
export const forumsQueryOptions = () =>
  queryOptions({
    queryKey: ["forums"],
    queryFn: () => api.getForums(),
    staleTime: Infinity, // Never consider forums data stale
    gcTime: Infinity, // Never remove from memory - permanent cache
  })

export const forumPostsQueryOptions = (forumId: number) =>
  queryOptions({
    queryKey: ["forums", forumId, "posts"],
    queryFn: () => api.getPostsByForum(forumId),
  })

export const postQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["posts", id],
    queryFn: () => api.getPost(id),
  })

export const postCommentsQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => api.getCommentsByPost(postId),
  })

// Mutation Hooks with proper invalidation
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreatePostRequest) => api.createPost(request),
    onSuccess: (_, variables: CreatePostRequest) => {
      // Invalidate all related queries
      void queryClient.invalidateQueries({
        queryKey: ["forums", variables.forumId, "posts"],
      })
    },
  })
}

export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateCommentRequest) => api.createComment(request),
    onSuccess: (_, variables: CreateCommentRequest) => {
      // Invalidate comments for the post
      void queryClient.invalidateQueries({
        queryKey: ["posts", variables.postId, "comments"],
      })
    },
  })
}

// Refresh Forums Hook
export const useRefreshForums = () => {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.refetchQueries({ queryKey: ["forums"] })
  }
}
