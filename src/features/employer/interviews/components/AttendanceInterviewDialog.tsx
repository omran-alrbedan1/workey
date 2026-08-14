import { zodResolver } from "@hookform/resolvers/zod"
import { ClipboardCheck } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import type { EmployerInterviewAttendanceInput } from "../types/employerInterviews.types"
import {
  attendanceInterviewSchema,
  type AttendanceInterviewFormValues,
} from "../validations/employerInterviews.validation"

const attendanceOptions: Option[] = [
  { value: "present", label: "attendance.present" },
  { value: "absent", label: "attendance.absent" },
  { value: "excused", label: "attendance.excused" },
]

export default function AttendanceInterviewDialog({
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: EmployerInterviewAttendanceInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<AttendanceInterviewFormValues>({
    resolver: zodResolver(attendanceInterviewSchema),
    defaultValues: {
      candidate_status: "present",
      interviewer_status: "present",
      note: "",
    },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  const submit = async (values: AttendanceInterviewFormValues) => {
    await onSubmit({
      candidate_status: values.candidate_status,
      interviewer_status: values.interviewer_status,
      note: values.note || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("attendance.title")}</DialogTitle>
              <DialogDescription>{t("attendance.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="candidate_status"
                  label={t("attendance.candidateStatus")}
                  options={attendanceOptions.map((option) => ({
                    ...option,
                    label: t(option.label),
                  }))}
                  disabled={isPending}
                  required
                />
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="interviewer_status"
                  label={t("attendance.interviewerStatus")}
                  options={attendanceOptions.map((option) => ({
                    ...option,
                    label: t(option.label),
                  }))}
                  disabled={isPending}
                  required
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label={t("attendance.note")}
                placeholder={t("attendance.notePlaceholder")}
                disabled={isPending}
                rows={3}
              />
            </div>
            <DialogFooter>
              <CancelButton
                type="button"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                text={t("attendance.cancel")}
              />
              <SubmitButton
                isLoading={isPending}
                text={t("attendance.submit")}
                loadingText={t("attendance.submitting")}
                icon={<ClipboardCheck />}
                className="w-auto"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
