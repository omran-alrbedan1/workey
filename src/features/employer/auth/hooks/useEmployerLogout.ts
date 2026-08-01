import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { showSuccessToast } from "@/lib/toast"
import { employerAuthService } from "../services/employerAuth.service"

export function useEmployerLogout() {
  const { t } = useTranslation("employerAuth")
  const navigate = useNavigate()
  const client = useQueryClient()

  return useMutation({
    mutationFn: employerAuthService.logout,
    onSettled: () => {
      employerAuthService.clearSession()
      client.clear()
      showSuccessToast(t("toasts.signedOut"))
      navigate(ROUTES.employer.login, { replace: true })
    },
  })
}
