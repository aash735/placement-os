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
  // Pattern 1: e.g. "15days3" -> "5 1/3 days" or "24days5" -> "4 2/5 days" or "14%gain7" -> "14 2/7 % gain"
  // Unit must not contain spaces, and denominator must be a single digit stuck to the unit.
  cleaned = cleaned.replace(/\b(\d)(\d+)\s*([a-zA-Z%]+)(\d)\b/g, (match, numStr, wholeStr, unit, denStr) => {
    const num = parseInt(numStr, 10);
    const den = parseInt(denStr, 10);
    if (num < den) {
      return `${wholeStr} ${num}/${den} ${unit}`;
    }
    return match;
  });

  // Pattern 2: e.g. "7 th8" -> "7/8 th"
  // Restrict suffixes to ordinals to avoid corrupting standard text like "9 dividing 99"
  cleaned = cleaned.replace(/\b(\d+)\s*(th|rd|nd|st|h)\s*(\d+)\b/g, '$1/$3 $2');
  
  // Pattern 3: e.g. "3 4 th" -> "3/4th"
  cleaned = cleaned.replace(/\b(\d+)\s+(\d+)\s*(th|rd|nd|st|h)\b/g, '$1/$2$3');

  // 4. Math expression spacing fixes
  cleaned = cleaned.replace(/(\d+)\s+!/g, '$1!'); // spaced factorial "5 !" -> "5!"
  cleaned = cleaned.replace(/(\d+)\s*%/g, '$1%'); // spaced percentage "5 %" -> "5%"
  
  // 5. Standardize currency symbols
  cleaned = cleaned.replace(/Rs\.\s*/g, '₹');
  cleaned = cleaned.replace(/Rs\s+/g, '₹');
  cleaned = cleaned.replace(/Rs\./g, '₹');
  
  // 6. Math symbol / notation fixes
  cleaned = cleaned.replace(/([^a-zA-Z]|^)pa2\b/g, '$1πa²');
  cleaned = cleaned.replace(/([^a-zA-Z]|^)pr2\b/g, '$1πr²');
  cleaned = cleaned.replace(/([^a-zA-Z]|^)pR2\b/g, '$1πR²');
  cleaned = cleaned.replace(/\bcm2\b/g, 'cm²');
  cleaned = cleaned.replace(/\bcm3\b/g, 'cm³');
  cleaned = cleaned.replace(/\bm2\b/g, 'm²');
  cleaned = cleaned.replace(/\bm3\b/g, 'm³');
  cleaned = cleaned.replace(/\bunits2\b/g, 'units²');
  cleaned = cleaned.replace(/\bunits3\b/g, 'units³');

  // 7. Clean double/multiple spaces and trim
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  return cleaned.trim();
}

export function isValidExplanation(explanation: string | undefined): boolean {
  if (!explanation) return false;
  const expLower = explanation.toLowerCase().trim();
  if (expLower.length < 15) return false;
  
  const FALLBACK_EXPLANATION = 'detailed explanation is currently being prepared and will be available in a future update.';
  const OLD_FALLBACK = 'detailed explanation will be available in a future update.';
  const HISTORICAL_FALLBACK = 'verified detailed explanation unavailable.';
  const HISTORICAL_FALLBACK_SHORT = 'detailed explanation unavailable.';
  
  if (expLower === FALLBACK_EXPLANATION || 
      expLower === OLD_FALLBACK || 
      expLower === HISTORICAL_FALLBACK || 
      expLower === HISTORICAL_FALLBACK_SHORT) {
    return false;
  }
  
  const bannedPhrases = [
    'analyze the question',
    'apply the formula',
    'compute the value',
    'compute the answer',
    'calculate directly',
    'use the given values',
    'use the given information',
    'refer to standard solutions',
    'calculate the result',
    'calculate the answer',
    'compute final answer',
    'no explanation available'
  ];
  
  const cleanExp = expLower.replace(/[.\s]+/g, ' ');
  for (const phrase of bannedPhrases) {
    const cleanPhrase = phrase.replace(/[.\s]+/g, ' ');
    if (cleanExp === cleanPhrase || 
        cleanExp.startsWith(cleanPhrase + ' ') || 
        cleanExp.endsWith(' ' + cleanPhrase) || 
        cleanExp.includes(' ' + cleanPhrase + ' ')) {
      return false;
    }
  }
  
  return true;
}

