import { ClipboardCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { interviewValue } from "../utils/interviewDisplay"
import type {
  EmployerInterviewEvaluation,
  EmployerInterviewEvaluateInput,
} from "../types/employerInterviews.types"
import ContextBlock from "./ContextBlock"
import InterviewEvaluationForm from "./InterviewEvaluationForm"
import PanelCard from "./PanelCard"
import TextBlock from "./TextBlock"

interface EvaluationCardProps {
  isRtl: boolean
  evaluation?: EmployerInterviewEvaluation | null
  canEvaluate: boolean
  isSubmitting: boolean
  onSubmit: (input: EmployerInterviewEvaluateInput) => Promise<unknown>
}

export default function EvaluationCard({
  isRtl,
  evaluation,
  canEvaluate,
  isSubmitting,
  onSubmit,
}: EvaluationCardProps) {
  const { t } = useTranslation("employerInterviews")

  return (
    <PanelCard icon={ClipboardCheck} title={t("hrAssistance.evaluation.title")}>
      {evaluation ? (
        <div className="space-y-3">
          {evaluation.recommendation && (
            <TextBlock
              isRtl={isRtl}
              label={t("details.recommendation")}
              value={interviewValue(evaluation.recommendation)}
            />
          )}
          {evaluation.overall_comment && (
            <TextBlock
              isRtl={isRtl}
              label={t("details.overallComment")}
              value={evaluation.overall_comment}
            />
          )}
          {evaluation.items && evaluation.items.length > 0 ? (
            <ContextBlock isRtl={isRtl} label={t("details.evaluationItems")}>
              {evaluation.items.map((item, index) => (
                <div key={item.id ?? index} className="rounded-md border border-border p-2">
                  <div
                    className={cn(
                      "flex items-center justify-between",
                      isRtl && "flex-row-reverse text-end",
                    )}
                  >
                    <span className="text-sm font-medium text-text-primary">{item.criterion}</span>
                    <span className="text-sm font-semibold text-primary">{item.score}/5</span>
                  </div>
                  {item.comment && <p className="mt-1 text-xs text-text-muted">{item.comment}</p>}
                </div>
              ))}
            </ContextBlock>
          ) : null}
        </div>
      ) : canEvaluate ? (
        <InterviewEvaluationForm isPending={isSubmitting} onSubmit={onSubmit} />
      ) : (
        <p className="text-sm text-text-muted">{t("hrAssistance.evaluation.notAvailable")}</p>
      )}
    </PanelCard>
  )
}
