import type { TFunction } from "i18next"
import { z } from "zod"

export function createRejectSchema(t: TFunction, reasonRequired: boolean) {
  return z.object({
    reason: reasonRequired
      ? z
          .string()
          .trim()
          .min(1, t("modals.reject.reasonRequired"))
          .max(255, t("modals.reasonTooLong"))
      : z.string().max(255, t("modals.reasonTooLong")).optional(),
  })
}

export type RejectFormValues = z.infer<ReturnType<typeof createRejectSchema>>

export function createSendMessageSchema(t: TFunction) {
  return z.object({
    message: z
      .string()
      .min(1, t("modals.sendMessage.messageRequired"))
      .max(500, t("modals.sendMessage.messageTooLong")),
  })
}

export type SendMessageFormValues = z.infer<ReturnType<typeof createSendMessageSchema>>

export function createSuspendSchema(t: TFunction) {
  return z.object({
    reason: z.string().max(255, t("modals.reasonTooLong")).optional(),
  })
}

export type SuspendFormValues = z.infer<ReturnType<typeof createSuspendSchema>>
