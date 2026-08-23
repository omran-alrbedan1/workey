import { MoreHorizontal, ShieldCheck, ShieldOff, User, Shield, Clock } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import { ActivateModal, SuspendModal } from "@/components/shared/modals"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { keyOf } from "@/lib/keyValue"
import { ROUTES } from "@/config"
import type { AdminPagination } from "@/features/admin/shared/types/adminApi.types"
import type { AdminUserRecord, AdminUserStatus } from "../types/adminUsers.types"
import { images } from "@/constants/images"

type UserStatusAction = "activate" | "suspend"

interface AdminUsersTableProps {
  users: AdminUserRecord[]
  isLoading: boolean
  pagination?: AdminPagination
  onPageChange: (page: number) => void
  onStatusChange: (id: string | number, status: AdminUserStatus) => void | Promise<unknown>
  isUpdating: boolean
}

interface AdminUserMobileCardProps {
  user: AdminUserRecord
  isUpdating: boolean
  onAction: (user: AdminUserRecord, action: UserStatusAction) => void
}

interface UserActionsDropdownProps {
  user: AdminUserRecord
  statusKey: string
  isUpdating: boolean
  fullWidth?: boolean
  onAction: (user: AdminUserRecord, action: UserStatusAction) => void
}

const UserActionsDropdown = ({
  user,
  statusKey,
  isUpdating,
  fullWidth,
  onAction,
}: UserActionsDropdownProps) => {
  const { t } = useTranslation("adminUsers")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={fullWidth ? "sm" : "icon"}
          variant="ghost"
          disabled={isUpdating}
          className={fullWidth ? "w-full" : "h-8 w-8"}
          aria-label={`Open actions for ${user.name}`}
        >
          {fullWidth && <span>{t("actions.menuLabel")}</span>}
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t("actions.menuLabel")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-emerald-700 focus:bg-emerald-50 focus:text-emerald-800"
          disabled={statusKey === "active"}
          onSelect={() => onAction(user, "activate")}
        >
          <ShieldCheck className="h-4 w-4" />
          {t("actions.activate")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30"
          disabled={statusKey === "suspended"}
          onSelect={() => onAction(user, "suspend")}
        >
          <ShieldOff className="h-4 w-4" />
          {t("actions.suspend")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const AdminUserMobileCard = ({ user, isUpdating, onAction }: AdminUserMobileCardProps) => {
  const roleLabel = useRoleLabel()
  const statusKey = keyOf(user.status)

  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">{user.name}</h3>
          <p className="truncate text-xs text-text-muted">{user.email}</p>
        </div>
        <StatusBadge status={user.status} variant="soft" />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span>{roleLabel(user.role)}</span>
        </p>
        {user.created_at && (
          <p className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="mt-4">
        <UserActionsDropdown
          user={user}
          statusKey={statusKey}
          isUpdating={isUpdating}
          onAction={onAction}
          fullWidth
        />
      </div>
    </article>
  )
}

function getRoleDisplay(role: string | any) {
  if (typeof role === "object" && role !== null) {
    return role.value || role.key || String(role)
  }
  return role || ""
}

function useRoleLabel() {
  const { t } = useTranslation("adminUsers")
  return (role: string | any) => {
    const display = getRoleDisplay(role)
    if (!display) return "—"
    return t(`roles.${display}`, { defaultValue: display })
  }
}

export default function AdminUsersTable({
  users,
  isLoading,
  pagination,
  onPageChange,
  onStatusChange,
  isUpdating,
}: AdminUsersTableProps) {
  const { t } = useTranslation("adminUsers")
  const roleLabel = useRoleLabel()
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null)
  const [selectedAction, setSelectedAction] = useState<UserStatusAction | null>(null)

  const openAction = (user: AdminUserRecord, action: UserStatusAction) => {
    setSelectedUser(user)
    setSelectedAction(action)
  }

  const closeAction = () => {
    if (isUpdating) return
    setSelectedAction(null)
    setSelectedUser(null)
  }

  const confirmActivate = async () => {
    if (!selectedUser) return
    await onStatusChange(selectedUser.id, "active")
    setSelectedAction(null)
    setSelectedUser(null)
  }

  const confirmSuspend = async () => {
    if (!selectedUser) return
    // Backend suspend endpoint accepts no body; a reason cannot be stored.
    await onStatusChange(selectedUser.id, "suspended")
    setSelectedAction(null)
    setSelectedUser(null)
  }

  const columns: Column<AdminUserRecord>[] = [
    {
      key: "user",
      header: t("list.columns.user"),
      headerIcon: User,
      cell: (user) => (
        <div>
          <p className="font-semibold text-text-primary">{user.name}</p>
          <p className="text-xs text-text-muted">{user.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: t("list.columns.role"),
      headerIcon: Shield,
      cell: (user) => <span>{roleLabel(user.role)}</span>,
    },
    {
      key: "status",
      header: t("list.columns.status"),
      headerIcon: ShieldCheck,
      cell: (user) => <StatusBadge status={user.status} variant="soft" />,
    },
    {
      key: "joined",
      header: t("list.columns.joined"),
      headerIcon: Clock,
      cell: (user) => (user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"),
    },
    {
      key: "actions",
      header: t("list.columns.actions"),
      className: "text-center",
      cell: (user) => {
        const statusKey = keyOf(user.status)
        return (
          <div className="flex justify-center" onClick={(event) => event.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isUpdating}
                  className="h-8 w-8"
                  aria-label={`Open actions for ${user.name}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>{t("actions.menuLabel")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-emerald-700 focus:bg-emerald-50 focus:text-emerald-800"
                  disabled={statusKey === "active"}
                  onSelect={() => openAction(user, "activate")}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {t("actions.activate")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30"
                  disabled={statusKey === "suspended"}
                  onSelect={() => openAction(user, "suspend")}
                >
                  <ShieldOff className="h-4 w-4" />
                  {t("actions.suspend")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const MobileUserCard = ({ item }: { item: AdminUserRecord }) => (
    <AdminUserMobileCard user={item} isUpdating={isUpdating} onAction={openAction} />
  )

  return (
    <>
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
        onRowClick={(user) => navigate(ROUTES.admin.userDetails(user.id))}
        mobileCardComponent={MobileUserCard}
        emptyMessage={t("list.emptyTitle")}
        emptyDescription={t("list.emptyDescription")}
        emptyImage={images.usersManagement}
        emptyImageAlt={t("list.emptyImageAlt")}
        className="rounded-2xl bg-background-card shadow-card"
      />

      <ActivateModal
        open={selectedAction === "activate"}
        name={selectedUser?.name ?? "user"}
        loading={isUpdating}
        onClose={closeAction}
        onConfirm={confirmActivate}
      />

      <SuspendModal
        open={selectedAction === "suspend"}
        name={selectedUser?.name ?? "user"}
        loading={isUpdating}
        onClose={closeAction}
        onConfirm={confirmSuspend}
      />
    </>
  )
}
