-- ==========================================
-- PLACEMENT OS — DSA QUESTION DEDUPLICATION MIGRATION
-- Generated Automatically on 2026-07-10T07:22:04.800Z
-- ==========================================

BEGIN;

-- 1. MOCK TESTS ARRAY REMAPPING
UPDATE public.mock_tests mt
SET question_ids = ARRAY(
  SELECT COALESCE(
    CASE 
      WHEN x = 'contains-duplicate' THEN 'arr-l1-2'
      WHEN x = 'arr-r1' THEN 'arr-l1-3'
      WHEN x = 'hm-l1-2' THEN 'arr-l1-3'
      WHEN x = '121-best-time-to-buy-and-sell-stocs' THEN 'arr-l2-1'
      WHEN x = 'best-time-to-buy-and-sell-stock' THEN 'arr-l2-1'
      WHEN x = 'product-of-array-except-self' THEN 'arr-l2-2'
      WHEN x = 'kadanes-algorithm' THEN 'arr-l2-3'
      WHEN x = 'maximum-subarray' THEN 'arr-l2-3'
      WHEN x = 'sort-l3-1' THEN 'arr-l3-1'
      WHEN x = '88-merge-two-sorted-array-without-extra-space' THEN 'arr-l3-1'
      WHEN x = 'tp-l1-1' THEN 'str-l1-1'
      WHEN x = 'valid-palindrome' THEN 'str-l1-1'
      WHEN x = 'valid-anagram' THEN 'str-l1-2'
      WHEN x = 'longest-common-prefix' THEN 'str-l2-1'
      WHEN x = 'sw-l2-1' THEN 'str-l2-2'
      WHEN x = 'lc-3' THEN 'str-l2-2'
      WHEN x = 'longest-substring-without-repeating-characters' THEN 'str-l2-2'
      WHEN x = 'str-l3-1' THEN 'hm-l2-1'
      WHEN x = 'group-anagrams' THEN 'hm-l2-1'
      WHEN x = 'sw-l4-1' THEN 'str-l4-1'
      WHEN x = 'minimum-window-substring' THEN 'str-l4-1'
      WHEN x = 'hp-l2-2' THEN 'hm-l2-2'
      WHEN x = 'top-k-frequent-elements' THEN 'hm-l2-2'
      WHEN x = '128-finding-longest-subsequence-sum' THEN 'hm-l3-1'
      WHEN x = 'subarray-sums-equals-k' THEN 'hm-l4-1'
      WHEN x = '493-reverse-pairs' THEN 'sort-l2-1'
      WHEN x = 'sort-l4-1' THEN 'gr-l3-1'
      WHEN x = 'find-minimum-in-rotated-sorted-array' THEN 'bs-l2-2'
      WHEN x = 'search-in-rotated-sorted-array' THEN 'bs-l3-1'
      WHEN x = '875-koko-eating-bananas' THEN 'bs-l3-2'
      WHEN x = '4-median-of-two-sorted-arrays' THEN 'bs-l4-1'
      WHEN x = '184sum' THEN 'tp-l2-2'
      WHEN x = '3sum' THEN 'tp-l2-2'
      WHEN x = 'container-with-most-water' THEN 'tp-l3-1'
      WHEN x = 'trapping-rain-water' THEN 'tp-l4-1'
      WHEN x = 'st-l4-1' THEN 'st-l1-1'
      WHEN x = 'valid-paranthesis' THEN 'st-l1-1'
      WHEN x = 'valid-parentheses' THEN 'st-l1-1'
      WHEN x = 'implement-stack-using-queues' THEN 'qu-l1-1'
      WHEN x = 'tr-l2-3' THEN 'qu-l2-2'
      WHEN x = 'binary-tree-level-order-traversal' THEN 'qu-l2-2'
      WHEN x = 'lc-102' THEN 'qu-l2-2'
      WHEN x = 'lru-cache' THEN 'qu-l3-1'
      WHEN x = 'sliding-window-maximum' THEN 'qu-l3-1'
      WHEN x = 'reverse-a-ll' THEN 'll-l1-1'
      WHEN x = 'reverse-linked-list' THEN 'll-l1-1'
      WHEN x = 'merge-two-sorted-lists' THEN 'll-l1-2'
      WHEN x = 'detect-loop-in-ll' THEN 'll-l2-1'
      WHEN x = 'linked-list-cycle' THEN 'll-l2-1'
      WHEN x = 'reorder-list' THEN 'll-l2-2'
      WHEN x = 'remove-nth-node-from-end-in-ll' THEN 'll-l3-1'
      WHEN x = 'remove-nth-node-from-end-of-list' THEN 'll-l3-1'
      WHEN x = 'merge-k-sorted-lists' THEN 'll-l4-1'
      WHEN x = 'check-if-two-trees-are-equal' THEN 'tr-l1-1'
      WHEN x = 'maximum-depth-of-binary-tree' THEN 'tr-l1-1'
      WHEN x = 'invert-binary-tree' THEN 'tr-l1-2'
      WHEN x = 'same-tree' THEN 'tr-l2-1'
      WHEN x = 'subtree-of-another-tree' THEN 'tr-l2-2'
      WHEN x = 'validate-binary-search-tree' THEN 'tr-l3-1'
      WHEN x = 'lowest-common-ancestor-of-a-binary-search-tree' THEN 'tr-l3-2'
      WHEN x = 'serialize-and-deserialize-binary-tree' THEN 'tr-l4-1'
      WHEN x = 'kth-smallest-element-in-a-bst' THEN 'bst-l2-1'
      WHEN x = 'kth-largest-element-in-an-array' THEN 'hp-l2-1'
      WHEN x = 'find-median-from-data-stream' THEN 'hp-l3-1'
      WHEN x = 'clone-graph' THEN 'gd-l2-1'
      WHEN x = 'jumps-game' THEN 'gr-l2-1'
      WHEN x = 'climbing-stairs' THEN 'dp-l1-1'
      WHEN x = 'climbing-stairs-lc-70' THEN 'dp-l1-1'
      WHEN x = 'house-robber' THEN 'dp-l2-1'
      WHEN x = 'lc-198-house-robber' THEN 'dp-l2-1'
      WHEN x = 'coin-change' THEN 'dp-l2-2'
      WHEN x = 'lis' THEN 'dp-l3-1'
      WHEN x = 'edit-distance' THEN 'dp-l4-1'
      WHEN x = 'longest-palindromic-substring' THEN 'longest-palindrome'
      WHEN x = 'smallest-window-in-a-string-containing-all-the-characters-of-another-string' THEN '1'
      WHEN x = 'find-the-number-of-islands-set-1-using-dfs' THEN 'find-number-of-islands'
      WHEN x = 'given-matrix-o-x-replace-o-x-surrounded-x' THEN 'given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x'
      WHEN x = 'maximum-size-rectangle-of-all-1s' THEN 'maximum-size-rectangle-binary-sub-matrix-1s'
      WHEN x = 'permute-two-arrays-sum-every-pair-greater-equal-k' THEN 'permute-two-arrays-such-that-sum-of-every-pair-is-greater-or-equal-to-k'
      WHEN x = 'piar-with-given-difference' THEN 'find-a-pair-with-the-given-difference'
      WHEN x = 'product-of-array-except-itself' THEN 'a-product-array-puzzle'
      WHEN x = 'make-array-elements-equal-minimum-cost' THEN 'make-all-array-elements-equal'
      WHEN x = 'check-reversing-sub-array-make-array-sorted' THEN 'check-if-reversing-a-sub-array-make-the-array-sorted'
      WHEN x = 'aggressive-cows' THEN 'aggrcow'
      WHEN x = 'spoj-aggressive-cows-problem' THEN 'aggrcow'
      WHEN x = 'minimum-swaps-to-sort' THEN 'minimum-number-swaps-required-sort-array'
      WHEN x = 'subset-sum' THEN 'partition-equal-subset-sum'
      WHEN x = 'print-palindromic-partitions-string' THEN 'print-all-palindromic-partitions-of-a-string'
      WHEN x = 'partition-set-k-subsets-equal-sum' THEN 'partition-of-set-into-k-subsets-with-equal-sum'
      WHEN x = 'maximum-possible-number-by-doing-at-most-k-swaps' THEN 'find-maximum-number-possible-by-doing-at-most-k-swaps'
      WHEN x = 'given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it' THEN 'delete-without-head-node'
      WHEN x = 'reverse-a-doubly-linked-list' THEN 'reverse-a-dll'
      WHEN x = 'stack-set-4-evaluation-postfix-expression' THEN 'evaluation-of-postfix-expression'
      WHEN x = 'problems-chocola' THEN 'chocola'
      WHEN x = 'minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other' THEN 'minimise-the-cash-flow'
      WHEN x = 'minimize-cash-flow-among-given-set-friends-borrowed-money' THEN 'minimise-the-cash-flow'
      WHEN x = 'diameter-of-a-binary-tree' THEN 'binary-tree-right-side-view'
      WHEN x = 'diameter-of-binary-tree' THEN 'binary-tree-right-side-view'
      WHEN x = 'symmetric-tree' THEN 'binary-tree-maximum-path-sum'
      WHEN x = 'print-k-sum-paths-binary-tree' THEN 'print-all-k-sum-paths-in-a-binary-tree'
      WHEN x = 'construct-bst-from-given-preorder-traversal' THEN 'construct-bst-from-given-preorder-traversa'
      WHEN x = 'find-median-of-bst-in-on-time-and-o1-space' THEN 'find-median-bst-time-o1-space'
      WHEN x = 'largest-bst-in-a-binary-tree' THEN 'largest-bst-binary-tree-set-2'
      WHEN x = 'dfs' THEN 'depth-first-search-or-dfs-for-a-graph'
      WHEN x = 'flood-fill-algorithm' THEN 'flood-fill'
      WHEN x = 'prims-minimum-spanning-tree-mst-greedy-algo-5' THEN 'prims-algo'
      WHEN x = 'textgraph20coloring20problem20is20toare20colored20using20same20color' THEN 'graph-coloring'
      WHEN x = 'description' THEN 'cheapest-flights-within-k-stops'
      WHEN x = 'detect-negative-cycle-graph-bellman-ford' THEN 'bellman-ford'
      WHEN x = 'bipartitie-graph' THEN 'bipartite-graph'
      WHEN x = 'travelling-salesman-problem-set-1' THEN 'travelling-salesman'
      WHEN x = 'water-jug-2' THEN 'water-jug'
      WHEN x = 'water-jug-problem-using-bfs' THEN 'water-jug'
      WHEN x = 'trie-insert-and-search' THEN 'construct-a-trie-from-scratch'
      WHEN x = 'given-a-sequence-of-words-print-all-anagrams-together' THEN '0'
      WHEN x = 'houe-robber-2' THEN '213-house-robber'
      WHEN x = 'optimal-bst' THEN 'optimal-binary-search-tree-dp-24'
      WHEN x = 'largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s' THEN 'largest-area-rectangular-sub-matrix-equal-number-1s-0s'
      WHEN x = 'gfg-largest-subaray-with-0-sum' THEN '4sum'
      WHEN x = 'reverse-pairs' THEN '152-maximum-product-subarray'
      WHEN x = '1283smallest-divisor-given-a-threshold' THEN '1283-smallest-divisor-in-a-threshold'
      WHEN x = 'recursive-atoi' THEN 'implemenation-of-atoi'
      WHEN x = 'middle-of-the-linked-list' THEN 'middle-of-a-ll'
      WHEN x = 'palindrome-ll' THEN 'palindrome-linked-list'
      WHEN x = 'sort-ll' THEN 'sort-list'
      WHEN x = 'intersection-of-two-ll' THEN 'intersection-of-two-linked-lists'
      WHEN x = 'add-two-numbers' THEN 'add-2-numbers'
      WHEN x = 'reverse-nodes-in-k-group' THEN 'reverse-k-nodes-in-k-groups'
      WHEN x = 'generate-parentheses' THEN 'generate-paranthesis'
      WHEN x = 'generate-valid-parenthesis' THEN 'generate-paranthesis'
      WHEN x = 'combination-sum-ii' THEN 'combination-sum-2'
      WHEN x = 'subsets-ii' THEN 'subsets-2'
      WHEN x = 'next-greater-element-i' THEN 'next-greater-element'
      WHEN x = 'remove-k-digits' THEN 'maximal-rectangle'
      WHEN x = 'online-stock-span' THEN 'lfu-cache'
      WHEN x = 'lc-94' THEN 'binary-tree-inorder-traversal'
      WHEN x = 'binary-tree-zigzag-traversal' THEN 'balanced-binary-tree'
      ELSE x
    END, 
    x
  )
  FROM UNNEST(mt.question_ids) WITH ORDINALITY AS u(x, ord)
  ORDER BY ord
)
WHERE mt.question_ids && ARRAY[
  'contains-duplicate',
  'arr-r1',
  'hm-l1-2',
  '121-best-time-to-buy-and-sell-stocs',
  'best-time-to-buy-and-sell-stock',
  'product-of-array-except-self',
  'kadanes-algorithm',
  'maximum-subarray',
  'sort-l3-1',
  '88-merge-two-sorted-array-without-extra-space',
  'tp-l1-1',
  'valid-palindrome',
  'valid-anagram',
  'longest-common-prefix',
  'sw-l2-1',
  'lc-3',
  'longest-substring-without-repeating-characters',
  'str-l3-1',
  'group-anagrams',
  'sw-l4-1',
  'minimum-window-substring',
  'hp-l2-2',
  'top-k-frequent-elements',
  '128-finding-longest-subsequence-sum',
  'subarray-sums-equals-k',
  '493-reverse-pairs',
  'sort-l4-1',
  'find-minimum-in-rotated-sorted-array',
  'search-in-rotated-sorted-array',
  '875-koko-eating-bananas',
  '4-median-of-two-sorted-arrays',
  '184sum',
  '3sum',
  'container-with-most-water',
  'trapping-rain-water',
  'st-l4-1',
  'valid-paranthesis',
  'valid-parentheses',
  'implement-stack-using-queues',
  'tr-l2-3',
  'binary-tree-level-order-traversal',
  'lc-102',
  'lru-cache',
  'sliding-window-maximum',
  'reverse-a-ll',
  'reverse-linked-list',
  'merge-two-sorted-lists',
  'detect-loop-in-ll',
  'linked-list-cycle',
  'reorder-list',
  'remove-nth-node-from-end-in-ll',
  'remove-nth-node-from-end-of-list',
  'merge-k-sorted-lists',
  'check-if-two-trees-are-equal',
  'maximum-depth-of-binary-tree',
  'invert-binary-tree',
  'same-tree',
  'subtree-of-another-tree',
  'validate-binary-search-tree',
  'lowest-common-ancestor-of-a-binary-search-tree',
  'serialize-and-deserialize-binary-tree',
  'kth-smallest-element-in-a-bst',
  'kth-largest-element-in-an-array',
  'find-median-from-data-stream',
  'clone-graph',
  'jumps-game',
  'climbing-stairs',
  'climbing-stairs-lc-70',
  'house-robber',
  'lc-198-house-robber',
  'coin-change',
  'lis',
  'edit-distance',
  'longest-palindromic-substring',
  'smallest-window-in-a-string-containing-all-the-characters-of-another-string',
  'find-the-number-of-islands-set-1-using-dfs',
  'given-matrix-o-x-replace-o-x-surrounded-x',
  'maximum-size-rectangle-of-all-1s',
  'permute-two-arrays-sum-every-pair-greater-equal-k',
  'piar-with-given-difference',
  'product-of-array-except-itself',
  'make-array-elements-equal-minimum-cost',
  'check-reversing-sub-array-make-array-sorted',
  'aggressive-cows',
  'spoj-aggressive-cows-problem',
  'minimum-swaps-to-sort',
  'subset-sum',
  'print-palindromic-partitions-string',
  'partition-set-k-subsets-equal-sum',
  'maximum-possible-number-by-doing-at-most-k-swaps',
  'given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it',
  'reverse-a-doubly-linked-list',
  'stack-set-4-evaluation-postfix-expression',
  'problems-chocola',
  'minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other',
  'minimize-cash-flow-among-given-set-friends-borrowed-money',
  'diameter-of-a-binary-tree',
  'diameter-of-binary-tree',
  'symmetric-tree',
  'print-k-sum-paths-binary-tree',
  'construct-bst-from-given-preorder-traversal',
  'find-median-of-bst-in-on-time-and-o1-space',
  'largest-bst-in-a-binary-tree',
  'dfs',
  'flood-fill-algorithm',
  'prims-minimum-spanning-tree-mst-greedy-algo-5',
  'textgraph20coloring20problem20is20toare20colored20using20same20color',
  'description',
  'detect-negative-cycle-graph-bellman-ford',
  'bipartitie-graph',
  'travelling-salesman-problem-set-1',
  'water-jug-2',
  'water-jug-problem-using-bfs',
  'trie-insert-and-search',
  'given-a-sequence-of-words-print-all-anagrams-together',
  'houe-robber-2',
  'optimal-bst',
  'largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s',
  'gfg-largest-subaray-with-0-sum',
  'reverse-pairs',
  '1283smallest-divisor-given-a-threshold',
  'recursive-atoi',
  'middle-of-the-linked-list',
  'palindrome-ll',
  'sort-ll',
  'intersection-of-two-ll',
  'add-two-numbers',
  'reverse-nodes-in-k-group',
  'generate-parentheses',
  'generate-valid-parenthesis',
  'combination-sum-ii',
  'subsets-ii',
  'next-greater-element-i',
  'remove-k-digits',
  'online-stock-span',
  'lc-94',
  'binary-tree-zigzag-traversal'
];

