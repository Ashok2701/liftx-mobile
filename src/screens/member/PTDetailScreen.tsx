import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, Badge, ProgressBar, SectionHeader, Avatar, Skeleton } from '@/components/common';
import { usePTPackage, usePTSessions } from '@/hooks';

export const PTDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: pkg, isLoading: pkgLoading } = usePTPackage();
  const { data: sessionsData, isLoading: sessionsLoading } = usePTSessions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: Colors.text.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Personal Training</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {pkgLoading ? <Skeleton height={180} style={{ marginBottom: Spacing.base }} /> : pkg ? (
          <>
            <Card style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.base }}>
                <Avatar name={`${pkg.trainer?.user?.firstName ?? ''} ${pkg.trainer?.user?.lastName ?? ''}`} size={56} />
                <View>
                  <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                    {pkg.trainer?.user?.firstName} {pkg.trainer?.user?.lastName}
                  </Text>
                  <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>Personal Trainer</Text>
                  {pkg.trainer?.rating && (
                    <Text style={[Typography.bodySmall, { color: Colors.warning.default }]}>⭐ {pkg.trainer.rating}</Text>
                  )}
                </View>
              </View>

              <View style={styles.sessionStats}>
                {[
                  { label: 'Total', value: pkg.totalSessions },
                  { label: 'Done', value: pkg.usedSessions },
                  { label: 'Left', value: pkg.remainingSessions },
                ].map((s) => (
                  <View key={s.label} style={styles.sessionStat}>
                    <Text style={[Typography.statMedium, { color: Colors.brand.primary }]}>{s.value}</Text>
                    <Text style={[Typography.labelSmall, { color: Colors.text.secondary }]}>{s.label}</Text>
                  </View>
                ))}
              </View>

              <ProgressBar progress={pkg.usedSessions / pkg.totalSessions} style={{ marginTop: Spacing.md }} />
              <Text style={[Typography.bodySmall, { color: Colors.text.muted, marginTop: Spacing.xs }]}>
                Package valid until {format(new Date(pkg.endDate), 'MMM d, yyyy')}
              </Text>
            </Card>
          </>
        ) : (
          <Card style={{ alignItems: 'center', padding: Spacing['2xl'] }}>
            <Text style={{ fontSize: 48 }}>💪</Text>
            <Text style={[Typography.headlineSmall, { color: Colors.text.primary, marginTop: Spacing.base }]}>No PT package</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.text.secondary, textAlign: 'center', marginTop: Spacing.sm }]}>
              Talk to your branch admin to set up personal training sessions.
            </Text>
          </Card>
        )}

        <SectionHeader title="Upcoming sessions" />
        {sessionsLoading ? (
          [1,2].map(i => <Skeleton key={i} height={80} style={{ marginBottom: Spacing.sm }} />)
        ) : (
          sessionsData?.data?.map((s: any) => (
            <Card key={s.id} style={[styles.card, { marginBottom: Spacing.sm }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                    {format(new Date(s.scheduledDate), 'EEEE, MMM d')}
                  </Text>
                  <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                    {s.scheduledTime} • {s.duration} min
                  </Text>
                  {s.trainerNotes && (
                    <Text style={[Typography.bodySmall, { color: Colors.text.muted, marginTop: 4 }]}>
                      📝 {s.trainerNotes}
                    </Text>
                  )}
                </View>
                <Badge label={s.status} variant={s.status === 'COMPLETED' ? 'success' : s.status === 'CANCELLED' ? 'error' : 'brand'} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, paddingTop: Spacing.xl, gap: Spacing.md },
  title: { ...Typography.headlineLarge, color: Colors.text.primary },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  card: { marginBottom: Spacing.sm },
  sessionStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.background.elevated, borderRadius: BorderRadius.lg, padding: Spacing.md },
  sessionStat: { alignItems: 'center' },
});
