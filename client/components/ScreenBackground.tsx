import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

import { useTheme } from "@/hooks/useTheme";

type ScreenBackgroundProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ScreenBackground({ children, style }: ScreenBackgroundProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }, style]}>
      <View
        pointerEvents="none"
        style={[
          styles.orb,
          styles.orbTop,
          { backgroundColor: theme.primary + "22" },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.orb,
          styles.orbBottom,
          { backgroundColor: theme.accent + "18" },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.9,
  },
  orbTop: {
    width: 260,
    height: 260,
    top: -120,
    right: -90,
  },
  orbBottom: {
    width: 220,
    height: 220,
    bottom: -120,
    left: -80,
  },
});
