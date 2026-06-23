import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing } from '@/theme';
import { Card, Avatar, Badge, Button, SectionHeader } from '@/components/common';
import { TrainerStackParamList } from '@/types';
import { MOCK_TRAINER_MEMBERS, MOCK_MEASUREMENTS } from '@/services/api/mockData';

type RouteProps = RouteProp<TrainerStackParamList, 'MemberDetail'>;
type Nav = NativeStackNavigationProp<TrainerStackParamList>;

export const MemberDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<Nav>();
  const { memberId } = route.params;
  const member = MOCK_TRAINER_MEMBERS.find(m => m.id === memberId) ?? MOCK_TRAINER_MEMBERS[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: Colors.text.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Member</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ alignItems: 'center', marginBottom: Spacing.base }}>
          <Avatar name={`${member.user.firstName} ${member.user.lastName}`} size={72} />
          <Text style={[Typography.headlineLarge, { color: Colors.text.primary, marginTop: Spacing.md }]}>
            {member.user.firstName} {member.user.lastName}
          </Text>
          <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>{member.memberId}</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
            <Badge label={member.fitnessGoal?.replace('_',' ') ?? ''} variant="brand" />
            {member.gender && <Badge label={member.gender} variant="neutral" />}
          </View>
        </View>

        <View style={styles.actionGrid}>
          {[
            { icon: '📋', label: 'Workout\nplan', action: () => navigation.navigate('CreateWorkout', { memberId: member.id }) },
            { icon: '🥗', label: 'Diet\nplan', action: () => navigation.navigate('CreateDiet', { memberId: member.id }) },
            { icon: '📸', label: 'Progress\nphotos', action: () => {} },
            { icon: '📝', label: 'Session\nnotes', action: () => {} },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.actionItem} onPress={item.action}>
              <View style={styles.actionIcon}>
                <Text style={{ fontSize: 26 }}>{item.icon}</Text>
              </View>
              <Text style={[Typography.labelSmall, { color: Colors.text.secondary, textAlign: 'center' }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Body stats" />
        <Card>
          <View style={styles.statsGrid}>
            {[
              { label: 'Height', value: member.height ? `${member.height} cm` : '—' },
              { label: 'Weight', value: member.weight ? `${member.weight} kg` : '—' },
              { label: 'Goal', value: member.fitnessGoal?.replace('_',' ') ?? '—' },
            ].map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={[Typography.statSmall, { color: Colors.brand.primary }]}>{s.value}</Text>
                <Text style={[Typography.labelSmall, { color: Colors.text.muted }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {member.healthNotes && (
          <Card style={{ marginTop: Spacing.sm }}>
            <Text style={[Typography.labelMedium, { color: Colors.text.secondary, marginBottom: Spacing.xs }]}>⚠️ Health notes</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.text.primary }]}>{member.healthNotes}</Text>
          </Card>
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
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.base },
  actionItem: { flex: 1, alignItems: 'center', gap: 6 },
  actionIcon: { width: 60, height: 60, borderRadius: 14, backgroundColor: Colors.background.card, borderWidth: 1, borderColor: Colors.border.default, justifyContent: 'center', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
});
