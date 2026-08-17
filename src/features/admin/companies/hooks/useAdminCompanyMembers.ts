import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { adminCompaniesService } from "../services/adminCompanies.service"
import type {
  AdminCompanyInvitationInput,
  AdminCompanyMemberRoleInput,
  AdminCompanyMemberStatusInput,
  AdminCompanyTransferOwnershipInput,
} from "../types/adminCompanyMembers.types"

export const adminCompanyMembersKeys = {
  members: (companyId: string | number) => ["admin", "companies", "members", String(companyId)],
  invitations: (companyId: string | number) => [
    "admin",
    "companies",
    "invitations",
    String(companyId),
  ],
}

export function useAdminCompanyMembers(companyId?: string) {
  const { t } = useTranslation("adminCompanies")
  const client = useQueryClient()
  const [lastInvitationToken, setLastInvitationToken] = useState<string | null>(null)

  const membersQuery = useQuery({
    queryKey: adminCompanyMembersKeys.members(companyId ?? "missing"),
    queryFn: () => adminCompaniesService.listMembers(companyId as string),
    enabled: Boolean(companyId),
  })
  const invitationsQuery = useQuery({
    queryKey: adminCompanyMembersKeys.invitations(companyId ?? "missing"),
    queryFn: () => adminCompaniesService.listInvitations(companyId as string),
    enabled: Boolean(companyId),
  })

  const invalidate = () => {
    if (companyId) {
      void client.invalidateQueries({ queryKey: adminCompanyMembersKeys.members(companyId) })
      void client.invalidateQueries({ queryKey: adminCompanyMembersKeys.invitations(companyId) })
    }
  }

  const inviteMutation = useMutation({
    mutationFn: (input: AdminCompanyInvitationInput) =>
      adminCompaniesService.createInvitation(companyId as string, input),
    onSuccess: (result) => {
      setLastInvitationToken(result.token)
      invalidate()
      showSuccessToast(
        t("members.toasts.invitationSent", { defaultValue: "Invitation sent" }),
      )
    },
    onError: (error) => showErrorToast(error),
  })

  const roleMutation = useMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string | number
      input: AdminCompanyMemberRoleInput
    }) => adminCompaniesService.updateMemberRole(companyId as string, userId, input),
    onSuccess: () => {
      invalidate()
      showSuccessToast(
        t("members.toasts.roleUpdated", { defaultValue: "Member role updated" }),
      )
    },
    onError: (error) => showErrorToast(error),
  })

  const statusMutation = useMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string | number
      input: AdminCompanyMemberStatusInput
    }) => adminCompaniesService.updateMemberStatus(companyId as string, userId, input),
    onSuccess: () => {
      invalidate()
      showSuccessToast("Member status updated")
    },
    onError: (error) => showErrorToast(error),
  })

  const removeMutation = useMutation({
    mutationFn: (userId: string | number) =>
      adminCompaniesService.removeMember(companyId as string, userId),
    onSuccess: () => {
      invalidate()
      showSuccessToast("Member removed")
    },
    onError: (error) => showErrorToast(error),
  })

  const transferOwnershipMutation = useMutation({
    mutationFn: (input: AdminCompanyTransferOwnershipInput) =>
      adminCompaniesService.transferOwnership(companyId as string, input),
    onSuccess: () => {
      invalidate()
      showSuccessToast("Company ownership transferred")
    },
    onError: (error) => showErrorToast(error),
  })

  return {
    members: membersQuery.data?.items ?? [],
    invitations: invitationsQuery.data?.items ?? [],
    pagination: membersQuery.data?.pagination,
    isLoading: membersQuery.isLoading || invitationsQuery.isLoading,
    refetch: membersQuery.refetch,
    inviteMutation,
    roleMutation,
    statusMutation,
    removeMutation,
    transferOwnershipMutation,
    lastInvitationToken,
    clearLastInvitationToken: () => setLastInvitationToken(null),
  }
}