-- 2. MOCK INTERVIEWS JSONB REMAPPING
UPDATE public.mock_interviews mi
SET questions = (
  SELECT jsonb_agg(
    CASE 
      WHEN q->>'id' = 'contains-duplicate' THEN q || '{"id": "arr-l1-2"}'::jsonb
      WHEN q->>'id' = 'arr-r1' THEN q || '{"id": "arr-l1-3"}'::jsonb
      WHEN q->>'id' = 'hm-l1-2' THEN q || '{"id": "arr-l1-3"}'::jsonb
      WHEN q->>'id' = '121-best-time-to-buy-and-sell-stocs' THEN q || '{"id": "arr-l2-1"}'::jsonb
      WHEN q->>'id' = 'best-time-to-buy-and-sell-stock' THEN q || '{"id": "arr-l2-1"}'::jsonb
      WHEN q->>'id' = 'product-of-array-except-self' THEN q || '{"id": "arr-l2-2"}'::jsonb
      WHEN q->>'id' = 'kadanes-algorithm' THEN q || '{"id": "arr-l2-3"}'::jsonb
      WHEN q->>'id' = 'maximum-subarray' THEN q || '{"id": "arr-l2-3"}'::jsonb
      WHEN q->>'id' = 'sort-l3-1' THEN q || '{"id": "arr-l3-1"}'::jsonb
      WHEN q->>'id' = '88-merge-two-sorted-array-without-extra-space' THEN q || '{"id": "arr-l3-1"}'::jsonb
      WHEN q->>'id' = 'tp-l1-1' THEN q || '{"id": "str-l1-1"}'::jsonb
      WHEN q->>'id' = 'valid-palindrome' THEN q || '{"id": "str-l1-1"}'::jsonb
      WHEN q->>'id' = 'valid-anagram' THEN q || '{"id": "str-l1-2"}'::jsonb
      WHEN q->>'id' = 'longest-common-prefix' THEN q || '{"id": "str-l2-1"}'::jsonb
      WHEN q->>'id' = 'sw-l2-1' THEN q || '{"id": "str-l2-2"}'::jsonb
      WHEN q->>'id' = 'lc-3' THEN q || '{"id": "str-l2-2"}'::jsonb
      WHEN q->>'id' = 'longest-substring-without-repeating-characters' THEN q || '{"id": "str-l2-2"}'::jsonb
      WHEN q->>'id' = 'str-l3-1' THEN q || '{"id": "hm-l2-1"}'::jsonb
      WHEN q->>'id' = 'group-anagrams' THEN q || '{"id": "hm-l2-1"}'::jsonb
      WHEN q->>'id' = 'sw-l4-1' THEN q || '{"id": "str-l4-1"}'::jsonb
      WHEN q->>'id' = 'minimum-window-substring' THEN q || '{"id": "str-l4-1"}'::jsonb
      WHEN q->>'id' = 'hp-l2-2' THEN q || '{"id": "hm-l2-2"}'::jsonb
      WHEN q->>'id' = 'top-k-frequent-elements' THEN q || '{"id": "hm-l2-2"}'::jsonb
      WHEN q->>'id' = '128-finding-longest-subsequence-sum' THEN q || '{"id": "hm-l3-1"}'::jsonb
      WHEN q->>'id' = 'subarray-sums-equals-k' THEN q || '{"id": "hm-l4-1"}'::jsonb
      WHEN q->>'id' = '493-reverse-pairs' THEN q || '{"id": "sort-l2-1"}'::jsonb
      WHEN q->>'id' = 'sort-l4-1' THEN q || '{"id": "gr-l3-1"}'::jsonb
      WHEN q->>'id' = 'find-minimum-in-rotated-sorted-array' THEN q || '{"id": "bs-l2-2"}'::jsonb
      WHEN q->>'id' = 'search-in-rotated-sorted-array' THEN q || '{"id": "bs-l3-1"}'::jsonb
      WHEN q->>'id' = '875-koko-eating-bananas' THEN q || '{"id": "bs-l3-2"}'::jsonb
      WHEN q->>'id' = '4-median-of-two-sorted-arrays' THEN q || '{"id": "bs-l4-1"}'::jsonb
      WHEN q->>'id' = '184sum' THEN q || '{"id": "tp-l2-2"}'::jsonb
      WHEN q->>'id' = '3sum' THEN q || '{"id": "tp-l2-2"}'::jsonb
      WHEN q->>'id' = 'container-with-most-water' THEN q || '{"id": "tp-l3-1"}'::jsonb
      WHEN q->>'id' = 'trapping-rain-water' THEN q || '{"id": "tp-l4-1"}'::jsonb
      WHEN q->>'id' = 'st-l4-1' THEN q || '{"id": "st-l1-1"}'::jsonb
      WHEN q->>'id' = 'valid-paranthesis' THEN q || '{"id": "st-l1-1"}'::jsonb
      WHEN q->>'id' = 'valid-parentheses' THEN q || '{"id": "st-l1-1"}'::jsonb
      WHEN q->>'id' = 'implement-stack-using-queues' THEN q || '{"id": "qu-l1-1"}'::jsonb
      WHEN q->>'id' = 'tr-l2-3' THEN q || '{"id": "qu-l2-2"}'::jsonb
      WHEN q->>'id' = 'binary-tree-level-order-traversal' THEN q || '{"id": "qu-l2-2"}'::jsonb
      WHEN q->>'id' = 'lc-102' THEN q || '{"id": "qu-l2-2"}'::jsonb
      WHEN q->>'id' = 'lru-cache' THEN q || '{"id": "qu-l3-1"}'::jsonb
      WHEN q->>'id' = 'sliding-window-maximum' THEN q || '{"id": "qu-l3-1"}'::jsonb
      WHEN q->>'id' = 'reverse-a-ll' THEN q || '{"id": "ll-l1-1"}'::jsonb
      WHEN q->>'id' = 'reverse-linked-list' THEN q || '{"id": "ll-l1-1"}'::jsonb
      WHEN q->>'id' = 'merge-two-sorted-lists' THEN q || '{"id": "ll-l1-2"}'::jsonb
      WHEN q->>'id' = 'detect-loop-in-ll' THEN q || '{"id": "ll-l2-1"}'::jsonb
      WHEN q->>'id' = 'linked-list-cycle' THEN q || '{"id": "ll-l2-1"}'::jsonb
      WHEN q->>'id' = 'reorder-list' THEN q || '{"id": "ll-l2-2"}'::jsonb
      WHEN q->>'id' = 'remove-nth-node-from-end-in-ll' THEN q || '{"id": "ll-l3-1"}'::jsonb
      WHEN q->>'id' = 'remove-nth-node-from-end-of-list' THEN q || '{"id": "ll-l3-1"}'::jsonb
      WHEN q->>'id' = 'merge-k-sorted-lists' THEN q || '{"id": "ll-l4-1"}'::jsonb
      WHEN q->>'id' = 'check-if-two-trees-are-equal' THEN q || '{"id": "tr-l1-1"}'::jsonb
      WHEN q->>'id' = 'maximum-depth-of-binary-tree' THEN q || '{"id": "tr-l1-1"}'::jsonb
      WHEN q->>'id' = 'invert-binary-tree' THEN q || '{"id": "tr-l1-2"}'::jsonb
      WHEN q->>'id' = 'same-tree' THEN q || '{"id": "tr-l2-1"}'::jsonb
      WHEN q->>'id' = 'subtree-of-another-tree' THEN q || '{"id": "tr-l2-2"}'::jsonb
      WHEN q->>'id' = 'validate-binary-search-tree' THEN q || '{"id": "tr-l3-1"}'::jsonb
      WHEN q->>'id' = 'lowest-common-ancestor-of-a-binary-search-tree' THEN q || '{"id": "tr-l3-2"}'::jsonb
      WHEN q->>'id' = 'serialize-and-deserialize-binary-tree' THEN q || '{"id": "tr-l4-1"}'::jsonb
      WHEN q->>'id' = 'kth-smallest-element-in-a-bst' THEN q || '{"id": "bst-l2-1"}'::jsonb
      WHEN q->>'id' = 'kth-largest-element-in-an-array' THEN q || '{"id": "hp-l2-1"}'::jsonb
      WHEN q->>'id' = 'find-median-from-data-stream' THEN q || '{"id": "hp-l3-1"}'::jsonb
      WHEN q->>'id' = 'clone-graph' THEN q || '{"id": "gd-l2-1"}'::jsonb
      WHEN q->>'id' = 'jumps-game' THEN q || '{"id": "gr-l2-1"}'::jsonb
      WHEN q->>'id' = 'climbing-stairs' THEN q || '{"id": "dp-l1-1"}'::jsonb
      WHEN q->>'id' = 'climbing-stairs-lc-70' THEN q || '{"id": "dp-l1-1"}'::jsonb
      WHEN q->>'id' = 'house-robber' THEN q || '{"id": "dp-l2-1"}'::jsonb
      WHEN q->>'id' = 'lc-198-house-robber' THEN q || '{"id": "dp-l2-1"}'::jsonb
      WHEN q->>'id' = 'coin-change' THEN q || '{"id": "dp-l2-2"}'::jsonb
      WHEN q->>'id' = 'lis' THEN q || '{"id": "dp-l3-1"}'::jsonb
      WHEN q->>'id' = 'edit-distance' THEN q || '{"id": "dp-l4-1"}'::jsonb
      WHEN q->>'id' = 'longest-palindromic-substring' THEN q || '{"id": "longest-palindrome"}'::jsonb
      WHEN q->>'id' = 'smallest-window-in-a-string-containing-all-the-characters-of-another-string' THEN q || '{"id": "1"}'::jsonb
      WHEN q->>'id' = 'find-the-number-of-islands-set-1-using-dfs' THEN q || '{"id": "find-number-of-islands"}'::jsonb
      WHEN q->>'id' = 'given-matrix-o-x-replace-o-x-surrounded-x' THEN q || '{"id": "given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x"}'::jsonb
      WHEN q->>'id' = 'maximum-size-rectangle-of-all-1s' THEN q || '{"id": "maximum-size-rectangle-binary-sub-matrix-1s"}'::jsonb
      WHEN q->>'id' = 'permute-two-arrays-sum-every-pair-greater-equal-k' THEN q || '{"id": "permute-two-arrays-such-that-sum-of-every-pair-is-greater-or-equal-to-k"}'::jsonb
      WHEN q->>'id' = 'piar-with-given-difference' THEN q || '{"id": "find-a-pair-with-the-given-difference"}'::jsonb
      WHEN q->>'id' = 'product-of-array-except-itself' THEN q || '{"id": "a-product-array-puzzle"}'::jsonb
      WHEN q->>'id' = 'make-array-elements-equal-minimum-cost' THEN q || '{"id": "make-all-array-elements-equal"}'::jsonb
      WHEN q->>'id' = 'check-reversing-sub-array-make-array-sorted' THEN q || '{"id": "check-if-reversing-a-sub-array-make-the-array-sorted"}'::jsonb
      WHEN q->>'id' = 'aggressive-cows' THEN q || '{"id": "aggrcow"}'::jsonb
      WHEN q->>'id' = 'spoj-aggressive-cows-problem' THEN q || '{"id": "aggrcow"}'::jsonb
      WHEN q->>'id' = 'minimum-swaps-to-sort' THEN q || '{"id": "minimum-number-swaps-required-sort-array"}'::jsonb
      WHEN q->>'id' = 'subset-sum' THEN q || '{"id": "partition-equal-subset-sum"}'::jsonb
      WHEN q->>'id' = 'print-palindromic-partitions-string' THEN q || '{"id": "print-all-palindromic-partitions-of-a-string"}'::jsonb
      WHEN q->>'id' = 'partition-set-k-subsets-equal-sum' THEN q || '{"id": "partition-of-set-into-k-subsets-with-equal-sum"}'::jsonb
      WHEN q->>'id' = 'maximum-possible-number-by-doing-at-most-k-swaps' THEN q || '{"id": "find-maximum-number-possible-by-doing-at-most-k-swaps"}'::jsonb
      WHEN q->>'id' = 'given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it' THEN q || '{"id": "delete-without-head-node"}'::jsonb
      WHEN q->>'id' = 'reverse-a-doubly-linked-list' THEN q || '{"id": "reverse-a-dll"}'::jsonb
      WHEN q->>'id' = 'stack-set-4-evaluation-postfix-expression' THEN q || '{"id": "evaluation-of-postfix-expression"}'::jsonb
      WHEN q->>'id' = 'problems-chocola' THEN q || '{"id": "chocola"}'::jsonb
      WHEN q->>'id' = 'minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other' THEN q || '{"id": "minimise-the-cash-flow"}'::jsonb
      WHEN q->>'id' = 'minimize-cash-flow-among-given-set-friends-borrowed-money' THEN q || '{"id": "minimise-the-cash-flow"}'::jsonb
      WHEN q->>'id' = 'diameter-of-a-binary-tree' THEN q || '{"id": "binary-tree-right-side-view"}'::jsonb
      WHEN q->>'id' = 'diameter-of-binary-tree' THEN q || '{"id": "binary-tree-right-side-view"}'::jsonb
      WHEN q->>'id' = 'symmetric-tree' THEN q || '{"id": "binary-tree-maximum-path-sum"}'::jsonb
      WHEN q->>'id' = 'print-k-sum-paths-binary-tree' THEN q || '{"id": "print-all-k-sum-paths-in-a-binary-tree"}'::jsonb
      WHEN q->>'id' = 'construct-bst-from-given-preorder-traversal' THEN q || '{"id": "construct-bst-from-given-preorder-traversa"}'::jsonb
      WHEN q->>'id' = 'find-median-of-bst-in-on-time-and-o1-space' THEN q || '{"id": "find-median-bst-time-o1-space"}'::jsonb
      WHEN q->>'id' = 'largest-bst-in-a-binary-tree' THEN q || '{"id": "largest-bst-binary-tree-set-2"}'::jsonb
      WHEN q->>'id' = 'dfs' THEN q || '{"id": "depth-first-search-or-dfs-for-a-graph"}'::jsonb
      WHEN q->>'id' = 'flood-fill-algorithm' THEN q || '{"id": "flood-fill"}'::jsonb
      WHEN q->>'id' = 'prims-minimum-spanning-tree-mst-greedy-algo-5' THEN q || '{"id": "prims-algo"}'::jsonb
      WHEN q->>'id' = 'textgraph20coloring20problem20is20toare20colored20using20same20color' THEN q || '{"id": "graph-coloring"}'::jsonb
      WHEN q->>'id' = 'description' THEN q || '{"id": "cheapest-flights-within-k-stops"}'::jsonb
      WHEN q->>'id' = 'detect-negative-cycle-graph-bellman-ford' THEN q || '{"id": "bellman-ford"}'::jsonb
      WHEN q->>'id' = 'bipartitie-graph' THEN q || '{"id": "bipartite-graph"}'::jsonb
      WHEN q->>'id' = 'travelling-salesman-problem-set-1' THEN q || '{"id": "travelling-salesman"}'::jsonb
      WHEN q->>'id' = 'water-jug-2' THEN q || '{"id": "water-jug"}'::jsonb
      WHEN q->>'id' = 'water-jug-problem-using-bfs' THEN q || '{"id": "water-jug"}'::jsonb
      WHEN q->>'id' = 'trie-insert-and-search' THEN q || '{"id": "construct-a-trie-from-scratch"}'::jsonb
      WHEN q->>'id' = 'given-a-sequence-of-words-print-all-anagrams-together' THEN q || '{"id": "0"}'::jsonb
      WHEN q->>'id' = 'houe-robber-2' THEN q || '{"id": "213-house-robber"}'::jsonb
      WHEN q->>'id' = 'optimal-bst' THEN q || '{"id": "optimal-binary-search-tree-dp-24"}'::jsonb
      WHEN q->>'id' = 'largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s' THEN q || '{"id": "largest-area-rectangular-sub-matrix-equal-number-1s-0s"}'::jsonb
      WHEN q->>'id' = 'gfg-largest-subaray-with-0-sum' THEN q || '{"id": "4sum"}'::jsonb
      WHEN q->>'id' = 'reverse-pairs' THEN q || '{"id": "152-maximum-product-subarray"}'::jsonb
      WHEN q->>'id' = '1283smallest-divisor-given-a-threshold' THEN q || '{"id": "1283-smallest-divisor-in-a-threshold"}'::jsonb
      WHEN q->>'id' = 'recursive-atoi' THEN q || '{"id": "implemenation-of-atoi"}'::jsonb
      WHEN q->>'id' = 'middle-of-the-linked-list' THEN q || '{"id": "middle-of-a-ll"}'::jsonb
      WHEN q->>'id' = 'palindrome-ll' THEN q || '{"id": "palindrome-linked-list"}'::jsonb
      WHEN q->>'id' = 'sort-ll' THEN q || '{"id": "sort-list"}'::jsonb
      WHEN q->>'id' = 'intersection-of-two-ll' THEN q || '{"id": "intersection-of-two-linked-lists"}'::jsonb
      WHEN q->>'id' = 'add-two-numbers' THEN q || '{"id": "add-2-numbers"}'::jsonb
      WHEN q->>'id' = 'reverse-nodes-in-k-group' THEN q || '{"id": "reverse-k-nodes-in-k-groups"}'::jsonb
      WHEN q->>'id' = 'generate-parentheses' THEN q || '{"id": "generate-paranthesis"}'::jsonb
      WHEN q->>'id' = 'generate-valid-parenthesis' THEN q || '{"id": "generate-paranthesis"}'::jsonb
      WHEN q->>'id' = 'combination-sum-ii' THEN q || '{"id": "combination-sum-2"}'::jsonb
      WHEN q->>'id' = 'subsets-ii' THEN q || '{"id": "subsets-2"}'::jsonb
      WHEN q->>'id' = 'next-greater-element-i' THEN q || '{"id": "next-greater-element"}'::jsonb
      WHEN q->>'id' = 'remove-k-digits' THEN q || '{"id": "maximal-rectangle"}'::jsonb
      WHEN q->>'id' = 'online-stock-span' THEN q || '{"id": "lfu-cache"}'::jsonb
      WHEN q->>'id' = 'lc-94' THEN q || '{"id": "binary-tree-inorder-traversal"}'::jsonb
      WHEN q->>'id' = 'binary-tree-zigzag-traversal' THEN q || '{"id": "balanced-binary-tree"}'::jsonb
      ELSE q
    END
  )
  FROM jsonb_array_elements(mi.questions) q
)
WHERE mi.questions @> ANY(ARRAY[
  '[{"id": "contains-duplicate"}]'::jsonb,
  '[{"id": "arr-r1"}]'::jsonb,
  '[{"id": "hm-l1-2"}]'::jsonb,
  '[{"id": "121-best-time-to-buy-and-sell-stocs"}]'::jsonb,
  '[{"id": "best-time-to-buy-and-sell-stock"}]'::jsonb,
  '[{"id": "product-of-array-except-self"}]'::jsonb,
  '[{"id": "kadanes-algorithm"}]'::jsonb,
  '[{"id": "maximum-subarray"}]'::jsonb,
  '[{"id": "sort-l3-1"}]'::jsonb,
  '[{"id": "88-merge-two-sorted-array-without-extra-space"}]'::jsonb,
  '[{"id": "tp-l1-1"}]'::jsonb,
  '[{"id": "valid-palindrome"}]'::jsonb,
  '[{"id": "valid-anagram"}]'::jsonb,
  '[{"id": "longest-common-prefix"}]'::jsonb,
  '[{"id": "sw-l2-1"}]'::jsonb,
  '[{"id": "lc-3"}]'::jsonb,
  '[{"id": "longest-substring-without-repeating-characters"}]'::jsonb,
  '[{"id": "str-l3-1"}]'::jsonb,
  '[{"id": "group-anagrams"}]'::jsonb,
  '[{"id": "sw-l4-1"}]'::jsonb,
  '[{"id": "minimum-window-substring"}]'::jsonb,
  '[{"id": "hp-l2-2"}]'::jsonb,
  '[{"id": "top-k-frequent-elements"}]'::jsonb,
  '[{"id": "128-finding-longest-subsequence-sum"}]'::jsonb,
  '[{"id": "subarray-sums-equals-k"}]'::jsonb,
  '[{"id": "493-reverse-pairs"}]'::jsonb,
  '[{"id": "sort-l4-1"}]'::jsonb,
  '[{"id": "find-minimum-in-rotated-sorted-array"}]'::jsonb,
  '[{"id": "search-in-rotated-sorted-array"}]'::jsonb,
  '[{"id": "875-koko-eating-bananas"}]'::jsonb,
  '[{"id": "4-median-of-two-sorted-arrays"}]'::jsonb,
  '[{"id": "184sum"}]'::jsonb,
  '[{"id": "3sum"}]'::jsonb,
  '[{"id": "container-with-most-water"}]'::jsonb,
  '[{"id": "trapping-rain-water"}]'::jsonb,
  '[{"id": "st-l4-1"}]'::jsonb,
  '[{"id": "valid-paranthesis"}]'::jsonb,
  '[{"id": "valid-parentheses"}]'::jsonb,
  '[{"id": "implement-stack-using-queues"}]'::jsonb,
  '[{"id": "tr-l2-3"}]'::jsonb,
  '[{"id": "binary-tree-level-order-traversal"}]'::jsonb,
  '[{"id": "lc-102"}]'::jsonb,
  '[{"id": "lru-cache"}]'::jsonb,
  '[{"id": "sliding-window-maximum"}]'::jsonb,
  '[{"id": "reverse-a-ll"}]'::jsonb,
  '[{"id": "reverse-linked-list"}]'::jsonb,
  '[{"id": "merge-two-sorted-lists"}]'::jsonb,
  '[{"id": "detect-loop-in-ll"}]'::jsonb,
  '[{"id": "linked-list-cycle"}]'::jsonb,
  '[{"id": "reorder-list"}]'::jsonb,
  '[{"id": "remove-nth-node-from-end-in-ll"}]'::jsonb,
  '[{"id": "remove-nth-node-from-end-of-list"}]'::jsonb,
  '[{"id": "merge-k-sorted-lists"}]'::jsonb,
  '[{"id": "check-if-two-trees-are-equal"}]'::jsonb,
  '[{"id": "maximum-depth-of-binary-tree"}]'::jsonb,
  '[{"id": "invert-binary-tree"}]'::jsonb,
  '[{"id": "same-tree"}]'::jsonb,
  '[{"id": "subtree-of-another-tree"}]'::jsonb,
  '[{"id": "validate-binary-search-tree"}]'::jsonb,
  '[{"id": "lowest-common-ancestor-of-a-binary-search-tree"}]'::jsonb,
  '[{"id": "serialize-and-deserialize-binary-tree"}]'::jsonb,
  '[{"id": "kth-smallest-element-in-a-bst"}]'::jsonb,
  '[{"id": "kth-largest-element-in-an-array"}]'::jsonb,
  '[{"id": "find-median-from-data-stream"}]'::jsonb,
  '[{"id": "clone-graph"}]'::jsonb,
  '[{"id": "jumps-game"}]'::jsonb,
  '[{"id": "climbing-stairs"}]'::jsonb,
  '[{"id": "climbing-stairs-lc-70"}]'::jsonb,
  '[{"id": "house-robber"}]'::jsonb,
  '[{"id": "lc-198-house-robber"}]'::jsonb,
  '[{"id": "coin-change"}]'::jsonb,
  '[{"id": "lis"}]'::jsonb,
  '[{"id": "edit-distance"}]'::jsonb,
  '[{"id": "longest-palindromic-substring"}]'::jsonb,
  '[{"id": "smallest-window-in-a-string-containing-all-the-characters-of-another-string"}]'::jsonb,
  '[{"id": "find-the-number-of-islands-set-1-using-dfs"}]'::jsonb,
  '[{"id": "given-matrix-o-x-replace-o-x-surrounded-x"}]'::jsonb,
  '[{"id": "maximum-size-rectangle-of-all-1s"}]'::jsonb,
  '[{"id": "permute-two-arrays-sum-every-pair-greater-equal-k"}]'::jsonb,
  '[{"id": "piar-with-given-difference"}]'::jsonb,
  '[{"id": "product-of-array-except-itself"}]'::jsonb,
  '[{"id": "make-array-elements-equal-minimum-cost"}]'::jsonb,
  '[{"id": "check-reversing-sub-array-make-array-sorted"}]'::jsonb,
  '[{"id": "aggressive-cows"}]'::jsonb,
  '[{"id": "spoj-aggressive-cows-problem"}]'::jsonb,
  '[{"id": "minimum-swaps-to-sort"}]'::jsonb,
  '[{"id": "subset-sum"}]'::jsonb,
  '[{"id": "print-palindromic-partitions-string"}]'::jsonb,
  '[{"id": "partition-set-k-subsets-equal-sum"}]'::jsonb,
  '[{"id": "maximum-possible-number-by-doing-at-most-k-swaps"}]'::jsonb,
  '[{"id": "given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it"}]'::jsonb,
  '[{"id": "reverse-a-doubly-linked-list"}]'::jsonb,
  '[{"id": "stack-set-4-evaluation-postfix-expression"}]'::jsonb,
  '[{"id": "problems-chocola"}]'::jsonb,
  '[{"id": "minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other"}]'::jsonb,
  '[{"id": "minimize-cash-flow-among-given-set-friends-borrowed-money"}]'::jsonb,
  '[{"id": "diameter-of-a-binary-tree"}]'::jsonb,
  '[{"id": "diameter-of-binary-tree"}]'::jsonb,
  '[{"id": "symmetric-tree"}]'::jsonb,
  '[{"id": "print-k-sum-paths-binary-tree"}]'::jsonb,
  '[{"id": "construct-bst-from-given-preorder-traversal"}]'::jsonb,
  '[{"id": "find-median-of-bst-in-on-time-and-o1-space"}]'::jsonb,
  '[{"id": "largest-bst-in-a-binary-tree"}]'::jsonb,
  '[{"id": "dfs"}]'::jsonb,
  '[{"id": "flood-fill-algorithm"}]'::jsonb,
  '[{"id": "prims-minimum-spanning-tree-mst-greedy-algo-5"}]'::jsonb,
  '[{"id": "textgraph20coloring20problem20is20toare20colored20using20same20color"}]'::jsonb,
  '[{"id": "description"}]'::jsonb,
  '[{"id": "detect-negative-cycle-graph-bellman-ford"}]'::jsonb,
  '[{"id": "bipartitie-graph"}]'::jsonb,
  '[{"id": "travelling-salesman-problem-set-1"}]'::jsonb,
  '[{"id": "water-jug-2"}]'::jsonb,
  '[{"id": "water-jug-problem-using-bfs"}]'::jsonb,
  '[{"id": "trie-insert-and-search"}]'::jsonb,
  '[{"id": "given-a-sequence-of-words-print-all-anagrams-together"}]'::jsonb,
  '[{"id": "houe-robber-2"}]'::jsonb,
  '[{"id": "optimal-bst"}]'::jsonb,
  '[{"id": "largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s"}]'::jsonb,
  '[{"id": "gfg-largest-subaray-with-0-sum"}]'::jsonb,
  '[{"id": "reverse-pairs"}]'::jsonb,
  '[{"id": "1283smallest-divisor-given-a-threshold"}]'::jsonb,
  '[{"id": "recursive-atoi"}]'::jsonb,
  '[{"id": "middle-of-the-linked-list"}]'::jsonb,
  '[{"id": "palindrome-ll"}]'::jsonb,
  '[{"id": "sort-ll"}]'::jsonb,
  '[{"id": "intersection-of-two-ll"}]'::jsonb,
  '[{"id": "add-two-numbers"}]'::jsonb,
  '[{"id": "reverse-nodes-in-k-group"}]'::jsonb,
  '[{"id": "generate-parentheses"}]'::jsonb,
  '[{"id": "generate-valid-parenthesis"}]'::jsonb,
  '[{"id": "combination-sum-ii"}]'::jsonb,
  '[{"id": "subsets-ii"}]'::jsonb,
  '[{"id": "next-greater-element-i"}]'::jsonb,
  '[{"id": "remove-k-digits"}]'::jsonb,
  '[{"id": "online-stock-span"}]'::jsonb,
  '[{"id": "lc-94"}]'::jsonb,
  '[{"id": "binary-tree-zigzag-traversal"}]'::jsonb
]);

