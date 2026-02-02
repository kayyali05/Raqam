import { useMemo } from "react";

import { translations } from "@/i18n/translations";
import { usePreferences } from "@/hooks/usePreferences";

const getNestedValue = (obj: Record<string, any>, path: string) => {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const interpolate = (text: string, params?: Record<string, string | number>) => {
  if (!params) return text;
  return Object.keys(params).reduce((result, key) => {
    return result.replace(new RegExp(`{{${key}}}`, "g"), String(params[key]));
  }, text);
};

export function useI18n() {
  const { language } = usePreferences();

  const dictionary = useMemo(() => translations[language], [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = getNestedValue(dictionary as Record<string, any>, key);
    if (typeof value === "string") {
      return interpolate(value, params);
    }
    return key;
  };

  return {
    t,
    language,
    isRTL: language === "ar",
  };
}
