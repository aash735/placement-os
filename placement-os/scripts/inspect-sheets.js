const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

function inspectSheet(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  console.log(`\n==================================================`);
  console.log(`Inspecting: ${filePath}`);
  console.log(`==================================================`);
  const workbook = XLSX.readFile(filePath);
  
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`\nSheet "${sheetName}": Total rows = ${rows.length}`);
    
    // Find rows that look like headers
    rows.forEach((row, i) => {
      if (!row || !Array.isArray(row)) return;
      const isHeader = row.some(cell => {
        if (cell === null || cell === undefined) return false;
        const s = String(cell).toLowerCase().trim();
        return ["topic", "difficulty", "subtopic", "pattern", "companies", "tags", "title", "link", "url"].includes(s);
      });
      
      if (isHeader) {
        console.log(`  Found potential header at Row ${i}:`, row);
        // Print next 3 rows
        for (let j = 1; j <= 3; j++) {
          if (i + j < rows.length) {
            console.log(`    Row ${i+j}:`, rows[i+j]);
          }
        }
      }
    });
  });
}

function main() {
  const sheetsDir = path.join(__dirname, "..", "..", "sheets");
  inspectSheet(path.join(sheetsDir, "Book1.xlsx"));
  inspectSheet(path.join(sheetsDir, "DSA by Shradha Ma'am.xlsx"));
}

main();
