import { UserProfile, WorkoutPlan, DailyNutrition, ChatSession } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  name: "Alex",
  age: 26,
  weightKg: 74,
  heightCm: 178,
  goal: "muscle_gain",
  activityLevel: "moderately_active",
  experienceLevel: "intermediate",
  targetCalories: 2400,
  targetProtein: 165,
  targetCarbs: 260,
  targetFat: 75,
  waterGoalMl: 3000,
};

export const DEFAULT_WORKOUT_PLAN: WorkoutPlan = {
  id: "default_plan_1",
  title: "Hypertrophy Push / Pull / Legs Split",
  description: "Evidence-based 3-day split engineered for balanced upper/lower muscle development and progressive overload.",
  splitType: "Push / Pull / Legs",
  daysPerWeek: 3,
  level: "intermediate",
  createdAt: new Date().toISOString(),
  days: [
    {
      id: "day_1",
      dayTitle: "Day 1 - Push Hypertrophy",
      focus: "Chest, Anterior Deltoids, Triceps",
      exercises: [
        { id: "e1_1", name: "Incline Dumbbell Bench Press", sets: 4, reps: "8-10", restSeconds: 90, targetMuscle: "Upper Chest", notes: "30-degree incline, control the 3s descent" },
        { id: "e1_2", name: "Flat Barbell Bench Press", sets: 3, reps: "6-8", restSeconds: 120, targetMuscle: "Mid/Lower Chest", notes: "Arch moderately, retract scapulae" },
        { id: "e1_3", name: "Standing Dumbbell Lateral Raise", sets: 4, reps: "12-15", restSeconds: 60, targetMuscle: "Side Delts", notes: "Lead with elbows, slight forward tilt" },
        { id: "e1_4", name: "Cable Tricep Rope Pushdown", sets: 3, reps: "10-12", restSeconds: 60, targetMuscle: "Triceps Lateral Head", notes: "Flare ropes outward at peak contraction" },
        { id: "e1_5", name: "Overhead Dumbbell Extension", sets: 3, reps: "10-12", restSeconds: 60, targetMuscle: "Triceps Long Head", notes: "Deep stretch at bottom without elbow flaring" },
      ],
    },
    {
      id: "day_2",
      dayTitle: "Day 2 - Pull Hypertrophy",
      focus: "Lats, Rhomboids, Rear Delts, Biceps",
      exercises: [
        { id: "e2_1", name: "Neutral Grip Lat Pulldown", sets: 4, reps: "8-10", restSeconds: 90, targetMuscle: "Lats", notes: "Drive elbows into back pockets" },
        { id: "e2_2", name: "Chest-Supported Dumbbell Row", sets: 3, reps: "10-12", restSeconds: 90, targetMuscle: "Mid Back & Rhomboids", notes: "Pause 1 sec at peak squeeze" },
        { id: "e2_3", name: "Face Pulls with Cable Rope", sets: 4, reps: "15-20", restSeconds: 60, targetMuscle: "Rear Deltoids & Rotator Cuff", notes: "Pull towards eyes with external rotation" },
        { id: "e2_4", name: "Incline Dumbbell Bicep Curl", sets: 3, reps: "10-12", restSeconds: 60, targetMuscle: "Biceps Long Head", notes: "Keep upper arms fixed behind torso" },
        { id: "e2_5", name: "Hammer Curls", sets: 3, reps: "10-12", restSeconds: 60, targetMuscle: "Brachialis & Forearms", notes: "Maintain neutral wrist grip" },
      ],
    },
    {
      id: "day_3",
      dayTitle: "Day 3 - Legs & Core Foundations",
      focus: "Quadriceps, Hamstrings, Glutes, Calves, Core",
      exercises: [
        { id: "e3_1", name: "Barbell Back Squat", sets: 4, reps: "6-8", restSeconds: 120, targetMuscle: "Quads & Glutes", notes: "Hit parallel depth, push knees out over toes" },
        { id: "e3_2", name: "Romanian Deadlift (RDL)", sets: 3, reps: "8-10", restSeconds: 90, targetMuscle: "Hamstrings & Gluteus Maximus", notes: "Push hips straight back, soft knee bend" },
        { id: "e3_3", name: "Bulgarian Split Squat", sets: 3, reps: "10 per leg", restSeconds: 90, targetMuscle: "Quads & Glute Medius", notes: "Elevate rear foot on bench, upright torso" },
        { id: "e3_4", name: "Standing Calf Raises", sets: 4, reps: "15", restSeconds: 45, targetMuscle: "Gastrocnemius", notes: "2-second pause at full stretch" },
        { id: "e3_5", name: "Hanging Leg Raises", sets: 3, reps: "12-15", restSeconds: 60, targetMuscle: "Rectus Abdominis", notes: "Curl pelvis upward, minimize momentum" },
      ],
    },
  ],
};

