import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface SkeletonCardProps {
  compact?: boolean;
}

export function SkeletonCard({ compact = false }: SkeletonCardProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (compact) {
    return (
      <View
        style={[
          styles.compactCard,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        ]}
      >
        <Animated.View style={[styles.skeletonBadge, { backgroundColor: theme.skeleton }, animatedStyle]} />
        <Animated.View style={[styles.skeletonNumber, { backgroundColor: theme.skeleton }, animatedStyle]} />
        <Animated.View style={[styles.skeletonPrice, { backgroundColor: theme.skeleton }, animatedStyle]} />
        <Animated.View style={[styles.skeletonLocation, { backgroundColor: theme.skeleton }, animatedStyle]} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        Shadows.card,
      ]}
    >
      <View style={styles.cardHeader}>
        <Animated.View style={[styles.skeletonBadgeLarge, { backgroundColor: theme.skeleton }, animatedStyle]} />
        <Animated.View style={[styles.skeletonHeart, { backgroundColor: theme.skeleton }, animatedStyle]} />
      </View>
      <View style={styles.numberContainer}>
        <Animated.View style={[styles.skeletonNumberLarge, { backgroundColor: theme.skeleton }, animatedStyle]} />
      </View>
      <View style={styles.cardFooter}>
        <Animated.View style={[styles.skeletonPriceLarge, { backgroundColor: theme.skeleton }, animatedStyle]} />
        <Animated.View style={[styles.skeletonLocationLarge, { backgroundColor: theme.skeleton }, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  numberContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  skeletonBadge: {
    width: 50,
    height: 24,
    borderRadius: BorderRadius.sm,
  },
  skeletonBadgeLarge: {
    width: 100,
    height: 28,
    borderRadius: BorderRadius.sm,
  },
  skeletonHeart: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  skeletonNumber: {
    width: 100,
    height: 24,
    borderRadius: BorderRadius.xs,
    marginTop: Spacing.sm,
  },
  skeletonNumberLarge: {
    width: 160,
    height: 36,
    borderRadius: BorderRadius.xs,
  },
  skeletonPrice: {
    width: 70,
    height: 18,
    borderRadius: BorderRadius.xs,
    marginTop: Spacing.xs,
  },
  skeletonPriceLarge: {
    width: 100,
    height: 24,
    borderRadius: BorderRadius.xs,
  },
  skeletonLocation: {
    width: 50,
    height: 14,
    borderRadius: BorderRadius.xs,
    marginTop: Spacing.xs,
  },
  skeletonLocationLarge: {
    width: 80,
    height: 18,
    borderRadius: BorderRadius.xs,
  },
  compactCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    width: 160,
    marginRight: Spacing.md,
  },
});
