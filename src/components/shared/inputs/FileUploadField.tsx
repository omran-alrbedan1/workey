import React, { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Upload, Image as ImageIcon, FileText, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { FileUploadOption } from "@/types/customFormField.types"

interface FileUploadFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  fileUploadOptions?: FileUploadOption
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  fileUploadOptions,
}) => {
  const { t } = useTranslation("common")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) => {
      if (fileUploadOptions?.maxSize && file.size > fileUploadOptions.maxSize) {
        return false
      }
      if (fileUploadOptions?.accept && !file.type.match(fileUploadOptions.accept)) {
        return false
      }
      return true
    })

    if (fileUploadOptions?.multiple) {
      field.onChange([...(field.value || []), ...validFiles])
    } else {
      field.onChange(validFiles[0] || null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemoveFile = (index: number) => {
    if (fileUploadOptions?.multiple) {
      field.onChange(field.value?.filter((_: File, i: number) => i !== index))
    } else {
      field.onChange(null)
    }
  }

  const getFileUrl = (file: File | string): string => {
    return typeof file === "string" ? file : URL.createObjectURL(file)
  }

  const getFileName = (file: File | string): string => {
    return typeof file === "string"
      ? file.split("/").pop() || t("fileUpload.imageFallback")
      : file.name
  }

  const getFileSize = (file: File | string): string => {
    return typeof file === "string" ? "" : `${(file.size / 1024).toFixed(1)} KB`
  }

  const isImageFile = (file: File | string): boolean => {
    return typeof file === "string"
      ? /\.(jpg|jpeg|png|webp|gif|svg|avif|bmp)$/i.test(file)
      : file.type.startsWith("image/")
  }

  const renderFilePreview = (file: File | string, index: number) => {
    const isImage = isImageFile(file)

    return (
      <div
        key={index}
        className="relative group overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-md"
      >
        {isImage && fileUploadOptions?.showPreview ? (
          <div className="relative w-full aspect-video max-h-48 overflow-hidden">
            <img
              src={getFileUrl(file)}
              alt={getFileName(file)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
              {isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{getFileName(file)}</p>
              {getFileSize(file) && (
                <p className="text-xs text-muted-foreground">{getFileSize(file)}</p>
              )}
            </div>
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 rounded-full p-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => handleRemoveFile(index)}
          aria-label={t("fileUpload.removeFile")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200",
          dragActive
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border hover:border-muted-foreground/40 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed",
          inputClassName,
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-8 px-6">
          <div
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-full mb-4 transition-colors",
              dragActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <Upload
              className={cn("h-6 w-6 transition-transform", dragActive && "translate-y-0.5")}
            />
          </div>
          <p className="text-sm font-medium">
            {placeholder || (
              <>
                <span className="text-primary">{t("fileUpload.clickToUpload")}</span>{" "}
                {t("fileUpload.dragAndDrop")}
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {fileUploadOptions?.hint ||
              (fileUploadOptions?.accept === "image/*"
                ? t("fileUpload.imageHint")
                : t("fileUpload.fileHint"))}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple={fileUploadOptions?.multiple}
          accept={fileUploadOptions?.accept}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {field.value && (
        <div className="grid gap-3">
          {fileUploadOptions?.multiple
            ? field.value.map((file: File, index: number) => renderFilePreview(file, index))
            : renderFilePreview(field.value, 0)}
        </div>
      )}
    </div>
  )
}
