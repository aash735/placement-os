/**
 * P0 Full Reconstruction – Phase 0: Source Book Diagnostic
 * 
 * Purpose: Analyze the R.S. Aggarwal PDF to determine extractability
 * before any question compilation begins.
 * 
 * Outputs:
 *   - generated/diagnostic/source-audit-report.json (machine-readable)
 *   - generated/diagnostic/source-audit-report.md (human-readable)
 * 
 * Determines:
 *   - Total pages in the PDF
 *   - Machine-readable pages vs image-only pages
 *   - OCR confidence distribution
 *   - DI/chart-heavy pages
 *   - Per-chapter page mapping and text quality
 *   - Estimated question counts
 *   - Missing page ranges
 */

const fs = require('fs');
const path = require('path');
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;

// ─── Authoritative Book Index ───────────────────────────────────────────────
const BOOK_CHAPTERS = [
  { index: 1, name: "Number System", section: "Arithmetical Ability", startPage: 3, endPage: 50, slug: "number-system" },
  { index: 2, name: "H.C.F. and L.C.M. of Numbers", section: "Arithmetical Ability", startPage: 51, endPage: 68, slug: "hcf-and-lcm-of-numbers" },
  { index: 3, name: "Decimal Fractions", section: "Arithmetical Ability", startPage: 69, endPage: 94, slug: "decimal-fractions" },
  { index: 4, name: "Simplification", section: "Arithmetical Ability", startPage: 95, endPage: 179, slug: "simplification" },
  { index: 5, name: "Square Roots and Cube Roots", section: "Arithmetical Ability", startPage: 180, endPage: 205, slug: "square-roots-and-cube-roots" },
  { index: 6, name: "Average", section: "Arithmetical Ability", startPage: 206, endPage: 239, slug: "average" },
  { index: 7, name: "Problems on Numbers", section: "Arithmetical Ability", startPage: 240, endPage: 263, slug: "problems-on-numbers" },
  { index: 8, name: "Problems on Ages", section: "Arithmetical Ability", startPage: 264, endPage: 277, slug: "problems-on-ages" },
  { index: 9, name: "Surds and Indices", section: "Arithmetical Ability", startPage: 278, endPage: 296, slug: "surds-and-indices" },
  { index: 10, name: "Logarithms", section: "Arithmetical Ability", startPage: 297, endPage: 307, slug: "logarithms" },
  { index: 11, name: "Percentage", section: "Arithmetical Ability", startPage: 308, endPage: 373, slug: "percentage" },
  { index: 12, name: "Profit and Loss", section: "Arithmetical Ability", startPage: 374, endPage: 425, slug: "profit-and-loss" },
  { index: 13, name: "Ratio and Proportion", section: "Arithmetical Ability", startPage: 426, endPage: 475, slug: "ratio-and-proportion" },
  { index: 14, name: "Partnership", section: "Arithmetical Ability", startPage: 476, endPage: 492, slug: "partnership" },
  { index: 15, name: "Chain Rule", section: "Arithmetical Ability", startPage: 493, endPage: 509, slug: "chain-rule" },
  { index: 16, name: "Pipes and Cisterns", section: "Arithmetical Ability", startPage: 510, endPage: 525, slug: "pipes-and-cisterns" },
  { index: 17, name: "Time and Work", section: "Arithmetical Ability", startPage: 526, endPage: 561, slug: "time-and-work" },
  { index: 18, name: "Time and Distance", section: "Arithmetical Ability", startPage: 562, endPage: 599, slug: "time-and-distance" },
  { index: 19, name: "Boats and Streams", section: "Arithmetical Ability", startPage: 600, endPage: 611, slug: "boats-and-streams" },
  { index: 20, name: "Problems on Trains", section: "Arithmetical Ability", startPage: 612, endPage: 632, slug: "problems-on-trains" },
  { index: 21, name: "Alligation or Mixture", section: "Arithmetical Ability", startPage: 633, endPage: 640, slug: "alligation-or-mixture" },
  { index: 22, name: "Simple Interest", section: "Arithmetical Ability", startPage: 641, endPage: 662, slug: "simple-interest" },
  { index: 23, name: "Compound Interest", section: "Arithmetical Ability", startPage: 663, endPage: 687, slug: "compound-interest" },
  { index: 24, name: "Area", section: "Arithmetical Ability", startPage: 688, endPage: 765, slug: "area" },
  { index: 25, name: "Volume and Surface Area", section: "Arithmetical Ability", startPage: 766, endPage: 813, slug: "volume-and-surface-area" },
  { index: 26, name: "Races and Games of Skill", section: "Arithmetical Ability", startPage: 814, endPage: 818, slug: "races-and-games-of-skill" },
  { index: 27, name: "Calendar", section: "Arithmetical Ability", startPage: 819, endPage: 822, slug: "calendar" },
  { index: 28, name: "Clocks", section: "Arithmetical Ability", startPage: 823, endPage: 833, slug: "clocks" },
  { index: 29, name: "Stocks and Shares", section: "Arithmetical Ability", startPage: 834, endPage: 840, slug: "stocks-and-shares" },
  { index: 30, name: "Permutations and Combinations", section: "Arithmetical Ability", startPage: 841, endPage: 849, slug: "permutations-and-combinations" },
  { index: 31, name: "Probability", section: "Arithmetical Ability", startPage: 850, endPage: 860, slug: "probability" },
  { index: 32, name: "True Discount", section: "Arithmetical Ability", startPage: 861, endPage: 865, slug: "true-discount" },
  { index: 33, name: "Banker's Discount", section: "Arithmetical Ability", startPage: 866, endPage: 869, slug: "bankers-discount" },
  { index: 34, name: "Heights and Distances", section: "Arithmetical Ability", startPage: 870, endPage: 876, slug: "heights-and-distances" },
  { index: 35, name: "Odd Man Out and Series", section: "Arithmetical Ability", startPage: 877, endPage: 883, slug: "odd-man-out-and-series" },
  { index: 36, name: "Tabulation", section: "Data Interpretation", startPage: 887, endPage: 904, slug: "tabulation" },
  { index: 37, name: "Bar Graphs", section: "Data Interpretation", startPage: 905, endPage: 922, slug: "bar-graphs" },
  { index: 38, name: "Pie Charts", section: "Data Interpretation", startPage: 923, endPage: 936, slug: "pie-charts" },
  { index: 39, name: "Line Graphs", section: "Data Interpretation", startPage: 937, endPage: 952, slug: "line-graphs" },
];

