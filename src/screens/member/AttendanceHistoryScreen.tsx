import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, StatCard, Skeleton } from '@/components/common';
import { useAttendanceHistory, useAttendanceStreak } from '@/hooks';

export const AttendanceHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: attendanceData, isLoading } = useAttendanceHistory();
  const { data: streak } = useAttendanceStreak();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: Colors.text.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Streak" value={`${streak?.currentStreak ?? 0}d`} icon={<Text style={{ fontSize: 18 }}>🔥</Text>} color={Colors.warning.default} style={{ marginRight: Spacing.sm }} />
        <StatCard label="This month" value={streak?.thisMonth ?? 0} icon={<Text style={{ fontSize: 18 }}>📅</Text>} color={Colors.success.default} style={{ marginLeft: Spacing.sm }} />
      </View>

      <FlatList
        data={attendanceData?.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                  {format(new Date(item.checkInTime), 'EEEE, MMM d')}
                </Text>
                <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                  In: {format(new Date(item.checkInTime), 'h:mm a')}
                  {item.checkOutTime ? ` • Out: ${format(new Date(item.checkOutTime), 'h:mm a')}` : ''}
                </Text>
              </View>
              <View style={styles.methodBadge}>
                <Text style={[Typography.labelSmall, { color: Colors.brand.primary }]}>{item.method}</Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ padding: Spacing.base }}>
              {[1,2,3,4,5].map(i => <Skeleton key={i} height={70} style={{ marginBottom: Spacing.sm }} />)}
            </View>
          ) : (
            <View style={{ alignItems: 'center', padding: Spacing['3xl'] }}>
              <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>No attendance records yet</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, paddingTop: Spacing.xl, gap: Spacing.md },
  title: { ...Typography.headlineLarge, color: Colors.text.primary },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.base, marginBottom: Spacing.base },
  list: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  card: { marginBottom: Spacing.sm },
  methodBadge: { backgroundColor: Colors.brand.dim, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full, alignSelf: 'flex-start' },
});
