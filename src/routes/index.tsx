// src/routes/index.tsx
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  loader: () => {
    return redirect({ to: "/forums", search: { redirect: undefined } })
  },
})
