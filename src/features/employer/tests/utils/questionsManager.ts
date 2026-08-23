import type {
  TestQuestion,
  TestQuestionOption,
  TestQuestionOptionInput,
} from "../types/employerTests.types"

export interface QuestionService {
  addQuestionOption(
    testId: string | number,
    questionId: string | number,
    input: TestQuestionOptionInput,
  ): Promise<TestQuestionOption>
  updateQuestionOption(
    testId: string | number,
    questionId: string | number,
    optionId: string | number,
    input: Partial<TestQuestionOptionInput>,
  ): Promise<TestQuestionOption>
  deleteQuestionOption(
    testId: string | number,
    questionId: string | number,
    optionId: string | number,
  ): Promise<void>
  reorderQuestionOptions(
    testId: string | number,
    questionId: string | number,
    input: { options: Array<{ option_id: string | number; order_index: number }> },
  ): Promise<TestQuestionOption[]>
  uploadQuestionImage?(
    testId: string | number,
    questionId: string | number,
    image: File,
  ): Promise<unknown>
  downloadQuestionImage?(testId: string | number, questionId: string | number): Promise<Blob>
  deleteQuestionImage?(testId: string | number, questionId: string | number): Promise<void>
}

export const choiceTypes: TestQuestion["question_type"][] = [
  "single_choice",
  "multiple_choice",
  "true_false",
]

export function normalizeOption(option: TestQuestionOption, index: number): TestQuestionOption {
  return {
    id: option.id,
    test_question_id: option.test_question_id,
    option_text: option.option_text,
    order_index: option.order_index ?? index,
    is_correct: Boolean(option.is_correct),
  }
}

export function normalizeOptions(options: TestQuestion["options"] = []): TestQuestionOption[] {
  return options.map((option, index) => normalizeOption(option, index))
}

export function trueFalseOptions(correctValue: "true" | "false" = "true"): TestQuestionOption[] {
  return [
    { option_text: "True", order_index: 0, is_correct: correctValue === "true" },
    { option_text: "False", order_index: 1, is_correct: correctValue === "false" },
  ]
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function errorAt(value: unknown, key: string | number): unknown {
  if (Array.isArray(value)) return value[Number(key)]
  if (isRecord(value)) return value[key]
  return undefined
}

export function errorMessage(value: unknown): string | undefined {
  if (!value) return undefined
  if (isRecord(value) && typeof value.message === "string") return value.message
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = errorMessage(item)
      if (message) return message
    }
  }
  if (isRecord(value)) {
    for (const item of Object.values(value)) {
      const message = errorMessage(item)
      if (message) return message
    }
  }
  return undefined
}

export function calculateQuestionsTotalPoints(questions: TestQuestion[]) {
  return questions.reduce((sum, question) => sum + (Number(question.points) || 0), 0)
}
