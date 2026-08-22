import { z } from "zod"

export const employerJobSchema = z
  .object({
    title: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1),
    department: z.string().trim().max(255).nullable().optional(),
    responsibilities: z.string().trim().max(20000).nullable().optional(),
    benefits: z.string().trim().max(20000).nullable().optional(),
    requirements: z.string().trim().min(1).max(20000),
    employment_type: z.enum(["full_time", "part_time", "contract", "internship"] as const),
    experience_level: z.enum(["entry_level", "junior", "mid_level", "senior"] as const),
    education_level: z.string().trim().nullable().optional(),
    work_mode: z.enum(["remote", "on_site", "hybrid"] as const),
    location: z.string().trim().max(255).nullable().optional(),
    application_deadline: z.string().nullable().optional(),
    salary_min: z.coerce.number().nonnegative().nullable().optional(),
    salary_max: z.coerce.number().nonnegative().nullable().optional(),
  })
  .refine(
    (values) => values.work_mode !== "remote" || !values.location || values.location.trim() === "",
    {
      path: ["location"],
      message: "validation.locationOptionalForRemote",
    },
  )
  .refine(
    (values) => values.work_mode === "remote" || (values.location && values.location.trim() !== ""),
    {
      path: ["location"],
      message: "validation.locationRequiredForNonRemote",
    },
  )
  .refine(
    (values) =>
      values.salary_min === null ||
      values.salary_min === undefined ||
      values.salary_max === null ||
      values.salary_max === undefined ||
      values.salary_max >= values.salary_min,
    { path: ["salary_max"], message: "validation.salaryMaxMustBeAtLeastMin" },
  )
  .refine(
    (values) => {
      if (!values.application_deadline) return true
      const deadline = new Date(values.application_deadline)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      deadline.setHours(0, 0, 0, 0)
      return deadline >= now
    },
    {
      path: ["application_deadline"],
      message: "validation.deadlineMustBeFuture",
    },
  )

export type EmployerJobFormValues = z.infer<typeof employerJobSchema>
