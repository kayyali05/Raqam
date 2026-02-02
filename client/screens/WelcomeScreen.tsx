import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { ScreenBackground } from "@/components/ScreenBackground";

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <ScreenBackground>
      <View style={styles.content}>
        <View
          style={[
            styles.heroCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            Shadows.card,
          ]}
        >
          <Image
            source={require("../../assets/images/splash-icon.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <ThemedText type="h2" style={styles.title}>
            {t("auth.welcomeTitle")}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("auth.welcomeSubtitle")}
          </ThemedText>
          <Button onPress={() => navigation.navigate("AuthOptions")}>
            {t("auth.getStarted")}
          </Button>
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
  heroCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.md,
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
});
