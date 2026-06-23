import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import {
  Card,
  StatCard,
  SectionHeader,
  Badge,
  ProgressBar,
  Avatar,
  Skeleton,
} from '@/components/common';
import {
  useMemberProfile,
  useMembership,
  useAttendanceStreak,
  useTodayAttendance,
  useTodayWorkout,
} from '@/hooks';
import { useAuthStore } from '@/store/authStore';
import { useUnreadCount } from '@/hooks';
import { MemberStackParamList } from '@/types';
import { format, differenceInDays } from 'date-fns';

type Nav = NativeStackNavigationProp<MemberStackParamList>;

export const MemberDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useMemberProfile();
  const { data: membership, isLoading: membershipLoading, refetch: refetchMembership } = useMembership();
  const { data: streak } = useAttendanceStreak();
  const { data: todayAttendance } = useTodayAttendance();
  const { data: todayWorkout } = useTodayWorkout();
  const { data: unreadCount } = useUnreadCount();

  const isLoading = profileLoading || membershipLoading;

  const onRefresh = useCallback(() => {
    refetchProfile();
    refetchMembership();
  }, []);

  const daysUntilExpiry = membership?.endDate
    ? differenceInDays(new Date(membership.endDate), new Date())
    : null;

  const isCheckedIn = !!todayAttendance && !todayAttendance.checkOutTime;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={Colors.brand.primary}
          />
        }
        contentContainerStyle={styles.scroll}
      >
        {/* ─── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>
              {isLoading ? '...' : user?.firstName ?? 'Athlete'}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Text style={{ fontSize: 20 }}>🔔</Text>
              {!!unreadCount && unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Avatar
                name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
                imageUrl={user?.profileImage}
                size={40}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Check-in CTA ────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('QRCheckIn')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={isCheckedIn ? ['#22C55E', '#16A34A'] : Colors.gradient.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkinCard}
          >
            <View>
              <Text style={styles.checkinLabel}>
                {isCheckedIn ? '✓ Checked in' : 'Ready to train?'}
              </Text>
              <Text style={styles.checkinSub}>
                {isCheckedIn
                  ? `Since ${format(new Date(todayAttendance!.checkInTime), 'h:mm a')}`
                  : 'Tap to scan QR and check in'}
              </Text>
            </View>
            <View style={styles.checkinIcon}>
              <Text style={{ fontSize: 32 }}>{isCheckedIn ? '💪' : '📱'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ─── Stats Row ───────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatCard
            label="Streak"
            value={`${streak?.currentStreak ?? 0}d`}
            subValue="current"
            icon={<Text style={{ fontSize: 20 }}>🔥</Text>}
            color={Colors.warning.default}
            style={{ marginRight: Spacing.sm }}
          />
          <StatCard
            label="This month"
            value={streak?.thisMonth ?? 0}
            subValue="sessions"
            icon={<Text style={{ fontSize: 20 }}>📅</Text>}
            color={Colors.success.default}
            style={{ marginLeft: Spacing.sm }}
          />
        </View>

        {/* ─── Membership Card ──────────────────────────────────────── */}
        {membershipLoading ? (
          <Skeleton height={120} style={{ marginBottom: Spacing.base }} />
        ) : membership ? (
          <TouchableOpacity onPress={() => navigation.navigate('MembershipDetail')}>
            <Card style={styles.membershipCard}>
              <View style={styles.membershipRow}>
                <View>
                  <Text style={[Typography.labelMedium, { color: Colors.text.secondary }]}>
                    Membership
                  </Text>
                  <Text style={[Typography.headlineMedium, { color: Colors.text.primary }]}>
                    {membership.plan.name}
                  </Text>
                </View>
                <Badge
                  label={membership.status}
                  variant={
                    membership.status === 'ACTIVE'
                      ? 'success'
                      : membership.status === 'EXPIRED'
                      ? 'error'
                      : 'warning'
                  }
                />
              </View>

              <ProgressBar
                progress={
                  daysUntilExpiry
                    ? daysUntilExpiry / membership.plan.durationDays
                    : 0
                }
                color={
                  daysUntilExpiry && daysUntilExpiry < 7
                    ? Colors.error.default
                    : Colors.brand.primary
                }
                style={{ marginTop: Spacing.md }}
              />

              <View style={styles.membershipFooter}>
                <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                  Expires {format(new Date(membership.endDate), 'MMM d, yyyy')}
                </Text>
                {daysUntilExpiry !== null && daysUntilExpiry <= 14 && (
                  <Text style={[Typography.labelSmall, { color: Colors.warning.default }]}>
                    {daysUntilExpiry <= 0
                      ? 'Expired!'
                      : `${daysUntilExpiry}d remaining`}
                  </Text>
                )}
              </View>
            </Card>
          </TouchableOpacity>
        ) : (
          <Card style={styles.membershipCard}>
            <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>
              No active membership
            </Text>
          </Card>
        )}

        {/* ─── Today's Workout ──────────────────────────────────────── */}
        <SectionHeader title="Today's workout" action="Full plan" onAction={() => {}} />

        {todayWorkout ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WorkoutDetail', { workoutDayId: todayWorkout.id })
            }
          >
            <Card style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <View>
                  <Badge label={todayWorkout.day} variant="brand" />
                  <Text style={[Typography.headlineSmall, { color: Colors.text.primary, marginTop: Spacing.sm }]}>
                    {todayWorkout.name}
                  </Text>
                </View>
                <Text style={{ fontSize: 28 }}>🏋️</Text>
              </View>

              <View style={styles.exerciseList}>
                {todayWorkout.exercises.slice(0, 3).map((we, i) => (
                  <View key={we.id} style={styles.exerciseRow}>
                    <View style={styles.exerciseNum}>
                      <Text style={[Typography.labelSmall, { color: Colors.brand.primary }]}>
                        {i + 1}
                      </Text>
                    </View>
                    <Text style={[Typography.bodyMedium, { color: Colors.text.primary, flex: 1 }]}>
                      {we.exercise.name}
                    </Text>
                    <Text style={[Typography.labelSmall, { color: Colors.text.secondary }]}>
                      {we.sets.length} sets
                    </Text>
                  </View>
                ))}
                {todayWorkout.exercises.length > 3 && (
                  <Text style={[Typography.bodySmall, { color: Colors.text.muted, marginTop: Spacing.sm }]}>
                    +{todayWorkout.exercises.length - 3} more exercises
                  </Text>
                )}
              </View>

              <View style={styles.workoutAction}>
                <LinearGradient
                  colors={Colors.gradient.brand}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startBtn}
                >
                  <Text style={[Typography.labelLarge, { color: '#fff' }]}>Start workout</Text>
                </LinearGradient>
              </View>
            </Card>
          </TouchableOpacity>
        ) : todayWorkout === null ? (
          <Card style={styles.restDayCard}>
            <Text style={{ fontSize: 32, marginBottom: Spacing.sm }}>😴</Text>
            <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
              Rest day
            </Text>
            <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>
              Recovery is part of training
            </Text>
          </Card>
        ) : (
          <Card style={styles.restDayCard}>
            <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>
              No workout assigned yet
            </Text>
          </Card>
        )}

        {/* ─── Quick actions ────────────────────────────────────────── */}
        <SectionHeader title="Quick access" />
        <View style={styles.quickGrid}>
          {[
            { icon: '📊', label: 'Progress', screen: 'BodyMeasurements' as const },
            { icon: '🥗', label: 'Diet plan', screen: 'MembershipDetail' as const },
            { icon: '🏃', label: 'History', screen: 'AttendanceHistory' as const },
            { icon: '👤', label: 'PT sessions', screen: 'PTDetail' as const },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.quickIcon}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              </View>
              <Text style={[Typography.labelSmall, { color: Colors.text.secondary, marginTop: Spacing.xs }]}>
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
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  greeting: { ...Typography.bodyMedium, color: Colors.text.secondary },
  userName: { ...Typography.displaySmall, color: Colors.text.primary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  notifBtn: { position: 'relative', padding: Spacing.sm },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error.default,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notifBadgeText: { ...Typography.labelSmall, color: '#fff', fontSize: 9 },

  checkinCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  checkinLabel: { ...Typography.headlineSmall, color: '#fff' },
  checkinSub: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  checkinIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: { flexDirection: 'row', marginBottom: Spacing.base },

  membershipCard: { marginBottom: Spacing.base },
  membershipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  membershipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },

  workoutCard: { marginBottom: Spacing.base },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  exerciseList: { marginTop: Spacing.sm },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  exerciseNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brand.dim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  workoutAction: { marginTop: Spacing.md },
  startBtn: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },

  restDayCard: { alignItems: 'center', paddingVertical: Spacing['2xl'], marginBottom: Spacing.base },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  quickItem: {
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
