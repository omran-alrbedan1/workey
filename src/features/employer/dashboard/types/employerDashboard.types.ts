import type { EmployerJob } from "@/features/employer/jobs/types/employerJobs.types"

export interface EmployerDashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  totalTests: number
  unreadNotifications: number
}

export interface EmployerDashboardData {
  stats: EmployerDashboardStats
  recentJobs: EmployerJob[]
}
