"use client";

import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useInterviewStore } from "@/store/interview-store";
import { useProgressStore } from "@/lib/progress-store";
import {
  InterviewCategory,
  InterviewDifficulty,
  InterviewDurationOption,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  InterviewStage,
  InterviewMessage,
} from "@/types/ai-interview";
import { format } from "date-fns";
import {
  Brain,
  Clock,
  Sparkles,
  Send,
  RefreshCw,
  AlertCircle,
  Trophy,
  ChevronRight,
  TrendingUp,
  X,
  UserCheck,
  Video,
  VideoOff,
  ChevronLeft,
  BookOpen,
  Award,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Local Custom Progress Ring that supports customized label
function ScoreRing({ value, label, size = 110 }: { value: number; label: string; size?: number }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  let colorClass = "stroke-cyan-400";
  if (value >= 80) colorClass = "stroke-emerald-400";
  else if (value >= 60) colorClass = "stroke-amber-400";
  else colorClass = "stroke-rose-400";

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size }}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xl font-extrabold text-white">{value}</span>
      </div>
      <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mt-2 text-center truncate w-full">
        {label}
      </span>
    </div>
  );
}

// Display content helper to strip the technical scratchpad code block from UI chat bubbles
function getDisplayContent(content: string): string {
  if (content.includes("\n\n*[Workspace Code/Details Outline]*:")) {
    return content.split("\n\n*[Workspace Code/Details Outline]*:")[0].trim();
  }
  return content;
}

