import { Navigate } from "react-router-dom"

import { ROUTES } from "@/config"
import { useAdminSession } from "../hooks/useAdminSession"

function statusCodeOf(error: unknown): number | undefined {
  return typeof error === "object" && error !== null && "statusCode" in error
    ? (error as { statusCode?: number }).statusCode
    : undefined
}

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useAdminSession()

  if (!session.hasToken) return <Navigate to={ROUTES.auth.login} replace />
  if (session.isPending) return null

  const statusCode = statusCodeOf(session.error)

  if (statusCode === 403 || (!session.isError && !session.isAdmin)) {
    return <Navigate to="/access-denied" replace />
  }

  if (session.isError || !session.data) {
    return <Navigate to={ROUTES.auth.login} replace />
  }

  return children
}