-- 3. BOOKMARKS, REVISION HISTORY, USER PROGRESS MERGES

-- --- Merge Group: 0 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, '0', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('0', 'given-a-sequence-of-words-print-all-anagrams-together')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('given-a-sequence-of-words-print-all-anagrams-together');

-- Revision History
UPDATE public.revision_history
SET question_id = '0'
WHERE question_id IN ('given-a-sequence-of-words-print-all-anagrams-together');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  '0',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('0', 'given-a-sequence-of-words-print-all-anagrams-together')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('given-a-sequence-of-words-print-all-anagrams-together');

-- --- Merge Group: 1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, '1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('1', 'smallest-window-in-a-string-containing-all-the-characters-of-another-string')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('smallest-window-in-a-string-containing-all-the-characters-of-another-string');

-- Revision History
UPDATE public.revision_history
SET question_id = '1'
WHERE question_id IN ('smallest-window-in-a-string-containing-all-the-characters-of-another-string');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  '1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('1', 'smallest-window-in-a-string-containing-all-the-characters-of-another-string')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('smallest-window-in-a-string-containing-all-the-characters-of-another-string');

-- --- Merge Group: arr-l1-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'arr-l1-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('arr-l1-2', 'contains-duplicate')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('contains-duplicate');

-- Revision History
UPDATE public.revision_history
SET question_id = 'arr-l1-2'
WHERE question_id IN ('contains-duplicate');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'arr-l1-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('arr-l1-2', 'contains-duplicate')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('contains-duplicate');

