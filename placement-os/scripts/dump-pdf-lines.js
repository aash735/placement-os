const fs = require('fs');
const path = require('path');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

async function dumpPdfLines() {
  const filePath = path.join(__dirname, '..', '..', 'sheets', 'DSA_MCQ_Bank_200Q_20260620.pdf');
  console.log(`Loading PDF from ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjs.getDocument({ data });
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded. Total pages: ${pdf.numPages}`);
    
    let text = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      console.log(`Extracting page ${p}/${pdf.numPages}...`);
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      
      // Group items by their Y-coordinate
      // Y-coordinate is transform[5]
      // X-coordinate is transform[4]
      const items = textContent.items;
      
      // We will group items that have very close Y coordinates
      const lines = [];
      const tolerance = 5.0; // Y-coordinate tolerance
      
      for (const item of items) {
        if (!item.str || item.str.trim() === '') continue;
        const x = item.transform[4];
        const y = item.transform[5];
        
        let foundLine = false;
        for (const line of lines) {
          if (Math.abs(line.y - y) < tolerance) {
            line.items.push({ text: item.str, x });
            foundLine = true;
            break;
          }
        }
        
        if (!foundLine) {
          lines.push({
            y,
            items: [{ text: item.str, x }]
          });
        }
      }
      
      // Sort lines by Y descending (top to bottom)
      lines.sort((a, b) => b.y - a.y);
      
      // For each line, sort items by X ascending (left to right) and join
      let pageText = '';
      for (const line of lines) {
        line.items.sort((a, b) => a.x - b.x);
        const lineText = line.items.map(it => it.text).join(' ');
        pageText += lineText + '\n';
      }
      
      text += `--- PAGE ${p} ---\n` + pageText + '\n';
    }
    
    const outputPath = path.join(__dirname, '..', 'scratch', 'pdf_extracted_lines.txt');
    fs.writeFileSync(outputPath, text, 'utf-8');
    console.log(`Successfully dumped PDF text with lines to: ${outputPath}`);
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }
}

dumpPdfLines();
