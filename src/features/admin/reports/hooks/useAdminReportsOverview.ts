import { useQuery } from "@tanstack/react-query"
import { adminReportsService } from "../services/adminReports.service"

export function useAdminReportsOverview() {
  return useQuery({
    queryKey: ["admin", "reports", "overview"],
    queryFn: adminReportsService.overview,
  })
}
