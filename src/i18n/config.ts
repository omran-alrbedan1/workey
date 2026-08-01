import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { APP_CONFIG, STORAGE_KEYS } from "@/config"
import { defaultNamespace, namespaces, resources } from "./resources"

const updateDOM = (lng: string) => {
  const rtlLanguages = ["ar", "he", "fa"]
  const dir = rtlLanguages.includes(lng) ? "rtl" : "ltr"
  document.documentElement.dir = dir
  document.documentElement.lang = lng
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: APP_CONFIG.locale,
    ns: namespaces,
    defaultNS: defaultNamespace,
    detection: {
      order: ["localStorage", "cookie", "htmlTag"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: STORAGE_KEYS.locale,
    },
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on("languageChanged", (lng) => {
  updateDOM(lng)
})

updateDOM(i18n.language)

export default i18n
