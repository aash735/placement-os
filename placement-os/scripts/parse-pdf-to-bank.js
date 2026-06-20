const fs = require('fs');
const path = require('path');

function parseBank() {
  const filePath = path.join(__dirname, '..', 'scratch', 'pdf_extracted_lines.txt');
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const questions = [];
  let currentQ = null;
  let state = 'IDLE'; // IDLE, METADATA, BODY, OPTIONS, EXPLANATION
  let codeLines = [];
  let descLines = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // End parsing if we reach the ANSWER KEY section
    if (line.includes('ANSWER KEY')) {
      console.log(`Reached ANSWER KEY section on line ${i + 1}. Stopping parsing.`);
      break;
    }

    // Ignore headers, footers, page markers
    if (line === '' || 
        line.startsWith('--- PAGE') || 
        line.includes('DSA MCQ Bank — 200 Questions') ||
        line.includes('MASTER TOPIC SYLLABUS') ||
        line.includes('SECTION I —') ||
        line.includes('SECTION II —') ||
        line.includes('SECTION III —') ||
        line.includes('SECTION IV —')
       ) {
      continue;
    }

    // Check for a new question starting
    const qStartMatch = line.match(/^Q(\d+)\.\s*\[(Easy|Medium|Hard)\]$/i);
    if (qStartMatch) {
      // Save current question before starting new one
      if (currentQ) {
        currentQ.question = descLines.join('\n').trim();
        currentQ.code = codeLines.join('\n').trim();
        questions.push(currentQ);
      }

      const num = parseInt(qStartMatch[1], 10);
      const difficulty = qStartMatch[2];

      // Determine general topic based on question number range
      let topic = 'Trees';
      if (num > 50 && num <= 100) topic = 'Graphs';
      else if (num > 100 && num <= 150) topic = 'Dynamic Programming';
      else if (num > 150) topic = 'Language Internals';

      currentQ = {
        id: `mcq-${num}`,
        number: num,
        difficulty,
        topic,
        subtopic: '',
        title: '',
        question: '',
        code: '',
        options: [],
        answer: '',
        explanation: ''
      };

      descLines = [];
      codeLines = [];
      state = 'METADATA';
      continue;
    }

    if (!currentQ) continue;

    // Handle METADATA state
    if (state === 'METADATA') {
      const metaMatch = line.match(/^\[([^\]]+)\]\s*—\s*(.*)$/);
      if (metaMatch) {
        currentQ.subtopic = metaMatch[1].trim();
        currentQ.title = metaMatch[2].trim();
        state = 'BODY';
      } else {
        // If it doesn't match metadata line, treat it as body and push to description
        descLines.push(rawLine);
        state = 'BODY';
      }
      continue;
    }

    // Handle Answer line
    const ansMatch = line.match(/^Answer:\s*([A-D])$/i);
    if (ansMatch) {
      currentQ.answer = ansMatch[1].toUpperCase();
      state = 'EXPLANATION';
      continue;
    }

    // Handle Explanation line
    if (line.startsWith('Explanation:')) {
      currentQ.explanation = line.replace(/^Explanation:\s*/i, '');
      state = 'EXPLANATION';
      continue;
    }

    if (state === 'EXPLANATION') {
      currentQ.explanation += (currentQ.explanation ? '\n' : '') + rawLine;
      continue;
    }

    // Handle Options
    const optMatch = line.match(/^(?:3\s+)?([A-D])\)\s*(.*)$/);
    if (optMatch) {
      state = 'OPTIONS';
      const optLetter = optMatch[1];
      const optText = optMatch[2].trim();
      currentQ.options.push(`${optLetter}) ${optText}`);
      continue;
    }

    // If in OPTIONS state and not a new option or answer line, it's a continuation of the last option
    if (state === 'OPTIONS') {
      if (currentQ.options.length > 0) {
        const lastIndex = currentQ.options.length - 1;
        currentQ.options[lastIndex] += ' ' + line;
      }
      continue;
    }

    // Handle BODY state (parsing question description vs code)
    if (state === 'BODY') {
      // Check if it's a code line
      // Standard C++/Java signatures or syntax indicators
      const isCode = /[{};]|\b(struct|class|void|int|cout|cin|public|private|static|Node\*|Node\s+)\b|\/\/|#include/.test(line);
      if (isCode) {
        codeLines.push(rawLine);
      } else {
        descLines.push(rawLine);
      }
    }
  }

  // Push the final question
  if (currentQ) {
    currentQ.question = descLines.join('\n').trim();
    currentQ.code = codeLines.join('\n').trim();
    questions.push(currentQ);
  }

  console.log(`Parsed ${questions.length} questions.`);

  const outputDir = path.join(__dirname, '..', 'src', 'data');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'mcq-bank.json');
  fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf-8');
  console.log(`Saved to ${outputPath}`);

  // Let's print a sample to verify
  if (questions.length > 0) {
    console.log('Sample Question 1:', JSON.stringify(questions[0], null, 2));
    console.log('Sample Question 200:', JSON.stringify(questions[questions.length - 1], null, 2));
  }
}

parseBank();
