const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.resolve(__dirname, '..');
const SHEETS_DIR = path.join(PROJECT_DIR, 'sheets');
const SRC_DIR = path.join(PROJECT_DIR, 'src');

console.log(`🔍 Starting Placement OS Codebase Audit...`);
console.log(`Project Directory: ${PROJECT_DIR}`);

// ----------------------------------------------------
// 1. Data Integrity Audit (Sheets & CSVs)
// ----------------------------------------------------
function parseCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parser that handles quotes
    const cells = [];
    let inQuotes = false;
    let currentCell = '';
    
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(currentCell.trim().replace(/^["']|["']$/g, ''));
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim().replace(/^["']|["']$/g, ''));
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] || '';
    });
    row._line = i + 1;
    rows.push(row);
  }
  
  return rows;
}

function runDataAudit() {
  console.log('\n📊 --- [Phase 1: Data Integrity Audit] ---');
  const csvFiles = [];
  
  function walkSheets(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkSheets(fullPath);
      } else if (entry.name.endsWith('.csv')) {
        csvFiles.push(fullPath);
      }
    }
  }
  walkSheets(SHEETS_DIR);
  
  let totalIssues = 0;
  
  for (const csvPath of csvFiles) {
    const relativePath = path.relative(PROJECT_DIR, csvPath).replace(/\\/g, '/');
    const rows = parseCsv(csvPath);
    if (rows.length === 0) continue;
    
    // Determine the primary key column
    const keys = Object.keys(rows[0]);
    const pkCol = keys.find(k => 
      k.toLowerCase() === 'id' || 
      k.toLowerCase() === 'resource_id' || 
      k.toLowerCase() === 'question_id' || 
      k.toLowerCase() === 'slug' || 
      k.toLowerCase() === 'key' || 
      k.toLowerCase() === 'week' || 
      k.toLowerCase() === 'cycle'
    );
    
    if (!pkCol) {
      console.log(`ℹ️ [Info] No obvious Primary Key column found for ${relativePath}`);
      continue;
    }
    
    const seenPks = new Map();
    const seenSlugs = new Map();
    
    rows.forEach(row => {
      const pkValue = row[pkCol];
      if (pkValue) {
        if (seenPks.has(pkValue)) {
          seenPks.get(pkValue).push(row._line);
        } else {
          seenPks.set(pkValue, [row._line]);
        }
      }
      
      const slugVal = row.slug || row.slug_id;
      if (slugVal) {
        if (seenSlugs.has(slugVal)) {
          seenSlugs.get(slugVal).push(row._line);
        } else {
          seenSlugs.set(slugVal, [row._line]);
        }
      }
    });
    
    // Report PK duplicates
    for (const [pk, lines] of seenPks.entries()) {
      if (lines.length > 1) {
        console.error(`❌ [Duplicate Key] File: ${relativePath} | Column: ${pkCol} | Key Value: "${pk}" found on lines: ${lines.join(', ')}`);
        totalIssues++;
      }
    }
    
    // Report Slug duplicates
    for (const [slug, lines] of seenSlugs.entries()) {
      if (lines.length > 1) {
        console.warn(`⚠️ [Duplicate Slug] File: ${relativePath} | Slug: "${slug}" found on lines: ${lines.join(', ')}`);
        // Duplicate slugs can cause route param collisions
      }
    }
  }
  
  console.log(`Data Audit complete. Found ${totalIssues} duplicate key issue(s).`);
  return totalIssues;
}

