import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { useAuth } from "@/hooks/useAuth";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { ScreenBackground } from "@/components/ScreenBackground";

export default function AuthOptionsScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const { continueAsGuest } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const handleSkip = () => {
    continueAsGuest();
    if (rootNavigation) {
      rootNavigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            Shadows.card,
          ]}
        >
          <ThemedText type="h2" style={styles.title}>
            {t("auth.optionsTitle")}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("auth.optionsSubtitle")}
          </ThemedText>

          <Button onPress={() => navigation.navigate("SignIn")}>{t("auth.signIn")}</Button>
          <Button onPress={() => navigation.navigate("SignUp")} variant="outline">
            {t("auth.signUp")}
          </Button>

          <Pressable onPress={handleSkip} style={styles.skip}>
            <ThemedText style={[styles.skipText, { color: theme.textSecondary }]}>
              {t("auth.skipForNow")}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  skip: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
