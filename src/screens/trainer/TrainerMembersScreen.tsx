import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, Avatar, Badge, Skeleton } from '@/components/common';
import { useTrainerMembers } from '@/hooks';
import { TrainerStackParamList } from '@/types';

type Nav = NativeStackNavigationProp<TrainerStackParamList>;

export const TrainerMembersScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const { data: membersData, isLoading } = useTrainerMembers(search);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Members</Text>
        <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
          {membersData?.total ?? 0} members
        </Text>
      </View>
      <View style={styles.searchBar}>
        <Text style={{ fontSize: 16, marginRight: Spacing.sm }}>🔍</Text>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search members..." placeholderTextColor={Colors.text.muted} style={styles.searchInput} />
      </View>
      <FlatList
        data={membersData?.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MemberDetail', { memberId: item.id })}>
            <Card style={styles.memberCard}>
              <View style={styles.memberRow}>
                <Avatar name={`${item.user.firstName} ${item.user.lastName}`} size={48} />
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                    {item.user.firstName} {item.user.lastName}
                  </Text>
                  <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>{item.memberId}</Text>
                  <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: 4 }}>
                    <Badge label={item.fitnessGoal?.replace('_',' ') ?? 'No goal'} variant="brand" size="sm" />
                    {item.gender && <Badge label={item.gender} variant="neutral" size="sm" />}
                  </View>
                </View>
                <Text style={{ fontSize: 18, color: Colors.text.muted }}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={isLoading ? (
          <View style={{ padding: Spacing.base }}>
            {[1,2,3].map(i => <Skeleton key={i} height={80} style={{ marginBottom: Spacing.sm }} />)}
          </View>
        ) : (
          <View style={{ alignItems: 'center', padding: Spacing['3xl'] }}>
            <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>No members found</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  header: { padding: Spacing.base, paddingTop: Spacing.xl },
  title: { ...Typography.displaySmall, color: Colors.text.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background.card, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.base, marginHorizontal: Spacing.base, marginBottom: Spacing.base, borderWidth: 1, borderColor: Colors.border.default, height: 48 },
  searchInput: { flex: 1, ...Typography.bodyMedium, color: Colors.text.primary },
  list: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  memberCard: { marginBottom: Spacing.sm },
  memberRow: { flexDirection: 'row', alignItems: 'center' },
});
