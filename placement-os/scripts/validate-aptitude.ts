import * as fs from 'fs';
import * as path from 'path';
import { validateQuestion } from '../src/lib/aptitude-validator';
import type { AptitudeQuestion } from '../src/data/aptitude-questions';

const baseDir = path.join(__dirname, '..', 'src', 'data', 'aptitude');
const reportPath = path.join(__dirname, '..', 'aptitude-audit-report.json');

const EXPECTED_COUNTS: Record<string, number> = {
  // Quant
  "number-system": 180,
  "hcf-lcm": 85,
  "simplification": 240,
  "average": 130,
  "ages": 65,
  "percentages": 220,
  "profit-loss": 180,
  "ratios": 160,
  "pipes-cisterns": 60,
  "time-work": 165,
  "speed": 115,
  "simple-interest": 80,
  "compound-interest": 90,
  "permutation-combination": 45,
  "probability": 50,
  // Logical
  "series": 110,
  "coding-decoding": 104,
  "blood-relations": 87,
  "syllogism": 60,
  "seating-arrangement": 70,
  "statement-conclusion": 55,
  "analogy": 45,
  "clocks": 30,
  "calendar": 25,
  "direction-sense": 125,
  // Verbal
  "synonyms": 150,
  "antonyms": 150,
  "sentence-improvement": 120,
  "rc": 80,
  "error-detection": 100,
  "vocab": 200,
  // DI
  "tables": 100,
  "pie-charts": 70,
  "bar-graphs": 80,
  "line-graphs": 80,
  "caselets": 40
};

