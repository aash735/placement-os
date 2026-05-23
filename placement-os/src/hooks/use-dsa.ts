"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  computePlacementReadiness,
  detectWeakTopics,
  getDailyChallengeQuestion,
  getDueRevisions,
  getHeatmapData,
  getTopicCompletionPercent,
  getTopicMasteryLevel,
  isTopicUnlocked,
  computeLevelUnlocked,
} from "@/lib/dsa-engine";
import { useProgressStore } from "@/lib/progress-store";
import { useDataStore } from "@/store/data-store";

export function useDSAStats() {
  const questionProgress = useProgressStore((s) => s.questionProgress);
  const topicProgress = useProgressStore((s) => s.topicProgress);
  const dailyLogs = useProgressStore((s) => s.dailyLogs);
  const questions = useDataStore((s) => s.questions);
  const topics = useDataStore((s) => s.topics);

  return useMemo(() => {
    if (!questions.length) {
      return {
        solved: 0,
        total: 0,
        solvedPercent: 0,
        dueRevisions: [],
        weakTopics: [],
        readiness: 0,
        dailyChallenge: null,
        heatmap: [],
        topics: [],
        dailyLogs,
      };
    }

    const solved = questions.filter((q) =>
      ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
    ).length;
    const total = questions.length;
    const dueRevisions = getDueRevisions(questions, questionProgress);
    const weakTopics = detectWeakTopics(questions, topics, questionProgress);
    const readiness = computePlacementReadiness(questions, questionProgress);
    const dailyChallenge = getDailyChallengeQuestion(
      questions,
      questionProgress,
      format(new Date(), "yyyy-MM-dd")
    );
    const heatmap = getHeatmapData(questions, topics, questionProgress);

    const topicsEnriched = topics.map((meta) => {
      const topicQuestions = questions.filter((q) => q.topicId === meta.id);
      return {
        ...meta,
        unlocked: isTopicUnlocked(meta.id, topics, topicProgress, questionProgress, questions),
        completion: getTopicCompletionPercent(meta.id, questionProgress, questions),
        mastery: getTopicMasteryLevel(meta.id, questionProgress, questions),
        levelUnlocked: computeLevelUnlocked(meta.id, questionProgress, questions),
        revisionCount: topicProgress[meta.id]?.revisionCount ?? 0,
        questionCount: topicQuestions.length,
        easyCount: topicQuestions.filter((q) => q.difficulty === "Easy").length,
        mediumCount: topicQuestions.filter((q) => q.difficulty === "Medium").length,
        hardCount: topicQuestions.filter((q) => q.difficulty === "Hard").length,
        revisionDueCount: dueRevisions.filter((r) => r.question.topicId === meta.id).length,
      };
    });

    return {
      solved,
      total,
      solvedPercent: Math.round((solved / total) * 100),
      dueRevisions,
      weakTopics,
      readiness: readiness,
      dailyChallenge,
      heatmap,
      topics: topicsEnriched,
      dailyLogs,
    };
  }, [questionProgress, topicProgress, dailyLogs, questions, topics]);
}
