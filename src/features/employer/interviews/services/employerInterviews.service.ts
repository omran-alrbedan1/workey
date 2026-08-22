import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapEmployerCollection,
  unwrapEmployerEntity,
  type EmployerCollection,
} from "@/features/employer/shared/services/employerResponse.utils"
import type {
  EmployerInterview,
  EmployerInterviewAttendanceInput,
  EmployerInterviewCancelInput,
  EmployerInterviewInput,
  EmployerInterviewHistoryItem,
  EmployerInterviewNoShowInput,
  EmployerInterviewRescheduleInput,
  EmployerInterviewScheduleHistoryItem,
  EmployerInterviewUpdateInput,
  EmployerInterviewCompleteInput,
  EmployerInterviewEvaluateInput,
} from "../types/employerInterviews.types"
import type {
  VideoSessionResponse,
} from "../types/videoInterview.types"

function normalizeVideoSession(response: unknown): VideoSessionResponse {
  const session = unwrapEmployerEntity<VideoSessionResponse>(response)
  const token = session.token ?? session.access_token ?? session.livekit_token
  const url = session.url ?? session.livekit_url ?? session.ws_url ?? session.server_url

  return {
    ...session,
    token,
    url,
    room: session.room ?? session.room_name,
  }
}

export const employerInterviewsService = {
  async listForApplication(applicationId: string | number): Promise<EmployerCollection<EmployerInterview>> {
    return unwrapEmployerCollection<EmployerInterview>(
      await api.get(API_ENDPOINTS.interviews.forApplication(applicationId)),
    )
  },

  async get(interviewId: string | number): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.get(API_ENDPOINTS.interviews.byId(interviewId)),
    )
  },

  async create(applicationId: string | number, input: EmployerInterviewInput): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.post(API_ENDPOINTS.interviews.forApplication(applicationId), input),
    )
  },

  async update(interviewId: string | number, input: EmployerInterviewUpdateInput): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.put(API_ENDPOINTS.interviews.byId(interviewId), input),
    )
  },

  async reschedule(
    interviewId: string | number,
    input: EmployerInterviewRescheduleInput,
  ): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.post(API_ENDPOINTS.interviews.reschedule(interviewId), input),
    )
  },

  async cancel(
    interviewId: string | number,
    input: EmployerInterviewCancelInput,
  ): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.post(API_ENDPOINTS.interviews.cancel(interviewId), input),
    )
  },

  async recordAttendance(
    interviewId: string | number,
    input: EmployerInterviewAttendanceInput,
  ): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.put(API_ENDPOINTS.interviews.attendance(interviewId), input),
    )
  },

  async markNoShow(
    interviewId: string | number,
    input: EmployerInterviewNoShowInput,
  ): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.post(API_ENDPOINTS.interviews.noShow(interviewId), input),
    )
  },

  async getStatusHistory(
    interviewId: string | number,
    page = 1,
  ): Promise<EmployerCollection<EmployerInterviewHistoryItem>> {
    return unwrapEmployerCollection<EmployerInterviewHistoryItem>(
      await api.get(API_ENDPOINTS.interviews.statusHistory(interviewId), {
        params: { page, per_page: 25 },
      }),
    )
  },

  async getScheduleHistory(
    interviewId: string | number,
    page = 1,
  ): Promise<EmployerCollection<EmployerInterviewScheduleHistoryItem>> {
    return unwrapEmployerCollection<EmployerInterviewScheduleHistoryItem>(
      await api.get(API_ENDPOINTS.interviews.scheduleHistory(interviewId), {
        params: { page, per_page: 25 },
      }),
    )
  },

  async remove(interviewId: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.interviews.byId(interviewId))
  },

  async complete(interviewId: string | number, input: EmployerInterviewCompleteInput): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.post(API_ENDPOINTS.interviews.complete(interviewId), input),
    )
  },

  async evaluate(interviewId: string | number, input: EmployerInterviewEvaluateInput): Promise<EmployerInterview> {
    return unwrapEmployerEntity<EmployerInterview>(
      await api.post(API_ENDPOINTS.interviews.evaluate(interviewId), input),
    )
  },

  async createVideoSession(
    interviewId: string | number,
  ): Promise<VideoSessionResponse> {
    return normalizeVideoSession(
      await api.post(API_ENDPOINTS.interviews.videoSession(interviewId)),
    )
  },
}
