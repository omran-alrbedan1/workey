import { BriefcaseBusiness, Crown, Mail, ShieldCheck, UserRound } from "lucide-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import StatusBadge from "@/components/shared/badges/StatusBadge"
import { DetailItem, SectionCard } from "@/components/shared/cards/SectionCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { keyOf } from "@/lib/keyValue"

import { useAdminCompanyMembers } from "../hooks/useAdminCompanyMembers"
import type { AdminCompanyMember } from "../types/adminCompanyMembers.types"
import type { AdminCompanyDetails } from "../types/adminCompanies.types"

const OWNER_ROLE_KEYS = new Set(["owner", "company_owner"])

function isOwner(member: AdminCompanyMember) {
  return member.is_owner === true || OWNER_ROLE_KEYS.has(keyOf(member.role))
}

export default function AdminCompanyOwnershipCard({ company }: { company: AdminCompanyDetails }) {
  const { t } = useTranslation("adminCompanies")
  const [nextOwnerId, setNextOwnerId] = useState("")
  const membersQuery = useAdminCompanyMembers(String(company.id))
  const text = (value?: string | null) => value || t("fallbacks.notAvailable")

  const owner = useMemo(() => membersQuery.members.find(isOwner) ?? null, [membersQuery.members])
  const transferCandidates = membersQuery.members.filter((member) => !isOwner(member))

  const transferOwnership = async () => {
    if (!nextOwnerId || !owner) return
    await membersQuery.transferOwnershipMutation.mutateAsync({
      new_owner_user_id: nextOwnerId,
      current_owner_user_id: owner.id,
      previous_owner_role: "company_admin",
    })
    setNextOwnerId("")
  }

  if (membersQuery.isLoading) {
    return (
      <SectionCard icon={UserRound} title={t("ownership.title")}>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard icon={UserRound} title={t("ownership.title")}>
      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background-secondary/70 p-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">{text(owner?.name)}</p>
          <p className="text-xs text-text-muted">{t("ownership.primaryAccount")}</p>
        </div>
        {owner ? <StatusBadge status={owner.status} variant="soft" /> : null}
      </div>

      {owner ? (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <DetailItem
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              label={t("ownership.ownerName")}
              value={text(owner.name)}
            />
            <DetailItem
              icon={<Mail className="h-4 w-4" />}
              label={t("ownership.ownerEmail")}
              value={text(owner.email)}
            />
            <DetailItem
              icon={<Crown className="h-4 w-4" />}
              label={t("ownership.companyRole")}
              value={<StatusBadge status={owner.role} variant="soft" size="sm" />}
            />
            <DetailItem
              icon={<ShieldCheck className="h-4 w-4" />}
              label={t("ownership.membershipStatus")}
              value={<StatusBadge status={owner.status} variant="soft" size="sm" />}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-background-secondary/50 p-4">
            <label
              htmlFor="admin-company-owner-transfer"
              className="text-sm font-semibold text-text-primary"
            >
              {t("ownership.transferTitle")}
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <select
                id="admin-company-owner-transfer"
                value={nextOwnerId}
                onChange={(event) => setNextOwnerId(event.target.value)}
                disabled={
                  transferCandidates.length === 0 ||
                  membersQuery.transferOwnershipMutation.isPending
                }
                className="h-10 flex-1 rounded-md border border-border bg-background-card px-3 text-sm text-text-primary"
              >
                <option value="">{t("ownership.transferPlaceholder")}</option>
                {transferCandidates.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.email}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                disabled={!nextOwnerId || membersQuery.transferOwnershipMutation.isPending}
                onClick={() => void transferOwnership()}
              >
                <Crown className="h-4 w-4" />
                {t("ownership.transferAction")}
              </Button>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              {transferCandidates.length
                ? t("ownership.transferHint")
                : t("ownership.transferUnavailable")}
            </p>
          </div>
        </>
      ) : (
        <p className="rounded-2xl border border-border bg-background-secondary/50 p-4 text-sm text-text-muted">
          {t("ownership.noOwner")}
        </p>
      )}
    </SectionCard>
  )
}
