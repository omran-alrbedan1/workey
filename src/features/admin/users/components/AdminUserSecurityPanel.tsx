import {
  KeyRound,
  LockKeyhole,
  MailCheck,
  MonitorSmartphone,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { DetailItem, SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserDetails } from "../types/adminUsers.types"

export default function AdminUserSecurityPanel({ user }: { user: AdminUserDetails }) {
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

  return (
    <div className="space-y-6">
      <SectionCard icon={ShieldCheck} title={t("security.title")}>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <DetailItem
            icon={<LockKeyhole className="h-4 w-4" />}
            label={t("security.twoFactor")}
            value={t(user.two_factor_enabled ? "security.enabled" : "security.disabled")}
          />
          <DetailItem
            icon={<MailCheck className="h-4 w-4" />}
            label={t("security.emailVerified")}
            value={t(user.email_verified_at ? "security.verified" : "security.unverified")}
          />
          <DetailItem
            icon={<TriangleAlert className="h-4 w-4" />}
            label={t("security.failedAttempts")}
            value={String(user.failed_login_attempts ?? 0)}
          />
          <DetailItem
            icon={<KeyRound className="h-4 w-4" />}
            label={t("security.passwordChanged")}
            value={date(user.password_changed_at)}
          />
          <DetailItem
            icon={<MonitorSmartphone className="h-4 w-4" />}
            label={t("security.lastLogin")}
            value={date(user.last_login_at)}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard icon={KeyRound} title={t("security.loginHistory")}>
          {user.login_history?.length ? (
            <div className="space-y-3">
              {user.login_history.map((login) => (
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

        <SectionCard icon={MonitorSmartphone} title={t("security.sessions")}>
          {user.active_sessions?.length ? (
            <div className="space-y-3">
              {user.active_sessions.map((session) => (
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
      </div>
    </div>
  )
}
