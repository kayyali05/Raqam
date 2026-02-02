import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ListingCard } from "@/components/ListingCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { Listing, ListingCategory } from "@/types/listing";
import { getListings, toggleFavorite, initializeData } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type FilterOption = ListingCategory | "all";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterOption>("all");

  const loadListings = useCallback(async () => {
    try {
      await initializeData();
      const data = await getListings();
      setListings(data);
    } catch (error) {
      console.error("Error loading listings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadListings();
  }, [loadListings]);

  const handleListingPress = useCallback(
    (listing: Listing) => {
      navigation.navigate("ListingDetail", { listingId: listing.id });
    },
    [navigation],
  );

  const handleFavorite = useCallback(async (listingId: string) => {
    await toggleFavorite(listingId);
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, isFavorite: !l.isFavorite } : l)),
    );
  }, []);

  const filteredListings = listings.filter((listing) => {
    if (filter === "all") return true;
    return listing.category === filter;
  });

  const featuredListings = listings.slice(0, 3);

  const renderListingCard = useCallback(
    ({ item }: { item: Listing }) => (
      <ListingCard
        listing={item}
        onPress={() => handleListingPress(item)}
        onFavorite={() => handleFavorite(item.id)}
      />
    ),
    [handleListingPress, handleFavorite],
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View
        style={[
          styles.hero,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
          Shadows.card,
        ]}
      >
        <ThemedText type="h2" style={styles.heroTitle}>
          {t("explore.heroTitle")}
        </ThemedText>
        <ThemedText style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
          {t("explore.heroSubtitle")}
        </ThemedText>
        <View style={styles.heroMetaRow}>
          <View style={[styles.heroChip, { backgroundColor: theme.primary + "15" }]}>
            <Feather name="star" size={14} color={theme.primary} />
            <ThemedText style={[styles.heroChipText, { color: theme.primary }]}>
              {t("explore.heroChipLuxury")}
            </ThemedText>
          </View>
          <View style={[styles.heroChip, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="shield" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.heroChipText, { color: theme.textSecondary }]}>
              {t("explore.heroChipTrusted")}
            </ThemedText>
          </View>
        </View>
      </View>

      {featuredListings.length > 0 ? (
        <>
          <ThemedText style={styles.sectionTitle}>{t("explore.featured")}</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          >
            {featuredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onPress={() => handleListingPress(listing)}
                compact
              />
            ))}
          </ScrollView>
        </>
      ) : null}

      <View style={styles.filterSection}>
        <ThemedText style={styles.sectionTitle}>{t("explore.browse")}</ThemedText>
        <CategoryFilter selected={filter} onChange={setFilter} />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      );
    }

    return (
      <EmptyState
        image={require("../../assets/images/empty-listings.png")}
        title={t("explore.emptyTitle")}
        description={t("explore.emptyDescription")}
        actionLabel={t("explore.emptyAction")}
        onAction={() => navigation.navigate("Main", { screen: "SellTab" })}
      />
    );
  };

  return (
    <ScreenBackground>
      <FlatList
        style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
        filteredListings.length === 0 && styles.emptyContent,
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={loading ? [] : filteredListings}
      renderItem={renderListingCard}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.primary}
          progressViewOffset={headerHeight}
        />
      }
      showsVerticalScrollIndicator={false}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  emptyContent: {
    flexGrow: 1,
  },
  headerContent: {
    marginBottom: Spacing.lg,
  },
  hero: {
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    overflow: "hidden",
  },
  heroTitle: {
    textAlign: "right",
  },
  heroSubtitle: {
    marginTop: Spacing.xs,
    textAlign: "right",
  },
  heroMetaRow: {
    flexDirection: "row-reverse",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  heroChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.md,
    textAlign: "right",
  },
  featuredList: {
    paddingRight: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  filterSection: {
    marginTop: Spacing.sm,
  },
  skeletonContainer: {
    marginTop: Spacing.lg,
  },
});
