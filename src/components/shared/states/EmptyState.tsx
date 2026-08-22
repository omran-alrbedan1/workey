import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { LucideIcon, Inbox, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  imageUrl?: string
  imageAlt?: string
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  children?: React.ReactNode
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  imageUrl,
  imageAlt,
  primaryAction,
  secondaryAction,
  className,
  children,
}) => {
  const { t } = useTranslation("common")
  const resolvedImageAlt = imageAlt ?? t("emptyState.imageAlt")

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "py-16 px-4 bg-card",
        className,
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={resolvedImageAlt}
          className="mb-6 h-40 w-52 object-contain sm:h-48"
        />
      ) : (
        <div className="mb-6 rounded-full bg-primary/10 p-4">
          <Icon className="h-16 w-16 text-primary/60" />
        </div>
      )}

      <h3 className="mb-2 text-xl font-semibold text-text-primary">{title}</h3>

      <p className="mb-6 max-w-md text-text-muted">{description}</p>

      {children}

      {primaryAction && (
        <Button onClick={primaryAction.onClick} className="gap-2 text-white">
          {primaryAction.icon && <primaryAction.icon className="w-4 h-4" />}
          {primaryAction.label}
        </Button>
      )}

      {secondaryAction && (
        <Button variant="ghost" onClick={secondaryAction.onClick} className="mt-3">
          {secondaryAction.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
