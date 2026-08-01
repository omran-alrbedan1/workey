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
  AdminCompany,
  AdminDashboardData,
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
  t: (key: string, options?: Record<string, unknown>) => string,
): ActivityItem[] {
  const userActivity: ActivityItem[] = users.slice(0, 6).map((user) => ({
    id: `user-${user.id}`,
    title: user.name || user.email,
    description: t("registeredAs", { role: user.role.replaceAll("_", " ") }),
    timestamp: user.created_at,
    type: "user",
  }))

  const companyActivity: ActivityItem[] = companies.slice(0, 6).map((company) => ({
    id: `company-${company.id}`,
    title: company.name,
    description: t("companyStatus", { status: statusLabelOf(company) }),
    timestamp: company.created_at,
    type: "company",
  }))

  return [...userActivity, ...companyActivity]
    .sort((a, b) => dateValue(b.timestamp) - dateValue(a.timestamp))
    .slice(0, 6)
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

  const skillsQuery = useQuery({
    queryKey: adminDashboardQueryKeys.skills(),
    queryFn: adminDashboardService.getSkills,
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
    const skills = skillsQuery.data ?? emptyCollection()
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
    const inactiveTests = tests.items.filter((test) => test.is_active === false).length
    const sampledUsers = users.meta.total > users.items.length
    const sampledCompanies = companies.meta.total > companies.items.length

    const roleDistribution: DistributionItem[] = [
      { name: t("roles.jobSeekers"), value: jobSeekers, color: "#0645A5" },
      { name: t("roles.employers"), value: employers, color: "#6C5CE7" },
      { name: t("roles.admins"), value: admins, color: "#3357A8" },
    ]

    const companyDistribution: DistributionItem[] = [
      { name: t("statuses.approved"), value: approvedCompanies, color: "#10B981" },
      { name: t("statuses.pending"), value: pendingCompanies, color: "#F59E0B" },
      { name: t("statuses.rejected"), value: rejectedCompanies, color: "#F43F5E" },
    ]

    const failedSources = [
      usersQuery.isError ? t("sources.users") : null,
      companiesQuery.isError ? t("sources.companies") : null,
      skillsQuery.isError ? t("sources.skills") : null,
      testsQuery.isError ? t("sources.tests") : null,
    ].filter((source): source is string => source !== null)

    return {
      metrics: [
        {
          label: t("metrics.totalUsers"),
          value: users.meta.total,
          subtitle: t("metrics.totalUsersSub"),
          icon: "users",
        },
        {
          label: t("metrics.jobSeekers"),
          value: jobSeekers,
          subtitle: sampledUsers ? t("metrics.sampleSub") : t("metrics.candidateAccounts"),
          icon: "candidates",
          approximate: sampledUsers,
        },
        {
          label: t("metrics.employers"),
          value: employers,
          subtitle: sampledUsers ? t("metrics.sampleSub") : t("metrics.employerAccounts"),
          icon: "employers",
          approximate: sampledUsers,
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
          label: t("metrics.suspendedUsers"),
          value: suspendedUsers,
          subtitle: t("metrics.suspendedUsersSub"),
          icon: "suspended",
          approximate: sampledUsers,
        },
        {
          label: t("metrics.skills"),
          value: skills.meta.total,
          subtitle: t("metrics.skillsSub"),
          icon: "skills",
        },
        {
          label: t("metrics.activeTests"),
          value: tests.items.filter((test) => test.is_active !== false).length,
          subtitle: t("metrics.activeTestsSub"),
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
          id: "inactive-tests",
          title: t("attention.inactiveTests"),
          description: t("attention.inactiveTestsSub"),
          count: inactiveTests,
          route: ROUTES.admin.tests,
          tone: "info",
        },
      ],
      recentActivity: createActivity(users.items, companies.items, t),
      failedSources,
      sampledUsers,
      sampledCompanies,
    }
  }, [
    usersQuery.data,
    usersQuery.isError,
    companiesQuery.data,
    companiesQuery.isError,
    skillsQuery.data,
    skillsQuery.isError,
    testsQuery.data,
    testsQuery.isError,
    t,
  ])

  const queries = [usersQuery, companiesQuery, skillsQuery, testsQuery]

  return {
    data,
    isLoading: queries.some((query) => query.isPending),
    isFetching: queries.some((query) => query.isFetching),
    isError: queries.every((query) => query.isError),
    error: queries.find((query) => query.error)?.error,
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  }
}
