import { zodResolver } from "@hookform/resolvers/zod"
import { MailPlus, ShieldCheck } from "lucide-react"
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
import type { AdminCompanyInvitationInput } from "../types/adminCompanyMembers.types"

const invitationSchema = z.object({
  email: z.string().email(),
  company_role: z.string().min(1),
})
export type AdminInvitationFormValues = z.infer<typeof invitationSchema>

const roleOptions: Option[] = [
  { value: "company_admin", label: "members.roles.admin" },
  { value: "recruiter", label: "members.roles.recruiter" },
  { value: "interviewer", label: "members.roles.interviewer" },
  { value: "reviewer", label: "members.roles.member" },
]

export default function CompanyInvitationDialog({
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: AdminCompanyInvitationInput) => void
}) {
  const { t } = useTranslation("adminCompanies")
  const form = useForm<AdminInvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { email: "", company_role: "reviewer" },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
            <DialogHeader>
              <DialogTitle>{t("members.invitationDialog.title")}</DialogTitle>
              <DialogDescription>{t("members.invitationDialog.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.EMAIL}
                control={form.control}
                name="email"
                label={t("members.invitationDialog.email")}
                placeholder="teammate@company.com"
                disabled={isPending}
                leftIcon={MailPlus}
                iconPosition="left"
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="company_role"
                label={t("members.invitationDialog.role")}
                options={roleOptions.map((option) => ({
                  ...option,
                  label: t(option.label),
                }))}
                disabled={isPending}
                required
                leftIcon={ShieldCheck}
                iconPosition="left"
              />
            </div>
            <DialogFooter>
              <CancelButton
                type="button"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                text={t("members.cancel")}
              />
              <SubmitButton
                isLoading={isPending}
                text={t("members.invitationDialog.submit")}
                loadingText={t("members.submitting")}
                icon={<MailPlus />}
                className="w-auto"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
