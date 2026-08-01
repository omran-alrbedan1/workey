import { useQuery } from "@tanstack/react-query"
import { employerDashboardService } from "../services/employerDashboard.service"

export function useEmployerDashboard() {
  return useQuery({
    queryKey: ["employer", "dashboard", "overview"],
    queryFn: employerDashboardService.getOverview,
  })
}
