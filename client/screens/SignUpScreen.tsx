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

export default function SignUpScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const { signUp } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const isValidEmail = email.includes("@") && email.includes(".");
    if (!isValidEmail) {
      Alert.alert(t("auth.invalidEmailTitle"), t("auth.invalidEmailMessage"));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("auth.passwordTooShortTitle"), t("auth.passwordTooShortMessage"));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t("auth.passwordMismatchTitle"), t("auth.passwordMismatchMessage"));
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), password, fullName.trim());
    setLoading(false);

    if (result.error) {
      Alert.alert(t("auth.signUpFailedTitle"), result.error);
      return;
    }

    if (result.hasSession) {
      if (rootNavigation) {
        rootNavigation.reset({ index: 0, routes: [{ name: "Main" }] });
      }
    } else {
      navigation.navigate("VerifyEmail", { email: email.trim() });
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
            {t("auth.signUp")}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("auth.signUpSubtitle")}
          </ThemedText>

          <Input label={t("auth.fullName")} value={fullName} onChangeText={setFullName} />
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
          <Input
            label={t("auth.confirmPassword")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <Button
            onPress={handleSignUp}
            disabled={!email || !password || !confirmPassword || loading}
          >
            {loading ? t("auth.signingUp") : t("auth.signUp")}
          </Button>

          <Pressable onPress={() => navigation.navigate("SignIn")} style={styles.linkRow}>
            <ThemedText style={[styles.linkText, { color: theme.primary }]}>
              {t("auth.haveAccount")}
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
