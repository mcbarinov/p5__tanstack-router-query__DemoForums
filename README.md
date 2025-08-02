# DemoForums

A demonstration forum application built with modern React and TypeScript stack.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Static typing
- **TanStack Router** - File-based routing with loader support
- **Tailwind CSS v4** - Utility-first CSS framework
- **Vite** - Fast bundler and dev server
- **ESLint + Prettier** - Code linting and formatting

## Project Architecture

### Folder Structure

```
src/
├── api/
│   └── client.ts          # API client with HTTP request simulation
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

### API Client with Simulation

The API client (`src/api/client.ts`) simulates real HTTP requests:

- Random delay 200-800ms
- Hardcoded data
- Ready to be replaced with real API

### Protected Routes

Routes under `_authenticated/` require authentication. Unauthorized users are redirected to `/login`.

## Route Structure

- `/` - Home page (redirects to `/forums`)
- `/login` - Login page
- `/forums` - All forums list
- `/forums/:forumId` - Specific forum posts
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
