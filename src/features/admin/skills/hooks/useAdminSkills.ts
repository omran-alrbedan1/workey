import { useState } from "react"
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { adminSkillsService } from "../services/adminSkills.service"
import { showSuccessToast } from "@/lib/toast"
import { useTranslation } from "react-i18next"

const adminSkillsPageSize = 15

export const adminSkillsKeys = {
  all: ["admin", "skills"] as const,
  list: (page: number) => ["admin", "skills", { page }] as const,
}

export function useAdminSkills() {
  const { t } = useTranslation("adminSkills")
  const [page, setPage] = useState(1)
  const client = useQueryClient()
  const query = useQuery({
    queryKey: adminSkillsKeys.list(page),
    queryFn: () => adminSkillsService.list({ page, per_page: adminSkillsPageSize }),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60_000,
  })
  const refresh = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: adminSkillsKeys.all, refetchType: "active" }),
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
  return { ...query, page, setPage, createMutation, updateMutation, deleteMutation }
}
