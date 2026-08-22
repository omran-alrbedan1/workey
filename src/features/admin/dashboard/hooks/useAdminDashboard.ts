import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { ROUTES } from "@/config"
import {
  normalizeKeyValue,
  normalizeKeyValueLabel,
} from "@/features/admin/shared/services/adminResponse.utils"
import { keyOf } from "@/lib/keyValue"
import {
  ADMIN_DASHBOARD_STALE_TIME,
  adminDashboardQueryKeys,
} from "../constants/adminDashboard.constants"
import { adminDashboardService } from "../services/adminDashboard.service"
import type {
  ActivityItem,
  AdminApplication,
  AdminCompany,
  AdminDashboardData,
  AdminInterview,
  AdminJob,
  AdminTest,
  AdminUser,
  CollectionResult,
  DistributionItem,
} from "../types/adminDashboard.types"

function statusOf(company: AdminCompany): string {
  return normalizeKeyValue(company.approval_status ?? company.status, "pending").toLowerCase()
}

function statusLabelOf(company: AdminCompany): string {
  return normalizeKeyValueLabel(company.approval_status ?? company.status, "pending")
}

function dateValue(value?: string): number {
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : 0
}

function createActivity(
  users: AdminUser[],
  companies: AdminCompany[],
  jobs: AdminJob[],
  applications: AdminApplication[],
  interviews: AdminInterview[],
  tests: AdminTest[],
  t: (key: string, options?: Record<string, unknown>) => string,
): ActivityItem[] {
  const userActivity: ActivityItem[] = users.slice(0, 4).map((user) => ({
    id: `user-${user.id}`,
    title: user.name || user.email,
    description: t("registeredAs", { role: user.role.replaceAll("_", " ") }),
    timestamp: user.created_at,
    type: "user",
  }))

  const companyActivity: ActivityItem[] = companies.slice(0, 4).map((company) => ({
    id: `company-${company.id}`,
    title: company.name,
    description: t("companyStatus", { status: statusLabelOf(company) }),
    timestamp: company.created_at,
    type: "company",
  }))

  const jobActivity: ActivityItem[] = jobs.slice(0, 4).map((job) => ({
    id: `job-${job.id}`,
    title: job.title,
    description: t("jobPosted"),
    timestamp: job.created_at,
    type: "job",
  }))

  const applicationActivity: ActivityItem[] = applications.slice(0, 4).map((application) => ({
    id: `application-${application.id}`,
    title: application.job?.title || application.company?.name || t("applicationFallback"),
    description: t("applicationReceived"),
    timestamp: application.applied_at ?? application.submitted_at ?? application.created_at,
    type: "application",
  }))

  const interviewActivity: ActivityItem[] = interviews.slice(0, 4).map((interview) => ({
    id: `interview-${interview.id}`,
    title: interview.application?.job?.title || t("interviewFallback"),
    description: t("interviewScheduled"),
    timestamp: interview.scheduled_start_at ?? interview.scheduled_at ?? interview.created_at,
    type: "interview",
  }))

  const testActivity: ActivityItem[] = tests.slice(0, 4).map((test) => ({
    id: `test-${test.id}`,
    title: test.title,
    description: t("testCreated"),
    timestamp: test.created_at,
    type: "test",
  }))

  return [
    ...userActivity,
    ...companyActivity,
    ...jobActivity,
    ...applicationActivity,
    ...interviewActivity,
    ...testActivity,
  ]
    .sort((a, b) => dateValue(b.timestamp) - dateValue(a.timestamp))
    .slice(0, 8)
}

function emptyCollection<T>(): CollectionResult<T> {
  return {
    items: [],
    meta: { currentPage: 1, lastPage: 1, perPage: 0, total: 0 },
  }
}

