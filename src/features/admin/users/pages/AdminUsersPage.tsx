import { Users } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import AdminUsersTable from "../components/AdminUsersTable"
import AdminUsersFilter from "../components/AdminUsersFilter"
import { useAdminUsers } from "../hooks/useAdminUsers"
import { images } from "@/constants/images"
import {
  ADMIN_USER_FILTER_DEFAULTS,
  type AdminUserFilterForm,
} from "../types/adminUsers.types"

export default function AdminUsersPage() {
  const { t } = useTranslation("adminUsers")
  const [filters, setFilters] = useState<AdminUserFilterForm>(ADMIN_USER_FILTER_DEFAULTS)
  const users = useAdminUsers(filters)
  if (users.isError)
    return (
      <>
        <PageHeader
          title={t("list.title")}
          description={t("list.description")}
          icon={Users}
          image={{
            src: images.usersManagement,
            alt: t("list.imageAlt"),
          }}
        />
        <div className="mt-4">
          <AdminFeatureError
            title={t("list.errorTitle")}
            error={users.error}
            retry={() => {
              void users.refetch()
            }}
          />
        </div>
      </>
    )
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("list.title")}
        description={t("list.description")}
        icon={Users}
        count={users.data?.pagination.total}
        image={{
          src: images.usersManagement,
          alt: t("list.imageAlt"),
        }}
      />
      <AdminUsersFilter
        initialFilters={filters}
        isLoading={users.isFetching}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters(ADMIN_USER_FILTER_DEFAULTS)}
      />
      <AdminUsersTable
        users={users.data?.items ?? []}
        isLoading={users.isPending}
        pagination={users.data?.pagination}
        onPageChange={users.setPage}
        isUpdating={users.statusMutation.isPending}
        onStatusChange={(id, status) => users.statusMutation.mutate({ id, status })}
      />
    </div>
  )
}
