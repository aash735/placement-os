import fs from "fs";
import path from "path";
import { parseSheetFile, loadAllQuestions, findSheetFile, listSheetManifest } from "../src/lib/sheets/parser";
import { validateDSAQuestionRows } from "../src/lib/sheets/validators";
import {
  rowToDSAQuestion,
  rowToDSATopic,
  rowToCompany,
  rowToAptitudeTopic,
  rowToMockTest,
} from "../src/lib/sheets/transformers";
import type { DSAQuestion, DSATopicMeta } from "../src/types";

function normalizeTopicName(topic: string): string {
  return topic
    .replace(/[-_]/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function main() {
  console.log("🚀 Starting spreadsheet synchronization pipeline...");

  // Load all input sheets/CSVs
  const questionRows = loadAllQuestions();
  const mockRows = parseSheetFile(findSheetFile("dsa/mock-tests.csv"));
  const companyRows = parseSheetFile(findSheetFile("companies/profiles.csv"));
  const aptitudeRows = parseSheetFile(findSheetFile("aptitude/topics.csv"));
  const aptitudeConfigRows = parseSheetFile(findSheetFile("aptitude/config.csv"));
  const revisionRows = parseSheetFile(findSheetFile("revision/cycles.csv"));
  const weeklyRows = parseSheetFile(findSheetFile("analytics/weekly-plan.csv"));

  console.log(`📊 Loaded raw data:`);
  console.log(`   - Questions rows: ${questionRows.length}`);
  console.log(`   - Mock test rows: ${mockRows.length}`);
  console.log(`   - Company profile rows: ${companyRows.length}`);
  console.log(`   - Aptitude topic rows: ${aptitudeRows.length}`);
  console.log(`   - Aptitude config rows: ${aptitudeConfigRows.length}`);
  console.log(`   - Revision cycles: ${revisionRows.length}`);
  console.log(`   - Weekly plan weeks: ${weeklyRows.length}`);

  // Validate questions
  const validationIssues = validateDSAQuestionRows(questionRows);
  if (validationIssues.length > 0) {
    console.warn(`⚠️  Found ${validationIssues.length} row validation warnings:`);
    validationIssues.slice(0, 10).forEach(issue => {
      console.warn(`   [Row ${issue.row}] Field '${issue.field}': ${issue.message}`);
    });
    if (validationIssues.length > 10) {
      console.warn(`   ... and ${validationIssues.length - 10} more warnings.`);
    }
  } else {
    console.log("✅ No row validation warnings found.");
  }

  // Build topic display name map from the questions themselves
  const topicDisplayNames = new Map<string, string>();
  questionRows.forEach((row) => {
    const rawTopic = (row.topic || row.topics || "").trim();
    const topicLower = rawTopic.toLowerCase();
    
    // Canonical topic map
    const TOPIC_CANONICAL: Record<string, string> = {
      "dp": "Dynamic Programming", "dynamic programming": "Dynamic Programming",
      "arrays": "Arrays", "2d arrays": "2D Arrays", "strings": "Strings",
      "linked list": "Linked List", "linked-list": "Linked List",
      "stacks & queues": "Stacks & Queues", "stacks and queues": "Stacks & Queues",
      "stack": "Stacks & Queues", "queue": "Stacks & Queues",
      "binary trees": "Binary Trees", "trees": "Binary Trees",
      "binary search trees": "Binary Search Trees", "bst": "Binary Search Trees",
      "heaps & hashing": "Heaps & Hashing", "heaps and hashing": "Heaps & Hashing",
      "heap": "Heaps & Hashing", "hashmaps": "Heaps & Hashing",
      "graphs": "Graphs", "bfs-dfs": "Graphs",
      "searching & sorting": "Searching & Sorting", "searching and sorting": "Searching & Sorting",
      "sorting": "Searching & Sorting", "binary-search": "Searching & Sorting",
      "greedy": "Greedy", "backtracking": "Backtracking", "tries": "Tries",
      "segment trees": "Segment Trees", "bit manipulation": "Bit Manipulation",
      "sliding window": "Sliding Window", "sliding-window": "Sliding Window",
      "two pointers": "Two Pointers", "two-pointer": "Two Pointers",
      "recursion": "Recursion", "maths": "Maths", "matrix": "2D Arrays",
    };
    const displayName = TOPIC_CANONICAL[topicLower] || rawTopic;
    if (rawTopic) {
      const slug = displayName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
      topicDisplayNames.set(slug, displayName);
    }
  });

  // Transform raw rows into typed objects
  const questions = questionRows
    .map(rowToDSAQuestion)
    .filter((q): q is DSAQuestion => q !== null);

  // Dynamic topics map generation
  const topicsMap = new Map<string, DSATopicMeta>();
  
  questions.forEach((q) => {
    const topicId = q.topicId;
    if (!topicId) return;

    if (!topicsMap.has(topicId)) {
      const name = topicDisplayNames.get(topicId) || normalizeTopicName(topicId.replace(/-/g, " "));
      topicsMap.set(topicId, {
        id: topicId,
        name: name,
        slug: topicId,
        difficulty: 2,
        importanceScore: 80,
        interviewFrequency: "medium",
        estimatedHours: 8,
        tier: "important",
        overview: `${name} — ${topicId}`,
        patterns: [],
        unlockAfterTopicId: undefined,
      });
    }

    const tMeta = topicsMap.get(topicId)!;
    if (q.pattern && q.pattern !== "General" && !tMeta.patterns.includes(q.pattern)) {
      tMeta.patterns.push(q.pattern);
    }
  });

  const topics = Array.from(topicsMap.values());

  // Recalculate topic attributes dynamically
  topics.forEach((topic) => {
    const topicQuestions = questions.filter((q) => q.topicId === topic.id);
    if (topicQuestions.length === 0) return;

    // Difficulty calculation (1-5 scale)
    const diffSum = topicQuestions.reduce((sum, q) => {
      if (q.difficulty === "Easy") return sum + 1.5;
      if (q.difficulty === "Hard") return sum + 5.0;
      return sum + 3.0; // Medium
    }, 0);
    const avgDiff = Math.min(5, Math.max(1, Math.round(diffSum / topicQuestions.length))) as 1 | 2 | 3 | 4 | 5;
    topic.difficulty = avgDiff;

    // Estimated hours calculation
    const totalMins = topicQuestions.reduce((sum, q) => sum + (q.estimatedMinutes || 30), 0);
    topic.estimatedHours = Math.max(2, Math.ceil(totalMins / 60));

    // Interview frequency
    const freqCounts: Record<string, number> = { "very-high": 0, high: 0, medium: 0, low: 0 };
    topicQuestions.forEach((q) => {
      const f = q.interviewFrequency || "medium";
      freqCounts[f] = (freqCounts[f] || 0) + 1;
    });
    
    let dominantFreq: "very-high" | "high" | "medium" | "low" = "medium";
    let maxCount = -1;
    for (const freq of ["very-high", "high", "medium", "low"] as const) {
      if (freqCounts[freq] > maxCount) {
        maxCount = freqCounts[freq];
        dominantFreq = freq;
      }
    }
    topic.interviewFrequency = dominantFreq;

    // Importance score
    topic.importanceScore = dominantFreq === "very-high" ? 95 : dominantFreq === "high" ? 85 : dominantFreq === "medium" ? 70 : 50;

    // Tier mapping
    topic.tier = (dominantFreq === "very-high" || dominantFreq === "high") ? "must" : dominantFreq === "medium" ? "important" : "optional";

    // Overview update
    const patternStr = topic.patterns.length > 0 ? `covering patterns like ${topic.patterns.slice(0, 3).join(", ")}` : "covering core algorithmic patterns";
    topic.overview = `Dynamic DSA roadmap section for ${topic.name} ${patternStr}. Contains ${topicQuestions.length} curated problems.`;
  });

  // Dynamic Chaining
  topics.sort((a, b) => a.difficulty - b.difficulty || a.name.localeCompare(b.name));
  for (let i = 1; i < topics.length; i++) {
    topics[i].unlockAfterTopicId = topics[i - 1].id;
  }

  // Parse remaining datasets
  const mockTests = mockRows.map(rowToMockTest).filter((m) => m !== null);
  const companies = companyRows.map(rowToCompany).filter((c) => c !== null);
  const aptitudeTopics = aptitudeRows.map(rowToAptitudeTopic).filter((a) => a !== null);

  const aptitudeConfig: Record<string, string> = {};
  aptitudeConfigRows.forEach((r) => {
    if (r.key) aptitudeConfig[r.key] = r.value;
  });

  const revisionCycles = revisionRows.map((r) => ({
    cycle: r.cycle || "",
    action: r.action || "",
  }));

  const weeklyPlan = weeklyRows.map((r) => ({
    week: Number(r.week) || 0,
    focus: r.focus || "",
    hours: r.hours || "",
    days: (r.days || "").split("|").filter(Boolean),
  }));

  // Create the final datasets
  const loadedAt = new Date().toISOString();
  const manifest = listSheetManifest();

  const platformData = {
    questions,
    topics,
    mockTests,
    companies,
    aptitudeTopics,
    aptitudeConfig,
    revisionCycles,
    weeklyPlan,
    manifest,
    loadedAt,
    validationIssues,
  };

  const analytics = {
    mockTests,
    companies,
    aptitudeTopics,
    aptitudeConfig,
    revisionCycles,
    weeklyPlan,
    manifest,
    loadedAt,
    validationIssues,
  };

  // Ensure output directory exists
  const outputDir = path.join(__dirname, "..", "generated");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created generated directory: ${outputDir}`);
  }

  // Write files
  fs.writeFileSync(path.join(outputDir, "questions.json"), JSON.stringify(questions, null, 2), "utf-8");
  fs.writeFileSync(path.join(outputDir, "topics.json"), JSON.stringify(topics, null, 2), "utf-8");
  fs.writeFileSync(path.join(outputDir, "analytics.json"), JSON.stringify(analytics, null, 2), "utf-8");
  fs.writeFileSync(path.join(outputDir, "platform-data.json"), JSON.stringify(platformData, null, 2), "utf-8");

  console.log("💾 JSON datasets successfully generated and optimized:");
  console.log(`   - generated/questions.json (${questions.length} questions)`);
  console.log(`   - generated/topics.json (${topics.length} topics)`);
  console.log(`   - generated/analytics.json (all metadata)`);
  console.log(`   - generated/platform-data.json (full cached object)`);
  console.log("✅ Synchronization complete.");
}

main();
