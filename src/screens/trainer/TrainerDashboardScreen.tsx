import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';

import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, StatCard, SectionHeader, Badge, Avatar, Skeleton } from '@/components/common';
import {
  useTrainerProfile,
  useTrainerDashboard,
  useTrainerSessions,
  useTrainerMembers,
} from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { TrainerStackParamList } from '@/types';

type Nav = NativeStackNavigationProp<TrainerStackParamList>;

export const TrainerDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const today = new Date().toISOString().split('T')[0];

  const { data: profile, isLoading: profileLoading } = useTrainerProfile();
  const { data: dashboard, isLoading: dashLoading, refetch } = useTrainerDashboard();
  const { data: todaySessions, isLoading: sessionsLoading } = useTrainerSessions(today);
  const { data: membersData, isLoading: membersLoading } = useTrainerMembers(undefined, 1);

  const isLoading = profileLoading || dashLoading;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={Colors.brand.primary} />
        }
        contentContainerStyle={styles.scroll}
      >
        {/* ─── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.name}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[Typography.bodySmall, { color: Colors.text.muted }]}>
              {format(new Date(), 'EEEE, MMMM d')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Avatar name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} size={48} />
          </TouchableOpacity>
        </View>

        {/* ─── Stats ──────────────────────────────────────────────── */}
        {dashLoading ? (
          <View style={styles.statsRow}>
            <Skeleton height={100} style={{ flex: 1, marginRight: Spacing.sm }} />
            <Skeleton height={100} style={{ flex: 1, marginLeft: Spacing.sm }} />
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <StatCard
                label="My members"
                value={dashboard?.totalMembers ?? 0}
                icon={<Text style={{ fontSize: 20 }}>👥</Text>}
                color={Colors.brand.primary}
                style={{ marginRight: Spacing.sm }}
              />
              <StatCard
                label="Total sessions"
                value={dashboard?.totalSessions ?? 0}
                icon={<Text style={{ fontSize: 20 }}>🏋️</Text>}
                color={Colors.success.default}
                style={{ marginLeft: Spacing.sm }}
              />
            </View>
            <View style={[styles.statsRow, { marginTop: Spacing.sm }]}>
              <StatCard
                label="Today"
                value={dashboard?.todaySessions ?? 0}
                subValue="PT sessions"
                icon={<Text style={{ fontSize: 20 }}>📅</Text>}
                color={Colors.warning.default}
                style={{ marginRight: Spacing.sm }}
              />
              <StatCard
                label="Rating"
                value={`${dashboard?.rating ?? '—'} ⭐`}
                icon={<Text style={{ fontSize: 20 }}>⭐</Text>}
                color={Colors.warning.default}
                style={{ marginLeft: Spacing.sm }}
              />
            </View>
          </>
        )}

        {/* ─── Today's sessions ────────────────────────────────────── */}
        <SectionHeader
          title="Today's sessions"
          action="Calendar"
          onAction={() => navigation.navigate('PTCalendar')}
        />

        {sessionsLoading ? (
          <Skeleton height={90} style={{ marginBottom: Spacing.sm }} />
        ) : Array.isArray(todaySessions) && todaySessions.length > 0 ? (
          todaySessions.map((session: any) => (
            <TouchableOpacity
              key={session.id}
              onPress={() => navigation.navigate('PTSessionDetail', { sessionId: session.id })}
            >
              <Card style={styles.sessionCard}>
                <View style={styles.sessionRow}>
                  <View style={styles.sessionTime}>
                    <Text style={[Typography.headlineSmall, { color: Colors.brand.primary }]}>
                      {session.scheduledTime}
                    </Text>
                    <Text style={[Typography.labelSmall, { color: Colors.text.muted }]}>
                      {session.duration} min
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                      {session.member?.user?.firstName} {session.member?.user?.lastName}
                    </Text>
                    <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                      PT Session #{session.ptPackage?.usedSessions + 1 ?? '—'}
                    </Text>
                  </View>
                  <Badge
                    label={session.status}
                    variant={
                      session.status === 'COMPLETED'
                        ? 'success'
                        : session.status === 'CANCELLED'
                        ? 'error'
                        : 'brand'
                    }
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={{ fontSize: 32, marginBottom: Spacing.sm }}>☀️</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>
              No sessions scheduled today
            </Text>
          </Card>
        )}

        {/* ─── My members ─────────────────────────────────────────── */}
        <SectionHeader
          title="My members"
          action="See all"
          onAction={() => navigation.navigate('TrainerTabs', { screen: 'Members' } as any)}
        />

        {membersLoading ? (
          [1, 2].map((i) => <Skeleton key={i} height={72} style={{ marginBottom: Spacing.sm }} />)
        ) : (
          membersData?.data?.slice(0, 4).map((member: any) => (
            <TouchableOpacity
              key={member.id}
              onPress={() => navigation.navigate('MemberDetail', { memberId: member.id })}
            >
              <Card style={styles.memberCard}>
                <View style={styles.memberRow}>
                  <Avatar
                    name={`${member.user.firstName} ${member.user.lastName}`}
                    size={44}
                  />
                  <View style={{ flex: 1, marginLeft: Spacing.md }}>
                    <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                      {member.user.firstName} {member.user.lastName}
                    </Text>
                    <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                      {member.memberId} • {member.fitnessGoal?.replace('_', ' ')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, color: Colors.text.muted }}>›</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}

        {/* ─── Quick actions ────────────────────────────────────────── */}
        <SectionHeader title="Quick actions" />
        <View style={styles.quickActions}>
          {[
            { icon: '📋', label: 'Create\nworkout', action: () => navigation.navigate('CreateWorkout', {}) },
            { icon: '🥗', label: 'Create\ndiet', action: () => navigation.navigate('CreateDiet', {}) },
            { icon: '📅', label: 'PT\nCalendar', action: () => navigation.navigate('PTCalendar') },
            { icon: '📸', label: 'Upload\nPhotos', action: () => navigation.navigate('MemberDetail', { memberId: 'member-1' }) },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.quickAction} onPress={item.action}>
              <View style={styles.quickActionIcon}>
                <Text style={{ fontSize: 26 }}>{item.icon}</Text>
              </View>
              <Text style={[Typography.labelSmall, { color: Colors.text.secondary, textAlign: 'center', marginTop: Spacing.xs }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  greeting: { ...Typography.bodyMedium, color: Colors.text.secondary },
  name: { ...Typography.displaySmall, color: Colors.text.primary },

  statsRow: { flexDirection: 'row', marginBottom: 0 },

  sessionCard: { marginBottom: Spacing.sm },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  sessionTime: {
    width: 64,
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.brand.dim,
    borderRadius: BorderRadius.md,
  },

  emptyCard: { alignItems: 'center', paddingVertical: Spacing.xl },

  memberCard: { marginBottom: Spacing.sm },
  memberRow: { flexDirection: 'row', alignItems: 'center' },

  quickActions: { flexDirection: 'row', gap: Spacing.sm },
  quickAction: { flex: 1, alignItems: 'center' },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
