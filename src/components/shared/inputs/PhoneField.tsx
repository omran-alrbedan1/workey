import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { BaseField } from "./BaseField"
import { formatPhoneNumber } from "@/lib/formatter"

interface PhoneFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  leftIcon?: React.ElementType
  rightIcon?: React.ElementType
  iconPosition?: "left" | "right" | "both"
  iconClassName?: string
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  leftIcon,
  rightIcon,
  iconPosition,
  iconClassName,
}) => {
  const [formattedValue, setFormattedValue] = useState("")
  const hasLeftIcon = leftIcon && (!iconPosition || iconPosition === "left" || iconPosition === "both")
  const hasRightIcon = rightIcon && (iconPosition === "right" || iconPosition === "both")
  
  useEffect(() => {
    if (field.value) {
      const formatted = formatPhoneNumber(field.value)
      setFormattedValue(formatted)
    } else {
      setFormattedValue("")
    }
  }, [field.value])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    const formatted = formatPhoneNumber(value)
    setFormattedValue(formatted)
    field.onChange(value)
  }

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
        type="tel"
        placeholder={placeholder || "(555) 123-4567"}
        disabled={disabled}
        className={cn(
          inputClassName,
          "px-6 py-5 text-base",
          hasLeftIcon && "ltr:pl-14 rtl:pr-14",
          hasRightIcon && "ltr:pr-14 rtl:pl-14"
        )}
        value={formattedValue}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
    </BaseField>
  )
}
