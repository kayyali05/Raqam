import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, Alert, Switch, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { clearAllData, initializeData } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { usePreferences } from "@/hooks/usePreferences";
import { useI18n } from "@/hooks/useI18n";
import { useAuth } from "@/hooks/useAuth";
import { APP_CONFIG } from "@/config/app";
import {
  getCurrencyLabel,
  getCurrencyOptions,
  getLanguageLabel,
  getLanguageOptions,
  getLocationLabel,
  getLocationOptions,
} from "@/i18n/options";


interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}

function SettingItem({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  destructive = false,
  toggle = false,
  toggleValue = false,
  onToggle,
}: SettingItemProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={toggle}
      style={({ pressed }) => [
        styles.settingItem,
        { backgroundColor: pressed && !toggle ? theme.backgroundTertiary : "transparent" },
      ]}
    >
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: destructive ? theme.error + "15" : theme.primary + "15" },
        ]}
      >
        <Feather name={icon} size={18} color={destructive ? theme.error : theme.primary} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText style={[styles.settingLabel, destructive && { color: theme.error }]}>
          {label}
        </ThemedText>
        {value ? (
          <ThemedText style={[styles.settingValue, { color: theme.textSecondary }]}>
            {value}
          </ThemedText>
        ) : null}
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: theme.backgroundTertiary, true: theme.primary + "50" }}
          thumbColor={toggleValue ? theme.primary : theme.backgroundDefault}
        />
      ) : showChevron ? (
        <Feather name="chevron-left" size={20} color={theme.textTertiary} />
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, preference, setPreference, colorScheme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language, currency, location } = usePreferences();
  const { t } = useI18n();
  const { user, signOut } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const isDarkMode = preference === "dark" || (preference === "system" && colorScheme === "dark");

  const handleNotificationsToggle = useCallback((value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(value);
  }, [t]);

  const handleThemeToggle = useCallback(
    (value: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPreference(value ? "dark" : "light");
    },
    [setPreference],
  );

  const handleOpenLink = useCallback(async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(t("common.openFailedTitle"), t("common.openFailedMessage"));
    }
  }, [t]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate("EditProfile");
  }, [navigation]);

  const handleOpenSelection = useCallback(
    (
      preferenceKey: "language" | "currency" | "location",
      title: string,
      options: { label: string; value: string }[],
      value: string,
    ) => {
      navigation.navigate("Selection", { preferenceKey, title, options, value });
    },
    [navigation],
  );

  const handleResetData = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t("settings.resetTitle"),
      t("settings.resetMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.resetData"),
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            await initializeData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(t("settings.resetDoneTitle"), t("settings.resetDoneMessage"));
          },
        },
      ],
    );
  }, [t]);

  const handleSignOut = useCallback(() => {
    Alert.alert(t("auth.signOut"), t("auth.signOutConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("auth.signOut"),
        style: "destructive",
        onPress: async () => {
          await signOut();
          navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
        },
      },
    ]);
  }, [navigation, signOut, t]);

  return (
    <ScreenBackground>
      <KeyboardAwareScrollViewCompat
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
      <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t("settings.account")}
        </ThemedText>
        <SettingItem icon="user" label={t("settings.editProfile")} onPress={handleEditProfile} />
        <SettingItem
          icon="globe"
          label={t("settings.language")}
          value={getLanguageLabel(language, language)}
          onPress={() =>
            handleOpenSelection("language", t("selection.languageTitle"), getLanguageOptions(language), language)
          }
        />
        <SettingItem
          icon="bell"
          label={t("settings.notifications")}
          toggle
          toggleValue={notifications}
          onToggle={handleNotificationsToggle}
        />
        {user ? (
          <SettingItem
            icon="log-out"
            label={t("auth.signOut")}
            onPress={handleSignOut}
            destructive
            showChevron={false}
          />
        ) : null}
      </View>

      <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t("settings.preferences")}
        </ThemedText>
        <SettingItem
          icon="moon"
          label={t("settings.darkMode")}
          toggle
          toggleValue={isDarkMode}
          onToggle={handleThemeToggle}
        />
        <SettingItem
          icon="dollar-sign"
          label={t("settings.currency")}
          value={getCurrencyLabel(language, currency)}
          onPress={() =>
            handleOpenSelection("currency", t("selection.currencyTitle"), getCurrencyOptions(language), currency)
          }
        />
        <SettingItem
          icon="map-pin"
          label={t("settings.defaultLocation")}
          value={getLocationLabel(language, location)}
          onPress={() =>
            handleOpenSelection("location", t("selection.locationTitle"), getLocationOptions(language), location)
          }
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t("settings.support")}
        </ThemedText>
        <SettingItem
          icon="help-circle"
          label={t("settings.helpCenter")}
          onPress={() => handleOpenLink(APP_CONFIG.supportUrl)}
        />
        <SettingItem
          icon="message-circle"
          label={t("settings.contactUs")}
          onPress={() => handleOpenLink(APP_CONFIG.contactUrl)}
        />
        <SettingItem
          icon="star"
          label={t("settings.rateApp")}
          onPress={() => handleOpenLink(APP_CONFIG.rateUrl)}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t("settings.legal")}
        </ThemedText>
        <SettingItem
          icon="file-text"
          label={t("settings.terms")}
          onPress={() => handleOpenLink(APP_CONFIG.termsUrl)}
        />
        <SettingItem
          icon="shield"
          label={t("settings.privacy")}
          onPress={() => handleOpenLink(APP_CONFIG.privacyUrl)}
        />
      </View>

      <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
        <SettingItem
          icon="trash-2"
          label={t("settings.resetData")}
          onPress={handleResetData}
          destructive
          showChevron={false}
        />
      </View>

      <View style={styles.footer}>
        <ThemedText style={[styles.footerText, { color: theme.textTertiary }]}>
          {t("settings.version")}
        </ThemedText>
      </View>
      </KeyboardAwareScrollViewCompat>
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
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  footerText: {
    fontSize: 13,
  },
});
