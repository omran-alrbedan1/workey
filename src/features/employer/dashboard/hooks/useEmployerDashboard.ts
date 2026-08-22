import { useMemo } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { employerApplicantsService } from "@/features/employer/applicants/services/employerApplicants.service"
import type { EmployerApplicantDetail } from "@/features/employer/applicants/types/employerApplicants.types"
import { employerJobsService } from "@/features/employer/jobs/services/employerJobs.service"
import { keyOf } from "@/lib/keyValue"
import type {
  EmployerDashboardData,
  EmployerFunnelItem,
  EmployerRecentApplication,
} from "../types/employerDashboard.types"

const DASHBOARD_PAGE_SIZE = 100
const TERMINAL_APPLICATION_STATUSES = new Set(["accepted", "rejected", "withdrawn"])

function applicationDate(application: EmployerApplicantDetail): string {
  return application.applied_at ?? application.created_at ?? ""
}

function statusKey(application: EmployerApplicantDetail): string {
  return keyOf(application.status).toLowerCase()
}

export function useEmployerDashboard() {
  const { t } = useTranslation("employerDashboard")
  const jobsQuery = useQuery({
    queryKey: ["employer", "dashboard", "jobs"],
    queryFn: () =>
      employerJobsService.list(
        1,
        { sort_by: "created_at", sort_direction: "desc" },
        DASHBOARD_PAGE_SIZE,
      ),
    staleTime: 60_000,
  })

  const openJobsQuery = useQuery({
    queryKey: ["employer", "dashboard", "openJobs"],
    queryFn: () => employerJobsService.list(1, { accepting_applications: true }, 1),
    staleTime: 60_000,
  })

  const jobItems = jobsQuery.data?.items ?? []
  const applicationsQueries = useQueries({
    queries: jobItems.map((job) => ({
      queryKey: ["employer", "dashboard", "jobApplications", job.id],
      queryFn: () => employerApplicantsService.list(job.id, 1, DASHBOARD_PAGE_SIZE),
      staleTime: 60_000,
      enabled: Boolean(jobsQuery.data),
    })),
  })

  const data = useMemo<EmployerDashboardData | undefined>(() => {
    if (!jobsQuery.data || !openJobsQuery.data) return undefined
    if (applicationsQueries.some((query) => query.isPending)) return undefined

    const applicationGroups = applicationsQueries.map((query, index) => ({
      job: jobItems[index],
      applications: query.data?.items ?? [],
    }))
    const applications = applicationGroups.flatMap(({ job, applications }) =>
      applications.map<EmployerRecentApplication>((application) => ({ application, job })),
    )
    const activeApplications = applications.filter(
      ({ application }) => !TERMINAL_APPLICATION_STATUSES.has(statusKey(application)),
    )
    const upcomingInterviews = applications.filter(
      ({ application }) =>
        statusKey(application) === "interview_scheduled" ||
        statusKey(application) === "interview_pending",
    ).length
    const pendingTests = applications.filter(
      ({ application }) => statusKey(application) === "test_pending",
    ).length
    const recentApplications = [...applications]
      .sort((a, b) => applicationDate(b.application).localeCompare(applicationDate(a.application)))
      .slice(0, 5)

    const funnelKeys = [
      "submitted",
      "under_review",
      "shortlisted",
      "test_pending",
      "interview_scheduled",
      "final_review",
      "accepted",
    ]
    const funnel: EmployerFunnelItem[] = funnelKeys.map((key) => ({
      key,
      label: t(`funnel.statuses.${key}`),
      value: applications.filter(({ application }) => statusKey(application) === key).length,
    }))

    return {
      stats: {
        openJobs: openJobsQuery.data.pagination.total,
        activeApplicants: activeApplications.length,
        upcomingInterviews,
        pendingTests,
      },
      recentJobs: jobsQuery.data.items.slice(0, 5),
      recentApplications,
      funnel,
    }
  }, [applicationsQueries, jobItems, jobsQuery.data, openJobsQuery.data, t])

  const queries = [jobsQuery, openJobsQuery, ...applicationsQueries]

  return {
    data,
    isLoading: queries.some((query) => query.isPending),
    isFetching: queries.some((query) => query.isFetching),
    isError: queries.some((query) => query.isError),
    error: queries.find((query) => query.error)?.error,
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  }
}
