import { z } from "zod"
import type { TFunction } from "i18next"

export function createForgotPasswordSchema(t: TFunction) {
  return z.object({
    email: z.string().trim().email(t("validation.emailInvalid")),
  })
}

function newPasswordFields(t: TFunction) {
  return {
    password: z.string().min(8, t("validation.passwordMin")),
    password_confirmation: z.string().min(8, t("validation.confirmPasswordRequired")),
  }
}

export function createResetPasswordSchema(t: TFunction) {
  return z
    .object({
      email: z.string().trim().email(t("validation.emailInvalid")),
      token: z.string().trim().min(1, t("validation.tokenRequired")),
      ...newPasswordFields(t),
    })
    .refine((values) => values.password === values.password_confirmation, {
      path: ["password_confirmation"],
      message: t("validation.passwordMismatch"),
    })
}

export function createChangePasswordSchema(t: TFunction) {
  return z
    .object({
      current_password: z.string().min(1, t("validation.currentPasswordRequired")),
      ...newPasswordFields(t),
    })
    .refine((values) => values.password === values.password_confirmation, {
      path: ["password_confirmation"],
      message: t("validation.passwordMismatch"),
    })
}

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>
export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>
export type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordSchema>>
