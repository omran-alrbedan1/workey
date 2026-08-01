import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { showSuccessToast } from "@/lib/toast"
import { employerProfileService } from "../services/employerProfile.service"

export const employerProfileKey = ["employer", "profile"] as const

export function useEmployerProfile() {
  const { t } = useTranslation("employerProfile")
  const client = useQueryClient()
  const query = useQuery({ queryKey: employerProfileKey, queryFn: employerProfileService.get })
  const updateMutation = useMutation({
    mutationFn: employerProfileService.update,
    onSuccess: (profile) => {
      client.setQueryData(employerProfileKey, profile)
      showSuccessToast(t("toasts.updated"))
    },
  })

  return { ...query, updateMutation }
}
