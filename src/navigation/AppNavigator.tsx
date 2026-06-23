import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing } from '@/theme';

// Auth
import { LoginScreen } from '@/screens/auth/LoginScreen';

// Member
import { MemberDashboardScreen } from '@/screens/member/DashboardScreen';
import { WorkoutScreen } from '@/screens/member/WorkoutScreen';
import { ProgressScreen } from '@/screens/member/ProgressScreen';
import { DietScreen } from '@/screens/member/DietScreen';
import { QRCheckInScreen } from '@/screens/member/QRCheckInScreen';
import { ExerciseDetailScreen } from '@/screens/member/ExerciseDetailScreen';
import { MemberProfileScreen } from '@/screens/member/MemberProfileScreen';
import { MembershipDetailScreen } from '@/screens/member/MembershipDetailScreen';
import { PTDetailScreen } from '@/screens/member/PTDetailScreen';
import { AttendanceHistoryScreen } from '@/screens/member/AttendanceHistoryScreen';
import { NotificationsScreen } from '@/screens/shared/NotificationsScreen';

// Trainer
import { TrainerDashboardScreen } from '@/screens/trainer/TrainerDashboardScreen';
import { TrainerMembersScreen } from '@/screens/trainer/TrainerMembersScreen';
import { TrainerSessionsScreen } from '@/screens/trainer/TrainerSessionsScreen';
import { MemberDetailScreen } from '@/screens/trainer/MemberDetailScreen';
import { CreateWorkoutScreen } from '@/screens/trainer/CreateWorkoutScreen';
import { CreateDietScreen } from '@/screens/trainer/CreateDietScreen';
import { PTSessionDetailScreen } from '@/screens/trainer/PTSessionDetailScreen';
import { PTCalendarScreen } from '@/screens/trainer/PTCalendarScreen';
import { TrainerProfileScreen } from '@/screens/trainer/TrainerProfileScreen';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MemberTab = createBottomTabNavigator();
const MemberStack = createNativeStackNavigator();
const TrainerTab = createBottomTabNavigator();
const TrainerStack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: Colors.background.primary },
  animation: 'slide_from_right' as const,
};

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={screenOptions}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

const TabIcon = ({ emoji, focused, label }: { emoji: string; focused: boolean; label: string }) => (
  <View style={tabStyles.iconContainer}>
    <Text style={[tabStyles.emoji, { opacity: focused ? 1 : 0.45 }]}>{emoji}</Text>
    <Text style={[Typography.labelSmall, { color: focused ? Colors.brand.primary : Colors.text.muted, marginTop: 2, fontSize: 9 }]}>
      {label}
    </Text>
  </View>
);

const MemberTabs = () => (
  <MemberTab.Navigator screenOptions={{ headerShown: false, tabBarStyle: tabStyles.tabBar, tabBarShowLabel: false }}>
    <MemberTab.Screen name="Dashboard" component={MemberDashboardScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} label="Home" /> }} />
    <MemberTab.Screen name="Workout" component={WorkoutScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏋️" focused={focused} label="Workout" /> }} />
    <MemberTab.Screen name="Progress" component={ProgressScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} label="Progress" /> }} />
    <MemberTab.Screen name="Diet" component={DietScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🥗" focused={focused} label="Diet" /> }} />
    <MemberTab.Screen name="Profile" component={MemberProfileScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} label="Profile" /> }} />
  </MemberTab.Navigator>
);

const MemberNavigator = () => (
  <MemberStack.Navigator screenOptions={screenOptions}>
    <MemberStack.Screen name="MemberTabs" component={MemberTabs} />
    <MemberStack.Screen name="QRCheckIn" component={QRCheckInScreen} options={{ animation: 'slide_from_bottom' }} />
    <MemberStack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
    <MemberStack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
    <MemberStack.Screen name="MembershipDetail" component={MembershipDetailScreen} />
    <MemberStack.Screen name="PTDetail" component={PTDetailScreen} />
    <MemberStack.Screen name="Notifications" component={NotificationsScreen} />
    <MemberStack.Screen name="EditProfile" component={MemberProfileScreen} />
    <MemberStack.Screen name="BodyMeasurements" component={ProgressScreen} />
    <MemberStack.Screen name="ProgressPhotos" component={ProgressScreen} />
    <MemberStack.Screen name="WorkoutDetail" component={WorkoutScreen} />
    <MemberStack.Screen name="WorkoutHistory" component={WorkoutScreen} />
    <MemberStack.Screen name="PaymentHistory" component={MembershipDetailScreen} />
    <MemberStack.Screen name="PTSchedule" component={PTDetailScreen} />
    <MemberStack.Screen name="ExerciseCategory" component={WorkoutScreen} />
    <MemberStack.Screen name="ExerciseVideo" component={ExerciseDetailScreen} />
  </MemberStack.Navigator>
);

const TrainerTabs = () => (
  <TrainerTab.Navigator screenOptions={{ headerShown: false, tabBarStyle: tabStyles.tabBar, tabBarShowLabel: false }}>
    <TrainerTab.Screen name="Dashboard" component={TrainerDashboardScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} label="Home" /> }} />
    <TrainerTab.Screen name="Members" component={TrainerMembersScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} label="Members" /> }} />
    <TrainerTab.Screen name="Sessions" component={TrainerSessionsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} label="Sessions" /> }} />
    <TrainerTab.Screen name="Profile" component={TrainerProfileScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} label="Profile" /> }} />
  </TrainerTab.Navigator>
);

const TrainerNavigator = () => (
  <TrainerStack.Navigator screenOptions={screenOptions}>
    <TrainerStack.Screen name="TrainerTabs" component={TrainerTabs} />
    <TrainerStack.Screen name="MemberDetail" component={MemberDetailScreen} />
    <TrainerStack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
    <TrainerStack.Screen name="CreateDiet" component={CreateDietScreen} />
    <TrainerStack.Screen name="PTSessionDetail" component={PTSessionDetailScreen} />
    <TrainerStack.Screen name="PTCalendar" component={PTCalendarScreen} />
    <TrainerStack.Screen name="Notifications" component={NotificationsScreen} />
    <TrainerStack.Screen name="AssignWorkout" component={CreateWorkoutScreen} />
    <TrainerStack.Screen name="AssignDiet" component={CreateDietScreen} />
    <TrainerStack.Screen name="UploadProgress" component={MemberDetailScreen} />
    <TrainerStack.Screen name="SessionNotes" component={PTSessionDetailScreen} />
    <TrainerStack.Screen name="WorkoutPlanDetail" component={CreateWorkoutScreen} />
  </TrainerStack.Navigator>
);

const SplashLoading = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.primary }}>
    <ActivityIndicator color={Colors.brand.primary} size="large" />
  </View>
);

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, user, hydrate } = useAuthStore();

  useEffect(() => { hydrate(); }, []);

  if (isLoading) return <SplashLoading />;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background.primary } }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'MEMBER' ? (
          <RootStack.Screen name="MemberApp" component={MemberNavigator} />
        ) : (
          <RootStack.Screen name="TrainerApp" component={TrainerNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background.secondary,
    borderTopColor: Colors.border.default,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: Spacing.sm,
  },
  iconContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: Spacing.sm },
  emoji: { fontSize: 22 },
});
