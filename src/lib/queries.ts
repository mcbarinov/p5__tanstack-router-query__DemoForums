import { useMutation, useQueryClient, useSuspenseQuery, queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api"
import type { CreatePostRequest, Post } from "@/types"

// Query Options
export const forumsQueryOptions = queryOptions({
  queryKey: ["forums"],
  queryFn: () => api.getForums(),
})

export const forumQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["forums", id],
    queryFn: () => api.getForum(id),
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

// Query Hooks
export function useForumsQuery() {
  return useSuspenseQuery(forumsQueryOptions)
}

export function useForumQuery(id: number) {
  return useSuspenseQuery(forumQueryOptions(id))
}

export function useForumPostsQuery(forumId: number) {
  return useSuspenseQuery(forumPostsQueryOptions(forumId))
}

export function usePostQuery(id: number) {
  return useSuspenseQuery(postQueryOptions(id))
}

export function usePostCommentsQuery(postId: number) {
  return useSuspenseQuery(postCommentsQueryOptions(postId))
}

// Mutation Hooks
export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreatePostRequest) => api.createPost(request),
    onSuccess: (newPost: Post, variables: CreatePostRequest) => {
      // Invalidate and refetch forum posts to show the new post
      void queryClient.invalidateQueries({
        queryKey: ["forums", variables.forumId, "posts"],
      })

      // Optionally add the new post to the cache optimistically
      queryClient.setQueryData<Post[]>(["forums", variables.forumId, "posts"], (oldPosts) => {
        if (!oldPosts) return [newPost]
        return [newPost, ...oldPosts]
      })
    },
  })
}
