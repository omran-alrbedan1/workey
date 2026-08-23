import { API_ENDPOINTS } from "@/config"
import { api, rawApi } from "@/lib/api"
import {
  unwrapEmployerCollection,
  unwrapEmployerEntity,
  type EmployerCollection,
} from "@/features/employer/shared/services/employerResponse.utils"
import type {
  EmployerApplicantDetail,
  ApplicationStatusChangeInput,
  ApplicationInternalNote,
  ApplicationInternalNoteInput,
  ApplicationInternalNoteRevision,
  ApplicationInternalNoteUpdateInput,
  CancelInformationRequestInput,
  InformationRequest,
  InformationRequestInput,
  InformationRequestUpdateInput,
  EmployerTestAttempt,
  EmployerTestEvaluationInput,
  EmployerInterviewInput,
  EmployerInterviewEvaluationInput,
} from "../types/employerApplicants.types"

export const employerApplicantsService = {
  async list(
    jobId: string | number,
    page = 1,
    perPage = 15,
  ): Promise<EmployerCollection<EmployerApplicantDetail>> {
    return unwrapEmployerCollection<EmployerApplicantDetail>(
      await api.get(API_ENDPOINTS.jobs.applications(jobId), {
        params: { page, per_page: perPage },
      }),
    )
  },

  async updateStatus(
    applicationId: string | number,
    input: ApplicationStatusChangeInput,
  ): Promise<EmployerApplicantDetail> {
    return unwrapEmployerEntity<EmployerApplicantDetail>(
      await api.post(API_ENDPOINTS.applications.status(applicationId), input),
    )
  },

  async listTests(
    applicationId: string | number,
  ): Promise<EmployerCollection<EmployerTestAttempt>> {
    return unwrapEmployerCollection<EmployerTestAttempt>(
      await api.get(API_ENDPOINTS.applications.tests(applicationId)),
    )
  },

  async evaluateAttempt(
    attemptId: string | number,
    input: EmployerTestEvaluationInput,
  ): Promise<EmployerTestAttempt> {
    return unwrapEmployerEntity<EmployerTestAttempt>(
      await api.post(API_ENDPOINTS.tests.evaluate(attemptId), input),
    )
  },

  async scheduleInterview(
    applicationId: string | number,
    input: EmployerInterviewInput,
  ): Promise<void> {
    await api.post(API_ENDPOINTS.interviews.forApplication(applicationId), input)
  },

  async evaluateInterview(
    interviewId: string | number,
    input: EmployerInterviewEvaluationInput,
  ): Promise<void> {
    await api.post(API_ENDPOINTS.interviews.evaluate(interviewId), input)
  },

  async listInternalNotes(
    applicationId: string | number,
    page = 1,
    includeDeleted = false,
  ): Promise<EmployerCollection<ApplicationInternalNote>> {
    return unwrapEmployerCollection<ApplicationInternalNote>(
      await api.get(API_ENDPOINTS.applications.internalNotes(applicationId), {
        params: { page, per_page: 15, include_deleted: includeDeleted || undefined },
      }),
    )
  },

  async createInternalNote(
    applicationId: string | number,
    input: ApplicationInternalNoteInput,
  ): Promise<ApplicationInternalNote> {
    return unwrapEmployerEntity<ApplicationInternalNote>(
      await api.post(API_ENDPOINTS.applications.internalNotes(applicationId), input),
    )
  },

  async getInternalNote(noteId: string | number): Promise<ApplicationInternalNote> {
    return unwrapEmployerEntity<ApplicationInternalNote>(
      await api.get(API_ENDPOINTS.applicationInternalNotes.byId(noteId)),
    )
  },

  async updateInternalNote(
    noteId: string | number,
    input: ApplicationInternalNoteUpdateInput,
  ): Promise<ApplicationInternalNote> {
    return unwrapEmployerEntity<ApplicationInternalNote>(
      await api.patch(API_ENDPOINTS.applicationInternalNotes.byId(noteId), input),
    )
  },

  async deleteInternalNote(noteId: string | number, version: number): Promise<void> {
    await api.delete(API_ENDPOINTS.applicationInternalNotes.byId(noteId), {
      data: { version },
    })
  },

  async listInternalNoteRevisions(
    noteId: string | number,
  ): Promise<ApplicationInternalNoteRevision[]> {
    return unwrapEmployerEntity<ApplicationInternalNoteRevision[]>(
      await api.get(API_ENDPOINTS.applicationInternalNotes.revisions(noteId)),
    )
  },

  async getById(applicationId: string | number): Promise<EmployerApplicantDetail> {
    return unwrapEmployerEntity<EmployerApplicantDetail>(
      await api.get(API_ENDPOINTS.applications.byId(applicationId)),
    )
  },

  async createInformationRequest(
    applicationId: string | number,
    input: InformationRequestInput,
  ): Promise<InformationRequest> {
    return unwrapEmployerEntity<InformationRequest>(
      await api.post(API_ENDPOINTS.applications.informationRequests(applicationId), input),
    )
  },

  async listInformationRequests(
    applicationId: string | number,
  ): Promise<EmployerCollection<InformationRequest>> {
    return unwrapEmployerCollection<InformationRequest>(
      await api.get(API_ENDPOINTS.applications.informationRequests(applicationId)),
    )
  },

  async getInformationRequest(id: string | number): Promise<InformationRequest> {
    return unwrapEmployerEntity<InformationRequest>(
      await api.get(API_ENDPOINTS.informationRequests.byId(id)),
    )
  },

  async updateInformationRequest(
    id: string | number,
    input: InformationRequestUpdateInput,
  ): Promise<InformationRequest> {
    return unwrapEmployerEntity<InformationRequest>(
      await api.patch(API_ENDPOINTS.informationRequests.byId(id), input),
    )
  },

  async cancelInformationRequest(
    id: string | number,
    input: CancelInformationRequestInput,
  ): Promise<InformationRequest> {
    return unwrapEmployerEntity<InformationRequest>(
      await api.post(API_ENDPOINTS.informationRequests.cancel(id), input),
    )
  },

  async downloadInformationResponseAttachment(id: string | number): Promise<Blob> {
    const response = await rawApi.get(
      API_ENDPOINTS.informationRequests.responseAttachmentDownload(id),
      {
        responseType: "blob",
      },
    )
    return response.data
  },
}
