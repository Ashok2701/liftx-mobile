import apiClient from './client';
import {
  AuthResponse,
  LoginPayload,
  MemberProfile,
  Membership,
  Attendance,
  AttendanceStreak,
  WorkoutPlan,
  WorkoutLog,
  DietPlan,
  MealLog,
  PTPackage,
  PTSession,
  Exercise,
  ProgressPhoto,
  BodyMeasurement,
  AppNotification,
  TrainerProfile,
  PaginatedResponse,
  ApiResponse,
  MuscleGroup,
} from '@/types';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),

  getMe: () => apiClient.get<ApiResponse<{ user: import('@/types').User }>>('/auth/me'),

  updateFcmToken: (fcmToken: string) =>
    apiClient.patch('/auth/fcm-token', { fcmToken }),
};

// ─── Member ───────────────────────────────────────────────────────────────────

export const memberApi = {
  getProfile: (memberId: string) =>
    apiClient.get<ApiResponse<MemberProfile>>(`/members/${memberId}/profile`),

  updateProfile: (memberId: string, data: Partial<MemberProfile>) =>
    apiClient.patch<ApiResponse<MemberProfile>>(`/members/${memberId}/profile`, data),

  updateProfileImage: (memberId: string, imageUrl: string) =>
    apiClient.patch(`/members/${memberId}/profile-image`, { imageUrl }),

  getMembership: (memberId: string) =>
    apiClient.get<ApiResponse<Membership>>(`/members/${memberId}/membership`),

  getPaymentHistory: (memberId: string, page = 1, limit = 20) =>
    apiClient.get<ApiResponse<PaginatedResponse<import('@/types').Payment>>>(
      `/members/${memberId}/payments?page=${page}&limit=${limit}`,
    ),

  getBodyMeasurements: (memberId: string) =>
    apiClient.get<ApiResponse<BodyMeasurement[]>>(
      `/members/${memberId}/measurements`,
    ),

  addBodyMeasurement: (memberId: string, data: Partial<BodyMeasurement>) =>
    apiClient.post<ApiResponse<BodyMeasurement>>(
      `/members/${memberId}/measurements`,
      data,
    ),

  getProgressPhotos: (memberId: string) =>
    apiClient.get<ApiResponse<ProgressPhoto[]>>(
      `/members/${memberId}/progress-photos`,
    ),

  uploadProgressPhoto: (memberId: string, data: Partial<ProgressPhoto>) =>
    apiClient.post<ApiResponse<ProgressPhoto>>(
      `/members/${memberId}/progress-photos`,
      data,
    ),

  getAssignedTrainer: (memberId: string) =>
    apiClient.get<ApiResponse<TrainerProfile>>(
      `/members/${memberId}/trainer`,
    ),
};

// ─── Attendance ───────────────────────────────────────────────────────────────

export const attendanceApi = {
  checkInQR: (qrCode: string, branchId: string) =>
    apiClient.post<ApiResponse<Attendance>>('/attendance/qr-checkin', {
      qrCode,
      branchId,
    }),

  checkOut: (attendanceId: string) =>
    apiClient.patch<ApiResponse<Attendance>>(
      `/attendance/${attendanceId}/checkout`,
    ),

  getHistory: (memberId: string, page = 1, limit = 30) =>
    apiClient.get<ApiResponse<PaginatedResponse<Attendance>>>(
      `/attendance/member/${memberId}?page=${page}&limit=${limit}`,
    ),

  getStreak: (memberId: string) =>
    apiClient.get<ApiResponse<AttendanceStreak>>(
      `/attendance/member/${memberId}/streak`,
    ),

  getTodayStatus: (memberId: string) =>
    apiClient.get<ApiResponse<Attendance | null>>(
      `/attendance/member/${memberId}/today`,
    ),
};

// ─── Workout ──────────────────────────────────────────────────────────────────