-- --- Merge Group: arr-l1-3 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'arr-l1-3', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('arr-l1-3', 'arr-r1', 'hm-l1-2')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('arr-r1', 'hm-l1-2');

-- Revision History
UPDATE public.revision_history
SET question_id = 'arr-l1-3'
WHERE question_id IN ('arr-r1', 'hm-l1-2');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'arr-l1-3',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('arr-l1-3', 'arr-r1', 'hm-l1-2')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('arr-r1', 'hm-l1-2');

-- --- Merge Group: arr-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'arr-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('arr-l2-1', '121-best-time-to-buy-and-sell-stocs', 'best-time-to-buy-and-sell-stock')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('121-best-time-to-buy-and-sell-stocs', 'best-time-to-buy-and-sell-stock');

-- Revision History
UPDATE public.revision_history
SET question_id = 'arr-l2-1'
WHERE question_id IN ('121-best-time-to-buy-and-sell-stocs', 'best-time-to-buy-and-sell-stock');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'arr-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('arr-l2-1', '121-best-time-to-buy-and-sell-stocs', 'best-time-to-buy-and-sell-stock')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('121-best-time-to-buy-and-sell-stocs', 'best-time-to-buy-and-sell-stock');

-- --- Merge Group: arr-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'arr-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('arr-l2-2', 'product-of-array-except-self')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('product-of-array-except-self');

-- Revision History
UPDATE public.revision_history
SET question_id = 'arr-l2-2'
WHERE question_id IN ('product-of-array-except-self');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'arr-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('arr-l2-2', 'product-of-array-except-self')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('product-of-array-except-self');

-- --- Merge Group: arr-l2-3 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'arr-l2-3', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('arr-l2-3', 'kadanes-algorithm', 'maximum-subarray')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('kadanes-algorithm', 'maximum-subarray');

-- Revision History
UPDATE public.revision_history
SET question_id = 'arr-l2-3'
WHERE question_id IN ('kadanes-algorithm', 'maximum-subarray');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'arr-l2-3',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('arr-l2-3', 'kadanes-algorithm', 'maximum-subarray')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('kadanes-algorithm', 'maximum-subarray');

-- --- Merge Group: arr-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'arr-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('arr-l3-1', 'sort-l3-1', '88-merge-two-sorted-array-without-extra-space')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('sort-l3-1', '88-merge-two-sorted-array-without-extra-space');

-- Revision History
UPDATE public.revision_history
SET question_id = 'arr-l3-1'
WHERE question_id IN ('sort-l3-1', '88-merge-two-sorted-array-without-extra-space');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'arr-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('arr-l3-1', 'sort-l3-1', '88-merge-two-sorted-array-without-extra-space')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('sort-l3-1', '88-merge-two-sorted-array-without-extra-space');

-- --- Merge Group: str-l1-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'str-l1-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('str-l1-1', 'tp-l1-1', 'valid-palindrome')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('tp-l1-1', 'valid-palindrome');

