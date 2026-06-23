import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { Colors, Typography, Spacing } from '@/theme';
import { Card, Badge, Skeleton } from '@/components/common';
import { useTrainerSessions } from '@/hooks';
import { TrainerStackParamList } from '@/types';

type Nav = NativeStackNavigationProp<TrainerStackParamList>;

export const TrainerSessionsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { data: sessions, isLoading } = useTrainerSessions();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PT Sessions</Text>
      </View>
      <FlatList
        data={Array.isArray(sessions) ? sessions : []}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PTSessionDetail', { sessionId: item.id })}>
            <Card style={styles.sessionCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                    {item.member?.user?.firstName} {item.member?.user?.lastName}
                  </Text>
                  <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                    {format(new Date(item.scheduledDate), 'MMM d')} at {item.scheduledTime} • {item.duration}min
                  </Text>
                  {item.trainerNotes && (
                    <Text style={[Typography.bodySmall, { color: Colors.text.muted, marginTop: 4 }]} numberOfLines={1}>
                      📝 {item.trainerNotes}
                    </Text>
                  )}
                </View>
                <Badge label={item.status} variant={item.status === 'COMPLETED' ? 'success' : item.status === 'CANCELLED' ? 'error' : 'brand'} />
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
            <Text style={{ fontSize: 48 }}>📅</Text>
            <Text style={[Typography.headlineSmall, { color: Colors.text.primary, marginTop: Spacing.base }]}>No sessions yet</Text>
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
  list: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  sessionCard: { marginBottom: Spacing.sm },
});
