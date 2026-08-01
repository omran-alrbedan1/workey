import { zodResolver } from "@hookform/resolvers/zod"
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

const schema = z.object({
  body: z.string().trim().min(1),
})

type FormValues = z.infer<typeof schema>

interface InternalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialBody: string
  onSubmit: (body: string) => void
  isSubmitting: boolean
}

export default function InternalNoteDialog({
  open,
  onOpenChange,
  initialBody,
  onSubmit,
  isSubmitting,
}: InternalNoteDialogProps) {
  const { t } = useTranslation("employerApplicants")
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { body: initialBody },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
    } else {
      form.setValue("body", initialBody)
    }
  }, [form, open, initialBody])

  const submit = async (values: FormValues) => {
    onSubmit(values.body.trim())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("internalNotes.dialogTitle")}</DialogTitle>
              <DialogDescription>{t("internalNotes.dialogDescription")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="body"
                placeholder={t("internalNotes.placeholder")}
                disabled={isSubmitting}
                rows={6}
              />
            </div>
            <DialogFooter>
              <CancelButton type="button" disabled={isSubmitting} onClick={() => onOpenChange(false)} text={t("internalNotes.cancel")} />
              <SubmitButton isLoading={isSubmitting} text={t("internalNotes.submit")} loadingText={t("internalNotes.submitting")} className="w-auto" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
