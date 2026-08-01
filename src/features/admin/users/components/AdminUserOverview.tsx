import {
  Building2,
  CalendarDays,
  Clock3,
  Globe2,
  Hash,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { DetailItem, SectionCard } from "@/components/shared/cards/SectionCard"

import type { AdminUserDetails } from "../types/adminUsers.types"

export default function AdminUserOverview({ user }: { user: AdminUserDetails }) {
  const { t, i18n } = useTranslation("adminUsers")
  const value = (input?: string | number | null) =>
    input === undefined || input === null || input === ""
      ? t("fallbacks.notAvailable")
      : String(input)
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
  const location = [user.city, user.country].filter(Boolean).join(", ")

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard icon={UserRound} title={t("overview.profileTitle")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <DetailItem
            icon={<UserRound className="h-4 w-4" />}
            label={t("overview.fullName")}
            value={value(user.name)}
          />
          <DetailItem
            icon={<Mail className="h-4 w-4" />}
            label={t("overview.email")}
            value={value(user.email)}
          />
          <DetailItem
            icon={<Phone className="h-4 w-4" />}
            label={t("overview.phone")}
            value={value(user.phone)}
          />
          <DetailItem
            icon={<CalendarDays className="h-4 w-4" />}
            label={t("overview.dateOfBirth")}
            value={value(user.date_of_birth)}
          />
          <DetailItem
            icon={<UserRound className="h-4 w-4" />}
            label={t("overview.gender")}
            value={value(user.gender)}
          />
          <DetailItem
            icon={<MapPin className="h-4 w-4" />}
            label={t("overview.location")}
            value={value(location)}
          />
          <DetailItem
            icon={<Globe2 className="h-4 w-4" />}
            label={t("overview.address")}
            value={value(user.address)}
          />
          <DetailItem
            icon={<Languages className="h-4 w-4" />}
            label={t("overview.locale")}
            value={value(user.locale)}
          />
          <DetailItem
            icon={<Clock3 className="h-4 w-4" />}
            label={t("overview.timezone")}
            value={value(user.timezone)}
          />
          <DetailItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label={t("overview.profileCompletion")}
            value={user.profile_completion == null ? value(null) : `${user.profile_completion}%`}
          />
        </div>
        <div className="mt-6 rounded-lg border border-dashed border-border bg-background-secondary/60 p-4">
          <p className="text-xs font-medium uppercase text-text-muted">{t("overview.bio")}</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{value(user.bio)}</p>
        </div>
      </SectionCard>

      <SectionCard icon={ShieldCheck} title={t("overview.accountTitle")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <DetailItem
            icon={<Hash className="h-4 w-4" />}
            label={t("overview.userId")}
            value={String(user.id)}
          />
          <DetailItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label={t("overview.role")}
            value={t(`roles.${user.role}`, { defaultValue: user.role })}
          />
          <DetailItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label={t("overview.status")}
            value={value(user.status)}
          />
          <DetailItem
            icon={<Building2 className="h-4 w-4" />}
            label={t("overview.company")}
            value={value(user.company?.name)}
          />
          <DetailItem
            icon={<CalendarDays className="h-4 w-4" />}
            label={t("overview.createdAt")}
            value={date(user.created_at)}
          />
          <DetailItem
            icon={<Clock3 className="h-4 w-4" />}
            label={t("overview.updatedAt")}
            value={date(user.updated_at)}
          />
          <DetailItem
            icon={<Clock3 className="h-4 w-4" />}
            label={t("overview.lastActive")}
            value={date(user.last_active_at)}
          />
          <DetailItem
            icon={<CalendarDays className="h-4 w-4" />}
            label={t("overview.deletedAt")}
            value={date(user.deleted_at)}
          />
        </div>
        {user.suspension_reason ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            <p className="font-semibold">{t("overview.suspensionReason")}</p>
            <p className="mt-1">{user.suspension_reason}</p>
          </div>
        ) : null}
      </SectionCard>
    </div>
  )
}
