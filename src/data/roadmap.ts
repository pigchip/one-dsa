import type { RoadmapPhase, ProblemList } from '@/types/study'
import { PATTERN_BY_ID } from './patterns'
import { SYNTAX_CATEGORIES } from './syntaxTable'
import { INPUT_PATTERNS } from './inputPatterns'
import { TEMPLATES } from './templates'

const GREEN = '#0e7c7b'
const SKY = '#1a6fb0'
const VIOLET = '#7b3ff2'
const AMBER = '#b45309'
const PINK = '#be1e63'
const RED = '#c23b2b'

/** Display metadata + canonical master-list URLs for the three problem sets. */
export const PROBLEM_LIST_META: Record<
  ProblemList,
  { label: string; short: string; url: string; color: string }
> = {
  top150: {
    label: 'LeetCode Top Interview 150',
    short: 'Top 150',
    url: 'https://leetcode.com/studyplan/top-interview-150/',
    color: '#b45309',
  },
  blind75: {
    label: 'Blind 75',
    short: 'Blind 75',
    url: 'https://neetcode.io/practice?tab=blind75',
    color: '#1a6fb0',
  },
  neetcode150: {
    label: 'NeetCode 150',
    short: 'NeetCode 150',
    url: 'https://neetcode.io/practice?tab=neetcode150',
    color: '#0e7c7b',
  },
}

/**
 * The Python-first learning path. Each phase pulls together just-enough syntax
 * and input handling, one template family, the DSA patterns that use it, and the
 * memorization ("write on paper") targets. Phases are ordered so every stage
 * builds on the knowledge of the ones before it.
 */
