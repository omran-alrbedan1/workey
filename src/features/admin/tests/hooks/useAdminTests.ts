import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminTestsService } from "../services/adminTests.service"
import { showSuccessToast } from "@/lib/toast"
import { useTranslation } from "react-i18next"
const key = ["admin", "tests"] as const
export function useAdminTests() {
  const { t } = useTranslation("adminTests")
  const client = useQueryClient()
  const query = useQuery({ queryKey: key, queryFn: adminTestsService.list, staleTime: 10 * 60_000 })
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
  return { ...query, createMutation, updateMutation, deleteMutation }
}
