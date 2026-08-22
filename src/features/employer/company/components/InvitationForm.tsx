import { zodResolver } from "@hookform/resolvers/zod"
import { MailPlus, Send, ShieldCheck } from "lucide-react"
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
import type { CompanyInvitationInput } from "../types/employerTeam.types"

const invitationSchema = z.object({
  email: z.string().email(),
  company_role: z.string().min(1),
})
export type InvitationFormValues = z.infer<typeof invitationSchema>

const roleOptions: Option[] = [
  { value: "company_admin", label: "team.roles.companyAdmin" },
  { value: "recruiter", label: "team.roles.recruiter" },
  { value: "interviewer", label: "team.roles.interviewer" },
  { value: "reviewer", label: "team.roles.reviewer" },
]

export default function InvitationForm({
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CompanyInvitationInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerCompany")
  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { email: "", company_role: "reviewer" },
  })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-xl">{t("team.invitationDialog.title")}</DialogTitle>
              <DialogDescription>{t("team.invitationDialog.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.EMAIL}
                control={form.control}
                name="email"
                label={t("team.invitationDialog.email")}
                placeholder="teammate@company.com"
                disabled={isPending}
                leftIcon={MailPlus}
                iconPosition="left"
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="company_role"
                label={t("team.invitationDialog.role")}
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
            <DialogFooter className="gap-2 sm:gap-2">
              <CancelButton
                type="button"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                text={t("team.cancel")}
                className="flex-1"
              />
              <SubmitButton
                isLoading={isPending}
                text={t("team.invitationDialog.submit")}
                loadingText={t("team.submitting")}
                icon={<Send className="h-4 w-4" />}
                className="w-auto flex-1"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
