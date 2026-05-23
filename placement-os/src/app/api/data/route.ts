import { NextResponse } from "next/server";
import { getPlatformData } from "@/lib/sheets/loader";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPlatformData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    console.error("[api/data]", e);
    return NextResponse.json({ error: "Failed to load sheets" }, { status: 500 });
  }
}
