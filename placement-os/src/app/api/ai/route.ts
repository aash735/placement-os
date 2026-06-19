import { NextResponse } from "next/server";

// Persona-specific system prompts
const SYSTEM_PROMPTS = {
  sudo: `You are "Sudo", a world-class DSA Coach and mentor. 
Your goal is to help students learn algorithms and patterns (e.g., Sliding Window, Two Pointers, Monotonic Stack).
Follow these guidelines:
- Focus on pattern recognition and conceptual clarity.
- Do NOT output full code solutions unless explicitly asked. Give hints and pseudocode.
- Guide the student step-by-step.
- Keep your tone supportive, technical, and analytical.`,

  quant: `You are "Quant", a specialized Aptitude Trainer.
Your goal is to help students master quantitative aptitude, logical reasoning, and data interpretation.
Follow these guidelines:
- Explain shortcut tricks and quick mental calculation hacks.
- Break down math derivations into simple logical steps.
- Provide a clear example if the student is confused.
- Tone: Energetic, logical, and hyper-focused on efficiency.`,

  resume: `You are "Resume", an ATS Expert and Technical Resume Writer.
Your goal is to help students structure their resume bullet points to pass screening.
Follow these guidelines:
- Advise them to use the X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".
- Suggest powerful action verbs and metrics.
- Keep recommendations specific to software engineering, product management, or data science.
- Tone: Professional, critical, and constructive.`,

  social: `You are "Social", a LinkedIn Branding and Cold Outreach Advisor.
Your goal is to help students get interviews through networking.
Follow these guidelines:
- Provide templates for cold emails/messages to recruiters and engineers.
- Share tips on optimization of LinkedIn profiles and writing technical posts.
- Encourage building in public.
- Tone: Outgoing, encouraging, and strategic.`,

  system: `You are "System", a System Design Architect.
Your goal is to teach students horizontal scaling, microservices, databases (SQL vs NoSQL), and load balancers.
Follow these guidelines:
- Explain trade-offs (e.g., CAP Theorem, Latency vs Throughput).
- Use ASCII diagrams if helpful to visualize components.
- Break down architectural topics for junior engineers.
- Tone: Architectural, structured, and pragmatic.`,

  focus: `You are "Focus", an ADHD-friendly Productivity Partner.
Your goal is to help students fight procrastination and stay consistent.
Follow these guidelines:
- Suggest breaking tasks down into tiny, low-friction micro-habits.
- Support them when they have low energy or feel overwhelmed.
- Do not judge; offer quick 5-minute action loops.
- Tone: Empathetic, motivating, structured, and grounding.`,

  zen: `You are "Zen", a mental wellness and Burnout Therapist.
Your goal is to help students navigate placement anxiety, imposter syndrome, and rejection.
Follow these guidelines:
- Acknowledge that recruitment is a numbers game and rejections are common.
- Suggest recovery schedules, mindfulness, and healthy boundaries.
- Reassure them and reduce cognitive overload.
- Tone: Calming, deeply empathetic, warm, and restorative.`
};

