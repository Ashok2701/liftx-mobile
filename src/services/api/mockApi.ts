/**
 * Mock API layer — drop-in replacement for the real API services.
 * Toggle USE_MOCK_API in src/constants/config.ts to switch between mock and real.
 */

import {
  MOCK_MEMBER_USER,
  MOCK_TRAINER_USER,
  MOCK_MEMBER_PROFILE,
  MOCK_TRAINER_PROFILE,
  MOCK_MEMBERSHIP,
  MOCK_ATTENDANCE_HISTORY,
  MOCK_ATTENDANCE_STREAK,
  MOCK_WORKOUT_PLAN,
  MOCK_WORKOUT_DAY_TODAY,
  MOCK_EXERCISES,
  MOCK_DIET_PLAN,
  MOCK_PT_PACKAGE,
  MOCK_PT_SESSIONS,
  MOCK_MEASUREMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_PAYMENTS,
  MOCK_TRAINER_MEMBERS,
  getTodayWorkout,
} from './mockData';

import {
  AuthResponse,
  MemberProfile,
  Membership,
  Attendance,
  AttendanceStreak,
  WorkoutDay,
  WorkoutPlan,
  Exercise,
  DietPlan,
  PTPackage,
  PTSession,
  BodyMeasurement,
  AppNotification,
  MuscleGroup,
  PaginatedResponse,
} from '@/types';

