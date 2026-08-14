import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { showSuccessToast, showErrorToast } from "@/lib/toast"
import { adminCompaniesService } from "../services/adminCompanies.service"
import type {
  AdminCompanyInvitationInput,
  AdminCompanyMemberRoleInput,
} from "../types/adminCompanyMembers.types"

export const adminCompanyMembersKeys = {
  members: (companyId: string | number) => ["admin", "companies", "members", String(companyId)],
}

export function useAdminCompanyMembers(companyId?: string) {
  const { t } = useTranslation("adminCompanies")
  const client = useQueryClient()

  const membersQuery = useQuery({
    queryKey: adminCompanyMembersKeys.members(companyId ?? "missing"),
    queryFn: () => adminCompaniesService.listMembers(companyId as string),
    enabled: Boolean(companyId),
  })

  const invalidate = () => {
    if (companyId) {
      void client.invalidateQueries({ queryKey: adminCompanyMembersKeys.members(companyId) })
    }
  }

  const inviteMutation = useMutation({
    mutationFn: (input: AdminCompanyInvitationInput) =>
      adminCompaniesService.createInvitation(companyId as string, input),
    onSuccess: () => {
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

  return {
    members: membersQuery.data?.items ?? [],
    pagination: membersQuery.data?.pagination,
    isLoading: membersQuery.isLoading,
    refetch: membersQuery.refetch,
    inviteMutation,
    roleMutation,
  }
}
