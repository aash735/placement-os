import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const dsaDir = path.join(process.cwd(), "sheets", "dsa");
const csvFile = path.join(dsaDir, "questions.csv");

function main() {
  if (!fs.existsSync(csvFile)) {
    console.error(`Error: ${csvFile} not found!`);
    process.exit(1);
  }

  console.log(`Reading master questions from: ${csvFile}`);
  
  // Read CSV
  const workbook = XLSX.readFile(csvFile);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // Parse rows as raw JSON objects
  const rows = XLSX.utils.sheet_to_json<any>(sheet);
  console.log(`Parsed ${rows.length} total questions.`);

  // Group by topic
  const groups: Record<string, any[]> = {};
  for (const row of rows) {
    const topic = (row.topic || "general").trim().toLowerCase();
    if (!groups[topic]) {
      groups[topic] = [];
    }
    groups[topic].push(row);
  }

  // Write individual XLSX files
  for (const [topic, topicRows] of Object.entries(groups)) {
    const safeTopicName = topic === "linked-list" ? "linkedlist" : topic;
    const outPath = path.join(dsaDir, `${safeTopicName}.xlsx`);
    
    console.log(`Writing topic "${topic}" (${topicRows.length} questions) to ${outPath}`);
    
    const newWb = XLSX.utils.book_new();
    const newWs = XLSX.utils.json_to_sheet(topicRows);
    XLSX.utils.book_append_sheet(newWb, newWs, "Questions");
    XLSX.writeFile(newWb, outPath);
  }

  // Backup and delete original CSV
  const backupPath = path.join(dsaDir, "questions.csv.bak");
  fs.renameSync(csvFile, backupPath);
  console.log(`Moved questions.csv to backup: ${backupPath}`);
  console.log("Sheet splitting completed successfully!");
}

main();