// ─── Page Classification Heuristics ─────────────────────────────────────────

/**
 * Classify a page based on its text content
 */
function classifyPage(text, pageNum) {
  const trimmed = text.trim();
  const charCount = trimmed.length;
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  
  // Count indicators
  const questionPatterns = trimmed.match(/(?:^|\n)\s*(?:\d{1,3})\s*[\.\)]/gm) || [];
  const optionPatterns = trimmed.match(/\([a-dA-D]\)/g) || [];
  const solutionPatterns = trimmed.match(/(?:sol(?:ution)?|ans(?:wer)?|hint)\s*[:\.]/gi) || [];
  const answerKeyPatterns = trimmed.match(/(?:^|\n)\s*\d{1,3}\s*\.\s*\([a-dA-D]\)/gm) || [];
  const formulaPatterns = trimmed.match(/[=+\-×÷√∛∞∑∏πΣ²³]/g) || [];
  const tablePatterns = trimmed.match(/\|/g) || [];
  const headerPatterns = trimmed.match(/(?:QUANTITATIVE\s+APTITUDE|ARITHMETICAL\s+ABILITY|DATA\s+INTERPRETATION|EXERCISE|SOLVED\s+EXAMPLES|HINTS?\s+(?:AND|&)\s+SOLUTIONS?|ANSWERS?)/gi) || [];
  
  // PUA characters (OCR artifacts)
  const puaChars = trimmed.match(/[\uE000-\uF8FF]/g) || [];
  const puaRatio = charCount > 0 ? puaChars.length / charCount : 0;
  
  // DI-related keywords
  const diKeywords = trimmed.match(/(?:table|graph|chart|pie|bar|line|diagram|figure|directions?.*(?:study|read|refer|following))/gi) || [];
  
  // Classification
  let pageType = 'UNKNOWN';
  let confidence = 0;
  
  if (charCount < 10) {
    pageType = 'BLANK';
    confidence = 100;
  } else if (charCount < 50) {
    pageType = 'MINIMAL_TEXT';
    confidence = 80;
  } else if (answerKeyPatterns.length >= 5) {
    pageType = 'ANSWER_KEY';
    confidence = 90;
  } else if (solutionPatterns.length >= 1 || trimmed.match(/HINTS?\s+(?:AND|&)\s+SOLUTIONS?/i)) {
    pageType = 'SOLUTION';
    confidence = 85;
  } else if (diKeywords.length >= 2 || tablePatterns.length >= 10) {
    pageType = 'DATA_INTERPRETATION';
    confidence = 80;
  } else if (questionPatterns.length >= 2 && optionPatterns.length >= 3) {
    pageType = 'QUESTION';
    confidence = 90;
  } else if (questionPatterns.length >= 1 || optionPatterns.length >= 2) {
    pageType = 'QUESTION';
    confidence = 70;
  } else if (headerPatterns.length >= 1 && wordCount < 200) {
    pageType = 'CHAPTER_HEADER';
    confidence = 75;
  } else if (formulaPatterns.length > 5 && questionPatterns.length === 0) {
    pageType = 'THEORY';
    confidence = 70;
  } else if (wordCount > 50) {
    pageType = 'THEORY';
    confidence = 60;
  } else {
    pageType = 'MIXED';
    confidence = 50;
  }
  
  // Determine text quality / readability
  let readability = 'HIGH';
  if (puaRatio > 0.1) {
    readability = 'LOW';
  } else if (puaRatio > 0.02 || charCount < 100) {
    readability = 'MEDIUM';
  }
  
  // Estimate question count on this page
  let estimatedQuestions = 0;
  if (pageType === 'QUESTION') {
    estimatedQuestions = questionPatterns.length;
  }
  
  return {
    pageNumber: pageNum,
    charCount,
    wordCount,
    pageType,
    classificationConfidence: confidence,
    readability,
    puaCharCount: puaChars.length,
    puaRatio: Math.round(puaRatio * 10000) / 100, // percentage
    questionIndicators: questionPatterns.length,
    optionIndicators: optionPatterns.length,
    solutionIndicators: solutionPatterns.length,
    answerKeyIndicators: answerKeyPatterns.length,
    diIndicators: diKeywords.length,
    formulaIndicators: formulaPatterns.length,
    estimatedQuestions,
    textSample: trimmed.substring(0, 200).replace(/\n/g, ' '),
  };
}

