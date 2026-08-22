import type { AdminKeyValueField } from "@/features/admin/shared/types/adminApi.types"

export type UserRole = "admin" | "job_seeker" | "employer"
export type UserStatus = "active" | "suspended"

export interface AdminUser {
  id: number | string
  name: string
  email: string
  role: UserRole | string
  status: UserStatus | string
  created_at?: string
  updated_at?: string
}

export interface AdminCompany {
  id: number | string
  name: string
  industry?: string | null
  location?: string | null
  status?: AdminKeyValueField
  approval_status?: AdminKeyValueField
  created_at?: string
  updated_at?: string
}

export interface AdminSkill {
  id: number | string
  name: string
  slug: string
  created_at?: string
}

export interface AdminTest {
  id: number | string
  title: string
  is_active?: boolean
  created_at?: string
}

export interface AdminJob {
  id: number | string
  title: string
  status?: AdminKeyValueField
  accepting_applications?: boolean
  is_accepting_applications?: boolean
  created_at?: string
}

export interface AdminApplication {
  id: number | string
  status?: string | AdminKeyValueField
  created_at?: string
  applied_at?: string
  submitted_at?: string
  job?: {
    title?: string
  }
  company?: {
    name?: string
  }
}

export interface AdminInterview {
  id: number | string
  status?: AdminKeyValueField
  scheduled_at?: string
  scheduled_start_at?: string
  created_at?: string
  application?: {
    job?: {
      title?: string
    }
  }
}

export interface CollectionMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface CollectionResult<T> {
  items: T[]
  meta: CollectionMeta
}

export type DashboardMetricIcon =
  | "users"
  | "companies"
  | "pending"
  | "jobs"
  | "applications"
  | "interviews"
  | "tests"

export interface DashboardMetric {
  label: string
  value: number
  subtitle: string
  icon: DashboardMetricIcon
  approximate?: boolean
}

export interface DistributionItem {
  name: string
  value: number
  color: string
}

export interface AttentionItem {
  id: string
  title: string
  description: string
  count: number
  route: string
  tone: "warning" | "danger" | "info"
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp?: string
  type: "user" | "company" | "job" | "application" | "interview" | "test"
}

export interface AdminDashboardData {
  metrics: DashboardMetric[]
  roleDistribution: DistributionItem[]
  companyDistribution: DistributionItem[]
  attentionItems: AttentionItem[]
  recentActivity: ActivityItem[]
  sampledUsers: boolean
  sampledCompanies: boolean
}
