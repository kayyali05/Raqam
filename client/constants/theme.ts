import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1A1512",
    textSecondary: "#6A5F57",
    textTertiary: "#A49387",
    buttonText: "#FFFFFF",
    tabIconDefault: "#A49387",
    tabIconSelected: "#C89F5D",
    link: "#B8873A",
    primary: "#C89F5D",
    primaryDark: "#9F7A3E",
    accent: "#1E2A39",
    backgroundRoot: "#F8F5F0",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F4F0EA",
    backgroundTertiary: "#EFEAE2",
    border: "#E5DED4",
    success: "#2E7D63",
    error: "#C43E3E",
    warning: "#D89F3D",
    skeleton: "#E6DFD5",
  },
  dark: {
    text: "#F7F2EC",
    textSecondary: "#B9B2AB",
    textTertiary: "#7E756E",
    buttonText: "#FFFFFF",
    tabIconDefault: "#7E756E",
    tabIconSelected: "#C89F5D",
    link: "#D7B06A",
    primary: "#C89F5D",
    primaryDark: "#B48A46",
    accent: "#3D4C5C",
    backgroundRoot: "#15120F",
    backgroundDefault: "#1C1916",
    backgroundSecondary: "#26221F",
    backgroundTertiary: "#2E2925",
    border: "#3A342F",
    success: "#3B9C7D",
    error: "#D45E5E",
    warning: "#E8AF4D",
    skeleton: "#3A342F",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  inputHeight: 54,
  buttonHeight: 60,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
};

export const Typography = {
  hero: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
  },
  numberDisplay: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 6,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
