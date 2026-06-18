import {
  InterviewMessage,
  InterviewSettings,
  InterviewStage,
  InterviewReport,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from "@/types/ai-interview";

export interface AIRequestOptions {
  apiKey: string;
  settings: InterviewSettings;
  messages: InterviewMessage[];
  currentStage: InterviewStage;
}

export interface AIReportRequestOptions {
  apiKey: string;
  settings: InterviewSettings;
  messages: InterviewMessage[];
}

export interface AIProvider {
  name: string;
  generateResponse(options: AIRequestOptions): Promise<string>;
  generateReport(options: AIReportRequestOptions): Promise<InterviewReport>;
}

// System prompts helper to maintain uniform interviewer behavior
function getSystemPrompt(settings: InterviewSettings, currentStage: InterviewStage): string {
  const categoryName = CATEGORY_LABELS[settings.category];
  const difficultyName = DIFFICULTY_LABELS[settings.difficulty];

  let stageFocus = "";
  switch (currentStage) {
    case "Introduction":
      stageFocus = "Welcome the candidate, explain the structure, and ask them to introduce themselves or answer a high-level warm-up question.";
      break;
    case "Fundamentals":
      stageFocus = "Ask foundational concepts and core definitions related to the topic. Keep questions standard but testing understanding.";
      break;
    case "Intermediate Assessment":
      stageFocus = "Probe deeper into application, implementation details, small scenarios, coding logic, or query/architecture trade-offs.";
      break;
    case "Advanced Assessment":
      stageFocus = "Introduce a complex scenario, optimization request, edge cases, system bottlenecks, or deep behavioral STAR situations.";
      break;
    case "Final Evaluation":
      stageFocus = "Conclude the interview professionally. Ask if they have any questions for you, thank them for their time, and tell them the session is wrapped.";
      break;
  }

  return `You are a Senior Technical Interviewer conducting a mock interview.
Category: ${categoryName}
Target Difficulty: ${difficultyName}
Current Stage of Interview: ${currentStage} (Focus: ${stageFocus})

CRITICAL GUIDELINES:
1. Simulating a Live Interview: Be brief, professional, and direct. Do NOT write long explanations, do NOT provide solutions or full code snippets, and do NOT give away the correct answers immediately.
2. Question Flow: Ask EXACTLY ONE question (or clear follow-up) at a time. Do not dump multiple questions in one message.
3. Dynamism: Read the candidate's previous response. If their answer is partially correct, guide them with a hint. If it is fully correct, move to the next logical concept. If it is incorrect, gently probe or adjust the difficulty slightly.
4. Stage Management: Keep track of the current stage (${currentStage}) to calibrate the depth of your questions.
5. Tone: Calm, encouraging, yet rigorous and realistic.
6. Formatting: Use clear Markdown. Keep responses to 1-3 paragraphs max.`;
}

// Gemini Provider implementation
export class GeminiProvider implements AIProvider {
  name = "gemini";

  async generateResponse(options: AIRequestOptions): Promise<string> {
    const { apiKey, settings, messages, currentStage } = options;
    const systemPrompt = getSystemPrompt(settings, currentStage);

    // Format message history for Gemini's structure
    const contents = messages.map((m) => ({
      role: m.role === "interviewer" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let lastError = null;

    for (const model of models) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents,
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              generationConfig: {
                temperature: 0.65,
                maxOutputTokens: 600,
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return text;
          }
        } else {
          let errorText = "";
          let errorJson: any = null;
          try {
            errorText = await response.text();
            errorJson = JSON.parse(errorText);
          } catch {}

          const status = response.status;
          
          // Detect quota exhaustion (429)
          if (status === 429) {
            let retryDelaySec = 60;
            const details = errorJson?.error?.details;
            if (Array.isArray(details)) {
              const retryInfo = details.find((d: any) => 
                d["@type"]?.includes("RetryInfo") || d.reason === "RATE_LIMIT_EXCEEDED"
              );
              if (retryInfo && retryInfo.retryDelay) {
                const parsed = parseFloat(retryInfo.retryDelay);
                if (!isNaN(parsed)) {
                  retryDelaySec = Math.ceil(parsed);
                }
              }
            }
            throw new Error(`QUOTA_EXCEEDED: Gemini API Quota Exceeded. Please try again in ${retryDelaySec} seconds.`);
          }

          // Detect invalid key (400/403)
          if (status === 400 || status === 403) {
            const isInvalidKey =
              errorJson?.error?.message?.toLowerCase().includes("key") ||
              errorJson?.error?.status === "INVALID_ARGUMENT" ||
              errorText.includes("API_KEY_INVALID");
            if (isInvalidKey) {
              throw new Error("INVALID_API_KEY: The provided Gemini API Key is invalid or expired. Check your settings.");
            }
          }

          lastError = new Error(`Gemini API error (Status ${status}) on ${model}: ${errorJson?.error?.message || errorText}`);
          console.warn(`Model ${model} failed:`, lastError);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          lastError = new Error("TIMEOUT: Request to Gemini API timed out after 15 seconds.");
        } else if (err.message?.includes("QUOTA_EXCEEDED") || err.message?.includes("INVALID_API_KEY")) {
          throw err; // bubble up structured errors directly
        } else {
          lastError = err;
        }
        console.warn(`Fetch for model ${model} failed:`, err);
      }
    }

    throw lastError || new Error("All Gemini models are currently experiencing high demand. Please try again later or switch your AI Engine to OpenAI.");
  }

  async generateReport(options: AIReportRequestOptions): Promise<InterviewReport> {
    const { apiKey, settings, messages } = options;
    const categoryName = CATEGORY_LABELS[settings.category];
    const difficultyName = DIFFICULTY_LABELS[settings.difficulty];

    const transcriptText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const reportPrompt = `You are an expert AI Technical Recruiter. Review the following transcript of a mock interview.
Category: ${categoryName}
Target Difficulty: ${difficultyName}

Interview Transcript:
${transcriptText}

Generate a comprehensive, production-grade performance evaluation report in JSON format.
Your output MUST be a valid JSON object matching this TypeScript interface exactly:
interface InterviewReport {
  overallScore: number;         // 0-100 score
  technicalScore: number;       // 0-100 score
  communicationScore: number;   // 0-100 score
  problemSolvingScore: number;  // 0-100 score
  confidenceScore: number;      // 0-100 score
  strengths: string[];          // list of 3-5 concrete strengths shown
  weaknesses: string[];         // list of 3-5 concrete areas of gap / weaknesses
  feedback: string;             // 2-3 sentence executive summary feedback
  improvementSuggestions: string[]; // list of actionable next steps
  recommendedTopics: string[];   // list of 3-5 subtopics to study next
}

Ensure all scores are logical, balanced, and reflect the actual answers provided. Be honest and rigorous. Do NOT include any markdown codeblocks (like \`\`\`json) or extra text outside the JSON object. Return ONLY the raw JSON string.`;

    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let lastError = null;

    for (const model of models) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for report

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: reportPrompt }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            try {
              return JSON.parse(text.trim()) as InterviewReport;
            } catch (err) {
              console.error(`JSON parsing of ${model} report failed. Trying regex extraction.`, err);
              const jsonMatch = text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as InterviewReport;
              }
              throw new Error("Failed to parse evaluation report into JSON structure");
            }
          }
        } else {
          let errorText = "";
          let errorJson: any = null;
          try {
            errorText = await response.text();
            errorJson = JSON.parse(errorText);
          } catch {}

          const status = response.status;
          
          if (status === 429) {
            let retryDelaySec = 60;
            const details = errorJson?.error?.details;
            if (Array.isArray(details)) {
              const retryInfo = details.find((d: any) => d["@type"]?.includes("RetryInfo"));
              if (retryInfo && retryInfo.retryDelay) {
                const parsed = parseFloat(retryInfo.retryDelay);
                if (!isNaN(parsed)) {
                  retryDelaySec = Math.ceil(parsed);
                }
              }
            }
            throw new Error(`QUOTA_EXCEEDED: Gemini API Quota Exceeded. Please try again in ${retryDelaySec} seconds.`);
          }

          if (status === 400 || status === 403) {
            const isInvalidKey =
              errorJson?.error?.message?.toLowerCase().includes("key") ||
              errorJson?.error?.status === "INVALID_ARGUMENT" ||
              errorText.includes("API_KEY_INVALID");
            if (isInvalidKey) {
              throw new Error("INVALID_API_KEY: The provided Gemini API Key is invalid or expired. Check your settings.");
            }
          }

          lastError = new Error(`Gemini evaluation failed (Status ${response.status}) on ${model}: ${errorJson?.error?.message || errorText}`);
          console.warn(`Evaluation with model ${model} failed:`, lastError);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          lastError = new Error("TIMEOUT: Evaluation request to Gemini API timed out.");
        } else if (err.message?.includes("QUOTA_EXCEEDED") || err.message?.includes("INVALID_API_KEY")) {
          throw err;
        } else {
          lastError = err;
        }
        console.warn(`Fetch for evaluation model ${model} failed:`, err);
      }
    }

    throw lastError || new Error("All Gemini models are currently unavailable for evaluation. Please try again later or switch your AI Engine to OpenAI.");
  }
}

