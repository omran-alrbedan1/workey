import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useState } from "react"
import { APP_CONFIG } from "@/config"
import { adminApplicationsService } from "../services/adminApplications.service"
export function useAdminApplications() {
  const [page, setPage] = useState(1)
  const query = useQuery({
    queryKey: ["admin", "applications", page],
    queryFn: () =>
      adminApplicationsService.list({
        page,
        per_page: APP_CONFIG.pagination.defaultPageSize,
      }),
    retry: false,
    placeholderData: keepPreviousData,
  })
  return { ...query, page, setPage }
}
