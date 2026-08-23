import { useTranslation } from "react-i18next"
import { Mail, RefreshCw, XCircle } from "lucide-react"

import { StatusBadge } from "@/components/shared/badges"
import EmptyState from "@/components/shared/states/EmptyState"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { keyOf } from "@/lib/keyValue"
import type { CompanyInvitation } from "../types/employerTeam.types"

export default function InvitationList({
  invitations,
  isLoading,
  isResending,
  isRevoking,
  onResend,
  onRevoke,
}: {
  invitations: CompanyInvitation[]
  isLoading: boolean
  isResending: boolean
  isRevoking: boolean
  onResend: (invitationId: string | number) => void
  onRevoke: (invitationId: string | number) => void
}) {
  const { t } = useTranslation("employerCompany")

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  return (
    <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
      {invitations.length === 0 ? (
        <EmptyState
          title={t("team.invitationsEmpty")}
          description={t("team.invitationsEmpty")}
          icon={Mail}
          className="rounded-xl border border-border/60 py-10"
        />
      ) : (
        invitations.map((invitation) => {
          const status = keyOf(invitation.status, "pending")
          const role = keyOf(invitation.company_role ?? invitation.role, "reviewer")
          return (
            <div key={invitation.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {invitation.email}
                </p>
                <p className="truncate text-xs text-text-muted">
                  {t("team.roleLabel", {
                    role: t(`team.roles.${role}`, { defaultValue: role }),
                  })}
                </p>
              </div>
              <StatusBadge status={invitation.status} variant="soft" size="sm" />
              {status === "pending" && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isResending}
                    onClick={() => onResend(invitation.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    disabled={isRevoking}
                    onClick={() => onRevoke(invitation.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
