import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import type { SheetRow } from "./schemas";

const SHEETS_ROOT = path.join(process.cwd(), "sheets");

/** Get all sheets roots: local to placement-os and parent directory */
export function getSheetsRoots(): string[] {
  const cwd = process.cwd();
  const paths = [
    path.join(cwd, "sheets"),
    path.join(cwd, "..", "sheets"),
  ];
  return paths.filter((p) => fs.existsSync(p));
}

export function getSheetsRoot(): string {
  const roots = getSheetsRoots();
  return roots[0] || SHEETS_ROOT;
}

/** Find a relative sheet file in any active roots */
export function findSheetFile(relPath: string): string | null {
  const roots = getSheetsRoots();
  for (const root of roots) {
    const fullPath = path.join(root, relPath);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/** Extract hyperlink target from cell (standard link or formula) */
function getCellHyperlink(
  sheet: XLSX.WorkSheet,
  rowIndex: number,
  colIndex: number
): string | undefined {
  const colLetter = XLSX.utils.encode_col(colIndex);
  const cellRef = `${colLetter}${rowIndex + 1}`;
  const cell = sheet[cellRef];
  if (cell && cell.l && cell.l.Target) {
    return cell.l.Target;
  }
  if (cell && cell.f) {
    const match = cell.f.match(/HYPERLINK\(\s*["']([^"']+)["']/i);
    if (match) return match[1];
  }
  return undefined;
}

// ─── Shradha-format detection ────────────────────────────────────────────────
/**
 * Known topic names in the "DSA by Shradha Ma'am" spreadsheet.
 * These appear in column A (index 0) to indicate topic rows.
 */
const SHRADHA_TOPICS = new Set([
  "arrays",
  "strings",
  "2d arrays",
  "searching & sorting",
  "searching and sorting",
  "linked list",
  "stacks & queues",
  "stacks and queues",
  "binary trees",
  "binary search trees",
  "heaps & hashing",
  "heaps and hashing",
  "graphs",
  "dp",
  "dynamic programming",
  "greedy",
  "backtracking",
  "tries",
  "segment trees",
  "bit manipulation",
  "recursion",
  "divide and conquer",
  "sliding window",
  "two pointers",
  "maths",
  "matrix",
]);

/** Meta rows to skip in Shradha format */
function isShradhaMetaRow(col0: string, col1: string): boolean {
  const c0 = col0.toLowerCase().trim();
  const c1 = col1.toLowerCase().trim();
  if (!col0 && !col1) return true;
  if (c0.includes("shradha") || c0.includes("apna college")) return true;
  if (c0.includes("meet us on") || c0.includes("youtube")) return true;
  if (c0.includes("ideal time")) return true;
  if (c0 === "easy" || c0 === "medium" || c0 === "hard") return true;
  if (c0 === "topics" || c0 === "topic") return true;
  if (c1.includes("question") && (c1.startsWith("question") || c1 === "question (375)")) return true;
  if (c0.includes("how to solve")) return true;
  if (c0.includes("phase")) return true;
  return false;
}

/**
 * Detect if a workbook is in Shradha positional format (no conventional header row).
 * Returns true if a significant fraction of data rows have a known topic in col0.
 */
function isShradhaFormat(workbook: XLSX.WorkBook): boolean {
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return false;
  const ws = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: "" });

  let topicMatches = 0;
  let totalChecked = 0;

  for (let i = 0; i < Math.min(50, rows.length); i++) {
    const row = rows[i];
    if (!row || !Array.isArray(row)) continue;
    const col0 = String(row[0] || "").trim().toLowerCase();
    const col1 = String(row[1] || "").trim();
    if (!col0 || !col1) continue;
    totalChecked++;
    if (SHRADHA_TOPICS.has(col0)) topicMatches++;
  }

  return totalChecked > 0 && topicMatches / totalChecked > 0.3;
}

/**
 * Parse the Shradha positional format:
 *   Col 0: Topic name
 *   Col 1: Question title (may have hyperlink)
 *   Col 2: Companies (space / plus / comma separated)
 *   Col 3: Remarks / hints
 * No header row — every data row has a topic in col0 and a title in col1.
 */
function parseShradhaFormat(
  workbook: XLSX.WorkBook,
  filePath: string
): SheetRow[] {
  const allRows: SheetRow[] = [];
  const baseName = path.basename(filePath);

  for (const sheetName of workbook.SheetNames) {
    const ws = workbook.Sheets[sheetName];
    if (!ws) continue;

    const rawRows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: "" });

    for (let rowIdx = 0; rowIdx < rawRows.length; rowIdx++) {
      const row = rawRows[rowIdx];
      if (!row || !Array.isArray(row)) continue;

      const col0 = String(row[0] || "").trim();
      const col1 = String(row[1] || "").trim();
      const col2 = String(row[2] || "").trim();
      const col3 = String(row[3] || "").trim();

      // Skip meta / header / empty rows
      if (isShradhaMetaRow(col0, col1)) continue;
      if (!col0 || !col1) continue;

      // col0 must be a valid topic
      const col0Lower = col0.toLowerCase();
      if (!SHRADHA_TOPICS.has(col0Lower)) continue;

      // col1 must be a question (not just a difficulty label or meta)
      if (col1.toLowerCase().startsWith("ideal time")) continue;

      // Try to extract hyperlink from col1 (the question title cell)
      const titleLink = getCellHyperlink(ws, rowIdx, 1);

      // Parse companies: split by space, +, comma — filter out noise
      const companiesRaw = col2
        .split(/[\+,]|(?<=[a-z])(?=[A-Z])/)
        .map((c) => c.trim())
        .filter((c) => c.length > 1 && !c.match(/^\d+$/));

      // Build normalized row
      const normalized: SheetRow = {
        topic: col0,
        topics: col0,
        title: col1,
        companies: col2,
        remarks: col3,
        notes: col3,
        _sheet_name: sheetName,
        _file_name: baseName,
      };

      if (titleLink && titleLink.startsWith("http")) {
        normalized.url = titleLink;
        normalized.link = titleLink;
      }

      allRows.push(normalized);
    }
  }

  return allRows;
}

