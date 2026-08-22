import { z } from "zod"
import type { TFunction } from "i18next"

export function createEmailVerificationSchema(t: TFunction) {
  return z.object({
    email: z.string().email(t("emailVerification.emailInvalid")),
    otp: z.string().min(6, t("emailVerification.otpMin")),
  })
}

export type EmailVerificationFormValues = z.infer<ReturnType<typeof createEmailVerificationSchema>>

export function createResendOtpSchema(t: TFunction) {
  return z.object({
    email: z.string().email(t("emailVerification.emailInvalid")),
  })
}

export type ResendOtpFormValues = z.infer<ReturnType<typeof createResendOtpSchema>>
