import { KeyRound } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { LoadingState } from "@/components/shared/states"
import { SectionCard } from "@/components/shared/cards/SectionCard"

import { useAdminUserLoginHistory } from "../hooks/useAdminUserRelated"

export default function AdminUserLoginHistoryPanel({ userId }: { userId?: string }) {
  const { t, i18n } = useTranslation("adminUsers")
  const query = useAdminUserLoginHistory(userId)
  const logins = query.data?.items ?? []
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
    <SectionCard icon={KeyRound} title={t("security.loginHistory")}>
      {query.isPending ? (
        <LoadingState size="sm" />
      ) : logins.length ? (
        <div className="space-y-3">
          {logins.map((login) => (
            <article
              key={login.id}
              className="rounded-lg border border-border bg-background-secondary/60 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-text-primary">
                  {[login.device_name, login.platform].filter(Boolean).join(" · ") ||
                    login.user_agent ||
                    t("fallbacks.unknown")}
                </p>
                <StatusBadge
                  status={login.success === false ? "suspended" : "active"}
                  label={login.success === false ? t("security.loginFailed") : t("statuses.active")}
                  variant="soft"
                />
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {login.ip_address || t("fallbacks.unknown")}
              </p>
              <p className="mt-1 text-xs text-text-muted">{date(login.logged_in_at)}</p>
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
