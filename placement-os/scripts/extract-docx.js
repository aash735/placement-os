const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDocx(docxPath) {
  const tempDir = path.join(__dirname, '..', 'temp_docx');
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
      .replace(/\s+/g, ' ')
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

const target = path.join(__dirname, '..', 'public', 'resources', 'tcs', 'TCS Ninja - Quantitative Aptitude_2(1).docx');
const text = extractDocx(target);
console.log('--- Quant 2 Text Preview ---');
console.log(text.slice(0, 3000));
