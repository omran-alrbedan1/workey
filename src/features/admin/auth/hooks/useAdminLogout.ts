import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { ROUTES } from "@/config"
import { adminAuthService } from "../services/adminAuth.service"
import { showSuccessToast } from "@/lib/toast"
import { useTranslation } from "react-i18next"

export function useAdminLogout() {
  const { t } = useTranslation("adminAuth")
  const navigate = useNavigate()
  const client = useQueryClient()
  return useMutation({
    mutationFn: adminAuthService.logout,
    onSettled: () => {
      adminAuthService.clearSession()
      client.clear()
      showSuccessToast(t("logoutSuccess"))
      navigate(ROUTES.auth.login, { replace: true })
    },
  })
}