export function useAdminDashboard() {
  const { t } = useTranslation("adminDashboard")
  const usersQuery = useQuery({
    queryKey: adminDashboardQueryKeys.users(),
    queryFn: adminDashboardService.getUsers,
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  })

  const companiesQuery = useQuery({
    queryKey: adminDashboardQueryKeys.companies(),
    queryFn: adminDashboardService.getCompanies,
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  })

  const jobsQuery = useQuery({
    queryKey: [...adminDashboardQueryKeys.root, "jobs"],
    queryFn: adminDashboardService.getJobs,
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  })

  const openJobsQuery = useQuery({
    queryKey: [...adminDashboardQueryKeys.root, "openJobs"],
    queryFn: adminDashboardService.getOpenJobs,
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  })

  const applicationsQuery = useQuery({
    queryKey: [...adminDashboardQueryKeys.root, "applications"],
    queryFn: adminDashboardService.getApplications,
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  })

  const interviewsQuery = useQuery({
    queryKey: [...adminDashboardQueryKeys.root, "interviews"],
    queryFn: adminDashboardService.getInterviews,
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  })

  const testsQuery = useQuery({
    queryKey: adminDashboardQueryKeys.tests(),
    queryFn: adminDashboardService.getTests,
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  })

  const data = useMemo<AdminDashboardData>(() => {
    const users = usersQuery.data ?? emptyCollection<AdminUser>()
    const companies = companiesQuery.data ?? emptyCollection<AdminCompany>()
    const jobs = jobsQuery.data ?? emptyCollection<AdminJob>()
    const openJobs = openJobsQuery.data ?? emptyCollection<AdminJob>()
    const applications = applicationsQuery.data ?? emptyCollection<AdminApplication>()
    const interviews = interviewsQuery.data ?? emptyCollection<AdminInterview>()
    const tests = testsQuery.data ?? emptyCollection<AdminTest>()

    const jobSeekers = users.items.filter((user) => user.role === "job_seeker").length
    const employers = users.items.filter((user) => user.role === "employer").length
    const admins = users.items.filter((user) => user.role === "admin").length
    const suspendedUsers = users.items.filter(
      (user) => keyOf(user.status).toLowerCase() === "suspended",
    ).length
    const pendingCompanies = companies.items.filter(
      (company) => statusOf(company) === "pending",
    ).length
    const approvedCompanies = companies.items.filter(
      (company) => statusOf(company) === "approved",
    ).length
    const rejectedCompanies = companies.items.filter(
      (company) => statusOf(company) === "rejected",
    ).length
    const sampledUsers = users.meta.total > users.items.length
    const sampledCompanies = companies.meta.total > companies.items.length

    const roleDistribution: DistributionItem[] = [
      { name: t("roles.jobSeekers"), value: jobSeekers, color: "#18A949" },
      { name: t("roles.employers"), value: employers, color: "#1B2831" },
      { name: t("roles.admins"), value: admins, color: "#29B148" },
    ]

    const companyDistribution: DistributionItem[] = [
      { name: t("statuses.approved"), value: approvedCompanies, color: "#10B981" },
      { name: t("statuses.pending"), value: pendingCompanies, color: "#F59E0B" },
      { name: t("statuses.rejected"), value: rejectedCompanies, color: "#F43F5E" },
    ]

    return {
      metrics: [
        {
          label: t("metrics.totalUsers"),
          value: users.meta.total,
          subtitle: t("metrics.totalUsersSub"),
          icon: "users",
        },
        {
          label: t("metrics.companies"),
          value: companies.meta.total,
          subtitle: t("metrics.companiesSub"),
          icon: "companies",
        },
        {
          label: t("metrics.pendingCompanies"),
          value: pendingCompanies,
          subtitle: t("metrics.pendingCompaniesSub"),
          icon: "pending",
          approximate: sampledCompanies,
        },
        {
          label: t("metrics.openJobs"),
          value: openJobs.meta.total,
          subtitle: t("metrics.openJobsSub"),
          icon: "jobs",
        },
        {
          label: t("metrics.applications"),
          value: applications.meta.total,
          subtitle: t("metrics.applicationsSub"),
          icon: "applications",
        },
        {
          label: t("metrics.interviews"),
          value: interviews.meta.total,
          subtitle: t("metrics.interviewsSub"),
          icon: "interviews",
        },
        {
          label: t("metrics.tests"),
          value: tests.meta.total,
          subtitle: t("metrics.testsSub"),
          icon: "tests",
        },
      ],
      roleDistribution,
      companyDistribution,
      attentionItems: [
        {
          id: "pending-companies",
          title: t("attention.companyApprovals"),
          description: t("attention.companyApprovalsSub"),
          count: pendingCompanies,
          route: ROUTES.admin.companies,
          tone: "warning",
        },
        {
          id: "suspended-users",
          title: t("attention.suspended"),
          description: t("attention.suspendedSub"),
          count: suspendedUsers,
          route: ROUTES.admin.users,
          tone: "danger",
        },
        {
          id: "open-jobs",
          title: t("attention.openJobs"),
          description: t("attention.openJobsSub"),
          count: openJobs.meta.total,
          route: ROUTES.admin.jobs,
          tone: "info",
        },
      ],
      recentActivity: createActivity(
        users.items,
        companies.items,
        jobs.items,
        applications.items,
        interviews.items,
        tests.items,
        t,
      ),
      sampledUsers,
      sampledCompanies,
    }
  }, [
    usersQuery.data,
    companiesQuery.data,
    jobsQuery.data,
    openJobsQuery.data,
    applicationsQuery.data,
    interviewsQuery.data,
    testsQuery.data,
    t,
  ])

  const queries = [
    usersQuery,
    companiesQuery,
    jobsQuery,
    openJobsQuery,
    applicationsQuery,
    interviewsQuery,
    testsQuery,
  ]

  return {
    data,
    isLoading: queries.some((query) => query.isPending),
    isFetching: queries.some((query) => query.isFetching),
    isError: queries.some((query) => query.error),
    error: queries.find((query) => query.error)?.error,
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  }
}
