# DemoForums

A demonstration forum application built with modern React and TypeScript stack.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Static typing
- **TanStack Router** - File-based routing with loader support
- **TanStack Query** - Powerful data synchronization for React
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Fast bundler and dev server
- **ESLint + Prettier** - Code linting and formatting

## Project Architecture

### Folder Structure

```
src/
├── lib/
│   ├── api.ts             # Clean API with ONLY HTTP requests
│   ├── queries.ts         # TanStack Query options and mutations
│   ├── http-client.ts     # HTTP client configuration (Ky setup)
│   ├── auth-storage.ts    # Authentication storage utilities
│   └── utils.ts           # General utilities (cn function)
├── components/
│   ├── layout/           # Shared layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/              # Reusable UI components
│       └── LoadingSpinner.tsx
├── routes/               # File-based routing (TanStack Router)
│   ├── __root.tsx       # Root layout
│   ├── _authenticated.tsx # Layout for protected routes
│   ├── index.tsx        # Home page
│   ├── login.tsx        # Login page
│   └── _authenticated/
│       ├── forums.tsx   # Forums list
│       └── forums_/
│           ├── $forumId.tsx      # Forum posts
│           └── $forumId_/
│               ├── $postId.tsx   # Post details
│               └── -components/  # Route-local components
│                   ├── PostInfo.tsx
│                   └── CommentItem.tsx
├── types.ts             # Shared TypeScript types
├── auth.tsx            # Authentication context
├── router.ts           # Router configuration
├── App.tsx             # Main app component (required for React Fast Refresh)
└── main.tsx           # Application entry point
```

### File Creation Rules

1. **Routes** - Files in `routes/` folder automatically become routes
   - `_` prefix = layout route
   - `$` = dynamic segment
   - `-components/` = local components for the route

2. **Components** - Functional components with TypeScript
   - Naming: PascalCase
   - One component per file
   - Props typed via interface

3. **Types** - Centralized in `types.ts`
   - Use `interface` for objects
   - Use `type` for union types

### Import Conventions

Follow this strict order for imports with empty lines between groups:

1. **External libraries** (from node_modules)

```typescript
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import * as z from "zod"
```

2. **Project modules** (using `@/` alias)

```typescript
import { api } from "@/lib/api"
import { PostDetailSkeleton } from "@/components/loading/PostDetailSkeleton"
import { useAuth } from "@/auth"
import type { User } from "@/types"
```

3. **Local files** (relative paths)

```typescript
import { PostInfo } from "./-components/PostInfo"
import { CommentItem } from "./CommentItem"
```

**Rules:**

- Always use `@/` alias for project files instead of relative paths like `../../../`
- Local components (same directory or subdirectory) use relative paths
- Separate each group with an empty line
- External libraries always come first
- Type imports use `import type` when possible

## Key Features

### File-based Routing with Loaders

Each route can have a `loader` function for data prefetching:

```typescript
export const Route = createFileRoute("/path")({
  loader: async () => {
    const data = await api.getData()
    return { data }
  },
  component: MyComponent,
})
```

### Clean API Architecture

The API client (`src/lib/api.ts`) follows strict clean architecture principles:

**API Contains ONLY HTTP requests:**

```typescript
export const api = {
  // ✅ GOOD - Pure HTTP request
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await httpClient.post("auth/login", { json: credentials }).json<AuthResponse>()
  },

  // ❌ BAD - Side effects in API
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post("auth/login", { json: credentials }).json<AuthResponse>()
    localStorage.setItem("user", JSON.stringify(response.user)) // ❌ Storage logic doesn't belong here
    return response
  },
}
```

**Core Principles:**

- **No side effects** - API methods only make HTTP requests
- **No storage logic** - localStorage/sessionStorage handled in auth layer
- **No business logic** - Pure HTTP communication only
- **No backward compatibility** - This is a demo project, keep it clean
- **Single responsibility** - Each method does one HTTP request

**Separation of Concerns:**

- `lib/api.ts` - Pure HTTP requests
- `lib/http-client.ts` - HTTP client configuration (Ky setup)
- `lib/auth-storage.ts` - Storage utilities
- `auth.tsx` - Authentication logic and state management

### Protected Routes

Routes under `_authenticated/` require authentication. Unauthorized users are redirected to `/login`.

## Route Structure

