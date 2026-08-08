import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarPlus, Link2, MapPin, Video } from "lucide-react"
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
import type { EmployerInterviewInput } from "../types/employerInterviews.types"

const interviewTypeOptions: Option[] = [
  { value: "hr", label: "interviewTypes.hr" },
  { value: "technical", label: "interviewTypes.technical" },
  { value: "final", label: "interviewTypes.final" },
]

const interviewModeOptions: Option[] = [
  { value: "online", label: "interviewModes.online", icon: Video },
  { value: "on_site", label: "interviewModes.onSite", icon: MapPin },
]

const schema = z
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
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduled_at"], message: "Choose a future time" })
    }
    if (values.interview_mode === "online") {
      const link = values.meeting_link?.trim()
      if (!link) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["meeting_link"], message: "Meeting link is required" })
      } else if (!z.string().url().safeParse(link).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["meeting_link"], message: "Enter a valid URL" })
      }
    }
    if (values.interview_mode === "on_site" && !values.location?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["location"], message: "Location is required" })
    }
  })

type FormValues = z.infer<typeof schema>

export default function ScheduleInterviewDialog({
  applicationId,
  candidateName,
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  applicationId?: string | number
  candidateName?: string
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (applicationId: string | number, input: EmployerInterviewInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      interview_type: "hr",
      scheduled_at: "",
      duration_minutes: 60,
      interview_mode: "online",
      meeting_link: "",
      location: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  const watchMode = form.watch("interview_mode")

  const submit = async (values: FormValues) => {
    if (!applicationId) return
    const start = new Date(values.scheduled_at)
    const end = new Date(start.getTime() + values.duration_minutes * 60_000)
    await onSubmit(applicationId, {
      type: values.interview_type,
      scheduled_start_at: start.toISOString(),
      scheduled_end_at: end.toISOString(),
      mode: values.interview_mode === "on_site" ? "on_site" : "online",
      meeting_link: values.interview_mode === "online" ? values.meeting_link || undefined : undefined,
      location_text: values.interview_mode === "on_site" ? values.location || undefined : undefined,
      candidate_message: values.notes || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("schedule.title")}</DialogTitle>
              {candidateName && (
                <DialogDescription>
                  {t("schedule.description", { name: candidateName })}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="interview_type"
                label={t("schedule.interviewType")}
                placeholder={t("schedule.interviewType")}
                options={interviewTypeOptions.map((o) => ({ ...o, label: t(o.label) }))}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="scheduled_at"
                  label={t("schedule.scheduledAt")}
                  placeholder="2026-05-15T14:00"
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={form.control}
                  name="duration_minutes"
                  label={t("schedule.duration")}
                  min={1}
                  max={480}
                  required
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="interview_mode"
                label={t("schedule.mode")}
                placeholder={t("schedule.mode")}
                options={interviewModeOptions.map((o) => ({ ...o, label: t(o.label) }))}
                required
              />
              {watchMode === "online" && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="meeting_link"
                  label={t("schedule.meetingLink")}
                  placeholder="https://meet.example.com/..."
                  leftIcon={Link2}
                />
              )}
              {watchMode === "on_site" && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="location"
                  label={t("schedule.location")}
                  placeholder={t("schedule.locationPlaceholder")}
                  leftIcon={MapPin}
                />
              )}
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="notes"
                label={t("schedule.notes")}
                placeholder={t("schedule.notesPlaceholder")}
                rows={3}
              />
            </div>
            <DialogFooter>
              <CancelButton disabled={isPending} onClick={() => onOpenChange(false)} text={t("schedule.cancel")} />
              <SubmitButton isLoading={isPending} text={t("schedule.submit")} loadingText={t("schedule.submitting")} icon={<CalendarPlus />} className="w-auto" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
