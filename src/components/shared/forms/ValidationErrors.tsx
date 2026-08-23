import { useTranslation } from "react-i18next"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ApiError } from "@/lib/api"

interface ValidationErrorsProps {
  error?: ApiError | null
  className?: string
}

export default function ValidationErrors({ error, className }: ValidationErrorsProps) {
  const { t } = useTranslation("common")

  if (!error?.errors || typeof error.errors !== "object") {
    return null
  }

  const errors = error.errors

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-red-600">
        <AlertCircle className="h-4 w-4" />
        {t("errors.validationError")}
      </div>
      <ul className="space-y-1 text-sm text-red-600">
        {Object.entries(errors).map(([field, messages]) => (
          <li key={field} className="flex flex-col">
            <span className="font-mono text-xs font-medium text-red-700">{field}</span>
            {Array.isArray(messages) ? (
              messages.map((message, index) => (
                <span key={index} className="text-red-500">
                  - {message}
                </span>
              ))
            ) : (
              <span className="text-red-500">- {String(messages)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
