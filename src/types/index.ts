// ─── Auth & Users ────────────────────────────────────────────────────────────

export type UserRole = 'OWNER' | 'BRANCH_ADMIN' | 'TRAINER' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
  branchId?: string;
  branch?: Branch;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ─── Branch ──────────────────────────────────────────────────────────────────

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  logoUrl?: string;
  coverImageUrl?: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Member ───────────────────────────────────────────────────────────────────

export type FitnessGoal =
  | 'WEIGHT_LOSS'
  | 'MUSCLE_GAIN'
  | 'ENDURANCE'
  | 'FLEXIBILITY'
  | 'GENERAL_FITNESS';

export interface MemberProfile {
  id: string;
  userId: string;
  user: User;
  memberId: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  height?: number; // cm
  weight?: number; // kg
  fitnessGoal?: FitnessGoal;
  healthNotes?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  qrCode: string;
  branchId: string;
  trainerId?: string;
  trainer?: TrainerProfile;
  membership?: Membership;
  createdAt: string;
  updatedAt: string;
}

export interface BodyMeasurement {
  id: string;
  memberId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bicepLeft?: number;
  bicepRight?: number;
  thighLeft?: number;
  thighRight?: number;
  calf?: number;
  notes?: string;
  createdAt: string;
}

export interface ProgressPhoto {
  id: string;
  memberId: string;
  imageUrl: string;
  date: string;
  type: 'FRONT' | 'SIDE' | 'BACK';
  notes?: string;
  uploadedById: string;
  createdAt: string;
}

// ─── Membership ───────────────────────────────────────────────────────────────

export type MembershipType = 'BASIC' | 'PREMIUM' | 'PT_ONLY' | 'CUSTOM';
export type MembershipStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'FROZEN'
  | 'PENDING'
  | 'CANCELLED';

export interface MembershipPlan {
  id: string;
  branchId: string;
  name: string;
  type: MembershipType;
  durationDays: number;
  price: number;
  description: string;
  features: string[];
  multibranchAccess: boolean;
  isActive: boolean;
}

export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  plan: MembershipPlan;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  freezeStartDate?: string;
  freezeEndDate?: string;
  totalAmount: number;
  paidAmount: number;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'RAZORPAY' | 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';

