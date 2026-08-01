import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/config"
import { showSuccessToast } from "@/lib/toast"
import { employerAuthService } from "../services/employerAuth.service"

export function useEmployerLogin() {
  const { t } = useTranslation("employerAuth")
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const session = await employerAuthService.login(credentials)
      if (session.user.role.key !== "employer") throw new Error(t("errors.role"))
      return session
    },
    onSuccess: (session) => {
      employerAuthService.storeSession(session)
      showSuccessToast(t("toasts.welcome"), t("toasts.signedIn"))
      navigate(ROUTES.employer.root, { replace: true })
    },
  })
}
