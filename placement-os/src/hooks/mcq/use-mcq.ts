import { useMemo } from "react";
import { useProgressStore } from "@/lib/progress-store";
import mcqBank from "@/data/mcq-bank.json";

export function useMCQStats() {
  const attempts = useProgressStore((s) => s.mcqAttempts || []);
  const bookmarks = useProgressStore((s) => s.mcqBookmarks || []);

  return useMemo(() => {
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a) => a.isCorrect).length;
    const incorrectAttempts = totalAttempts - correctAttempts;
    const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    // Track status per question
    const questionStatuses: Record<string, { solved: boolean; attempts: number; lastOption?: string }> = {};
    attempts.forEach((a) => {
      if (!questionStatuses[a.questionId]) {
        questionStatuses[a.questionId] = { solved: false, attempts: 0 };
      }
      questionStatuses[a.questionId].attempts += 1;
      questionStatuses[a.questionId].lastOption = a.selectedOption;
      if (a.isCorrect) {
        questionStatuses[a.questionId].solved = true;
      }
    });

    const solvedCount = Object.values(questionStatuses).filter((q) => q.solved).length;

    // Topic stats
    const topicStats: Record<string, { total: number; solved: number; attempts: number; correct: number }> = {
      "Trees": { total: 50, solved: 0, attempts: 0, correct: 0 },
      "Graphs": { total: 50, solved: 0, attempts: 0, correct: 0 },
      "Dynamic Programming": { total: 50, solved: 0, attempts: 0, correct: 0 },
      "Language Internals": { total: 50, solved: 0, attempts: 0, correct: 0 },
    };

    // Calculate details per topic
    mcqBank.forEach((q) => {
      const topic = q.topic;
      if (topicStats[topic]) {
        const qStatus = questionStatuses[q.id];
        if (qStatus?.solved) {
          topicStats[topic].solved += 1;
        }
      }
    });

    attempts.forEach((a) => {
      const q = mcqBank.find((item) => item.id === a.questionId);
      if (q && topicStats[q.topic]) {
        topicStats[q.topic].attempts += 1;
        if (a.isCorrect) {
          topicStats[q.topic].correct += 1;
        }
      }
    });

    // Generate actionable recommendations
    const recommendations: string[] = [];
    const weakTopics: { topic: string; accuracy: number; attempts: number }[] = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const accuracy = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;
      if (stats.attempts > 0 && accuracy < 60) {
        weakTopics.push({ topic, accuracy, attempts: stats.attempts });
      } else if (stats.attempts === 0) {
        weakTopics.push({ topic, accuracy: 0, attempts: 0 });
      }
    });

    // Prioritize weak topics with attempts first, then unattempted
    weakTopics.sort((a, b) => {
      if (a.attempts > 0 && b.attempts === 0) return -1;
      if (b.attempts > 0 && a.attempts === 0) return 1;
      return a.accuracy - b.accuracy;
    });

    if (weakTopics.length > 0) {
      const topWeak = weakTopics[0];
      if (topWeak.attempts > 0) {
        recommendations.push(
          `Your accuracy in ${topWeak.topic} is currently ${topWeak.accuracy}% after ${topWeak.attempts} attempts. Focus on revising these concepts.`
        );
      } else {
        recommendations.push(
          `You have not attempted any MCQs in ${topWeak.topic}. Start practicing this topic to gauge your knowledge.`
        );
      }
    }

    // Add generic helper recommendations
    const treesStats = topicStats["Trees"];
    if (treesStats && treesStats.attempts > 0 && (treesStats.correct / treesStats.attempts) < 0.65) {
      recommendations.push("Practice AVL and Red-Black tree properties. Tree rotation questions are highly tested.");
    }
    const dpStats = topicStats["Dynamic Programming"];
    if (dpStats && dpStats.attempts > 0 && (dpStats.correct / dpStats.attempts) < 0.65) {
      recommendations.push("Verify state transitions on knapsack and LIS templates in the Recursion & DP module.");
    }

    if (recommendations.length < 3) {
      recommendations.push("Review C++/Java structural padding, virtual destructors, and memory layout rules.");
      recommendations.push("Focus on Graph articulation points, bridge-finding, and Tarjan's SCC algorithms.");
    }

    return {
      totalAttempts,
      correctAttempts,
      incorrectAttempts,
      overallAccuracy,
      solvedCount,
      totalQuestionsCount: mcqBank.length,
      bookmarksCount: bookmarks.length,
      questionStatuses,
      topicStats,
      recommendations,
    };
  }, [attempts, bookmarks]);
}
