import React, { useState, useRef, useMemo } from "react";
import { View, StyleSheet, TextInput, Pressable, Image, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ScreenBackground } from "@/components/ScreenBackground";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { usePreferences } from "@/hooks/usePreferences";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ListingCategory, CreateListingInput } from "@/types/listing";
import { createListing } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getLocationOptions, getCurrencyLabel } from "@/i18n/options";

export default function CreateListingScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t, language } = useI18n();
  const { currency } = usePreferences();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [category, setCategory] = useState<ListingCategory>("car_plate");
  const [number, setNumber] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priceRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const isValid = number.trim() && price.trim() && location;
  const locationOptions = useMemo(() => getLocationOptions(language), [language]);
  const currencyLabel = getCurrencyLabel(language, currency);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!number.trim()) {
      newErrors.number = t("createListing.validationNumber");
    }

    if (!price.trim()) {
      newErrors.price = t("createListing.validationPrice");
    } else if (isNaN(Number(price.replace(/,/g, "")))) {
      newErrors.price = t("createListing.validationPriceInvalid");
    }

    if (!location) {
      newErrors.location = t("createListing.validationLocation");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const input: CreateListingInput = {
        category,
        number: number.trim(),
        price: Number(price.replace(/,/g, "")),
        description: description.trim(),
        location,
      };

      await createListing(input);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating listing:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setNumber("");
    setPrice("");
    setDescription("");
    setLocation("");
    setCategory("car_plate");
    navigation.navigate("Main", { screen: "HomeTab" });
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    setNumber("");
    setPrice("");
    setDescription("");
    setLocation("");
  };

  const formatPriceInput = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      const formattedValue = Number(numericValue).toLocaleString("en-US");
      setPrice(formattedValue);
    } else {
      setPrice("");
    }
  };

  return (
    <ScreenBackground>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.title}>{t("createListing.title")}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t("createListing.subtitle")}
        </ThemedText>

        <View style={styles.categorySection}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {t("createListing.numberType")}
          </ThemedText>
          <View style={styles.categoryButtons}>
            <Pressable
              onPress={() => {
                setCategory("car_plate");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: category === "car_plate" ? theme.primary + "15" : theme.backgroundDefault,
                  borderColor: category === "car_plate" ? theme.primary : theme.border,
                },
              ]}
            >
              <Feather
                name="truck"
                size={24}
                color={category === "car_plate" ? theme.primary : theme.textSecondary}
              />
              <ThemedText
                style={[
                  styles.categoryButtonText,
                  { color: category === "car_plate" ? theme.primary : theme.textSecondary },
                ]}
              >
                {t("createListing.carPlate")}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => {
                setCategory("mobile_number");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: category === "mobile_number" ? theme.primary + "15" : theme.backgroundDefault,
                  borderColor: category === "mobile_number" ? theme.primary : theme.border,
                },
              ]}
            >
              <Feather
                name="smartphone"
                size={24}
                color={category === "mobile_number" ? theme.primary : theme.textSecondary}
              />
              <ThemedText
                style={[
                  styles.categoryButtonText,
                  { color: category === "mobile_number" ? theme.primary : theme.textSecondary },
                ]}
              >
                {t("createListing.mobileNumber")}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <Input
          label={t("createListing.numberLabel")}
          placeholder={
            category === "car_plate"
              ? t("createListing.numberPlaceholderCar")
              : t("createListing.numberPlaceholderMobile")
          }
          value={number}
          onChangeText={setNumber}
          error={errors.number}
          returnKeyType="next"
          onSubmitEditing={() => priceRef.current?.focus()}
          leftIcon={category === "car_plate" ? "truck" : "smartphone"}
        />

        <Input
          ref={priceRef}
          label={`${t("createListing.priceLabel")} (${currencyLabel})`}
          placeholder={t("createListing.pricePlaceholder")}
          value={price}
          onChangeText={formatPriceInput}
          keyboardType="numeric"
          error={errors.price}
          returnKeyType="next"
          onSubmitEditing={() => descriptionRef.current?.focus()}
          leftIcon="dollar-sign"
        />

        <View style={styles.locationSection}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {t("createListing.locationLabel")}
          </ThemedText>
          <Pressable
            onPress={() => setShowLocationPicker(true)}
            style={[
              styles.locationButton,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: errors.location ? theme.error : theme.border,
              },
            ]}
          >
            <Feather name="map-pin" size={20} color={theme.textTertiary} />
            <ThemedText
              style={[
                styles.locationButtonText,
                { color: location ? theme.text : theme.textTertiary },
              ]}
            >
              {location || t("createListing.locationPlaceholder")}
            </ThemedText>
            <Feather name="chevron-down" size={20} color={theme.textTertiary} />
          </Pressable>
          {errors.location ? (
            <ThemedText style={[styles.errorText, { color: theme.error }]}>
              {errors.location}
            </ThemedText>
          ) : null}
        </View>

        <Input
          ref={descriptionRef}
          label={t("createListing.descriptionLabel")}
          placeholder={t("createListing.descriptionPlaceholder")}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.descriptionInput}
          textAlignVertical="top"
        />

        <Button
          onPress={handleSubmit}
          disabled={!isValid || submitting}
          style={[styles.submitButton, { backgroundColor: theme.primary }]}
        >
          {submitting ? t("createListing.publishing") : t("createListing.publish")}
        </Button>
      </KeyboardAwareScrollViewCompat>

      <Modal visible={showLocationPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>{t("createListing.selectLocation")}</ThemedText>
              <Pressable onPress={() => setShowLocationPicker(false)} hitSlop={12}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>
            {locationOptions.map((loc) => (
              <Pressable
                key={loc.value}
                onPress={() => {
                  setLocation(loc.label);
                  setShowLocationPicker(false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[
                  styles.locationOption,
                  { borderBottomColor: theme.border },
                  location === loc.label && { backgroundColor: theme.primary + "10" },
                ]}
              >
                <ThemedText
                  style={[
                    styles.locationOptionText,
                    location === loc.label && { color: theme.primary, fontWeight: "600" },
                  ]}
                >
                  {loc.label}
                </ThemedText>
                {location === loc.label ? (
                  <Feather name="check" size={20} color={theme.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccess} animationType="fade" transparent>
        <View style={[styles.successOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
          <View style={[styles.successContent, { backgroundColor: theme.backgroundDefault }]}>
            <Image
              source={require("../../assets/images/success-post.png")}
              style={styles.successImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.successTitle}>{t("createListing.successTitle")}</ThemedText>
            <ThemedText style={[styles.successSubtitle, { color: theme.textSecondary }]}>
              {t("createListing.successSubtitle")}
            </ThemedText>
            <View style={styles.successButtons}>
              <Button onPress={handleSuccessClose} style={{ flex: 1, backgroundColor: theme.primary }}>
                {t("createListing.successView")}
              </Button>
              <Pressable onPress={handleAddAnother} style={styles.addAnotherButton}>
                <ThemedText style={[styles.addAnotherText, { color: theme.primary }]}>
                  {t("createListing.successAddAnother")}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "right",
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  categorySection: {
    marginBottom: Spacing.lg,
  },
  categoryButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  categoryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: Spacing.sm,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  locationSection: {
    marginBottom: Spacing.lg,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  locationButtonText: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  descriptionInput: {
    height: 100,
    paddingTop: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing["3xl"],
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  locationOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  locationOptionText: {
    fontSize: 16,
  },
  successOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  successContent: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    maxWidth: 520,
  },
  successImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  successSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  successButtons: {
    width: "100%",
  },
  addAnotherButton: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
  },
  addAnotherText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
