import { API_ENDPOINTS } from "@/config"
import { api, rawApi } from "@/lib/api"
import {
  unwrapEmployerCollection,
  unwrapEmployerEntity,
  type EmployerCollection,
} from "@/features/employer/shared/services/employerResponse.utils"
import type {
  AssignmentDeadlineHistoryItem,
  AssignmentDeadlineInput,
  BulkManualGradingInput,
  EmployerTest,
  EmployerTestInput,
  GrantRetakeInput,
  ManualGradingInput,
  ReorderOptionsInput,
  ReorderQuestionsInput,
  RetakePolicyInput,
  TestAssignmentSeriesResponse,
  TestAttemptAnswer,
  TestAttemptResult,
  TestQuestion,
  TestQuestionInput,
  TestQuestionOption,
  TestQuestionOptionInput,
  TestQuestionResponse,
} from "../types/employerTests.types"

export const employerTestsService = {
  async list(page = 1): Promise<EmployerCollection<EmployerTest>> {
    return unwrapEmployerCollection<EmployerTest>(
      await api.get(API_ENDPOINTS.tests.list, { params: { page, per_page: 15 } }),
    )
  },
  async get(id: string | number): Promise<EmployerTest> {
    return unwrapEmployerEntity<EmployerTest>(await api.get(API_ENDPOINTS.tests.byId(id)))
  },
  async getQuestions(testId: string | number): Promise<TestQuestionResponse[]> {
    const data = await api.get(API_ENDPOINTS.tests.questions.list(testId))
    return unwrapEmployerEntity<TestQuestionResponse[]>(data)
  },
  async create(input: EmployerTestInput): Promise<EmployerTest> {
    return unwrapEmployerEntity<EmployerTest>(await api.post(API_ENDPOINTS.tests.create, input))
  },
  async update(id: string | number, input: EmployerTestInput): Promise<EmployerTest> {
    return unwrapEmployerEntity<EmployerTest>(await api.patch(API_ENDPOINTS.tests.byId(id), input))
  },
  async patch(id: string | number, input: Partial<EmployerTestInput>): Promise<EmployerTest> {
    return unwrapEmployerEntity<EmployerTest>(await api.patch(API_ENDPOINTS.tests.byId(id), input))
  },
  async remove(id: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.tests.byId(id))
  },
  async assignTest(
    applicationId: string | number,
    testId: string | number,
    note?: string,
    options: { deadline_at?: string | null; max_attempts?: number; instructions?: string } = {},
  ): Promise<void> {
    await api.post(API_ENDPOINTS.applications.assignTest(applicationId), {
      test_id: testId,
      note,
      ...options,
    })
  },

  async createQuestion(
    testId: string | number,
    input: TestQuestionInput,
  ): Promise<TestQuestionResponse> {
    return unwrapEmployerEntity<TestQuestionResponse>(
      await api.post(API_ENDPOINTS.tests.questions.create(testId), input),
    )
  },

  async updateQuestion(
    testId: string | number,
    questionId: string | number,
    input: Partial<TestQuestionInput>,
  ): Promise<TestQuestionResponse> {
    return unwrapEmployerEntity<TestQuestionResponse>(
      await api.patch(API_ENDPOINTS.tests.questions.byId(testId, questionId), input),
    )
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
    return unwrapEmployerEntity<TestQuestionResponse>(
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

  async reorderQuestions(
    testId: string | number,
    input: ReorderQuestionsInput,
  ): Promise<TestQuestionResponse[]> {
    return unwrapEmployerEntity<TestQuestionResponse[]>(
      await api.post(API_ENDPOINTS.tests.questions.reorder(testId), input),
    )
  },

  async addQuestionOption(
    testId: string | number,
    questionId: string | number,
    input: TestQuestionOptionInput,
  ): Promise<TestQuestionOption> {
    return unwrapEmployerEntity<TestQuestionOption>(
      await api.post(API_ENDPOINTS.tests.questions.options(testId, questionId), input),
    )
  },

  async updateQuestionOption(
    testId: string | number,
    questionId: string | number,
    optionId: string | number,
    input: Partial<TestQuestionOptionInput>,
  ): Promise<TestQuestionOption> {
    return unwrapEmployerEntity<TestQuestionOption>(
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
    return unwrapEmployerEntity<TestQuestionOption[]>(
      await api.post(API_ENDPOINTS.tests.questions.reorderOptions(testId, questionId), input),
    )
  },

  async getAttemptAnswers(attemptId: string | number): Promise<TestAttemptAnswer[]> {
    return unwrapEmployerEntity<TestAttemptAnswer[]>(
      await api.get(API_ENDPOINTS.testAttempts.answers(attemptId)),
    )
  },

  async getAttemptResult(attemptId: string | number): Promise<TestAttemptResult> {
    return unwrapEmployerEntity<TestAttemptResult>(
      await api.get(API_ENDPOINTS.testAttempts.result(attemptId)),
    )
  },

  async downloadAnswerFile(attemptId: string | number, questionId: string | number): Promise<Blob> {
    const response = await rawApi.get(
      API_ENDPOINTS.testAttempts.answerFile(attemptId, questionId),
      {
        responseType: "blob",
      },
    )
    return response.data
  },

  async gradeAnswer(
    attemptId: string | number,
    questionId: string | number,
    input: ManualGradingInput,
  ): Promise<TestAttemptAnswer> {
    return unwrapEmployerEntity<TestAttemptAnswer>(
      await api.put(API_ENDPOINTS.testAttempts.grading(attemptId, questionId), input),
    )
  },

  async updateAnswerGrade(
    attemptId: string | number,
    questionId: string | number,
    input: Partial<ManualGradingInput>,
  ): Promise<TestAttemptAnswer> {
    return unwrapEmployerEntity<TestAttemptAnswer>(
      await api.patch(API_ENDPOINTS.testAttempts.grading(attemptId, questionId), input),
    )
  },

  async removeAnswerGrade(attemptId: string | number, questionId: string | number): Promise<void> {
    await api.delete(API_ENDPOINTS.testAttempts.grading(attemptId, questionId))
  },

  async bulkGradeAnswers(
    attemptId: string | number,
    input: BulkManualGradingInput,
  ): Promise<TestAttemptResult> {
    return unwrapEmployerEntity<TestAttemptResult>(
      await api.post(API_ENDPOINTS.testAttempts.bulkGradings(attemptId), input),
    )
  },

  async updateAssignmentDeadline(
    assignmentId: string | number,
    input: AssignmentDeadlineInput,
  ): Promise<void> {
    await api.patch(API_ENDPOINTS.testAssignments.deadline(assignmentId), input)
  },

  async getDeadlineHistory(
    assignmentId: string | number,
  ): Promise<AssignmentDeadlineHistoryItem[]> {
    return unwrapEmployerEntity<AssignmentDeadlineHistoryItem[]>(
      await api.get(API_ENDPOINTS.testAssignments.deadlineHistory(assignmentId)),
    )
  },

  async updateRetakePolicy(assignmentId: string | number, input: RetakePolicyInput): Promise<void> {
    await api.patch(API_ENDPOINTS.testAssignments.retakePolicy(assignmentId), input)
  },

  async grantRetake(assignmentId: string | number, input: GrantRetakeInput = {}): Promise<void> {
    await api.post(API_ENDPOINTS.testAssignments.retake(assignmentId), input)
  },

  async getAttemptSeries(assignmentId: string | number): Promise<TestAssignmentSeriesResponse> {
    return unwrapEmployerEntity<TestAssignmentSeriesResponse>(
      await api.get(API_ENDPOINTS.testAssignments.attemptSeries(assignmentId)),
    )
  },
}
