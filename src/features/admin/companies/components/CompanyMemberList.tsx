import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Crown,
  Clock,
  Copy,
  MailPlus,
  MoreVertical,
  ShieldCheck,
  Trash2,
  UserRound,
  UserX,
} from "lucide-react"

import { StatusBadge } from "@/components/shared/badges"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { keyOf } from "@/lib/keyValue"
import type { AdminCompanyMember } from "../types/adminCompanyMembers.types"
import { useAdminCompanyMembers } from "../hooks/useAdminCompanyMembers"
import CompanyInvitationDialog from "./CompanyInvitationDialog"
import CompanyMemberRoleDialog from "./CompanyMemberRoleDialog"
import { ROUTES } from "@/config"
import { showSuccessToast } from "@/lib/toast"

const OWNER_ROLE_KEYS = new Set(["owner", "company_owner"])

function isOwner(member: AdminCompanyMember) {
  return member.is_owner === true || OWNER_ROLE_KEYS.has(keyOf(member.role))
}

export default function CompanyMemberList({ companyId }: { companyId: string | number }) {
  const { t } = useTranslation("adminCompanies")
  const {
    members,
    invitations,
    isLoading,
    inviteMutation,
    roleMutation,
    statusMutation,
    removeMutation,
    transferOwnershipMutation,
    lastInvitationToken,
    clearLastInvitationToken,
  } = useAdminCompanyMembers(String(companyId))
  const [inviteOpen, setInviteOpen] = useState(false)
  const [roleMember, setRoleMember] = useState<AdminCompanyMember | null>(null)
  const owner = members.find(isOwner)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-text-secondary">{t("members.description")}</p>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <MailPlus className="h-4 w-4" />
          {t("members.inviteButton")}
        </Button>
      </div>

      {lastInvitationToken && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">{t("members.invitationBanner.title")}</p>
              <p className="break-all text-sm text-text-secondary">
                {window.location.origin}
                {ROUTES.public.companyInvitation(lastInvitationToken)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}${ROUTES.public.companyInvitation(lastInvitationToken)}`,
                  )
                  showSuccessToast(t("members.invitationBanner.copied"))
                }}
              >
                <Copy className="h-4 w-4" />
                {t("members.invitationBanner.copy")}
              </Button>
              <Button size="sm" variant="ghost" onClick={clearLastInvitationToken}>
                {t("members.invitationBanner.dismiss")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 overflow-hidden rounded-xl">
        {members.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-text-muted">{t("members.empty")}</p>
        ) : (
          members.map((member) => {
            const role = keyOf(member.role, "member")
            const status = keyOf(member.status, "active")
            return (
              <div key={member.id} className="flex items-center gap-4 rounded-xl border border-border/60 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {member.name}
                    {isOwner(member) ? (
                      <span className="ml-2 text-xs font-normal text-text-muted">
                        {t("members.owner")}
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-text-muted">{member.email}</p>
                </div>
                <StatusBadge status={member.role} variant="soft" size="sm" />
                <StatusBadge status={member.status} variant="soft" size="sm" />
                {!isOwner(member) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setRoleMember(member)}>
                        <ShieldCheck className="h-4 w-4" />
                        {t("members.actions.changeRole")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          statusMutation.mutate({
                            userId: member.id,
                            input: {
                              membership_status: status === "suspended" ? "active" : "suspended",
                            },
                          })
                        }
                      >
                        <UserX className="h-4 w-4" />
                        {status === "suspended" ? t("members.actions.activate") : t("members.actions.suspend")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (
                            window.confirm(
                              t("members.confirmations.transferOwnership", { name: member.name }),
                            )
                          ) {
                            transferOwnershipMutation.mutate({
                              new_owner_user_id: member.id,
                              current_owner_user_id: owner?.id,
                              previous_owner_role: "company_admin",
                            })
                          }
                        }}
                      >
                        <Crown className="h-4 w-4" />
                        {t("members.actions.transferOwnership")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-rose-600"
                        onClick={() => {
                          if (window.confirm(t("members.confirmations.removeMember", { name: member.name }))) {
                            removeMutation.mutate(member.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("members.actions.removeMember")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )
          })
        )}
      </div>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{t("members.invitations.title")}</h3>
          <p className="text-xs text-text-muted">{t("members.invitations.description")}</p>
        </div>
      <div className="space-y-2 overflow-hidden rounded-xl">
          {invitations.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-text-muted">{t("members.invitations.empty")}</p>
          ) : (
            invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center gap-4 rounded-xl border border-border/60 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MailPlus className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {invitation.email}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-text-muted">
                    <Clock className="h-3 w-3" />
                    {invitation.expires_at
                      ? t("members.invitations.expires", { date: new Date(invitation.expires_at).toLocaleDateString() })
                      : t("members.invitations.noExpiry")}
                  </p>
                </div>
                <StatusBadge status={invitation.company_role} variant="soft" size="sm" />
                <StatusBadge status={invitation.status} variant="soft" size="sm" />
              </div>
            ))
          )}
        </div>
      </section>

      <CompanyInvitationDialog
        open={inviteOpen}
        isPending={inviteMutation.isPending}
        onOpenChange={setInviteOpen}
        onSubmit={(input) => {
          inviteMutation.mutate(input)
          setInviteOpen(false)
        }}
      />
      <CompanyMemberRoleDialog
        open={roleMember !== null}
        memberName={roleMember?.name ?? ""}
        currentRole={keyOf(roleMember?.role, "member")}
        isPending={roleMutation.isPending}
        onOpenChange={(open) => !open && setRoleMember(null)}
        onSubmit={(input) => {
          if (roleMember) {
            roleMutation.mutate({ userId: roleMember.id, input })
          }
          setRoleMember(null)
        }}
      />
    </>
  )
}
