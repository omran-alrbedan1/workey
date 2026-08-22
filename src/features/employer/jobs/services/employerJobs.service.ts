import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  isRecord,
  unwrapEmployerCollection,
  unwrapEmployerEntity,
  type EmployerCollection,
} from "@/features/employer/shared/services/employerResponse.utils"
import type {
  EmployerJob,
  EmployerJobInput,
  EmployerJobSkill,
  EmployerJobSkillsInput,
  JobScreeningQuestion,
  JobScreeningQuestionInput,
  RankedCandidate,
} from "../types/employerJobs.types"

/**
 * The backend has returned the applications total under several shapes
 * (applications_count, applicants_count, stats.applications_count,
 * applications[] / applications{total}). Normalize them all so the
 * jobs table never falls back to 0 while applications exist.
 */
function withApplicationsCount(job: EmployerJob): EmployerJob {
  const source = job as unknown as Record<string, unknown>

  const direct =
    source.applications_count ?? source.applicants_count ?? source.job_applications_count
  if (direct !== undefined && direct !== null) {
    return { ...job, applications_count: Number(direct) }
  }

  const stats = (source.stats ?? source.statistics) as Record<string, unknown> | undefined
  const fromStats = isRecord(stats)
    ? (stats.applications_count ?? stats.applications ?? stats.applicants)
    : undefined
  if (fromStats !== undefined && fromStats !== null) {
    return { ...job, applications_count: Number(fromStats) }
  }

  const applications = source.applications
  if (Array.isArray(applications)) {
    return { ...job, applications_count: applications.length }
  }
  if (isRecord(applications)) {
    const nested = applications.total ?? applications.count
    if (nested !== undefined && nested !== null) {
      return { ...job, applications_count: Number(nested) }
    }
  }

  return job
}

export const employerJobsService = {
  async listSkills(search = "", limit = 100): Promise<EmployerCollection<EmployerJobSkill>> {
    return unwrapEmployerCollection<EmployerJobSkill>(
      await api.get(API_ENDPOINTS.skills, { params: { search: search || undefined, limit } }),
    )
  },

  async list(
    page = 1,
    filters: {
      accepting_applications?: boolean
      work_mode?: string
      employment_type?: string
      sort_by?: string
      sort_direction?: "asc" | "desc"
    } = {},
    perPage = 15,
  ): Promise<EmployerCollection<EmployerJob>> {
    const collection = unwrapEmployerCollection<EmployerJob>(
      await api.get(API_ENDPOINTS.employer.jobs, {
        params: { page, per_page: perPage, ...filters },
      }),
    )
    return { ...collection, items: collection.items.map(withApplicationsCount) }
  },

  async create(input: EmployerJobInput & EmployerJobSkillsInput): Promise<EmployerJob> {
    return unwrapEmployerEntity<EmployerJob>(await api.post(API_ENDPOINTS.jobs.create, input))
  },

  async get(id: string | number): Promise<EmployerJob> {
    return withApplicationsCount(
      unwrapEmployerEntity<EmployerJob>(await api.get(API_ENDPOINTS.jobs.byId(id))),
    )
  },

  async update(id: string | number, input: EmployerJobInput): Promise<EmployerJob> {
    return unwrapEmployerEntity<EmployerJob>(await api.put(API_ENDPOINTS.jobs.byId(id), input))
  },

  async attachSkills(
    id: string | number,
    skills: Array<string | number> | EmployerJobSkillsInput,
  ): Promise<EmployerJob> {
    const payload = Array.isArray(skills) ? { skill_ids: skills } : skills
    return unwrapEmployerEntity<EmployerJob>(await api.post(API_ENDPOINTS.jobs.skills(id), payload))
  },

  async detachSkill(id: string | number, skillId: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.jobs.detachSkill(id, skillId))
  },

  async publish(id: string | number): Promise<EmployerJob> {
    return unwrapEmployerEntity<EmployerJob>(await api.post(API_ENDPOINTS.jobs.publish(id)))
  },

  async close(id: string | number): Promise<EmployerJob> {
    return unwrapEmployerEntity<EmployerJob>(await api.post(API_ENDPOINTS.jobs.close(id)))
  },

  async listScreeningQuestions(jobId: string | number): Promise<JobScreeningQuestion[]> {
    return unwrapEmployerEntity<JobScreeningQuestion[]>(
      await api.get(API_ENDPOINTS.jobs.screeningQuestions(jobId)),
    )
  },

  async createScreeningQuestion(
    jobId: string | number,
    input: JobScreeningQuestionInput,
  ): Promise<JobScreeningQuestion> {
    return unwrapEmployerEntity<JobScreeningQuestion>(
      await api.post(API_ENDPOINTS.jobs.screeningQuestions(jobId), input),
    )
  },

  async updateScreeningQuestion(
    jobId: string | number,
    questionId: string | number,
    input: Partial<JobScreeningQuestionInput>,
  ): Promise<JobScreeningQuestion> {
    return unwrapEmployerEntity<JobScreeningQuestion>(
      await api.put(API_ENDPOINTS.jobs.screeningQuestionById(jobId, questionId), input),
    )
  },

  async deleteScreeningQuestion(
    jobId: string | number,
    questionId: string | number,
  ): Promise<void> {
    await api.delete(API_ENDPOINTS.jobs.screeningQuestionById(jobId, questionId))
  },

  async rankedCandidates(jobId: string | number): Promise<EmployerCollection<RankedCandidate>> {
    return unwrapEmployerCollection<RankedCandidate>(
      await api.get(API_ENDPOINTS.jobs.rankedCandidates(jobId)),
    )
  },

  async remove(id: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.jobs.byId(id))
  },
}
