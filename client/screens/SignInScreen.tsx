import React, { useState } from "react";
import { StyleSheet, View, Alert, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { useAuth } from "@/hooks/useAuth";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { ScreenBackground } from "@/components/ScreenBackground";

export default function SignInScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const { signIn } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const isValidEmail = email.includes("@") && email.includes(".");
    if (!isValidEmail) {
      Alert.alert(t("auth.invalidEmailTitle"), t("auth.invalidEmailMessage"));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("auth.passwordTooShortTitle"), t("auth.passwordTooShortMessage"));
      return;
    }
    setLoading(true);
    const error = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert(t("auth.signInFailedTitle"), error);
      return;
    }
    if (rootNavigation) {
      rootNavigation.reset({ index: 0, routes: [{ name: "Main" }] });
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
            {t("auth.signIn")}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("auth.signInSubtitle")}
          </ThemedText>

          <Input
            label={t("auth.email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            label={t("auth.password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <Button onPress={handleSignIn} disabled={!email || !password || loading}>
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>

          <Pressable onPress={() => navigation.navigate("ForgotPassword")} style={styles.linkRow}>
            <ThemedText style={[styles.linkText, { color: theme.textSecondary }]}>
              {t("auth.forgotPassword")}
            </ThemedText>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("SignUp")} style={styles.linkRow}>
            <ThemedText style={[styles.linkText, { color: theme.primary }]}>
              {t("auth.noAccount")}
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
