import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { adminReportsService } from "../services/adminReports.service"
import type { AdminReportFilters } from "../types/adminReports.types"

const emptyFilters: Pick<AdminReportFilters, "date_from" | "date_to"> = {}

export function useAdminReportsCvParsing() {
  const [filters, setFilters] = useState<Pick<AdminReportFilters, "date_from" | "date_to">>(emptyFilters)

  const query = useQuery({
    queryKey: ["admin", "reports", "cv-parsing", filters.date_from, filters.date_to],
    queryFn: () => adminReportsService.cvParsing(filters),
  })

  const applyFilters = (next: Pick<AdminReportFilters, "date_from" | "date_to">) => {
    setFilters(next)
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
  }

  return { ...query, filters, applyFilters, resetFilters }
}
