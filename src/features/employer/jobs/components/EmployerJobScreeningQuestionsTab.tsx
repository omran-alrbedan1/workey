import EmployerJobScreeningQuestions from "./EmployerJobScreeningQuestions"

interface EmployerJobScreeningQuestionsTabProps {
  questions: any[]
  isLoading: boolean
  isPending: boolean
  onCreate: (input: any) => Promise<unknown>
  onUpdate: (questionId: string | number, input: any) => Promise<unknown>
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
