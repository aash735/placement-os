import path from "path";
import type {
  DSAQuestion,
  DSATopicMeta,
  QuestionCategory,
  TopicLevel,
} from "@/types";
import type { SheetRow } from "./schemas";
import { parseNumber, splitList } from "./schemas";
import { questionBank } from "../../data/question-bank";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function normalizeTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Create a lookup map for legacy question bank questions to enrich parsed rows
const questionBankMap = new Map<string, typeof questionBank[number]>();
questionBank.forEach((q) => {
  questionBankMap.set(normalizeTitle(q.title), q);
});

function normalizeTopicName(topic: string): string {
  const clean = topic.toLowerCase().trim();
  const map: Record<string, string> = {
    "dp": "Dynamic Programming",
    "bst": "Binary Search Trees",
    "binary-search-tree": "Binary Search Trees",
    "binary-search-trees": "Binary Search Trees",
    "binary-tree": "Binary Trees",
    "binary-trees": "Binary Trees",
    "linked-list": "Linked List",
    "linkedlist": "Linked List",
    "two-pointer": "Two Pointer",
    "two-pointers": "Two Pointer",
    "sliding-window": "Sliding Window",
    "slidingwindow": "Sliding Window",
    "bfs-dfs": "BFS & DFS",
    "dfs-bfs": "BFS & DFS",
    "searching-sorting": "Searching & Sorting",
    "searching-and-sorting": "Searching & Sorting",
    "stacks-queues": "Stacks & Queues",
    "stacks-and-queues": "Stacks & Queues",
    "heaps-hashing": "Heaps & Hashing",
    "heaps-and-hashing": "Heaps & Hashing",
    "bit-manipulation": "Bit Manipulation",
    "segment-tree": "Segment Trees",
    "segment-trees": "Segment Trees",
  };
  
  if (map[clean]) return map[clean];
  const slugified = slugify(clean);
  if (map[slugified]) return map[slugified];

  return topic
    .replace(/[-_]/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function normalizeCompanyName(name: string): string {
  const clean = name.trim();
  if (!clean) return "";
  // Filter out single char, noise words, or very short non-company tokens
  if (clean.length <= 1) return "";
  if (/^(in|at|of|and|or|for|the|a|an|is|by|to|on)$/i.test(clean)) return "";
  
  const lower = clean.toLowerCase();
  const map: Record<string, string> = {
    google: "Google",
    amazon: "Amazon",
    microsoft: "Microsoft",
    facebook: "Facebook",
    meta: "Meta",
    netflix: "Netflix",
    apple: "Apple",
    uber: "Uber",
    adobe: "Adobe",
    cisco: "Cisco",
    hike: "Hike",
    flipkart: "Flipkart",
    directi: "Directi",
    linkedin: "LinkedIn",
    paytm: "Paytm",
    zomato: "Zomato",
    swiggy: "Swiggy",
    grofers: "Grofers",
    ola: "Ola",
    dunzo: "Dunzo",
    meesho: "Meesho",
    myntra: "Myntra",
    nagarro: "Nagarro",
    atlassian: "Atlassian",
    zoho: "Zoho",
    visa: "Visa",
    paypal: "PayPal",
    twitter: "Twitter",
    snap: "Snap",
    spotify: "Spotify",
    airbnb: "Airbnb",
    "goldman sachs": "Goldman Sachs",
    "morgan stanley": "Morgan Stanley",
    "d-e-shaw": "D.E. Shaw",
    "de shaw": "D.E. Shaw",
    "media.net": "Media.net",
    "societe generale": "Societe Generale",
    "makemytrip": "MakeMyTrip",
    "factset": "FactSet",
    "streaminoid technologies": "Streamoid Technologies",
    infosys: "Infosys",
    tcs: "TCS",
    wipro: "Wipro",
    cognizant: "Cognizant",
    accenture: "Accenture",
    walmart: "Walmart",
    samsung: "Samsung",
    oracle: "Oracle",
    salesforce: "Salesforce",
    capgemini: "Capgemini",
    amdocs: "Amdocs",
    maq: "MAQ Software",
  };
  if (map[lower]) return map[lower];
  // Capitalize properly
  return clean
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}


function normalizeTag(tag: string): string {
  const clean = tag.trim();
  if (!clean) return "";
  return clean
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function getRowValue(row: SheetRow, keys: string[]): string {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) {
      return String(row[k]).trim();
    }
  }
  // Case-insensitive search
  const entries = Object.entries(row);
  for (const key of keys) {
    const found = entries.find(
      ([k]) => k.toLowerCase().replace(/[\s_-]+/g, "") === key.toLowerCase().replace(/[\s_-]+/g, "")
    );
    if (found) {
      return String(found[1]).trim();
    }
  }
  return "";
}

export function rowToDSAQuestion(row: SheetRow): DSAQuestion | null {
  // Title is required
  const title = getRowValue(row, ["title", "question", "problem", "question_title", "problem_title", "question_375", "name"]);
  if (!title || title.trim() === "" || title.toLowerCase().includes("meet us on youtube") || title.toLowerCase().includes("phase")) {
    return null;
  }

  // Pre-fetch matching question from seed data to populate missing properties
  const normTitle = normalizeTitle(title);
  const matchedQ = questionBankMap.get(normTitle);

  // Topic is required
  let topic = getRowValue(row, ["topic", "topics", "category", "topic_name", "group"]);
  if (!topic) {
    if (matchedQ && matchedQ.topicId) {
      topic = matchedQ.topicId;
    } else {
      const sheetName = row._sheet_name || "";
      const fileName = row._file_name ? path.basename(row._file_name, path.extname(row._file_name)) : "";
      
      if (sheetName && !sheetName.toLowerCase().includes("sheet") && !sheetName.toLowerCase().includes("question") && !sheetName.toLowerCase().includes("book")) {
        topic = sheetName;
      } else if (fileName && fileName !== "Book1" && fileName !== "DSA by Shradha Ma'am" && fileName !== "questions") {
        topic = fileName;
      } else {
        topic = "general";
      }
    }
  }

  // Normalize Shradha topic names to canonical display names
  const TOPIC_CANONICAL: Record<string, string> = {
    "dp": "Dynamic Programming",
    "dynamic programming": "Dynamic Programming",
    "arrays": "Arrays",
    "2d arrays": "2D Arrays",
    "strings": "Strings",
    "linked list": "Linked List",
    "linked-list": "Linked List",
    "stacks & queues": "Stacks & Queues",
    "stacks and queues": "Stacks & Queues",
    "stack": "Stacks & Queues",
    "queue": "Stacks & Queues",
    "binary trees": "Binary Trees",
    "trees": "Binary Trees",
    "binary search trees": "Binary Search Trees",
    "bst": "Binary Search Trees",
    "heaps & hashing": "Heaps & Hashing",
    "heaps and hashing": "Heaps & Hashing",
    "heap": "Heaps & Hashing",
    "hashmaps": "Heaps & Hashing",
    "graphs": "Graphs",
    "bfs-dfs": "Graphs",
    "searching & sorting": "Searching & Sorting",
    "searching and sorting": "Searching & Sorting",
    "sorting": "Searching & Sorting",
    "binary-search": "Searching & Sorting",
    "greedy": "Greedy",
    "backtracking": "Backtracking",
    "tries": "Tries",
    "segment trees": "Segment Trees",
    "bit manipulation": "Bit Manipulation",
    "sliding window": "Sliding Window",
    "sliding-window": "Sliding Window",
    "two pointers": "Two Pointers",
    "two-pointer": "Two Pointers",
    "recursion": "Recursion",
    "maths": "Maths",
    "matrix": "2D Arrays",
  };
  const topicLower = topic.toLowerCase().trim();
  const canonicalTopic = TOPIC_CANONICAL[topicLower] || topic;
  const topicId = slugify(canonicalTopic);


  // Difficulty mapping
  const diffRaw = getRowValue(row, ["difficulty", "level_name", "diff", "difficulty_level", "level"]);
  let difficulty: "Easy" | "Medium" | "Hard" = "Medium";
  if (diffRaw) {
    const diffLower = diffRaw.toLowerCase();
    if (diffLower.includes("easy") || diffLower === "1") {
      difficulty = "Easy";
    } else if (diffLower.includes("hard") || diffLower === "3" || diffLower === "4") {
      difficulty = "Hard";
    } else if (diffLower.includes("medium") || diffLower === "2") {
      difficulty = "Medium";
    }
  } else if (matchedQ && matchedQ.difficulty) {
    difficulty = matchedQ.difficulty;
  }

  // Level mapping
  let levelVal = 2;
  const levelRaw = getRowValue(row, ["level", "unlock_level"]);
  if (levelRaw && /^[1-4]$/.test(levelRaw)) {
    levelVal = parseInt(levelRaw);
  } else if (matchedQ && matchedQ.level) {
    levelVal = matchedQ.level;
  } else {
    levelVal = difficulty === "Easy" ? 1 : difficulty === "Hard" ? 3 : 2;
  }
  const level = levelVal as TopicLevel;

  // Link is optional - fallback to Google search
  const urlRaw = getRowValue(row, ["url", "link", "problem_link", "question_link", "link_url", "url_link"]);
  let url = urlRaw;
  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    if (matchedQ && matchedQ.url) {
      url = matchedQ.url;
    } else {
      url = `https://www.google.com/search?q=${encodeURIComponent(title + " leetcode")}`;
    }
  }

  // Pattern / Subtopic
  let pattern = getRowValue(row, ["pattern", "patterns", "concept", "weak_concept", "weakconcept"]);
  if (!pattern) {
    if (matchedQ && matchedQ.pattern) {
      pattern = matchedQ.pattern;
    } else {
      pattern = "General";
    }
  }
  const subtopic = getRowValue(row, ["subtopic", "sub_topic", "subtopic_name"]) || pattern;

  // Companies — handle both CSV pipe-separated AND Shradha format (space/+/comma separated)
  const companiesStr = getRowValue(row, ["companies", "company", "target_companies", "company_tags"]);
  
  const known = [
    "Goldman Sachs", "Morgan Stanley", "D-E-Shaw", "Media.net", "Societe Generale",
    "MakeMyTrip", "Apna College", "Streamoid Technologies", "LinkedIn",
    "American Express", "Bank of America", "JP Morgan", "J.P. Morgan",
    "DE Shaw", "Thought Works", "ThoughtWorks",
  ];

  
  const rawCompanies = companiesStr
    // First split by pipe (CSV format) or + or comma
    .split(/\||\s*\+\s*|\s*,\s*/)
    .flatMap((chunk) => {
      chunk = chunk.trim();
      if (!chunk) return [];
      // Check for known multi-word companies
      for (const k of known) {
        if (chunk.toLowerCase() === k.toLowerCase()) return [k];
        if (chunk.toLowerCase().includes(k.toLowerCase())) return [k];
      }
      // Skip noise tokens
      if (/^(IQ|Interview|Qs|Question|and|or|a|an|the)$/i.test(chunk)) return [];
      // Split CamelCase company names (e.g. "AmazonMicrosoft")
      const split = chunk
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(/\s+/)
        .map(w => w.trim())
        .filter(w => w.length > 1 && !/^(IQ|Interview|Qs|Question)$/i.test(w));
      return split.length > 0 ? split : [chunk];
    });

  let companies = rawCompanies.map(normalizeCompanyName).filter(Boolean);
  if (matchedQ && matchedQ.companies) {
    companies = companies.concat(matchedQ.companies);
  }
  const uniqueCompanies = Array.from(new Set(companies));



  // Tags
  const tagsStr = getRowValue(row, ["tags", "tag", "keywords"]);
  let tags = splitList(tagsStr, "|")
    .concat(splitList(tagsStr, ","))
    .map(normalizeTag)
    .filter(Boolean);
  if (matchedQ && matchedQ.tags) {
    tags = tags.concat(matchedQ.tags);
  }
  const uniqueTags = Array.from(new Set(tags));

  // Notes
  const notes = getRowValue(row, ["notes", "note", "remarks", "remark", "explanation", "comment"]);

  // XP
  const xpRaw = getRowValue(row, ["xp", "xp_reward", "xpreward", "points"]);
  const xpReward = xpRaw ? parseNumber(xpRaw, 50) : (difficulty === "Easy" ? 50 : difficulty === "Hard" ? 150 : 100);

  // Revision priority
  const revRaw = getRowValue(row, ["revision_priority", "revisionpriority", "priority"]).toLowerCase();
  let revisionPriority: "critical" | "high" | "medium" | "low" = "medium";
  if (revRaw.includes("critical")) revisionPriority = "critical";
  else if (revRaw.includes("high")) revisionPriority = "high";
  else if (revRaw.includes("low")) revisionPriority = "low";

  // Neetcode
  let neetCodeRef = getRowValue(row, ["neetcode", "neetcode_ref", "neetcode_link"]) || undefined;
  if (!neetCodeRef && matchedQ && matchedQ.neetCodeRef) {
    neetCodeRef = matchedQ.neetCodeRef;
  }

  // Video Solution
  const videoUrl = getRowValue(row, ["video_solution", "videosolution", "video_url", "video", "solution_video"]) || undefined;

  const id = row.question_id || row.id || (matchedQ && matchedQ.id) || slugify(title);

  return {
    id,
    title,
    topicId,
    level,
    category: (difficulty === "Easy" ? "easy" : difficulty === "Hard" ? "hard" : "medium") as QuestionCategory,
    difficulty,
    platform: (url.includes("geeksforgeeks") ? "GFG" : "LeetCode") as any,
    url,
    pattern,
    subtopic,
    companies: uniqueCompanies,
    estimatedMinutes: difficulty === "Easy" ? 20 : difficulty === "Hard" ? 60 : 40,
    interviewFrequency: matchedQ?.interviewFrequency ??
      (uniqueCompanies.length >= 5 ? "very-high" :
       uniqueCompanies.length >= 3 ? "high" :
       uniqueCompanies.length >= 1 ? "medium" : "low"),

    revisionPriority,
    explanationImportance: level >= 3 ? "must" : "recommended",
    neetCodeRef,
    tags: uniqueTags,
    xpReward,
    unlockLevel: level,
    prerequisites: [],
    videoUrl,
    notes: notes || undefined,
  };
}


