import type { AptitudeQuestion } from '../data/aptitude-questions';

// PUA character mapping to normal brackets/parentheses
const PUA_MAP: Record<string, string> = {
  '\uf8eb': '(',
  '\uf8f6': ')',
  '\uf8ec': '[',
  '\uf8f7': ']',
  '\uf8ed': '{',
  '\uf8f8': '}',
  '\uf8ee': '(',
  '\uf8f9': ')',
  '\uf8ef': '[',
  '\uf8fa': ']',
  '\uf8f0': '{',
  '\uf8fb': '}'
};

// Regex patterns for OCR garbage, page numbers, chapter headers
const HEADER_FOOTER_PATTERN = /\b\d{2,4}\s*QUANTITATIVE\s+APTITUDE\b|\bQUANTITATIVE\s+APTITUDE\s*\d{2,4}\b|\bQUANTITATIVE\s+APTITUDE\b|\b\d{2,4}\s*HINTS\s+&\s+SOLUTIONS\b|\bHINTS\s+&\s+SOLUTIONS\s*\d{2,4}\b|\b\d{2,4}\s*SOLUTIONS\b|\bSOLUTIONS\s*\d{2,4}\b/gi;
const CHAPTER_LEAK_PATTERN = /\b[A-Z]{3,}\s+\d{2,4}\b/g;
const PUA_PATTERN = /[\uE000-\uF8FF]/g;

/**
 * Cleans OCR noise, replaces PUA characters, and normalizes spacing.
 */
export function cleanOcrText(text: string): string {
  if (!text) return '';
  let cleaned = text;

  // 1. Replace mapped PUA characters
  for (const [pua, val] of Object.entries(PUA_MAP)) {
    cleaned = cleaned.replace(new RegExp(pua, 'g'), val);
  }

  // 2. Remove remaining PUA characters
  cleaned = cleaned.replace(PUA_PATTERN, '');

  // 3. Strip page numbers, headers, footers
  cleaned = cleaned.replace(HEADER_FOOTER_PATTERN, '');
  cleaned = cleaned.replace(CHAPTER_LEAK_PATTERN, '');

  // Rebuild corrupted fractions from OCR layout displacement
  // Pattern 1: e.g. "15 days3" -> "5 1/3 days" or "24 days5" -> "4 2/5 days"
  cleaned = cleaned.replace(/\b(\d)(\d+)\s*([a-zA-Z]+)\s*(\d+)\b/g, (match, num, whole, unit, den) => {
    if (parseInt(num, 10) < parseInt(den, 10)) {
      return `${whole} ${num}/${den} ${unit}`;
    }
    return match;
  });

  // Pattern 2: e.g. "31 4 times" or "17 2" -> "1 3/4 times", "7 1/2"
  cleaned = cleaned.replace(/\b(\d)(\d+)\s+(\d+)\b/g, (match, num, whole, den) => {
    if (parseInt(num, 10) < parseInt(den, 10)) {
      return `${whole} ${num}/${den}`;
    }
    return match;
  });

  // Pattern 3: e.g. "7 th8" -> "7/8 th"
  cleaned = cleaned.replace(/\b(\d+)\s*([a-zA-Z]+)\s*(\d+)\b/g, '$1/$3 $2');
  
  // Pattern 4: e.g. "3 4 th" -> "3/4th"
  cleaned = cleaned.replace(/\b(\d+)\s+(\d+)\s*([a-zA-Z]+)\b/g, '$1/$2$3');

  // 4. Math expression spacing fixes
  cleaned = cleaned.replace(/(\d+)\s+!/g, '$1!'); // spaced factorial "5 !" -> "5!"
  cleaned = cleaned.replace(/(\d+)\s*%/g, '$1%'); // spaced percentage "5 %" -> "5%"
  
  // 5. Standardize currency symbols
  cleaned = cleaned.replace(/Rs\.\s*/g, '₹');
  cleaned = cleaned.replace(/Rs\s+/g, '₹');
  cleaned = cleaned.replace(/Rs\./g, '₹');

  // 6. Clean double/multiple spaces and trim
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  return cleaned.trim();
}

/**
 * P0 RELEASE: Explanation generation is DISABLED.
 * All explanations are replaced with the production-safe static message.
 * This function is retained for API compatibility but always returns the
 * standard P0 replacement text.
 */
export function standardizeExplanation(_explanation: string, _answer: string): string {
  return 'Detailed explanation will be available in a future update.';
}

