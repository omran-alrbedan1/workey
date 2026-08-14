import { z } from "zod"

export const informationRequestItemSchema = z.object({
  label: z.string().trim().min(1),
  description: z.string().trim().optional(),
  is_required: z.boolean(),
})

export const informationRequestSchema = z.object({
  message: z.string().trim().min(1),
  due_at: z.string().optional(),
  requested_items: z.array(informationRequestItemSchema).min(1),
})

export type InformationRequestFormValues = z.infer<typeof informationRequestSchema>

export const internalNoteSchema = z.object({
  body: z.string().trim().min(1),
})

export type InternalNoteFormValues = z.infer<typeof internalNoteSchema>

export const scheduleInterviewSchema = z
  .object({
    type: z.enum(["hr", "technical", "final"]),
    scheduled_at: z.string().min(1),
    duration_minutes: z.coerce.number().int().min(1).max(480),
    mode: z.enum(["online", "on_site"]),
    meeting_link: z.string().trim().max(2048).optional(),
    location: z.string().trim().max(1000).optional(),
    notes: z.string().trim().max(2000).optional(),
    internal_note: z.string().trim().max(5000).optional(),
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

    if (values.mode === "online") {
      const link = values.meeting_link?.trim()
      if (!link) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["meeting_link"],
          message: "Meeting link is required for online interviews",
        })
      } else if (!z.string().url().safeParse(link).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["meeting_link"],
          message: "Enter a valid URL",
        })
      }
    }

    if (values.mode === "on_site" && !values.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location is required for on-site interviews",
      })
    }
  })

export type ScheduleInterviewFormValues = z.infer<typeof scheduleInterviewSchema>
