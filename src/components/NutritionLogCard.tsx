import React, { useState } from 'react';
import { Apple, Plus, Check, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { NutritionLogPayload, NutritionItem } from '../types';

interface NutritionLogCardProps {
  data: NutritionLogPayload;
  onAddLog: (items: NutritionItem[]) => void;
  isAdded?: boolean;
}

export const NutritionLogCard: React.FC<NutritionLogCardProps> = ({
  data,
  onAddLog,
  isAdded = false,
}) => {
  const [added, setAdded] = useState(isAdded);

  const totalCalories = data.foods.reduce((acc, f) => acc + (f.calories || 0), 0);
  const totalProtein = data.foods.reduce((acc, f) => acc + (f.protein || 0), 0);
  const totalCarbs = data.foods.reduce((acc, f) => acc + (f.carbs || 0), 0);
  const totalFat = data.foods.reduce((acc, f) => acc + (f.fat || 0), 0);

  const handleAdd = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const items: NutritionItem[] = data.foods.map((food, idx) => ({
      id: `food_${Date.now()}_${idx}`,
      name: food.name,
      mealType: food.mealType || 'lunch',
      calories: Math.round(food.calories || 0),
      protein: Math.round(food.protein || 0),
      carbs: Math.round(food.carbs || 0),
      fat: Math.round(food.fat || 0),
      servingSize: food.servingSize,
      timestamp: timeStr,
    }));
    onAddLog(items);
    setAdded(true);
  };

  return (
    <div id="nutrition-log-card" className="my-3 rounded-2xl border border-amber-500/20 bg-slate-900/90 text-slate-100 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/30 p-4 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              AI Nutrition Analysis
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {data.foods.length === 1 ? data.foods[0].name : `${data.foods.length} Food Items Detected`}
            </h3>
          </div>
        </div>

        <button
          id="btn-add-nutrition-log"
          onClick={handleAdd}
          disabled={added}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
            added
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default"
              : "bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-amber-500/20"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Logged to Today
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Log to Daily Tracker
            </>
          )}
        </button>
      </div>

      {/* Foods breakdown */}
      <div className="p-3.5 space-y-2 bg-slate-900/50">
        <div className="space-y-1.5">
          {data.foods.map((food, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs"
            >
              <div>
                <span className="font-semibold text-slate-200">{food.name}</span>
                {food.servingSize && (
                  <span className="ml-2 text-[11px] text-slate-400 font-normal">({food.servingSize})</span>
                )}
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 capitalize">
                  <span className="text-amber-400/90 font-medium">{food.mealType}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <span className="font-bold text-amber-400 text-xs">{food.calories} kcal</span>
                <span className="text-slate-400 text-[10px]">
                  P: <strong className="text-slate-200">{food.protein}g</strong> • C: <strong className="text-slate-200">{food.carbs}g</strong> • F: <strong className="text-slate-200">{food.fat}g</strong>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary Row */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <Flame className="w-3.5 h-3.5" /> {totalCalories} kcal Total
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1">
              <Beef className="w-3.5 h-3.5 text-blue-400" /> {totalProtein}g Protein
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5 text-emerald-400" /> {totalCarbs}g Carbs
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-rose-400" /> {totalFat}g Fat
            </span>
          </div>

          {data.summary && (
            <span className="text-[11px] text-slate-400 italic hidden sm:inline">
              {data.summary}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
