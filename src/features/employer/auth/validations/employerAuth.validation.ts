import { z } from "zod"

export const employerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type EmployerLoginFormValues = z.infer<typeof employerLoginSchema>

export const employerRegisterSchema = z
  .object({
    name: z.string().trim().min(2),
    company_name: z.string().trim().min(2),
    company_website: z.string().trim().url("Enter a valid company website"),
    phone: z.string().trim().min(7, "Enter a valid phone number"),
    terms_accepted: z
      .boolean()
      .refine((accepted) => accepted, "You must accept the terms and conditions"),
    email: z.string().email(),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  })

export type EmployerRegisterFormValues = z.infer<typeof employerRegisterSchema>