export function formatExplanationToSteps(explanation: string, answer: string): string {
  const cleaned = cleanOcrText(explanation);
  
  if (!isValidExplanation(cleaned)) {
    return 'Detailed explanation is currently being prepared and will be available in a future update.';
  }
  
  if (cleaned.startsWith('Step 1')) {
    return cleaned;
  }
  
  const rawParts = cleaned.split(/(?<=[.?!;])\s+(?=[A-Z])/);
  const parts: string[] = [];
  
  const bannedPhrases = [
    'step',
    'final calculation',
    'answer:',
    'analyze the question',
    'compute the final value',
    'apply the formula',
    'calculate the result',
    'compute final answer',
    'set up the equation',
    'use the given information',
    'no explanation available',
    'refer to standard solutions'
  ];
  
  for (let p of rawParts) {
    p = p.trim();
    if (!p) continue;
    
    const pLower = p.toLowerCase();
    const isBoilerplate = bannedPhrases.some(phrase => pLower.includes(phrase));
    if (isBoilerplate) continue;
    
    if (!p.endsWith('.') && !p.endsWith('?') && !p.endsWith('!')) {
      p += '.';
    }
    parts.push(p);
  }
  
  const remainingText = parts.join(' ').trim();
  if (remainingText.length < 25) {
    return 'Detailed explanation is currently being prepared and will be available in a future update.';
  }
  
  const steps: string[] = [];
  if (parts.length === 1) {
    steps.push(`Step 1\n${parts[0]}`);
  } else if (parts.length === 2) {
    steps.push(`Step 1\n${parts[0]}`);
    steps.push(`Final Calculation\n${parts[1]}`);
  } else if (parts.length === 3) {
    steps.push(`Step 1\n${parts[0]}`);
    steps.push(`Step 2\n${parts[1]}`);
    steps.push(`Final Calculation\n${parts[2]}`);
  } else {
    steps.push(`Step 1\n${parts[0]}`);
    steps.push(`Step 2\n${parts[1]}`);
    const mid = parts.slice(2, -1).join(' ');
    steps.push(`Step 3\n${mid}`);
    steps.push(`Final Calculation\n${parts[parts.length - 1]}`);
  }
  
  let stepsStr = steps.join('\n\n');
  if (answer) {
    const cleanAns = cleanOcrText(answer);
    stepsStr += `\n\nAnswer: ${cleanAns}`;
  }
  return stepsStr;
}

export function standardizeExplanation(explanation: string, answer: string): string {
  return formatExplanationToSteps(explanation, answer);
}

/**
 * Performs auto-repairs on questions:
 * - OCR cleanup on all text fields.
 * - Quote/spacing mismatches between answer and options.
 * - Normalizes 5-option layouts to exactly 4 options.
 * - P0: Recovers and formats valid explanations, falls back to preparation message.
 */
