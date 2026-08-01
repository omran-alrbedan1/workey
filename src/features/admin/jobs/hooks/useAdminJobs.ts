import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { APP_CONFIG } from "@/config"
import { adminJobsService } from "../services/adminJobs.service"
import {
  ADMIN_JOB_FILTER_DEFAULTS,
  type AdminJobFilterForm,
} from "../types/adminJobs.types"

const asApiValue = (value?: string) => {
  const normalized = value?.trim()
  return normalized && normalized !== "all" ? normalized : undefined
}

export function useAdminJobs(filters: AdminJobFilterForm = ADMIN_JOB_FILTER_DEFAULTS) {
  const [page, setPage] = useState(1)
  const normalizedFilters = useMemo(
    () => ({
      work_mode: filters.work_mode || "all",
      employment_type: filters.employment_type || "all",
      accepting_applications: filters.accepting_applications || "all",
      sort_by: filters.sort_by || "created_at",
      sort_direction: filters.sort_direction || "desc",
    }),
    [
      filters.accepting_applications,
      filters.employment_type,
      filters.sort_by,
      filters.sort_direction,
      filters.work_mode,
    ],
  )

  useEffect(() => {
    setPage(1)
  }, [normalizedFilters])

  const query = useQuery({
    queryKey: ["admin", "jobs", page, normalizedFilters],
    queryFn: () =>
      adminJobsService.list({
        page,
        per_page: APP_CONFIG.pagination.defaultPageSize,
        work_mode: asApiValue(normalizedFilters.work_mode),
        employment_type: asApiValue(normalizedFilters.employment_type),
        accepting_applications: asApiValue(normalizedFilters.accepting_applications),
        sort_by: normalizedFilters.sort_by,
        sort_direction: normalizedFilters.sort_direction,
      }),
    retry: false,
  })
  return { ...query, page, setPage }
}
