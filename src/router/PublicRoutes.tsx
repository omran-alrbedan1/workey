import PublicCompanyPage from "@/features/public/company/pages/PublicCompanyPage"

export const publicRoutes = [
  {
    path: "/companies/:slug",
    element: <PublicCompanyPage />,
  },
]
