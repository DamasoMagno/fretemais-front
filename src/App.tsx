import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Routes } from "./routes"

const client = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={client}>
      <Routes />
    </QueryClientProvider>
  )
}

