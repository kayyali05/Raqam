import React, { forwardRef } from "react";
import { View, TextInput, StyleSheet, TextInputProps, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightIcon, onRightIconPress, style, ...props }, ref) => {
    const { theme } = useTheme();
    const isMultiline = Boolean(props.multiline);

    return (
      <View style={styles.container}>
        {label ? (
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            {label}
          </ThemedText>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: error ? theme.error : theme.border,
            },
            isMultiline && styles.inputContainerMultiline,
          ]}
        >
          {leftIcon ? (
            <Feather
              name={leftIcon}
              size={20}
              color={theme.textTertiary}
              style={styles.leftIcon}
            />
          ) : null}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              { color: theme.text },
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              isMultiline && styles.inputMultiline,
              style,
            ]}
            placeholderTextColor={theme.textTertiary}
            {...props}
          />
          {rightIcon ? (
            <Pressable onPress={onRightIconPress} style={styles.rightIcon} hitSlop={12}>
              <Feather name={rightIcon} size={20} color={theme.textTertiary} />
            </Pressable>
          ) : null}
        </View>
        {error ? (
          <ThemedText style={[styles.error, { color: theme.error }]}>{error}</ThemedText>
        ) : null}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    height: Spacing.inputHeight,
  },
  inputContainerMultiline: {
    height: "auto",
    alignItems: "flex-start",
    paddingVertical: Spacing.sm,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: Spacing.xl,
    fontSize: 16,
  },
  inputMultiline: {
    height: "auto",
    minHeight: Spacing.inputHeight,
    paddingVertical: Spacing.sm,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.xs,
  },
  leftIcon: {
    marginLeft: Spacing.xl,
  },
  rightIcon: {
    marginRight: Spacing.xl,
  },
  error: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
