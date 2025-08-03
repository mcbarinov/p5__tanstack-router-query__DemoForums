import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"

import { api } from "@/lib/api"
import { useAuth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CreatePostRequest } from "@/types"

export const Route = createFileRoute("/_authenticated/forums_/$forumId_/new")({
  loader: async ({ params }) => {
    const forumId = parseInt(params.forumId)
    const forum = await api.getForum(forumId)

    if (!forum) {
      throw new Error("Forum not found")
    }

    return { forum }
  },
  component: NewPost,
})

interface FormData {
  title: string
  content: string
  tags: string
}

function NewPost() {
  const { forumId } = Route.useParams()
  const { forum } = Route.useLoaderData()
  const { user } = useAuth()
  const navigate = useNavigate()

  const form = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (!user) return

    const createPostRequest: CreatePostRequest = {
      forumId: parseInt(forumId),
      title: data.title,
      content: data.content,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      author: user.username,
    }

    try {
      const newPost = await api.createPost(createPostRequest)
      await navigate({
        to: "/forums/$forumId/$postId",
        params: { forumId, postId: newPost.id.toString() },
      })
    } catch (error) {
      console.error("Failed to create post:", error)
    }
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
                rules={{ required: "Title is required" }}
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
                rules={{ required: "Content is required" }}
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Post"}
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
