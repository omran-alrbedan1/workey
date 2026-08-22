import React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface TextareaFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  rows?: number
  maxLength?: number
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  rows = 3,
  maxLength,
}) => {
  return (
    <Textarea
      {...field}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(inputClassName)}
      rows={rows}
      maxLength={maxLength}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    />
  )
}
