export interface AdminReportFilters {
  date_from?: string
  date_to?: string
  company_id?: string | number
  job_id?: string | number
  status?: string
}

export interface AdminOverviewReport {
  users?: number | Record<string, number>
  companies?: number | Record<string, number>
  jobs?: number | Record<string, number>
  applications?: number | Record<string, number>
  tests?: number | Record<string, number>
  interviews?: number | Record<string, number>
  notifications?: number | Record<string, number>
  cvs?: number | Record<string, number>
  audit_logs?: number | Record<string, number>
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
