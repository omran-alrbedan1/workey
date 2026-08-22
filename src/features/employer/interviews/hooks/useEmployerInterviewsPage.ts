import { useEffect, useMemo, useState } from "react"
import { useEmployerApplicants } from "@/features/employer/applicants/hooks/useEmployerApplicants"
import { useApplicationInterviews } from "@/features/employer/applicants/hooks/useApplicationInterviews"
import { candidateDisplayName } from "@/features/employer/applicants/utils/candidateDisplay"
import { useEmployerJobs } from "@/features/employer/jobs/hooks/useEmployerJobs"

export function useEmployerInterviewsPage(unknownCandidateLabel: string) {
  const jobs = useEmployerJobs()
  const [selectedJobId, setSelectedJobId] = useState("")
  const [selectedApplicationId, setSelectedApplicationId] = useState("")

  const jobItems = useMemo(() => jobs.data?.items ?? [], [jobs.data?.items])
  const selectedJob = useMemo(
    () => jobItems.find((job) => String(job.id) === selectedJobId),
    [jobItems, selectedJobId],
  )

  useEffect(() => {
    if (!jobItems.length) {
      if (selectedJobId) setSelectedJobId("")
      return
    }

    if (!selectedJobId || !selectedJob) {
      setSelectedJobId(String(jobItems[0].id))
    }
  }, [jobItems, selectedJob, selectedJobId])

  const applicants = useEmployerApplicants(selectedJobId || undefined)
  const applicationItems = useMemo(() => applicants.data?.items ?? [], [applicants.data?.items])
  const preferredApplication = useMemo(
    () =>
      applicationItems.find((application) => (application.interviews_count ?? 0) > 0) ??
      applicationItems[0],
    [applicationItems],
  )
  const selectedApplication = useMemo(
    () => applicationItems.find((application) => String(application.id) === selectedApplicationId),
    [applicationItems, selectedApplicationId],
  )

  useEffect(() => {
    if (!selectedJobId || !applicationItems.length) {
      if (selectedApplicationId) setSelectedApplicationId("")
      return
    }

    if (!selectedApplicationId || !selectedApplication) {
      setSelectedApplicationId(String(preferredApplication.id))
    }
  }, [
    applicationItems,
    preferredApplication,
    selectedApplication,
    selectedApplicationId,
    selectedJobId,
  ])

  const interviews = useApplicationInterviews(selectedApplicationId || undefined)

  const applicationOptions = useMemo(
    () =>
      applicationItems.map((application) => ({
        application,
        candidateName: candidateDisplayName(application, unknownCandidateLabel),
      })),
    [applicationItems, unknownCandidateLabel],
  )
  const selectedApplicationCandidateName = useMemo(
    () =>
      applicationOptions.find(({ application }) => String(application.id) === selectedApplicationId)
        ?.candidateName,
    [applicationOptions, selectedApplicationId],
  )

  const selectJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setSelectedApplicationId("")
    applicants.setPage(1)
  }

  const retry = () => {
    void jobs.refetch()
    if (selectedJobId) void applicants.refetch()
    if (selectedApplicationId) void interviews.refetch()
  }

  return {
    jobs,
    applicants,
    interviews,
    selectedJobId,
    selectedApplicationId,
    selectedJob,
    selectedApplication,
    selectedApplicationCandidateName,
    applicationOptions,
    selectJob,
    selectApplication: setSelectedApplicationId,
    retry,
    isError: jobs.isError || applicants.isError || interviews.isError,
    isLoading:
      jobs.isPending ||
      (Boolean(selectedJobId) && applicants.isPending) ||
      (Boolean(selectedApplicationId) && interviews.isPending),
  }
}

export type EmployerInterviewsPageModel = ReturnType<typeof useEmployerInterviewsPage>
