import { Control, FieldPath, FieldValues } from "react-hook-form"
import { LucideIcon } from "lucide-react"
import { FormFieldType } from "@/components/shared/inputs/CustomFormField"

export interface Option {
  value: string
  label: string
  disabled?: boolean
   icon?: LucideIcon | string;
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface FileUploadOption {
  maxSize?: number
  maxFiles?: number
  accept?: string
  multiple?: boolean
  showPreview?: boolean
}

export interface AutocompleteOption {
  debounceMs?: number
  minLength?: number
  searchApi: (query: string) => Promise<Option[]>
}

export interface DateOption {
  format?: string
  placeholder?: string
  disabledDays?: Date[]
  minDate?: Date
  maxDate?: Date
}

export interface TimeOption {
  format?: string
  placeholder?: string
  interval?: number
}

export interface DateTimeOption {
  minDate?: Date
  maxDate?: Date
  step?: number
}

export interface CustomFormFieldProps<T extends FieldValues = FieldValues> {
  fieldType: FormFieldType
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  loading?: boolean
  inputClassName?: string
  labelClassName?: string
  descriptionClassName?: string
  errorClassName?: string
  
  // Icon props
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  iconPosition?: "left" | "right" | "both"
  iconClassName?: string
  
  // Options for select/multi-select/combobox
  options?: Option[]
  
  // Number input props
  min?: number
  max?: number
  step?: number
  
  // Textarea props
  rows?: number
  maxLength?: number
  
  // Date picker props
  dateOptions?: DateOption
  
  // Time picker props
  timeOptions?: TimeOption
  
  // Date & time picker props
  dateTimeOptions?: DateTimeOption
  
  // Slider props
  sliderMarks?: Array<{ value: number; label: string }>
  
  // File upload props
  fileUploadOptions?: FileUploadOption
  
  // Rating props
  maxRating?: number
  
  // Autocomplete props
  autocompleteOptions?: AutocompleteOption
  
  // Color picker props
  colorPickerOptions?: {
    showPresets?: boolean
    allowAlpha?: boolean
  }
  
  // OTP props
  otpLength?: number
  
  // Tag input props
  tagInputOptions?: {
    maxTags?: number
    allowDuplicates?: boolean
  }
  
  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  
  // Direction
  dir?: "ltr" | "rtl"
  
  // Currency props
  currency?: string
  locale?: string
  
  // Tooltip
  tooltip?: string
  
  // Container styling
  className?: string
  containerClassName?: string
}