// Simulate async network delay
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const paginate = <T>(data: T[], page = 1, limit = 20): PaginatedResponse<T> => ({
  data: data.slice((page - 1) * limit, page * limit),
  total: data.length,
  page,
  limit,
  totalPages: Math.ceil(data.length / limit),
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const mockAuthApi = {
  login: async (email: string): Promise<AuthResponse> => {
    await delay(800);
    const isMember = email.includes('member') || email === 'member@gymos.app';
    const user = isMember ? MOCK_MEMBER_USER : MOCK_TRAINER_USER;
    if (!user) throw { message: 'Invalid credentials', statusCode: 401 };
    return {
      user,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  },
};

// ─── Member ───────────────────────────────────────────────────────────────────

export const mockMemberApi = {
  getProfile: async (_memberId: string): Promise<MemberProfile> => {
    await delay(400);
    return MOCK_MEMBER_PROFILE;
  },

  getMembership: async (_memberId: string): Promise<Membership> => {
    await delay(300);
    return MOCK_MEMBERSHIP;
  },

  getPaymentHistory: async (_memberId: string, page = 1) => {
    await delay(300);
    return paginate(MOCK_PAYMENTS, page);
  },

  getBodyMeasurements: async (_memberId: string): Promise<BodyMeasurement[]> => {
    await delay(400);
    return MOCK_MEASUREMENTS;
  },

  addBodyMeasurement: async (_memberId: string, data: Partial<BodyMeasurement>): Promise<BodyMeasurement> => {
    await delay(500);
    const newEntry: BodyMeasurement = {
      id: 'meas-' + Date.now(),
      memberId: 'member-1',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...data,
    };
    MOCK_MEASUREMENTS.unshift(newEntry);
    return newEntry;
  },

  getProgressPhotos: async () => {
    await delay(300);
    return [];
  },

  uploadProgressPhoto: async (_memberId: string, data: any) => {
    await delay(600);
    return { id: 'photo-' + Date.now(), ...data };
  },

  getAssignedTrainer: async () => {
    await delay(300);
    return MOCK_TRAINER_PROFILE;
  },
};

// ─── Attendance ───────────────────────────────────────────────────────────────

let todayCheckedIn = false;
let todayAttendanceRecord: Attendance | null = null;

export const mockAttendanceApi = {
  checkInQR: async (qrCode: string, branchId: string): Promise<Attendance> => {
    await delay(700);

    if (todayCheckedIn) {
      throw { message: 'Already checked in today', statusCode: 409 };
    }

    if (!qrCode.startsWith('GYM_BRANCH:')) {
      throw { message: 'Invalid QR code', statusCode: 400 };
    }

    const record: Attendance = {
      id: 'att-' + Date.now(),
      memberId: 'member-1',
      branchId,
      checkInTime: new Date().toISOString(),
      method: 'QR',
      createdAt: new Date().toISOString(),
    };

    todayCheckedIn = true;
    todayAttendanceRecord = record;
    MOCK_ATTENDANCE_HISTORY.unshift(record);
    return record;
  },

  getHistory: async (_memberId: string, page = 1, limit = 30) => {
    await delay(400);
    return paginate(MOCK_ATTENDANCE_HISTORY, page, limit);
  },

  getStreak: async (): Promise<AttendanceStreak> => {
    await delay(200);
    return MOCK_ATTENDANCE_STREAK;
  },

  getTodayStatus: async (): Promise<Attendance | null> => {
    await delay(200);
    return todayAttendanceRecord;
  },
};

// ─── Workout ──────────────────────────────────────────────────────────────────

export const mockWorkoutApi = {
  getAssignedPlan: async (): Promise<WorkoutPlan> => {
    await delay(400);
    return MOCK_WORKOUT_PLAN;
  },

  getTodayWorkout: async (): Promise<WorkoutDay | null> => {
    await delay(300);
    return getTodayWorkout();
  },

  getExercises: async (params: { muscleGroup?: MuscleGroup; search?: string; page?: number; limit?: number }) => {
    await delay(400);
    let filtered = [...MOCK_EXERCISES];

    if (params.muscleGroup) {
      filtered = filtered.filter((e) => e.muscleGroup === params.muscleGroup);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) => e.name.toLowerCase().includes(q) || e.muscleGroup.toLowerCase().includes(q),
      );
    }

    return paginate(filtered, params.page, params.limit);
  },

  getExerciseById: async (id: string): Promise<Exercise> => {
    await delay(200);
    const ex = MOCK_EXERCISES.find((e) => e.id === id);
    if (!ex) throw { message: 'Exercise not found', statusCode: 404 };
    return ex;
  },

  getExerciseCategories: async () => {
    await delay(200);
    const groups: Record<string, number> = {};
    MOCK_EXERCISES.forEach((e) => {
      groups[e.muscleGroup] = (groups[e.muscleGroup] ?? 0) + 1;
    });
    return Object.entries(groups).map(([category, count]) => ({
      category: category as MuscleGroup,
      count,
    }));
  },

  logWorkout: async (_memberId: string, data: any) => {
    await delay(500);
    return { id: 'wlog-' + Date.now(), ...data };
  },

  getWorkoutHistory: async (_memberId: string, page = 1) => {
    await delay(300);
    return paginate([], page);
  },

  createWorkoutPlan: async (data: Partial<WorkoutPlan>): Promise<WorkoutPlan> => {
    await delay(600);
    return { ...MOCK_WORKOUT_PLAN, ...data, id: 'plan-' + Date.now() };
  },

  assignWorkoutPlan: async (planId: string, memberId: string) => {
    await delay(400);
    return { success: true, planId, memberId };
  },

  getTrainerPlans: async () => {
    await delay(400);
    return [MOCK_WORKOUT_PLAN];
  },
};

// ─── Diet ─────────────────────────────────────────────────────────────────────

const mealLogs: any[] = [];

export const mockDietApi = {
  getActivePlan: async (): Promise<DietPlan> => {
    await delay(400);
    return MOCK_DIET_PLAN;
  },

  logMeal: async (_memberId: string, data: any) => {
    await delay(500);
    const log = { id: 'mlog-' + Date.now(), ...data };
    mealLogs.push(log);
    return log;
  },

  getMealLogs: async (_memberId: string, date: string) => {
    await delay(200);
    return mealLogs.filter((l) => l.date === date);
  },

  createDietPlan: async (data: Partial<DietPlan>): Promise<DietPlan> => {
    await delay(600);
    return { ...MOCK_DIET_PLAN, ...data, id: 'diet-' + Date.now() } as DietPlan;
  },

  assignDietPlan: async (planId: string, memberId: string) => {
    await delay(400);
    return { success: true, planId, memberId };
  },

  getTrainerDietPlans: async () => {
    await delay(300);
    return [MOCK_DIET_PLAN];
  },
};

// ─── PT ───────────────────────────────────────────────────────────────────────

const ptSessionsState = [...MOCK_PT_SESSIONS];

export const mockPTApi = {
  getMemberPackage: async (): Promise<PTPackage> => {
    await delay(300);
    return MOCK_PT_PACKAGE;
  },

  getMemberSessions: async () => {
    await delay(400);
    return paginate(ptSessionsState);
  },

  getTrainerSessions: async (_trainerId: string, params?: { date?: string }) => {
    await delay(400);
    if (params?.date) {
      return ptSessionsState.filter((s) => s.scheduledDate === params.date);
    }
    return ptSessionsState;
  },

  completeSession: async (sessionId: string, data: any) => {
    await delay(500);
    const idx = ptSessionsState.findIndex((s) => s.id === sessionId);
    if (idx !== -1) {
      ptSessionsState[idx] = {
        ...ptSessionsState[idx],
        status: 'COMPLETED',
        trainerNotes: data.trainerNotes,
        completedAt: new Date().toISOString(),
      };
    }
    return ptSessionsState[idx];
  },

  cancelSession: async (sessionId: string) => {
    await delay(400);
    const idx = ptSessionsState.findIndex((s) => s.id === sessionId);
    if (idx !== -1) ptSessionsState[idx].status = 'CANCELLED';
    return { success: true };
  },

  getCalendar: async (_trainerId: string, month: string) => {
    await delay(300);
    return ptSessionsState.filter((s) => s.scheduledDate.startsWith(month.slice(0, 7)));
  },
};

// ─── Trainer ──────────────────────────────────────────────────────────────────

export const mockTrainerApi = {
  getProfile: async () => {
    await delay(400);
    return MOCK_TRAINER_PROFILE;
  },

  getAssignedMembers: async (_trainerId: string, params?: { search?: string; page?: number }) => {
    await delay(400);
    let members = [...MOCK_TRAINER_MEMBERS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      members = members.filter(
        (m) =>
          m.user.firstName.toLowerCase().includes(q) ||
          m.user.lastName.toLowerCase().includes(q),
      );
    }
    return paginate(members, params?.page ?? 1);
  },

  getMemberDetail: async (_trainerId: string, memberId: string) => {
    await delay(300);
    return MOCK_TRAINER_MEMBERS.find((m) => m.id === memberId) ?? MOCK_MEMBER_PROFILE;
  },

  getDashboard: async () => {
    await delay(400);
    return {
      totalMembers: MOCK_TRAINER_MEMBERS.length,
      todaySessions: ptSessionsState.filter(
        (s) => s.scheduledDate === new Date().toISOString().split('T')[0],
      ).length,
      completedSessions: ptSessionsState.filter((s) => s.status === 'COMPLETED').length,
      upcomingSessions: ptSessionsState.filter((s) => s.status === 'SCHEDULED').length,
      totalSessions: MOCK_TRAINER_PROFILE.totalSessions,
      rating: MOCK_TRAINER_PROFILE.rating,
    };
  },
};

// ─── Notifications ────────────────────────────────────────────────────────────

const notificationsState = [...MOCK_NOTIFICATIONS];

export const mockNotificationApi = {
  getAll: async (page = 1) => {
    await delay(300);
    return paginate(notificationsState, page);
  },

  getUnreadCount: async () => {
    await delay(100);
    return { count: notificationsState.filter((n) => !n.isRead).length };
  },

  markRead: async (id: string) => {
    const n = notificationsState.find((n) => n.id === id);
    if (n) n.isRead = true;
    return { success: true };
  },

  markAllRead: async () => {
    notificationsState.forEach((n) => (n.isRead = true));
    return { success: true };
  },
};
