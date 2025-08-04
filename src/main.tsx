import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { AuthProvider } from "@/auth"
import { App } from "@/App"
import "@/index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always fetch fresh data on navigation
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
})

async function startApp() {
  // Start MSW worker in development and wait for it to be ready
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser")
    await worker.start({
      onUnhandledRequest: "warn",
    })
  }

  // Render the app after MSW is ready
  const rootElement = document.getElementById("root")!
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </StrictMode>
    )
  }
}

void startApp()
