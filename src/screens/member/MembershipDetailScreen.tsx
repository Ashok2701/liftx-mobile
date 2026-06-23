import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, differenceInDays } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, Badge, ProgressBar, SectionHeader, Skeleton } from '@/components/common';
import { useMembership } from '@/hooks';

export const MembershipDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data: membership, isLoading } = useMembership();

  const daysLeft = membership?.endDate ? differenceInDays(new Date(membership.endDate), new Date()) : 0;
  const progress = membership ? Math.max(0, daysLeft / membership.plan.durationDays) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 20, color: Colors.text.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Membership</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {isLoading ? <Skeleton height={200} /> : membership ? (
          <>
            <Card style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.base }}>
                <Text style={[Typography.headlineLarge, { color: Colors.text.primary }]}>{membership.plan.name}</Text>
                <Badge label={membership.status} variant={membership.status === 'ACTIVE' ? 'success' : 'error'} />
              </View>
              <ProgressBar progress={progress} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm }}>
                <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                  Started {format(new Date(membership.startDate), 'MMM d, yyyy')}
                </Text>
                <Text style={[Typography.bodySmall, { color: daysLeft < 14 ? Colors.warning.default : Colors.text.secondary }]}>
                  {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                </Text>
              </View>
              <Text style={[Typography.bodySmall, { color: Colors.text.muted, marginTop: 4 }]}>
                Expires {format(new Date(membership.endDate), 'MMMM d, yyyy')}
              </Text>
            </Card>

            <Card style={styles.card}>
              <SectionHeader title="Plan features" />
              {membership.plan.features.map((f, i) => (
                <Text key={i} style={[Typography.bodyMedium, { color: Colors.text.primary, marginBottom: 4 }]}>✓ {f}</Text>
              ))}
            </Card>

            <Card style={styles.card}>
              <Text style={[Typography.labelMedium, { color: Colors.text.secondary }]}>Total paid</Text>
              <Text style={[Typography.statLarge, { color: Colors.brand.primary }]}>
                ₹{membership.totalAmount.toLocaleString('en-IN')}
              </Text>
              <Badge label={membership.plan.type} variant="brand" />
            </Card>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, paddingTop: Spacing.xl, gap: Spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { ...Typography.headlineLarge, color: Colors.text.primary },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  card: { marginBottom: Spacing.sm },
});
