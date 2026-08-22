import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
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
  const [lastInvitationToken, setLastInvitationToken] = useState<string | null>(null)

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

  const showTeamError = (error: unknown) => {
    showErrorToast(error, t("team.toasts.error", { defaultValue: "An error occurred" }))
  }

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, input }: { userId: string | number; input: MemberRoleInput }) =>
      employerTeamService.updateMemberRole(userId, input),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.roleUpdated", { defaultValue: "Member role updated" }))
    },
    onError: showTeamError,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, input }: { userId: string | number; input: MemberStatusInput }) =>
      employerTeamService.updateMemberStatus(userId, input),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.statusUpdated", { defaultValue: "Member status updated" }))
    },
    onError: showTeamError,
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string | number) => employerTeamService.removeMember(userId),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.memberRemoved", { defaultValue: "Member removed" }))
    },
    onError: showTeamError,
  })

  const createInvitationMutation = useMutation({
    mutationFn: (input: CompanyInvitationInput) => employerTeamService.createInvitation(input),
    onSuccess: (result) => {
      if (result.token) setLastInvitationToken(result.token)
      invalidate()
      showSuccessToast(t("team.toasts.invitationSent", { defaultValue: "Invitation sent" }))
    },
    onError: showTeamError,
  })

  const resendInvitationMutation = useMutation({
    mutationFn: (invitationId: string | number) =>
      employerTeamService.resendInvitation(invitationId),
    onSuccess: (result) => {
      if (result.token) setLastInvitationToken(result.token)
      invalidate()
      showSuccessToast(t("team.toasts.invitationResent", { defaultValue: "Invitation resent" }))
    },
    onError: showTeamError,
  })

  const revokeInvitationMutation = useMutation({
    mutationFn: (invitationId: string | number) =>
      employerTeamService.revokeInvitation(invitationId),
    onSuccess: () => {
      invalidate()
      showSuccessToast(t("team.toasts.invitationRevoked", { defaultValue: "Invitation revoked" }))
    },
    onError: showTeamError,
  })

  const transferOwnershipMutation = useMutation({
    mutationFn: (input: TransferOwnershipInput) => employerTeamService.transferOwnership(input),
    onSuccess: () => {
      invalidate()
      showSuccessToast(
        t("team.toasts.ownershipTransferred", { defaultValue: "Ownership transferred" }),
      )
    },
    onError: showTeamError,
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
    lastInvitationToken,
    clearLastInvitationToken: () => setLastInvitationToken(null),
  }
}
