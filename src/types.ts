export type FitnessGoal = 'fat_loss' | 'muscle_gain' | 'maintenance' | 'endurance' | 'strength';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: FitnessGoal;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  experienceLevel: ExperienceLevel;
  targetCalories: number;
  targetProtein: number; // in grams
  targetCarbs: number; // in grams
  targetFat: number; // in grams
  waterGoalMl: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds?: number;
  targetMuscle?: string;
  notes?: string;
  completed?: boolean;
}

export interface WorkoutDay {
  id: string;
  dayTitle: string;
  focus: string;
  exercises: ExerciseItem[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  splitType?: string;
  daysPerWeek?: number;
  level?: ExperienceLevel;
  days: WorkoutDay[];
  createdAt: string;
}

export interface NutritionItem {
  id: string;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
  timestamp: string;
}

export interface DailyNutrition {
  date: string; // YYYY-MM-DD
  items: NutritionItem[];
  waterMl: number;
}

export interface NutritionLogPayload {
  type: 'NUTRITION_LOG';
  foods: Array<{
    name: string;
    mealType: MealType;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize?: string;
  }>;
  summary?: string;
}

export interface WorkoutPlanPayload {
  type: 'WORKOUT_PLAN';
  workoutPlan: WorkoutPlan;
}

export type ChatActionData = WorkoutPlanPayload | NutritionLogPayload;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionData?: ChatActionData;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}
