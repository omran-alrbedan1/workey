export interface AdminReportFilters {
  date_from?: string
  date_to?: string
  company_id?: string | number
  job_id?: string | number
  status?: string
}

export interface AdminOverviewReport {
  users?: unknown
  companies?: unknown
  jobs?: unknown
  applications?: unknown
  tests?: unknown
  interviews?: unknown
  notifications?: unknown
  cvs?: unknown
  audit_logs?: unknown
}

export interface AdminApplicationsReport {
  status_counts?: Record<string, number>
  daily_counts?: Array<{
    date: string
    count: number
  }>
}

export interface AdminJobsReport {
  status_counts?: Record<string, number>
  average_applications_per_job?: number
}

export interface AdminCvParsingReport {
  success_count?: number
  failed_count?: number
  profile_suggestion_count?: number
  daily_counts?: Array<{
    date: string
    parsed_count: number
    failed_count?: number
  }>
}