// ─── Arsh-format detection ───────────────────────────────────────────────────

function isArshFormat(workbook: XLSX.WorkBook): boolean {
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return false;
  const sheet = workbook.Sheets[firstSheetName];
  const cellA1 = sheet["A1"]?.v || "";
  const cellB1 = sheet["B1"]?.v || "";
  const strA1 = String(cellA1).toLowerCase();
  const strB1 = String(cellB1).toLowerCase();
  return strA1.includes("crackyourinternship") || strB1.includes("arsh") || strB1.includes("arshgoyal");
}

function parseArshFormat(workbook: XLSX.WorkBook, filePath: string): SheetRow[] {
  const allRows: SheetRow[] = [];
  const baseName = path.basename(filePath);

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rawRows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: "" });
    if (rawRows.length === 0) continue;

    const companiesMap: Record<number, string> = {};
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(20, rawRows.length); i++) {
      const row = rawRows[i];
      if (row && row.includes("Status")) {
        headerRowIdx = i;
        row.forEach((cell, cIdx) => {
          const sCell = String(cell || "").trim();
          if (sCell && sCell !== "Status" && sCell !== "Problem Link" && sCell !== "Difficulty") {
            companiesMap[cIdx] = sCell;
          }
        });
        break;
      }
    }

    if (headerRowIdx === -1) {
      continue;
    }

    let currentTopic = "General";

    for (let rowIdx = headerRowIdx + 1; rowIdx < rawRows.length; rowIdx++) {
      const row = rawRows[rowIdx];
      if (!row || !Array.isArray(row)) continue;

      const colA = String(row[0] || "").trim();
      const colB = String(row[1] || "").trim();

      if (!colA && colB) {
        if (!colB.startsWith("http") && !colB.includes("Follow on") && !colB.includes("Challenge")) {
          currentTopic = colB;
        }
        continue;
      }

      if (colA && colB.startsWith("http")) {
        const companies: string[] = [];
        Object.keys(companiesMap).forEach((cIdxStr) => {
          const cIdx = parseInt(cIdxStr, 10);
          const cellVal = String(row[cIdx] || "").trim();
          if (cellVal) {
            companies.push(companiesMap[cIdx]);
          }
        });

        let title = "";
        const segments = colB.split("/").filter(Boolean);
        const slug = segments[segments.length - 1] || "";
        title = slug
          .replace(/-/g, " ")
          .split(" ")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        const normalized: SheetRow = {
          topic: currentTopic,
          difficulty: colA,
          url: colB,
          title: title,
          companies: companies.join("|"),
          _sheet_name: sheetName,
          _file_name: baseName,
        };

        allRows.push(normalized);
      }
    }
  }

  return allRows;
}


