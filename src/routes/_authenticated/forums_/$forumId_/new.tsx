import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"

import { api } from "@/api/client"
import { useAuth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

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
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title", { required: "Title is required" })} placeholder="Enter post title" />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                {...register("content", { required: "Content is required" })}
                placeholder="Write your post content here..."
                rows={8}
              />
              {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>}
            </div>

            <div>
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input id="tags" {...register("tags")} placeholder="Enter tags separated by commas" />
              <p className="text-sm text-gray-500 mt-1">Example: discussion, help, feature-request</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Post"}
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
        </CardContent>
      </Card>
    </div>
  )
}
