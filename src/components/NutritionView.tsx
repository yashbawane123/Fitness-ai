import React, { useState } from 'react';
import { Apple, Plus, Trash2, Flame, Beef, Wheat, Droplets, Sparkles, Check, ChevronLeft, ChevronRight, GlassWater } from 'lucide-react';
import { DailyNutrition, NutritionItem, UserProfile, MealType } from '../types';

interface NutritionViewProps {
  nutrition: DailyNutrition;
  profile: UserProfile;
  onAddItems: (items: NutritionItem[]) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateWater: (amountMl: number) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  nutrition,
  profile,
  onAddItems,
  onDeleteItem,
  onUpdateWater,
  onOpenChatWithPrompt,
}) => {
  const [quickInput, setQuickInput] = useState("");
  const [quickMealType, setQuickMealType] = useState<MealType>("lunch");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual form state
  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState<string>("300");
  const [manualProtein, setManualProtein] = useState<string>("25");
  const [manualCarbs, setManualCarbs] = useState<string>("30");
  const [manualFat, setManualFat] = useState<string>("10");

  const totalCalories = nutrition.items.reduce((acc, i) => acc + (i.calories || 0), 0);
  const totalProtein = nutrition.items.reduce((acc, i) => acc + (i.protein || 0), 0);
  const totalCarbs = nutrition.items.reduce((acc, i) => acc + (i.carbs || 0), 0);
  const totalFat = nutrition.items.reduce((acc, i) => acc + (i.fat || 0), 0);

  const caloriesRemaining = Math.max(0, profile.targetCalories - totalCalories);
  const caloriesPercent = Math.min(100, Math.round((totalCalories / profile.targetCalories) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((totalProtein / profile.targetProtein) * 100)) || 0;
  const carbsPercent = Math.min(100, Math.round((totalCarbs / profile.targetCarbs) * 100)) || 0;
  const fatPercent = Math.min(100, Math.round((totalFat / profile.targetFat) * 100)) || 0;
  const waterPercent = Math.min(100, Math.round((nutrition.waterMl / profile.waterGoalMl) * 100)) || 0;

  const handleQuickEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/nutrition/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: quickInput }),
      });
      const data = await res.json();

      const newItem: NutritionItem = {
        id: `food_${Date.now()}`,
        name: data.name || quickInput,
        mealType: quickMealType,
        calories: Number(data.calories) || 250,
        protein: Number(data.protein) || 20,
        carbs: Number(data.carbs) || 25,
        fat: Number(data.fat) || 8,
        servingSize: data.servingSize || "1 portion",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onAddItems([newItem]);
      setQuickInput("");
    } catch (err) {
      console.error(err);
      // Fallback manual item
      const fallbackItem: NutritionItem = {
        id: `food_${Date.now()}`,
        name: quickInput,
        mealType: quickMealType,
        calories: 350,
        protein: 25,
        carbs: 35,
        fat: 12,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onAddItems([fallbackItem]);
      setQuickInput("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const newItem: NutritionItem = {
      id: `food_${Date.now()}`,
      name: manualName.trim(),
      mealType: quickMealType,
      calories: Math.max(0, parseInt(manualCalories) || 0),
      protein: Math.max(0, parseInt(manualProtein) || 0),
      carbs: Math.max(0, parseInt(manualCarbs) || 0),
      fat: Math.max(0, parseInt(manualFat) || 0),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onAddItems([newItem]);
    setManualName("");
    setShowManualForm(false);
  };

  const mealCategories: { type: MealType; title: string; icon: string }[] = [
    { type: 'breakfast', title: 'Breakfast', icon: '🍳' },
    { type: 'lunch', title: 'Lunch', icon: '🥗' },
    { type: 'dinner', title: 'Dinner', icon: '🍽️' },
    { type: 'snack', title: 'Snacks & Supplements', icon: '🍎' },
  ];

  return (
    <div id="nutrition-view-container" className="flex-1 overflow-y-auto bg-[#0a0d14] text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Apple className="w-4 h-4" />
              <span>Daily Nutritional Intake Tracker</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Today's Fuel & Macros
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time monitoring of calories, macronutrients, and hydration aligned with your goal.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-ai-macro-audit"
              onClick={() => onOpenChatWithPrompt(`Here is my nutritional intake for today: ${totalCalories} kcal (${totalProtein}g protein, ${totalCarbs}g carbs, ${totalFat}g fat) against my goal of ${profile.targetCalories} kcal and ${profile.targetProtein}g protein. Please analyze my macro balance and suggest what I should eat next.`)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              AI Nutrition Coaching Audit
            </button>
          </div>
        </div>

        {/* Macro KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-900/80 border border-amber-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Calories
              </span>
              <span className="text-xs text-slate-400 font-mono">{caloriesRemaining} kcal left</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {totalCalories} <span className="text-sm font-normal text-slate-400">/ {profile.targetCalories} kcal</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${caloriesPercent}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-400">
              <span>{caloriesPercent}% of target</span>
              <span>{caloriesRemaining > 0 ? `${caloriesRemaining} remaining` : 'Target reached!'}</span>
            </div>
          </div>

          {/* Protein Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Beef className="w-4 h-4" /> Protein
              </span>
              <span className="text-xs text-slate-400 font-mono">{Math.max(0, profile.targetProtein - totalProtein)}g left</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {totalProtein}g <span className="text-sm font-normal text-slate-400">/ {profile.targetProtein}g</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-400">
              <span>{proteinPercent}% reached</span>
              <span>Muscle recovery</span>
            </div>
          </div>

          {/* Carbs Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wheat className="w-4 h-4" /> Carbs
              </span>
              <span className="text-xs text-slate-400 font-mono">{Math.max(0, profile.targetCarbs - totalCarbs)}g left</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {totalCarbs}g <span className="text-sm font-normal text-slate-400">/ {profile.targetCarbs}g</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-400">
              <span>{carbsPercent}% reached</span>
              <span>Glycogen energy</span>
            </div>
          </div>

          {/* Fat Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4" /> Healthy Fats
              </span>
              <span className="text-xs text-slate-400 font-mono">{Math.max(0, profile.targetFat - totalFat)}g left</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {totalFat}g <span className="text-sm font-normal text-slate-400">/ {profile.targetFat}g</span>
            </div>
            <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${fatPercent}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-400">
              <span>{fatPercent}% reached</span>
              <span>Hormonal health</span>
            </div>
          </div>
        </div>

        {/* Hydration Tracker Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <GlassWater className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Daily Water Hydration
              </span>
              <div className="text-xl font-bold text-white font-mono">
                {nutrition.waterMl} ml <span className="text-sm font-normal text-slate-400">/ {profile.waterGoalMl} ml</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onUpdateWater(250)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900 transition-colors cursor-pointer"
            >
              + 250 ml (Glass)
            </button>
            <button
              onClick={() => onUpdateWater(500)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900 transition-colors cursor-pointer"
            >
              + 500 ml (Bottle)
            </button>
            <button
              onClick={() => onUpdateWater(-250)}
              className="px-2.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              - 250 ml
            </button>
          </div>
        </div>

        {/* Quick Food Log Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Quick AI Food Logging (Natural Language)
            </span>
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              {showManualForm ? "Use AI Quick Input" : "Switch to Manual Form"}
            </button>
          </div>

          {!showManualForm ? (
            <form onSubmit={handleQuickEstimate} className="flex flex-col sm:flex-row items-center gap-2">
              <select
                value={quickMealType}
                onChange={(e) => setQuickMealType(e.target.value as MealType)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>

              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="e.g. 2 boiled eggs with 1 cup of oatmeal and berries..."
                className="flex-1 w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                disabled={!quickInput.trim() || isSubmitting}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  quickInput.trim() && !isSubmitting
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Calculating..." : "Add to Log"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleManualAdd} className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <input
                type="text"
                placeholder="Food name"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="col-span-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
                required
              />
              <input
                type="number"
                placeholder="Calories"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={manualProtein}
                onChange={(e) => setManualProtein(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={manualCarbs}
                onChange={(e) => setManualCarbs(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100"
              />
              <button
                type="submit"
                className="col-span-2 sm:col-span-1 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                Save
              </button>
            </form>
          )}
        </div>

        {/* Categorized Meals Breakdown */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-tight">Today's Meals Breakdown</h3>

          {mealCategories.map((cat) => {
            const items = nutrition.items.filter((i) => i.mealType === cat.type);
            const mealCalories = items.reduce((acc, i) => acc + (i.calories || 0), 0);
            const mealProtein = items.reduce((acc, i) => acc + (i.protein || 0), 0);

            return (
              <div
                key={cat.type}
                className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden"
              >
                <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{cat.icon}</span>
                    <h4 className="text-sm font-bold text-slate-200">{cat.title}</h4>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    <span className="font-semibold text-amber-400">{mealCalories}</span> kcal • <span className="font-semibold text-blue-400">{mealProtein}g</span> protein
                  </div>
                </div>

                <div className="divide-y divide-slate-800/50">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200">{item.name}</span>
                            {item.servingSize && (
                              <span className="text-[11px] text-slate-400">({item.servingSize})</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Logged at {item.timestamp || "Today"}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right shrink-0">
                          <div className="font-mono">
                            <span className="font-bold text-amber-400">{item.calories} kcal</span>
                            <div className="text-[10px] text-slate-400">
                              P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                            </div>
                          </div>

                          <button
                            onClick={() => onDeleteItem(item.id)}
                            title="Delete entry"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500 italic">
                      No foods logged for {cat.title.toLowerCase()} yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
