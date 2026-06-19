import json
import os

# Define the canonical topics list
CANONICAL_TOPICS = [
    "Arrays", "Strings", "Linked Lists", "Stacks", "Queues", "Recursion",
    "Searching", "Sorting", "Hashing", "Trees", "BST", "Heaps", "Graphs",
    "Dynamic Programming", "Greedy", "Bit Manipulation", "Backtracking",
    "Sliding Window", "Two Pointers", "Binary Search", "Tries", "Segment Trees",
    "DSU", "Miscellaneous"
]

# Topic mapping from docx topics to canonical ones
TOPIC_MAPPING = {
    "Binary Tree": "Trees",
    "AVL Tree": "Trees",
    "Red-Black Tree": "Trees",
    "BST": "BST",
    "Trie": "Tries",
    "Segment Tree": "Segment Trees",
    "DSU": "DSU",
    "Dynamic Programming": "Dynamic Programming",
    "Recursion": "Recursion",
    # Graph-related
    "Graphs": "Graphs",
    "BFS": "Graphs",
    "DFS": "Graphs",
    "Tarjan": "Graphs",
    "Dijkstra": "Graphs",
    "Topological Sort": "Graphs",
    # Internals/Language specific
    "C++ Internals": "Miscellaneous",
    "Java Internals": "Miscellaneous",
    "C Internals": "Miscellaneous"
}

def determine_difficulty(q):
    """
    Classify difficulty into Easy, Medium, or Hard based on the topic and title/scenario keywords
    """
    title = q.get('title', '').lower()
    scenario = q.get('scenario', '').lower()
    code = q.get('code', '').lower()
    topic = q.get('topic', '')

    # Hard concepts
    hard_keywords = [
        "lazy propagation", "tarjan", "strongly connected", "avl rotation", 
        "red-black", "segment tree query", "path-compress", "amortized",
        "worst-case behavior", "strict aliasing", "threadlocal", "atomic",
        "double-checked lock", "jit inlining", "metaspace", "volatile"
    ]
    
    # Easy concepts
    easy_keywords = [
        "pre-order", "post-order", "in-order", "preorder", "postorder", "inorder",
        "height", "bfs space", "bfs level-order", "trie insert", "range sum query",
        "sizeof", "getchar()", "basic", "what is"
    ]

    for kw in hard_keywords:
        if kw in title or kw in scenario or kw in code:
            return "Hard"
            
    if topic in ["Segment Tree", "DSU", "Tarjan", "AVL Tree", "Red-Black Tree"]:
        return "Hard"
        
    for kw in easy_keywords:
        if kw in title or kw in scenario or kw in code:
            return "Easy"
            
    # Default is Medium
    return "Medium"