/**
 * Find which chapter a page belongs to
 */
function findChapter(pageNum) {
  for (const ch of BOOK_CHAPTERS) {
    if (pageNum >= ch.startPage && pageNum <= ch.endPage) {
      return ch;
    }
  }
  return null;
}

/**
 * Custom page renderer to get per-page text.
 * pdf-parse doesn't give per-page text by default, so we use the render callback.
 */
function createPageRenderer() {
  const pages = {};
  
  function renderPage(pageData) {
    return pageData.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    }).then(function(textContent) {
      let pageText = '';
      let lastY = null;
      
      for (const item of textContent.items) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
      
      pages[pageData.pageIndex + 1] = pageText;
      return pageText;
    });
  }
  
  return { renderPage, pages };
}

// ─── Main Diagnostic ────────────────────────────────────────────────────────

async function runDiagnostic() {
  const pdfPath = path.resolve(__dirname, '..', '..', 'aptitude', 
    'dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  P0 RECONSTRUCTION – SOURCE BOOK DIAGNOSTIC');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\nPDF Path: ${pdfPath}`);
  
  if (!fs.existsSync(pdfPath)) {
    console.error('❌ ERROR: PDF file not found at:', pdfPath);
    process.exit(1);
  }
  
  const pdfBuffer = fs.readFileSync(pdfPath);
  console.log(`PDF Size: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
  console.log('\nStarting page-by-page extraction...\n');
  
  // First pass: get total page count and full text
  const { PDFParse } = require('pdf-parse');
  const parser = new PDFParse({ data: pdfBuffer });
  const pdfData = await parser.getText();
  
  const totalPages = pdfData.total;
  const pages = {};
  pdfData.pages.forEach(p => {
    pages[p.num] = p.text;
  });
  console.log(`Total Pages Detected: ${totalPages}`);
  console.log(`Pages with extracted text: ${Object.keys(pages).length}`);
  
  // ─── Page-by-Page Analysis ──────────────────────────────────────────────
  const pageAnalysis = [];
  const chapterAnalysis = {};
  
  // Initialize chapter analysis
  for (const ch of BOOK_CHAPTERS) {
    chapterAnalysis[ch.index] = {
      ...ch,
      totalPages: ch.endPage - ch.startPage + 1,
      processedPages: 0,
      questionPages: 0,
      solutionPages: 0,
      theoryPages: 0,
      diPages: 0,
      blankPages: 0,
      unreadablePages: 0,
      highReadability: 0,
      mediumReadability: 0,
      lowReadability: 0,
      estimatedQuestions: 0,
      totalCharacters: 0,
      averageCharsPerPage: 0,
      puaCharTotal: 0,
    };
  }
  
  // Track unmapped pages
  const unmappedPages = [];
  
  // Counters
  let totalReadable = 0;
  let totalImageOnly = 0;
  let totalLowConfidence = 0;
  let totalBlank = 0;
  let totalQuestionPages = 0;
  let totalSolutionPages = 0;
  let totalTheoryPages = 0;
  let totalDIPages = 0;
  let totalEstimatedQuestions = 0;
  let totalPUAChars = 0;
  
  const readabilityDistribution = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  const pageTypeDistribution = {};
  
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const pageText = pages[pageNum] || '';
    const analysis = classifyPage(pageText, pageNum);
    pageAnalysis.push(analysis);
    
    // Update counters
    if (analysis.charCount < 10) {
      totalBlank++;
    } else if (analysis.readability === 'HIGH') {
      totalReadable++;
    } else if (analysis.readability === 'MEDIUM') {
      totalReadable++; // still readable, just lower quality
    } else {
      totalImageOnly++;
    }
    
    if (analysis.readability === 'LOW' || analysis.charCount < 50) {
      totalLowConfidence++;
    }
    
    readabilityDistribution[analysis.readability] = (readabilityDistribution[analysis.readability] || 0) + 1;
    pageTypeDistribution[analysis.pageType] = (pageTypeDistribution[analysis.pageType] || 0) + 1;
    
    if (analysis.pageType === 'QUESTION') totalQuestionPages++;
    if (analysis.pageType === 'SOLUTION') totalSolutionPages++;
    if (analysis.pageType === 'THEORY') totalTheoryPages++;
    if (analysis.pageType === 'DATA_INTERPRETATION') totalDIPages++;
    totalEstimatedQuestions += analysis.estimatedQuestions;
    totalPUAChars += analysis.puaCharCount;
    
    // Map to chapter
    const chapter = findChapter(pageNum);
    if (chapter) {
      const ca = chapterAnalysis[chapter.index];
      ca.processedPages++;
      ca.totalCharacters += analysis.charCount;
      ca.puaCharTotal += analysis.puaCharCount;
      ca.estimatedQuestions += analysis.estimatedQuestions;
      
      if (analysis.readability === 'HIGH') ca.highReadability++;
      else if (analysis.readability === 'MEDIUM') ca.mediumReadability++;
      else ca.lowReadability++;
      
      if (analysis.pageType === 'QUESTION') ca.questionPages++;
      else if (analysis.pageType === 'SOLUTION') ca.solutionPages++;
      else if (analysis.pageType === 'THEORY') ca.theoryPages++;
      else if (analysis.pageType === 'DATA_INTERPRETATION') ca.diPages++;
      else if (analysis.pageType === 'BLANK' || analysis.pageType === 'MINIMAL_TEXT') ca.blankPages++;
    } else {
      unmappedPages.push(pageNum);
    }
    
    // Progress indicator
    if (pageNum % 100 === 0 || pageNum === totalPages) {
      process.stdout.write(`  Analyzed ${pageNum}/${totalPages} pages...\r`);
    }
  }
  
  // Compute averages for chapters
  for (const ch of Object.values(chapterAnalysis)) {
    ch.averageCharsPerPage = ch.processedPages > 0 
      ? Math.round(ch.totalCharacters / ch.processedPages) 
      : 0;
  }
  
  console.log('\n');
  
  // ─── Find Missing Page Ranges ──────────────────────────────────────────
  // Pages that are not covered by any chapter in the book index
  const coveredPages = new Set();
  for (const ch of BOOK_CHAPTERS) {
    for (let p = ch.startPage; p <= ch.endPage; p++) {
      coveredPages.add(p);
    }
  }
  
  const gapPages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (!coveredPages.has(p)) {
      gapPages.push(p);
    }
  }
  
  // Collapse gap pages into ranges
  const gapRanges = [];
  if (gapPages.length > 0) {
    let rangeStart = gapPages[0];
    let rangeEnd = gapPages[0];
    for (let i = 1; i < gapPages.length; i++) {
      if (gapPages[i] === rangeEnd + 1) {
        rangeEnd = gapPages[i];
      } else {
        gapRanges.push({ start: rangeStart, end: rangeEnd, count: rangeEnd - rangeStart + 1 });
        rangeStart = gapPages[i];
        rangeEnd = gapPages[i];
      }
    }
    gapRanges.push({ start: rangeStart, end: rangeEnd, count: rangeEnd - rangeStart + 1 });
  }
  
  // ─── Estimate DI Question Count ────────────────────────────────────────
  let estimatedDIQuestions = 0;
  for (const ch of BOOK_CHAPTERS) {
    if (ch.section === 'Data Interpretation') {
      estimatedDIQuestions += chapterAnalysis[ch.index].estimatedQuestions;
    }
  }
  
  // ─── Build Report Object ───────────────────────────────────────────────
  const report = {
    generatedAt: new Date().toISOString(),
    pdfFile: path.basename(pdfPath),
    pdfSizeMB: Math.round(pdfBuffer.length / 1024 / 1024 * 100) / 100,
    
    summary: {
      totalPages,
      machineReadablePages: readabilityDistribution.HIGH + readabilityDistribution.MEDIUM,
      highReadabilityPages: readabilityDistribution.HIGH,
      mediumReadabilityPages: readabilityDistribution.MEDIUM,
      lowReadabilityPages: readabilityDistribution.LOW,
      blankOrMinimalPages: (pageTypeDistribution.BLANK || 0) + (pageTypeDistribution.MINIMAL_TEXT || 0),
      estimatedImageOnlyPages: totalImageOnly,
      totalPUACharacters: totalPUAChars,
    },
    
    pageTypeDistribution,
    readabilityDistribution,
    
    contentBreakdown: {
      questionPages: totalQuestionPages,
      solutionPages: totalSolutionPages,
      theoryPages: totalTheoryPages,
      dataInterpretationPages: totalDIPages,
      answerKeyPages: pageTypeDistribution.ANSWER_KEY || 0,
      chapterHeaderPages: pageTypeDistribution.CHAPTER_HEADER || 0,
      mixedPages: pageTypeDistribution.MIXED || 0,
      unknownPages: pageTypeDistribution.UNKNOWN || 0,
    },
    
    estimatedCounts: {
      totalEstimatedQuestions,
      estimatedDIQuestions,
      estimatedArithmeticQuestions: totalEstimatedQuestions - estimatedDIQuestions,
    },
    
    chapterCoverage: {
      totalChaptersInIndex: BOOK_CHAPTERS.length,
      chaptersWithContent: Object.values(chapterAnalysis).filter(c => c.processedPages > 0).length,
      chaptersMissing: Object.values(chapterAnalysis).filter(c => c.processedPages === 0).map(c => c.name),
    },
    
    unmappedPages: {
      count: unmappedPages.length,
      description: "Pages in the PDF not covered by any chapter in the book index (e.g., preface, TOC, section dividers)",
      gapRanges,
    },
    
    chapterDetails: Object.values(chapterAnalysis).map(ch => ({
      index: ch.index,
      name: ch.name,
      section: ch.section,
      pageRange: `${ch.startPage}-${ch.endPage}`,
      expectedPages: ch.totalPages,
      processedPages: ch.processedPages,
      questionPages: ch.questionPages,
      solutionPages: ch.solutionPages,
      readabilityBreakdown: {
        high: ch.highReadability,
        medium: ch.mediumReadability,
        low: ch.lowReadability,
      },
      estimatedQuestions: ch.estimatedQuestions,
      averageCharsPerPage: ch.averageCharsPerPage,
      puaCharacters: ch.puaCharTotal,
      status: ch.processedPages === 0 ? 'MISSING' 
        : ch.processedPages < ch.totalPages ? 'PARTIAL'
        : ch.lowReadability > ch.highReadability ? 'LOW_QUALITY'
        : 'OK',
    })),
    
    qualityAssessment: {
      overallReadabilityScore: totalPages > 0 
        ? Math.round(((readabilityDistribution.HIGH * 100 + readabilityDistribution.MEDIUM * 60 + readabilityDistribution.LOW * 20) / totalPages)) 
        : 0,
      extractionFeasibility: 'PENDING', // will be set below
      recommendedApproach: 'PENDING',
    },
    
    // Store first 3 pages of each type as samples for manual review
    pageSamples: {},
  };
  
  // Set quality assessment
  const readabilityScore = report.qualityAssessment.overallReadabilityScore;
  if (readabilityScore >= 75) {
    report.qualityAssessment.extractionFeasibility = 'HIGH';
    report.qualityAssessment.recommendedApproach = 'Text extraction with selective image fallback for low-confidence pages';
  } else if (readabilityScore >= 50) {
    report.qualityAssessment.extractionFeasibility = 'MEDIUM';
    report.qualityAssessment.recommendedApproach = 'Hybrid approach: text extraction for readable pages, image fallback for the rest';
  } else {
    report.qualityAssessment.extractionFeasibility = 'LOW';
    report.qualityAssessment.recommendedApproach = 'Image-first approach: render pages as images, extract text only where high confidence';
  }
  
  // Collect page samples per type
  for (const pa of pageAnalysis) {
    if (!report.pageSamples[pa.pageType]) {
      report.pageSamples[pa.pageType] = [];
    }
    if (report.pageSamples[pa.pageType].length < 3) {
      report.pageSamples[pa.pageType].push({
        pageNumber: pa.pageNumber,
        charCount: pa.charCount,
        wordCount: pa.wordCount,
        readability: pa.readability,
        textSample: pa.textSample,
      });
    }
  }
  
  // ─── Write JSON Report ─────────────────────────────────────────────────
  const outDir = path.resolve(__dirname, '..', 'generated', 'diagnostic');
  fs.mkdirSync(outDir, { recursive: true });
  
  const jsonPath = path.join(outDir, 'source-audit-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`✅ JSON report written: ${jsonPath}`);
  
  // Also write the full per-page analysis for detailed inspection
  const perPagePath = path.join(outDir, 'per-page-analysis.json');
  fs.writeFileSync(perPagePath, JSON.stringify(pageAnalysis, null, 2));
  console.log(`✅ Per-page analysis written: ${perPagePath}`);
  
  // ─── Print Summary to Console ──────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  DIAGNOSTIC RESULTS');
  console.log('═══════════════════════════════════════════════════════════');
  
  console.log(`\n📄 TOTAL PAGES: ${totalPages}`);
  console.log(`   Machine Readable (HIGH):   ${readabilityDistribution.HIGH}`);
  console.log(`   Machine Readable (MEDIUM): ${readabilityDistribution.MEDIUM}`);
  console.log(`   Low Readability:           ${readabilityDistribution.LOW}`);
  console.log(`   Blank/Minimal:             ${(pageTypeDistribution.BLANK || 0) + (pageTypeDistribution.MINIMAL_TEXT || 0)}`);
  
  console.log(`\n📊 PAGE TYPE DISTRIBUTION:`);
  for (const [type, count] of Object.entries(pageTypeDistribution).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${type.padEnd(25)} ${count}`);
  }
  
  console.log(`\n📘 CHAPTER COVERAGE: ${report.chapterCoverage.chaptersWithContent}/${report.chapterCoverage.totalChaptersInIndex}`);
  if (report.chapterCoverage.chaptersMissing.length > 0) {
    console.log(`   ⚠️  Missing: ${report.chapterCoverage.chaptersMissing.join(', ')}`);
  }
  
  console.log(`\n📈 ESTIMATED QUESTION COUNT: ${totalEstimatedQuestions}`);
  console.log(`   Arithmetic: ${totalEstimatedQuestions - estimatedDIQuestions}`);
  console.log(`   DI:         ${estimatedDIQuestions}`);
  
  console.log(`\n🔧 PUA CHARACTERS (OCR Artifacts): ${totalPUAChars}`);
  
  console.log(`\n📐 UNMAPPED PAGES: ${unmappedPages.length}`);
  if (gapRanges.length > 0) {
    for (const r of gapRanges) {
      console.log(`   Pages ${r.start}-${r.end} (${r.count} pages)`);
    }
  }
  
  console.log(`\n🎯 OVERALL READABILITY SCORE: ${readabilityScore}/100`);
  console.log(`   Extraction Feasibility: ${report.qualityAssessment.extractionFeasibility}`);
  console.log(`   Recommended Approach: ${report.qualityAssessment.recommendedApproach}`);
  
  console.log('\n───────────────────────────────────────────────────────────');
  console.log('  PER-CHAPTER SUMMARY');
  console.log('───────────────────────────────────────────────────────────');
  console.log('Ch# | Chapter Name                        | Pages | Qs Est | Readability | Status');
  console.log('----|-------------------------------------|-------|--------|-------------|-------');
  
  for (const ch of report.chapterDetails) {
    const name = ch.name.substring(0, 35).padEnd(35);
    const pages = `${ch.processedPages}/${ch.expectedPages}`.padEnd(5);
    const qs = String(ch.estimatedQuestions).padEnd(6);
    const readability = `H:${ch.readabilityBreakdown.high} M:${ch.readabilityBreakdown.medium} L:${ch.readabilityBreakdown.low}`.padEnd(11);
    console.log(`${String(ch.index).padStart(3)} | ${name} | ${pages} | ${qs} | ${readability} | ${ch.status}`);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  DIAGNOSTIC COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  
  return report;
}

// Run
runDiagnostic().catch(err => {
  console.error('❌ DIAGNOSTIC FAILED:', err);
  process.exit(1);
});
