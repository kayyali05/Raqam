import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CreateListingScreen from "@/screens/CreateListingScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useI18n } from "@/hooks/useI18n";

export type SellStackParamList = {
  CreateListing: undefined;
};

const Stack = createNativeStackNavigator<SellStackParamList>();

export default function SellStackNavigator() {
  const screenOptions = useScreenOptions();
  const { t } = useI18n();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={{
          headerTitle: t("createListing.title"),
        }}
      />
    </Stack.Navigator>
  );
}
