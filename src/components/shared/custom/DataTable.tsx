// components/ui/data-table/DataTable.tsx
import { useMemo, useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import EmptyState from "@/components/shared/states/EmptyState"

export interface Column<T = any> {
  key: string
  header: string
  headerIcon?: React.ComponentType<{ className?: string }>
  cell?: (item: T) => React.ReactNode
  className?: string
  width?: string
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  pagination: {
    total: number
    page: number
    lastPage: number
    perPage?: number
  }
  onPageChange: (page: number) => void
  onRowClick?: (item: T) => void
  getRowId: (item: T) => string | number
  mobileCardComponent?: React.ComponentType<{
    item: T
    onViewDetails: () => void
    t: (key: string, options?: any) => string
    isAr: boolean
  }>
  emptyMessage?: string
  emptyDescription?: string
  emptyImage?: string
  emptyImageAlt?: string
  className?: string
}

// Helper function for pagination
const getPageNumbers = (current: number, last: number) => {
  const pages: (number | "ellipsis")[] = []
  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (current > 3) pages.push("ellipsis")
  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < last - 2) pages.push("ellipsis")
  pages.push(last)
  return pages
}

// Skeleton loading component
function DataTableSkeleton({ columns }: { columns: Column[] }) {
  return (
    <div className="rounded-md border border-border">
      <div className="min-w-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width }}
                >
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
}

// Pagination component using shadcn/ui
interface DataTablePaginationProps {
  page: number
  lastPage: number
  total: number
  perPage?: number
  onPageChange: (page: number) => void
  t: (key: string, options?: any) => string
}

function DataTablePagination({
  page,
  lastPage,
  total,
  perPage = 10,
  onPageChange,
  t,
}: DataTablePaginationProps) {
  const pageNumbers = useMemo(() => getPageNumbers(page, lastPage), [page, lastPage])

  if (lastPage <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border">
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        {t("table.showing", {
          defaultValue: `Showing {{from}} to {{to}} of {{total}} results`,
          from: total === 0 ? 0 : (page - 1) * perPage + 1,
          to: Math.min(page * perPage, total),
          total: total.toLocaleString(),
        })}
      </div>

      <Pagination className="order-1 sm:order-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) onPageChange(page - 1)
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {pageNumbers.map((pageNum, idx) => (
            <PaginationItem key={idx}>
              {pageNum === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(pageNum)
                  }}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (page < lastPage) onPageChange(page + 1)
              }}
              className={page === lastPage ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

// Main DataTable component
export function DataTable<T = any>({
  data,
  columns,
  loading = false,
  pagination,
  onPageChange,
  onRowClick,
  getRowId,
  mobileCardComponent: MobileCard,
  emptyMessage,
  emptyDescription,
  emptyImage,
  emptyImageAlt,
  className = "",
}: DataTableProps<T>) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (loading) {
    return <DataTableSkeleton columns={columns} />
  }

  // Mobile view with custom card component
  if (isMobile && MobileCard) {
    return (
      <div className={`space-y-3  ${className}`}>
        {data.map((item) => (
          <MobileCard
            key={getRowId(item)}
            item={item}
            onViewDetails={() => onRowClick?.(item)}
            t={t}
            isAr={isAr}
          />
        ))}
        {data.length === 0 && (
          <EmptyState
            title={emptyMessage || t("table.noData")}
            description={emptyDescription || "There are no records to display yet."}
            imageUrl={emptyImage}
            imageAlt={emptyImageAlt}
            className="rounded-2xl border border-border bg-background-card py-12"
          />
        )}
        <DataTablePagination
          page={pagination.page}
          lastPage={pagination.lastPage}
          total={pagination.total}
          perPage={pagination.perPage}
          onPageChange={onPageChange}
          t={t}
        />
      </div>
    )
  }

  // Desktop table view
  return (
    <div className={`overflow-x-auto rounded-md border border-border ${className}`}>
      <div className="min-w-3xl px-5">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.className}
                  style={{ width: column.width }}
                >
                  <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {column.headerIcon && (
                      <column.headerIcon className="h-3.5 w-3.5 text-primary" />
                    )}
                    {column.header}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={getRowId(item)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-muted/30",
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="text-sm">
                    {column.cell ? column.cell(item) : (item as any)[column.key] || "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="p-0 text-center text-muted-foreground"
                >
                  <EmptyState
                    title={emptyMessage || t("table.noData")}
                    description={emptyDescription || "There are no records to display yet."}
                    imageUrl={emptyImage}
                    imageAlt={emptyImageAlt}
                    className="bg-transparent py-12"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={pagination.page}
        lastPage={pagination.lastPage}
        total={pagination.total}
        perPage={pagination.perPage}
        onPageChange={onPageChange}
        t={t}
      />
    </div>
  )
}
