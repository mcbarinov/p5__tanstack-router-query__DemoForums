import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { AuthProvider } from "@/auth"
import { App } from "@/App"
import "@/index.css"

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
        <AuthProvider>
          <App />
        </AuthProvider>
      </StrictMode>
    )
  }
}

void startApp()