-- Revision History
UPDATE public.revision_history
SET question_id = 'str-l1-1'
WHERE question_id IN ('tp-l1-1', 'valid-palindrome');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'str-l1-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('str-l1-1', 'tp-l1-1', 'valid-palindrome')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('tp-l1-1', 'valid-palindrome');

-- --- Merge Group: str-l1-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'str-l1-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('str-l1-2', 'valid-anagram')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('valid-anagram');

-- Revision History
UPDATE public.revision_history
SET question_id = 'str-l1-2'
WHERE question_id IN ('valid-anagram');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'str-l1-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('str-l1-2', 'valid-anagram')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('valid-anagram');

-- --- Merge Group: str-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'str-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('str-l2-1', 'longest-common-prefix')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('longest-common-prefix');

-- Revision History
UPDATE public.revision_history
SET question_id = 'str-l2-1'
WHERE question_id IN ('longest-common-prefix');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'str-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('str-l2-1', 'longest-common-prefix')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('longest-common-prefix');

-- --- Merge Group: str-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'str-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('str-l2-2', 'sw-l2-1', 'lc-3', 'longest-substring-without-repeating-characters')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('sw-l2-1', 'lc-3', 'longest-substring-without-repeating-characters');

-- Revision History
UPDATE public.revision_history
SET question_id = 'str-l2-2'
WHERE question_id IN ('sw-l2-1', 'lc-3', 'longest-substring-without-repeating-characters');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'str-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('str-l2-2', 'sw-l2-1', 'lc-3', 'longest-substring-without-repeating-characters')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('sw-l2-1', 'lc-3', 'longest-substring-without-repeating-characters');

-- --- Merge Group: hm-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'hm-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('hm-l2-1', 'str-l3-1', 'group-anagrams')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('str-l3-1', 'group-anagrams');

-- Revision History
UPDATE public.revision_history
SET question_id = 'hm-l2-1'
WHERE question_id IN ('str-l3-1', 'group-anagrams');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'hm-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('hm-l2-1', 'str-l3-1', 'group-anagrams')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('str-l3-1', 'group-anagrams');

-- --- Merge Group: str-l4-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'str-l4-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('str-l4-1', 'sw-l4-1', 'minimum-window-substring')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('sw-l4-1', 'minimum-window-substring');

-- Revision History
UPDATE public.revision_history
SET question_id = 'str-l4-1'
WHERE question_id IN ('sw-l4-1', 'minimum-window-substring');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'str-l4-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('str-l4-1', 'sw-l4-1', 'minimum-window-substring')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('sw-l4-1', 'minimum-window-substring');

-- --- Merge Group: hm-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'hm-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('hm-l2-2', 'hp-l2-2', 'top-k-frequent-elements')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('hp-l2-2', 'top-k-frequent-elements');

-- Revision History
UPDATE public.revision_history
SET question_id = 'hm-l2-2'
WHERE question_id IN ('hp-l2-2', 'top-k-frequent-elements');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'hm-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('hm-l2-2', 'hp-l2-2', 'top-k-frequent-elements')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('hp-l2-2', 'top-k-frequent-elements');

-- --- Merge Group: hm-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'hm-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('hm-l3-1', '128-finding-longest-subsequence-sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('128-finding-longest-subsequence-sum');

-- Revision History
UPDATE public.revision_history
SET question_id = 'hm-l3-1'
WHERE question_id IN ('128-finding-longest-subsequence-sum');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'hm-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('hm-l3-1', '128-finding-longest-subsequence-sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('128-finding-longest-subsequence-sum');

-- --- Merge Group: hm-l4-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'hm-l4-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('hm-l4-1', 'subarray-sums-equals-k')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('subarray-sums-equals-k');

-- Revision History
UPDATE public.revision_history
SET question_id = 'hm-l4-1'
WHERE question_id IN ('subarray-sums-equals-k');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'hm-l4-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('hm-l4-1', 'subarray-sums-equals-k')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('subarray-sums-equals-k');

-- --- Merge Group: sort-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'sort-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('sort-l2-1', '493-reverse-pairs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('493-reverse-pairs');

-- Revision History
UPDATE public.revision_history
SET question_id = 'sort-l2-1'
WHERE question_id IN ('493-reverse-pairs');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'sort-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('sort-l2-1', '493-reverse-pairs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('493-reverse-pairs');

-- --- Merge Group: gr-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'gr-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('gr-l3-1', 'sort-l4-1')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('sort-l4-1');

-- Revision History
UPDATE public.revision_history
SET question_id = 'gr-l3-1'
WHERE question_id IN ('sort-l4-1');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'gr-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('gr-l3-1', 'sort-l4-1')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('sort-l4-1');

-- --- Merge Group: bs-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'bs-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('bs-l2-2', 'find-minimum-in-rotated-sorted-array')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('find-minimum-in-rotated-sorted-array');

-- Revision History
UPDATE public.revision_history
SET question_id = 'bs-l2-2'
WHERE question_id IN ('find-minimum-in-rotated-sorted-array');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'bs-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('bs-l2-2', 'find-minimum-in-rotated-sorted-array')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('find-minimum-in-rotated-sorted-array');

-- --- Merge Group: bs-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'bs-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('bs-l3-1', 'search-in-rotated-sorted-array')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('search-in-rotated-sorted-array');

-- Revision History
UPDATE public.revision_history
SET question_id = 'bs-l3-1'
WHERE question_id IN ('search-in-rotated-sorted-array');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'bs-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('bs-l3-1', 'search-in-rotated-sorted-array')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('search-in-rotated-sorted-array');

-- --- Merge Group: bs-l3-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'bs-l3-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('bs-l3-2', '875-koko-eating-bananas')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('875-koko-eating-bananas');

-- Revision History
UPDATE public.revision_history
SET question_id = 'bs-l3-2'
WHERE question_id IN ('875-koko-eating-bananas');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'bs-l3-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('bs-l3-2', '875-koko-eating-bananas')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('875-koko-eating-bananas');

-- --- Merge Group: bs-l4-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'bs-l4-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('bs-l4-1', '4-median-of-two-sorted-arrays')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('4-median-of-two-sorted-arrays');

-- Revision History
UPDATE public.revision_history
SET question_id = 'bs-l4-1'
WHERE question_id IN ('4-median-of-two-sorted-arrays');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'bs-l4-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('bs-l4-1', '4-median-of-two-sorted-arrays')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('4-median-of-two-sorted-arrays');

-- --- Merge Group: tp-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tp-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tp-l2-2', '184sum', '3sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('184sum', '3sum');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tp-l2-2'
WHERE question_id IN ('184sum', '3sum');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tp-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tp-l2-2', '184sum', '3sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('184sum', '3sum');

-- --- Merge Group: tp-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tp-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tp-l3-1', 'container-with-most-water')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('container-with-most-water');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tp-l3-1'
WHERE question_id IN ('container-with-most-water');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tp-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tp-l3-1', 'container-with-most-water')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('container-with-most-water');

-- --- Merge Group: tp-l4-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tp-l4-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tp-l4-1', 'trapping-rain-water')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('trapping-rain-water');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tp-l4-1'
WHERE question_id IN ('trapping-rain-water');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tp-l4-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tp-l4-1', 'trapping-rain-water')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('trapping-rain-water');

-- --- Merge Group: st-l1-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'st-l1-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('st-l1-1', 'st-l4-1', 'valid-paranthesis', 'valid-parentheses')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('st-l4-1', 'valid-paranthesis', 'valid-parentheses');

-- Revision History
UPDATE public.revision_history
SET question_id = 'st-l1-1'
WHERE question_id IN ('st-l4-1', 'valid-paranthesis', 'valid-parentheses');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'st-l1-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('st-l1-1', 'st-l4-1', 'valid-paranthesis', 'valid-parentheses')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('st-l4-1', 'valid-paranthesis', 'valid-parentheses');

-- --- Merge Group: qu-l1-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'qu-l1-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('qu-l1-1', 'implement-stack-using-queues')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('implement-stack-using-queues');

-- Revision History
UPDATE public.revision_history
SET question_id = 'qu-l1-1'
WHERE question_id IN ('implement-stack-using-queues');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'qu-l1-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('qu-l1-1', 'implement-stack-using-queues')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('implement-stack-using-queues');

-- --- Merge Group: qu-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'qu-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('qu-l2-2', 'tr-l2-3', 'binary-tree-level-order-traversal', 'lc-102')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('tr-l2-3', 'binary-tree-level-order-traversal', 'lc-102');

-- Revision History
UPDATE public.revision_history
SET question_id = 'qu-l2-2'
WHERE question_id IN ('tr-l2-3', 'binary-tree-level-order-traversal', 'lc-102');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'qu-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('qu-l2-2', 'tr-l2-3', 'binary-tree-level-order-traversal', 'lc-102')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('tr-l2-3', 'binary-tree-level-order-traversal', 'lc-102');

-- --- Merge Group: qu-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'qu-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('qu-l3-1', 'lru-cache', 'sliding-window-maximum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('lru-cache', 'sliding-window-maximum');

-- Revision History
UPDATE public.revision_history
SET question_id = 'qu-l3-1'
WHERE question_id IN ('lru-cache', 'sliding-window-maximum');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'qu-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('qu-l3-1', 'lru-cache', 'sliding-window-maximum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('lru-cache', 'sliding-window-maximum');

-- --- Merge Group: ll-l1-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'll-l1-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('ll-l1-1', 'reverse-a-ll', 'reverse-linked-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('reverse-a-ll', 'reverse-linked-list');

-- Revision History
UPDATE public.revision_history
SET question_id = 'll-l1-1'
WHERE question_id IN ('reverse-a-ll', 'reverse-linked-list');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'll-l1-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('ll-l1-1', 'reverse-a-ll', 'reverse-linked-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('reverse-a-ll', 'reverse-linked-list');

-- --- Merge Group: ll-l1-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'll-l1-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('ll-l1-2', 'merge-two-sorted-lists')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('merge-two-sorted-lists');

-- Revision History
UPDATE public.revision_history
SET question_id = 'll-l1-2'
WHERE question_id IN ('merge-two-sorted-lists');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'll-l1-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('ll-l1-2', 'merge-two-sorted-lists')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('merge-two-sorted-lists');

-- --- Merge Group: ll-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'll-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('ll-l2-1', 'detect-loop-in-ll', 'linked-list-cycle')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('detect-loop-in-ll', 'linked-list-cycle');

-- Revision History
UPDATE public.revision_history
SET question_id = 'll-l2-1'
WHERE question_id IN ('detect-loop-in-ll', 'linked-list-cycle');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'll-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('ll-l2-1', 'detect-loop-in-ll', 'linked-list-cycle')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('detect-loop-in-ll', 'linked-list-cycle');

-- --- Merge Group: ll-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'll-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('ll-l2-2', 'reorder-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('reorder-list');

-- Revision History
UPDATE public.revision_history
SET question_id = 'll-l2-2'
WHERE question_id IN ('reorder-list');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'll-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('ll-l2-2', 'reorder-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('reorder-list');

-- --- Merge Group: ll-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'll-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('ll-l3-1', 'remove-nth-node-from-end-in-ll', 'remove-nth-node-from-end-of-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('remove-nth-node-from-end-in-ll', 'remove-nth-node-from-end-of-list');

-- Revision History
UPDATE public.revision_history
SET question_id = 'll-l3-1'
WHERE question_id IN ('remove-nth-node-from-end-in-ll', 'remove-nth-node-from-end-of-list');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'll-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('ll-l3-1', 'remove-nth-node-from-end-in-ll', 'remove-nth-node-from-end-of-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('remove-nth-node-from-end-in-ll', 'remove-nth-node-from-end-of-list');

-- --- Merge Group: ll-l4-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'll-l4-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('ll-l4-1', 'merge-k-sorted-lists')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('merge-k-sorted-lists');

-- Revision History
UPDATE public.revision_history
SET question_id = 'll-l4-1'
WHERE question_id IN ('merge-k-sorted-lists');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'll-l4-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('ll-l4-1', 'merge-k-sorted-lists')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('merge-k-sorted-lists');

