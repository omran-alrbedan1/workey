import { MonitorSmartphone } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { LoadingState } from "@/components/shared/states"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import { useAdminUserSessions } from "../hooks/useAdminUserRelated"

export default function AdminUserActiveSessionsPanel({ userId }: { userId?: string }) {
  const { t, i18n } = useTranslation("adminUsers")
  const query = useAdminUserSessions(userId)
  const sessions = query.data?.items ?? []
  const date = (input?: string | null) => {
    if (!input) return t("fallbacks.noDate")
    const parsed = new Date(input)
    return Number.isNaN(parsed.getTime())
      ? input
      : new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(parsed)
  }

  return (
    <SectionCard icon={MonitorSmartphone} title={t("security.sessions")}>
      {query.isPending ? (
        <LoadingState size="sm" />
      ) : sessions.length ? (
        <div className="space-y-3">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-lg border border-border bg-background-secondary/60 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-primary">
                  {[session.device_name, session.platform].filter(Boolean).join(" · ") ||
                    session.name ||
                    t("fallbacks.unknown")}
                </p>
                {session.is_current ? <StatusBadge status="active" variant="soft" /> : null}
              </div>
              {session.is_current ? (
                <p className="mt-1 text-xs font-medium text-primary">
                  {t("security.currentSession")}
                </p>
              ) : null}
              <p className="mt-2 break-all text-sm text-text-secondary">
                {session.user_agent || session.ip_address || t("fallbacks.unknown")}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {t("security.sessionMeta", {
                  ip: session.ip_address || t("fallbacks.unknown"),
                  date: date(session.last_used_at),
                })}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
          {t("security.sessionsEmpty")}
        </p>
      )}
    </SectionCard>
  )
}
