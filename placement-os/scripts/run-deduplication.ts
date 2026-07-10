import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { parseSheetFile, loadAllQuestions, findSheetFile } from "../src/lib/sheets/parser";
import { rowToDSAQuestion } from "../src/lib/sheets/transformers";
import type { DSAQuestion } from "../src/types";

// ==========================================
// HELPERS FOR DUPLICATE MATCHING
// ==========================================

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
  
  if (cleaned.includes("leetcode.com")) {
    return getLeetcodeId(url);
  }
  if (cleaned.includes("geeksforgeeks.org")) {
    return getGfgId(url);
  }
  if (cleaned.includes("hackerrank.com")) {
    const match = cleaned.match(/challenges\/([a-zA-Z0-9\-]+)/);
    if (match) return match[1];
  }
  if (cleaned.includes("codingninjas.com") || cleaned.includes("naukri.com")) {
    const match = cleaned.match(/problems\/([a-zA-Z0-9\-]+)/);
    if (match) return match[1];
  }
  if (cleaned.includes("codechef.com")) {
    const match = cleaned.match(/problems\/([a-zA-Z0-9\-]+)/);
    if (match) return match[1];
  }

  const segments = cleaned.split("/").filter(Boolean);
  if (segments.length > 0) {
    let last = segments[segments.length - 1];
    const ignored = new Set(["problem", "problems", "practice", "challenge", "challenges", "solution", "solutions", "1", "2", "3", "0"]);
    if (ignored.has(last) && segments.length > 1) {
      last = segments[segments.length - 2];
    }
    if (last && last.length > 2 && !last.match(/^\d+$/) && !ignored.has(last)) {
      return last;
    }
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
  if (a.id === b.id) return false;

  // 1. Title match
  if (a.title.trim().toLowerCase() === b.title.trim().toLowerCase()) return true;

  const normA = a.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normB = b.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normA && normB && normA === normB) return true;

  // 2. URL and Platform matches
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

  // 3. Alternative URL match
  const aAltClean = cleanUrl(a.altUrl);
  const bAltClean = cleanUrl(b.altUrl);
  if (aAltClean && bAltClean && aAltClean === bAltClean && !aAltClean.includes("google.com/search")) {
    return true;
  }

  return false;
}

