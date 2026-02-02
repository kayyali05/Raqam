import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Linking, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { usePreferences } from "@/hooks/usePreferences";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { Listing } from "@/types/listing";
import { getListing, toggleFavorite } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { formatPrice } from "@/lib/format";

type ListingDetailRouteProp = RouteProp<RootStackParamList, "ListingDetail">;

export default function ListingDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, language } = useI18n();
  const { currency } = usePreferences();
  const route = useRoute<ListingDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const heartScale = useSharedValue(1);

  const loadListing = useCallback(async () => {
    try {
      const data = await getListing(route.params.listingId);
      if (data) {
        setListing(data);
        setIsFavorite(data.isFavorite || false);
      }
    } catch (error) {
      console.error("Error loading listing:", error);
    } finally {
      setLoading(false);
    }
  }, [route.params.listingId]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleFavorite = async () => {
    if (!listing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    heartScale.value = withSpring(1.3, { damping: 10 }, () => {
      heartScale.value = withSpring(1);
    });
    const newValue = await toggleFavorite(listing.id);
    setIsFavorite(newValue);
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <Pressable onPress={handleShare} hitSlop={12} style={styles.headerButton}>
            <Feather name="share" size={22} color={theme.text} />
          </Pressable>
          <Pressable onPress={handleFavorite} hitSlop={12} style={styles.headerButton}>
            <Animated.View style={heartAnimatedStyle}>
              <Feather name="heart" size={22} color={isFavorite ? theme.error : theme.text} />
            </Animated.View>
          </Pressable>
        </View>
      ),
    });
  }, [navigation, isFavorite, theme, handleFavorite, heartAnimatedStyle]);

  const handleContact = () => {
    if (!listing) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const message = t("listing.interestedMessage", {
      number: listing.number,
      price: formatPrice(listing.price, currency, language),
    });
    const phoneNumber = "0555999888";

    if (Platform.OS === "web") {
      Alert.alert(t("listing.contactSeller"), `${t("listing.location")}: ${phoneNumber}`);
    } else {
      const url = `https://wa.me/966${phoneNumber.substring(1)}?text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(() => {
        Linking.openURL(`tel:${phoneNumber}`);
      });
    }
  };

  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("common.today");
    if (diffDays === 1) return t("common.yesterday");
    if (diffDays < 7) return t("common.daysAgo", { count: diffDays });
    if (diffDays < 30) return t("common.weeksAgo", { count: Math.floor(diffDays / 7) });
    return t("common.monthsAgo", { count: Math.floor(diffDays / 30) });
  };

  const getCategoryLabel = (): string => {
    return listing?.category === "car_plate" ? t("listing.carPlate") : t("listing.mobileNumber");
  };

  const getCategoryIcon = (): keyof typeof Feather.glyphMap => {
    return listing?.category === "car_plate" ? "truck" : "smartphone";
  };

  if (loading || !listing) {
    return (
      <ThemedView style={[styles.container, { paddingTop: headerHeight }]}>
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: theme.textSecondary }}>{t("common.loading")}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: headerHeight + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.heroCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            Shadows.card,
          ]}
        >
          <View style={[styles.categoryBadge, { backgroundColor: theme.primary + "15" }]}>
            <Feather name={getCategoryIcon()} size={16} color={theme.primary} />
            <ThemedText style={[styles.categoryText, { color: theme.primary }]}>
              {getCategoryLabel()}
            </ThemedText>
          </View>

          <ThemedText style={[styles.numberDisplay, { fontFamily: "Inter_700Bold" }]}>
            {listing.number}
          </ThemedText>

          <ThemedText style={[styles.price, { color: theme.primary }]}>
            {formatPrice(listing.price, currency, language)}
          </ThemedText>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            Shadows.card,
          ]}
        >
          <ThemedText style={styles.sectionTitle}>{t("listing.details")}</ThemedText>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Feather name="map-pin" size={18} color={theme.textTertiary} />
              <View style={styles.detailTextContainer}>
                <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  {t("listing.location")}
                </ThemedText>
                <ThemedText style={styles.detailValue}>{listing.location}</ThemedText>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Feather name="clock" size={18} color={theme.textTertiary} />
              <View style={styles.detailTextContainer}>
                <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  {t("listing.publishedAt")}
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {formatRelativeDate(listing.createdAt)}
                </ThemedText>
              </View>
            </View>
          </View>

          {listing.description ? (
            <View style={[styles.descriptionContainer, { borderTopColor: theme.border }]}>
              <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                {t("listing.description")}
              </ThemedText>
              <ThemedText style={styles.description}>{listing.description}</ThemedText>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            Shadows.card,
          ]}
        >
          <ThemedText style={styles.sectionTitle}>{t("listing.sellerInfo")}</ThemedText>

          <View style={styles.sellerRow}>
            <View style={[styles.sellerAvatar, { backgroundColor: theme.primary + "20" }]}>
              <ThemedText style={[styles.sellerInitial, { color: theme.primary }]}>
                {listing.sellerName.charAt(0)}
              </ThemedText>
            </View>
            <View style={styles.sellerInfo}>
              <ThemedText style={styles.sellerName}>{listing.sellerName}</ThemedText>
              <ThemedText style={[styles.sellerMeta, { color: theme.textSecondary }]}>
                {listing.location}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.backgroundDefault,
            paddingBottom: insets.bottom + Spacing.lg,
            borderTopColor: theme.border,
          },
          Shadows.elevated,
        ]}
      >
        <Button onPress={handleContact} style={[styles.contactButton, { backgroundColor: theme.primary }]}>
          {t("listing.contactSeller")}
        </Button>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: Spacing.lg,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  numberDisplay: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: Spacing.md,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
  },
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.lg,
    textAlign: "right",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  detailTextContainer: {
    marginLeft: Spacing.sm,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  descriptionContainer: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginTop: Spacing.xs,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerInitial: {
    fontSize: 20,
    fontWeight: "700",
  },
  sellerInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  sellerMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  contactButton: {
    height: Spacing.buttonHeight,
  },
});
