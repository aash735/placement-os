import { NextResponse } from "next/server";
import { aiProviderRegistry } from "@/lib/ai-interview/providers";
import { supabase } from "@/lib/supabase";

// In-memory log for rate limiting
const requestLog = new Map<string, number[]>();

function checkRateLimit(userId: string, limit = 15, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(userId) || [];
  
  // Filter out timestamps older than the window
  const activeTimestamps = timestamps.filter((t) => now - t < windowMs);
  
  if (activeTimestamps.length >= limit) {
    return false;
  }
  
  activeTimestamps.push(now);
  requestLog.set(userId, activeTimestamps);
  return true;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, provider = "gemini", apiKey, settings, messages, currentStage, userId } = body;

    if (!action || !settings || !messages) {
      return NextResponse.json(
        { error: "Missing required parameters (action, settings, or messages)." },
        { status: 400 }
      );
    }

    // Validate authentication
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing user identifier." },
        { status: 401 }
      );
    }

    if (userId !== "guest-user-id") {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid user session format." },
          { status: 401 }
        );
      }

      const { data: userExists, error: dbError } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (dbError || !userExists) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid user session." },
          { status: 401 }
        );
      }
    }

    // Rate Limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before sending more messages." },
        { status: 429 }
      );
    }

    // Resolve API Key
    let resolvedApiKey = (apiKey || "").trim();
    if (!resolvedApiKey) {
      if (provider === "gemini") {
        resolvedApiKey = (process.env.GEMINI_API_KEY || "").trim();
      } else if (provider === "openai") {
        resolvedApiKey = (process.env.OPENAI_API_KEY || "").trim();
      }
    }

    // Development mode request logging to check for duplicate calls
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[AI Interview API] Action: ${action}, Provider: ${provider}, Stage: ${currentStage || "N/A"}, ` +
        `Messages Count: ${messages.length}, Timestamp: ${new Date().toISOString()}`
      );
    }

    // Ollama does not require an API key as it runs locally
    if (!resolvedApiKey && provider !== "ollama") {
      return NextResponse.json(
        {
          error: `No API key found. Please enter a temporary API key or configure it in the Settings page for the ${
            provider === "gemini" ? "Gemini" : "OpenAI"
          } provider.`,
          noKey: true,
        },
        { status: 400 }
      );
    }

    const aiProvider = aiProviderRegistry[provider];
    if (!aiProvider) {
      return NextResponse.json(
        { error: `Provider "${provider}" is not supported by the system.` },
        { status: 400 }
      );
    }

    if (action === "chat") {
      if (!currentStage) {
        return NextResponse.json(
          { error: "Missing currentStage parameter for chat action." },
          { status: 400 }
        );
      }
      
      const response = await aiProvider.generateResponse({
        apiKey: resolvedApiKey,
        settings,
        messages,
        currentStage,
      });

      return NextResponse.json({ response });
    } else if (action === "evaluate") {
      const report = await aiProvider.generateReport({
        apiKey: resolvedApiKey,
        settings,
        messages,
      });

      return NextResponse.json({ report });
    } else {
      return NextResponse.json(
        { error: `Invalid action: "${action}"` },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("AI Interview Route Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred in the AI Mock Interview system." },
      { status: 500 }
    );
  }
}
