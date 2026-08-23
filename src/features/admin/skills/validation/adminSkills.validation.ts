import { z } from "zod"
export const adminSkillSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
})
export type AdminSkillFormValues = z.infer<typeof adminSkillSchema>
