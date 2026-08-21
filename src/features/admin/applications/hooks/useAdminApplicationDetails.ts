import { useQuery } from "@tanstack/react-query"

import { adminApplicationsService } from "../services/adminApplications.service"

export function useAdminApplicationDetails(id?: string | number) {
  return useQuery({
    queryKey: ["admin", "applications", "details", String(id ?? "")],
    queryFn: () => adminApplicationsService.show(id!),
    enabled: Boolean(id),
    retry: false,
  })
}
