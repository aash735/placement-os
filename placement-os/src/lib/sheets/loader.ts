import type { DSAQuestion, DSATopicMeta } from "@/types";
import type { CompanyProfile, AptitudeTopic, MockTestSet, StudyResource } from "./transformers";
import type { SheetRow } from "./schemas";
import fs from "fs";
import path from "path";

export type PlatformData = {
  questions: DSAQuestion[];
  topics: DSATopicMeta[];
  mockTests: MockTestSet[];
  companies: CompanyProfile[];
  aptitudeTopics: AptitudeTopic[];
  aptitudeConfig: Record<string, string>;
  revisionCycles: { cycle: string; action: string }[];
  weeklyPlan: { week: number; focus: string; hours: string; days: string[] }[];
  manifest: { path: string; rows: number; updated: string }[];
  loadedAt: string;
  validationIssues: { row: number; field: string; message: string }[];
  resources: StudyResource[];
};

/** Returns the pre-generated platform data */
export const getPlatformData = async (): Promise<PlatformData> => {
  const filePath = path.join(process.cwd(), "generated", "platform-data.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as PlatformData;
};

export function getQuestionsByTopic(questions: DSAQuestion[], topicId: string) {
  return questions.filter((q) => q.topicId === topicId);
}

export function getQuestionById(questions: DSAQuestion[], id: string) {
  return questions.find((q) => q.id === id);
}

export type { SheetRow };