function main() {
  console.log('🛡️  P0 PRODUCTION STABILIZATION — Aptitude Content Integrity Pipeline');
  console.log('=======================================================================');
  const categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"];

  let totalScanned = 0;
  let totalValid = 0;
  let totalReviewRequired = 0;
  let totalInvalid = 0;
  let totalDuplicates = 0;
  let totalBrokenAssets = 0;

  // Issue category counters
  let totalOptionMismatch = 0;
  let totalAnswerMismatch = 0;
  let totalExplanationMismatch = 0;
  let totalMissingOptions = 0;
  let totalInvalidAnswers = 0;
  let totalMergedOptions = 0;

  const allErrors: string[] = [];
  const allReviewWarnings: string[] = [];
  const validQuestionsList: AptitudeQuestion[] = [];
  const idSet = new Set<string>();

  for (const cat of categories) {
    const rawPath = path.join(baseDir, cat, 'questions_raw.json');
    const prodPath = path.join(baseDir, cat, 'questions.json');
    const quarantinePath = path.join(baseDir, cat, 'quarantine.json');
    const reviewPath = path.join(baseDir, cat, 'review.json');

    let inputPath = prodPath;
    if (fs.existsSync(rawPath)) {
      inputPath = rawPath;
    } else if (!fs.existsSync(prodPath)) {
      console.warn(`⚠️  Category ${cat} has no questions file, skipping.`);
      continue;
    }

    console.log(`\n📂 Processing category '${cat}' from: ${path.basename(inputPath)}`);
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const questions: AptitudeQuestion[] = JSON.parse(rawData);

    const validQuestions: AptitudeQuestion[] = [];
    const quarantinedQuestions: any[] = [];   // INVALID
    const reviewQuestions: any[] = [];         // REVIEW_REQUIRED

    questions.forEach((q, idx) => {
      totalScanned++;
      const qId = q.id || `${cat}-unknown-${idx}`;

      // Duplicate check — always quarantine, not just review
      if (idSet.has(qId)) {
        totalDuplicates++;
        totalInvalid++;
        allErrors.push(`INVALID [DUPLICATE] ${qId} in ${cat}`);
        quarantinedQuestions.push({
          status: 'INVALID',
          score: 0,
          issues: ['CRITICAL: Duplicate ID value'],
          question: q
        });
        return;
      }
      idSet.add(qId);

      // Run validator (applies repairs, scoring, returns report)
      const report = validateQuestion(q);

      if (report.status === 'VALID') {
        totalValid++;
        validQuestions.push(report.question);
        validQuestionsList.push(report.question);

      } else if (report.status === 'REVIEW_REQUIRED') {
        totalReviewRequired++;
        allReviewWarnings.push(
          `REVIEW [${report.score}] ${qId} in ${cat}: ${report.issues.join(' | ')}`
        );
        reviewQuestions.push({
          status: 'REVIEW_REQUIRED',
          score: report.score,
          issues: report.issues,
          question: report.question
        });

      } else {
        // INVALID — hard quarantine
        totalInvalid++;

        if (report.issues.some(i => i.includes('missing tableData') || i.includes('missing chartData'))) {
          totalBrokenAssets++;
        }

        const issues = report.issues;
        if (issues.some(i => i.includes('Options Source ID mismatch'))) totalOptionMismatch++;
        if (issues.some(i => i.includes('Answer Source ID mismatch'))) totalAnswerMismatch++;
        if (issues.some(i => i.includes('Explanation Source ID mismatch'))) totalExplanationMismatch++;
        if (issues.some(i =>
          i.includes('Missing options') ||
          i.includes('instead of exactly 4') ||
          i.includes('empty option') ||
          i.includes('Options is not an array')
        )) totalMissingOptions++;
        if (issues.some(i =>
          (i.toLowerCase().includes('answer') && !i.includes('Answer Source ID mismatch'))
        )) totalInvalidAnswers++;
        if (issues.some(i => i.toLowerCase().includes('merged option'))) totalMergedOptions++;

        allErrors.push(
          `INVALID [${report.score}] ${qId} in ${cat}: ${report.issues.join(' | ')}`
        );
        quarantinedQuestions.push({
          status: 'INVALID',
          score: report.score,
          issues: report.issues,
          question: report.question
        });
      }
    });

    // ── Write production dataset (VALID only) ──────────────────────────────
    fs.writeFileSync(prodPath, JSON.stringify(validQuestions, null, 2), 'utf8');
    console.log(`   ✅ VALID:           ${validQuestions.length} → questions.json`);

    // ── Write REVIEW_REQUIRED file ─────────────────────────────────────────
    if (reviewQuestions.length > 0) {
      fs.writeFileSync(reviewPath, JSON.stringify(reviewQuestions, null, 2), 'utf8');
      console.log(`   🔶 REVIEW_REQUIRED: ${reviewQuestions.length} → review.json`);
    } else if (fs.existsSync(reviewPath)) {
      fs.unlinkSync(reviewPath);
    }

    // ── Write INVALID quarantine file ──────────────────────────────────────
    if (quarantinedQuestions.length > 0) {
      fs.writeFileSync(quarantinePath, JSON.stringify(quarantinedQuestions, null, 2), 'utf8');
      console.log(`   🔴 INVALID:         ${quarantinedQuestions.length} → quarantine.json`);
    } else if (fs.existsSync(quarantinePath)) {
      fs.unlinkSync(quarantinePath);
    }

    // Clean up temporary raw questions file
    if (fs.existsSync(rawPath)) {
      fs.unlinkSync(rawPath);
    }
  }

  // ── Topic Coverage ─────────────────────────────────────────────────────────
  const topicCounts: Record<string, number> = {};
  validQuestionsList.forEach(q => {
    const t = q.topic;
    if (t) {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    }
  });

  const coverageByTopic: Record<string, any> = {};
  for (const [topic, expected] of Object.entries(EXPECTED_COUNTS)) {
    const imported = topicCounts[topic] || 0;
    const coverage = expected > 0 ? (imported / expected) * 100.0 : 100.0;
    coverageByTopic[topic] = {
      expected,
      imported,
      missing: Math.max(0, expected - imported),
      coverage_pct: Math.round(Math.min(100, coverage) * 100) / 100
    };
  }

  // ── Final Audit Report ─────────────────────────────────────────────────────
  const totalRemovedFromProduction = totalInvalid + totalReviewRequired;
  const overallStatus =
    totalInvalid > 0 ? 'CRITICAL_FAILURES_FOUND' :
    totalReviewRequired > 0 ? 'REVIEW_REQUIRED' :
    'ALL_PASS';

  const auditReport = {
    generated_at: new Date().toISOString(),
    p0_release: true,
    explanation_generation_disabled: true,
    status: overallStatus,
    summary: {
      total_questions_scanned: totalScanned,
      valid_for_production: totalValid,
      review_required: totalReviewRequired,
      invalid_quarantined: totalInvalid,
      removed_from_production: totalRemovedFromProduction,
      duplicate_count: totalDuplicates,
      broken_asset_count: totalBrokenAssets
    },
    failure_breakdown: {
      options_source_id_mismatch: totalOptionMismatch,
      answer_source_id_mismatch: totalAnswerMismatch,
      explanation_source_id_mismatch: totalExplanationMismatch,
      missing_or_invalid_options: totalMissingOptions,
      invalid_answers: totalInvalidAnswers,
      merged_options: totalMergedOptions
    },
    critical_errors: allErrors,
    review_warnings: allReviewWarnings,
    coverage: coverageByTopic
  };

  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2), 'utf8');

  // ── Console Summary ────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log('  P0 VALIDATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log(`  Total Scanned:      ${totalScanned}`);
  console.log(`  ✅ VALID:           ${totalValid}`);
  console.log(`  🔶 REVIEW_REQUIRED: ${totalReviewRequired} (quarantined, not served)`);
  console.log(`  🔴 INVALID:         ${totalInvalid} (quarantined, not served)`);
  console.log(`  Duplicates:         ${totalDuplicates}`);
  console.log(`  Overall Status:     ${overallStatus}`);
  console.log(`\n  Audit report → ${reportPath}`);
  console.log('═══════════════════════════════════════════════════════════════════════');
}

main();
