import {
  Building2,
  CalendarDays,
  Globe2,
  Hash,
  Mail,
  MailCheck,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { DetailItem, SectionCard } from "@/components/shared/cards/SectionCard"
import { keyOf, valueOf, type KeyValueField } from "@/lib/keyValue"

import type { AdminUserRecord } from "../types/adminUsers.types"

export default function AdminUserOverview({ user }: { user: AdminUserRecord }) {
  const { t, i18n } = useTranslation("adminUsers")
  const value = (input?: KeyValueField) =>
    input === undefined || input === null || input === ""
      ? t("fallbacks.notAvailable")
      : valueOf(input)
  const date = (input?: string | null) => {
    if (!input) return t("fallbacks.noDate")
    const parsed = new Date(input)
    return Number.isNaN(parsed.getTime())
      ? input
      : new Intl.DateTimeFormat(i18n.resolvedLanguage, {
          dateStyle: "medium",
        }).format(parsed)
  }

  const seeker = user.job_seeker_profile ?? null
  const employer = user.employer_profile ?? null
  const phone = seeker?.phone || employer?.phone || null
  const location = [seeker?.location, seeker?.city?.name].filter(Boolean).join(", ") || null
  const bio = seeker?.summary || employer?.bio || null
  const headline = seeker?.headline || employer?.job_title || null

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
            icon={<MapPin className="h-4 w-4" />}
            label={t("overview.phone")}
            value={value(phone)}
          />
          <DetailItem
            icon={<UserRound className="h-4 w-4" />}
            label={t("overview.headline")}
            value={value(headline)}
          />
          <DetailItem
            icon={<Globe2 className="h-4 w-4" />}
            label={t("overview.location")}
            value={value(location)}
          />
          <DetailItem
            icon={<CalendarDays className="h-4 w-4" />}
            label={t("overview.createdAt")}
            value={date(user.created_at)}
          />
        </div>
        <div className="mt-6 rounded-lg border border-dashed border-border bg-background-secondary/60 p-4">
          <p className="text-xs font-medium uppercase text-text-muted">{t("overview.bio")}</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{value(bio)}</p>
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
            value={t(`roles.${keyOf(user.role)}`, { defaultValue: keyOf(user.role) })}
          />
          <DetailItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label={t("overview.status")}
            value={value(user.status)}
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
          <DetailItem
            icon={<Building2 className="h-4 w-4" />}
            label={t("overview.company")}
            value={value(employer?.company?.name)}
          />
          {employer ? (
            <>
              <DetailItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label={t("overview.membershipStatus")}
                value={value(employer.membership_status)}
              />
              <DetailItem
                icon={<ShieldCheck className="h-4 w-4" />}
                label={t("overview.companyRole")}
                value={value(employer.company_role)}
              />
              <DetailItem
                icon={<CalendarDays className="h-4 w-4" />}
                label={t("details.memberSince")}
                value={date(employer.joined_at)}
              />
            </>
          ) : null}
        </div>
      </SectionCard>
    </div>
  )
}
