import { cn } from "@/lib/utils"
import { Loader2, LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

interface LoadingStateProps {
  message?: string
  icon?: LucideIcon
  className?: string
  size?: "sm" | "md" | "lg"
}

const sizeStyles = {
  sm: { container: "py-8 gap-2", icon: "h-4 w-4", text: "text-xs" },
  md: { container: "py-12 gap-3", icon: "h-6 w-6", text: "text-sm" },
  lg: { container: "py-16 gap-4", icon: "h-8 w-8", text: "text-base" },
}

export default function LoadingState({
  message,
  icon: Icon = Loader2,
  className,
  size = "md",
}: LoadingStateProps) {
  const { t } = useTranslation("common")
  const styles = sizeStyles[size]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center text-text-muted",
        styles.container,
        className,
      )}
    >
      <Icon className={cn("animate-spin text-primary", styles.icon)} />
      <p className={cn("font-medium", styles.text)}>
        {message || t("loading")}
      </p>
    </div>
  )
}
