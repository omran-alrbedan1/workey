import { cn } from "@/lib/utils"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

interface PartialErrorProps {
  message?: string
  retry?: () => void
  className?: string
}

export default function PartialError({ message, retry, className }: PartialErrorProps) {
  const { t } = useTranslation("common")

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
        className,
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <p className="flex-1">
        {message || t("errors.partialLoadError", "Some data could not be loaded.")}
      </p>
      {retry && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
          onClick={retry}
        >
          <RefreshCw className="h-3 w-3" />
          {t("retry")}
        </Button>
      )}
    </div>
  )
}
