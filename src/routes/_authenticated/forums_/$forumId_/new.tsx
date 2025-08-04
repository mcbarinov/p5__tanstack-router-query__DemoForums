import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { forumQueryOptions, useCreatePostMutation } from "@/lib/queries"
import { useAuth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CreatePostRequest } from "@/lib/api"

export const Route = createFileRoute("/_authenticated/forums_/$forumId_/new")({
  params: {
    parse: (rawParams) => {
      const forumId = parseInt(rawParams.forumId)
      if (isNaN(forumId) || forumId <= 0) {
        throw new Error(`Invalid forum ID: ${rawParams.forumId}`)
      }
      return { forumId }
    },
  },
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(forumQueryOptions(params.forumId))
  },
  component: NewPost,
})

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
})

function NewPost() {
  const { forumId } = Route.useParams()
  const { data: forum } = useSuspenseQuery(forumQueryOptions(forumId))
  const { user } = useAuth()
  const navigate = useNavigate()
  const createPostMutation = useCreatePostMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user) return

    const createPostRequest: CreatePostRequest = {
      forumId,
      title: data.title,
      content: data.content,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    }

    createPostMutation.mutate(createPostRequest, {
      onSuccess: (newPost) => {
        void navigate({
          to: "/forums/$forumId/$postId",
          params: { forumId, postId: newPost.id },
        })
      },
      onError: (error) => {
        console.error("Failed to create post:", error)
      },
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-gray-600 mt-2">
          Posting in <span className="font-semibold">{forum.name}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your post content here..." rows={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tags separated by commas" {...field} />
                    </FormControl>
                    <p className="text-sm text-gray-500 mt-1">Example: discussion, help, feature-request</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={createPostMutation.isPending}>
                  {createPostMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void navigate({ to: "/forums/$forumId", params: { forumId } })}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
