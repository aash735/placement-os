export type AptitudeTopic = {
  id: string;
  category: "quant" | "logical" | "verbal" | "puzzles" | "di";
  name: string;
  priority: "critical" | "high" | "medium" | "low";
  difficulty: 1 | 2 | 3;
  strategy: string;
  shortcuts: string[];
  revision: string;
};

export const aptitudeTopics: AptitudeTopic[] = [
  { id: "percentages", category: "quant", name: "Percentages & Profit-Loss", priority: "critical", difficulty: 2, strategy: "10 min/day formula drill", shortcuts: ["multiplier method", "fraction ↔ % table"], revision: "Flash cards weekly" },
  { id: "ratios", category: "quant", name: "Ratio & Proportion", priority: "critical", difficulty: 2, strategy: "Pair with DI questions", shortcuts: ["componendo-dividendo for speed"], revision: "5 problems/day" },
  { id: "time-work", category: "quant", name: "Time & Work", priority: "high", difficulty: 2, strategy: "LCM efficiency method only", shortcuts: ["1/a + 1/b = 1/total"], revision: "Bi-weekly mock set" },
  { id: "speed", category: "quant", name: "Time, Speed & Distance", priority: "high", difficulty: 2, strategy: "Unit consistency first", shortcuts: ["relative speed templates"], revision: "Error log in Placement OS" },
  { id: "series", category: "logical", name: "Number & Letter Series", priority: "critical", difficulty: 2, strategy: "Pattern buckets: +, ×, squares, alternating", shortcuts: ["difference of differences"], revision: "Daily 15 puzzles" },
  { id: "coding-decoding", category: "logical", name: "Coding-Decoding", priority: "high", difficulty: 2, strategy: "Map alphabet positions", shortcuts: ["reverse alphabet offset trick"], revision: "Weekend batch" },
  { id: "blood-relations", category: "logical", name: "Blood Relations", priority: "medium", difficulty: 2, strategy: "Draw tree—never mental-only", shortcuts: ["generation notation"], revision: "Monthly refresh" },
  { id: "syllogism", category: "logical", name: "Syllogism", priority: "high", difficulty: 3, strategy: "Venn only for validity", shortcuts: ["some/not all keywords"], revision: "TCS/Infosys OA prep" },
  { id: "rc", category: "verbal", name: "Reading Comprehension", priority: "critical", difficulty: 3, strategy: "Skim questions first; annotate passage", shortcuts: ["eliminate extreme options"], revision: "3 RC/week" },
  { id: "grammar", category: "verbal", name: "Grammar & Sentence Correction", priority: "high", difficulty: 2, strategy: "Error type buckets: tense, agreement, preposition", shortcuts: ["read aloud test"], revision: "Daily 10 questions" },
  { id: "vocab", category: "verbal", name: "Vocabulary & Para Jumbles", priority: "medium", difficulty: 2, strategy: "Context over memorization", shortcuts: ["mandatory sentence in PJ"], revision: "Spaced repetition app" },
  { id: "puzzles", category: "puzzles", name: "Seating & Arrangement", priority: "critical", difficulty: 3, strategy: "Grid on paper always", shortcuts: ["fixed position anchors first"], revision: "2 puzzles/day in season" },
  { id: "di", category: "di", name: "Charts & Tables", priority: "high", difficulty: 3, strategy: "Approximation allowed—note units", shortcuts: ["% change = (new-old)/old"], revision: "Weekly DI set" },
];

export const mockTestSystem = {
  weekly: "1 full timed aptitude (60 min) — alternate quant-heavy and logical-heavy",
  monthly: "Simulate TCS NQT section split",
  tracking: "Log accuracy by category in Placement OS Aptitude Tracker",
};
