import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import FastImage from 'react-native-fast-image';

import { Colors, Typography, Spacing, BorderRadius } from '@/theme';
import { Card, Badge, SectionHeader, Skeleton } from '@/components/common';
import {
  useTodayWorkout,
  useExerciseCategories,
  useExercises,
} from '@/hooks';
import { MuscleGroup, MemberStackParamList } from '@/types';

type Nav = NativeStackNavigationProp<MemberStackParamList>;

const MUSCLE_ICONS: Record<MuscleGroup, string> = {
  CHEST: '🫁',
  BACK: '🏗️',
  SHOULDERS: '💎',
  BICEPS: '💪',
  TRICEPS: '🦵',
  LEGS: '🦵',
  ABS: '⚡',
  CARDIO: '❤️',
  FULL_BODY: '🔥',
};

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  CHEST: Colors.muscle.chest,
  BACK: Colors.muscle.back,
  SHOULDERS: Colors.muscle.shoulders,
  BICEPS: Colors.muscle.arms,
  TRICEPS: Colors.muscle.arms,
  LEGS: Colors.muscle.legs,
  ABS: Colors.muscle.abs,
  CARDIO: Colors.muscle.cardio,
  FULL_BODY: Colors.brand.primary,
};

const CATEGORY_LABELS: Record<MuscleGroup, string> = {
  CHEST: 'Chest',
  BACK: 'Back',
  SHOULDERS: 'Shoulders',
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  LEGS: 'Legs',
  ABS: 'Abs',
  CARDIO: 'Cardio',
  FULL_BODY: 'Full Body',
};

type Tab = 'today' | 'library';

