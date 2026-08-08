import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarClock, CalendarPlus, Link2, MapPin, UserRound, Video } from "lucide-react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Option } from "@/types/customFormField.types"
import type { EmployerApplicant, EmployerInterviewInput } from "../types/employerApplicants.types"
import { candidateDisplayName } from "../utils/candidateDisplay"

const interviewTypeOptions: Option[] = [
  { value: "hr", label: "interview.types.hr" },
  { value: "technical", label: "interview.types.technical" },
  { value: "final", label: "interview.types.final" },
]

const interviewModeOptions: Option[] = [
  { value: "online", label: "interview.modes.online", icon: Video },
  { value: "on_site", label: "interview.modes.onSite", icon: MapPin },
]

const schema = z
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
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduled_at"], message: "Choose a future time" })
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
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["meeting_link"], message: "Enter a valid URL" })
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

type FormValues = z.infer<typeof schema>

export default function ScheduleInterviewDialog({
  application,
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  application: EmployerApplicant | null
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (applicationId: string | number, input: EmployerInterviewInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerApplicants")
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      type: "hr",
      scheduled_at: "",
      duration_minutes: 60,
      mode: "on_site",
      meeting_link: "",
      location: "",
      notes: "",
      internal_note: "",
    },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  const mode = form.watch("mode")

  const submit = async (values: FormValues) => {
    if (!application) return
    const start = new Date(values.scheduled_at)
    const end = new Date(start.getTime() + values.duration_minutes * 60_000)
    await onSubmit(application.id, {
      type: values.type,
      mode: values.mode,
      scheduled_start_at: start.toISOString(),
      scheduled_end_at: end.toISOString(),
      duration_minutes: values.duration_minutes,
      meeting_link: values.mode === "online" ? values.meeting_link : undefined,
      location_text: values.mode === "on_site" ? values.location : undefined,
      candidate_message: values.notes || undefined,
      internal_note: values.internal_note || undefined,
    })
    onOpenChange(false)
  }

  const candidate = candidateDisplayName(application, t("unknownCandidate"))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <DialogTitle className="flex items-center gap-2">
                    {t("interview.title")}
                  </DialogTitle>
                  <DialogDescription>{t("interview.description", { name: candidate })}</DialogDescription>
                  <div className="inline-flex max-w-full items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-text-muted">
                    <UserRound className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{candidate}</span>
                  </div>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="type"
                  label={t("interview.type")}
                  placeholder={t("interview.typePlaceholder")}
                  options={interviewTypeOptions.map((option) => ({
                    ...option,
                    label: t(option.label),
                  }))}
                  disabled={isPending}
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="mode"
                  label={t("interview.mode")}
                  placeholder={t("interview.modePlaceholder")}
                  options={interviewModeOptions.map((option) => ({
                    ...option,
                    label: t(option.label),
                  }))}
                  disabled={isPending}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="scheduled_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("interview.scheduledAt")}</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CustomFormField
                  fieldType={FormFieldType.NUMBER}
                  control={form.control}
                  name="duration_minutes"
                  label={t("interview.duration")}
                  min={1}
                  max={480}
                  disabled={isPending}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {mode === "online" ? (
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="meeting_link"
                    label={t("interview.meetingLink")}
                    placeholder={t("interview.meetingLinkPlaceholder")}
                    leftIcon={Link2}
                    iconPosition="left"
                    disabled={isPending}
                    required
                  />
                ) : (
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="location"
                    label={t("interview.location")}
                    placeholder={t("interview.locationPlaceholder")}
                    leftIcon={MapPin}
                    iconPosition="left"
                    disabled={isPending}
                    required
                  />
                )}
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="notes"
                  label={t("interview.notes")}
                  placeholder={t("interview.notesPlaceholder")}
                  disabled={isPending}
                  rows={3}
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="internal_note"
                label={t("interview.internalNote")}
                placeholder={t("interview.internalNotePlaceholder")}
                disabled={isPending}
                rows={3}
              />
            </div>
            <DialogFooter>
              <CancelButton type="button" disabled={isPending} onClick={() => onOpenChange(false)} text={t("interview.cancel")} />
              <SubmitButton isLoading={isPending} text={t("interview.schedule")} loadingText={t("interview.scheduling")} icon={<CalendarPlus />} className="w-auto" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
