import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getUser, updateUser } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/hooks/useI18n";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUser().then((user) => {
      if (!user) return;
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
      setLocation(user.location ?? "");
      setBio(user.bio ?? "");
      setAvatar(user.avatar);
    });
  }, []);

  const handlePickAvatar = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t("profile.photoPermissionTitle"), t("profile.photoPermissionMessage"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  }, [t]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        bio: bio.trim(),
        avatar,
      });
      await supabase.auth.updateUser({
        data: {
          full_name: name.trim(),
          phone: phone.trim(),
          location: location.trim(),
          bio: bio.trim(),
          avatar_url: avatar,
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t("editProfile.successTitle"), t("editProfile.successMessage"));
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert(t("editProfile.errorTitle"), t("editProfile.errorMessage"));
    } finally {
      setSaving(false);
    }
  }, [name, phone, location, bio, avatar, t]);

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
        <View style={[styles.card, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <ThemedText type="h3" style={styles.title}>
            {t("editProfile.title")}
          </ThemedText>
          <View style={styles.avatarRow}>
            <Pressable onPress={handlePickAvatar} style={styles.avatarButton}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarFallback, { backgroundColor: theme.primary + "20" }]}>
                  <ThemedText style={[styles.avatarInitial, { color: theme.primary }]}>
                    {name.trim().charAt(0) || t("profile.defaultInitial")}
                  </ThemedText>
                </View>
              )}
              <View style={[styles.avatarBadge, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
                <ThemedText style={[styles.avatarBadgeText, { color: theme.textSecondary }]}>
                  {t("profile.changePhoto")}
                </ThemedText>
              </View>
            </Pressable>
          </View>
          <Input label={t("editProfile.name")} value={name} onChangeText={setName} />
          <Input label={t("editProfile.phone")} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label={t("editProfile.city")} value={location} onChangeText={setLocation} />
          <Input
            label={t("editProfile.bio")}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            style={styles.bioInput}
          />
          <Button onPress={handleSave} disabled={saving}>
            {saving ? t("editProfile.saving") : t("editProfile.save")}
          </Button>
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
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
  },
  avatarRow: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatarButton: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: "700",
  },
  avatarBadge: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  avatarBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    textAlign: "right",
    marginBottom: Spacing.lg,
  },
  bioInput: {
    height: 110,
    textAlignVertical: "top",
  },
});