function normalizeCompanyName(name: string): string {
  const clean = name.trim();
  if (!clean) return "";
  if (clean.length <= 1) return "";
  if (/^(in|at|of|and|or|for|the|a|an|is|by|to|on|all|mnc|mncs|all mnc|all mncs)$/i.test(clean)) return "";
  const lower = clean.toLowerCase();
  const map: Record<string, string> = {
    google: "Google",
    amazon: "Amazon",
    microsoft: "Microsoft",
    facebook: "Facebook",
    meta: "Meta",
    apple: "Apple",
    uber: "Uber",
    adobe: "Adobe",
    cisco: "Cisco",
    linkedin: "LinkedIn",
    tcs: "TCS",
    infosys: "Infosys",
    wipro: "Wipro",
    cognizant: "Cognizant",
    accenture: "Accenture",
    capgemini: "Capgemini",
    goldman: "Goldman Sachs",
    "goldman sachs": "Goldman Sachs",
    "d-e-shaw": "D.E. Shaw",
    "de shaw": "D.E. Shaw",
    "d.e. shaw": "D.E. Shaw",
    "d.e.shaw": "D.E. Shaw",
    maq: "MAQ Software",
    "maq software": "MAQ Software",
    software: "",
    netflix: "Netflix",
    hike: "Hike",
    flipkart: "Flipkart",
    directi: "Directi",
    paytm: "Paytm",
    zomato: "Zomato",
    swiggy: "Swiggy",
    grofers: "Grofers",
    ola: "Ola",
    dunzo: "Dunzo",
    meesho: "Meesho",
    myntra: "Myntra",
    nagarro: "Nagarro",
    atlassian: "Atlassian",
    zoho: "Zoho",
    visa: "Visa",
    paypal: "PayPal",
    twitter: "Twitter",
    snap: "Snap",
    spotify: "Spotify",
    airbnb: "Airbnb",
    "morgan stanley": "Morgan Stanley",
    "media.net": "Media.net",
    "societe generale": "Societe Generale",
    makemytrip: "MakeMyTrip",
    factset: "FactSet",
    "streaminoid technologies": "Streamoid Technologies",
    "streamoid technologies": "Streamoid Technologies",
    walmart: "Walmart",
    samsung: "Samsung",
    oracle: "Oracle",
    salesforce: "Salesforce",
    amdocs: "Amdocs",
  };
  if (map[lower] !== undefined) return map[lower];
  // Capitalize properly
  return clean
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function mergeCompanies(group: DSAQuestion[]): string[] {
  const all: string[] = [];
  group.forEach(q => {
    if (q.companies) {
      q.companies.forEach(c => {
        const norm = normalizeCompanyName(c);
        if (norm && !all.includes(norm)) all.push(norm);
      });
    }
  });
  if (all.length === 0) return ["All"];
  return all.sort();
}

function mergeFrequency(group: DSAQuestion[]): "very-high" | "high" | "medium" | "low" {
  const priority = ["very-high", "high", "medium", "low"] as const;
  let best: "very-high" | "high" | "medium" | "low" = "medium";
  let bestIdx = Infinity;
  group.forEach(q => {
    const f = q.interviewFrequency;
    if (f) {
      const idx = priority.indexOf(f);
      if (idx !== -1 && idx < bestIdx) {
        bestIdx = idx;
        best = f;
      }
    }
  });
  return best;
}

function mergePriority(group: DSAQuestion[]): "critical" | "high" | "medium" | "low" {
  const priority = ["critical", "high", "medium", "low"] as const;
  let best: "critical" | "high" | "medium" | "low" = "medium";
  let bestIdx = Infinity;
  group.forEach(q => {
    const p = q.revisionPriority;
    if (p) {
      const idx = priority.indexOf(p);
      if (idx !== -1 && idx < bestIdx) {
        bestIdx = idx;
        best = p;
      }
    }
  });
  return best;
}

function main() {
  console.log("⚡ Starting DSA Question Deduplication Engine...");

  const csvPath = path.join(__dirname, "../sheets/dsa/questions.csv");
  const backupPath = csvPath + ".bak";
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, csvPath);
    console.log("Restored original questions.csv from backup to ensure clean duplicate detection.");
  }

  // Load all raw questions from the sheets directly
  const questionRows = loadAllQuestions();
  const baseQuestions = questionRows
    .map(rowToDSAQuestion)
    .filter((q): q is DSAQuestion => q !== null);
  
  const allQuestions = [...baseQuestions];
  
  const dsaSheetPath = findSheetFile("DSA SHEET.xlsx") || findSheetFile("dsa-sheet.xlsx");
  if (dsaSheetPath) {
    const dsaSheetRows = parseSheetFile(dsaSheetPath);
    const dsaSheetQuestions = dsaSheetRows.map(rowToDSAQuestion).filter((q): q is DSAQuestion => q !== null);
    allQuestions.push(...dsaSheetQuestions);
  }
  
  const striverSheetPath = findSheetFile("Striver Sheet.xlsx") || findSheetFile("striver-sheet.xlsx");
  if (striverSheetPath) {
    const striverSheetRows = parseSheetFile(striverSheetPath);
    const striverSheetQuestions = striverSheetRows.map(rowToDSAQuestion).filter((q): q is DSAQuestion => q !== null);
    allQuestions.push(...striverSheetQuestions);
  }

  const arshSheetPath = findSheetFile("DSA Sheet by Arsh (45-60 Days Plan).xlsx") || findSheetFile("dsa-sheet-by-arsh.xlsx");
  if (arshSheetPath) {
    const arshSheetRows = parseSheetFile(arshSheetPath);
    const arshSheetQuestions = arshSheetRows.map(rowToDSAQuestion).filter((q): q is DSAQuestion => q !== null);
    allQuestions.push(...arshSheetQuestions);
  }

  console.log(`Loaded ${allQuestions.length} raw questions from all sheet files directly.`);

  const duplicateGroups: DSAQuestion[][] = [];
  const visited = new Set<string>();

  for (let i = 0; i < allQuestions.length; i++) {
    const q1 = allQuestions[i];
    if (visited.has(q1.id)) continue;

    const group = [q1];
    for (let j = i + 1; j < allQuestions.length; j++) {
      const q2 = allQuestions[j];
      if (visited.has(q2.id)) continue;

      if (isDuplicate(q1, q2)) {
        group.push(q2);
        visited.add(q2.id);
      }
    }

    if (group.length > 1) {
      duplicateGroups.push(group);
      visited.add(q1.id);
    }
  }

  console.log(`Found ${duplicateGroups.length} duplicate groups.`);

  // 2. Select canonical ID for each group and build mapping
  const mapping: Record<string, string> = {};
  const canonicalQuestions: DSAQuestion[] = [];

  duplicateGroups.forEach((group) => {
    // Determine canonical ID: prefer nice ID formats (e.g. arr-l1-3) over slugified IDs
    const sorted = [...group].sort((a, b) => {
      const aIsNice = a.id.match(/^[a-z]+-l[1-4]-[0-9]+$/i) || a.id.match(/^[a-z]+-r[0-9]+$/i);
      const bIsNice = b.id.match(/^[a-z]+-l[1-4]-[0-9]+$/i) || b.id.match(/^[a-z]+-r[0-9]+$/i);
      if (aIsNice && !bIsNice) return -1;
      if (!aIsNice && bIsNice) return 1;
      return a.id.localeCompare(b.id);
    });

    const canonical = sorted[0];
    const obsoletes = sorted.slice(1);

    mapping[canonical.id] = canonical.id;
    obsoletes.forEach((ob) => {
      mapping[ob.id] = canonical.id;
    });

    // Merge companies and metadata into canonical
    canonical.companies = mergeCompanies(group);
    canonical.interviewFrequency = mergeFrequency(group);
    canonical.revisionPriority = mergePriority(group);

    // Merge tags
    const allTags = Array.from(new Set(group.flatMap(q => q.tags || []))).sort();
    canonical.tags = allTags;

    // Merge other non-empty properties
    group.forEach(q => {
      if (!canonical.url && q.url) canonical.url = q.url;
      if (!canonical.altUrl && q.altUrl) canonical.altUrl = q.altUrl;
      if (!canonical.neetCodeRef && q.neetCodeRef) canonical.neetCodeRef = q.neetCodeRef;
      if (!canonical.striverRef && q.striverRef) canonical.striverRef = q.striverRef;
      if (!canonical.videoUrl && q.videoUrl) canonical.videoUrl = q.videoUrl;
      if (!canonical.explanationUrl && q.explanationUrl) canonical.explanationUrl = q.explanationUrl;
      if (!canonical.notes && q.notes) canonical.notes = q.notes;
    });

    canonicalQuestions.push(canonical);
  });

  console.log("Canonical mapping constructed successfully.");

  // 3. Write SQL migration script
  const sqlPath = path.join(__dirname, "../supabase/dsa-deduplication-migration.sql");
  let sql = `-- ==========================================
-- PLACEMENT OS — DSA QUESTION DEDUPLICATION MIGRATION
-- Generated Automatically on ${new Date().toISOString()}
-- ==========================================

BEGIN;

-- 1. MOCK TESTS ARRAY REMAPPING
UPDATE public.mock_tests mt
SET question_ids = ARRAY(
  SELECT COALESCE(
    CASE \n`;

  Object.entries(mapping).forEach(([obId, canId]) => {
    if (obId !== canId) {
      sql += `      WHEN x = '${obId}' THEN '${canId}'\n`;
    }
  });

  sql += `      ELSE x
    END, 
    x
  )
  FROM UNNEST(mt.question_ids) WITH ORDINALITY AS u(x, ord)
  ORDER BY ord
)
WHERE mt.question_ids && ARRAY[\n  `;

  const obsoleteIdsList = Object.entries(mapping)
    .filter(([obId, canId]) => obId !== canId)
    .map(([obId]) => `'${obId}'`);

  sql += obsoleteIdsList.join(",\n  ");
  sql += `\n];\n\n`;

  // 2. MOCK INTERVIEWS JSONB REMAPPING
  sql += `-- 2. MOCK INTERVIEWS JSONB REMAPPING
UPDATE public.mock_interviews mi
SET questions = (
  SELECT jsonb_agg(
    CASE \n`;

  Object.entries(mapping).forEach(([obId, canId]) => {
    if (obId !== canId) {
      sql += `      WHEN q->>'id' = '${obId}' THEN q || '{"id": "${canId}"}'::jsonb\n`;
    }
  });

  sql += `      ELSE q
    END
  )
  FROM jsonb_array_elements(mi.questions) q
)
WHERE mi.questions @> ANY(ARRAY[\n  `;

  const jsonbChecks = Object.entries(mapping)
    .filter(([obId, canId]) => obId !== canId)
    .map(([obId]) => `'[{"id": "${obId}"}]'::jsonb`);

  sql += jsonbChecks.join(",\n  ");
  sql += `\n]);\n\n`;

  // 3. BOOKMARKS, REVISION HISTORY, USER PROGRESS
  sql += `-- 3. BOOKMARKS, REVISION HISTORY, USER PROGRESS MERGES\n\n`;

  // Group mappings by canonical ID to construct SQL merges
  const groupsByCanonical: Record<string, string[]> = {};
  Object.entries(mapping).forEach(([obId, canId]) => {
    if (obId !== canId) {
      if (!groupsByCanonical[canId]) groupsByCanonical[canId] = [];
      groupsByCanonical[canId].push(obId);
    }
  });

  Object.entries(groupsByCanonical).forEach(([canId, obs]) => {
    const allIds = [canId, ...obs].map(id => `'${id}'`).join(", ");
    const obsList = obs.map(id => `'${id}'`).join(", ");

    sql += `-- --- Merge Group: ${canId} ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, '${canId}', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN (${allIds})
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN (${obsList});

-- Revision History
UPDATE public.revision_history
SET question_id = '${canId}'
WHERE question_id IN (${obsList});

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  '${canId}',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN (${allIds})
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN (${obsList});

`;
  });

  sql += "COMMIT;\n";

  fs.writeFileSync(sqlPath, sql, "utf-8");
  console.log(`Supabase SQL migration written to ${sqlPath}`);

  // 4. Update sheets/dsa/questions.csv
  const rawRows = parseSheetFile(csvPath);

  // Map raw sheet rows to DSAQuestion for duplicates check
  const sheetQuestions: DSAQuestion[] = rawRows
    .map(rowToDSAQuestion)
    .filter((q): q is DSAQuestion => q !== null);

  const cleanSheetQuestions: DSAQuestion[] = [];
  const processedObs = new Set<string>();

  sheetQuestions.forEach((q) => {
    const mappedId = mapping[q.id] || q.id;
    if (mappedId !== q.id) {
      processedObs.add(q.id);
      return; // Skip obsolete row
    }

    // Merge metadata from all duplicates
    const duplicateGroup = allQuestions.filter(eq => mapping[eq.id] === q.id);
    if (duplicateGroup.length > 0) {
      q.companies = mergeCompanies(duplicateGroup);
      q.interviewFrequency = mergeFrequency(duplicateGroup);
      q.revisionPriority = mergePriority(duplicateGroup);
      q.tags = Array.from(new Set(duplicateGroup.flatMap(eq => eq.tags || []))).sort();
      duplicateGroup.forEach(eq => {
        if (!q.url && eq.url) q.url = eq.url;
        if (!q.altUrl && eq.altUrl) q.altUrl = eq.altUrl;
        if (!q.neetCodeRef && eq.neetCodeRef) q.neetCodeRef = eq.neetCodeRef;
        if (!q.striverRef && eq.striverRef) q.striverRef = eq.striverRef;
        if (!q.videoUrl && eq.videoUrl) q.videoUrl = eq.videoUrl;
        if (!q.explanationUrl && eq.explanationUrl) q.explanationUrl = eq.explanationUrl;
        if (!q.notes && eq.notes) q.notes = eq.notes;
      });
    }

    cleanSheetQuestions.push(q);
  });

  // Convert questions back to SheetRows matching header exactly
  const csvHeaders = [
    "question_id", "title", "url", "platform", "difficulty", "topic", "subtopic", "pattern",
    "companies", "frequency", "estimated_time", "revision_priority", "explanation_url",
    "video_url", "neetcode_ref", "striver_ref", "tags", "xp_reward", "unlock_level",
    "prerequisites", "level", "category", "alt_url"
  ];

  const outputRows = cleanSheetQuestions.map((q) => {
    return {
      question_id: q.id,
      title: q.title,
      url: q.url || "",
      platform: q.platform || "LeetCode",
      difficulty: q.difficulty || "Easy",
      topic: q.topicId || "",
      subtopic: q.subtopic || "",
      pattern: q.pattern || "General",
      companies: q.companies?.join("|") || "All",
      frequency: q.interviewFrequency || "medium",
      estimated_time: q.estimatedMinutes || 25,
      revision_priority: q.revisionPriority || "medium",
      explanation_url: q.explanationUrl || "",
      video_url: q.videoUrl || "",
      neetcode_ref: q.neetCodeRef || "",
      striver_ref: q.striverRef || "",
      tags: q.tags?.join("|") || "",
      xp_reward: q.xpReward || 50,
      unlock_level: q.unlockLevel || 1,
      prerequisites: q.prerequisites?.join("|") || "",
      level: q.level || 1,
      category: q.category || "easy",
      alt_url: q.altUrl || ""
    };
  });

  const ws = XLSX.utils.json_to_sheet(outputRows, { header: csvHeaders });
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  fs.writeFileSync(csvPath, csvContent, "utf-8");
  console.log(`Deduplicated questions.csv successfully rewritten (${cleanSheetQuestions.length} records remain).`);

  // 5. Update sheets/dsa/mock-tests.csv
  const mockPath = path.join(__dirname, "../sheets/dsa/mock-tests.csv");
  if (fs.existsSync(mockPath)) {
    const mockContent = fs.readFileSync(mockPath, "utf-8");
    let cleanMockContent = mockContent;
    Object.entries(mapping).forEach(([obId, canId]) => {
      if (obId !== canId) {
        cleanMockContent = cleanMockContent.replace(new RegExp(obId, "g"), canId);
      }
    });
    fs.writeFileSync(mockPath, cleanMockContent, "utf-8");
    console.log("sheets/dsa/mock-tests.csv updated.");
  }

  // 6. Update src/data/question-bank.ts
  const qbPath = path.join(__dirname, "../src/data/question-bank.ts");
  if (fs.existsSync(qbPath)) {
    const qbContent = fs.readFileSync(qbPath, "utf-8");
    
    // Parse individual lines of q() definitions
    const lines = qbContent.split("\n");
    const cleanLines: string[] = [];
    let insideMockTests = false;

    lines.forEach((line) => {
      // If we are on the mockTestSets line, replace obsolete IDs
      if (line.includes("mockTestSets = [")) {
        insideMockTests = true;
      }
      if (insideMockTests) {
        let modifiedLine = line;
        Object.entries(mapping).forEach(([obId, canId]) => {
          if (obId !== canId) {
            modifiedLine = modifiedLine.replace(new RegExp(`"${obId}"`, "g"), `"${canId}"`);
          }
        });
        cleanLines.push(modifiedLine);
        if (line.includes("];")) {
          insideMockTests = false;
        }
        return;
      }

      const match = line.match(/^\s*q\(\s*"([a-zA-Z0-9\-]+)"/);
      if (match) {
        const id = match[1];
        const canonicalId = mapping[id];
        if (canonicalId && canonicalId !== id) {
          // Obsolete definition, skip it!
          return;
        }
        
        // This is a canonical question. Keep the line unmodified
        cleanLines.push(line);
        return;
      }
      cleanLines.push(line);
    });

    fs.writeFileSync(qbPath, cleanLines.join("\n"), "utf-8");
    console.log("src/data/question-bank.ts updated and cleaned.");
  }

  // 7. Write Audit Report Summary to terminal
  console.log("\n==============================================");
  console.log("            DUPLICATE AUDIT REPORT            ");
  console.log("==============================================");
  console.log(`- Total Questions Before:     ${allQuestions.length}`);
  console.log(`- Duplicate Groups Detected:  ${duplicateGroups.length}`);
  console.log(`- Total Obsolete Records:     ${obsoleteIdsList.length}`);
  console.log(`- Unique Questions After:     ${allQuestions.length - obsoleteIdsList.length}`);
  console.log("==============================================\n");
}

main();
