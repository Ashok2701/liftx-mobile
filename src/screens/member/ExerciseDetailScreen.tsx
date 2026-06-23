import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Badge, Card, Skeleton } from '@/components/common';
import { useExerciseDetail } from '@/hooks';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625;

const DIFFICULTY_CONFIG = {
  BEGINNER: { label: 'Beginner', variant: 'success' as const, emoji: '🟢' },
  INTERMEDIATE: { label: 'Intermediate', variant: 'warning' as const, emoji: '🟡' },
  ADVANCED: { label: 'Advanced', variant: 'error' as const, emoji: '🔴' },
};

export const ExerciseDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { exerciseId } = route.params;
  const [activeSection, setActiveSection] = useState<'instructions' | 'mistakes' | 'tips'>('instructions');
  const { data: exercise, isLoading } = useExerciseDetail(exerciseId);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton height={VIDEO_HEIGHT} style={{ borderRadius: 0 }} />
        <View style={{ padding: Spacing.base }}>
          <Skeleton height={32} width="60%" style={{ marginBottom: Spacing.sm }} />
          <Skeleton height={20} style={{ marginBottom: Spacing.sm }} />
          <Skeleton height={120} />
        </View>
      </View>
    );
  }
  if (!exercise) return null;
  const diff = DIFFICULTY_CONFIG[exercise.difficulty];

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        {exercise.videoUrl ? (
          <Video
            source={{ uri: exercise.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
        ) : (
          <View style={[styles.video, styles.noVideo]}>
            <Text style={{ fontSize: 64 }}>💪</Text>
            <Text style={[Typography.bodyMedium, { color: Colors.text.muted, marginTop: Spacing.sm }]}>No video available</Text>
          </View>
        )}
        <LinearGradient colors={['transparent', 'rgba(10,10,15,0.9)']} style={styles.videoGradient} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <View style={styles.backBtnInner}><Text style={{ fontSize: 20, color: '#fff' }}>←</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.metaRow}>
          <Badge label={`${diff.emoji} ${diff.label}`} variant={diff.variant} />
          <Badge label={exercise.muscleGroup} variant="brand" />
          {exercise.equipment.map(eq => <Badge key={eq} label={eq} variant="neutral" />)}
        </View>

        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <Card style={{ marginBottom: Spacing.base }}>
            <Text style={[Typography.labelMedium, { color: Colors.text.secondary, marginBottom: Spacing.sm }]}>Also works</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
              {exercise.secondaryMuscles.map(m => <Badge key={m} label={m} variant="neutral" size="sm" />)}
            </View>
          </Card>
        )}

        <View style={styles.sectionTabs}>
          {([{ key: 'instructions', label: 'How to do it' }, { key: 'mistakes', label: 'Mistakes' }, { key: 'tips', label: 'Tips' }] as const).map(tab => (
            <TouchableOpacity key={tab.key} onPress={() => setActiveSection(tab.key)} style={[styles.sectionTab, activeSection === tab.key && styles.sectionTabActive]}>
              <Text style={[Typography.labelMedium, { color: activeSection === tab.key ? Colors.brand.primary : Colors.text.secondary }]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ gap: Spacing.base }}>
          {(activeSection === 'instructions' ? exercise.instructions :
            activeSection === 'mistakes' ? (exercise.commonMistakes ?? []) :
            (exercise.tips ?? [])).map((item, i) => (
            <View key={i} style={styles.step}>
              <LinearGradient
                colors={activeSection === 'instructions' ? ['#6C47FF', '#3B1FCC'] : activeSection === 'mistakes' ? [Colors.error.default, Colors.error.default] : [Colors.success.default, Colors.success.default]}
                style={styles.stepNum}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                  {activeSection === 'instructions' ? i + 1 : activeSection === 'mistakes' ? '✕' : '💡'}
                </Text>
              </LinearGradient>
              <Text style={[Typography.bodyMedium, { color: Colors.text.primary, flex: 1, lineHeight: 22 }]}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  mediaContainer: { position: 'relative' },
  video: { width, height: VIDEO_HEIGHT, backgroundColor: Colors.background.card },
  noVideo: { justifyContent: 'center', alignItems: 'center' },
  videoGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  backBtn: { position: 'absolute', top: Spacing.xl + 20, left: Spacing.base },
  backBtnInner: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  exerciseName: { ...Typography.displaySmall, color: Colors.text.primary, marginBottom: Spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.base },
  sectionTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border.default, marginBottom: Spacing.base },
  sectionTab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  sectionTabActive: { borderBottomColor: Colors.brand.primary },
  step: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  stepNum: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginTop: 2 },
});
