import { Upload, X, Image as ImageIcon } from "lucide-react"
import { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

interface CompanyLogoSectionProps {
  logoUrl?: string | null
  isUploading: boolean
  onUpload: (file: File) => void
  onRemove: () => void
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export default function CompanyLogoSection({
  logoUrl,
  isUploading,
  onUpload,
  onRemove,
}: CompanyLogoSectionProps) {
  const { t } = useTranslation("employerCompany")
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Log logoUrl on mount and when it changes
  console.log("Logo URL from props:", logoUrl)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t("media.invalidType"))
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(t("media.fileTooLarge"))
      return
    }

    setError(null)

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Upload file
    onUpload(file)
  }

  const handleRemove = () => {
    setPreview(null)
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    onRemove()
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const displayLogo = preview || logoUrl

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">{t("media.logo")}</h3>

      <div className="flex items-start gap-4">
        {/* Logo Display */}
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border-2 border-border bg-background-secondary">
          {displayLogo ? (
            <img
              src={displayLogo}
              alt={t("media.logo")}
              className="h-full w-full object-contain"
              onError={(e) => {
                console.error("Failed to load logo:", displayLogo)
                console.error("Image error event:", e)
                console.error("Current src:", e.currentTarget.src)
                setError(t("media.loadError"))
                setPreview(null)
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-text-muted" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background-card/80">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isUploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {displayLogo ? t("media.replace") : t("media.upload")}
          </Button>

          {displayLogo && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              {t("media.remove")}
            </Button>
          )}

          <p className="text-xs text-text-muted">
            {t("media.logoRequirements")}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
