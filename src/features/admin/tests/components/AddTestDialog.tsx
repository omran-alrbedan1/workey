import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building2,
  Clock,
  FlaskConical,
  Loader2,
  Plus,
  ScrollText,
  Target,
  X,
} from "lucide-react"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import type { AdminCompanyRecord } from "@/features/admin/companies/types/adminCompanies.types"
import type { AdminTestInput } from "../types/adminTests.types"
import {
  createAdminTestSchema,
  type AdminTestFormValues,
} from "../validations/adminTests.validation"

interface AddTestDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (input: AdminTestInput) => Promise<unknown>
  isPending: boolean
  companies: AdminCompanyRecord[]
  isLoadingCompanies?: boolean
}

export default function AddTestDialog({
  open,
  onClose,
  onCreate,
  isPending,
  companies,
  isLoadingCompanies = false,
}: AddTestDialogProps) {
  const { t } = useTranslation("adminTests")
  const schema = createAdminTestSchema(t, true)
  const form = useForm<AdminTestFormValues>({
    resolver: zodResolver(schema) as Resolver<AdminTestFormValues>,
    defaultValues: {
      company_id: "",
      title: "",
      description: "",
      duration_minutes: 60,
      passing_score: 0,
    },
  })

  const submit = async (values: AdminTestFormValues) => {
    try {
      await onCreate({
        company_id: values.company_id ?? "",
        title: values.title,
        description: values.description,
        duration_minutes: values.duration_minutes,
        passing_score: values.passing_score,
      })
      form.reset()
      onClose()
    } catch {
      /* MutationCache displays the API error toast. */
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20">
              <FlaskConical className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{t("create.title")}</DialogTitle>
              <DialogDescription>{t("create.description")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="company_id"
              label={t("form.company")}
              placeholder={
                isLoadingCompanies
                  ? t("form.loadingCompanies")
                  : t("form.companyPlaceholder")
              }
              leftIcon={Building2}
              iconPosition="left"
              disabled={isPending || isLoadingCompanies}
              options={companies.map((c) => ({
                value: String(c.id),
                label: c.name,
              }))}
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="title"
              label={t("form.title")}
              placeholder={t("form.titlePlaceholder")}
              leftIcon={ScrollText}
              iconPosition="left"
              disabled={isPending}
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="description"
              label={t("form.description")}
              placeholder={t("form.descriptionPlaceholder")}
              disabled={isPending}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="duration_minutes"
                label={t("form.duration")}
                leftIcon={Clock}
                iconPosition="left"
                disabled={isPending}
              />
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="passing_score"
                label={t("form.passingScore")}
                leftIcon={Target}
                iconPosition="left"
                disabled={isPending}
              />
            </div>

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ScrollText className="h-3 w-3" />
              {t("form.maxScoreManaged")}
            </p>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                {t("edit.cancel")}
              </Button>
              <Button type="submit" className="text-white" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {t("form.add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
