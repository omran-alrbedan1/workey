import { useState } from "react"
import {
  Activity,
  Clock,
  FileText,
  HelpCircle,
  MoreHorizontal,
  Pencil,
  Power,
  Target,
  Trash2,
  UserPlus,
} from "lucide-react"
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

interface EmployerTestMobileCardProps {
  test: EmployerTest
  isUpdating: boolean
  onEdit: (test: EmployerTest) => void
  onAssign: (test: EmployerTest) => void
  onToggle: (test: EmployerTest) => void
  onDelete: (test: EmployerTest) => void
}

function EmployerTestMobileCard({
  test,
  isUpdating,
  onEdit,
  onAssign,
  onToggle,
  onDelete,
}: EmployerTestMobileCardProps) {
  const { t } = useTranslation("employerTests")

  return (
    <article className="rounded-2xl border border-border bg-background-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text-primary">{test.title}</h3>
          <p className="truncate text-xs text-text-muted">
            {test.description || t("noDescription")}
          </p>
        </div>
        <StatusBadge status={test.is_active ? "active" : "inactive"} variant="soft" />
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-background-secondary p-3 text-xs text-text-secondary">
        <p className="flex items-center gap-2">
          <HelpCircle className="h-3.5 w-3.5 text-primary" />
          {t("columns.questions")}: {test.questions?.length ?? 0}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-primary" />
          {t("columns.duration")}: {t("minutes", { count: test.duration_minutes })}
        </p>
        <p className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-primary" />
          {t("columns.passing")}: {test.passing_score} / {test.max_score}
        </p>
      </div>

      <div className="mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" disabled={isUpdating} className="w-full">
              {t("actions.label")} <MoreHorizontal className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(test)}>
              <Pencil /> {t("actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onAssign(test)}>
              <UserPlus /> {t("actions.assignTo")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onToggle(test)}>
              <Power /> {test.is_active ? t("actions.deactivate") : t("actions.activate")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onSelect={() => onDelete(test)}>
              <Trash2 /> {t("actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  )
}

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

  const handleToggle = (test: EmployerTest) => (test.is_active ? setDeactivating(test) : setActivating(test))
  const handleDelete = (test: EmployerTest) => setDeleting(test)

  const columns: Column<EmployerTest>[] = [
    {
      key: "title",
      header: t("columns.test"),
      headerIcon: FileText,
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
      headerIcon: HelpCircle,
      cell: (test) => `${test.questions?.length ?? 0}`,
    },
    {
      key: "duration",
      header: t("columns.duration"),
      headerIcon: Clock,
      cell: (test) => t("minutes", { count: test.duration_minutes }),
    },
    {
      key: "score",
      header: t("columns.passing"),
      headerIcon: Target,
      cell: (test) => `${test.passing_score} / ${test.max_score}`,
    },
    {
      key: "status",
      header: t("columns.status"),
      headerIcon: Activity,
      cell: (test) => <StatusBadge status={test.is_active ? "active" : "inactive"} variant="soft" />,
    },
    {
      key: "actions",
      header: t("columns.actions"),
      className: "text-end",
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
            <DropdownMenuItem onSelect={() => handleToggle(test)}>
              <Power /> {test.is_active ? t("actions.deactivate") : t("actions.activate")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onSelect={() => handleDelete(test)}>
              <Trash2 /> {t("actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const MobileTestCard = ({ item }: { item: EmployerTest }) => (
    <EmployerTestMobileCard
      test={item}
      isUpdating={isUpdating}
      onEdit={onEdit}
      onAssign={onAssign}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  )

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
        mobileCardComponent={MobileTestCard}
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
