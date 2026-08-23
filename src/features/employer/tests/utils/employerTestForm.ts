import { ClipboardCheck, FileText, ListChecks, Target, type LucideIcon } from "lucide-react"
import type {
  EmployerTest,
  EmployerTestInput,
  TestQuestion,
  TestQuestionInput,
  TestQuestionOption,
  TestQuestionResponse,
  TestQuestionType,
} from "../types/employerTests.types"
import type { EmployerTestFormValues } from "../validation/employerTests.validation"

export const TEST_FORM_STEPS: Array<{ labelKey: string; icon: LucideIcon }> = [
  { labelKey: "wizard.stepInformation", icon: FileText },
  { labelKey: "wizard.stepQuestions", icon: ListChecks },
  { labelKey: "wizard.stepSettings", icon: Target },
  { labelKey: "wizard.stepReview", icon: ClipboardCheck },
]

export const TEST_FORM_TOTAL_STEPS = TEST_FORM_STEPS.length
export const TEST_FORM_STEP_ONE_FIELDS = ["title", "description"] as const
export const TEST_FORM_STEP_THREE_FIELDS = [
  "instructions",
  "duration_minutes",
  "passing_score",
  "is_active",
] as const

export const questionTypeLabelKeys: Record<TestQuestionType, string> = {
  single_choice: "questions.singleChoice",
  multiple_choice: "questions.multipleChoice",
  true_false: "questions.trueFalse",
  short_text: "questions.shortText",
  long_text: "questions.longText",
  file_upload: "questions.fileUpload",
}

export function getEmployerTestFormDefaults(): EmployerTestFormValues {
  return {
    title: "",
    description: "",
    instructions: "",
    duration_minutes: 60,
    passing_score: 0,
    is_active: true,
    questions: [],
  }
}

export function normalizeQuestions(questions: TestQuestion[]): TestQuestion[] {
  return questions.map((question, index) => ({
    ...question,
    question_text: question.question_text ?? "",
    order_index: index,
    points: Number(question.points),
    is_required: question.is_required ?? true,
    options: (question.options ?? []).map((option, optionIndex) => ({
      ...option,
      option_text: option.option_text ?? "",
      order_index: optionIndex,
      is_correct: Boolean(option.is_correct),
    })),
  }))
}

export function calculateMaxScore(questions: Array<{ points?: number }>) {
  return questions.reduce((sum, question) => sum + (Number(question.points) || 0), 0)
}

export function byOrderIndex(a: TestQuestionResponse, b: TestQuestionResponse): number {
  return Number(a.order_index) - Number(b.order_index)
}

export function needsReorder(questions: TestQuestion[]): boolean {
  return questions.some((question, index) => Number(question.order_index) !== index)
}

export function toQuestionFormValue(question: TestQuestionResponse): TestQuestion {
  return {
    id: question.id,
    test_id: question.test_id,
    question_text: question.question_text,
    question_type: question.question_type.key,
    order_index: question.order_index,
    points: Number(question.points),
    is_required: question.is_required ?? true,
    image_url: question.image_url,
    options: (question.options ?? []).map((option) => ({
      id: option.id,
      test_question_id: option.test_question_id,
      option_text: option.option_text,
      order_index: option.order_index,
      is_correct: Boolean(option.is_correct),
    })),
  }
}

export function toQuestionPayload(
  question: TestQuestion,
  index: number,
  orderIndex = question.order_index ?? index,
): TestQuestionInput {
  const payload: TestQuestionInput = {
    question_text: question.question_text,
    question_type: question.question_type,
    order_index: orderIndex,
    points: Number(question.points),
    is_required: question.is_required ?? true,
  }

  if (["single_choice", "multiple_choice", "true_false"].includes(question.question_type)) {
    payload.options =
      question.options?.map((option: TestQuestionOption, optionIndex: number) => ({
        option_text: option.option_text,
        order_index: option.order_index ?? optionIndex,
        is_correct: Boolean(option.is_correct),
      })) ?? []
  }

  return payload
}

export function getEmployerTestFormInitialValues(test?: EmployerTest | null): EmployerTestFormValues {
  if (!test) return getEmployerTestFormDefaults()

  return {
    title: test.title,
    description: test.description ?? "",
    instructions: test.instructions ?? "",
    duration_minutes: test.duration_minutes,
    passing_score: test.passing_score ?? 0,
    is_active: test.is_active,
    questions: (test.questions ?? []).map((question) =>
      toQuestionFormValue(question),
    ) as EmployerTestFormValues["questions"],
  }
}

export function buildDraftTestInput(values: EmployerTestFormValues): EmployerTestInput {
  return {
    title: values.title,
    description: values.description || undefined,
    instructions: values.instructions || undefined,
    duration_minutes: values.duration_minutes,
    is_active: false,
  }
}

export function buildFinalTestInput(values: EmployerTestFormValues): EmployerTestInput {
  return {
    title: values.title,
    description: values.description || undefined,
    instructions: values.instructions || undefined,
    duration_minutes: values.duration_minutes,
    passing_score: values.passing_score,
    is_active: values.is_active,
  }
}
