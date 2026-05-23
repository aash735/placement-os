import { loadAllQuestions, slugify } from '../src/lib/sheets/parser';
import { rowToDSAQuestion } from '../src/lib/sheets/transformers';

const rows = loadAllQuestions();
const questions = rows.map(rowToDSAQuestion).filter(q => q !== null);

console.log(`\n✅ Total questions parsed: ${questions.length}`);
console.log(`✅ Total rows from sheets: ${rows.length}`);

// Topic breakdown
const topicCounts: Record<string, number> = {};
const topicNames: Record<string, string> = {};
questions.forEach(q => {
  topicCounts[q!.topicId] = (topicCounts[q!.topicId] || 0) + 1;
});

console.log('\n📊 Topics (by slug → question count):');
Object.entries(topicCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([slug, count]) => {
    console.log(`  ${slug}: ${count}`);
  });

// Check difficulty distribution
const diffs = { Easy: 0, Medium: 0, Hard: 0 };
questions.forEach(q => { if (q!.difficulty) diffs[q!.difficulty]++; });
console.log('\n📈 Difficulty:', diffs);

// Check companies
const withCompanies = questions.filter(q => q!.companies.length > 0).length;
console.log(`\n🏢 Questions with companies: ${withCompanies}/${questions.length}`);

// Sample questions from Shradha sheet
console.log('\n🔍 Sample questions (Shradha):');
questions.filter(q => q!.companies.length > 0).slice(0, 8).forEach(q => {
  console.log(`  [${q!.topicId}] "${q!.title}" | difficulty=${q!.difficulty} | companies=[${q!.companies.slice(0,3).join(', ')}] | url=${q!.url.substring(0, 50)}`);
});

// Questions with no URL (fallback to Google)
const googleFallback = questions.filter(q => q!.url.includes('google.com/search')).length;
console.log(`\n⚠️  Questions using Google search fallback (no direct URL): ${googleFallback}`);
