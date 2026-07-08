import { aptitudeQuestions, rejectedAptitudeQuestions } from '../src/data/aptitude-questions';

console.log(`Valid Questions: ${aptitudeQuestions.length}`);
console.log(`Rejected Questions: ${rejectedAptitudeQuestions.length}`);

let duplicateOptionFails = 0;
let mergedOptionFails = 0;
let missingAnswerFails = 0;

for (const rejected of rejectedAptitudeQuestions) {
  if (rejected.issues.some(i => i.includes('Duplicate option'))) duplicateOptionFails++;
  if (rejected.issues.some(i => i.includes('Merged options'))) mergedOptionFails++;
  if (rejected.issues.some(i => i.includes('is not in options list'))) missingAnswerFails++;
}

console.log(`- Failed due to duplicate options: ${duplicateOptionFails}`);
console.log(`- Failed due to merged options: ${mergedOptionFails}`);
console.log(`- Failed due to missing answers: ${missingAnswerFails}`);
