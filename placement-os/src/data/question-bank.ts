/**
 * @deprecated SEED ONLY — run `npm run sheets:sync` to export to /sheets.
 * Runtime app loads from /sheets via /api/data (never import this in app code).
 */
import type { DSAQuestion, QuestionCategory, TopicLevel } from "@/types";

const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`;
const gfg = (slug: string) => `https://www.geeksforgeeks.org/${slug}/`;
const neet = (path: string) => `https://neetcode.io/problems/${path}`;

function q(
  id: string,
  title: string,
  topicId: string,
  level: TopicLevel,
  category: QuestionCategory,
  difficulty: DSAQuestion["difficulty"],
  leetcodeSlug: string,
  pattern: string,
  companies: string[],
  estimatedMinutes: number,
  interviewFrequency: DSAQuestion["interviewFrequency"],
  revisionPriority: DSAQuestion["revisionPriority"],
  extras?: Partial<DSAQuestion>
): DSAQuestion {
  return {
    id,
    title,
    topicId,
    level,
    category,
    difficulty,
    platform: "LeetCode",
    url: lc(leetcodeSlug),
    altUrl: gfg(leetcodeSlug.replace(/-/g, "-")),
    pattern,
    companies,
    estimatedMinutes,
    interviewFrequency,
    revisionPriority,
    explanationImportance: level >= 3 ? "must" : "recommended",
    ...extras,
  };
}

