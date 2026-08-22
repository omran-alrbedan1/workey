import { useQuery } from "@tanstack/react-query"

import { adminJobsService } from "../services/adminJobs.service"
import { adminApplicationsService } from "@/features/admin/applications/services/adminApplications.service"
import { APP_CONFIG } from "@/config"

export function useAdminJobDetails(id?: string | number) {
  return useQuery({
    queryKey: ["admin", "jobs", "details", String(id ?? "")],
    queryFn: () => adminJobsService.get(id!),
    enabled: Boolean(id),
    retry: false,
  })
}

export function useAdminJobApplications(jobId?: string | number, page = 1) {
  return useQuery({
    queryKey: ["admin", "jobs", "details", String(jobId ?? ""), "applications", page],
    queryFn: () =>
      adminApplicationsService.list({
        page,
        per_page: APP_CONFIG.pagination.defaultPageSize,
        job: String(jobId),
      }),
    enabled: Boolean(jobId),
    retry: false,
  })
}
