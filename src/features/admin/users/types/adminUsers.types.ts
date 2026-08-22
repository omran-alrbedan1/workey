import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"

export type AdminUserRole = "admin" | "job_seeker" | "employer"
export type AdminUserStatus = "active" | "suspended"

/**
 * Mirrors the backend UserResource:
 * id, name, email, role (LocalizedValue), status (LocalizedValue),
 * avatar_url, email_verified_at, is_email_verified,
 * job_seeker_profile?, employer_profile?, created_at
 */
export interface AdminUserProfileRef {
  id?: string | number
  user_id?: string | number
}

export interface AdminUserJobSeekerProfile extends AdminUserProfileRef {
  headline?: string | null
  summary?: string | null
  phone?: string | null
  location?: string | null
  city?: { id?: string | number; name?: string | null } | null
  portfolio_url?: string | null
  linkedin_url?: string | null
  github_url?: string | null
}

export interface AdminUserCompanyRef {
  id?: string | number
  name?: string | null
  approval_status?: AdminKeyValueField
}

export interface AdminUserEmployerProfile extends AdminUserProfileRef {
  company_id?: string | number | null
  company_role?: AdminKeyValueField
  membership_status?: AdminKeyValueField
  joined_at?: string | null
  job_title?: string | null
  phone?: string | null
  bio?: string | null
  company?: AdminUserCompanyRef | null
}

export interface AdminUserRecord {
  id: string | number
  name: string
  email: string
  role: AdminUserRole | string | AdminKeyValueField
  status: AdminUserStatus | string | AdminKeyValueField
  avatar_url?: string | null
  email_verified_at?: string | null
  is_email_verified?: boolean
  created_at?: string
  job_seeker_profile?: AdminUserJobSeekerProfile | null
  employer_profile?: AdminUserEmployerProfile | null
}

export type AdminUserActivitySource = "audit" | "notification"

/** GET /admin/users/{id}/activity -> AdminUserActivityResource */
export interface AdminUserActivityEvent {
  id: string
  event_key: string
  source: AdminUserActivitySource | string
  relation: string
  occurred_at?: string | null
  context?: Record<string, unknown>
}

/** GET /admin/users/{id}/audit-logs -> AuditLogResource */
export interface AdminUserAuditLogItem {
  id: string | number
  action: string
  entity_type?: string | null
  entity?: AdminKeyValueField | null
  entity_id?: string | number | null
  actor_user_id?: string | number | null
  actor?: Pick<AdminUserRecord, "id" | "name" | "email"> | null
  ip_address?: string | null
  user_agent?: string | null
  created_at?: string | null
}

/** GET /admin/users/{id}/login-history -> LoginHistoryResource */
export interface AdminUserLoginItem {
  id: string | number
  logged_in_at?: string | null
  ip_address?: string | null
  user_agent?: string | null
  device_name?: string | null
  platform?: string | null
  success?: boolean
}

/** GET /admin/users/{id}/sessions -> AdminUserSessionResource */
export interface AdminUserSessionItem {
  id: string
  name?: string | null
  created_at?: string | null
  last_used_at?: string | null
  expires_at?: string | null
  ip_address?: string | null
  user_agent?: string | null
  device_name?: string | null
  platform?: string | null
  is_current?: boolean
}

/** GET /admin/users/{id}/applications -> AdminUserApplicationResource */
export interface AdminUserApplicationItem {
  id: string | number
  candidate?: {
    user_id?: string | number | null
    profile_id?: string | number | null
    name?: string | null
    email?: string | null
  } | null
  job?: { id?: string | number; title?: string | null } | null
  company?: { id?: string | number; name?: string | null } | null
  status?: AdminKeyValueField
  applied_at?: string | null
  updated_at?: string | null
}

/** GET /admin/users/{id}/jobs -> AdminUserJobResource */
export interface AdminUserJobItem {
  id: string | number
  title?: string | null
  status?: string | AdminKeyValueField
  work_mode?: string | AdminKeyValueField | null
  location?: string | null
  company?: { id?: string | number; name?: string | null } | null
  applications_count?: number
  relation?: string | null
  created_at?: string | null
  published_at?: string | null
  application_deadline?: string | null
}

/** GET /admin/users/{id}/interviews -> AdminUserInterviewResource */
export interface AdminUserInterviewItem {
  id: string | number
  relation?: string | null
  type?: AdminKeyValueField
  mode?: AdminKeyValueField
  status?: AdminKeyValueField
  scheduled_at?: string | null
  scheduled_end_at?: string | null
  duration_minutes?: number | null
  job?: { id?: string | number; title?: string | null } | null
  company?: { id?: string | number; name?: string | null } | null
  candidate?: {
    user_id?: string | number | null
    profile_id?: string | number | null
    name?: string | null
    email?: string | null
  } | null
  created_at?: string | null
  updated_at?: string | null
}

/** GET /admin/users/{id}/test-assignments -> AdminUserTestAssignmentResource */
export interface AdminUserTestAssignmentItem {
  id: string | number
  relations?: string[]
  test?: {
    id?: string | number
    title?: string | null
    duration_minutes?: number | null
  } | null
  assignment?: {
    attempt_number?: number | null
    max_attempts?: number | null
    assigned_at?: string | null
    deadline_at?: string | null
  } | null
  state?: AdminKeyValueField
  attempt?: {
    id?: string | number
    started_at?: string | null
    submitted_at?: string | null
    forfeited_at?: string | null
    forfeit_reason?: AdminKeyValueField | null
    grading_status?: AdminKeyValueField | null
    total_score?: number | string | null
    max_score?: number | string | null
    percentage?: number | string | null
    evaluated_at?: string | null
  } | null
  job?: { id?: string | number; title?: string | null } | null
  company?: { id?: string | number; name?: string | null } | null
  candidate?: {
    user_id?: string | number | null
    profile_id?: string | number | null
    name?: string | null
    email?: string | null
  } | null
  created_at?: string | null
  updated_at?: string | null
}

export interface UpdateUserRoleInput {
  id: string | number
  role: AdminUserRole
}
export interface UpdateUserStatusInput {
  id: string | number
  status: AdminUserStatus
}

export interface AdminUserFilterForm {
  search: string
  role: string
  status: string
}

export const ADMIN_USER_FILTER_DEFAULTS: AdminUserFilterForm = {
  search: "",
  role: "all",
  status: "all",
}
