import { Calendar, FileText, ListChecks } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { keyOf, valueOf } from "@/lib/keyValue"
import EmptyState from "@/components/shared/states/EmptyState"
import type { EmployerTestAttempt } from "../../types/employerApplicants.types"

interface TestsTabProps {
  tests: {
    isPending: boolean
    data?: { items: EmployerTestAttempt[] }
  }
  onViewAll: () => void
  onOpenTest: (assignment: EmployerTestAttempt) => void
}

export default function TestsTab({ tests, onViewAll, onOpenTest }: TestsTabProps) {
  const { t } = useTranslation("employerApplicants")

  if (tests.isPending) {
    return <Skeleton className="h-64 w-full" />
  }

  if (!tests.data?.items || tests.data.items.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecks className="h-5 w-5 text-primary" />
            {t("tests.title")}
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onViewAll}
            className="shrink-0"
          >
            <FileText className="h-4 w-4 mr-2" /> {t("tests.viewAll")}
          </Button>
        </CardHeader>
        <CardContent>
          <EmptyState
            title={t("tests.empty")}
            description={t("tests.emptyDescription", {
              defaultValue: "No tests are assigned to this application.",
            })}
            icon={ListChecks}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListChecks className="h-5 w-5 text-primary" />
          {t("tests.title")}
        </CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={onViewAll} className="shrink-0">
          <FileText className="h-4 w-4 mr-2" /> {t("tests.viewAll")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {tests.data.items.slice(0, 5).map((attempt) => {
          const score = attempt.attempt?.total_score ?? null
          const max = attempt.attempt?.max_score ?? attempt.test?.max_score ?? 0
          const passed = attempt.attempt?.is_passing_score_met
          const attemptStatusKey = keyOf(attempt.state)
          const submitted =
            Boolean(attempt.attempt?.submitted_at) ||
            attemptStatusKey === "submitted" ||
            attemptStatusKey === "evaluated"
          return (
            <button
              key={attempt.id}
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-border bg-background/50 p-4 text-start transition-colors hover:border-primary/40 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              onClick={() => onOpenTest(attempt)}
            >
              <div className="min-w-0 flex-1">
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
                  {submitted && score != null && <span>{t("tests.result", { score, max })}</span>}
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
                  : String(valueOf(attempt.state, "pending"))}
              </Badge>
            </button>
          )
        })}
        {tests.data.items.length > 5 && (
          <p className="text-center text-xs text-text-muted">
            {t("tests.moreCount", { count: tests.data.items.length - 5 })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
