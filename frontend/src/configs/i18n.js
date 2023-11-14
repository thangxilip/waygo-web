import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "locales/en/translation.json";
import translationVI from "locales/vi/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      excludeCacheFor: ["cimode"],
    },
  });

export default i18next;
