import type { Post } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PostInfoProps {
  post: Post
}

export function PostInfo({ post }: PostInfoProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          by {post.author} • {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{post.content}</p>
      </CardContent>
    </Card>
  )
}
