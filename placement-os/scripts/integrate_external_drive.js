const fs = require("fs");
const path = require("path");

const SOURCE_DIR = "C:\\Users\\AASHISH\\OneDrive\\Desktop\\placement-os\\drive-download-20260723T075906Z-1-001";
const PROJECT_ROOT = path.join(__dirname, "..");
const PUBLIC_RESOURCES = path.join(PROJECT_ROOT, "public", "resources");
const PROFILES_CSV = path.join(PROJECT_ROOT, "sheets", "companies", "profiles.csv");
const RESOURCES_CSV = path.join(PROJECT_ROOT, "sheets", "companies", "resources.csv");

const FOLDER_MAPPING = {
  "ACCENTURE": { slug: "accenture", name: "Accenture", type: "consulting" },
  "AMCAT": { slug: "amcat", name: "AMCAT", type: "service" },
  "Audi Time": { slug: "aptitude", name: "Aptitude & Math", type: "service" },
  "C & DSA Note": { slug: "dsa", name: "DSA & Core Notes", type: "product" },
  "CAPGEMINI": { slug: "capgemini", name: "Capgemini", type: "service" },
  "COCUBES": { slug: "cocubes", name: "CoCubes", type: "service" },
  "COGNIZANT": { slug: "cognizant", name: "Cognizant", type: "service" },
  "Dell": { slug: "dell", name: "Dell Technologies", type: "product" },
  "Delloite": { slug: "deloitte", name: "Deloitte", type: "consulting" },
  "ELITMUS": { slug: "elitmus", name: "eLitmus", type: "service" },
  "EPAM": { slug: "epam", name: "EPAM Systems", type: "service" },
  "HCL": { slug: "hcl", name: "HCL Technologies", type: "service" },
  "HUAWEI TECH": { slug: "huawei-tech", name: "Huawei Technologies", type: "product" },
  "Hexaware": { slug: "hexaware", name: "Hexaware Technologies", type: "service" },
  "IBM": { slug: "ibm", name: "IBM", type: "product" },
  "INFOSYS": { slug: "infosys", name: "Infosys", type: "service" },
  "Ion Idea": { slug: "ion-idea", name: "IonIdea", type: "service" },
  "LG soft": { slug: "lg-soft", name: "LG Soft", type: "product" },
  "L_T": { slug: "l-and-t", name: "L&T Technology Services", type: "service" },
  "Lumen Data": { slug: "lumen-data", name: "Lumen Technologies", type: "product" },
  "MINDTREE": { slug: "mindtree", name: "Mindtree", type: "service" },
  "MPHASIS": { slug: "mphasis", name: "Mphasis", type: "service" },
  "PSEUDOCODE PAPERS": { slug: "pseudocode", name: "Pseudocode Papers", type: "service" },
  "Robert Bosch": { slug: "robert-bosch", name: "Robert Bosch", type: "product" },
  "SOPRA STERIA": { slug: "sopra-steria", name: "Sopra Steria", type: "service" },
  "SecureEyes": { slug: "secure-eyes", name: "SecureEyes", type: "service" },
  "TCS": { slug: "tcs", name: "TCS", type: "service" },
  "TECH MAHINDRA": { slug: "tech-mahindra", name: "Tech Mahindra", type: "service" },
  "TEK system": { slug: "tek-system", name: "TEKsystems", type: "service" },
  "UNISYS": { slug: "unisys", name: "Unisys", type: "product" },
  "WIPRO": { slug: "wipro", name: "Wipro", type: "service" },
  "ZENPACT": { slug: "zenpact", name: "Genpact", type: "service" },
  "ZOHO": { slug: "zoho", name: "Zoho Corporation", type: "product" },
  "ZenQ": { slug: "zenq", name: "ZenQ", type: "service" }
};

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9\.\_\-]/g, "_").replace(/_+/g, "_").toLowerCase();
}

