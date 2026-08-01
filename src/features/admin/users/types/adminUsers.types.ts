import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"

export type AdminUserRole = "admin" | "job_seeker" | "employer"
export type AdminUserStatus = "active" | "suspended"

export interface AdminUserRecord {
  id: string | number
  name: string
  email: string
  role: AdminUserRole | string
  status: AdminUserStatus | string | AdminKeyValueField
  created_at?: string
  phone?: string | null
  avatar_url?: string | null
  email_verified_at?: string | null
  last_login_at?: string | null
  last_active_at?: string | null
}

export interface AdminUserActivityItem {
  id: string | number
  type?: string | null
  action: string
  description?: string | null
  actor_name?: string | null
  ip_address?: string | null
  user_agent?: string | null
  created_at: string
}

export interface AdminUserLoginItem {
  id: string | number
  status?: AdminKeyValueField
  ip_address?: string | null
  user_agent?: string | null
  device?: string | null
  location?: string | null
  created_at: string
}

export interface AdminUserSessionItem {
  id: string | number
  device?: string | null
  ip_address?: string | null
  location?: string | null
  last_active_at?: string | null
  current?: boolean
}

export interface AdminUserRelatedItem {
  id: string | number
  title: string
  status?: AdminKeyValueField
  subtitle?: string | null
  created_at?: string | null
}

export interface AdminUserDetails extends AdminUserRecord {
  first_name?: string | null
  last_name?: string | null
  date_of_birth?: string | null
  gender?: string | null
  locale?: string | null
  timezone?: string | null
  country?: string | null
  city?: string | null
  address?: string | null
  bio?: string | null
  profile_completion?: number | null
  two_factor_enabled?: boolean
  failed_login_attempts?: number | null
  password_changed_at?: string | null
  suspended_at?: string | null
  suspension_reason?: string | null
  updated_at?: string | null
  deleted_at?: string | null
  company?: { id?: string | number; name?: string | null; status?: AdminKeyValueField } | null
  counts?: {
    applications?: number
    jobs?: number
    interviews?: number
    tests?: number
    notifications?: number
  }
  activity_logs?: AdminUserActivityItem[]
  audit_logs?: AdminUserActivityItem[]
  login_history?: AdminUserLoginItem[]
  active_sessions?: AdminUserSessionItem[]
  applications?: AdminUserRelatedItem[]
  jobs?: AdminUserRelatedItem[]
  interviews?: AdminUserRelatedItem[]
  tests?: AdminUserRelatedItem[]
}

export interface UpdateUserRoleInput {
  id: string | number
  role: AdminUserRole
}
export interface UpdateUserStatusInput {
  id: string | number
  status: AdminUserStatus
  reason?: string
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
