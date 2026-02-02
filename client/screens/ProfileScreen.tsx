import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList, Pressable, RefreshControl, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonCard } from "@/components/SkeletonCard";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { useAuth } from "@/hooks/useAuth";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { User, Listing } from "@/types/listing";
import { getUser, getMyListings, getListings, getFavorites, deleteListing } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type Tab = "active" | "favorites";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useI18n();
  const { user: authUser } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<User | null>(null);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("active");

  const loadData = useCallback(async () => {
    try {
      const [userData, myListingsData, allListings, favorites] = await Promise.all([
        getUser(),
        getMyListings(),
        getListings(),
        getFavorites(),
      ]);

      setUser(userData);
      setMyListings(myListingsData);
      setFavoriteListings(allListings.filter((l) => favorites.includes(l.id)));
    } catch (error) {
      console.error("Error loading profile data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadData();
  }, [loadData]);

  const handleListingPress = useCallback(
    (listing: Listing) => {
      navigation.navigate("ListingDetail", { listingId: listing.id });
    },
    [navigation],
  );

  const handleDeleteListing = useCallback(async (listingId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await deleteListing(listingId);
    setMyListings((prev) => prev.filter((l) => l.id !== listingId));
  }, []);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate("Settings");
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handleSettingsPress}
          hitSlop={12}
          style={[
            styles.headerAction,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="settings" size={22} color={theme.text} />
        </Pressable>
      ),
    });
  }, [navigation, theme, handleSettingsPress]);

  const currentListings = activeTab === "active" ? myListings : favoriteListings;

  const renderListingCard = useCallback(
    ({ item }: { item: Listing }) => (
      <View style={styles.listingCardContainer}>
        <ListingCard listing={item} onPress={() => handleListingPress(item)} />
        {activeTab === "active" ? (
          <Pressable
            onPress={() => handleDeleteListing(item.id)}
            style={[styles.deleteButton, { backgroundColor: theme.error + "15" }]}
            hitSlop={8}
          >
            <Feather name="trash-2" size={16} color={theme.error} />
          </Pressable>
        ) : null}
      </View>
    ),
    [handleListingPress, handleDeleteListing, activeTab, theme],
  );

  const displayName =
    user?.name ||
    (authUser?.user_metadata?.full_name as string | undefined) ||
    authUser?.email ||
    t("profile.defaultUser");
  const displayLocation =
    user?.location ||
    (authUser?.user_metadata?.location as string | undefined) ||
    "";
  const displayAvatar =
    user?.avatar ||
    (authUser?.user_metadata?.avatar_url as string | undefined) ||
    "";

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.avatarContainer, { backgroundColor: theme.primary + "20" }]}>
        {displayAvatar ? (
          <Image source={{ uri: displayAvatar }} style={styles.avatarImage} />
        ) : (
          <ThemedText style={[styles.avatarText, { color: theme.primary }]}>
            {displayName.charAt(0) || t("profile.defaultInitial")}
          </ThemedText>
        )}
      </View>
      <ThemedText style={styles.userName}>{displayName}</ThemedText>
      {displayLocation ? (
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={theme.textSecondary} />
          <ThemedText style={[styles.userLocation, { color: theme.textSecondary }]}>
            {displayLocation}
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <ThemedText style={[styles.statValue, { color: theme.primary }]}>
            {myListings.length}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
            {t("profile.myListings")}
          </ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <ThemedText style={[styles.statValue, { color: theme.primary }]}>
            {favoriteListings.length}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
            {t("profile.favorites")}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.tabsContainer, { backgroundColor: theme.backgroundTertiary }]}>
        <Pressable
          onPress={() => {
            setActiveTab("active");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[
            styles.tab,
            activeTab === "active" && { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather
            name="grid"
            size={16}
            color={activeTab === "active" ? theme.primary : theme.textSecondary}
          />
          <ThemedText
            style={[
              styles.tabText,
              { color: activeTab === "active" ? theme.primary : theme.textSecondary },
              activeTab === "active" && styles.tabTextActive,
            ]}
          >
            {t("profile.myListings")}
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab("favorites");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[
            styles.tab,
            activeTab === "favorites" && { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather
            name="heart"
            size={16}
            color={activeTab === "favorites" ? theme.primary : theme.textSecondary}
          />
          <ThemedText
            style={[
              styles.tabText,
              { color: activeTab === "favorites" ? theme.primary : theme.textSecondary },
              activeTab === "favorites" && styles.tabTextActive,
            ]}
          >
            {t("profile.favorites")}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          <SkeletonCard />
          <SkeletonCard />
        </View>
      );
    }

    if (activeTab === "active") {
      return (
        <EmptyState
          image={require("../../assets/images/empty-my-listings.png")}
          title={t("profile.emptyListingsTitle")}
          description={t("profile.emptyListingsDescription")}
          actionLabel={t("profile.emptyListingsAction")}
          onAction={() => navigation.navigate("Main", { screen: "SellTab" })}
        />
      );
    }

    return (
      <EmptyState
        image={require("../../assets/images/empty-listings.png")}
        title={t("profile.emptyFavoritesTitle")}
        description={t("profile.emptyFavoritesDescription")}
        actionLabel={t("profile.emptyFavoritesAction")}
        onAction={() => navigation.navigate("Main", { screen: "HomeTab" })}
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
        currentListings.length === 0 && styles.emptyContent,
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={loading ? [] : currentListings}
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
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  userLocation: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
  },
  tabsContainer: {
    flexDirection: "row",
    width: "100%",
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    fontWeight: "600",
  },
  skeletonContainer: {
    marginTop: Spacing.lg,
  },
  listingCardContainer: {
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginRight: Spacing.sm,
  },
});
