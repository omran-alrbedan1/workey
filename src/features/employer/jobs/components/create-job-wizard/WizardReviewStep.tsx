import { Check, FileText, X, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WizardReadinessCheck {
  key: string
  ok: boolean
  required: boolean
}

interface WizardSummarySection {
  titleKey: string
  icon: LucideIcon
  rows: { label: string; value: string; icon: LucideIcon; multiline?: boolean }[]
}

export default function WizardReviewStep({
  t,
  readinessChecks,
  summarySections,
}: {
  t: (key: string, options?: Record<string, unknown>) => string
  readinessChecks: WizardReadinessCheck[]
  summarySections: WizardSummarySection[]
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 font-semibold text-text-primary">{t("wizard.readiness.title")}</h3>
        <p className="mb-3 text-sm text-text-muted">{t("wizard.readiness.subtitle")}</p>
        <ul className="space-y-2">
          {readinessChecks.map((check) => (
            <li key={check.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    check.ok ? "bg-green-600 text-white" : "bg-red-500 text-white",
                  )}
                >
                  {check.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </span>
                <span className="text-text-primary">{t(`wizard.readiness.items.${check.key}`)}</span>
              </span>
              <Badge variant="secondary" className="shrink-0 text-white">
                {check.required ? t("wizard.readiness.requiredTag") : t("wizard.readiness.optionalTag")}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 flex items-center gap-2.5 font-semibold text-text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </span>
          {t("wizard.summary.title")}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {summarySections.map((section) => (
            <div
              key={section.titleKey}
              className="rounded-lg border border-border bg-background p-3 shadow-sm sm:p-4"
            >
              <div className="mb-2.5 flex items-center gap-2 border-b border-border pb-2 sm:mb-3 sm:gap-2.5 sm:pb-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:h-7 sm:w-7">
                  <section.icon className="h-3.5 w-3.5" />
                </span>
                <h4 className="text-xs font-semibold text-text-primary sm:text-sm">
                  {t(section.titleKey)}
                </h4>
              </div>
              <dl className="space-y-2.5 sm:space-y-3">
                {section.rows.map((row) => (
                  <div key={row.label} className="flex items-start gap-2 sm:gap-2.5">
                    <row.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <div className="min-w-0 flex-1">
                      <dt className="text-[11px] uppercase tracking-wide text-text-muted sm:text-xs">
                        {row.label}
                      </dt>
                      <dd
                        className={cn(
                          "break-words text-xs text-text-primary sm:text-sm",
                          row.multiline
                            ? "whitespace-pre-line"
                            : "line-clamp-2 sm:line-clamp-none sm:truncate",
                        )}
                        title={row.multiline ? undefined : row.value}
                      >
                        {row.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
