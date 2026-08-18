import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import type { DataSource } from "@/components/shared/states/DataSourceIndicator"
import { employerJobsService } from "@/features/employer/jobs/services/employerJobs.service"
import { employerNotificationsService } from "@/features/employer/notifications/services/employerNotifications.service"
import { employerTestsService } from "@/features/employer/tests/services/employerTests.service"
import type { EmployerDashboardData } from "../types/employerDashboard.types"

export function useEmployerDashboard() {
  const jobsQuery = useQuery({
    queryKey: ["employer", "dashboard", "jobs"],
    queryFn: () =>
      employerJobsService.list(1, { sort_by: "created_at", sort_direction: "desc" }, 100),
    staleTime: 60_000,
  })

  const activeJobsQuery = useQuery({
    queryKey: ["employer", "dashboard", "activeJobs"],
    queryFn: () => employerJobsService.list(1, { accepting_applications: true }),
    staleTime: 60_000,
  })

  const testsQuery = useQuery({
    queryKey: ["employer", "dashboard", "tests"],
    queryFn: () => employerTestsService.list(1),
    staleTime: 60_000,
  })

  const notificationsQuery = useQuery({
    queryKey: ["employer", "dashboard", "notifications"],
    queryFn: () => employerNotificationsService.getUnreadCount(),
    staleTime: 60_000,
  })

  const queries = [jobsQuery, activeJobsQuery, testsQuery, notificationsQuery]

  const data = useMemo<EmployerDashboardData | undefined>(() => {
    const jobs = jobsQuery.data
    const activeJobs = activeJobsQuery.data
    const tests = testsQuery.data
    const unread = notificationsQuery.data

    if (!jobs || !activeJobs || !tests || !unread) return undefined

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
  }, [jobsQuery.data, activeJobsQuery.data, testsQuery.data, notificationsQuery.data])

  const dataSourceStatuses = useMemo<DataSource[]>(() => {
    function sourceStatus(
      query: (typeof queries)[number],
      label: string,
    ): DataSource {
      if (query.isError) return { label, status: "unavailable" }
      if (query.isPending || query.isFetching) return { label, status: "partial" }
      return { label, status: "live" }
    }
    return [
      sourceStatus(jobsQuery, "Jobs"),
      sourceStatus(activeJobsQuery, "Active jobs"),
      sourceStatus(testsQuery, "Tests"),
      sourceStatus(notificationsQuery, "Notifications"),
    ]
  }, [jobsQuery.status, activeJobsQuery.status, testsQuery.status, notificationsQuery.status])

  return {
    data,
    isLoading: queries.some((q) => q.isPending),
    isFetching: queries.some((q) => q.isFetching),
    isError: queries.every((q) => q.isError),
    error: queries.find((q) => q.error)?.error,
    refetch: () => Promise.all(queries.map((q) => q.refetch())),
    dataSourceStatuses,
  }
}
