import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MailPlus, MoreVertical, ShieldCheck, UserRound } from "lucide-react"

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

export default function CompanyMemberList({ companyId }: { companyId: string | number }) {
  const { t } = useTranslation("adminCompanies")
  const { members, isLoading, inviteMutation, roleMutation } = useAdminCompanyMembers(
    String(companyId),
  )
  const [inviteOpen, setInviteOpen] = useState(false)
  const [roleMember, setRoleMember] = useState<AdminCompanyMember | null>(null)

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

      <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
        {members.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-text-muted">{t("members.empty")}</p>
        ) : (
          members.map((member) => {
            const role = keyOf(member.role, "member")
            return (
              <div key={member.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {member.name}
                    {member.is_owner ? (
                      <span className="ml-2 text-xs font-normal text-text-muted">
                        {t("members.owner")}
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-text-muted">{member.email}</p>
                </div>
                <StatusBadge status={member.role} variant="soft" size="sm" />
                <StatusBadge status={member.status} variant="soft" size="sm" />
                {role !== "owner" && (
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )
          })
        )}
      </div>

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
