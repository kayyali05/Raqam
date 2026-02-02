import { Platform, StyleSheet } from "react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { BlurView } from "expo-blur";

import { useTheme } from "@/hooks/useTheme";

interface UseScreenOptionsParams {
  transparent?: boolean;
}

export function useScreenOptions({
  transparent = true,
}: UseScreenOptionsParams = {}): NativeStackNavigationOptions {
  const { theme, isDark } = useTheme();
  const isIos = Platform.OS === "ios";
  const useBlur = isIos && transparent;

  return {
    headerTitleAlign: "center",
    headerTransparent: transparent,
    headerBlurEffect: useBlur ? (isDark ? "dark" : "light") : undefined,
    headerTintColor: theme.text,
    headerShadowVisible: false,
    headerBackground: () =>
      useBlur ? (
        <BlurView
          intensity={85}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      ) : null,
    headerStyle: {
      backgroundColor: Platform.select({
        ios: theme.backgroundRoot,
        android: theme.backgroundRoot,
        web: theme.backgroundRoot,
      }),
    },
    gestureEnabled: true,
    gestureDirection: "horizontal",
    fullScreenGestureEnabled: isLiquidGlassAvailable() ? false : true,
    contentStyle: {
      backgroundColor: theme.backgroundRoot,
    },
  };
}
