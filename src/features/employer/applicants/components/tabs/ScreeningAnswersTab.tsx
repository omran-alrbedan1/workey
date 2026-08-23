import { CheckCircle2, ChevronDown, MessageSquare, ClipboardCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { keyOf } from "@/lib/keyValue"
import type { ApplicationScreeningAnswer } from "../../types/employerApplicants.types"
import { valueOf } from "@/lib/keyValue"

interface ScreeningAnswersTabProps {
  answers: ApplicationScreeningAnswer[]
}

function AnswerDisplay({ answer }: { answer: ApplicationScreeningAnswer }) {
  const { t } = useTranslation("employerApplicants")
  const type = keyOf(answer.question_type)
  const Icon = type === "boolean" ? CheckCircle2 : type === "number" ? ChevronDown : MessageSquare

  let answerText = "—"
  if (answer.answer.value != null) {
    if (typeof answer.answer.value === "boolean") {
      answerText = answer.answer.value ? t("answers.yes") : t("answers.no")
    } else if (Array.isArray(answer.answer.value)) {
      answerText = answer.answer.value.map((item) => valueOf(item, String(item))).join(", ")
    } else {
      answerText = valueOf(answer.answer.value, String(answer.answer.value))
    }
  } else if (answer.answer.selected_options?.length > 0) {
    answerText = answer.answer.selected_options.map((o) => o.option_text).join(", ")
  }

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="mb-2 text-sm font-medium text-text-primary">{answer.question_text}</p>
      <div className="flex items-start gap-2 text-sm text-text-secondary">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>{answerText}</span>
      </div>
    </div>
  )
}

export default function ScreeningAnswersTab({ answers }: ScreeningAnswersTabProps) {
  const { t } = useTranslation("employerApplicants")

  if (!answers || answers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            {t("screeningAnswers.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border bg-background/50 p-8 text-center text-sm text-text-muted">
            {t("screeningAnswers.empty")}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          {t("screeningAnswers.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {answers.map((answer, i) => (
            <AnswerDisplay key={answer.id ?? i} answer={answer} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