// Local heuristic responses fallback database
const HEURISTIC_RESPONSES: Record<string, Array<{ keywords: string[]; response: string }>> = {
  sudo: [
    {
      keywords: ["sliding window", "subarray", "minimum size"],
      response: `💡 **Sudo's Sliding Window Breakdown**:\n\nThe Sliding Window pattern is used for finding subarrays or substrings in linear time. Instead of nested loops ($O(N^2)$), we maintain a window using two pointers (\`left\` and \`right\`).\n\n**Common Recipe**:\n1. Expand the window by moving \`right\` pointer.\n2. Incorporate the new element into your window state.\n3. While the window state violates constraints (or is valid, depending on the question), shrink the window by moving \`left\` pointer and updating state.\n4. Update your global answer (e.g., max length, min length).\n\n*Try this concept on "Minimum Size Subarray Sum" or "Longest Substring Without Repeating Characters"!*`
    },
    {
      keywords: ["dynamic programming", "dp", "memoization"],
      response: `💡 **Sudo's DP Strategy**:\n\nDynamic Programming is just recursion with cached results (memoization) or tabular accumulation (tabulation). Use DP when you see:\n1. **Overlapping subproblems** (recalculating the same state multiple times).\n2. **Optimal substructure** (optimal solution contains optimal solutions to subproblems).\n\n**Sudo's 3-Step Process**:\n1. Write the recursive relation first (the decision tree).\n2. Add a memoization cache (\`memo\` array or map) to store values at each state.\n3. Convert to iterative bottom-up array if you need space optimization.`
    },
    {
      keywords: ["two pointer", "pointers", "reverse"],
      response: `💡 **Sudo's Two Pointer Guide**:\n\nTwo Pointers is highly effective for sorted arrays or arrays where you compare elements at opposite ends.\n\n- **Opposite Ends**: Start \`left = 0\`, \`right = length - 1\`. Shrink distance based on conditions (e.g., *Two Sum II*, *Container With Most Water*).\n- **Fast & Slow**: Use one pointer that moves 2x faster (e.g., *Linked List Cycle*, *Find Middle*).`
    }
  ],
  quant: [
    {
      keywords: ["percentage", "profit", "loss"],
      response: `✍️ **Quant's Formula Hack**:\n\nFor successional percentage changes ($a\\%$ followed by $b\\%$ change), the net percentage change is given by:\n$$\\text{Net Change} = a + b + \\frac{ab}{100}$$\n\n*Example*: A price is increased by $20\\%$ and then decreased by $10\\%$. Net change = $20 - 10 + \\frac{20 \\times (-10)}{100} = 10 - 2 = 8\\%$ net increase!`
    },
    {
      keywords: ["work", "time", "efficiency"],
      response: `✍️ **Quant's Time & Work Hack**:\n\nAlways convert work into **Unit Efficiencies** using LCM.\nIf A does work in $12$ days and B in $18$ days:\n1. Take LCM of $12$ and $18$ = $36$ units (Total Work).\n2. Efficiency of A = $36/12 = 3$ units/day.\n3. Efficiency of B = $36/18 = 2$ units/day.\n4. Together they do $3 + 2 = 5$ units/day. Time taken = $36/5 = 7.2$ days!\n\nThis LCM method prevents dealing with messy fractions.`
    }
  ],
  resume: [
    {
      keywords: ["ats", "project", "bullet"],
      response: `📄 **Resume's Bullet Optimizer**:\n\nTo make a project look professional, apply Google's **X-Y-Z formula**:\n- *Bad*: "Built an ATS parser using Python."\n- *Excellent*: "Engineered an ATS resume parser utilizing Python NLP, **increasing parsing accuracy by 25%** and reducing HR screening latency by **1.5 hours per batch**."\n\nAlways lead with a strong action verb (Engineered, Architected, Optimized) and include a quantifiable metric.`
    }
  ],
  social: [
    {
      keywords: ["recruiter", "cold", "outreach", "linkedin"],
      response: `📣 **Social's Cold Message Blueprint**:\n\nKeep it under 100 words. Recruiters read messages on their phones; long paragraphs get ignored immediately.\n\n**Template**:\n"Hi [Name], I saw you hire for tech roles at [Company]. I'm a pre-final year CS student at [College] specializing in Next.js & Systems, with an open-source project matching your stack ([GitHub Link]). I'd love to know if you're open to a 5-minute chat about upcoming internships. Resume attached!"`
    }
  ],
  system: [
    {
      keywords: ["scaling", "horizontal", "vertical", "load"],
      response: `🏗️ **System's Scaling Architecture**:\n\n- **Vertical Scaling (Scale Up)**: Adding more CPU/RAM to a single machine. Hard hardware limit, single point of failure (SPOF).\n- **Horizontal Scaling (Scale Out)**: Adding more cheap servers and distributing traffic using a **Load Balancer** (e.g. Nginx, AWS ALB).\n- **Databases**: Relational DBs (Postgres) scale vertically well, but need read-replicas or sharding for horizontal scale. NoSQL DBs (MongoDB, Cassandra) are built horizontally scalable out of the box using partitioning keys.`
    }
  ],
  focus: [
    {
      keywords: ["lazy", "procrastinate", "start", "focus"],
      response: `⚡ **Focus's 5-Minute Procrastination Antidote**:\n\nProcrastination is emotional regulation, not laziness. The starting friction is what is blocking you.\n\n**Your Mission**:\nSet a timer for exactly **5 minutes**. Commit to opening your text editor and writing just *one line of code* or *one sentence* of notes. Once the 5 minutes are up, you have full permission to close the laptop and play games. 90% of the time, once you start, the momentum carries you through. Try it right now!`
    }
  ],
  zen: [
    {
      keywords: ["anxious", "anxiety", "reject", "rejection", "fail"],
      response: `🌸 **Zen's Perspective Recovery**:\n\nRejections in placement drives are not a reflection of your worth or intelligence. They are often a mismatch of timing, recruiter bias, or random interview variance.\n\n1. **Acknowledge the stress**: It's okay to feel disappointed. Take 24 hours off without opening LeetCode.\n2. **The Numbers Game**: An average candidate receives 20+ rejections before their first offer. Each rejection is simply a calibration step, refining your interview communication.\n3. **Breathe**: In 5 years, this specific rejection won't even cross your mind.`
    }
  ]
};

