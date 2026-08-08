import { zodResolver } from "@hookform/resolvers/zod"
import { UserX } from "lucide-react"
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
import type { Option } from "@/types/customFormField.types"
import type { EmployerInterviewNoShowInput } from "../types/employerInterviews.types"

const partyOptions: Option[] = [
  { value: "candidate", label: "noShow.candidate" },
  { value: "interviewer", label: "noShow.interviewer" },
  { value: "both", label: "noShow.both" },
]

const schema = z.object({
  party: z.enum(["candidate", "interviewer", "both"]),
  reason: z.string().trim().min(1).max(2000),
})

type FormValues = z.infer<typeof schema>

export default function NoShowInterviewDialog({
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: EmployerInterviewNoShowInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { party: "candidate", reason: "" },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  const submit = async (values: FormValues) => {
    await onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("noShow.title")}</DialogTitle>
              <DialogDescription>{t("noShow.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="party"
                label={t("noShow.party")}
                options={partyOptions.map((option) => ({ ...option, label: t(option.label) }))}
                disabled={isPending}
                required
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label={t("noShow.reason")}
                placeholder={t("noShow.reasonPlaceholder")}
                disabled={isPending}
                rows={3}
                required
              />
            </div>
            <DialogFooter>
              <CancelButton type="button" disabled={isPending} onClick={() => onOpenChange(false)} text={t("noShow.cancel")} />
              <SubmitButton isLoading={isPending} text={t("noShow.submit")} loadingText={t("noShow.submitting")} icon={<UserX />} className="w-auto" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
