import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { WIZARD_STEPS } from "./wizardConfig"

export default function WizardStepIndicator({
  currentStep,
  isPending,
  onGoToStep,
}: {
  currentStep: number
  isPending: boolean
  onGoToStep: (index: number) => void
}) {
  const { t } = useTranslation("employerJobs")

  return (
    <nav
      aria-label={t("wizard.stepOf", { current: currentStep + 1, total: WIZARD_STEPS.length })}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 rounded-lg border border-border bg-background-card p-4 shadow-card">
        {WIZARD_STEPS.map((step, index) => (
          <li key={step.id} className="flex items-center gap-2">
            <button
              type="button"
              disabled={index > currentStep || isPending}
              onClick={() => onGoToStep(index)}
              className="flex items-center gap-2 rounded-md px-1 py-0.5 disabled:cursor-not-allowed"
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  index < currentStep && "border-primary bg-primary text-white",
                  index === currentStep && "border-primary bg-background text-primary",
                  index > currentStep && "border-border bg-background text-text-muted",
                )}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm sm:block",
                  index === currentStep ? "font-semibold text-text-primary" : "text-text-muted",
                )}
              >
                {t(step.labelKey)}
              </span>
            </button>
            {index < WIZARD_STEPS.length - 1 && <span className="hidden h-px w-8 bg-border sm:block" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
