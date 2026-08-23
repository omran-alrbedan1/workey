import { Fragment } from "react"
import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { TEST_FORM_STEPS, TEST_FORM_TOTAL_STEPS } from "../../utils/employerTestForm"

export default function EmployerTestStepIndicator({
  currentStep,
  onStepSelect,
}: {
  currentStep: number
  onStepSelect: (step: number) => void
}) {
  const { t } = useTranslation("employerTests")

  return (
    <div className="sm:col-span-2 mb-2">
      <div className="mx-auto flex max-w-2xl items-start justify-between gap-1">
        {TEST_FORM_STEPS.map((step, index) => {
          const number = index + 1
          const isDone = number < currentStep
          const isActive = number === currentStep

          return (
            <Fragment key={step.labelKey}>
              <button
                type="button"
                onClick={() => onStepSelect(number)}
                disabled={number >= currentStep}
                className="flex flex-col items-center gap-1.5 focus-visible:outline-none disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full font-medium transition-all",
                    isActive && "bg-primary text-white",
                    isDone && "bg-primary/70 text-white",
                    !isActive && !isDone && "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="h-5 w-5" /> : number}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium sm:text-sm",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t(step.labelKey)}
                </span>
              </button>
              {index < TEST_FORM_TOTAL_STEPS - 1 && (
                <div
                  className={cn(
                    "mt-5 h-0.5 flex-1 transition-all",
                    number < currentStep ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
