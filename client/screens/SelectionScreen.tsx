import React, { useCallback } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { usePreferences } from "@/hooks/usePreferences";

type SelectionRouteProp = RouteProp<RootStackParamList, "Selection">;

export default function SelectionScreen() {
  const { theme } = useTheme();
  const { setPreference } = usePreferences();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const route = useRoute<SelectionRouteProp>();

  const { title, options, value, preferenceKey } = route.params;

  const handleSelect = useCallback(
    (nextValue: string) => {
      setPreference(preferenceKey, nextValue as any);
      navigation.goBack();
    },
    [navigation, preferenceKey, setPreference],
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundRoot, paddingTop: headerHeight + Spacing.xl },
      ]}
    >
      <ThemedText type="h3" style={styles.title}>
        {title}
      </ThemedText>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
          Shadows.card,
        ]}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option.value)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: pressed ? theme.backgroundSecondary : "transparent",
                },
              ]}
            >
              <ThemedText style={styles.label}>{option.label}</ThemedText>
              {isSelected ? (
                <View style={[styles.check, { backgroundColor: theme.primary + "15" }]}>
                  <Feather name="check" size={16} color={theme.primary} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={{ height: insets.bottom + Spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  title: {
    textAlign: "right",
    marginBottom: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