export default function AiMockInterviewRoom() {
  const {
    activeSession,
    history,
    isHydrated,
    startSession,
    addMessage,
    tickTimer,
    advanceStage,
    setError,
    setEvaluating,
    completeInterview,
    abandonInterview,
    loadHistory,
  } = useInterviewStore();

  const { llmApiKey, userId } = useProgressStore();

  // Settings State
  const [category, setCategory] = useState<InterviewCategory>("dsa");
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>("medium");
  const [durationOption, setDurationOption] = useState<InterviewDurationOption>("30");
  const [customDuration, setCustomDuration] = useState<number>(30);
  const [provider, setProvider] = useState<"gemini" | "openai" | "ollama">("gemini");
  const [apiKeyInput, setApiKeyInput] = useState<string>("");
  
  // Rate-limiting double submission check
  const lastRequestTimeRef = useRef<number>(0);
  
  // Refs to preserve last sent content for retry flow
  const lastSentMessageRef = useRef<string>("");
  const lastSentScratchpadRef = useRef<string>("");

  // UI Interactive States
  const [inputText, setInputText] = useState("");
  const [scratchpadText, setScratchpadText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHistoryReport, setSelectedHistoryReport] = useState<string | null>(null);
  
  // Camera State
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Chat scroll anchor
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Mobile Layout States
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "scratchpad">("chat");

  // Load history and sync keys on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Handle active session timer tick - checks isRunning only to prevent recreating interval every second
  useEffect(() => {
    if (!activeSession || !activeSession.isRunning) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession?.isRunning, tickTimer]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSession?.messages, isLoading]);

  // Automatic camera stream handler
  useEffect(() => {
    if (cameraEnabled && activeSession) {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 320, height: 240 }, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera access failed", err);
          setCameraEnabled(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraEnabled, activeSession]);

  // Timer run out evaluation
  useEffect(() => {
    if (activeSession && activeSession.timeLeftSeconds === 0 && activeSession.isRunning) {
      handleFinishInterview();
    }
  }, [activeSession?.timeLeftSeconds]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-zinc-400">Restoring interview environment...</p>
        </div>
      </div>
    );
  }

  // Action: Setup page start session
  const handleStart = () => {
    const finalKey = apiKeyInput.trim() || llmApiKey;
    if (!finalKey && provider !== "ollama") {
      alert("Please enter a temporary API key or configure it in your profile settings.");
      return;
    }

    const settings = {
      category,
      difficulty,
      durationOption,
      customDurationMinutes: durationOption === "custom" ? customDuration : undefined,
    };

    startSession(settings, provider, apiKeyInput.trim() || undefined);
    setInputText("");
    setScratchpadText("");
    setIsLoading(false);
  };

  // Action: Send user answer
  const handleSend = async (isRetry = false) => {
    if (!activeSession) return;

    let userMsg = "";
    let userScratchpad = "";

    if (isRetry) {
      userMsg = lastSentMessageRef.current;
      userScratchpad = lastSentScratchpadRef.current;
    } else {
      userMsg = inputText.trim();
      userScratchpad = scratchpadText.trim();
      if (!userMsg && !userScratchpad) return;
      if (!userMsg) userMsg = "Sent response outline.";
    }

    // Rate-limiting check to prevent double submissions
    const now = Date.now();
    if (now - lastRequestTimeRef.current < 2000) {
      console.warn("[Rate Limit] Blocking rapid candidate submission.");
      return;
    }
    lastRequestTimeRef.current = now;

    // Construct user output details
    let combinedContent = userMsg;
    if (userScratchpad) {
      combinedContent = `${userMsg}\n\n*[Workspace Code/Details Outline]*:\n\`\`\`\n${userScratchpad}\n\`\`\``;
    }

    if (!isRetry) {
      // Save content for retry capability
      lastSentMessageRef.current = userMsg;
      lastSentScratchpadRef.current = userScratchpad;
      
      // Save combinedContent to the store to keep interviewer code memory consistent
      addMessage("candidate", combinedContent);
      setInputText("");
    }

    setIsLoading(true);
    setError(null);

    // Save active messages context before async update
    const previousMessages = [...activeSession.messages];
    if (isRetry) {
      // If retrying, the last message in activeSession is already the failed one
      // We just need to ensure the payload is correct
    } else {
      // In normal flow, the new message is already in activeSession since addMessage runs synchronously
    }

    // Increment question stage progression based on question count
    const nextQCount = activeSession.currentQuestionCount;
    if (activeSession.currentStage === "Introduction") {
      advanceStage();
    } else if (activeSession.currentStage === "Fundamentals" && nextQCount >= 1) {
      advanceStage();
    } else if (activeSession.currentStage === "Intermediate Assessment" && nextQCount >= 3) {
      advanceStage();
    } else if (activeSession.currentStage === "Advanced Assessment" && nextQCount >= 5) {
      advanceStage();
    }

    // Retrieve updated stage
    const nextStage = useInterviewStore.getState().activeSession?.currentStage || activeSession.currentStage;

    try {
      const res = await fetch("/api/ai-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          provider: activeSession.provider,
          apiKey: activeSession.tempApiKey || llmApiKey,
          settings: activeSession.settings,
          messages: useInterviewStore.getState().activeSession?.messages || previousMessages,
          currentStage: nextStage,
          userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch response from interviewer.");
      }

      const data = await res.json();
      addMessage("interviewer", data.response);
      setError(null);
    } catch (err: any) {
      const errMsg = err.message || "";
      if (errMsg.includes("QUOTA_EXCEEDED")) {
        setError("QUOTA_EXCEEDED: Your Gemini API free tier quota has been exhausted. Please wait a bit and try again, or switch AI Engine to OpenAI.");
      } else if (errMsg.includes("INVALID_API_KEY")) {
        setError("INVALID_API_KEY: The API key provided is invalid. Please double check the key in Settings.");
      } else if (errMsg.toLowerCase().includes("timeout")) {
        setError("TIMEOUT: The request timed out. Please check your network connection and try again.");
      } else if (errMsg.includes("TypeError") || errMsg.toLowerCase().includes("fetch")) {
        setError("NETWORK_FAILURE: A network error occurred. Please check your internet connection.");
      } else {
        setError(`UNKNOWN_ERROR: ${errMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Action: End interview evaluation (hoisted traditional function to resolve TDZ compile block)
  async function handleFinishInterview() {
    const session = useInterviewStore.getState().activeSession;
    if (!session) return;

    if (session.messages.length < 3) {
      if (!confirm("Your interview has barely started. Evaluating now might yield incomplete feedback. Are you sure you want to finish?")) {
        return;
      }
    }

    setEvaluating(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          provider: session.provider,
          apiKey: session.tempApiKey || llmApiKey,
          settings: session.settings,
          messages: session.messages,
          userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate evaluation report.");
      }

      const data = await res.json();
      // Pivot navigation: Set viewing report ID before clearing the active session state
      setSelectedHistoryReport(session.id);
      completeInterview(data.report);
    } catch (err: any) {
      const errMsg = err.message || "";
      if (errMsg.includes("QUOTA_EXCEEDED")) {
        setError("QUOTA_EXCEEDED: Your Gemini API free tier quota has been exhausted. Please wait a bit and try again, or switch AI Engine to OpenAI.");
      } else if (errMsg.includes("INVALID_API_KEY")) {
        setError("INVALID_API_KEY: The API key provided is invalid. Please double check the key in Settings.");
      } else if (errMsg.toLowerCase().includes("timeout")) {
        setError("TIMEOUT: The evaluation request timed out. Please retry.");
      } else if (errMsg.includes("TypeError") || errMsg.toLowerCase().includes("fetch")) {
        setError("NETWORK_FAILURE: A network error occurred. Please check your internet connection.");
      } else {
        setError(`UNKNOWN_ERROR: ${errMsg}`);
      }
      setEvaluating(false);
    }
  }

  // Render Time String
  const getTimerString = () => {
    if (!activeSession) return "00:00";
    const min = Math.floor(activeSession.timeLeftSeconds / 60);
    const sec = activeSession.timeLeftSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Calculate top bar progress bar percentage
  const getStageProgressPercent = (stage: InterviewStage) => {
    switch (stage) {
      case "Introduction":
        return 10;
      case "Fundamentals":
        return 35;
      case "Intermediate Assessment":
        return 60;
      case "Advanced Assessment":
        return 85;
      case "Final Evaluation":
        return 100;
      default:
        return 0;
    }
  };

  // SCREEN 1: ACTIVE INTERVIEW ROOM SCREEN
  if (activeSession) {
    const progressPercent = getStageProgressPercent(activeSession.currentStage);
    const hasActiveKey = !!(activeSession.tempApiKey || llmApiKey);

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
        {/* Top Header Section */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all"
              title="Show Interviewer Panel"
            >
              <Brain className="h-5 w-5 text-cyan-400" />
            </button>
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live AI Interview Simulator
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div
              className={`flex items-center gap-2 font-mono text-sm border px-4 py-1.5 rounded-xl transition-all ${
                activeSession.timeLeftSeconds < 60
                  ? "bg-rose-950/20 border-rose-500/50 text-rose-400 animate-pulse"
                  : activeSession.timeLeftSeconds < 300
                  ? "bg-amber-950/20 border-amber-500/40 text-amber-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-300"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{getTimerString()}</span>
            </div>

            <button
              onClick={() => {
                if (confirm("Abandoning this mock session will discard all progress and transcripts. Are you sure?")) {
                  abandonInterview();
                }
              }}
              className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-900 transition-all"
            >
              Abandon
            </button>
          </div>
        </header>

        {/* Top Progress bar and stage info */}
        <div className="bg-zinc-900/40 border-b border-zinc-900 px-6 py-3 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Stage: {activeSession.currentStage}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Questions Asked:</span>
              <span className="text-xs font-bold text-white">{activeSession.currentQuestionCount}</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full sm:w-64">
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
              <span>Intro</span>
              <span>Basics</span>
              <span>Inter</span>
              <span>Adv</span>
              <span>Wrap</span>
            </div>
          </div>
        </div>

        {/* Workspace Panels */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* LEFT PANEL: Avatar, Status, Topic, Webcam */}
          {/* Backdrop overlay on mobile */}
          {showSidebar && (
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          <aside
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-zinc-950 border-r border-zinc-900 p-4 space-y-4 overflow-y-auto flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:z-0 md:flex ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between md:hidden pb-2 border-b border-zinc-900">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Interviewer Panel</span>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* AI Avatar / Feed */}
            <div className="relative aspect-video w-full rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col items-center justify-center shadow-lg group">
              {/* Pulsing visual core */}
              <div className="relative">
                <div className={`absolute -inset-4 rounded-full bg-cyan-400/20 blur-xl transition-all ${isLoading ? "animate-pulse scale-125" : "scale-100"}`} />
                <div className="h-16 w-16 rounded-full bg-zinc-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 relative z-10 shadow-inner">
                  <Brain className={`h-8 w-8 ${isLoading ? "animate-spin text-violet-400" : ""}`} />
                </div>
              </div>
              <span className="text-xs font-bold tracking-wider text-white mt-3 z-10">AI Interviewer</span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1 z-10 font-mono">
                {isLoading ? "Analyzing voice..." : "Interviewer is listening"}
              </span>

              {/* Glowing Waveform effect */}
              {isLoading && (
                <div className="absolute bottom-2 flex gap-1 items-end h-8">
                  <div className="w-1 bg-cyan-400 animate-[pulse_0.6s_infinite] h-4" />
                  <div className="w-1 bg-violet-400 animate-[pulse_0.8s_infinite] h-6" />
                  <div className="w-1 bg-cyan-400 animate-[pulse_0.5s_infinite] h-5" />
                  <div className="w-1 bg-violet-400 animate-[pulse_0.7s_infinite] h-7" />
                </div>
              )}
            </div>

            {/* Candidate Webcam feed (Wow factor) */}
            <div className="relative aspect-video w-full rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col items-center justify-center shadow-lg">
              {cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="text-center p-4">
                  <VideoOff className="h-6 w-6 text-zinc-600 mx-auto mb-2" />
                  <p className="text-[10px] text-zinc-500">Camera Feed Disabled</p>
                </div>
              )}
              {/* Webcam Control Button */}
              <button
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className="absolute bottom-2 right-2 rounded-lg bg-black/60 hover:bg-black border border-zinc-800 p-1.5 text-zinc-400 hover:text-white transition-all z-10 shadow-md"
                title={cameraEnabled ? "Disable Camera" : "Enable Camera"}
              >
                {cameraEnabled ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Session Details */}
            <GlassCard className="p-4 space-y-3" hover={false}>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Topic</span>
                <span className="text-xs font-bold text-white leading-tight block">
                  {CATEGORY_LABELS[activeSession.settings.category]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-900">
                <div>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Difficulty</span>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {DIFFICULTY_LABELS[activeSession.settings.difficulty]}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Engine</span>
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    {activeSession.provider}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Submit Action */}
            <div className="flex-1 flex items-end">
              <button
                onClick={handleFinishInterview}
                disabled={activeSession.isEvaluating}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs shadow-lg shadow-cyan-950/20"
              >
                {activeSession.isEvaluating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 text-cyan-400" />
                    Finish & Evaluate
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* RIGHT PANEL: Chat, Input, Send, Code Scratchpad */}
          <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-zinc-950/40">
            {/* Mobile Tab Selector */}
            <div className="flex md:hidden border-b border-zinc-900 bg-zinc-950 shrink-0">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center ${
                  activeTab === "chat"
                    ? "border-cyan-400 text-cyan-400 bg-cyan-950/10"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab("scratchpad")}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center ${
                  activeTab === "scratchpad"
                    ? "border-violet-400 text-violet-400 bg-violet-950/10"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Scratchpad
              </button>
            </div>

            {/* Conversation Area (Left half of right panel) */}
            <div className={`flex-1 flex flex-col overflow-hidden border-r border-zinc-900 ${
              activeTab === "chat" ? "flex" : "hidden md:flex"
            }`}>
              {/* Message scroll log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-950/20">
                {activeSession.messages.map((m) => {
                  const isInterviewer = m.role === "interviewer";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 max-w-[85%] ${isInterviewer ? "" : "ml-auto flex-row-reverse"}`}
                    >
                      {/* Icon */}
                      <div
                        className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                          isInterviewer
                            ? "bg-zinc-900 border border-zinc-800 text-cyan-400"
                            : "bg-cyan-950 border border-cyan-800 text-cyan-300"
                        }`}
                      >
                        {isInterviewer ? "AI" : "YOU"}
                      </div>
                      {/* Box */}
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          isInterviewer
                            ? "bg-zinc-900/80 border border-zinc-850 text-zinc-200"
                            : "bg-gradient-to-br from-cyan-950/40 to-zinc-900 border border-cyan-900/30 text-white"
                        }`}
                      >
                        {getDisplayContent(m.content)}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400 flex items-center justify-center text-xs font-bold animate-pulse">
                      AI
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-2xl flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                {/* API Key Fail Warnings */}
                {activeSession.error && (
                  <div className="border border-rose-950 bg-rose-950/20 text-rose-300 rounded-xl p-3.5 text-xs flex gap-2.5 items-start">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-semibold">{activeSession.error}</p>
                      <button
                        onClick={() => handleSend(true)}
                        className="bg-rose-950 border border-rose-800 px-3 py-1 rounded-md text-[10px] font-bold text-white hover:bg-rose-900 transition-all flex items-center gap-1.5"
                      >
                        <RefreshCw className="h-3 w-3" /> Retry Message
                      </button>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input controls */}
              <div className="p-3 border-t border-zinc-900 bg-zinc-950 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={
                    isLoading
                      ? "Analyzing details..."
                      : "Type your response here..."
                  }
                  value={inputText}
                  disabled={isLoading || activeSession.isEvaluating}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="field-input flex-1 px-4 py-3 text-xs"
                />
                <button
                  onClick={() => handleSend(false)}
                  disabled={isLoading || activeSession.isEvaluating || (!inputText.trim() && !scratchpadText.trim())}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl p-3 text-xs font-bold transition-all disabled:opacity-40 disabled:hover:bg-cyan-500 shrink-0 flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Candidate Response Workspace / Code Pad (Right half of right panel) */}
            <div className={`flex-1 flex flex-col overflow-hidden bg-zinc-950/20 ${
              activeTab === "scratchpad" ? "flex" : "hidden md:flex"
            }`}>
              <div className="p-3.5 border-b border-zinc-900 shrink-0 bg-zinc-950/80">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-violet-400" />
                  Candidate Workspace / Scratchpad
                </h3>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                  Draft pseudocode, design components, outline database schemas, or structure your technical replies. Content will be analyzed contextually.
                </p>
              </div>
              <textarea
                placeholder="Write your technical solution details, code structure, or diagrams here...&#10;&#10;Example:&#10;- Core logic pseudocode&#10;- Database relational tables&#10;- Edge cases considered (nulls, empty structures)&#10;- Time & Space complexities"
                value={scratchpadText}
                disabled={activeSession.isEvaluating}
                onChange={(e) => setScratchpadText(e.target.value)}
                className="flex-1 w-full p-4 text-xs font-mono bg-zinc-950/30 text-white placeholder-zinc-700 focus:outline-none resize-none leading-relaxed border-none focus:ring-0"
              />
            </div>
          </main>
        </div>

        {/* Global Loading Overlay for Evaluation */}
        {activeSession.isEvaluating && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md text-white px-6">
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
              <div className="h-20 w-20 rounded-full border-4 border-t-cyan-400 border-zinc-800 animate-spin flex items-center justify-center">
                <Brain className="h-8 w-8 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-white mt-8 tracking-tight">AI Interview Evaluation</h2>
            <p className="text-xs text-zinc-400 text-center max-w-sm mt-3 leading-relaxed">
              We are analyzing your dialogue history, grading technical competency, scoring communication logic, and compiling personalized study patterns...
            </p>
          </div>
        )}
      </div>
    );
  }

  // SCREEN 2: EVALUATION REPORT DISPLAY SCREEN
  if (selectedHistoryReport) {
    const record = history.find((h) => h.id === selectedHistoryReport);
    if (!record) return null;

    const rep = record.report;

    return (
      <AppShell title="AI Mock Interview Report" subtitle="Comprehensive performance evaluation dashboard">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Action */}
          <button
            onClick={() => setSelectedHistoryReport(null)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> Back to dashboard
          </button>

          {/* Header Summary */}
          <GlassCard className="p-6 bg-gradient-to-r from-zinc-950/90 to-zinc-900 border border-zinc-800 rounded-2xl" hover={false}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-cyan-950/30 border border-cyan-900/50 px-3 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  {CATEGORY_LABELS[record.category]} Mock Test
                </span>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Interview Performance Summary</h1>
                <p className="text-xs text-zinc-400">
                  Attempted on: {format(new Date(record.date), "MMMM d, yyyy · h:mm a")} · Duration: {record.durationMinutes} mins
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ScoreRing value={rep.overallScore} label="Overall Score" size={120} />
              </div>
            </div>
          </GlassCard>

          {/* Scores Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center" hover={false}>
              <ScoreRing value={rep.technicalScore} label="Technical Depth" />
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center" hover={false}>
              <ScoreRing value={rep.communicationScore} label="Communication" />
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center" hover={false}>
              <ScoreRing value={rep.problemSolvingScore} label="Problem Solving" />
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center" hover={false}>
              <ScoreRing value={rep.confidenceScore} label="Confidence Level" />
            </GlassCard>
          </div>

          {/* Executive Feedback */}
          <GlassCard className="p-6 space-y-4" hover={false}>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" /> Executive Feedback
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-900/30 p-4 border border-zinc-900 rounded-xl">
              {rep.feedback}
            </p>
          </GlassCard>

          {/* Strengths & Weaknesses Grids */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Strengths */}
            <GlassCard className="p-5 space-y-4 border-t-2 border-t-emerald-500" hover={false}>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Key Strengths Detected
              </h3>
              <ul className="space-y-2.5">
                {rep.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Weaknesses */}
            <GlassCard className="p-5 space-y-4 border-t-2 border-t-rose-500" hover={false}>
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Areas of Improvement
              </h3>
              <ul className="space-y-2.5">
                {rep.weaknesses.map((wk, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Recommendations and suggested topics */}
          <div className="grid gap-6 md:grid-cols-2">
            <GlassCard className="p-5 space-y-4" hover={false}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" /> Actionable Next Steps
              </h3>
              <ul className="space-y-2.5">
                {rep.improvementSuggestions.map((sug, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-cyan-400 font-bold font-mono shrink-0 mt-0.5">{idx + 1}.</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-5 space-y-4" hover={false}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-violet-400" /> Recommended Study Subtopics
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {rep.recommendedTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 font-semibold"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </AppShell>
    );
  }

  // SCREEN 3: DASHBOARD VIEW (Setup Form + Past Attempts History List)
  return (
    <AppShell title="AI Mock Interview" subtitle="Start a realistic video interview simulation">
      <PageHeader
        title="AI Interview Room"
        description="Experience realistic placement pressure. Our AI Interviewer asks contextual questions, probes your logic dynamically across stages, and grades your scores."
      />

      <div className="grid gap-8 lg:grid-cols-3 mt-6">
        {/* Setup Config Card */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-6" hover={false}>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Configure Interview Settings
            </h2>

            <div className="space-y-4">
              {/* Category Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Interview Topic</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(CATEGORY_LABELS) as InterviewCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-xl border p-3.5 text-left text-xs transition-all flex flex-col justify-between ${
                        category === cat
                          ? "border-cyan-500 bg-cyan-950/20 text-cyan-300 shadow-md shadow-cyan-950/10"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/60"
                      }`}
                    >
                      <span className="font-bold">{CATEGORY_LABELS[cat]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Select */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Difficulty</label>
                <div className="flex gap-2.5">
                  {(["easy", "medium", "hard"] as InterviewDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 rounded-xl border py-3 text-center text-xs font-bold uppercase tracking-wider transition-all ${
                        difficulty === diff
                          ? "border-cyan-500 bg-cyan-950/20 text-cyan-300"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {DIFFICULTY_LABELS[diff]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Select */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">Duration</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "15", label: "15 Min" },
                    { key: "30", label: "30 Min" },
                    { key: "45", label: "45 Min" },
                    { key: "custom", label: "Custom" },
                  ].map((dur) => (
                    <button
                      key={dur.key}
                      onClick={() => setDurationOption(dur.key as InterviewDurationOption)}
                      className={`rounded-xl border py-3 text-center text-xs font-semibold transition-all ${
                        durationOption === dur.key
                          ? "border-cyan-500 bg-cyan-950/20 text-cyan-300"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>

                {durationOption === "custom" && (
                  <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 mt-2">
                    <span className="text-xs text-zinc-400 shrink-0">Duration (Minutes):</span>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(Number(e.target.value))}
                      className="field-input w-20 px-2 py-1 text-xs text-center"
                    />
                  </div>
                )}
              </div>

              {/* Engine Selection */}
              <div className="grid gap-4 md:grid-cols-2 pt-2 border-t border-zinc-900">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">AI Engine</label>
                  <Select
                    value={provider}
                    onValueChange={(val) => setProvider(val as any)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select AI Engine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">Gemini 2.5 Flash (Recommended)</SelectItem>
                      <SelectItem value="openai">OpenAI GPT-4o Mini</SelectItem>
                      <SelectItem value="ollama">Ollama Llama3 (Local Offline)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* API Key Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">API Access Key</label>
                    {llmApiKey && provider !== "ollama" && (
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Profile Key Loaded</span>
                    )}
                  </div>
                  <input
                    type="password"
                    placeholder={provider === "ollama" ? "Local offline - no key required" : llmApiKey ? "Using configured profile key" : "Enter temporary key..."}
                    disabled={provider === "ollama"}
                    value={provider === "ollama" ? "" : apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="field-input w-full px-3.5 py-3 text-xs disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/20 mt-4"
            >
              Start AI Mock Interview Room <ChevronRight className="h-4 w-4" />
            </button>
          </GlassCard>
        </div>

        {/* Info / Quick Tips panel */}
        <div className="space-y-6">
          <GlassCard className="p-5 space-y-4" hover={false}>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" />
              Evaluation Stages
            </h3>
            <div className="relative border-l border-zinc-850 ml-2.5 pl-4 space-y-4 text-xs">
              <div className="relative">
                <span className="absolute -left-6 top-0 h-4.5 w-4.5 rounded-full border-2 border-cyan-400 bg-zinc-950 flex items-center justify-center text-[8px] font-bold text-cyan-400">1</span>
                <span className="font-bold text-white">Introduction</span>
                <p className="text-zinc-400 mt-0.5">Introduce yourself and alignment context setup.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 top-0 h-4.5 w-4.5 rounded-full border-2 border-zinc-800 bg-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-500">2</span>
                <span className="font-bold text-white">Fundamentals</span>
                <p className="text-zinc-400 mt-0.5">Explain core definitions, theories, and constraints.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 top-0 h-4.5 w-4.5 rounded-full border-2 border-zinc-800 bg-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-500">3</span>
                <span className="font-bold text-white">Intermediate Analysis</span>
                <p className="text-zinc-400 mt-0.5">Solve algorithmic patterns or architectural choices.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 top-0 h-4.5 w-4.5 rounded-full border-2 border-zinc-800 bg-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-500">4</span>
                <span className="font-bold text-white">Advanced Assessment</span>
                <p className="text-zinc-400 mt-0.5">Explain complex edge cases, load scales, or optimizations.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-6 top-0 h-4.5 w-4.5 rounded-full border-2 border-zinc-800 bg-zinc-950 flex items-center justify-center text-[8px] font-bold text-zinc-500">5</span>
                <span className="font-bold text-white">Wrap & Evaluation</span>
                <p className="text-zinc-400 mt-0.5">Concluding statements followed by deep report compilation.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-3" hover={false}>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-cyan-400" />
              API Key Setup Notice
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Ensure you have your <strong>Gemini Key</strong> configured. Key configurations are stored in your profile and synchronized to Supabase securely. Alternatively, paste a temporary key in the field that remains in transient session memory.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Past Completed Attempts history list */}
      <div className="mt-10 space-y-4">
        <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" /> AI Completed Interview Attempts
        </h3>
        <div className="space-y-3">
          {history.map((record) => (
            <GlassCard key={record.id} className="p-4" hover={false}>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[10px] font-mono font-bold text-cyan-400">
                    {record.category.toUpperCase()}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{CATEGORY_LABELS[record.category]} AI Session</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Completed at: {format(new Date(record.date), "MMMM d, yyyy · h:mm a")} · {record.durationMinutes} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-[8px] text-zinc-500 block uppercase font-bold tracking-wider">Overall Score</span>
                    <span className={`text-sm font-extrabold font-mono ${
                      record.report.overallScore >= 80
                        ? "text-emerald-400"
                        : record.report.overallScore >= 60
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}>
                      {record.report.overallScore}/100
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedHistoryReport(record.id)}
                    className="rounded-lg py-1.5 px-3 bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-1"
                  >
                    View Report <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}

          {history.length === 0 && (
            <p className="text-center text-zinc-650 text-xs italic py-12 border border-dashed border-zinc-850 rounded-2xl">
              No AI Mock interviews completed yet. Configure settings and start your first round!
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
