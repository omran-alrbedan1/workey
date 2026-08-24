import { lazy } from "react"

import { ROUTES } from "@/config"
import { withRouteSuspense } from "./LazyRoute"

const PublicCompanyPage = lazy(() => import("@/features/public/company/pages/PublicCompanyPage"))
const CompanyInvitationPage = lazy(
  () => import("@/features/public/company-invitations/pages/CompanyInvitationPage"),
)
const EmployerLandingPage = lazy(
  () => import("@/features/public/employer-landing/pages/EmployerLandingPage"),
)

export const publicRoutes = [
  {
    path: ROUTES.public.employerLanding,
    element: withRouteSuspense(<EmployerLandingPage />),
  },
  {
    path: "/companies/:slug",
    element: withRouteSuspense(<PublicCompanyPage />),
  },
  {
    path: ROUTES.public.companyInvitation(),
    element: withRouteSuspense(<CompanyInvitationPage />),
  },
]
