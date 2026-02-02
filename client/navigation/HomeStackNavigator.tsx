import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import ExploreScreen from "@/screens/ExploreScreen";
import SearchScreen from "@/screens/SearchScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { Spacing } from "@/constants/theme";

export type HomeStackParamList = {
  Explore: undefined;
  Search: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const screenOptions = useScreenOptions();
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title={t("app.name")} subtitle={t("app.subtitle")} />,
          headerRight: () => (
            <Pressable
              hitSlop={12}
              style={[
                styles.headerAction,
                { marginRight: Spacing.sm, backgroundColor: theme.backgroundDefault },
              ]}
              onPress={() => navigation.navigate("Search")}
            >
              <Feather name="search" size={22} color={theme.text} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerTitle: "",
          headerBackTitle: t("common.back"),
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
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
  },
});
