import fs from "fs";
import path from "path";
import { parseSheetFile, loadAllQuestions, findSheetFile, listSheetManifest, slugify } from "../src/lib/sheets/parser";
import { validateDSAQuestionRows } from "../src/lib/sheets/validators";
import {
  rowToDSAQuestion,
  rowToDSATopic,
  rowToCompany,
  rowToAptitudeTopic,
  rowToMockTest,
  rowToResource,
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

function cleanUrl(url: string | undefined): string {
  if (!url) return "";
  let u = url.trim();
  if (u.includes("google.com/url?q=")) {
    try {
      const urlObj = new URL(u);
      const q = urlObj.searchParams.get("q");
      if (q) u = q;
    } catch (e) {}
  }
  u = u.toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");
  return u;
}

function getExternalId(url: string | undefined): string {
  const cleaned = cleanUrl(url);
  if (!cleaned) return "";
  if (cleaned.includes("google.com/search")) return "";
  const segments = cleaned.split("/").filter(Boolean);
  if (segments.length > 0) {
    return segments[segments.length - 1];
  }
  return "";
}

function getLeetcodeId(url: string | undefined): string {
  const cleaned = cleanUrl(url);
  if (!cleaned || !cleaned.includes("leetcode.com")) return "";
  const match = cleaned.match(/problems\/([a-zA-Z0-9\-]+)/);
  return match ? match[1] : "";
}

function getGfgId(url: string | undefined): string {
  const cleaned = cleanUrl(url);
  if (!cleaned || !cleaned.includes("geeksforgeeks.org")) return "";
  const match = cleaned.match(/problems\/([a-zA-Z0-9\-]+)/);
  return match ? match[1] : "";
}

function isDuplicate(a: DSAQuestion, b: DSAQuestion): boolean {
  if (a.title.trim().toLowerCase() === b.title.trim().toLowerCase()) return true;

  const normA = a.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normB = b.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normA && normB && normA === normB) return true;

  const slugA = a.slug || slugify(a.title);
  const slugB = b.slug || slugify(b.title);
  if (slugA && slugB && slugA === slugB) return true;

  const aUrlClean = cleanUrl(a.url);
  const bUrlClean = cleanUrl(b.url);
  const isGoogleA = aUrlClean.includes("google.com/search");
  const isGoogleB = bUrlClean.includes("google.com/search");

  if (aUrlClean && bUrlClean && !isGoogleA && !isGoogleB) {
    if (aUrlClean === bUrlClean) return true;

    const lcA = getLeetcodeId(a.url);
    const lcB = getLeetcodeId(b.url);
    if (lcA && lcB && lcA === lcB) return true;

    const gfgA = getGfgId(a.url);
    const gfgB = getGfgId(b.url);
    if (gfgA && gfgB && gfgA === gfgB) return true;

    const extA = getExternalId(a.url);
    const extB = getExternalId(b.url);
    if (extA && extB && extA === extB) return true;
  }
  return false;
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
  const resourceRows = parseSheetFile(findSheetFile("companies/resources.csv"));

  // Check if DSA SHEET.xlsx exists and load it separately
  const dsaSheetPath = findSheetFile("DSA SHEET.xlsx") || findSheetFile("dsa-sheet.xlsx");
  let dsaSheetQuestions: DSAQuestion[] = [];
  let dsaSheetRawRowsCount = 0;

  if (dsaSheetPath) {
    const dsaSheetRows = parseSheetFile(dsaSheetPath);
    dsaSheetRawRowsCount = dsaSheetRows.length;
    dsaSheetQuestions = dsaSheetRows
      .map(rowToDSAQuestion)
      .filter((q): q is DSAQuestion => q !== null);
  } else {
    console.warn("⚠️  DSA SHEET.xlsx not found in sheet roots.");
  }

  // Check if Striver Sheet.xlsx exists and load it separately
  const striverSheetPath = findSheetFile("Striver Sheet.xlsx") || findSheetFile("striver-sheet.xlsx");
  let striverSheetQuestions: DSAQuestion[] = [];
  let striverSheetRawRowsCount = 0;

  if (striverSheetPath) {
    const striverSheetRows = parseSheetFile(striverSheetPath);
    striverSheetRawRowsCount = striverSheetRows.length;
    striverSheetQuestions = striverSheetRows
      .map(rowToDSAQuestion)
      .filter((q): q is DSAQuestion => q !== null);
  } else {
    console.warn("⚠️  Striver Sheet.xlsx not found in sheet roots.");
  }

  console.log(`📊 Loaded raw data:`);
  console.log(`   - Questions rows (existing): ${questionRows.length}`);
  console.log(`   - Questions discovered in DSA SHEET: ${dsaSheetQuestions.length}`);
  console.log(`   - Questions discovered in Striver Sheet: ${striverSheetQuestions.length}`);
  console.log(`   - Mock test rows: ${mockRows.length}`);
  console.log(`   - Company profile rows: ${companyRows.length}`);
  console.log(`   - Aptitude topic rows: ${aptitudeRows.length}`);
  console.log(`   - Aptitude config rows: ${aptitudeConfigRows.length}`);
  console.log(`   - Revision cycles: ${revisionRows.length}`);
  console.log(`   - Weekly plan weeks: ${weeklyRows.length}`);
  console.log(`   - Resource rows: ${resourceRows.length}`);

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

  // Load topics from topics.csv as the absolute source of truth
  const topicRows = parseSheetFile(findSheetFile("dsa/topics.csv"));
  console.log(`   - Loaded topics from topics.csv: ${topicRows.length}`);

  // Transform raw rows into typed objects
  const baseQuestions = questionRows
    .map(rowToDSAQuestion)
    .filter((q): q is DSAQuestion => q !== null);

  // Merge datasets using duplicate detection
  const questions = [...baseQuestions];
  let newQuestionsAdded = 0;
  let duplicatesSkipped = 0;

  const mergeCandidate = (candidate: DSAQuestion) => {
    const existingIdx = questions.findIndex((eq) => isDuplicate(eq, candidate));
    if (existingIdx !== -1) {
      duplicatesSkipped++;
      const existing = questions[existingIdx];
      // Reconcile/accumulate additional topics
      if (candidate.topicId && candidate.topicId !== existing.topicId) {
        if (!existing.additionalTopicIds) {
          existing.additionalTopicIds = [];
        }
        if (!existing.additionalTopicIds.includes(candidate.topicId)) {
          existing.additionalTopicIds.push(candidate.topicId);
        }
      }
    } else {
      newQuestionsAdded++;
      questions.push(candidate);
    }
  };

  for (const candidate of dsaSheetQuestions) {
    mergeCandidate(candidate);
  }

  for (const candidate of striverSheetQuestions) {
    mergeCandidate(candidate);
  }

  console.log(`\n📊 Sync Summary:`);
  console.log(`   - Existing question count: ${baseQuestions.length}`);
  console.log(`   - Questions discovered in DSA SHEET: ${dsaSheetQuestions.length}`);
  console.log(`   - Questions discovered in Striver Sheet: ${striverSheetQuestions.length}`);
  console.log(`   - New questions added: ${newQuestionsAdded}`);
  console.log(`   - Duplicate questions skipped: ${duplicatesSkipped}`);
  console.log(`   - Final total count: ${questions.length}\n`);

  // Initialize topicsMap from canonical topics.csv
  const topicsMap = new Map<string, DSATopicMeta>();
  topicRows.forEach((row) => {
    const topic = rowToDSATopic(row);
    if (topic) {
      topicsMap.set(topic.id, topic);
    }
  });

  // Populate patterns for each topic from the parsed questions
  questions.forEach((q) => {
    const topicId = q.topicId;
    if (!topicId) return;

    // Ensure we handle the topic if it exists in the canonical set
    const tMeta = topicsMap.get(topicId);
    if (tMeta) {
      if (q.pattern && q.pattern !== "General" && !tMeta.patterns.includes(q.pattern)) {
        tMeta.patterns.push(q.pattern);
      }
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

  // Sort topics by their original order in topics.csv to preserve the curriculum flow
  const topicOrder = topicRows.map((r) => r.id).filter(Boolean);
  topics.sort((a, b) => topicOrder.indexOf(a.id) - topicOrder.indexOf(b.id));

  // Parse remaining datasets
  const mockTests = mockRows.map(rowToMockTest).filter((m) => m !== null);
  const companies = companyRows.map(rowToCompany).filter((c) => c !== null);
  const aptitudeTopics = aptitudeRows.map(rowToAptitudeTopic).filter((a) => a !== null);
  const resources = resourceRows.map(rowToResource).filter((r) => r !== null);

  const aptitudeConfig: Record<string, string> = {};
  aptitudeConfigRows.forEach((r) => {
    if (r.key) aptitudeConfig[r.key] = r.value;
  });

  const revisionCycles = revisionRows.map((r) => ({
    cycle: r.cycle || "",
    action: r.action || "",
  }));

  const weeklyPlan = weeklyRows
    .map((r) => ({
      week: parseInt(r.week, 10),
      focus: r.focus || "",
      hours: r.hours || "",
      days: (r.days || "").split("|").filter(Boolean),
    }))
    .filter((w) => !isNaN(w.week) && w.week > 0);

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
    resources,
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
    resources,
  };

  // DATA INTEGRITY SAFEGUARDS
  console.log("🛡️ Running data integrity safeguards...");

  // Check 1: Existing Question Count Preserved
  if (questions.length < baseQuestions.length) {
    console.error(`❌ Data integrity error: Question count decreased! Original: ${baseQuestions.length}, New: ${questions.length}`);
    process.exit(1);
  }

  // Check 2: Existing IDs, Slugs, and Titles Unchanged
  for (const eq of baseQuestions) {
    const mq = questions.find((q) => q.id === eq.id);
    if (!mq) {
      console.error(`❌ Data integrity error: Existing ID "${eq.id}" ("${eq.title}") was deleted or renamed!`);
      process.exit(1);
    }
    if (mq.title !== eq.title) {
      console.error(`❌ Data integrity error: Title changed for ID "${eq.id}"! Original: "${eq.title}", New: "${mq.title}"`);
      process.exit(1);
    }
    if (cleanUrl(mq.url) !== cleanUrl(eq.url)) {
      console.error(`❌ Data integrity error: URL changed for ID "${eq.id}"! Original: "${eq.url}", New: "${mq.url}"`);
      process.exit(1);
    }
  }

  console.log("✅ Data integrity checks passed. All existing IDs, slugs, and titles are preserved.");

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
