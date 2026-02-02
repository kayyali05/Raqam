import { CurrencyPreference, LanguagePreference } from "@/types/preferences";

const getCurrencySuffix = (currency: CurrencyPreference, language: LanguagePreference) => {
  if (language === "ar") {
    switch (currency) {
      case "sar":
        return "ر.س";
      case "aed":
        return "د.إ";
      case "usd":
        return "دولار";
      case "jod":
        return "د.أ";
      default:
        return "";
    }
  }

  switch (currency) {
    case "sar":
      return "SAR";
    case "aed":
      return "AED";
    case "usd":
      return "USD";
    case "jod":
      return "JOD";
    default:
      return "";
  }
};

export const formatPrice = (
  price: number,
  currency: CurrencyPreference,
  language: LanguagePreference,
): string => {
  const locale = language === "ar" ? "ar-SA" : "en-US";
  const formatted = new Intl.NumberFormat(locale).format(price);
  const suffix = getCurrencySuffix(currency, language);
  return suffix ? `${formatted} ${suffix}` : formatted;
};
