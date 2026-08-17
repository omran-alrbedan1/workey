import PublicCompanyPage from "@/features/public/company/pages/PublicCompanyPage"
import CompanyInvitationPage from "@/features/public/company-invitations/pages/CompanyInvitationPage"
import { ROUTES } from "@/config"

export const publicRoutes = [
  {
    path: "/companies/:slug",
    element: <PublicCompanyPage />,
  },
  {
    path: ROUTES.public.companyInvitation(),
    element: <CompanyInvitationPage />,
  },
]
