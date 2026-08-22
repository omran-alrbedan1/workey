import React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { BaseField } from "./BaseField"

interface InputFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  maxLength?: number
  leftIcon?: React.ElementType
  rightIcon?: React.ElementType
  iconPosition?: "left" | "right" | "both"
  iconClassName?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  maxLength,
  leftIcon,
  rightIcon,
  iconPosition,
  iconClassName,
}) => {
  const hasLeftIcon =
    leftIcon && (!iconPosition || iconPosition === "left" || iconPosition === "both")
  const hasRightIcon = rightIcon && (iconPosition === "right" || iconPosition === "both")

  return (
    <BaseField
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      hasLeftIcon={hasLeftIcon}
      hasRightIcon={hasRightIcon}
      iconClassName={iconClassName}
    >
      <Input
        {...field}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          inputClassName,
          "px-6 py-4 text-base",
          hasLeftIcon && "ltr:pl-14 rtl:pr-14",
          hasRightIcon && "ltr:pr-14 rtl:pl-14",
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        maxLength={maxLength}
      />
    </BaseField>
  )
}
