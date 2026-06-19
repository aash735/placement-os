const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDocx(docxPath) {
  const tempDir = path.join(__dirname, '..', 'temp_docx_mcq2');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    execSync(`tar -xf "${docxPath}" -C "${tempDir}"`, { stdio: 'ignore' });
    const xmlPath = path.join(tempDir, 'word', 'document.xml');
    if (!fs.existsSync(xmlPath)) return '';
    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
    const text = xmlContent
      .replace(/<w:p[^>]*>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/[ \t]+/g, ' ') // only collapse horizontal spaces, preserve newlines
      .split('\n').map(line => line.trim()).filter(Boolean).join('\n') // clean up empty lines
      .trim();
    return text;
  } catch (err) {
    return '';
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

const docxPath = path.join(__dirname, '..', '..', 'sheets', 'mcq dsa.docx');
const text = extractDocx(docxPath);
const scratchDir = path.join(__dirname, '..', 'scratch');
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}
fs.writeFileSync(path.join(scratchDir, 'mcq_extracted_python.py'), text);
console.log('Saved extracted text to scratch/mcq_extracted_python.py');

// Let's analyze where questions start
const qIndex = text.indexOf('questions = [');
if (qIndex !== -1) {
  console.log('Found "questions = [" at index', qIndex);
  console.log('Preview of questions list:', text.slice(qIndex, qIndex + 1000));
} else {
  console.log('"questions = [" not found!');
  // Let's search for "num" or "options" or "explanation"
  console.log('Occurrences of "explanation":', (text.match(/explanation/gi) || []).length);
  console.log('Occurrences of "questions":', (text.match(/questions/gi) || []).length);
}
