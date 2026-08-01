import { useState } from "react"
import { MoreHorizontal, Pencil, Power, Trash2, UserPlus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { StatusBadge } from "@/components/shared/badges"
import { DeleteModal, ActivateModal, DeactivateModal } from "@/components/shared/modals"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EmployerCollection } from "@/features/employer/shared/services/employerResponse.utils"
import type { EmployerTest } from "../types/employerTests.types"

export default function EmployerTestsTable({
  collection,
  isLoading,
  isUpdating,
  onPageChange,
  onEdit,
  onToggle,
  onDelete,
  onAssign,
}: {
  collection?: EmployerCollection<EmployerTest>
  isLoading: boolean
  isUpdating: boolean
  onPageChange: (page: number) => void
  onEdit: (test: EmployerTest) => void
  onToggle: (test: EmployerTest) => void
  onDelete: (id: string | number) => Promise<unknown>
  onAssign: (test: EmployerTest) => void
}) {
  const { t } = useTranslation("employerTests")
  const [deleting, setDeleting] = useState<EmployerTest | null>(null)
  const [activating, setActivating] = useState<EmployerTest | null>(null)
  const [deactivating, setDeactivating] = useState<EmployerTest | null>(null)
  const columns: Column<EmployerTest>[] = [
    {
      key: "title",
      header: t("columns.test"),
      cell: (test) => (
        <div>
          <p className="font-semibold text-text-primary">{test.title}</p>
          <p className="max-w-sm truncate text-xs text-text-muted">
            {test.description || t("noDescription")}
          </p>
        </div>
      ),
    },
    {
      key: "questions",
      header: t("columns.questions"),
      cell: (test) => `${test.questions?.length ?? 0}`,
    },
    {
      key: "duration",
      header: t("columns.duration"),
      cell: (test) => t("minutes", { count: test.duration_minutes }),
    },
    {
      key: "score",
      header: t("columns.passing"),
      cell: (test) => `${test.passing_score} / ${test.max_score}`,
    },
    {
      key: "status",
      header: t("columns.status"),
      cell: (test) => <StatusBadge status={test.is_active ? "active" : "inactive"} variant="soft" />,
    },
    {
      key: "actions",
      header: t("columns.actions"),
      className: "text-right",
      cell: (test) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" disabled={isUpdating}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(test)}>
              <Pencil /> {t("actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAssign(test)}>
              <UserPlus /> {t("actions.assignTo")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => (test.is_active ? setDeactivating(test) : setActivating(test))}>
              <Power /> {test.is_active ? t("actions.deactivate") : t("actions.activate")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onSelect={() => setDeleting(test)}>
              <Trash2 /> {t("actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <DataTable
        data={collection?.items ?? []}
        columns={columns}
        getRowId={(test) => test.id}
        loading={isLoading}
        pagination={{
          total: collection?.pagination.total ?? 0,
          page: collection?.pagination.currentPage ?? 1,
          lastPage: collection?.pagination.lastPage ?? 1,
          perPage: collection?.pagination.perPage,
        }}
        onPageChange={onPageChange}
        emptyMessage={t("empty.title")}
        emptyDescription={t("empty.description")}
        className="bg-background-card shadow-card"
      />
      <DeleteModal
        open={deleting !== null}
        name={deleting?.title ?? ""}
        loading={isUpdating}
        onClose={() => {
          if (!isUpdating) setDeleting(null)
        }}
        onConfirm={() => {
          if (!deleting) return
          void onDelete(deleting.id).then(() => setDeleting(null))
        }}
      />
      <ActivateModal
        open={activating !== null}
        name={activating?.title ?? ""}
        loading={isUpdating}
        onClose={() => {
          if (!isUpdating) setActivating(null)
        }}
        onConfirm={async () => {
          if (!activating) return
          await onToggle(activating)
          setActivating(null)
        }}
      />
      <DeactivateModal
        open={deactivating !== null}
        name={deactivating?.title ?? ""}
        loading={isUpdating}
        onClose={() => {
          if (!isUpdating) setDeactivating(null)
        }}
        onConfirm={async () => {
          if (!deactivating) return
          await onToggle(deactivating)
          setDeactivating(null)
        }}
      />
    </>
  )
}
