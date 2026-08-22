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
    staleTime: 5 * 60_000,
  })

  const updateMutation = useMutation({
    mutationFn: employerCompanyService.update,
    onSuccess: async (company) => {
      client.setQueryData(employerCompanyKey, company)
      await client.invalidateQueries({ queryKey: ["employer", "dashboard"] })
      showSuccessToast(t("toasts.updated"))
    },
    onError: (error) => {
      showErrorToast(error, t("toasts.updateError"))
    },
  })

  const updateLogoMutation = useMutation({
    mutationFn: (file: File) => employerCompanyService.updateLogo(file),
    onSuccess: async (company) => {
      client.setQueryData(employerCompanyKey, company)
      await client.invalidateQueries({ queryKey: ["employer", "dashboard"] })
      showSuccessToast(t("toasts.logoUpdated"))
    },
    onError: (error) => {
      showErrorToast(error, t("toasts.logoError"))
    },
  })

  const updateCoverMutation = useMutation({
    mutationFn: (file: File) => employerCompanyService.updateCoverImage(file),
    onSuccess: async (company) => {
      client.setQueryData(employerCompanyKey, company)
      await client.invalidateQueries({ queryKey: ["employer", "dashboard"] })
      showSuccessToast(t("toasts.coverUpdated"))
    },
    onError: (error) => {
      showErrorToast(error, t("toasts.coverError"))
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
      showErrorToast(error, t("toasts.coverRemoveError"))
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
