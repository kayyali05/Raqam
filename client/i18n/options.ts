import { translations } from "@/i18n/translations";
import { CurrencyPreference, LanguagePreference, LocationPreference } from "@/types/preferences";

export const getLanguageOptions = (language: LanguagePreference) => [
  { label: translations[language].options.language.ar, value: "ar" as const },
  { label: translations[language].options.language.en, value: "en" as const },
];

export const getCurrencyOptions = (language: LanguagePreference) => [
  { label: translations[language].options.currency.sar, value: "sar" as const },
  { label: translations[language].options.currency.aed, value: "aed" as const },
  { label: translations[language].options.currency.usd, value: "usd" as const },
  { label: translations[language].options.currency.jod, value: "jod" as const },
];

export const getLocationOptions = (language: LanguagePreference) => [
  { label: translations[language].options.location.riyadh, value: "riyadh" as const },
  { label: translations[language].options.location.jeddah, value: "jeddah" as const },
  { label: translations[language].options.location.dammam, value: "dammam" as const },
  { label: translations[language].options.location.mecca, value: "mecca" as const },
];

export const getLanguageLabel = (language: LanguagePreference, value: LanguagePreference) =>
  translations[language].options.language[value];

export const getCurrencyLabel = (language: LanguagePreference, value: CurrencyPreference) =>
  translations[language].options.currency[value];

export const getLocationLabel = (language: LanguagePreference, value: LocationPreference) =>
  translations[language].options.location[value];
