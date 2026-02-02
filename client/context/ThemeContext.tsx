import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemePreference, setThemePreference } from "@/lib/storage";
import { ThemePreference } from "@/types/theme";

type ThemeContextValue = {
  theme: typeof Colors.light;
  colorScheme: "light" | "dark";
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const resolveColorScheme = (
  preference: ThemePreference,
  systemScheme: "light" | "dark" | null | undefined,
): "light" | "dark" => {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return systemScheme ?? "light";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    let isMounted = true;
    getThemePreference().then((stored) => {
      if (isMounted && stored) {
        setPreferenceState(stored);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    void setThemePreference(value);
  }, []);

  const colorScheme = resolveColorScheme(preference, systemScheme);
  const value = useMemo<ThemeContextValue>(() => {
    const theme = Colors[colorScheme];
    return {
      theme,
      colorScheme,
      isDark: colorScheme === "dark",
      preference,
      setPreference,
    };
  }, [colorScheme, preference, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
