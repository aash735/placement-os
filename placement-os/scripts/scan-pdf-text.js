const fs = require('fs');
const path = require('path');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

async function scanPdfs() {
  const tcsDir = path.join(__dirname, '..', 'public', 'resources', 'tcs');
  const files = fs.readdirSync(tcsDir).filter(f => f.endsWith('.pdf'));
  
  console.log(`Discovered ${files.length} PDF files. Scanning text lengths...`);
  
  for (const file of files) {
    const filePath = path.join(tcsDir, file);
    try {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const loadingTask = pdfjs.getDocument({ data });
      const pdf = await loadingTask.promise;
      
      let textLength = 0;
      for (let p = 1; p <= Math.min(3, pdf.numPages); p++) {
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ').trim();
        textLength += text.length;
      }
      
      console.log(`File: ${file} | Pages: ${pdf.numPages} | Pre-scan Text Length (Pages 1-3): ${textLength}`);
    } catch (err) {
      console.error(`Error scanning ${file}:`, err.message);
    }
  }
}

scanPdfs();
