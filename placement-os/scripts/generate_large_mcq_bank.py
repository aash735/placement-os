# -*- coding: utf-8 -*-
import json
import os
import random

# Central list of topics matching Placement OS canonical taxonomy
CANONICAL_TOPICS = [
    "Arrays", "Strings", "Linked Lists", "Stacks", "Queues", "Recursion",
    "Searching", "Sorting", "Hashing", "Trees", "BST", "Heaps", "Graphs",
    "Dynamic Programming", "Greedy", "Bit Manipulation", "Backtracking",
    "Sliding Window", "Two Pointers", "Binary Search", "Tries", "Segment Trees",
    "DSU", "Miscellaneous"
]

COMPANIES = ["Amazon", "Microsoft", "Google", "Atlassian", "Adobe", "Walmart", "Goldman Sachs", "DE Shaw", "Uber", "Flipkart", "PayPal"]
DIFFICULTIES = ["Easy", "Medium", "Hard"]

# Helper to generate unique stable IDs
def generate_stable_id(category_num, index):
    return f"gen-c{category_num}-q{index}"

# --- CATEGORY 1: DSA THEORY GENERATOR ---
def generate_dsa_theory(count):
    questions = []
    topics_list = [
        ("DSU", "Disjoint Set Union (DSU) with path compression and union-by-rank", "amortized find and union operations", "O(alpha(N))", ["O(log N)", "O(alpha(N))", "O(1)", "O(N)"], "B", "With path compression and union by rank, DSU operations run in amortized O(alpha(N)) time, where alpha is the inverse Ackermann function, which grows extremely slowly and is effectively less than 5 for any practical N."),
        ("Segment Trees", "Segment Tree constructed on an array of size N", "worst-case query time with lazy propagation", "O(log N)", ["O(log N)", "O(N)", "O(1)", "O(N log N)"], "A", "With lazy propagation, range queries and range updates in a Segment Tree are both optimized to O(log N) time because we only visit nodes that overlap with the target range and defer updates to children until necessary."),
        ("Bit Manipulation", "checks if a positive integer x is a power of 2", "the condition that yields true", "(x & (x - 1)) == 0", ["(x & (x - 1)) == 0", "(x | (x - 1)) == 0", "(x ^ (x - 1)) == 0", "(x & (x + 1)) == 0"], "A", "Subtracting 1 from a power of 2 flips all bits after the only set bit (including the set bit itself). Thus, bitwise AND of x and x-1 will clear the single set bit, yielding 0."),
        ("Hashing", "a hash table with N slots and load factor L", "average-case search time using chaining", "O(1 + L)", ["O(1)", "O(log N)", "O(1 + L)", "O(N)"], "C", "The average time to search for an element in a hash table with chaining is O(1) for hash calculation plus the average length of the chain, which is defined by the load factor L = element_count / slot_count. Thus, complexity is O(1 + L)."),
        ("Tries", "a Trie containing N words of average length L over alphabet size S", "worst-case search time for a query string of length Q", "O(Q)", ["O(Q)", "O(Q * S)", "O(log N)", "O(Q log S)"], "A", "Searching a Trie involves walking down the nodes character by character for the query string of length Q. Each character step takes O(1) time if we use direct indexing (size S), leading to O(Q) total time, independent of N."),
        ("Trees", "the maximum number of nodes in a binary tree of height H (height of root = 1)", "the node count formula", "2^H - 1", ["2^H", "2^H - 1", "2^(H-1)", "2^(H+1) - 1"], "B", "A full binary tree has 1 node at level 1, 2 at level 2, 4 at level 3, and so on. The sum of this geometric progression is 1 + 2 + 4 + ... + 2^(H-1) = 2^H - 1 nodes."),
        ("Stacks", "converting an Infix expression to Postfix", "the auxiliary data structure used", "Stack", ["Queue", "Stack", "BST", "Deque"], "B", "Infix-to-postfix translation requires holding operators until their operands are processed. A Stack is used to enforce operator precedence by popping operators with higher or equal precedence before pushing the new operator."),
        ("Queues", "implementing a queue using two stacks S1 and S2", "amortized time complexity of the dequeue operation", "O(1)", ["O(1)", "O(N)", "O(log N)", "O(N^2)"], "A", "While a single dequeue might take O(N) when copying S1 to S2, each element is pushed to S1, copied to S2 once, and popped from S2 once. Thus, the total cost for N elements is 4N operations, giving O(1) amortized cost per operation."),
        ("Graphs", "a graph with V vertices and E edges represented as an adjacency list", "worst-case time complexity of Topological Sort using Kahn's algorithm", "O(V + E)", ["O(V^2)", "O(V + E)", "O(V log V)", "O(E log V)"], "B", "Kahn's algorithm uses in-degrees and a queue. It processes each vertex once and decrements in-degrees of edges, visiting each edge once. The time complexity is thus O(V + E)."),
        ("Sorting", "Heap Sort algorithm applied on an array of N elements", "worst-case time complexity", "O(N log N)", ["O(N log N)", "O(N^2)", "O(N)", "O(N^2 log N)"], "A", "Heap sort involves building a heap in O(N) time and then repeatedly extracting the maximum element N times. Each extraction takes O(log N) to heapify, resulting in a stable O(N log N) worst-case time complexity."),
    ]
    
    for i in range(count):
        topic, ds, prop, correct, opts, ans, exp = random.choice(topics_list)
        # Add parameter variation
        factor = random.choice([2, 3, 5])
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"{comp} Theory Interview: {topic} {prop.capitalize()}"
        scenario = f"Consider a {ds}. If we analyze the properties, what is the {prop} under standard implementation conditions?"
        
        # shuffle options and track the correct letter
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(1, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": "",
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": ans_letter,
            "explanation": f"Correct Choice: {ans_letter}. {exp}",
            "topic": topic,
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 2: OUTPUT PREDICTION GENERATOR ---
def simulate_vector_ops(ops):
    vec = []
    log = []
    for op, val in ops:
        if op == "push":
            vec.append(val)
        elif op == "pop" and vec:
            vec.pop()
        elif op == "insert":
            idx, item = val
            if idx <= len(vec):
                vec.insert(idx, item)
    return vec

def generate_output_prediction(count):
    questions = []
    for i in range(count):
        # We choose a subtype
        subtype = random.choice(["vector", "stack", "queue", "string"])
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        if subtype == "vector":
            ops_count = random.randint(3, 5)
            ops = []
            c_code = "vector<int> v;\n"
            for _ in range(ops_count):
                op_type = random.choice(["push", "pop", "insert"])
                if op_type == "push" or not ops:
                    val = random.randint(1, 20)
                    ops.append(("push", val))
                    c_code += f"v.push_back({val});\n"
                elif op_type == "pop":
                    ops.append(("pop", None))
                    c_code += "v.pop_back();\n"
                elif op_type == "insert":
                    idx = random.randint(0, len(simulate_vector_ops(ops)))
                    val = random.randint(30, 50)
                    ops.append(("insert", (idx, val)))
                    c_code += f"v.insert(v.begin() + {idx}, {val});\n"
            final_vec = simulate_vector_ops(ops)
            check_idx = random.randint(0, len(final_vec) - 1) if final_vec else 0
            correct_val = final_vec[check_idx] if final_vec else -1
            c_code += f"cout << v[{check_idx}];"
            topic = "Arrays"
            title = f"{comp} Coding Round: Output Prediction of Vector Sequence"
            scenario = "Predict the printed output of the following C++ program execution involving standard template library (STL) vector manipulations."
            correct_str = str(correct_val)
            opts = [correct_str, str(correct_val + 5), str(correct_val - 3), "Segmentation Fault"]
            exp = f"Simulating the operations yields the array state: {final_vec}. The index {check_idx} stores the value {correct_val}."
            
        elif subtype == "stack":
            vals = [random.randint(1, 100) for _ in range(4)]
            c_code = f"stack<int> s;\ns.push({vals[0]});\ns.push({vals[1]});\ns.pop();\ns.push({vals[2]});\ns.push({vals[3]});\ncout << s.top() << \" \" << s.size();"
            # Trace: push v0, push v1, pop, push v2, push v3. Stack state from bottom to top: v0, v2, v3. Top is v3, size is 3.
            correct_str = f"{vals[3]} 3"
            topic = "Stacks"
            title = f"{comp} Technical Quiz: Stack Operations Output"
            scenario = "Predict the output of the following stack operations in C++ STL."
            opts = [correct_str, f"{vals[2]} 3", f"{vals[3]} 4", f"{vals[1]} 2"]
            exp = f"Stack state from bottom to top is [{vals[0]}, {vals[2]}, {vals[3]}]. The top element is {vals[3]} and the size is 3."
            
        elif subtype == "queue":
            vals = [random.randint(1, 100) for _ in range(4)]
            c_code = f"queue<int> q;\nq.push({vals[0]});\nq.push({vals[1]});\nq.pop();\nq.push({vals[2]});\ncout << q.front() << \" \" << q.back();"
            # Trace: push v0, push v1, pop (removes v0), push v2. Queue state: v1, v2. Front is v1, back is v2.
            correct_str = f"{vals[1]} {vals[2]}"
            topic = "Queues"
            title = f"{comp} Technical Quiz: Queue Operations Output"
            scenario = "Predict the output of the following queue operations in C++ STL."
            opts = [correct_str, f"{vals[0]} {vals[2]}", f"{vals[1]} {vals[1]}", f"{vals[2]} {vals[1]}"]
            exp = f"Queue starts with [{vals[0]}, {vals[1]}]. Popping removes the front ({vals[0]}). Pushing {vals[2]} yields queue [{vals[1]}, {vals[2]}]. Front is {vals[1]}, back is {vals[2]}."
            
        else: # string
            s_base = "placement"
            s_add = "os"
            c_code = f"string s = \"{s_base}\";\ns += \"{s_add}\";\ns.erase(5, 2);\ncout << s;"
            # Trace: s = "placement" + "os" = "placementos". erase(5, 2) removes 2 chars starting at index 5.
            # "place" (0-4), "me" (5-6) removed, "ntos" remains -> "placentos".
            correct_str = "placentos"
            topic = "Strings"
            title = f"{comp} Coding Interview: String Manipulation Output"
            scenario = "Predict the printed output of this C++ string operation."
            opts = ["placentos", "placementos", "placenos", "placent"]
            exp = "The base string 'placementos' has 'me' (index 5, size 2) erased, resulting in 'placentos'."

        # Deduplicate options
        opts = list(set(opts))
        while len(opts) < 4:
            opts.append("Runtime Error" if "Runtime Error" not in opts else "Undefined Behavior")
            opts = list(set(opts))
            
        random.shuffle(opts)
        ans_letter = chr(65 + opts.index(correct_str))
        
        questions.append({
            "id": generate_stable_id(2, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": c_code,
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(opts)],
            "answer": ans_letter,
            "explanation": f"Correct Choice: {ans_letter}. {exp}",
            "topic": topic,
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 3: RECURSION TRACE GENERATOR ---
def simulate_recursion_trace(n, mode):
    # Mode 1: print before call
    # Mode 2: print after call
    # Mode 3: print before and after
    out = []
    def rec(x):
        if x <= 0:
            return
        if mode == 1:
            out.append(str(x))
            rec(x - 1)
        elif mode == 2:
            rec(x - 1)
            out.append(str(x))
        elif mode == 3:
            out.append(str(x))
            rec(x - 1)
            out.append(str(x))
    rec(n)
    return " ".join(out)

def generate_recursion_trace(count):
    questions = []
    for i in range(count):
        n = random.choice([3, 4])
        mode = random.choice([1, 2, 3])
        
        if mode == 1:
            code = f"void rec(int x) {{\n  if (x <= 0) return;\n  cout << x << \" \";\n  rec(x - 1);\n}}"
            desc = "pre-order (prints before recursive call)"
        elif mode == 2:
            code = f"void rec(int x) {{\n  if (x <= 0) return;\n  rec(x - 1);\n  cout << x << \" \";\n}}"
            desc = "post-order (prints after recursive call)"
        else:
            code = f"void rec(int x) {{\n  if (x <= 0) return;\n  cout << x << \" \";\n  rec(x - 1);\n  cout << x << \" \";\n}}"
            desc = "pre-post double order (prints both before and after recursive call)"
            
        correct = simulate_recursion_trace(n, mode)
        
        # create distractors
        d1 = simulate_recursion_trace(n, 1 if mode != 1 else 2)
        d2 = simulate_recursion_trace(n, 3 if mode != 3 else 1)
        d3 = " ".join([str(x) for x in range(n, -1, -1)])
        
        opts = list(set([correct, d1, d2, d3]))
        while len(opts) < 4:
            opts.append(correct + " " + str(random.randint(1, 9)))
            opts = list(set(opts))
            
        random.shuffle(opts)
        ans_letter = chr(65 + opts.index(correct))
        
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        topic = "Recursion"
        
        title = f"{comp} Screening: Recursion Trace ({desc})"
        scenario = f"Find the printed output when the function is invoked with the parameter rec({n})."
        
        questions.append({
            "id": generate_stable_id(3, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": code,
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(opts)],
            "answer": ans_letter,
            "explanation": f"Correct Choice: {ans_letter}. Tracing the execution stack for rec({n}) yields the sequence: '{correct}'. The base case terminates at x <= 0.",
            "topic": topic,
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 4: IDENTIFY THE ERROR (BUG HUNTING) ---
def generate_bug_hunting(count):
    questions = []
    bugs = [
        ("Binary Search", 
         "int binarySearch(vector<int>& arr, int target) {\n  int low = 0, high = arr.size() - 1;\n  while (low < high) { // BUG HERE?\n    int mid = low + (high - low) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}",
         "Loop condition should be low <= high",
         ["Loop condition should be low <= high", "Mid calculation causes integer overflow", "Indices should be mid + 2", "No bugs present"],
         "A", "Searching for an element that sits at the boundaries when low == high will be skipped because the loop terminates prematurely. Correct condition is low <= high."),
        
        ("Linked List",
         "void printList(Node* head) {\n  Node* curr = head;\n  while (curr->next) { // BUG HERE?\n    cout << curr->val << \" \";\n    curr = curr->next;\n  }\n}",
         "Condition should be curr != nullptr",
         ["Condition should be curr != nullptr", "Head node is modified directly", "Memory leak occurs on curr delete", "Out of bounds on curr->val"],
         "A", "The loop condition `curr->next` is true only if a next node exists. For the final node, `curr->next` is null, so the loop exits before printing its value. It should be `curr != nullptr`."),
         
        ("Recursion",
         "int fibonacci(int n) {\n  // BUG: Missing n == 1 base case!\n  if (n == 0) return 0;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
         "Missing base case for n == 1 leads to infinite stack frame allocation (stack overflow) for negative parameters.",
         ["Infinite recursion / Stack overflow", "Compilation error on return type", "Incorrect DP state array allocation", "Logic computes factorial instead"],
         "A", "Without a base case for n == 1, calling fib(1) will call fib(0) + fib(-1). fib(-1) then calls fib(-2) etc., causing infinite recursion and eventually a stack overflow runtime exception."),
         
        ("Dynamic Programming",
         "int coin_change(vector<int>& coins, int amount) {\n  vector<int> dp(amount + 1, amount + 1);\n  dp[0] = 0;\n  for (int i = 1; i <= amount; i++) {\n    for (int coin : coins) {\n      if (i - coin >= 0) {\n        dp[i] = dp[i] + 1; // BUG: dp[i - coin] + 1 expected!\n      }\n    }\n  }\n  return dp[amount] > amount ? -1 : dp[amount];\n}",
         "Uses local state reference `dp[i]` instead of lookup `dp[i - coin]`, breaking recurrence relation.",
         ["Recurrence should reference dp[i - coin]", "Array allocation size is off by one", "Inner loop modifies coins vector", "Returns wrong coin count on equal amounts"],
         "A", "The classic coin change DP state transition is dp[i] = min(dp[i], dp[i - coin] + 1). The bug uses `dp[i] = dp[i] + 1` which does not build on the subproblem solutions and calculates wrong amounts.")
    ]
    
    for i in range(count):
        topic, code, bug_desc, opts, ans_letter, exp = random.choice(bugs)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"{comp} Debugging: Identify the bug in {topic}"
        scenario = f"Analyze the C++ code block below and determine what type of logical, syntax, or runtime error is present."
        
        # shuffle options and preserve answer
        correct_opt_text = opts[ord(ans_letter) - 65]
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        new_ans_letter = chr(65 + shuffled_opts.index(correct_opt_text))
        
        questions.append({
            "id": generate_stable_id(4, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": code,
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": new_ans_letter,
            "explanation": f"Correct Choice: {new_ans_letter}. {exp}",
            "topic": topic,
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 5: TIME COMPLEXITY ANALYSIS GENERATOR ---
def generate_time_complexity(count):
    questions = []
    loops = [
        ("for (int i = 1; i <= n; i *= 2) {\n  for (int j = 1; j <= i; j++) {\n    sum++;\n  }\n}", "O(N)", ["O(N)", "O(N log N)", "O(log N)", "O(N^2)"], "The outer loop runs log N times, doubling i. The inner loop runs i times. The total operations count is the sum of a geometric series: 1 + 2 + 4 + 8 + ... + N = 2N - 1, which simplifies to O(N)."),
        ("for (int i = n; i > 0; i /= 2) {\n  for (int j = 0; j < n; j++) {\n    sum++;\n  }\n}", "O(N log N)", ["O(N log N)", "O(N)", "O(N^2)", "O(log N)"], "The outer loop runs log N times since i is halved at each step. The inner loop executes exactly N times regardless of i. Total execution time is outer * inner = O(N log N)."),
        ("for (int i = 0; i < n; i++) {\n  for (int j = 1; j < n; j *= 2) {\n    sum++;\n  }\n}", "O(N log N)", ["O(N log N)", "O(N^2)", "O(N)", "O(log N)"], "The outer loop runs N times. The inner loop doubles j until it reaches n, running log N times. The total complexity is O(N log N)."),
        ("for (int i = 0; i < n; i++) {\n  for (int j = 0; j < n; j += i) { // i can be 0, assume i starts at 1\n    sum++;\n  }\n}", "O(N log N)", ["O(N log N)", "O(N)", "O(N^2)", "O(N sqrt(N))"], "This represents the harmonic series sum. For i = 1, inner runs N times. For i = 2, inner runs N/2. The total steps = N/1 + N/2 + N/3 + ... + N/N = N * (1 + 1/2 + 1/3 + ...) = O(N log N)."),
        ("void solve(int n) {\n  if (n <= 1) return;\n  for (int i = 0; i < n; i++) sum++;\n  solve(n / 2);\n  solve(n / 2);\n}", "O(N log N)", ["O(N log N)", "O(N)", "O(N^2)", "O(log N)"], "This recurrence relation is T(N) = 2T(N/2) + O(N), which matches the Master Theorem Case 2 (or Merge Sort recurrence) yielding O(N log N).")
    ]
    for i in range(count):
        code, correct, opts, exp = random.choice(loops)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        topic = "Searching" if "binary" in code.lower() else "Sorting"
        
        title = f"{comp} Complexity Analysis: Analyze Time Complexity"
        scenario = f"Determine the exact worst-case time complexity of the following code snippet."
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(5, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": code,
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": ans_letter,
            "explanation": f"Correct Choice: {ans_letter}. {exp}",
            "topic": topic,
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 6: SPACE COMPLEXITY ANALYSIS GENERATOR ---
def generate_space_complexity(count):
    questions = []
    scenarios = [
        ("worst-case auxiliary space complexity of Depth First Search (DFS) on a graph with V vertices and E edges", "O(V)", ["O(V)", "O(V + E)", "O(E)", "O(1)"], "The recursion call stack of DFS can go as deep as V vertices in the worst case (skewed graph / linear chain of vertices), requiring O(V) stack frames."),
        ("auxiliary space complexity of Breadth First Search (BFS) on a complete binary tree of size N", "O(N)", ["O(N)", "O(log N)", "O(1)", "O(N log N)"], "In BFS, the queue holds at most the maximum number of nodes at any level. For a complete binary tree, the last level contains ceil(N/2) nodes, leading to O(N) auxiliary queue space."),
        ("auxiliary space complexity of recursive Fibonacci computation with memoization (array of size N)", "O(N)", ["O(N)", "O(2^N)", "O(log N)", "O(1)"], "Memoization requires an array of size N + 1 to cache results, plus the recursion stack reaches depth N. Both stack and table take O(N) space, leading to O(N) total auxiliary space."),
        ("space complexity of storing an adjacency matrix representation of a graph with V vertices and E edges", "O(V^2)", ["O(V^2)", "O(V + E)", "O(E)", "O(V * E)"], "An adjacency matrix allocates a 2D array of dimensions V x V, which consumes exactly O(V^2) memory cells regardless of the number of edges.")
    ]
    for i in range(count):
        scen_text, correct, opts, exp = random.choice(scenarios)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        topic = "Graphs" if "graph" in scen_text.lower() else "Recursion"
        
        title = f"{comp} Space Complexity Analysis: {topic}"
        scenario = f"What is the {scen_text}?"
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(6, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": "",
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": ans_letter,
            "explanation": f"Correct Choice: {ans_letter}. {exp}",
            "topic": topic,
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 7: BEST ALGORITHM SELECTION ---
def generate_best_algorithm(count):
    questions = []
    scenarios = [
        ("You need to find the shortest path in a weighted graph containing negative edge weights but no negative cycles.", "Bellman-Ford Algorithm", ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm", "Breadth-First Search (BFS)"], "Bellman-Ford supports negative weights and detects cycles. Dijkstra assumes weights are non-negative and fails otherwise.", "Graphs"),
        ("You are building a navigation system on an unweighted grid and want to find the path with the fewest steps.", "Breadth-First Search (BFS)", ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Dijkstra's Algorithm", "Kruskal's Algorithm"], "For unweighted graphs, BFS expands level-by-level, guaranteeing the first time a target node is hit, it is via the shortest path in O(V + E) time.", "Graphs"),
        ("You want to find the Minimum Spanning Tree of a sparse graph with E edges and V vertices.", "Kruskal's Algorithm", ["Kruskal's Algorithm", "Floyd-Warshall Algorithm", "Kosaraju's Algorithm", "Bellman-Ford Algorithm"], "Kruskal's algorithm with disjoint set union runs in O(E log E) or O(E log V) time, which is highly efficient for sparse graphs.", "Greedy"),
        ("You need to detect strongly connected components (SCCs) in a directed graph.", "Tarjan's SCC Algorithm", ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Tarjan's SCC Algorithm", "Bellman-Ford Algorithm"], "Tarjan's algorithm uses a single DFS pass to identify back-edges and extract SCCs in optimal O(V + E) time.", "Graphs"),
        ("You are given N jobs with durations and deadlines, and you want to schedule them to maximize the total number of jobs completed.", "Greedy Algorithm (Earliest Deadline First)", ["Dynamic Programming", "Greedy Algorithm (Earliest Deadline First)", "Backtracking Search", "BFS traversal"], "Sorting jobs by deadlines and scheduling them greedily yields the optimal count of completed tasks in O(N log N) time.", "Greedy"),
        ("You need to search for a value in a sorted dataset of 100 million items with maximum time constraint of 30 operations.", "Binary Search", ["Linear Search", "Binary Search", "Hash Map lookup", "Depth First Search"], "Binary search repeatedly divides the search interval in half. log2(100 million) is approximately 27, meaning it will find the element within 27 steps.", "Binary Search")
    ]
    for i in range(count):
        scen_text, correct, opts, exp, topic = random.choice(scenarios)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"{comp} System Design: Best Algorithm Selection"
        scenario = f"Analyze the design requirement:\n'{scen_text}'\nWhich algorithm fits this scenario optimally?"
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(7, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": "",
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": ans_letter,
            "explanation": f"Correct Choice: {ans_letter}. {exp}",
            "topic": topic,
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 8: DRY RUN QUESTIONS ---
def simulate_binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    path = []
    while low <= high:
        mid = (low + high) // 2
        path.append(mid)
        if arr[mid] == target:
            break
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return path

def simulate_min_heap_insert(vals):
    heap = []
    for val in vals:
        heap.append(val)
        idx = len(heap) - 1
        while idx > 0:
            parent = (idx - 1) // 2
            if heap[idx] < heap[parent]:
                heap[idx], heap[parent] = heap[parent], heap[idx]
                idx = parent
            else:
                break
    return heap

def generate_dry_run(count):
    questions = []
    for i in range(count):
        subtype = random.choice(["binary_search", "min_heap"])
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        if subtype == "binary_search":
            arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
            target = random.choice(arr)
            path = simulate_binary_search(arr, target)
            correct_path_str = ", ".join([f"index {idx} ({arr[idx]})" for idx in path])
            d1 = ", ".join([f"index {idx} ({arr[idx]})" for idx in sorted(path)])
            d2 = ", ".join([f"index {idx} ({arr[idx]})" for idx in path[::-1]])
            d3 = f"index 0 ({arr[0]}), index 9 ({arr[9]})"
            opts = list(set([correct_path_str, d1, d2, d3]))
            while len(opts) < 4:
                opts.append(correct_path_str + f", index {random.randint(1, 9)}")
                opts = list(set(opts))
            random.shuffle(opts)
            ans_letter = chr(65 + opts.index(correct_path_str))
            
            title = f"{comp} Dry Run Round: Binary Search Simulation"
            scenario = f"Perform a manual dry run of the standard Binary Search algorithm searching for target {target} in the sorted array {arr}."
            code = "int binarySearch(vector<int>& arr, int target) {\n  int low = 0, high = arr.size() - 1;\n  while (low <= high) {\n    int mid = (low + high) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}"
            exp = f"The checked mid points in order are: {correct_path_str}."
            topic = "Binary Search"
            
        else: # min_heap
            vals = random.sample(range(1, 30), 4)
            heap_res = simulate_min_heap_insert(vals)
            correct_path_str = str(heap_res)
            d1 = str(sorted(vals))
            d2 = str(vals)
            d3 = str(heap_res[::-1])
            opts = list(set([correct_path_str, d1, d2, d3]))
            while len(opts) < 4:
                opts.append(str([random.randint(1, 30) for _ in range(4)]))
                opts = list(set(opts))
            random.shuffle(opts)
            ans_letter = chr(65 + opts.index(correct_path_str))
            
            title = f"{comp} Dry Run Round: Min-Heap Insertion Simulation"
            scenario = f"Insert the elements {vals} in order into an initially empty Min-Heap. What is the resulting array representation of the heap after bubble-up operations?"
            code = "// Min-Heap insert sequence:\n// " + " -> ".join([str(v) for v in vals])
            exp = f"Inserting elements one by one with bubble-up results in heap state: {heap_res}."
            topic = "Heaps"
            
        questions.append({
            "id": generate_stable_id(8, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": code,
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(opts)],
            "answer": ans_letter,
            "explanation": f"Correct Choice: {ans_letter}. {exp}",
            "topic": topic,
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 9: INTERVIEW TRAPS ---
def generate_interview_traps(count):
    questions = []
    traps = [
        ("static variable",
         "void test() {\n  static int x = 0;\n  x++;\n  cout << x << \" \";\n}\nint main() {\n  test();\n  test();\n  return 0;\n}",
         "1 2", ["1 1", "1 2", "2 2", "0 1"], "B", "Static variables are initialized only once and persist across function calls in C++."),
        
        ("pass-by-value vs reference",
         "void update(int a, int& b) {\n  a += 10;\n  b += 10;\n}\nint main() {\n  int x = 5, y = 5;\n  update(x, y);\n  cout << x << \" \" << y;\n  return 0;\n}",
         "5 15", ["5 5", "15 15", "5 15", "15 5"], "C", "Parameter 'a' is passed by value, so modification doesn't affect main's variable 'x'. Parameter 'b' is passed by reference (&), modifying 'y' directly."),
         
        ("floating-point comparison trap",
         "double x = 0.1 + 0.2;\nif (x == 0.3) {\n  cout << \"Equal\";\n} else {\n  cout << \"Not Equal\";\n}",
         "Not Equal", ["Equal", "Not Equal", "Runtime Error", "Compilation Error"], "B", "Floating point representations cannot store fractions like 0.1 and 0.2 precisely in binary. 0.1 + 0.2 yields 0.30000000000000004, which fails exact equality comparison.")
    ]
    for i in range(count):
        trap_type, code, correct, opts, ans_letter, exp = random.choice(traps)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"{comp} Technical Trap: C++ {trap_type.capitalize()}"
        scenario = f"Predict the output of the code block. Watch out for standard interviewer traps!"
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        new_ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(9, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": code,
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": new_ans_letter,
            "explanation": f"Correct Choice: {new_ans_letter}. {exp}",
            "topic": "Miscellaneous",
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 10: ADVANCED GRAPH QUESTIONS ---
def generate_advanced_graphs(count):
    questions = []
    scenarios = [
        ("topological sorting", "uniquely sorting vertices in a directed acyclic graph (DAG) such that for edge u->v, u comes before v", "Kahn's algorithm using in-degrees and queue", "O(V + E) time", ["O(V + E) time", "O(V^2) time", "O(V log V) time", "O(E log V) time"], "A", "Kahn's algorithm performs topological sort in O(V + E) by tracking in-degrees and removing vertices with 0 in-degree."),
        ("Dijkstra's Algorithm", "finding single-source shortest paths on graphs with positive weights", "time complexity using min-heap priority queue", "O((V + E) log V)", ["O(V^2)", "O((V + E) log V)", "O(E + V log V)", "O(V + E)"], "B", "Using a binary min-heap, Dijkstra takes O(E log V) for edge relaxations and O(V log V) for vertex extractions, resulting in O((V + E) log V) time."),
        ("Tarjan's algorithm", "identifying strongly connected components (SCCs) in a directed graph", "the key parameters tracked per node", "DFS index and low-link value", ["DFS index and low-link value", "in-degree count", "shortest path distance", "visited state only"], "A", "Tarjan's SCC algorithm assigns a discovery DFS index and tracks the low-link value (minimum index reachable from that node) to locate SCC root nodes.")
    ]
    for i in range(count):
        topic, desc, prop, correct, opts, ans_letter, exp = random.choice(scenarios)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"{comp} Advanced Graph Round: {topic}"
        scenario = f"For {desc}, what is the {prop}?"
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        new_ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(10, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": "",
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": new_ans_letter,
            "explanation": f"Correct Choice: {new_ans_letter}. {exp}",
            "topic": "Graphs",
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 11: ADVANCED TREE QUESTIONS ---
def generate_advanced_trees(count):
    questions = []
    scenarios = [
        ("Lowest Common Ancestor (LCA) in a BST", "finding the node where paths to nodes P and Q split", "LCA runtime", "O(H) where H is height of BST", ["O(H) where H is height of BST", "O(N) always", "O(1) auxiliary time", "O(N log N) time"], "A", "In a BST, we can find LCA in O(H) time by traversing from the root and choosing left or right based on whether P and Q are smaller or larger than root->val."),
        ("Segment Tree with lazy propagation", "range sum queries and range additions", "time complexity", "O(log N)", ["O(log N)", "O(N)", "O(1)", "O(N log N)"], "A", "Lazy propagation ensures range updates do not force updates to all leaves immediately, keeping the runtime capped at O(log N) for both queries and updates."),
        ("BST validation", "checking if a binary tree satisfies the BST property", "correct traversal method", "In-order traversal yielding strictly increasing values", ["In-order traversal yielding strictly increasing values", "Pre-order traversal yielding decreasing values", "Post-order traversal matching level order", "Level-order traversal having odd keys first"], "A", "An in-order traversal of a valid Binary Search Tree (BST) visits nodes in strictly sorted ascending order.")
    ]
    for i in range(count):
        topic, desc, prop, correct, opts, ans_letter, exp = random.choice(scenarios)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"{comp} Advanced Tree Round: {topic}"
        scenario = f"For {desc}, what is the {prop}?"
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        new_ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(11, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": "",
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": new_ans_letter,
            "explanation": f"Correct Choice: {new_ans_letter}. {exp}",
            "topic": "Trees" if "segment" not in topic.lower() else "Segment Trees",
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 12: DYNAMIC PROGRAMMING CONCEPTS ---
def generate_dp(count):
    questions = []
    scenarios = [
        ("Longest Common Subsequence (LCS)", "DP state recurrence relation when string characters match `S1[i-1] == S2[j-1]`", "correct recurrence relation", "dp[i][j] = dp[i-1][j-1] + 1", ["dp[i][j] = dp[i-1][j-1] + 1", "dp[i][j] = max(dp[i-1][j], dp[i][j-1])", "dp[i][j] = dp[i-1][j] + dp[i][j-1]", "dp[i][j] = dp[i-1][j-1]"], "A", "If the characters at the current pointers match, the match extends the LCS of the prefixes by 1 node, so we look up `dp[i-1][j-1] + 1`."),
        ("0-1 Knapsack Problem", "DP state recurrence when deciding to include or exclude item `i` with weight `w` and value `v`", "correct recurrence relation", "dp[i][j] = max(dp[i-1][j], dp[i-1][j-w] + v)", ["dp[i][j] = max(dp[i-1][j], dp[i-1][j-w] + v)", "dp[i][j] = dp[i-1][j] + dp[i][j-w] + v", "dp[i][j] = min(dp[i-1][j], dp[i-1][j-w] + v)", "dp[i][j] = dp[i-1][j-w]"], "A", "The choice is between excluding the item (value `dp[i-1][j]`) or including the item (value `dp[i-1][j-w] + v`), selecting the maximum of the two options."),
        ("Longest Increasing Subsequence (LIS)", "time complexity optimization using binary search (patience sorting)", "optimal time complexity", "O(N log N)", ["O(N log N)", "O(N^2)", "O(N)", "O(N^3)"], "A", "While LIS has a standard O(N^2) dynamic programming solution, it can be optimized to O(N log N) by maintaining a tail array and performing binary search to insert/replace values.")
    ]
    for i in range(count):
        topic, desc, prop, correct, opts, ans_letter, exp = random.choice(scenarios)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"{comp} DP Round: {topic}"
        scenario = f"For the {desc}, what is the {prop}?"
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        new_ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(12, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": "",
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": new_ans_letter,
            "explanation": f"Correct Choice: {new_ans_letter}. {exp}",
            "topic": "Dynamic Programming",
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 13: C++ STL & INTERVIEW QUESTIONS ---
def generate_cpp_interview(count):
    questions = []
    scenarios = [
        ("std::vector capacity doubling", "vector element pushes exceed current capacity limit", "reallocation behavior", "doubles capacity and reallocates memory", ["doubles capacity and reallocates memory", "allocates separate node block like list", "throws out_of_range compile error", "reduces size to fit index"], "A", "std::vector guarantees contiguous storage. When capacity is exceeded, it allocates a new larger buffer (usually double the size), moves existing elements, and frees old memory, causing O(N) reallocation overhead occasionally (O(1) amortized)."),
        ("std::map vs std::unordered_map", "worst-case search time complexity comparison", "worst-case complexities respectively", "O(log N) and O(N)", ["O(log N) and O(N)", "O(1) and O(log N)", "O(log N) and O(1)", "O(N) and O(N)"], "A", "std::map is built as a balanced BST (Red-Black Tree), ensuring O(log N) search always. std::unordered_map uses a hash table, which runs in O(1) average but can degrade to O(N) in the worst case if hash collisions force elements into a single bucket."),
        ("const pointers in C++", "`const int* p` versus `int* const p` declarations", "the semantic difference", "`const int* p` makes value constant; `int* const p` makes address constant", ["`const int* p` makes value constant; `int* const p` makes address constant", "`const int* p` makes address constant; `int* const p` makes value constant", "both statements are identical in syntax", "neither statement restricts modifications"], "A", "In `const int* p`, the value pointed to is read-only. In `int* const p`, the pointer address is constant and cannot point to another variable address.")
    ]
    for i in range(count):
        topic, desc, prop, correct, opts, ans_letter, exp = random.choice(scenarios)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"{comp} C++ STL Trap: {topic}"
        scenario = f"Under C++ standards, what is the behavior of {desc}?"
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        new_ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(13, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": "",
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": new_ans_letter,
            "explanation": f"Correct Choice: {new_ans_letter}. {exp}",
            "topic": "Miscellaneous",
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

# --- CATEGORY 14: TECHNICAL SCREENING SPECIALISTS ---
def generate_technical_screening(count):
    questions = []
    scenarios = [
        ("Amazon Screening: Rotten Oranges", "finding the minimum time to rot all oranges in a grid using BFS", "optimal complexity", "O(R * C) time and O(R * C) space", ["O(R * C) time and O(R * C) space", "O((R+C) log(R*C)) time", "O(R^2 * C^2) nested scan", "O(1) auxiliary space DFS"], "A", "This uses multi-source BFS. We push all initially rotten oranges into the queue. The time complexity is O(R * C) since each cell is processed at most once, and space is O(R * C) for the queue."),
        ("Microsoft Screening: Singly Unique Element", "finding the element that appears once in a sorted array where others appear twice", "optimal complexity", "O(log N) time", ["O(log N) time", "O(N) XOR search", "O(N log N) sorting", "O(N^2) comparison"], "A", "Since the array is sorted, we can partition it by checking index parity. If mid is even and arr[mid] == arr[mid+1], the unique element is on the right, allowing us to perform binary search in O(log N) time."),
        ("Adobe Screening: Merge Intervals", "merging overlapping intervals in a calendar booking application", "optimal complexity", "O(N log N) time", ["O(N log N) time", "O(N^2) interval intersection checks", "O(N) single pass scan", "O(N log N) space"], "A", "We must sort the intervals by their start times first in O(N log N) time. Afterward, a single linear scan of O(N) merges the intervals, resulting in O(N log N) overall runtime.")
    ]
    for i in range(count):
        topic, desc, prop, correct, opts, ans_letter, exp = random.choice(scenarios)
        comp = random.choice(COMPANIES)
        diff = random.choice(DIFFICULTIES)
        
        title = f"Technical screening: {topic}"
        scenario = f"For the typical screening challenge '{desc}', which approach achieves the optimal complexity?"
        
        shuffled_opts = list(opts)
        random.shuffle(shuffled_opts)
        new_ans_letter = chr(65 + shuffled_opts.index(correct))
        
        questions.append({
            "id": generate_stable_id(14, i),
            "question": f"{title}\n\n{scenario}",
            "title": title,
            "scenario": scenario,
            "code": "",
            "options": [f"{chr(65+idx)}) {val}" for idx, val in enumerate(shuffled_opts)],
            "answer": new_ans_letter,
            "explanation": f"Correct Choice: {new_ans_letter}. {exp}",
            "topic": "Arrays" if "oranges" not in desc.lower() else "Graphs",
            "difficulty": diff,
            "companyRelevance": [comp]
        })
    return questions

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, '..', 'src', 'data', 'mcq-questions.json')
    
    # 1. Load baseline questions
    baseline_questions = []
    if os.path.exists(output_path):
        print(f"Reading baseline questions from: {output_path}")
        with open(output_path, 'r', encoding='utf-8') as f:
            baseline_questions = json.load(f)
            
    print(f"Loaded {len(baseline_questions)} baseline questions.")
    
    # Clean baseline questions to prevent stale duplicates from generated prefix IDs
    baseline_questions = [q for q in baseline_questions if not q["id"].startswith("gen-c")]
    print(f"Retained {len(baseline_questions)} baseline human-curated questions (excluding old generated ones).")

    # Target: Generate ~130 questions per category * 14 categories = 1820 questions
    category_target = 130
    
    generated_questions = []
    generated_questions.extend(generate_dsa_theory(category_target))
    generated_questions.extend(generate_output_prediction(category_target))
    generated_questions.extend(generate_recursion_trace(category_target))
    generated_questions.extend(generate_bug_hunting(category_target))
    generated_questions.extend(generate_time_complexity(category_target))
    generated_questions.extend(generate_space_complexity(category_target))
    generated_questions.extend(generate_best_algorithm(category_target))
    generated_questions.extend(generate_dry_run(category_target))
    generated_questions.extend(generate_interview_traps(category_target))
    generated_questions.extend(generate_advanced_graphs(category_target))
    generated_questions.extend(generate_advanced_trees(category_target))
    generated_questions.extend(generate_dp(category_target))
    generated_questions.extend(generate_cpp_interview(category_target))
    generated_questions.extend(generate_technical_screening(category_target))
    
    print(f"Generated {len(generated_questions)} new parameterized questions across 14 categories.")
    
    # Combined dataset
    final_questions = list(baseline_questions) + generated_questions
    
    # Shuffling to interleave categories, topics, and difficulties to simulate a real OA
    random.shuffle(final_questions)
    
    # Keep original stable IDs (docx-q* for docx baseline, sup-q* for supplemental baseline, and gen-c* for generated questions)
    print(f"Consolidated final dataset containing: {len(final_questions)} total questions.")
    
    # 4. Save Final Dataset
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, indent=2)
        
    print(f"Successfully wrote expanded database to: {output_path}")

    # Topic Coverage Analysis Report
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

if __name__ == "__main__":
    main()
