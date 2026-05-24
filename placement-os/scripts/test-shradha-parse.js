const fs = require("fs");
const path = require("path");

function main() {
  const filePath = path.join(__dirname, "..", "generated", "questions.json");
  if (!fs.existsSync(filePath)) {
    console.log("questions.json does not exist yet. Please run sync first.");
    return;
  }
  const questions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  console.log(`Total questions in generated/questions.json: ${questions.length}`);
  
  const counts = {};
  questions.forEach(q => {
    counts[q.topicId] = (counts[q.topicId] || 0) + 1;
  });
  
  console.log("Question count by topicId:");
  console.log(JSON.stringify(counts, null, 2));
}

main();
