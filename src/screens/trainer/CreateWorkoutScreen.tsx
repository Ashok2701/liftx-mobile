import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '@/theme';
import { Card } from '@/components/common';

export const CreateWorkoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const screenName = 'CreateWorkout'.replace(/([A-Z])/g, ' ').trim();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 20, color: Colors.text.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{screenName}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card>
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: Spacing.base }}>🚧</Text>
          <Text style={[Typography.headlineSmall, { color: Colors.text.primary, textAlign: 'center' }]}>{screenName}</Text>
          <Text style={[Typography.bodyMedium, { color: Colors.text.secondary, textAlign: 'center', marginTop: Spacing.sm }]}>
            Full implementation connects to the NestJS backend. Mock layer ready for UI testing.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, paddingTop: Spacing.xl, gap: Spacing.md },
  title: { ...Typography.headlineLarge, color: Colors.text.primary },
  scroll: { padding: Spacing.base, paddingBottom: 100 },
});
