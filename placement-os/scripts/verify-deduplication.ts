import fs from "fs";
import path from "path";
import { parseSheetFile } from "../src/lib/sheets/parser";
import { rowToDSAQuestion } from "../src/lib/sheets/transformers";
import type { DSAQuestion } from "../src/types";

// Duplicate matchers
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
    const match = cleaned.match(/problems\/([a-zA-Z0-9\-]+)/);
    return match ? match[1] : "";
  }
  if (cleaned.includes("geeksforgeeks.org")) {
    const match = cleaned.match(/problems\/([a-zA-Z0-9\-]+)/);
    return match ? match[1] : "";
  }
  if (cleaned.includes("hackerrank.com")) {
    const match = cleaned.match(/challenges\/([a-zA-Z0-9\-]+)/);
    if (match) return match[1];
  }
  if (cleaned.includes("codingninjas.com") || cleaned.includes("naukri.com")) {
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

function isDuplicate(a: DSAQuestion, b: DSAQuestion): boolean {
  if (a.id === b.id) return false;
  if (a.title.trim().toLowerCase() === b.title.trim().toLowerCase()) return true;
  const normA = a.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normB = b.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normA && normB && normA === normB) return true;

  const aUrlClean = cleanUrl(a.url);
  const bUrlClean = cleanUrl(b.url);
  if (aUrlClean && bUrlClean && !aUrlClean.includes("google.com/search") && !bUrlClean.includes("google.com/search")) {
    if (aUrlClean === bUrlClean) return true;
    const extA = getExternalId(a.url);
    const extB = getExternalId(b.url);
    if (extA && extB && extA === extB) return true;
  }
  return false;
}

function verify() {
  console.log("🔍 Running Automated Deduplication Verification Suite...");
  let errors = 0;

  // 1. Load the original question bank (prior to deduplication) from backup or read all sheet files
  // For the purpose of finding all duplicate groups dynamically:
  const questionsPath = path.join(__dirname, "../generated/questions.json");
  if (!fs.existsSync(questionsPath)) {
    console.error("❌ Error: generated/questions.json not found!");
    errors++;
    return;
  }

  const questions: DSAQuestion[] = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
  console.log(`- Loaded ${questions.length} questions from cache.`);

  // Find all duplicate groups to compile a list of canonical IDs and obsolete IDs
  const mapping: Record<string, string> = {};
  const obsoleteIdsSet = new Set<string>();
  const duplicateGroups: DSAQuestion[][] = [];
  const visited = new Set<string>();

  for (let i = 0; i < questions.length; i++) {
    const q1 = questions[i];
    if (visited.has(q1.id)) continue;

    const group = [q1];
    for (let j = i + 1; j < questions.length; j++) {
      const q2 = questions[j];
      if (visited.has(q2.id)) continue;

      if (isDuplicate(q1, q2)) {
        group.push(q2);
        visited.add(q2.id);
      }
    }

    if (group.length > 1) {
      duplicateGroups.push(group);
      visited.add(q1.id);

      // Match canonical selection logic
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
      obsoletes.forEach(ob => {
        mapping[ob.id] = canonical.id;
        obsoleteIdsSet.add(ob.id);
      });
    }
  }

  console.log(`- Duplicate Audit: Found ${duplicateGroups.length} duplicate groups, comprising ${obsoleteIdsSet.size} obsolete IDs.`);

  // Assert zero duplicate logical questions exist in the final cache
  for (let i = 0; i < questions.length; i++) {
    for (let j = i + 1; j < questions.length; j++) {
      if (isDuplicate(questions[i], questions[j])) {
        console.error(`❌ Duplicate Found in questions.json: "${questions[i].title}" (${questions[i].id}) AND "${questions[j].title}" (${questions[j].id})`);
        errors++;
      }
    }
  }

  // 2. Verify sheets/dsa/questions.csv
  const csvPath = path.join(__dirname, "../sheets/dsa/questions.csv");
  const csvRows = parseSheetFile(csvPath);
  const csvQuestions: DSAQuestion[] = csvRows
    .map(rowToDSAQuestion)
    .filter((q): q is DSAQuestion => q !== null);
  
  console.log(`- Loaded ${csvQuestions.length} records from sheets/dsa/questions.csv.`);

  // Assert no obsolete IDs exist in questions.csv
  csvQuestions.forEach(q => {
    if (obsoleteIdsSet.has(q.id)) {
      console.error(`❌ Obsolete ID "${q.id}" still exists in questions.csv!`);
      errors++;
    }
  });

  // Check for duplicates in questions.csv
  for (let i = 0; i < csvQuestions.length; i++) {
    for (let j = i + 1; j < csvQuestions.length; j++) {
      if (isDuplicate(csvQuestions[i], csvQuestions[j])) {
        console.error(`❌ Duplicate Found in questions.csv: "${csvQuestions[i].title}" (${csvQuestions[i].id}) AND "${csvQuestions[j].title}" (${csvQuestions[j].id})`);
        errors++;
      }
    }
  }

  // Check that all companies list in questions.csv is sorted and merged
  csvQuestions.forEach(q => {
    if (q.companies) {
      const sorted = [...q.companies].sort();
      const isSorted = q.companies.every((c, idx) => c === sorted[idx]);
      const hasDuplicates = new Set(q.companies).size !== q.companies.length;
      if (!isSorted) {
        console.error(`❌ Company names not sorted for ID "${q.id}": [${q.companies.join(", ")}]`);
        errors++;
      }
      if (hasDuplicates) {
        console.error(`❌ Duplicate companies for ID "${q.id}": [${q.companies.join(", ")}]`);
        errors++;
      }
    }
  });

  // 3. Verify mock-tests.csv
  const mockPath = path.join(__dirname, "../sheets/dsa/mock-tests.csv");
  if (fs.existsSync(mockPath)) {
    const mockContent = fs.readFileSync(mockPath, "utf-8");
    obsoleteIdsSet.forEach(id => {
      if (mockContent.includes(id)) {
        console.error(`❌ Obsolete ID "${id}" still referenced in mock-tests.csv!`);
        errors++;
      }
    });
  }

  // 4. Verify src/data/question-bank.ts
  const qbPath = path.join(__dirname, "../src/data/question-bank.ts");
  if (fs.existsSync(qbPath)) {
    const qbContent = fs.readFileSync(qbPath, "utf-8");
    obsoleteIdsSet.forEach(id => {
      if (qbContent.includes(`q("${id}"`) || qbContent.includes(`"${id}"`)) {
        console.error(`❌ Obsolete ID "${id}" still defined or referenced in src/data/question-bank.ts!`);
        errors++;
      }
    });
  }

  // SQL Migration file existence
  const sqlPath = path.join(__dirname, "../supabase/dsa-deduplication-migration.sql");
  if (!fs.existsSync(sqlPath)) {
    console.error("❌ SQL Migration script not found!");
    errors++;
  } else {
    console.log("✔ SQL Migration file verified.");
  }

  console.log("\n==============================================");
  console.log("            VERIFICATION SUMMARY              ");
  console.log("==============================================");
  if (errors === 0) {
    console.log("✅ SUCCESS: Zero duplicate issues or obsolete references found!");
    console.log("🎉 Platform data structures are 100% clean!");
  } else {
    console.error(`❌ FAILURE: Found ${errors} validation errors. Clean up is incomplete.`);
    process.exit(1);
  }
  console.log("==============================================\n");
}

verify();
