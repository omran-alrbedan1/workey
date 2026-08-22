import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ROUTES } from "@/config"
import { showErrorToast, showSuccessToast } from "@/lib/toast"
import { emailVerificationService } from "../services/emailVerification.service"
import type { VerifyOtpInput, ResendOtpInput } from "../services/emailVerification.service"

export function useEmailVerification() {
  const navigate = useNavigate()
  const { t } = useTranslation("common")

  return useMutation({
    mutationFn: async (input: VerifyOtpInput) => {
      await emailVerificationService.verifyOtp(input)
    },
    onSuccess: () => {
      showSuccessToast(t("emailVerification.verified"))
      navigate(ROUTES.auth.login)
    },
    onError: (error: Error) => {
      showErrorToast(error, t("emailVerification.verifyError"))
    },
  })
}

export function useResendOtp() {
  const { t } = useTranslation("common")

  return useMutation({
    mutationFn: async (input: ResendOtpInput) => {
      await emailVerificationService.resendOtp(input)
    },
    onSuccess: () => {
      showSuccessToast(t("emailVerification.resent"))
    },
    onError: (error: Error) => {
      showErrorToast(error, t("emailVerification.resendError"))
    },
  })
}
