export interface AdminReportFilters {
  date_from?: string
  date_to?: string
  company_id?: string | number
  job_id?: string | number
  status?: string
}

export interface AdminOverviewReport {
  users?: number | null
  companies?: number | null
  jobs?: number | null
  applications?: number | null
  tests?: number | null
  interviews?: number | null
  notifications?: number | null
  cvs?: number | null
  audit_logs?: number | null
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
