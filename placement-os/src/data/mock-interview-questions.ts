export interface MockQuestion {
  id: string;
  category: "dsa" | "hr" | "frontend" | "project";
  title: string;
  questionText: string;
  tips: string[];
  rubric: string[];
  bruteForce?: string;
  optimal?: string;
  complexity?: string;
}

export const mockQuestionsData: MockQuestion[] = [
  // ─── DSA ROUND QUESTIONS ──────────────────────────────────────────
  {
    id: "dsa-1",
    category: "dsa",
    title: "Merge Intervals",
    questionText: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    tips: [
      "Ask if the input intervals are sorted first.",
      "Sort the intervals by their start times to simplify the overlap checks.",
      "Consider how an interval can overlap: if the current start is less than or equal to the previous end."
    ],
    rubric: [
      "Initial clarification of input constraints (sorted status, empty array handling).",
      "Correct sorting logic based on start times (O(N log N) time complexity).",
      "Correct linear scan to merge intervals in-place or into a result array.",
      "Explanation of space complexity: O(N) or O(log N) depending on the sorting algorithm."
    ],
    bruteForce: "Compare every interval with every other interval. If they overlap, merge them and repeat. This takes O(N^2) or O(N^3) time because we might need multiple passes to merge all overlapping intervals.",
    optimal: "Sort the intervals by their start times. Iterate through the sorted intervals, keeping track of the merged intervals in a result array. For each interval, if the result list is empty or the current interval's start is greater than the previous interval's end, append it. Otherwise, they overlap; merge them by updating the previous interval's end to the maximum of its current end and the current interval's end.",
    complexity: "Time Complexity: O(N log N) where N is the number of intervals, due to the sorting step. The scan itself takes linear O(N) time.\nSpace Complexity: O(N) or O(log N) depending on the sorting algorithm used (auxiliary space for sorting or result array)."
  },
  {
    id: "dsa-2",
    category: "dsa",
    title: "Subarray Sum Equals K",
    questionText: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. A subarray is a contiguous non-empty sequence of elements within an array.",
    tips: [
      "A brute force solution takes O(N^2) time. Can you optimize this to O(N) using extra space?",
      "Think about prefix sums. If the prefix sum up to index i is S_i, we want to find how many prefix sums S_j (j < i) satisfy S_i - S_j = k.",
      "Use a hash map to store the frequencies of prefix sums encountered so far."
    ],
    rubric: [
      "Mentions brute force and identifies its O(N^2) limitation.",
      "Explains the prefix sum mathematical relationship: prefixSum - k.",
      "Correct implementation using a HashMap initialized with {0: 1}.",
      "Accurate time complexity analysis: O(N) time and O(N) space."
    ],
    bruteForce: "Check all possible subarrays (using two nested loops to represent starting and ending indices). Calculate the sum of elements for each subarray and check if it equals K. This requires O(N^2) time and O(1) space.",
    optimal: "Use a prefix sum and a hash map. As we traverse the array, maintain the running prefix sum. If (prefixSum - K) exists in our hash map, it means there are subarrays ending at the current index that sum to K. Add the frequency of (prefixSum - K) to our total count. Update the hash map with the current prefix sum's frequency.",
    complexity: "Time Complexity: O(N) since we perform a single pass through the array and map lookups/inserts are O(1) on average.\nSpace Complexity: O(N) to store the prefix sums in the hash map in the worst case (all prefix sums are unique)."
  },
  {
    id: "dsa-3",
    category: "dsa",
    title: "Lowest Common Ancestor of a Binary Tree",
    questionText: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q in the tree. According to the definition of LCA on Wikipedia: 'The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants.'",
    tips: [
      "What are the base cases? If root is null, or if root is p or q, we return root.",
      "Recurse into the left and right subtrees. What do the return values represent?",
      "If both recursions return non-null, what does that mean about the current root?"
    ],
    rubric: [
      "Identifies DFS/recursion as the primary traversal technique.",
      "Handles base cases correctly (returns root if matches p or q, or null).",
      "Combines results from left and right subtree calls to determine if current node is LCA.",
      "Analyzes complexity: O(N) time where N is nodes, O(H) space where H is height."
    ],
    bruteForce: "Find the paths from the root node to p and q. Store these paths in list/array structures. Compare the paths from the beginning and find the last node that is common to both paths. This requires O(N) time and O(N) space.",
    optimal: "Traverse the tree recursively bottom-up (Post-order traversal). If the current node is null, or if it is p or q, return the current node. Recurse into the left and right subtrees. If both recursive calls return a non-null node, it means p is in one subtree and q is in the other, so the current node is the LCA. If only one call returns non-null, return that non-null result (which propagates the found node upwards).",
    complexity: "Time Complexity: O(N) in the worst case where we visit all nodes of the tree.\nSpace Complexity: O(H) where H is the height of the binary tree, representing the recursion stack. In the worst case of a skewed tree, this is O(N)."
  },
  {
    id: "dsa-4",
    category: "dsa",
    title: "Longest Substring Without Repeating Characters",
    questionText: "Given a string s, find the length of the longest substring without repeating characters.",
    tips: [
      "Use a sliding window approach with two pointers (left and right).",
      "Use a set or map to store characters currently in the window to detect duplicates.",
      "When a duplicate is found, shrink the window from the left until the duplicate is removed."
    ],
    rubric: [
      "Explains sliding window concept clearly.",
      "Maintains correct character frequency/existence collection (Set or Hash Map).",
      "Correctly updates left pointer on encountering duplicate characters.",
      "Derives O(N) time complexity and O(min(M, A)) space complexity (where A is alphabet size)."
    ],
    bruteForce: "Check all possible substrings of string s. For each substring, check if all characters are unique. This takes O(N^3) time by checking O(N^2) substrings and scanning each in O(N) time.",
    optimal: "Use a sliding window with two pointers (left and right). Maintain a map of characters to their last seen index. As the right pointer moves, if the character is already in the window (its last seen index is >= left), update the left pointer to `lastSeenIndex + 1`. Calculate the maximum length of the window (`right - left + 1`) at each step and update the map with the right pointer's index.",
    complexity: "Time Complexity: O(N) where N is the length of the string, since both left and right pointers traverse the string at most once.\nSpace Complexity: O(min(N, M)) where M is the character set size (e.g. 26 for English alphabet, 128 for ASCII) for the index map."
  },
  {
    id: "dsa-5",
    category: "dsa",
    title: "Top K Frequent Elements",
    questionText: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    tips: [
      "First count frequencies using a hash map.",
      "How can you extract the top k? Consider using a Min-Heap or Bucket Sort.",
      "Bucket sort can achieve O(N) time complexity since frequencies are bounded by array length."
    ],
    rubric: [
      "Correct frequency counting step using Map.",
      "Proposes Heap-based O(N log K) or Bucket Sort-based O(N) solution.",
      "Implements selection/sorting algorithm correctly without off-by-one errors.",
      "Explains time/space tradeoffs of chosen data structures."
    ],
    bruteForce: "Count the frequency of each element using a hash map. Store the elements and their frequencies in a list, sort the list by frequency in descending order, and return the first K elements. This takes O(N log N) time due to sorting.",
    optimal: "Count element frequencies using a hash map. Use Bucket Sort: create an array of lists (buckets) where the index represents the frequency (max frequency is N). Put each element into the bucket corresponding to its frequency. Traverse the buckets from right (highest frequency) to left and collect K elements. Alternatively, insert elements into a Min-Heap of size K, which takes O(N log K) time.",
    complexity: "Time Complexity: O(N) using Bucket Sort, or O(N log K) using a Min-Heap of size K.\nSpace Complexity: O(N) to store frequencies in the hash map and the bucket arrays or the heap."
  },

  // ─── HR ROUND QUESTIONS ───────────────────────────────────────────
  {
    id: "hr-1",
    category: "hr",
    title: "Tell Me About Yourself",
    questionText: "Walk me through your background, technical interests, and why you are interested in this position.",
    tips: [
      "Use the Present-Past-Future structure.",
      "Keep it under 2 minutes. Focus on key achievements rather than reciting your resume.",
      "Align your future goals with the role and company you are interviewing for."
    ],
    rubric: [
      "Has a logical flow (Present status → Past projects/internships → Future ambition).",
      "Highlights relevant technical highlights/skills instead of unrelated personal details.",
      "Demonstrates high energy, clarity, and specific motivation for this target role.",
      "Avoids ramblings or reading verbatim off a script."
    ]
  },
  {
    id: "hr-2",
    category: "hr",
    title: "Describe a Conflict & Resolution",
    questionText: "Tell me about a time you had a conflict or disagreement with a team member during a project. How did you resolve it?",
    tips: [
      "Use the STAR method (Situation, Task, Action, Result).",
      "Keep the tone professional. Do not badmouth your teammate.",
      "Focus on collaboration, communication, and reaching a compromise that benefited the project."
    ],
    rubric: [
      "Clearly states the technical or workflow context (Situation).",
      "Explains the different opinions objectively without casting blame (Task).",
      "Details positive interpersonal steps taken to resolve it, e.g. 1-on-1 discussion, data-driven tests (Action).",
      "Highlights positive outcomes and what they learned from the situation (Result)."
    ]
  },
  {
    id: "hr-3",
    category: "hr",
    title: "Your Greatest Failure",
    questionText: "Describe a situation where you failed, missed a deadline, or made a major technical mistake. What did you do, and what did you learn?",
    tips: [
      "Choose a real failure, but not one that displays a total lack of integrity or competence.",
      "Focus 70% of your time on the aftermath, reflection, and steps you took to correct it and prevent it from happening again.",
      "Demonstrate vulnerability and growth mindset."
    ],
    rubric: [
      "Owns up to the mistake clearly without blaming others or making excuses.",
      "Details immediate mitigation steps taken (taking responsibility).",
      "Explains long-term procedural changes or lessons incorporated into subsequent work.",
      "Shows a constructive, professional takeaway."
    ]
  },
  {
    id: "hr-4",
    category: "hr",
    title: "Why Our Company?",
    questionText: "Why are you interested in joining our company? What aspects of our product, culture, or tech stack resonate with you?",
    tips: [
      "Research the company's recent news, product launches, or values.",
      "Connect your personal passions or technical interests to the company's domain.",
      "Avoid generic answers like 'you are a fast-growing company'—be highly specific."
    ],
    rubric: [
      "Quotes specific products, initiatives, or engineering blogs from the company.",
      "Aligns company values/engineering practices with their own career interests.",
      "Expresses genuine enthusiasm that shows they did homework before the call.",
      "Explains how they expect to contribute specifically to the business goals."
    ]
  },
  {
    id: "hr-5",
    category: "hr",
    title: "Tell Me About a Time You Led a Team",
    questionText: "Describe a project or situation where you took the lead or initiative to guide others. What was the impact?",
    tips: [
      "Leadership doesn't require a formal title. It can mean taking ownership when a gap is identified.",
      "Focus on delegation, supporting others, and tracking progress.",
      "Quantify the results if possible (e.g., completed 2 days early, reduced latency by 30%)."
    ],
    rubric: [
      "Defines the leadership gap or opportunity they stepped into.",
      "Explains how they coordinated efforts, resolved bottlenecks, or encouraged team members.",
      "Avoids taking 100% of the credit; praises team efforts while highlighting personal initiative.",
      "Shares quantifiable or positive qualitative results."
    ]
  },

  // ─── FRONTEND ROUND QUESTIONS ────────────────────────────────────
  {
    id: "fe-1",
    category: "frontend",
    title: "Build a Debounced Search Input",
    questionText: "Explain how you would build a debounced search query input in React. How does it optimize performance, and how would you implement the debouncing logic?",
    tips: [
      "Explain the difference between throttle and debounce.",
      "Discuss cleanups in useEffect to clear active timeouts when query or component unmounts.",
      "Mention using useRef to keep track of the timer ID across renders."
    ],
    rubric: [
      "Correctly distinguishes debouncing (wait until typing pauses) from throttling (limit execution rate).",
      "Explains React custom hook or useEffect cleanup mechanics (returns cleanup function).",
      "Demonstrates awareness of memory leaks when timers are left hanging.",
      "Drafts pseudo-code or react state logic using setTimeout/clearTimeout."
    ]
  },
  {
    id: "fe-2",
    category: "frontend",
    title: "React State Management: Context vs Zustand",
    questionText: "When would you use React Context API vs an external state manager like Zustand or Redux? Compare them on performance, code complexity, and use cases.",
    tips: [
      "React Context triggers a re-render on all consumers when the context value changes. How does Zustand mitigate this?",
      "Mention that Zustand uses selectors to subscribe components to specific parts of the state tree.",
      "Context is ideal for low-frequency updates (e.g., themes, auth); external state is better for high-frequency or complex updates."
    ],
    rubric: [
      "Identifies re-render issues in React Context for deep trees or frequent updates.",
      "Explains selector-based subscriptions in Zustand or Redux.",
      "Compares boilerplate code and setup complexity (Zustand is minimal, Redux is high).",
      "Offers logical architectural recommendations for standard SaaS applications."
    ]
  },
  {
    id: "fe-3",
    category: "frontend",
    title: "Optimizing React App Performance",
    questionText: "Imagine your dashboard page is lagging. What techniques, tools, and profiling steps would you take to diagnose and optimize the React web application?",
    tips: [
      "Use Chrome DevTools Performance tab and React DevTools Profiler to locate slow renders.",
      "Discuss code-splitting, lazy loading of routes/components.",
      "Mention optimizing heavy lists using virtualization (e.g., react-window) and avoiding inline functions/objects as props."
    ],
    rubric: [
      "Identifies specific diagnostic tools (React DevTools Profiler, Lighthouse, Flamegraphs).",
      "Mentions rendering optimizations: React.memo, useMemo, useCallback (and explains when NOT to use them).",
      "Suggests layout optimizations: Virtualized lists, content-visibility CSS, dynamic loading.",
      "Covers network optimizations: Asset compression, CDN caching, next/image optimization."
    ]
  },
  {
    id: "fe-4",
    category: "frontend",
    title: "Implement a Custom useFetch Hook",
    questionText: "How would you design a robust custom React hook called useFetch that handles loading state, error boundaries, request cancellation (AbortController), and caching?",
    tips: [
      "Use AbortController to cancel active HTTP requests when inputs change or component unmounts.",
      "Manage loading, data, and error states using useReducer or useState.",
      "How would you implement a simple in-memory cache to prevent redundant fetches?"
    ],
    rubric: [
      "Structures the custom hook return value: { data, loading, error }.",
      "Correctly handles AbortController cancellation inside cleanup.",
      "Avoids race conditions where an older network request resolves after a newer one.",
      "Shows structured error handling (rejecting on non-ok HTTP status codes)."
    ]
  },
  {
    id: "fe-5",
    category: "frontend",
    title: "CSS Grid vs Flexbox Layout Tradeoffs",
    questionText: "Compare CSS Grid and CSS Flexbox. When should you use which? Walk through how you would build a responsive dashboard layout with a collapsible sidebar.",
    tips: [
      "Flexbox is one-dimensional (row or column); Grid is two-dimensional (rows and columns simultaneously).",
      "Grid is excellent for full-page structures, card walls, or overlapping elements.",
      "Flexbox is ideal for aligning content inside headers, navigations, or simple inline groupings."
    ],
    rubric: [
      "Differentiates 1D vs 2D layout systems clearly.",
      "Details how they would set up sidebar/main layout (e.g. grid-template-columns with auto/fr).",
      "Covers responsiveness using media queries or CSS variables.",
      "Mentions accessibility (order of DOM nodes vs visual order in Grid/Flex)."
    ]
  },

  // ─── PROJECT DEEP DIVE ROUND QUESTIONS ─────────────────────────────
  {
    id: "proj-1",
    category: "project",
    title: "Architecture & Tradeoffs",
    questionText: "Choose one of your major projects (e.g., Anony Talk or HireLens). Draw/explain the system architecture, component stack, and explain the key technical tradeoffs you made.",
    tips: [
      "Start with a high-level overview: client, api gateway, servers, databases, third-party APIs.",
      "Explain a trade-off: e.g., 'I chose Supabase for rapid prototyping over a custom Node/Express API, sacrificing fine-grained server-level customization but gaining real-time sync out-of-the-box.'",
      "Explain the data flow for a typical user request."
    ],
    rubric: [
      "Presents a clear tier separation (Frontend, Backend, DB, API layer).",
      "Articulates a clear technical tradeoff with logical business/engineering rationale.",
      "Traces data flow correctly, indicating protocol details (HTTPS, WebSockets, etc.).",
      "Displays deep understanding of why specific technologies were selected."
    ]
  },
  {
    id: "proj-2",
    category: "project",
    title: "Securing Auth and Sensitive Data",
    questionText: "How did you secure your application? Walk through how user sessions, database interactions, JWTs, and API credentials are kept safe from threats.",
    tips: [
      "Discuss HTTPS, environment variables (.env files), and securing keys on the server instead of exposing them to the client.",
      "Mention Row Level Security (RLS) in databases to ensure users can only CRUD their own records.",
      "Explain how passwords or tokens are hashed/stored (e.g., bcrypt, supabase authentication)."
    ],
    rubric: [
      "Highlights difference between server-side secrets vs client-side variables.",
      "Explains database authorization controls (e.g., RLS, parameterized queries to prevent SQLi).",
      "Details token storage options (HTTP-only cookies vs localStorage tradeoffs).",
      "Covers CORS settings and basic threat models (XSS, CSRF mitigation)."
    ]
  },
  {
    id: "proj-3",
    category: "project",
    title: "The Hardest Debugging Journey",
    questionText: "Describe the most challenging technical bug or performance bottleneck you encountered in your project. How did you identify, isolate, and solve it?",
    tips: [
      "Don't pick a simple typo. Pick something involving race conditions, memory leaks, state syncing, or scale bottlenecks.",
      "Walk through your step-by-step diagnostic process: logs, debuggers, isolation tests, hypotheses tested.",
      "Highlight the resolution and the safeguards you put in place afterwards."
    ],
    rubric: [
      "Explains a complex technical issue (not a trivial syntax fix).",
      "Details a systematic debugging process (log correlation, tracing, isolation tests).",
      "Explains the underlying root cause of the bug accurately.",
      "Discusses post-incident prevention (unit tests, regression guards, alert logs)."
    ]
  },
  {
    id: "proj-4",
    category: "project",
    title: "Scaling to 100k Active Users",
    questionText: "If your project gained viral adoption and grew to 100,000 daily active users, where would the architecture break? How would you scale the database, backend, and frontend?",
    tips: [
      "Identify bottlenecks: database locks, server CPU, state sync limits, heavy API routes.",
      "Propose scaling solutions: Database indexing, read-replicas, caching with Redis, load balancers, serverless edge functions.",
      "Mention static assets CDN caching and frontend bundle optimization."
    ],
    rubric: [
      "Pinpoints real scaling limits (database connection pooling, slow queries, single-point-of-failure servers).",
      "Proposes multi-tier caching strategy (browser, CDN, Redis).",
      "Discusses database scaling (indexing, replication, sharding, or moving to NoSQL where appropriate).",
      "Addresses infrastructure scaling (auto-scaling groups, containerization, serverless)."
    ]
  },
  {
    id: "proj-5",
    category: "project",
    title: "Database Design & Normalization Decisions",
    questionText: "Explain your database schema design. Why did you choose relational (PostgreSQL) vs non-relational (MongoDB)? How did you design table relationships and ensure data consistency?",
    tips: [
      "Explain the data structure: relational (highly structured, strict consistency) vs document (flexibility, nested documents).",
      "Discuss normalization levels: 1NF, 2NF, 3NF. When did you intentionally de-normalize data for read optimization (using JSONB fields)?",
      "Mention transactional safety (ACID compliance) and query performance indices."
    ],
    rubric: [
      "Defines tabular relationships (1-to-many, many-to-many join tables).",
      "Explains choices between Postgres/NoSQL for their specific domain models.",
      "Justifies de-normalization decisions (e.g. storing milestones as JSONB in countdown goals).",
      "Shows awareness of index selection for foreign keys and frequently queried fields."
    ]
  }
];
