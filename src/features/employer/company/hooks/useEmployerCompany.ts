import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
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
    onError: (error) => {
      showErrorToast(t("toasts.updateError"))
      console.error("Company update error:", error)
    },
  })

  const updateLogoMutation = useMutation({
    mutationFn: employerCompanyService.updateLogo,
    onSuccess: async (company) => {
      client.setQueryData(employerCompanyKey, company)
      await client.invalidateQueries({ queryKey: ["employer", "dashboard"] })
      showSuccessToast(t("toasts.logoUpdated"))
    },
    onError: (error) => {
      showErrorToast(t("toasts.logoError"))
      console.error("Logo update error:", error)
    },
  })

  const updateCoverMutation = useMutation({
    mutationFn: employerCompanyService.updateCoverImage,
    onSuccess: async (company) => {
      client.setQueryData(employerCompanyKey, company)
      await client.invalidateQueries({ queryKey: ["employer", "dashboard"] })
      showSuccessToast(t("toasts.coverUpdated"))
    },
    onError: (error) => {
      showErrorToast(t("toasts.coverError"))
      console.error("Cover update error:", error)
    },
  })

  const removeCoverMutation = useMutation({
    mutationFn: employerCompanyService.removeCoverImage,
    onSuccess: async (company) => {
      client.setQueryData(employerCompanyKey, company)
      await client.invalidateQueries({ queryKey: ["employer", "dashboard"] })
      showSuccessToast(t("toasts.coverRemoved"))
    },
    onError: (error) => {
      showErrorToast(t("toasts.coverRemoveError"))
      console.error("Cover remove error:", error)
    },
  })

  return {
    ...query,
    updateMutation,
    updateLogoMutation,
    updateCoverMutation,
    removeCoverMutation,
  }
}
