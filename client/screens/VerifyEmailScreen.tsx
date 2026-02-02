import React, { useState } from "react";
import { StyleSheet, View, Alert, Pressable } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { supabase } from "@/lib/supabase";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { ScreenBackground } from "@/components/ScreenBackground";

type VerifyRoute = RouteProp<AuthStackParamList, "VerifyEmail">;

export default function VerifyEmailScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<VerifyRoute>();
  const [loading, setLoading] = useState(false);

  const { email } = route.params;

  const handleResend = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setLoading(false);
    if (error) {
      Alert.alert(t("auth.verifyFailedTitle"), error.message);
      return;
    }
    Alert.alert(t("auth.verifySentTitle"), t("auth.verifySentMessage"));
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
            {t("auth.verifyTitle")}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("auth.verifySubtitle", { email })}
          </ThemedText>

          <Button onPress={handleResend} disabled={loading}>
            {loading ? t("auth.verifySending") : t("auth.verifyResend")}
          </Button>

          <Pressable onPress={() => navigation.navigate("SignIn")} style={styles.linkRow}>
            <ThemedText style={[styles.linkText, { color: theme.primary }]}>
              {t("auth.backToSignIn")}
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
  },
  linkRow: {
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
