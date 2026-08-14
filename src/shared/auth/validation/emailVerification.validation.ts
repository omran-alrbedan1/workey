import { z } from "zod"

export const emailVerificationSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, "OTP must be at least 6 characters"),
})

export type EmailVerificationFormValues = z.infer<typeof emailVerificationSchema>

export const resendOtpSchema = z.object({
  email: z.string().email(),
})

export type ResendOtpFormValues = z.infer<typeof resendOtpSchema>