// OpenAI Provider implementation
export class OpenAIProvider implements AIProvider {
  name = "openai";

  async generateResponse(options: AIRequestOptions): Promise<string> {
    const { apiKey, settings, messages, currentStage } = options;
    const systemPrompt = getSystemPrompt(settings, currentStage);

    // Map roles to OpenAI schema
    const formattedMessages = messages.map((m) => ({
      role: m.role === "interviewer" ? "assistant" : "user",
      content: m.content,
    }));

    // Add system message
    formattedMessages.unshift({
      role: "system",
      content: systemPrompt,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: formattedMessages,
          temperature: 0.65,
          max_tokens: 600,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error (Status ${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error("Invalid or empty response from OpenAI API");
      }

      return text;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("TIMEOUT: OpenAI request timed out after 15 seconds.");
      }
      throw err;
    }
  }

  async generateReport(options: AIReportRequestOptions): Promise<InterviewReport> {
    const { apiKey, settings, messages } = options;
    const categoryName = CATEGORY_LABELS[settings.category];
    const difficultyName = DIFFICULTY_LABELS[settings.difficulty];

    const transcriptText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const reportPrompt = `Review the following transcript of a mock interview.
Category: ${categoryName}
Target Difficulty: ${difficultyName}

Interview Transcript:
${transcriptText}

Generate a comprehensive, production-grade performance evaluation report in JSON format.
Your output MUST be a valid JSON object matching this TypeScript interface exactly:
interface InterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  improvementSuggestions: string[];
  recommendedTopics: string[];
}

Ensure all scores are logical, balanced, and reflect the actual answers. Return ONLY the raw JSON string. Do not wrap in markdown tags.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a professional AI interviewer that outputs raw JSON reports.",
            },
            { role: "user", content: reportPrompt },
          ],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API evaluation failed: ${errorText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error("No evaluation report generated by OpenAI");
      }

      return JSON.parse(text.trim()) as InterviewReport;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("TIMEOUT: OpenAI evaluation request timed out.");
      }
      throw err;
    }
  }
}

// Ollama Provider implementation (Local Offline engine fallback)
export class OllamaProvider implements AIProvider {
  name = "ollama";

  async generateResponse(options: AIRequestOptions): Promise<string> {
    const { settings, messages, currentStage } = options;
    const systemPrompt = getSystemPrompt(settings, currentStage);

    // Map messages
    const formattedMessages = messages.map((m) => ({
      role: m.role === "interviewer" ? "assistant" : "user",
      content: m.content,
    }));

    formattedMessages.unshift({
      role: "system",
      content: systemPrompt,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3", // default model
          messages: formattedMessages,
          stream: false,
          options: {
            temperature: 0.7,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API returned status ${response.status}`);
      }

