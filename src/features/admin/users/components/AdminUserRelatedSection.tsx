import { BriefcaseBusiness, CalendarCheck, ClipboardList, FileCheck2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { LoadingState } from "@/components/shared/states"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserRelatedItemView } from "../utils/adminUserRelated"

export type AdminUserRelatedSectionKey = "applications" | "jobs" | "interviews" | "tests"

const SECTION_ICONS = {
  applications: ClipboardList,
  jobs: BriefcaseBusiness,
  interviews: CalendarCheck,
  tests: FileCheck2,
} as const

interface AdminUserRelatedSectionProps {
  section: AdminUserRelatedSectionKey
  items?: AdminUserRelatedItemView[]
  isLoading?: boolean
}

export default function AdminUserRelatedSection({
  section,
  items,
  isLoading = false,
}: AdminUserRelatedSectionProps) {
  const { t, i18n } = useTranslation("adminUsers")
  const icon = SECTION_ICONS[section]
  const date = (input?: string | null) => {
    if (!input) return t("fallbacks.noDate")
    const parsed = new Date(input)
    return Number.isNaN(parsed.getTime())
      ? input
      : new Intl.DateTimeFormat(i18n.resolvedLanguage).format(parsed)
  }

  return (
    <SectionCard icon={icon} title={t(`related.${section}`)}>
      {isLoading ? (
        <LoadingState />
      ) : items?.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-border bg-background-secondary/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-text-primary">{item.title}</p>
                  {item.subtitle ? (
                    <p className="mt-1 text-sm text-text-secondary">{item.subtitle}</p>
                  ) : null}
                </div>
                {item.status ? <StatusBadge status={item.status} variant="soft" /> : null}
              </div>
              {item.date ? (
                <p className="mt-2 text-xs text-text-muted">
                  {t("related.itemDate", { date: date(item.date) })}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
          {t("related.empty", { type: t(`related.${section}`).toLowerCase() })}
        </p>
      )}
    </SectionCard>
  )
}
