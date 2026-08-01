import { z } from "zod"

export const employerJobSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    department: z.string().trim().optional(),
    responsibilities: z.string().trim().optional(),
    benefits: z.string().trim().optional(),
    requirements: z.string().trim().min(1, "Requirements are required."),
    employment_type: z.string().trim().min(1),
    experience_level: z.string().trim().min(1),
    work_mode: z.enum(["remote", "on_site", "hybrid"]),
    location: z.string().trim().optional(),
    application_deadline: z.string().optional(),
    salary_min: z.coerce.number().nonnegative().optional(),
    salary_max: z.coerce.number().nonnegative().optional(),
  })
  .refine((values) => values.work_mode !== "on_site" || !!values.location?.trim(), {
    path: ["location"],
    message: "Location is required for on-site jobs.",
  })
  .refine(
    (values) =>
      values.salary_min === undefined ||
      values.salary_max === undefined ||
      values.salary_max >= values.salary_min,
    { path: ["salary_max"], message: "Maximum salary must be at least the minimum salary." },
  )

export type EmployerJobFormValues = z.infer<typeof employerJobSchema>
