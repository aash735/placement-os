"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { aptitudeQuestions } from "@/data/aptitude-questions";

const PRACTICE_CATEGORIES = [
  {
    id: "quant",
    name: "Quantitative Aptitude",
    description: "Numerical ability, arithmetic, and mathematical reasoning.",
    topics: [
      { id: "number-system", name: "Number System", count: 180 },
      { id: "percentages", name: "Percentage", count: 220 },
      { id: "profit-loss", name: "Profit and Loss", count: 180 },
      { id: "ratios", name: "Ratio and Proportion", count: 160 },
      { id: "time-work", name: "Time and Work", count: 165 },
      { id: "speed", name: "Time and Distance", count: 115 },
      { id: "probability", name: "Probability", count: 50 },
      { id: "permutation-combination", name: "Permutation and Combination", count: 45 },
      { id: "average", name: "Average", count: 130 },
      { id: "simple-interest", name: "Simple Interest", count: 80 },
      { id: "compound-interest", name: "Compound Interest", count: 90 },
      { id: "hcf-lcm", name: "H.C.F. and L.C.M.", count: 85 },
      { id: "simplification", name: "Simplification", count: 240 },
      { id: "ages", name: "Problems on Ages", count: 65 },
      { id: "pipes-cisterns", name: "Pipes and Cisterns", count: 60 }
    ]
  },
  {
    id: "logical",
    name: "Logical Reasoning",
    description: "Logical deduction, patterns, and arrangements.",
    topics: [
      { id: "direction-sense", name: "Direction Sense", count: 125 },
      { id: "blood-relations", name: "Blood Relations", count: 87 },
      { id: "coding-decoding", name: "Coding Decoding", count: 104 },
      { id: "syllogism", name: "Syllogism", count: 60 },
      { id: "seating-arrangement", name: "Seating Arrangement", count: 70 },
      { id: "statement-conclusion", name: "Statement Conclusion", count: 55 },
      { id: "series", name: "Series", count: 110 },
      { id: "analogy", name: "Analogy", count: 45 },
      { id: "clocks", name: "Clocks", count: 30 },
      { id: "calendar", name: "Calendar", count: 25 }
    ]
  },
  {
    id: "verbal",
    name: "Verbal Ability",
    description: "English grammar, reading comprehension, and vocabulary.",
    topics: [
      { id: "synonyms", name: "Synonyms", count: 150 },
      { id: "antonyms", name: "Antonyms", count: 150 },
      { id: "sentence-improvement", name: "Sentence Improvement", count: 120 },
      { id: "rc", name: "Reading Comprehension", count: 80 },
      { id: "error-detection", name: "Error Detection", count: 100 },
      { id: "vocab", name: "Vocabulary", count: 200 }
    ]
  },
  {
    id: "di",
    name: "Data Interpretation",
    description: "Analyzing charts, tables, and graphs.",
    topics: [
      { id: "tables", name: "Tables", count: 100 },
      { id: "pie-charts", name: "Pie Charts", count: 70 },
      { id: "bar-graphs", name: "Bar Graphs", count: 80 },
      { id: "line-graphs", name: "Line Graphs", count: 80 },
      { id: "caselets", name: "Caselets", count: 40 }
    ]
  }
];

export default function PracticeLibraryPage() {
  const { aptitudePracticeAttempts = [] } = useProgressStore();
  const [searchQuery, setSearchQuery] = useState("");

  const getTopicSolvedCount = (topicId: string) => {
    const solved = new Set(
      aptitudePracticeAttempts
        .filter((a) => a.topicId === topicId && a.isCorrect)
        .map((a) => a.questionId)
    );
    return solved.size;
  };

  const getCategorySolvedCount = (catId: string, filteredTopics: typeof PRACTICE_CATEGORIES[0]["topics"]) => {
    const topicIds = filteredTopics.map((t) => t.id);
    const solved = new Set(
      aptitudePracticeAttempts
        .filter((a) => topicIds.includes(a.topicId) && a.isCorrect)
        .map((a) => a.questionId)
    );
    return solved.size;
  };

  return (
    <AppShell title="Practice Library" subtitle="Explore topics and practice at your own pace">
      <PageHeader
        title="Aptitude Practice Library"
        description="Strengthen your fundamentals topic-by-topic. No timers, no pressure. Explanations and answer reveals are available instantly."
      />

      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search topics (e.g. Percentages, Blood Relations)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-8">
        {PRACTICE_CATEGORIES.map((category) => {
          const filteredTopics = category.topics.filter((topic) =>
            topic.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredTopics.length === 0) return null;

          const categorySolved = getCategorySolvedCount(category.id, category.topics);

          return (
            <GlassCard key={category.id} className="p-6 border-white/5" hover={false}>
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">{category.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{category.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-lg font-mono">
                    {categorySolved} Solved
                  </span>
                </div>
              </div>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {filteredTopics.map((topic) => {
                  const solved = getTopicSolvedCount(topic.id);
                  const isCompleted = solved > 0;

                  const dynamicCount = aptitudeQuestions.filter((q) => q.topic === topic.id).length;

                  return (
                    <Link
                      key={topic.id}
                      href={`/aptitude/practice/${topic.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group">
                        <div>
                          <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            {topic.name}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[10px] text-zinc-400">
                              {dynamicCount > 0 ? dynamicCount : topic.count} Syllabus Qs
                            </span>
                            {isCompleted && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                                <span className="text-[10px] text-emerald-400 font-medium">
                                  {solved} Solved
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </AppShell>
  );
}
