import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"

import { ROUTES } from "@/config"
import { adminRoutes } from "./AdminRoutes"
import { employerRoutes } from "./EmployerRoutes"
import { publicRoutes } from "./PublicRoutes"
import ForgotPasswordPage from "@/shared/auth/pages/ForgotPasswordPage"
import ResetPasswordPage from "@/shared/auth/pages/ResetPasswordPage"
import EmailVerificationPage from "@/shared/auth/pages/EmailVerificationPage"
import Login from "@/shared/auth/pages/Login"

const router = createBrowserRouter(
  [
    { path: ROUTES.auth.login, element: <Login /> },
    { path: ROUTES.employer.login, element: <Navigate to={ROUTES.auth.login} replace /> },
    { path: ROUTES.auth.forgotPassword, element: <ForgotPasswordPage loginPath={ROUTES.auth.login} /> },
    { path: ROUTES.auth.resetPassword, element: <ResetPasswordPage loginPath={ROUTES.auth.login} /> },
    { path: ROUTES.auth.emailVerification, element: <EmailVerificationPage /> },
    { path: ROUTES.employer.register, element: <Navigate to={ROUTES.auth.login} replace /> },
    { path: ROUTES.employer.forgotPassword, element: <ForgotPasswordPage loginPath={ROUTES.auth.login} /> },
    { path: ROUTES.employer.resetPassword, element: <ResetPasswordPage loginPath={ROUTES.auth.login} /> },
    ...publicRoutes,
    adminRoutes,
    employerRoutes,
    { path: ROUTES.home, element: <Navigate to={ROUTES.auth.login} replace /> },
    { path: "*", element: <Navigate to={ROUTES.auth.login} replace /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
)

export default function AppRouter() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />
}
