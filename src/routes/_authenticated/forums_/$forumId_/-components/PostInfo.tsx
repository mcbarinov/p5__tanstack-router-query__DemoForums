import type { Post } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{post.content}</p>
      </CardContent>
    </Card>
  )
}
