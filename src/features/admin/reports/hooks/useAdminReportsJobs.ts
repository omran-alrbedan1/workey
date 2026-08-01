import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { adminReportsService } from "../services/adminReports.service"
import type { AdminReportFilters } from "../types/adminReports.types"

const emptyFilters: AdminReportFilters = {}

export function useAdminReportsJobs() {
  const [filters, setFilters] = useState<AdminReportFilters>(emptyFilters)

  const query = useQuery({
    queryKey: ["admin", "reports", "jobs", filters],
    queryFn: () => adminReportsService.jobs(filters),
  })

  const applyFilters = (next: AdminReportFilters) => {
    setFilters(next)
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
  }

  return { ...query, filters, applyFilters, resetFilters }
}