export interface Payment {
  id: string;
  memberId: string;
  membershipId?: string;
  ptPackageId?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  invoiceUrl?: string;
  notes?: string;
  createdAt: string;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export type AttendanceStatus = 'CHECKED_IN' | 'CHECKED_OUT';

export interface Attendance {
  id: string;
  memberId: string;
  member?: MemberProfile;
  branchId: string;
  branch?: Branch;
  checkInTime: string;
  checkOutTime?: string;
  method: 'QR' | 'MANUAL' | 'BIOMETRIC';
  createdAt: string;
}

export interface AttendanceStreak {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  thisWeek: number;
  thisMonth: number;
}

// ─── Trainer ─────────────────────────────────────────────────────────────────

export interface TrainerProfile {
  id: string;
  userId: string;
  user: User;
  specializations: string[];
  certifications: string[];
  experience: number; // years
  bio?: string;
  branchId: string;
  assignedMembers?: MemberProfile[];
  ptSessions?: PTSession[];
  rating?: number;
  totalSessions: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Workout ──────────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'CHEST'
  | 'BACK'
  | 'SHOULDERS'
  | 'BICEPS'
  | 'TRICEPS'
  | 'LEGS'
  | 'ABS'
  | 'CARDIO'
  | 'FULL_BODY';

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type EquipmentType =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'CABLE'
  | 'MACHINE'
  | 'BODYWEIGHT'
  | 'KETTLEBELL'
  | 'RESISTANCE_BAND'
  | 'CARDIO_MACHINE';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: DifficultyLevel;
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
  commonMistakes?: string[];
  tips?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  targetReps?: number;
  targetWeight?: number;
  targetDuration?: number; // seconds (for cardio/timed)
  restTime: number; // seconds
  completedReps?: number;
  completedWeight?: number;
  completedDuration?: number;
  isCompleted: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  order: number;
  sets: WorkoutSet[];
  notes?: string;
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface WorkoutDay {
  id: string;
  day: DayOfWeek;
  name: string; // e.g. "Chest + Triceps"
  exercises: WorkoutExercise[];
  isRestDay: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  trainer?: TrainerProfile;
  memberId?: string;
  days: WorkoutDay[];
  durationWeeks: number;
  goal: FitnessGoal;
  isTemplate: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutLog {
  id: string;
  memberId: string;
  workoutDayId?: string;
  date: string;
  startTime: string;
  endTime?: string;
  exercises: WorkoutExercise[];
  totalVolume: number;
  notes?: string;
  mood?: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
}

// ─── Diet ────────────────────────────────────────────────────────────────────

export type MealType = 'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER' | 'PRE_WORKOUT' | 'POST_WORKOUT';

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface Meal {
  id: string;
  type: MealType;
  time?: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  notes?: string;
  mealImage?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  trainerId: string;
  trainer?: TrainerProfile;
  memberId?: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: Meal[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealLog {
  id: string;
  memberId: string;
  date: string;
  mealType: MealType;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
}

// ─── Personal Training ────────────────────────────────────────────────────────

export type PTSessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface PTPackage {
  id: string;
  memberId: string;
  trainerId: string;
  trainer?: TrainerProfile;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  pricePerSession: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  payment?: Payment;
  createdAt: string;
}

export interface PTSession {
  id: string;
  ptPackageId: string;
  ptPackage?: PTPackage;
  trainerId: string;
  trainer?: TrainerProfile;
  memberId: string;
  member?: MemberProfile;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  status: PTSessionStatus;
  notes?: string;
  trainerNotes?: string;
  memberFeedback?: string;
  memberRating?: 1 | 2 | 3 | 4 | 5;
  completedAt?: string;
  createdAt: string;
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'TRIAL'
  | 'CONVERTED'
  | 'LOST';

export interface Lead {
  id: string;
  branchId: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  status: LeadStatus;
  interestedPlan?: string;
  assignedTo?: string;
  notes?: string;
  followUpDate?: string;
  convertedMemberId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'MEMBERSHIP_EXPIRY'
  | 'PAYMENT_CONFIRMATION'
  | 'WORKOUT_REMINDER'
  | 'PT_REMINDER'
  | 'DIET_UPDATE'
  | 'PROGRESS_UPDATE'
  | 'ANNOUNCEMENT'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  todayAttendance: number;
  monthlyRevenue: number;
  pendingPayments: number;
  newMembersThisMonth: number;
  ptSessionsToday: number;
}

export interface RevenueData {
  date: string;
  amount: number;
  type: 'MEMBERSHIP' | 'PT' | 'OTHER';
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MemberApp: undefined;
  TrainerApp: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type MemberTabParamList = {
  Dashboard: undefined;
  Workout: undefined;
  Progress: undefined;
  Diet: undefined;
  Profile: undefined;
};

export type MemberStackParamList = {
  MemberTabs: undefined;
  QRCheckIn: undefined;
  AttendanceHistory: undefined;
  WorkoutDetail: { workoutDayId: string };
  ExerciseCategory: { category: MuscleGroup };
  ExerciseDetail: { exerciseId: string };
  ExerciseVideo: { exercise: Exercise };
  MembershipDetail: undefined;
  PaymentHistory: undefined;
  PTDetail: undefined;
  PTSchedule: undefined;
  Notifications: undefined;
  EditProfile: undefined;
  BodyMeasurements: undefined;
  ProgressPhotos: undefined;
  WorkoutHistory: undefined;
};

export type TrainerTabParamList = {
  Dashboard: undefined;
  Members: undefined;
  Sessions: undefined;
  Profile: undefined;
};

export type TrainerStackParamList = {
  TrainerTabs: undefined;
  MemberDetail: { memberId: string };
  CreateWorkout: { memberId?: string };
  AssignWorkout: { memberId: string };
  WorkoutPlanDetail: { planId: string };
  CreateDiet: { memberId?: string };
  AssignDiet: { memberId: string };
  UploadProgress: { memberId: string };
  PTSessionDetail: { sessionId: string };
  SessionNotes: { sessionId: string };
  PTCalendar: undefined;
  Notifications: undefined;
};
