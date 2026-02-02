import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { ListingCategory } from "@/types/listing";

type FilterOption = ListingCategory | "all";

interface CategoryFilterProps {
  selected: FilterOption;
  onChange: (category: FilterOption) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { theme } = useTheme();
  const { t } = useI18n();

  const options: { value: FilterOption; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { value: "all", label: t("common.all"), icon: "grid" },
    { value: "car_plate", label: t("listing.carPlate"), icon: "truck" },
    { value: "mobile_number", label: t("listing.mobileNumber"), icon: "smartphone" },
  ];

  const handlePress = (value: FilterOption) => {
    if (value !== selected) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
      ]}
    >
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => handlePress(option.value)}
            style={[
              styles.option,
              { borderColor: theme.border },
              isSelected && [
                styles.optionSelected,
                { backgroundColor: theme.backgroundDefault, borderColor: theme.primary },
                Shadows.card,
              ],
            ]}
            testID={`filter-${option.value}`}
          >
            <Feather
              name={option.icon}
              size={15}
              color={isSelected ? theme.primary : theme.textSecondary}
            />
            <ThemedText
              style={[
                styles.optionText,
                { color: isSelected ? theme.primary : theme.textSecondary },
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    borderWidth: 1,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  optionSelected: {
    transform: [{ scale: 1.01 }],
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
});
