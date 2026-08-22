import { keepPreviousData, useQuery } from "@tanstack/react-query"

import type { AdminListParams } from "@/features/admin/shared/types/adminApi.types"

import { adminUsersService } from "../services/adminUsers.service"

const relatedPageSize = 10

export type AdminUserRelatedSection =
  | "applications"
  | "jobs"
  | "interviews"
  | "tests"
  | "activity"
  | "audit-logs"
  | "login-history"
  | "sessions"

interface RelatedQueryOptions {
  enabled?: boolean
  page?: number
}

function useRelatedQuery<T>(
  section: AdminUserRelatedSection,
  id: string | number | undefined,
  fetcher: (userId: string, params: AdminListParams) => Promise<T>,
  options: RelatedQueryOptions = {},
) {
  const page = options.page ?? 1
  return useQuery({
    queryKey: ["admin", "users", String(id ?? "missing"), section, { page }],
    queryFn: () => fetcher(String(id), { page, per_page: relatedPageSize }),
    enabled: Boolean(id) && (options.enabled ?? true),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useAdminUserApplications(
  id: string | number | undefined,
  options: RelatedQueryOptions = {},
) {
  return useRelatedQuery("applications", id, adminUsersService.listApplications, options)
}

export function useAdminUserJobs(
  id: string | number | undefined,
  options: RelatedQueryOptions = {},
) {
  return useRelatedQuery("jobs", id, adminUsersService.listJobs, options)
}

export function useAdminUserInterviews(
  id: string | number | undefined,
  options: RelatedQueryOptions = {},
) {
  return useRelatedQuery("interviews", id, adminUsersService.listInterviews, options)
}

export function useAdminUserTestAssignments(
  id: string | number | undefined,
  options: RelatedQueryOptions = {},
) {
  return useRelatedQuery("tests", id, adminUsersService.listTestAssignments, options)
}

export function useAdminUserActivity(
  id: string | number | undefined,
  options: RelatedQueryOptions = {},
) {
  return useRelatedQuery("activity", id, adminUsersService.listActivity, options)
}

export function useAdminUserAuditLogs(
  id: string | number | undefined,
  options: RelatedQueryOptions = {},
) {
  return useRelatedQuery("audit-logs", id, adminUsersService.listAuditLogs, options)
}

export function useAdminUserLoginHistory(
  id: string | number | undefined,
  options: RelatedQueryOptions = {},
) {
  return useRelatedQuery("login-history", id, adminUsersService.listLoginHistory, options)
}

export function useAdminUserSessions(
  id: string | number | undefined,
  options: RelatedQueryOptions = {},
) {
  return useRelatedQuery("sessions", id, adminUsersService.listSessions, options)
}
