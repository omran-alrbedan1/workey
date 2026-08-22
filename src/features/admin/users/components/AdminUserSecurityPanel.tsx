import { MailCheck, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { DetailItem, SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserRecord } from "../types/adminUsers.types"
import AdminUserActiveSessionsPanel from "./AdminUserActiveSessionsPanel"
import AdminUserLoginHistoryPanel from "./AdminUserLoginHistoryPanel"

export default function AdminUserSecurityPanel({
  user,
  userId,
}: {
  user: AdminUserRecord
  userId?: string
}) {
  const { t } = useTranslation("adminUsers")

  return (
    <div className="space-y-6">
      <SectionCard icon={ShieldCheck} title={t("security.title")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <DetailItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label={t("overview.status")}
            value={<StatusBadge status={user.status} variant="soft" />}
          />
          <DetailItem
            icon={<MailCheck className="h-4 w-4" />}
            label={t("security.emailVerified")}
            value={t(
              user.is_email_verified || user.email_verified_at
                ? "security.verified"
                : "security.unverified",
            )}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminUserLoginHistoryPanel userId={userId} />
        <AdminUserActiveSessionsPanel userId={userId} />
      </div>
    </div>
  )
}
