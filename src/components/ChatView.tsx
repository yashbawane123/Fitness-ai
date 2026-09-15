import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles, Dumbbell, Apple, Bot, User, RotateCcw, AlertCircle } from 'lucide-react';
import { ChatMessage, UserProfile, DailyNutrition, WorkoutPlan, NutritionItem, ChatActionData } from '../types';
import { WorkoutPlanCard } from './WorkoutPlanCard';
import { NutritionLogCard } from './NutritionLogCard';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onSaveWorkoutPlan: (plan: WorkoutPlan) => void;
  onAddNutritionLog: (items: NutritionItem[]) => void;
  onClearSession: () => void;
  profile: UserProfile;
  todayNutrition: DailyNutrition;
  activeWorkoutPlan: WorkoutPlan | null;
}

const SUGGESTED_PROMPTS = [
  {
    icon: Dumbbell,
    title: "Personalized 4-Day Split",
    prompt: "Create a personalized 4-day Upper/Lower hypertrophy workout plan for me with dumbbell & barbell exercises.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Apple,
    title: "Log High-Protein Lunch",
    prompt: "Log my lunch: Grilled chicken breast (200g), sweet potato (150g), steamed green beans, and a tablespoon of olive oil.",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Sparkles,
    title: "Customized Macro Targets",
    prompt: "Based on my profile and goal, how should I structure my daily calories and protein for optimal muscle gain without excess fat?",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Dumbbell,
    title: "Knee-Friendly Leg Workout",
    prompt: "Design an intense leg workout that minimizes patellar knee stress and focuses on glute & hamstring development.",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSaveWorkoutPlan,
  onAddNutritionLog,
  onClearSession,
  profile,
  todayNutrition,
  activeWorkoutPlan,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  return (
    <div id="chat-view-container" className="flex flex-col h-full bg-[#0a0d14] text-slate-100 relative">
      {/* Top Banner / Session Bar */}
      <div className="h-14 border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between bg-slate-950/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">FitCoach AI</h2>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized Workouts & Daily Nutrition Specialist
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-clear-chat-session"
            onClick={onClearSession}
            title="Clear Chat Conversation"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id || index}
              id={`chat-message-${msg.id || index}`}
              className={`flex gap-3.5 md:gap-4 max-w-4xl mx-auto ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`flex-1 max-w-3xl rounded-2xl p-4 md:p-5 shadow-sm text-sm leading-relaxed ${
                  isUser
                    ? "bg-emerald-600 text-white rounded-tr-sm ml-8 md:ml-16 font-medium"
                    : "bg-slate-900/80 border border-slate-800/90 text-slate-200 rounded-tl-sm"
                }`}
              >
                {/* Markdown content */}
                <div className="prose prose-invert max-w-none text-sm [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1 [&>h3]:text-emerald-400 [&>h3]:font-bold [&>h3]:text-base [&>h3]:mt-3 [&>h3]:mb-1 [&>h2]:text-white [&>h2]:font-bold [&>table]:w-full [&>table]:border-collapse [&>table]:my-2 [&>table]:text-xs [&>th]:bg-slate-800 [&>th]:p-2 [&>td]:p-2 [&>td]:border [&>td]:border-slate-800">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Render interactive action cards if present */}
                {msg.actionData && msg.actionData.type === "WORKOUT_PLAN" && (
                  <WorkoutPlanCard
                    plan={msg.actionData.workoutPlan}
                    onSavePlan={onSaveWorkoutPlan}
                    isSaved={activeWorkoutPlan?.id === msg.actionData.workoutPlan.id}
                  />
                )}

                {msg.actionData && msg.actionData.type === "NUTRITION_LOG" && (
                  <NutritionLogCard
                    data={msg.actionData}
                    onAddLog={onAddNutritionLog}
                  />
                )}

                <div className={`text-[10px] mt-2 pt-1 border-t flex items-center justify-between ${
                  isUser ? "border-emerald-500/40 text-emerald-200" : "border-slate-800/60 text-slate-500"
                }`}>
                  <span>{isUser ? "You" : "FitCoach AI"}</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1 font-semibold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3.5 md:gap-4 max-w-4xl mx-auto justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
              </div>
              <span className="text-xs text-slate-400 font-medium">FitCoach is preparing your plan...</span>
            </div>
          </div>
        )}

        {/* Suggested Starter Prompts if chat is brief */}
        {messages.length <= 2 && (
          <div className="max-w-4xl mx-auto pt-4 pb-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Suggested Consultations
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    id={`btn-suggested-prompt-${idx}`}
                    onClick={() => handlePromptClick(item.prompt)}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-850 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded-lg ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      "{item.prompt}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent border-t border-slate-900 shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Quick Pill shortcuts */}
          <div className="flex items-center gap-2 mb-2.5 overflow-x-auto scrollbar-none pb-1 text-xs">
            <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider shrink-0">
              Quick Ask:
            </span>
            <button
              onClick={() => handlePromptClick("Build me an optimal 3-day Full Body workout routine")}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap hover:text-white transition-colors cursor-pointer"
            >
              🏋️ Full Body Routine
            </button>
            <button
              onClick={() => handlePromptClick("Log breakfast: 3 eggs, 2 slices whole wheat toast, 1 black coffee")}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap hover:text-white transition-colors cursor-pointer"
            >
              🍳 Log Breakfast
            </button>
            <button
              onClick={() => handlePromptClick("What are the best high-protein post-workout meals under 500 kcal?")}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap hover:text-white transition-colors cursor-pointer"
            >
              🥗 Post-Workout Meals
            </button>
            <button
              onClick={() => handlePromptClick("How do I fix elbow pain during bench press?")}
              className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap hover:text-white transition-colors cursor-pointer"
            >
              🩹 Form & Injury Fix
            </button>
          </div>

          {/* Form */}
          <form
            id="chat-input-form"
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-xl focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all"
          >
            <textarea
              id="chat-message-input"
              ref={textareaRef}
              value={inputText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a customized workout, log what you ate, or ask nutrition questions..."
              rows={1}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 px-3 py-1.5 focus:outline-none resize-none max-h-44 leading-relaxed scrollbar-thin"
            />

            <button
              id="btn-send-message"
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                inputText.trim() && !isLoading
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30 font-bold"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-500 mt-2">
            FitCoach AI can generate custom splits and parse meal macros into your daily tracker automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
