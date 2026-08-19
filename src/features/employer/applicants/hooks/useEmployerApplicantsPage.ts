import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ROUTES } from "@/config"
import { useEmployerJobs } from "@/features/employer/jobs/hooks/useEmployerJobs"
import type { EmployerJob } from "@/features/employer/jobs/types/employerJobs.types"
import { useEmployerApplicants } from "./useEmployerApplicants"
import type {
  ApplicationStatusKey,
  EmployerApplicant,
  EmployerInterviewInput,
} from "../types/employerApplicants.types"

export interface EmployerApplicantsPageModel {
  jobs: ReturnType<typeof useEmployerJobs>
  applicants: ReturnType<typeof useEmployerApplicants>
  selectedJobId: string | number | undefined
  selectedJob: EmployerJob | undefined
  testApplication: EmployerApplicant | null
  interviewApplication: EmployerApplicant | null
  isError: boolean
  isLoading: boolean
  isUpdating: boolean
  setTestApplication: (application: EmployerApplicant | null) => void
  setInterviewApplication: (application: EmployerApplicant | null) => void
  retry: () => void
  selectJob: (jobId: string) => void
  changeStatus: (applicationId: string | number, status: string, note?: string) => void
  moveToNextStep: (applicationId: string | number, status: string) => Promise<unknown>
  scheduleInterview: (applicationId: string | number, input: EmployerInterviewInput) => Promise<unknown>
}

export function useEmployerApplicantsPage(): EmployerApplicantsPageModel {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const jobs = useEmployerJobs()
  const selectedJobId = jobId || jobs.data?.items[0]?.id
  const selectedJob = jobs.data?.items.find((job) => String(job.id) === String(selectedJobId))
  const applicants = useEmployerApplicants(selectedJobId)
  const [testApplication, setTestApplication] = useState<EmployerApplicant | null>(null)
  const [interviewApplication, setInterviewApplication] = useState<EmployerApplicant | null>(null)

  useEffect(() => {
    if (!jobId && selectedJobId) {
      navigate(ROUTES.employer.jobApplicants(selectedJobId), { replace: true })
    }
  }, [jobId, navigate, selectedJobId])

  const selectJob = (nextJobId: string) => {
    applicants.setPage(1)
    navigate(ROUTES.employer.jobApplicants(nextJobId))
  }

  const changeStatus = async (applicationId: string | number, status: string, note?: string) => {
    await applicants.statusMutation.mutateAsync({
      applicationId,
      input: { status: status as ApplicationStatusKey, note },
    })
  }

  const moveToNextStep = (applicationId: string | number, status: string) =>
    applicants.statusMutation.mutateAsync({
      applicationId,
      input: { status: status as ApplicationStatusKey },
    })

  const scheduleInterview = (applicationId: string | number, input: EmployerInterviewInput) =>
    applicants.scheduleInterviewMutation.mutateAsync({ applicationId, input })

  return {
    jobs,
    applicants,
    selectedJobId,
    selectedJob,
    testApplication,
    interviewApplication,
    isError: jobs.isError || applicants.isError,
    isLoading: jobs.isPending || applicants.isPending,
    isUpdating: applicants.statusMutation.isPending || applicants.scheduleInterviewMutation.isPending,
    setTestApplication,
    setInterviewApplication,
    retry: () => void (jobs.isError ? jobs.refetch() : applicants.refetch()),
    selectJob,
    changeStatus,
    moveToNextStep,
    scheduleInterview,
  }
}
