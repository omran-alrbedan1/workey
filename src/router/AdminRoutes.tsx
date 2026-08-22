import { lazy } from "react"
import type { RouteObject } from "react-router-dom"
import { CircleHelp } from "lucide-react"
import { useTranslation } from "react-i18next"

import AdminSectionPage from "@/features/admin/shared/pages/AdminSectionPage"
import AdminLayout from "@/layouts/admin/AdminLayout"
import AdminProtectedRoute from "@/features/admin/auth/components/AdminProtectedRoute"
import RouteErrorPage from "@/components/shared/states/RouteErrorPage"
import { ROUTES } from "@/config"
import { withRouteSuspense } from "./LazyRoute"

const AdminDashboard = lazy(() => import("@/features/admin/dashboard/pages/AdminDashboard"))
const AdminUsersPage = lazy(() => import("@/features/admin/users/pages/AdminUsersPage"))
const AdminUserDetailsPage = lazy(() => import("@/features/admin/users/pages/AdminUserDetailsPage"))
const AdminCandidatesPage = lazy(() => import("@/features/admin/candidates/pages/AdminCandidatesPage"))
const AdminEmployersPage = lazy(() => import("@/features/admin/employers/pages/AdminEmployersPage"))
const AdminCompaniesPage = lazy(() => import("@/features/admin/companies/pages/AdminCompaniesPage"))
const AdminCompanyDetailsPage = lazy(() => import("@/features/admin/companies/pages/AdminCompanyDetailsPage"))
const AdminJobsPage = lazy(() => import("@/features/admin/jobs/pages/AdminJobsPage"))
const AdminJobDetailsPage = lazy(() => import("@/features/admin/jobs/pages/AdminJobDetailsPage"))
const AdminApplicationsPage = lazy(() => import("@/features/admin/applications/pages/AdminApplicationsPage"))
const AdminApplicationDetailsPage = lazy(() => import("@/features/admin/applications/pages/AdminApplicationDetailsPage"))
const AdminSkillsPage = lazy(() => import("@/features/admin/skills/pages/AdminSkillsPage"))
const AdminTestsPage = lazy(() => import("@/features/admin/tests/pages/AdminTestsPage"))
const AdminCreateTestPage = lazy(() => import("@/features/admin/tests/pages/AdminCreateTestPage"))
const AdminNotificationsPage = lazy(() => import("@/features/admin/notifications/pages/AdminNotificationsPage"))
const AdminReportsLayout = lazy(() => import("@/features/admin/reports/pages/AdminReportsLayout"))
const AdminReportsOverviewPage = lazy(() => import("@/features/admin/reports/pages/AdminReportsOverviewPage"))
const AdminReportsApplicationsPage = lazy(() => import("@/features/admin/reports/pages/AdminReportsApplicationsPage"))
const AdminReportsJobsPage = lazy(() => import("@/features/admin/reports/pages/AdminReportsJobsPage"))
const AdminReportsCvParsingPage = lazy(() => import("@/features/admin/reports/pages/AdminReportsCvParsingPage"))
const AdminAuditLogsPage = lazy(() => import("@/features/admin/audit-logs/pages/AdminAuditLogsPage"))
const AdminSettingsPage = lazy(() => import("@/features/admin/settings/pages/AdminSettingsPage"))

function AdminHelpSection() {
  const { t } = useTranslation("common")
  return (
    <AdminSectionPage
      title={t("helpSupport.title")}
      description={t("helpSupport.description")}
      icon={CircleHelp}
    />
  )
}

export const adminRoutes: RouteObject = {
  path: ROUTES.admin.root,
  element: (
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  ),
  errorElement: <RouteErrorPage />,
  children: [
    { index: true, element: withRouteSuspense(<AdminDashboard />) },
    { path: ROUTES.admin.users, element: withRouteSuspense(<AdminUsersPage />) },
    { path: ROUTES.admin.userDetails(":id"), element: withRouteSuspense(<AdminUserDetailsPage />) },
    { path: ROUTES.admin.candidates, element: withRouteSuspense(<AdminCandidatesPage />) },
    { path: ROUTES.admin.employers, element: withRouteSuspense(<AdminEmployersPage />) },
    { path: ROUTES.admin.companies, element: withRouteSuspense(<AdminCompaniesPage />) },
    { path: ROUTES.admin.companyDetails(":id"), element: withRouteSuspense(<AdminCompanyDetailsPage />) },
    { path: ROUTES.admin.jobs, element: withRouteSuspense(<AdminJobsPage />) },
    { path: ROUTES.admin.jobDetails(":id"), element: withRouteSuspense(<AdminJobDetailsPage />) },
    { path: ROUTES.admin.applications, element: withRouteSuspense(<AdminApplicationsPage />) },
    { path: ROUTES.admin.applicationDetails(":id"), element: withRouteSuspense(<AdminApplicationDetailsPage />) },
    { path: ROUTES.admin.skills, element: withRouteSuspense(<AdminSkillsPage />) },
    { path: ROUTES.admin.tests, element: withRouteSuspense(<AdminTestsPage />) },
    { path: ROUTES.admin.testsCreate, element: withRouteSuspense(<AdminCreateTestPage />) },
    { path: ROUTES.admin.notifications, element: withRouteSuspense(<AdminNotificationsPage />) },
    {
      path: ROUTES.admin.reports.root,
      element: withRouteSuspense(<AdminReportsLayout />),
      children: [
        { index: true, element: withRouteSuspense(<AdminReportsOverviewPage />) },
        { path: "overview", element: withRouteSuspense(<AdminReportsOverviewPage />) },
        { path: "applications", element: withRouteSuspense(<AdminReportsApplicationsPage />) },
        { path: "jobs", element: withRouteSuspense(<AdminReportsJobsPage />) },
        { path: "cv-parsing", element: withRouteSuspense(<AdminReportsCvParsingPage />) },
      ],
    },
    { path: ROUTES.admin.auditLogs, element: withRouteSuspense(<AdminAuditLogsPage />) },
    { path: ROUTES.admin.settings, element: withRouteSuspense(<AdminSettingsPage />) },
    {
      path: ROUTES.admin.help,
      element: <AdminHelpSection />,
    },
  ],
}
