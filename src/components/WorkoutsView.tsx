import React, { useState, useEffect } from 'react';
import { Dumbbell, Calendar, Play, Pause, RotateCcw, Check, Plus, Sparkles, Layers, ChevronRight, Timer, Info } from 'lucide-react';
import { WorkoutPlan, WorkoutDay, ExerciseItem } from '../types';

interface WorkoutsViewProps {
  activePlan: WorkoutPlan | null;
  savedPlans: WorkoutPlan[];
  onSelectPlan: (planId: string) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  activePlan,
  savedPlans,
  onSelectPlan,
  onOpenChatWithPrompt,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(90);
  const [timerRemaining, setTimerRemaining] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play brief audio chime if supported
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // audio context fallback
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemaining]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (seconds?: number) => {
    const s = seconds ?? timerSeconds;
    setIsTimerRunning(false);
    setTimerRemaining(s);
    if (seconds) setTimerSeconds(seconds);
  };

  const toggleSetCompleted = (key: string) => {
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const currentDay = activePlan?.days?.[selectedDayIdx] || activePlan?.days?.[0];

  return (
    <div id="workouts-view-container" className="flex-1 overflow-y-auto bg-[#0a0d14] text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Dumbbell className="w-4 h-4" />
              <span>Personalized Workout System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {activePlan?.title || "My Workout Plan"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {activePlan?.description || "Follow your customized split with progressive overload cues & rest timers."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="btn-ai-modify-workout"
              onClick={() => onOpenChatWithPrompt(`I would like to modify my active workout plan "${activePlan?.title || 'current plan'}". Please suggest modifications to make it more challenging or adjust exercises.`)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Ask AI to Modify Plan
            </button>
          </div>
        </div>

        {/* Rest Timer Widget */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
              isTimerRunning ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse" : "bg-slate-800 text-slate-400"
            }`}>
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Set Rest Interval
              </span>
              <div className="text-2xl font-mono font-bold text-white">
                {Math.floor(timerRemaining / 60)}:
                {String(timerRemaining % 60).padStart(2, "0")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[45, 60, 90, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => resetTimer(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  timerSeconds === sec
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {sec}s
              </button>
            ))}

            <button
              id="btn-toggle-rest-timer"
              onClick={toggleTimer}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isTimerRunning
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isTimerRunning ? "Pause" : "Start Timer"}
            </button>

            <button
              onClick={() => resetTimer()}
              title="Reset timer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Days Selector Tabs */}
        {activePlan?.days && activePlan.days.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
              {activePlan.days.map((day, idx) => (
                <button
                  key={day.id || idx}
                  id={`workout-day-tab-${idx}`}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    selectedDayIdx === idx
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{day.dayTitle || `Day ${idx + 1}`}</span>
                </button>
              ))}
            </div>

            {/* Current Day Detail */}
            {currentDay && (
              <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      {currentDay.dayTitle}
                    </h2>
                    <p className="text-xs text-emerald-400 mt-0.5 font-medium">
                      Focus: {currentDay.focus}
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg">
                    {currentDay.exercises?.length || 0} Movements
                  </div>
                </div>

                {/* Exercises Checklist */}
                <div className="space-y-3">
                  {currentDay.exercises?.map((exercise, exIdx) => (
                    <div
                      key={exercise.id || exIdx}
                      id={`exercise-card-${exIdx}`}
                      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-200 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                            {exIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                              {exercise.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {exercise.targetMuscle && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                                  {exercise.targetMuscle}
                                </span>
                              )}
                              <span className="text-xs text-slate-400 font-mono">
                                Rest: {exercise.restSeconds || 90}s
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:self-center">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                            {exercise.sets} Sets × {exercise.reps} Reps
                          </span>
                        </div>
                      </div>

                      {exercise.notes && (
                        <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg flex items-start gap-2 border border-slate-800/70">
                          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong className="text-slate-200">Execution Tip:</strong> {exercise.notes}</span>
                        </div>
                      )}

                      {/* Interactive Set Checkboxes */}
                      <div className="pt-2 border-t border-slate-750 flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-slate-400 font-medium">Log Sets:</span>
                        {Array.from({ length: exercise.sets || 3 }).map((_, setIdx) => {
                          const setKey = `${currentDay.id}_${exercise.id}_set_${setIdx + 1}`;
                          const isDone = completedSets[setKey];

                          return (
                            <button
                              key={setIdx}
                              onClick={() => toggleSetCompleted(setKey)}
                              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                                isDone
                                  ? "bg-emerald-600 text-white font-bold"
                                  : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500"
                              }`}
                            >
                              <Check className={`w-3 h-3 ${isDone ? "opacity-100" : "opacity-30"}`} />
                              Set {setIdx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
            <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200">No Active Workout Plan</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Ask FitCoach AI to generate a custom routine tailored to your fitness level, split, and equipment.
            </p>
            <button
              onClick={() => onOpenChatWithPrompt("Generate a 3-day full body workout plan for muscle gain")}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer"
            >
              Generate Plan with AI
            </button>
          </div>
        )}

        {/* Saved Plans Library */}
        {savedPlans.length > 1 && (
          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Saved Workout Programs ({savedPlans.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    plan.id === activePlan?.id
                      ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                      : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-white">{plan.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {plan.splitType || "Split"} • {plan.days?.length || 0} Days/week
                    </p>
                  </div>

                  {plan.id !== activePlan?.id ? (
                    <button
                      onClick={() => onSelectPlan(plan.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    >
                      Make Active
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
