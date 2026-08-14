import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { employerTeamService } from "../services/employerTeam.service"
import type {
  CompanyInvitationInput,
  MemberRoleInput,
  MemberStatusInput,
  TransferOwnershipInput,
} from "../types/employerTeam.types"

export const employerTeamKey = ["employer", "team"] as const

export function useEmployerTeam() {
  const { t } = useTranslation("employerCompany")
  const client = useQueryClient()

  const membersQuery = useQuery({
    queryKey: [...employerTeamKey, "members"],
    queryFn: employerTeamService.listMembers,
  })

  const invitationsQuery = useQuery({
    queryKey: [...employerTeamKey, "invitations"],
    queryFn: employerTeamService.listInvitations,
  })

  const invalidate = () => {
    void client.invalidateQueries({ queryKey: employerTeamKey })
  }

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, input }: { userId: string | number; input: MemberRoleInput }) =>
      employerTeamService.updateMemberRole(userId, input),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.roleUpdated", { defaultValue: "Member role updated" }))
    },
    onError: (error) => showErrorToast(t("team.toasts.error", { defaultValue: "An error occurred" })),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, input }: { userId: string | number; input: MemberStatusInput }) =>
      employerTeamService.updateMemberStatus(userId, input),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.statusUpdated", { defaultValue: "Member status updated" }))
    },
    onError: (error) => showErrorToast(t("team.toasts.error", { defaultValue: "An error occurred" })),
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string | number) => employerTeamService.removeMember(userId),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.memberRemoved", { defaultValue: "Member removed" }))
    },
    onError: (error) => showErrorToast(t("team.toasts.error", { defaultValue: "An error occurred" })),
  })

  const createInvitationMutation = useMutation({
    mutationFn: (input: CompanyInvitationInput) => employerTeamService.createInvitation(input),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.invitationSent", { defaultValue: "Invitation sent" }))
    },
    onError: (error) => showErrorToast(t("team.toasts.error", { defaultValue: "An error occurred" })),
  })

  const resendInvitationMutation = useMutation({
    mutationFn: (invitationId: string | number) =>
      employerTeamService.resendInvitation(invitationId),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.invitationResent", { defaultValue: "Invitation resent" }))
    },
    onError: (error) => showErrorToast(t("team.toasts.error", { defaultValue: "An error occurred" })),
  })

  const revokeInvitationMutation = useMutation({
    mutationFn: (invitationId: string | number) =>
      employerTeamService.revokeInvitation(invitationId),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.invitationRevoked", { defaultValue: "Invitation revoked" }))
    },
    onError: (error) => showErrorToast(t("team.toasts.error", { defaultValue: "An error occurred" })),
  })

  const transferOwnershipMutation = useMutation({
    mutationFn: (input: TransferOwnershipInput) => employerTeamService.transferOwnership(input),
    onSuccess: () => {
      invalidate()
      showSuccessToast(
        t("team.toasts.ownershipTransferred", { defaultValue: "Ownership transferred" }),
      )
    },
    onError: (error) => showErrorToast(t("team.toasts.error", { defaultValue: "An error occurred" })),
  })

  return {
    members: membersQuery.data ?? [],
    isMembersLoading: membersQuery.isLoading,
    invitations: invitationsQuery.data ?? [],
    isInvitationsLoading: invitationsQuery.isLoading,
    refetch: () => {
      void membersQuery.refetch()
      void invitationsQuery.refetch()
    },
    updateRoleMutation,
    updateStatusMutation,
    removeMemberMutation,
    createInvitationMutation,
    resendInvitationMutation,
    revokeInvitationMutation,
    transferOwnershipMutation,
  }
}
