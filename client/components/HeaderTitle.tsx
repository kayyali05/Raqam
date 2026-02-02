import React from "react";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface HeaderTitleProps {
  title: string;
  subtitle?: string;
}

export function HeaderTitle({ title, subtitle }: HeaderTitleProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.title, { color: theme.primary }]}>{title}</ThemedText>
      {subtitle ? (
        <View style={styles.subtitleRow}>
          <View style={[styles.accent, { backgroundColor: theme.primary }]} />
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </ThemedText>
          <View style={[styles.accent, { backgroundColor: theme.primary }]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  subtitleRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  accent: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
});
