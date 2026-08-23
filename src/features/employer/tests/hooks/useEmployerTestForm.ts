import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { showErrorToast } from "@/lib/toast"
import { employerTestsService } from "../services/employerTests.service"
import type {
  EmployerTest,
  EmployerTestInput,
  TestQuestion,
} from "../types/employerTests.types"
import {
  createEmployerTestSchema,
  type EmployerTestFormValues,
} from "../validation/employerTests.validation"
import {
  buildDraftTestInput,
  buildFinalTestInput,
  byOrderIndex,
  calculateMaxScore,
  getEmployerTestFormDefaults,
  getEmployerTestFormInitialValues,
  needsReorder,
  normalizeQuestions,
  TEST_FORM_STEP_ONE_FIELDS,
  TEST_FORM_STEP_THREE_FIELDS,
  toQuestionFormValue,
  toQuestionPayload,
} from "../utils/employerTestForm"

export function useEmployerTestForm({
  test,
  onSubmit,
  onComplete,
}: {
  test?: EmployerTest | null
  onSubmit: (input: EmployerTestInput) => Promise<unknown>
  onComplete?: () => void
}) {
  const { t } = useTranslation("employerTests")
  const [currentStep, setCurrentStep] = useState(1)
  const [createdTestId, setCreatedTestId] = useState<string | number | undefined>(test?.id)

  const employerTestSchema = createEmployerTestSchema(t)
  const form = useForm<EmployerTestFormValues>({
    resolver: zodResolver(employerTestSchema) as Resolver<EmployerTestFormValues>,
    defaultValues: getEmployerTestFormDefaults(),
  })

  const questions = form.watch("questions") ?? []
  const calculatedMaxScore = useMemo(() => calculateMaxScore(questions), [questions])

  useEffect(() => {
    if (calculatedMaxScore <= 0) return

    const currentPassingScore = form.getValues("passing_score")
    if (currentPassingScore !== undefined && currentPassingScore > calculatedMaxScore) {
      form.setValue("passing_score", calculatedMaxScore)
    }
  }, [calculatedMaxScore, form])

  useEffect(() => {
    form.reset(getEmployerTestFormInitialValues(test))
    setCreatedTestId(test?.id)
    setCurrentStep(1)
  }, [form, test])

  const saveQuestions = async (testId: string | number, nextQuestions: TestQuestion[]) => {
    const savedQuestions: TestQuestion[] = []
    const orderedQuestions = normalizeQuestions(nextQuestions)
    const serverQuestions = (await employerTestsService.getQuestions(testId)).sort(byOrderIndex)
    const serverQuestionById = new Map(
      serverQuestions.map((question) => [String(question.id), question]),
    )
    const usedServerQuestionIds = new Set<string>()
    const highestServerOrder = serverQuestions.reduce(
      (highest, question) => Math.max(highest, Number(question.order_index) || 0),
      -1,
    )
    let createdCount = 0

    for (let index = 0; index < orderedQuestions.length; index += 1) {
      const question = orderedQuestions[index]
      const matchedQuestion =
        question.id != null
          ? serverQuestionById.get(String(question.id))
          : serverQuestions.find((serverQuestion, serverIndex) => {
              const id = String(serverQuestion.id)
              return serverIndex === index && !usedServerQuestionIds.has(id)
            })

      if (matchedQuestion?.id) {
        usedServerQuestionIds.add(String(matchedQuestion.id))
        const savedQuestion = await employerTestsService.updateQuestion(
          testId,
          matchedQuestion.id,
          toQuestionPayload(question, index, matchedQuestion.order_index),
        )
        savedQuestions.push({
          ...question,
          ...toQuestionFormValue(savedQuestion),
        })
      } else {
        const orderIndex = highestServerOrder + createdCount + 1
        const savedQuestion = await employerTestsService.createQuestion(
          testId,
          toQuestionPayload(question, index, orderIndex),
        )
        createdCount += 1
        savedQuestions.push(toQuestionFormValue(savedQuestion))
      }

      form.setValue(
        "questions",
        [...savedQuestions, ...orderedQuestions.slice(index + 1)] as EmployerTestFormValues["questions"],
        { shouldValidate: false },
      )
    }

    if (
      savedQuestions.length > 1 &&
      savedQuestions.every((question) => question.id) &&
      needsReorder(savedQuestions)
    ) {
      try {
        await employerTestsService.reorderQuestions(testId, {
          questions: savedQuestions.map((question, index) => ({
            question_id: question.id!,
            order_index: index,
          })),
        })
      } catch (error) {
        console.warn("Question reorder failed after questions were saved.", error)
      }
    }

    form.setValue(
      "questions",
      savedQuestions.map((question) => ({
        ...question,
        is_required: question.is_required ?? true,
      })) as EmployerTestFormValues["questions"],
      { shouldValidate: false },
    )
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger(TEST_FORM_STEP_ONE_FIELDS)
      if (!isValid) return

      try {
        if (!createdTestId) {
          const createdTest = (await onSubmit(buildDraftTestInput(form.getValues()))) as EmployerTest
          if (createdTest?.id) setCreatedTestId(createdTest.id)
        }
        setCurrentStep(2)
      } catch (error) {
        showErrorToast(error)
      }
      return
    }

    if (currentStep === 2) {
      const currentQuestions = normalizeQuestions(form.getValues("questions") as TestQuestion[])
      form.setValue("questions", currentQuestions as EmployerTestFormValues["questions"], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      })

      const isValid = await form.trigger("questions")
      if (!isValid) {
        showErrorToast(t("validation.questionsInvalid"))
        return
      }

      try {
        if (createdTestId && currentQuestions.length > 0) {
          await saveQuestions(createdTestId, currentQuestions)
        }
        setCurrentStep(3)
      } catch (error) {
        showErrorToast(error)
      }
      return
    }

    if (currentStep === 3) {
      const isValid = await form.trigger(TEST_FORM_STEP_THREE_FIELDS)
      if (!isValid) return
      setCurrentStep(4)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const goToStep = (step: number) => {
    if (step < currentStep) setCurrentStep(step)
  }

  const handleFinalSubmit = async () => {
    try {
      const input = buildFinalTestInput(form.getValues())

      if (test?.id) {
        await onSubmit(input)
        return
      }

      if (createdTestId) {
        await employerTestsService.patch(createdTestId, input)
        onComplete?.()
      }
    } catch (error) {
      showErrorToast(error)
    }
  }

  const setQuestions = (nextQuestions: TestQuestion[]) => {
    form.clearErrors("questions")
    form.setValue("questions", normalizeQuestions(nextQuestions) as EmployerTestFormValues["questions"], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    })
  }

  return {
    form,
    questions,
    currentStep,
    createdTestId,
    calculatedMaxScore,
    setQuestions,
    handleNext,
    handleBack,
    goToStep,
    handleFinalSubmit,
  }
}
