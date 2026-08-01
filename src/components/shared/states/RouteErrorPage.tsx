import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config"

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) return error.statusText || error.data?.message || `Request failed with status ${error.status}`
  if (error instanceof Error) return error.message
  return "An unexpected page error occurred."
}

export default function RouteErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-background-card p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p className="mt-5 text-sm font-semibold text-primary">Workey Admin</p>
        <h1 className="mt-2 text-2xl font-bold text-text-primary">This page could not be displayed</h1>
        <p className="mt-3 text-sm text-text-secondary">{errorMessage(error)}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => window.location.reload()}><RefreshCw /> Reload page</Button>
          <Button variant="outline" onClick={() => navigate(ROUTES.admin.root, { replace: true })}><Home /> Admin dashboard</Button>
        </div>
      </section>
    </main>
  )
}
