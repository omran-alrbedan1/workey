import { useQuery } from "@tanstack/react-query"

import { adminJobsService } from "../services/adminJobs.service"

export function useAdminJobDetails(id?: string | number) {
  return useQuery({
    queryKey: ["admin", "jobs", "details", String(id ?? "")],
    queryFn: () => adminJobsService.get(id!),
    enabled: Boolean(id),
    retry: false,
  })
}