export function autoRepairQuestion(q: AptitudeQuestion): AptitudeQuestion {
  const repaired = { ...q } as any;

  // Normalize Phase 3 schema to standard validation fields
  if (repaired.questionId) {
    repaired.id = repaired.questionId;
  }
  if (repaired.chapter) {
    repaired.topic = repaired.chapter;
  }
  if (repaired.page) {
    repaired.sourcePage = repaired.page;
  }
  if (repaired.options && typeof repaired.options === 'object' && !Array.isArray(repaired.options)) {
    const optsObj = repaired.options;
    repaired.options = [optsObj.A, optsObj.B, optsObj.C, optsObj.D].filter(o => o !== undefined && o !== null);
    
    if (repaired.answer && (repaired.answer === 'A' || repaired.answer === 'B' || repaired.answer === 'C' || repaired.answer === 'D')) {
      const idx = repaired.answer.charCodeAt(0) - 65;
      repaired.answer = repaired.options[idx] || repaired.answer;
    }
  }

  // Set default renderMode if not present
  if (!repaired.renderMode) {
    repaired.renderMode = 'TEXT';
  }

  // Auto-correct renderMode if it's set to IMAGE/HYBRID but image is missing
  if ((repaired.renderMode === 'IMAGE' || repaired.renderMode === 'HYBRID') && !repaired.questionImage) {
    repaired.renderMode = 'TEXT';
  }

  // Populate questionText field if missing
  if (!repaired.questionText && repaired.question) {
    repaired.questionText = repaired.question;
  }

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
    repaired.options = repaired.options.map((o: string) => cleanOcrText(o));
  }
  if (repaired.shortcuts && Array.isArray(repaired.shortcuts)) {
    repaired.shortcuts = repaired.shortcuts.map((s: string) => cleanOcrText(s));
  }

  // Explanation recovery and validation
  const FALLBACK_EXPLANATION = 'Detailed explanation is currently being prepared and will be available in a future update.';
  if (q.explanation) {
    const cleanedExp = cleanOcrText(q.explanation);
    if (isValidExplanation(cleanedExp)) {
      repaired.explanation = formatExplanationToSteps(cleanedExp, repaired.answer);
    } else {
      repaired.explanation = FALLBACK_EXPLANATION;
    }
  } else {
    repaired.explanation = FALLBACK_EXPLANATION;
  }

  if (!repaired.options || !Array.isArray(repaired.options) || repaired.options.length === 0) {
    return repaired;
  }

  // 2. Align answer string with the corresponding options element
  const trimmedAns = repaired.answer.trim();
  const cleanAns = trimmedAns.toLowerCase().replace(/\s+/g, ' ');

  let matchIndex = repaired.options.indexOf(trimmedAns);
  if (matchIndex === -1) {
    // Relaxed match (spacing, case-insensitive)
    const cleanOpts = repaired.options.map((o: string) => o.trim().toLowerCase().replace(/\s+/g, ' '));
    matchIndex = cleanOpts.indexOf(cleanAns);

    if (matchIndex === -1) {
      // Relaxed match with quotes stripped (e.g. quote mismatches)
      const unquotedAns = cleanAns.replace(/['"]/g, '');
      const unquotedOpts = cleanOpts.map((o: string) => o.replace(/['"]/g, ''));
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
      issues.push(`CRITICAL: ${emptyOptsCount} empty option(s)`);
      score = 0; // Fail immediately
    }
    const garbageOpts = q.options.filter(o => o && (o.trim() === '*' || o.trim() === '.'));
    if (garbageOpts.length > 0) {
      issues.push(`CRITICAL: Garbage option values: ${JSON.stringify(garbageOpts)}`);
      score = 0; // Fail immediately
    }
    const trimmedOpts = q.options.map(o => (o || '').trim().toLowerCase());
    const uniqueOpts = new Set(trimmedOpts);
    if (uniqueOpts.size < trimmedOpts.length) {
      issues.push('CRITICAL: Duplicate option values');
      score = 0; // Fail immediately
    }
  }

  // --- 2. Question Quality (Weight: 20%) ---
  if (!q.question || q.question.trim().length === 0) {
    issues.push('Empty question text');
    score = 0; // Fail immediately
  } else {
    const qTrim = q.question.trim();
    if (q.renderMode !== 'IMAGE') {
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
  }

  // --- 3. Option Quality (Weight: 15%) ---
  if (q.options && Array.isArray(q.options)) {
    q.options.forEach((opt, i) => {
      if (opt) {
        if (q.renderMode !== 'IMAGE') {
          if (/\b[a-zA-Z]{2,}\d\b/.test(opt)) {
            issues.push(`Possible corrupted option text at index ${i}: "${opt}"`);
            score -= 30;
          }
          if (PUA_PATTERN.test(opt)) {
            issues.push(`PUA characters in option index ${i}`);
            score -= 20;
          }
          
          // Truncation detection for options
          const TRUNCATED_OPT_REGEX = /\b(and|or|the|of|to|a|an|with|for|at|on|in|by|from|then|if|about)\s*$/i;
          if (TRUNCATED_OPT_REGEX.test(opt.trim())) {
            issues.push(`CRITICAL: Truncated option detected at index ${i}`);
            score = 0; // Fail immediately
          }
        }
        
        // Merged option detection: check if option text contains another option marker (e.g. (b) or (c) or (d) or (e))
        // Enforce STRICT NO-MERGE policy (enforced for both text and image mode to ensure options are distinct buttons)
        const mergedMatch = opt.match(/\(\s*[b-eB-E]\s*\)/);
        if (mergedMatch && q.renderMode !== 'IMAGE') {
          issues.push(`CRITICAL: Merged options detected: option at index ${i} contains another option label "${mergedMatch[0]}"`);
          score = 0; // Fail immediately
        }
      }
    });
  }

  // --- 4. Answer Integrity (Weight: 15%) ---
  if (!q.answer || q.answer.trim() === '') {
    issues.push('CRITICAL: Empty or missing answer');
    score = 0; // Fail immediately
  } else if (q.options && Array.isArray(q.options) && q.options.length > 0) {
    const exactMatch = q.options.includes(q.answer);
    if (!exactMatch) {
      issues.push(`CRITICAL: Answer "${q.answer}" is not in options list: ${JSON.stringify(q.options)}`);
      score = 0; // Fail immediately
    }
  }

  // --- 5. Explanation Integrity ---
  const FALLBACK_EXPLANATION = 'Detailed explanation is currently being prepared and will be available in a future update.';
  if (!q.explanation || q.explanation.trim() === '') {
    issues.push('CRITICAL: Missing explanation field');
    score = 0;
  } else if (q.explanation.trim() === FALLBACK_EXPLANATION) {
    // Static fallback — always valid. No further checks needed.
  } else {
    // Unbalanced brackets check
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    let unbalanced = false;
    for (const char of q.explanation) {
      if (['(', '[', '{'].includes(char)) {
        stack.push(char);
      } else if ([')', ']', '}'].includes(char)) {
        const open = stack.pop();
        if (open !== pairs[char]) {
          unbalanced = true;
          break;
        }
      }
    }
    if (unbalanced || stack.length > 0) {
      issues.push('Explanation contains unbalanced parentheses, square brackets, or curly braces');
      score -= 20;
    }

    // Empty formula brackets
    if (/\[\s*\]|\(\s*\)|\{\s*\}/.test(q.explanation)) {
      issues.push('Explanation contains empty formula brackets/placeholders');
      score -= 20;
    }

    // Corrupted fraction layout
    if (/\s+[,.]\d+/.test(q.explanation)) {
      issues.push('Explanation contains corrupted fraction layout (e.g. space before dot or comma)');
      score -= 20;
    }

    // Disconnected mixed operators
    if (/[+\-*/=]\s+[+\-*/=]/.test(q.explanation)) {
      issues.push('Explanation contains disconnected mixed arithmetic operators');
      score -= 20;
    }

    // OCR page/line number leak
    if (/[a-zA-Z]+\.\d+/.test(q.explanation)) {
      issues.push('Explanation contains OCR page/line number leak (word stuck to numbers with dot)');
      score -= 20;
    }
  }

  // --- 6. OCR Quality Verification ---
  if (q.renderMode !== 'IMAGE') {
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

  // Render Mode Asset Validation
  if ((q.renderMode === 'IMAGE' || q.renderMode === 'HYBRID') && !q.questionImage) {
    issues.push('CRITICAL: renderMode is ' + q.renderMode + ' but questionImage is missing');
    score = 0;
  }

  score = Math.max(0, score);

  // ─── P0 Status Trichotomy ────────────────────────────────────────────────────
  const hasCriticalIssue = issues.some(issue => issue.startsWith('CRITICAL:'));

  let status: 'VALID' | 'REVIEW_REQUIRED' | 'INVALID';
  if (hasCriticalIssue || score < 70) {
    status = 'INVALID';
  } else if (q.renderMode === 'IMAGE' || q.renderMode === 'HYBRID') {
    // Image and Hybrid modes are visually 100% correct, so they pass as long as they have no critical issues
    status = 'VALID';
  } else if (score < 95 || issues.length > 0) {
    status = 'REVIEW_REQUIRED';
  } else {
    status = 'VALID';
  }

  const valid = status === 'VALID';

  // Populate observability metadata on the question object
  q.sourceId = q.id;
  q.confidenceScore = score;
  q.validationStatus = valid ? 'PASS' : 'FAIL';
  q.integrityStatus = status === 'VALID' ? 'INTEGRATED' : 'QUARANTINED';
  q.lastVerificationTime = new Date().toISOString();
  q.correctAnswer = q.answer;
  q.sourceReference = q.sourceFile || q.sourceBook || q.id;

  return {
    valid,
    score,
    status,
    issues,
    question: q
  };
}
