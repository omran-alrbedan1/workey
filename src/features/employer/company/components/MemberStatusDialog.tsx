import { zodResolver } from "@hookform/resolvers/zod"
import { ToggleRight, UserCheck } from "lucide-react"
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

const statusSchema = z.object({ membership_status: z.enum(["active", "suspended"]) })
type StatusFormValues = z.infer<typeof statusSchema>

const statusOptions: Option[] = [
  { value: "active", label: "team.statusOptions.active" },
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
  onSubmit: (input: MemberStatusInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerCompany")
  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: { membership_status: currentStatus === "suspended" ? "suspended" : "active" },
  })

  useEffect(() => {
    if (open) form.setValue("membership_status", currentStatus === "suspended" ? "suspended" : "active")
  }, [form, open, currentStatus])

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-xl">{t("team.statusDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("team.statusDialog.description", { name: memberName })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="membership_status"
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
                text={t("team.statusDialog.submit")}
                loadingText={t("team.submitting")}
                icon={<ToggleRight className="h-4 w-4" />}
                className="w-auto flex-1"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
