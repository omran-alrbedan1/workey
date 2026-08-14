import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ROUTES } from "@/config"
import { emailVerificationService } from "../services/emailVerification.service"
import type { VerifyOtpInput, ResendOtpInput } from "../services/emailVerification.service"

export function useEmailVerification() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: VerifyOtpInput) => {
      await emailVerificationService.verifyOtp(input)
    },
    onSuccess: () => {
      toast.success("Email verified successfully")
      navigate(ROUTES.auth.login)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Verification failed")
    },
  })
}

export function useResendOtp() {
  return useMutation({
    mutationFn: async (input: ResendOtpInput) => {
      await emailVerificationService.resendOtp(input)
    },
    onSuccess: () => {
      toast.success("OTP resent successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to resend OTP")
    },
  })
}
