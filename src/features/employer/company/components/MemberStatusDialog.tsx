import { zodResolver } from "@hookform/resolvers/zod"
import { ToggleRight } from "lucide-react"
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
import type { MemberStatusInput } from "../types/employerTeam.types"

const statusSchema = z.object({ status: z.string().min(1) })
type StatusFormValues = z.infer<typeof statusSchema>

const statusOptions: Option[] = [
  { value: "active", label: "team.statusOptions.active" },
  { value: "inactive", label: "team.statusOptions.inactive" },
  { value: "suspended", label: "team.statusOptions.suspended" },
]

export default function MemberStatusDialog({
  open,
  memberName,
  currentStatus,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  memberName: string
  currentStatus: string
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: MemberStatusInput) => void
}) {
  const { t } = useTranslation("employerCompany")
  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: { status: currentStatus },
  })

  useEffect(() => {
    if (open) form.setValue("status", currentStatus)
  }, [form, open, currentStatus])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
            <DialogHeader>
              <DialogTitle>{t("team.statusDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("team.statusDialog.description", { name: memberName })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="status"
                label={t("team.statusDialog.label")}
                options={statusOptions.map((option) => ({
                  ...option,
                  label: t(option.label),
                }))}
                disabled={isPending}
                required
                leftIcon={ToggleRight}
                iconPosition="left"
              />
            </div>
            <DialogFooter>
              <CancelButton
                type="button"
                disabled={isPending}
                onClick={() => onOpenChange(false)}
                text={t("team.cancel")}
              />
              <SubmitButton
                isLoading={isPending}
                text={t("team.statusDialog.submit")}
                loadingText={t("team.submitting")}
                className="w-auto"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
