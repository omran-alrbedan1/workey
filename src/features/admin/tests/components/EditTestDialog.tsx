import { zodResolver } from "@hookform/resolvers/zod"
import { Clock, Pencil, ScrollText, Target, ToggleRight, X } from "lucide-react"
import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { CancelButton, SubmitButton } from "@/components/shared/buttons"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import type { AdminTestRecord, AdminTestUpdateInput } from "../types/adminTests.types"
import {
  createAdminTestSchema,
  type AdminTestFormValues,
} from "../validation/adminTests.validation"

function buildPatch(test: AdminTestRecord, values: AdminTestFormValues): AdminTestUpdateInput {
  const patch: AdminTestUpdateInput = { id: test.id }
  if (values.title !== test.title) patch.title = values.title
  if ((values.description || "") !== (test.description || "")) {
    patch.description = values.description || ""
  }
  if (values.duration_minutes !== test.duration_minutes) {
    patch.duration_minutes = values.duration_minutes
  }
  if (values.passing_score !== test.passing_score) {
    patch.passing_score = values.passing_score
  }
  if (values.is_active !== test.is_active) {
    patch.is_active = values.is_active
  }
  return patch
}

interface EditTestDialogProps {
  test: AdminTestRecord | null
  isUpdating: boolean
  onClose: () => void
  onUpdate: (input: AdminTestUpdateInput) => Promise<unknown>
}

export default function EditTestDialog({
  test,
  isUpdating,
  onClose,
  onUpdate,
}: EditTestDialogProps) {
  const { t } = useTranslation("adminTests")
  const form = useForm<AdminTestFormValues>({
    resolver: zodResolver(createAdminTestSchema(t)) as Resolver<AdminTestFormValues>,
    defaultValues: {
      title: "",
      description: "",
      duration_minutes: 60,
      passing_score: 70,
      is_active: true,
    },
  })

  useEffect(() => {
    if (!test) return
    form.reset({
      title: test.title,
      description: test.description || "",
      duration_minutes: test.duration_minutes,
      passing_score: test.passing_score,
      is_active: test.is_active,
    })
  }, [form, test])

  const submit = async (values: AdminTestFormValues) => {
    if (!test) return
    try {
      const patch = buildPatch(test, values)
      if (Object.keys(patch).length > 1) await onUpdate(patch)
      onClose()
    } catch {
      /* MutationCache displays the API error toast. */
    }
  }

  return (
    <Dialog open={test !== null} onOpenChange={(open) => !open && !isUpdating && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/20">
              <Pencil className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">{t("edit.title")}</DialogTitle>
              <DialogDescription>{t("edit.description")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="title"
              label={t("form.title")}
              placeholder={t("form.titlePlaceholder")}
              leftIcon={ScrollText}
              iconPosition="left"
              disabled={isUpdating}
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="description"
              label={t("form.description")}
              placeholder={t("form.descriptionPlaceholder")}
              disabled={isUpdating}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="duration_minutes"
                label={t("form.duration")}
                leftIcon={Clock}
                iconPosition="left"
                disabled={isUpdating}
              />
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="passing_score"
                label={t("form.passingScore")}
                leftIcon={Target}
                iconPosition="left"
                disabled={isUpdating}
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.SWITCH}
              control={form.control}
              name="is_active"
              label={t("form.active")}
              leftIcon={ToggleRight}
              disabled={isUpdating}
            />

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ScrollText className="h-3 w-3" />
              {t("form.maxScoreManaged")}
            </p>

            <DialogFooter className="gap-2">
              <CancelButton
                onClick={onClose}
                disabled={isUpdating}
                icon={<X className="h-4 w-4" />}
                text={t("edit.cancel")}
              />
              <SubmitButton
                isLoading={isUpdating}
                text={t("edit.save")}
                icon={<Pencil className="h-4 w-4" />}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
