import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarSync } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { CancelButton, SubmitButton } from "@/components/shared/buttons"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import type { EmployerInterviewRescheduleInput } from "../types/employerInterviews.types"

const schema = z.object({
  scheduled_at: z.string().min(1),
  reason: z.string().trim().min(1),
})

type FormValues = z.infer<typeof schema>

export default function RescheduleInterviewDialog({
  interviewId,
  currentScheduledAt,
  currentScheduledEndAt,
  currentMode = "online",
  currentMeetingLink,
  currentLocationText,
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  interviewId?: string | number
  currentScheduledAt?: string
  currentScheduledEndAt?: string
  currentMode?: "online" | "on_site" | string
  currentMeetingLink?: string | null
  currentLocationText?: string | null
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (interviewId: string | number, input: EmployerInterviewRescheduleInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { scheduled_at: "", reason: "" },
  })

  useEffect(() => {
    if (open && currentScheduledAt) {
      const local = new Date(currentScheduledAt)
      local.setMinutes(local.getMinutes() - local.getTimezoneOffset())
      form.reset({ scheduled_at: local.toISOString().slice(0, 16), reason: "" })
    }
    if (!open) form.reset()
  }, [form, open, currentScheduledAt])

  const submit = async (values: FormValues) => {
    if (!interviewId) return
    const start = new Date(values.scheduled_at)
    const previousStart = currentScheduledAt ? new Date(currentScheduledAt) : null
    const previousEnd = currentScheduledEndAt ? new Date(currentScheduledEndAt) : null
    const durationMs =
      previousStart && previousEnd
        ? Math.max(previousEnd.getTime() - previousStart.getTime(), 60 * 60_000)
        : 60 * 60_000
    const end = new Date(start.getTime() + durationMs)
    await onSubmit(interviewId, {
      scheduled_start_at: start.toISOString(),
      scheduled_end_at: end.toISOString(),
      mode: currentMode === "on_site" ? "on_site" : "online",
      meeting_link: currentMeetingLink || undefined,
      location_text: currentLocationText || undefined,
      reason: values.reason,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("reschedule.title")}</DialogTitle>
              <DialogDescription>{t("reschedule.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="scheduled_at"
                label={t("reschedule.newDateTime")}
                placeholder="2026-05-15T14:00"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label={t("reschedule.reason")}
                placeholder={t("reschedule.reasonPlaceholder")}
                rows={3}
              />
            </div>
            <DialogFooter>
              <CancelButton disabled={isPending} onClick={() => onOpenChange(false)} text={t("reschedule.cancel")} />
              <SubmitButton isLoading={isPending} text={t("reschedule.submit")} loadingText={t("reschedule.submitting")} icon={<CalendarSync />} className="w-auto" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
