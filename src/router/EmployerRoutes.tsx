import { Navigate, type RouteObject } from "react-router-dom"
import EmployerLayout from "@/layouts/employer/EmployerLayout"
import EmployerProtectedRoute from "@/features/employer/auth/components/EmployerProtectedRoute"
import EmployerDashboard from "@/features/employer/dashboard/pages/EmployerDashboard"
import EmployerJobsPage from "@/features/employer/jobs/pages/EmployerJobsPage"
import EmployerCreateJobPage from "@/features/employer/jobs/pages/EmployerCreateJobPage"
import EmployerEditJobPage from "@/features/employer/jobs/pages/EmployerEditJobPage"
import EmployerJobDetailsPage from "@/features/employer/jobs/pages/EmployerJobDetailsPage"
import EmployerApplicantsPage from "@/features/employer/applicants/pages/EmployerApplicantsPage"
import EmployerApplicantDetailsPage from "@/features/employer/applicants/pages/EmployerApplicantDetailsPage"
import EmployerApplicantTestDetailsPage from "@/features/employer/applicants/pages/EmployerApplicantTestDetailsPage"
import EmployerInterviewsPage from "@/features/employer/interviews/pages/EmployerInterviewsPage"
import EmployerInterviewDetailsPage from "@/features/employer/interviews/pages/EmployerInterviewDetailsPage"
import EmployerTestsPage from "@/features/employer/tests/pages/EmployerTestsPage"
import EmployerCreateTestPage from "@/features/employer/tests/pages/EmployerCreateTestPage"
import EmployerEditTestPage from "@/features/employer/tests/pages/EmployerEditTestPage"
import EmployerTestAttemptGradingPage from "@/features/employer/tests/pages/EmployerTestAttemptGradingPage"
import EmployerCompanyPage from "@/features/employer/company/pages/EmployerCompanyPage"
import EmployerProfilePage from "@/features/employer/profile/pages/EmployerProfilePage"
import EmployerNotificationsPage from "@/features/employer/notifications/pages/EmployerNotificationsPage"
import EmployerSettingsPage from "@/features/employer/settings/pages/EmployerSettingsPage"
import { ROUTES } from "@/config"
import RouteErrorPage from "@/components/shared/states/RouteErrorPage"

export const employerRoutes: RouteObject = {
  path: ROUTES.employer.root,
  element: (
    <EmployerProtectedRoute>
      <EmployerLayout />
    </EmployerProtectedRoute>
  ),
  errorElement: <RouteErrorPage />,
  children: [
    { index: true, element: <EmployerDashboard /> },
    { path: ROUTES.employer.jobs, element: <EmployerJobsPage /> },
    { path: ROUTES.employer.createJob, element: <EmployerCreateJobPage /> },
    { path: ROUTES.employer.jobDetails(":id"), element: <EmployerJobDetailsPage /> },
    { path: ROUTES.employer.editJob(":id"), element: <EmployerEditJobPage /> },
    { path: ROUTES.employer.applicants, element: <EmployerApplicantsPage /> },
    { path: "jobs/:jobId/applicants", element: <EmployerApplicantsPage /> },
    { path: "/employer/applicants/:id", element: <EmployerApplicantDetailsPage /> },
    { path: ROUTES.employer.applicantTestDetails(":id", ":assignmentId"), element: <EmployerApplicantTestDetailsPage /> },
    { path: ROUTES.employer.interviews, element: <EmployerInterviewsPage /> },
    { path: ROUTES.employer.interviewDetails(":id"), element: <EmployerInterviewDetailsPage /> },
    { path: ROUTES.employer.tests, element: <EmployerTestsPage /> },
    { path: ROUTES.employer.testDetails(":id"), element: <Navigate to={ROUTES.employer.tests} replace /> },
    { path: ROUTES.employer.createTest, element: <EmployerCreateTestPage /> },
    { path: ROUTES.employer.editTest(":id"), element: <EmployerEditTestPage /> },
    {
      path: ROUTES.employer.testAttemptGrading(":id", ":attemptId"),
      element: <EmployerTestAttemptGradingPage />,
    },
    { path: ROUTES.employer.company, element: <EmployerCompanyPage /> },
    { path: ROUTES.employer.profile, element: <EmployerProfilePage /> },
    { path: ROUTES.employer.notifications, element: <EmployerNotificationsPage /> },
    { path: ROUTES.employer.settings, element: <EmployerSettingsPage /> },
  ],
}
