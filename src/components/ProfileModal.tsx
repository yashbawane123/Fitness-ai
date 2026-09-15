import React, { useState } from 'react';
import { X, Sparkles, User, Dumbbell, Flame, Check } from 'lucide-react';
import { UserProfile, FitnessGoal, ExperienceLevel } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [form, setForm] = useState<UserProfile>({ ...profile });
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAutoCalculate = () => {
    // Standard sports science recommendation:
    // BMR estimate using Mifflin-St Jeor: 10 * weight + 6.25 * height - 5 * age + 5
    const bmr = 10 * form.weightKg + 6.25 * form.heightCm - 5 * form.age + 5;
    const activityMults: Record<string, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
    };
    const tdee = Math.round(bmr * (activityMults[form.activityLevel] || 1.5));

    let targetCals = tdee;
    if (form.goal === 'fat_loss') targetCals = Math.round(tdee - 450); // deficit
    else if (form.goal === 'muscle_gain') targetCals = Math.round(tdee + 300); // slight surplus
    else if (form.goal === 'strength') targetCals = Math.round(tdee + 150);

    // Protein: ~2.0g to 2.2g per kg bodyweight
    const proteinGrams = Math.round(form.weightKg * 2.1);
    const fatGrams = Math.round((targetCals * 0.25) / 9); // 25% calories from fat
    const carbCals = targetCals - (proteinGrams * 4 + fatGrams * 9);
    const carbGrams = Math.max(80, Math.round(carbCals / 4));

    setForm({
      ...form,
      targetCalories: targetCals,
      targetProtein: proteinGrams,
      targetCarbs: carbGrams,
      targetFat: fatGrams,
      waterGoalMl: Math.round(form.weightKg * 38),
    });

    setNotification("Calculated evidence-based calories and macronutrients for your profile!");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f141e] border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Fitness Profile & Macro Targets</h2>
              <p className="text-xs text-slate-400">Used by FitCoach AI to personalize workout intensity and meal recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Core Stats */}
          <div>
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block mb-2">
              Personal Metrics
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Goal & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Primary Goal</label>
              <select
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value as FitnessGoal })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
              >
                <option value="muscle_gain">Build Lean Muscle (Hypertrophy)</option>
                <option value="fat_loss">Fat Loss & Leaning Out</option>
                <option value="strength">Maximum Strength & Power</option>
                <option value="maintenance">Body Recomposition / Maintenance</option>
                <option value="endurance">Cardiovascular & Muscular Endurance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Activity Level</label>
              <select
                value={form.activityLevel}
                onChange={(e) => setForm({ ...form, activityLevel: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100"
              >
                <option value="sedentary">Sedentary (Desk job, little exercise)</option>
                <option value="lightly_active">Lightly Active (1-3 gym days/wk)</option>
                <option value="moderately_active">Moderately Active (3-5 intense gym days/wk)</option>
                <option value="very_active">Very Active (6-7 days/wk or heavy physical job)</option>
              </select>
            </div>
          </div>

          {/* Macro Targets with AI Calculator Button */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Daily Calorie & Macro Targets
              </span>
              <button
                type="button"
                onClick={handleAutoCalculate}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Calculate Optimal Targets
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={form.targetCalories}
                  onChange={(e) => setForm({ ...form, targetCalories: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-100 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={form.targetProtein}
                  onChange={(e) => setForm({ ...form, targetProtein: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-100 font-mono font-bold text-blue-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={form.targetCarbs}
                  onChange={(e) => setForm({ ...form, targetCarbs: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-100 font-mono font-bold text-emerald-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={form.targetFat}
                  onChange={(e) => setForm({ ...form, targetFat: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-100 font-mono font-bold text-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Hydration Goal (ml)</label>
              <input
                type="number"
                value={form.waterGoalMl}
                onChange={(e) => setForm({ ...form, waterGoalMl: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-slate-950 font-bold bg-emerald-500 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Save Profile & Goals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
