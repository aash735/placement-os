"use client";

import { useState, useEffect } from "react";
import { Bookmark, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MCQQuestion } from "@/types";
import { cn } from "@/lib/utils";

interface McqCardProps {
  question: MCQQuestion;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onSubmit: (selectedOption: string, isCorrect: boolean) => void;
  previousAttempt?: { selectedOption: string; isCorrect: boolean };
}

export function McqCard({
  question,
  isBookmarked,
  onToggleBookmark,
  onSubmit,
  previousAttempt,
}: McqCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync state with question changes or previous attempts
  useEffect(() => {
    if (previousAttempt) {
      setSelectedOption(previousAttempt.selectedOption);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  }, [question.id, previousAttempt]);

  const handleOptionSelect = (optionLetter: string) => {
    if (isSubmitted) return;
    setSelectedOption(optionLetter);
  };

  const handleAnswerSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    const isCorrect = selectedOption === question.answer;
    setIsSubmitted(true);
    onSubmit(selectedOption, isCorrect);
  };

  return (
    <div className="space-y-4">
      {/* Question Header Card */}
      <div className="rounded-2xl border p-5 shadow-lg bg-[var(--bg-elevated)] border-[var(--border-normal)] space-y-4">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-normal)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
              {question.topic}
            </span>
            {(question as any).subtopic && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                {(question as any).subtopic}
              </span>
            )}
            <span
              className={cn(
                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                question.difficulty === "Easy" && "bg-emerald-500/10 text-emerald-400",
                question.difficulty === "Medium" && "bg-blue-500/10 text-blue-400",
                question.difficulty === "Hard" && "bg-rose-500/10 text-rose-400"
              )}
            >
              {question.difficulty}
            </span>
          </div>

          <button
            onClick={onToggleBookmark}
            className="p-2 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-normal)] hover:bg-[var(--border-normal)] text-[var(--text-primary)] transition-all"
            aria-label="Toggle Bookmark"
          >
            <Bookmark
              className={cn(
                "h-4 w-4 transition-all",
                isBookmarked ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"
              )}
            />
          </button>
        </div>

        {/* Question Title & Description */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)] leading-snug">{question.title}</h2>
          {question.question && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{question.question}</p>
          )}
        </div>

        {/* Code Snippet Box */}
        {question.code && (
          <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
            <code>{question.code}</code>
          </pre>
        )}

        {/* Option Selection List */}
        <div className="space-y-2.5 pt-2">
          {question.options.map((opt) => {
            const optionLetter = opt.trim().charAt(0).toUpperCase(); // "A", "B", "C", "D"
            const isSelected = selectedOption === optionLetter;
            const isCorrectAnswer = optionLetter === question.answer;

            return (
              <button
                key={opt}
                disabled={isSubmitted}
                onClick={() => handleOptionSelect(optionLetter)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-start gap-3",
                  "bg-[var(--bg-elevated)] border-[var(--border-normal)]",
                  !isSubmitted && "hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer",
                  isSelected && !isSubmitted && "border-indigo-500 bg-indigo-500/10",
                  isSubmitted && isCorrectAnswer && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                  isSubmitted && isSelected && !isCorrectAnswer && "border-rose-500 bg-rose-500/10 text-rose-400",
                  isSubmitted && !isCorrectAnswer && !isSelected && "opacity-60 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold",
                    isSelected ? "border-indigo-500 bg-indigo-500 text-white" : "border-[var(--border-normal)] bg-[var(--bg-hover)] text-[var(--text-muted)]",
                    isSubmitted && isCorrectAnswer && "border-emerald-500 bg-emerald-500 text-white",
                    isSubmitted && isSelected && !isCorrectAnswer && "border-rose-500 bg-rose-500 text-white"
                  )}
                >
                  {optionLetter}
                </span>
                <span className="text-[var(--text-primary)] leading-normal">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Control Action Bar */}
        {!isSubmitted && (
          <div className="flex justify-end pt-2">
            <button
              disabled={!selectedOption}
              onClick={handleAnswerSubmit}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(99,102,241,0.25)] cursor-pointer"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>

      {/* Explanation Expansion Slide */}
      <AnimatePresence>
        {isSubmitted && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border p-5 bg-emerald-500/5 border-emerald-500/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <HelpCircle className="h-4 w-4" /> Explanation
              </div>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed italic whitespace-pre-line">
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
