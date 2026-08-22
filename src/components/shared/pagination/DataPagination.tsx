import { useTranslation } from "react-i18next"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

interface DataPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push("ellipsis")
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push("ellipsis")
    pages.push(totalPages)
  }
  return pages
}

export const DataPagination: React.FC<DataPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation("common")

  if (totalPages <= 1) return null

  return (
    <Pagination>
      <PaginationContent className="space-x-3">
        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={cn(
              "gap-1 pl-2.5 cursor-pointer",
              currentPage === 1 && "pointer-events-none opacity-50 mx-4",
            )}
            aria-label={t("pagination.previousAria")}
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            <span>{t("pagination.previous")}</span>
          </PaginationLink>
        </PaginationItem>
        {getPageNumbers(currentPage, totalPages).map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationLink
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={cn(
              "gap-1 pr-2.5 cursor-pointer",
              currentPage === totalPages && "pointer-events-none opacity-50 mx-4 ",
            )}
            aria-label={t("pagination.nextAria")}
          >
            <span>{t("pagination.next")}</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
