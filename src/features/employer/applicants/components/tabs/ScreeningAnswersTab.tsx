import { CheckCircle2, ChevronDown, MessageSquare } from "lucide-react"
import { useTranslation } from "react-i18next"
import { keyOf } from "@/lib/keyValue"
import type { ApplicationScreeningAnswer } from "../../types/employerApplicants.types"

interface ScreeningAnswersTabProps {
  answers: ApplicationScreeningAnswer[]
}

function AnswerDisplay({ answer }: { answer: ApplicationScreeningAnswer }) {
  const { t } = useTranslation("employerApplicants")
  const type = keyOf(answer.question_type)
  const Icon = type === "boolean" ? CheckCircle2 : type === "number" ? ChevronDown : MessageSquare
  
  // Extract answer based on new contract
  let answerText = "—"
  if (answer.answer.value != null) {
    if (typeof answer.answer.value === "boolean") {
      answerText = answer.answer.value ? t("answers.yes") : t("answers.no")
    } else {
      answerText = String(answer.answer.value)
    }
  } else if (answer.answer.selected_options?.length > 0) {
    answerText = answer.answer.selected_options.map(o => o.option_text).join(", ")
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
      <div className="rounded-lg border border-dashed border-border bg-background/50 p-8 text-center text-sm text-text-muted">
        {t("screeningAnswers.empty")}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-text-primary">{t("screeningAnswers.title")}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {answers.map((answer, i) => (
          <AnswerDisplay key={answer.id ?? i} answer={answer} />
        ))}
      </div>
    </div>
  )
}
