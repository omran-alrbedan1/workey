import { Send } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { nextSteps } from "./testDetails.helpers"

interface ApplicantTestNextStepTabProps {
  hasAnyResult: boolean
  nextStep: string
  isPending: boolean
  onNextStepChange: (value: string) => void
  onApply: () => void
}

export default function ApplicantTestNextStepTab({
  hasAnyResult,
  nextStep,
  isPending,
  onNextStepChange,
  onApply,
}: ApplicantTestNextStepTabProps) {
  const { t } = useTranslation("employerApplicants")

  if (!hasAnyResult) {
    return (
      <p className="rounded-lg border border-border bg-background-card p-4 text-sm text-text-muted">
        {t("tests.notSubmittedHint")}
      </p>
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
            {nextSteps.map((step) => (
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
