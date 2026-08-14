import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle } from "lucide-react"
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
import {
  completeInterviewSchema,
  type CompleteInterviewFormValues,
} from "../validations/employerInterviews.validation"

export default function CompleteInterviewDialog({
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (completionNote?: string) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<CompleteInterviewFormValues>({
    resolver: zodResolver(completeInterviewSchema),
    defaultValues: { completion_note: "" },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  const submit = async (values: CompleteInterviewFormValues) => {
    await onSubmit(values.completion_note || undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("complete.title")}</DialogTitle>
              <DialogDescription>{t("complete.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="completion_note"
                label={t("complete.note")}
                placeholder={t("complete.notePlaceholder")}
                rows={4}
              />
            </div>
            <DialogFooter>
              <CancelButton
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                text={t("complete.cancel")}
              />
              <SubmitButton
                isLoading={isPending}
                text={t("complete.submit")}
                loadingText={t("complete.submitting")}
                icon={<CheckCircle />}
                className="w-auto"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
