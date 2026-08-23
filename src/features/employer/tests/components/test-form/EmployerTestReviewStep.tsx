import { FileText, ListChecks, Target } from "lucide-react"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"
import { cn } from "@/lib/utils"
import type { EmployerTestFormValues } from "../../validation/employerTests.validation"
import { questionTypeLabelKeys } from "../../utils/employerTestForm"

export default function EmployerTestReviewStep({
  values,
  maxScore,
}: {
  values: EmployerTestFormValues
  maxScore: number
}) {
  const { t } = useTranslation("employerTests")
  const reviewQuestions = values.questions ?? []

  return (
    <div className="space-y-6 sm:col-span-2">
      <section className="rounded-lg border border-border p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <FileText className="h-4 w-4 text-primary" />
          {t("review.infoSection")}
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2">
          <ReviewItem label={t("form.title")} value={values.title || "-"} />
          <ReviewItem
            label={t("form.description")}
            value={values.description || t("noDescription")}
          />
        </dl>
      </section>

      <section className="rounded-lg border border-border p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Target className="h-4 w-4 text-primary" />
          {t("review.settingsSection")}
        </h3>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ReviewItem label={t("review.totalPoints")} value={`${maxScore}`} />
          <ReviewItem label={t("form.passingScore")} value={`${values.passing_score ?? 0}`} />
          <ReviewItem
            label={t("form.duration")}
            value={t("minutes", { count: values.duration_minutes ?? 0 })}
          />
          <ReviewItem
            label={t("form.active")}
            value={values.is_active ? t("review.active") : t("review.inactive")}
          />
        </dl>
        {values.instructions && (
          <div className="mt-3">
            <ReviewItem label={t("form.instructions")} value={values.instructions} multiline />
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border p-4">
        <h3 className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold text-text-primary">
          <span className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            {t("review.questionsSection")}
          </span>
          <span className="text-xs font-normal text-text-muted">
            {t("review.questionCount", { count: reviewQuestions.length })}
          </span>
        </h3>
        {reviewQuestions.length === 0 ? (
          <EmptyState
            title={t("review.empty")}
            description={t("review.questionsSection")}
            icon={ListChecks}
            className="rounded-md border border-dashed border-border/60 bg-background-secondary/40 py-8"
          />
        ) : (
          <ol className="space-y-2">
            {reviewQuestions.map((question, index) => {
              const options = question.options ?? []
              const correctCount = options.filter((option) => option.is_correct).length

              return (
                <li key={question.id ?? index} className="rounded-md border border-border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary">
                      {index + 1}. {question.question_text}
                    </p>
                    <span className="text-xs font-medium text-primary">
                      {Number(question.points)} pts
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {t(questionTypeLabelKeys[question.question_type])}
                    {options.length > 0 &&
                      ` · ${t("review.optionsCount", { count: options.length })}${
                        correctCount > 0 ? ` · ${correctCount} ✓` : ""
                      }`}
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </div>
  )
}

function ReviewItem({
  label,
  value,
  multiline,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-text-muted">{label}</dt>
      <dd
        className={cn(
          "mt-0.5 whitespace-pre-line text-sm text-text-primary",
          !multiline && "truncate",
        )}
        title={!multiline ? value : undefined}
      >
        {value}
      </dd>
    </div>
  )
}
