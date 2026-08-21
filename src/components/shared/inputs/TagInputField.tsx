import React, { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TagInputFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  tagInputOptions?: {
    maxTags?: number
    allowDuplicates?: boolean
  }
}

export const TagInputField: React.FC<TagInputFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  tagInputOptions,
}) => {
  const { t } = useTranslation("common")
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !field.value?.includes(trimmedTag)) {
      field.onChange([...(field.value || []), trimmedTag])
    }
    setInputValue("")
  }
  
  const handleRemoveTag = (tagToRemove: string) => {
    field.onChange(field.value?.filter((tag: string) => tag !== tagToRemove))
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && field.value?.length) {
      handleRemoveTag(field.value[field.value.length - 1])
    }
  }
  
  return (
    <div className={cn("flex flex-wrap gap-2 p-2 border rounded-md", inputClassName)}>
      {field.value?.map((tag: string) => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
          {tag}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => handleRemoveTag(tag)}
          />
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t("inputs.addTag")}
        className="flex-1 min-w-25 outline-none bg-transparent"
        disabled={disabled}
      />
    </div>
  )
}