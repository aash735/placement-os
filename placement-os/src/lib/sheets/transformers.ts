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

export function normalizeCompanyName(name: string): string {
  const clean = name.trim();
  if (!clean) return "";
  // Filter out single char, noise words, or very short non-company tokens
  if (clean.length <= 1) return "";
  if (/^(in|at|of|and|or|for|the|a|an|is|by|to|on|all|mnc|mncs|all mnc|all mncs)$/i.test(clean)) return "";
  
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
    "d.e. shaw": "D.E. Shaw",
    "d.e.shaw": "D.E. Shaw",
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
    "maq software": "MAQ Software",
    software: "",
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
    const cleanedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    const found = entries.find(
      ([k]) => k.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanedKey
    );
    if (found) {
      return String(found[1]).trim();
    }
  }
  return "";
}

const KNOWN_TOPIC_STRINGS = new Set([
  "arrays", "array", "2d arrays", "2d array", "matrix", "matrices", "matrix problems",
  "strings", "string",
  "heaps & hashing", "heaps and hashing", "heap", "heaps", "hashmaps", "hashmap", "hash", "hashing", "heaps / pqs", "heaps/pqs", "heaps / pq", "heaps/pq", "heap / pq", "heap/pq",
  "stacks & queues", "stacks and queues", "stack", "queue", "queues",
  "searching & sorting", "searching and sorting", "sorting and searching", "sorting", "binary-search", "binary search", "bs",
  "linked list", "linked-list",
  "binary search trees", "bst", "binary search tree",
  "binary trees", "trees", "tree", "binary tree", "segment trees", "segment tree", "tries", "trie",
  "graphs", "graph", "graph basics",
  "dp", "dynamic programming", "dp basics",
  "greedy", "greedy algorithms",
  "backtracking", "recursion", "divide and conquer", "bfs-dfs",
  "sliding window", "sliding-window",
  "two pointers", "two pointer", "two-pointer", "two pointer approach",
  "bit manipulation", "bit-manipulation", "bitmanipulation",
  "mathematical problems", "maths", "math"
]);

const CANONICAL_TOPICS = [
  "arrays", "strings", "hashmaps", "sorting", "binary-search",
  "sliding-window", "two-pointer", "stack", "queue", "linked-list",
  "trees", "bst", "heap", "bfs-dfs", "greedy", "graphs", "dp",
  "recursion", "bit-manipulation"
];

