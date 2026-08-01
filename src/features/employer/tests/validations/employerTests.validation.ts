import { z } from "zod"
import type { TFunction } from "i18next"

export function createEmployerTestSchema(t: TFunction) {
  return z
    .object({
      title: z.string().trim().min(3, t("validation.titleRequired")).max(150, t("validation.titleMax")),
      description: z.string().trim().max(2000, t("validation.descriptionMax")).optional(),
      instructions: z.string().trim().max(5000, t("validation.instructionsMax")).optional(),
      duration_minutes: z.number().int().min(1, t("validation.durationMin")),
      max_score: z.number().min(0, t("validation.maxScoreMin")).optional(),
      passing_score: z.number().min(0, t("validation.passingScoreMin")),
      is_active: z.boolean(),
      questions: z.array(z.any()).optional(),
    })
}

export type EmployerTestFormValues = z.infer<ReturnType<typeof createEmployerTestSchema>>
