const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Read all rows, skip headers, find actual question data rows
const filePath = path.join(process.cwd(), '..', 'sheets', "DSA by Shradha Ma'am.xlsx");
const wb = XLSX.readFile(filePath, { cellFormula: true });

let totalQuestions = 0;
let topicCounts = {};

// Valid topics from the sheet
const VALID_TOPICS = new Set([
  'arrays', 'strings', '2d arrays', 'searching & sorting', 'searching and sorting',
  'linked list', 'stacks & queues', 'stacks and queues', 'binary trees', 'binary search trees',
  'heaps & hashing', 'heaps and hashing', 'graphs', 'dp', 'greedy', 'backtracking',
  'tries', 'segment trees', 'bit manipulation', 'recursion', 'divide and conquer',
  'sliding window', 'two pointers', 'maths', 'matrix', 'dynamic programming'
]);

wb.SheetNames.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  
  let currentTopic = '';
  let sheetQuestions = 0;
  
  rows.forEach((row, i) => {
    const col0 = String(row[0] || '').trim();
    const col1 = String(row[1] || '').trim();
    const col2 = String(row[2] || '').trim();
    
    // Detect topic lines: col0 is a topic name and col1 is a question
    const col0Lower = col0.toLowerCase();
    const isTopicName = col0 && VALID_TOPICS.has(col0Lower);
    
    // Skip meta rows
    if (col0.includes("Shradha") || col0.includes("Meet us") || col0.includes("Ideal Time") ||
        col0 === 'Easy' || col0 === 'Medium' || col0 === 'Hard' ||
        col0 === 'Topics' || col0 === 'Topic' || col1 === '' ||
        col1.toLowerCase().includes("question")) {
      return;
    }
    
    if (isTopicName && col1) {
      currentTopic = col0;
      totalQuestions++;
      sheetQuestions++;
      topicCounts[col0] = (topicCounts[col0] || 0) + 1;
    }
  });
  
  console.log('Sheet:', sheetName, '| Questions found:', sheetQuestions);
});

console.log('\nTotal questions:', totalQuestions);
console.log('\nTopics:');
Object.entries(topicCounts).sort((a,b) => b[1]-a[1]).forEach(([t,c]) => {
  console.log(`  ${t}: ${c}`);
});
