import type { TFunction } from "i18next"
import { z } from "zod"

export const attendanceInterviewSchema = z.object({
  candidate_status: z.enum(["present", "absent", "excused"]),
  interviewer_status: z.enum(["present", "absent", "excused"]),
  note: z.string().trim().max(2000).optional(),
})

export type AttendanceInterviewFormValues = z.infer<typeof attendanceInterviewSchema>

export const cancelInterviewSchema = z.object({
  reason: z.string().trim().min(1).max(2000),
  candidate_message: z.string().trim().max(2000).optional(),
})

export type CancelInterviewFormValues = z.infer<typeof cancelInterviewSchema>

export const completeInterviewSchema = z.object({
  completion_note: z.string().trim().max(5000).optional(),
})

export type CompleteInterviewFormValues = z.infer<typeof completeInterviewSchema>

export const evaluateItemSchema = z.object({
  criterion: z.string().min(1).max(255),
  score: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
})

export const evaluateInterviewSchema = z.object({
  recommendation: z.enum(["advance", "hold", "reject"]),
  overall_comment: z.string().trim().max(5000).optional(),
  items: z.array(evaluateItemSchema).length(5),
})

export type EvaluateInterviewFormValues = z.infer<typeof evaluateInterviewSchema>

export const noShowInterviewSchema = z.object({
  party: z.enum(["candidate", "interviewer", "both"]),
  reason: z.string().trim().min(1).max(2000),
})

export type NoShowInterviewFormValues = z.infer<typeof noShowInterviewSchema>

export const scheduleInterviewSchema = z
  .object({
    interview_type: z.enum(["hr", "technical", "final"]),
    scheduled_at: z.string().min(1),
    duration_minutes: z.coerce.number().int().min(1).max(480),
    interview_mode: z.enum(["online", "on_site"]),
    meeting_link: z.string().trim().max(2048).optional(),
    location: z.string().trim().max(1000).optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .superRefine((values, ctx) => {
    const start = new Date(values.scheduled_at)
    if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduled_at"],
        message: "Choose a future time",
      })
    }
    if (values.interview_mode === "online") {
      const link = values.meeting_link?.trim()
      if (link && !z.string().url().safeParse(link).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["meeting_link"],
          message: "Enter a valid URL",
        })
      }
    }
    if (values.interview_mode === "on_site" && !values.location?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location is required",
      })
    }
  })

export type ScheduleInterviewFormValues = z.infer<typeof scheduleInterviewSchema>

export function parseLocalDateTime(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function createRescheduleInterviewSchema(t: TFunction) {
  return z
    .object({
      scheduled_start: z.string().min(1, t("reschedule.validation.startDateTimeRequired")),
      scheduled_end: z.string().min(1, t("reschedule.validation.endDateTimeRequired")),
      mode: z.enum(["online", "on_site"]),
      meeting_link: z
        .string()
        .trim()
        .max(2048, t("reschedule.validation.meetingLinkTooLong"))
        .optional(),
      location_text: z
        .string()
        .trim()
        .max(1000, t("reschedule.validation.locationTooLong"))
        .optional(),
      reason: z
        .string()
        .trim()
        .min(1, t("reschedule.validation.reasonRequired"))
        .max(2000, t("reschedule.validation.reasonTooLong")),
    })
    .superRefine((values, ctx) => {
      const start = parseLocalDateTime(values.scheduled_start)
      const end = parseLocalDateTime(values.scheduled_end)
      if (start && end && start.getTime() >= end.getTime()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scheduled_end"],
          message: t("reschedule.validation.endAfterStart"),
        })
      }
      if (values.mode === "online") {
        const link = values.meeting_link?.trim()
        if (link && !z.string().url().safeParse(link).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["meeting_link"],
            message: t("reschedule.validation.validUrl"),
          })
        }
      }
      if (values.mode === "on_site" && !values.location_text?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["location_text"],
          message: t("reschedule.validation.locationRequired"),
        })
      }
    })
}

export type RescheduleInterviewFormValues = z.infer<
  ReturnType<typeof createRescheduleInterviewSchema>
>
