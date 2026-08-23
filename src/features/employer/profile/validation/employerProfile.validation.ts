import { z } from "zod"

export const employerProfileSchema = z.object({
  job_title: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  bio: z.string().trim().optional(),
})

export type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>
