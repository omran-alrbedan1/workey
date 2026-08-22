import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { useState } from "react"
import { adminTestsService } from "../services/adminTests.service"
import { showSuccessToast } from "@/lib/toast"
import { useTranslation } from "react-i18next"
import { APP_CONFIG } from "@/config"

const key = ["admin", "tests"] as const

export function useAdminTests() {
  const { t } = useTranslation("adminTests")
  const client = useQueryClient()
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: [...key, page],
    queryFn: () =>
      adminTestsService.list({
        page,
        per_page: APP_CONFIG.pagination.defaultPageSize,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60_000,
  })

  const refresh = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: key, refetchType: "active" }),
      client.invalidateQueries({
        queryKey: ["admin", "dashboard", "tests"],
        refetchType: "active",
      }),
    ])

  const createMutation = useMutation({
    mutationFn: adminTestsService.create,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("created"))
    },
  })

  const updateMutation = useMutation({
    mutationFn: adminTestsService.update,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("updated"))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminTestsService.remove,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("deleted"))
    },
  })

  return { ...query, page, setPage, createMutation, updateMutation, deleteMutation }
}
