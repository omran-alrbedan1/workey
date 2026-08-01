import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Clock, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PageHeaderProps {
  title: string
  description?: string
  showBackButton?: boolean
  backButtonLabel?: string
  onBackClick?: () => void
  rightContent?: React.ReactNode
  image?: {
    src: string
    alt: string
    className?: string
    position?: "left" | "right"
  }
  gradient?: string
  className?: string
  icon?: LucideIcon
  count?: number
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  showBackButton = false,
  backButtonLabel,
  onBackClick,
  rightContent,
  image,
  gradient = "from-primary/10 via-primary/5 to-transparent",
  className = "",
  icon: Icon,
  count,
}) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      navigate(-1)
    }
  }

  const currentDate = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  }
  const formattedDate = currentDate.toLocaleDateString(undefined, dateOptions)

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${gradient} border border-border/50 ${className}`}
    >
      {/* Top-right corner absolute positioned element for three dots */}
      {rightContent && (
        <div className="absolute top-4 rtl:left-4 ltr:right-4 z-20">{rightContent}</div>
      )}

      <div className="flex items-center justify-between p-6 relative z-10">
        {/* Left side content */}
        <div className="flex-1 space-y-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="mb-1 -ms-2 text-text-secondary hover:text-text transition-all duration-200 hover:translate-x-[-2px] rtl:hover:translate-x-[2px]"
            >
              <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" />
              {backButtonLabel || "Back"}
            </Button>
          )}

          <div className="space-y-2">
            {/* Title */}
            <div className="flex items-center gap-3 pe-12">
              {Icon && (
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent text-start">
                {title}
              </h1>
              {typeof count === "number" && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {count.toLocaleString()}
                </Badge>
              )}
            </div>

            {/* Description and metadata */}
            <div className="space-y-1.5">
              {description && (
                <p className="text-sm text-text-muted max-w-2xl pe-12 text-start">{description}</p>
              )}

              {/* Date display */}
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-primary" />
                  <span>
                    {currentDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image section */}
        {image && (
          <div className="flex items-center gap-4">
            <div
              className={`flex-shrink-0 pointer-events-none ${
                image.position === "left" ? "order-first" : ""
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`hidden md:block sm:h-56 -my-12 sm:w-56 object-contain transition-transform duration-300 hover:scale-105 ${image.className || ""}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
