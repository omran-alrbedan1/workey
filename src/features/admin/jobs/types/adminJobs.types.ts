export interface AdminJobRecord {
  id: string | number
  title: string
  description?: string | null
  department?: string | null
  responsibilities?: string | null
  requirements?: string | null
  benefits?: string | null
  status: string
  employment_type?: string
  experience_level?: string
  work_mode?: string | null
  location?: string
  application_deadline?: string | null
  is_accepting_applications?: boolean
  accepting_applications?: boolean
  applications_count?: number
  created_at?: string
  updated_at?: string
  published_at?: string | null
  closed_at?: string | null
  salary_min?: number | null
  salary_max?: number | null
  skills?: Array<{
    id: string | number
    name?: string
    requirement_type?: string
    weight?: number | null
    pivot?: {
      requirement_type?: string
      weight?: number | null
    }
  }>
  company?: {
    id?: string | number
    name?: string
    approval_status?: string
    status?: string
    employer?: { id?: string | number; name?: string; email?: string }
  }
}

export interface AdminJobFilterForm {
  work_mode: string
  employment_type: string
  accepting_applications: string
  sort_by: string
  sort_direction: string
}

export const ADMIN_JOB_FILTER_DEFAULTS: AdminJobFilterForm = {
  work_mode: "all",
  employment_type: "all",
  accepting_applications: "all",
  sort_by: "created_at",
  sort_direction: "desc",
}
