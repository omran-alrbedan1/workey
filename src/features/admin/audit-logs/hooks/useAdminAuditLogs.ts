import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { adminAuditLogsService } from "../services/adminAuditLogs.service"
import type { AdminAuditLogFilters } from "../types/adminAuditLogs.types"

const emptyFilters: AdminAuditLogFilters = {}

export function useAdminAuditLogs() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<AdminAuditLogFilters>(emptyFilters)
  const query = useQuery({
    queryKey: ["admin", "audit-logs", page, filters],
    queryFn: () => adminAuditLogsService.list(filters, page),
    retry: false,
  })

  const applyFilters = (next: AdminAuditLogFilters) => {
    setPage(1)
    setFilters(next)
  }

  const resetFilters = () => {
    setPage(1)
    setFilters(emptyFilters)
  }

  return { ...query, page, filters, setPage, applyFilters, resetFilters }
}
