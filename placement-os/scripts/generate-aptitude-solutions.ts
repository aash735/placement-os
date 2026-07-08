import fs from 'fs';
import path from 'path';

// Define the required structure for explanation generation
const PROMPT_TEMPLATE = `
You are an expert Educational Content Engineer and Senior Mathematics Teacher.
Your task is to generate a pristine, highly educational explanation for an aptitude question.
DO NOT use phrases like "Analyze the question", "Apply the formula", "Compute the answer", "Calculate directly", etc.

For the given question, identify the chapter and topic, determine the mathematical approach, solve it independently, and output the explanation in the following EXACT Markdown format:

### Concept Used
[State the core concept, e.g., "Time and Work", "Profit and Loss", etc.]

### Formula Used
[State the relevant formulas. If none, state "Basic logical deduction"]

### Step-by-Step Calculation
[Show complete, rigorous calculations step-by-step]

### Final Answer Verification
[Verify the answer matches the provided correct answer]

### Short Learning Note
[Explain why this solution works and a quick tip for the student]

---

Question: "{questionText}"
Options: {options}
Correct Answer: "{correctAnswer}"
`;

// Paths to JSON files
const DATA_DIR = path.join(__dirname, '../src/data/aptitude');
const CATEGORIES = ['quantitative', 'logical', 'verbal', 'puzzles', 'data-interpretation'];

async function processFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf8');
  let questions = JSON.parse(rawData);
  let updatedCount = 0;

  for (let q of questions) {
    // Determine renderMode defaults
    if (!q.renderMode) {
      if (q.category === 'di' || q.topic === 'pie-charts' || q.topic === 'bar-graphs' || q.topic === 'line-graphs' || q.topic === 'tables') {
        q.renderMode = 'IMAGE'; // Force IMAGE for DI to prevent broken visuals
      } else {
        q.renderMode = 'TEXT';
      }
    }

    // Skip if explanation already matches the new format
    if (q.explanation && q.explanation.includes('### Concept Used') && q.explanation.includes('### Step-by-Step Calculation')) {
      continue;
    }

    console.log(`[Pending Generation] Needs new explanation: ${q.id}`);
    
    // In a real execution, you would call an LLM API here.
    // Example:
    // const prompt = PROMPT_TEMPLATE.replace('{questionText}', q.question).replace('{options}', JSON.stringify(q.options)).replace('{correctAnswer}', q.answer);
    // const newExplanation = await callLLM(prompt);
    // q.explanation = newExplanation;
    
    updatedCount++;
  }

  if (updatedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
    console.log(`Updated ${updatedCount} questions in ${filePath}`);
  } else {
    console.log(`No updates needed in ${filePath}`);
  }
}

async function main() {
  console.log('Starting Solution Generation Pipeline...');
  for (const category of CATEGORIES) {
    const filePath = path.join(DATA_DIR, category, 'questions.json');
    await processFile(filePath);
  }
  console.log('Pipeline completed. NOTE: Connect an LLM API to actually generate the text.');
}

main().catch(console.error);
