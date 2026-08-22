import { zodResolver } from "@hookform/resolvers/zod"
import { ClipboardCheck } from "lucide-react"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { SubmitButton } from "@/components/shared/buttons"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Option } from "@/types/customFormField.types"
import type { EmployerInterviewEvaluateInput } from "../types/employerInterviews.types"
import {
  evaluateInterviewSchema,
  type EvaluateInterviewFormValues,
} from "../validations/employerInterviews.validation"

const recommendationOptions: Option[] = [
  { value: "advance", label: "recommendations.advance" },
  { value: "hold", label: "recommendations.hold" },
  { value: "reject", label: "recommendations.reject" },
]

const defaultCriteria = [
  "Communication",
  "Technical Knowledge",
  "Problem Solving",
  "Job Fit",
  "Professionalism",
]

function defaultItems() {
  return defaultCriteria.map((criterion) => ({ criterion, score: 3, comment: "" }))
}

/** Inline interview evaluation form (recommendation + criteria + comment). */
export default function InterviewEvaluationForm({
  isPending,
  onSubmit,
}: {
  isPending: boolean
  onSubmit: (input: EmployerInterviewEvaluateInput) => Promise<unknown>
}) {
  const { t } = useTranslation("employerInterviews")
  const form = useForm<EvaluateInterviewFormValues>({
    resolver: zodResolver(evaluateInterviewSchema) as Resolver<EvaluateInterviewFormValues>,
    defaultValues: { recommendation: "hold", overall_comment: "", items: defaultItems() },
  })

  const submit = async (values: EvaluateInterviewFormValues) => {
    await onSubmit({
      recommendation: values.recommendation,
      overall_comment: values.overall_comment || undefined,
      items: values.items,
    })
    form.reset({ recommendation: "hold", overall_comment: "", items: defaultItems() })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
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
          <Label className="text-sm font-medium">{t("evaluate.evaluationItems")}</Label>
          {form.watch("items").map((item, index) => (
            <div key={item.criterion} className="space-y-2 rounded-md border border-border p-3">
              <div className="grid grid-cols-[1fr_96px] gap-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.criterion`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t("evaluate.criterion")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={t(`common:interviewCriteria.${field.value}`, { defaultValue: field.value })}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.score`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{t("evaluate.score")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={5} disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`items.${index}.comment`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t("evaluate.comment")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder={t("evaluate.commentPlaceholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <SubmitButton
            isLoading={isPending}
            text={t("evaluate.submit")}
            loadingText={t("evaluate.submitting")}
            icon={<ClipboardCheck />}
            className="w-auto"
          />
        </div>
      </form>
    </Form>
  )
}
