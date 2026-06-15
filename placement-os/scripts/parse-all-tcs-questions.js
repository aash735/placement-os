const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDocxText(docxPath) {
  const tempDir = path.join(__dirname, '..', 'temp_docx_all');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    execSync(`tar -xf "${docxPath}" -C "${tempDir}"`, { stdio: 'ignore' });
    const xmlPath = path.join(tempDir, 'word', 'document.xml');
    if (!fs.existsSync(xmlPath)) return '';
    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
    const text = xmlContent
      .replace(/<w:p[^>]*>/g, '\n')
      .replace(/<\/w:tr>/g, '\n')
      .replace(/<\/w:tc>/g, ' ')
      .replace(/<w:tab[^>]*>/g, ' ')
      .replace(/<w:br[^>]*>/g, '\n')
      .replace(/<\/w:t>/g, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/[ \t]+/g, ' ')
      .split('\n').map(line => line.trim()).filter(Boolean).join('\n')
      .trim();
    return text;
  } catch (err) {
    return '';
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

// Helper to sanitize strings for JSON
function sanitize(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n');
}

function parseMcqBlock(text, fileCode, category) {
  const normalizedText = '\n' + text.replace(/\r?\n/g, '\n');
  const qRegex = /\n\s*(\d+)\s*\.\s*(?!\d)/g;
  const questions = [];
  
  let match;
  const positions = [];
  let prevNum = 0;
  while ((match = qRegex.exec(normalizedText)) !== null) {
    const num = parseInt(match[1], 10);
    if (prevNum === 0 || num > prevNum) {
      positions.push({
        num: num,
        index: match.index,
        length: match[0].length
      });
      prevNum = num;
    }
  }
  
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index + positions[i].length;
    const end = (i + 1 < positions.length) ? positions[i + 1].index : normalizedText.length;
    const block = normalizedText.slice(start, end).trim();
    
    let questionText = '';
    let options = [];
    let answerLetter = '';
    let explanation = '';
    
    // Parse options - only search before the Answer label if it exists
    const ansIndexForOpts = block.search(/Answer\s*:/i);
    const optsSearchBlock = ansIndexForOpts !== -1 ? block.slice(0, ansIndexForOpts) : block;
    
    const optRegex = /\b([a-d])\s*\.\s*|(?<=\d)([a-d])\s*\.\s*|(?<=[A-Z])([a-d])\s*\.\s*/g;
    const optPositions = [];
    let optMatch;
    while ((optMatch = optRegex.exec(optsSearchBlock)) !== null) {
      optPositions.push({
        letter: (optMatch[1] || optMatch[2] || optMatch[3]).toLowerCase(),
        index: optMatch.index,
        length: optMatch[0].length
      });
    }
    
    const ansMatch = block.match(/Answer\s*:\s*([A-D])/i);
    const expMatch = block.match(/Explanation\s*:\s*(.*)/is);
    
    let answerIndex = -1;
    if (ansMatch) {
      answerLetter = ansMatch[1].toUpperCase();
      answerIndex = answerLetter.charCodeAt(0) - 65;
    }
    
    if (expMatch) {
      explanation = expMatch[1].trim();
    }
    
    if (optPositions.length > 0) {
      questionText = block.slice(0, optPositions[0].index).trim();
      
      for (let j = 0; j < optPositions.length; j++) {
        const oStart = optPositions[j].index + optPositions[j].length;
        let oEnd = block.length;
        if (j + 1 < optPositions.length) {
          oEnd = optPositions[j + 1].index;
        } else {
          const ansIndex = block.search(/Answer\s*:/i);
          if (ansIndex !== -1) oEnd = ansIndex;
        }
        
        let optionText = block.slice(oStart, oEnd).trim();
        optionText = optionText.replace(/^[;,\s]+|[;,\s]+$/g, '');
        options.push(optionText);
      }
    } else {
      const ansIndex = block.search(/Answer\s*:/i);
      if (ansIndex !== -1) {
        questionText = block.slice(0, ansIndex).trim();
      } else {
        questionText = block;
      }
    }
    
    questionText = questionText.replace(/Answer\s*:\s*[A-D]/gi, '').trim();
    if (explanation) {
      explanation = explanation.split(/\n\s*\d+\.\s+/)[0].trim();
    }
    
    let answerText = '';
    if (answerIndex >= 0 && answerIndex < options.length) {
      answerText = options[answerIndex];
    } else if (answerLetter) {
      answerText = answerLetter;
    }
    
    // Guess topic
    let topic = 'general';
    if (category === 'quant') {
      if (questionText.toLowerCase().includes('work') || questionText.toLowerCase().includes('complete a work')) {
        topic = 'time-work';
      } else if (questionText.toLowerCase().includes('speed') || questionText.toLowerCase().includes('train') || questionText.toLowerCase().includes('mph')) {
        topic = 'speed';
      } else if (questionText.toLowerCase().includes('ratio') || questionText.toLowerCase().includes('proportion')) {
        topic = 'ratios';
      } else if (questionText.toLowerCase().includes('percent') || questionText.toLowerCase().includes('profit') || questionText.toLowerCase().includes('loss')) {
        topic = 'percentages';
      } else if (questionText.toLowerCase().includes('series') || questionText.toLowerCase().includes('pattern')) {
        topic = 'series';
      }
    } else if (category === 'verbal') {
      if (questionText.toLowerCase().includes('grammatically') || questionText.toLowerCase().includes('errors')) {
        topic = 'grammar';
      } else if (questionText.toLowerCase().includes('passage') || questionText.toLowerCase().includes('read the following')) {
        topic = 'rc';
      } else {
        topic = 'vocab';
      }
    } else if (category === 'logical') {
      if (questionText.toLowerCase().includes('brother') || questionText.toLowerCase().includes('sister') || questionText.toLowerCase().includes('mother')) {
        topic = 'blood-relations';
      } else if (questionText.toLowerCase().includes('statements') || questionText.toLowerCase().includes('conclusions')) {
        topic = 'syllogism';
      } else if (questionText.toLowerCase().includes('series') || questionText.toLowerCase().includes('complete the series')) {
        topic = 'series';
      } else {
        topic = 'coding-decoding';
      }
    }
    
    // De-duplicate options
    const finalOptions = options.length > 0 ? options : ['A', 'B', 'C', 'D'];
    
    questions.push({
      id: `${fileCode}-q${positions[i].num}`,
      question: questionText,
      options: finalOptions,
      answer: answerText || finalOptions[0],
      explanation: explanation || 'Refer to standard solutions.',
      shortcuts: [],
      difficulty: category === 'quant' ? 2 : 1,
      topic,
      category,
      estimatedTime: category === 'quant' ? 75 : 45,
      companyRelevance: ['TCS']
    });
  }
  
  return questions;
}

