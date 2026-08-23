import { API_ENDPOINTS } from "@/config"
import { api, rawApi } from "@/lib/api"
import {
  unwrapCollection,
  unwrapEntity,
} from "@/features/admin/shared/services/adminResponse.utils"
import type { AdminCollection, AdminListParams } from "@/features/admin/shared/types/adminApi.types"
import type {
  ReorderOptionsInput,
  ReorderQuestionsInput,
  TestQuestionInput,
  TestQuestionOption,
  TestQuestionOptionInput,
  TestQuestionResponse,
} from "@/features/employer/tests/types/employerTests.types"
import type {
  AdminTestInput,
  AdminTestRecord,
  AdminTestUpdateInput,
} from "../types/adminTests.types"

export const adminTestsService = {
  async list(params: AdminListParams = {}): Promise<AdminCollection<AdminTestRecord>> {
    return unwrapCollection<AdminTestRecord>(await api.get(API_ENDPOINTS.admin.tests, { params }))
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
  async uploadQuestionImage(
    testId: string | number,
    questionId: string | number,
    image: File,
  ): Promise<TestQuestionResponse> {
    const formData = new FormData()
    formData.append("image", image)
    return unwrapEntity<TestQuestionResponse>(
      await api.post(API_ENDPOINTS.tests.questions.image(testId, questionId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    )
  },
  async downloadQuestionImage(testId: string | number, questionId: string | number): Promise<Blob> {
    const response = await rawApi.get(API_ENDPOINTS.tests.questions.image(testId, questionId), {
      responseType: "blob",
    })
    return response.data
  },
  async deleteQuestionImage(testId: string | number, questionId: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.tests.questions.image(testId, questionId))
  },
  async addQuestionOption(
    testId: string | number,
    questionId: string | number,
    input: TestQuestionOptionInput,
  ): Promise<TestQuestionOption> {
    return unwrapEntity<TestQuestionOption>(
      await api.post(API_ENDPOINTS.tests.questions.options(testId, questionId), input),
    )
  },
  async updateQuestionOption(
    testId: string | number,
    questionId: string | number,
    optionId: string | number,
    input: Partial<TestQuestionOptionInput>,
  ): Promise<TestQuestionOption> {
    return unwrapEntity<TestQuestionOption>(
      await api.patch(
        API_ENDPOINTS.tests.questions.optionById(testId, questionId, optionId),
        input,
      ),
    )
  },
  async deleteQuestionOption(
    testId: string | number,
    questionId: string | number,
    optionId: string | number,
  ): Promise<void> {
    await api.delete(API_ENDPOINTS.tests.questions.optionById(testId, questionId, optionId))
  },
  async reorderQuestionOptions(
    testId: string | number,
    questionId: string | number,
    input: ReorderOptionsInput,
  ): Promise<TestQuestionOption[]> {
    return unwrapEntity<TestQuestionOption[]>(
      await api.post(API_ENDPOINTS.tests.questions.reorderOptions(testId, questionId), input),
    )
  },
}