export async function POST(req: Request) {
  try {
    const { prompt, persona, apiKey, context } = await resJson(req);

    if (!prompt || !persona) {
      return NextResponse.json({ error: "Missing prompt or persona" }, { status: 400 });
    }

    // Validate persona against whitelist to prevent prompt injection
    const validPersonas = Object.keys(SYSTEM_PROMPTS);
    if (!validPersonas.includes(persona)) {
      return NextResponse.json({ error: "Invalid persona" }, { status: 400 });
    }

    // Cap prompt length to prevent prompt injection via oversized input
    if (typeof prompt !== "string" || prompt.length > 4000) {
      return NextResponse.json({ error: "Prompt exceeds maximum length" }, { status: 400 });
    }

    // Resolve API key: check body parameter first, fall back to environment variable
    let resolvedApiKey = (apiKey || "").trim();
    if (!resolvedApiKey) {
      resolvedApiKey = (process.env.GEMINI_API_KEY || "").trim();
    }

    // Development mode duplicate/excessive request monitoring
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[AI Mentor API] Persona: ${persona}, Prompt Length: ${prompt.length}, ` +
        `API Key: ${apiKey ? "Provided" : "Env Fallback"}, Timestamp: ${new Date().toISOString()}`
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[persona as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.sudo;

    // 1. CALL GEMINI API IF KEY PROVIDED
    if (resolvedApiKey && resolvedApiKey !== "") {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${resolvedApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: `System Instruction: ${systemPrompt}` },
                    { text: `Context: ${JSON.stringify(context || {})}` },
                    { text: `User Message: ${prompt}` }
                  ]
                }
              ],
              generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ response: text });
          }
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back to heuristics:", err);
      }
    }

    // 2. FALLBACK TO HEURISTICS
    const lowerPrompt = prompt.toLowerCase();
    const personaHeuristics = HEURISTIC_RESPONSES[persona as keyof typeof HEURISTIC_RESPONSES] || [];
    
    // Find matching heuristic
    const match = personaHeuristics.find((h) =>
      h.keywords.some((kw) => lowerPrompt.includes(kw))
    );

    if (match) {
      return NextResponse.json({ response: match.response });
    }

    // Generic fallback based on persona
    let fallbackText = "";
    switch (persona) {
      case "sudo":
        fallbackText = `💻 **Sudo's Guidance**:\n\nI hear you! To debug or optimize this problem, try to identify the underlying **data structure pattern**:\n- Is it a range sum/sliding limit? -> *Sliding Window*\n- Do we need to find pairs? -> *Hash Map / Two Pointers*\n- Is there recursion with branches? -> *Dynamic Programming*\n\nTell me more details about your problem statement or complexity constraints so I can give you a targeted hint!`;
        break;
      case "quant":
        fallbackText = `🔢 **Quant's Tips**:\n\nAptitude questions usually have a shortcut pattern. Try checking the options first to eliminate obviously incorrect answers.\n\nFor rate or work questions, LCM calculations are your best friend. What specific quantitative or logical question are we solving?`;
        break;
      case "resume":
        fallbackText = `📄 **Resume Critique**:\n\nMake sure your resume lists technical details (languages, frameworks) clearly, and projects are backed by concrete results. \n\nWhat project or bullet point would you like to rewrite right now?`;
        break;
      case "social":
        fallbackText = `🤝 **Social's Outreach tip**:\n\nWhen reaching out on LinkedIn, remember to show interest in their work rather than just asking for a referral. Mentioning a specific technical topic they posted about increases reply rates by 30%.\n\nWho are we trying to reach? Recruiter, Engineering Manager, or Senior Dev?`;
        break;
      case "system":
        fallbackText = `🏗️ **System Design Guideline**:\n\nRemember to start with high-level API requirements and estimates (QPS, storage size) before diving into service diagrams. Choose databases based on ACID transactions vs write-heavy scales.\n\nWhat system or component are we designing today?`;
        break;
      case "focus":
        fallbackText = `🔋 **Focus Energy Check**:\n\nLet's get this done. Break it down into the absolute smallest task. Can you write the input test cases first? Or read just the problem description? Let's spend just 3 minutes on it. Ready?`;
        break;
      case "zen":
        fallbackText = `🌸 **Zen's Space**:\n\nTake a deep breath. Close your eyes for 10 seconds. You are on track, and placements are a process. One step, one day at a time. What's on your mind?`;
        break;
      default:
        fallbackText = `Hello! I'm your AI counselor. I can help you with DSA, aptitude, resumes, system design, and placement anxiety. Ask me anything!`;
    }

    return NextResponse.json({ response: fallbackText });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function resJson(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
