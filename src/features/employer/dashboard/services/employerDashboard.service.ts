import { employerJobsService } from "@/features/employer/jobs/services/employerJobs.service"
import { employerNotificationsService } from "@/features/employer/notifications/services/employerNotifications.service"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import type { EmployerDashboardData } from "../types/employerDashboard.types"

export const employerDashboardService = {
  async getOverview(): Promise<EmployerDashboardData> {
    const [jobs, activeJobs, tests, unread] = await Promise.all([
      employerJobsService.list(1, { sort_by: "created_at", sort_direction: "desc" }, 100),
      employerJobsService.list(1, { accepting_applications: true }),
      employerTestsService.list(1),
      employerNotificationsService.getUnreadCount(),
    ])

    return {
      stats: {
        totalJobs: jobs.pagination.total,
        activeJobs: activeJobs.pagination.total,
        totalApplications: jobs.items.reduce(
          (total, job) => total + Number(job.applications_count ?? 0),
          0,
        ),
        totalTests: tests.pagination.total,
        unreadNotifications: unread.count ?? 0,
      },
      recentJobs: jobs.items.slice(0, 5),
    }
  },
}