function parseCodingBlock(text, fileCode) {
  const codingIdx = text.search(/CODING/i);
  if (codingIdx === -1) return null;
  
  const block = text.slice(codingIdx + 6).trim();
  const includeIdx = block.indexOf('#include');
  
  let description = '';
  let code = '';
  
  if (includeIdx !== -1) {
    description = block.slice(0, includeIdx).trim();
    code = block.slice(includeIdx).trim();
  } else {
    description = block;
  }
  
  // Clean description: remove any header garbage
  let cleanDesc = description
    .replace(/^.*?CODING\s+/is, '')
    .trim();
  
  // Extract a clean title from the description
  let title = cleanDesc
    .split('\n')[0]
    .replace(/^Program to\s+|^Write a\s+|^Given two lines, write\s+/i, '')
    .trim();
  
  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (title.endsWith('.')) title = title.slice(0, -1);
  
  // Map to correct topicId
  let topicId = 'strings';
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('array') || lowerTitle.includes('elements')) {
    topicId = 'arrays';
  } else if (lowerTitle.includes('factorial') || lowerTitle.includes('circle') || lowerTitle.includes('lines') || lowerTitle.includes('point')) {
    topicId = 'maths';
  }
  
  return {
    id: fileCode,
    title: title,
    description: cleanDesc,
    solutionCode: code,
    difficulty: 'Easy',
    topicId: topicId,
    estimatedMinutes: 20,
    company: 'TCS'
  };
}

function main() {
  const tcsDir = path.join(__dirname, '..', 'public', 'resources', 'tcs');
  if (!fs.existsSync(tcsDir)) {
    console.error('TCS resources directory not found');
    return;
  }
  
  const files = fs.readdirSync(tcsDir).filter(f => f.endsWith('.docx'));
  const allMcqs = [];
  const allCoding = [];
  
  for (const file of files) {
    const lower = file.toLowerCase();
    if (lower.includes('technical questions') || lower.includes('technical-questions')) {
      console.log(`Skipping Q&A document from MCQ parsing: ${file}`);
      continue;
    }
    const fullPath = path.join(tcsDir, file);
    const text = extractDocxText(fullPath);
    if (!text) continue;
    
    let fileCode = path.basename(file, '.docx')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    if (lower.includes('quant')) {
      const qs = parseMcqBlock(text, fileCode, 'quant');
      allMcqs.push(...qs);
      console.log(`Parsed ${qs.length} MCQs from ${file}`);
    } else if (lower.includes('verbal')) {
      const qs = parseMcqBlock(text, fileCode, 'verbal');
      allMcqs.push(...qs);
      console.log(`Parsed ${qs.length} MCQs from ${file}`);
    } else if (lower.includes('coding') || lower.includes('tcs_0') || lower.includes('tcs_05c')) {
      const q = parseCodingBlock(text, fileCode);
      if (q) {
        allCoding.push(q);
        console.log(`Parsed Coding Challenge "${q.title}" from ${file}`);
      }
    } else if (lower.includes('tcs17-') || lower.includes('technical')) {
      // General technical MCQs, map to "logical" or "quant" or general logical
      const qs = parseMcqBlock(text, fileCode, 'logical');
      allMcqs.push(...qs);
      console.log(`Parsed ${qs.length} Technical MCQs from ${file}`);
    }
  }
  
  // De-duplicate MCQs by question statement
  const seenQs = new Set();
  const uniqueMcqs = [];
  allMcqs.forEach(q => {
    const norm = q.question.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenQs.has(norm)) {
      seenQs.add(norm);
      uniqueMcqs.push(q);
    }
  });
  
  console.log(`\nScan Complete:`);
  console.log(`Total MCQs parsed: ${allMcqs.length} -> Unique MCQs: ${uniqueMcqs.length}`);
  console.log(`Total Coding Challenges: ${allCoding.length}`);
  
  // Write to src/data/tcs-questions.ts
  const tsContent = `// Auto-generated TCS Native Questions file.
import type { AptitudeQuestion } from "./aptitude-questions";

export interface TcsCodingQuestion {
  id: string;
  title: string;
  description: string;
  solutionCode: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicId: string;
  estimatedMinutes: number;
  company: string;
}

export const tcsAptitudeQuestions: AptitudeQuestion[] = ${JSON.stringify(uniqueMcqs, null, 2)};

export const tcsCodingQuestions: TcsCodingQuestion[] = ${JSON.stringify(allCoding, null, 2)};
`;

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'tcs-questions.ts');
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`\nSuccessfully generated native questions registry: ${outputPath}`);
}

main();
