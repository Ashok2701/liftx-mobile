import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useMemberProfile, useMembership } from '@/hooks';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, Avatar, Badge, Button, Divider } from '@/components/common';
import { format, differenceInDays } from 'date-fns';

export const MemberProfileScreen: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const { data: profile } = useMemberProfile();
  const { data: membership } = useMembership();

  const daysLeft = membership?.endDate ? differenceInDays(new Date(membership.endDate), new Date()) : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar + name */}
        <View style={styles.profileCard}>
          <Avatar name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} size={80} />
          <Text style={[Typography.headlineLarge, { color: Colors.text.primary, marginTop: Spacing.md }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>{user?.email}</Text>
          <Badge label={profile?.memberId ?? 'Loading...'} variant="brand" />
        </View>

        {/* Membership status */}
        {membership && (
          <Card style={styles.card}>
            <Text style={[Typography.labelMedium, { color: Colors.text.secondary, marginBottom: Spacing.sm }]}>Membership</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>{membership.plan.name}</Text>
              <Badge label={membership.status} variant={membership.status === 'ACTIVE' ? 'success' : 'error'} />
            </View>
            {daysLeft !== null && (
              <Text style={[Typography.bodySmall, { color: daysLeft < 14 ? Colors.warning.default : Colors.text.muted, marginTop: 4 }]}>
                {daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}
              </Text>
            )}
          </Card>
        )}

        {/* Body stats */}
        {profile && (
          <Card style={styles.card}>
            <Text style={[Typography.labelMedium, { color: Colors.text.secondary, marginBottom: Spacing.md }]}>Body stats</Text>
            <View style={styles.statsGrid}>
              {[
                { label: 'Height', value: profile.height ? `${profile.height} cm` : '—' },
                { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : '—' },
                { label: 'Goal', value: profile.fitnessGoal?.replace('_', ' ') ?? '—' },
                { label: 'Gender', value: profile.gender ?? '—' },
              ].map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={[Typography.bodyMedium, { color: Colors.text.primary, fontWeight: '700' }]}>{s.value}</Text>
                  <Text style={[Typography.labelSmall, { color: Colors.text.muted }]}>{s.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Health notes */}
        {profile?.healthNotes && (
          <Card style={styles.card}>
            <Text style={[Typography.labelMedium, { color: Colors.text.secondary, marginBottom: Spacing.sm }]}>⚠️ Health notes</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.text.primary }]}>{profile.healthNotes}</Text>
          </Card>
        )}

        {/* Emergency contact */}
        {profile?.emergencyContact && (
          <Card style={styles.card}>
            <Text style={[Typography.labelMedium, { color: Colors.text.secondary, marginBottom: Spacing.sm }]}>🚨 Emergency contact</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.text.primary }]}>{profile.emergencyContact}</Text>
            <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>{profile.emergencyPhone}</Text>
          </Card>
        )}

        <Divider style={{ marginVertical: Spacing.base }} />

        <Button title="Sign out" onPress={clearAuth} variant="danger" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  header: { paddingTop: Spacing.lg, marginBottom: Spacing.base },
  title: { ...Typography.displaySmall, color: Colors.text.primary },
  profileCard: { alignItems: 'center', marginBottom: Spacing.base, gap: Spacing.sm },
  card: { marginBottom: Spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statItem: { width: '47%', backgroundColor: Colors.background.elevated, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center' },
});