function getLevenshteinDistance(a: string, b: string): number {
  const tmp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

function suggestClosestTopic(rawTopic: string): string {
  const clean = rawTopic.toLowerCase().trim();
  let minDistance = Infinity;
  let closest = "arrays";
  for (const t of CANONICAL_TOPICS) {
    const dist = getLevenshteinDistance(clean, t);
    if (dist < minDistance) {
      minDistance = dist;
      closest = t;
    }
  }
  return closest;
}

const loggedUnrecognizedTopics = new Set<string>();

function getCanonicalTopicId(rawTopic: string, rawConcept: string, title: string): string {
  const t = (rawTopic || "").toLowerCase().trim();
  const c = (rawConcept || "").toLowerCase().trim();
  const titleLower = (title || "").toLowerCase().trim();

  // Log unrecognized topic/category and warn
  if (t && !KNOWN_TOPIC_STRINGS.has(t) && !loggedUnrecognizedTopics.has(t)) {
    loggedUnrecognizedTopics.add(t);
    const suggestion = suggestClosestTopic(t);
    console.warn(`⚠️  Unrecognized topic/category encountered: "${rawTopic}"`);
    console.warn(`   Suggested closest existing category: "${suggestion}"`);
  }

  const hasWord = (str: string, words: string[]) => words.some(w => str.includes(w));

  // Determine if heap vs hashmap for "heaps & hashing"
  if (t === "heaps & hashing" || t === "heaps and hashing" || t === "heap" || t === "heaps" || t === "hashmaps" || t === "hashmap" || t === "hash" || t === "hashing" || t.startsWith("heaps / pqs") || t.startsWith("heaps/pqs") || t.includes("pq") || t.includes("heap")) {
    if (hasWord(titleLower, ["heap", "priority queue", "kth", "k largest", "k most", "median", "merge k"]) || hasWord(c, ["heap", "priority"]) || t.includes("pq") || t.includes("heap")) {
      return "heap";
    }
    return "hashmaps";
  }

  // Determine if stack vs queue for "stacks & queues"
  if (t === "stacks & queues" || t === "stacks and queues" || t === "stack" || t === "queue" || t === "queues") {
    if (hasWord(titleLower, ["queue", "deque", "circular queue", "fifo"]) || hasWord(c, ["queue", "deque"])) {
      return "queue";
    }
    return "stack";
  }

  if (t === "binary search" || t === "binary-search") {
    return "binary-search";
  }

  // Determine if sorting vs binary search for "searching & sorting"
  if (t === "searching & sorting" || t === "searching and sorting" || t === "sorting and searching" || t === "sorting" || t === "bs") {
    if (hasWord(titleLower, ["binary search", "search in", "search a", "first and last", "search insert", "median of", "find minimum in rotated", "search a 2d"]) || hasWord(c, ["binary search", "binary-search", "lower bound", "upper bound"])) {
      return "binary-search";
    }
    return "sorting";
  }

  // Basic mappings
  if (t === "arrays" || t === "array" || t === "2d arrays" || t === "2d array" || t === "matrix" || t === "matrices" || t === "matrix problems") {
    if (hasWord(c, ["sliding window", "sliding-window"]) || hasWord(titleLower, ["sliding window", "longest substring without"])) {
      return "sliding-window";
    }
    if (hasWord(c, ["two pointer", "two-pointer", "two pointers"]) || hasWord(titleLower, ["two sum", "three sum", "3sum", "container with most water"])) {
      return "two-pointer";
    }
    return "arrays";
  }

  if (t === "strings" || t === "string") {
    if (hasWord(c, ["sliding window", "sliding-window"]) || hasWord(titleLower, ["sliding window", "longest substring without"])) {
      return "sliding-window";
    }
    return "strings";
  }

  if (t === "linked list" || t === "linked-list") return "linked-list";
  if (t === "binary search trees" || t === "bst" || t === "binary search tree") return "bst";
  
  if (t === "binary trees" || t === "trees" || t === "tree" || t === "binary tree" || t === "segment trees" || t === "segment tree" || t === "tries" || t === "trie") {
    return "trees";
  }

  if (t === "graphs" || t === "graph" || t === "graph basics") return "graphs";
  if (t === "dp" || t === "dynamic programming" || t === "dp basics") return "dp";
  if (t === "greedy" || t === "greedy algorithms") return "greedy";
  if (t === "backtracking" || t === "recursion") return "recursion";
  if (t === "divide and conquer" || t === "bfs-dfs") return "bfs-dfs";
  if (t === "bit manipulation" || t === "bit-manipulation" || t === "bitmanipulation" || t === "mathematical problems" || t === "maths" || t === "math") return "bit-manipulation";

  if (t === "sliding window" || t === "sliding-window") return "sliding-window";
  if (t === "two pointers" || t === "two pointer" || t === "two-pointer" || t === "two pointer approach") return "two-pointer";

  // Fallbacks based on concepts
  if (hasWord(c, ["two pointer", "two-pointer", "two pointers"])) return "two-pointer";
  if (hasWord(c, ["sliding window", "sliding-window"])) return "sliding-window";
  if (hasWord(c, ["hashmap", "hashing", "hash", "map", "set"])) return "hashmaps";
  if (hasWord(c, ["binary search", "binary-search"])) return "binary-search";
  if (hasWord(c, ["sort", "sorting"])) return "sorting";
  if (hasWord(c, ["stack"])) return "stack";
  if (hasWord(c, ["queue", "deque"])) return "queue";
  if (hasWord(c, ["linked list", "linked-list"])) return "linked-list";
  if (hasWord(c, ["bst"])) return "bst";
  if (hasWord(c, ["heap"])) return "heap";
  if (hasWord(c, ["dfs", "bfs", "backtracking", "recursion"])) return "bfs-dfs";
  if (hasWord(c, ["graph"])) return "graphs";
  if (hasWord(c, ["dp", "dynamic programming"])) return "dp";
  if (hasWord(c, ["tree"])) return "trees";
  if (hasWord(c, ["greedy"])) return "greedy";

  // General fallbacks
  return "arrays";
}

export function rowToDSAQuestion(row: SheetRow): DSAQuestion | null {
  // Title is required
  const title = getRowValue(row, ["title", "question", "problem", "question_title", "problem_title", "question_375", "name", "question_link"]);
  if (!title || title.trim() === "") {
    return null;
  }

  // Exclude section dividers, headers, and banners
  const titleLower = title.toLowerCase().trim();
  if (
    titleLower === "question link" ||
    titleLower === "question" ||
    titleLower === "problem" ||
    titleLower === "title" ||
    titleLower === "intro" ||
    titleLower.startsWith("intro to") ||
    titleLower.includes("ideal time") ||
    titleLower.includes("5 questions each day") ||
    titleLower.startsWith("arrays :") ||
    titleLower.startsWith("arrays  :") ||
    titleLower.startsWith("binary search :") ||
    titleLower.startsWith("strings :") ||
    titleLower.startsWith("strings  :") ||
    titleLower.startsWith("linked list :") ||
    titleLower.startsWith("recursion :") ||
    titleLower.startsWith("bit manipulation :") ||
    titleLower.startsWith("stack :") ||
    titleLower.startsWith("sliding window :") ||
    titleLower.startsWith("binary tree :") ||
    titleLower.startsWith("dp :") ||
    titleLower.includes("doubly linked list :") ||
    titleLower.includes("meet us on youtube") ||
    titleLower.includes("phase")
  ) {
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

  const concept = getRowValue(row, ["pattern", "patterns", "concept", "weak_concept", "weakconcept"]);
  const subtopic = getRowValue(row, ["subtopic", "sub_topic", "subtopic_name"]) || concept;
  const topicId = getCanonicalTopicId(topic, concept || subtopic, title);

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

  // Category mapping - MUST be a valid QuestionCategory enum, NEVER "hard"
  const catRaw = getRowValue(row, ["category", "question_category", "type"]);
  let category: QuestionCategory = "medium";
  if (catRaw) {
    const cLower = catRaw.toLowerCase().trim();
    if (["beginner", "easy", "medium", "interview", "revision", "mock"].includes(cLower)) {
      category = cLower as QuestionCategory;
    } else {
      if (cLower.includes("begin")) category = "beginner";
      else if (cLower.includes("easy")) category = "easy";
      else if (cLower.includes("medium")) category = "medium";
      else if (cLower.includes("interview") || cLower.includes("hard")) category = "interview";
      else if (cLower.includes("revision")) category = "revision";
      else if (cLower.includes("mock")) category = "mock";
    }
  } else {
    if (difficulty === "Easy") category = "easy";
    else if (difficulty === "Hard") category = "interview";
    else category = "medium";
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

  // Companies — handle both CSV pipe-separated AND Shradha format (space/+/comma separated)
  const companiesStr = getRowValue(row, ["companies", "company", "target_companies", "company_tags"]);
  
  const known = [
    "Goldman Sachs", "Morgan Stanley", "D-E-Shaw", "Media.net", "Societe Generale",
    "MakeMyTrip", "Apna College", "Streamoid Technologies", "LinkedIn",
    "American Express", "Bank of America", "JP Morgan", "J.P. Morgan",
    "DE Shaw", "D.E. Shaw", "D.e. Shaw", "MAQ Software", "Thought Works", "ThoughtWorks",
  ];

  const rawCompanies = companiesStr
    .split(/\||\s*\+\s*|\s*,\s*/)
    .flatMap((chunk) => {
      chunk = chunk.trim();
      if (!chunk) return [];
      for (const k of known) {
        if (chunk.toLowerCase() === k.toLowerCase()) return [k];
        if (chunk.toLowerCase().includes(k.toLowerCase())) return [k];
      }
      if (/^(IQ|Interview|Qs|Question|and|or|a|an|the)$/i.test(chunk)) return [];
      const split = chunk
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(/\s+/)
        .map(w => w.trim())
        .filter(w => w.length > 1 && !/^(IQ|Interview|Qs|Question)$/i.test(w));
      return split.length > 0 ? split : [chunk];
    });

  let companies = rawCompanies.map(normalizeCompanyName).filter(Boolean);
  if (matchedQ && matchedQ.companies) {
    const normalizedSeed = matchedQ.companies.map(normalizeCompanyName).filter(Boolean);
    companies = companies.concat(normalizedSeed);
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
  if (neetCodeRef) {
    // If it's a full URL, extract slug or keep it clean
    neetCodeRef = neetCodeRef.trim();
  }

  // Striver
  let striverRef = getRowValue(row, ["striver", "striver_ref", "striver_link"]) || undefined;
  if (!striverRef && matchedQ && matchedQ.striverRef) {
    striverRef = matchedQ.striverRef;
  }
  if (striverRef) {
    striverRef = striverRef.trim();
  }

  // Video Solution
  const videoUrl = getRowValue(row, ["video_solution", "videosolution", "video_url", "video", "solution_video"]) || undefined;

  const id = row.question_id || row.id || (matchedQ && matchedQ.id) || slugify(title);

  // Excel Workbook extensions
  const takeaways = getRowValue(row, ["takeaways", "takeaway"]) || undefined;
  const approach = getRowValue(row, ["approach"]) || undefined;
  const timeComplexity = getRowValue(row, ["tc", "timecomplexity", "time_complexity"]) || undefined;
  const spaceComplexity = getRowValue(row, ["sc", "spacecomplexity", "space_complexity"]) || undefined;
  const sourceSheet = row._sheet_name || undefined;
  const createdAt = matchedQ?.createdAt || new Date().toISOString();
  const updatedAt = new Date().toISOString();

  // Related/Sub-questions
  const sq1 = row.sq1 || undefined;
  const sq1Url = row.sq1_url || undefined;
  const sq2 = row.sq2 || undefined;
  const sq2Url = row.sq2_url || undefined;
  const sq3 = row.sq3 || undefined;
  const sq3Url = row.sq3_url || undefined;

  return {
    id,
    title,
    topicId,
    level,
    category,
    difficulty,
    platform: (url.includes("geeksforgeeks") ? "GFG" : "LeetCode") as any,
    url,
    pattern: concept || "General",
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
    striverRef,
    tags: uniqueTags,
    xpReward,
    unlockLevel: level,
    prerequisites: [],
    videoUrl,
    notes: notes || undefined,

    // Sheet metadata and rich fields
    slug: slugify(title),
    takeaways,
    approach,
    timeComplexity,
    spaceComplexity,
    sourceSheet,
    createdAt,
    updatedAt,
    sq1,
    sq1Url,
    sq2,
    sq2Url,
    sq3,
    sq3Url,
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

export type StudyResource = {
  id: string;
  title: string;
  filePath: string;
  sizeBytes: number;
  company: string;
  category: string;
  subtopic: string;
  estimatedMinutes: number;
  xpReward: number;
  revisionPriority: "critical" | "high" | "medium" | "low";
};

export function rowToResource(row: SheetRow): StudyResource | null {
  const id = getRowValue(row, ["resource_id", "id"]);
  const title = getRowValue(row, ["title", "name"]);
  if (!id || !title) return null;
  return {
    id,
    title,
    filePath: getRowValue(row, ["file_path", "filepath"]),
    sizeBytes: parseNumber(getRowValue(row, ["size_bytes", "size"]), 0),
    company: getRowValue(row, ["company"]),
    category: getRowValue(row, ["category"]),
    subtopic: getRowValue(row, ["subtopic"]),
    estimatedMinutes: parseNumber(getRowValue(row, ["estimated_minutes", "estimated_time"]), 30),
    xpReward: parseNumber(getRowValue(row, ["xp_reward", "xp"]), 50),
    revisionPriority: (getRowValue(row, ["revision_priority", "priority"]) || "medium") as any,
  };
}
