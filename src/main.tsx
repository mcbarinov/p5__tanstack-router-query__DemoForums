import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { AuthProvider } from "@/auth"
import { App } from "@/App"
import { worker } from "@/mocks/browser"
import "@/index.css"

// Start MSW worker in development
if (import.meta.env.DEV) {
  void worker.start({
    onUnhandledRequest: "error",
  })
}

// Render the app
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