export const WorkoutScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | undefined>();

  const { data: todayWorkout, isLoading: workoutLoading } = useTodayWorkout();
  const { data: categories, isLoading: categoriesLoading } = useExerciseCategories();
  const {
    data: exercisesData,
    isLoading: exercisesLoading,
  } = useExercises({
    muscleGroup: selectedCategory,
    search: searchQuery,
    limit: 20,
  });

  return (
    <View style={styles.container}>
      {/* ─── Header ────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Workout</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'today' && styles.tabActive]}
            onPress={() => setActiveTab('today')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'today' && styles.tabTextActive,
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'library' && styles.tabActive]}
            onPress={() => setActiveTab('library')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'library' && styles.tabTextActive,
              ]}
            >
              Library
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'today' ? (
        <TodayWorkoutTab
          workout={todayWorkout}
          isLoading={workoutLoading}
          onStartWorkout={() =>
            todayWorkout &&
            navigation.navigate('WorkoutDetail', { workoutDayId: todayWorkout.id })
          }
        />
      ) : (
        <LibraryTab
          categories={categories ?? []}
          categoriesLoading={categoriesLoading}
          exercises={exercisesData?.data ?? []}
          exercisesLoading={exercisesLoading}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) =>
            setSelectedCategory((prev) => (prev === cat ? undefined : cat))
          }
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onExercisePress={(exerciseId) =>
            navigation.navigate('ExerciseDetail', { exerciseId })
          }
        />
      )}
    </View>
  );
};

// ─── Today tab ────────────────────────────────────────────────────────────────

const TodayWorkoutTab: React.FC<{
  workout: any;
  isLoading: boolean;
  onStartWorkout: () => void;
}> = ({ workout, isLoading, onStartWorkout }) => {
  if (isLoading) {
    return (
      <ScrollView contentContainerStyle={styles.scroll}>
        <Skeleton height={200} style={{ marginBottom: Spacing.base }} />
        <Skeleton height={80} style={{ marginBottom: Spacing.sm }} />
        <Skeleton height={80} style={{ marginBottom: Spacing.sm }} />
      </ScrollView>
    );
  }

  if (!workout) {
    return (
      <View style={styles.emptyCenter}>
        <Text style={{ fontSize: 64, marginBottom: Spacing.base }}>🌙</Text>
        <Text style={[Typography.headlineMedium, { color: Colors.text.primary }]}>
          Rest day
        </Text>
        <Text style={[Typography.bodyMedium, { color: Colors.text.secondary, marginTop: Spacing.sm, textAlign: 'center' }]}>
          Recovery is where gains are made. Enjoy the rest!
        </Text>
      </View>
    );
  }

  if (workout.isRestDay) {
    return (
      <View style={styles.emptyCenter}>
        <Text style={{ fontSize: 64 }}>😴</Text>
        <Text style={[Typography.headlineMedium, { color: Colors.text.primary, marginTop: Spacing.base }]}>
          Rest day scheduled
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Workout header card */}
      <LinearGradient colors={Colors.gradient.brand} style={styles.workoutHeroCard}>
        <Badge label={workout.day} variant="neutral" />
        <Text style={[Typography.displaySmall, { color: '#fff', marginTop: Spacing.sm }]}>
          {workout.name}
        </Text>
        <Text style={[Typography.bodyMedium, { color: 'rgba(255,255,255,0.75)', marginTop: Spacing.xs }]}>
          {workout.exercises?.length ?? 0} exercises
        </Text>
      </LinearGradient>

      {/* Exercises */}
      <SectionHeader title="Exercises" />
      {workout.exercises?.map((we: any, index: number) => (
        <Card key={we.id} style={styles.exerciseCard}>
          <View style={styles.exerciseCardRow}>
            <View style={[styles.exerciseIndex, { backgroundColor: Colors.brand.dim }]}>
              <Text style={[Typography.labelMedium, { color: Colors.brand.primary }]}>
                {index + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                {we.exercise.name}
              </Text>
              <Text style={[Typography.bodySmall, { color: Colors.text.secondary }]}>
                {we.exercise.muscleGroup} • {we.exercise.equipment?.[0] ?? 'Bodyweight'}
              </Text>
            </View>
            <View style={styles.setsChip}>
              <Text style={[Typography.labelMedium, { color: Colors.brand.primary }]}>
                {we.sets.length}x
              </Text>
            </View>
          </View>

          {/* Sets breakdown */}
          <View style={styles.setsTable}>
            <View style={styles.setsTableHeader}>
              <Text style={[Typography.labelSmall, { color: Colors.text.muted, width: 40 }]}>SET</Text>
              <Text style={[Typography.labelSmall, { color: Colors.text.muted, flex: 1 }]}>REPS</Text>
              <Text style={[Typography.labelSmall, { color: Colors.text.muted, flex: 1 }]}>WEIGHT</Text>
              <Text style={[Typography.labelSmall, { color: Colors.text.muted, flex: 1 }]}>REST</Text>
            </View>
            {we.sets.map((set: any) => (
              <View key={set.id} style={styles.setsTableRow}>
                <Text style={[Typography.bodySmall, { color: Colors.text.secondary, width: 40 }]}>
                  {set.setNumber}
                </Text>
                <Text style={[Typography.bodyMedium, { color: Colors.text.primary, flex: 1 }]}>
                  {set.targetReps ?? '—'}
                </Text>
                <Text style={[Typography.bodyMedium, { color: Colors.text.primary, flex: 1 }]}>
                  {set.targetWeight ? `${set.targetWeight}kg` : 'Body'}
                </Text>
                <Text style={[Typography.bodySmall, { color: Colors.text.secondary, flex: 1 }]}>
                  {set.restTime}s
                </Text>
              </View>
            ))}
          </View>
        </Card>
      ))}

      {/* Start button */}
      <TouchableOpacity onPress={onStartWorkout} activeOpacity={0.8}>
        <LinearGradient colors={Colors.gradient.brand} style={styles.startWorkoutBtn}>
          <Text style={[Typography.headlineSmall, { color: '#fff' }]}>🏋️ Start Workout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ─── Library tab ──────────────────────────────────────────────────────────────

const LibraryTab: React.FC<{
  categories: { category: MuscleGroup; count: number }[];
  categoriesLoading: boolean;
  exercises: any[];
  exercisesLoading: boolean;
  selectedCategory?: MuscleGroup;
  onSelectCategory: (cat: MuscleGroup) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  onExercisePress: (id: string) => void;
}> = ({
  categories,
  categoriesLoading,
  exercises,
  exercisesLoading,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearch,
  onExercisePress,
}) => (
  <View style={{ flex: 1 }}>
    {/* Search */}
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Text style={{ fontSize: 16, marginRight: Spacing.sm }}>🔍</Text>
        <TextInput
          value={searchQuery}
          onChangeText={onSearch}
          placeholder="Search exercises..."
          placeholderTextColor={Colors.text.muted}
          style={styles.searchInput}
        />
      </View>
    </View>

    {/* Category chips */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryScroll}
    >
      {categories.map((c) => {
        const isSelected = selectedCategory === c.category;
        return (
          <TouchableOpacity
            key={c.category}
            onPress={() => onSelectCategory(c.category)}
            style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
          >
            <Text style={{ fontSize: 16, marginRight: 6 }}>
              {MUSCLE_ICONS[c.category]}
            </Text>
            <Text
              style={[
                Typography.labelMedium,
                { color: isSelected ? Colors.brand.primary : Colors.text.secondary },
              ]}
            >
              {CATEGORY_LABELS[c.category]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>

    {/* Exercise list */}
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.exerciseList}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onExercisePress(item.id)}>
          <Card style={styles.libraryExerciseCard}>
            <View style={styles.libraryExerciseRow}>
              {item.thumbnailUrl ? (
                <FastImage
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.exerciseThumb}
                />
              ) : (
                <View
                  style={[
                    styles.exerciseThumbPlaceholder,
                    { backgroundColor: (MUSCLE_COLORS[item.muscleGroup as MuscleGroup] ?? Colors.brand.primary) + '20' },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>
                    {MUSCLE_ICONS[item.muscleGroup as MuscleGroup] ?? '💪'}
                  </Text>
                </View>
              )}
              <View style={styles.libraryExerciseInfo}>
                <Text style={[Typography.headlineSmall, { color: Colors.text.primary }]}>
                  {item.name}
                </Text>
                <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: 4 }}>
                  <Badge
                    label={CATEGORY_LABELS[item.muscleGroup as MuscleGroup] ?? item.muscleGroup}
                    variant="brand"
                    size="sm"
                  />
                  <Badge
                    label={item.difficulty}
                    variant={
                      item.difficulty === 'BEGINNER'
                        ? 'success'
                        : item.difficulty === 'INTERMEDIATE'
                        ? 'warning'
                        : 'error'
                    }
                    size="sm"
                  />
                </View>
                {item.equipment?.[0] && (
                  <Text style={[Typography.bodySmall, { color: Colors.text.muted, marginTop: 4 }]}>
                    🔧 {item.equipment[0]}
                  </Text>
                )}
              </View>
              {item.videoUrl && (
                <View style={styles.videoIndicator}>
                  <Text style={{ fontSize: 14 }}>▶</Text>
                </View>
              )}
            </View>
          </Card>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        exercisesLoading ? (
          <View style={{ padding: Spacing.xl }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={80} style={{ marginBottom: Spacing.sm }} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyCenter}>
            <Text style={[Typography.bodyMedium, { color: Colors.text.secondary }]}>
              No exercises found
            </Text>
          </View>
        )
      }
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  scroll: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },

  header: {
    padding: Spacing.base,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background.primary,
  },
  title: { ...Typography.displaySmall, color: Colors.text.primary, marginBottom: Spacing.md },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: { backgroundColor: Colors.brand.primary },
  tabText: { ...Typography.labelMedium, color: Colors.text.secondary },
  tabTextActive: { color: '#fff' },

  workoutHeroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },

  exerciseCard: { marginBottom: Spacing.sm },
  exerciseCardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  exerciseIndex: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setsChip: {
    backgroundColor: Colors.brand.dim,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  setsTable: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border.default },
  setsTableHeader: { flexDirection: 'row', marginBottom: Spacing.xs },
  setsTableRow: { flexDirection: 'row', paddingVertical: 6 },

  startWorkoutBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.base,
  },

  emptyCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['3xl'],
  },

  // Library
  searchContainer: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.sm },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.default,
    height: 48,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMedium,
    color: Colors.text.primary,
  },
  categoryScroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.base, gap: Spacing.sm },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  categoryChipActive: {
    backgroundColor: Colors.brand.dim,
    borderColor: Colors.brand.primary,
  },
  exerciseList: { padding: Spacing.base, paddingBottom: Spacing['5xl'] },
  libraryExerciseCard: { marginBottom: Spacing.sm, padding: Spacing.md },
  libraryExerciseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  exerciseThumb: { width: 64, height: 64, borderRadius: BorderRadius.md },
  exerciseThumbPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  libraryExerciseInfo: { flex: 1 },
  videoIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brand.dim,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
