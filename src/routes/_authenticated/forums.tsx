import { createFileRoute, Link } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"

import { forumsQueryOptions } from "@/lib/queries"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const Route = createFileRoute("/_authenticated/forums")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(forumsQueryOptions()),
  component: ForumsList,
})

function ForumsList() {
  const { data: forums } = useSuspenseQuery(forumsQueryOptions())

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Forums</h2>
      <div className="space-y-2">
        {forums.map((forum) => (
          <Link key={forum.id} to="/forums/$forumId" params={{ forumId: forum.id }} className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{forum.name}</CardTitle>
                  <Badge variant="secondary">{forum.category}</Badge>
                </div>
                <CardDescription>{forum.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
