export type Question = {
  id: string;
  name: string;
  platform: "LeetCode" | "GFG" | "CodeStudio" | "InterviewBit";
  difficulty: "Easy" | "Medium" | "Hard";
  topicId: string;
  pattern: string;
  whyImportant: string;
  companies: string[];
  tier: "core" | "interview" | "revision";
};

export const dsaQuestions: Question[] = [
  // Arrays - Easy
  { id: "a1", name: "Two Sum", platform: "LeetCode", difficulty: "Easy", topicId: "arrays", pattern: "hashmap", whyImportant: "Foundational hashmap pattern", companies: ["Amazon", "Google", "TCS Digital"], tier: "core" },
  { id: "a2", name: "Best Time to Buy and Sell Stock", platform: "LeetCode", difficulty: "Easy", topicId: "arrays", pattern: "kadane-variant", whyImportant: "Single-pass optimization", companies: ["Microsoft", "Infosys"], tier: "core" },
  { id: "a3", name: "Maximum Subarray", platform: "LeetCode", difficulty: "Medium", topicId: "arrays", pattern: "kadane", whyImportant: "Classic Kadane—interview staple", companies: ["LinkedIn", "Wipro"], tier: "interview" },
  { id: "a4", name: "Product of Array Except Self", platform: "LeetCode", difficulty: "Medium", topicId: "arrays", pattern: "prefix-suffix", whyImportant: "Prefix thinking without division", companies: ["Apple", "Adobe"], tier: "interview" },
  { id: "a5", name: "Merge Intervals", platform: "LeetCode", difficulty: "Medium", topicId: "arrays", pattern: "sorting", whyImportant: "Interval pattern for OA", companies: ["Facebook", "Capgemini"], tier: "interview" },
  // Strings
  { id: "s1", name: "Valid Anagram", platform: "LeetCode", difficulty: "Easy", topicId: "strings", pattern: "frequency", whyImportant: "Frequency map warmup", companies: ["TCS", "Cognizant"], tier: "core" },
  { id: "s2", name: "Longest Substring Without Repeating Characters", platform: "LeetCode", difficulty: "Medium", topicId: "strings", pattern: "sliding-window", whyImportant: "Top sliding window problem", companies: ["Amazon", "Uber"], tier: "interview" },
  { id: "s3", name: "Group Anagrams", platform: "LeetCode", difficulty: "Medium", topicId: "strings", pattern: "hashmap-grouping", whyImportant: "Grouping pattern", companies: ["Bloomberg"], tier: "revision" },
  // Linked List
  { id: "l1", name: "Reverse Linked List", platform: "LeetCode", difficulty: "Easy", topicId: "linked-list", pattern: "iteration", whyImportant: "Must-write from memory", companies: ["All service MNCs"], tier: "core" },
  { id: "l2", name: "Merge Two Sorted Lists", platform: "LeetCode", difficulty: "Easy", topicId: "linked-list", pattern: "dummy-head", whyImportant: "Dummy node pattern", companies: ["Microsoft"], tier: "core" },
  { id: "l3", name: "Linked List Cycle", platform: "LeetCode", difficulty: "Easy", topicId: "linked-list", pattern: "slow-fast", whyImportant: "Floyd algorithm", companies: ["Oracle"], tier: "interview" },
  { id: "l4", name: "Reorder List", platform: "LeetCode", difficulty: "Medium", topicId: "linked-list", pattern: "multi-technique", whyImportant: "Combines reverse + merge", companies: ["Amazon"], tier: "revision" },
  // Trees
  { id: "t1", name: "Maximum Depth of Binary Tree", platform: "LeetCode", difficulty: "Easy", topicId: "trees", pattern: "DFS", whyImportant: "Tree DFS baseline", companies: ["Infosys", "Wipro"], tier: "core" },
  { id: "t2", name: "Invert Binary Tree", platform: "LeetCode", difficulty: "Easy", topicId: "trees", pattern: "recursion", whyImportant: "Simple recursive tree", companies: ["Google"], tier: "core" },
  { id: "t3", name: "Level Order Traversal", platform: "LeetCode", difficulty: "Medium", topicId: "trees", pattern: "BFS", whyImportant: "Queue BFS template", companies: ["Meta", "Adobe"], tier: "interview" },
  { id: "t4", name: "Lowest Common Ancestor of BST", platform: "LeetCode", difficulty: "Medium", topicId: "bst", pattern: "BST property", whyImportant: "BST interview classic", companies: ["Microsoft"], tier: "interview" },
  // Stack / Binary Search
  { id: "st1", name: "Valid Parentheses", platform: "LeetCode", difficulty: "Easy", topicId: "stack", pattern: "stack", whyImportant: "Stack basics", companies: ["TCS", "Accenture"], tier: "core" },
  { id: "bs1", name: "Binary Search", platform: "LeetCode", difficulty: "Easy", topicId: "binary-search", pattern: "template", whyImportant: "Template mastery", companies: ["All"], tier: "core" },
  { id: "bs2", name: "Search in Rotated Sorted Array", platform: "LeetCode", difficulty: "Medium", topicId: "binary-search", pattern: "modified-bs", whyImportant: "Common OA twist", companies: ["Amazon", "Flipkart"], tier: "interview" },
  // Two pointer / sliding
  { id: "tp1", name: "3Sum", platform: "LeetCode", difficulty: "Medium", topicId: "two-pointer", pattern: "sort+two-pointer", whyImportant: "Extension of two sum", companies: ["Facebook"], tier: "interview" },
  { id: "sw1", name: "Minimum Size Subarray Sum", platform: "LeetCode", difficulty: "Medium", topicId: "sliding-window", pattern: "variable-window", whyImportant: "Variable window template", companies: ["Goldman"], tier: "revision" },
];

export const weeklyPlan = [
  { week: 1, focus: "Arrays + HashMap", days: ["Two Sum", "Best Time...", "Valid Anagram", "Max Subarray", "Revision"], hours: "1.5h/day" },
  { week: 2, focus: "Two Pointer + Sliding Window", days: ["3Sum prep", "Longest Substring", "Min Size Subarray", "Merge Intervals", "Mock 5 easy"], hours: "1.5h/day" },
  { week: 3, focus: "Linked List + Stack", days: ["Reverse LL", "Cycle", "Valid Parentheses", "Reorder List", "Revision"], hours: "1.5h/day" },
  { week: 4, focus: "Trees + BFS", days: ["Max Depth", "Invert", "Level Order", "LCA BST", "Checkpoint mock"], hours: "2h/day" },
  { week: 5, focus: "Binary Search + Prefix", days: ["BS template", "Rotated Array", "Product Except Self", "Prefix drills", "Revision"], hours: "1.5h/day" },
  { week:  6, focus: "Consolidation", days: ["Weak topic replay", "2 mediums/day", "Aptitude parallel", "Project polish", "Rest day"], hours: "1.5h/day" },
];

export const revisionCycles = [
  { cycle: "Daily", action: "1 easy warm-up (10 min) + 1 new or medium (35 min)" },
  { cycle: "Weekly", action: "Sunday: redo 3 marked 'shaky' problems without hints" },
  { cycle: "Bi-weekly", action: "Timed 60-min mock: 2 easy + 1 medium" },
  { cycle: "Monthly", action: "Full weak-topic audit from Placement OS analytics" },
];
