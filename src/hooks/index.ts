import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { mockMemberApi, mockAttendanceApi, mockWorkoutApi, mockDietApi, mockPTApi, mockTrainerApi, mockNotificationApi } from '@/services/api/mockApi';
import { MuscleGroup } from '@/types';

export const QueryKeys = {
  memberProfile: (id: string) => ['member','profile',id],
  membership: (id: string) => ['member','membership',id],
  bodyMeasurements: (id: string) => ['member','measurements',id],
  progressPhotos: (id: string) => ['member','progress-photos',id],
  attendance: (id: string) => ['attendance',id],
  attendanceStreak: (id: string) => ['attendance','streak',id],
  todayAttendance: (id: string) => ['attendance','today',id],
  assignedWorkout: (id: string) => ['workout','assigned',id],
  todayWorkout: (id: string) => ['workout','today',id],
  exercises: (filters: object) => ['exercises',filters],
  exerciseDetail: (id: string) => ['exercise',id],
  exerciseCategories: () => ['exercises','categories'],
  workoutHistory: (id: string) => ['workout','history',id],
  activeDiet: (id: string) => ['diet','active',id],
  ptPackage: (id: string) => ['pt','package',id],
  ptSessions: (id: string) => ['pt','sessions',id],
  trainerProfile: (id: string) => ['trainer','profile',id],
  trainerMembers: (id: string) => ['trainer','members',id],
  trainerDashboard: (id: string) => ['trainer','dashboard',id],
  trainerSessions: (id: string, date?: string) => ['trainer','sessions',id,date],
  notifications: () => ['notifications'],
  unreadCount: () => ['notifications','unread'],
} as const;

const useMemberId = () => useAuthStore(s => s.user?.id ?? '');
const useTrainerId = () => useAuthStore(s => s.user?.id ?? '');

