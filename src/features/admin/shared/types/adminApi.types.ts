export interface AdminPagination {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface AdminCollection<T> {
  items: T[]
  pagination: AdminPagination
}

export interface AdminListParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  role?: string
  company?: string
  job?: string
  work_mode?: string
  employment_type?: string
  accepting_applications?: string | boolean
  sort_by?: string
  sort_direction?: string
  interview_type?: string
  interview_mode?: string
  from?: string
  to?: string
}

export interface AdminApiEnvelope<T> {
  success?: boolean
  message?: string
  data: T
}

export type AdminKeyValue = KeyValueLike

export type AdminKeyValueField = KeyValueField
import type { KeyValueField, KeyValueLike } from "@/lib/keyValue"