- `/` - Home page (redirects to `/forums`)
- `/login` - Login page
- `/forums` - All forums list
- `/forums/:forumId` - Specific forum posts
- `/forums/:forumId/new` - Create new post form
- `/forums/:forumId/:postId` - Post details with comments

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (port 3000)
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Linting
pnpm run lint

# Code formatting
pnpm run format
```

## Patterns and Conventions

### Data Loading

We use TanStack Router's loader pattern for prefetching data before component render. This provides:

- No UI jumps
- Parallel data loading
- Automatic error handling

### TanStack Query Integration

The project follows best practices for TanStack Router + Query integration, inspired by the official TanStack examples.

**Query Options Pattern:**

All query configurations are centralized in `src/lib/queries.ts`:

```typescript
// Query options with function wrappers for better composability
export const forumsQueryOptions = () =>
  queryOptions({
    queryKey: ["forums"],
    queryFn: () => api.getForums(),
  })

export const forumQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["forums", id],
    queryFn: () => api.getForum(id),
  })
```

**Route Integration:**

Routes use `ensureQueryData` in loaders to prefetch data:

```typescript
export const Route = createFileRoute("/_authenticated/forums")({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(forumsQueryOptions()),
  component: ForumsList,
})
```

**Component Usage:**

Components use `useSuspenseQuery` directly since data is guaranteed to be loaded:

```typescript
function ForumsList() {
  const { data: forums } = useSuspenseQuery(forumsQueryOptions())
  // Data is always available here - no loading states needed
}
```

**Mutation Patterns:**

Mutations properly invalidate related queries to keep data fresh:

```typescript
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreatePostRequest) => api.createPost(request),
    onSuccess: (_, variables) => {
      // Invalidate all related queries for fresh data
      void queryClient.invalidateQueries({
        queryKey: ["forums", variables.forumId, "posts"],
      })
      void queryClient.invalidateQueries({
        queryKey: ["forums", variables.forumId],
      })
      void queryClient.invalidateQueries({
        queryKey: ["forums"],
      })
    },
  })
}
```

**Architecture Benefits:**

- **Prefetched Data**: Routes load data before rendering (no loading spinners in components)
- **Centralized Queries**: All query logic in one place for consistency
- **Type Safety**: Full TypeScript support with proper inference
- **Cache Management**: Automatic invalidation keeps data synchronized
- **Parallel Loading**: Multiple queries load simultaneously in route loaders

### Loading States

To improve user experience during data fetching, we implement loading indicators:

```typescript
export const Route = createFileRoute("/path")({
  loader: async () => {
    // Data fetching logic
  },
  pendingComponent: LoadingSpinner, // Component shown while loading
  pendingMs: 100, // Show loader after 100ms (default: 1000ms)
  component: MyComponent,
})
```

Example: The forum detail page (`/forums/$forumId`) shows a loading spinner when navigating between forums. This provides immediate visual feedback to users, preventing the perception that links are broken during the 200-800ms API delay.

### Component Architecture

- **Global components** - in `src/components/`
- **Route-local components** - in `-components/` folder next to the route
- **Layout components** - use `<Outlet />` for nested routes

### Styling

Using Tailwind CSS utility classes:

- No separate CSS files (except `index.css`)
- Components are self-contained with their styles
- Consistent design through Tailwind classes

### Form Handling

Always use shadcn/ui Form components with Zod validation for better accessibility, consistency, and type safety.

**✅ CORRECT - Use shadcn/ui Forms with Zod:**

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { title: "", content: "" },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

**❌ AVOID - Inline validation rules:**

```typescript
// Don't use inline rules - use Zod schema instead
<FormField
  name="title"
  rules={{ required: "Title is required" }} // ❌ Avoid this
  render={({ field }) => ...}
/>
```

**❌ AVOID - Direct react-hook-form usage:**

```typescript
// Don't do this - lacks accessibility features
const { register, formState: { errors } } = useForm()

<form>
  <Label htmlFor="title">Title</Label>
  <Input {...register("title", { required: "Title is required" })} />
  {errors.title && <p>{errors.title.message}</p>}
</form>
```

**Benefits of shadcn/ui Form components:**

- **Accessibility**: Automatic ARIA attributes, unique IDs, and proper field associations
- **Consistency**: Standardized structure across all forms
- **Error Handling**: Automatic error display with `<FormMessage />`
- **Type Safety**: Better TypeScript integration with field names
- **Maintainability**: Cleaner, more readable form code
