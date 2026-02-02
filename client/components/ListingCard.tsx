import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { usePreferences } from "@/hooks/usePreferences";
import { useI18n } from "@/hooks/useI18n";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/lib/format";

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  onFavorite?: () => void;
  compact?: boolean;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ListingCard({ listing, onPress, onFavorite, compact = false }: ListingCardProps) {
  const { theme } = useTheme();
  const { currency } = usePreferences();
  const { t, language } = useI18n();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFavorite?.();
  };

  const getCategoryLabel = (): string => {
    return listing.category === "car_plate"
      ? t("listing.carPlate")
      : t("listing.mobileNumber");
  };

  const getCategoryIcon = (): keyof typeof Feather.glyphMap => {
    return listing.category === "car_plate" ? "truck" : "smartphone";
  };

  if (compact) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.compactCard,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
          Shadows.card,
          animatedStyle,
        ]}
        testID={`listing-card-${listing.id}`}
      >
        <View style={styles.compactContent}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.primary + "15" }]}>
            <Feather name={getCategoryIcon()} size={12} color={theme.primary} />
          </View>
          <ThemedText style={[styles.compactNumber, { fontFamily: "Inter_700Bold" }]} numberOfLines={1}>
            {listing.number}
          </ThemedText>
          <ThemedText style={[styles.compactPrice, { color: theme.primary }]}>
            {formatPrice(listing.price, currency, language)}
          </ThemedText>
          <ThemedText style={[styles.compactLocation, { color: theme.textSecondary }]} numberOfLines={1}>
            {listing.location}
          </ThemedText>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        Shadows.card,
        animatedStyle,
      ]}
      testID={`listing-card-${listing.id}`}
    >
      <View style={[styles.accentBar, { backgroundColor: theme.primary + "22" }]} />
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.primary + "15" }]}>
          <Feather name={getCategoryIcon()} size={14} color={theme.primary} />
          <ThemedText style={[styles.categoryText, { color: theme.primary }]}>
            {getCategoryLabel()}
          </ThemedText>
        </View>
        {onFavorite ? (
          <Pressable
            onPress={handleFavorite}
            hitSlop={12}
            style={[
              styles.favoriteButton,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
            testID={`favorite-button-${listing.id}`}
          >
            <Feather
              name={listing.isFavorite ? "heart" : "heart"}
              size={20}
              color={listing.isFavorite ? theme.error : theme.textTertiary}
              style={{ opacity: listing.isFavorite ? 1 : 0.7 }}
            />
          </Pressable>
        ) : null}
      </View>

      <View
        style={[
          styles.numberContainer,
          { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
        ]}
      >
        <ThemedText style={[styles.number, { fontFamily: "Inter_700Bold" }]}>
          {listing.number}
        </ThemedText>
      </View>

      <View style={styles.cardFooter}>
        <ThemedText style={[styles.price, { color: theme.primary }]}>
          {formatPrice(listing.price, currency, language)}
        </ThemedText>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color={theme.textTertiary} />
          <ThemedText style={[styles.location, { color: theme.textSecondary }]}>
            {listing.location}
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  favoriteButton: {
    padding: Spacing.xs,
    borderWidth: 1,
    borderRadius: BorderRadius.full,
  },
  numberContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  number: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  location: {
    fontSize: 13,
  },
  compactCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    width: 168,
    marginRight: Spacing.md,
  },
  compactContent: {
    alignItems: "flex-start",
  },
  compactNumber: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: Spacing.sm,
    letterSpacing: 1,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  compactLocation: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
