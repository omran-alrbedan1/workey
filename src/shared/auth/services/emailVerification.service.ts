import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"

export interface VerifyOtpInput {
  email: string
  otp: string
}

export interface ResendOtpInput {
  email: string
}

export const emailVerificationService = {
  async verifyOtp(input: VerifyOtpInput): Promise<void> {
    await api.post(API_ENDPOINTS.auth.emailVerifyOtp, input)
  },

  async resendOtp(input: ResendOtpInput): Promise<void> {
    await api.post(API_ENDPOINTS.auth.emailResendOtp, input)
  },
}
