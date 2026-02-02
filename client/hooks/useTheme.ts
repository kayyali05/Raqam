import { useContext } from "react";

import { Colors } from "@/constants/theme";
import { ThemeContext } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context) {
    return context;
  }

  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const theme = Colors[colorScheme];

  return {
    theme,
    isDark,
    colorScheme,
    preference: "system",
    setPreference: () => {},
  };
}