// ----------------------------------------------------
// 2. React List Render & Key Attribute Audit
// ----------------------------------------------------
function walkSrc(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSrc(fullPath, files);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function runReactKeyAudit() {
  console.log('\n⚛️ --- [Phase 2: React List Rendering & Key Attribute Audit] ---');
  const tsxFiles = walkSrc(SRC_DIR).filter(f => f.endsWith('.tsx'));
  let issuesCount = 0;
  
  tsxFiles.forEach(filePath => {
    const relPath = path.relative(PROJECT_DIR, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    
    lines.forEach((line, idx) => {
      // Check for .map usage
      if (line.includes('.map(')) {
        // Look ahead 5 lines to find key attribute
        let hasKey = false;
        let keyExpr = '';
        for (let offset = 0; offset < 8; offset++) {
          const checkIdx = idx + offset;
          if (checkIdx >= lines.length) break;
          const checkLine = lines[checkIdx];
          
          const keyMatch = checkLine.match(/key=\{([^}]+)\}/);
          if (keyMatch) {
            hasKey = true;
            keyExpr = keyMatch[1].trim();
            break;
          }
        }
        
        const lineNum = idx + 1;
        if (!hasKey) {
          // It might be using implicit React child key or mapping to a component that handles keys, or using index
          console.warn(`⚠️ [Potential Missing/Implicit Key] ${relPath}:${lineNum} | .map() usage found but no 'key={...}' inside the block.`);
        } else {
          // Check for index keys or random keys
          if (keyExpr === 'index' || keyExpr === 'i' || keyExpr === 'idx') {
            console.warn(`⚠️ [Unstable Key Pattern] ${relPath}:${lineNum} | Using list index '${keyExpr}' as React key.`);
          } else if (keyExpr.includes('Math.random') || keyExpr.includes('uuid')) {
            console.error(`❌ [Runtime Risk key] ${relPath}:${lineNum} | Using dynamic random value '${keyExpr}' as React key. This causes full DOM recreation on render!`);
            issuesCount++;
          }
        }
      }
    });
  });
  
  console.log(`React Key Audit complete. Scanned ${tsxFiles.length} TSX files.`);
  return issuesCount;
}

// ----------------------------------------------------
// 3. Routing & Slug Collision Audit
// ----------------------------------------------------
function runRoutingAudit() {
  console.log('\n🛣️ --- [Phase 3: Routing & Slug Collision Audit] ---');
  // Check for duplicate slugs in profiles.csv vs subdirectories in app
  const companies = parseCsv(path.join(SHEETS_DIR, 'companies/profiles.csv'));
  const dsaTopics = parseCsv(path.join(SHEETS_DIR, 'dsa/topics.csv'));
  
  let issuesCount = 0;
  
  // Verify company slugs do not collide with static routes
  const appRoutes = fs.readdirSync(path.join(SRC_DIR, 'app'));
  const staticRouteNames = appRoutes.filter(f => {
    const stat = fs.statSync(path.join(SRC_DIR, 'app', f));
    return stat.isDirectory() && !f.startsWith('[') && !f.startsWith('(');
  });
  
  console.log(`Static routes in app: ${staticRouteNames.join(', ')}`);
  
  companies.forEach(company => {
    if (staticRouteNames.includes(company.slug)) {
      console.error(`❌ [Route Collision] Company slug "${company.slug}" in profiles.csv collides with static app directory: src/app/${company.slug}`);
      issuesCount++;
    }
  });
  
  // Verify DSA topics and slugs
  const topicIds = dsaTopics.map(t => t.id).filter(Boolean);
  const seenTopics = new Set();
  topicIds.forEach(id => {
    if (seenTopics.has(id)) {
      console.error(`❌ [Topic ID Collision] DSA topic ID "${id}" is duplicated in topics.csv`);
      issuesCount++;
    }
    seenTopics.add(id);
  });
  
  console.log(`Routing Audit complete. Checked ${companies.length} companies and ${dsaTopics.length} DSA topics.`);
  return issuesCount;
}

// ----------------------------------------------------
// Main Execution
// ----------------------------------------------------
const dataIssues = runDataAudit();
const reactIssues = runReactKeyAudit();
const routeIssues = runRoutingAudit();

const total = dataIssues + reactIssues + routeIssues;
console.log(`\n📋 --- [Audit Summary] ---`);
console.log(`Data Key Issues: ${dataIssues}`);
console.log(`React Key Issues: ${reactIssues}`);
console.log(`Routing Collision Issues: ${routeIssues}`);
console.log(`Total Strict Errors: ${total}`);

if (total > 0) {
  console.error(`\n❌ Codebase has audit failures! Fix them before production sync.`);
  process.exit(1);
} else {
  console.log(`\n✅ Codebase passes strict key and route integrity checks!`);
  process.exit(0);
}
