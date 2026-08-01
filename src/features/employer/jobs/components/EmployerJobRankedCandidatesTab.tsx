import { Trophy } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import EmployerJobRankedCandidates from "./EmployerJobRankedCandidates"

interface EmployerJobRankedCandidatesTabProps {
  candidates: any[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export default function EmployerJobRankedCandidatesTab({
  candidates,
  isLoading,
  isError,
  onRetry,
}: EmployerJobRankedCandidatesTabProps) {
  const { t } = useTranslation("employerJobs")

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border bg-background-card shadow-card">
        <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{t("rankedCandidates.title")}</h2>
              <p className="text-sm text-white/80">{t("rankedCandidates.description")}</p>
            </div>
            {candidates && candidates.length > 0 && (
              <div className="hidden items-center gap-3 sm:flex">
                <div className="rounded-lg bg-white/15 px-4 py-2 text-center backdrop-blur-sm">
                  <p className="text-2xl font-bold text-white">{candidates.length}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">Candidates</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-6">
          <EmployerJobRankedCandidates
            candidates={candidates ?? []}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
          />
        </CardContent>
      </Card>
    </div>
  )
}
