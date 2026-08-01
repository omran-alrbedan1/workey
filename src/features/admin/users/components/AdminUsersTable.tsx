import { ShieldCheck, ShieldOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminUserRecord, AdminUserStatus } from "../types/adminUsers.types"
import { images } from "@/constants/images"

interface AdminUsersTableProps {
  users: AdminUserRecord[]
  isLoading: boolean
  pagination?: AdminPagination
  onPageChange: (page: number) => void
  onStatusChange: (id: string | number, status: AdminUserStatus) => void
  isUpdating: boolean
}

export default function AdminUsersTable({
  users,
  isLoading,
  pagination,
  onPageChange,
  onStatusChange,
  isUpdating,
}: AdminUsersTableProps) {
  const columns: Column<AdminUserRecord>[] = [
    {
      key: "user",
      header: "User",
      cell: (user) => (
        <div>
          <p className="font-semibold text-text-primary">{user.name}</p>
          <p className="text-xs text-text-muted">{user.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user) => <span className="capitalize">{user.role}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => <StatusBadge status={user.status} variant="soft" />,
    },
    {
      key: "joined",
      header: "Joined",
      cell: (user) => (user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (user) =>
        user.status === "suspended" ? (
          <Button
            size="sm"
            variant="outline"
            disabled={isUpdating}
            onClick={() => onStatusChange(user.id, "active")}
          >
            <ShieldCheck /> Activate
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={isUpdating}
            onClick={() => onStatusChange(user.id, "suspended")}
          >
            <ShieldOff /> Suspend
          </Button>
        ),
    },
  ]
  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(user) => user.id}
      loading={isLoading}
      pagination={{
        total: pagination?.total ?? users.length,
        page: pagination?.currentPage ?? 1,
        lastPage: pagination?.lastPage ?? 1,
        perPage: pagination?.perPage,
      }}
      onPageChange={onPageChange}
      emptyMessage="No users were returned."
      emptyDescription="No user accounts match the current view."
      emptyImage={images.usersManagement}
      emptyImageAlt="No users"
      className="rounded-2xl bg-background-card shadow-card"
    />
  )
}
