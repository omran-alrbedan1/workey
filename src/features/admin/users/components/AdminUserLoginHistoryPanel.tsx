import { KeyRound } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserDetails } from "../types/adminUsers.types"

export default function AdminUserLoginHistoryPanel({ user }: { user: AdminUserDetails }) {
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
  const logins = user.login_history

  return (
    <SectionCard icon={KeyRound} title={t("security.loginHistory")}>
      {logins === undefined ? (
        <UnavailableNotice />
      ) : logins.length ? (
        <div className="space-y-3">
          {logins.map((login) => (
            <article
              key={login.id}
              className="rounded-lg border border-border bg-background-secondary/60 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-primary">
                  {login.device || login.user_agent || t("fallbacks.unknown")}
                </p>
                {login.status ? <StatusBadge status={login.status} variant="soft" /> : null}
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {login.location || t("fallbacks.unknown")} ·{" "}
                {login.ip_address || t("fallbacks.unknown")}
              </p>
              <p className="mt-1 text-xs text-text-muted">{date(login.created_at)}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
          {t("security.loginEmpty")}
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
