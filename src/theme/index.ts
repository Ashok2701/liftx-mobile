// GymOS Design System
// Dark, high-performance aesthetic inspired by elite athletic environments

export const Colors = {
  // Core palette
  background: {
    primary: '#0A0A0F',
    secondary: '#12121A',
    card: '#1A1A26',
    elevated: '#222234',
    overlay: 'rgba(0,0,0,0.7)',
  },

  // Brand accent — electric violet-blue
  brand: {
    primary: '#6C47FF',
    secondary: '#8B6FFF',
    light: '#A99BFF',
    dim: 'rgba(108,71,255,0.15)',
    glow: 'rgba(108,71,255,0.3)',
  },

  // Semantic
  success: {
    default: '#22C55E',
    dim: 'rgba(34,197,94,0.15)',
  },
  warning: {
    default: '#F59E0B',
    dim: 'rgba(245,158,11,0.15)',
  },
  error: {
    default: '#EF4444',
    dim: 'rgba(239,68,68,0.15)',
  },
  info: {
    default: '#3B82F6',
    dim: 'rgba(59,130,246,0.15)',
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0B8',
    muted: '#5C5C7A',
    inverse: '#0A0A0F',
    accent: '#6C47FF',
  },

  // Border
  border: {
    default: 'rgba(255,255,255,0.08)',
    strong: 'rgba(255,255,255,0.15)',
    brand: 'rgba(108,71,255,0.4)',
  },

  // Gradients (as arrays for LinearGradient)
  gradient: {
    brand: ['#6C47FF', '#3B1FCC'],
    dark: ['#1A1A26', '#0A0A0F'],
    card: ['#222234', '#1A1A26'],
    success: ['#22C55E', '#16A34A'],
    warning: ['#F59E0B', '#D97706'],
    transparent: ['rgba(10,10,15,0)', 'rgba(10,10,15,1)'],
  },

  // Muscle group colors
  muscle: {
    chest: '#EF4444',
    back: '#3B82F6',
    legs: '#22C55E',
    arms: '#F59E0B',
    shoulders: '#8B5CF6',
    abs: '#EC4899',
    cardio: '#06B6D4',
  },
} as const;

export const Typography = {
  // Display — heavy, condensed for impact
  displayLarge: { fontSize: 40, fontWeight: '800' as const, letterSpacing: -1.5, lineHeight: 46 },
  displayMedium: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -1, lineHeight: 38 },
  displaySmall: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 32 },

  // Headlines
  headlineLarge: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 28 },
  headlineMedium: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.2, lineHeight: 24 },
  headlineSmall: { fontSize: 16, fontWeight: '600' as const, letterSpacing: -0.1, lineHeight: 22 },

  // Body
  bodyLarge: { fontSize: 16, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 24 },
  bodyMedium: { fontSize: 14, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 20 },
  bodySmall: { fontSize: 12, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 18 },

  // Labels
  labelLarge: { fontSize: 14, fontWeight: '600' as const, letterSpacing: 0.5, lineHeight: 20 },
  labelMedium: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5, lineHeight: 16 },
  labelSmall: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 0.8, lineHeight: 14 },

  // Mono (for stats/numbers)
  statLarge: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -1, lineHeight: 42 },
  statMedium: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 30 },
  statSmall: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 24 },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  brand: {
    shadowColor: '#6C47FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const Theme = { Colors, Typography, Spacing, BorderRadius, Shadows };
export default Theme;
