import React from "react"
import { cn } from "@/lib/utils"

interface BaseFieldProps {
  children: React.ReactNode
  leftIcon?: React.ElementType
  rightIcon?: React.ElementType
  hasLeftIcon?: boolean
  hasRightIcon?: boolean
  iconClassName?: string
}

export const BaseField: React.FC<BaseFieldProps> = ({
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  hasLeftIcon,
  hasRightIcon,
  iconClassName,
}) => {
  if (hasLeftIcon || hasRightIcon) {
    return (
      <div className="relative group">
        {hasLeftIcon && LeftIcon && (
          <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary ltr:left-4 rtl:right-4">
            <LeftIcon
              className={cn(
                "h-5 w-5 text-muted-foreground group-focus-within:text-primary",
                iconClassName,
              )}
            />
          </div>
        )}
        {children}
        {hasRightIcon && RightIcon && (
          <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary ltr:right-4 rtl:left-4">
            <RightIcon
              className={cn(
                "h-5 w-5 text-muted-foreground group-focus-within:text-primary",
                iconClassName,
              )}
            />
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}
