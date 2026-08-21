import { Users } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { AdminFeatureError } from "@/features/admin/shared/components"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminUsersTable from "../components/AdminUsersTable"
import AdminUsersFilter from "../components/AdminUsersFilter"
import { useAdminUsers } from "../hooks/useAdminUsers"
import { images } from "@/constants/images"
import type { AdminUserFilterForm, AdminUserRole } from "../types/adminUsers.types"

const ROLE_TABS: ReadonlyArray<{ value: AdminUserRole; labelKey: string }> = [
  { value: "admin", labelKey: "list.tabs.administrators" },
  { value: "job_seeker", labelKey: "list.tabs.jobSeekers" },
  { value: "employer", labelKey: "list.tabs.employers" },
]

interface AdminUsersPageFilters {
  search: string
  status: string
}

export default function AdminUsersPage() {
  const { t } = useTranslation("adminUsers")
  const [activeRole, setActiveRole] = useState<AdminUserRole>("admin")
  const [filters, setFilters] = useState<AdminUsersPageFilters>({ search: "", status: "all" })

  const roleFilters: AdminUserFilterForm = {
    search: filters.search,
    status: filters.status,
    role: activeRole,
  }
  const users = useAdminUsers(roleFilters)

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
      <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as AdminUserRole)}>
        <TabsList aria-label={t("list.tabsLabel")}>
          {ROLE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2 whitespace-nowrap px-4">
              {t(tab.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <AdminUsersFilter
        initialFilters={filters}
        isLoading={users.isFetching}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters({ search: "", status: "all" })}
      />
      <AdminUsersTable
        users={users.data?.items ?? []}
        isLoading={users.isPending}
        pagination={users.data?.pagination}
        onPageChange={users.setPage}
        isUpdating={users.statusMutation.isPending}
        onStatusChange={(id, status, reason) =>
          users.statusMutation.mutateAsync({ id, status, reason })
        }
      />
    </div>
  )
}
