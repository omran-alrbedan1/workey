import { z } from "zod"
import type { TFunction } from "i18next"

export function createAdminTestSchema(t: TFunction, requireCompany = false) {
  return z.object({
    company_id: requireCompany
      ? z.string().min(1, t("validation.companyRequired"))
      : z.string().optional(),
    title: z
      .string()
      .trim()
      .min(3, t("validation.titleRequired"))
      .max(150, t("validation.titleMax")),
    description: z.string().max(2000, t("validation.descriptionMax")).optional(),
    duration_minutes: z.coerce.number().int().min(1, t("validation.durationMin")),
    passing_score: z.coerce.number().min(0, t("validation.passingScoreMin")),
  })
}
export type AdminTestFormValues = z.infer<ReturnType<typeof createAdminTestSchema>>
