import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
})

const newPasswordFields = {
  password: z.string().min(8, "Password must contain at least 8 characters"),
  password_confirmation: z.string().min(8, "Please confirm your new password"),
}

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address"),
    token: z.string().trim().min(1, "The reset token is required"),
    ...newPasswordFields,
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  })

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password"),
    ...newPasswordFields,
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  })

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
