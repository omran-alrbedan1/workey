import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Globe, Check, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  ]

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    if (lng === "ar") {
      document.documentElement.dir = "rtl"
      document.documentElement.lang = "ar"
    } else {
      document.documentElement.dir = "ltr"
      document.documentElement.lang = "en"
    }
    setIsOpen(false)
  }

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border bg-background-card hover:bg-background-secondary transition-all duration-200"
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline-block text-sm font-medium text-text">
            {currentLanguage.nativeName}
          </span>
          <ChevronDown
            className={`h-3 w-3 text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-background-card border-border shadow-lg rounded-lg p-1"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`
              flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer rounded-md
              transition-all duration-200
              ${
                i18n.language === lang.code
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text hover:bg-background-secondary hover:text-text-primary"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm">{lang.name}</span>
                <span className="text-xs text-text-muted">{lang.nativeName}</span>
              </div>
            </div>
            {i18n.language === lang.code && <Check className="h-4 w-4 text-primary shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
