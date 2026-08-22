import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRightLeft, Crown } from "lucide-react"
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
import type { CompanyMember } from "../types/employerTeam.types"

const transferSchema = z.object({ new_owner_user_id: z.string().min(1) })
type TransferFormValues = z.infer<typeof transferSchema>

export default function TransferOwnershipDialog({
  open,
  members,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  members: CompanyMember[]
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (userId: string | number) => Promise<unknown>
}) {
  const { t } = useTranslation("employerCompany")
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: { new_owner_user_id: "" },
  })

  useEffect(() => {
    if (open) form.reset()
  }, [form, open])

  const options: Option[] = members
    .filter((member) => member.id !== undefined)
    .map((member) => ({
      value: String(member.id),
      label: `${member.name} (${member.email})`,
    }))

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values.new_owner_user_id))}>
            <DialogHeader className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
                <Crown className="h-6 w-6 text-amber-600" />
              </div>
              <DialogTitle className="text-xl">{t("team.transferDialog.title")}</DialogTitle>
              <DialogDescription>{t("team.transferDialog.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="new_owner_user_id"
                label={t("team.transferDialog.member")}
                options={options}
                disabled={isPending || options.length === 0}
                required
                leftIcon={ArrowRightLeft}
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
                text={t("team.transferDialog.submit")}
                loadingText={t("team.submitting")}
                icon={<Crown className="h-4 w-4" />}
                className="w-auto flex-1 bg-amber-600 hover:bg-amber-700"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
