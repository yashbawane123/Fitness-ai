import React, { useState, useEffect } from 'react';
import { Menu, Dumbbell, Apple, MessageSquare, Bot, User, Sparkles } from 'lucide-react';
import {
  UserProfile,
  WorkoutPlan,
  DailyNutrition,
  ChatSession,
  ChatMessage,
  NutritionItem,
} from './types';
import {
  loadProfile,
  saveProfile,
  loadWorkoutPlans,
  saveWorkoutPlans,
  loadActivePlanId,
  saveActivePlanId,
  loadDailyNutrition,
  saveDailyNutrition,
  loadChatSessions,
  saveChatSessions,
  getTodayKey,
} from './lib/storage';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { WorkoutsView } from './components/WorkoutsView';
import { NutritionView } from './components/NutritionView';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(loadWorkoutPlans);
  const [activePlanId, setActivePlanId] = useState<string>(loadActivePlanId);
  const [todayNutrition, setTodayNutrition] = useState<DailyNutrition>(() =>
    loadDailyNutrition(getTodayKey())
  );
  const [sessions, setSessions] = useState<ChatSession[]>(loadChatSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const loaded = loadChatSessions();
    return loaded[0]?.id || 'initial_session';
  });

  const [activeTab, setActiveTab] = useState<'chat' | 'workouts' | 'nutrition'>('chat');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Sync state with storage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveWorkoutPlans(workoutPlans);
  }, [workoutPlans]);

  useEffect(() => {
    saveActivePlanId(activePlanId);
  }, [activePlanId]);

  useEffect(() => {
    saveDailyNutrition(todayNutrition);
  }, [todayNutrition]);

  useEffect(() => {
    saveChatSessions(sessions);
  }, [sessions]);

  // Derived active objects
  const activePlan = workoutPlans.find((p) => p.id === activePlanId) || workoutPlans[0] || null;
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Send message to FitCoach AI backend
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append to current session immediately
    const updatedMessages = [...(currentSession?.messages || []), userMessage];
    const updatedSessions = sessions.map((sess) => {
      if (sess.id === (currentSession?.id || activeSessionId)) {
        return {
          ...sess,
          // Update title from first user query if still generic
          title:
            sess.messages.length <= 1
              ? text.slice(0, 32) + (text.length > 32 ? '...' : '')
              : sess.title,
          messages: updatedMessages,
        };
      }
      return sess;
    });
    setSessions(updatedSessions);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          profile,
          todayNutrition,
          activeWorkoutPlan: activePlan,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I've processed your fitness request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionData: data.actionData,
      };

      setSessions((prev) =>
        prev.map((sess) => {
          if (sess.id === (currentSession?.id || activeSessionId)) {
            return {
              ...sess,
              messages: [...sess.messages, assistantMessage],
            };
          }
          return sess;
        })
      );
    } catch (err) {
      console.error('Failed to communicate with FitCoach AI:', err);
      const fallbackMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content:
          "I'm currently running in local mode. Please ensure the server connection is active. How else can I assist with your workouts or nutrition today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setSessions((prev) =>
        prev.map((sess) => {
          if (sess.id === (currentSession?.id || activeSessionId)) {
            return {
              ...sess,
              messages: [...sess.messages, fallbackMessage],
            };
          }
          return sess;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Action: Save workout plan
  const handleSaveWorkoutPlan = (newPlan: WorkoutPlan) => {
    // Check if already in library
    const exists = workoutPlans.some((p) => p.id === newPlan.id);
    if (!exists) {
      setWorkoutPlans((prev) => [newPlan, ...prev]);
    }
    setActivePlanId(newPlan.id);
  };

  // Action: Add nutrition log items
  const handleAddNutritionLog = (items: NutritionItem[]) => {
    setTodayNutrition((prev) => ({
      ...prev,
      items: [...prev.items, ...items],
    }));
  };

  // Action: Delete nutrition item
  const handleDeleteNutritionItem = (itemId: string) => {
    setTodayNutrition((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
    }));
  };

  // Action: Update water
  const handleUpdateWater = (amountMl: number) => {
    setTodayNutrition((prev) => ({
      ...prev,
      waterMl: Math.max(0, prev.waterMl + amountMl),
    }));
  };

  // Action: New Chat Session
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: 'New Fitness Chat',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          role: 'assistant',
          content: `Hi ${profile.name}! I'm ready to craft your next workout plan, estimate meal calories & macros, or answer any training question. What shall we tackle?`,
          timestamp: 'Just now',
        },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // Action: Reset current chat messages
  const handleClearSession = () => {
    if (!currentSession) return;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSession.id) {
          return {
            ...s,
            messages: [
              {
                id: `msg_clear_${Date.now()}`,
                role: 'assistant',
                content: `Chat history reset. How can I help you achieve your ${profile.goal.replace('_', ' ')} goals today?`,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return s;
      })
    );
  };

  // Switch to chat tab with prefilled message
  const handleOpenChatWithPrompt = (prompt: string) => {
    setActiveTab('chat');
    handleSendMessage(prompt);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0d14] overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        todayNutrition={todayNutrition}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-14 border-b border-slate-800 px-4 flex md:hidden items-center justify-between bg-slate-950 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 font-bold text-sm text-white">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>FitCoach AI</span>
            </div>
          </div>

          {/* Quick tab toggle on mobile */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`p-1.5 rounded-lg text-xs ${
                activeTab === 'chat' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className={`p-1.5 rounded-lg text-xs ${
                activeTab === 'workouts' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`p-1.5 rounded-lg text-xs ${
                activeTab === 'nutrition' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* View Switcher */}
        {activeTab === 'chat' && (
          <ChatView
            messages={currentSession?.messages || []}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onSaveWorkoutPlan={handleSaveWorkoutPlan}
            onAddNutritionLog={handleAddNutritionLog}
            onClearSession={handleClearSession}
            profile={profile}
            todayNutrition={todayNutrition}
            activeWorkoutPlan={activePlan}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsView
            activePlan={activePlan}
            savedPlans={workoutPlans}
            onSelectPlan={(id) => setActivePlanId(id)}
            onOpenChatWithPrompt={handleOpenChatWithPrompt}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionView
            nutrition={todayNutrition}
            profile={profile}
            onAddItems={handleAddNutritionLog}
            onDeleteItem={handleDeleteNutritionItem}
            onUpdateWater={handleUpdateWater}
            onOpenChatWithPrompt={handleOpenChatWithPrompt}
          />
        )}
      </div>

      {/* User Profile & Macro Configuration Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
      />
    </div>
  );
}
