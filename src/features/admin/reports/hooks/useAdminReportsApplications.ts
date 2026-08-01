import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { adminReportsService } from "../services/adminReports.service"
import type { AdminReportFilters } from "../types/adminReports.types"

const emptyFilters: AdminReportFilters = {}

export function useAdminReportsApplications() {
  const [filters, setFilters] = useState<AdminReportFilters>(emptyFilters)

  const query = useQuery({
    queryKey: ["admin", "reports", "applications", filters],
    queryFn: () => adminReportsService.applications(filters),
  })

  const applyFilters = (next: AdminReportFilters) => {
    setFilters(next)
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
  }

  return { ...query, filters, applyFilters, resetFilters }
}
