const fs = require('fs');
const path = require('path');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');

async function test() {
  const filePath = path.join(__dirname, '..', 'public', 'resources', 'tcs', 'Tcs-Placement-Papers-1.pdf');
  console.log(`Loading ${filePath}...`);
  
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjs.getDocument({ data });
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded. Total pages: ${pdf.numPages}`);
    
    let text = '';
    for (let p = 1; p <= Math.min(3, pdf.numPages); p++) {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      text += textContent.items.map(item => item.str).join(' ').trim() + '\n';
    }
    console.log('--- PDF Text Preview ---');
    console.log(text.slice(0, 2000));
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }
}

test();