export const getTodayKey = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_TODAY_NUTRITION: DailyNutrition = {
  date: getTodayKey(),
  waterMl: 1750,
  items: [
    {
      id: "nut_1",
      name: "3 Scrambled Eggs & Avocado Toast",
      mealType: "breakfast",
      calories: 480,
      protein: 26,
      carbs: 34,
      fat: 28,
      servingSize: "3 eggs + 1 sourdough slice + 1/2 avocado",
      timestamp: "08:15 AM",
    },
    {
      id: "nut_2",
      name: "Whey Protein Shake with Greek Yogurt & Banana",
      mealType: "snack",
      calories: 340,
      protein: 42,
      carbs: 38,
      fat: 3,
      servingSize: "1 scoop whey + 150g yogurt + 1 banana",
      timestamp: "11:00 AM",
    },
    {
      id: "nut_3",
      name: "Grilled Chicken Breast with Brown Rice & Broccoli",
      mealType: "lunch",
      calories: 560,
      protein: 52,
      carbs: 62,
      fat: 10,
      servingSize: "200g chicken + 1 cup rice + 100g broccoli",
      timestamp: "01:30 PM",
    },
  ],
};

const STORAGE_KEYS = {
  PROFILE: "fitcoach_profile_v1",
  WORKOUT_PLANS: "fitcoach_workout_plans_v1",
  ACTIVE_PLAN_ID: "fitcoach_active_plan_id_v1",
  NUTRITION_LOGS: "fitcoach_nutrition_logs_v1",
  CHAT_SESSIONS: "fitcoach_chat_sessions_v1",
  ACTIVE_SESSION_ID: "fitcoach_active_session_id_v1",
};

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }
}

export function loadWorkoutPlans(): WorkoutPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUT_PLANS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [DEFAULT_WORKOUT_PLAN];
}

export function saveWorkoutPlans(plans: WorkoutPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUT_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error(e);
  }
}

export function loadActivePlanId(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN_ID);
    if (raw) return raw;
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_WORKOUT_PLAN.id;
}

export function saveActivePlanId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN_ID, id);
  } catch (e) {
    console.error(e);
  }
}

export function loadDailyNutrition(date: string): DailyNutrition {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.NUTRITION_LOGS}_${date}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  if (date === getTodayKey()) {
    return DEFAULT_TODAY_NUTRITION;
  }
  return { date, items: [], waterMl: 0 };
}

export function saveDailyNutrition(data: DailyNutrition): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.NUTRITION_LOGS}_${data.date}`, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export function loadChatSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  
  const initialSession: ChatSession = {
    id: "initial_session",
    title: "Fitness & Nutrition Orientation",
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: "msg_1",
        role: "assistant",
        content: `Hey **Alex**! Welcome to **FitCoach AI** — your personal fitness coach & sports nutritionist inspired by ChatGPT.

I can assist you with:
- 🏋️‍♂️ **Personalized Workout Plans**: Tailored to your split, equipment, injuries, and goals (e.g. Hypertrophy, Fat Loss, Strength).
- 🥗 **Daily Nutrition Tracking**: Simply tell me what you ate (e.g. *"I had a salmon bowl with brown rice & avocado"*), and I'll break down the calories, protein, carbs, and fats to log directly into your dashboard.
- ⏱️ **Workout Execution**: Check off sets, use rest timers, and learn proper biomechanics.

What goal or question should we tackle first today?`,
        timestamp: "Just now",
      },
    ],
  };
  return [initialSession];
}

export function saveChatSessions(sessions: ChatSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error(e);
  }
}
