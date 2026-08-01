import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"

import AdminLoginPage from "@/features/admin/auth/pages/AdminLoginPage"
import { ROUTES } from "@/config"
import { adminRoutes } from "./AdminRoutes"
import { employerRoutes } from "./EmployerRoutes"
import EmployerLoginPage from "@/features/employer/auth/pages/EmployerLoginPage"
import EmployerRegisterPage from "@/features/employer/auth/pages/EmployerRegisterPage"
import ForgotPasswordPage from "@/shared/auth/pages/ForgotPasswordPage"
import ResetPasswordPage from "@/shared/auth/pages/ResetPasswordPage"

const router = createBrowserRouter(
  [
    { path: ROUTES.auth.login, element: <AdminLoginPage /> },
    { path: ROUTES.auth.forgotPassword, element: <ForgotPasswordPage loginPath={ROUTES.auth.login} /> },
    { path: ROUTES.auth.resetPassword, element: <ResetPasswordPage loginPath={ROUTES.auth.login} /> },
    { path: ROUTES.employer.login, element: <EmployerLoginPage /> },
    { path: ROUTES.employer.register, element: <EmployerRegisterPage /> },
    { path: ROUTES.employer.forgotPassword, element: <ForgotPasswordPage loginPath={ROUTES.employer.login} /> },
    { path: ROUTES.employer.resetPassword, element: <ResetPasswordPage loginPath={ROUTES.employer.login} /> },
    adminRoutes,
    employerRoutes,
    { path: ROUTES.home, element: <Navigate to={ROUTES.admin.root} replace /> },
    { path: `${ROUTES.employer.root}/*`, element: <Navigate to={ROUTES.employer.login} replace /> },
    { path: "*", element: <Navigate to={ROUTES.admin.root} replace /> },
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
