import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { getAppPreferences, setAppPreference } from "@/lib/storage";
import { AppPreferences } from "@/types/preferences";

type PreferencesContextValue = AppPreferences & {
  setPreference: <K extends keyof AppPreferences>(
    key: K,
    value: AppPreferences[K],
  ) => void;
};

const DEFAULT_PREFERENCES: AppPreferences = {
  language: "ar",
  currency: "sar",
  location: "riyadh",
};

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    let isMounted = true;
    getAppPreferences().then((stored) => {
      if (isMounted) {
        setPreferences(stored);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = useCallback(
    <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
      void setAppPreference(key, value);
    },
    [],
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...preferences,
      setPreference,
    }),
    [preferences, setPreference],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
