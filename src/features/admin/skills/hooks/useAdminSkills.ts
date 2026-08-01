import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminSkillsService } from "../services/adminSkills.service"
import { showSuccessToast } from "@/lib/toast"
import { useTranslation } from "react-i18next"
const key = ["admin", "skills"] as const
export function useAdminSkills() {
  const { t } = useTranslation("adminSkills")
  const client = useQueryClient()
  const query = useQuery({ queryKey: key, queryFn: adminSkillsService.list })
  const refresh = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: key, refetchType: "active" }),
      client.invalidateQueries({
        queryKey: ["admin", "dashboard", "skills"],
        refetchType: "active",
      }),
    ])
  const createMutation = useMutation({
    mutationFn: adminSkillsService.create,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("created"))
    },
  })
  const updateMutation = useMutation({
    mutationFn: adminSkillsService.update,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("updated"))
    },
  })
  const deleteMutation = useMutation({
    mutationFn: adminSkillsService.remove,
    onSuccess: async () => {
      await refresh()
      showSuccessToast(t("deleted"))
    },
  })
  return { ...query, createMutation, updateMutation, deleteMutation }
}
