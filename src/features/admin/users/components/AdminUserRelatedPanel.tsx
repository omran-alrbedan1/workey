import { BriefcaseBusiness, CalendarCheck, ClipboardList, FileCheck2 } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserDetails, AdminUserRelatedItem } from "../types/adminUsers.types"

export default function AdminUserRelatedPanel({ user }: { user: AdminUserDetails }) {
  const { t, i18n } = useTranslation("adminUsers")
  const date = (input?: string | null) => {
    if (!input) return t("fallbacks.noDate")
    const parsed = new Date(input)
    return Number.isNaN(parsed.getTime())
      ? input
      : new Intl.DateTimeFormat(i18n.resolvedLanguage).format(parsed)
  }
  const sections: Array<{
    key: "applications" | "jobs" | "interviews" | "tests"
    icon: typeof ClipboardList
    items?: AdminUserRelatedItem[]
  }> = [
    { key: "applications", icon: ClipboardList, items: user.applications },
    { key: "jobs", icon: BriefcaseBusiness, items: user.jobs },
    { key: "interviews", icon: CalendarCheck, items: user.interviews },
    { key: "tests", icon: FileCheck2, items: user.tests },
  ]

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {sections.map((section) => (
        <SectionCard key={section.key} icon={section.icon} title={t(`related.${section.key}`)}>
          {section.items?.length ? (
            <div className="space-y-3">
              {section.items.map((item) => (
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
                  {item.created_at ? (
                    <p className="mt-2 text-xs text-text-muted">
                      {t("related.itemDate", { date: date(item.created_at) })}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
              {t("related.empty", { type: t(`related.${section.key}`).toLowerCase() })}
            </p>
          )}
        </SectionCard>
      ))}
    </div>
  )
}
