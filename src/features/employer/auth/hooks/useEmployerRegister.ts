import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { showSuccessToast } from "@/lib/toast"
import { employerAuthService } from "../services/employerAuth.service"

export function useEmployerRegister() {
  const { t } = useTranslation("employerAuth")
  const navigate = useNavigate()

  return useMutation({
    mutationFn: employerAuthService.register,
    onSuccess: () => {
      showSuccessToast(t("toasts.accountCreated"), t("toasts.signInNext"))
      navigate(ROUTES.employer.login, { replace: true })
    },
  })
}
