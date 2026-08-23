import React, { useRef } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import type { SharedFieldController } from "./fieldTypes"

interface OtpInputFieldProps {
  field: SharedFieldController
  disabled?: boolean
  inputClassName?: string
  otpLength?: number
}

export const OtpInputField: React.FC<OtpInputFieldProps> = ({
  field,
  disabled,
  inputClassName,
  otpLength = 6,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    const newOtp = field.value ? field.value.split("") : Array(otpLength).fill("")
    newOtp[index] = value.slice(-1)
    const otpString = newOtp.join("")
    field.onChange(otpString)

    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !field.value?.[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, otpLength)
    field.onChange(pastedData.padEnd(otpLength, ""))
  }

  return (
    <div className={cn("flex gap-2", inputClassName)}>
      {Array.from({ length: otpLength }, (_, i) => (
        <Input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el
          }}
          type="text"
          maxLength={1}
          value={field.value?.[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-10 h-10 text-center"
          disabled={disabled}
        />
      ))}
    </div>
  )
}
