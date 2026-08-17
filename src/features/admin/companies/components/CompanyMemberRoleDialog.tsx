import { zodResolver } from "@hookform/resolvers/zod"
import { ShieldCheck } from "lucide-react"
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
import type { AdminCompanyMemberRoleInput } from "../types/adminCompanyMembers.types"

const roleSchema = z.object({ company_role: z.string().min(1) })
type RoleFormValues = z.infer<typeof roleSchema>

const roleOptions: Option[] = [
  { value: "company_admin", label: "members.roles.admin" },
  { value: "recruiter", label: "members.roles.recruiter" },
  { value: "interviewer", label: "members.roles.interviewer" },
  { value: "reviewer", label: "members.roles.member" },
]

export default function CompanyMemberRoleDialog({
  open,
  memberName,
  currentRole,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  memberName: string
  currentRole: string
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: AdminCompanyMemberRoleInput) => void
}) {
  const { t } = useTranslation("adminCompanies")
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { company_role: currentRole },
  })

  useEffect(() => {
    if (open) form.setValue("company_role", currentRole)
  }, [form, open, currentRole])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
            <DialogHeader>
              <DialogTitle>{t("members.roleDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("members.roleDialog.description", { name: memberName })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="company_role"
                label={t("members.roleDialog.label")}
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
                text={t("members.roleDialog.submit")}
                loadingText={t("members.submitting")}
                className="w-auto"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
