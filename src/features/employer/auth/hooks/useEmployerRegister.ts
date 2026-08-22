import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { showSuccessToast } from "@/lib/toast"
import { employerAuthService } from "../services/employerAuth.service"
import type { EmployerRegisterInput } from "../types/employerAuth.types"

export function useEmployerRegister() {
  const { t } = useTranslation("employerAuth")
  const navigate = useNavigate()

  return useMutation({
    mutationFn: employerAuthService.register,
    onSuccess: (_data, variables: EmployerRegisterInput) => {
      showSuccessToast(t("toasts.accountCreated"), t("toasts.verifyEmailNext"))
      navigate(`${ROUTES.auth.emailVerification}?email=${encodeURIComponent(variables.email)}`, {
        replace: true,
      })
    },
  })
}
