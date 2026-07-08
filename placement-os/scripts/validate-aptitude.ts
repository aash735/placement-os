import * as fs from 'fs';
import * as path from 'path';
import { validateQuestion } from '../src/lib/aptitude-validator';
import type { AptitudeQuestion } from '../src/data/aptitude-questions';

const baseDir = path.join(__dirname, '..', 'src', 'data', 'aptitude');
const reportPath = path.join(__dirname, '..', 'aptitude-audit-report.json');

const EXPECTED_COUNTS: Record<string, number> = {
  // Quant
  "number-system": 180,
  "h-c-f-and-l-c-m-of-numbers": 85,
  "decimal-fractions": 95,
  "simplification": 240,
  "square-roots-and-cube-roots": 90,
  "average": 130,
  "problems-on-numbers": 80,
  "problems-on-ages": 65,
  "surds-and-indices": 85,
  "logarithms": 55,
  "percentage": 210,
  "profit-and-loss": 180,
  "ratio-and-proportion": 160,
  "partnership": 60,
  "chain-rule": 70,
  "pipes-and-cisterns": 60,
  "time-and-work": 125,
  "time-distance": 115,
  "boats-and-streams": 40,
  "problems-on-trains": 80,
  "alligation-or-mixture": 35,
  "simple-interest": 80,
  "compound-interest": 90,
  "area": 200,
  "volume-and-surface-areas": 150,
  "races-and-games-of-skill": 20,
  "stocks-and-shares": 35,
  "permutation-and-combination": 45,
  "probability": 50,
  "true-discount": 25,
  "banker-s-discount": 25,
  "heights-and-distances": 30,
  // Logical
  "calendar": 25,
  "clocks": 30,
  "odd-man-out-and-series": 55,
  // DI
  "tabulation": 100,
  "bar-graphs": 80,
  "pie-chart": 70,
  "line-graphs": 80
};

function toPhase3Schema(q: any): any {
  if (q.questionId && q.options && typeof q.options === 'object' && !Array.isArray(q.options)) {
    return q;
  }
  
  const optionsObj = {
    A: q.options && q.options[0] ? q.options[0] : '',
    B: q.options && q.options[1] ? q.options[1] : '',
    C: q.options && q.options[2] ? q.options[2] : '',
    D: q.options && q.options[3] ? q.options[3] : ''
  };
  
  let answerKey = q.answer;
  if (q.options && Array.isArray(q.options)) {
    const ansIdx = q.options.indexOf(q.answer);
    if (ansIdx !== -1) {
      answerKey = String.fromCharCode(65 + ansIdx);
    }
  }
  
  return {
    questionId: q.id,
    chapter: q.topic,
    question: q.question,
    options: optionsObj,
    answer: answerKey,
    page: typeof q.sourcePage === 'number' ? q.sourcePage : parseInt(q.sourcePage as string) || 0,
    id: q.id,
    topic: q.topic,
    category: q.category,
    difficulty: q.difficulty,
    estimatedTime: q.estimatedTime,
    companyRelevance: q.companyRelevance,
    explanation: q.explanation,
    questionImage: q.questionImage,
    optionsImage: q.optionsImage,
    renderMode: q.renderMode,
    tableData: q.tableData,
    chartData: q.chartData,
    chartType: q.chartType,
    importBatch: q.importBatch,
    optionsSourceId: q.optionsSourceId,
    answerSourceId: q.answerSourceId,
    explanationSourceId: q.explanationSourceId,
    sourceFile: q.sourceFile
  };
}

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
    const phase3ValidQuestions = validQuestions.map(q => toPhase3Schema(q));
    fs.writeFileSync(prodPath, JSON.stringify(phase3ValidQuestions, null, 2), 'utf8');
    console.log(`   ✅ VALID:           ${validQuestions.length} → questions.json`);

    // ── Write REVIEW_REQUIRED file ─────────────────────────────────────────
    if (reviewQuestions.length > 0) {
      const phase3ReviewQuestions = reviewQuestions.map(item => ({
        ...item,
        question: toPhase3Schema(item.question)
      }));
      fs.writeFileSync(reviewPath, JSON.stringify(phase3ReviewQuestions, null, 2), 'utf8');
      console.log(`   🔶 REVIEW_REQUIRED: ${reviewQuestions.length} → review.json`);
    } else if (fs.existsSync(reviewPath)) {
      fs.unlinkSync(reviewPath);
    }

    // ── Write INVALID quarantine file ──────────────────────────────────────
    if (quarantinedQuestions.length > 0) {
      const phase3QuarantinedQuestions = quarantinedQuestions.map(item => ({
        ...item,
        question: toPhase3Schema(item.question)
      }));
      fs.writeFileSync(quarantinePath, JSON.stringify(phase3QuarantinedQuestions, null, 2), 'utf8');
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
