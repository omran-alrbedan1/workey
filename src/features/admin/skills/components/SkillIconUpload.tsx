import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState, useRef } from "react"
import { showErrorToast } from "@/lib/toast"
import { adminSkillsService } from "../services/adminSkills.service"

interface SkillIconUploadProps {
  skillId: string | number
  skillName: string
  currentIcon?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function SkillIconUpload({
  skillId,
  skillName,
  currentIcon,
  open,
  onOpenChange,
  onSuccess,
}: SkillIconUploadProps) {
  const { t } = useTranslation("adminSkills")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(currentIcon || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    try {
      await adminSkillsService.uploadIcon(skillId, file)
      onSuccess()
      onOpenChange(false)
      setFile(null)
      setPreview(null)
    } catch (error) {
      showErrorToast(error, t("uploadIconError"))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    setIsUploading(true)
    try {
      await adminSkillsService.deleteIcon(skillId)
      onSuccess()
      onOpenChange(false)
      setPreview(null)
    } catch (error) {
      showErrorToast(error, t("deleteIconError"))
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreview(currentIcon || null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("uploadIconTitle", { name: skillName })}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-dashed border-border">
              {preview ? (
                <img
                  src={preview}
                  alt={`${skillName} icon`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ImageIcon className="h-8 w-8 text-text-muted" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]
                if (selectedFile) handleFileSelect(selectedFile)
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {t("selectImage")}
            </Button>
          </div>

          {file && (
            <p className="text-center text-sm text-text-muted">
              {t("selectedFile", { name: file.name })}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {currentIcon && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              {t("deleteIcon")}
            </Button>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
              {t("cancel")}
            </Button>
            <Button type="button" onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {t("upload")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
