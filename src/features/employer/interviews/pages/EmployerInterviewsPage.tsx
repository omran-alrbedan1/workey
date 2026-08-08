import { CalendarClock } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import EmployerInterviewsTable from "../components/EmployerInterviewsTable"
import { useEmployerInterviews } from "../hooks/useEmployerInterviews"

export default function EmployerInterviewsPage() {
  const { t } = useTranslation("employerInterviews")
  const [page, setPage] = useState(1)
  const interviews = useEmployerInterviews({ page })

  if (interviews.isError) {
    return (
      <ErrorState
        title={t("errors.title")}
        description={t("errors.description")}
        retry={() => void interviews.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} icon={CalendarClock} />
      {interviews.isPending ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : (
        <EmployerInterviewsTable
          interviews={interviews.data?.items ?? []}
          isLoading={false}
          collection={interviews.data}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
