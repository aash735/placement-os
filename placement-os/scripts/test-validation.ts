import { 
  cleanOcrText, 
  autoRepairQuestion, 
  validateQuestion 
} from '../src/lib/aptitude-validator';
import type { AptitudeQuestion } from '../src/data/aptitude-questions';

let testCount = 0;
let passedCount = 0;

function assert(condition: boolean, message: string, report?: any) {
  testCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    if (report) {
      console.error(`     Issues:`, report.issues || report);
    }
  }
}

console.log('🧪 Starting Aptitude Validator Unit Tests...\n');

// 1. Test cleanOcrText
console.log('--- Case 1: OCR Text Cleaning ---');
const puaText = 'Calculate the value \uf8ebx + y\uf8f6 using Rs. 100.';
const cleaned = cleanOcrText(puaText);
assert(cleaned === 'Calculate the value (x + y) using ₹100.', 'PUA characters and currency mapped correctly');

const rawSpaces = 'This   has   too   many   spaces.  ';
assert(cleanOcrText(rawSpaces) === 'This has too many spaces.', 'Duplicate spacing collapsed and trimmed');

const factorialSpace = 'Calculate 5 ! and 20%';
assert(cleanOcrText(factorialSpace) === 'Calculate 5! and 20%', 'Factorial/percent spacing normalized');


// 2. Test autoRepairQuestion: Quote/Spacing Answer Alignment
console.log('\n--- Case 2: Spacing & Quote Answer Alignment ---');
const qMismatchedQuotes: AptitudeQuestion = {
  id: 'puzzles-logic-2',
  question: 'There are three boxes.',
  options: [
    "The box labeled 'Apples and Oranges",
    "The box labeled 'Apples",
    "The box labeled 'Oranges",
    "Any box will work"
  ],
  answer: "The box labeled 'Apples and Oranges'", // answer has closing quote, option doesn't
  explanation: 'Simple explanation.',
  difficulty: 2,
  topic: 'puzzles',
  category: 'puzzles',
  estimatedTime: 90,
  companyRelevance: ['Google']
};
const repairedQuotes = autoRepairQuestion(qMismatchedQuotes);
assert(repairedQuotes.answer === repairedQuotes.options[0], 'Answer successfully aligned with matching option despite quote mismatch');


// 3. Test autoRepairQuestion: Option Count Normalization (5 -> 4)
console.log('\n--- Case 3: Option Count Normalization (5 to 4) ---');
const q5OptionsLastAnswer: AptitudeQuestion = {
  id: 'quant-test-1',
  question: 'What is 2 + 2?',
  options: ['1', '2', '3', '5', '4'], // 5 options
  answer: '4', // Answer is the 5th option (index 4)
  explanation: 'Simple addition.',
  difficulty: 1,
  topic: 'number-system',
  category: 'quant',
  estimatedTime: 30,
  companyRelevance: ['TCS']
};
const repaired5Last = autoRepairQuestion(q5OptionsLastAnswer);
assert(repaired5Last.options.length === 4, 'Successfully normalized 5 options to 4 options');
assert(repaired5Last.options.includes('4'), 'Retained the correct answer');
assert(!repaired5Last.options.includes('5'), 'Discarded the wrong option at index 3');

const q5OptionsFirstAnswer: AptitudeQuestion = {
  id: 'quant-test-2',
  question: 'What is 3 + 3?',
  options: ['6', '2', '3', '5', '4'], // 5 options
  answer: '6', // Answer is the 1st option (index 0)
  explanation: 'Simple addition.',
  difficulty: 1,
  topic: 'number-system',
  category: 'quant',
  estimatedTime: 30,
  companyRelevance: ['TCS']
};
const repaired5First = autoRepairQuestion(q5OptionsFirstAnswer);
assert(repaired5First.options.length === 4, 'Successfully normalized 5 options to 4 options');
assert(repaired5First.options.includes('6'), 'Retained the correct answer');
assert(!repaired5First.options.includes('4'), 'Discarded the fifth option');


