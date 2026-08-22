import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { ROUTES } from "@/config"
import { adminAuthService } from "../services/adminAuth.service"
import { showSuccessToast } from "@/lib/toast"
import { useTranslation } from "react-i18next"
import type { AdminLoginCredentials } from "../types/adminAuth.types"

export function useAdminLogin() {
  const { t } = useTranslation("adminAuth")
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: AdminLoginCredentials) => {
      const session = await adminAuthService.login(credentials)
      if (session.user.role.key !== "admin") throw new Error(t("noAccess"))
      return session
    },
    onSuccess: (session) => {
      adminAuthService.storeSession(session)
      showSuccessToast(t("welcome"), t("loginSuccess"))
      navigate(ROUTES.admin.root, { replace: true })
    },
  })
}
