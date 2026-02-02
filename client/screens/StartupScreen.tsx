import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { useAuth } from "@/hooks/useAuth";
import { Spacing } from "@/constants/theme";
import { ScreenBackground } from "@/components/ScreenBackground";

export default function StartupScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isLoading, session, isGuest } = useAuth();
  const [animationDone, setAnimationDone] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const background = useMemo(
    () => ({
      backgroundColor: theme.backgroundRoot,
    }),
    [theme.backgroundRoot],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        setAnimationDone(true);
      }, 600);
    });
  }, [opacity, scale, glow]);

  useEffect(() => {
    if (!animationDone || isLoading) return;
    if (session || isGuest) {
      navigation.replace("Main");
    } else {
      navigation.replace("Auth");
    }
  }, [animationDone, isLoading, session, isGuest, navigation]);

  return (
    <ScreenBackground style={background}>
      <Animated.View style={[styles.glow, { opacity: glow, backgroundColor: theme.primary + "20" }]} />
      <Animated.View style={[styles.logoContainer, { opacity, transform: [{ scale }] }]}>
        <View style={[styles.logoMark, { borderColor: theme.primary, backgroundColor: theme.primary + "12" }]} />
        <ThemedText type="hero" style={styles.title}>
          {t("app.name")}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t("auth.splashTagline")}
        </ThemedText>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  logoContainer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  logoMark: {
    width: 76,
    height: 76,
    borderRadius: 24,
    borderWidth: 2,
  },
  title: {
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
  },
});