export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'setup-fluency',
    order: 1,
    title: 'Setup & Python fluency',
    subtitle: 'The alphabet before the sentences',
    icon: 'fa-solid fa-seedling',
    accent: GREEN,
    goal: 'Read any competitive-style input and reach for the right built-in collection (list, dict, set) without thinking.',
    syntaxTopics: ['Core language constructs', 'Collections', 'Iteration & access'],
    inputSnippets: [
      '1. Read single int',
      '2. Read array (n + line)',
      '3. Read matrix',
      '4. Read until EOF / multiple tests',
      '5. Read from file (local test)',
    ],
    templates: ['Efficient string building'],
    patternIds: ['string-building'],
    writeOnPaper: [
      'The five input-reading snippets (int, array, matrix, EOF, file)',
      'list / dict / set creation and core operations',
      'The efficient string-building template',
    ],
    problems: [
      { id: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 217, title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', lists: ['blind75', 'neetcode150'] },
      { id: 242, title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 383, title: 'Ransom Note', slug: 'ransom-note', difficulty: 'Easy', lists: ['top150'] },
      { id: 13, title: 'Roman to Integer', slug: 'roman-to-integer', difficulty: 'Easy', lists: ['top150'] },
    ],
  },
  {
    id: 'two-pointers',
    order: 2,
    title: 'Two pointers',
    subtitle: 'Linear scans without extra space',
    icon: 'fa-solid fa-arrows-left-right',
    accent: GREEN,
    goal: 'Recognize sorted / symmetric / two-sequence problems and solve them in O(1) extra space with converging or parallel indices.',
    syntaxTopics: ['Iteration & access', 'Conversions & numbers'],
    inputSnippets: ['2. Read array (n + line)'],
    templates: [
      'Two pointers: one input, opposite ends',
      'Two pointers: two inputs, advance both',
    ],
    patternIds: ['two-pointers-opposite', 'two-pointers-parallel'],
    writeOnPaper: [
      'The opposite-ends template (left/right converging loop)',
      'The two-input parallel-merge template',
    ],
    problems: [
      { id: 125, title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 167, title: 'Two Sum II - Input Array Is Sorted', slug: 'two-sum-ii-input-array-is-sorted', difficulty: 'Medium', lists: ['top150', 'neetcode150'] },
      { id: 88, title: 'Merge Sorted Array', slug: 'merge-sorted-array', difficulty: 'Easy', lists: ['top150'] },
      { id: 11, title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 15, title: '3Sum', slug: '3sum', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
    ],
  },
  {
    id: 'windows-and-sums',
    order: 3,
    title: 'Windows & running sums',
    subtitle: 'Turn nested loops into one pass',
    icon: 'fa-solid fa-window-maximize',
    accent: SKY,
    goal: 'Collapse O(n^2) subarray/substring scans into O(n) using a sliding window, prefix sums, and prefix-count hashmaps.',
    syntaxTopics: ['Collections', 'Hashing / Counter'],
    inputSnippets: ['2. Read array (n + line)'],
    templates: ['Sliding window', 'Build a prefix sum', 'Find number of subarrays that fit an exact criteria'],
    patternIds: ['sliding-window', 'prefix-sum', 'subarray-count-hashmap'],
    writeOnPaper: [
      'The variable-size sliding-window template (expand / shrink)',
      'The prefix-sum build and range-query formula',
      'The prefix-count hashmap pattern for exact-criteria subarrays',
    ],
    problems: [
      { id: 121, title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 3, title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 424, title: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', difficulty: 'Medium', lists: ['blind75', 'neetcode150'] },
      { id: 209, title: 'Minimum Size Subarray Sum', slug: 'minimum-size-subarray-sum', difficulty: 'Medium', lists: ['top150'] },
      { id: 238, title: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 560, title: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k', difficulty: 'Medium', lists: ['neetcode150'] },
    ],
  },
  {
    id: 'linked-lists-stacks',
    order: 4,
    title: 'Linked lists & stacks',
    subtitle: 'Pointers and last-in-first-out',
    icon: 'fa-solid fa-link',
    accent: AMBER,
    goal: 'Manipulate linked lists in place with fast/slow pointers and reversal, and use a monotonic stack for next-greater/smaller problems.',
    syntaxTopics: ['Core language constructs', 'Collections'],
    inputSnippets: [],
    templates: [
      'Linked list: fast and slow pointer',
      'Reversing a linked list',
      'Monotonic increasing stack',
    ],
    patternIds: ['fast-slow-pointers', 'reverse-linked-list', 'monotonic-stack'],
    writeOnPaper: [
      'The in-place linked-list reversal template',
      'The fast/slow pointer cycle-detection loop',
      'The monotonic-stack skeleton (when to pop)',
    ],
    problems: [
      { id: 141, title: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 206, title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy', lists: ['blind75', 'neetcode150'] },
      { id: 21, title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 20, title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 155, title: 'Min Stack', slug: 'min-stack', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 739, title: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'Medium', lists: ['neetcode150'] },
    ],
  },
  {
    id: 'searching-heaps',
    order: 5,
    title: 'Searching & heaps',
    subtitle: 'Halve the space, keep the best k',
    icon: 'fa-solid fa-magnifying-glass',
    accent: VIOLET,
    goal: 'Write binary search and its leftmost/rightmost/predicate variants from memory, and use a heap to keep the top-k elements.',
    syntaxTopics: ['Binary search built-ins', 'Collections'],
    inputSnippets: ['2. Read array (n + line)'],
    templates: [
      'Binary search + variants (leftmost / rightmost / predicate)',
      'Find top k elements with heap',
    ],
    patternIds: ['binary-search', 'top-k-heap'],
    writeOnPaper: [
      'The predicate-based binary-search template',
      'The leftmost vs rightmost boundary adjustments',
      'The heapq top-k pattern',
    ],
    problems: [
      { id: 704, title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', lists: ['neetcode150'] },
      { id: 35, title: 'Search Insert Position', slug: 'search-insert-position', difficulty: 'Easy', lists: ['top150'] },
      { id: 153, title: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 33, title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 875, title: 'Koko Eating Bananas', slug: 'koko-eating-bananas', difficulty: 'Medium', lists: ['neetcode150'] },
      { id: 215, title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 347, title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
    ],
  },
  {
    id: 'trees-tries',
    order: 6,
    title: 'Trees & tries',
    subtitle: 'Recursion over structure',
    icon: 'fa-solid fa-tree',
    accent: GREEN,
    goal: 'Traverse binary trees three ways (recursive DFS, iterative DFS, BFS) and build a trie for prefix queries.',
    syntaxTopics: ['Core language constructs', 'Collections'],
    inputSnippets: [],
    templates: ['Binary tree: DFS (recursive) • DFS (iterative) • BFS', 'Build a trie (prefix tree)'],
    patternIds: ['tree-traversal', 'trie'],
    writeOnPaper: [
      'Recursive + iterative DFS and BFS tree templates',
      'The trie node structure and insert/search',
    ],
    problems: [
      { id: 104, title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 100, title: 'Same Tree', slug: 'same-tree', difficulty: 'Easy', lists: ['top150', 'neetcode150'] },
      { id: 226, title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', lists: ['blind75', 'neetcode150'] },
      { id: 102, title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 98, title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 208, title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 211, title: 'Design Add and Search Words Data Structure', slug: 'design-add-and-search-words-data-structure', difficulty: 'Medium', lists: ['top150', 'neetcode150'] },
    ],
  },
  {
    id: 'graphs',
    order: 7,
    title: 'Graphs',
    subtitle: 'Connectivity, components & shortest paths',
    icon: 'fa-solid fa-diagram-project',
    accent: PINK,
    goal: 'Traverse graphs with DFS/BFS, group connected components with union-find, and compute weighted shortest paths with Dijkstra.',
    syntaxTopics: ['Collections', 'Hashing / Counter'],
    inputSnippets: ['3. Read matrix'],
    templates: [
      'Graph: DFS (recursive/iterative) • BFS',
      'Union Find (Disjoint Set Union)',
      "Dijkstra's shortest path",
    ],
    patternIds: ['graph-traversal', 'union-find', 'dijkstra'],
    writeOnPaper: [
      'The graph DFS/BFS templates with a visited set',
      'Union-find with path compression and union by rank',
      "Dijkstra's heap-based main loop",
    ],
    problems: [
      { id: 200, title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 133, title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'Medium', lists: ['top150', 'neetcode150'] },
      { id: 207, title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', difficulty: 'Medium', lists: ['neetcode150'] },
      { id: 743, title: 'Network Delay Time', slug: 'network-delay-time', difficulty: 'Medium', lists: ['neetcode150'] },
    ],
  },
  {
    id: 'recursion-dp',
    order: 8,
    title: 'Recursion & dynamic programming',
    subtitle: 'Search everything, then remember it',
    icon: 'fa-solid fa-layer-group',
    accent: RED,
    goal: 'Enumerate solution spaces with backtracking and optimize overlapping subproblems with memoized / bottom-up DP.',
    syntaxTopics: ['Core language constructs', 'Common idioms'],
    inputSnippets: [],
    templates: ['Backtracking'],
    patternIds: ['backtracking', 'dynamic-programming'],
    writeOnPaper: [
      'The backtracking choose / explore / un-choose template',
      'The top-down memoization and bottom-up DP table transitions',
    ],
    problems: [
      { id: 78, title: 'Subsets', slug: 'subsets', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 39, title: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 46, title: 'Permutations', slug: 'permutations', difficulty: 'Medium', lists: ['top150', 'neetcode150'] },
      { id: 79, title: 'Word Search', slug: 'word-search', difficulty: 'Medium', lists: ['top150', 'neetcode150'] },
      { id: 70, title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 198, title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 322, title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
      { id: 300, title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', lists: ['top150', 'blind75', 'neetcode150'] },
    ],
  },
]

// --- Dev-time integrity guard -------------------------------------------------
// Fail loudly if a phase references content that no longer exists, so phases can
// never silently drop syntax, input, template, or pattern content.
if (import.meta.env.DEV) {
  const syntaxTitles = new Set(SYNTAX_CATEGORIES.map((c) => c.title))
  const pythonInput = INPUT_PATTERNS.find((c) => c.language === 'python')
  const inputLabels = new Set((pythonInput?.snippets ?? []).map((s) => s.label))
  const templateTitles = new Set(TEMPLATES.map((t) => t.title))

  const problems: string[] = []
  for (const phase of ROADMAP_PHASES) {
    for (const t of phase.syntaxTopics)
      if (!syntaxTitles.has(t)) problems.push(`${phase.id}: unknown syntax topic "${t}"`)
    for (const l of phase.inputSnippets)
      if (!inputLabels.has(l)) problems.push(`${phase.id}: unknown input snippet "${l}"`)
    for (const tt of phase.templates)
      if (!templateTitles.has(tt)) problems.push(`${phase.id}: unknown template "${tt}"`)
    for (const id of phase.patternIds)
      if (!PATTERN_BY_ID[id]) problems.push(`${phase.id}: unknown pattern id "${id}"`)
  }
  if (problems.length > 0) {
    throw new Error(`[roadmap] broken content references:\n  ${problems.join('\n  ')}`)
  }
}