// 4. Test validateQuestion & Confidence Scoring
console.log('\n--- Case 4: Validation & Confidence Scoring ---');
const validQ: AptitudeQuestion = {
  id: 'quant-percentages-1',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: '10% of 100 is 10. Long explanation so it passes the length check.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportValid = validateQuestion(validQ);
assert(reportValid.valid === true, 'High-quality question passes validation', reportValid);
assert(reportValid.score >= 85, 'High-quality question receives high score', reportValid);

const invalidQMissingAnswer: AptitudeQuestion = {
  id: 'quant-percentages-2',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '',
  explanation: 'No explanation.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportMissingAns = validateQuestion(invalidQMissingAnswer);
assert(reportMissingAns.valid === false, 'Question with missing answer fails validation');
assert(reportMissingAns.issues.includes('Empty or missing answer'), 'Correctly flags empty answer issue');

const invalidQWrongOptionsCount: AptitudeQuestion = {
  id: 'quant-percentages-3',
  question: 'What is 10% of 100?',
  options: ['5', '10'],
  answer: '10',
  explanation: 'No explanation.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportOptsCount = validateQuestion(invalidQWrongOptionsCount);
assert(reportOptsCount.valid === false, 'Question with 2 options fails validation');

const invalidQDuplicateOpts: AptitudeQuestion = {
  id: 'quant-percentages-4',
  question: 'What is 10% of 100?',
  options: ['10', '10', '15', '20'],
  answer: '10',
  explanation: 'This explanation is long enough to pass the length checks.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportDuplicates = validateQuestion(invalidQDuplicateOpts);
assert(reportDuplicates.valid === false, 'Question with duplicate options fails validation');
assert(reportDuplicates.issues.includes('Duplicate option values'), 'Correctly flags duplicate options issue');

// --- Case 5: Explanation & Math Integrity Gates ---
const invalidQUnbalancedBrackets: AptitudeQuestion = {
  id: 'quant-percentages-5',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'This explanation contains unbalanced (brackets [and parentheses) which is corrupted.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportUnbalanced = validateQuestion(invalidQUnbalancedBrackets);
assert(reportUnbalanced.valid === false, 'Question with unbalanced brackets fails validation');
assert(reportUnbalanced.issues.includes('Explanation contains unbalanced parentheses, square brackets, or curly braces'), 'Flags unbalanced brackets issue');

const invalidQEmptyBrackets: AptitudeQuestion = {
  id: 'quant-percentages-6',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'The formula = (A + B) * [ ] is empty at the end.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportEmptyBrackets = validateQuestion(invalidQEmptyBrackets);
assert(reportEmptyBrackets.valid === false, 'Question with empty brackets fails validation');
assert(reportEmptyBrackets.issues.includes('Explanation contains empty formula brackets/placeholders'), 'Flags empty brackets issue');

const invalidQCorruptedFraction: AptitudeQuestion = {
  id: 'quant-percentages-7',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'A’s 1 day’s work = 1 ,16 and B’s 1 day’s work = 1 .12',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportCorruptedFraction = validateQuestion(invalidQCorruptedFraction);
assert(reportCorruptedFraction.valid === false, 'Question with corrupted fractions fails validation');
assert(reportCorruptedFraction.issues.includes('Explanation contains corrupted fraction layout (e.g. space before dot or comma)'), 'Flags corrupted fraction issue');

const invalidQDisconnectedOps: AptitudeQuestion = {
  id: 'quant-percentages-8',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'C’s 1 day’s work = - + = - which is garbage.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportDisconnectedOps = validateQuestion(invalidQDisconnectedOps);
assert(reportDisconnectedOps.valid === false, 'Question with disconnected mixed operators fails validation');
assert(reportDisconnectedOps.issues.some(issue => issue.includes('disconnected mixed arithmetic operators')), 'Flags disconnected mixed operators');

const invalidQOcrLeak: AptitudeQuestion = {
  id: 'quant-percentages-9',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'So, C alone can do the work in days.55 of time.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportOcrLeak = validateQuestion(invalidQOcrLeak);
assert(reportOcrLeak.valid === false, 'Question with OCR page number leak fails validation');
assert(reportOcrLeak.issues.includes('Explanation contains OCR page/line number leak (word stuck to numbers with dot)'), 'Flags OCR word leak');


// --- Case 6: Strict Explanation Hierarchy & Fallbacks ---
console.log('\n--- Case 6: Strict Explanation Hierarchy & Fallbacks ---');

// 1. Missing explanation -> "Detailed explanation unavailable..."
const qMissingExplanation: AptitudeQuestion = {
  id: 'quant-fallback-1',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: '',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const repairedMissingExp = autoRepairQuestion(qMissingExplanation);
assert(repairedMissingExp.explanation === 'Verified detailed explanation unavailable.', 'Empty explanation falls back to unavailable message');
assert(repairedMissingExp.correctAnswer === '10', 'correctAnswer is mapped to answer key');
assert(repairedMissingExp.sourceReference === 'quant-fallback-1', 'sourceReference is mapped to question id');
const validationMissingExp = validateQuestion(repairedMissingExp);
assert(validationMissingExp.valid === true, 'Question with unavailable explanation fallback passes validation', validationMissingExp);

// 2. Generic placeholder explanation -> "Detailed explanation unavailable..."
const qPlaceholderExplanation: AptitudeQuestion = {
  id: 'quant-fallback-2',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'Step 1\nAnalyze the question details and parameters.\n\nFinal Calculation\nCompute the final value directly.\n\nAnswer: 10',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const repairedPlaceholderExp = autoRepairQuestion(qPlaceholderExplanation);
assert(repairedPlaceholderExp.explanation === 'Verified detailed explanation unavailable.', 'Generic placeholder explanation falls back to unavailable message');
const validationPlaceholderExp = validateQuestion(repairedPlaceholderExp);
assert(validationPlaceholderExp.valid === true, 'Question with placeholder explanation repaired to fallback passes validation', validationPlaceholderExp);

// 3. Valid single-sentence explanation -> structured without fabricated prefixes
const qSingleSentenceExplanation: AptitudeQuestion = {
  id: 'quant-fallback-3',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'We calculate 10% of 100 by multiplying 0.10 * 100 to get 10.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const repairedSingleSentence = autoRepairQuestion(qSingleSentenceExplanation);
assert(!repairedSingleSentence.explanation.includes('Set up the equation based on given constraints'), 'Valid single-sentence explanation is NOT prefixed with fabricated placeholder steps');
assert(repairedSingleSentence.explanation.startsWith('Step 1\nWe calculate 10% of 100 by multiplying 0.10 * 100 to get 10.'), 'Valid single-sentence explanation is correctly formatted under Step 1');
const validationSingleSentence = validateQuestion(repairedSingleSentence);
assert(validationSingleSentence.valid === true, 'Valid single-sentence explanation passes validation', validationSingleSentence);

// --- Case 7: Strict Component ID Mappings ---
console.log('\n--- Case 7: Strict Component ID Mappings ---');
const qMismatchedOptionId: AptitudeQuestion = {
  id: 'quant-id-1',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'Simple explanation.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS'],
  optionsSourceId: 'quant-id-2' // mismatched!
};
const reportMismatchedOptionId = validateQuestion(qMismatchedOptionId);
assert(reportMismatchedOptionId.valid === false, 'Question with mismatched optionsSourceId fails validation', reportMismatchedOptionId);

const qMismatchedAnswerId: AptitudeQuestion = {
  id: 'quant-id-1',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'Simple explanation.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS'],
  answerSourceId: 'quant-id-3' // mismatched!
};
const reportMismatchedAnswerId = validateQuestion(qMismatchedAnswerId);
assert(reportMismatchedAnswerId.valid === false, 'Question with mismatched answerSourceId fails validation', reportMismatchedAnswerId);

const qMismatchedExplanationId: AptitudeQuestion = {
  id: 'quant-id-1',
  question: 'What is 10% of 100?',
  options: ['5', '10', '15', '20'],
  answer: '10',
  explanation: 'Simple explanation.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS'],
  explanationSourceId: 'quant-id-4' // mismatched!
};
const reportMismatchedExplanationId = validateQuestion(qMismatchedExplanationId);
assert(reportMismatchedExplanationId.valid === false, 'Question with mismatched explanationSourceId fails validation', reportMismatchedExplanationId);


// --- Case 8: Merged Options Detection ---
console.log('\n--- Case 8: Merged Options Detection ---');
const qMergedOptions: AptitudeQuestion = {
  id: 'quant-merged-1',
  question: 'What is 10% of 100?',
  options: ['5', '10 (b) 15', '20', '30'], // contains option label (b) merged inside options[1]
  answer: '10 (b) 15',
  explanation: 'Simple explanation.',
  difficulty: 1,
  topic: 'percentages',
  category: 'quant',
  estimatedTime: 45,
  companyRelevance: ['TCS']
};
const reportMergedOptions = validateQuestion(qMergedOptions);
assert(reportMergedOptions.valid === false, 'Question with merged options fails validation', reportMergedOptions);


// --- Case 9: Randomization, Filtering, and Pagination Safety ---
console.log('\n--- Case 9: Randomization, Filtering, and Pagination Safety ---');
const mockPool: AptitudeQuestion[] = [
  {
    id: 'quant-pool-1',
    question: 'What is the value of the first ratio element?',
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
    explanation: 'The first ratio element can be found by looking at the first term directly.',
    topic: 'ratios',
    category: 'quant',
    difficulty: 1,
    estimatedTime: 30,
    companyRelevance: ['TCS']
  },
  {
    id: 'quant-pool-2',
    question: 'What is the value of the second ratio element?',
    options: ['E', 'F', 'G', 'H'],
    answer: 'E',
    explanation: 'The second ratio element can be found by looking at the second term directly.',
    topic: 'ratios',
    category: 'quant',
    difficulty: 2,
    estimatedTime: 30,
    companyRelevance: ['TCS']
  }
];

const shuffledPool = [...mockPool].sort(() => 0.5 - Math.random());
const filteredPool = mockPool.filter(q => q.difficulty === 2);
const paginatedPool = mockPool.slice(0, 1);

shuffledPool.forEach(q => {
  const rep = validateQuestion(q);
  assert(rep.valid === true, `Shuffled question ${q.id} remains consistent`, rep);
});

filteredPool.forEach(q => {
  const rep = validateQuestion(q);
  assert(rep.valid === true, `Filtered question ${q.id} remains consistent`, rep);
});

paginatedPool.forEach(q => {
  const rep = validateQuestion(q);
  assert(rep.valid === true, `Paginated question ${q.id} remains consistent`, rep);
});


console.log(`\n================ TEST SUMMARY ================`);
console.log(`Ran ${testCount} assertions.`);
console.log(`Passed: ${passedCount} / ${testCount}`);
console.log(`==============================================\n`);

if (passedCount === testCount) {
  console.log('✅ All tests completed successfully!');
  process.exit(0);
} else {
  console.error('❌ Some tests failed. Check diagnostic outputs.');
  process.exit(1);
}
