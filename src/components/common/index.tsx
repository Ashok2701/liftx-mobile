import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/theme';

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  fullWidth = true,
}) => {
  const sizeStyles = {
    sm: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, height: 36 },
    md: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, height: 48 },
    lg: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base, height: 56 },
  };

  const textSizes = {
    sm: Typography.labelMedium,
    md: Typography.labelLarge,
    lg: { ...Typography.labelLarge, fontSize: 16 },
  };

  if (variant === 'primary') {
    return (
      <LinearGradient
        colors={Colors.gradient.brand}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          sizeStyles[size],
          fullWidth && { width: '100%' },
          Shadows.brand,
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || loading}
          style={styles.buttonInner}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
              <Text style={[styles.buttonText, textSizes[size]]}>{title}</Text>
              {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const variantStyles = {
    secondary: {
      bg: Colors.background.elevated,
      text: Colors.text.primary,
      border: Colors.border.strong,
    },
    ghost: {
      bg: 'transparent',
      text: Colors.brand.primary,
      border: Colors.brand.dim,
    },
    danger: {
      bg: Colors.error.dim,
      text: Colors.error.default,
      border: Colors.error.default,
    },
  };

  const vs = variantStyles[variant as 'secondary' | 'ghost' | 'danger'];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        sizeStyles[size],
        fullWidth && { width: '100%' },
        { backgroundColor: vs.bg, borderColor: vs.border, borderWidth: 1 },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.text} size="small" />
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={[styles.buttonText, textSizes[size], { color: vs.text }]}>
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress, gradient }) => {
  const content = gradient ? (
    <LinearGradient
      colors={Colors.gradient.card}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  ) : (
    <View style={[styles.card, style]}>{children}</View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  editable?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  leftIcon,
  rightIcon,
  multiline,
  numberOfLines,
  style,
  editable = true,
}) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputFocused,
          error ? styles.inputError : undefined,
          !editable && styles.inputDisabled,
        ]}
      >
        {leftIcon && <View style={styles.inputIcon}>{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.muted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            leftIcon ? { paddingLeft: 0 } : undefined,
            multiline && { height: (numberOfLines || 3) * 24, textAlignVertical: 'top' },
          ]}
        />
        {rightIcon && <View style={styles.inputIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'brand' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'brand', size = 'md' }) => {
  const variantMap = {
    success: { bg: Colors.success.dim, text: Colors.success.default },
    warning: { bg: Colors.warning.dim, text: Colors.warning.default },
    error: { bg: Colors.error.dim, text: Colors.error.default },
    info: { bg: Colors.info.dim, text: Colors.info.default },
    brand: { bg: Colors.brand.dim, text: Colors.brand.primary },
    neutral: { bg: Colors.background.elevated, text: Colors.text.secondary },
  };

  const vs = variantMap[variant];
  const textStyle = size === 'sm' ? Typography.labelSmall : Typography.labelMedium;

  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }]}>
      <Text style={[textStyle, { color: vs.text }]}>{label}</Text>
    </View>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  color?: string;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon,
  color = Colors.brand.primary,
  style,
}) => (
  <Card style={[styles.statCard, style]}>
    <View style={[styles.statIconBg, { backgroundColor: color + '20' }]}>
      {icon}
    </View>
    <Text style={[Typography.statMedium, { color: Colors.text.primary, marginTop: Spacing.sm }]}>
      {value}
    </Text>
    <Text style={[Typography.labelMedium, { color: Colors.text.secondary, marginTop: 2 }]}>
      {label}
    </Text>
    {subValue && (
      <Text style={[Typography.bodySmall, { color: color, marginTop: 2 }]}>{subValue}</Text>
    )}
  </Card>
);

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={[Typography.labelMedium, { color: Colors.brand.primary }]}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  onAction,
  icon,
}) => (
  <View style={styles.emptyState}>
    {icon && <View style={styles.emptyIcon}>{icon}</View>}
    <Text style={[Typography.headlineSmall, { color: Colors.text.primary, textAlign: 'center' }]}>
      {title}
    </Text>
    {description && (
      <Text
        style={[
          Typography.bodyMedium,
          { color: Colors.text.secondary, textAlign: 'center', marginTop: Spacing.sm },
        ]}
      >
        {description}
      </Text>
    )}
    {action && onAction && (
      <Button
        title={action}
        onPress={onAction}
        variant="ghost"
        fullWidth={false}
        style={{ marginTop: Spacing.lg }}
      />
    )}
  </View>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  progress: number; // 0–1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.brand.primary,
  height = 6,
  style,
}) => (
  <View style={[styles.progressTrack, { height }, style]}>
    <LinearGradient
      colors={[color, color + 'AA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.progressFill,
        { width: `${Math.min(100, Math.max(0, progress * 100))}%`, height },
      ]}
    />
  </View>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 40, style }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text
        style={[
          Typography.labelMedium,
          { color: Colors.text.primary, fontSize: size * 0.35 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

// ─── Divider ──────────────────────────────────────────────────────────────────

export const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const Skeleton: React.FC<{ width?: number | string; height?: number; style?: ViewStyle }> = ({
  width = '100%',
  height = 20,
  style,
}) => (
  <View
    style={[
      styles.skeleton,
      { width: width as any, height },
      style,
    ]}
  />
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  buttonText: {
    color: Colors.text.primary,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
  iconLeft: { marginRight: Spacing.sm },
  iconRight: { marginLeft: Spacing.sm },

  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Shadows.sm,
  },

  inputContainer: { marginBottom: Spacing.base },
  inputLabel: {
    ...Typography.labelMedium,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingHorizontal: Spacing.base,
  },
  inputFocused: {
    borderColor: Colors.brand.primary,
  },
  inputError: {
    borderColor: Colors.error.default,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
  },
  inputIcon: { marginHorizontal: Spacing.sm },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error.default,
    marginTop: Spacing.xs,
  },

  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },

  statCard: {
    flex: 1,
    padding: Spacing.base,
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['3xl'],
  },
  emptyIcon: {
    marginBottom: Spacing.base,
    opacity: 0.4,
  },

  progressTrack: {
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: BorderRadius.full,
  },

  avatar: {
    backgroundColor: Colors.brand.dim,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.brand.primary + '40',
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border.default,
    marginVertical: Spacing.base,
  },

  skeleton: {
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.md,
  },
});