-- --- Merge Group: tr-l1-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tr-l1-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tr-l1-1', 'check-if-two-trees-are-equal', 'maximum-depth-of-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('check-if-two-trees-are-equal', 'maximum-depth-of-binary-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tr-l1-1'
WHERE question_id IN ('check-if-two-trees-are-equal', 'maximum-depth-of-binary-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tr-l1-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tr-l1-1', 'check-if-two-trees-are-equal', 'maximum-depth-of-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('check-if-two-trees-are-equal', 'maximum-depth-of-binary-tree');

-- --- Merge Group: tr-l1-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tr-l1-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tr-l1-2', 'invert-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('invert-binary-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tr-l1-2'
WHERE question_id IN ('invert-binary-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tr-l1-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tr-l1-2', 'invert-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('invert-binary-tree');

-- --- Merge Group: tr-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tr-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tr-l2-1', 'same-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('same-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tr-l2-1'
WHERE question_id IN ('same-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tr-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tr-l2-1', 'same-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('same-tree');

-- --- Merge Group: tr-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tr-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tr-l2-2', 'subtree-of-another-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('subtree-of-another-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tr-l2-2'
WHERE question_id IN ('subtree-of-another-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tr-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tr-l2-2', 'subtree-of-another-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('subtree-of-another-tree');

-- --- Merge Group: tr-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tr-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tr-l3-1', 'validate-binary-search-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('validate-binary-search-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tr-l3-1'
WHERE question_id IN ('validate-binary-search-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tr-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tr-l3-1', 'validate-binary-search-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('validate-binary-search-tree');

-- --- Merge Group: tr-l3-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tr-l3-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tr-l3-2', 'lowest-common-ancestor-of-a-binary-search-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('lowest-common-ancestor-of-a-binary-search-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tr-l3-2'
WHERE question_id IN ('lowest-common-ancestor-of-a-binary-search-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tr-l3-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tr-l3-2', 'lowest-common-ancestor-of-a-binary-search-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('lowest-common-ancestor-of-a-binary-search-tree');

-- --- Merge Group: tr-l4-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'tr-l4-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('tr-l4-1', 'serialize-and-deserialize-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('serialize-and-deserialize-binary-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'tr-l4-1'
WHERE question_id IN ('serialize-and-deserialize-binary-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'tr-l4-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('tr-l4-1', 'serialize-and-deserialize-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('serialize-and-deserialize-binary-tree');

-- --- Merge Group: bst-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'bst-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('bst-l2-1', 'kth-smallest-element-in-a-bst')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('kth-smallest-element-in-a-bst');

-- Revision History
UPDATE public.revision_history
SET question_id = 'bst-l2-1'
WHERE question_id IN ('kth-smallest-element-in-a-bst');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'bst-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('bst-l2-1', 'kth-smallest-element-in-a-bst')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('kth-smallest-element-in-a-bst');

-- --- Merge Group: hp-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'hp-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('hp-l2-1', 'kth-largest-element-in-an-array')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('kth-largest-element-in-an-array');

-- Revision History
UPDATE public.revision_history
SET question_id = 'hp-l2-1'
WHERE question_id IN ('kth-largest-element-in-an-array');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'hp-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('hp-l2-1', 'kth-largest-element-in-an-array')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('kth-largest-element-in-an-array');

-- --- Merge Group: hp-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'hp-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('hp-l3-1', 'find-median-from-data-stream')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('find-median-from-data-stream');

-- Revision History
UPDATE public.revision_history
SET question_id = 'hp-l3-1'
WHERE question_id IN ('find-median-from-data-stream');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'hp-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('hp-l3-1', 'find-median-from-data-stream')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('find-median-from-data-stream');

-- --- Merge Group: gd-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'gd-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('gd-l2-1', 'clone-graph')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('clone-graph');

-- Revision History
UPDATE public.revision_history
SET question_id = 'gd-l2-1'
WHERE question_id IN ('clone-graph');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'gd-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('gd-l2-1', 'clone-graph')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('clone-graph');

-- --- Merge Group: gr-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'gr-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('gr-l2-1', 'jumps-game')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('jumps-game');

-- Revision History
UPDATE public.revision_history
SET question_id = 'gr-l2-1'
WHERE question_id IN ('jumps-game');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'gr-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('gr-l2-1', 'jumps-game')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('jumps-game');

-- --- Merge Group: dp-l1-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'dp-l1-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('dp-l1-1', 'climbing-stairs', 'climbing-stairs-lc-70')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('climbing-stairs', 'climbing-stairs-lc-70');

-- Revision History
UPDATE public.revision_history
SET question_id = 'dp-l1-1'
WHERE question_id IN ('climbing-stairs', 'climbing-stairs-lc-70');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'dp-l1-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('dp-l1-1', 'climbing-stairs', 'climbing-stairs-lc-70')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('climbing-stairs', 'climbing-stairs-lc-70');

-- --- Merge Group: dp-l2-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'dp-l2-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('dp-l2-1', 'house-robber', 'lc-198-house-robber')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('house-robber', 'lc-198-house-robber');

-- Revision History
UPDATE public.revision_history
SET question_id = 'dp-l2-1'
WHERE question_id IN ('house-robber', 'lc-198-house-robber');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'dp-l2-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('dp-l2-1', 'house-robber', 'lc-198-house-robber')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('house-robber', 'lc-198-house-robber');

-- --- Merge Group: dp-l2-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'dp-l2-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('dp-l2-2', 'coin-change')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('coin-change');

-- Revision History
UPDATE public.revision_history
SET question_id = 'dp-l2-2'
WHERE question_id IN ('coin-change');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'dp-l2-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('dp-l2-2', 'coin-change')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('coin-change');

-- --- Merge Group: dp-l3-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'dp-l3-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('dp-l3-1', 'lis')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('lis');

-- Revision History
UPDATE public.revision_history
SET question_id = 'dp-l3-1'
WHERE question_id IN ('lis');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'dp-l3-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('dp-l3-1', 'lis')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('lis');

-- --- Merge Group: dp-l4-1 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'dp-l4-1', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('dp-l4-1', 'edit-distance')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('edit-distance');

-- Revision History
UPDATE public.revision_history
SET question_id = 'dp-l4-1'
WHERE question_id IN ('edit-distance');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'dp-l4-1',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('dp-l4-1', 'edit-distance')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('edit-distance');

-- --- Merge Group: longest-palindrome ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'longest-palindrome', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('longest-palindrome', 'longest-palindromic-substring')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('longest-palindromic-substring');

-- Revision History
UPDATE public.revision_history
SET question_id = 'longest-palindrome'
WHERE question_id IN ('longest-palindromic-substring');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'longest-palindrome',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('longest-palindrome', 'longest-palindromic-substring')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('longest-palindromic-substring');

-- --- Merge Group: find-number-of-islands ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'find-number-of-islands', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('find-number-of-islands', 'find-the-number-of-islands-set-1-using-dfs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('find-the-number-of-islands-set-1-using-dfs');

-- Revision History
UPDATE public.revision_history
SET question_id = 'find-number-of-islands'
WHERE question_id IN ('find-the-number-of-islands-set-1-using-dfs');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'find-number-of-islands',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('find-number-of-islands', 'find-the-number-of-islands-set-1-using-dfs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('find-the-number-of-islands-set-1-using-dfs');

-- --- Merge Group: given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x', 'given-matrix-o-x-replace-o-x-surrounded-x')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('given-matrix-o-x-replace-o-x-surrounded-x');

-- Revision History
UPDATE public.revision_history
SET question_id = 'given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x'
WHERE question_id IN ('given-matrix-o-x-replace-o-x-surrounded-x');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('given-a-matrix-of-o-and-x-replace-o-with-x-if-surrounded-by-x', 'given-matrix-o-x-replace-o-x-surrounded-x')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('given-matrix-o-x-replace-o-x-surrounded-x');

-- --- Merge Group: maximum-size-rectangle-binary-sub-matrix-1s ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'maximum-size-rectangle-binary-sub-matrix-1s', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('maximum-size-rectangle-binary-sub-matrix-1s', 'maximum-size-rectangle-of-all-1s')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('maximum-size-rectangle-of-all-1s');

-- Revision History
UPDATE public.revision_history
SET question_id = 'maximum-size-rectangle-binary-sub-matrix-1s'
WHERE question_id IN ('maximum-size-rectangle-of-all-1s');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'maximum-size-rectangle-binary-sub-matrix-1s',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('maximum-size-rectangle-binary-sub-matrix-1s', 'maximum-size-rectangle-of-all-1s')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('maximum-size-rectangle-of-all-1s');

-- --- Merge Group: permute-two-arrays-such-that-sum-of-every-pair-is-greater-or-equal-to-k ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'permute-two-arrays-such-that-sum-of-every-pair-is-greater-or-equal-to-k', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('permute-two-arrays-such-that-sum-of-every-pair-is-greater-or-equal-to-k', 'permute-two-arrays-sum-every-pair-greater-equal-k')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('permute-two-arrays-sum-every-pair-greater-equal-k');

-- Revision History
UPDATE public.revision_history
SET question_id = 'permute-two-arrays-such-that-sum-of-every-pair-is-greater-or-equal-to-k'
WHERE question_id IN ('permute-two-arrays-sum-every-pair-greater-equal-k');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'permute-two-arrays-such-that-sum-of-every-pair-is-greater-or-equal-to-k',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('permute-two-arrays-such-that-sum-of-every-pair-is-greater-or-equal-to-k', 'permute-two-arrays-sum-every-pair-greater-equal-k')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('permute-two-arrays-sum-every-pair-greater-equal-k');

-- --- Merge Group: find-a-pair-with-the-given-difference ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'find-a-pair-with-the-given-difference', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('find-a-pair-with-the-given-difference', 'piar-with-given-difference')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('piar-with-given-difference');

-- Revision History
UPDATE public.revision_history
SET question_id = 'find-a-pair-with-the-given-difference'
WHERE question_id IN ('piar-with-given-difference');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'find-a-pair-with-the-given-difference',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('find-a-pair-with-the-given-difference', 'piar-with-given-difference')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('piar-with-given-difference');

-- --- Merge Group: a-product-array-puzzle ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'a-product-array-puzzle', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('a-product-array-puzzle', 'product-of-array-except-itself')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('product-of-array-except-itself');

-- Revision History
UPDATE public.revision_history
SET question_id = 'a-product-array-puzzle'
WHERE question_id IN ('product-of-array-except-itself');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'a-product-array-puzzle',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('a-product-array-puzzle', 'product-of-array-except-itself')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('product-of-array-except-itself');

-- --- Merge Group: make-all-array-elements-equal ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'make-all-array-elements-equal', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('make-all-array-elements-equal', 'make-array-elements-equal-minimum-cost')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('make-array-elements-equal-minimum-cost');

-- Revision History
UPDATE public.revision_history
SET question_id = 'make-all-array-elements-equal'
WHERE question_id IN ('make-array-elements-equal-minimum-cost');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'make-all-array-elements-equal',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('make-all-array-elements-equal', 'make-array-elements-equal-minimum-cost')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('make-array-elements-equal-minimum-cost');

-- --- Merge Group: check-if-reversing-a-sub-array-make-the-array-sorted ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'check-if-reversing-a-sub-array-make-the-array-sorted', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('check-if-reversing-a-sub-array-make-the-array-sorted', 'check-reversing-sub-array-make-array-sorted')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('check-reversing-sub-array-make-array-sorted');

-- Revision History
UPDATE public.revision_history
SET question_id = 'check-if-reversing-a-sub-array-make-the-array-sorted'
WHERE question_id IN ('check-reversing-sub-array-make-array-sorted');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'check-if-reversing-a-sub-array-make-the-array-sorted',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('check-if-reversing-a-sub-array-make-the-array-sorted', 'check-reversing-sub-array-make-array-sorted')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('check-reversing-sub-array-make-array-sorted');

-- --- Merge Group: aggrcow ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'aggrcow', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('aggrcow', 'aggressive-cows', 'spoj-aggressive-cows-problem')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('aggressive-cows', 'spoj-aggressive-cows-problem');

-- Revision History
UPDATE public.revision_history
SET question_id = 'aggrcow'
WHERE question_id IN ('aggressive-cows', 'spoj-aggressive-cows-problem');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'aggrcow',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('aggrcow', 'aggressive-cows', 'spoj-aggressive-cows-problem')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('aggressive-cows', 'spoj-aggressive-cows-problem');

-- --- Merge Group: minimum-number-swaps-required-sort-array ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'minimum-number-swaps-required-sort-array', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('minimum-number-swaps-required-sort-array', 'minimum-swaps-to-sort')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('minimum-swaps-to-sort');

-- Revision History
UPDATE public.revision_history
SET question_id = 'minimum-number-swaps-required-sort-array'
WHERE question_id IN ('minimum-swaps-to-sort');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'minimum-number-swaps-required-sort-array',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('minimum-number-swaps-required-sort-array', 'minimum-swaps-to-sort')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('minimum-swaps-to-sort');

-- --- Merge Group: partition-equal-subset-sum ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'partition-equal-subset-sum', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('partition-equal-subset-sum', 'subset-sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('subset-sum');

-- Revision History
UPDATE public.revision_history
SET question_id = 'partition-equal-subset-sum'
WHERE question_id IN ('subset-sum');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'partition-equal-subset-sum',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('partition-equal-subset-sum', 'subset-sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('subset-sum');

-- --- Merge Group: print-all-palindromic-partitions-of-a-string ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'print-all-palindromic-partitions-of-a-string', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('print-all-palindromic-partitions-of-a-string', 'print-palindromic-partitions-string')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('print-palindromic-partitions-string');

-- Revision History
UPDATE public.revision_history
SET question_id = 'print-all-palindromic-partitions-of-a-string'
WHERE question_id IN ('print-palindromic-partitions-string');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'print-all-palindromic-partitions-of-a-string',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('print-all-palindromic-partitions-of-a-string', 'print-palindromic-partitions-string')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('print-palindromic-partitions-string');

-- --- Merge Group: partition-of-set-into-k-subsets-with-equal-sum ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'partition-of-set-into-k-subsets-with-equal-sum', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('partition-of-set-into-k-subsets-with-equal-sum', 'partition-set-k-subsets-equal-sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('partition-set-k-subsets-equal-sum');

-- Revision History
UPDATE public.revision_history
SET question_id = 'partition-of-set-into-k-subsets-with-equal-sum'
WHERE question_id IN ('partition-set-k-subsets-equal-sum');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'partition-of-set-into-k-subsets-with-equal-sum',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('partition-of-set-into-k-subsets-with-equal-sum', 'partition-set-k-subsets-equal-sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('partition-set-k-subsets-equal-sum');

-- --- Merge Group: find-maximum-number-possible-by-doing-at-most-k-swaps ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'find-maximum-number-possible-by-doing-at-most-k-swaps', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('find-maximum-number-possible-by-doing-at-most-k-swaps', 'maximum-possible-number-by-doing-at-most-k-swaps')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('maximum-possible-number-by-doing-at-most-k-swaps');

-- Revision History
UPDATE public.revision_history
SET question_id = 'find-maximum-number-possible-by-doing-at-most-k-swaps'
WHERE question_id IN ('maximum-possible-number-by-doing-at-most-k-swaps');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'find-maximum-number-possible-by-doing-at-most-k-swaps',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('find-maximum-number-possible-by-doing-at-most-k-swaps', 'maximum-possible-number-by-doing-at-most-k-swaps')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('maximum-possible-number-by-doing-at-most-k-swaps');

-- --- Merge Group: delete-without-head-node ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'delete-without-head-node', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('delete-without-head-node', 'given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it');

-- Revision History
UPDATE public.revision_history
SET question_id = 'delete-without-head-node'
WHERE question_id IN ('given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'delete-without-head-node',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('delete-without-head-node', 'given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('given-only-a-pointer-to-a-node-to-be-deleted-in-a-singly-linked-list-how-do-you-delete-it');

-- --- Merge Group: reverse-a-dll ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'reverse-a-dll', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('reverse-a-dll', 'reverse-a-doubly-linked-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('reverse-a-doubly-linked-list');

-- Revision History
UPDATE public.revision_history
SET question_id = 'reverse-a-dll'
WHERE question_id IN ('reverse-a-doubly-linked-list');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'reverse-a-dll',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('reverse-a-dll', 'reverse-a-doubly-linked-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('reverse-a-doubly-linked-list');

-- --- Merge Group: evaluation-of-postfix-expression ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'evaluation-of-postfix-expression', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('evaluation-of-postfix-expression', 'stack-set-4-evaluation-postfix-expression')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('stack-set-4-evaluation-postfix-expression');

-- Revision History
UPDATE public.revision_history
SET question_id = 'evaluation-of-postfix-expression'
WHERE question_id IN ('stack-set-4-evaluation-postfix-expression');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'evaluation-of-postfix-expression',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('evaluation-of-postfix-expression', 'stack-set-4-evaluation-postfix-expression')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('stack-set-4-evaluation-postfix-expression');

-- --- Merge Group: chocola ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'chocola', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('chocola', 'problems-chocola')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('problems-chocola');

-- Revision History
UPDATE public.revision_history
SET question_id = 'chocola'
WHERE question_id IN ('problems-chocola');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'chocola',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('chocola', 'problems-chocola')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('problems-chocola');

-- --- Merge Group: minimise-the-cash-flow ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'minimise-the-cash-flow', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('minimise-the-cash-flow', 'minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other', 'minimize-cash-flow-among-given-set-friends-borrowed-money')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other', 'minimize-cash-flow-among-given-set-friends-borrowed-money');

-- Revision History
UPDATE public.revision_history
SET question_id = 'minimise-the-cash-flow'
WHERE question_id IN ('minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other', 'minimize-cash-flow-among-given-set-friends-borrowed-money');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'minimise-the-cash-flow',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('minimise-the-cash-flow', 'minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other', 'minimize-cash-flow-among-given-set-friends-borrowed-money')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('minimize-cash-flow-among-a-given-set-of-friends-who-have-borrowed-money-from-each-other', 'minimize-cash-flow-among-given-set-friends-borrowed-money');

-- --- Merge Group: binary-tree-right-side-view ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'binary-tree-right-side-view', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('binary-tree-right-side-view', 'diameter-of-a-binary-tree', 'diameter-of-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('diameter-of-a-binary-tree', 'diameter-of-binary-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'binary-tree-right-side-view'
WHERE question_id IN ('diameter-of-a-binary-tree', 'diameter-of-binary-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'binary-tree-right-side-view',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('binary-tree-right-side-view', 'diameter-of-a-binary-tree', 'diameter-of-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('diameter-of-a-binary-tree', 'diameter-of-binary-tree');

-- --- Merge Group: binary-tree-maximum-path-sum ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'binary-tree-maximum-path-sum', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('binary-tree-maximum-path-sum', 'symmetric-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('symmetric-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'binary-tree-maximum-path-sum'
WHERE question_id IN ('symmetric-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'binary-tree-maximum-path-sum',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('binary-tree-maximum-path-sum', 'symmetric-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('symmetric-tree');

-- --- Merge Group: print-all-k-sum-paths-in-a-binary-tree ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'print-all-k-sum-paths-in-a-binary-tree', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('print-all-k-sum-paths-in-a-binary-tree', 'print-k-sum-paths-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('print-k-sum-paths-binary-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'print-all-k-sum-paths-in-a-binary-tree'
WHERE question_id IN ('print-k-sum-paths-binary-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'print-all-k-sum-paths-in-a-binary-tree',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('print-all-k-sum-paths-in-a-binary-tree', 'print-k-sum-paths-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('print-k-sum-paths-binary-tree');

-- --- Merge Group: construct-bst-from-given-preorder-traversa ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'construct-bst-from-given-preorder-traversa', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('construct-bst-from-given-preorder-traversa', 'construct-bst-from-given-preorder-traversal')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('construct-bst-from-given-preorder-traversal');

-- Revision History
UPDATE public.revision_history
SET question_id = 'construct-bst-from-given-preorder-traversa'
WHERE question_id IN ('construct-bst-from-given-preorder-traversal');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'construct-bst-from-given-preorder-traversa',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('construct-bst-from-given-preorder-traversa', 'construct-bst-from-given-preorder-traversal')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('construct-bst-from-given-preorder-traversal');

-- --- Merge Group: find-median-bst-time-o1-space ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'find-median-bst-time-o1-space', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('find-median-bst-time-o1-space', 'find-median-of-bst-in-on-time-and-o1-space')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('find-median-of-bst-in-on-time-and-o1-space');

-- Revision History
UPDATE public.revision_history
SET question_id = 'find-median-bst-time-o1-space'
WHERE question_id IN ('find-median-of-bst-in-on-time-and-o1-space');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'find-median-bst-time-o1-space',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('find-median-bst-time-o1-space', 'find-median-of-bst-in-on-time-and-o1-space')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('find-median-of-bst-in-on-time-and-o1-space');

-- --- Merge Group: largest-bst-binary-tree-set-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'largest-bst-binary-tree-set-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('largest-bst-binary-tree-set-2', 'largest-bst-in-a-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('largest-bst-in-a-binary-tree');

-- Revision History
UPDATE public.revision_history
SET question_id = 'largest-bst-binary-tree-set-2'
WHERE question_id IN ('largest-bst-in-a-binary-tree');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'largest-bst-binary-tree-set-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('largest-bst-binary-tree-set-2', 'largest-bst-in-a-binary-tree')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('largest-bst-in-a-binary-tree');

-- --- Merge Group: depth-first-search-or-dfs-for-a-graph ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'depth-first-search-or-dfs-for-a-graph', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('depth-first-search-or-dfs-for-a-graph', 'dfs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('dfs');

-- Revision History
UPDATE public.revision_history
SET question_id = 'depth-first-search-or-dfs-for-a-graph'
WHERE question_id IN ('dfs');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'depth-first-search-or-dfs-for-a-graph',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('depth-first-search-or-dfs-for-a-graph', 'dfs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('dfs');

-- --- Merge Group: flood-fill ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'flood-fill', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('flood-fill', 'flood-fill-algorithm')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('flood-fill-algorithm');

-- Revision History
UPDATE public.revision_history
SET question_id = 'flood-fill'
WHERE question_id IN ('flood-fill-algorithm');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'flood-fill',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('flood-fill', 'flood-fill-algorithm')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('flood-fill-algorithm');

-- --- Merge Group: prims-algo ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'prims-algo', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('prims-algo', 'prims-minimum-spanning-tree-mst-greedy-algo-5')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('prims-minimum-spanning-tree-mst-greedy-algo-5');

-- Revision History
UPDATE public.revision_history
SET question_id = 'prims-algo'
WHERE question_id IN ('prims-minimum-spanning-tree-mst-greedy-algo-5');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'prims-algo',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('prims-algo', 'prims-minimum-spanning-tree-mst-greedy-algo-5')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('prims-minimum-spanning-tree-mst-greedy-algo-5');

-- --- Merge Group: graph-coloring ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'graph-coloring', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('graph-coloring', 'textgraph20coloring20problem20is20toare20colored20using20same20color')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('textgraph20coloring20problem20is20toare20colored20using20same20color');

-- Revision History
UPDATE public.revision_history
SET question_id = 'graph-coloring'
WHERE question_id IN ('textgraph20coloring20problem20is20toare20colored20using20same20color');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'graph-coloring',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('graph-coloring', 'textgraph20coloring20problem20is20toare20colored20using20same20color')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('textgraph20coloring20problem20is20toare20colored20using20same20color');

-- --- Merge Group: cheapest-flights-within-k-stops ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'cheapest-flights-within-k-stops', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('cheapest-flights-within-k-stops', 'description')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('description');

-- Revision History
UPDATE public.revision_history
SET question_id = 'cheapest-flights-within-k-stops'
WHERE question_id IN ('description');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'cheapest-flights-within-k-stops',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('cheapest-flights-within-k-stops', 'description')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('description');

-- --- Merge Group: bellman-ford ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'bellman-ford', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('bellman-ford', 'detect-negative-cycle-graph-bellman-ford')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('detect-negative-cycle-graph-bellman-ford');

-- Revision History
UPDATE public.revision_history
SET question_id = 'bellman-ford'
WHERE question_id IN ('detect-negative-cycle-graph-bellman-ford');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'bellman-ford',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('bellman-ford', 'detect-negative-cycle-graph-bellman-ford')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('detect-negative-cycle-graph-bellman-ford');

-- --- Merge Group: bipartite-graph ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'bipartite-graph', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('bipartite-graph', 'bipartitie-graph')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('bipartitie-graph');

-- Revision History
UPDATE public.revision_history
SET question_id = 'bipartite-graph'
WHERE question_id IN ('bipartitie-graph');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'bipartite-graph',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('bipartite-graph', 'bipartitie-graph')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('bipartitie-graph');

-- --- Merge Group: travelling-salesman ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'travelling-salesman', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('travelling-salesman', 'travelling-salesman-problem-set-1')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('travelling-salesman-problem-set-1');

-- Revision History
UPDATE public.revision_history
SET question_id = 'travelling-salesman'
WHERE question_id IN ('travelling-salesman-problem-set-1');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'travelling-salesman',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('travelling-salesman', 'travelling-salesman-problem-set-1')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('travelling-salesman-problem-set-1');

-- --- Merge Group: water-jug ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'water-jug', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('water-jug', 'water-jug-2', 'water-jug-problem-using-bfs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('water-jug-2', 'water-jug-problem-using-bfs');

-- Revision History
UPDATE public.revision_history
SET question_id = 'water-jug'
WHERE question_id IN ('water-jug-2', 'water-jug-problem-using-bfs');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'water-jug',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('water-jug', 'water-jug-2', 'water-jug-problem-using-bfs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('water-jug-2', 'water-jug-problem-using-bfs');

-- --- Merge Group: construct-a-trie-from-scratch ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'construct-a-trie-from-scratch', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('construct-a-trie-from-scratch', 'trie-insert-and-search')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('trie-insert-and-search');

-- Revision History
UPDATE public.revision_history
SET question_id = 'construct-a-trie-from-scratch'
WHERE question_id IN ('trie-insert-and-search');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'construct-a-trie-from-scratch',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('construct-a-trie-from-scratch', 'trie-insert-and-search')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('trie-insert-and-search');

-- --- Merge Group: 213-house-robber ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, '213-house-robber', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('213-house-robber', 'houe-robber-2')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('houe-robber-2');

-- Revision History
UPDATE public.revision_history
SET question_id = '213-house-robber'
WHERE question_id IN ('houe-robber-2');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  '213-house-robber',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('213-house-robber', 'houe-robber-2')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('houe-robber-2');

-- --- Merge Group: optimal-binary-search-tree-dp-24 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'optimal-binary-search-tree-dp-24', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('optimal-binary-search-tree-dp-24', 'optimal-bst')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('optimal-bst');

-- Revision History
UPDATE public.revision_history
SET question_id = 'optimal-binary-search-tree-dp-24'
WHERE question_id IN ('optimal-bst');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'optimal-binary-search-tree-dp-24',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('optimal-binary-search-tree-dp-24', 'optimal-bst')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('optimal-bst');

-- --- Merge Group: largest-area-rectangular-sub-matrix-equal-number-1s-0s ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'largest-area-rectangular-sub-matrix-equal-number-1s-0s', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('largest-area-rectangular-sub-matrix-equal-number-1s-0s', 'largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s');

-- Revision History
UPDATE public.revision_history
SET question_id = 'largest-area-rectangular-sub-matrix-equal-number-1s-0s'
WHERE question_id IN ('largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'largest-area-rectangular-sub-matrix-equal-number-1s-0s',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('largest-area-rectangular-sub-matrix-equal-number-1s-0s', 'largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('largest-area-rectangular-sub-matrix-with-equal-number-of-1s-and-0s');

-- --- Merge Group: 4sum ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, '4sum', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('4sum', 'gfg-largest-subaray-with-0-sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('gfg-largest-subaray-with-0-sum');

-- Revision History
UPDATE public.revision_history
SET question_id = '4sum'
WHERE question_id IN ('gfg-largest-subaray-with-0-sum');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  '4sum',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('4sum', 'gfg-largest-subaray-with-0-sum')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('gfg-largest-subaray-with-0-sum');

-- --- Merge Group: 152-maximum-product-subarray ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, '152-maximum-product-subarray', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('152-maximum-product-subarray', 'reverse-pairs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('reverse-pairs');

-- Revision History
UPDATE public.revision_history
SET question_id = '152-maximum-product-subarray'
WHERE question_id IN ('reverse-pairs');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  '152-maximum-product-subarray',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('152-maximum-product-subarray', 'reverse-pairs')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('reverse-pairs');

-- --- Merge Group: 1283-smallest-divisor-in-a-threshold ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, '1283-smallest-divisor-in-a-threshold', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('1283-smallest-divisor-in-a-threshold', '1283smallest-divisor-given-a-threshold')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('1283smallest-divisor-given-a-threshold');

-- Revision History
UPDATE public.revision_history
SET question_id = '1283-smallest-divisor-in-a-threshold'
WHERE question_id IN ('1283smallest-divisor-given-a-threshold');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  '1283-smallest-divisor-in-a-threshold',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('1283-smallest-divisor-in-a-threshold', '1283smallest-divisor-given-a-threshold')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('1283smallest-divisor-given-a-threshold');

-- --- Merge Group: implemenation-of-atoi ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'implemenation-of-atoi', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('implemenation-of-atoi', 'recursive-atoi')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('recursive-atoi');

-- Revision History
UPDATE public.revision_history
SET question_id = 'implemenation-of-atoi'
WHERE question_id IN ('recursive-atoi');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'implemenation-of-atoi',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('implemenation-of-atoi', 'recursive-atoi')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('recursive-atoi');

-- --- Merge Group: middle-of-a-ll ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'middle-of-a-ll', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('middle-of-a-ll', 'middle-of-the-linked-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('middle-of-the-linked-list');

-- Revision History
UPDATE public.revision_history
SET question_id = 'middle-of-a-ll'
WHERE question_id IN ('middle-of-the-linked-list');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'middle-of-a-ll',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('middle-of-a-ll', 'middle-of-the-linked-list')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('middle-of-the-linked-list');

-- --- Merge Group: palindrome-linked-list ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'palindrome-linked-list', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('palindrome-linked-list', 'palindrome-ll')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('palindrome-ll');

-- Revision History
UPDATE public.revision_history
SET question_id = 'palindrome-linked-list'
WHERE question_id IN ('palindrome-ll');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'palindrome-linked-list',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('palindrome-linked-list', 'palindrome-ll')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('palindrome-ll');

-- --- Merge Group: sort-list ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'sort-list', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('sort-list', 'sort-ll')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('sort-ll');

-- Revision History
UPDATE public.revision_history
SET question_id = 'sort-list'
WHERE question_id IN ('sort-ll');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'sort-list',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('sort-list', 'sort-ll')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('sort-ll');

-- --- Merge Group: intersection-of-two-linked-lists ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'intersection-of-two-linked-lists', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('intersection-of-two-linked-lists', 'intersection-of-two-ll')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('intersection-of-two-ll');

-- Revision History
UPDATE public.revision_history
SET question_id = 'intersection-of-two-linked-lists'
WHERE question_id IN ('intersection-of-two-ll');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'intersection-of-two-linked-lists',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('intersection-of-two-linked-lists', 'intersection-of-two-ll')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('intersection-of-two-ll');

-- --- Merge Group: add-2-numbers ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'add-2-numbers', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('add-2-numbers', 'add-two-numbers')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('add-two-numbers');

-- Revision History
UPDATE public.revision_history
SET question_id = 'add-2-numbers'
WHERE question_id IN ('add-two-numbers');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'add-2-numbers',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('add-2-numbers', 'add-two-numbers')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('add-two-numbers');

-- --- Merge Group: reverse-k-nodes-in-k-groups ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'reverse-k-nodes-in-k-groups', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('reverse-k-nodes-in-k-groups', 'reverse-nodes-in-k-group')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('reverse-nodes-in-k-group');

-- Revision History
UPDATE public.revision_history
SET question_id = 'reverse-k-nodes-in-k-groups'
WHERE question_id IN ('reverse-nodes-in-k-group');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'reverse-k-nodes-in-k-groups',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('reverse-k-nodes-in-k-groups', 'reverse-nodes-in-k-group')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('reverse-nodes-in-k-group');

-- --- Merge Group: generate-paranthesis ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'generate-paranthesis', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('generate-paranthesis', 'generate-parentheses', 'generate-valid-parenthesis')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('generate-parentheses', 'generate-valid-parenthesis');

-- Revision History
UPDATE public.revision_history
SET question_id = 'generate-paranthesis'
WHERE question_id IN ('generate-parentheses', 'generate-valid-parenthesis');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'generate-paranthesis',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('generate-paranthesis', 'generate-parentheses', 'generate-valid-parenthesis')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('generate-parentheses', 'generate-valid-parenthesis');

-- --- Merge Group: combination-sum-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'combination-sum-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('combination-sum-2', 'combination-sum-ii')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('combination-sum-ii');

-- Revision History
UPDATE public.revision_history
SET question_id = 'combination-sum-2'
WHERE question_id IN ('combination-sum-ii');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'combination-sum-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('combination-sum-2', 'combination-sum-ii')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('combination-sum-ii');

-- --- Merge Group: subsets-2 ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'subsets-2', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('subsets-2', 'subsets-ii')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('subsets-ii');

-- Revision History
UPDATE public.revision_history
SET question_id = 'subsets-2'
WHERE question_id IN ('subsets-ii');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'subsets-2',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('subsets-2', 'subsets-ii')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('subsets-ii');

-- --- Merge Group: next-greater-element ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'next-greater-element', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('next-greater-element', 'next-greater-element-i')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('next-greater-element-i');

-- Revision History
UPDATE public.revision_history
SET question_id = 'next-greater-element'
WHERE question_id IN ('next-greater-element-i');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'next-greater-element',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('next-greater-element', 'next-greater-element-i')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('next-greater-element-i');

-- --- Merge Group: maximal-rectangle ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'maximal-rectangle', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('maximal-rectangle', 'remove-k-digits')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('remove-k-digits');

-- Revision History
UPDATE public.revision_history
SET question_id = 'maximal-rectangle'
WHERE question_id IN ('remove-k-digits');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'maximal-rectangle',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('maximal-rectangle', 'remove-k-digits')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('remove-k-digits');

-- --- Merge Group: lfu-cache ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'lfu-cache', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('lfu-cache', 'online-stock-span')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('online-stock-span');

-- Revision History
UPDATE public.revision_history
SET question_id = 'lfu-cache'
WHERE question_id IN ('online-stock-span');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'lfu-cache',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('lfu-cache', 'online-stock-span')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('online-stock-span');

-- --- Merge Group: binary-tree-inorder-traversal ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'binary-tree-inorder-traversal', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('binary-tree-inorder-traversal', 'lc-94')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('lc-94');

-- Revision History
UPDATE public.revision_history
SET question_id = 'binary-tree-inorder-traversal'
WHERE question_id IN ('lc-94');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'binary-tree-inorder-traversal',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('binary-tree-inorder-traversal', 'lc-94')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('lc-94');

-- --- Merge Group: balanced-binary-tree ---
-- Bookmarks
INSERT INTO public.bookmarks (user_id, question_id, created_at)
SELECT DISTINCT user_id, 'balanced-binary-tree', MIN(created_at)
FROM public.bookmarks
WHERE question_id IN ('balanced-binary-tree', 'binary-tree-zigzag-traversal')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  created_at = LEAST(public.bookmarks.created_at, EXCLUDED.created_at);

DELETE FROM public.bookmarks WHERE question_id IN ('binary-tree-zigzag-traversal');

-- Revision History
UPDATE public.revision_history
SET question_id = 'balanced-binary-tree'
WHERE question_id IN ('binary-tree-zigzag-traversal');

-- User Progress
INSERT INTO public.user_progress (
  user_id,
  question_id,
  status,
  attempts,
  last_attempt_at,
  solved_at,
  revised_at,
  mastered_at,
  next_revision_at,
  time_spent_min,
  notes,
  updated_at
)
SELECT
  user_id,
  'balanced-binary-tree',
  CASE
    WHEN 'mastered' = ANY(ARRAY_AGG(status)) THEN 'mastered'
    WHEN 'revised' = ANY(ARRAY_AGG(status)) THEN 'revised'
    WHEN 'solved' = ANY(ARRAY_AGG(status)) THEN 'solved'
    WHEN 'in_progress' = ANY(ARRAY_AGG(status)) THEN 'in_progress'
    WHEN 'attempted' = ANY(ARRAY_AGG(status)) THEN 'attempted'
    ELSE 'not_started'
  END,
  SUM(attempts),
  MAX(last_attempt_at),
  MIN(solved_at),
  MAX(revised_at),
  MAX(mastered_at),
  MIN(next_revision_at),
  SUM(time_spent_min),
  STRING_AGG(NULLIF(TRIM(notes), ''), E'\n') FILTER (WHERE NULLIF(TRIM(notes), '') IS NOT NULL),
  MAX(updated_at)
FROM public.user_progress
WHERE question_id IN ('balanced-binary-tree', 'binary-tree-zigzag-traversal')
GROUP BY user_id
ON CONFLICT (user_id, question_id) DO UPDATE SET
  status = EXCLUDED.status,
  attempts = EXCLUDED.attempts,
  last_attempt_at = COALESCE(EXCLUDED.last_attempt_at, public.user_progress.last_attempt_at),
  solved_at = COALESCE(EXCLUDED.solved_at, public.user_progress.solved_at),
  revised_at = COALESCE(EXCLUDED.revised_at, public.user_progress.revised_at),
  mastered_at = COALESCE(EXCLUDED.mastered_at, public.user_progress.mastered_at),
  next_revision_at = COALESCE(EXCLUDED.next_revision_at, public.user_progress.next_revision_at),
  time_spent_min = EXCLUDED.time_spent_min,
  notes = EXCLUDED.notes,
  updated_at = EXCLUDED.updated_at;

DELETE FROM public.user_progress WHERE question_id IN ('binary-tree-zigzag-traversal');

COMMIT;
