import {
  User,
  MemberProfile,
  TrainerProfile,
  Membership,
  MembershipPlan,
  Attendance,
  AttendanceStreak,
  WorkoutPlan,
  WorkoutDay,
  Exercise,
  DietPlan,
  PTPackage,
  PTSession,
  BodyMeasurement,
  ProgressPhoto,
  Payment,
  AppNotification,
  Branch,
} from '@/types';

// ─── Branches ─────────────────────────────────────────────────────────────────

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'branch-1',
    name: 'GymOS Indiranagar',
    address: '12th Main, HAL 2nd Stage',
    city: 'Bangalore',
    state: 'Karnataka',
    phone: '+91 98765 43210',
    email: 'indiranagar@gymos.app',
    isActive: true,
    openingTime: '05:30',
    closingTime: '23:00',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'branch-2',
    name: 'GymOS Koramangala',
    address: '80 Feet Road, 6th Block',
    city: 'Bangalore',
    state: 'Karnataka',
    phone: '+91 98765 43211',
    email: 'koramangala@gymos.app',
    isActive: true,
    openingTime: '05:30',
    closingTime: '22:30',
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ─── Users ────────────────────────────────────────────────────────────────────

export const MOCK_MEMBER_USER: User = {
  id: 'user-member-1',
  email: 'member@gymos.app',
  phone: '+91 98765 11111',
  firstName: 'Arjun',
  lastName: 'Sharma',
  role: 'MEMBER',
  isActive: true,
  branchId: 'branch-1',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

export const MOCK_TRAINER_USER: User = {
  id: 'user-trainer-1',
  email: 'trainer@gymos.app',
  phone: '+91 98765 22222',
  firstName: 'Rahul',
  lastName: 'Nair',
  role: 'TRAINER',
  isActive: true,
  branchId: 'branch-1',
  createdAt: '2023-06-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

// ─── Trainer Profile ──────────────────────────────────────────────────────────

export const MOCK_TRAINER_PROFILE: TrainerProfile = {
  id: 'trainer-1',
  userId: 'user-trainer-1',
  user: MOCK_TRAINER_USER,
  specializations: ['Strength Training', 'Body Transformation', 'Sports Conditioning'],
  certifications: ['ACE CPT', 'NASM-CPT', 'Precision Nutrition L1'],
  experience: 7,
  bio: 'Certified personal trainer with 7 years of experience helping clients achieve their body transformation goals. Specializing in strength & hypertrophy programming.',
  branchId: 'branch-1',
  rating: 4.8,
  totalSessions: 1240,
  createdAt: '2023-06-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

// ─── Member Profile ───────────────────────────────────────────────────────────

export const MOCK_MEMBER_PROFILE: MemberProfile = {
  id: 'member-1',
  userId: 'user-member-1',
  user: MOCK_MEMBER_USER,
  memberId: 'GYM-BLR-001247',
  dateOfBirth: '1995-08-14',
  gender: 'MALE',
  height: 178,
  weight: 75,
  fitnessGoal: 'MUSCLE_GAIN',
  healthNotes: 'Mild lower back sensitivity. Avoid heavy deadlifts without proper warm-up.',
  emergencyContact: 'Priya Sharma (Sister)',
  emergencyPhone: '+91 98765 33333',
  qrCode: 'GYM_MEMBER:member-1',
  branchId: 'branch-1',
  trainerId: 'trainer-1',
  trainer: MOCK_TRAINER_PROFILE,
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

// ─── Membership Plan ──────────────────────────────────────────────────────────

export const MOCK_PLAN: MembershipPlan = {
  id: 'plan-premium-1',
  branchId: 'branch-1',
  name: 'Premium Annual',
  type: 'PREMIUM',
  durationDays: 365,
  price: 24000,
  description: 'Full access to all branches with premium benefits',
  features: [
    'All branch access',
    'Unlimited group classes',
    'Locker facility',
    'Body composition analysis',
    'Nutrition consultation',
  ],
  multibranchAccess: true,
  isActive: true,
};

// ─── Membership ───────────────────────────────────────────────────────────────

export const MOCK_MEMBERSHIP: Membership = {
  id: 'membership-1',
  memberId: 'member-1',
  planId: 'plan-premium-1',
  plan: MOCK_PLAN,
  startDate: '2024-01-15',
  endDate: '2025-01-14',
  status: 'ACTIVE',
  totalAmount: 24000,
  paidAmount: 24000,
  payments: [],
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    memberId: 'member-1',
    membershipId: 'membership-1',
    amount: 24000,
    method: 'RAZORPAY',
    status: 'SUCCESS',
    razorpayOrderId: 'order_NxVvKHY1234',
    razorpayPaymentId: 'pay_NxVvKHY5678',
    notes: 'Annual membership - Premium',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'pay-2',
    memberId: 'member-1',
    ptPackageId: 'pt-pkg-1',
    amount: 15000,
    method: 'UPI',
    status: 'SUCCESS',
    notes: 'PT Package - 20 sessions',
    createdAt: '2024-02-01T10:00:00Z',
  },
];

// ─── Attendance ───────────────────────────────────────────────────────────────

const makeAttendance = (daysAgo: number, id: string): Attendance => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const checkIn = new Date(date);
  checkIn.setHours(7, Math.floor(Math.random() * 30), 0);
  const checkOut = new Date(checkIn);
  checkOut.setHours(checkIn.getHours() + 1 + Math.floor(Math.random() * 2), 30, 0);

  return {
    id,
    memberId: 'member-1',
    branchId: 'branch-1',
    branch: MOCK_BRANCHES[0],
    checkInTime: checkIn.toISOString(),
    checkOutTime: checkOut.toISOString(),
    method: 'QR',
    createdAt: checkIn.toISOString(),
  };
};

export const MOCK_ATTENDANCE_HISTORY: Attendance[] = [
  makeAttendance(0, 'att-1'),
  makeAttendance(1, 'att-2'),
  makeAttendance(2, 'att-3'),
  makeAttendance(4, 'att-4'),
  makeAttendance(5, 'att-5'),
  makeAttendance(6, 'att-6'),
  makeAttendance(8, 'att-7'),
  makeAttendance(9, 'att-8'),
  makeAttendance(10, 'att-9'),
  makeAttendance(12, 'att-10'),
  makeAttendance(13, 'att-11'),
  makeAttendance(15, 'att-12'),
];

export const MOCK_ATTENDANCE_STREAK: AttendanceStreak = {
  currentStreak: 3,
  longestStreak: 21,
  totalDays: 142,
  thisWeek: 4,
  thisMonth: 18,
};

// ─── Exercises ────────────────────────────────────────────────────────────────

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Barbell Bench Press',
    muscleGroup: 'CHEST',
    secondaryMuscles: ['TRICEPS', 'SHOULDERS'],
    equipment: ['BARBELL'],
    difficulty: 'INTERMEDIATE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructions: [
      'Lie flat on the bench with eyes under the bar. Plant feet firmly on the floor.',
      'Grip the bar slightly wider than shoulder-width. Unrack and hold the bar directly above your chest.',
      'Lower the bar to your mid-chest in a controlled arc, keeping elbows at roughly 75°.',
      'Press the bar back up explosively to the starting position, squeezing your chest at the top.',
      'Complete all reps before re-racking.',
    ],
    commonMistakes: [
      'Flaring elbows too wide — causes shoulder impingement over time.',
      'Bouncing the bar off the chest — reduces time under tension and risks injury.',
      'Lifting hips off the bench — reduces chest activation and can strain the lower back.',
    ],
    tips: [
      'Retract and depress your scapula before unracking for a stable pressing base.',
      'Initiate the press by driving through your legs and transferring force through your back.',
      'Keep your wrists stacked directly over the bar throughout the movement.',
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex-2',
    name: 'Pull-ups',
    muscleGroup: 'BACK',
    secondaryMuscles: ['BICEPS'],
    equipment: ['BODYWEIGHT'],
    difficulty: 'INTERMEDIATE',
    instructions: [
      'Hang from a bar with hands slightly wider than shoulder-width, palms facing away.',
      'Engage your core and depress your shoulder blades before initiating the pull.',
      'Pull your chest up toward the bar, leading with your elbows.',
      'Lower yourself with control until arms are fully extended.',
    ],
    commonMistakes: [
      'Kipping — uses momentum rather than lat strength.',
      'Shrugging shoulders up instead of depressing them first.',
    ],
    tips: [
      'Think "elbows to hips" rather than "chin to bar" for better lat activation.',
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex-3',
    name: 'Barbell Squat',
    muscleGroup: 'LEGS',
    secondaryMuscles: ['ABS'],
    equipment: ['BARBELL'],
    difficulty: 'INTERMEDIATE',
    instructions: [
      'Position the bar across your upper traps. Step back, feet shoulder-width apart, toes slightly out.',
      'Take a deep breath, brace your core, and sit back and down.',
      'Lower until thighs are parallel to or just below the floor.',
      'Drive through your heels to return to standing.',
    ],
    commonMistakes: [
      'Knees caving inward (valgus collapse).',
      'Heels coming off the floor — work on ankle mobility.',
    ],
    tips: [
      'Imagine "spreading the floor" with your feet to activate your glutes and keep knees out.',
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex-4',
    name: 'Cable Lateral Raise',
    muscleGroup: 'SHOULDERS',
    secondaryMuscles: [],
    equipment: ['CABLE'],
    difficulty: 'BEGINNER',
    instructions: [
      'Set cable pulley to lowest position. Stand with cable on the opposite side.',
      'Raise the arm out to the side until parallel with the floor.',
      'Lower slowly with control. Keep a slight bend in the elbow.',
    ],
    commonMistakes: [
      'Using too much weight and shrugging — loses isolation on the lateral deltoid.',
    ],
    tips: [
      'Lead with your elbow, not your wrist, for better delt activation.',
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex-5',
    name: 'Barbell Curl',
    muscleGroup: 'BICEPS',
    equipment: ['BARBELL'],
    difficulty: 'BEGINNER',
    instructions: [
      'Stand with feet hip-width. Hold the bar at shoulder-width with an underhand grip.',
      'Curl the bar up while keeping elbows pinned at your sides.',
      'Squeeze at the top, then lower with full control.',
    ],
    commonMistakes: [
      'Swinging the torso to generate momentum.',
      'Not fully extending at the bottom — loses range of motion.',
    ],
    tips: ['Supinate (rotate) your wrists slightly at the top for a stronger contraction.'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex-6',
    name: 'Triceps Pushdown',
    muscleGroup: 'TRICEPS',
    equipment: ['CABLE'],
    difficulty: 'BEGINNER',
    instructions: [
      'Set the cable to head height with a straight bar or rope.',
      'Grip the bar, elbows at sides. Push down until arms are fully extended.',
      'Squeeze the triceps at the bottom, then return slowly.',
    ],
    commonMistakes: ['Flaring elbows out, which reduces triceps isolation.'],
    tips: ['Lock your upper arms tight to your torso throughout the movement.'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex-7',
    name: 'Plank',
    muscleGroup: 'ABS',
    equipment: ['BODYWEIGHT'],
    difficulty: 'BEGINNER',
    instructions: [
      'Get into a push-up position, resting on your forearms.',
      'Keep your body in a straight line from head to heels.',
      'Brace your core, squeeze your glutes, and hold.',
    ],
    commonMistakes: [
      'Hips too high or sagging — breaks the straight-line position.',
    ],
    tips: ['Exhale forcefully to increase abdominal tension.'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ex-8',
    name: 'Treadmill Run',
    muscleGroup: 'CARDIO',
    equipment: ['CARDIO_MACHINE'],
    difficulty: 'BEGINNER',
    instructions: [
      'Set speed and incline appropriate for your fitness level.',
      'Maintain upright posture. Swing arms naturally.',
      'Land mid-foot, not heel-striking.',
    ],
    commonMistakes: ['Holding the handrails — reduces caloric burn and effort.'],
    tips: ['Adding 1–2% incline simulates outdoor running resistance.'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ─── Workout Plan ─────────────────────────────────────────────────────────────

export const MOCK_WORKOUT_DAY_TODAY: WorkoutDay = {
  id: 'wday-1',
  day: 'MONDAY',
  name: 'Chest + Triceps',
  isRestDay: false,
  exercises: [
    {
      id: 'we-1',
      exerciseId: 'ex-1',
      exercise: MOCK_EXERCISES[0],
      order: 1,
      notes: 'Start light on warm-up sets',
      sets: [
        { id: 's-1', setNumber: 1, targetReps: 15, targetWeight: 40, restTime: 60, isCompleted: false },
        { id: 's-2', setNumber: 2, targetReps: 12, targetWeight: 60, restTime: 90, isCompleted: false },
        { id: 's-3', setNumber: 3, targetReps: 10, targetWeight: 70, restTime: 90, isCompleted: false },
        { id: 's-4', setNumber: 4, targetReps: 8, targetWeight: 75, restTime: 120, isCompleted: false },
      ],
    },
    {
      id: 'we-2',
      exerciseId: 'ex-6',
      exercise: MOCK_EXERCISES[5],
      order: 2,
      sets: [
        { id: 's-5', setNumber: 1, targetReps: 15, targetWeight: 25, restTime: 60, isCompleted: false },
        { id: 's-6', setNumber: 2, targetReps: 12, targetWeight: 30, restTime: 60, isCompleted: false },
        { id: 's-7', setNumber: 3, targetReps: 12, targetWeight: 30, restTime: 60, isCompleted: false },
      ],
    },
    {
      id: 'we-3',
      exerciseId: 'ex-7',
      exercise: MOCK_EXERCISES[6],
      order: 3,
      sets: [
        { id: 's-8', setNumber: 1, targetDuration: 60, restTime: 30, isCompleted: false },
        { id: 's-9', setNumber: 2, targetDuration: 60, restTime: 30, isCompleted: false },
        { id: 's-10', setNumber: 3, targetDuration: 60, restTime: 30, isCompleted: false },
      ],
    },
  ],
};

export const MOCK_WORKOUT_PLAN: WorkoutPlan = {
  id: 'plan-1',
  name: '4-Day Hypertrophy Split',
  description: 'Designed for maximum muscle growth with progressive overload principles.',
  trainerId: 'trainer-1',
  trainer: MOCK_TRAINER_PROFILE,
  memberId: 'member-1',
  durationWeeks: 12,
  goal: 'MUSCLE_GAIN',
  isTemplate: false,
  isActive: true,
  days: [
    MOCK_WORKOUT_DAY_TODAY,
    {
      id: 'wday-2',
      day: 'TUESDAY',
      name: 'Back + Biceps',
      isRestDay: false,
      exercises: [
        { id: 'we-4', exerciseId: 'ex-2', exercise: MOCK_EXERCISES[1], order: 1,
          sets: [
            { id: 's-11', setNumber: 1, targetReps: 8, restTime: 90, isCompleted: false },
            { id: 's-12', setNumber: 2, targetReps: 8, restTime: 90, isCompleted: false },
            { id: 's-13', setNumber: 3, targetReps: 8, restTime: 90, isCompleted: false },
          ],
        },
        { id: 'we-5', exerciseId: 'ex-5', exercise: MOCK_EXERCISES[4], order: 2,
          sets: [
            { id: 's-14', setNumber: 1, targetReps: 12, targetWeight: 30, restTime: 60, isCompleted: false },
            { id: 's-15', setNumber: 2, targetReps: 10, targetWeight: 35, restTime: 60, isCompleted: false },
            { id: 's-16', setNumber: 3, targetReps: 10, targetWeight: 35, restTime: 60, isCompleted: false },
          ],
        },
      ],
    },
    { id: 'wday-3', day: 'WEDNESDAY', name: 'Rest', isRestDay: true, exercises: [] },
    {
      id: 'wday-4',
      day: 'THURSDAY',
      name: 'Legs',
      isRestDay: false,
      exercises: [
        { id: 'we-6', exerciseId: 'ex-3', exercise: MOCK_EXERCISES[2], order: 1,
          sets: [
            { id: 's-17', setNumber: 1, targetReps: 12, targetWeight: 60, restTime: 120, isCompleted: false },
            { id: 's-18', setNumber: 2, targetReps: 10, targetWeight: 80, restTime: 120, isCompleted: false },
            { id: 's-19', setNumber: 3, targetReps: 8, targetWeight: 90, restTime: 120, isCompleted: false },
            { id: 's-20', setNumber: 4, targetReps: 8, targetWeight: 90, restTime: 120, isCompleted: false },
          ],
        },
      ],
    },
    { id: 'wday-5', day: 'FRIDAY', name: 'Shoulders + Abs', isRestDay: false,
      exercises: [
        { id: 'we-7', exerciseId: 'ex-4', exercise: MOCK_EXERCISES[3], order: 1,
          sets: [
            { id: 's-21', setNumber: 1, targetReps: 15, targetWeight: 8, restTime: 45, isCompleted: false },
            { id: 's-22', setNumber: 2, targetReps: 15, targetWeight: 8, restTime: 45, isCompleted: false },
            { id: 's-23', setNumber: 3, targetReps: 12, targetWeight: 10, restTime: 45, isCompleted: false },
          ],
        },
        { id: 'we-8', exerciseId: 'ex-7', exercise: MOCK_EXERCISES[6], order: 2,
          sets: [
            { id: 's-24', setNumber: 1, targetDuration: 60, restTime: 30, isCompleted: false },
            { id: 's-25', setNumber: 2, targetDuration: 60, restTime: 30, isCompleted: false },
          ],
        },
      ],
    },
    { id: 'wday-6', day: 'SATURDAY', name: 'Cardio', isRestDay: false,
      exercises: [
        { id: 'we-9', exerciseId: 'ex-8', exercise: MOCK_EXERCISES[7], order: 1,
          sets: [
            { id: 's-26', setNumber: 1, targetDuration: 1800, restTime: 0, isCompleted: false },
          ],
        },
      ],
    },
    { id: 'wday-7', day: 'SUNDAY', name: 'Rest', isRestDay: true, exercises: [] },
  ],
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

// ─── Diet Plan ────────────────────────────────────────────────────────────────

export const MOCK_DIET_PLAN: DietPlan = {
  id: 'diet-1',
  name: 'Lean Bulk — 2800 kcal',
  trainerId: 'trainer-1',
  trainer: MOCK_TRAINER_PROFILE,
  memberId: 'member-1',
  targetCalories: 2800,
  targetProtein: 175,
  targetCarbs: 310,
  targetFat: 78,
  notes: 'Focus on hitting protein targets first. Carbs can flex by ±30g depending on training intensity. Drink at least 3L water daily.',
  isActive: true,
  meals: [
    {
      id: 'meal-1',
      type: 'BREAKFAST',
      time: '7:30 AM',
      totalCalories: 580,
      totalProtein: 42,
      totalCarbs: 68,
      totalFat: 14,
      items: [
        { name: 'Oats', quantity: '80g', calories: 300, protein: 10, carbs: 54, fat: 6 },
        { name: 'Whole eggs', quantity: '3 large', calories: 210, protein: 18, carbs: 2, fat: 14 },
        { name: 'Banana', quantity: '1 medium', calories: 90, protein: 1, carbs: 23, fat: 0 },
        { name: 'Whey protein', quantity: '30g scoop', calories: 120, protein: 25, carbs: 3, fat: 1 },
      ],
      notes: 'Have this within 30 minutes of waking.',
    },
    {
      id: 'meal-2',
      type: 'LUNCH',
      time: '1:00 PM',
      totalCalories: 720,
      totalProtein: 55,
      totalCarbs: 80,
      totalFat: 18,
      items: [
        { name: 'Chicken breast', quantity: '200g', calories: 330, protein: 62, carbs: 0, fat: 7 },
        { name: 'Brown rice', quantity: '150g cooked', calories: 195, protein: 4, carbs: 42, fat: 1 },
        { name: 'Mixed vegetables', quantity: '200g', calories: 60, protein: 4, carbs: 12, fat: 0 },
        { name: 'Olive oil', quantity: '1 tbsp', calories: 119, protein: 0, carbs: 0, fat: 13 },
      ],
    },
    {
      id: 'meal-3',
      type: 'SNACKS',
      time: '4:30 PM',
      totalCalories: 310,
      totalProtein: 30,
      totalCarbs: 35,
      totalFat: 6,
      items: [
        { name: 'Greek yogurt', quantity: '200g', calories: 130, protein: 20, carbs: 8, fat: 0 },
        { name: 'Mixed nuts', quantity: '30g', calories: 180, protein: 5, carbs: 6, fat: 16 },
      ],
      notes: 'Pre-workout snack if training in the evening.',
    },
    {
      id: 'meal-4',
      type: 'DINNER',
      time: '8:00 PM',
      totalCalories: 650,
      totalProtein: 48,
      totalCarbs: 65,
      totalFat: 20,
      items: [
        { name: 'Salmon fillet', quantity: '180g', calories: 360, protein: 38, carbs: 0, fat: 22 },
        { name: 'Sweet potato', quantity: '200g', calories: 170, protein: 4, carbs: 40, fat: 0 },
        { name: 'Spinach salad', quantity: '100g', calories: 23, protein: 3, carbs: 4, fat: 0 },
        { name: 'Avocado', quantity: '50g', calories: 80, protein: 1, carbs: 4, fat: 7 },
      ],
    },
  ],
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
};

// ─── PT Package ───────────────────────────────────────────────────────────────

export const MOCK_PT_PACKAGE: PTPackage = {
  id: 'pt-pkg-1',
  memberId: 'member-1',
  trainerId: 'trainer-1',
  trainer: MOCK_TRAINER_PROFILE,
  totalSessions: 20,
  usedSessions: 7,
  remainingSessions: 13,
  pricePerSession: 750,
  totalPrice: 15000,
  startDate: '2024-02-01',
  endDate: '2024-08-31',
  isActive: true,
  createdAt: '2024-02-01T00:00:00Z',
};

// ─── PT Sessions ──────────────────────────────────────────────────────────────

export const MOCK_PT_SESSIONS: PTSession[] = [
  {
    id: 'pts-1',
    ptPackageId: 'pt-pkg-1',
    trainerId: 'trainer-1',
    trainer: MOCK_TRAINER_PROFILE,
    memberId: 'member-1',
    member: MOCK_MEMBER_PROFILE,
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '07:00',
    duration: 60,
    status: 'SCHEDULED',
    createdAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'pts-2',
    ptPackageId: 'pt-pkg-1',
    trainerId: 'trainer-1',
    trainer: MOCK_TRAINER_PROFILE,
    memberId: 'member-1',
    member: MOCK_MEMBER_PROFILE,
    scheduledDate: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().split('T')[0]; })(),
    scheduledTime: '07:00',
    duration: 60,
    status: 'SCHEDULED',
    createdAt: '2024-06-10T00:00:00Z',
  },
  {
    id: 'pts-3',
    ptPackageId: 'pt-pkg-1',
    trainerId: 'trainer-1',
    trainer: MOCK_TRAINER_PROFILE,
    memberId: 'member-1',
    member: MOCK_MEMBER_PROFILE,
    scheduledDate: '2024-06-10',
    scheduledTime: '07:00',
    duration: 60,
    status: 'COMPLETED',
    trainerNotes: 'Great form on squats today. Increased working weight by 5kg. Focus on hip hinge pattern next session.',
    memberRating: 5,
    memberFeedback: 'Best session yet! Really felt the progression.',
    completedAt: '2024-06-10T08:05:00Z',
    createdAt: '2024-06-08T00:00:00Z',
  },
];

// ─── Body Measurements ────────────────────────────────────────────────────────

export const MOCK_MEASUREMENTS: BodyMeasurement[] = [
  { id: 'm-1', memberId: 'member-1', date: '2024-02-01', weight: 79.5, bodyFat: 21, chest: 100, waist: 86, hips: 97, bicepLeft: 35, bicepRight: 35.5, thighLeft: 57, notes: 'Starting measurements', createdAt: '2024-02-01T00:00:00Z' },
  { id: 'm-2', memberId: 'member-1', date: '2024-03-01', weight: 78.2, bodyFat: 20, chest: 101, waist: 84, hips: 96, bicepLeft: 35.5, bicepRight: 36, thighLeft: 57.5, createdAt: '2024-03-01T00:00:00Z' },
  { id: 'm-3', memberId: 'member-1', date: '2024-04-01', weight: 77.0, bodyFat: 18.5, chest: 102, waist: 82, hips: 95, bicepLeft: 36, bicepRight: 36.5, thighLeft: 58, createdAt: '2024-04-01T00:00:00Z' },
  { id: 'm-4', memberId: 'member-1', date: '2024-05-01', weight: 76.1, bodyFat: 17.8, chest: 103, waist: 80, hips: 94, bicepLeft: 36.5, bicepRight: 37, thighLeft: 58.5, createdAt: '2024-05-01T00:00:00Z' },
  { id: 'm-5', memberId: 'member-1', date: '2024-06-01', weight: 75.3, bodyFat: 17.0, chest: 104, waist: 78, hips: 94, bicepLeft: 37, bicepRight: 37.5, thighLeft: 59, notes: 'Great progress!', createdAt: '2024-06-01T00:00:00Z' },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n-1', userId: 'user-member-1', title: 'PT Session Tomorrow! 💪', body: 'Your PT session with Rahul is at 7:00 AM tomorrow. Don\'t forget to warm up!', type: 'PT_REMINDER', isRead: false, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: 'n-2', userId: 'user-member-1', title: 'New diet plan assigned', body: 'Rahul has updated your diet plan. Check out the new macros for this week.', type: 'DIET_UPDATE', isRead: false, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: 'n-3', userId: 'user-member-1', title: 'Payment successful ✓', body: 'Your payment of ₹24,000 for Premium Annual membership has been confirmed.', type: 'PAYMENT_CONFIRMATION', isRead: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 'n-4', userId: 'user-member-1', title: 'Great streak! 🔥', body: 'You\'ve hit a 3-day workout streak. Keep it up!', type: 'WORKOUT_REMINDER', isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'n-5', userId: 'user-member-1', title: 'Progress photo reviewed', body: 'Your trainer has reviewed your latest progress photos and added notes.', type: 'PROGRESS_UPDATE', isRead: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

// ─── Trainer mock members list ────────────────────────────────────────────────

export const MOCK_TRAINER_MEMBERS: MemberProfile[] = [
  MOCK_MEMBER_PROFILE,
  {
    ...MOCK_MEMBER_PROFILE,
    id: 'member-2',
    userId: 'user-member-2',
    memberId: 'GYM-BLR-001248',
    user: {
      ...MOCK_MEMBER_USER,
      id: 'user-member-2',
      firstName: 'Priya',
      lastName: 'Menon',
      email: 'priya@gymos.app',
    },
    weight: 62,
    height: 165,
    gender: 'FEMALE',
    fitnessGoal: 'WEIGHT_LOSS',
  },
  {
    ...MOCK_MEMBER_PROFILE,
    id: 'member-3',
    userId: 'user-member-3',
    memberId: 'GYM-BLR-001249',
    user: {
      ...MOCK_MEMBER_USER,
      id: 'user-member-3',
      firstName: 'Vikram',
      lastName: 'Singh',
      email: 'vikram@gymos.app',
    },
    weight: 88,
    height: 183,
    gender: 'MALE',
    fitnessGoal: 'GENERAL_FITNESS',
  },
];

// ─── Helper to get today's workout day ────────────────────────────────────────

export const getTodayWorkout = (): WorkoutDay | null => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const todayDay = days[new Date().getDay()];
  return MOCK_WORKOUT_PLAN.days.find((d) => d.day === todayDay && !d.isRestDay) ?? null;
};
