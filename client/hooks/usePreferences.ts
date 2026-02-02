import { useContext } from "react";

import { PreferencesContext } from "@/context/PreferencesContext";
import { AppPreferences } from "@/types/preferences";

const DEFAULT_PREFERENCES: AppPreferences = {
  language: "ar",
  currency: "sar",
  location: "riyadh",
};

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context) {
    return context;
  }

  return {
    ...DEFAULT_PREFERENCES,
    setPreference: () => {},
  };
}
