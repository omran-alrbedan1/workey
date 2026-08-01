import { z } from "zod"

export const employerCompanySchema = z.object({
  name: z.string().trim().min(1),
  industry: z.string().trim().optional(),
  website: z.union([z.literal(""), z.string().url()]).optional(),
  location: z.string().trim().optional(),
  description: z.string().trim().optional(),
})

export type EmployerCompanyFormValues = z.infer<typeof employerCompanySchema>
