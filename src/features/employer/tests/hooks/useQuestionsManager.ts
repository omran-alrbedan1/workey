import { useCallback, useMemo } from "react"
import { employerTestsService } from "../services/employerTests.service"
import type {
  TestQuestion,
  TestQuestionOption,
} from "../types/employerTests.types"
import {
  calculateQuestionsTotalPoints,
  normalizeOption,
  normalizeOptions,
  trueFalseOptions,
  type QuestionService,
} from "../utils/questionsManager"

export function useQuestionsManager({
  questions,
  onChange,
  testId,
  testService,
}: {
  questions: TestQuestion[]
  onChange: (questions: TestQuestion[]) => void
  testId?: string | number
  testService?: QuestionService
}) {
  const questionService = testService ?? employerTestsService

  const replaceQuestion = useCallback(
    (index: number, nextQuestion: TestQuestion) => {
      onChange(questions.map((question, questionIndex) => (questionIndex === index ? nextQuestion : question)))
    },
    [onChange, questions],
  )

  const updateQuestion = useCallback(
    (index: number, field: keyof TestQuestion, value: unknown) => {
      replaceQuestion(index, { ...questions[index], [field]: value })
    },
    [questions, replaceQuestion],
  )

  const addQuestion = useCallback(() => {
    onChange([
      ...questions,
      {
        question_text: "",
        question_type: "short_text",
        points: 1,
        order_index: questions.length,
        is_required: true,
        options: [],
      },
    ])
  }, [onChange, questions])

  const removeQuestion = useCallback(
    (index: number) => {
      onChange(
        questions
          .filter((_, questionIndex) => questionIndex !== index)
          .map((question, questionIndex) => ({ ...question, order_index: questionIndex })),
      )
    },
    [onChange, questions],
  )

  const moveQuestion = useCallback(
    (index: number, direction: "up" | "down") => {
      const target = direction === "up" ? index - 1 : index + 1
      if (target < 0 || target >= questions.length) return

      const updated = [...questions]
      const current = updated[index]
      updated[index] = { ...updated[target], order_index: index }
      updated[target] = { ...current, order_index: target }
      onChange(updated)
    },
    [onChange, questions],
  )

  const persistOption = useCallback(
    async (
      question: TestQuestion,
      option: TestQuestionOption,
      input: Partial<TestQuestionOption>,
    ) => {
      if (!testId || !question.id || !option.id) return option
      return questionService.updateQuestionOption(testId, question.id, option.id, input)
    },
    [questionService, testId],
  )

  const addOption = useCallback(
    async (questionIndex: number) => {
      const question = questions[questionIndex]
      const options = normalizeOptions(question.options)
      const draftOption: TestQuestionOption = {
        option_text: "",
        is_correct: false,
        order_index: options.length,
      }

      const option =
        testId && question.id
          ? await questionService.addQuestionOption(testId, question.id, {
              option_text: draftOption.option_text,
              order_index: draftOption.order_index ?? options.length,
              is_correct: draftOption.is_correct,
            })
          : draftOption

      replaceQuestion(questionIndex, {
        ...question,
        options: [...options, normalizeOption(option, options.length)],
      })
    },
    [questionService, questions, replaceQuestion, testId],
  )

  const updateOptionText = useCallback(
    async (questionIndex: number, optionIndex: number, text: string) => {
      const question = questions[questionIndex]
      const options = normalizeOptions(question.options)
      const current = options[optionIndex]
      if (!current) return

      const localOption = { ...current, option_text: text }
      const persistedOption = await persistOption(question, current, { option_text: text })
      const nextOptions = [...options]
      nextOptions[optionIndex] = normalizeOption(
        persistedOption.id ? persistedOption : localOption,
        optionIndex,
      )

      replaceQuestion(questionIndex, { ...question, options: nextOptions })
    },
    [persistOption, questions, replaceQuestion],
  )

  const setOptionCorrect = useCallback(
    async (questionIndex: number, optionIndex: number, checked: boolean) => {
      const question = questions[questionIndex]
      const options = normalizeOptions(question.options)
      const isSingleCorrect =
        question.question_type === "single_choice" || question.question_type === "true_false"

      const nextOptions = options.map((option, index) => ({
        ...option,
        is_correct: isSingleCorrect
          ? index === optionIndex && checked
          : index === optionIndex
            ? checked
            : option.is_correct,
      }))

      if (testId && question.id) {
        const changedOptions = nextOptions.filter(
          (option, index) => option.id && option.is_correct !== options[index]?.is_correct,
        )

        await Promise.all(
          changedOptions.map((option) =>
            questionService.updateQuestionOption(testId, question.id!, option.id!, {
              is_correct: option.is_correct,
            }),
          ),
        )
      }

      replaceQuestion(questionIndex, {
        ...question,
        options: nextOptions,
      })
    },
    [questionService, questions, replaceQuestion, testId],
  )

  const deleteOption = useCallback(
    async (questionIndex: number, optionIndex: number) => {
      const question = questions[questionIndex]
      const options = normalizeOptions(question.options)
      const option = options[optionIndex]
      if (!option) return

      if (testId && question.id && option.id) {
        await questionService.deleteQuestionOption(testId, question.id, option.id)
      }

      replaceQuestion(questionIndex, {
        ...question,
        options: options
          .filter((_, index) => index !== optionIndex)
          .map((item, index) => ({ ...item, order_index: index })),
      })
    },
    [questionService, questions, replaceQuestion, testId],
  )

  const moveOption = useCallback(
    async (questionIndex: number, optionIndex: number, direction: "up" | "down") => {
      const question = questions[questionIndex]
      const target = direction === "up" ? optionIndex - 1 : optionIndex + 1
      const options = normalizeOptions(question.options)
      if (target < 0 || target >= options.length) return

      const nextOptions = [...options]
      const current = nextOptions[optionIndex]
      nextOptions[optionIndex] = { ...nextOptions[target], order_index: optionIndex }
      nextOptions[target] = { ...current, order_index: target }

      const allOptionsHaveIds = nextOptions.every((option) => option.id)
      if (testId && question.id && allOptionsHaveIds) {
        const reordered = await questionService.reorderQuestionOptions(testId, question.id, {
          options: nextOptions.map((option, index) => ({
            option_id: option.id!,
            order_index: index,
          })),
        })
        replaceQuestion(questionIndex, { ...question, options: normalizeOptions(reordered) })
        return
      }

      replaceQuestion(questionIndex, { ...question, options: nextOptions })
    },
    [questionService, questions, replaceQuestion, testId],
  )

  const handleQuestionTypeChange = useCallback(
    (index: number, questionType: TestQuestion["question_type"]) => {
      const question = questions[index]
      const keepsOptions = questionType === "single_choice" || questionType === "multiple_choice"

      replaceQuestion(index, {
        ...question,
        question_type: questionType,
        options:
          questionType === "true_false"
            ? trueFalseOptions()
            : keepsOptions
              ? normalizeOptions(question.options)
              : [],
      })
    },
    [questions, replaceQuestion],
  )

  const totalPoints = useMemo(() => calculateQuestionsTotalPoints(questions), [questions])

  return {
    totalPoints,
    addQuestion,
    removeQuestion,
    moveQuestion,
    updateQuestion,
    addOption,
    updateOptionText,
    setOptionCorrect,
    deleteOption,
    moveOption,
    handleQuestionTypeChange,
  }
}
