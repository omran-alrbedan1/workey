import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { employerApplicantsService } from "@/features/employer/applicants/services/employerApplicants.service"
import type { EmployerApplicantDetail } from "@/features/employer/applicants/types/employerApplicants.types"
import type { RankedCandidate } from "../types/employerJobs.types"
import { employerJobsService } from "../services/employerJobs.service"

export type JobApplicantSortKey = "newest" | "match_desc" | "match_asc"

export interface JobApplicantRow extends EmployerApplicantDetail {
  ranked?: RankedCandidate | null
}

export function matchScorePercent(row: JobApplicantRow): number | null {
  const raw =
    row.ranked?.score ?? row.ranked?.matching_score ?? row.match_score ?? row.matching_score
  if (raw == null) return null
  const score = Number(raw)
  if (Number.isNaN(score)) return null
  return score <= 1 ? Math.round(score * 100) : Math.round(score)
}

export function useJobApplicants(jobId?: string | number) {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<JobApplicantSortKey>("newest")

  const applicationsQuery = useQuery({
    queryKey: ["employer", "jobs", "applicants", String(jobId ?? ""), page],
    queryFn: () => employerApplicantsService.list(jobId!, page),
    enabled: Boolean(jobId),
    placeholderData: keepPreviousData,
  })

  const rankedQuery = useQuery({
    queryKey: ["employer", "jobs", "ranked-candidates", String(jobId ?? "")],
    queryFn: () => employerJobsService.rankedCandidates(jobId!),
    enabled: Boolean(jobId),
  })

  const rankedByApplicationId = useMemo(() => {
    const map = new Map<string, RankedCandidate>()
    for (const candidate of rankedQuery.data?.items ?? []) {
      if (candidate.application_id != null) map.set(String(candidate.application_id), candidate)
    }
    return map
  }, [rankedQuery.data])

  const rows = useMemo<JobApplicantRow[]>(() => {
    const merged = (applicationsQuery.data?.items ?? []).map((item) => ({
      ...item,
      ranked: rankedByApplicationId.get(String(item.id)) ?? null,
    }))
    if (sortBy === "newest") return merged
    const direction = sortBy === "match_desc" ? -1 : 1
    return [...merged].sort((a, b) => {
      const aScore = matchScorePercent(a)
      const bScore = matchScorePercent(b)
      if (aScore == null && bScore == null) return 0
      if (aScore == null) return 1
      if (bScore == null) return -1
      return (aScore - bScore) * direction
    })
  }, [applicationsQuery.data, rankedByApplicationId, sortBy])

  const retry = () => {
    void applicationsQuery.refetch()
    if (rankedQuery.isError) void rankedQuery.refetch()
  }

  return {
    rows,
    collection: applicationsQuery.data,
    isLoading: applicationsQuery.isPending || rankedQuery.isPending,
    isError: applicationsQuery.isError,
    isRankedError: rankedQuery.isError,
    page,
    setPage,
    sortBy,
    setSortBy,
    retry,
  }
}