      const data = await response.json();
      return data.message?.content || "";
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("TIMEOUT: Local Ollama instance connection timed out. Ensure your model is loaded.");
      }
      throw new Error(`OLLAMA_FAILURE: Failed to communicate with local Ollama engine at http://localhost:11434 (Error: ${err.message}). Ensure Ollama is running and has model 'llama3' installed.`);
    }
  }

  async generateReport(options: AIReportRequestOptions): Promise<InterviewReport> {
    const { settings, messages } = options;
    const categoryName = CATEGORY_LABELS[settings.category];
    const difficultyName = DIFFICULTY_LABELS[settings.difficulty];

    const transcriptText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const reportPrompt = `Review the following transcript of a mock interview.
Category: ${categoryName}
Target Difficulty: ${difficultyName}

Interview Transcript:
${transcriptText}

Generate a comprehensive performance evaluation report in JSON format matching this TypeScript interface:
interface InterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  improvementSuggestions: string[];
  recommendedTopics: string[];
}

Return ONLY the raw JSON string. Do not wrap in markdown codeblocks.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for local CPU generation

    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3",
          messages: [
            { role: "system", content: "You are a professional technical evaluation assistant that returns raw JSON reports." },
            { role: "user", content: reportPrompt }
          ],
          stream: false,
          format: "json", // Ollama native JSON output
          options: {
            temperature: 0.2,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data.message?.content || "";
      return JSON.parse(text.trim()) as InterviewReport;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("TIMEOUT: local Ollama evaluation timed out.");
      }
      throw new Error(`OLLAMA_FAILURE: Ollama report generation failed. Ensure your local engine is running. (Error: ${err.message})`);
    }
  }
}

// Provider Registry for selection
export const aiProviderRegistry: Record<string, AIProvider> = {
  gemini: new GeminiProvider(),
  openai: new OpenAIProvider(),
  ollama: new OllamaProvider(),
};
