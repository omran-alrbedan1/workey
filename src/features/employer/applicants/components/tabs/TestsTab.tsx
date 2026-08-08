import { Calendar, FileText, ListChecks } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { keyOf, valueOf } from "@/lib/keyValue"
import type { EmployerTestAttempt } from "../../types/employerApplicants.types"

interface TestsTabProps {
  tests: {
    isPending: boolean
    data?: { items: EmployerTestAttempt[] }
  }
  onViewAll: () => void
}

export default function TestsTab({ tests, onViewAll }: TestsTabProps) {
  const { t } = useTranslation("employerApplicants")

  if (tests.isPending) {
    return <Skeleton className="h-64 w-full" />
  }

  if (!tests.data?.items || tests.data.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background/50 p-8 text-center text-sm text-text-muted">
        {t("tests.empty")}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <ListChecks className="h-5 w-5 text-primary" />
          {t("tests.title")}
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={onViewAll}>
          <FileText className="h-4 w-4" /> {t("tests.viewAll")}
        </Button>
      </div>

      <div className="space-y-2">
        {tests.data.items.slice(0, 5).map((attempt) => {
          const score = attempt.attempt?.total_score ?? null
          const max = attempt.attempt?.max_score ?? attempt.test?.max_score ?? 0
          const passed = attempt.attempt?.is_passing_score_met
          const attemptStatusKey = keyOf(attempt.state)
          const submitted = Boolean(attempt.attempt?.submitted_at) || attemptStatusKey === "submitted" || attemptStatusKey === "evaluated"

          return (
            <div key={attempt.id} className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {attempt.test?.title || t("tests.untitled")}
                </p>
                <div className="mt-1 flex items-center gap-4 text-xs text-text-muted">
                  {attempt.deadline_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(attempt.deadline_at).toLocaleDateString()}
                    </span>
                  )}
                  {submitted && score != null && (
                    <span>{t("tests.result", { score, max })}</span>
                  )}
                </div>
              </div>
              <Badge
                variant={passed ? "default" : "secondary"}
                className={passed ? "bg-emerald-500/10 text-emerald-700" : ""}
              >
                {submitted && score != null
                  ? passed
                    ? t("tests.passed")
                    : t("tests.failed")
                  : valueOf(attempt.state, "pending")}
              </Badge>
            </div>
          )
        })}
        {tests.data.items.length > 5 && (
          <p className="text-center text-xs text-text-muted">
            {t("tests.moreCount", { count: tests.data.items.length - 5 })}
          </p>
        )}
      </div>
    </div>
  )
}
