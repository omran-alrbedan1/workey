import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MoreVertical, ShieldCheck, Trash2, UserRound } from "lucide-react"

import { StatusBadge } from "@/components/shared/badges"
import EmptyState from "@/components/shared/states/EmptyState"
import { DeleteModal } from "@/components/shared/modals"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { keyOf } from "@/lib/keyValue"
import type { CompanyMember } from "../types/employerTeam.types"
import MemberRoleDialog from "./MemberRoleDialog"
import MemberStatusDialog from "./MemberStatusDialog"
import TransferOwnershipDialog from "./TransferOwnershipDialog"

const DEFAULT_COMPANY_ROLE = "reviewer"

export default function TeamMemberList({
  members,
  isLoading,
  isUpdatingRole,
  isUpdatingStatus,
  isRemoving,
  isTransferring,
  onUpdateRole,
  onUpdateStatus,
  onRemove,
  onTransferOwnership,
}: {
  members: CompanyMember[]
  isLoading: boolean
  isUpdatingRole: boolean
  isUpdatingStatus: boolean
  isRemoving: boolean
  isTransferring: boolean
  onUpdateRole: (userId: string | number, role: string) => Promise<unknown>
  onUpdateStatus: (userId: string | number, status: string) => Promise<unknown>
  onRemove: (userId: string | number) => Promise<unknown>
  onTransferOwnership: (userId: string | number) => Promise<unknown>
}) {
  const { t } = useTranslation("employerCompany")
  const [roleMember, setRoleMember] = useState<CompanyMember | null>(null)
  const [statusMember, setStatusMember] = useState<CompanyMember | null>(null)
  const [transferMember, setTransferMember] = useState<CompanyMember | null>(null)
  const [removeMember, setRemoveMember] = useState<CompanyMember | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  const transferableMembers = members.filter(
    (member) => member.id !== undefined && member.can_transfer_ownership === true,
  )

  return (
    <>
      <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
        {members.length === 0 ? (
          <EmptyState
            title={t("team.membersEmpty")}
            description={t("team.membersEmpty")}
            icon={UserRound}
            className="rounded-xl border border-border/60 py-10"
          />
        ) : (
          members.map((member) => {
            const role = keyOf(member.company_role ?? member.role, DEFAULT_COMPANY_ROLE)
            const canChangeRole = member.can_update_role !== false
            const canChangeStatus = member.can_update_status !== false
            const canTransferOwnership = member.can_transfer_ownership === true
            const canRemove = member.can_remove !== false && !member.is_current_user && role !== "owner"
            const hasActions = canChangeRole || canChangeStatus || canTransferOwnership || canRemove

            return (
              <div key={member.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {member.name}
                    {member.is_current_user ? (
                      <span className="ms-2 text-xs font-normal text-text-muted">
                        {t("team.currentUser")}
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-text-muted">{member.email}</p>
                </div>
                <StatusBadge status={member.company_role ?? member.role} variant="soft" size="sm" />
                <StatusBadge status={member.membership_status ?? member.status} variant="soft" size="sm" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!hasActions}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canChangeRole && (
                      <DropdownMenuItem onClick={() => setRoleMember(member)}>
                        <ShieldCheck className="h-4 w-4" />
                        {t("team.actions.changeRole")}
                      </DropdownMenuItem>
                    )}
                    {canChangeStatus && (
                      <DropdownMenuItem onClick={() => setStatusMember(member)}>
                        <ShieldCheck className="h-4 w-4" />
                        {t("team.actions.changeStatus")}
                      </DropdownMenuItem>
                    )}
                    {canTransferOwnership && (
                      <DropdownMenuItem onClick={() => setTransferMember(member)}>
                        <ShieldCheck className="h-4 w-4" />
                        {t("team.actions.transferOwnership")}
                      </DropdownMenuItem>
                    )}
                    {canRemove && (
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-700"
                        onClick={() => setRemoveMember(member)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("team.actions.remove")}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })
        )}
      </div>

      <MemberRoleDialog
        open={roleMember !== null}
        memberName={roleMember?.name ?? ""}
        currentRole={keyOf(roleMember?.company_role ?? roleMember?.role, DEFAULT_COMPANY_ROLE)}
        isPending={isUpdatingRole}
        onOpenChange={(open) => !open && setRoleMember(null)}
        onSubmit={async (input) => {
          if (roleMember) await onUpdateRole(roleMember.id, input.company_role)
          setRoleMember(null)
        }}
      />
      <MemberStatusDialog
        open={statusMember !== null}
        memberName={statusMember?.name ?? ""}
        currentStatus={keyOf(statusMember?.membership_status ?? statusMember?.status, "active")}
        isPending={isUpdatingStatus}
        onOpenChange={(open) => !open && setStatusMember(null)}
        onSubmit={async (input) => {
          if (statusMember) await onUpdateStatus(statusMember.id, input.membership_status)
          setStatusMember(null)
        }}
      />
      <TransferOwnershipDialog
        open={transferMember !== null}
        members={transferableMembers}
        initialUserId={transferMember?.id}
        isPending={isTransferring}
        onOpenChange={(open) => {
          if (!open) setTransferMember(null)
        }}
        onSubmit={async (userId) => {
          await onTransferOwnership(userId)
          setTransferMember(null)
        }}
      />
      <DeleteModal
        open={removeMember !== null}
        name={removeMember?.name ?? t("team.member")}
        loading={isRemoving}
        onClose={() => setRemoveMember(null)}
        onConfirm={async () => {
          if (removeMember) await onRemove(removeMember.id)
          setRemoveMember(null)
        }}
      />
    </>
  )
}
