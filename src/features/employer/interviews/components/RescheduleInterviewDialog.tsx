import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarSync, Link2, MapPin } from "lucide-react"
import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
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
import type { Option } from "@/types/customFormField.types"
import type { EmployerInterviewRescheduleInput, InterviewMode } from "../types/employerInterviews.types"

const modeOptions: Option[] = [
  { value: "online", label: "interviewModes.online" },
  { value: "on_site", label: "interviewModes.onSite" },
]

function toLocalDateTime(value?: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

const schema = z
  .object({
    scheduled_start_at: z.string().min(1),
    scheduled_end_at: z.string().min(1),
    mode: z.enum(["online", "on_site"]),
    meeting_link: z.string().trim().max(2048).optional(),
    location_text: z.string().trim().max(1000).optional(),
    reason: z.string().trim().min(1).max(2000),
  })
  .superRefine((values, ctx) => {
    const start = new Date(values.scheduled_start_at)
    const end = new Date(values.scheduled_end_at)
    const durationMinutes = (end.getTime() - start.getTime()) / 60_000
    if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduled_start_at"], message: "Choose a future start time" })
    }
    if (Number.isNaN(end.getTime()) || end <= start || durationMinutes > 480) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduled_end_at"], message: "End must be after start and within 480 minutes" })
    }
    if (values.mode === "online") {
      const link = values.meeting_link?.trim()
      if (!link) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["meeting_link"], message: "Meeting link is required" })
      } else if (!z.string().url().safeParse(link).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["meeting_link"], message: "Enter a valid URL" })
      }
    }
    if (values.mode === "on_site" && !values.location_text?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["location_text"], message: "Location is required" })
    }
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
  currentMode?: string
  currentMeetingLink?: string | null
  currentLocationText?: string | null
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (interviewId: string | number, input: EmployerInterviewRescheduleInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      scheduled_start_at: "",
      scheduled_end_at: "",
      mode: "online",
      meeting_link: "",
      location_text: "",
      reason: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        scheduled_start_at: toLocalDateTime(currentScheduledAt),
        scheduled_end_at: toLocalDateTime(currentScheduledEndAt),
        mode: currentMode === "on_site" ? "on_site" : "online",
        meeting_link: currentMeetingLink || "",
        location_text: currentLocationText || "",
        reason: "",
      })
    }
  }, [currentLocationText, currentMeetingLink, currentMode, currentScheduledAt, currentScheduledEndAt, form, open])

  const mode = form.watch("mode")

  const submit = async (values: FormValues) => {
    if (!interviewId) return
    await onSubmit(interviewId, {
      scheduled_start_at: new Date(values.scheduled_start_at).toISOString(),
      scheduled_end_at: new Date(values.scheduled_end_at).toISOString(),
      mode: values.mode as InterviewMode,
      meeting_link: values.mode === "online" ? values.meeting_link || undefined : undefined,
      location_text: values.mode === "on_site" ? values.location_text || undefined : undefined,
      reason: values.reason,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("reschedule.title")}</DialogTitle>
              <DialogDescription>{t("reschedule.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="scheduled_start_at" label={t("reschedule.start")} required />
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="scheduled_end_at" label={t("reschedule.end")} required />
              </div>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="mode"
                label={t("reschedule.mode")}
                options={modeOptions.map((option) => ({ ...option, label: t(option.label) }))}
                required
              />
              {mode === "online" ? (
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="meeting_link" label={t("reschedule.meetingLink")} placeholder="https://meet.example.com/interview" leftIcon={Link2} required />
              ) : (
                <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="location_text" label={t("reschedule.location")} placeholder={t("schedule.locationPlaceholder")} leftIcon={MapPin} required />
              )}
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label={t("reschedule.reason")}
                placeholder={t("reschedule.reasonPlaceholder")}
                rows={3}
                required
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
