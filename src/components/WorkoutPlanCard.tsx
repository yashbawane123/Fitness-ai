import React, { useState } from 'react';
import { Dumbbell, Calendar, Check, ArrowRight, Flame, Layers } from 'lucide-react';
import { WorkoutPlan } from '../types';

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  onSavePlan: (plan: WorkoutPlan) => void;
  isSaved?: boolean;
}

export const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({
  plan,
  onSavePlan,
  isSaved = false,
}) => {
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);
  const [savedLocally, setSavedLocally] = useState<boolean>(isSaved);

  const handleSave = () => {
    onSavePlan(plan);
    setSavedLocally(true);
  };

  const currentDay = plan.days?.[activeDayIdx] || plan.days?.[0];

  return (
    <div id={`workout-plan-card-${plan.id}`} className="my-3 rounded-2xl border border-emerald-500/20 bg-slate-900/90 text-slate-100 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/40 p-4 border-b border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {plan.splitType || "Workout Split"}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-400">{plan.level || "Custom"}</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{plan.title}</h3>
            </div>
          </div>

          <button
            id={`btn-save-workout-${plan.id}`}
            onClick={handleSave}
            disabled={savedLocally}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              savedLocally
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-emerald-500/20"
            }`}
          >
            {savedLocally ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Active Plan
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5" />
                Save to My Workouts
              </>
            )}
          </button>
        </div>

        {plan.description && (
          <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {plan.description}
          </p>
        )}
      </div>

      {/* Days Tabs */}
      {plan.days && plan.days.length > 0 && (
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto scrollbar-none px-2 pt-1 gap-1">
          {plan.days.map((day, idx) => (
            <button
              key={day.id || idx}
              id={`tab-day-${idx}-${plan.id}`}
              onClick={() => setActiveDayIdx(idx)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded-t-lg transition-colors border-b-2 ${
                activeDayIdx === idx
                  ? "border-emerald-400 text-emerald-400 bg-slate-800/60 font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              Day {idx + 1}: {day.dayTitle?.replace(/^Day\s*\d+\s*[-:]\s*/i, '') || `Day ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Exercises List */}
      {currentDay && (
        <div className="p-4 space-y-2.5 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800/50">
            <span className="font-medium text-slate-300">{currentDay.focus || currentDay.dayTitle}</span>
            <span className="text-slate-400">{currentDay.exercises?.length || 0} exercises</span>
          </div>

          <div className="space-y-2">
            {currentDay.exercises?.map((ex, exIdx) => (
              <div
                key={ex.id || exIdx}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700/70 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                      {exIdx + 1}
                    </span>
                    <h4 className="font-semibold text-slate-100 text-sm">{ex.name}</h4>
                  </div>
                  {ex.targetMuscle && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                      {ex.targetMuscle}
                    </span>
                  )}
                  {ex.notes && (
                    <p className="mt-1 text-slate-400 text-[11px] italic">
                      Tip: {ex.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-right shrink-0">
                  <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700/60 font-mono text-slate-200">
                    <span className="font-bold text-emerald-400">{ex.sets}</span> sets × <span className="font-bold text-emerald-400">{ex.reps}</span>
                  </div>
                  {ex.restSeconds ? (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {ex.restSeconds}s rest
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
