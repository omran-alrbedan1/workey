import React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { BaseField } from "./BaseField"

interface NumberFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  min?: number
  max?: number
  step?: number
  leftIcon?: React.ElementType
  rightIcon?: React.ElementType
  iconPosition?: "left" | "right" | "both"
  iconClassName?: string
}

export const NumberField: React.FC<NumberFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  min,
  max,
  step,
  leftIcon,
  rightIcon,
  iconPosition,
  iconClassName,
}) => {
  const hasLeftIcon = leftIcon && (!iconPosition || iconPosition === "left" || iconPosition === "both")
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
        type="number"
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          inputClassName,
          "px-6 py-5 text-base",
          hasLeftIcon && "ltr:pl-14 rtl:pr-14",
          hasRightIcon && "ltr:pr-14 rtl:pl-14"
        )}
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        onChange={(e) => {
          const value = e.target.value ? Number(e.target.value) : ""
          field.onChange(value)
        }}
      />
    </BaseField>
  )
}
