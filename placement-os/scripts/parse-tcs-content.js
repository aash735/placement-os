const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDocx(docxPath) {
  const tempDir = path.join(__dirname, '..', 'temp_docx');
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
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/[ \t]+/g, ' ') // only collapse horizontal spaces, preserve newlines
      .split('\n').map(line => line.trim()).filter(Boolean).join('\n') // clean up empty lines
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

function parseQuestions(text, fileCode, category) {
  // Split by question numbers, e.g. "\n 1. ", "\n 2. ", etc.
  // We can use a regex to look for "\n 1. " or "\n 2. "
  // First, normalize spaces
  const normalizedText = '\n' + text.replace(/\r?\n/g, '\n');
  
  // Find all question boundaries
  // We look for \n followed by number then dot and space
  const qRegex = /\n\s*(\d+)\.\s+/g;
  const questions = [];
  
  let match;
  const positions = [];
  while ((match = qRegex.exec(normalizedText)) !== null) {
    positions.push({
      num: parseInt(match[1], 10),
      index: match.index,
      length: match[0].length
    });
  }
  
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index + positions[i].length;
    const end = (i + 1 < positions.length) ? positions[i + 1].index : normalizedText.length;
    const block = normalizedText.slice(start, end).trim();
    
    // Parse the block
    // It contains: question statement, options (a. b. c. d.), Answer: X, Explanation: Y
    let questionText = '';
    let options = [];
    let answerLetter = '';
    let explanation = '';
    
    // We can look for options a. b. c. d.
    // Options are sometimes single characters or have space: a. or a. or a) or b) etc.
    const optRegex = /\b([a-d])\.\s*|(?<=\d)([a-d])\.\s*/gi;
    const optPositions = [];
    let optMatch;
    while ((optMatch = optRegex.exec(block)) !== null) {
      optPositions.push({
        letter: (optMatch[1] || optMatch[2]).toLowerCase(),
        index: optMatch.index,
        length: optMatch[0].length
      });
    }
    
    // Find Answer: and Explanation:
    const ansMatch = block.match(/Answer:\s*([A-D])/i);
    const expMatch = block.match(/Explanation:\s*(.*)/is);
    
    let answerIndex = -1;
    if (ansMatch) {
      answerLetter = ansMatch[1].toUpperCase();
      answerIndex = answerLetter.charCodeAt(0) - 65; // 0 for A, 1 for B, etc.
    }
    
    if (expMatch) {
      explanation = expMatch[1].trim();
    }
    
    // Extract question statement and options
    if (optPositions.length > 0) {
      questionText = block.slice(0, optPositions[0].index).trim();
      
      for (let j = 0; j < optPositions.length; j++) {
        const oStart = optPositions[j].index + optPositions[j].length;
        // Option text goes until the next option or "Answer:"
        let oEnd = block.length;
        if (j + 1 < optPositions.length) {
          oEnd = optPositions[j + 1].index;
        } else {
          const ansIndex = block.search(/Answer:/i);
          if (ansIndex !== -1) oEnd = ansIndex;
        }
        
        let optionText = block.slice(oStart, oEnd).trim();
        // clean up trailing commas/dots
        optionText = optionText.replace(/^[;,\s]+|[;,\s]+$/g, '');
        options.push(optionText);
      }
    } else {
      // Numerical or short answer
      const ansIndex = block.search(/Answer:/i);
      if (ansIndex !== -1) {
        questionText = block.slice(0, ansIndex).trim();
      } else {
        questionText = block;
      }
    }
    
    // Clean up question text and explanation from Answer/Explanation markings
    questionText = questionText.replace(/Answer:\s*[A-D]/gi, '').trim();
    
    // If we have an explanation, remove it from the last option or from the block
    if (explanation) {
      // strip explanation from explanation itself if it contains trailing junk
      explanation = explanation.split(/\n\s*\d+\.\s+/)[0].trim();
    }
    
    // Map answer to option text
    let answerText = '';
    if (answerIndex >= 0 && answerIndex < options.length) {
      answerText = options[answerIndex];
    } else if (answerLetter) {
      answerText = answerLetter;
    }
    
    // Try to guess a topic based on keywords in the filename or text
    let topic = 'general';
    if (fileCode.includes('quant')) {
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
    } else if (fileCode.includes('verbal')) {
      if (questionText.toLowerCase().includes('grammatically') || questionText.toLowerCase().includes('errors')) {
        topic = 'grammar';
      } else if (questionText.toLowerCase().includes('passage') || questionText.toLowerCase().includes('read the following')) {
        topic = 'rc';
      } else {
        topic = 'vocab';
      }
    }
    
    questions.push({
      id: `${fileCode}-q${positions[i].num}`,
      question: questionText,
      options: options.length > 0 ? options : ['True', 'False'],
      answer: answerText || 'A',
      explanation: explanation || 'Refer to standard solutions.',
      shortcuts: [],
      difficulty: fileCode.includes('Quantitative') ? 2 : 1,
      topic,
      category,
      estimatedTime: category === 'quant' ? 75 : 45,
      companyRelevance: ['TCS']
    });
  }
  
  return questions;
}

const target = path.join(__dirname, '..', 'public', 'resources', 'tcs', 'TCS Ninja - Quantitative Aptitude_2(1).docx');
const text = extractDocx(target);
const questions = parseQuestions(text, 'tcs-ninja-quant-2', 'quant');
console.log(`Parsed ${questions.length} questions.`);
console.log('--- Question 1 Sample JSON ---');
console.log(JSON.stringify(questions[0], null, 2));
console.log('--- Question 2 Sample JSON ---');
console.log(JSON.stringify(questions[1], null, 2));
