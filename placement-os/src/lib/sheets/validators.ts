import type { SheetRow } from "./schemas";

export type ValidationIssue = { row: number; field: string; message: string };

export function validateDSAQuestionRows(rows: SheetRow[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  rows.forEach((row, i) => {
    const rowNum = i + 2;

    const title =
      row.title ||
      row.question ||
      row.problem ||
      row.question_title ||
      row.problem_title ||
      row.question_375 ||
      Object.entries(row).find(([k]) => k.startsWith("question") || k.startsWith("problem"))?.[1];

    const url =
      row.url ||
      row.link ||
      row.problem_link ||
      row.question_link ||
      Object.entries(row).find(([k]) => k.endsWith("_url"))?.[1];

    const topic = row.topic || row.topics || row.category || row._sheet_name || "";

    const id = row.question_id || row.id || (title ? String(title).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "") : "");

    const difficulty = row.difficulty || row.level_name || row.level || "";

    if (!id) {
      issues.push({ row: rowNum, field: "question_id", message: "Required" });
    } else if (ids.has(id)) {
      issues.push({ row: rowNum, field: "question_id", message: `Duplicate ID: ${id}` });
    } else {
      ids.add(id);
    }

    if (!title) issues.push({ row: rowNum, field: "title", message: "Required" });
    if (!topic) issues.push({ row: rowNum, field: "topic", message: "Required topic" });
    if (!difficulty) issues.push({ row: rowNum, field: "difficulty", message: "Required difficulty" });

    if (row.level && !["1", "2", "3", "4"].includes(String(row.level).trim())) {
      issues.push({ row: rowNum, field: "level", message: "Level must be 1-4" });
    }
  });

  return issues;
}

export function validateHeaders(row: SheetRow, required: readonly string[]): string[] {
  const keys = Object.keys(row);
  return required.filter((col) => !keys.includes(col) && col !== required[0]);
}
