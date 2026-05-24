const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("\x1b[36m====================================================\x1b[0m");
console.log("\x1b[36m          PLACEMENT OS AUTOMATED SETUP SYSTEM       \x1b[0m");
console.log("\x1b[36m====================================================\x1b[0m");

// 1. Node & npm validation
try {
  const nodeVersion = process.version;
  console.log(`\x1b[32m✔ Node.js version validated:\x1b[0m ${nodeVersion}`);
  const major = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
  if (major < 18) {
    console.warn(`\x1b[33m⚠ Warning: Node.js version is ${nodeVersion}. Recommended version is >= 18.\x1b[0m`);
  }
} catch (err) {
  console.error("\x1b[31m✖ Failed to validate Node.js version.\x1b[0m", err);
}

// 2. .env.local generation
const envPath = path.join(__dirname, '..', '.env.local');
let envCreated = false;
if (!fs.existsSync(envPath)) {
  const defaultEnv = `NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
`;
  fs.writeFileSync(envPath, defaultEnv, 'utf8');
  console.log("\x1b[32m✔ Created missing .env.local with Supabase placeholders.\x1b[0m");
  envCreated = true;
} else {
  console.log("\x1b[32m✔ .env.local exists.\x1b[0m");
}

// 3. Supabase validation
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
  const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/);
  
  const urlVal = urlMatch ? urlMatch[1].trim() : '';
  const keyVal = keyMatch ? keyMatch[1].trim() : '';
  
  if (!urlVal || !keyVal) {
    console.log("\x1b[33m⚠ Supabase keys are empty in .env.local. App will fallback to GUEST/Local storage mode.\x1b[0m");
  } else {
    console.log("\x1b[32m✔ Supabase credentials detected in .env.local.\x1b[0m");
  }
} catch (err) {
  console.error("\x1b[31m✖ Failed to parse .env.local.\x1b[0m", err);
}

// 4. Dependency validation
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
  console.log("\x1b[33m⚠ node_modules not found. Please run 'npm install' to resolve dependencies.\x1b[0m");
} else {
  console.log("\x1b[32m✔ node_modules folder is present.\x1b[0m");
}

// 5. Deployment / Build check
console.log("\x1b[36mChecking project readiness...\x1b[0m");
let isReady = true;

// Verify sheets exist or scripts are valid
const csvPath = path.join(__dirname, '..', 'sheets');
if (!fs.existsSync(csvPath)) {
  console.error("\x1b[31m✖ Error: 'sheets' folder is missing! DSA tracker won't function.\x1b[0m");
  isReady = false;
} else {
  console.log("\x1b[32m✔ sheets directory is present.\x1b[0m");
}

if (isReady) {
  console.log("\x1b[32;1m✔ Setup system check complete. Ready for local execution (npm run dev) or build (npm run build).\x1b[0m");
} else {
  console.log("\x1b[31;1m✖ Setup checks failed. Please resolve the errors highlighted above.\x1b[0m");
  process.exit(1);
}
console.log("\x1b[36m====================================================\x1b[0m\n");
