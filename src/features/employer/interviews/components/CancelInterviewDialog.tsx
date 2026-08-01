import { zodResolver } from "@hookform/resolvers/zod"
import { Ban } from "lucide-react"
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
import type { EmployerInterviewCancelInput } from "../types/employerInterviews.types"

const schema = z.object({
  reason: z.string().trim().min(1),
  candidate_message: z.string().trim().optional(),
})

type FormValues = z.infer<typeof schema>

export default function CancelInterviewDialog({
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: EmployerInterviewCancelInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "", candidate_message: "" },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  const submit = async (values: FormValues) => {
    await onSubmit({
      reason: values.reason,
      candidate_message: values.candidate_message || undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("cancel.title")}</DialogTitle>
              <DialogDescription>{t("cancel.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label={t("cancel.reason")}
                placeholder={t("cancel.reasonPlaceholder")}
                disabled={isPending}
                rows={3}
                required
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="candidate_message"
                label={t("cancel.candidateMessage")}
                placeholder={t("cancel.candidateMessagePlaceholder")}
                disabled={isPending}
                rows={3}
              />
            </div>
            <DialogFooter>
              <CancelButton type="button" disabled={isPending} onClick={() => onOpenChange(false)} text={t("cancel.close")} />
              <SubmitButton isLoading={isPending} text={t("cancel.submit")} loadingText={t("cancel.submitting")} icon={<Ban />} className="w-auto" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
