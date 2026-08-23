import { Send } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ApplicationTestsNextStep({
  allowedNextSteps,
  nextStep,
  nextStepLoading,
  onNextStepChange,
  onApply,
}: {
  allowedNextSteps: { value: string; labelKey: string }[]
  nextStep: string
  nextStepLoading: boolean
  onNextStepChange: (value: string) => void
  onApply: () => Promise<void>
}) {
  const { t } = useTranslation("employerApplicants")

  if (allowedNextSteps.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="mb-3 font-semibold">{t("tests.nextStep")}</h3>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Select value={nextStep} onValueChange={onNextStepChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("tests.selectNextStep")} />
            </SelectTrigger>
            <SelectContent>
              {allowedNextSteps.map((step) => (
                <SelectItem key={step.value} value={step.value}>
                  {t(step.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button disabled={!nextStep || nextStepLoading} onClick={() => void onApply()}>
          <Send className="h-4 w-4" /> {t("tests.applyNextStep")}
        </Button>
      </div>
    </div>
  )
}
