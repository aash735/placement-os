const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function extractDocx(docxPath) {
  const tempDir = path.join(__dirname, '..', 'temp_docx_mcq');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    // Attempt to unzip docx using tar
    console.log(`Running: tar -xf "${docxPath}" -C "${tempDir}"`);
    execSync(`tar -xf "${docxPath}" -C "${tempDir}"`, { stdio: 'inherit' });
    const xmlPath = path.join(tempDir, 'word', 'document.xml');
    if (!fs.existsSync(xmlPath)) {
      console.error('word/document.xml does not exist inside extracted docx!');
      return '';
    }
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
    console.error('Error extracting docx:', err);
    return '';
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

const docxPath = path.join(__dirname, '..', '..', 'sheets', 'mcq dsa.docx');
console.log('Docx Path exists:', fs.existsSync(docxPath));
const text = extractDocx(docxPath);
console.log('Total characters extracted:', text.length);
if (text) {
  console.log('--- PREVIEW (FIRST 2000 CHARACTERS) ---');
  console.log(text.slice(0, 2000));
  
  console.log('\n--- PREVIEW (LAST 2000 CHARACTERS) ---');
  console.log(text.slice(-2000));
}
