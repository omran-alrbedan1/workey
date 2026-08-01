import { FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { keyOf } from "@/lib/keyValue"
import EmptyState from "@/components/shared/states/EmptyState"

interface EmployerJobScreeningQuestionsTabProps {
  screeningQuestions: any[]
}

function getKey(v: unknown): string {
  return keyOf(v)
}

export default function EmployerJobScreeningQuestionsTab({
  screeningQuestions,
}: EmployerJobScreeningQuestionsTabProps) {
  const { t } = useTranslation("employerJobs")

  return (
    <div className="space-y-6">
      {screeningQuestions && screeningQuestions.length > 0 ? (
        <Card className="border-border bg-background-card shadow-card">
          <CardHeader className="border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-text-primary">{t("screeningQuestions.title")}</h2>
                <p className="text-sm text-text-muted">{t("screeningQuestions.description")}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <ul className="space-y-2">
              {screeningQuestions.map((q) => (
                <li
                  key={q.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/5">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{q.question_text}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-text-muted">{t(`screeningQuestions.types.${getKey(q.question_type)}`)}</span>
                      {q.is_required && (
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-700">
                          {t("screeningQuestions.required")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title={t("screeningQuestions.emptyTitle")}
          description={t("screeningQuestions.emptyDescription")}
          icon={FileText}
        />
      )}
    </div>
  )
}
