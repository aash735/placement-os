import { NextResponse } from "next/server";
import { getPlatformData } from "@/lib/sheets/loader";

export async function GET() {
  const data = await getPlatformData();
  return NextResponse.json({
    ok: data.validationIssues.length === 0,
    questionCount: data.questions.length,
    topicCount: data.topics.length,
    issues: data.validationIssues,
    manifest: data.manifest,
    loadedAt: data.loadedAt,
  });
}
