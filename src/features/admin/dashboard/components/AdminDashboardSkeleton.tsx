import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "react-i18next"

export default function AdminDashboardSkeleton() {
  const { t } = useTranslation("adminDashboard")
  return (
    <div className="space-y-6" aria-label={t("loading")}>
      <Skeleton className="h-44 rounded-2xl" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-40 rounded-[28px]" />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      <div className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  )
}
