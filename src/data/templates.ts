import type { TemplateCard } from '@/types'
import { TEMPLATE_CODE } from '@/data/templateCode'

const GREEN = '#10794b'
const SKY = '#1a6fb0'
const VIOLET = '#7b3ff2'
const AMBER = '#b45309'
const PINK = '#be1e63'
const RED = '#c23b2b'

const BASE: TemplateCard[] = [
  {
    title: 'Two pointers: one input, opposite ends',
    icon: 'fa-solid fa-arrows-left-right',
    accent: GREEN,
    description:
      'Classic pattern for problems like valid palindrome, container with most water, two sum II (sorted).',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Arrays / Vectors with index access',
          'Two integer pointers (left = 0, right = n-1)',
          'While loop with left < right condition',
          'Conditional move: left++ or right-- or both',
          'Return indices or computed result',
        ],
      },
      {
        heading: 'From blank file notes',
        items: [
          'Use <code>len(arr)</code> / <code>arr.len()</code> / <code>arr.Length</code>',
          'Python/TS: very straightforward',
          'Rust: indices are <code>usize</code>, careful with borrowing',
          'C#: use <code>int[]</code> or <code>List&lt;int&gt;</code>',
        ],
      },
    ],
  },
  {
    title: 'Two pointers: two inputs, advance both',
    icon: 'fa-solid fa-arrows-left-right',
    accent: GREEN,
    description:
      'Used when you have two separate sorted arrays or linked lists and need to merge or compare them.',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Two separate pointers (i=0, j=0)',
          'While i < len(A) and j < len(B)',
          'Compare A[i] and B[j], advance the smaller one',
          'Handle remaining elements after one list ends',
          'Often used in merge sorted arrays / lists',
        ],
      },
    ],
  },
  {
    title: 'Sliding window',
    icon: 'fa-solid fa-window-maximize',
    accent: SKY,
    description:
      'Fixed or variable size window over array/string. Classic for min window substring, longest substring without repeating chars, max sum subarray of size k.',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Left and right pointers (window [left, right])',
          'Expand right pointer (add element)',
          'Shrink left pointer when condition violated',
          'Track window state (hashmap count, sum, set)',
          'Update answer at each valid window',
        ],
      },
      {
        heading: 'Language tips',
        items: [
          'Python: use <code>collections.Counter</code> or dict',
          'Rust: <code>HashMap</code> + careful mutable borrow',
          'C#: <code>Dictionary&lt;char,int&gt;</code>',
          'All: O(n) time with single pass',
        ],
      },
    ],
  },
  {
    title: 'Build a prefix sum',
    icon: 'fa-solid fa-calculator',
    accent: SKY,
    description: 'Precompute cumulative sums so range sum queries become O(1).',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Create new array <code>prefix[0] = 0</code>, <code>prefix[i] = prefix[i-1] + arr[i-1]</code>',
          'Range sum = prefix[right+1] - prefix[left]',
          'Handle 0-based vs 1-based indexing carefully',
          'Often combined with two pointers or sliding window',
        ],
      },
    ],
  },
  {
    title: 'Efficient string building',
    icon: 'fa-solid fa-font',
    accent: SKY,
    description:
      'Never concatenate strings in a loop with + in Python/C#. Use StringBuilder / join / String::new + push_str.',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          "Python: <code>''.join(list_of_strings)</code>",
          'C#: <code>StringBuilder</code>',
          "TypeScript: array + <code>.join('')</code>",
          'Rust: <code>String::new()</code> + <code>push_str()</code>',
        ],
      },
    ],
  },
  {
    title: 'Linked list: fast and slow pointer',
    icon: 'fa-solid fa-link',
    accent: VIOLET,
    description: "Floyd's cycle detection, find middle of linked list, etc.",
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Define <code>ListNode</code> class/struct with <code>val</code> and <code>next</code>',
          'Two pointers: slow moves 1 step, fast moves 2 steps',
          'While fast and fast.next exist',
          'Cycle detection when fast == slow',
        ],
      },
    ],
  },
  {
    title: 'Reversing a linked list',
    icon: 'fa-solid fa-link',
    accent: VIOLET,
    description: 'Iterative or recursive reversal. Very common interview question.',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Iterative: three pointers (prev, curr, next)',
          'Recursive: reverse rest then fix pointers',
          'Dummy node often helps',
          'Update head at the end',
        ],
      },
    ],
  },
  {
    title: 'Find number of subarrays that fit an exact criteria',
    icon: 'fa-solid fa-chart-bar',
    accent: SKY,
    description:
      'Often solved with prefix sum + hashmap (count of prefix sums seen so far).',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Prefix sum array or running sum',
          'HashMap&lt;sum, count&gt; to store frequency of prefix sums',
          'For each index, check if (current_sum - k) exists in map',
          'Update answer and map in one pass',
        ],
      },
    ],
  },
  {
    title: 'Monotonic increasing stack',
    icon: 'fa-solid fa-layer-group',
    accent: AMBER,
    description:
      'Used for next greater element, daily temperatures, remove duplicate letters, etc.',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Stack (vector / deque / list)',
          'While stack not empty and top < current → pop',
          'Push current index/value',
          'Often store indices, not values',
        ],
      },
    ],
  },
  {
    title: 'Binary tree: DFS (recursive) • DFS (iterative) • BFS',
    icon: 'fa-solid fa-tree',
    accent: VIOLET,
    columns: [
      {
        heading: 'DFS Recursive',
        items: [
          'Define TreeNode (val, left, right)',
          'Base case: if node is None/null',
          'Visit node → recurse left → recurse right',
          'Return value or collect in list',
        ],
      },
      {
        heading: 'DFS Iterative',
        items: [
          'Use explicit Stack',
          'Push root, while stack not empty pop & visit',
          'Push right then left (for pre-order)',
        ],
      },
      {
        heading: 'BFS',
        items: [
          'Use Queue (deque)',
          'Level order traversal',
          'Often track level size for level-by-level processing',
        ],
      },
    ],
    note: 'All three require a TreeNode class/struct. Rust uses <code>Option&lt;Box&lt;TreeNode&gt;&gt;</code> or <code>Rc&lt;RefCell&gt;</code> for mutability.',
  },
  {
    title: 'Graph: DFS (recursive/iterative) • BFS',
    icon: 'fa-solid fa-project-diagram',
    accent: VIOLET,
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Represent graph as adj list: <code>Vec&lt;Vec&lt;i32&gt;&gt;</code> / <code>dict[list]</code> / <code>Dictionary&lt;int,List&lt;int&gt;&gt;</code>',
          'Visited HashSet to prevent revisiting',
          'DFS: recursion or explicit stack',
          'BFS: queue + level order',
        ],
      },
      {
        heading: 'From blank file',
        items: [
          'You must know how to build the adj list from edges input. In Rust use <code>vec![vec![]]</code> with proper sizing.',
        ],
      },
    ],
  },
  {
    title: 'Find top k elements with heap',
    icon: 'fa-solid fa-layer-group',
    accent: AMBER,
    description:
      'Use min-heap of size k (or max-heap) to keep track of top k largest/smallest elements in O(n log k).',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Priority Queue / Heap data structure',
          'Python: <code>heapq</code> (min-heap by default, use negative for max)',
          'C#: <code>PriorityQueue&lt;TElement, TPriority&gt;</code> (.NET 6+)',
          'Rust: <code>BinaryHeap</code> (max-heap by default)',
          'TypeScript: no built-in heap — use array + manual or library',
        ],
      },
    ],
  },
  {
    title: 'Binary search + variants (leftmost / rightmost / predicate)',
    icon: 'fa-solid fa-search',
    accent: GREEN,
    columns: [
      {
        heading: 'Core Binary Search',
        items: [
          'Sorted array required',
          'low = 0, high = n-1',
          'while low <= high',
          'mid = low + (high - low) / 2 ← prevents overflow',
          'if arr[mid] == target → found',
          'else if arr[mid] < target → low = mid + 1',
          'else high = mid - 1',
        ],
      },
      {
        heading: 'Leftmost / Rightmost insertion point',
        items: [
          'When duplicates exist',
          'Leftmost: move high = mid when equal',
          'Rightmost: move low = mid + 1 when equal',
          '"Binary search for an answer": use predicate function (e.g. can I achieve X with this mid?)',
        ],
      },
    ],
  },
  {
    title: 'Backtracking',
    icon: 'fa-solid fa-project-diagram',
    accent: PINK,
    description:
      'Used for permutations, combinations, subsets, N-Queens, Sudoku solver, word search, etc.',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Recursive function with current path/state',
          'For loop over possible choices at current position',
          'Add choice → recurse → remove choice (backtrack)',
          'Base case when solution is complete or invalid',
          'Often use a "used" boolean array or set',
        ],
      },
    ],
  },
  {
    title:
      'Dynamic Programming: Top-down (memoization) & Bottom-up (tabulation)',
    icon: 'fa-solid fa-memory',
    accent: PINK,
    columns: [
      {
        heading: 'Top-down (Memoization)',
        items: [
          'Write recursive solution first',
          'Add memo dictionary / array',
          'Check if state already computed before recursing',
          'Python: <code>@cache</code> or <code>lru_cache</code>',
          'Rust: use <code>HashMap</code> or array',
        ],
      },
      {
        heading: 'Bottom-up (Tabulation)',
        items: [
          'Identify base cases (dp[0], dp[1] ...)',
          'Build 1D or 2D dp table iteratively',
          'dp[i] = f(dp[i-1], dp[i-2] ...) from smaller subproblems',
          'Final answer usually dp[n] or dp[n][m]',
        ],
      },
    ],
  },
  {
    title: 'Build a trie (prefix tree)',
    icon: 'fa-solid fa-sitemap',
    accent: AMBER,
    description: 'Used for word search, autocomplete, replace words, etc.',
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Define TrieNode with children (HashMap&lt;char, TrieNode&gt; or array[26]) and isEnd bool',
          'Insert method: traverse/create nodes for each char',
          'Search / startsWith methods',
          'In Rust: use <code>Box&lt;TrieNode&gt;</code> or <code>HashMap</code>',
        ],
      },
    ],
  },
  {
    title: "Dijkstra's shortest path",
    icon: 'fa-solid fa-route',
    accent: RED,
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'Graph as weighted adj list: <code>Vec&lt;Vec&lt;(usize, i32)&gt;&gt;</code>',
          'Priority queue (dist, node) — min-heap',
          'dist array initialized to infinity (i32::MAX or f64::INFINITY)',
          'Relax edges: if new_dist < dist[v] → update and push to pq',
          'Visited set optional (with decrease-key simulation)',
        ],
      },
    ],
  },
  {
    title: 'Union Find (Disjoint Set Union)',
    icon: 'fa-solid fa-object-group',
    accent: RED,
    description:
      "Extremely useful for connected components, redundant connections, Kruskal's MST, etc.",
    columns: [
      {
        heading: 'Required techniques',
        items: [
          'parent array of size n, rank or size array',
          'find(x): path compression (recursive or iterative)',
          'union(x, y): union by rank or size',
          'isConnected / same component check',
          'In Rust/C#: implement as struct with methods',
        ],
      },
    ],
  },
]

export const TEMPLATES: TemplateCard[] = BASE.map((t) => ({
  ...t,
  code: TEMPLATE_CODE[t.title],
}))
