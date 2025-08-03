import { Skeleton } from "../ui/skeleton"
import { Card, CardContent, CardHeader } from "../ui/card"

export function PostDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-48 mb-4" />

      {/* Post Info Skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-96 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      <Skeleton className="h-6 w-32 mb-4" />

      {/* Comments Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          // eslint-disable-next-line react-x/no-array-index-key
          <Card key={`comment-skeleton-${i}`}>
            <CardHeader>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
