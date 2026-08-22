import { AlertCircle, Send } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/states"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ApplicantTestNextStepTabProps {
  hasAnyResult: boolean
  nextStep: string
  isPending: boolean
  isTerminalStatus: boolean
  hasExplicitNextSteps: boolean
  allowedSteps: ReadonlyArray<{ value: string; labelKey: string }>
  onNextStepChange: (value: string) => void
  onApply: () => void
}

export default function ApplicantTestNextStepTab({
  hasAnyResult,
  nextStep,
  isPending,
  isTerminalStatus,
  hasExplicitNextSteps,
  allowedSteps,
  onNextStepChange,
  onApply,
}: ApplicantTestNextStepTabProps) {
  const { t } = useTranslation("employerApplicants")

  if (!hasAnyResult) {
    return (
      <EmptyState
        title={t("tests.notSubmittedHint")}
        description={t("tests.nextStepEmptyDescription", {
          defaultValue: "Grade the test first to unlock next step actions.",
        })}
        icon={Send}
        className="py-8 bg-transparent"
      />
    )
  }

  if (isTerminalStatus) {
    return (
      <EmptyState
        title={t("errors.terminalState")}
        description={t("tests.terminalStatusHint", {
          defaultValue:
            "This application is in a final state. No further status changes are allowed.",
        })}
        icon={AlertCircle}
        className="py-8 bg-transparent"
      />
    )
  }

  if (allowedSteps.length === 0) {
    return (
      <EmptyState
        title={t("tests.nextStep")}
        description={
          hasExplicitNextSteps
            ? t("overview.noActions")
            : t("overview.actionsFallbackHint")
        }
        icon={Send}
        className="py-8 bg-transparent"
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Send className="h-4 w-4 text-primary" />
          {t("tests.nextStep")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Select value={nextStep} onValueChange={onNextStepChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("tests.selectNextStep")} />
          </SelectTrigger>
          <SelectContent>
            {allowedSteps.map((step) => (
              <SelectItem key={step.value} value={step.value}>
                {t(step.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button disabled={!nextStep || isPending} onClick={onApply}>
          <Send className="h-4 w-4" />
          {t("tests.applyNextStep")}
        </Button>
      </CardContent>
    </Card>
  )
}
