from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
SimpleDocTemplate, Paragraph, Spacer, PageBreak,
Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import Flowable
# ── PDF setup ────────────────────────────────────────────────────────────────
OUTPUT = "/mnt/user-data/outputs/DSA_MCQ_Bank_200Q.pdf"
doc = SimpleDocTemplate(
OUTPUT,
pagesize=A4,
leftMargin=2*cm, rightMargin=2*cm,
topMargin=2.2*cm, bottomMargin=2.2*cm,
title="DSA MCQ Bank – 200 Questions",
author="Principal Software Engineer & Technical Interview Architect",
)
W, H = A4
# ── Colour palette ────────────────────────────────────────────────────────────
C_DEEP = colors.HexColor("#1A237E") # deep indigo
C_MED = colors.HexColor("#283593")
C_ACCENT = colors.HexColor("#E53935") # red accent
C_GOLD = colors.HexColor("#F9A825")
C_LIGHT = colors.HexColor("#E8EAF6") # pale indigo bg
C_CODE = colors.HexColor("#1E1E1E") # dark code bg
C_CTEXT = colors.HexColor("#D4D4D4") # code text
C_GREEN = colors.HexColor("#1B5E20")
C_GREY = colors.HexColor("#546E7A")
styles = getSampleStyleSheet()
def S(name, **kw):
return ParagraphStyle(name, **kw)
sTitle = S("sTitle", fontSize=26, leading=32, textColor=C_DEEP,
alignment=TA_CENTER, fontName="Helvetica-Bold", spaceAfter=6)
sSubtitle = S("sSubtitle", fontSize=12, leading=16, textColor=C_MED,
alignment=TA_CENTER, fontName="Helvetica", spaceAfter=4)
sMeta = S("sMeta", fontSize=9, leading=12, textColor=C_GREY,
alignment=TA_CENTER, fontName="Helvetica-Oblique", spaceAfter=20)
sTocHead = S("sTocHead", fontSize=15, leading=19, textColor=C_DEEP,
fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=6)
sTocSec = S("sTocSec", fontSize=10, leading=14, textColor=C_MED,
fontName="Helvetica-Bold", spaceBefore=4, spaceAfter=2)
sTocItem = S("sTocItem", fontSize=9, leading=12, textColor=colors.HexColor("#37474F"),
fontName="Helvetica", leftIndent=12, spaceAfter=1)
sQNum = S("sQNum", fontSize=11, leading=14, textColor=C_ACCENT,
fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=2)
sQTitle = S("sQTitle", fontSize=10.5, leading=14, textColor=C_DEEP,
fontName="Helvetica-Bold", spaceAfter=3)
sBody = S("sBody", fontSize=9.5, leading=14, textColor=colors.HexColor("#212121"),
fontName="Helvetica", spaceAfter=3, alignment=TA_JUSTIFY)
sCode = S("sCode", fontSize=8, leading=11, textColor=C_CTEXT,
fontName="Courier", backColor=C_CODE,
leftIndent=8, rightIndent=8, spaceBefore=4, spaceAfter=4,
borderPadding=(4,4,4,4))
sOpt = S("sOpt", fontSize=9.5, leading=13, textColor=colors.HexColor("#37474F"),
fontName="Helvetica", leftIndent=14, spaceAfter=1)
sAns = S("sAns", fontSize=9.5, leading=13, textColor=C_GREEN,
fontName="Helvetica-Bold", leftIndent=14, spaceAfter=1)
sExp = S("sExp", fontSize=9, leading=13, textColor=colors.HexColor("#4A4A4A"),
fontName="Helvetica-Oblique", leftIndent=14, spaceAfter=6)
sSec = S("sSec", fontSize=16, leading=20, textColor=colors.white,
fontName="Helvetica-Bold", alignment=TA_CENTER, spaceBefore=14, spaceAfter=8)
# ── Helpers ───────────────────────────────────────────────────────────────────
def hr(color=C_LIGHT, thickness=1):
return HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=4, spaceBefore=4)
def section_banner(text, color=C_DEEP):
data = [[Paragraph(text, sSec)]]
t = Table(data, colWidths=[W - 4*cm])
t.setStyle(TableStyle([
("BACKGROUND", (0,0), (-1,-1), color),
("TOPPADDING", (0,0), (-1,-1), 8),
("BOTTOMPADDING", (0,0), (-1,-1), 8),
("LEFTPADDING", (0,0), (-1,-1), 6),
("RIGHTPADDING", (0,0), (-1,-1), 6),
("ROUNDEDCORNERS", [6]),
]))
return t
def q_block(num, topic, title, scenario, code, options, answer, explanation, lang="cpp"):
items = []
items.append(Paragraph(f"Q{num}.", sQNum))
items.append(Paragraph(f"[{topic}] — {title}", sQTitle))
if scenario:
items.append(Paragraph(scenario, sBody))
if code:
lines = code.strip().split("\n")
for line in lines:
safe = line.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
items.append(Paragraph(safe if safe.strip() else "&nbsp;", sCode))
items.append(Spacer(1, 4))
for opt in options:
marker = "✓ " if opt.startswith("✓") else " "
text = opt.lstrip("✓ ").strip()
if opt.startswith("✓"):
items.append(Paragraph(f"<b>{marker}{text}</b>", sAns))
else:
items.append(Paragraph(f"{marker}{text}", sOpt))
items.append(Paragraph(f"<i>Explanation: {explanation}</i>", sExp))
items.append(hr())
return KeepTogether(items)
# ════════════════════════════════════════════════════════════════════════════
# QUESTION DATA (200 questions)
# ════════════════════════════════════════════════════════════════════════════
questions = [
# ── SECTION 1 : TREES & ADVANCED HIERARCHIES (Q1–Q50) ────────────────────
dict(num=1, topic="Binary Tree", title="Post-order Traversal Output Prediction",
scenario="Given the following binary tree and post-order traversal code, what is the printed output?",
code="""\
struct Node { int val; Node *left, *right; };
void postorder(Node* root) {
if (!root) return;
postorder(root->left);
postorder(root->right);
cout << root->val << " ";
}
// Tree: root=1, left=2(left=4,right=5), right=3(left=6,right=7)""",
options=["A) 1 2 3 4 5 6 7","✓ B) 4 5 2 6 7 3 1","C) 4 2 5 1 6 3 7","D) 1 2 4 5 3 6 7"],
answer="B",explanation="Post-order visits left subtree, right subtree, then root. So: 4,5,2,6,7,3,1."),
dict(num=2, topic="BST", title="BST Insertion Order & Height",
scenario="Keys inserted in order: 50, 30, 70, 20, 40, 60, 80. What is the height of the resulting BST?",
code="",
options=["A) 2","✓ B) 3","C) 4","D) 7"],
answer="B",explanation="The tree is perfectly balanced with 3 levels (root=50, children=30,70, grandchildren=20,40,60,80). Height = number of edges on longest path = 2, but since height is often counted as number of nodes, it's 3."),
dict(num=3, topic="BST", title="In-order Successor Bug Hunt",
scenario="Find the bug in the function that returns the in-order successor of a node in a BST:",
code="""\
Node* inorderSuccessor(Node* root, Node* p) {
Node* successor = nullptr;
while (root) {
if (p->val < root->val) { // BUG HERE?
successor = root;
root = root->left;
} else {
root = root->right; // misses equal case
}
}
return successor;
}""",
options=["A) Should use p->val <= root->val in condition",
"✓ B) The else branch should be root = root->right only when p->val >= root->val, missing the case where node equals root causing infinite loop or wrong answer",
"C) successor should be initialized to p->right",
"D) No bug; the function is correct"],
answer="B",explanation="When p->val == root->val, the code falls into else and goes right, skipping assignment of successor. The condition should be p->val < root->val to correctly track the last left-turn ancestor."),
dict(num=4, topic="Binary Tree", title="Level-order BFS Space Complexity",
scenario="For a complete binary tree with n nodes, what is the worst-case space complexity of BFS level-order traversal using a queue?",
code="",
options=["A) O(log n)","B) O(n)","✓ C) O(n/2) = O(n)","D) O(1)"],
answer="C",explanation="The last level of a complete binary tree holds ceil(n/2) nodes, all of which may be in the queue simultaneously, giving O(n) space."),
dict(num=5, topic="Trie", title="Trie Insert & Search Complexity",
scenario="A Trie stores strings over an alphabet of size Σ. What is the time complexity to insert and search a string of length L?",
code="",
options=["✓ A) O(L) for both insert and search","B) O(L * Σ)","C) O(log n) where n is number of strings","D) O(L^2)"],
answer="A",explanation="Each character requires traversing one node level. Insert and search both walk L levels, so both are O(L), independent of the number of stored strings."),
dict(num=6, topic="Trie", title="Autocomplete Engine Design",
scenario="You are building an autocomplete system that must return all words with a given prefix in under 10ms for a dictionary of 10 million words. Which data structure is most appropriate?",
code="",
options=["A) Sorted array with binary search","B) Hash map keyed by prefix","✓ C) Compressed Trie (Patricia/Radix Trie) with DFS collection","D) B-Tree"],
answer="C",explanation="A compressed Trie lets you locate the prefix node in O(L) and then DFS-collect all completions. A hash map would need to store every prefix explicitly. Binary search cannot group by prefix efficiently at scale."),
dict(num=7, topic="Segment Tree", title="Range Sum Query Output",
scenario="A segment tree is built on array A = [1, 3, 5, 7, 9, 11]. What does query(2, 4) (0-indexed, inclusive) return?",
code="",
options=["A) 15","✓ B) 21","C) 19","D) 17"],
answer="B",explanation="A[2]+A[3]+A[4] = 5+7+9 = 21."),
dict(num=8, topic="Segment Tree", title="Lazy Propagation Purpose",
scenario="Why is lazy propagation added to a segment tree?",
code="",
options=["A) To reduce space from O(4n) to O(2n)",
"✓ B) To defer range updates, reducing range-update + range-query to O(log n) instead of O(n log n)",
"C) To allow deletion in O(1)",
"D) To support negative values"],
answer="B",explanation="Without lazy propagation, a range update touches O(n) nodes. Lazy propagation marks nodes for deferred update, achieving O(log n) per range update."),
dict(num=9, topic="AVL Tree", title="Rotation After Insertion — Left-Right Case",
scenario="Insert keys 10, 5, 7 (in that order) into an empty AVL tree. Which rotations are performed?",
code="",
options=["A) Single left rotation at root",
"B) Single right rotation at root",
"✓ C) Right rotation at node 5, then left rotation at node 10",
"D) No rotation needed"],
answer="C",explanation="Inserting 7 creates a Left-Right (LR) imbalance at node 10. Fix: right-rotate at 5 (making 7 the left child of 10), then left-rotate at 10. Result: 7 becomes root with 5 and 10 as children."),
dict(num=10, topic="AVL Tree", title="AVL vs BST Worst-case Search",
scenario="In the absolute worst case, how many comparisons does searching an AVL tree of n nodes require compared to a degenerate BST?",
code="",
options=["A) AVL: O(n), BST: O(n)","✓ B) AVL: O(log n), BST: O(n)","C) AVL: O(log n), BST: O(log n)","D) AVL: O(sqrt(n)), BST: O(n)"],
answer="B",explanation="AVL maintains a height bound of 1.44*log2(n), so search is always O(log n). A degenerate BST (all insertions in sorted order) degrades to a linked list with O(n) search."),
dict(num=11, topic="Red-Black Tree", title="Structural Property Enforcement",
scenario="Which of the following is NOT a required property of a Red-Black Tree?",
code="",
options=["A) Root is always black",
"B) Red node's children must both be black",
"✓ C) All nodes at the same depth must have the same color",
"D) Every path from a node to its NIL descendants has the same number of black nodes"],
answer="C",explanation="Red-black trees do NOT require same-depth nodes to be the same color. The actual constraints are: root is black, no consecutive red nodes, and equal black-height on every root-to-leaf path."),
dict(num=12, topic="Binary Tree", title="Diameter Computation Bug",
scenario="Identify the bug in this tree diameter function:",
code="""\
int height(Node* n) {
if (!n) return 0;
return 1 + max(height(n->left), height(n->right));
}
int diameter(Node* root) {
if (!root) return 0;
int lh = height(root->left);
int rh = height(root->right);
int throughRoot = lh + rh;
int leftDiam = diameter(root->left);
int rightDiam = diameter(root->right);
return max({throughRoot, leftDiam, rightDiam});
}""",
options=["A) height() should return -1 for null nodes",
"✓ B) O(n^2) time — height is recomputed for every node; fix by computing height and diameter in a single DFS pass",
"C) throughRoot should be lh + rh + 1",
"D) Should use BFS not recursion"],
answer="B",explanation="The function is logically correct but inefficient. height() is called at every node, each call costing O(n), giving O(n^2) overall. The canonical fix merges both computations in one recursive pass, achieving O(n)."),
dict(num=13, topic="Binary Tree", title="Serialize / Deserialize Round Trip",
scenario="Which delimiter-based pre-order serialization correctly handles null nodes for a unique round-trip?",
code="""\
// Option A: '1,2,#,#,3,#,#' (# for null)
// Option B: '1,2,3' (only non-null)
// Option C: '1,2,#,3' (partial nulls)
// Option D: '#,1,2,3' (root last)""",
options=["✓ A) Option A — pre-order with explicit null markers is sufficient for unique reconstruction",
"B) Option B — non-null values only",
"C) Option C — partial nulls",
"D) Option D — root last"],
answer="A",explanation="Pre-order with explicit null markers encodes structural information needed for unique reconstruction. Omitting nulls is ambiguous: '1,2,3' could represent multiple different trees."),
dict(num=14, topic="Binary Tree", title="LCA in Binary Tree — Complexity",
scenario="What is the time and space complexity of the classic recursive Lowest Common Ancestor (LCA) algorithm for a binary tree of n nodes?",
code="",
options=["A) O(log n) time, O(1) space",
"✓ B) O(n) time, O(h) space where h is height",
"C) O(n log n) time, O(n) space",
"D) O(h) time, O(1) space"],
answer="B",explanation="The algorithm traverses all n nodes in the worst case (target nodes may be at leaves). Recursion stack depth is O(h), the tree height (O(n) worst case, O(log n) for balanced)."),
dict(num=15, topic="BST", title="Kth Smallest Element Strategy",
scenario="What is the most efficient way to find the k-th smallest element in a BST?",
code="",
options=["A) Store all elements in an array and sort — O(n log n)",
"✓ B) In-order traversal stopping at k-th node — O(h + k)",
"C) Binary search on sorted keys — O(log n)",
"D) BFS level-by-level — O(n)"],
answer="B",explanation="In-order traversal of a BST yields sorted order. Stop when the k-th node is visited. This costs O(h) to reach the leftmost node plus O(k) to count, totalling O(h+k). With augmented subtree sizes, O(h) is achievable."),
dict(num=16, topic="Trie", title="Memory Overhead of Standard Trie",
scenario="A Trie node for 26-letter alphabet stores an array of 26 pointers. If each pointer is 8 bytes, what is the memory per node?",
code="",
options=["A) 26 bytes","B) 52 bytes","✓ C) 208 bytes","D) 128 bytes"],
answer="C",explanation="26 pointers × 8 bytes each = 208 bytes per node. This is why compressed/ternary tries are preferred for memory-constrained applications."),
dict(num=17, topic="Segment Tree", title="Build Time Complexity",
scenario="What is the time complexity to build a segment tree over an array of n elements?",
code="",
options=["A) O(n log n)","✓ B) O(n)","C) O(n^2)","D) O(log n)"],
answer="B",explanation="A segment tree has at most 4n nodes. Building it processes each node once in a bottom-up pass, giving O(n) total work."),
dict(num=18, topic="Binary Tree", title="Morris Traversal Space Complexity",
scenario="Morris in-order traversal achieves O(1) extra space by temporarily modifying tree links. What is its time complexity?",
code="",
options=["A) O(n log n)","✓ B) O(n)","C) O(n^2)","D) O(h)"],
answer="B",explanation="Each edge is traversed at most twice (once to create the threaded link, once to restore it), giving O(n) overall despite the non-obvious flow."),
dict(num=19, topic="AVL Tree", title="Maximum Nodes at Height h",
scenario="What is the minimum number of nodes in an AVL tree of height h?",
code="",
options=["A) 2^h","✓ B) Fibonacci-like: N(h) = N(h-1) + N(h-2) + 1, with N(0)=1, N(1)=2","C) h^2","D) 2h+1"],
answer="B",explanation="To minimize nodes at height h, one subtree has height h-1 and the other h-2 (AVL balance factor = 1). This recurrence produces Fibonacci-like growth, proving AVL height is O(log n)."),
dict(num=20, topic="Trie", title="Suffix Trie vs Suffix Array",
scenario="For pattern matching in a text of length n, a Suffix Trie uses O(n^2) space. What does a Suffix Array use?",
code="",
options=["A) O(n^2)","✓ B) O(n)","C) O(n log n)","D) O(n * alphabet_size)"],
answer="B",explanation="A suffix array stores n integers (one per suffix) requiring O(n) space, making it far more memory-efficient than a suffix trie for large texts."),
dict(num=21, topic="Binary Tree", title="Zigzag Level-Order Traversal",
scenario="What data structure enables zigzag (spiral) level-order traversal most naturally?",
code="",
options=["A) Single queue","✓ B) Two stacks alternating direction per level","C) Priority queue","D) Circular buffer"],
answer="B",explanation="Two stacks allow you to push children in left-right or right-left order alternately, naturally producing zigzag output without reversing arrays."),
dict(num=22, topic="BST", title="Deletion of Node with Two Children",
scenario="When deleting a node with two children from a BST, what replaces it?",
code="",
options=["A) Its left child","B) Its right child","✓ C) Its in-order successor or predecessor","D) The root"],
answer="C",explanation="The standard approach replaces the deleted node's value with its in-order successor (smallest in right subtree) or predecessor (largest in left subtree), then deletes that simpler node."),
dict(num=23, topic="Segment Tree", title="Point Update Time Complexity",
scenario="Given a segment tree on n elements, what is the time complexity for a single point update?",
code="",
options=["✓ A) O(log n)","B) O(n)","C) O(1)","D) O(n log n)"],
answer="A",explanation="A point update walks from the leaf to the root, updating O(log n) nodes along the path."),
dict(num=24, topic="Binary Tree", title="Path Sum Root-to-Leaf Bug",
scenario="What is the bug in this path-sum function?",
code="""\
bool hasPathSum(Node* root, int target) {
if (!root) return target == 0;
return hasPathSum(root->left, target - root->val) ||
hasPathSum(root->right, target - root->val);
}""",
options=["✓ A) Returns true for internal nodes when remaining sum is 0 — must check both children are null before returning true",
"B) Should subtract root->val before checking null",
"C) Should use && not ||",
"D) No bug"],
answer="A",explanation="If an internal node's remaining sum becomes 0, the null check on its children returns true even though we haven't reached a leaf. Fix: if(!root->left && !root->right) return target == root->val; at the leaf check."),
dict(num=25, topic="Binary Tree", title="Count Complete Tree Nodes Efficiently",
scenario="What is the best time complexity to count nodes in a complete binary tree?",
code="",
options=["A) O(n)","B) O(log n)","✓ C) O(log^2 n)","D) O(n log n)"],
answer="C",explanation="Compare the height of leftmost and rightmost paths: if equal, the tree is a perfect binary tree and has 2^h - 1 nodes. Otherwise recurse on subtrees. Each comparison is O(log n), and recursion depth is O(log n), giving O(log^2 n)."),
dict(num=26, topic="Red-Black Tree", title="Insertion Color Fix Rule",
scenario="During Red-Black Tree insertion, if the uncle of the newly inserted node is RED, what is the fix?",
code="",
options=["✓ A) Recolor parent and uncle to black, grandparent to red, then re-check grandparent",
"B) Perform a single rotation at the grandparent",
"C) Perform a double rotation",
"D) Delete the uncle"],
answer="A",explanation="When uncle is red, no structural rotation is needed — simply recolor parent and uncle black, grandparent red, and propagate the fix upward from the grandparent."),
dict(num=27, topic="Binary Tree", title="Vertical Order Traversal",
scenario="For vertical order traversal of a binary tree, which combination of data structures gives O(n log n) time?",
code="",
options=["A) Stack + array","✓ B) Map<int, vector> keyed by horizontal distance + BFS queue","C) Two queues","D) DFS + linked list"],
answer="B",explanation="Assign horizontal distance (hd) to each node: root=0, left child=hd-1, right child=hd+1. Use BFS to process level-by-level. A sorted map on hd collects nodes per column. Total: O(n log n) due to map insertions."),
dict(num=28, topic="Segment Tree", title="Maximum Subarray with Segment Tree",
scenario="A segment tree node storing (maxPrefix, maxSuffix, maxSum, total) for maximum subarray queries requires how many merging operations per query?",
code="",
options=["A) O(1)","✓ B) O(log n) merge steps, each O(1)","C) O(n)","D) O(log^2 n)"],
answer="B",explanation="Each node aggregation is O(1). A query touches O(log n) nodes, each merged in O(1), giving O(log n) total."),
dict(num=29, topic="Trie", title="Word Search II — Trie vs Brute Force",
scenario="In the 'Word Search II' problem (find all words from a list on a 2D board), using a Trie instead of hashing each word gives what improvement?",
code="",
options=["A) No improvement","✓ B) Allows pruning search branches when no word shares the current prefix, reducing backtracking","C) Reduces space to O(1)","D) Allows parallel search"],
answer="B",explanation="With a Trie, during DFS on the board we can immediately stop a path if the current character sequence doesn't match any Trie node, pruning invalid branches early — a significant practical speedup."),
dict(num=30, topic="Binary Tree", title="Flatten Binary Tree to Linked List",
scenario="Flattening a binary tree to a linked list in-place (pre-order) in O(n) time with O(1) extra space uses which technique?",
code="",
options=["A) BFS with queue","B) Extra stack for pre-order","✓ C) Reverse post-order (right, left, root) with a 'prev' pointer","D) Morris traversal"],
answer="C",explanation="By processing nodes in reverse pre-order (right subtree first, then left, then root), we can set node->right = prev and null node->left, linking nodes in pre-order from tail to head without extra space."),
dict(num=31, topic="AVL Tree", title="Right-Right Case Rotation",
scenario="Keys inserted into an empty AVL tree: 10, 20, 30. What single rotation fixes the imbalance?",
code="",
options=["✓ A) Left rotation at node 10 (RR case)","B) Right rotation at node 20","C) Left-Right double rotation","D) No rotation needed"],
answer="A",explanation="Inserting 30 causes an RR imbalance at node 10 (balance factor = -2). A single left rotation at 10 makes 20 the new subtree root with 10 as left child and 30 as right child."),
dict(num=32, topic="Binary Tree", title="Invert Binary Tree Complexity",
scenario="What are the time and space complexities of recursively inverting a binary tree?",
code="",
options=["A) O(n) time, O(1) space","✓ B) O(n) time, O(h) space","C) O(n log n) time, O(h) space","D) O(h) time, O(h) space"],
answer="B",explanation="Every node is visited once for O(n) time. The call stack depth equals the tree height h, giving O(h) space (O(n) worst case for skewed trees, O(log n) for balanced)."),
dict(num=33, topic="BST", title="Range Query in BST",
scenario="Find all keys in BST in range [L, R]. What is the time complexity?",
code="",
options=["A) O(n)","✓ B) O(h + k) where k is the number of keys in range","C) O(log n)","D) O(n log n)"],
answer="B",explanation="Navigate to L in O(h) time, then in-order traverse collecting k keys in O(k). Total: O(h+k). For a balanced BST, h=O(log n)."),
dict(num=34, topic="Segment Tree", title="Fenwick Tree vs Segment Tree",
scenario="For range sum queries and point updates only, why is a Fenwick Tree (BIT) preferred over a Segment Tree?",
code="",
options=["A) Fenwick trees support range updates natively","✓ B) Fenwick trees have O(log n) operations with smaller constants and simpler O(n) implementation","C) Fenwick trees have O(1) query","D) Fenwick trees require less pre-computation"],
answer="B",explanation="Both structures achieve O(log n) per operation, but a Fenwick tree's index arithmetic is simpler, cache-friendlier, and requires roughly half the code and memory of a segment tree for this restricted use case."),
dict(num=35, topic="Binary Tree", title="Cousins in Binary Tree",
scenario="Two nodes are cousins if they are at the same depth but have different parents. What BFS metadata suffices to check this?",
code="",
options=["A) Only depth","B) Only parent","✓ C) Both depth and parent for each node","D) Neither — DFS is required"],
answer="C",explanation="Nodes are cousins iff depth(a)==depth(b) AND parent(a)!=parent(b). BFS naturally tracks depth (level); you augment with parent references to distinguish cousins from siblings."),
dict(num=36, topic="Trie", title="Compressed Trie Space Advantage",
scenario="A compressed (Patricia) Trie for n keys with average key length L reduces node count from O(n*L) to what?",
code="",
options=["A) O(n*L)","✓ B) O(n)","C) O(L)","D) O(n + L)"],
answer="B",explanation="A Patricia Trie merges chains of single-child nodes into single edges. The number of internal nodes is at most n-1 and the number of leaves is n, giving O(n) nodes total regardless of key length."),
dict(num=37, topic="Binary Tree", title="BST Validation Using Range",
scenario="The correct approach to validate a BST uses:",
code="""\
bool isValid(Node* n, long minVal, long maxVal) {
if (!n) return true;
if (n->val <= minVal || n->val >= maxVal) return false;
return isValid(n->left, minVal, n->val) &&
isValid(n->right, n->val, maxVal);
}""",
options=["A) Only comparing parent and child values",
"✓ B) Passing min/max bounds down the recursion — shown above",
"C) In-order traversal and checking sorted order",
"D) Both B and C are equally correct"],
answer="B",explanation="Option C (in-order check) is also valid but Option B is the canonical recursive approach shown. Only the range-propagation correctly enforces that all left-subtree values are less than the root, not just immediate children."),
dict(num=38, topic="Segment Tree", title="2D Segment Tree Use Case",
scenario="You need range sum queries on a 2D matrix where point updates occur frequently. Which structure is most appropriate?",
code="",
options=["A) 1D Segment Tree with row merging","✓ B) 2D Fenwick Tree (BIT)","C) Sparse Table","D) Trie"],
answer="B",explanation="A 2D Fenwick Tree supports O(log M * log N) point update and range sum query for an M×N matrix with O(M*N) space — better constant factors than a 2D segment tree for this specific use case."),
dict(num=39, topic="Binary Tree", title="Boundary Traversal",
scenario="Boundary traversal of a binary tree visits nodes in which order?",
code="",
options=["A) BFS order","✓ B) Left boundary (top-down), leaf nodes (left-right), right boundary (bottom-up)","C) Pre-order DFS","D) Post-order DFS"],
answer="B",explanation="Boundary traversal: (1) left boundary excluding leaves top-to-bottom, (2) all leaf nodes left-to-right, (3) right boundary excluding leaves bottom-to-top. This traces the outer perimeter of the tree."),
dict(num=40, topic="AVL Tree", title="Deletion Rotations",
scenario="After deleting a node from an AVL tree, how many rotations may be required to restore balance?",
code="",
options=["A) At most 1","B) At most 2","✓ C) O(log n) — rotations may propagate up the entire tree","D) At most 3"],
answer="C",explanation="Unlike insertion which requires at most 2 rotations, AVL deletion may require rebalancing at every ancestor up to the root, totalling O(log n) rotations."),
dict(num=41, topic="Binary Tree", title="Maximum Width of Binary Tree",
scenario="Maximum width (maximum number of nodes at any level) of a binary tree can be found using BFS in what complexity?",
code="",
options=["✓ A) O(n) time, O(n) space","B) O(n log n) time, O(1) space","C) O(n) time, O(1) space","D) O(log n) time"],
answer="A",explanation="BFS processes all n nodes once (O(n) time). The queue holds at most the widest level, which can be O(n/2) = O(n) nodes."),
dict(num=42, topic="Trie", title="XOR Maximization with Trie",
scenario="To find the maximum XOR of two numbers in an array, a bit-level Trie is built and queried. What is the time complexity?",
code="",
options=["A) O(n^2)","✓ B) O(32n) = O(n)","C) O(n log n)","D) O(n^2 log n)"],
answer="B",explanation="Building the Trie: O(32n) insertions, each O(32). Querying for each element: O(32n). Total: O(n) since 32 is the constant bit width of integers."),
dict(num=43, topic="Segment Tree", title="Offline vs Online Range Queries",
scenario="Merge Sort Tree supports online (arbitrary order) range queries in O(log^2 n). What does it sacrifice vs offline approaches?",
code="",
options=["A) Correctness","✓ B) Time constant — offline approaches (e.g., persistent segment tree) can achieve O(log n) per query","C) Space","D) It can only handle sorted input"],
answer="B",explanation="Offline methods like persistence allow O(log n) queries by reusing immutable structure versions. Merge Sort Tree is online (answers queries as they arrive) but pays O(log^2 n)."),
dict(num=44, topic="Binary Tree", title="Recover BST with Two Swapped Nodes",
scenario="Two nodes in a BST are accidentally swapped. In-order traversal will reveal them as:",
code="",
options=["A) The first and last elements","✓ B) Either one or two inversions (adjacent or non-adjacent swap)","C) The root and a leaf","D) Cannot be detected by in-order"],
answer="B",explanation="If swapped nodes are adjacent in in-order, there is one inversion (first > second). If non-adjacent, there are two inversions. The first element of the first inversion and the second element of the last inversion are the swapped nodes."),
dict(num=45, topic="Red-Black Tree", title="Black Height Guarantee",
scenario="A Red-Black Tree with black-height k has at least how many internal nodes?",
code="",
options=["A) k","B) 2k","C) 2k - 1","✓ D) 2^k - 1"],
answer="D",explanation="In a tree with black-height k, if all nodes were black (minimum nodes), it would be a perfect binary tree with height k and 2^k - 1 nodes."),
dict(num=46, topic="Binary Tree", title="Binary Tree to DLL Conversion",
scenario="Converting a binary tree to a doubly linked list in-place using in-order traversal requires what extra space?",
code="",
options=["A) O(n)","✓ B) O(h) — recursion stack only","C) O(1)","D) O(n log n)"],
answer="B",explanation="The conversion is done during in-order traversal, which uses O(h) stack space for recursion. No additional data structures are needed."),
dict(num=47, topic="Trie", title="Palindrome Pairs Using Trie",
scenario="For the 'Palindrome Pairs' problem with n words, using a Trie achieves what complexity vs brute force?",
code="",
options=["A) Both are O(n^2 * L)","✓ B) Trie: O(n * L^2), Brute Force: O(n^2 * L)","C) Trie: O(n * L), Brute Force: O(n^2)","D) Trie: O(n * L * log n), Brute Force: O(n^2 * L)"],
answer="B",explanation="With a Trie, for each word of length L, we check all O(L) prefixes and suffixes for palindrome conditions in O(L) each, giving O(L^2) per word and O(n*L^2) total. Brute force checks all n^2 pairs, each in O(L)."),
dict(num=48, topic="Binary Tree", title="Construct Tree from Inorder and Preorder",
scenario="Reconstructing a binary tree from inorder + preorder traversals. Using a hash map for inorder indices reduces complexity from O(n^2) to?",
code="",
options=["A) O(n log n)","✓ B) O(n)","C) O(n sqrt(n))","D) O(log n)"],
answer="B",explanation="With a hash map, each preorder node lookup in the inorder array is O(1). Processing n nodes with O(1) each gives O(n) total."),
dict(num=49, topic="Segment Tree", title="Merge Sort Tree Range Kth Smallest",
scenario="A Merge Sort Tree can answer 'k-th smallest in range [l,r]' in what time?",
code="",
options=["A) O(n)","B) O(log n)","✓ C) O(log^3 n) with binary search + fractional cascading","D) O(n log n)"],
answer="C",explanation="Binary search on the answer value, with each check requiring O(log^2 n) time in the Merge Sort Tree, gives O(log^3 n). With fractional cascading, it reduces to O(log^2 n)."),
dict(num=50, topic="Binary Tree", title="Threaded Binary Tree Advantage",
scenario="A threaded binary tree's primary advantage is:",
code="",
options=["A) Faster insertion","B) Reduced height","✓ C) In-order traversal without stack or recursion (O(1) space)","D) Automatic balancing"],
answer="C",explanation="Threaded trees use otherwise-null right (and sometimes left) pointers to point to the in-order successor (or predecessor). This enables stack-free, recursion-free in-order traversal in O(1) extra space."),
# ── SECTION 2 : GRAPHS & NETWORKS (Q51–Q100) ──────────────────────────────
dict(num=51, topic="BFS", title="Shortest Path in Unweighted Graph",
scenario="Why does BFS guarantee shortest path in an unweighted, undirected graph?",
code="",
options=["A) BFS visits nodes alphabetically","B) BFS uses a priority queue","✓ C) BFS expands nodes in non-decreasing order of edge count from source","D) BFS avoids cycles"],
answer="C",explanation="BFS explores all nodes at distance d before any node at distance d+1. The first time a node is discovered, it is via the fewest edges, which equals the shortest path in unweighted graphs."),
dict(num=52, topic="DFS", title="DFS Time Complexity on Sparse Graphs",
scenario="For a directed graph with V vertices and E edges, DFS runs in:",
code="",
options=["A) O(V^2)","✓ B) O(V + E)","C) O(E log V)","D) O(V * E)"],
answer="B",explanation="DFS visits each vertex once (O(V)) and traverses each edge once (O(E)), giving O(V+E). For sparse graphs (E << V^2), this is much better than O(V^2) matrix-based approaches."),
dict(num=53, topic="Dijkstra", title="Dijkstra with Negative Edges",
scenario="Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
code="",
options=["A) It cannot handle directed graphs","✓ B) Once a node is marked visited with tentative distance d, a later negative edge could yield a shorter path, which Dijkstra ignores","C) The priority queue becomes corrupted","D) It always gives the wrong answer on negative graphs"],
answer="B",explanation="Dijkstra's greedy choice assumes that the minimum tentative distance is final. Negative edges invalidate this: a longer path with a negative edge can beat a shorter path with positive edges after the node is 'settled'."),
dict(num=54, topic="Topological Sort", title="Kahn's Algorithm — BFS Topological Sort",
scenario="Kahn's algorithm for topological sort uses:",
code="",
options=["A) DFS with back-edge tracking","✓ B) In-degree array + queue processing zero-in-degree nodes","C) Priority queue on node weights","D) Union-Find"],
answer="B",explanation="Kahn's: initialize a queue with all nodes of in-degree 0. Repeatedly dequeue a node, add it to the result, and decrement in-degrees of its neighbors; enqueue any that reach 0. If result size < V, a cycle exists."),
dict(num=55, topic="Topological Sort", title="Detecting Cycle with Topological Sort",
scenario="In Kahn's algorithm, if the topological sort produces fewer than V vertices, what does it indicate?",
code="",
options=["A) Graph is disconnected","✓ B) Graph contains a cycle","C) Graph has isolated vertices","D) In-degree was computed incorrectly"],
answer="B",explanation="Nodes in a cycle never reach in-degree 0 (each is always waiting for another in-cycle node to be removed). Fewer than V nodes in the output means at least one cycle exists."),
dict(num=56, topic="Dijkstra", title="Dijkstra Priority Queue Implementation",
scenario="Using a binary heap (priority_queue), Dijkstra's algorithm on V vertices and E edges runs in:",
code="",
options=["A) O(V^2)","✓ B) O((V + E) log V)","C) O(E log E)","D) O(V log V + E)"],
answer="B",explanation="Each vertex is extracted from the heap once: O(V log V). Each edge may trigger a relaxation/heap push: O(E log V). Total: O((V+E) log V). With a Fibonacci heap, this reduces to O(E + V log V)."),
dict(num=57, topic="DSU", title="Union by Rank + Path Compression Amortized Cost",
scenario="With both union by rank and path compression, the amortized cost per DSU operation is:",
code="",
options=["A) O(log n)","B) O(log log n)","✓ C) O(α(n)) — inverse Ackermann, effectively O(1)","D) O(1) exactly"],
answer="C",explanation="The inverse Ackermann function α(n) grows so slowly that α(n) ≤ 4 for all practical n (n < 10^80000). Combined union-by-rank and path compression achieves this near-constant amortized complexity."),
dict(num=58, topic="DSU", title="Kruskal's MST with DSU",
scenario="Kruskal's Minimum Spanning Tree algorithm sorts edges and uses DSU. Its total time complexity is dominated by:",
code="",
options=["✓ A) O(E log E) for sorting edges","B) O(V^2)","C) O(E * α(V)) for union-find operations","D) O(V log V)"],
answer="A",explanation="Sorting E edges takes O(E log E). The union-find operations for all edges take O(E * α(V)) ≈ O(E). Sorting dominates, giving O(E log E) overall."),
dict(num=59, topic="BFS", title="Multi-source BFS for 0-1 Matrix",
scenario="In the '01 Matrix' problem (distance to nearest 0 for each cell), multi-source BFS initializes the queue with:",
code="",
options=["A) All cells with value 1","✓ B) All cells with value 0 simultaneously","C) The cell (0,0) only","D) Cells with maximum value"],
answer="B",explanation="Multi-source BFS starts all '0' cells at distance 0 simultaneously. BFS then naturally propagates minimum distances to '1' cells, correctly computing the nearest-0 distance for every cell in O(m*n)."),
dict(num=60, topic="Tarjan", title="Tarjan's Bridge-Finding — Key Property",
scenario="In Tarjan's bridge-finding algorithm, an edge (u,v) is a bridge if:",
code="",
options=["A) disc[u] < disc[v]","B) low[v] == disc[u]","✓ C) low[v] > disc[u]","D) low[u] < disc[v]"],
answer="C",explanation="low[v] > disc[u] means no back-edge from the subtree rooted at v can reach u or its ancestors, so removing edge (u,v) disconnects the graph — it's a bridge."),
dict(num=61, topic="Tarjan", title="Tarjan's SCC Algorithm Time Complexity",
scenario="Tarjan's Strongly Connected Components algorithm runs in:",
code="",
options=["A) O(V^2 + E)","✓ B) O(V + E)","C) O(V log V + E)","D) O(E log V)"],
answer="B",explanation="Tarjan's SCC does a single DFS pass maintaining a stack and low-link values. Each vertex and edge is processed once: O(V+E)."),
dict(num=62, topic="Graphs", title="Bellman-Ford vs Dijkstra Trade-off",
scenario="Bellman-Ford is preferred over Dijkstra when:",
code="",
options=["A) The graph has no negative cycles","✓ B) The graph has negative edge weights (and you want to detect negative cycles)","C) The graph is dense","D) V is very large"],
answer="B",explanation="Bellman-Ford handles negative weights and detects negative cycles by running V-1 relaxation passes. Its O(VE) complexity is worse than Dijkstra's O((V+E) log V), but it's correct for negative-weight graphs."),
dict(num=63, topic="Graphs", title="Floyd-Warshall Space Complexity",
scenario="Floyd-Warshall all-pairs shortest path uses how much space?",
code="",
options=["A) O(V)","B) O(E)","✓ C) O(V^2)","D) O(V^3)"],
answer="C",explanation="Floyd-Warshall maintains a V×V distance matrix (and optionally a predecessor matrix), requiring O(V^2) space. The algorithm itself runs in O(V^3) time."),
dict(num=64, topic="BFS", title="Bipartite Graph Detection",
scenario="BFS-based bipartite graph detection assigns two colors to nodes. The graph is bipartite if and only if:",
code="",
options=["A) All nodes of the same color are connected","✓ B) No edge connects two nodes of the same color","C) The graph is connected","D) There are exactly two connected components"],
answer="B",explanation="A graph is bipartite if vertices can be 2-colored such that no edge connects same-colored vertices. BFS colors each neighbor opposite to the current node; if a conflict is found, the graph is not bipartite."),
dict(num=65, topic="DSU", title="Detecting Cycle in Undirected Graph with DSU",
scenario="Using DSU to detect a cycle in an undirected graph: a cycle exists when?",
code="",
options=["A) Two vertices have the same rank","✓ B) An edge (u,v) is found where find(u) == find(v)","C) The union operation returns false","D) Any component has more edges than vertices"],
answer="B",explanation="If find(u) == find(v) before union, nodes u and v are already in the same component. Adding edge (u,v) would create a cycle."),
dict(num=66, topic="Graphs", title="Network Flow — Ford-Fulkerson Termination",
scenario="Ford-Fulkerson may not terminate if edge capacities are:",
code="",
options=["A) Very large integers","B) Integers","✓ C) Irrational numbers","D) All equal to 1"],
answer="C",explanation="With irrational capacities, augmenting paths may yield augmenting flows that sum to a series that doesn't converge to the max flow. Edmonds-Karp (BFS-based) guarantees termination regardless."),
dict(num=67, topic="Graphs", title="Prim's vs Kruskal's — Dense vs Sparse",
scenario="For a dense graph (E ≈ V^2), which MST algorithm is preferred?",
code="",
options=["✓ A) Prim's with adjacency matrix — O(V^2)","B) Kruskal's — O(E log E) = O(V^2 log V)","C) Bellman-Ford","D) Floyd-Warshall"],
answer="A",explanation="For dense graphs, Prim's with an adjacency matrix runs in O(V^2), better than Kruskal's O(E log E) = O(V^2 log V). For sparse graphs, Kruskal's with DSU is preferred."),
dict(num=68, topic="DFS", title="Topological Sort via DFS",
scenario="In DFS-based topological sort, vertices are added to the result in:",
code="",
options=["A) Pre-order (when first visited)","✓ B) Post-order reversed (when DFS finishes a vertex)","C) BFS order","D) Alphabetical order"],
answer="B",explanation="A vertex is pushed onto a stack when its DFS finishes (all descendants are processed). Reversing this post-order gives a valid topological ordering."),
dict(num=69, topic="Graphs", title="Shortest Path in DAG",
scenario="For a DAG, the most efficient shortest path algorithm is:",
code="",
options=["A) Dijkstra's","B) Bellman-Ford","✓ C) Topological sort + single relaxation pass in O(V+E)","D) Floyd-Warshall"],
answer="C",explanation="In a DAG, topological ordering ensures each vertex is relaxed after all predecessors. One pass in topological order relaxes all edges correctly, with O(V+E) complexity and no need for negative-edge handling."),
dict(num=70, topic="Tarjan", title="Articulation Points vs Bridges",
scenario="What is the condition for a vertex u to be an articulation point in Tarjan's algorithm?",
code="",
options=["A) low[v] > disc[u] for all children v",
"✓ B) u is root with 2+ children, OR u is non-root and has a child v with low[v] >= disc[u]",
"C) u has the highest disc value",
"D) u is connected to every other vertex"],
answer="B",explanation="For non-root u: child v with low[v] >= disc[u] means no back-edge from v's subtree goes above u, so removing u disconnects v. For root: it's an articulation point iff it has 2+ children in the DFS tree."),
dict(num=71, topic="DSU", title="Offline LCA with DSU (Tarjan's LCA)",
scenario="Tarjan's offline LCA algorithm processes queries in what order?",
code="",
options=["A) BFS order","✓ B) DFS post-order with union-find to track ancestors","C) Sorted by depth","D) Random order"],
answer="B",explanation="Tarjan's offline LCA does DFS. When a node u finishes, it's unioned with its parent. When processing a query (u,v): if v is already visited, LCA(u,v) = find(v). All queries must be known upfront (offline)."),
dict(num=72, topic="Graphs", title="A* vs Dijkstra",
scenario="A* outperforms Dijkstra by:",
code="",
options=["A) Using a Fibonacci heap","✓ B) Using a heuristic to prioritize exploration toward the goal, reducing nodes examined","C) Running in O(V) instead of O(V log V)","D) Handling negative edges"],
answer="B",explanation="A* uses f(n) = g(n) + h(n) where h is an admissible heuristic estimating cost to goal. This focuses the search, potentially examining far fewer nodes than Dijkstra's uniform expansion."),
dict(num=73, topic="BFS", title="Word Ladder — BFS Level Count",
scenario="In the Word Ladder problem, BFS gives the minimum transformation sequence. If no sequence exists, BFS returns:",
code="",
options=["A) -1","B) The length of beginWord","✓ C) 0 (no path found)","D) Infinity"],
answer="C",explanation="By convention (LeetCode definition), if no transformation sequence exists, return 0. BFS naturally handles this: if the target is never reached, return 0 after exhausting all possibilities."),
dict(num=74, topic="Graphs", title="Euler Circuit Condition",
scenario="A connected undirected graph has an Euler circuit (visits every edge exactly once, returns to start) iff:",
code="",
options=["A) Every vertex has degree > 1","✓ B) Every vertex has even degree","C) The graph is bipartite","D) There are no cycles"],
answer="B",explanation="Euler's theorem: an Euler circuit exists iff the graph is connected and every vertex has even degree. If exactly 2 vertices have odd degree, an Euler path (not circuit) exists between them."),
dict(num=75, topic="Graphs", title="Hamiltonian Path NP-Completeness",
scenario="Unlike Euler paths, Hamiltonian paths (visit every vertex exactly once) are:",
code="",
options=["A) Solvable in O(V + E) with DFS","✓ B) NP-complete — no known polynomial algorithm","C) Solvable with topological sort","D) Solvable with Dijkstra's"],
answer="B",explanation="The Hamiltonian path problem is NP-complete. No polynomial algorithm is known. The best exact algorithms are exponential (O(2^n * n) with bitmask DP). Contrast with Euler paths which are O(E)."),
dict(num=76, topic="DFS", title="DFS Edge Classification",
scenario="In DFS on a directed graph, a 'cross edge' is:",
code="",
options=["A) An edge to an ancestor in the DFS tree","B) An edge within the same DFS tree","✓ C) An edge from one DFS subtree to another (or a different DFS tree component)","D) An edge that creates a cycle"],
answer="C",explanation="DFS classifies edges as: tree edges (in DFS tree), back edges (to ancestor, indicating cycle), forward edges (to descendant, directed only), cross edges (between unrelated subtrees or components, directed only)."),
dict(num=77, topic="Graphs", title="Max Flow Min Cut Theorem",
scenario="The Max-Flow Min-Cut theorem states:",
code="",
options=["A) Maximum flow equals the sum of all edge capacities","✓ B) Maximum flow in a network equals the minimum capacity cut separating source from sink","C) Min cut is always unique","D) Max flow can be computed in O(V) time"],
answer="B",explanation="Max-Flow Min-Cut is a fundamental theorem: the maximum amount of flow from source to sink equals the minimum total capacity of edges that, if removed, would disconnect source from sink."),
dict(num=78, topic="BFS", title="Rotting Oranges — Multi-source BFS",
scenario="In the 'Rotting Oranges' problem, the answer (minimum minutes) equals:",
code="",
options=["A) Number of fresh oranges","✓ B) BFS levels from all initially rotten oranges minus 1 (or -1 if unreachable)","C) Total number of oranges","D) Number of initially rotten oranges"],
answer="B",explanation="Multi-source BFS from all initially rotten oranges spreads in BFS levels. The number of levels traversed (minutes elapsed) until no fresh oranges remain is the answer."),
dict(num=79, topic="DSU", title="Path Compression Variants",
scenario="Which path compression technique achieves the best amortized complexity while being simpler to implement than full compression?",
code="",
options=["A) Path splitting","B) Path halving","✓ C) Both path splitting and path halving achieve the same O(α(n)) complexity","D) Rank compression only"],
answer="C",explanation="Both path splitting (make every node point to its grandparent on the find path) and path halving (same but every other node) achieve the same O(α(n)) amortized complexity as full path compression, with simpler implementation."),
dict(num=80, topic="Graphs", title="Johnson's Algorithm Use Case",
scenario="Johnson's algorithm for all-pairs shortest paths is efficient when:",
code="",
options=["A) Graph is dense","✓ B) Graph is sparse — it runs in O(V^2 log V + VE), beating Floyd-Warshall's O(V^3) for sparse graphs","C) All edge weights are positive","D) Graph is a DAG"],
answer="B",explanation="Johnson's reweights edges using Bellman-Ford to eliminate negatives, then runs Dijkstra from each vertex. For sparse E = O(V), this is O(V^2 log V), far better than Floyd-Warshall's O(V^3)."),
dict(num=81, topic="Tarjan", title="SCC in Social Network Analysis",
scenario="In a directed social graph (follow relationships), a Strongly Connected Component represents:",
code="",
options=["A) Users with the most followers","B) Users connected by exactly two edges","✓ C) A group where every user can reach every other user by following links","D) A bipartite subgraph"],
answer="C",explanation="An SCC is a maximal subgraph where every vertex is reachable from every other. In social networks, this represents closed communities where all members can communicate through directed follow chains."),
dict(num=82, topic="Graphs", title="Biconnected Components vs SCCs",
scenario="Biconnected components apply to which type of graph?",
code="",
options=["✓ A) Undirected graphs — maximal subgraphs with no articulation points","B) Directed graphs only","C) Weighted graphs","D) DAGs only"],
answer="A",explanation="Biconnected components partition the edges of undirected graphs into maximal subgraphs that remain connected when any single vertex is removed. SCCs apply to directed graphs."),
dict(num=83, topic="BFS", title="BFS on Implicit Graph — Sliding Puzzle",
scenario="For the 8-puzzle (3x3 sliding tiles), BFS finds the minimum moves. The state space size is:",
code="",
options=["A) 8!","✓ B) 9!/2 = 181,440 reachable states","C) 9^9","D) 2^9"],
answer="B",explanation="The 9 tiles can be arranged in 9! ways, but exactly half are reachable from any given state (parity invariant), giving 9!/2 = 181,440 reachable states. BFS is feasible."),
dict(num=84, topic="DFS", title="DFS on Grid — Number of Islands",
scenario="DFS-based 'Number of Islands' solution: what terminates the recursion for each island?",
code="",
options=["A) Visiting all grid cells","✓ B) Hitting boundary or water cells ('0') or already-visited cells","C) Finding exactly 4 neighbors","D) Reaching grid center"],
answer="B",explanation="DFS from a '1' cell recursively marks connected land cells as visited (e.g., '0' or '#'). Recursion stops at boundaries, water cells, or already-visited cells. Each DFS call from an unvisited '1' finds one island."),
dict(num=85, topic="Graphs", title="Strongly Connected Component — Kosaraju's Two-Pass",
scenario="Kosaraju's SCC algorithm performs:",
code="",
options=["A) BFS twice on the original graph","✓ B) DFS on original graph (recording finish order), then DFS on reversed graph in reverse finish order","C) DFS once with back-edge tracking","D) BFS + topological sort"],
answer="B",explanation="Pass 1: DFS on G, push vertices to stack in finish order. Pass 2: reverse G, pop vertices and DFS; each DFS tree in pass 2 is an SCC. Two full DFS passes, O(V+E) total."),
dict(num=86, topic="Graphs", title="Minimum Spanning Tree Uniqueness",
scenario="An MST is unique when:",
code="",
options=["A) The graph is directed","B) All edge weights are integers","✓ C) All edge weights are distinct","D) The graph is bipartite"],
answer="C",explanation="If all edge weights are distinct, the MST is unique. The proof uses the cycle property: the unique maximum-weight edge in any cycle is never in the MST. With ties, multiple MSTs of the same weight may exist."),
dict(num=87, topic="BFS", title="0-1 BFS with Deque",
scenario="0-1 BFS solves shortest path where edges have weight 0 or 1 using a deque. Why is it O(V+E) instead of O((V+E) log V)?",
code="",
options=["A) Uses a Fibonacci heap internally","✓ B) Weight-0 edges push to front of deque, weight-1 to back, maintaining sorted order without heap overhead","C) Processes only weight-0 edges","D) Skips already-visited vertices"],
answer="B",explanation="By pushing weight-0 edges to the front and weight-1 to the back, the deque always has the minimum-distance node at the front — like a heap but O(1) per push, giving O(V+E) total."),
dict(num=88, topic="Graphs", title="Traveling Salesman — DP Bitmask",
scenario="The bitmask DP solution for TSP on n cities has complexity:",
code="",
options=["A) O(n^2)","B) O(n! )","✓ C) O(2^n * n^2)","D) O(n^3)"],
answer="C",explanation="State: dp[mask][i] = min cost to visit cities in 'mask', ending at city i. There are O(2^n * n) states, each requiring O(n) transitions. Total: O(2^n * n^2). Still exponential but much better than O(n!)."),
dict(num=89, topic="DSU", title="DSU with Rollback for Offline Queries",
scenario="DSU with rollback (union by rank without path compression) supports undo in O(log n). Why can't path compression be used with rollback?",
code="",
options=["A) Path compression is slower","B) Path compression uses more memory","✓ C) Path compression irreversibly modifies parent pointers, making undo impossible without storing entire path history","D) Path compression conflicts with rank"],
answer="C",explanation="Path compression restructures the tree, flattening it. To undo a union, you need to restore the original parent pointers. With path compression, intermediate pointers were changed and aren't easy to restore. Union by rank only changes two pointers per union, trivially undoable."),
dict(num=90, topic="Graphs", title="Network Flow — Dinic's Algorithm Complexity",
scenario="Dinic's algorithm for max flow has complexity:",
code="",
options=["A) O(V * E)","B) O(E^2 * log V)","✓ C) O(V^2 * E)","D) O(V * E^2)"],
answer="C",explanation="Dinic's builds blocking flows in a level graph using BFS + DFS. There are O(V) phases (BFS levels increase by at least 1 each phase), each blocking flow takes O(VE). Total: O(V^2 * E), or O(E * sqrt(V)) for unit capacity networks."),
dict(num=91, topic="Graphs", title="Shortest Cycle Detection",
scenario="Finding the shortest cycle (girth) in an unweighted undirected graph runs in:",
code="",
options=["A) O(V + E)","✓ B) O(V * (V + E)) — BFS from each vertex","C) O(V^2)","D) O(E log V)"],
answer="B",explanation="Run BFS from each vertex; when BFS finds an edge to an already-visited same-level node, a cycle is detected. The shortest such cycle across all BFS runs is the girth. V BFS runs of O(V+E) each: O(V*(V+E))."),
dict(num=92, topic="DFS", title="Boggle Solver — DFS + Trie",
scenario="A Boggle solver DFS on an N×N board with a Trie of W words. What is the time complexity?",
code="",
options=["A) O(N^2 * W)","B) O(N^2 * 4^(N^2))","✓ C) O(N^2 * 4^L) where L is max word length, pruned by Trie","D) O(W * N^2)"],
answer="C",explanation="DFS from each of N^2 cells explores at most 4^L paths of length L. The Trie prunes branches with no matching prefix early. In practice, much faster, but the theoretical bound is O(N^2 * 4^L)."),
dict(num=93, topic="Graphs", title="Minimum Cost Maximum Flow Application",
scenario="Min-Cost Max-Flow is used to solve which type of problem?",
code="",
options=["A) Minimum spanning tree","B) Shortest path in DAG","✓ C) Assignment problems and transportation optimization (e.g., minimizing cost while satisfying supply-demand constraints)","D) Topological sort"],
answer="C",explanation="Min-Cost Max-Flow finds the maximum flow from source to sink while minimizing total cost. It solves assignment problems, job scheduling, and transportation problems where both flow and cost must be optimized."),
dict(num=94, topic="BFS", title="Alien Dictionary — Topological Sort",
scenario="Given a sorted list of alien words, the character ordering is derived by:",
code="",
options=["A) Comparing all pairs of characters","✓ B) Finding the first differing character between adjacent words to build edges, then topological sort","C) Sorting characters by frequency","D) DFS on character frequencies"],
answer="B",explanation="Compare each adjacent pair of words; the first character difference gives a directed edge (c1 → c2 meaning c1 comes before c2 in the alien alphabet). Topological sort on these edges gives the ordering."),
dict(num=95, topic="Tarjan", title="Critical Connections in Network — Bridge Finding",
scenario="LeetCode 'Critical Connections in Network': which algorithm directly solves this?",
code="",
options=["A) Dijkstra's","B) BFS","✓ C) Tarjan's bridge-finding algorithm","D) Floyd-Warshall"],
answer="C",explanation="Critical connections are edges whose removal increases the number of connected components — exactly the definition of bridges. Tarjan's algorithm finds all bridges in O(V+E)."),
dict(num=96, topic="Graphs", title="Bipartite Matching — Hopcroft-Karp Complexity",
scenario="Hopcroft-Karp algorithm for maximum bipartite matching runs in:",
code="",
options=["A) O(V * E)","✓ B) O(E * sqrt(V))","C) O(V^2)","D) O(E log V)"],
answer="B",explanation="Hopcroft-Karp finds maximal augmenting paths in phases using BFS + DFS. There are O(sqrt(V)) phases, each requiring O(E) work. Total: O(E * sqrt(V)), significantly better than the O(VE) naive approach."),
dict(num=97, topic="DSU", title="Weighted DSU for Relative Ranking",
scenario="Weighted DSU (Union-Find with edge weights) can solve which type of problem?",
code="",
options=["A) Finding MST directly","✓ B) Problems involving relative ordering or distance between elements (e.g., 'how many times heavier is A than B?')","C) Detecting negative cycles","D) Topological sort"],
answer="B",explanation="Weighted DSU maintains a weight relative to the root for each node. It can answer questions like 'what is the ratio between elements X and Y?' — used in problems like 'Evaluate Division' on LeetCode."),
dict(num=98, topic="Graphs", title="PageRank — Graph Centrality",
scenario="PageRank is computed iteratively as a form of:",
code="",
options=["A) BFS from each vertex","B) Topological sort of web pages","✓ C) Power iteration on the graph's adjacency matrix (dominant eigenvector computation)","D) Dijkstra's on page link weights"],
answer="C",explanation="PageRank iteratively applies the transition matrix (normalized adjacency) until convergence, computing the stationary distribution of a random walk — equivalent to finding the dominant eigenvector of the transition matrix."),
dict(num=99, topic="BFS", title="Jump Game II — BFS Greedy Levels",
scenario="Jump Game II (minimum jumps to reach end) can be modeled as BFS where each 'level' represents:",
code="",
options=["A) Each index in the array","B) Each unique jump length","✓ C) All indices reachable with exactly k jumps (implicit BFS levels)","D) Sorted jump distances"],
answer="C",explanation="Track the farthest index reachable within each 'level' (same number of jumps). When the current position crosses the previous level's boundary, increment jumps. This greedy BFS-level approach runs in O(n)."),
dict(num=100, topic="Graphs", title="Course Schedule II — Prerequisites as DAG",
scenario="'Course Schedule II' maps to finding a topological sort of a directed graph. If the graph has a cycle:",
code="",
options=["A) Return an arbitrary ordering","✓ B) Return empty array — no valid course ordering exists","C) Return the cycle nodes","D) Skip cycled courses"],
answer="B",explanation="If prerequisites form a cycle (A requires B, B requires C, C requires A), no valid ordering exists. Kahn's algorithm detects this when the topological sort output has fewer vertices than the total number of courses."),
# ── SECTION 3 : RECURSION & DYNAMIC PROGRAMMING (Q101–Q150) ──────────────
dict(num=101, topic="Dynamic Programming", title="0/1 Knapsack State Definition",
scenario="In 0/1 Knapsack with n items and capacity W, the DP state dp[i][w] represents:",
code="",
options=["A) Number of items selected up to index i","B) Remaining capacity after i items","✓ C) Maximum value achievable using items 0..i with weight limit w","D) Minimum weight for value i"],
answer="C",explanation="dp[i][w] = max value using first i items with weight capacity w. Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i]) if weight[i] <= w, else dp[i-1][w]."),
dict(num=102, topic="Dynamic Programming", title="Knapsack Space Optimization",
scenario="0/1 Knapsack can be solved in O(W) space (instead of O(n*W)) by:",
code="""\
// Space-optimized 0/1 Knapsack
for (int i = 0; i < n; i++)
for (int w = W; w >= weight[i]; w--) // iterate BACKWARDS
dp[w] = max(dp[w], dp[w - weight[i]] + value[i]);""",
options=["✓ A) Iterating capacity from W down to weight[i] prevents using item i twice","B) Iterating from 0 to W","C) Using two arrays and swapping","D) Sorting items by value"],
answer="A",explanation="Backward iteration ensures that when we compute dp[w], dp[w-weight[i]] still reflects the state BEFORE item i was considered (previous row), maintaining the 0/1 constraint. Forward iteration would allow picking item i multiple times (unbounded knapsack)."),
dict(num=103, topic="Dynamic Programming", title="Unbounded Knapsack vs 0/1",
scenario="The key difference between 0/1 and Unbounded Knapsack recurrences:",
code="",
options=["A) Unbounded uses 2D DP","✓ B) Unbounded: dp[w] = max(dp[w], dp[w-weight[i]] + value[i]) with FORWARD iteration; 0/1 uses backward","C) Unbounded sorts by weight","D) 0/1 allows item reuse"],
answer="B",explanation="In unbounded knapsack, each item can be used unlimited times. Forward iteration allows item i to be selected again in the same pass (dp[w-weight[i]] already reflects item i being chosen). 0/1 uses backward to prevent this."),
dict(num=104, topic="Dynamic Programming", title="LCS Length — Output Prediction",
scenario="Compute LCS length for s1 = 'ABCBDAB' and s2 = 'BDCAB'.",
code="",
options=["A) 3","✓ B) 4","C) 5","D) 2"],
answer="B",explanation="The LCS is 'BCAB' or 'BDAB' of length 4. The DP table confirms this via the standard O(m*n) recurrence."),
dict(num=105, topic="Dynamic Programming", title="LCS to LIS Reduction",
scenario="Longest Increasing Subsequence (LIS) can be reduced to LCS by computing LCS of the array with:",
code="",
options=["A) Its reversed copy","✓ B) Its sorted (distinct) copy","C) An array of all 1s","D) The prefix sums"],
answer="B",explanation="LIS(A) = LCS(A, sorted_unique(A)). An element appears in the LIS iff it appears in both A (in order) and the sorted unique version. This runs in O(n^2) via LCS; patience sorting gives O(n log n) directly."),
dict(num=106, topic="Dynamic Programming", title="Edit Distance — Three Operations",
scenario="The edit distance (Levenshtein) DP recurrence dp[i][j] = ?",
code="",
options=["A) dp[i-1][j-1] + 1 always",
"✓ B) If s[i]==t[j]: dp[i-1][j-1]; else 1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
"C) min(dp[i-1][j], dp[i][j-1])",
"D) dp[i-1][j-1] + (s[i] != t[j])"],
answer="B",explanation="If characters match, no operation needed: take dp[i-1][j-1]. Otherwise, take minimum of: delete from s (dp[i-1][j]+1), insert into s (dp[i][j-1]+1), or replace (dp[i-1][j-1]+1)."),
dict(num=107, topic="Dynamic Programming", title="Matrix Chain Multiplication — State",
scenario="In Matrix Chain Multiplication DP, dp[i][j] represents:",
code="",
options=["A) Cost to multiply matrix i and j","✓ B) Minimum scalar multiplications to compute the product of matrices i through j","C) Dimensions of matrix ij","D) Number of ways to parenthesize matrices i..j"],
answer="B",explanation="dp[i][j] = min cost to multiply the chain of matrices from index i to j. Recurrence: dp[i][j] = min over k of (dp[i][k] + dp[k+1][j] + dims[i-1]*dims[k]*dims[j])."),
dict(num=108, topic="Dynamic Programming", title="MCM Time Complexity",
scenario="Matrix Chain Multiplication DP has time complexity:",
code="",
options=["A) O(n^2)","✓ B) O(n^3)","C) O(2^n)","D) O(n^2 log n)"],
answer="B",explanation="There are O(n^2) subproblems (all pairs i,j), and each requires O(n) work to try all split points k. Total: O(n^3). Space is O(n^2)."),
dict(num=109, topic="Recursion", title="Tower of Hanoi — Minimum Moves",
scenario="The minimum number of moves to solve Tower of Hanoi with n disks is:",
code="",
options=["A) n^2","✓ B) 2^n - 1","C) n!","D) n*(n+1)/2"],
answer="B",explanation="T(n) = 2*T(n-1) + 1 (move top n-1 to auxiliary, move nth disk, move n-1 back). Solving: T(n) = 2^n - 1. For 64 disks: 2^64 - 1 ≈ 1.8 × 10^19 moves."),
dict(num=110, topic="Dynamic Programming", title="Coin Change — Fewest Coins",
scenario="For coin denominations [1,5,6,9] and amount 11, the greedy approach (pick largest) gives 3 coins (9+1+1). DP gives:",
code="",
options=["A) 3 coins","✓ B) 2 coins (5+6)","C) 4 coins","D) 1 coin"],
answer="B",explanation="Greedy fails here. DP correctly identifies 5+6=11 using 2 coins, proving that coin change requires DP (or BFS), not greedy, for arbitrary denominations."),
dict(num=111, topic="Dynamic Programming", title="Longest Palindromic Subsequence",
scenario="LPS(s) is related to LCS by:",
code="",
options=["A) LPS(s) = LCS(s, reversed(s)) - len(s)","✓ B) LPS(s) = LCS(s, reversed(s))","C) LPS(s) = 2 * LCS(s, reversed(s))","D) LPS(s) = len(s) - LCS(s, reversed(s))"],
answer="B",explanation="A palindromic subsequence reads the same forwards and backwards, so it's a common subsequence of s and its reverse. LPS(s) = LCS(s, reverse(s))."),
dict(num=112, topic="Dynamic Programming", title="Wildcard Matching — DP Bug",
scenario="Identify the bug in this wildcard matching DP initialization:",
code="""\
bool isMatch(string s, string p) {
int m=s.size(), n=p.size();
vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
dp[0][0] = true;
for (int j=1; j<=n; j++)
if (p[j-1]=='*') dp[0][j] = dp[0][j-1]; // handle leading *s
for (int i=1; i<=m; i++)
for (int j=1; j<=n; j++) {
if (p[j-1]=='*')
dp[i][j] = dp[i-1][j] || dp[i][j-1];
else
dp[i][j] = dp[i-1][j-1] && (s[i-1]==p[j-1] || p[j-1]=='?');
}
return dp[m][n];
}""",
options=["✓ A) No bug — this is correct. dp[i-1][j] handles '*' matching one+ chars, dp[i][j-1] handles '*' matching empty","B) '*' should only match dp[i-1][j-1]","C) '?' should match any number of chars","D) Missing check for p[j-1] == '?'"],
answer="A",explanation="The code is correct. '*' can match any sequence: dp[i-1][j] means '*' matches one more character from s; dp[i][j-1] means '*' matches empty string. The initialization correctly handles patterns starting with '*'."),
dict(num=113, topic="Dynamic Programming", title="Partition Equal Subset Sum",
scenario="'Partition Equal Subset Sum' reduces to which well-known DP problem?",
code="",
options=["A) Coin Change","B) LCS","✓ C) 0/1 Knapsack with target = total_sum / 2","D) Edit Distance"],
answer="C",explanation="If total sum is odd, return false. Otherwise, check if a subset sums to total/2 using 0/1 Knapsack DP. dp[w] = true if some subset sums to exactly w."),
dict(num=114, topic="Recursion", title="Memoization vs Tabulation Trade-offs",
scenario="When is top-down memoization preferred over bottom-up tabulation?",
code="",
options=["A) Always — memoization is faster","✓ B) When only a fraction of subproblems need to be computed (sparse dependency graph)","C) When space is the primary constraint","D) For iterative problems"],
answer="B",explanation="If the recursion only visits a small fraction of all possible states (e.g., a sparse dependency graph), memoization avoids computing unnecessary states. Tabulation always fills all states, even irrelevant ones."),
dict(num=115, topic="Dynamic Programming", title="Rod Cutting — Unbounded Knapsack Variant",
scenario="Rod cutting (maximize revenue from cutting a rod of length n with given piece prices) is a variant of:",
code="",
options=["A) 0/1 Knapsack","✓ B) Unbounded Knapsack — each piece length can be used multiple times","C) Fractional Knapsack","D) Matrix Chain Multiplication"],
answer="B",explanation="Each cut length can be reused any number of times (a piece of length 2 can be cut multiple times from a rod of length 8). This maps directly to Unbounded Knapsack."),
dict(num=116, topic="Dynamic Programming", title="Burst Balloons — Interval DP",
scenario="'Burst Balloons' uses interval DP where dp[i][j] means:",
code="",
options=["A) Number of ways to burst balloons i to j","✓ B) Maximum coins from bursting all balloons between i and j (exclusive boundaries)","C) Minimum coins to burst balloons i to j","D) Sum of balloon values from i to j"],
answer="B",explanation="dp[i][j] = max coins obtainable by bursting all balloons strictly between indices i and j (i and j are boundaries not burst in this range). The key insight: think of k as the LAST balloon burst in range (i,j), not the first."),
dict(num=117, topic="Dynamic Programming", title="Longest Common Substring vs Subsequence",
scenario="The key difference between LCS (Longest Common Subsequence) and Longest Common Substring (LCStr):",
code="",
options=["A) LCS is O(n^2), LCStr is O(n^3)","✓ B) LCS allows gaps (subsequence); LCStr requires contiguity. LCStr resets dp[i][j] to 0 when characters don't match","C) LCStr is always longer than LCS","D) They use identical recurrences"],
answer="B",explanation="LCS: dp[i][j] = dp[i-1][j-1]+1 if match, else max(dp[i-1][j], dp[i][j-1]). LCStr: dp[i][j] = dp[i-1][j-1]+1 if match, else 0. LCStr tracks the max seen; no gap allowed."),
dict(num=118, topic="Dynamic Programming", title="DP on Trees — Maximum Independent Set",
scenario="Maximum Independent Set on a tree: dp[v][0] = max nodes in subtree of v when v is NOT selected, dp[v][1] = max when v IS selected. Recurrence for dp[v][1]?",
code="",
options=["A) 1 + sum of dp[c][1] for children c",
"✓ B) 1 + sum of dp[c][0] for children c — if v is selected, no child can be selected",
"C) sum of max(dp[c][0], dp[c][1]) for children c",
"D) dp[parent][0] + 1"],
answer="B",explanation="If vertex v is included, none of its children can be included (independent set constraint). So dp[v][1] = 1 + sum(dp[c][0]) over all children c. dp[v][0] = sum(max(dp[c][0], dp[c][1])) since children can independently be in or out."),
dict(num=119, topic="Dynamic Programming", title="Palindrome Partitioning — DP State",
scenario="'Palindrome Partitioning II' (minimum cuts for palindromic partition): dp[i] represents:",
code="",
options=["A) Number of palindromes ending at i","✓ B) Minimum cuts needed for s[0..i]","C) Length of longest palindrome ending at i","D) Number of ways to partition s[0..i]"],
answer="B",explanation="dp[i] = min cuts for s[0..i]. Transition: dp[i] = min(dp[j-1] + 1) for all j<=i where s[j..i] is a palindrome. Pre-compute palindrome table using DP or Manacher's O(n) algorithm for optimization."),
dict(num=120, topic="Recursion", title="Subset Sum — Exponential Baseline",
scenario="Naive recursive subset sum explores how many subsets for n elements?",
code="",
options=["A) n^2","B) n!","✓ C) 2^n","D) n^3"],
answer="C",explanation="Each of n elements can be included or excluded: 2^n subsets. Naive recursion without memoization explores all 2^n possibilities. DP reduces this to O(n*W) pseudo-polynomial time."),
dict(num=121, topic="Dynamic Programming", title="Number of Distinct Subsequences",
scenario="dp[i][j] in 'Distinct Subsequences' (count ways s's subsequences equal t) represents:",
code="",
options=["A) Length of LCS up to s[i] and t[j]","✓ B) Number of ways s[0..i-1] contains t[0..j-1] as a subsequence","C) Edit distance between s[0..i] and t[0..j]","D) Number of common characters"],
answer="B",explanation="dp[i][j] = dp[i-1][j] (don't use s[i]) + dp[i-1][j-1] if s[i-1]==t[j-1] (use s[i] to match t[j]). Base: dp[i][0]=1 (empty t matched always), dp[0][j]=0 for j>0."),
dict(num=122, topic="Dynamic Programming", title="Largest Rectangle in Histogram — Stack DP",
scenario="The 'Largest Rectangle in Histogram' optimal solution uses:",
code="",
options=["A) O(n^2) DP","B) Segment tree for range minimum","✓ C) Monotonic stack in O(n) time","D) Divide and conquer in O(n log n)"],
answer="C",explanation="A monotonic increasing stack tracks bars. When a shorter bar is encountered, pop bars and compute rectangle area (popped height * width since last shorter bar). O(n) total since each bar is pushed/popped once."),
dict(num=123, topic="Dynamic Programming", title="Catalan Numbers — DP",
scenario="Catalan number C_n counts many things. C_n = sum of C_i * C_{n-1-i} for i=0 to n-1. This recurrence relates to:",
code="",
options=["A) Number of spanning trees of K_n","✓ B) Number of valid BSTs with n keys, number of valid parenthesizations, Dyck paths","C) Number of prime numbers up to n","D) Number of permutations of n elements"],
answer="B",explanation="Catalan numbers count: valid BSTs with n distinct keys, ways to parenthesize n+1 matrices (MCM), Dyck paths of length 2n, valid bracket sequences of length 2n, triangulations of polygon with n+2 sides, and many more."),
dict(num=124, topic="Recursion", title="Generate Permutations — Backtracking Complexity",
scenario="Generating all permutations of n distinct elements via backtracking has time complexity:",
code="",
options=["A) O(n^2)","✓ B) O(n * n!)","C) O(n!)","D) O(2^n)"],
answer="B",explanation="There are n! permutations, each of length n to write/copy. Total work: O(n * n!). The recursion tree has n! leaves, but internal nodes sum to another factor."),
dict(num=125, topic="Dynamic Programming", title="Stock Buy Sell with Cooldown",
scenario="'Best Time to Buy and Sell Stock with Cooldown': after selling, you must wait 1 day. The DP states needed are:",
code="",
options=["A) dp[i] = max profit on day i","✓ B) held[i], sold[i], rest[i] — three states per day","C) buy[i], sell[i] — two states","D) dp[i][j] where j is number of transactions"],
answer="B",explanation="Three states capture all transitions: held[i] = max profit holding stock on day i; sold[i] = max profit just sold on day i; rest[i] = max profit in cooldown/rest on day i. Transitions encode the cooldown rule naturally."),
dict(num=126, topic="Dynamic Programming", title="Interleaving String — 2D DP",
scenario="'Interleaving String' (can s3 be formed by interleaving s1 and s2) uses dp[i][j] where:",
code="",
options=["A) dp[i][j] = LCS of s1[0..i] and s2[0..j]",
"✓ B) dp[i][j] = true if s3[0..i+j-1] can be formed by interleaving s1[0..i-1] and s2[0..j-1]",
"C) dp[i][j] = edit distance between s1[0..i] and s3[0..j]",
"D) dp[i][j] = number of interleavings"],
answer="B",explanation="dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) || (dp[i][j-1] && s2[j-1]==s3[i+j-1]). Base case dp[0][0]=true. Answer is dp[m][n]."),
dict(num=127, topic="Dynamic Programming", title="Palindrome Substrings — Count",
scenario="'Count Palindromic Substrings': the expand-around-center technique runs in:",
code="",
options=["A) O(n^3)","✓ B) O(n^2)","C) O(n) with Manacher's (but Manacher's finds longest, not count directly)","D) O(n log n)"],
answer="B",explanation="For each of the 2n-1 centers (n odd-length, n-1 even-length), expand while palindrome. Total expansions across all centers: O(n^2). Manacher's achieves O(n) for the longest palindrome but counting all requires O(n^2) without extensions."),
dict(num=128, topic="Dynamic Programming", title="Jump Game II — DP vs Greedy",
scenario="Jump Game II solved with DP has O(n^2) complexity. The greedy approach achieves:",
code="",
options=["A) O(n^2)","✓ B) O(n)","C) O(n log n)","D) O(1)"],
answer="B",explanation="Greedy: track current range end and farthest reachable. When index reaches range end, increment jumps and extend range to farthest. Single O(n) pass suffices, avoiding the O(n^2) DP."),
dict(num=129, topic="Recursion", title="N-Queens — Backtracking State",
scenario="N-Queens backtracking maintains which sets for O(1) conflict checking?",
code="",
options=["A) Rows only","✓ B) Sets for: columns, left diagonals (row-col), and right diagonals (row+col)","C) Sets for rows and columns","D) A 2D boolean board only"],
answer="B",explanation="Three hash sets: columns used, left diagonals (constant row-col), right diagonals (constant row+col). Checking if a position (r,c) is safe is O(1) with these sets vs O(n) scanning the board."),
dict(num=130, topic="Dynamic Programming", title="Longest Increasing Path in Matrix",
scenario="'Longest Increasing Path in a Matrix' uses memoized DFS. The time complexity is:",
code="",
options=["A) O(m*n * 4^(m*n))","✓ B) O(m*n) — each cell computed once via memoization","C) O((m*n)^2)","D) O(m*n * log(m*n))"],
answer="B",explanation="Each cell is the starting point of at most one DFS computation (subsequent calls hit the memo cache). Each cell has at most 4 neighbors. Total work: O(4*m*n) = O(m*n)."),
dict(num=131, topic="Dynamic Programming", title="Decode Ways — State Machine DP",
scenario="'Decode Ways' (count ways to decode a digit string as letters): dp[i] depends on:",
code="",
options=["A) dp[i-1] only","B) dp[i-2] only","✓ C) dp[i-1] if s[i] is valid single digit, + dp[i-2] if s[i-1..i] is valid two-digit (10-26)","D) All previous states"],
answer="C",explanation="At each position i, you can decode one digit (if valid, adds dp[i-1] ways) or two digits (if 10-26, adds dp[i-2] ways). Handle '0' carefully: '0' alone is invalid; only '10' and '20' are valid two-digit."),
dict(num=132, topic="Dynamic Programming", title="Word Break — DP + Trie",
scenario="'Word Break' (can string s be segmented into dictionary words) with a Trie for the dictionary runs in:",
code="",
options=["A) O(n^2)","✓ B) O(n^2) with hash set, or O(n * L) with Trie where L is max word length","C) O(n * W) where W is total characters in dictionary","D) O(n^3)"],
answer="B",explanation="dp[i] = true if s[0..i-1] is segmentable. For each i, check all j < i: dp[j] && s[j..i-1] in dictionary. With hash set: O(n^2) average. With Trie: at most L characters per position, so O(n*L)."),
dict(num=133, topic="Dynamic Programming", title="Distinct BSTs — Catalan Number",
scenario="The number of structurally unique BSTs with n keys is the n-th Catalan number. For n=4:",
code="",
options=["A) 12","✓ B) 14","C) 16","D) 10"],
answer="B",explanation="Catalan numbers: C(0)=1, C(1)=1, C(2)=2, C(3)=5, C(4)=14. For each root k (1 to n), left subtree has k-1 keys, right has n-k. C(n) = sum(C(k)*C(n-1-k))."),
dict(num=134, topic="Recursion", title="Memoization Space Overhead in Deep Recursion",
scenario="A top-down DP with n states, each requiring O(k) space for its result, uses total space of:",
code="",
options=["A) O(n) for hash map","✓ B) O(n*k) for results + O(depth) for call stack","C) O(n*depth)","D) O(k) only"],
answer="B",explanation="The memo table stores n results, each of size k: O(n*k). The recursion call stack uses O(depth) = O(n) in the worst case (linear chain). Total space: O(n*k + n) = O(n*k)."),
dict(num=135, topic="Dynamic Programming", title="Maximum Subarray — Kadane's Insight",
scenario="Kadane's algorithm DP insight: dp[i] = max subarray sum ending at index i =",
code="",
options=["A) dp[i-1] + a[i]","✓ B) max(a[i], dp[i-1] + a[i])","C) max(dp[i-1], a[i])","D) dp[i-1] - a[i]"],
answer="B",explanation="Either extend the previous subarray (dp[i-1] + a[i]) or start fresh at current element (a[i]). We choose whichever is larger. This compresses a 2D DP to 1D, running in O(n) time and O(1) space."),
dict(num=136, topic="Dynamic Programming", title="Minimum Path Sum in Grid",
scenario="Grid DP for minimum path sum: dp[i][j] = ?",
code="",
options=["A) grid[i][j] + min(dp[i][j-1], dp[i-1][j]) always","✓ B) grid[i][j] + min(dp[i][j-1], dp[i-1][j]), with boundary handling for first row/col","C) grid[i][j] * min(dp[i][j-1], dp[i-1][j])","D) max(dp[i][j-1], dp[i-1][j]) - grid[i][j]"],
answer="B",explanation="General recurrence: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]). First row: only from left. First column: only from above. Answer: dp[m-1][n-1]."),
dict(num=137, topic="Dynamic Programming", title="Dice Roll Target Sum — Count Ways",
scenario="Counting ways to get sum S with d dice, each having f faces. The DP table has dimensions:",
code="",
options=["A) O(S)","B) O(d * f)","✓ C) O(d * S)","D) O(f * S)"],
answer="C",explanation="dp[i][j] = number of ways to get sum j using i dice. i ranges from 1 to d; j ranges from i to i*f. Table size: O(d*S). Transition: dp[i][j] = sum(dp[i-1][j-k] for k=1 to f)."),
dict(num=138, topic="Recursion", title="Combination Sum — Backtracking Termination",
scenario="In Combination Sum backtracking (elements can be reused, find all combinations summing to target), what prevents infinite loops?",
code="",
options=["A) Sorting candidates","B) Visited array","✓ C) Remaining target decreases each recursive call; terminate when target == 0 or < 0","D) Unique elements constraint"],
answer="C",explanation="Since all candidates are positive, subtracting any candidate strictly decreases the remaining target. Recursion terminates when target hits 0 (found combination) or goes negative (dead end). No risk of infinite recursion."),
dict(num=139, topic="Dynamic Programming", title="Regular Expression Matching — DP",
scenario="In regex matching DP with '.' (any char) and '*' (zero or more), dp[i][j] when p[j-1]=='*' equals:",
code="",
options=["A) dp[i-1][j-1]",
"B) dp[i][j-2] only (zero occurrences)",
"✓ C) dp[i][j-2] (zero occurrences) OR (dp[i-1][j] if s[i-1] matches p[j-2])",
"D) dp[i-1][j]"],
answer="C",explanation="'*' can mean zero occurrences: dp[i][j-2]. Or one-or-more: dp[i-1][j] if the preceding character p[j-2] matches s[i-1] (or p[j-2]=='.'). This is the critical case that handles multiple character repetitions."),
dict(num=140, topic="Dynamic Programming", title="Egg Drop — Optimal DP",
scenario="The classic Egg Drop problem with k eggs and n floors: the naive O(kn^2) DP can be optimized to O(kn log n) using:",
code="",
options=["A) Greedy selection","✓ B) Binary search on the optimal floor to drop from (monotonic optimal structure)","C) Divide and conquer","D) Memoization only"],
answer="B",explanation="The 'check floor' function in the DP transition is monotonic: as the answer increases, the optimal drop floor only increases. Binary search exploits this property to find the optimal floor in O(log n) instead of O(n), improving total complexity."),
dict(num=141, topic="Dynamic Programming", title="Maximum Profit with K Transactions",
scenario="'Best Time to Buy and Sell Stock IV' (at most k transactions) DP complexity:",
code="",
options=["A) O(n * k)","✓ B) O(n * k) time with O(k) space optimization","C) O(n^2)","D) O(n^2 * k)"],
answer="B",explanation="dp[i][j] = max profit with at most j transactions up to day i. With space optimization (rolling array on transactions), O(n*k) time and O(k) space. If k >= n/2, unlimited transactions (greedy) gives O(n)."),
dict(num=142, topic="Recursion", title="Subset Generation — Bitmask vs Backtracking",
scenario="For generating all subsets of n elements, bitmask iteration vs backtracking have what time/space complexity?",
code="",
options=["✓ A) Both O(2^n) time; bitmask O(1) extra space, backtracking O(n) stack space","B) Bitmask O(n*2^n), backtracking O(2^n)","C) Bitmask O(1), backtracking O(2^n)","D) Both O(n*2^n) time and O(n) space"],
answer="A",explanation="Both explore all 2^n subsets. Bitmask uses a loop variable (O(1) space). Backtracking uses the recursion stack (O(n) depth). To print each subset of size up to n, each subset takes O(n), giving O(n*2^n) output time for both."),
dict(num=143, topic="Dynamic Programming", title="Minimum Window Subsequence",
scenario="'Minimum Window Subsequence' (find shortest substring of S containing T as subsequence) optimal approach is:",
code="",
options=["A) Sliding window O(n*m)","B) BFS on characters","✓ C) DP with backward scan: after finding T in S forward, scan backward to tighten window — O(n*m) but optimal in practice","D) Suffix array"],
answer="C",explanation="Forward scan finds an end position where T is a subsequence. Backward scan from that end finds the tightest start. DP precomputes next occurrence of each character for O(n) scanning. Total O(n*m) or O(n * |alphabet|) with preprocessing."),
dict(num=144, topic="Dynamic Programming", title="Maximal Square of 1s in Matrix",
scenario="dp[i][j] in 'Maximal Square' (largest square of 1s) represents:",
code="",
options=["A) Number of 1s in row i up to column j","✓ B) Side length of the largest square with (i,j) as its bottom-right corner","C) Sum of matrix[0..i][0..j]","D) Number of squares ending at (i,j)"],
answer="B",explanation="dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 if matrix[i][j]=='1', else 0. The minimum of the three neighboring DP values limits the largest square that can extend to (i,j). Answer: max(dp[i][j])^2."),
dict(num=145, topic="Recursion", title="Flood Fill — DFS vs BFS",
scenario="Flood Fill (replace connected region of same color) can use DFS or BFS. For a worst-case m×n grid, stack overflow risk exists with DFS when:",
code="",
options=["A) m*n > 100","B) Grid is square","✓ C) m*n is very large (millions of cells), causing recursion stack depth to exceed system limits","D) When colors are repeated"],
answer="C",explanation="In worst case, DFS recurses through all m*n connected cells, creating a call stack of depth O(m*n). For large grids, this exceeds typical stack limits (~10^4-10^5 frames). BFS uses an explicit queue (heap-allocated) and avoids this."),
dict(num=146, topic="Dynamic Programming", title="Longest Common Subsequence — Space Optimization",
scenario="LCS(s1, s2) of length m and n uses O(m*n) space. The space-optimized version uses:",
code="",
options=["A) O(n) using a single array","✓ B) O(n) using two rows (current and previous) or one array with careful traversal","C) O(min(m,n))","D) O(1)"],
answer="B",explanation="Since dp[i][j] only depends on dp[i-1][j], dp[i][j-1], and dp[i-1][j-1], we can use two 1D arrays (prev and curr) of size n+1, reducing space from O(m*n) to O(n). With a single array and a temp variable, O(n) space."),
dict(num=147, topic="Dynamic Programming", title="Dice Game — Expected Value DP",
scenario="In a dice game where you roll a fair 6-sided die and can stop at any time to collect the rolled value (or reroll), what is the expected value of an optimal strategy?",
code="",
options=["A) 3.5","✓ B) Higher than 3.5 — reroll when value ≤ expected threshold, approximately 4.0","C) 2.5","D) 6.0"],
answer="B",explanation="Let E be the expected value. You keep the roll if it's > E, otherwise reroll. E = (1/6)*sum of values > E + (P(roll <= E))*E. Solving: E = 14/4 = 3.5? With optimal play: keep if die shows 4,5,6; E = (4+5+6)/3 * (3/6) + E*(3/6) => E/2 = 5 => E ≈ 4.0."),
dict(num=148, topic="Dynamic Programming", title="Minimum Number of Refueling Stops",
scenario="'Minimum Refueling Stops' can be solved greedily using a max-heap. The greedy insight is:",
code="",
options=["A) Always refuel at the first available station","B) Always skip stations","✓ C) When stuck (can't reach next station), retroactively pick the largest refuel amount seen so far from the heap","D) Sort stations by fuel amount"],
answer="C",explanation="Use a max-heap of fuel amounts at passed stations. When current fuel can't reach the next station, greedily pop the largest fuel from the heap (retroactively refueling there). Increment stops count. This greedy with heap is O(n log n)."),
dict(num=149, topic="Recursion", title="Generate Valid Parentheses — Counting",
scenario="The number of valid parentheses strings with n pairs equals:",
code="",
options=["A) 2^n","B) n!","✓ C) C(n) — the n-th Catalan number","D) n^2"],
answer="C",explanation="Valid parentheses strings with n pairs are counted by Catalan numbers: C(0)=1, C(1)=1, C(2)=2, C(3)=5, C(4)=14. The backtracking generates all C(n) solutions."),
dict(num=150, topic="Dynamic Programming", title="Buying and Selling Stock — State Machine Summary",
scenario="Which state machine correctly models 'Best Time to Buy and Sell Stock III' (at most 2 transactions)?",
code="""\
// States: buy1, sell1, buy2, sell2
buy1 = max(buy1, -price)
sell1 = max(sell1, buy1 + price)
buy2 = max(buy2, sell1 - price)
sell2 = max(sell2, buy2 + price)""",
options=["A) Incorrect — should use 2D DP only","✓ B) Correct — represents optimal profit at each stage of two transactions","C) Incorrect — buy2 should not depend on sell1","D) Correct only for unlimited transactions"],
answer="B",explanation="This elegant state machine captures two transaction stages. buy1: best profit if currently holding stock from first buy. sell1: best profit after first sale. buy2: best profit after buying second stock (uses sell1 profit). sell2: final profit after second sale."),
# ── SECTION 4 : LANGUAGE INTERNALS & CODE COMPREHENSION (Q151–Q200) ──────
dict(num=151, topic="C++ Internals", title="std::vector Capacity Doubling",
scenario="After the following operations, what is the capacity of v?",
code="""\
std::vector<int> v;
for (int i = 0; i < 17; i++)
v.push_back(i);
// Assuming initial capacity = 1, doubling strategy""",
options=["A) 17","B) 18","✓ C) 32","D) 16"],
answer="C",explanation="Starting at capacity 1: grows to 2→4→8→16 (after 16 pushes). The 17th push triggers another doubling to 32. GCC/Clang typically use doubling; MSVC uses 1.5x growth. The capacity is 32."),
dict(num=152, topic="C++ Internals", title="std::vector vs std::deque Access Complexity",
scenario="What is the complexity of random access by index for std::vector vs std::deque?",
code="",
options=["✓ A) vector: O(1); deque: O(1) but with larger constant","B) vector: O(1); deque: O(n)","C) Both O(log n)","D) vector: O(n); deque: O(1)"],
answer="A",explanation="std::vector stores contiguous memory: O(1) by pointer arithmetic. std::deque uses chunked storage (array of pointers to fixed-size blocks): O(1) mathematically (two-level index) but with larger constant due to indirection."),
dict(num=153, topic="C++ Internals", title="Dangling Iterator After Reallocation",
scenario="What happens to an iterator to a std::vector element after push_back causes reallocation?",
code="""\
vector<int> v = {1, 2, 3};
auto it = v.begin();
v.push_back(4); // May trigger reallocation
cout << *it; // ?""",
options=["A) Prints 1 always","✓ B) Undefined behavior — iterator is invalidated if reallocation occurs","C) Prints 0","D) Throws std::bad_iterator"],
answer="B",explanation="If push_back triggers reallocation, all iterators, pointers, and references to vector elements are invalidated. Dereferencing them is undefined behavior. Use index-based access to avoid this."),
dict(num=154, topic="C++ Internals", title="std::unordered_map Worst-Case Lookup",
scenario="In the worst case (all keys hash to same bucket), std::unordered_map lookup is:",
code="",
options=["✓ A) O(n) — degrades to linked list traversal","B) O(log n)","C) O(1) always","D) O(n log n)"],
answer="A",explanation="std::unordered_map uses separate chaining. With all n keys in one bucket, lookup traverses the entire chain: O(n). This occurs with hash collision attacks. Since C++11, some implementations switch to RB-tree (O(log n)) when a bucket exceeds a threshold."),
dict(num=155, topic="C++ Internals", title="Smart Pointer — shared_ptr Reference Count",
scenario="What does this code print?",
code="""\
#include <memory>
#include <iostream>
int main() {
auto p1 = std::make_shared<int>(42);
auto p2 = p1;
auto p3 = p1;
std::cout << p1.use_count() << std::endl;
p2.reset();
std::cout << p1.use_count() << std::endl;
}""",
options=["A) 2 then 1","✓ B) 3 then 2","C) 1 then 0","D) 3 then 1"],
answer="B",explanation="After make_shared and two copies, use_count=3. After p2.reset(), one reference dropped: use_count=2. p1 and p3 still share ownership. Memory freed only when count reaches 0."),
dict(num=156, topic="C++ Internals", title="Move Semantics — std::move Effect",
scenario="After std::move, what is the state of the moved-from object?",
code="""\
std::string s1 = \"hello\";
std::string s2 = std::move(s1);
std::cout << s1.size();""",
options=["A) 5 — s1 unchanged","✓ B) 0 or unspecified — s1 is in a valid but unspecified state","C) Undefined behavior","D) Compilation error"],
answer="B",explanation="After std::move, s1 is in a valid but unspecified state (standard guarantee). In practice, s1.size() returns 0 (moved-from string is empty), but you should not rely on specific state. Accessing size() is safe; using content is not."),
dict(num=157, topic="C++ Internals", title="RAII and Exception Safety",
scenario="Why does using std::unique_ptr instead of raw new/delete guarantee no memory leak even with exceptions?",
code="",
options=["A) unique_ptr catches exceptions","B) unique_ptr uses try-catch internally","✓ C) unique_ptr destructor runs during stack unwinding, freeing memory regardless of how scope is exited","D) Exceptions don't affect unique_ptr"],
answer="C",explanation="RAII: resource acquisition in constructor, release in destructor. When an exception unwinds the stack, destructors of all local objects (including unique_ptr) are called in reverse order of construction, ensuring cleanup regardless of exception."),
dict(num=158, topic="C++ Internals", title="Virtual Destructor Necessity",
scenario="Why must a base class destructor be virtual if derived objects are deleted via base pointer?",
code="""\
class Base { public: ~Base() { /* no virtual */ } };
class Derived : public Base { int* data; public:
Derived() { data = new int[100]; }
~Derived() { delete[] data; } // never called?
};
Base* b = new Derived();
delete b; // Problem?""",
options=["A) Compiles but runs correctly","✓ B) Undefined behavior — ~Derived() not called, causes memory leak","C) Throws exception at runtime","D) delete calls both destructors automatically"],
answer="B",explanation="Without virtual destructor, `delete b` calls Base::~Base() (static dispatch on Base*). Derived::~Derived() is never called, so `data` array is never freed — memory leak and UB. Always declare base class destructor virtual."),
dict(num=159, topic="C Internals", title="malloc vs calloc",
scenario="What is the key behavioral difference between malloc and calloc?",
code="",
options=["A) malloc is faster always","✓ B) malloc does not initialize memory; calloc zero-initializes the allocated memory","C) calloc takes one argument; malloc takes two","D) malloc is for single objects; calloc is for arrays"],
answer="B",explanation="malloc(n) allocates n bytes, content undefined. calloc(n, size) allocates n*size bytes AND zero-initializes them. calloc(3,4) is conceptually equivalent to memset(malloc(12), 0, 12) but calloc may be OS-optimized (requesting zeroed pages)."),
dict(num=160, topic="C Internals", title="realloc Behavior on Failure",
scenario="What is the bug in this realloc usage?",
code="""\
int* arr = (int*)malloc(10 * sizeof(int));
arr = (int*)realloc(arr, 20 * sizeof(int)); // BUG?
if (!arr) { /* handle error */ }""",
options=["A) realloc should not be cast","✓ B) If realloc fails and returns NULL, original pointer arr is overwritten with NULL, causing memory leak of original block","C) Should use calloc instead","D) 20*sizeof(int) is invalid"],
answer="B",explanation="If realloc returns NULL (allocation failure), assigning it to arr loses the only pointer to the original block — memory leak. Correct pattern: `int* tmp = realloc(arr, 20*sizeof(int)); if (tmp) arr = tmp; else /* handle error, arr still valid */`."),
dict(num=161, topic="C Internals", title="Struct Padding — Size Calculation",
scenario="What is sizeof(S) on a 64-bit system with natural alignment?",
code="""\
struct S {
char a; // 1 byte
int b; // 4 bytes
char c; // 1 byte
double d; // 8 bytes
};""",
options=["A) 14 bytes","B) 16 bytes","✓ C) 24 bytes","D) 20 bytes"],
answer="C",explanation="Layout: char a(1) + 3 padding + int b(4) = 8 bytes. Then char c(1) + 7 padding + double d(8) = 16 bytes. Total: 24. Struct padding aligns each member to its natural alignment and adds trailing padding to make struct size a multiple of its largest member alignment (8)."),
dict(num=162, topic="C Internals", title="Dangling Pointer — Use After Free",
scenario="What is the output of this C program?",
code="""\
#include <stdio.h>
#include <stdlib.h>
int main() {
int* p = (int*)malloc(sizeof(int));
*p = 42;
free(p);
printf(\"%d\\n\", *p); // ?
return 0;
}""",
options=["A) 42 always","B) 0 always","✓ C) Undefined behavior — p is a dangling pointer after free","D) Segfault always"],
answer="C",explanation="After free(p), p points to deallocated memory — a dangling pointer. Dereferencing it is undefined behavior. It may print 42 (value not yet overwritten), 0, garbage, or crash. Correct fix: p = NULL after free."),
dict(num=163, topic="Java Internals", title="HashMap Treeification Threshold",
scenario="In Java 8+, a HashMap bucket converts from a linked list to a Red-Black Tree when:",
code="",
options=["A) Load factor > 0.75","✓ B) Bucket length exceeds 8 (TREEIFY_THRESHOLD) AND total capacity >= 64","C) Number of entries > 1000","D) Hash collision rate > 50%"],
answer="B",explanation="HashMap.TREEIFY_THRESHOLD=8, MIN_TREEIFY_CAPACITY=64. When a bucket's chain exceeds 8 entries AND the total table size is at least 64, the chain is converted to a TreeNode (RB-Tree). Below 64 total capacity, a resize is preferred instead."),
dict(num=164, topic="Java Internals", title="String intern() and Memory",
scenario="What does String.intern() return?",
code="""\
String a = new String(\"hello\");
String b = \"hello\";
String c = a.intern();
System.out.println(b == c); // ?
System.out.println(a == c); // ?""",
options=["A) false, false","B) true, true","✓ C) true, false","D) false, true"],
answer="C",explanation="b is an interned string from the string pool. a.intern() returns the canonical representation from the pool — the same object as b. So b==c is true. a itself is a heap object (new String(...)), different from the pool object: a==c is false."),
dict(num=165, topic="Java Internals", title="GC Trigger During Deep Recursion",
scenario="A recursive algorithm allocating a new object at each call depth processes 10^6 levels. The JVM's primary concern is:",
code="",
options=["A) CPU overheating","✓ B) StackOverflowError from exhausting the thread stack (each frame ~100-1000 bytes, default stack ~512KB-1MB)","C) Heap exhaustion from objects","D) ClassLoader overhead"],
answer="B",explanation="Default JVM thread stack is ~512KB-1MB. Each stack frame uses memory for local variables and return addresses. At 10^6 levels, even 1 byte per frame overflows. This causes StackOverflowError (not OutOfMemoryError). GC manages heap; the stack is separate."),
dict(num=166, topic="Java Internals", title="ArrayList vs LinkedList — Cache Performance",
scenario="For sequential iteration over 10^6 elements, ArrayList outperforms LinkedList primarily because:",
code="",
options=["A) ArrayList has O(1) size() method","✓ B) ArrayList's contiguous memory layout is cache-friendly; LinkedList nodes are scattered in memory causing cache misses","C) LinkedList has O(n) get(i)","D) ArrayList uses primitives internally"],
answer="B",explanation="Modern CPUs prefetch cache lines (64 bytes) sequentially. ArrayList's backing array benefits from spatial locality: iterating through it is cache-friendly. LinkedList nodes are heap-allocated individually with pointers to next nodes — poor spatial locality causes frequent cache misses."),
dict(num=167, topic="Java Internals", title="volatile vs synchronized",
scenario="When should volatile be used instead of synchronized?",
code="",
options=["A) When multiple threads update a shared variable","✓ B) When only one thread writes and others read a shared variable (visibility guarantee without atomicity overhead)","C) For compound operations like i++","D) volatile is always faster and should replace synchronized"],
answer="B",explanation="volatile guarantees visibility (writes are immediately flushed to main memory; reads bypass cache). But it does NOT guarantee atomicity. i++ (read-modify-write) requires synchronized or AtomicInteger even with volatile. Use volatile for simple flags written by one thread."),
dict(num=168, topic="Java Internals", title="Java Memory Model — Object Creation on Heap",
scenario="When `new MyObject()` is called in Java, the object is allocated:",
code="",
options=["A) On the stack if size < 64 bytes","✓ B) On the heap (Eden space of Young Generation)","C) In the Metaspace","D) In the Old Generation immediately"],
answer="B",explanation="All Java objects are heap-allocated (unless JIT escape analysis proves they don't escape — 'stack allocation' optimization). New objects go to Eden (Young Gen). Long-lived objects are promoted to Old Gen after surviving several GC cycles."),
dict(num=169, topic="C++ Internals", title="std::map vs std::unordered_map — Ordered Iteration",
scenario="Which statement correctly compares std::map and std::unordered_map?",
code="",
options=["A) unordered_map always has O(1) lookup","✓ B) map: O(log n) all operations, keys sorted; unordered_map: O(1) average / O(n) worst-case, no order","C) map uses hash table","D) unordered_map supports lower_bound()"],
answer="B",explanation="std::map is a Red-Black Tree: O(log n) for insert/find/erase, keys in sorted order, supports lower_bound/upper_bound. std::unordered_map is a hash table: O(1) average, O(n) worst case, no ordering, no lower_bound."),
dict(num=170, topic="C Internals", title="Pointer Arithmetic — Array Navigation",
scenario="What does the following C code print?",
code="""\
int arr[] = {10, 20, 30, 40, 50};
int* p = arr + 2;
printf(\"%d %d\\n\", *(p-1), *(p+1));""",
options=["A) 10 40","✓ B) 20 40","C) 30 40","D) 20 30"],
answer="B",explanation="p = arr+2 points to arr[2]=30. *(p-1) = arr[1] = 20. *(p+1) = arr[3] = 40. Pointer arithmetic adds multiples of sizeof(int) to the address, not 1 byte."),
dict(num=171, topic="C++ Internals", title="Rule of Three/Five/Zero",
scenario="C++'s 'Rule of Five' states that if a class defines any of {destructor, copy constructor, copy assignment}, it should also define:",
code="",
options=["A) Virtual functions","✓ B) Move constructor and move assignment operator (to avoid defaulted moves being incorrect or deleted)","C) Default constructor","D) All member functions"],
answer="B",explanation="If you define a destructor (managing resources), the compiler-generated copy/move operations may be wrong. Defining the destructor suppresses default move. The Rule of Five: always define all five (or none and rely on Rule of Zero with RAII wrappers)."),
dict(num=172, topic="Java Internals", title="ConcurrentHashMap vs HashMap Thread Safety",
scenario="ConcurrentHashMap in Java 8 achieves thread safety using:",
code="",
options=["A) Locking the entire map (like Hashtable)","✓ B) Lock-free reads (volatile nodes) and CAS + synchronized on individual buckets for writes","C) ReadWriteLock on the whole map","D) Copying the map on each write (copy-on-write)"],
answer="B",explanation="Java 8 ConcurrentHashMap: reads are lock-free using volatile Node references. Writes use CAS for empty buckets and synchronized on the head node of a bucket for non-empty ones. This allows maximum concurrency without locking the whole map."),
dict(num=173, topic="C Internals", title="Function Pointer Syntax",
scenario="Which declaration correctly declares a function pointer to a function taking int, returning double?",
code="",
options=["A) double* fp(int)","B) double (*fp)(int)*","✓ C) double (*fp)(int)","D) (*double)(int) fp"],
answer="C",explanation="Function pointer syntax: return_type (*pointer_name)(parameter_types). `double (*fp)(int)` declares fp as a pointer to a function taking int and returning double. Option A declares a function (not pointer) returning double*."),
dict(num=174, topic="C++ Internals", title="Lambda Capture — Reference vs Value",
scenario="What does this code print?",
code="""\
int x = 10;
auto f = [&x]() { return x * 2; };
x = 20;
std::cout << f();""",
options=["A) 20","✓ B) 40","C) 0","D) Undefined behavior"],
answer="B",explanation="[&x] captures x by reference. When f() is called, x is already 20. So f() returns 20*2 = 40. Contrast with [x] (capture by value at lambda creation time), which would capture x=10 and return 20."),
dict(num=175, topic="Java Internals", title="Integer Cache — == vs equals()",
scenario="What does this print?",
code="""\
Integer a = 127;
Integer b = 127;
Integer c = 128;
Integer d = 128;
System.out.println(a == b); // ?
System.out.println(c == d); // ?""",
options=["A) false, false","B) true, true","✓ C) true, false","D) false, true"],
answer="C",explanation="Java caches Integer objects for values -128 to 127. a==b compares the same cached object: true. 128 is outside the cache range: c and d are distinct heap objects, so c==d compares references: false. Always use .equals() for Integer comparison."),
dict(num=176, topic="C++ Internals", title="Template Instantiation — Code Bloat",
scenario="A function template `template<typename T> void sort(vector<T>&)` instantiated with 10 different types generates:",
code="",
options=["A) One function shared by all types","✓ B) 10 separate compiled functions (one per type) in the binary","C) A runtime dispatch table","D) A single virtual function"],
answer="B",explanation="C++ templates are expanded at compile time. Each unique template instantiation (sort<int>, sort<double>, etc.) generates separate machine code. This can cause 'code bloat' — binary size grows with the number of distinct type instantiations."),
dict(num=177, topic="C Internals", title="Stack vs Heap — Return Address Safety",
scenario="Why is returning a pointer to a local variable dangerous?",
code="""\
int* getVal() {
int x = 42;
return &x; // DANGER?
}""",
options=["A) x is const and can't be pointed to","✓ B) x is on the stack and is destroyed when getVal() returns; the pointer becomes dangling","C) This returns the address of x correctly","D) int* can't point to local variables"],
answer="B",explanation="Local variables live on the stack frame of their function. When getVal() returns, its stack frame is reclaimed. The returned pointer now points to deallocated stack memory — undefined behavior when dereferenced. Return heap-allocated memory or pass a pointer in as a parameter."),
dict(num=178, topic="Java Internals", title="Stack Memory — Primitive vs Reference",
scenario="In Java, when a method executes `int x = 5; String s = new String('hi');`, what is on the stack vs heap?",
code="",
options=["A) Both x and s are on the stack","✓ B) x (primitive int, value 5) is on the stack; the String object is on the heap; s (reference) is on the stack","C) Both are on the heap","D) x is on the heap; s is on the stack"],
answer="B",explanation="Java: primitives and references are stored on the stack frame. The actual object a reference points to is always on the heap. So x=5 (4 bytes on stack), s (reference/pointer, 4-8 bytes on stack), 'hi' String object (heap)."),
dict(num=179, topic="C++ Internals", title="std::string SSO — Short String Optimization",
scenario="Most std::string implementations avoid heap allocation for short strings via SSO (Short String Optimization). The typical threshold is:",
code="",
options=["A) 4 characters","B) 8 characters","✓ C) 15-22 characters (implementation defined, typically 15 on GCC/Clang, 22 on MSVC)","D) 64 characters"],
answer="C",explanation="SSO stores short strings directly in the string object's internal buffer (using space that would otherwise store pointer/size/capacity). GCC's libstdc++ uses 15 chars in-place; MSVC uses 15; libc++ uses 22. This avoids heap allocation for common short strings."),
dict(num=180, topic="C Internals", title="sizeof Operator — Array Decay",
scenario="What does this C code print?",
code="""\
void printSize(int arr[]) {
printf(\"%zu\\n\", sizeof(arr));
}
int main() {
int a[10];
printf(\"%zu\\n\", sizeof(a));
printSize(a);
}""",
options=["A) 40 and 40","B) 10 and 10","✓ C) 40 and 8 (on 64-bit — array decays to pointer when passed)","D) 40 and 4"],
answer="C",explanation="sizeof(a) in main = 10 * sizeof(int) = 40. When passed to a function, arrays decay to pointers: sizeof(arr) inside printSize = sizeof(int*) = 8 (64-bit). This is a classic C pitfall — always pass array size separately."),
dict(num=181, topic="Java Internals", title="Garbage Collection — GC Roots",
scenario="JVM GC roots include which of the following?",
code="",
options=["A) All objects in the Old Generation","✓ B) Active thread stacks, static fields, JNI references, and class loader references","C) Objects with reference count > 0","D) Objects in the Eden space only"],
answer="B",explanation="GC roots are starting points for reachability analysis. They include: local variables on thread stacks, static fields of loaded classes, active JNI references, and references held by the JVM itself. Any object reachable from a GC root is considered live."),
dict(num=182, topic="C++ Internals", title="Undefined Behavior — Signed Integer Overflow",
scenario="In C++, what is the result of `int x = INT_MAX; x++;`?",
code="",
options=["A) Wraps to INT_MIN (defined behavior)","✓ B) Undefined behavior — signed integer overflow is UB in C++","C) Throws an exception","D) Returns 0"],
answer="B",explanation="Unlike unsigned integers (which wrap around modulo 2^n, well-defined in C/C++), signed integer overflow is explicitly undefined behavior. Compilers may assume it never happens and optimize accordingly, producing surprising results if it does occur."),
dict(num=183, topic="Java Internals", title="StringBuilder vs String Concatenation",
scenario="In a loop concatenating n strings with +: `s = s + parts[i]`, the time complexity is:",
code="",
options=["A) O(n)","B) O(n log n)","✓ C) O(n^2) — each + creates a new String object copying previous content","D) O(1) amortized"],
answer="C",explanation="String is immutable in Java. Each + creates a new String, copying all previous content. Concatenating strings of total length L: total work is 1+2+3+...+L = O(L^2) = O(n^2) for n equal-length strings. Use StringBuilder for O(n) concatenation."),
dict(num=184, topic="C Internals", title="Union Type Reinterpretation",
scenario="What does this C code print on a little-endian system?",
code="""\
#include <stdio.h>
union U {
int i;
char c[4];
};
int main() {
union U u;
u.i = 0x01020304;
printf(\"%d\\n\", u.c[0]);
}""",
options=["A) 1","B) 3","✓ C) 4","D) Undefined behavior"],
answer="C",explanation="On a little-endian system, the least significant byte is stored first. 0x01020304: byte 0 (c[0]) = 0x04 = 4, byte 1 = 0x03 = 3, byte 2 = 0x02 = 2, byte 3 (most significant) = 0x01 = 1. Answer: 4."),
dict(num=185, topic="C++ Internals", title="CRTP — Curiously Recurring Template Pattern",
scenario="CRTP is used to achieve:",
code="""\
template<typename Derived>
class Base {
public:
void interface() {
static_cast<Derived*>(this)->implementation();
}
};
class Derived : public Base<Derived> {
public:
void implementation() { /* ... */ }
};""",
options=["A) Dynamic polymorphism without overhead","✓ B) Static polymorphism — compile-time dispatch without vtable overhead","C) Multiple inheritance","D) Template specialization"],
answer="B",explanation="CRTP achieves polymorphism resolved at compile time via static_cast, avoiding virtual dispatch overhead (no vtable lookup). Useful for mixins and performance-critical code. The derived class type is known at compile time via the template parameter."),
dict(num=186, topic="Java Internals", title="finalize() vs try-with-resources",
scenario="Why is try-with-resources preferred over finalize() for resource cleanup?",
code="",
options=["A) finalize() is faster","✓ B) finalize() has non-deterministic timing (depends on GC), may never run, deprecated in Java 9+. try-with-resources guarantees immediate cleanup","C) try-with-resources uses less memory","D) finalize() doesn't handle exceptions"],
answer="B",explanation="finalize() is called by GC — unpredictable timing, possibly never (app may exit), deprecated in Java 9, removed in Java 18. try-with-resources (AutoCloseable.close()) runs deterministically at block exit, guaranteed for resource cleanup."),
dict(num=187, topic="C++ Internals", title="std::optional — Avoiding Null Pointer",
scenario="std::optional<T> has what memory overhead compared to T?",
code="",
options=["A) No overhead","✓ B) sizeof(T) + 1 byte (minimum, for the 'has value' boolean flag), potentially padded","C) sizeof(T) * 2","D) 8 bytes (pointer size) overhead"],
answer="B",explanation="std::optional stores the value in-place (not on the heap) plus a bool indicating presence. Due to alignment, the overhead may be more than 1 byte in practice (padding). This is much more efficient than heap-allocating a pointer."),
dict(num=188, topic="C Internals", title="memcpy vs memmove for Overlapping Regions",
scenario="When source and destination memory regions overlap, which function must be used?",
code="",
options=["A) memcpy — it handles overlap","✓ B) memmove — it correctly handles overlapping regions by using a temporary buffer or copying in the right direction","C) strcpy","D) Either works identically"],
answer="B",explanation="memcpy behavior is undefined for overlapping regions (compiler may use SIMD optimizations assuming no overlap). memmove guarantees correct behavior by checking overlap direction and copying accordingly (back-to-front if necessary to avoid overwriting source data)."),
dict(num=189, topic="Java Internals", title="Java Generics — Type Erasure",
scenario="Due to type erasure, List<Integer> and List<String> at runtime are both:",
code="",
options=["A) Different JVM classes","B) List<Object>","✓ C) Both just List (raw type) — generic type info is erased at compile time","D) Integer[] and String[]"],
answer="C",explanation="Java generics use type erasure: generic type parameters are removed at runtime. ArrayList<Integer> and ArrayList<String> are both ArrayList at the bytecode level. This is why instanceof with generics is not allowed: `obj instanceof List<Integer>` doesn't compile."),
dict(num=190, topic="C++ Internals", title="constexpr vs const — Compile-time Evaluation",
scenario="What is the key difference between const and constexpr in C++11+?",
code="",
options=["A) const is for runtime, constexpr is for compile time","B) constexpr can only be used with integers","✓ C) const guarantees value won't change after initialization; constexpr guarantees evaluation AT COMPILE TIME (enables use in template arguments, array sizes)","D) They are identical"],
answer="C",explanation="const: value doesn't change after init, but may be initialized at runtime. constexpr: must be computable at compile time. constexpr values can be used as template arguments, array sizes, and in other compile-time contexts. constexpr functions can run at both compile and runtime."),
dict(num=191, topic="Java Internals", title="Thread Local Storage in Java",
scenario="ThreadLocal<T> in Java provides:",
code="",
options=["A) Synchronized access to shared T","B) A lock-free T shared across threads","✓ C) A separate instance of T for each thread, stored in Thread's own map","D) A cached T on the heap"],
answer="C",explanation="ThreadLocal maintains a ThreadLocalMap inside each Thread object. get/set operations on a ThreadLocal access the current thread's own copy — completely isolated from other threads, requiring no synchronization. Useful for thread-safe SimpleDateFormat, database connections, etc."),
dict(num=192, topic="C Internals", title="Bit Fields in Structs",
scenario="How many bytes does this struct likely occupy?",
code="""\
struct Flags {
unsigned int a : 1;
unsigned int b : 3;
unsigned int c : 4;
};""",
options=["A) 1 byte","B) 3 bytes","✓ C) 4 bytes — packed into one int","D) 8 bytes"],
answer="C",explanation="Bit fields pack multiple fields into a single storage unit. a(1)+b(3)+c(4) = 8 bits = 1 byte, but the underlying type is unsigned int (4 bytes). The compiler uses one int word for all these fields. sizeof(Flags) = 4."),
dict(num=193, topic="C++ Internals", title="Placement New — Custom Allocators",
scenario="Placement new is used for:",
code="""\
char buf[sizeof(MyClass)];
MyClass* obj = new (buf) MyClass(); // placement new""",
options=["A) Allocating on the stack automatically","✓ B) Constructing an object at a pre-allocated memory address without allocating new memory","C) Allocating in shared memory","D) Creating global objects"],
answer="B",explanation="Placement new calls the constructor on an already-allocated memory region (here, the char buffer buf). No memory allocation occurs. Useful for memory pools, shared memory, and embedded systems where allocation is controlled separately from construction."),
dict(num=194, topic="Java Internals", title="double-checked Locking — Singleton",
scenario="The double-checked locking singleton pattern requires volatile because:",
code="""\
class Singleton {
private static volatile Singleton instance;
public static Singleton getInstance() {
if (instance == null) {
synchronized (Singleton.class) {
if (instance == null)
instance = new Singleton(); // Why volatile?
}
}
return instance;
}
}""",
options=["A) synchronized doesn't work without volatile","✓ B) Without volatile, CPU/compiler may reorder so a partially constructed instance is visible to other threads before initialization is complete","C) volatile prevents GC from collecting instance","D) volatile makes the check faster"],
answer="B",explanation="`new Singleton()` involves: allocate memory, initialize fields, assign reference. Without volatile, JVM/CPU may reorder to: allocate, assign reference, initialize fields. Another thread sees non-null but uninitialized instance. volatile prevents this reordering via memory barrier."),
dict(num=195, topic="C Internals", title="getchar Returning int — Not char",
scenario="Why does getchar() return int instead of char?",
code="""\
int c; // NOT char c!
while ((c = getchar()) != EOF) {
putchar(c);
}""",
options=["A) For performance reasons","B) char can't hold letter values","✓ C) EOF is -1 (typically), which can't fit in unsigned char (0-255). Using char would make EOF indistinguishable from character 255","D) getchar returns Unicode code points"],
answer="C",explanation="EOF is typically -1. If c were char (implementation-defined signedness), on unsigned char systems, char can't hold -1 — EOF would wrap to 255, matching the character ÿ. Using int ensures all 256 char values AND EOF (-1) can be distinguished."),
dict(num=196, topic="C++ Internals", title="Structured Bindings C++17",
scenario="What does this C++17 code print?",
code="""\
#include <map>
#include <iostream>
int main() {
std::map<int,std::string> m = {{1,\"one\"},{2,\"two\"}};
for (auto& [key, val] : m) {
std::cout << key << \":\" << val << \" \";
}
}""",
options=["A) Compilation error in C++14","B) 2:two 1:one (unordered)","✓ C) 1:one 2:two (map iterates in sorted key order)","D) Undefined behavior"],
answer="C",explanation="std::map is ordered by key. Structured bindings (C++17) decompose the pair<const int, string> into key and val. Iterating prints keys in ascending order: '1:one 2:two'. This code requires C++17 or later."),
dict(num=197, topic="Java Internals", title="String Pool — intern() Memory Impact",
scenario="Calling intern() on millions of dynamically generated strings risks:",
code="",
options=["A) Stack overflow","✓ B) Metaspace/PermGen exhaustion (pre-Java 7: PermGen; Java 7+: heap; Java 8+: native memory via Metaspace)","C) Deadlock","D) ClassCastException"],
answer="B",explanation="The string pool (interning) stores strings in a dedicated area. Pre-Java 7: PermGen (fixed size, easily exhausted). Java 7+: moved to heap (subject to GC). Java 8+: native memory. Interning millions of unique strings still risks memory exhaustion regardless of location."),
dict(num=198, topic="C Internals", title="Undefined Behavior — Strict Aliasing",
scenario="What is the issue with this C code?",
code="""\
float f = 3.14f;
int* ip = (int*)&f; // strict aliasing violation?
printf(\"%d\\n\", *ip);""",
options=["A) float cannot be cast to int*","✓ B) Undefined behavior — violates strict aliasing rule; use memcpy or union for type punning","C) Prints the integer value 3","D) Safe with -O0 optimization"],
answer="B",explanation="C's strict aliasing rule: an object may only be accessed through its declared type (or char*). Accessing a float through int* violates this, allowing compilers to assume they don't alias and generate incorrect optimized code. Use memcpy(&i, &f, 4) or a union for safe type punning."),
dict(num=199, topic="C++ Internals", title="std::atomic vs mutex for Counter",
scenario="For a thread-safe counter incremented by multiple threads, std::atomic<int> vs mutex: which is preferred and why?",
code="",
options=["A) mutex — always safer","✓ B) std::atomic<int> — uses hardware CAS/lock-prefix instructions; no OS-level locking, lower overhead for single-variable operations","C) volatile int — sufficient for threading","D) They are identical in performance"],
answer="B",explanation="std::atomic uses CPU-level atomic instructions (CMPXCHG, LOCK ADD) without OS involvement — no context switching or kernel calls. mutex involves OS primitives (futex on Linux), much heavier for simple increment. volatile provides no atomicity guarantee."),
dict(num=200, topic="Java Internals", title="JVM JIT — Method Inlining Threshold",
scenario="The JVM's JIT compiler inlines a method when:",
code="",
options=["A) The method is declared final","B) The method is less than 10 bytecodes","✓ C) The method is 'hot' (called frequently, typically >10,000 times) and small enough (typically <35 bytecodes for trivial, <325 for complex)","D) The method has no loops"],
answer="C",explanation="JIT inlining is a key optimization: eliminate call overhead and enable further optimizations (constant folding, escape analysis). HotSpot inlines methods that are 'hot' (profiling threshold) and not too large. -XX:MaxInlineSize (default 35 bytecodes) and -XX:FreqInlineSize (default 325) control thresholds."),
]
# ═══════════════════════════════════════════════════════════════════════════
# BUILD STORY
# ═══════════════════════════════════════════════════════════════════════════
SECTIONS = [
("SECTION I — TREES & ADVANCED HIERARCHIES", 1, 50, colors.HexColor("#1A237E")),
("SECTION II — GRAPHS & NETWORKS", 51, 100, colors.HexColor("#1B5E20")),
("SECTION III — RECURSION & DYNAMIC PROGRAMMING", 101, 150, colors.HexColor("#4A148C")),
("SECTION IV — LANGUAGE INTERNALS & CODE COMPREHENSION", 151, 200, colors.HexColor("#B71C1C")),
]
story = []
# ── Cover Page ────────────────────────────────────────────────────────────
story.append(Spacer(1, 3*cm))
cover_data = [[Paragraph("DSA MCQ BANK", sTitle)]]
ct = Table(cover_data, colWidths=[W-4*cm])
ct.setStyle(TableStyle([
("BACKGROUND",(0,0),(-1,-1), C_LIGHT),
("TOPPADDING",(0,0),(-1,-1), 20),
("BOTTOMPADDING",(0,0),(-1,-1), 20),
("LEFTPADDING",(0,0),(-1,-1), 12),
("RIGHTPADDING",(0,0),(-1,-1), 12),
]))
story.append(ct)
story.append(Spacer(1, 0.4*cm))
story.append(Paragraph("200 Premium Questions for Tier-1 Engineering Interviews", sSubtitle))
story.append(Paragraph("Data Structures & Algorithms · Deep Code Comprehension · System Tradeoffs", sMeta))
story.append(Spacer(1, 0.5*cm))
# badges
badge_data = [[
Paragraph("<b>200 Questions</b>", S("b1",fontSize=9,textColor=colors.white,fontName="Helvetica-Bold",alignment=TA_CENTER)),
Paragraph("<b>4 Core Areas</b>", S("b2",fontSize=9,textColor=colors.white,fontName="Helvetica-Bold",alignment=TA_CENTER)),
Paragraph("<b>Tier-1 Ready</b>", S("b3",fontSize=9,textColor=colors.white,fontName="Helvetica-Bold",alignment=TA_CENTER)),
Paragraph("<b>C / C++ / Java</b>",S("b4",fontSize=9,textColor=colors.white,fontName="Helvetica-Bold",alignment=TA_CENTER)),
]]
bt = Table(badge_data, colWidths=[(W-4*cm)/4]*4)
bt.setStyle(TableStyle([
("BACKGROUND",(0,0),(0,0), C_DEEP),
("BACKGROUND",(1,0),(1,0), C_GREEN),
("BACKGROUND",(2,0),(2,0), colors.HexColor("#E65100")),
("BACKGROUND",(3,0),(3,0), colors.HexColor("#4A148C")),
("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
("LEFTPADDING",(0,0),(-1,-1),4),("RIGHTPADDING",(0,0),(-1,-1),4),
("ROUNDEDCORNERS",[4]),
]))
story.append(bt)
story.append(Spacer(1, 2*cm))
# question type legend
legend = [
["Type", "Description"],
["Output Prediction", "Dry-run code to find exact output or heap state"],
["Bug Hunting", "Find the subtle logical flaw and precise fix"],
["Complexity Analysis","Determine strict worst/average/amortized Big-O"],
["System Mapping", "Choose optimal data structure for real-world scale"],
]
lt = Table(legend, colWidths=[4.5*cm, W-4*cm-4.5*cm])
lt.setStyle(TableStyle([
("BACKGROUND",(0,0),(-1,0), C_DEEP),
("TEXTCOLOR",(0,0),(-1,0), colors.white),
("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
("FONTSIZE",(0,0),(-1,-1),9),
("FONTNAME",(0,1),(-1,-1),"Helvetica"),
("BACKGROUND",(0,1),(-1,-1), C_LIGHT),
("ROWBACKGROUNDS",(0,1),(-1,-1),[C_LIGHT, colors.white]),
("GRID",(0,0),(-1,-1),0.5,colors.HexColor("#BBBBBB")),
("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
]))
story.append(lt)
story.append(PageBreak())
# ── Master Syllabus / TOC ─────────────────────────────────────────────────
story.append(Paragraph("MASTER TOPIC SYLLABUS & INDEX", sTocHead))
story.append(hr(C_DEEP, 2))
story.append(Spacer(1, 0.2*cm))
toc_sections = [
("SECTION I — TREES & ADVANCED HIERARCHIES (Q1–Q50)", [
"Q1–Q2: Binary Tree Post-order & BST Height", "Q3: BST In-order Successor Bug",
"Q4–Q5: BFS Space & Trie Complexity", "Q6: Autocomplete Engine Design (Trie)",
"Q7–Q8: Segment Tree Range Sum & Lazy Propagation", "Q9–Q10: AVL Rotations & Height Guarantee",
"Q11: Red-Black Tree Properties", "Q12: Diameter Bug (O(n^2) vs O(n))",
"Q13: Serialization Round-Trip", "Q14: LCA Complexity",
"Q15: Kth Smallest in BST", "Q16: Trie Node Memory (208 bytes)",
"Q17: Segment Tree Build O(n)", "Q18: Morris Traversal O(1) Space",
"Q19: AVL Min Nodes (Fibonacci)", "Q20: Suffix Trie vs Suffix Array",
"Q21: Zigzag Traversal", "Q22: BST Deletion Two-Children",
"Q23: Segment Tree Point Update", "Q24: Path Sum Leaf Bug",
"Q25: Count Complete Tree Nodes O(log^2 n)", "Q26: RB-Tree Recolor Rule",
"Q27: Vertical Order Traversal", "Q28: Segment Tree Max Subarray",
"Q29: Trie Pruning in Word Search II", "Q30: Flatten BT to LL In-Place",
"Q31: AVL RR Case Rotation", "Q32: Invert BT Complexity",
"Q33: BST Range Query O(h+k)", "Q34: Fenwick vs Segment Tree",
"Q35: Cousins in BT (depth+parent)", "Q36: Compressed Trie O(n) Nodes",
"Q37: BST Validation with Bounds", "Q38: 2D Fenwick Tree",
"Q39: Boundary Traversal Order", "Q40: AVL Deletion O(log n) Rotations",
"Q41: Max Width BFS", "Q42: XOR Maximization Trie O(n)",
"Q43: Merge Sort Tree Online vs Offline", "Q44: Recover BST Two Swaps",
"Q45: RB-Tree Min Nodes 2^k-1", "Q46: BT to DLL O(h) Space",
"Q47: Palindrome Pairs Trie O(nL^2)", "Q48: Reconstruct BT Hash Map O(n)",
"Q49: Merge Sort Tree Kth O(log^3 n)", "Q50: Threaded BT O(1) Traversal",
]),
("SECTION II — GRAPHS & NETWORKS (Q51–Q100)", [
"Q51: BFS Shortest Path Guarantee", "Q52: DFS O(V+E) Complexity",
"Q53: Dijkstra Failure on Negative Edges", "Q54: Kahn's BFS Topological Sort",
"Q55: Cycle Detection via Kahn's", "Q56: Dijkstra Heap Complexity O((V+E)logV)",
"Q57: DSU α(n) Amortized Cost", "Q58: Kruskal's O(E log E)",
"Q59: Multi-source BFS 0-1 Matrix", "Q60: Tarjan's Bridge Condition low[v]>disc[u]",
"Q61: Tarjan's SCC O(V+E)", "Q62: Bellman-Ford Negative Weights",
"Q63: Floyd-Warshall O(V^2) Space", "Q64: Bipartite Detection BFS",
"Q65: DSU Cycle Detection", "Q66: Ford-Fulkerson Irrational Termination",
"Q67: Prim's Dense O(V^2) vs Kruskal's", "Q68: DFS Topological Post-order",
"Q69: DAG Shortest Path O(V+E)", "Q70: Articulation Points Condition",
"Q71: Offline LCA Tarjan DSU", "Q72: A* Heuristic Advantage",
"Q73: Word Ladder BFS Return 0", "Q74: Euler Circuit Even Degree",
"Q75: Hamiltonian Path NP-Complete", "Q76: DFS Cross Edge Definition",
"Q77: Max Flow Min Cut Theorem", "Q78: Rotting Oranges Multi-BFS",
"Q79: Path Splitting vs Halving α(n)", "Q80: Johnson's O(V^2 log V) Sparse",
"Q81: SCC Social Network Interpretation", "Q82: Biconnected vs SCC",
"Q83: 8-Puzzle State Space 181440", "Q84: DFS Grid Number of Islands",
"Q85: Kosaraju's Two-Pass SCC", "Q86: MST Uniqueness Distinct Weights",
"Q87: 0-1 BFS Deque O(V+E)", "Q88: TSP Bitmask DP O(2^n * n^2)",
"Q89: DSU Rollback Without Path Compression", "Q90: Dinic's O(V^2 E)",
"Q91: Shortest Cycle O(V(V+E))", "Q92: Boggle DFS+Trie O(N^2 * 4^L)",
"Q93: Min-Cost Max-Flow Applications", "Q94: Alien Dictionary Topo Sort",
"Q95: Critical Connections = Bridge Finding", "Q96: Hopcroft-Karp O(E sqrt(V))",
"Q97: Weighted DSU Relative Ranking", "Q98: PageRank Power Iteration",
"Q99: Jump Game II BFS Levels", "Q100: Course Schedule II Cycle=Empty",
]),
("SECTION III — RECURSION & DP (Q101–Q150)", [
"Q101: 0/1 Knapsack State dp[i][w]", "Q102: Space Opt Backward Iteration",
"Q103: Unbounded Knapsack Forward", "Q104: LCS 'ABCBDAB','BDCAB' = 4",
"Q105: LIS = LCS with Sorted Array", "Q106: Edit Distance Recurrence",
"Q107: MCM dp[i][j] Min Cost", "Q108: MCM O(n^3)",
"Q109: Tower of Hanoi 2^n-1", "Q110: Coin Change Greedy Fails",
"Q111: LPS = LCS(s, reverse)", "Q112: Wildcard Matching Correct",
"Q113: Subset Sum = Knapsack", "Q114: Memoization Sparse States",
"Q115: Rod Cutting = Unbounded KS", "Q116: Burst Balloons Last-Burst Insight",
"Q117: LCS vs Longest Common Substring", "Q118: Tree MIS DP States",
"Q119: Palindrome Partition II dp[i]", "Q120: Subset Sum 2^n Baseline",
"Q121: Distinct Subsequences DP", "Q122: Largest Rectangle Stack O(n)",
"Q123: Catalan Numbers BST/Parens", "Q124: Permutations O(n*n!)",
"Q125: Stock Cooldown 3 States", "Q126: Interleaving String 2D DP",
"Q127: Palindrome Count O(n^2)", "Q128: Jump Game II Greedy O(n)",
"Q129: N-Queens 3-Set Conflict Check", "Q130: Longest Increasing Path O(mn)",
"Q131: Decode Ways State Machine", "Q132: Word Break DP+Trie",
"Q133: Distinct BSTs Catalan C(4)=14", "Q134: Memoization Space O(nk)",
"Q135: Kadane's max(a[i], dp+a[i])", "Q136: Min Path Sum Grid DP",
"Q137: Dice Roll dp[d][S]", "Q138: Combination Sum Termination",
"Q139: Regex DP '*' Two Cases", "Q140: Egg Drop Binary Search Opt",
"Q141: K Transactions Stock O(nk)", "Q142: Bitmask vs Backtrack Subsets",
"Q143: Min Window Subsequence DP", "Q144: Maximal Square Side-Length DP",
"Q145: Flood Fill Stack Overflow", "Q146: LCS Space O(n) Two Rows",
"Q147: Dice Expected Value ~4.0", "Q148: Refueling Stops Max-Heap",
"Q149: Valid Parentheses = Catalan", "Q150: Stock III State Machine",
]),
("SECTION IV — LANGUAGE INTERNALS (Q151–Q200)", [
"Q151: vector Capacity Doubling →32", "Q152: deque O(1) with Larger Constant",
"Q153: Iterator Invalidation on Realloc", "Q154: unordered_map O(n) Worst",
"Q155: shared_ptr use_count 3→2", "Q156: std::move Valid-but-Unspecified",
"Q157: RAII Exception Safety unique_ptr", "Q158: Virtual Destructor UB",
"Q159: malloc vs calloc Zero-Init", "Q160: realloc Null Memory Leak",
"Q161: Struct Padding 24 bytes", "Q162: Dangling Pointer Use-After-Free",
"Q163: HashMap Treeify Threshold=8", "Q164: String intern() b==c true",
"Q165: StackOverflow Deep Recursion", "Q166: ArrayList Cache Locality",
"Q167: volatile vs synchronized", "Q168: Java Object Eden Space",
"Q169: map vs unordered_map Trade-off", "Q170: Pointer Arithmetic 20 40",
"Q171: Rule of Five Move Semantics", "Q172: ConcurrentHashMap CAS+sync",
"Q173: Function Pointer Syntax", "Q174: Lambda Capture [&x] →40",
"Q175: Integer Cache 127 true/false", "Q176: Template Code Bloat 10 fns",
"Q177: Local Variable Dangling Return", "Q178: Java Stack vs Heap Primitives",
"Q179: SSO Threshold 15-22 chars", "Q180: sizeof Array Decay →8",
"Q181: GC Roots — Stack+Static+JNI", "Q182: Signed Overflow UB",
"Q183: String + loop O(n^2)", "Q184: Union Little-Endian →4",
"Q185: CRTP Static Polymorphism", "Q186: try-with-resources vs finalize",
"Q187: optional<T> sizeof(T)+1", "Q188: memmove Overlapping Regions",
"Q189: Type Erasure Raw List", "Q190: constexpr Compile-time Eval",
"Q191: ThreadLocal Per-Thread Map", "Q192: Bit Fields sizeof→4",
"Q193: Placement new Pre-allocated", "Q194: volatile Double-Checked Lock",
"Q195: getchar() Returns int EOF", "Q196: Structured Bindings map Order",
"Q197: intern() Metaspace Risk", "Q198: Strict Aliasing UB",
"Q199: atomic<int> vs mutex", "Q200: JIT Inlining Threshold HotSpot",
]),
]
for sec_title, items in toc_sections:
story.append(Paragraph(sec_title, sTocSec))
cols = [items[i::2] for i in range(2)]
max_rows = max(len(c) for c in cols)
tdata = []
for r in range(max_rows):
row = []
for c in cols:
row.append(Paragraph(c[r] if r < len(c) else "", sTocItem))
tdata.append(row)
tt = Table(tdata, colWidths=[(W-4*cm)/2]*2)
tt.setStyle(TableStyle([
("VALIGN",(0,0),(-1,-1),"TOP"),
("TOPPADDING",(0,0),(-1,-1),1),("BOTTOMPADDING",(0,0),(-1,-1),1),
]))
story.append(tt)
story.append(Spacer(1, 0.2*cm))
story.append(PageBreak())
# ── Question Sections ─────────────────────────────────────────────────────
sec_idx = 0
next_sec_start = SECTIONS[0][1]
current_sec = -1
for q in questions:
num = q["num"]
# insert section banner
for si, (stitle, s_start, s_end, scolor) in enumerate(SECTIONS):
if num == s_start and si != current_sec:
story.append(section_banner(stitle, scolor))
story.append(Spacer(1, 0.3*cm))
current_sec = si
break
story.append(q_block(
num = q["num"],
topic = q["topic"],
title = q["title"],
scenario = q.get("scenario",""),
code = q.get("code",""),
options = q["options"],
answer = q["answer"],
explanation = q["explanation"],
))
# ── Build ─────────────────────────────────────────────────────────────────
def on_page(canvas, doc):
canvas.saveState()
canvas.setFont("Helvetica", 7)
canvas.setFillColor(C_GREY)
canvas.drawString(2*cm, 1.2*cm, "DSA MCQ Bank — 200 Questions | Tier-1 Engineering Interview Preparation")
canvas.drawRightString(W-2*cm, 1.2*cm, f"Page {doc.page}")
canvas.restoreState()
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print("PDF generated successfully at:", OUTPUT)