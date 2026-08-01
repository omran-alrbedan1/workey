import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { showSuccessToast } from "@/lib/toast"
import { employerCompanyService } from "../services/employerCompany.service"

export const employerCompanyKey = ["employer", "company"] as const

export function useEmployerCompany() {
  const { t } = useTranslation("employerCompany")
  const client = useQueryClient()
  const query = useQuery({
    queryKey: employerCompanyKey,
    queryFn: employerCompanyService.get,
  })
  const updateMutation = useMutation({
    mutationFn: employerCompanyService.update,
    onSuccess: async (company) => {
      client.setQueryData(employerCompanyKey, company)
      await client.invalidateQueries({ queryKey: ["employer", "dashboard"] })
      showSuccessToast(t("toasts.updated"))
    },
  })

  return { ...query, updateMutation }
}
