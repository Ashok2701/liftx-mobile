import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Button, Input } from '@/components/common';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { LoginPayload } from '@/types';
import { NotificationService } from '@/services/firebase/notifications';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data as LoginPayload);
      const { user, accessToken, refreshToken } = response.data.data;
      setAuth(user, accessToken, refreshToken);

      // Register FCM token after login
      NotificationService.registerToken().catch(() => {});
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: err?.message || 'Check your credentials and try again',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />

      {/* Background accents */}
      <View style={styles.accentTop} />
      <View style={styles.accentBottom} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Brand */}
        <View style={styles.brand}>
          <LinearGradient
            colors={Colors.gradient.brand}
            style={styles.logoBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoText}>G</Text>
          </LinearGradient>
          <Text style={styles.appName}>GymOS</Text>
          <Text style={styles.tagline}>Your complete fitness operating system</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign in</Text>
          <Text style={styles.formSubtitle}>Welcome back. Let's get to work.</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="your@email.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
                leftIcon={
                  <Text style={{ fontSize: 16 }}>✉️</Text>
                }
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                error={errors.password?.message}
                leftIcon={<Text style={{ fontSize: 16 }}>🔒</Text>}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                }
              />
            )}
          />

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={[Typography.labelMedium, { color: Colors.brand.primary }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Sign in"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            style={styles.loginBtn}
          />

          {/* Demo credentials hint */}
          <View style={styles.demoHint}>
            <Text style={[Typography.bodySmall, { color: Colors.text.muted, textAlign: 'center' }]}>
              Demo: member@gymos.app / trainer@gymos.app
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={[Typography.bodySmall, styles.footer]}>
          © 2024 GymOS. All rights reserved.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },

  // Background decorations
  accentTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.brand.glow,
    opacity: 0.4,
  },
  accentBottom: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.brand.dim,
    opacity: 0.6,
  },

  // Brand
  brand: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  appName: {
    ...Typography.displaySmall,
    color: Colors.text.primary,
    letterSpacing: 2,
  },
  tagline: {
    ...Typography.bodyMedium,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },

  // Form
  form: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  formTitle: {
    ...Typography.headlineLarge,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xl,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  loginBtn: {
    marginTop: Spacing.sm,
  },
  demoHint: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.md,
  },

  footer: {
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
