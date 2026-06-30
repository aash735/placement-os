import { aptitudeQuestions, rejectedAptitudeQuestions } from '../src/data/aptitude-questions';
import { validateQuestion } from '../src/lib/aptitude-validator';
import * as fs from 'fs';
import * as path from 'path';

interface AuditResult {
  id: string;
  question: string;
  category: string;
  topic: string;
  issues: string[];
  explanationLetter?: string;
  answerIndex?: number;
}

const auditResults: AuditResult[] = [];
let totalCount = 0;
let cleanCount = 0;
let corruptedCount = 0;

// Regular expressions to extract the answer letter mentioned in the explanation
const EXP_LETTER_PATTERNS = [
  /correct\s+answer\s+is\s*\(\s*([a-e])\s*\)/i,
  /correct\s+option\s+is\s*\(\s*([a-e])\s*\)/i,
  /answer\s+is\s*\(\s*([a-e])\s*\)/i,
  /ans\.\s*\(\s*([a-e])\s*\)/i,
  /choice\s*\(\s*([a-e])\s*\)/i,
  /\\correct\s+answer\s+is\s*\(\s*([a-e])\s*\)/i,
  /\(\s*([a-e])\s*\)\s*is\s+the\s+correct/i,
  /hence\s*,\s*\(\s*([a-e])\s*\)/i,
];

// Regexp to find corrupted fractions / OCR merging (e.g., "15 days3" or "24 days5")
const CORRUPTED_FRACTION_REGEX = /\b[a-zA-Z]{2,}\d\b/;

const rawAptitudeQuestions = [
  ...aptitudeQuestions,
  ...rejectedAptitudeQuestions.map(r => r.question)
];

for (const q of rawAptitudeQuestions) {
  totalCount++;
  const issues: string[] = [];
  
  // 1. Basic validation from the validator
  const validation = validateQuestion(q);
  if (!validation.valid) {
    issues.push(...validation.issues);
  }
  
  // 2. OCR Option Corruption checks
  if (q.options && Array.isArray(q.options)) {
    for (let i = 0; i < q.options.length; i++) {
      const opt = q.options[i];
      if (opt) {
        // Check for words immediately followed by a single digit at the end of the option
        // e.g. "15 days3" matches "days3"
        const match = opt.match(CORRUPTED_FRACTION_REGEX);
        if (match) {
          issues.push(`Possible corrupted option text at index ${i}: "${opt}" (matched: "${match[0]}")`);
        }
      }
    }
  }
  
  // 3. Explanation Desynchronization check
  let explanationLetter: string | undefined = undefined;
  let answerIndex: number | undefined = undefined;
  
  if (q.explanation && q.options && Array.isArray(q.options)) {
    for (const pattern of EXP_LETTER_PATTERNS) {
      const match = q.explanation.match(pattern);
      if (match) {
        explanationLetter = match[1].toLowerCase();
        break;
      }
    }
    
    if (explanationLetter) {
      const expectedIndex = explanationLetter.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1...
      const actualIndex = q.options.indexOf(q.answer);
      answerIndex = actualIndex;
      
      if (actualIndex !== -1 && actualIndex !== expectedIndex) {
        // Special case: if 5 options were normalized to 4, check if the index shifted or if it's a real mismatch
        issues.push(`Mismatched explanation: explanation mentions option (${explanationLetter}) [expected index ${expectedIndex}], but answer key is at index ${actualIndex} ("${q.answer}")`);
      }
    }
  }
  
  // 4. Data Sufficiency clues clashing with standard questions
  if (q.id && !q.id.includes('sufficiency') && q.explanation) {
    const mentionsStatements = q.explanation.includes('Statement I') || 
                               q.explanation.includes('Statements I and II') ||
                               q.explanation.includes('From I, ') ||
                               q.explanation.includes('From II, ') ||
                               (q.explanation.includes('From I and II') && !q.question.includes('Statement I'));
    if (mentionsStatements && !q.question.includes('Statement I')) {
      issues.push(`Data Sufficiency leak: explanation mentions statements (I, II) but question does not appear to be a Data Sufficiency question`);
    }
  }

  if (issues.length > 0) {
    corruptedCount++;
    auditResults.push({
      id: q.id,
      question: q.question,
      category: q.category,
      topic: q.topic,
      issues,
      explanationLetter,
      answerIndex
    });
  } else {
    cleanCount++;
  }
}

console.log(`\n=== DATASET INTEGRITY AUDIT RESULTS ===`);
console.log(`Total questions scanned: ${totalCount}`);
console.log(`Clean questions: ${cleanCount}`);
console.log(`Corrupted/flagged questions: ${corruptedCount}`);
console.log(`========================================\n`);

// Save report to disk
const reportPath = path.join(__dirname, 'audit_integrity_detailed.json');
fs.writeFileSync(reportPath, JSON.stringify({
  summary: {
    total: totalCount,
    clean: cleanCount,
    corrupted: corruptedCount
  },
  flaggedQuestions: auditResults
}, null, 2));

console.log(`Detailed audit report saved to: ${reportPath}`);
