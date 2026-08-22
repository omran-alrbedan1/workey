import { API_ENDPOINTS } from "@/config"
import { api } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection } from "@/features/admin/shared/types/adminApi.types"
import type {
  ReorderQuestionsInput,
  TestQuestionInput,
  TestQuestionResponse,
} from "@/features/employer/tests/types/employerTests.types"
import type {
  AdminTestInput,
  AdminTestRecord,
  AdminTestUpdateInput,
} from "../types/adminTests.types"
export const adminTestsService = {
  async list(): Promise<AdminCollection<AdminTestRecord>> {
    return unwrapCollection<AdminTestRecord>(await api.get(API_ENDPOINTS.admin.tests))
  },
  async create(input: AdminTestInput): Promise<AdminTestRecord> {
    return unwrapEntity<AdminTestRecord>(await api.post(API_ENDPOINTS.admin.tests, input))
  },
  async update({ id, ...input }: AdminTestUpdateInput): Promise<AdminTestRecord> {
    return unwrapEntity<AdminTestRecord>(await api.put(API_ENDPOINTS.admin.testById(id), input))
  },
  async remove(id: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.admin.testById(id))
  },
  async createQuestion(
    testId: string | number,
    input: TestQuestionInput,
  ): Promise<TestQuestionResponse> {
    return unwrapEntity<TestQuestionResponse>(
      await api.post(API_ENDPOINTS.tests.questions.create(testId), input),
    )
  },
  async getQuestions(testId: string | number): Promise<TestQuestionResponse[]> {
    return unwrapEntity<TestQuestionResponse[]>(
      await api.get(API_ENDPOINTS.tests.questions.list(testId)),
    )
  },
  async updateQuestion(
    testId: string | number,
    questionId: string | number,
    input: Partial<TestQuestionInput>,
  ): Promise<TestQuestionResponse> {
    return unwrapEntity<TestQuestionResponse>(
      await api.put(API_ENDPOINTS.tests.questions.byId(testId, questionId), input),
    )
  },
  async reorderQuestions(testId: string | number, input: ReorderQuestionsInput): Promise<void> {
    await api.post(API_ENDPOINTS.tests.questions.reorder(testId), input)
  },
  async deleteQuestion(testId: string | number, questionId: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.tests.questions.byId(testId, questionId))
  },
}
