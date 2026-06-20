const fs = require('fs');
const path = require('path');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

async function dumpPdf() {
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
    console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
    
    let text = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      console.log(`Extracting page ${p}/${pdf.numPages}...`);
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      
      // Let's preserve line breaks if possible or join items on the same line/positions
      // Let's look at how the items are positioned. Just joining them with a space is a good start.
      // But let's check if item has newlines or structure.
      const pageText = textContent.items.map(item => item.str).join(' ').trim();
      text += `--- PAGE ${p} ---\n` + pageText + '\n\n';
    }
    
    const outputDir = path.join(__dirname, '..', 'scratch');
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'pdf_extracted.txt');
    fs.writeFileSync(outputPath, text, 'utf-8');
    console.log(`Successfully dumped PDF text to: ${outputPath}`);
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }
}

dumpPdf();
