import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { employerJobsService } from "../services/employerJobs.service"
import {
  EMPLOYER_JOB_FILTER_DEFAULTS,
  type EmployerJobFilterForm,
} from "../types/employerJobs.types"

const rootKey = ["employer", "jobs"] as const

const asApiValue = (value?: string) => {
  const normalized = value?.trim()
  return normalized && normalized !== "all" ? normalized : undefined
}

export function useEmployerJobs(filters: EmployerJobFilterForm = EMPLOYER_JOB_FILTER_DEFAULTS) {
  const { t } = useTranslation("employerJobs")
  const [page, setPage] = useState(1)
  const client = useQueryClient()

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
    queryKey: [...rootKey, "list", page, normalizedFilters],
    queryFn: () => {
      const acceptingRaw = asApiValue(normalizedFilters.accepting_applications)
      const accepting =
        acceptingRaw === "true" ? true : acceptingRaw === "false" ? false : undefined
      return employerJobsService.list(page, {
        work_mode: asApiValue(normalizedFilters.work_mode),
        employment_type: asApiValue(normalizedFilters.employment_type),
        accepting_applications: accepting,
        sort_by: normalizedFilters.sort_by,
        sort_direction: normalizedFilters.sort_direction as "asc" | "desc" | undefined,
      })
    },
    retry: 1,
    placeholderData: keepPreviousData,
  })

  const refresh = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: rootKey, refetchType: "all" }),
      client.invalidateQueries({ queryKey: ["employer", "dashboard"] }),
    ])

  const showJobError = (error: unknown) => {
    showErrorToast(error, t("errors.description"))
  }

  const publishMutation = useMutation({
    mutationFn: employerJobsService.publish,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("toasts.published"))
    },
    onError: showJobError,
  })
  const closeMutation = useMutation({
    mutationFn: employerJobsService.close,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("toasts.closed"))
    },
    onError: showJobError,
  })
  const deleteMutation = useMutation({
    mutationFn: employerJobsService.remove,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("toasts.deleted"))
    },
    onError: showJobError,
  })

  return { ...query, page, setPage, publishMutation, closeMutation, deleteMutation }
}