/**
 * Performs auto-repairs on questions:
 * - OCR cleanup on all text fields.
 * - Quote/spacing mismatches between answer and options.
 * - Normalizes 5-option layouts to exactly 4 options.
 * - P0: Replaces explanation with static production-safe message.
 */
export function autoRepairQuestion(q: AptitudeQuestion): AptitudeQuestion {
  const repaired = { ...q };

  // Initialize missing source IDs
  if (!repaired.optionsSourceId && repaired.id) {
    repaired.optionsSourceId = repaired.id;
  }
  if (!repaired.answerSourceId && repaired.id) {
    repaired.answerSourceId = repaired.id;
  }
  if (!repaired.explanationSourceId && repaired.id) {
    repaired.explanationSourceId = repaired.id;
  }

  // 1. OCR text cleaning on question text, answer and options
  repaired.question = cleanOcrText(repaired.question);
  repaired.answer = cleanOcrText(repaired.answer);
  if (repaired.options && Array.isArray(repaired.options)) {
    repaired.options = repaired.options.map(o => cleanOcrText(o));
  }
  if (repaired.shortcuts && Array.isArray(repaired.shortcuts)) {
    repaired.shortcuts = repaired.shortcuts.map(s => cleanOcrText(s));
  }

  // P0: Explanation generation is DISABLED. Always set the static replacement text.
  repaired.explanation = 'Detailed explanation will be available in a future update.';

  if (!repaired.options || !Array.isArray(repaired.options) || repaired.options.length === 0) {
    return repaired;
  }

  // 2. Align answer string with the corresponding options element
  const trimmedAns = repaired.answer.trim();
  const cleanAns = trimmedAns.toLowerCase().replace(/\s+/g, ' ');

  let matchIndex = repaired.options.indexOf(trimmedAns);
  if (matchIndex === -1) {
    // Relaxed match (spacing, case-insensitive)
    const cleanOpts = repaired.options.map(o => o.trim().toLowerCase().replace(/\s+/g, ' '));
    matchIndex = cleanOpts.indexOf(cleanAns);

    if (matchIndex === -1) {
      // Relaxed match with quotes stripped (e.g. quote mismatches)
      const unquotedAns = cleanAns.replace(/['"]/g, '');
      const unquotedOpts = cleanOpts.map(o => o.replace(/['"]/g, ''));
      matchIndex = unquotedOpts.indexOf(unquotedAns);
    }

    // Apply exact option text to answer if match succeeded
    if (matchIndex !== -1) {
      repaired.answer = repaired.options[matchIndex];
    }
  }

  // 3. Option Count Normalization (5 options -> exactly 4 options)
  if (repaired.options.length === 5) {
    const ansIdx = repaired.options.indexOf(repaired.answer);
    if (ansIdx !== -1) {
      if (ansIdx === 4) {
        // Correct answer is the fifth option. Drop index 3 to keep [0, 1, 2, 4]
        repaired.options = [repaired.options[0], repaired.options[1], repaired.options[2], repaired.options[4]];
      } else {
        // Discard option at index 4 (fifth option)
        repaired.options = repaired.options.slice(0, 4);
      }
    } else {
      // Correct answer is not in options list. Just truncate and let validation fail
      repaired.options = repaired.options.slice(0, 4);
    }
  }

  // Populate schema fields for architectural compatibility
  repaired.correctAnswer = repaired.answer;
  repaired.sourceReference = repaired.sourceFile || repaired.id;

  return repaired;
}



export interface ValidationReport {
  valid: boolean;
  score: number;
  /**
   * VALID          — score >= 95 and zero issues. Safe for production.
   * REVIEW_REQUIRED — score 70–94 or minor non-structural issues. Quarantined.
   * INVALID        — critical structural failure. Quarantined immediately.
   */
  status: 'VALID' | 'REVIEW_REQUIRED' | 'INVALID';
  issues: string[];
  question: AptitudeQuestion;
}
/**
 * Validates a question and calculates its confidence score.
 */
export function validateQuestion(rawQ: AptitudeQuestion): ValidationReport {
  // Apply repairs first
  const q = autoRepairQuestion(rawQ);

  const issues: string[] = [];
  let score = 100;

  // --- 1. Core Structural Validation (Weight: 20%) ---
  if (!q.id) {
    issues.push('Missing ID');
    score = 0; // Fail immediately
  }
  if (!q.options) {
    issues.push('Missing options array');
    score = 0; // Fail immediately
  } else if (!Array.isArray(q.options)) {
    issues.push('Options is not an array');
    score = 0; // Fail immediately
  } else if (q.options.length !== 4) {
    issues.push(`Has ${q.options.length} options instead of exactly 4`);
    score = 0; // Fail immediately
  } else {
    const emptyOptsCount = q.options.filter(o => !o || o.trim() === '').length;
    if (emptyOptsCount > 0) {
      issues.push(`${emptyOptsCount} empty option(s)`);
      score = 0; // Fail immediately
    }
    const garbageOpts = q.options.filter(o => o && (o.trim() === '*' || o.trim() === '.'));
    if (garbageOpts.length > 0) {
      issues.push(`Garbage option values: ${JSON.stringify(garbageOpts)}`);
      score = 0; // Fail immediately
    }
    const trimmedOpts = q.options.map(o => (o || '').trim().toLowerCase());
    const uniqueOpts = new Set(trimmedOpts);
    if (uniqueOpts.size < trimmedOpts.length) {
      issues.push('Duplicate option values');
      score = 0; // Fail immediately
    }
  }

  // --- 2. Question Quality (Weight: 20%) ---
  if (!q.question || q.question.trim().length === 0) {
    issues.push('Empty question text');
    score = 0; // Fail immediately
  } else {
    const qTrim = q.question.trim();
    if (qTrim.length < 15) {
      issues.push('Question text too short (< 15 chars)');
      score -= 20;
    }
    
    // Detect truncation pattern (ends with prepositions/conjunctions or ends with a cut-off word)
    const TRUNCATED_END_REGEX = /\b(and|or|the|of|to|a|an|with|for|at|on|in|by|from|then|if|about)\s*$/i;
    if (TRUNCATED_END_REGEX.test(qTrim)) {
      issues.push('Question text appears truncated at the end');
      score -= 20;
    }
  }

  // --- 3. Option Quality (Weight: 15%) ---
  if (q.options && Array.isArray(q.options)) {
    q.options.forEach((opt, i) => {
      if (opt) {
        if (/\b[a-zA-Z]{2,}\d\b/.test(opt)) {
          issues.push(`Possible corrupted option text at index ${i}: "${opt}"`);
          score -= 30;
        }
        if (PUA_PATTERN.test(opt)) {
          issues.push(`PUA characters in option index ${i}`);
          score -= 20;
        }
        
        // Merged option detection: check if option text contains another option marker (e.g. (b) or (c) or (d) or (e))
        const mergedMatch = opt.match(/\(\s*[b-e]\s*\)/i);
        if (mergedMatch) {
          issues.push(`Merged options detected: option at index ${i} contains another option label "${mergedMatch[0]}"`);
          score = 0; // Fail immediately
        }
      }
    });
  }

  // --- 4. Answer Integrity (Weight: 15%) ---
  if (!q.answer || q.answer.trim() === '') {
    issues.push('Empty or missing answer');
    score = 0; // Fail immediately
  } else if (q.options && Array.isArray(q.options) && q.options.length > 0) {
    const exactMatch = q.options.includes(q.answer);
    if (!exactMatch) {
      issues.push(`Answer "${q.answer}" is not in options list: ${JSON.stringify(q.options)}`);
      score = 0; // Fail immediately
    }
  }

  // --- 5. Explanation Integrity ---
  // P0 NOTE: Explanation generation is DISABLED. autoRepairQuestion() always sets
  // the static P0 replacement message. We validate that the field is non-empty
  // (which it always will be after repair) and allow the static P0 message as VALID.
  const P0_EXPLANATION = 'Detailed explanation will be available in a future update.';
  if (!q.explanation || q.explanation.trim() === '') {
    // This should never happen after autoRepairQuestion, but guard defensively.
    issues.push('CRITICAL: Missing explanation field');
    score = 0;
  } else if (q.explanation.trim() === P0_EXPLANATION) {
    // Static P0 message — always valid. No further checks needed.
  } else {
    // Legacy explanation text present (e.g. from dataset records not yet through repair).
    // Accept any non-empty, non-placeholder explanation rather than invalidating historical data.
    const expLower = q.explanation.toLowerCase().trim();
    const bannedPhrases = [
      'analyze the question',
      'apply the formula',
      'compute the value',
      'calculate directly',
      'use the given information',
      'refer to standard solutions',
      'no explanation available',
    ];
    const cleanExp = expLower.replace(/[.\s]+/g, ' ');
    const hasBannedPlaceholder = bannedPhrases.some(phrase => {
      const cleanPhrase = phrase.replace(/[.\s]+/g, ' ');
      return cleanExp === cleanPhrase || cleanExp.startsWith(cleanPhrase + ' ') || cleanExp.endsWith(' ' + cleanPhrase) || cleanExp.includes(' ' + cleanPhrase + ' ');
    });
    if (hasBannedPlaceholder) {
      // Downgrade to REVIEW_REQUIRED — not INVALID — since Q/A may still be valid.
      issues.push(`OCR: Banned placeholder explanation detected`);
      score -= 10;
    }
  }

  // --- 6. OCR Quality Verification ---
  if (q.question && PUA_PATTERN.test(q.question)) {
    issues.push('OCR: PUA characters in question text');
    score -= 15;
  }
  if (q.question && HEADER_FOOTER_PATTERN.test(q.question)) {
    issues.push('OCR: Header/footer leak in question');
    score -= 15;
  }
  // Math exponent spacing corruption detection ("47 47")
  if (q.question && /\b\d{2}\s+\d{2}\b/.test(q.question) && !q.question.includes(',') && !q.question.includes('and')) {
    issues.push('OCR: Possible exponent spacing corruption in question');
    score -= 10;
  }

  // --- 7. Parsing Integrity & Alignment ---
  if (q.id) {
    const idPrefix = q.id.split('-')[0];
    if (idPrefix === 'quant' && q.category !== 'quant') {
      issues.push(`PARSING: ID prefix is quant but category is ${q.category}`);
      score -= 15;
    } else if (idPrefix === 'logical' && q.category !== 'logical') {
      issues.push(`PARSING: ID prefix is logical but category is ${q.category}`);
      score -= 15;
    } else if (idPrefix === 'verbal' && q.category !== 'verbal') {
      issues.push(`PARSING: ID prefix is verbal but category is ${q.category}`);
      score -= 15;
    }
  }

  // Source ID mismatch checks are critical failures (cross-record contamination)
  if (q.optionsSourceId && q.id && q.optionsSourceId !== q.id) {
    issues.push(`CRITICAL: Options Source ID mismatch: expected ${q.id}, got ${q.optionsSourceId}`);
    score = 0;
  }
  if (q.answerSourceId && q.id && q.answerSourceId !== q.id) {
    issues.push(`CRITICAL: Answer Source ID mismatch: expected ${q.id}, got ${q.answerSourceId}`);
    score = 0;
  }
  if (q.explanationSourceId && q.id && q.explanationSourceId !== q.id) {
    issues.push(`CRITICAL: Explanation Source ID mismatch: expected ${q.id}, got ${q.explanationSourceId}`);
    score = 0;
  }

  // DI Asset Structure Validation
  if (q.category === 'di') {
    if (q.topic === 'tables' && !q.tableData) {
      issues.push('CRITICAL: DI table question is missing tableData');
      score = 0;
    } else if (['pie-charts', 'bar-graphs', 'line-graphs'].includes(q.topic) && !q.chartData) {
      issues.push('CRITICAL: DI chart question is missing chartData');
      score = 0;
    }
  }

  score = Math.max(0, score);

  // ─── P0 Status Trichotomy ────────────────────────────────────────────────────
  // VALID          → score >= 95, zero issues. Safe for production.
  // REVIEW_REQUIRED → score 70–94 or any non-critical issue. Quarantined pending review.
  // INVALID        → critical structural failure or score < 70. Quarantined immediately.
  const hasCriticalIssue = issues.some(issue => issue.startsWith('CRITICAL:'));

  let status: 'VALID' | 'REVIEW_REQUIRED' | 'INVALID';
  if (hasCriticalIssue || score < 70) {
    status = 'INVALID';
  } else if (score < 95 || issues.length > 0) {
    status = 'REVIEW_REQUIRED';
  } else {
    status = 'VALID';
  }

  // Only VALID questions reach production users
  const valid = status === 'VALID';

  // Populate observability metadata on the question object
  q.sourceId = q.id;
  q.confidenceScore = score;
  q.validationStatus = valid ? 'PASS' : 'FAIL';
  q.lastVerificationTime = new Date().toISOString();
  q.correctAnswer = q.answer;
  q.sourceReference = q.sourceFile || q.id;

  return {
    valid,
    score,
    status,
    issues,
    question: q
  };
}
