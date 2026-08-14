import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarClock, CalendarSync, Link2, MapPin } from "lucide-react"
import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
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
import type {
  EmployerInterviewRescheduleInput,
  InterviewMode,
} from "../types/employerInterviews.types"
import {
  createRescheduleInterviewSchema,
  parseLocalDateTime,
  type RescheduleInterviewFormValues,
} from "../validations/employerInterviews.validation"

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
  onSubmit: (
    interviewId: string | number,
    input: EmployerInterviewRescheduleInput,
  ) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<RescheduleInterviewFormValues>({
    resolver: zodResolver(
      createRescheduleInterviewSchema(t),
    ) as Resolver<RescheduleInterviewFormValues>,
    defaultValues: {
      scheduled_start: "",
      scheduled_end: "",
      mode: "online",
      meeting_link: "",
      location_text: "",
      reason: "",
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        scheduled_start: toLocalDateTime(currentScheduledAt),
        scheduled_end: toLocalDateTime(currentScheduledEndAt),
        mode: currentMode === "on_site" ? "on_site" : "online",
        meeting_link: currentMeetingLink || "",
        location_text: currentLocationText || "",
        reason: "",
      })
    }
  }, [
    currentLocationText,
    currentMeetingLink,
    currentMode,
    currentScheduledAt,
    currentScheduledEndAt,
    form,
    open,
  ])

  const mode = form.watch("mode")

  const submit = async (values: RescheduleInterviewFormValues) => {
    if (!interviewId) return
    const start = parseLocalDateTime(values.scheduled_start)
    const end = parseLocalDateTime(values.scheduled_end)
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
                  fieldType={FormFieldType.DATETIME_PICKER}
                  control={form.control}
                  name="scheduled_start"
                  label={t("reschedule.startDateTime")}
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.DATETIME_PICKER}
                  control={form.control}
                  name="scheduled_end"
                  label={t("reschedule.endDateTime")}
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
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="meeting_link"
                  label={t("reschedule.meetingLink")}
                  placeholder="https://meet.example.com/interview"
                  leftIcon={Link2}
                  required
                />
              ) : (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="location_text"
                  label={t("reschedule.location")}
                  placeholder={t("schedule.locationPlaceholder")}
                  leftIcon={MapPin}
                  required
                />
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
              <CancelButton
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                text={t("reschedule.cancel")}
              />
              <SubmitButton
                isLoading={isPending}
                text={t("reschedule.submit")}
                loadingText={t("reschedule.submitting")}
                icon={<CalendarSync />}
                className="w-auto"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
