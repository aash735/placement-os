import type { DSAQuestion } from "@/types";

export function filterQuestions(
  questions: DSAQuestion[],
  filters: {
    topic?: string;
    difficulty?: string;
    company?: string;
    pattern?: string;
    frequency?: string;
    category?: string;
    search?: string;
    statusMap?: Record<string, string>;
    status?: string;
    revisionDueIds?: Set<string>;
    bookmarked?: Set<string>;
  }
): DSAQuestion[] {
  let result = [...questions];

  if (filters.topic && filters.topic !== "all") {
    const topicId = filters.topic!;
    result = result.filter((q) => q.topicId === topicId || q.additionalTopicIds?.includes(topicId));
  }
  if (filters.difficulty && filters.difficulty !== "all") {
    result = result.filter((q) => q.difficulty === filters.difficulty);
  }
  if (filters.company && filters.company !== "all") {
    result = result.filter((q) =>
      q.companies.some((c) => c.toLowerCase().includes(filters.company!.toLowerCase()))
    );
  }
  if (filters.pattern && filters.pattern !== "all") {
    result = result.filter((q) => q.pattern.toLowerCase().includes(filters.pattern!.toLowerCase()));
  }
  if (filters.frequency && filters.frequency !== "all") {
    result = result.filter((q) => q.interviewFrequency === filters.frequency);
  }
  if (filters.category && filters.category !== "all") {
    result = result.filter((q) => q.category === filters.category);
  }
  if (filters.status && filters.status !== "all" && filters.statusMap) {
    result = result.filter((q) => (filters.statusMap![q.id] ?? "not_started") === filters.status);
  }
  if (filters.revisionDueIds?.size) {
    result = result.filter((q) => filters.revisionDueIds!.has(q.id));
  }
  if (filters.bookmarked?.size) {
    result = result.filter((q) => filters.bookmarked!.has(q.id));
  }
  if (filters.search?.trim()) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (q) =>
        q.title.toLowerCase().includes(s) ||
        q.pattern.toLowerCase().includes(s) ||
        q.topicId.toLowerCase().includes(s) ||
        q.companies.some((c) => c.toLowerCase().includes(s)) ||
        (q.tags?.some((t) => t.toLowerCase().includes(s)) ?? false)
    );
  }

  return result;
}

export function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t === q) return 1;
  if (t.includes(q)) return 0.8;
  let score = 0;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      score++;
      qi++;
    }
  }
  return qi === q.length ? score / q.length : 0;
}
