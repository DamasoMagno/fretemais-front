import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Routes } from "./routes"
import { Toaster } from "sonner";

const client = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={client}>
      <Routes />
      <Toaster />
    </QueryClientProvider>
  )
}

