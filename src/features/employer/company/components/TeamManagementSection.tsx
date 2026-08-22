import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Copy, MailPlus, Users } from "lucide-react"

import { SectionCard } from "@/components/shared/cards/SectionCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEmployerTeam } from "../hooks/useEmployerTeam"
import { ROUTES } from "@/config"
import { Button } from "@/components/ui/button"
import { showSuccessToast } from "@/lib/toast"
import InvitationForm from "./InvitationForm"
import InvitationList from "./InvitationList"
import TeamMemberList from "./TeamMemberList"

export default function TeamManagementSection() {
  const { t } = useTranslation(["employerCompany", "common"])
  const team = useEmployerTeam()
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <>
      <SectionCard icon={Users} title={t("team.title")}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-text-secondary">{t("team.description")}</p>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            disabled={team.createInvitationMutation.isPending}
          >
            <MailPlus className="h-4 w-4" />
            {t("team.inviteButton")}
          </button>
        </div>
        {team.lastInvitationToken && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {t("common:teamManagement.invitationLinkCreated")}
                </p>
                <p className="break-all text-sm text-text-secondary">
                  {window.location.origin}
                  {ROUTES.public.companyInvitation(team.lastInvitationToken)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}${ROUTES.public.companyInvitation(team.lastInvitationToken!)}`,
                    )
                    showSuccessToast(t("common:teamManagement.invitationLinkCopied"))
                  }}
                >
                  <Copy className="h-4 w-4" />
                  {t("common:teamManagement.copy")}
                </Button>
                <Button size="sm" variant="ghost" onClick={team.clearLastInvitationToken}>
                  {t("common:teamManagement.dismiss")}
                </Button>
              </div>
            </div>
          </div>
        )}
        <Tabs defaultValue="members">
          <TabsList className="mb-4">
            <TabsTrigger value="members">{t("team.tabs.members")}</TabsTrigger>
            <TabsTrigger value="invitations">{t("team.tabs.invitations")}</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <TeamMemberList
              members={team.members}
              isLoading={team.isMembersLoading}
              isUpdatingRole={team.updateRoleMutation.isPending}
              isUpdatingStatus={team.updateStatusMutation.isPending}
              isRemoving={team.removeMemberMutation.isPending}
              isTransferring={team.transferOwnershipMutation.isPending}
              onUpdateRole={async (userId, role) =>
                await team.updateRoleMutation.mutateAsync({ userId, input: { company_role: role } })
              }
              onUpdateStatus={async (userId, status) =>
                await team.updateStatusMutation.mutateAsync({
                  userId,
                  input: { membership_status: status === "suspended" ? "suspended" : "active" },
                })
              }
              onRemove={async (userId) => await team.removeMemberMutation.mutateAsync(userId)}
              onTransferOwnership={async (userId) =>
                await team.transferOwnershipMutation.mutateAsync({
                  new_owner_user_id: userId,
                  previous_owner_role: "company_admin",
                })
              }
            />
          </TabsContent>
          <TabsContent value="invitations">
            <InvitationList
              invitations={team.invitations}
              isLoading={team.isInvitationsLoading}
              isResending={team.resendInvitationMutation.isPending}
              isRevoking={team.revokeInvitationMutation.isPending}
              onResend={(id) => team.resendInvitationMutation.mutate(id)}
              onRevoke={(id) => team.revokeInvitationMutation.mutate(id)}
            />
          </TabsContent>
        </Tabs>
      </SectionCard>
      <InvitationForm
        open={inviteOpen}
        isPending={team.createInvitationMutation.isPending}
        onOpenChange={setInviteOpen}
        onSubmit={async (input) => {
          await team.createInvitationMutation.mutateAsync(input)
          setInviteOpen(false)
        }}
      />
    </>
  )
}