// ─── Header-based parser (for structured CSV/XLSX with column headers) ────────

function cleanGoogleRedirectUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.includes("google.com/url?q=")) {
    try {
      const urlObj = new URL(url);
      const q = urlObj.searchParams.get("q");
      if (q) {
        return q.split("&")[0];
      }
    } catch (e) {
      // ignore
    }
  }
  return url;
}

/** Find the row index where the table headers reside */
function findHeaderRowIndex(sheet: XLSX.WorkSheet): number {
  const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
  for (let i = 0; i < Math.min(50, rows.length); i++) {
    const row = rows[i];
    if (!row || !Array.isArray(row)) continue;
    let matchCount = 0;
    row.forEach((cell) => {
      if (cell === null || cell === undefined) return;
      const s = String(cell).toLowerCase().trim();
      const isHeader = (
        s === "topic" ||
        s === "topics" ||
        s === "question" ||
        s === "questions" ||
        s.startsWith("question (") ||
        s === "question link" ||
        s === "problem link" ||
        s === "problem" ||
        s === "problems" ||
        s === "title" ||
        s === "difficulty" ||
        s === "link" ||
        s === "url" ||
        s === "companies" ||
        s === "company" ||
        s === "remarks" ||
        s === "notes" ||
        s === "id" ||
        s === "slug" ||
        s === "key" ||
        s === "value" ||
        s === "cycle" ||
        s === "week" ||
        s === "focus" ||
        s === "solution" ||
        s.startsWith("solution ") ||
        s === "takeaways" ||
        s === "approach" ||
        s === "tc" ||
        s === "sc" ||
        s === "revision"
      );
      if (isHeader) matchCount++;
    });
    if (matchCount >= 2) {
      return i;
    }
  }
  return 0;
}

/**
 * Parse CSV or XLSX into row objects using conventional header-row format.
 * Handles all sheets in the workbook.
 */
function parseHeaderFormat(
  workbook: XLSX.WorkBook,
  filePath: string
): SheetRow[] {
  const allRows: SheetRow[] = [];
  const baseName = path.basename(filePath);

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const headerRowIndex = findHeaderRowIndex(sheet);
    const rows = XLSX.utils.sheet_to_json<any>(sheet, {
      range: headerRowIndex,
      defval: "",
    });
    const headerRow =
      XLSX.utils.sheet_to_json<string[]>(sheet, {
        header: 1,
        range: headerRowIndex,
      })[0] || [];

    const sheetRows = rows.map((row, rIdx) => {
      const absoluteRowIndex = headerRowIndex + 1 + rIdx;
      const normalized: SheetRow = {};

      headerRow.forEach((header, cIdx) => {
        if (!header) return;
        const key = String(header).trim().toLowerCase().replace(/\s+/g, "_");
        const val = String(row[header] ?? "").trim();
        normalized[key] = val;

        let link = getCellHyperlink(sheet, absoluteRowIndex, cIdx);
        if (link) {
          link = cleanGoogleRedirectUrl(link);
          normalized[`${key}_url`] = link || "";
          if (
            key.includes("question") ||
            key.includes("problem") ||
            key.includes("title") ||
            key === "link" ||
            key === "url"
          ) {
            normalized["url"] = link || "";
          }
        }
      });

      // Fallback: scan entire row for any hyperlink
      if (!normalized["url"]) {
        for (let cIdx = 0; cIdx < headerRow.length; cIdx++) {
          let link = getCellHyperlink(sheet, absoluteRowIndex, cIdx);
          if (link) {
            link = cleanGoogleRedirectUrl(link);
            normalized["url"] = link || "";
            break;
          }
        }
      }

      normalized["_sheet_name"] = sheetName;
      normalized["_file_name"] = baseName;

      return normalized;
    });

    allRows.push(...sheetRows);
  }

  return allRows;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Parse CSV or XLSX — auto-detects Shradha positional format vs standard header format */
