import EmployerJobScreeningQuestions from "./EmployerJobScreeningQuestions"
import type { JobScreeningQuestion, JobScreeningQuestionInput } from "../types/employerJobs.types"

interface EmployerJobScreeningQuestionsTabProps {
  questions: JobScreeningQuestion[]
  isLoading: boolean
  isPending: boolean
  onCreate: (input: JobScreeningQuestionInput) => Promise<unknown>
  onUpdate: (
    questionId: string | number,
    input: Partial<JobScreeningQuestionInput>,
  ) => Promise<unknown>
  onDelete: (questionId: string | number) => Promise<unknown>
}

export default function EmployerJobScreeningQuestionsTab({
  questions,
  isLoading,
  isPending,
  onCreate,
  onUpdate,
  onDelete,
}: EmployerJobScreeningQuestionsTabProps) {
  return (
    <EmployerJobScreeningQuestions
      questions={questions}
      isLoading={isLoading}
      isPending={isPending}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  )
}