export const useMemberProfile = (memberId?: string) => { const id = useMemberId(); const t = memberId ?? id; return useQuery({ queryKey: QueryKeys.memberProfile(t), queryFn: () => mockMemberApi.getProfile(t), enabled: !!t, staleTime: 300000 }); };
export const useMembership = (memberId?: string) => { const id = useMemberId(); const t = memberId ?? id; return useQuery({ queryKey: QueryKeys.membership(t), queryFn: () => mockMemberApi.getMembership(t), enabled: !!t }); };
export const useBodyMeasurements = () => { const id = useMemberId(); return useQuery({ queryKey: QueryKeys.bodyMeasurements(id), queryFn: () => mockMemberApi.getBodyMeasurements(id), enabled: !!id }); };
export const useProgressPhotos = (memberId?: string) => { const id = useMemberId(); const t = memberId ?? id; return useQuery({ queryKey: QueryKeys.progressPhotos(t), queryFn: () => mockMemberApi.getProgressPhotos(), enabled: !!t }); };
export const useAddBodyMeasurement = () => { const qc = useQueryClient(); const id = useMemberId(); return useMutation({ mutationFn: (data: any) => mockMemberApi.addBodyMeasurement(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: QueryKeys.bodyMeasurements(id) }) }); };
export const useAttendanceHistory = (page = 1) => { const id = useMemberId(); return useQuery({ queryKey: [...QueryKeys.attendance(id), page], queryFn: () => mockAttendanceApi.getHistory(id, page), enabled: !!id }); };
export const useAttendanceStreak = () => { const id = useMemberId(); return useQuery({ queryKey: QueryKeys.attendanceStreak(id), queryFn: () => mockAttendanceApi.getStreak(), enabled: !!id }); };
export const useTodayAttendance = () => { const id = useMemberId(); return useQuery({ queryKey: QueryKeys.todayAttendance(id), queryFn: () => mockAttendanceApi.getTodayStatus(), enabled: !!id, staleTime: 30000 }); };
export const useQRCheckIn = () => { const qc = useQueryClient(); const id = useMemberId(); return useMutation({ mutationFn: ({ qrCode, branchId }: { qrCode: string; branchId: string }) => mockAttendanceApi.checkInQR(qrCode, branchId), onSuccess: () => { qc.invalidateQueries({ queryKey: QueryKeys.todayAttendance(id) }); qc.invalidateQueries({ queryKey: QueryKeys.attendanceStreak(id) }); qc.invalidateQueries({ queryKey: QueryKeys.attendance(id) }); } }); };
export const useTodayWorkout = () => { const id = useMemberId(); return useQuery({ queryKey: QueryKeys.todayWorkout(id), queryFn: () => mockWorkoutApi.getTodayWorkout(), enabled: !!id }); };
export const useAssignedWorkout = () => { const id = useMemberId(); return useQuery({ queryKey: QueryKeys.assignedWorkout(id), queryFn: () => mockWorkoutApi.getAssignedPlan(), enabled: !!id }); };
export const useExercises = (params: { muscleGroup?: MuscleGroup; search?: string; page?: number }) => useQuery({ queryKey: QueryKeys.exercises(params), queryFn: () => mockWorkoutApi.getExercises(params), staleTime: 600000 });
export const useExerciseDetail = (id: string) => useQuery({ queryKey: QueryKeys.exerciseDetail(id), queryFn: () => mockWorkoutApi.getExerciseById(id), enabled: !!id, staleTime: 1800000 });
export const useExerciseCategories = () => useQuery({ queryKey: QueryKeys.exerciseCategories(), queryFn: () => mockWorkoutApi.getExerciseCategories(), staleTime: 1800000 });
export const useLogWorkout = () => { const qc = useQueryClient(); const id = useMemberId(); return useMutation({ mutationFn: (data: any) => mockWorkoutApi.logWorkout(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: QueryKeys.workoutHistory(id) }) }); };
export const useWorkoutHistory = (page = 1) => { const id = useMemberId(); return useQuery({ queryKey: [...QueryKeys.workoutHistory(id), page], queryFn: () => mockWorkoutApi.getWorkoutHistory(id, page), enabled: !!id }); };
export const useActiveDiet = (memberId?: string) => { const id = useMemberId(); const t = memberId ?? id; return useQuery({ queryKey: QueryKeys.activeDiet(t), queryFn: () => mockDietApi.getActivePlan(), enabled: !!t }); };
export const useLogMeal = () => { const id = useMemberId(); return useMutation({ mutationFn: (data: any) => mockDietApi.logMeal(id, data) }); };
export const usePTPackage = () => { const id = useMemberId(); return useQuery({ queryKey: QueryKeys.ptPackage(id), queryFn: () => mockPTApi.getMemberPackage(), enabled: !!id }); };
export const usePTSessions = (status?: string) => { const id = useMemberId(); return useQuery({ queryKey: [...QueryKeys.ptSessions(id), status], queryFn: () => mockPTApi.getMemberSessions(), enabled: !!id }); };
export const useTrainerProfile = (trainerId?: string) => { const id = useTrainerId(); const t = trainerId ?? id; return useQuery({ queryKey: QueryKeys.trainerProfile(t), queryFn: () => mockTrainerApi.getProfile(), enabled: !!t }); };
export const useTrainerMembers = (search?: string, page = 1) => { const id = useTrainerId(); return useQuery({ queryKey: [...QueryKeys.trainerMembers(id), search, page], queryFn: () => mockTrainerApi.getAssignedMembers(id, { search, page }), enabled: !!id }); };
export const useTrainerDashboard = () => { const id = useTrainerId(); return useQuery({ queryKey: QueryKeys.trainerDashboard(id), queryFn: () => mockTrainerApi.getDashboard(), enabled: !!id }); };
export const useTrainerSessions = (date?: string) => { const id = useTrainerId(); return useQuery({ queryKey: QueryKeys.trainerSessions(id, date), queryFn: () => mockPTApi.getTrainerSessions(id, { date }), enabled: !!id }); };
export const useTrainerCalendar = (month: string) => { const id = useTrainerId(); return useQuery({ queryKey: ['trainer','calendar',id,month], queryFn: () => mockPTApi.getCalendar(id, month), enabled: !!id }); };
export const useCreateWorkoutPlan = () => useMutation({ mutationFn: (data: any) => mockWorkoutApi.createWorkoutPlan(data) });
export const useCreateDietPlan = () => useMutation({ mutationFn: (data: any) => mockDietApi.createDietPlan(data) });
export const useCompleteSession = () => { const qc = useQueryClient(); const id = useTrainerId(); return useMutation({ mutationFn: ({ sessionId, data }: { sessionId: string; data: any }) => mockPTApi.completeSession(sessionId, data), onSuccess: () => qc.invalidateQueries({ queryKey: QueryKeys.trainerSessions(id) }) }); };
export const useNotifications = (page = 1) => useQuery({ queryKey: [...QueryKeys.notifications(), page], queryFn: () => mockNotificationApi.getAll(page) });
export const useUnreadCount = () => useQuery({ queryKey: QueryKeys.unreadCount(), queryFn: () => mockNotificationApi.getUnreadCount(), refetchInterval: 60000 });
export const useMarkNotificationRead = () => { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => mockNotificationApi.markRead(id), onSuccess: () => { qc.invalidateQueries({ queryKey: QueryKeys.notifications() }); qc.invalidateQueries({ queryKey: QueryKeys.unreadCount() }); } }); };
