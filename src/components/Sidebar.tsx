import React from 'react';
import { Bot, MessageSquare, Dumbbell, Apple, Plus, Settings, Flame, GlassWater, ChevronRight, X } from 'lucide-react';
import { ChatSession, UserProfile, DailyNutrition } from '../types';

interface SidebarProps {
  activeTab: 'chat' | 'workouts' | 'nutrition';
  setActiveTab: (tab: 'chat' | 'workouts' | 'nutrition') => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  todayNutrition: DailyNutrition;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  profile,
  onOpenProfile,
  todayNutrition,
  isOpenMobile,
  onCloseMobile,
}) => {
  const totalCalories = todayNutrition.items.reduce((s, i) => s + (i.calories || 0), 0);
  const totalProtein = todayNutrition.items.reduce((s, i) => s + (i.protein || 0), 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#0d1117] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                FitCoach <span className="text-emerald-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">ChatGPT for Fitness & Nutrition</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white md:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Tab Navigation */}
        <div className="p-3 border-b border-slate-800/60 space-y-1">
          <button
            id="nav-tab-chat"
            onClick={() => {
              setActiveTab('chat');
              onCloseMobile();
            }}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'chat'
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Coach Chat</span>
          </button>

          <button
            id="nav-tab-workouts"
            onClick={() => {
              setActiveTab('workouts');
              onCloseMobile();
            }}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'workouts'
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>My Workout Plans</span>
          </button>

          <button
            id="nav-tab-nutrition"
            onClick={() => {
              setActiveTab('nutrition');
              onCloseMobile();
            }}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'nutrition'
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>Daily Nutrition Tracker</span>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            id="btn-new-chat-session"
            onClick={() => {
              onNewChat();
              setActiveTab('chat');
              onCloseMobile();
            }}
            className="w-full px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New Consultation</span>
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
            Recent Conversations
          </div>

          {sessions.map((sess) => (
            <button
              key={sess.id}
              onClick={() => {
                onSelectSession(sess.id);
                setActiveTab('chat');
                onCloseMobile();
              }}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs truncate transition-colors flex items-center gap-2 cursor-pointer ${
                activeSessionId === sess.id && activeTab === 'chat'
                  ? "bg-slate-800 text-emerald-400 font-semibold border border-slate-700/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span className="truncate">{sess.title}</span>
            </button>
          ))}
        </div>

        {/* Today's Mini Stats Card */}
        <div className="p-3 mx-3 mb-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
            <span>Today's Progress</span>
            <span className="text-emerald-400 capitalize">{profile.goal.replace('_', ' ')}</span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" /> Calories
                </span>
                <span className="font-mono text-slate-200">
                  {totalCalories} / {profile.targetCalories}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-amber-400 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((totalCalories / profile.targetCalories) * 100))}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <GlassWater className="w-3 h-3 text-cyan-400" /> Hydration
                </span>
                <span className="font-mono text-slate-200">
                  {todayNutrition.waterMl} / {profile.waterGoalMl} ml
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-cyan-400 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((todayNutrition.waterMl / profile.waterGoalMl) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Bar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0">
          <button
            id="btn-open-profile"
            onClick={onOpenProfile}
            className="w-full p-2 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center">
                {profile.name?.slice(0, 2).toUpperCase() || "AL"}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                  {profile.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {profile.weightKg}kg • {profile.targetProtein}g Protein Target
                </div>
              </div>
            </div>

            <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </button>
        </div>
      </aside>
    </>
  );
};
