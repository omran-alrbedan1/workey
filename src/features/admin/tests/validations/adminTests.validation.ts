import { z } from "zod"
import type { TFunction } from "i18next"
import { createTestQuestionSchema } from "@/features/employer/tests/validations/employerTests.validation"

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

export function createAdminTestWizardSchema(t: TFunction) {
  return z
    .object({
      company_id: z.string().min(1, t("validation.companyRequired")),
      title: z
        .string()
        .trim()
        .min(3, t("validation.titleRequired"))
        .max(150, t("validation.titleMax")),
      description: z.string().trim().max(2000, t("validation.descriptionMax")).optional(),
      duration_minutes: z.coerce
        .number()
        .int()
        .min(1, t("validation.durationMin"))
        .max(1440, t("validation.durationMax")),
      passing_score: z.coerce.number().min(0, t("validation.passingScoreMin")).optional(),
      is_active: z.boolean(),
      questions: z.array(createTestQuestionSchema(t)).optional(),
    })
    .refine(
      (data) => {
        if (data.questions && data.questions.length > 0) {
          const totalPoints = data.questions.reduce((sum, q) => sum + q.points, 0)
          if (data.passing_score !== undefined) {
            return data.passing_score <= totalPoints
          }
        }
        return true
      },
      {
        message: t("validation.passingScoreExceedsTotal"),
        path: ["passing_score"],
      },
    )
    .refine(
      (data) =>
        !data.is_active || (data.questions?.reduce((sum, q) => sum + q.points, 0) ?? 0) > 0,
      {
        message: t("validation.activeRequiresScore"),
        path: ["is_active"],
      },
    )
}
export type AdminTestWizardFormValues = z.infer<ReturnType<typeof createAdminTestWizardSchema>>