def load_docx_questions():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, '..', 'src', 'data', 'mcq-questions.json')
    if not os.path.exists(json_path):
        print(f"Error: {json_path} does not exist. Run parse_mcqs.py first.")
        return []
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# High-quality supplemental questions to expand dataset (approx 100 questions covering weak areas)
SUPPLEMENTAL_QUESTIONS = [
    # --- ARRAYS (10 questions) ---
    {
        "title": "Amazon OA: Maximum Subarray Sum with Min Element constraint",
        "scenario": "You need to find the maximum sum of a contiguous subarray such that the minimum element in the subarray is greater than a given threshold. What is the optimal time complexity to solve this problem?",
        "code": "int maxSubarraySumWithMinConstraint(vector<int>& arr, int threshold);",
        "options": [
            "A) O(N^2) using a nested search",
            "B) O(N log N) using a segment tree or divide and conquer",
            "C) O(N) using a monotonic stack or sliding window",
            "D) O(N^2 log N) using sorting and binary search"
        ],
        "answer": "C",
        "explanation": "By using a monotonic stack or a two-pointer sliding window technique, we can find the boundaries where each element acts as the minimum and compute the subarray sums in linear O(N) time.",
        "topic": "Arrays",
        "difficulty": "Hard",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Maximum Product Subarray Edge Case",
        "scenario": "What is the worst-case space complexity of the optimal O(N) time complexity algorithm for finding the Maximum Product Subarray?",
        "code": "",
        "options": [
            "A) O(N) to store prefix and suffix products",
            "B) O(1) auxiliary space by maintaining current max, current min, and global max",
            "C) O(log N) for the recursive call stack",
            "D) O(N) to construct a suffix array"
        ],
        "answer": "B",
        "explanation": "The maximum product subarray can be tracked in O(N) time and O(1) space by maintaining dynamic running maximum and minimum products at each position to handle negative numbers.",
        "topic": "Arrays",
        "difficulty": "Medium",
        "companyRelevance": ["Microsoft", "Adobe"]
    },
    {
        "title": "Walmart OA: K-th Smallest Element in a Sorted Matrix",
        "scenario": "For an N x N matrix where each row and column is sorted in ascending order, which approach achieves the best time complexity to find the K-th smallest element?",
        "code": "",
        "options": [
            "A) Flattening and sorting the array in O(N^2 log N)",
            "B) Min-Heap of size N in O(K log N) time",
            "C) Binary search on the value range in O(N log(Max - Min)) time",
            "D) Both B and C are valid, but C is optimal when K is close to N^2"
        ],
        "answer": "D",
        "explanation": "Binary search on the value range is highly efficient, taking O(N log(Max-Min)) time. For large matrices and large K, binary search outperforms min-heap insertion.",
        "topic": "Arrays",
        "difficulty": "Hard",
        "companyRelevance": ["Walmart"]
    },
    {
        "title": "Dutch National Flag Algorithm Complexity",
        "scenario": "To sort an array of 0s, 1s, and 2s in-place in a single pass, the Dutch National Flag algorithm uses three pointers. What is the maximum number of swaps performed for an array of size N?",
        "code": "",
        "options": [
            "A) N swaps",
            "B) 2N swaps",
            "C) N/2 swaps",
            "D) N - 1 swaps"
        ],
        "answer": "A",
        "explanation": "In the worst case (e.g., all 2s followed by all 0s), the mid pointer traverses the array once, performing at most N swaps to place elements in their correct partitions.",
        "topic": "Arrays",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Microsoft"]
    },
    {
        "title": "In-place Array Rotation",
        "scenario": "To rotate an array of size N right by K steps, we can reverse three subsegments: the whole array, the first K elements, and the remaining N-K elements. What is the exact number of element copy/swap operations performed?",
        "code": "",
        "options": [
            "A) N operations",
            "B) 2N operations",
            "C) 3N/2 operations",
            "D) N + K operations"
        ],
        "answer": "B",
        "explanation": "Each element is swapped twice during the three reversal phases, resulting in approximately 2N element movements overall, with O(1) extra space.",
        "topic": "Arrays",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Adobe OA: Next Permutation Algorithm",
        "scenario": "Which of the following describes the correct order of operations in the Next Permutation algorithm?",
        "code": "",
        "options": [
            "A) Sort the array, find the pivot, and swap",
            "B) Find the first decreasing element from the right, find the next larger element, swap them, and reverse the suffix",
            "C) Reverse the entire array, swap the first two elements, and sort",
            "D) Binary search the pivot, insert at beginning, and shift elements"
        ],
        "answer": "B",
        "explanation": "Next Permutation finds the first index i from right where arr[i] < arr[i+1] (pivot). Then finds the smallest element greater than arr[i] to its right, swaps them, and reverses the suffix starting at i+1.",
        "topic": "Arrays",
        "difficulty": "Medium",
        "companyRelevance": ["Adobe", "Microsoft"]
    },
    {
        "title": "Microsoft OA: Majority Element II (Boyer-Moore)",
        "scenario": "Boyer-Moore Majority Vote algorithm is extended to find elements that appear more than floor(N/3) times. What is the maximum number of candidates maintained by the algorithm?",
        "code": "",
        "options": [
            "A) 1 candidate",
            "B) 2 candidates",
            "C) 3 candidates",
            "D) log N candidates"
        ],
        "answer": "B",
        "explanation": "There can be at most 2 elements in an array that appear more than N/3 times. Hence, Boyer-Moore keeps at most 2 candidates and 2 counters in O(N) time and O(1) space.",
        "topic": "Arrays",
        "difficulty": "Hard",
        "companyRelevance": ["Microsoft"]
    },
    {
        "title": "Grid Unique Paths with Obstacles",
        "scenario": "For an M x N grid with obstacles, you want to find unique paths from top-left to bottom-right. If we optimize space to use a single 1D array of size N, what is the transition relation?",
        "code": "dp[j] = dp[j] + dp[j-1];",
        "options": [
            "A) Only if grid[i][j] is free, otherwise dp[j] = 0",
            "B) dp[j] = dp[j-1] regardless of grid[i][j]",
            "C) dp[j] = dp[j] + dp[j+1]",
            "D) dp[j] = grid[i][j] == 0 ? dp[j] : 0"
        ],
        "answer": "A",
        "explanation": "If grid[i][j] has an obstacle, dp[j] becomes 0 (cannot reach). Otherwise, the new dp[j] (value from left + value from top) is updated as dp[j] + dp[j-1].",
        "topic": "Arrays",
        "difficulty": "Medium",
        "companyRelevance": ["Google", "Amazon"]
    },
    {
        "title": "Merge Overlapping Intervals Complexity",
        "scenario": "Given a collection of intervals, you sort them by start time first. What is the time and space complexity of merging all overlapping intervals?",
        "code": "",
        "options": [
            "A) O(N^2) time, O(1) space",
            "B) O(N log N) time, O(N) or O(1) sorting space",
            "C) O(N) time, O(N) space",
            "D) O(N log N) time, O(N log N) space"
        ],
        "answer": "B",
        "explanation": "Sorting takes O(N log N). Once sorted, a linear scan of O(N) merges intervals in place or into a new list, making the bottleneck O(N log N) sorting time.",
        "topic": "Arrays",
        "difficulty": "Easy",
        "companyRelevance": ["Atlassian"]
    },
    {
        "title": "Longest Consecutive Sequence Hash Map Optimization",
        "scenario": "To find the length of the longest consecutive elements sequence in an unsorted array in O(N) time, what is the purpose of checking: if (hashset.contains(num - 1))?",
        "code": "",
        "options": [
            "A) To ensure we search for elements in reverse order",
            "B) To verify if 'num' is the beginning of a sequence, avoiding redundant inner loops",
            "C) To calculate the sum of consecutive elements",
            "D) To prevent hash collisions"
        ],
        "answer": "B",
        "explanation": "By checking if num - 1 exists, we ensure we only start building a consecutive sequence from its smallest element, guaranteeing that each element is visited at most twice.",
        "topic": "Arrays",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Google"]
    },

    # --- STRINGS (10 questions) ---
    {
        "title": "Atlassian OA: KMP Algorithm Failure Function",
        "scenario": "What does the failure function (LPS array) of the Knuth-Morris-Pratt (KMP) algorithm store for a pattern P?",
        "code": "",
        "options": [
            "A) The count of unique characters in prefix",
            "B) The length of the longest proper prefix of P[0..i] that is also a suffix of P[0..i]",
            "C) The index of the next mismatch character",
            "D) The hash value of subsegment P[0..i]"
        ],
        "answer": "B",
        "explanation": "The LPS (Longest Prefix Suffix) array stores the length of the longest proper prefix which is also a suffix. This allows the algorithm to skip matching already-validated prefixes upon mismatch.",
        "topic": "Strings",
        "difficulty": "Hard",
        "companyRelevance": ["Atlassian"]
    },
    {
        "title": "Rabin-Karp Rolling Hash Collision Worst Case",
        "scenario": "In the Rabin-Karp string matching algorithm, what is the worst-case time complexity of searching a pattern of length M in a text of length N if we experience hash collisions at every step?",
        "code": "",
        "options": [
            "A) O(N)",
            "B) O(M)",
            "C) O(N * M)",
            "D) O(N + M)"
        ],
        "answer": "C",
        "explanation": "If hash collisions occur at every step, Rabin-Karp must perform character-by-character validation of the pattern of length M at all N-M+1 alignment points, degrading to O(N * M).",
        "topic": "Strings",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Manacher's Algorithm Time Complexity",
        "scenario": "Manacher's algorithm finds the longest palindromic substring in a string. Why is its time complexity O(N) despite containing nested loops?",
        "code": "",
        "options": [
            "A) Because it only checks prefixes",
            "B) Because it uses the rightmost boundary of the known palindrome to skip comparisons using symmetry",
            "C) Because it runs in parallel",
            "D) Because it converts the string into a Trie"
        ],
        "answer": "B",
        "explanation": "Manacher's algorithm leverages palindromic symmetry. It keeps track of the center and rightmost boundary (R) of the longest palindrome found so far. For any new center, it mirrors calculations, advancing the right boundary monotonically, ensuring O(N) comparisons.",
        "topic": "Strings",
        "difficulty": "Hard",
        "companyRelevance": ["Google", "Microsoft"]
    },
    {
        "title": "Longest Repeating Substring Suffix Automaton vs Suffix Tree",
        "scenario": "Which data structure provides O(N) construction time and O(N) space to find the longest repeating substring of a string of length N?",
        "code": "",
        "options": [
            "A) Suffix Tree (using Ukkonen's algorithm)",
            "B) Suffix Automaton (SAM)",
            "C) Suffix Array (using prefix-doubling sorting)",
            "D) Both A and B"
        ],
        "answer": "D",
        "explanation": "Both Suffix Trees (constructed via Ukkonen's algorithm) and Suffix Automata (SAM) can be constructed in O(N) time and space, and both easily solve the longest repeating substring problem in linear time.",
        "topic": "Strings",
        "difficulty": "Hard",
        "companyRelevance": ["Google"]
    },
    {
        "title": "String Edit Distance Space Optimization",
        "scenario": "What is the minimum space required to compute the Edit Distance (Levenshtein) between two strings of length M and N?",
        "code": "",
        "options": [
            "A) O(M * N) space",
            "B) O(min(M, N)) space",
            "C) O(M + N) space",
            "D) O(1) space"
        ],
        "answer": "B",
        "explanation": "Since computing the current row of the DP table only requires elements from the current and previous rows, we can optimize space to use only two rows of size min(M, N), achieving O(min(M, N)) space complexity.",
        "topic": "Strings",
        "difficulty": "Medium",
        "companyRelevance": ["Adobe", "Walmart"]
    },
    {
        "title": "Walmart OA: Minimum Window Substring",
        "scenario": "Which algorithmic design pattern achieves the optimal O(N) time complexity to find the minimum window substring of text T containing all characters of pattern P?",
        "code": "",
        "options": [
            "A) Binary search on window size",
            "B) Sliding Window with two pointers and a frequency count Map",
            "C) DP edit-distance matching",
            "D) Greedy search with backtracking"
        ],
        "answer": "B",
        "explanation": "A sliding window two-pointer approach maintains a count of matching characters inside the window. We expand the right pointer to find a valid window and contract from the left to minimize it, achieving O(N) time.",
        "topic": "Strings",
        "difficulty": "Medium",
        "companyRelevance": ["Walmart"]
    },
    {
        "title": "String Compression Run-Length Encoding",
        "scenario": "What is the worst-case behavior of the standard Run-Length Encoding (RLE) string compression (e.g. compressing 'abc' to 'a1b1c1')?",
        "code": "",
        "options": [
            "A) Compression ratio is 0.5",
            "B) Compressed string length doubles",
            "C) Compressed string is larger than the original string",
            "D) Compression fails due to infinite loop"
        ],
        "answer": "C",
        "explanation": "If the input string consists of all unique single characters (e.g. 'abcdef'), RLE appends '1' after each character, making the output length 2N, which is twice the size of the original string.",
        "topic": "Strings",
        "difficulty": "Easy",
        "companyRelevance": ["Microsoft"]
    },
    {
        "title": "Wildcard Pattern Matching Strategy",
        "scenario": "In Wildcard Matching (where '*' matches 0 or more characters and '?' matches 1 character), what is the time complexity of the DP approach for strings of length M and N?",
        "code": "",
        "options": [
            "A) O(M + N)",
            "B) O(M * N)",
            "C) O(2^(M+N))",
            "D) O(M log N)"
        ],
        "answer": "B",
        "explanation": "The DP state table stores values for matching prefixes of length i and j. Transitions require O(1) checks per cell, resulting in O(M * N) total time and space (which can be optimized to O(N) space).",
        "topic": "Strings",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Adobe"]
    },
    {
        "title": "Amazon OA: Count Palindromic Substrings",
        "scenario": "Which approach is most suitable to count all palindromic substrings of a string of length N in O(N^2) time and O(1) space?",
        "code": "",
        "options": [
            "A) Dynamic Programming table of size N x N",
            "B) Expanding around centers (odd and even palindrome candidates)",
            "C) Suffix tree path traversing",
            "D) Recursion with memoization"
        ],
        "answer": "B",
        "explanation": "Expanding around the 2N-1 centers of potential palindromes counts all valid palindromes in-place. This achieves O(N^2) worst-case time but uses O(1) auxiliary space, whereas DP requires O(N^2) space.",
        "topic": "Strings",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Reverse Words in a String In-place",
        "scenario": "Given a mutable string (character array), how can we reverse the order of words in-place (without extra array space) in O(N) time?",
        "code": "",
        "options": [
            "A) Push words to stack, then pop them",
            "B) Reverse the entire string, then reverse each word individually",
            "C) Split the string using spaces and merge in reverse",
            "D) Create a doubly-linked list of characters"
        ],
        "answer": "B",
        "explanation": "Reversing the entire string flips the order of words, but word letters are reversed. Reversing each word individually restores the original spelling. Both operations are in-place, taking O(N) time and O(1) space.",
        "topic": "Strings",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe", "Microsoft"]
    },

    # --- LINKED LISTS (8 questions) ---
    {
        "title": "Floyd's Cycle Finding Offset Derivation",
        "scenario": "In Floyd's Cycle Detection (Tortoise and Hare), if the cycle starts at distance 'μ' from the head, and the cycle length is 'λ', and they meet at distance 'k' from the cycle start. What is the relation between μ, λ, and k?",
        "code": "",
        "options": [
            "A) μ + k = integer multiple of λ",
            "B) μ = k",
            "C) μ + λ = k",
            "D) 2μ = λ + k"
        ],
        "answer": "A",
        "explanation": "When they meet, the hare has traveled twice as far as the tortoise: 2(μ + k) = μ + k + nλ => μ + k = nλ. Thus, μ + k is an integer multiple of the cycle length λ. This is why resetting one pointer to head and moving both at 1x speed leads them to meet exactly at the cycle start after μ steps.",
        "topic": "Linked Lists",
        "difficulty": "Hard",
        "companyRelevance": ["Microsoft", "Atlassian"]
    },
    {
        "title": "Merge K Sorted Linked Lists Optimization",
        "scenario": "What is the optimal time complexity to merge K sorted linked lists of average length N?",
        "code": "",
        "options": [
            "A) O(K * N)",
            "B) O(N * K log K) using a Min-Heap of size K",
            "C) O(N * K^2) using pairwise merging",
            "D) O(N log K) using hash mapping"
        ],
        "answer": "B",
        "explanation": "Using a priority queue (min-heap) of size K, we store the heads of the lists. In each step, we extract the minimum element and push its next node. This takes O(log K) per node, yielding O(N * K log K) time.",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Walmart"]
    },
    {
        "title": "Linked List Copy with Random Pointer",
        "scenario": "To copy a linked list where each node has an extra 'random' pointer pointing to any node in the list, what is the best auxiliary space complexity achievable?",
        "code": "",
        "options": [
            "A) O(N) using a Hash Map of original to cloned node mappings",
            "B) O(1) auxiliary space by inserting cloned nodes adjacent to original nodes",
            "C) O(N^2) space using pointers validation",
            "D) O(log N) using recursive dfs"
        ],
        "answer": "B",
        "explanation": "Inserting cloned nodes between the original nodes (A -> A' -> B -> B') allows us to copy random pointers (A'->random = A->random->next) in O(N) time without using any hash tables, keeping auxiliary space O(1).",
        "topic": "Linked Lists",
        "difficulty": "Hard",
        "companyRelevance": ["Amazon", "Microsoft"]
    },
    {
        "title": "Reorder List (Fold List Pattern)",
        "scenario": "To reorder a linked list: L0 → L1 → … → Ln-1 → Ln into L0 → Ln → L1 → Ln-1 → L2 → …, which sequence of sub-algorithms is correct?",
        "code": "",
        "options": [
            "A) Reverse list, find mid, merge",
            "B) Find middle of list, reverse the second half, and merge the two halves alternately",
            "C) Sort list, split in half, merge",
            "D) Push to stack, reverse list, merge"
        ],
        "answer": "B",
        "explanation": "The canonical O(N) time and O(1) space method finds the middle node (using slow/fast pointers), reverses the list after middle, and then merges the two sublists alternately.",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Linked List Merge Sort Space Complexity",
        "scenario": "Why is Merge Sort preferred over Quick Sort for sorting linked lists?",
        "code": "",
        "options": [
            "A) Quick sort requires random access which is O(1) in arrays but O(N) in lists",
            "B) Merge sort on linked lists can be implemented with O(1) auxiliary space",
            "C) Merge sort is always faster than O(N log N)",
            "D) Both A and B are correct"
        ],
        "answer": "D",
        "explanation": "Quick sort requires random access indexing, which is inefficient on linked lists. Merge sort is ideal because merging lists requires only pointer updates, which can be done in O(N log N) time and O(1) extra space.",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Microsoft"]
    },
    {
        "title": "Linked List Palindrome Check in O(1) Space",
        "scenario": "To check if a singly linked list is a palindrome in O(N) time and O(1) auxiliary space, what modification is required during traversal?",
        "code": "",
        "options": [
            "A) Reverse the first half and compare",
            "B) Reverse the second half of the list, compare with the first half, and restore the list",
            "C) Convert to a doubly-linked list in place",
            "D) Use two pointers moving from head and tail"
        ],
        "answer": "B",
        "explanation": "Finding the middle, reversing the second half, and comparing node values allows verification. Re-reversing the second half restores the list structure, keeping space complexity O(1).",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "companyRelevance": ["Adobe", "Walmart"]
    },
    {
        "title": "Singly Linked List Node Deletion with Only Pointer to Node",
        "scenario": "To delete a node 'curr' from a singly linked list when you are ONLY given a pointer to 'curr' (not the head node), what is the correct operation?",
        "code": "",
        "options": [
            "A) Traverse from node to tail, delete tail",
            "B) Copy the data from the next node into 'curr', then delete the next node",
            "C) Set curr = nullptr",
            "D) Free curr memory directly"
        ],
        "answer": "B",
        "explanation": "Since we don't have the predecessor node, we copy the value of the next node: curr->val = curr->next->val, and then delete the next node: curr->next = curr->next->next. This fails if curr is the tail node.",
        "topic": "Linked Lists",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Reverse Linked List II (Range reversal)",
        "scenario": "To reverse a linked list from position left to right in a single pass, what is the purpose of maintaining a 'prev' pointer outside the range?",
        "code": "",
        "options": [
            "A) To identify the tail of the list",
            "B) To reconnect the reversed subsegment with the preceding list node",
            "C) To calculate list size",
            "D) To count the number of swaps"
        ],
        "answer": "B",
        "explanation": "A pointer to the node immediately before the 'left' position is needed to attach to the new head of the reversed portion. The node at 'left' becomes the tail of the reversed portion, which connects to the node at position 'right + 1'.",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "companyRelevance": ["Microsoft"]
    },

    # --- STACKS (6 questions) ---
    {
        "title": "Monotonic Stack Worst Case Time Complexity",
        "scenario": "In the 'Next Greater Element' problem solved using a Monotonic Stack, what is the amortized time complexity per element, and what is the total number of stack operations?",
        "code": "",
        "options": [
            "A) O(1) amortized, 2N total operations (each element pushed and popped once)",
            "B) O(N) amortized, N^2 total operations",
            "C) O(log N) amortized, N log N total operations",
            "D) O(1) amortized, N total operations"
        ],
        "answer": "A",
        "explanation": "Each element is pushed onto the stack exactly once and popped at most once. Therefore, the total number of operations is at most 2N, making the amortized time complexity per element O(1).",
        "topic": "Stacks",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Microsoft"]
    },
    {
        "title": "Largest Rectangle in Histogram Stack Usage",
        "scenario": "When finding the largest rectangular area in a histogram using a stack, what property does the stack maintain?",
        "code": "",
        "options": [
            "A) Increasing order of bar indices",
            "B) Monotonically increasing height of bars",
            "C) Monotonically decreasing height of bars",
            "D) Count of rectangular divisions"
        ],
        "answer": "B",
        "explanation": "The stack stores indices of bars of monotonically increasing heights. When we encounter a bar of height less than the stack top, we pop and calculate areas of rectangles using the popped bar as the minimum height.",
        "topic": "Stacks",
        "difficulty": "Hard",
        "companyRelevance": ["Google", "Walmart"]
    },
    {
        "title": "Min Stack Design with O(1) Space Overhead",
        "scenario": "To design a Stack that supports push, pop, top, and retrieving the minimum element in O(1) time and O(1) extra space (no secondary stack), what formula can be used to store modified values when a new minimum is found?",
        "code": "val = 2 * x - minEle;",
        "options": [
            "A) val = x - minEle",
            "B) val = 2 * x - minEle",
            "C) val = x + minEle",
            "D) val = 2 * minEle - x"
        ],
        "answer": "B",
        "explanation": "When pushing x < minEle, we store 2*x - minEle and update minEle = x. Since 2*x - minEle is always less than x (when x < minEle), this serves as a flag. During pop, if we pop a value less than minEle, we restore the previous minimum using: minEle = 2*minEle - poppedVal.",
        "topic": "Stacks",
        "difficulty": "Hard",
        "companyRelevance": ["Microsoft", "Adobe"]
    },
    {
        "title": "Amazon OA: Validate Stack Sequences",
        "scenario": "Given pushed and popped sequences of unique elements, you simulate stack operations. What is the state of the stack if the sequence is invalid?",
        "code": "",
        "options": [
            "A) Stack is empty",
            "B) Stack is not empty when all pushed elements are processed and we cannot match the next popped element",
            "C) Stack overflow occurs",
            "D) Stack underflow occurs"
        ],
        "answer": "B",
        "explanation": "If the sequences are valid, the stack will be completely empty at the end of the simulation. If it is invalid, we will be left with elements on the stack that cannot be popped due to order mismatches.",
        "topic": "Stacks",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Postfix Expression Evaluation Stack",
        "scenario": "Evaluate the postfix expression: '10 2 8 * + 3 -'. What is the value popped at the end of the evaluation?",
        "code": "",
        "options": [
            "A) 23",
            "B) 13",
            "C) 20",
            "D) 25"
        ],
        "answer": "A",
        "explanation": "Tokens processed: 10 (push), 2 (push), 8 (push), '*' (pop 8 and 2, push 16), '+' (pop 16 and 10, push 26), 3 (push), '-' (pop 3 and 26, push 23). Final value is 23.",
        "topic": "Stacks",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Implement Queue using Stacks Complexity",
        "scenario": "When implementing a Queue using two Stacks (one input, one output) where push is O(1). What is the amortized cost of the pop operation?",
        "code": "",
        "options": [
            "A) O(N)",
            "B) O(1)",
            "C) O(log N)",
            "D) O(N^2)"
        ],
        "answer": "B",
        "explanation": "During pop, if the output stack is empty, we transfer all elements from the input stack to the output stack, costing O(N). However, subsequent pop operations on the output stack cost O(1). Since each element is transferred at most once, the amortized cost per pop is O(1).",
        "topic": "Stacks",
        "difficulty": "Medium",
        "companyRelevance": ["Atlassian"]
    },

    # --- QUEUES (5 questions) ---
    {
        "title": "Sliding Window Maximum Deque Invariant",
        "scenario": "When using a double-ended queue (deque) to find the maximum in every sliding window of size K in O(N) time, what invariant does the deque maintain?",
        "code": "",
        "options": [
            "A) Stores indices of elements sorted by their index value",
            "B) Stores indices of elements of monotonically decreasing values",
            "C) Stores elements of monotonically increasing values",
            "D) Stores elements in FIFO sequence"
        ],
        "answer": "B",
        "explanation": "The deque stores indices of elements within the window in decreasing order of their values. The front of the deque always holds the index of the maximum element for the current window. We pop smaller elements from the back of the deque before inserting a new element.",
        "topic": "Queues",
        "difficulty": "Hard",
        "companyRelevance": ["Google", "Amazon"]
    },
    {
        "title": "Circular Queue Array Implementation Index Pointer",
        "scenario": "In a circular queue implemented using an array of capacity C with front and rear pointers, which formula represents the increment of the rear pointer upon enqueue?",
        "code": "rear = (rear + 1) % C;",
        "options": [
            "A) rear = rear + 1",
            "B) rear = (rear + 1) % C",
            "C) rear = rear % C",
            "D) rear = (rear - 1 + C) % C"
        ],
        "answer": "B",
        "explanation": "Using modulo arithmetic: `rear = (rear + 1) % C` wraps the index back to 0 when it exceeds capacity - 1, making efficient circular reuse of empty array spaces.",
        "topic": "Queues",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "First Non-repeating Character in Stream",
        "scenario": "To find the first non-repeating character in a stream of characters on the fly, which combination of data structures is most suitable?",
        "code": "",
        "options": [
            "A) Stack and Hash Map",
            "B) Queue and Frequency Array",
            "C) Priority Queue and Set",
            "D) Double Linked List only"
        ],
        "answer": "B",
        "explanation": "A queue tracks the order of characters in the stream, and a frequency array tracks counts. For each character, we increment frequency and push to queue. We then pop characters from the queue head that have a frequency > 1, so the queue head always holds the first non-repeating character in O(1) lookup.",
        "topic": "Queues",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Microsoft"]
    },
    {
        "title": "Rotting Oranges BFS Level Synchronization",
        "scenario": "In the 'Rotting Oranges' problem, which queues traversal strategy tracks the minimum time elapsed?",
        "code": "",
        "options": [
            "A) Normal BFS processing elements one-by-one",
            "B) Level-by-level BFS (processing size of queue at start of each minute)",
            "C) Dijkstra priority-queue sorting",
            "D) Depth-first search recursion"
        ],
        "answer": "B",
        "explanation": "Since all rotten oranges spread rot concurrently per minute, we must process the BFS queue level-by-level. The size of the queue is saved before we loop, ensuring all current rotten oranges expand in parallel, counting as a single minute increment.",
        "topic": "Queues",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Walmart"]
    },
    {
        "title": "Task Scheduler Cooldown Management",
        "scenario": "You are given a CPU task list and cooldown limit N. To schedule tasks to minimize total time, which data structure stores available tasks sorted by frequency?",
        "code": "",
        "options": [
            "A) Priority Queue (Max-Heap) and a Cooldown Queue",
            "B) Monotonic Stack",
            "C) Circular Queue",
            "D) Deque only"
        ],
        "answer": "A",
        "explanation": "The max-heap prioritizes the most frequent tasks to prevent idle cycles. The cooldown queue stores tasks executed along with their available time step, releasing them back to the max-heap when the cooldown expires.",
        "topic": "Queues",
        "difficulty": "Hard",
        "companyRelevance": ["Google", "Facebook"]
    },

    # --- SEARCHING & SORTING (10 questions) ---
    {
        "title": "Ternary Search vs Binary Search Comparisons",
        "scenario": "Why is Binary Search generally preferred over Ternary Search for searching in sorted arrays, even though Ternary Search divides the search space into 3 parts?",
        "code": "",
        "options": [
            "A) Ternary search time complexity is O(N log3 N) which is slower",
            "B) Ternary search performs more comparisons in the worst case (4 comparisons per step instead of 2)",
            "C) Ternary search cannot find duplicates",
            "D) Ternary search requires array resizing"
        ],
        "answer": "B",
        "explanation": "Ternary search has a recurrence relation of T(N) = T(N/3) + 4 comparisons, yielding approximately 4 * log3(N) comparisons. Binary search has T(N) = T(N/2) + 2 comparisons, yielding 2 * log2(N) comparisons. Since 2 * log2(N) < 4 * log3(N), binary search does fewer comparisons.",
        "topic": "Searching",
        "difficulty": "Hard",
        "companyRelevance": ["Microsoft"]
    },
    {
        "title": "Exponential Search Best-case Scenario",
        "scenario": "In which case is Exponential Search highly efficient compared to standard Binary Search?",
        "code": "",
        "options": [
            "A) Unsorted arrays",
            "B) Boundless or infinite arrays when the target element is close to the beginning",
            "C) Arrays with duplicate elements",
            "D) Circularly shifted arrays"
        ],
        "answer": "B",
        "explanation": "Exponential search finds the range containing the target by doubling index bounds (1, 2, 4, 8, ...). It achieves O(log I) complexity where I is the target's index, making it ideal for unbounded arrays or finding elements close to the start.",
        "topic": "Searching",
        "difficulty": "Medium",
        "companyRelevance": ["Google"]
    },
    {
        "title": "In-place Merge Sort Space Complexity",
        "scenario": "What is the theoretical lower bound time complexity of in-place merging in Merge Sort to maintain O(1) auxiliary space, and what is its performance cost?",
        "code": "",
        "options": [
            "A) O(N) time, O(1) space",
            "B) O(N log N) time, O(1) space",
            "C) O(N) time, O(N) space",
            "D) O(N^2) time, O(1) space"
        ],
        "answer": "B",
        "explanation": "Standard in-place merging algorithms (like the block-swap merge) can merge two sorted subsegments in O(N) time and O(1) space. However, simpler implementations (like insertion-based merge) take O(N^2) time, which degrades Merge Sort to O(N^2 log N).",
        "topic": "Sorting",
        "difficulty": "Hard",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Quickselect Worst-case Mitigation",
        "scenario": "To find the K-th smallest element using Quickselect in worst-case O(N) time, which pivot selection strategy must be employed?",
        "code": "",
        "options": [
            "A) Random pivot selection",
            "B) Median of Medians (Deterministic Select) algorithm",
            "C) Choosing the first element",
            "D) Choosing the last element"
        ],
        "answer": "B",
        "explanation": "The Median of Medians algorithm splits elements into groups of 5, finds their medians, and recursively selects the median of those medians as a pivot. This guarantees at least a 30/70 split, yielding a recurrence of T(N) = T(N/5) + T(7N/10) + O(N) = O(N) worst case.",
        "topic": "Searching",
        "difficulty": "Hard",
        "companyRelevance": ["Google"]
    },
    {
        "title": "Timsort Run Construction",
        "scenario": "Timsort (used in Java/Python libraries) is a hybrid sorting algorithm. Which two sorting methods does it combine?",
        "code": "",
        "options": [
            "A) Quicksort and Heapsort",
            "B) Insertion Sort and Merge Sort",
            "C) Radix Sort and Mergesort",
            "D) Bubble Sort and Selection Sort"
        ],
        "answer": "B",
        "explanation": "Timsort identifies small, already-sorted segments called 'runs' and sorts them using Insertion Sort. It then merges these runs using a highly optimized Merge Sort, achieving O(N) best case and O(N log N) worst-case time.",
        "topic": "Sorting",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Google"]
    },
    {
        "title": "Radix Sort Worst-case Bottleneck",
        "scenario": "For sorting N integers using Radix Sort with digit base B and max digit length D, what is the time complexity, and when does it degrade?",
        "code": "",
        "options": [
            "A) O(N log N), degrades when integers are large",
            "B) O(D * (N + B)), degrades when range of values is extremely large (D is large)",
            "C) O(N^2), degrades when base is small",
            "D) O(N + B), always stable"
        ],
        "answer": "B",
        "explanation": "Radix Sort runs in O(D * (N + B)) time. If numbers have huge magnitudes (e.g., up to N^K), the number of digits D = K log(N), making time complexity O(K * N log N), which loses its linear advantages over comparison sorts.",
        "topic": "Sorting",
        "difficulty": "Medium",
        "companyRelevance": ["Microsoft"]
    },
    {
        "title": "Stability in Sorting Algorithms",
        "scenario": "Which of the following sorting algorithms is inherently UNSTABLE?",
        "code": "",
        "options": [
            "A) Merge Sort",
            "B) Insertion Sort",
            "C) Heap Sort",
            "D) Bubble Sort"
        ],
        "answer": "C",
        "explanation": "Heap Sort is unstable because the heap building and extraction phases can swap identical keys across large intervals, scrambling their original relative order. Merge, Insertion, and Bubble sorts are stable by default.",
        "topic": "Sorting",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Bubble Sort Optimization",
        "scenario": "For an already sorted array of size N, what is the best-case time complexity of Bubble Sort if we add a boolean 'swapped' flag?",
        "code": "",
        "options": [
            "A) O(N^2)",
            "B) O(N)",
            "C) O(1)",
            "D) O(N log N)"
        ],
        "answer": "B",
        "explanation": "By checking if any swaps occurred during the first outer pass, the flag allows the algorithm to terminate immediately if the array is already sorted, resulting in O(N) comparisons and 0 swaps.",
        "topic": "Sorting",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Count Sort Memory Constraint",
        "scenario": "What is the primary constraint when choosing Count Sort to sort an array of N integers?",
        "code": "",
        "options": [
            "A) Integers must be positive only",
            "B) The range of elements (K) must be comparable to N, otherwise space complexity O(K) becomes prohibitive",
            "C) N must be less than 1000",
            "D) Array must be pre-sorted"
        ],
        "answer": "B",
        "explanation": "Count sort creates a frequency array of size K (max element - min element + 1). If K is extremely large (e.g. 10^9) compared to N (e.g. 100), the space and time to initialize the frequency array are highly inefficient.",
        "topic": "Sorting",
        "difficulty": "Easy",
        "companyRelevance": ["Walmart"]
    },
    {
        "title": "Microsoft OA: Search in Rotated Sorted Array",
        "scenario": "When searching for a target in a rotated sorted array containing duplicates (e.g., [1, 0, 1, 1, 1]), what is the worst-case time complexity?",
        "code": "",
        "options": [
            "A) O(log N)",
            "B) O(N)",
            "C) O(N log N)",
            "D) O(sqrt(N))"
        ],
        "answer": "B",
        "explanation": "With duplicates, if arr[left] == arr[mid] == arr[right], we cannot determine which half of the array is sorted. We must increment left and decrement right linearly, which degrades search time to O(N) in the worst case.",
        "topic": "Searching",
        "difficulty": "Medium",
        "companyRelevance": ["Microsoft"]
    },

    # --- HASHING (5 questions) ---
    {
        "title": "Amazon OA: Hash Table Open Addressing Clustering",
        "scenario": "Which collision resolution technique in open addressing suffers from Primary Clustering (where long runs of filled slots build up)?",
        "code": "",
        "options": [
            "A) Quadratic Probing",
            "B) Double Hashing",
            "C) Linear Probing",
            "D) Chaining"
        ],
        "answer": "C",
        "explanation": "Linear probing checks adjacent slots (i + 1, i + 2, ...). If a collision occurs, it blocks nearby slots, creating a cluster. Secondary clustering occurs in Quadratic Probing because elements hashing to same slot trace the same path. Double Hashing solves both by using a second hash function to define the step size.",
        "topic": "Hashing",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Double Hashing Step Function Invariant",
        "scenario": "In Double Hashing, the probing sequence is: h(k, i) = (h1(k) + i * h2(k)) % M. To ensure all slots in the table are searched, what must be true about h2(k) and M?",
        "code": "",
        "options": [
            "A) h2(k) must be even",
            "B) h2(k) and M must be coprime (greatest common divisor = 1)",
            "C) h2(k) must be smaller than h1(k)",
            "D) M must be power of 2"
        ],
        "answer": "B",
        "explanation": "If h2(k) and M are coprime, the probe sequence will visit every slot in the table before repeating. A common choice is to choose M as a prime number and make h2(k) return a value less than M.",
        "topic": "Hashing",
        "difficulty": "Hard",
        "companyRelevance": ["Google"]
    },
    {
        "title": "Hash Map Load Factor Threshold",
        "scenario": "Why is the default load factor of Java's HashMap set to 0.75?",
        "code": "",
        "options": [
            "A) To save memory",
            "B) An optimal trade-off between lookup time and memory space overhead based on Poisson distribution",
            "C) To prevent integer overflow",
            "D) To maintain alphabetical ordering"
        ],
        "answer": "B",
        "explanation": "A higher load factor reduces space but increases collisions (degrading lookup to O(N)). A lower load factor wastes space. 0.75 balances collisions and memory usage, with hash collisions following a Poisson distribution.",
        "topic": "Hashing",
        "difficulty": "Medium",
        "companyRelevance": ["Walmart"]
    },
    {
        "title": "Subarray Sum Equals K Hashing Optimization",
        "scenario": "To find the number of subarrays that sum to K in O(N) time, what does the hash map store?",
        "code": "map.put(currSum, map.getOrDefault(currSum, 0) + 1);",
        "options": [
            "A) All subarray elements",
            "B) Prefix sums as keys and their frequency of occurrence as values",
            "C) Indices of elements",
            "D) Remainder values of elements"
        ],
        "answer": "B",
        "explanation": "If the difference between the current prefix sum and K (i.e. prefixSum - K) has occurred previously, it means a subarray between those points sums to K. We lookup its frequency in O(1) using the hash map.",
        "topic": "Hashing",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Google"]
    },
    {
        "title": "Perfect Hashing Construction Complexity",
        "scenario": "What is the lookup time complexity in a Perfect Hash Table, and what is its construction constraint?",
        "code": "",
        "options": [
            "A) O(1) worst-case lookup, requires a static/unchanging key set",
            "B) O(log N) lookup, requires dynamic keys",
            "C) O(1) average lookup, works for any key set",
            "D) O(N) lookup, requires prime sorting"
        ],
        "answer": "A",
        "explanation": "Perfect hashing guarantees O(1) lookup in the worst case by using a two-level hashing scheme. It requires the key set to be static (not changing) so that hash functions can be chosen to avoid collisions entirely during construction.",
        "topic": "Hashing",
        "difficulty": "Hard",
        "companyRelevance": ["Microsoft"]
    },

    # --- HEAPS (5 questions) ---
    {
        "title": "Build Heap Time Complexity Derivation",
        "scenario": "Why is the time complexity to build a binary heap from an unsorted array of size N O(N), while inserting elements one-by-one is O(N log N)?",
        "code": "",
        "options": [
            "A) Because heapifying is done bottom-up, and most nodes are close to the leaves and traverse small heights",
            "B) Because sorting is not required",
            "C) Because heap uses a queue",
            "D) Because heap height is constant"
        ],
        "answer": "A",
        "explanation": "By calling heapify bottom-up, N/2 nodes (leaves) traverse height 0, N/4 nodes traverse height 1, ..., up to 1 node traversing height log(N). The summation: Sum(h = 0 to log N) of (N / 2^(h+1)) * h converges mathematically to O(N). Inserting elements one-by-one traverses from leaves to root, costing O(N log N).",
        "topic": "Heaps",
        "difficulty": "Hard",
        "companyRelevance": ["Microsoft", "Adobe"]
    },
    {
        "title": "Priority Queue Decrease Key Operation in Binary Heap",
        "scenario": "What is the time complexity of the decrease-key operation in a standard Binary Heap containing N elements?",
        "code": "",
        "options": [
            "A) O(1)",
            "B) O(log N)",
            "C) O(N)",
            "D) O(N log N)"
        ],
        "answer": "B",
        "explanation": "Decreasing a key requires updating its value and bubbling it up. The bubble-up takes O(log N) height steps in the worst case, giving O(log N) time (assuming we have a pointer to the node's position).",
        "topic": "Heaps",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Fibonacci Heap Amortized Complexity",
        "scenario": "Which operation achieves O(1) amortized time complexity in a Fibonacci Heap, but takes O(log N) in a standard Binary Heap?",
        "code": "",
        "options": [
            "A) Extract Min",
            "B) Decrease Key and Merge (Meld)",
            "C) Delete Node",
            "D) Search element"
        ],
        "answer": "B",
        "explanation": "Fibonacci heaps defer cleanup. Decrease Key and Meld (merging two heaps) are done by pointer links in O(1) amortized time. Extract Min requires cleaning up trees, which takes O(log N) amortized time.",
        "topic": "Heaps",
        "difficulty": "Hard",
        "companyRelevance": ["Google"]
    },
    {
        "title": "K-way Merge Heap size",
        "scenario": "To merge K sorted arrays of total size N using a heap, what is the size of the heap maintained, and what is the time complexity?",
        "code": "",
        "options": [
            "A) Size N, O(N log N)",
            "B) Size K, O(N log K)",
            "C) Size K, O(K log N)",
            "D) Size N, O(N log K)"
        ],
        "answer": "B",
        "explanation": "We maintain a min-heap of size K containing the first element of each of the K arrays. In each step, we extract the minimum element and insert the next element from the corresponding array. This takes O(log K) per step, resulting in O(N * log K) total time.",
        "topic": "Heaps",
        "difficulty": "Medium",
        "companyRelevance": ["Walmart"]
    },
    {
        "title": "Heap Sort Aux Space Complexity",
        "scenario": "What is the auxiliary space complexity of Heap Sort when sorting an array in ascending order using a Max-Heap?",
        "code": "",
        "options": [
            "A) O(N) space",
            "B) O(1) space",
            "C) O(log N) space",
            "D) O(N log N) space"
        ],
        "answer": "B",
        "explanation": "Heap Sort can sort the array in-place. We build a Max-Heap in the array, swap the root (max element) with the last element, reduce heap size, and heapify. This takes O(1) auxiliary space.",
        "topic": "Heaps",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },

    # --- GREEDY (5 questions) ---
    {
        "title": "Huffman Coding Compression Ratio",
        "scenario": "Huffman Coding generates variable-length prefix codes. If a character appears with high frequency, what property does its Huffman code have?",
        "code": "",
        "options": [
            "A) Longest bit sequence",
            "B) Shortest bit sequence",
            "C) Fixed 8-bit length",
            "D) Even parity code"
        ],
        "answer": "B",
        "explanation": "Huffman coding assigns shorter bit strings to higher frequency characters and longer bit strings to less frequent characters, minimizing the weighted average length of the encoded file.",
        "topic": "Greedy",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Fractional Knapsack Sorting Bottleneck",
        "scenario": "In the Fractional Knapsack problem, you sort items by their value-to-weight ratio. What is the time complexity bottleneck?",
        "code": "",
        "options": [
            "A) O(W) loop",
            "B) O(N log N) sorting of items",
            "C) O(N) greedy traversal",
            "D) O(N * W) DP table"
        ],
        "answer": "B",
        "explanation": "Fractional Knapsack has a greedy choice property. Sorting items by value-to-weight ratio takes O(N log N) time, while the selection scan takes O(N), making sorting the time bottleneck.",
        "topic": "Greedy",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe", "Walmart"]
    },
    {
        "title": "Atlassian OA: Job Sequencing with Deadlines",
        "scenario": "Given N jobs with deadlines and profits, where each job takes 1 unit of time. What is the best strategy to maximize profit, and what is its optimal complexity?",
        "code": "",
        "options": [
            "A) Sort jobs by profit descending; assign each job to the latest available slot before its deadline using a DSU to find slots in O(N log N)",
            "B) Sort by deadline ascending; O(N^2) search",
            "C) DP knapsack solution; O(N * D) space",
            "D) BFS search; O(2^N)"
        ],
        "answer": "A",
        "explanation": "Sorting jobs by profit is greedy. To find the latest free slot efficiently, we use a Disjoint Set Union (DSU) where each parent represents the next available free slot. This avoids O(N^2) linear searching, achieving O(N log N) time.",
        "topic": "Greedy",
        "difficulty": "Hard",
        "companyRelevance": ["Atlassian"]
    },
    {
        "title": "Kruskal's Algorithm Sort Bottleneck",
        "scenario": "Why does Kruskal's algorithm run in O(E log E) time, and how is DSU utilized?",
        "code": "",
        "options": [
            "A) Sorting edges by weight takes O(E log E); DSU is used to check for cycles in O(E α(V))",
            "B) BFS path finding takes O(V^2)",
            "C) DSU requires O(E log V) sorting time",
            "D) Heap sorting takes O(V log E)"
        ],
        "answer": "A",
        "explanation": "Kruskal's sorts all E edges by weight, taking O(E log E) time. Then, DSU checks if the endpoints of an edge belong to different sets in O(α(V)) time, preventing cycles and building the MST in O(E log E) overall.",
        "topic": "Greedy",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Microsoft"]
    },
    {
        "title": "Gas Station Circular Journey Greedy Invariant",
        "scenario": "In the 'Gas Station' problem, if the total gas is greater than or equal to the total cost, we are guaranteed a starting gas station. What is the greedy rule to locate it in a single pass?",
        "code": "",
        "options": [
            "A) Start at station with max gas",
            "B) Track current gas; if current gas drops below zero at station 'i', reset starting station to 'i + 1' and reset current gas to 0",
            "C) Try starting at every station recursively",
            "D) Sort stations by gas-to-cost ratio"
        ],
        "answer": "B",
        "explanation": "If we cannot reach station i from a start station, we cannot reach it from any station between start and i. We can skip all intermediate stations and set the next start candidate to i + 1, achieving O(N) time.",
        "topic": "Greedy",
        "difficulty": "Medium",
        "companyRelevance": ["Google", "Amazon"]
    },

    # --- BIT MANIPULATION (5 questions) ---
    {
        "title": "Brian Kernighan's Algorithm Complexity",
        "scenario": "Brian Kernighan's algorithm counts set bits in an integer. What is its time complexity?",
        "code": "n = n & (n - 1);",
        "options": [
            "A) O(log N)",
            "B) O(K) where K is the number of set bits",
            "C) O(32) always",
            "D) O(N)"
        ],
        "answer": "B",
        "explanation": "The operation `n & (n - 1)` clears the lowest set bit of `n`. The loop runs exactly K times (where K is count of set bits) before `n` becomes 0, making it faster than checking all 32 bits.",
        "topic": "Bit Manipulation",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe", "Microsoft"]
    },
    {
        "title": "Amazon OA: Find Two Unique Numbers in Array",
        "scenario": "In an array where every element appears twice except two numbers which appear once, how can we separate them using bitwise operations?",
        "code": "",
        "options": [
            "A) Sum all elements and divide",
            "B) Compute XOR sum of all elements, locate a set bit in XOR sum, and split array elements into two groups based on that bit to XOR separately",
            "C) Sort and find unique values in O(N log N)",
            "D) Put in Hash Map and extract"
        ],
        "answer": "B",
        "explanation": "The XOR sum of all elements is x ^ y. A set bit in x ^ y indicates that x and y differ at that bit position. By splitting array elements based on whether they have this bit set, we isolate x in one group and y in the other. XOR-summing each group separately yields the two numbers in O(N) time and O(1) space.",
        "topic": "Bit Manipulation",
        "difficulty": "Hard",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Bitmask Representation Power Set Size",
        "scenario": "To represent all subsets of a set of size N, what is the value of the max mask, and what is its transition loop?",
        "code": "for (int i = 0; i < (1 << N); i++);",
        "options": [
            "A) Max mask is N, loop runs N times",
            "B) Max mask is 1 << N, loop runs 2^N times",
            "C) Max mask is N^2, loop runs N^2 times",
            "D) Max mask is log N"
        ],
        "answer": "B",
        "explanation": "A set of size N has 2^N subsets. Each subset is mapped to a bitmask of length N. The loop ranges from 0 to (1 << N) - 1, representing every subset combination.",
        "topic": "Bit Manipulation",
        "difficulty": "Easy",
        "companyRelevance": ["Microsoft"]
    },
    {
        "title": "Power of Two Verification Formula",
        "scenario": "Which bitwise expression returns true if an integer N is a power of 2 (assume N > 0)?",
        "code": "return (n & (n - 1)) == 0;",
        "options": [
            "A) (n & 1) == 0",
            "B) (n & (n - 1)) == 0",
            "C) (n | (n - 1)) == 0",
            "D) (n ^ (n - 1)) == 0"
        ],
        "answer": "B",
        "explanation": "A power of 2 has exactly one set bit. Clearing the lowest set bit using `n & (n - 1)` will leave the value as 0, confirming it is a power of 2.",
        "topic": "Bit Manipulation",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Microsoft OA: Bitwise XOR of all numbers in range [1, N]",
        "scenario": "What is the pattern of the bitwise XOR sum of all integers from 1 to N, and what is the complexity to compute it?",
        "code": "",
        "options": [
            "A) O(N) loop",
            "B) O(1) using modulo 4 pattern (returns N, 1, N+1, or 0)",
            "C) O(log N) using bit counts",
            "D) O(1) returning N XOR 1"
        ],
        "answer": "B",
        "explanation": "The XOR sum from 1 to N repeats every 4 steps: if N % 4 == 0 XOR is N; if N % 4 == 1 XOR is 1; if N % 4 == 2 XOR is N + 1; if N % 4 == 3 XOR is 0. This yields O(1) computation time.",
        "topic": "Bit Manipulation",
        "difficulty": "Medium",
        "companyRelevance": ["Microsoft"]
    },

    # --- BACKTRACKING & RECURSION (5 questions) ---
    {
        "title": "N-Queens Backtracking Pruning Optimization",
        "scenario": "To optimize N-Queens backtracking validation from O(N) to O(1) per position check, which helper structures should be maintained?",
        "code": "",
        "options": [
            "A) Stack and Queue",
            "B) Three boolean arrays (or bitmasks) for column, main diagonal (r-c), and anti-diagonal (r+c) attacks",
            "C) Two hash tables",
            "D) 2D state table of attack nodes"
        ],
        "answer": "B",
        "explanation": "By tracking columns and diagonals using row/column indexes: main diagonal positions have constant `row - col` and anti-diagonal positions have constant `row + col`. Lookup in boolean arrays is O(1), bypassing O(N) board checks.",
        "topic": "Backtracking",
        "difficulty": "Hard",
        "companyRelevance": ["Google", "Amazon"]
    },
    {
        "title": "Recursion Stack Overflow Prevention",
        "scenario": "In a recursive function that calculates depth of a tree, what causes a Stack Overflow error?",
        "code": "",
        "options": [
            "A) Passing too many parameters",
            "B) Absence of base case or excessive recursion depth exceeding call stack capacity",
            "C) Using dynamic memory allocation",
            "D) Using integer variables"
        ],
        "answer": "B",
        "explanation": "Every recursive call allocates a frame on the call stack. Without a base case to terminate recursion, or if the tree is highly skewed (depth > 10^5), stack frames exceed stack capacity, throwing a Stack Overflow.",
        "topic": "Recursion",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Sudoku Solver Search Space Complexity",
        "scenario": "What is the worst-case upper bound complexity of a standard backtracking Sudoku Solver on a 9 x 9 board?",
        "code": "",
        "options": [
            "A) O(9^81)",
            "B) O(9^M) where M is the number of empty cells",
            "C) O(N^2)",
            "D) O(2^N)"
        ],
        "answer": "B",
        "explanation": "For each empty cell, the solver tries up to 9 digits. If there are M empty cells, the worst-case search tree size is 9^M. Practical backtracking uses constraints to prune branches early.",
        "topic": "Backtracking",
        "difficulty": "Hard",
        "companyRelevance": ["Microsoft"]
    },
    {
        "title": "Subsets Backtracking Generation",
        "scenario": "In a backtracking algorithm to generate all subsets of a set of size N, what is the recursion tree structure?",
        "code": "",
        "options": [
            "A) N-ary tree of depth N",
            "B) Binary decision tree of depth N (take or skip element)",
            "C) Star graph of connections",
            "D) Stack of permutations"
        ],
        "answer": "B",
        "explanation": "At each index i (from 0 to N-1), we make a binary choice: include element i in the current subset, recurse, and then exclude element i (backtrack) and recurse, resulting in 2^N leaf calls.",
        "topic": "Backtracking",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Recursion vs Iteration Space Complexity",
        "scenario": "To perform an in-order traversal of a balanced binary tree, compare the space complexities of recursive DFS and iterative traversal using an explicit Stack.",
        "code": "",
        "options": [
            "A) Recursive: O(1), Iterative: O(N)",
            "B) Both take O(H) space, where H is tree height",
            "C) Recursive: O(N), Iterative: O(log N)",
            "D) Both take O(1) space"
        ],
        "answer": "B",
        "explanation": "Both approaches store ancestor nodes. Recursive DFS uses the call stack, costing O(H) space. Iterative DFS uses an explicit stack, also storing at most H nodes (where H = log N for balanced trees).",
        "topic": "Recursion",
        "difficulty": "Medium",
        "companyRelevance": ["Adobe"]
    },

    # --- SLIDING WINDOW & TWO POINTERS (5 questions) ---
    {
        "title": "Minimum Size Subarray Sum",
        "scenario": "To find the minimum length of a contiguous subarray of positive numbers with sum >= target in O(N) time, which sliding window pattern is used?",
        "code": "",
        "options": [
            "A) Fixed size window",
            "B) Dynamic window: expand right pointer to increase sum; when sum >= target, contract left pointer to minimize window length",
            "C) Nested sorting scan",
            "D) Binary search on prefix sums"
        ],
        "answer": "B",
        "explanation": "Because elements are positive, prefix sums are strictly increasing. A dynamic sliding window expands to find validity and shrinks from left to find local minimums, in O(N) total time.",
        "topic": "Sliding Window",
        "difficulty": "Medium",
        "companyRelevance": ["Walmart"]
    },
    {
        "title": "Longest Substring Without Repeating Characters Complexity",
        "scenario": "What is the optimal lookup lookup mapping in a sliding window to solve 'Longest Substring Without Repeating Characters' in O(N) time with a single pass?",
        "code": "left = max(left, lastSeen[char] + 1);",
        "options": [
            "A) HashMap storing character counts",
            "B) HashMap storing character and its last seen index, allowing left pointer to jump directly",
            "C) Array list of prefixes",
            "D) Monotonic queue of indices"
        ],
        "answer": "B",
        "explanation": "By storing the last seen index of each character, when a duplicate is found at index j, we can immediately jump the left pointer to lastSeen[char] + 1 (if it is to the right of current left), avoiding step-by-step increments.",
        "topic": "Sliding Window",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon", "Google"]
    },
    {
        "title": "Two Sum II Sorted Input",
        "scenario": "For a sorted array of integers, you want to find two numbers that sum to target. What is the complexity of the Two Pointers method compared to Hash Map lookup?",
        "code": "",
        "options": [
            "A) Two Pointers: O(N) time, O(1) space; Hash Map: O(N) time, O(N) space",
            "B) Two Pointers: O(N log N) time, O(N) space",
            "C) Both are O(1) space",
            "D) Hash Map is O(N^2) space"
        ],
        "answer": "A",
        "explanation": "Since the array is sorted, Two Pointers (left at 0, right at N-1) can move inward based on comparison with target. This takes O(N) time and requires O(1) auxiliary space, whereas Hash Map lookup requires O(N) space.",
        "topic": "Two Pointers",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Amazon OA: Container With Most Water",
        "scenario": "In the Container With Most Water problem, you start with pointers at left=0 and right=N-1. Why does moving the pointer pointing to the shorter line always make sense?",
        "code": "",
        "options": [
            "A) It is standard practice",
            "B) The area is limited by the shorter line; keeping the shorter line can never yield a larger area because width decreases",
            "C) It increases the width",
            "D) It sorts the heights"
        ],
        "answer": "B",
        "explanation": "Area = min(height[left], height[right]) * (right - left). Shrinking width reduces area unless we find a taller boundary. Moving the taller line cannot increase min-height (which is capped by shorter line) but decreases width. Hence, we must move the shorter line pointer.",
        "topic": "Two Pointers",
        "difficulty": "Medium",
        "companyRelevance": ["Amazon"]
    },
    {
        "title": "Trapping Rain Water Two Pointer Optimization",
        "scenario": "To solve Trapping Rain Water in O(N) time and O(1) auxiliary space, we maintain left/right pointers and leftMax/rightMax values. What is the move rule?",
        "code": "",
        "options": [
            "A) If height[left] < height[right], process left, increment left; else process right, decrement right",
            "B) Move both pointers simultaneously",
            "C) If leftMax < rightMax, move right",
            "D) Sort heights, then process"
        ],
        "answer": "A",
        "explanation": "If height[left] < height[right], the water level at 'left' is determined by 'leftMax' (since we know height[right] is greater, rightMax won't limit it). So we update leftMax, add water trapped at left, and increment left. Otherwise, we do the same for right.",
        "topic": "Two Pointers",
        "difficulty": "Hard",
        "companyRelevance": ["Google", "Microsoft"]
    },

    # --- BINARY SEARCH (5 questions) ---
    {
        "title": "Allocate Minimum Pages Binary Search Range",
        "scenario": "In the Allocate Minimum Pages (or Book Allocation) optimization problem, what is the search range for the Binary Search?",
        "code": "",
        "options": [
            "A) [0, sum of all pages]",
            "B) [max element in pages array, sum of all pages]",
            "C) [0, average of pages]",
            "D) [min element in pages, max element in pages]"
        ],
        "answer": "B",
        "explanation": "The maximum pages allocated to a student cannot be less than the largest book (otherwise no student can read that book). In the worst case (1 student), the student must read all books (sum of pages). Thus, the binary search range is [max(pages), sum(pages)].",
        "topic": "Binary Search",
        "difficulty": "Hard",
        "companyRelevance": ["Amazon", "Microsoft"]
    },
    {
        "title": "Binary Search Lower Bound Definition",
        "scenario": "What does the lower_bound algorithm return in a sorted array containing duplicates?",
        "code": "",
        "options": [
            "A) The index of the first element greater than target",
            "B) The index of the first element greater than or equal to target",
            "C) The index of the last element less than target",
            "D) The occurrence count of target"
        ],
        "answer": "B",
        "explanation": "lower_bound returns the iterator to the first element in the range that does not compare less than target, which is equivalent to >= target.",
        "topic": "Binary Search",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    },
    {
        "title": "Find Peak Element in Unsorted Array",
        "scenario": "How can we find a peak element (element greater than its neighbors) in an unsorted array in O(log N) time?",
        "code": "if (arr[mid] < arr[mid + 1]) low = mid + 1; else high = mid;",
        "options": [
            "A) Standard linear search is required",
            "B) Binary search: if arr[mid] < arr[mid+1], a peak must exist on the right; else it must exist on the left",
            "C) Sorting array first, then middle element",
            "D) Quickselect partitioning"
        ],
        "answer": "B",
        "explanation": "By checking arr[mid] and arr[mid+1], if arr[mid] < arr[mid+1], the array is rising, meaning a peak must exist to the right. If arr[mid] > arr[mid+1], a peak must exist to the left (or mid itself). This allows O(log N) binary search on unsorted inputs.",
        "topic": "Binary Search",
        "difficulty": "Medium",
        "companyRelevance": ["Google", "Amazon"]
    },
    {
        "title": "Median of Two Sorted Arrays Complexity",
        "scenario": "To find the median of two sorted arrays of sizes M and N in O(log(min(M, N))) time, which partition binary search strategy is correct?",
        "code": "",
        "options": [
            "A) Binary search on the values",
            "B) Binary search on the partition index of the smaller array, ensuring elements on left partition are <= elements on right partition",
            "C) Merging arrays in O(M+N) time",
            "D) Binary search on index sums"
        ],
        "answer": "B",
        "explanation": "By partition binary search on the smaller array (size M), we can deduce the partition in the larger array (size N) such that LHS and RHS have equal elements. We check boundaries: maxLeftX <= minRightY and maxLeftY <= minRightX. Search takes O(log(min(M,N))).",
        "topic": "Binary Search",
        "difficulty": "Hard",
        "companyRelevance": ["Google", "Microsoft"]
    },
    {
        "title": "Square Root using Binary Search Precision",
        "scenario": "To calculate the square root of a number N to P decimal places using binary search, what is the termination condition of the loop?",
        "code": "while (high - low > epsilon);",
        "options": [
            "A) low <= high",
            "B) high - low > epsilon (where epsilon = 10^-P)",
            "C) mid * mid == N",
            "D) Count of iterations = 32"
        ],
        "answer": "B",
        "explanation": "Since we are searching in real number range, we terminate the binary search when the interval size [low, high] is smaller than our precision threshold epsilon (10^-P).",
        "topic": "Binary Search",
        "difficulty": "Easy",
        "companyRelevance": ["Adobe"]
    }
]