export function parseSheetFile(filePath: string | null): SheetRow[] {
  if (!filePath || !fs.existsSync(filePath)) return [];

  const ext = path.extname(filePath).toLowerCase();
  const fileBuffer = fs.readFileSync(filePath);
  const workbook =
    ext === ".csv"
      ? XLSX.read(fileBuffer.toString("utf-8"), { type: "string" })
      : XLSX.read(fileBuffer, {
          type: "buffer",
          cellFormula: true,
          cellHTML: false,
        });

  // Auto-detect format
  if (ext !== ".csv") {
    if (isArshFormat(workbook)) {
      return parseArshFormat(workbook, filePath);
    }
    if (isShradhaFormat(workbook)) {
      return parseShradhaFormat(workbook, filePath);
    }
  }

  return parseHeaderFormat(workbook, filePath);
}

/** Load all files in a directory, de-duplicating by question_id */
export function loadAllFilesInDir(
  dir: string,
  skipNames: string[] = []
): SheetRow[] {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir);
  const all: SheetRow[] = [];
  const seenIds = new Set<string>();

  for (const file of files.sort()) {
    if (skipNames.includes(file)) continue;
    const ext = path.extname(file).toLowerCase();
    if (![".csv", ".xlsx", ".xls"].includes(ext)) continue;

    const rows = parseSheetFile(path.join(dir, file));
    for (const row of rows) {
      const id =
        row.question_id ||
        row.id ||
        (row.title ? slugify(row.title) : "");
      if (!id) continue;
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      row.question_id = id;
      all.push(row);
    }
  }
  return all;
}

/** Scan and load ALL questions from all excel/csv files in dsa/ folders and sheet roots */
export function loadAllQuestions(): SheetRow[] {
  const roots = getSheetsRoots();
  const allRows: SheetRow[] = [];
  const seenIds = new Set<string>();

  const processFile = (filePath: string) => {
    const rows = parseSheetFile(filePath);
    for (const row of rows) {
      const id =
        row.question_id ||
        row.id ||
        (row.title ? slugify(row.title) : "");
      if (!id) continue;
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      row.question_id = id;
      allRows.push(row);
    }
  };

  // 1. Scan the "dsa" sub-directory in all roots
  for (const root of roots) {
    const dsaDir = path.join(root, "dsa");
    if (fs.existsSync(dsaDir)) {
      const files = fs.readdirSync(dsaDir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (![".csv", ".xlsx", ".xls"].includes(ext)) continue;
        if (["topics.csv", "mock-tests.csv"].includes(file.toLowerCase()))
          continue;
        processFile(path.join(dsaDir, file));
      }
    }
  }

  // 2. Scan root-level Excel/CSV files (e.g. "DSA by Shradha Ma'am.xlsx", "Book1.xlsx")
  const SKIP_ROOT_FILES = new Set([
    "topics.csv",
    "mock-tests.csv",
    "profiles.csv",
    "config.csv",
    "cycles.csv",
    "weekly-plan.csv",
    "dsa sheet.xlsx",
    "dsa-sheet.xlsx",
    "striver sheet.xlsx",
    "striver-sheet.xlsx",
    "dsa sheet by arsh (45-60 days plan).xlsx",
    "dsa-sheet-by-arsh.xlsx",
  ]);

  for (const root of roots) {
    const files = fs.readdirSync(root);
    for (const file of files) {
      const fullPath = path.join(root, file);
      if (fs.statSync(fullPath).isDirectory()) continue;
      const ext = path.extname(file).toLowerCase();
      if (![".csv", ".xlsx", ".xls"].includes(ext)) continue;
      if (SKIP_ROOT_FILES.has(file.toLowerCase())) continue;
      processFile(fullPath);
    }
  }

  return allRows;
}

export function listSheetManifest(): {
  path: string;
  rows: number;
  updated: string;
}[] {
  const manifest: { path: string; rows: number; updated: string }[] = [];
  const roots = getSheetsRoots();

  for (const root of roots) {
    function walk(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(csv|xlsx|xls)$/i.test(entry.name)) {
          const stat = fs.statSync(full);
          const rel = path.relative(root, full).replace(/\\/g, "/");
          if (manifest.some((m) => m.path === rel)) continue;
          manifest.push({
            path: rel,
            rows: parseSheetFile(full).length,
            updated: stat.mtime.toISOString(),
          });
        }
      }
    }
    walk(root);
  }

  return manifest;
}