export const workoutApi = {
  getAssignedPlan: (memberId: string) =>
    apiClient.get<ApiResponse<WorkoutPlan>>(
      `/workout-plans/member/${memberId}/active`,
    ),

  getTodayWorkout: (memberId: string) =>
    apiClient.get<ApiResponse<import('@/types').WorkoutDay>>(
      `/workout-plans/member/${memberId}/today`,
    ),

  getExercises: (params: {
    muscleGroup?: MuscleGroup;
    difficulty?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Exercise>>>('/exercises', {
      params,
    }),

  getExerciseById: (id: string) =>
    apiClient.get<ApiResponse<Exercise>>(`/exercises/${id}`),

  getExerciseCategories: () =>
    apiClient.get<ApiResponse<{ category: MuscleGroup; count: number }[]>>(
      '/exercises/categories',
    ),

  logWorkout: (memberId: string, data: Partial<WorkoutLog>) =>
    apiClient.post<ApiResponse<WorkoutLog>>(
      `/workout-logs/member/${memberId}`,
      data,
    ),

  getWorkoutHistory: (memberId: string, page = 1, limit = 20) =>
    apiClient.get<ApiResponse<PaginatedResponse<WorkoutLog>>>(
      `/workout-logs/member/${memberId}?page=${page}&limit=${limit}`,
    ),

  getStrengthProgress: (memberId: string, exerciseId: string) =>
    apiClient.get(
      `/workout-logs/member/${memberId}/strength-progress/${exerciseId}`,
    ),

  // Trainer workout management
  createWorkoutPlan: (data: Partial<WorkoutPlan>) =>
    apiClient.post<ApiResponse<WorkoutPlan>>('/workout-plans', data),

  assignWorkoutPlan: (planId: string, memberId: string) =>
    apiClient.post(`/workout-plans/${planId}/assign`, { memberId }),

  getTrainerPlans: (trainerId: string) =>
    apiClient.get<ApiResponse<WorkoutPlan[]>>(
      `/workout-plans/trainer/${trainerId}`,
    ),

  updateWorkoutPlan: (planId: string, data: Partial<WorkoutPlan>) =>
    apiClient.patch<ApiResponse<WorkoutPlan>>(
      `/workout-plans/${planId}`,
      data,
    ),
};

// ─── Diet ─────────────────────────────────────────────────────────────────────

export const dietApi = {
  getActivePlan: (memberId: string) =>
    apiClient.get<ApiResponse<DietPlan>>(
      `/diet-plans/member/${memberId}/active`,
    ),

  logMeal: (memberId: string, data: Partial<MealLog>) =>
    apiClient.post<ApiResponse<MealLog>>(
      `/meal-logs/member/${memberId}`,
      data,
    ),

  getMealLogs: (memberId: string, date: string) =>
    apiClient.get<ApiResponse<MealLog[]>>(
      `/meal-logs/member/${memberId}?date=${date}`,
    ),

  // Trainer diet management
  createDietPlan: (data: Partial<DietPlan>) =>
    apiClient.post<ApiResponse<DietPlan>>('/diet-plans', data),

  assignDietPlan: (planId: string, memberId: string) =>
    apiClient.post(`/diet-plans/${planId}/assign`, { memberId }),

  getTrainerDietPlans: (trainerId: string) =>
    apiClient.get<ApiResponse<DietPlan[]>>(
      `/diet-plans/trainer/${trainerId}`,
    ),

  updateDietPlan: (planId: string, data: Partial<DietPlan>) =>
    apiClient.patch<ApiResponse<DietPlan>>(`/diet-plans/${planId}`, data),
};

// ─── PT ───────────────────────────────────────────────────────────────────────

export const ptApi = {
  getMemberPackage: (memberId: string) =>
    apiClient.get<ApiResponse<PTPackage>>(
      `/pt-packages/member/${memberId}/active`,
    ),

  getMemberSessions: (memberId: string, params?: { status?: string; page?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<PTSession>>>(
      `/pt-sessions/member/${memberId}`,
      { params },
    ),

  getTrainerSessions: (trainerId: string, params?: { date?: string; status?: string }) =>
    apiClient.get<ApiResponse<PTSession[]>>(
      `/pt-sessions/trainer/${trainerId}`,
      { params },
    ),

  completeSession: (sessionId: string, data: { notes?: string; trainerNotes?: string }) =>
    apiClient.patch(`/pt-sessions/${sessionId}/complete`, data),

  cancelSession: (sessionId: string, reason?: string) =>
    apiClient.patch(`/pt-sessions/${sessionId}/cancel`, { reason }),

  addSessionNotes: (sessionId: string, notes: string) =>
    apiClient.patch(`/pt-sessions/${sessionId}/notes`, { notes }),

  submitFeedback: (sessionId: string, rating: number, feedback: string) =>
    apiClient.post(`/pt-sessions/${sessionId}/feedback`, { rating, feedback }),

  getCalendar: (trainerId: string, month: string) =>
    apiClient.get(`/pt-sessions/trainer/${trainerId}/calendar?month=${month}`),
};

// ─── Trainer ──────────────────────────────────────────────────────────────────

export const trainerApi = {
  getProfile: (trainerId: string) =>
    apiClient.get<ApiResponse<TrainerProfile>>(
      `/trainers/${trainerId}/profile`,
    ),

  updateProfile: (trainerId: string, data: Partial<TrainerProfile>) =>
    apiClient.patch<ApiResponse<TrainerProfile>>(
      `/trainers/${trainerId}/profile`,
      data,
    ),

  getAssignedMembers: (trainerId: string, params?: { page?: number; search?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<MemberProfile>>>(
      `/trainers/${trainerId}/members`,
      { params },
    ),

  getMemberDetail: (trainerId: string, memberId: string) =>
    apiClient.get<ApiResponse<MemberProfile>>(
      `/trainers/${trainerId}/members/${memberId}`,
    ),

  uploadMemberProgress: (memberId: string, data: Partial<ProgressPhoto>) =>
    apiClient.post<ApiResponse<ProgressPhoto>>(
      `/members/${memberId}/progress-photos`,
      data,
    ),

  getDashboard: (trainerId: string) =>
    apiClient.get(`/trainers/${trainerId}/dashboard`),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationApi = {
  getAll: (page = 1, limit = 20) =>
    apiClient.get<ApiResponse<PaginatedResponse<AppNotification>>>(
      `/notifications?page=${page}&limit=${limit}`,
    ),

  markRead: (notificationId: string) =>
    apiClient.patch(`/notifications/${notificationId}/read`),

  markAllRead: () => apiClient.patch('/notifications/read-all'),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),
};
