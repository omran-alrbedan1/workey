import { Navigate } from "react-router-dom"

import { ROUTES } from "@/config"
import { useAdminSession } from "../hooks/useAdminSession"

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useAdminSession()

  if (!session.hasToken) return <Navigate to={ROUTES.auth.login} replace />
  if (session.isPending) return null
  if (session.isError || !session.isAdmin) return <Navigate to={ROUTES.auth.login} replace />
  return children
}
