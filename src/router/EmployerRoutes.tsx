import { Navigate, type RouteObject } from "react-router-dom"
import { lazy, type ReactNode } from "react"
import EmployerLayout from "@/layouts/employer/EmployerLayout"
import EmployerProtectedRoute from "@/features/employer/auth/components/EmployerProtectedRoute"
import EmployerCompanyGate from "@/features/employer/company/components/EmployerCompanyGate"
import { ROUTES } from "@/config"
import RouteErrorPage from "@/components/shared/states/RouteErrorPage"
import { withRouteSuspense } from "./LazyRoute"

const EmployerDashboard = lazy(
  () => import("@/features/employer/dashboard/pages/EmployerDashboard"),
)
const EmployerJobsPage = lazy(() => import("@/features/employer/jobs/pages/EmployerJobsPage"))
const EmployerCreateJobPage = lazy(
  () => import("@/features/employer/jobs/pages/EmployerCreateJobPage"),
)
const EmployerEditJobPage = lazy(() => import("@/features/employer/jobs/pages/EmployerEditJobPage"))
const EmployerJobDetailsPage = lazy(
  () => import("@/features/employer/jobs/pages/EmployerJobDetailsPage"),
)
const EmployerApplicantsPage = lazy(
  () => import("@/features/employer/applicants/pages/EmployerApplicantsPage"),
)
const EmployerApplicantDetailsPage = lazy(
  () => import("@/features/employer/applicants/pages/EmployerApplicantDetailsPage"),
)
const EmployerApplicantTestDetailsPage = lazy(
  () => import("@/features/employer/applicants/pages/EmployerApplicantTestDetailsPage"),
)
const EmployerInterviewsPage = lazy(
  () => import("@/features/employer/interviews/pages/EmployerInterviewsPage"),
)
const EmployerInterviewDetailsPage = lazy(
  () => import("@/features/employer/interviews/pages/EmployerInterviewDetailsPage"),
)
const EmployerTestsPage = lazy(() => import("@/features/employer/tests/pages/EmployerTestsPage"))
const EmployerCreateTestPage = lazy(
  () => import("@/features/employer/tests/pages/EmployerCreateTestPage"),
)
const EmployerEditTestPage = lazy(
  () => import("@/features/employer/tests/pages/EmployerEditTestPage"),
)
const EmployerTestAttemptGradingPage = lazy(
  () => import("@/features/employer/tests/pages/EmployerTestAttemptGradingPage"),
)
const EmployerCompanyPage = lazy(
  () => import("@/features/employer/company/pages/EmployerCompanyPage"),
)
const EmployerProfilePage = lazy(
  () => import("@/features/employer/profile/pages/EmployerProfilePage"),
)
const EmployerNotificationsPage = lazy(
  () => import("@/features/employer/notifications/pages/EmployerNotificationsPage"),
)
const EmployerSettingsPage = lazy(
  () => import("@/features/employer/settings/pages/EmployerSettingsPage"),
)

const routePage = (element: ReactNode) => withRouteSuspense(element)
const gated = (element: ReactNode) =>
  routePage(<EmployerCompanyGate>{element}</EmployerCompanyGate>)

export const employerRoutes: RouteObject = {
  path: ROUTES.employer.root,
  element: (
    <EmployerProtectedRoute>
      <EmployerLayout />
    </EmployerProtectedRoute>
  ),
  errorElement: <RouteErrorPage />,
  children: [
    { index: true, element: routePage(<EmployerDashboard />) },
    { path: ROUTES.employer.jobs, element: gated(<EmployerJobsPage />) },
    { path: ROUTES.employer.createJob, element: gated(<EmployerCreateJobPage />) },
    { path: ROUTES.employer.jobDetails(":id"), element: gated(<EmployerJobDetailsPage />) },
    { path: ROUTES.employer.editJob(":id"), element: gated(<EmployerEditJobPage />) },
    { path: ROUTES.employer.applicants, element: gated(<EmployerApplicantsPage />) },
    { path: "jobs/:jobId/applicants", element: gated(<EmployerApplicantsPage />) },
    { path: "/employer/applicants/:id", element: gated(<EmployerApplicantDetailsPage />) },
    {
      path: ROUTES.employer.applicantTestDetails(":id", ":assignmentId"),
      element: gated(<EmployerApplicantTestDetailsPage />),
    },
    { path: ROUTES.employer.interviews, element: gated(<EmployerInterviewsPage />) },
    {
      path: ROUTES.employer.interviewDetails(":id"),
      element: gated(<EmployerInterviewDetailsPage />),
    },
    { path: ROUTES.employer.tests, element: gated(<EmployerTestsPage />) },
    {
      path: ROUTES.employer.testDetails(":id"),
      element: <Navigate to={ROUTES.employer.tests} replace />,
    },
    { path: ROUTES.employer.createTest, element: gated(<EmployerCreateTestPage />) },
    { path: ROUTES.employer.editTest(":id"), element: gated(<EmployerEditTestPage />) },
    {
      path: ROUTES.employer.testAttemptGrading(":id", ":attemptId"),
      element: gated(<EmployerTestAttemptGradingPage />),
    },
    { path: ROUTES.employer.company, element: routePage(<EmployerCompanyPage />) },
    { path: ROUTES.employer.profile, element: routePage(<EmployerProfilePage />) },
    { path: ROUTES.employer.notifications, element: routePage(<EmployerNotificationsPage />) },
    { path: ROUTES.employer.settings, element: routePage(<EmployerSettingsPage />) },
  ],
}
