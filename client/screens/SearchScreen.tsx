import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ScreenBackground } from "@/components/ScreenBackground";
import { Input } from "@/components/Input";
import { ThemedText } from "@/components/ThemedText";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { Spacing } from "@/constants/theme";
import { Listing } from "@/types/listing";
import { getListings, initializeData } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useI18n();
  const navigation = useNavigation<NavigationProp>();

  const [query, setQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return listings;
    return listings.filter((listing) => {
      const haystack = [
        listing.number,
        listing.description,
        listing.sellerName,
        listing.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [listings, normalizedQuery]);

  const handleListingPress = useCallback(
    (listing: Listing) => {
      navigation.navigate("ListingDetail", { listingId: listing.id });
    },
    [navigation],
  );

  const renderListingCard = useCallback(
    ({ item }: { item: Listing }) => (
      <ListingCard listing={item} onPress={() => handleListingPress(item)} />
    ),
    [handleListingPress],
  );

  const renderEmpty = () => (
    <EmptyState
      image={require("../../assets/images/empty-listings.png")}
      title={t("search.emptyTitle")}
      description={t("search.emptyDescription")}
      actionLabel={t("search.clear")}
      onAction={() => setQuery("")}
    />
  );

  return (
    <ScreenBackground>
      <FlatList
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
          results.length === 0 && styles.emptyContent,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        data={loading ? [] : results}
        renderItem={renderListingCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.searchHeader}>
            <ThemedText style={styles.title}>{t("search.title")}</ThemedText>
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder={t("search.placeholder")}
              leftIcon="search"
              rightIcon={query ? "x" : undefined}
              onRightIconPress={() => setQuery("")}
              returnKeyType="search"
            />
          </View>
        }
        ListEmptyComponent={loading ? null : renderEmpty}
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
  searchHeader: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: Spacing.md,
    textAlign: "right",
  },
});
