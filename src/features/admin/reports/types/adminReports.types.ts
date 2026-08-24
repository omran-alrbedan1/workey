export interface AdminReportFilters {
  date_from?: string
  date_to?: string
  company_id?: string | number
  job_id?: string | number
  status?: string
}

export interface LocalizedCount {
  key: string
  value: string
  count: number
}

export interface AdminOverviewReport {
  users: { total: number; by_role: LocalizedCount[]; by_status: LocalizedCount[] }
  companies: { total: number; by_approval_status: LocalizedCount[] }
  jobs: { total: number; by_status: LocalizedCount[] }
  applications: { total: number; by_status: LocalizedCount[] }
  tests: { total: number; assignments: number; attempts: number }
  interviews: { total: number; by_status: LocalizedCount[] }
  notifications: { total: number; unread: number }
  cv_files: { total: number; by_status: LocalizedCount[] }
  cv_parsing_results: { success: number; failed: number }
  audit_logs: { count: number }
}

export interface AdminApplicationsReport {
  total: number
  by_status: LocalizedCount[]
  accepted: number
  rejected: number
  active: number
  final: number
  per_day: Record<string, number>
}

export interface AdminJobsReport {
  total: number
  by_status: LocalizedCount[]
  published: number
  closed: number
  draft: number
  average_applications_per_job: number
}

export interface AdminCvParsingReport {
  total_uploaded_cvs: number
  parsed_count: number
  failed_count: number
  suggestions_generated_count: number
  suggestions_by_status: LocalizedCount[]
  suggestions_accepted: number
  suggestions_rejected: number
  suggestions_applied: number
}
