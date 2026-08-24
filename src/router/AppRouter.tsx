import { lazy } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"

import { ROUTES } from "@/config"
import { adminRoutes } from "./AdminRoutes"
import { employerRoutes } from "./EmployerRoutes"
import { publicRoutes } from "./PublicRoutes"
import { withRouteSuspense } from "./LazyRoute"

const ForgotPasswordPage = lazy(() => import("@/shared/auth/pages/ForgotPasswordPage"))
const ResetPasswordPage = lazy(() => import("@/shared/auth/pages/ResetPasswordPage"))
const EmailVerificationPage = lazy(() => import("@/shared/auth/pages/EmailVerificationPage"))
const Login = lazy(() => import("@/shared/auth/pages/Login"))
const EmployerRegisterPage = lazy(
  () => import("@/features/employer/auth/pages/EmployerRegisterPage"),
)
const AccessDeniedPage = lazy(() => import("@/components/shared/states/AccessDeniedPage"))
const NotFoundPage = lazy(() => import("@/components/shared/states/NotFoundPage"))

const router = createBrowserRouter(
  [
    { path: ROUTES.auth.login, element: withRouteSuspense(<Login />) },
    { path: ROUTES.employer.login, element: <Navigate to={ROUTES.auth.login} replace /> },
    {
      path: ROUTES.auth.forgotPassword,
      element: withRouteSuspense(<ForgotPasswordPage loginPath={ROUTES.auth.login} />),
    },
    {
      path: ROUTES.auth.resetPassword,
      element: withRouteSuspense(<ResetPasswordPage loginPath={ROUTES.auth.login} />),
    },
    { path: ROUTES.auth.emailVerification, element: withRouteSuspense(<EmailVerificationPage />) },
    { path: ROUTES.employer.register, element: withRouteSuspense(<EmployerRegisterPage />) },
    {
      path: ROUTES.employer.forgotPassword,
      element: withRouteSuspense(<ForgotPasswordPage loginPath={ROUTES.auth.login} />),
    },
    {
      path: ROUTES.employer.resetPassword,
      element: withRouteSuspense(<ResetPasswordPage loginPath={ROUTES.auth.login} />),
    },
    { path: "/access-denied", element: withRouteSuspense(<AccessDeniedPage />) },
    { path: "/not-found", element: withRouteSuspense(<NotFoundPage />) },
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