export function rowToDSATopic(row: SheetRow): DSATopicMeta | null {
  if (!row.id || !row.name) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.id,
    difficulty: Math.min(5, Math.max(1, parseNumber(row.difficulty, 2))) as DSATopicMeta["difficulty"],
    importanceScore: parseNumber(row.importance_score, 80),
    interviewFrequency: (row.interview_frequency || "medium") as DSATopicMeta["interviewFrequency"],
    estimatedHours: parseNumber(row.estimated_hours, 8),
    tier: (row.tier || "must") as DSATopicMeta["tier"],
    overview: row.overview || "",
    patterns: splitList(row.patterns),
    unlockAfterTopicId: row.unlock_after_topic_id || undefined,
  };
}

export type CompanyProfile = {
  slug: string;
  name: string;
  type: "service" | "consulting" | "product" | "startup";
  oaPattern: string;
  codingDifficulty: string;
  aptitudeWeight: string;
  rounds: string[];
  communication: string;
  resume: string;
  projects: string;
  hrQuestions: string[];
  priority: string;
  strategy: string;
};

export function rowToCompany(row: SheetRow): CompanyProfile | null {
  if (!row.slug || !row.name) return null;
  return {
    slug: row.slug,
    name: row.name,
    type: (row.type || "service") as CompanyProfile["type"],
    oaPattern: row.oa_pattern || "",
    codingDifficulty: row.coding_difficulty || "",
    aptitudeWeight: row.aptitude_weightage || "",
    rounds: splitList(row.rounds),
    communication: row.communication || "",
    resume: row.resume || "",
    projects: row.projects || "",
    hrQuestions: splitList(row.hr_questions),
    priority: row.priority || "",
    strategy: row.strategy || "",
  };
}

export type AptitudeTopic = {
  id: string;
  category: string;
  name: string;
  priority: string;
  difficulty: number;
  strategy: string;
  shortcuts: string[];
  revision: string;
};

export function rowToAptitudeTopic(row: SheetRow): AptitudeTopic | null {
  if (!row.id || !row.name) return null;
  return {
    id: row.id,
    category: row.category || "quant",
    name: row.name,
    priority: row.priority || "medium",
    difficulty: parseNumber(row.difficulty, 2),
    strategy: row.strategy || "",
    shortcuts: splitList(row.shortcuts),
    revision: row.revision || "",
  };
}

export type MockTestSet = {
  id: string;
  title: string;
  durationMin: number;
  questionIds: string[];
  companyTags: string[];
};

export function rowToMockTest(row: SheetRow): MockTestSet | null {
  if (!row.id || !row.title) return null;
  return {
    id: row.id,
    title: row.title,
    durationMin: parseNumber(row.duration_min, 60),
    questionIds: splitList(row.question_ids),
    companyTags: splitList(row.company_tags),
  };
}