def main():
    print("Loading imported docx questions...")
    imported_questions = load_docx_questions()
    print(f"Loaded {len(imported_questions)} imported questions.")

    final_questions = []
    seen_titles = set()
    duplicates_removed = 0

    # 1. Clean, Deduplicate & Canonicalize Imported Questions
    for q in imported_questions:
        title = q.get("title", "").strip()
        scenario = q.get("scenario", "").strip()
        
        # Deduplication check
        dup_key = (title + "|" + scenario).lower()
        if dup_key in seen_titles:
            duplicates_removed += 1
            continue
        seen_titles.add(dup_key)

        # Canonicalize topic
        raw_topic = q.get("topic", "Miscellaneous")
        canonical_topic = TOPIC_MAPPING.get(raw_topic, "Miscellaneous")
        if canonical_topic not in CANONICAL_TOPICS:
            canonical_topic = "Miscellaneous"
        q["topic"] = canonical_topic

        # Classify difficulty
        q["difficulty"] = determine_difficulty(q)
        
        # Add company relevance if empty
        if "companyRelevance" not in q or not q["companyRelevance"]:
            # Seed some defaults based on topics
            if q["difficulty"] == "Hard":
                q["companyRelevance"] = ["Google", "Amazon"]
            elif q["difficulty"] == "Medium":
                q["companyRelevance"] = ["Microsoft", "Adobe"]
            else:
                q["companyRelevance"] = ["TCS", "Infosys"]

        final_questions.append(q)

    print(f"Cleaned {len(imported_questions)} questions. Removed {duplicates_removed} duplicates.")
    
    # 2. Add Expanded Dataset (Supplemental Questions)
    q_counter = len(final_questions) + 1
    for sq in SUPPLEMENTAL_QUESTIONS:
        sq_id = f"sup-q{q_counter}"
        # format question field
        title = sq["title"]
        scenario = sq["scenario"]
        question_text = f"{title}\n\n{scenario}" if title and scenario else (title or scenario)
        
        # Ensure company relevance exists
        company_rel = sq.get("companyRelevance", ["Amazon"])

        final_questions.append({
            "id": sq_id,
            "question": question_text,
            "title": title,
            "scenario": scenario,
            "code": sq.get("code", ""),
            "options": sq["options"],
            "answer": sq["answer"],
            "explanation": sq["explanation"],
            "topic": sq["topic"],
            "difficulty": sq["difficulty"],
            "companyRelevance": company_rel
        })
        q_counter += 1

    print(f"Added {len(SUPPLEMENTAL_QUESTIONS)} supplemental questions.")
    print(f"Total questions in final dataset: {len(final_questions)}")

    # 3. Topic Coverage Analysis Report
    coverage_report = {}
    for t in CANONICAL_TOPICS:
        coverage_report[t] = 0
    for q in final_questions:
        topic = q["topic"]
        coverage_report[topic] = coverage_report.get(topic, 0) + 1

    print("\n==================================================")
    print("TOPIC COVERAGE ANALYSIS REPORT")
    print("==================================================")
    print(f"{'Topic':<25} | {'Count':<8} | {'Coverage %':<10}")
    print("-" * 50)
    for topic, count in sorted(coverage_report.items(), key=lambda x: -x[1]):
        pct = (count / len(final_questions)) * 100
        print(f"{topic:<25} | {count:<8} | {pct:>8.2f}%")
    print("==================================================")

    # 4. Save Final Dataset
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, '..', 'src', 'data', 'mcq-questions.json')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, indent=2)

    print(f"\nFinal dataset written successfully to: {output_path}")

if __name__ == "__main__":
    main()
