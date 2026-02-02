import React, { useState } from "react";
import { StyleSheet, View, Alert, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { supabase } from "@/lib/supabase";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { ScreenBackground } from "@/components/ScreenBackground";

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const isValidEmail = email.includes("@") && email.includes(".");
    if (!isValidEmail) {
      Alert.alert(t("auth.invalidEmailTitle"), t("auth.invalidEmailMessage"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) {
      Alert.alert(t("auth.resetFailedTitle"), error.message);
      return;
    }
    Alert.alert(t("auth.resetSentTitle"), t("auth.resetSentMessage"));
    navigation.goBack();
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
            {t("auth.resetPassword")}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("auth.resetSubtitle")}
          </ThemedText>

          <Input
            label={t("auth.email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Button onPress={handleReset} disabled={!email || loading}>
            {loading ? t("auth.resetSending") : t("auth.resetSend")}
          </Button>

          <Pressable onPress={() => navigation.goBack()} style={styles.linkRow}>
            <ThemedText style={[styles.linkText, { color: theme.primary }]}>
              {t("common.back")}
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
