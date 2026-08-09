import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarClock, CalendarSync, Clock, Link2, MapPin } from "lucide-react"
import { useEffect, useMemo } from "react"
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

function toDatePart(value?: string | null) {
  return toLocalDateTime(value).slice(0, 10)
}

function toTimePart(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function combineLocalDateTime(dateValue?: string | null, timeValue?: Date | string | null) {
  if (!dateValue || !timeValue) return null
  const time = timeValue instanceof Date ? timeValue : new Date(timeValue)
  if (Number.isNaN(time.getTime())) return null

  const [year, month, day] = dateValue.split("-").map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day, time.getHours(), time.getMinutes(), 0, 0)
}

type FormValues = {
  scheduled_start_date: string
  scheduled_start_time: Date | null
  scheduled_end_date: string
  scheduled_end_time: Date | null
  mode: InterviewMode
  meeting_link?: string
  location_text?: string
  reason: string
}

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
  const schema = useMemo(
    () =>
      z
        .object({
          scheduled_start_date: z.string().min(1, t("reschedule.validation.startDateRequired")),
          scheduled_start_time: z.date({ message: t("reschedule.validation.startTimeRequired") }).nullable(),
          scheduled_end_date: z.string().min(1, t("reschedule.validation.endDateRequired")),
          scheduled_end_time: z.date({ message: t("reschedule.validation.endTimeRequired") }).nullable(),
          mode: z.enum(["online", "on_site"]),
          meeting_link: z.string().trim().max(2048, t("reschedule.validation.meetingLinkTooLong")).optional(),
          location_text: z.string().trim().max(1000, t("reschedule.validation.locationTooLong")).optional(),
          reason: z.string().trim().min(1, t("reschedule.validation.reasonRequired")).max(2000, t("reschedule.validation.reasonTooLong")),
        })
        .superRefine((values, ctx) => {
          const start = combineLocalDateTime(values.scheduled_start_date, values.scheduled_start_time)
          const end = combineLocalDateTime(values.scheduled_end_date, values.scheduled_end_time)
          if (!values.scheduled_start_time) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["scheduled_start_time"],
              message: t("reschedule.validation.startTimeRequired"),
            })
          }
          if (!values.scheduled_end_time) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["scheduled_end_time"],
              message: t("reschedule.validation.endTimeRequired"),
            })
          }
          if (!start || !end) return
          const durationMinutes = (end.getTime() - start.getTime()) / 60_000
          if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["scheduled_start_date"],
              message: t("reschedule.validation.futureStart"),
            })
          }
          if (Number.isNaN(end.getTime()) || end <= start || durationMinutes > 480) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["scheduled_end_date"],
              message: t("reschedule.validation.endAfterStart"),
            })
          }
          if (values.mode === "online") {
            const link = values.meeting_link?.trim()
            if (!link) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["meeting_link"],
                message: t("reschedule.validation.meetingLinkRequired"),
              })
            } else if (!z.string().url().safeParse(link).success) {
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
        }),
    [t],
  )
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      scheduled_start_date: "",
      scheduled_start_time: null,
      scheduled_end_date: "",
      scheduled_end_time: null,
      mode: "online",
      meeting_link: "",
      location_text: "",
      reason: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        scheduled_start_date: toDatePart(currentScheduledAt),
        scheduled_start_time: toTimePart(currentScheduledAt),
        scheduled_end_date: toDatePart(currentScheduledEndAt),
        scheduled_end_time: toTimePart(currentScheduledEndAt),
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
    const start = combineLocalDateTime(values.scheduled_start_date, values.scheduled_start_time)
    const end = combineLocalDateTime(values.scheduled_end_date, values.scheduled_end_time)
    if (!start || !end) return

    await onSubmit(interviewId, {
      scheduled_start_at: start.toISOString(),
      scheduled_end_at: end.toISOString(),
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
            <DialogHeader className="items-start gap-3 text-start">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <CalendarSync className="h-5 w-5 text-primary" />
                    {t("reschedule.title")}
                  </DialogTitle>
                  <DialogDescription>{t("reschedule.description")}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="scheduled_start_date"
                  label={t("reschedule.startDate")}
                  dateOptions={{
                    placeholder: t("reschedule.startDatePlaceholder"),
                    minDate: new Date(),
                  }}
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.TIME_PICKER}
                  control={form.control}
                  name="scheduled_start_time"
                  label={t("reschedule.startTime")}
                  timeOptions={{
                    placeholder: t("reschedule.startTimePlaceholder"),
                    interval: 15,
                  }}
                  leftIcon={Clock}
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="scheduled_end_date"
                  label={t("reschedule.endDate")}
                  dateOptions={{
                    placeholder: t("reschedule.endDatePlaceholder"),
                    minDate: new Date(),
                  }}
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.TIME_PICKER}
                  control={form.control}
                  name="scheduled_end_time"
                  label={t("reschedule.endTime")}
                  timeOptions={{
                    placeholder: t("reschedule.endTimePlaceholder"),
                    interval: 15,
                  }}
                  leftIcon={Clock}
                  required
                />
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
