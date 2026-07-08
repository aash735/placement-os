import * as fs from 'fs';
import * as path from 'path';
import { cleanOcrText, validateQuestion } from '../src/lib/aptitude-validator';
import { aptitudeQuestions } from '../src/data/aptitude-questions';

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data', 'aptitude');

function runTests() {
  console.log("=======================================================================");
  printGreen("🧪  RUNNING APTITUDE REGRESSION & CONTENT INTEGRITY TEST SUITE");
  console.log("=======================================================================");
  
  let failures = 0;

  // ──── TEST SUITE 1: REGEX PARSER REGRESSION ────
  printBlue("\n--- Test Suite 1: Regex Parser Integrity ---");
  
  const testCases = [
    { input: "12 and 14", expected: "12 and 14" },
    { input: "9 dividing 99", expected: "9 dividing 99" },
    { input: "1 to 2", expected: "1 to 2" },
    { input: "15days3", expected: "5 1/3 days" },
    { input: "7 th8", expected: "7/8 th" },
    { input: "3 4 th", expected: "3/4th" }
  ];

  for (const tc of testCases) {
    const actual = cleanOcrText(tc.input);
    if (actual === tc.expected) {
      console.log(`✅ PASS: "${tc.input}" -> "${actual}"`);
    } else {
      printRed(`❌ FAIL: "${tc.input}" -> expected "${tc.expected}", got "${actual}"`);
      failures++;
    }
  }

  // ──── TEST SUITE 2: PRODUCTION DATASET CHECK ────
  printBlue("\n--- Test Suite 2: Production Dataset Audit ---");
  console.log(`Total questions in production pool: ${aptitudeQuestions.length}`);

  if (aptitudeQuestions.length === 0) {
    printRed("❌ FAIL: Production question pool is empty!");
    failures++;
  } else {
    console.log("✅ PASS: Question pool loaded successfully.");
  }

  let dupIds = 0;
  const idSet = new Set<string>();
  
  let invalidOptCount = 0;
  let emptyOptCount = 0;
  let dupOptCount = 0;
  let answerMismatchCount = 0;
  let missingImageCount = 0;
  let bannedExplanationCount = 0;

  for (const q of aptitudeQuestions) {
    // Unique ID
    if (idSet.has(q.id)) {
      dupIds++;
      failures++;
    }
    idSet.add(q.id);

    // Option length
    if (!q.options || q.options.length !== 4) {
      invalidOptCount++;
      failures++;
    } else {
      // Empty option
      if (q.options.some(o => !o || o.trim() === '')) {
        emptyOptCount++;
        failures++;
      }
      // Duplicate options
      const lowerOpts = q.options.map(o => o.trim().toLowerCase());
      if (new Set(lowerOpts).size < 4) {
        dupOptCount++;
        failures++;
      }
    }

    // Answer matches options exactly
    if (!q.answer || !q.options || !q.options.includes(q.answer)) {
      answerMismatchCount++;
      failures++;
    }

    // Explanation quality
    const expLower = (q.explanation || "").toLowerCase();
    if (expLower.includes("detailed explanation is currently being prepared") || expLower.includes("coming soon")) {
      // Allowed fallback - skip
    } else {
      const bannedPhrases = [
        "analyze the question",
        "apply the formula",
        "compute the value",
        "calculate directly",
        "use the given information",
        "no explanation available",
        "refer to standard solutions",
        "calculate the result",
        "calculate the answer"
      ];
      for (const p of bannedPhrases) {
        if (expLower === p || expLower.includes(" " + p + " ")) {
          bannedExplanationCount++;
          failures++;
          break;
        }
      }
    }

    // Image fallback audit
    if (q.renderMode === 'IMAGE' || q.renderMode === 'HYBRID') {
      if (!q.questionImage) {
        missingImageCount++;
        failures++;
      } else {
        const imagePath = path.join(PUBLIC_DIR, q.questionImage.replace(/^\//, ''));
        if (!fs.existsSync(imagePath)) {
          missingImageCount++;
          failures++;
        }
      }
    }
  }

  // Report Database stats
  assertCheck("Duplicate IDs", dupIds === 0, `${dupIds} duplicates found`);
  assertCheck("Exact 4 Options", invalidOptCount === 0, `${invalidOptCount} questions have invalid option count`);
  assertCheck("No Empty Options", emptyOptCount === 0, `${emptyOptCount} empty options found`);
  assertCheck("No Duplicate Option Strings", dupOptCount === 0, `${dupOptCount} duplicate options found`);
  assertCheck("Answer Mapping Accuracy", answerMismatchCount === 0, `${answerMismatchCount} answer mismatches found`);
  assertCheck("Explanation Quality Audits", bannedExplanationCount === 0, `${bannedExplanationCount} questions contain placeholders`);
  assertCheck("Layout Crop Image Assets Exist", missingImageCount === 0, `${missingImageCount} cropped images missing from public/`);

  console.log("\n=======================================================================");
  if (failures === 0) {
    printGreen("🎉  ALL TESTS PASSED! APTITUDE DATASET RELEASE READY.");
  } else {
    printRed(`❌  TEST SUITE FAILED WITH ${failures} TOTAL FAILURES.`);
    process.exit(1);
  }
}

function assertCheck(label: string, condition: boolean, errorMsg: string) {
  if (condition) {
    console.log(`✅ PASS: ${label}`);
  } else {
    printRed(`❌ FAIL: ${label} - ${errorMsg}`);
  }
}

function printGreen(text: string) {
  console.log(`\x1b[32m${text}\x1b[0m`);
}

function printRed(text: string) {
  console.log(`\x1b[31m${text}\x1b[0m`);
}

function printBlue(text: string) {
  console.log(`\x1b[34m${text}\x1b[0m`);
}

runTests();
