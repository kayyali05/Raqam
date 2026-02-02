export type LanguagePreference = "ar" | "en";
export type CurrencyPreference = "sar" | "aed" | "usd" | "jod";
export type LocationPreference = "riyadh" | "jeddah" | "dammam" | "mecca";

export type AppPreferences = {
  language: LanguagePreference;
  currency: CurrencyPreference;
  location: LocationPreference;
};