export const questionBank: DSAQuestion[] = [
  // ========== ARRAYS ==========
  q("arr-l1-1", "Find Maximum Element", "arrays", 1, "beginner", "Easy", "find-maximum-element-in-an-array", "iteration", ["TCS"], 15, "medium", "low"),
  q("arr-l1-2", "Contains Duplicate", "arrays", 1, "easy", "Easy", "contains-duplicate", "hashset", ["Amazon", "Google"], 20, "high", "high"),
  q("arr-l1-3", "Two Sum", "arrays", 1, "easy", "Easy", "two-sum", "hashmap", ["Amazon", "Google", "TCS Digital"], 25, "very-high", "critical", { neetCodeRef: "two-sum" }),
  q("arr-l2-1", "Best Time to Buy and Sell Stock", "arrays", 2, "easy", "Easy", "best-time-to-buy-and-sell-stock", "kadane-variant", ["Microsoft", "Infosys"], 25, "very-high", "critical"),
  q("arr-l2-2", "Product of Array Except Self", "arrays", 2, "medium", "Medium", "product-of-array-except-self", "prefix-suffix", ["Apple", "Adobe"], 35, "high", "high"),
  q("arr-l2-3", "Maximum Subarray", "arrays", 2, "medium", "Medium", "maximum-subarray", "kadane", ["LinkedIn", "Wipro"], 30, "very-high", "critical", { striverRef: "kadanes-algorithm" }),
  q("arr-l3-1", "Merge Intervals", "arrays", 3, "interview", "Medium", "merge-intervals", "sorting", ["Meta", "Capgemini"], 40, "high", "high"),
  q("arr-l3-2", "Rotate Array", "arrays", 3, "interview", "Medium", "rotate-array", "reverse", ["Microsoft"], 35, "high", "medium"),
  q("arr-l4-1", "First Missing Positive", "arrays", 4, "mock", "Hard", "first-missing-positive", "index-marking", ["Google"], 45, "medium", "medium"),
  q("arr-r1", "Two Sum (Revision)", "arrays", 2, "revision", "Easy", "two-sum", "hashmap", ["All"], 15, "very-high", "critical"),

  // ========== STRINGS ==========
  q("str-l1-1", "Valid Palindrome", "strings", 1, "beginner", "Easy", "valid-palindrome", "two-pointer", ["TCS"], 20, "high", "medium"),
  q("str-l1-2", "Valid Anagram", "strings", 1, "easy", "Easy", "valid-anagram", "frequency", ["Cognizant"], 20, "high", "high"),
  q("str-l2-1", "Longest Common Prefix", "strings", 2, "easy", "Easy", "longest-common-prefix", "scan", ["Amazon"], 25, "medium", "medium"),
  q("str-l2-2", "Longest Substring Without Repeating Characters", "strings", 2, "medium", "Medium", "longest-substring-without-repeating-characters", "sliding-window", ["Amazon", "Uber"], 40, "very-high", "critical", { neetCodeRef: "longest-substring-without-repeating-characters" }),
  q("str-l3-1", "Group Anagrams", "strings", 3, "interview", "Medium", "group-anagrams", "hashmap-grouping", ["Bloomberg"], 35, "high", "high"),
  q("str-l3-2", "Encode and Decode Strings", "strings", 3, "interview", "Medium", "encode-and-decode-strings", "design", ["Google"], 40, "medium", "medium"),
  q("str-l4-1", "Minimum Window Substring", "strings", 4, "mock", "Hard", "minimum-window-substring", "sliding-window", ["Facebook"], 50, "high", "high"),

  // ========== HASHMAPS ==========
  q("hm-l1-1", "Ransom Note", "hashmaps", 1, "beginner", "Easy", "ransom-note", "frequency", ["Accenture"], 15, "medium", "low"),
  q("hm-l1-2", "Two Sum", "hashmaps", 1, "easy", "Easy", "two-sum", "complement", ["All"], 20, "very-high", "critical"),
  q("hm-l2-1", "Group Anagrams", "hashmaps", 2, "medium", "Medium", "group-anagrams", "grouping", ["Meta"], 30, "high", "high"),
  q("hm-l2-2", "Top K Frequent Elements", "hashmaps", 2, "medium", "Medium", "top-k-frequent-elements", "bucket-sort", ["Amazon"], 35, "high", "high"),
  q("hm-l3-1", "Longest Consecutive Sequence", "hashmaps", 3, "interview", "Medium", "longest-consecutive-sequence", "hashset", ["Google"], 40, "high", "critical"),
  q("hm-l4-1", "Subarray Sum Equals K", "hashmaps", 4, "mock", "Medium", "subarray-sum-equals-k", "prefix+hashmap", ["Facebook"], 40, "very-high", "critical"),

  // ========== SORTING ==========
  q("sort-l1-1", "Squares of a Sorted Array", "sorting", 1, "beginner", "Easy", "squares-of-a-sorted-array", "two-pointer", ["TCS"], 15, "low", "low"),
  q("sort-l2-1", "Merge Sorted Array", "sorting", 2, "easy", "Easy", "merge-sorted-array", "merge", ["Microsoft"], 25, "high", "medium"),
  q("sort-l2-2", "Sort Colors", "sorting", 2, "medium", "Medium", "sort-colors", "dutch-flag", ["Oracle"], 30, "high", "high"),
  q("sort-l3-1", "Merge Intervals", "sorting", 3, "interview", "Medium", "merge-intervals", "sort", ["Meta"], 35, "high", "high"),
  q("sort-l4-1", "Non-overlapping Intervals", "sorting", 4, "mock", "Medium", "non-overlapping-intervals", "greedy", ["Amazon"], 40, "medium", "medium"),

  // ========== BINARY SEARCH ==========
  q("bs-l1-1", "Binary Search", "binary-search", 1, "beginner", "Easy", "binary-search", "template", ["All"], 20, "very-high", "critical", { neetCodeRef: "binary-search" }),
  q("bs-l2-1", "Search Insert Position", "binary-search", 2, "easy", "Easy", "search-insert-position", "lower-bound", ["TCS"], 20, "high", "medium"),
  q("bs-l2-2", "Find Minimum in Rotated Sorted Array", "binary-search", 2, "medium", "Medium", "find-minimum-in-rotated-sorted-array", "modified-bs", ["Amazon"], 35, "high", "high"),
  q("bs-l3-1", "Search in Rotated Sorted Array", "binary-search", 3, "interview", "Medium", "search-in-rotated-sorted-array", "modified-bs", ["Amazon", "Flipkart"], 40, "very-high", "critical"),
  q("bs-l3-2", "Koko Eating Bananas", "binary-search", 3, "interview", "Medium", "koko-eating-bananas", "search-on-answer", ["Google"], 40, "high", "high"),
  q("bs-l4-1", "Median of Two Sorted Arrays", "binary-search", 4, "mock", "Hard", "median-of-two-sorted-arrays", "partition", ["Google"], 60, "medium", "low"),

  // ========== SLIDING WINDOW ==========
  q("sw-l1-1", "Maximum Average Subarray I", "sliding-window", 1, "beginner", "Easy", "maximum-average-subarray-i", "fixed-window", ["Wipro"], 20, "medium", "medium"),
  q("sw-l2-1", "Longest Substring Without Repeating Characters", "sliding-window", 2, "medium", "Medium", "longest-substring-without-repeating-characters", "variable-window", ["Amazon"], 35, "very-high", "critical"),
  q("sw-l2-2", "Minimum Size Subarray Sum", "sliding-window", 2, "medium", "Medium", "minimum-size-subarray-sum", "variable-window", ["Goldman"], 35, "high", "high"),
  q("sw-l3-1", "Permutation in String", "sliding-window", 3, "interview", "Medium", "permutation-in-string", "fixed-window", ["Microsoft"], 40, "high", "high"),
  q("sw-l4-1", "Minimum Window Substring", "sliding-window", 4, "mock", "Hard", "minimum-window-substring", "variable-window", ["Facebook"], 50, "high", "critical"),

  // ========== TWO POINTER ==========
  q("tp-l1-1", "Valid Palindrome", "two-pointer", 1, "beginner", "Easy", "valid-palindrome", "opposite", ["TCS"], 15, "high", "medium"),
  q("tp-l2-1", "Two Sum II", "two-pointer", 2, "medium", "Medium", "two-sum-ii-input-array-is-sorted", "opposite", ["Amazon"], 25, "high", "high"),
  q("tp-l2-2", "3Sum", "two-pointer", 2, "medium", "Medium", "3sum", "sort+two-pointer", ["Facebook"], 40, "very-high", "critical"),
  q("tp-l3-1", "Container With Most Water", "two-pointer", 3, "interview", "Medium", "container-with-most-water", "opposite", ["Google"], 35, "high", "high"),
  q("tp-l4-1", "Trapping Rain Water", "two-pointer", 4, "mock", "Hard", "trapping-rain-water", "two-pointer", ["Amazon"], 45, "high", "high"),

  // ========== STACK ==========
  q("st-l1-1", "Valid Parentheses", "stack", 1, "beginner", "Easy", "valid-parentheses", "stack", ["TCS", "Accenture"], 20, "very-high", "critical"),
  q("st-l2-1", "Min Stack", "stack", 2, "medium", "Medium", "min-stack", "design", ["Amazon"], 30, "high", "medium"),
  q("st-l2-2", "Evaluate Reverse Polish Notation", "stack", 2, "medium", "Medium", "evaluate-reverse-polish-notation", "stack", ["LinkedIn"], 30, "medium", "medium"),
  q("st-l3-1", "Daily Temperatures", "stack", 3, "interview", "Medium", "daily-temperatures", "monotonic-stack", ["Google"], 35, "high", "high"),
  q("st-l3-2", "Largest Rectangle in Histogram", "stack", 3, "interview", "Hard", "largest-rectangle-in-histogram", "monotonic-stack", ["Google"], 45, "medium", "medium"),
  q("st-l4-1", "Valid Parentheses (Timed)", "stack", 4, "mock", "Easy", "valid-parentheses", "stack", ["All"], 10, "very-high", "critical"),

  // ========== QUEUE ==========
  q("qu-l1-1", "Implement Stack Using Queues", "queue", 1, "beginner", "Easy", "implement-stack-using-queues", "queue", ["Infosys"], 25, "low", "low"),
  q("qu-l2-1", "Number of Recent Calls", "queue", 2, "easy", "Easy", "number-of-recent-calls", "queue", ["Microsoft"], 25, "medium", "medium"),
  q("qu-l2-2", "Binary Tree Level Order Traversal", "queue", 2, "medium", "Medium", "binary-tree-level-order-traversal", "BFS", ["Meta"], 30, "high", "high"),
  q("qu-l3-1", "Sliding Window Maximum", "queue", 3, "interview", "Hard", "sliding-window-maximum", "deque", ["Amazon"], 40, "high", "high"),

  // ========== LINKED LIST ==========
  q("ll-l1-1", "Reverse Linked List", "linked-list", 1, "beginner", "Easy", "reverse-linked-list", "iteration", ["All MNCs"], 20, "very-high", "critical", { neetCodeRef: "reverse-linked-list" }),
  q("ll-l1-2", "Merge Two Sorted Lists", "linked-list", 1, "easy", "Easy", "merge-two-sorted-lists", "dummy-head", ["Microsoft"], 25, "high", "high"),
  q("ll-l2-1", "Linked List Cycle", "linked-list", 2, "easy", "Easy", "linked-list-cycle", "slow-fast", ["Oracle"], 25, "high", "critical"),
  q("ll-l2-2", "Reorder List", "linked-list", 2, "medium", "Medium", "reorder-list", "multi-technique", ["Amazon"], 40, "high", "high"),
  q("ll-l3-1", "Remove Nth Node From End", "linked-list", 3, "interview", "Medium", "remove-nth-node-from-end-of-list", "two-pointer", ["Adobe"], 30, "high", "high"),
  q("ll-l3-2", "Copy List with Random Pointer", "linked-list", 3, "interview", "Medium", "copy-list-with-random-pointer", "hashmap", ["Meta"], 40, "medium", "medium"),
  q("ll-l4-1", "Merge K Sorted Lists", "linked-list", 4, "mock", "Hard", "merge-k-sorted-lists", "heap", ["Google"], 45, "high", "high"),

  // ========== TREES ==========
  q("tr-l1-1", "Maximum Depth of Binary Tree", "trees", 1, "beginner", "Easy", "maximum-depth-of-binary-tree", "DFS", ["Infosys", "Wipro"], 15, "very-high", "critical"),
  q("tr-l1-2", "Invert Binary Tree", "trees", 1, "easy", "Easy", "invert-binary-tree", "recursion", ["Google"], 15, "high", "high"),
  q("tr-l2-1", "Same Tree", "trees", 2, "easy", "Easy", "same-tree", "DFS", ["TCS"], 20, "high", "medium"),
  q("tr-l2-2", "Subtree of Another Tree", "trees", 2, "easy", "Easy", "subtree-of-another-tree", "DFS", ["Amazon"], 25, "high", "medium"),
  q("tr-l2-3", "Binary Tree Level Order Traversal", "trees", 2, "medium", "Medium", "binary-tree-level-order-traversal", "BFS", ["Meta"], 30, "very-high", "critical"),
  q("tr-l3-1", "Validate Binary Search Tree", "trees", 3, "interview", "Medium", "validate-binary-search-tree", "range", ["Amazon"], 35, "high", "high"),
  q("tr-l3-2", "Lowest Common Ancestor of BST", "trees", 3, "interview", "Medium", "lowest-common-ancestor-of-a-binary-search-tree", "BST", ["Microsoft"], 30, "high", "high"),
  q("tr-l4-1", "Serialize and Deserialize Binary Tree", "trees", 4, "mock", "Hard", "serialize-and-deserialize-binary-tree", "BFS/DFS", ["Google"], 50, "medium", "medium"),

  // ========== BST ==========
  q("bst-l1-1", "Search in a Binary Search Tree", "bst", 1, "beginner", "Easy", "search-in-a-binary-search-tree", "BST", ["TCS"], 15, "high", "medium"),
  q("bst-l2-1", "Kth Smallest Element in a BST", "bst", 2, "medium", "Medium", "kth-smallest-element-in-a-bst", "inorder", ["Amazon"], 30, "high", "high"),
  q("bst-l3-1", "Construct Binary Search Tree from Preorder", "bst", 3, "interview", "Medium", "construct-binary-search-tree-from-preorder-traversal", "BST", ["Google"], 35, "medium", "medium"),

  // ========== HEAP ==========
  q("hp-l1-1", "Last Stone Weight", "heap", 1, "beginner", "Easy", "last-stone-weight", "heap", ["Accenture"], 20, "low", "low"),
  q("hp-l2-1", "Kth Largest Element in an Array", "heap", 2, "medium", "Medium", "kth-largest-element-in-an-array", "heap", ["Facebook"], 30, "high", "high"),
  q("hp-l2-2", "Top K Frequent Elements", "heap", 2, "medium", "Medium", "top-k-frequent-elements", "heap", ["Amazon"], 30, "high", "high"),
  q("hp-l3-1", "Find Median from Data Stream", "heap", 3, "interview", "Hard", "find-median-from-data-stream", "two-heaps", ["Google"], 45, "medium", "medium"),

  // ========== BFS/DFS ==========
  q("gd-l1-1", "Max Area of Island", "bfs-dfs", 1, "beginner", "Medium", "max-area-of-island", "DFS-grid", ["Amazon"], 30, "high", "high"),
  q("gd-l2-1", "Clone Graph", "bfs-dfs", 2, "medium", "Medium", "clone-graph", "BFS", ["Meta"], 35, "high", "high"),
  q("gd-l2-2", "Pacific Atlantic Water Flow", "bfs-dfs", 2, "medium", "Medium", "pacific-atlantic-water-flow", "DFS", ["Google"], 40, "medium", "medium"),
  q("gd-l3-1", "Number of Islands", "bfs-dfs", 3, "interview", "Medium", "number-of-islands", "BFS/DFS", ["All"], 30, "very-high", "critical", { neetCodeRef: "number-of-islands" }),
  q("gd-l4-1", "Rotting Oranges", "bfs-dfs", 4, "mock", "Medium", "rotting-oranges", "multi-source-BFS", ["Amazon"], 40, "high", "high"),

  // ========== GREEDY ==========
  q("gr-l1-1", "Assign Cookies", "greedy", 1, "beginner", "Easy", "assign-cookies", "greedy", ["TCS"], 20, "low", "low"),
  q("gr-l2-1", "Jump Game", "greedy", 2, "medium", "Medium", "jump-game", "greedy", ["Amazon"], 30, "high", "high"),
  q("gr-l2-2", "Gas Station", "greedy", 2, "medium", "Medium", "gas-station", "greedy", ["Google"], 35, "medium", "medium"),
  q("gr-l3-1", "Non-overlapping Intervals", "greedy", 3, "interview", "Medium", "non-overlapping-intervals", "intervals", ["Meta"], 35, "high", "high"),

  // ========== GRAPHS ==========
  q("gf-l1-1", "Find if Path Exists in Graph", "graphs", 1, "beginner", "Easy", "find-if-path-exists-in-graph", "BFS", ["Cognizant"], 25, "medium", "medium"),
  q("gf-l2-1", "Course Schedule", "graphs", 2, "medium", "Medium", "course-schedule", "topological-sort", ["Amazon"], 40, "high", "high"),
  q("gf-l3-1", "Number of Connected Components", "graphs", 3, "interview", "Medium", "number-of-connected-components-in-an-undirected-graph", "union-find", ["Google"], 35, "medium", "medium"),
  q("gf-l4-1", "Course Schedule II", "graphs", 4, "mock", "Medium", "course-schedule-ii", "topological-sort", ["Microsoft"], 40, "high", "high"),

  // ========== DP ==========
  q("dp-l1-1", "Climbing Stairs", "dp", 1, "beginner", "Easy", "climbing-stairs", "1d-dp", ["TCS"], 20, "high", "high"),
  q("dp-l2-1", "House Robber", "dp", 2, "medium", "Medium", "house-robber", "1d-dp", ["Amazon"], 30, "high", "high"),
  q("dp-l2-2", "Coin Change", "dp", 2, "medium", "Medium", "coin-change", "unbounded-knapsack", ["Google"], 40, "high", "high"),
  q("dp-l3-1", "Longest Increasing Subsequence", "dp", 3, "interview", "Medium", "longest-increasing-subsequence", "LIS", ["Microsoft"], 40, "medium", "medium"),
  q("dp-l4-1", "Edit Distance", "dp", 4, "mock", "Medium", "edit-distance", "2d-dp", ["Google"], 50, "low", "low"),
];

export const mockTestSets = [
  { id: "mock-1", title: "Placement Warm-up", durationMin: 60, questionIds: ["arr-l1-3", "str-l1-2", "ll-l1-1", "tr-l1-1", "st-l1-1"] },
  { id: "mock-2", title: "Service OA Simulation", durationMin: 90, questionIds: ["arr-l2-3", "bs-l3-1", "tp-l2-2", "hm-l3-1", "tr-l2-3"] },
  { id: "mock-3", title: "Product Interview Mix", durationMin: 90, questionIds: ["sw-l2-2", "ll-l3-2", "hp-l2-1", "gd-l3-1", "str-l4-1"] },
];

export function getQuestionsByTopic(topicId: string) {
  return questionBank.filter((q) => q.topicId === topicId);
}

export function getQuestionsByLevel(topicId: string, level: TopicLevel) {
  return questionBank.filter((q) => q.topicId === topicId && q.level === level);
}

export function getQuestionById(id: string) {
  return questionBank.find((q) => q.id === id);
}
