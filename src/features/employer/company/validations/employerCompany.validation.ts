import { z } from "zod"

export const employerCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  industry: z
    .string()
    .trim()
    .max(255, "Industry must be less than 255 characters")
    .nullable()
    .optional(),
  website: z
    .string()
    .trim()
    .url("Invalid URL format")
    .max(255, "Website must be less than 255 characters")
    .nullable()
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(255, "Location must be less than 255 characters")
    .nullable()
    .optional(),
  description: z.string().trim().nullable().optional(),
})

export type EmployerCompanyFormValues = z.infer<typeof employerCompanySchema>
