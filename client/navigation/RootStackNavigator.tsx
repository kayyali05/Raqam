import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigatorScreenParams } from "@react-navigation/native";

import MainTabNavigator, { MainTabParamList } from "@/navigation/MainTabNavigator";
import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import ListingDetailScreen from "@/screens/ListingDetailScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import EditProfileScreen from "@/screens/EditProfileScreen";
import SelectionScreen from "@/screens/SelectionScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useI18n } from "@/hooks/useI18n";
import StartupScreen from "@/screens/StartupScreen";

export type RootStackParamList = {
  Startup: undefined;
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  ListingDetail: { listingId: string };
  Settings: undefined;
  EditProfile: undefined;
  Selection: {
    title: string;
    options: { label: string; value: string }[];
    value: string;
    preferenceKey: "language" | "currency" | "location";
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useI18n();

  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Startup">
      <Stack.Screen
        name="Startup"
        component={StartupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{
          headerTitle: "",
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: t("settings.title"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: t("editProfile.title"),
          headerBackTitle: t("common.back"),
        }}
      />
      <Stack.Screen
        name="Selection"
        component={SelectionScreen}
        options={{
          headerTitle: "",
          headerBackTitle: t("common.back"),
        }}
      />
    </Stack.Navigator>
  );
}
