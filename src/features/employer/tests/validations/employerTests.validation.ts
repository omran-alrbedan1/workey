import { z } from "zod"
import type { TFunction } from "i18next"
import type { TestQuestionType } from "../types/employerTests.types"

const validQuestionTypes: TestQuestionType[] = [
  "single_choice",
  "multiple_choice",
  "true_false",
  "short_text",
  "long_text",
  "file_upload",
]

const choiceQuestionTypes: TestQuestionType[] = ["single_choice", "multiple_choice", "true_false"]

export function createTestQuestionOptionSchema(t: TFunction) {
  return z.object({
    id: z.union([z.string(), z.number()]).optional(),
    option_text: z
      .string()
      .trim()
      .min(1, t("validation.optionTextRequired"))
      .max(500, t("validation.optionTextMax")),
    order_index: z.number().int().min(0).optional(),
    is_correct: z.boolean(),
  })
}

export function createTestQuestionSchema(t: TFunction) {
  return z
    .object({
      id: z.union([z.string(), z.number()]).optional(),
      question_text: z
        .string()
        .trim()
        .min(1, t("validation.questionTextRequired"))
        .max(2000, t("validation.questionTextMax")),
      question_type: z.enum(validQuestionTypes),
      points: z.coerce
        .number()
        .min(0, t("validation.pointsMin"))
        .max(1000, t("validation.pointsMax")),
      is_required: z.boolean().default(true),
      options: z.array(createTestQuestionOptionSchema(t)).optional(),
    })
    .refine(
      (data) => {
        if (choiceQuestionTypes.includes(data.question_type)) {
          return data.options && data.options.length >= 2
        }
        return true
      },
      {
        message: t("validation.minTwoOptions"),
        path: ["options"],
      },
    )
    .refine(
      (data) => {
        if (data.question_type === "single_choice") {
          const correctCount = data.options?.filter((opt) => opt.is_correct).length ?? 0
          return correctCount === 1
        }
        return true
      },
      {
        message: t("validation.singleChoiceOneCorrect"),
        path: ["options"],
      },
    )
    .refine(
      (data) => {
        if (data.question_type === "multiple_choice") {
          const correctCount = data.options?.filter((opt) => opt.is_correct).length ?? 0
          return correctCount >= 1
        }
        return true
      },
      {
        message: t("validation.multipleChoiceAtLeastOneCorrect"),
        path: ["options"],
      },
    )
    .refine(
      (data) => {
        if (data.question_type === "true_false") {
          const options = data.options ?? []
          return (
            options.length === 2 &&
            options.filter((opt) => opt.is_correct).length === 1 &&
            options.some((opt) => opt.option_text.toLowerCase() === "true") &&
            options.some((opt) => opt.option_text.toLowerCase() === "false")
          )
        }
        return true
      },
      {
        message: t("validation.trueFalseOptions"),
        path: ["options"],
      },
    )
    .refine(
      (data) => {
        if (!choiceQuestionTypes.includes(data.question_type)) return true
        const labels = (data.options ?? []).map((option) => option.option_text.trim().toLowerCase())
        return new Set(labels).size === labels.length
      },
      {
        message: t("validation.uniqueOptions"),
        path: ["options"],
      },
    )
    .refine(
      (data) => {
        if (!choiceQuestionTypes.includes(data.question_type)) return true
        const orders = (data.options ?? []).map((option, index) => option.order_index ?? index)
        return new Set(orders).size === orders.length
      },
      {
        message: t("validation.uniqueOptionOrder"),
        path: ["options"],
      },
    )
}

export function createEmployerTestSchema(t: TFunction) {
  return z
    .object({
      title: z
        .string()
        .trim()
        .min(3, t("validation.titleRequired"))
        .max(150, t("validation.titleMax")),
      description: z.string().trim().max(2000, t("validation.descriptionMax")).optional(),
      instructions: z.string().trim().max(5000, t("validation.instructionsMax")).optional(),
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
      (data) => !data.is_active || (data.questions?.reduce((sum, q) => sum + q.points, 0) ?? 0) > 0,
      {
        message: t("validation.activeRequiresScore"),
        path: ["is_active"],
      },
    )
}

export type EmployerTestFormValues = z.infer<ReturnType<typeof createEmployerTestSchema>>
export type TestQuestionFormValues = z.infer<ReturnType<typeof createTestQuestionSchema>>
export type TestQuestionOptionFormValues = z.infer<
  ReturnType<typeof createTestQuestionOptionSchema>
>

export const assignNoApplicantsValue = "__no_applicants__"

const assignOptionalDeadlineSchema = z.union([z.string(), z.date()]).optional().nullable()

export function createAssignTestSchema(t: TFunction) {
  return z.object({
    job_id: z.string().min(1, t("assign.validationJobRequired")),
    application_id: z
      .string()
      .min(1, t("assign.validationApplicantRequired"))
      .refine(
        (value) => value !== assignNoApplicantsValue,
        t("assign.validationApplicantRequired"),
      ),
    note: z.string().trim().max(1000).optional(),
    deadline_at: assignOptionalDeadlineSchema,
    max_attempts: z.number().int().min(1).max(5).optional(),
  })
}

export type AssignTestFormValues = z.infer<ReturnType<typeof createAssignTestSchema>>
