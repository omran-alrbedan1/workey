import { MonitorSmartphone } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserDetails } from "../types/adminUsers.types"

export default function AdminUserActiveSessionsPanel({ user }: { user: AdminUserDetails }) {
  const { t, i18n } = useTranslation("adminUsers")
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
  const sessions = user.active_sessions

  return (
    <SectionCard icon={MonitorSmartphone} title={t("security.sessions")}>
      {sessions === undefined ? (
        <UnavailableNotice />
      ) : sessions.length ? (
        <div className="space-y-3">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-lg border border-border bg-background-secondary/60 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-primary">
                  {session.device || t("fallbacks.unknown")}
                </p>
                {session.current ? <StatusBadge status="active" variant="soft" /> : null}
              </div>
              {session.current ? (
                <p className="mt-1 text-xs font-medium text-primary">
                  {t("security.currentSession")}
                </p>
              ) : null}
              <p className="mt-2 text-sm text-text-secondary">
                {session.location || t("fallbacks.unknown")}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {t("security.sessionMeta", {
                  ip: session.ip_address || t("fallbacks.unknown"),
                  date: date(session.last_active_at),
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

function UnavailableNotice() {
  const { t } = useTranslation("adminUsers")
  return (
    <p className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-4 text-sm text-text-secondary">
      {t("details.backendCoverageWarning")}
    </p>
  )
}
