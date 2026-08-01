import { Navigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { useEmployerSession } from "../hooks/useEmployerSession"

export default function EmployerProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useEmployerSession()

  if (!session.hasToken) return <Navigate to={ROUTES.employer.login} replace />
  if (session.isPending) return null
  if (session.isError || !session.isEmployer) {
    return <Navigate to={ROUTES.employer.login} replace />
  }

  return children
}
