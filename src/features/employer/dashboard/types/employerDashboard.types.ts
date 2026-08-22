import type { EmployerJob } from "@/features/employer/jobs/types/employerJobs.types"
import type { EmployerApplicantDetail } from "@/features/employer/applicants/types/employerApplicants.types"

export interface EmployerDashboardStats {
  openJobs: number
  activeApplicants: number
  upcomingInterviews: number
  pendingTests: number
}

export interface EmployerFunnelItem {
  key: string
  label: string
  value: number
}

export interface EmployerRecentApplication {
  application: EmployerApplicantDetail
  job: EmployerJob
}

export interface EmployerDashboardData {
  stats: EmployerDashboardStats
  recentJobs: EmployerJob[]
  recentApplications: EmployerRecentApplication[]
  funnel: EmployerFunnelItem[]
}