function cleanTitle(fileName) {
  const base = path.parse(fileName).name;
  return base
    .replace(/^5_\d+/, "")
    .replace(/[_\-\(\)]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || base;
}

function determineCategory(fileName, slug) {
  const lower = fileName.toLowerCase();
  if (lower.includes("dsa") || lower.includes("coding") || lower.includes("program") || lower.includes("c++") || lower.includes("python") || lower.includes("algorithm")) return "DSA";
  if (lower.includes("apti") || lower.includes("quant") || lower.includes("math") || lower.includes("reasoning") || lower.includes("series")) return "Aptitude";
  if (lower.includes("verbal") || lower.includes("english") || lower.includes("grammar") || lower.includes("word")) return "Verbal Ability";
  if (lower.includes("hr") || lower.includes("interview") || lower.includes("note")) return "Interview Prep";
  if (lower.includes("dbms") || lower.includes("pseudo") || lower.includes("core") || lower.includes("technical")) return "Core Subjects";
  return "Previous Year Questions";
}

function run() {
  console.log("🚀 Running Drive Download Integration Script...");

  if (!fs.existsSync(PUBLIC_RESOURCES)) {
    fs.mkdirSync(PUBLIC_RESOURCES, { recursive: true });
  }

  // 1. Read existing resources.csv
  const existingResourceLines = fs.existsSync(RESOURCES_CSV) 
    ? fs.readFileSync(RESOURCES_CSV, "utf-8").split("\n").filter(Boolean)
    : [];

  const existingIds = new Set();
  const resourceEntries = [];

  if (existingResourceLines.length > 0) {
    resourceEntries.push(existingResourceLines[0]);
    for (let i = 1; i < existingResourceLines.length; i++) {
      const line = existingResourceLines[i];
      resourceEntries.push(line);
      const firstCol = line.split(",")[0].replace(/"/g, "");
      existingIds.add(firstCol);
    }
  } else {
    resourceEntries.push("resource_id,title,file_path,size_bytes,company,category,subtopic,estimated_minutes,xp_reward,revision_priority");
  }

  // 2. Scan source directory
  const rootItems = fs.readdirSync(SOURCE_DIR);
  let copyCount = 0;

  const rootFilesTargetDir = path.join(PUBLIC_RESOURCES, "general");
  if (!fs.existsSync(rootFilesTargetDir)) fs.mkdirSync(rootFilesTargetDir, { recursive: true });

  for (const item of rootItems) {
    const itemPath = path.join(SOURCE_DIR, item);
    const stat = fs.statSync(itemPath);

    if (!stat.isDirectory()) {
      const ext = path.extname(item).toLowerCase();
      if (![".pdf", ".docx", ".doc", ".txt", ".xlsx"].includes(ext)) continue;

      const sanitizedName = sanitizeFileName(item);
      const destPath = path.join(rootFilesTargetDir, sanitizedName);
      
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(itemPath, destPath);
        copyCount++;
      }

      const resId = `general-res-${path.parse(sanitizedName).name.slice(0, 40)}`;
      if (!existingIds.has(resId)) {
        existingIds.add(resId);
        const title = cleanTitle(item);
        const relativePath = `/resources/general/${sanitizedName}`;
        const sizeBytes = stat.size;
        const category = determineCategory(item, "general");
        const estMins = sizeBytes > 5000000 ? 120 : sizeBytes > 1000000 ? 60 : 30;
        const xp = estMins >= 60 ? 100 : 50;

        resourceEntries.push(
          `"${resId}","${title.replace(/"/g, '""')}","${relativePath}",${sizeBytes},"general","${category}","",${estMins},${xp},"medium"`
        );
      }
    } else if (FOLDER_MAPPING[item]) {
      const config = FOLDER_MAPPING[item];
      const targetSubDir = path.join(PUBLIC_RESOURCES, config.slug);
      if (!fs.existsSync(targetSubDir)) fs.mkdirSync(targetSubDir, { recursive: true });

      function processSubDir(dirPath) {
        const subItems = fs.readdirSync(dirPath);
        for (const subItem of subItems) {
          const subPath = path.join(dirPath, subItem);
          const subStat = fs.statSync(subPath);

          if (subStat.isDirectory()) {
            if (subItem.endsWith("_files")) continue;
            processSubDir(subPath);
          } else {
            const ext = path.extname(subItem).toLowerCase();
            if (![".pdf", ".docx", ".doc", ".txt", ".xlsx", ".htm", ".html"].includes(ext)) continue;

            const sanitizedName = sanitizeFileName(subItem);
            const destPath = path.join(targetSubDir, sanitizedName);

            if (!fs.existsSync(destPath)) {
              fs.copyFileSync(subPath, destPath);
              copyCount++;
            }

            const cleanBase = path.parse(sanitizedName).name.slice(0, 40);
            const resId = `${config.slug}-res-${cleanBase}`;
            if (!existingIds.has(resId)) {
              existingIds.add(resId);
              const title = cleanTitle(subItem);
              const relativePath = `/resources/${config.slug}/${sanitizedName}`;
              const sizeBytes = subStat.size;
              const category = determineCategory(subItem, config.slug);
              const estMins = sizeBytes > 5000000 ? 120 : sizeBytes > 1000000 ? 60 : 30;
              const xp = estMins >= 60 ? 100 : 50;

              resourceEntries.push(
                `"${resId}","${title.replace(/"/g, '""')}","${relativePath}",${sizeBytes},"${config.slug}","${category}","",${estMins},${xp},"medium"`
              );
            }
          }
        }
      }

      processSubDir(itemPath);
    }
  }

  // 3. Write updated resources.csv
  fs.writeFileSync(RESOURCES_CSV, resourceEntries.join("\n"), "utf-8");
  console.log(`✅ Copy completed! New files copied: ${copyCount}. Total indexed resources in resources.csv: ${resourceEntries.length - 1}`);

  // 4. Update profiles.csv with new company profiles
  const profilesLines = fs.readFileSync(PROFILES_CSV, "utf-8").split("\n").filter(Boolean);
  const existingSlugs = new Set();
  for (let i = 1; i < profilesLines.length; i++) {
    const slug = profilesLines[i].split(",")[0];
    existingSlugs.add(slug);
  }

  let newProfilesCount = 0;
  for (const folderName of Object.keys(FOLDER_MAPPING)) {
    const info = FOLDER_MAPPING[folderName];
    if (!existingSlugs.has(info.slug)) {
      existingSlugs.add(info.slug);
      newProfilesCount++;
      const line = `${info.slug},${info.name},${info.type},Comprehensive OA Pattern & Practice Papers,Easy–Medium,High,OA|Technical Interview|HR,"Clear, professional, structured STAR framework",Clean 1-page ATS friendly resume,Include key full-stack or technical projects,Why ${info.name}?|Strengths & Weaknesses|Career Goals,Company PYQs + Aptitude practice,Clear OA rounds using provided study materials and PYQs.`;
      profilesLines.push(line);
    }
  }

  fs.writeFileSync(PROFILES_CSV, profilesLines.join("\n"), "utf-8");
  console.log(`✅ Profiles updated! Added ${newProfilesCount} new company profiles to profiles.csv (Total: ${profilesLines.length - 1})`);
}

run();
