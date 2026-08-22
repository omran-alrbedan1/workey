import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"

export interface AdminCompanyRecord {
  id: string | number
  name: string
  industry?: string | null
  website?: string | null
  location?: string | null
  status?: AdminKeyValueField
  approval_status?: AdminKeyValueField
  created_at?: string
  employer?: { name?: string; email?: string; status?: AdminKeyValueField }
}

export interface AdminCompanyContact {
  name?: string | null
  email?: string | null
  phone?: string | null
  title?: string | null
}

export interface AdminCompanyEmployerSummary {
  id?: string | number
  name?: string | null
  email?: string | null
  phone?: string | null
  status?: AdminKeyValueField
}

export interface AdminCompanyVerificationItem {
  key: string
  label: string
  status: string
  note?: string | null
  updated_at?: string | null
}

export interface AdminCompanyRecentJob {
  id: string | number
  title: string
  status: string
  applications_count?: number | null
  created_at?: string | null
}

export interface AdminCompanyActivityItem {
  id: string | number
  type: string
  message: string
  actor_name?: string | null
  created_at?: string | null
}

export interface AdminCompanyDetails extends AdminCompanyRecord {
  legal_name?: string | null
  description?: string | null
  size?: string | null
  founded_year?: number | null
  address?: string | null
  city?: string | null
  country?: string | null
  phone?: string | null
  contact_email?: string | null
  registration_number?: string | null
  tax_id?: string | null
  employee_count?: number | null
  active_jobs_count?: number | null
  total_jobs_count?: number | null
  total_hires_count?: number | null
  total_applications_count?: number | null
  profile_completion?: number | null
  created_by?: AdminCompanyContact | null
  employer?: AdminCompanyEmployerSummary | null
  verification_items?: AdminCompanyVerificationItem[]
  recent_jobs?: AdminCompanyRecentJob[]
  recent_activity?: AdminCompanyActivityItem[]
  admin_notes?: string | null
  approval_notes?: string | null
  rejection_reason?: string | null
  latest_decision?: {
    status?: AdminKeyValueField
    actor?: AdminCompanyContact | null
    actor_name?: string | null
    reason?: string | null
    decided_at?: string | null
    created_at?: string | null
  } | null
  approval_decision?: {
    status?: AdminKeyValueField
    actor?: AdminCompanyContact | null
    actor_name?: string | null
    reason?: string | null
    decided_at?: string | null
    created_at?: string | null
  } | null
  approved_by?: AdminCompanyContact | null
  rejected_by?: AdminCompanyContact | null
  suspended_by?: AdminCompanyContact | null
  approved_at?: string | null
  rejected_at?: string | null
  suspended_at?: string | null
  last_active_at?: string | null
}

export interface AdminCompanyOwnerInput {
  name?: string
  email: string
}

export interface AdminCompanyInput {
  name: string
  industry?: string | null
  website?: string | null
  location?: string | null
  description?: string | null
  approval_status?: string
  owner?: AdminCompanyOwnerInput
}

export interface AdminCompanyFilterForm {
  search: string
  status: string
  industry: string
}

export const ADMIN_COMPANY_FILTER_DEFAULTS: AdminCompanyFilterForm = {
  search: "",
  status: "all",
  industry: "all",
}
