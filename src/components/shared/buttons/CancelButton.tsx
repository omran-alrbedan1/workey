import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export const CancelButton = ({
  text,
  icon,
  children,
  className,
  ...props
}: CancelButtonProps) => {
  const {t} = useTranslation('common')
  return (
    <Button
      variant="outline"
      className={cn(
        "flex-1 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 transition-all font-medium",
        className
      )}
      {...props}
    >
      {icon && <span className="me-2">{icon}</span>}
      {text || children || t('cancel')}
    </Button>
  )
}