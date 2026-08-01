import { zodResolver } from "@hookform/resolvers/zod"
import { ClipboardCheck, Plus, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { useFieldArray, useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Option } from "@/types/customFormField.types"
import type { EmployerInterviewEvaluateInput } from "../types/employerInterviews.types"

const recommendationOptions: Option[] = [
  { value: "advance", label: "recommendations.advance" },
  { value: "consider", label: "recommendations.consider" },
  { value: "reject", label: "recommendations.reject" },
]

const itemSchema = z.object({
  criterion: z.string().min(1),
  score: z.coerce.number().min(0).max(10),
  comment: z.string().optional(),
})

const schema = z.object({
  recommendation: z.string().min(1),
  overall_comment: z.string().optional(),
  items: z.array(itemSchema),
})

type FormValues = z.infer<typeof schema>

export default function EvaluateInterviewDialog({
  open,
  isPending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: EmployerInterviewEvaluateInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { recommendation: "", overall_comment: "", items: [{ criterion: "", score: 5, comment: "" }] },
  })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" })

  useEffect(() => {
    if (!open) form.reset()
  }, [form, open])

  const submit = async (values: FormValues) => {
    await onSubmit({
      recommendation: values.recommendation,
      overall_comment: values.overall_comment || undefined,
      items: values.items.filter((i) => i.criterion.trim()),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogHeader>
              <DialogTitle>{t("evaluate.title")}</DialogTitle>
              <DialogDescription>{t("evaluate.description")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="recommendation"
                label={t("evaluate.recommendation")}
                placeholder={t("evaluate.recommendation")}
                options={recommendationOptions.map((o) => ({ ...o, label: t(o.label) }))}
                required
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="overall_comment"
                label={t("evaluate.overallComment")}
                placeholder={t("evaluate.commentPlaceholder")}
                rows={3}
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">{t("evaluate.evaluationItems")}</FormLabel>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => append({ criterion: "", score: 5, comment: "" })}
                  >
                    <Plus className="h-4 w-4" /> {t("evaluate.addItem")}
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2 rounded-md border border-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-text-muted">
                        {t("evaluate.itemNumber", { n: index + 1 })}
                      </span>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => remove(index)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.criterion`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormLabel className="text-xs">{t("evaluate.criterion")}</FormLabel>
                            <FormControl>
                              <Input {...f} placeholder={t("evaluate.criterionPlaceholder")} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.score`}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormLabel className="text-xs">{t("evaluate.score")}</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} max={10} {...f} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`items.${index}.comment`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-xs">{t("evaluate.comment")}</FormLabel>
                          <FormControl>
                            <Input {...f} placeholder={t("evaluate.commentPlaceholder")} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <CancelButton disabled={isPending} onClick={() => onOpenChange(false)} text={t("evaluate.cancel")} />
              <SubmitButton isLoading={isPending} text={t("evaluate.submit")} loadingText={t("evaluate.submitting")} icon={<ClipboardCheck />} className="w-auto" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
