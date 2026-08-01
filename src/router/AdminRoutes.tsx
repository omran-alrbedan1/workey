import type { RouteObject } from "react-router-dom"
import { CircleHelp } from "lucide-react"

import AdminSectionPage from "@/features/admin/shared/pages/AdminSectionPage"
import AdminUsersPage from "@/features/admin/users/pages/AdminUsersPage"
import AdminUserDetailsPage from "@/features/admin/users/pages/AdminUserDetailsPage"
import AdminCandidatesPage from "@/features/admin/candidates/pages/AdminCandidatesPage"
import AdminEmployersPage from "@/features/admin/employers/pages/AdminEmployersPage"
import AdminCompaniesPage from "@/features/admin/companies/pages/AdminCompaniesPage"
import AdminCompanyDetailsPage from "@/features/admin/companies/pages/AdminCompanyDetailsPage"
import AdminJobsPage from "@/features/admin/jobs/pages/AdminJobsPage"
import AdminJobDetailsPage from "@/features/admin/jobs/pages/AdminJobDetailsPage"
import AdminApplicationsPage from "@/features/admin/applications/pages/AdminApplicationsPage"
import AdminSkillsPage from "@/features/admin/skills/pages/AdminSkillsPage"
import AdminTestsPage from "@/features/admin/tests/pages/AdminTestsPage"
import AdminNotificationsPage from "@/features/admin/notifications/pages/AdminNotificationsPage"
import AdminReportsLayout from "@/features/admin/reports/pages/AdminReportsLayout"
import AdminReportsOverviewPage from "@/features/admin/reports/pages/AdminReportsOverviewPage"
import AdminReportsApplicationsPage from "@/features/admin/reports/pages/AdminReportsApplicationsPage"
import AdminReportsJobsPage from "@/features/admin/reports/pages/AdminReportsJobsPage"
import AdminReportsCvParsingPage from "@/features/admin/reports/pages/AdminReportsCvParsingPage"
import AdminAuditLogsPage from "@/features/admin/audit-logs/pages/AdminAuditLogsPage"
import AdminSettingsPage from "@/features/admin/settings/pages/AdminSettingsPage"
import AdminLayout from "@/layouts/admin/AdminLayout"
import AdminProtectedRoute from "@/features/admin/auth/components/AdminProtectedRoute"
import RouteErrorPage from "@/components/shared/states/RouteErrorPage"
import AdminDashboard from "@/features/admin/dashboard/pages/AdminDashboard"
import { ROUTES } from "@/config"

export const adminRoutes: RouteObject = {
  path: ROUTES.admin.root,
  element: (
    <AdminProtectedRoute>
      <AdminLayout />
    </AdminProtectedRoute>
  ),
  errorElement: <RouteErrorPage />,
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: ROUTES.admin.users, element: <AdminUsersPage /> },
    { path: ROUTES.admin.userDetails(":id"), element: <AdminUserDetailsPage /> },
    { path: ROUTES.admin.candidates, element: <AdminCandidatesPage /> },
    { path: ROUTES.admin.employers, element: <AdminEmployersPage /> },
    { path: ROUTES.admin.companies, element: <AdminCompaniesPage /> },
    { path: ROUTES.admin.companyDetails(":id"), element: <AdminCompanyDetailsPage /> },
    { path: ROUTES.admin.jobs, element: <AdminJobsPage /> },
    { path: ROUTES.admin.jobDetails(":id"), element: <AdminJobDetailsPage /> },
    { path: ROUTES.admin.applications, element: <AdminApplicationsPage /> },
    { path: ROUTES.admin.skills, element: <AdminSkillsPage /> },
    { path: ROUTES.admin.tests, element: <AdminTestsPage /> },
    { path: ROUTES.admin.notifications, element: <AdminNotificationsPage /> },
    {
      path: ROUTES.admin.reports.root,
      element: <AdminReportsLayout />,
      children: [
        { index: true, element: <AdminReportsOverviewPage /> },
        { path: "overview", element: <AdminReportsOverviewPage /> },
        { path: "applications", element: <AdminReportsApplicationsPage /> },
        { path: "jobs", element: <AdminReportsJobsPage /> },
        { path: "cv-parsing", element: <AdminReportsCvParsingPage /> },
      ],
    },
    { path: ROUTES.admin.auditLogs, element: <AdminAuditLogsPage /> },
    { path: ROUTES.admin.settings, element: <AdminSettingsPage /> },
    {
      path: ROUTES.admin.help,
      element: (
        <AdminSectionPage
          title="Help & Support"
          description="Find platform guidance and operational support resources."
          icon={CircleHelp}
        />
      ),
    },
  ],
}
