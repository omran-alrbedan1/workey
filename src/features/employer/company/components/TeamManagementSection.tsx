import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MailPlus, Users } from "lucide-react"

import { SectionCard } from "@/components/shared/cards/SectionCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEmployerTeam } from "../hooks/useEmployerTeam"
import InvitationForm from "./InvitationForm"
import InvitationList from "./InvitationList"
import TeamMemberList from "./TeamMemberList"

export default function TeamManagementSection() {
  const { t } = useTranslation("employerCompany")
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
              onUpdateRole={(userId, role) =>
                team.updateRoleMutation.mutate({ userId, input: { role } })
              }
              onUpdateStatus={(userId, status) =>
                team.updateStatusMutation.mutate({ userId, input: { status } })
              }
              onRemove={(userId) => team.removeMemberMutation.mutate(userId)}
              onTransferOwnership={(userId) =>
                team.transferOwnershipMutation.mutate({ user_id: userId })
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
        onSubmit={(input) => {
          team.createInvitationMutation.mutate(input)
          setInviteOpen(false)
        }}
      />
    </>
  )
}
