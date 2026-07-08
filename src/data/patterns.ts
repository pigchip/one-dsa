import type { Pattern } from '@/types/study'

const GREEN = '#10794b'
const SKY = '#1a6fb0'
const VIOLET = '#7b3ff2'
const AMBER = '#b45309'
const PINK = '#be1e63'
const RED = '#c23b2b'

/**
 * Master-level, Python-first catalog of interview DSA patterns.
 * Each entry is a complete mental model: recognition triggers, complexity,
 * the canonical template to memorize, pitfalls, edge cases, and links.
 */
export const PATTERNS: Pattern[] = [
  {
    id: 'two-pointers-opposite',
    title: 'Two pointers - opposite ends',
    category: 'Arrays & strings',
    icon: 'fa-solid fa-arrows-left-right',
    accent: GREEN,
    difficulty: 'foundational',
    summary:
      'Walk two indices inward from both ends of a sorted/symmetric array to find a pair or verify symmetry in one pass.',
    triggers: [
      'Input array is sorted and you need a pair meeting a numeric condition',
      'Palindrome / symmetry check on a string or array',
      '"Container / area / two-sum on sorted" style problems',
      'You want O(1) space instead of a hash set',
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    keyIdeas: [
      'left = 0, right = n - 1',
      'Loop while left < right',
      'Compute a value from arr[left] and arr[right]',
      'Move the pointer that can improve the result (left++, right--, or both)',
      'The sortedness is what makes each move provably correct',
    ],
    pitfalls: [
      'Using this on an UNsorted array when the correctness relies on order',
      'Off-by-one: use left < right, not left <= right, for pair problems',
      'Forgetting to move at least one pointer -> infinite loop',
    ],
    edgeCases: [
      'Empty or single-element input',
      'All duplicate values',
      'No valid pair exists (define the sentinel return)',
    ],
    prerequisites: [],
    related: ['two-pointers-parallel', 'binary-search', 'sliding-window'],
    prompt: 'two_sum(nums, target) on a SORTED array -> return the pair of indices',
    template: `def two_sum(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        if s < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]`,
    workedExample: {
      problem: 'LeetCode 125 - Valid Palindrome',
      approach:
        'Skip non-alphanumeric characters and compare lowercased characters from both ends inward. Mismatch means not a palindrome.',
      code: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
    },
    recognitionCues: [
      'Return two numbers in a sorted array that add up to target',
      'Check whether a string reads the same forwards and backwards',
      'Max water a container can hold given heights',
    ],
  },
  {
    id: 'two-pointers-parallel',
    title: 'Two pointers - two inputs',
    category: 'Arrays & strings',
    icon: 'fa-solid fa-arrows-left-right',
    accent: GREEN,
    difficulty: 'foundational',
    summary:
      'Advance one pointer per input list to merge or compare two sequences in linear time.',
    triggers: [
      'Two sorted arrays / linked lists to merge or intersect',
      'Comparing subsequence against sequence',
      'You need a stable, order-preserving combine',
    ],
    complexity: { time: 'O(n + m)', space: 'O(n + m)', note: 'output size' },
    keyIdeas: [
      'i = 0, j = 0 into lists a and b',
      'While both in range, compare a[i] and b[j], take/advance the smaller',
      'Drain the remaining tail of whichever list is left',
    ],
    pitfalls: [
      'Forgetting to append the leftover tail after the main loop',
      'Using < vs <= changes stability for equal elements',
    ],
    edgeCases: ['One list empty', 'Equal elements across both lists', 'Very different lengths'],
    prerequisites: ['two-pointers-opposite'],
    related: ['two-pointers-opposite', 'reverse-linked-list'],
    prompt: 'merge(a, b) two sorted lists into one sorted list',
    template: `def merge(a, b):
    i = j = 0
    res = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            res.append(a[i]); i += 1
        else:
            res.append(b[j]); j += 1
    res.extend(a[i:])
    res.extend(b[j:])
    return res`,
    recognitionCues: [
      'Merge two sorted arrays into one sorted array',
      'Find the intersection of two sorted lists',
      'Is one string a subsequence of another',
    ],
  },
  {
    id: 'sliding-window',
    title: 'Sliding window',
    category: 'Arrays & strings',
    icon: 'fa-solid fa-window-maximize',
    accent: SKY,
    difficulty: 'core',
    summary:
      'Maintain a contiguous window [left, right] and adjust its bounds to satisfy a constraint while scanning once.',
    triggers: [
      'Longest / shortest / count of a CONTIGUOUS subarray or substring',
      'A constraint like "at most k distinct", "sum >= target", "no repeats"',
      'Brute force is O(n^2) over all subarrays',
    ],
    complexity: { time: 'O(n)', space: 'O(k)', note: 'window state' },
    keyIdeas: [
      'Expand right one step at a time, updating window state',
      'While the window is invalid, shrink from left',
      'Record the answer whenever the window is valid',
      'State is often a Counter/dict, a running sum, or a set',
    ],
    pitfalls: [
      'Updating the answer at the wrong moment (before/after shrinking)',
      'Not removing left element from the state when shrinking',
      'Confusing fixed-size vs variable-size window logic',
    ],
    edgeCases: ['Empty string', 'Window never valid', 'Whole array is the answer'],
    prerequisites: ['two-pointers-opposite'],
    related: ['two-pointers-opposite', 'prefix-sum', 'subarray-count-hashmap'],
    prompt: 'longest_unique(s) -> length of longest substring without repeating chars',
    template: `def longest_unique(s):
    seen = {}
    left = best = 0
    for right, c in enumerate(s):
        if c in seen and seen[c] >= left:
            left = seen[c] + 1
        seen[c] = right
        best = max(best, right - left + 1)
    return best`,
    workedExample: {
      problem: 'LeetCode 209 - Minimum Size Subarray Sum',
      approach:
        'Grow the window with right, adding to a running sum. Whenever sum >= target, record the length and shrink from left to find the minimum.',
      code: `def min_subarray_len(target, nums):
    left = total = 0
    best = float('inf')
    for right, x in enumerate(nums):
        total += x
        while total >= target:
            best = min(best, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if best == float('inf') else best`,
    },
    recognitionCues: [
      'Longest substring without repeating characters',
      'Smallest subarray with sum at least target',
      'Longest substring with at most k distinct characters',
    ],
  },
  {
    id: 'prefix-sum',
    title: 'Prefix sum',
    category: 'Arrays & strings',
    icon: 'fa-solid fa-calculator',
    accent: SKY,
    difficulty: 'core',
    summary:
      'Precompute cumulative sums so any range sum becomes an O(1) subtraction.',
    triggers: [
      'Many range-sum queries over a static array',
      'Need running totals or "sum of subarray [l, r]" quickly',
      'Often a building block under a hashmap trick',
    ],
    complexity: { time: 'O(n) build, O(1) query', space: 'O(n)' },
    keyIdeas: [
      'prefix[0] = 0, prefix[i+1] = prefix[i] + arr[i]',
      'Range sum [l, r] inclusive = prefix[r+1] - prefix[l]',
      'The extra leading 0 avoids special-casing l = 0',
    ],
    pitfalls: [
      'Off-by-one between 0-based array and 1-based prefix',
      'Mutating the array after building the prefix (it goes stale)',
    ],
    edgeCases: ['Empty array', 'Single element', 'Negative numbers (still fine)'],
    prerequisites: [],
    related: ['subarray-count-hashmap', 'sliding-window'],
    prompt: 'build_prefix(arr) and range_sum(prefix, l, r) inclusive',
    template: `def build_prefix(arr):
    prefix = [0] * (len(arr) + 1)
    for i, x in enumerate(arr):
        prefix[i + 1] = prefix[i] + x
    return prefix

def range_sum(prefix, l, r):
    return prefix[r + 1] - prefix[l]`,
    recognitionCues: [
      'Answer many "sum between indices l and r" queries fast',
      'Running average / cumulative total',
      'Find equilibrium / pivot index',
    ],
  },
  {
    id: 'string-building',
    title: 'Efficient string building',
    category: 'Arrays & strings',
    icon: 'fa-solid fa-font',
    accent: SKY,
    difficulty: 'foundational',
    summary:
      'Accumulate pieces in a list and join once, instead of quadratic string concatenation in a loop.',
    triggers: [
      'Building a string inside a loop',
      'You notice repeated s += ... concatenation',
    ],
    complexity: { time: 'O(n)', space: 'O(n)', note: 'vs O(n^2) naive concat' },
    keyIdeas: [
      "Append each piece to a list",
      "Call ''.join(parts) exactly once at the end",
      'Strings are immutable in Python, so += rebuilds every time',
    ],
    pitfalls: [
      'Using s += piece in a loop (O(n^2))',
      'Joining non-string items without str() conversion',
    ],
    edgeCases: ['Empty result', 'Single piece', 'Unicode characters'],
    prerequisites: [],
    related: [],
    prompt: 'Build a string from n pieces without quadratic concatenation',
    template: `parts = []
for i in range(n):
    parts.append(str(i))
result = "".join(parts)`,
    recognitionCues: [
      'Construct a long output string piece by piece',
      'Encode / serialize a structure to text',
    ],
  },
  {
    id: 'fast-slow-pointers',
    title: 'Fast & slow pointers',
    category: 'Linked lists',
    icon: 'fa-solid fa-link',
    accent: VIOLET,
    difficulty: 'core',
    summary:
      "Move one pointer twice as fast as another to detect cycles or find the middle in O(1) space.",
    triggers: [
      'Detect a cycle in a linked list',
      'Find the middle node in one pass',
      'Find the start of a cycle / kth from end',
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    keyIdeas: [
      'slow = fast = head',
      'While fast and fast.next: slow one step, fast two steps',
      'slow is fast means a cycle exists',
      'When fast reaches the end, slow is at the middle',
    ],
    pitfalls: [
      'Checking fast alone instead of both fast and fast.next -> None error',
      'Using == on values instead of `is` on node identity for cycle checks',
    ],
    edgeCases: ['Empty list', 'Single node', 'Two nodes', 'No cycle'],
    prerequisites: [],
    related: ['reverse-linked-list'],
    prompt: 'has_cycle(head) -> True if the linked list contains a cycle',
    template: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    recognitionCues: [
      'Determine if a linked list loops back on itself',
      'Return the middle node of a linked list',
      'Find where a cycle begins',
    ],
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse a linked list',
    category: 'Linked lists',
    icon: 'fa-solid fa-link',
    accent: VIOLET,
    difficulty: 'core',
    summary:
      'Re-point each node backward using three pointers, turning the list around in one pass.',
    triggers: [
      'Reverse all or part of a linked list',
      'Reorder / rotate list problems',
      'Palindrome linked list (reverse second half)',
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    keyIdeas: [
      'prev = None, curr = head',
      'Save nxt = curr.next before rewiring',
      'curr.next = prev; then advance prev and curr',
      'Return prev as the new head',
    ],
    pitfalls: [
      'Losing the rest of the list by not saving nxt first',
      'Returning curr (None) instead of prev',
    ],
    edgeCases: ['Empty list', 'Single node', 'Reverse a sublist [m, n]'],
    prerequisites: [],
    related: ['fast-slow-pointers', 'two-pointers-parallel'],
    prompt: 'reverse(head) -> head of the reversed linked list',
    template: `def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    recognitionCues: [
      'Reverse a singly linked list',
      'Reverse nodes between positions m and n',
      'Check if a linked list is a palindrome',
    ],
  },
  {
    id: 'subarray-count-hashmap',
    title: 'Subarray count via hashmap',
    category: 'Hashing',
    icon: 'fa-solid fa-chart-bar',
    accent: SKY,
    difficulty: 'advanced',
    summary:
      'Combine a running prefix sum with a hashmap of previously-seen sums to count subarrays meeting an exact criterion in one pass.',
    triggers: [
      'Count subarrays whose sum equals exactly k',
      'Exact-criteria counting where sliding window fails (negatives allowed)',
      'Longest/number of subarrays with a target property',
    ],
    complexity: { time: 'O(n)', space: 'O(n)' },
    keyIdeas: [
      'Maintain running += x',
      'Answer needs a previous prefix equal to running - k',
      'seen maps prefix sum -> count, seeded with {0: 1}',
      'Add seen[running - k] to the count, then record running',
    ],
    pitfalls: [
      'Forgetting to seed seen with {0: 1} (misses subarrays from index 0)',
      'Recording running BEFORE querying (double counts current element)',
      'Reaching for a sliding window when values can be negative',
    ],
    edgeCases: ['All zeros with k = 0', 'Negative numbers', 'k larger than any sum'],
    prerequisites: ['prefix-sum'],
    related: ['prefix-sum', 'sliding-window'],
    prompt: 'subarray_sum(nums, k) -> number of subarrays summing to exactly k',
    template: `def subarray_sum(nums, k):
    count = running = 0
    seen = {0: 1}
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count`,
    recognitionCues: [
      'Count subarrays that sum to exactly k (with negatives allowed)',
      'Number of subarrays with equal 0s and 1s',
      'Continuous subarray sum divisible by k',
    ],
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic stack',
    category: 'Stacks',
    icon: 'fa-solid fa-layer-group',
    accent: AMBER,
    difficulty: 'advanced',
    summary:
      'Keep a stack whose values stay in sorted order, popping as you go to answer "next greater/smaller" in O(n).',
    triggers: [
      'Next greater / next smaller element',
      'Daily temperatures, stock span, largest rectangle',
      'You need the nearest element bigger/smaller on one side',
    ],
    complexity: { time: 'O(n)', space: 'O(n)' },
    keyIdeas: [
      'Store indices, not values, so you can write results by position',
      'While stack top violates monotonicity vs current, pop and resolve it',
      'Push the current index after resolving',
      'Increasing vs decreasing stack depends on greater vs smaller',
    ],
    pitfalls: [
      'Storing values when you actually need positions',
      'Wrong comparison direction (< vs >) for the variant',
      'Forgetting elements left on the stack have no answer',
    ],
    edgeCases: ['Strictly increasing input', 'Strictly decreasing input', 'All equal values'],
    prerequisites: [],
    related: ['binary-search'],
    prompt: 'next_greater(nums) -> for each i, the next element greater than nums[i] (else -1)',
    template: `def next_greater(nums):
    res = [-1] * len(nums)
    stack = []  # indices
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x
        stack.append(i)
    return res`,
    recognitionCues: [
      'For each day, how many days until a warmer temperature',
      'Next greater element to the right',
      'Largest rectangle in a histogram',
    ],
  },
  {
    id: 'tree-traversal',
    title: 'Tree traversal (DFS & BFS)',
    category: 'Trees',
    icon: 'fa-solid fa-tree',
    accent: VIOLET,
    difficulty: 'core',
    summary:
      'Visit every node via recursion/stack (DFS) or a queue (BFS) - the backbone of nearly all tree problems.',
    triggers: [
      'Any traversal, path, depth, or level-order question on a tree',
      'Aggregate a value over a tree (sum, max depth, counts)',
      'Level-by-level processing -> BFS',
    ],
    complexity: { time: 'O(n)', space: 'O(h) DFS / O(w) BFS' },
    keyIdeas: [
      'DFS recursive: base case on None, then visit left/node/right per order',
      'BFS: deque seeded with root, pop left, enqueue children',
      'Track level size when you need per-level grouping',
    ],
    pitfalls: [
      'Missing the None/empty base case',
      'Using a list.pop(0) as a queue (O(n)); use collections.deque',
      'Confusing pre/in/post order placement of the visit',
    ],
    edgeCases: ['Empty tree', 'Single node', 'Skewed (linked-list-like) tree'],
    prerequisites: [],
    related: ['graph-traversal', 'backtracking'],
    prompt: 'inorder(root, out) recursive DFS and bfs(root) level order',
    template: `def inorder(root, out):
    if not root:
        return
    inorder(root.left, out)
    out.append(root.val)
    inorder(root.right, out)

from collections import deque
def bfs(root):
    if not root:
        return []
    q, res = deque([root]), []
    while q:
        node = q.popleft()
        res.append(node.val)
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    return res`,
    recognitionCues: [
      'Return the level-order traversal of a binary tree',
      'Maximum depth of a binary tree',
      'In-order traversal of a BST',
    ],
  },
  {
    id: 'graph-traversal',
    title: 'Graph traversal (DFS & BFS)',
    category: 'Graphs',
    icon: 'fa-solid fa-diagram-project',
    accent: VIOLET,
    difficulty: 'core',
    summary:
      'Explore a graph with a visited set to avoid cycles; BFS gives shortest hops in an unweighted graph.',
    triggers: [
      'Connected components / flood fill / number of islands',
      'Shortest path in an UNweighted graph -> BFS',
      'Reachability, cycle detection, topological ordering',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    keyIdeas: [
      'Build adjacency list from edges first',
      'Use a visited set to never revisit a node',
      'DFS via recursion or explicit stack; BFS via deque',
      'Mark visited when enqueuing to avoid duplicates in the queue',
    ],
    pitfalls: [
      'Forgetting the visited set -> infinite loop on cycles',
      'Marking visited on dequeue instead of enqueue (duplicates)',
      'Not sizing / building the adjacency list correctly',
    ],
    edgeCases: ['Disconnected graph', 'Self-loops', 'Single node, no edges'],
    prerequisites: ['tree-traversal'],
    related: ['tree-traversal', 'dijkstra', 'union-find'],
    prompt: 'dfs(graph, node, seen) and bfs(graph, start) over an adjacency list',
    template: `from collections import deque

def dfs(graph, node, seen):
    seen.add(node)
    for nxt in graph[node]:
        if nxt not in seen:
            dfs(graph, nxt, seen)

def bfs(graph, start):
    seen = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                q.append(nxt)
    return seen`,
    recognitionCues: [
      'Count the number of islands in a grid',
      'Shortest number of steps in an unweighted maze',
      'Can you finish all courses given prerequisites',
    ],
  },
  {
    id: 'top-k-heap',
    title: 'Top-k with a heap',
    category: 'Heaps',
    icon: 'fa-solid fa-layer-group',
    accent: AMBER,
    difficulty: 'core',
    summary:
      'Keep a size-k min-heap to track the k largest elements in O(n log k) without sorting everything.',
    triggers: [
      'k largest / smallest / most frequent elements',
      'Streaming data where full sort is wasteful',
      '"Kth largest" style questions',
    ],
    complexity: { time: 'O(n log k)', space: 'O(k)' },
    keyIdeas: [
      'heapq is a MIN-heap; push each element',
      'When size exceeds k, pop the smallest',
      'What remains are the k largest (ascending)',
      'For k largest by value negate; for max-heap push -x',
    ],
    pitfalls: [
      'Forgetting heapq is a min-heap (need negation for max behavior)',
      'Sorting the whole array (O(n log n)) when a heap is enough',
      'Heap of tuples must have a comparable first element',
    ],
    edgeCases: ['k >= n', 'k = 0', 'Duplicate values', 'Ties in frequency'],
    prerequisites: [],
    related: ['dijkstra', 'binary-search'],
    prompt: 'top_k(nums, k) -> the k largest values using a size-k min-heap',
    template: `import heapq

def top_k(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h  # the k largest, ascending`,
    recognitionCues: [
      'Find the kth largest element in an array',
      'Top k frequent elements',
      'K closest points to the origin',
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary search & variants',
    category: 'Searching',
    icon: 'fa-solid fa-magnifying-glass',
    accent: GREEN,
    difficulty: 'core',
    summary:
      'Halve the search space each step on a sorted domain - including "search on the answer" via a predicate.',
    triggers: [
      'Sorted array lookup or insertion point',
      'Monotonic predicate: "smallest x that works" / "can we do it with capacity m?"',
      'You need O(log n) instead of O(n)',
    ],
    complexity: { time: 'O(log n)', space: 'O(1)' },
    keyIdeas: [
      'mid = lo + (hi - lo) // 2 to avoid overflow (matters in other languages)',
      'Classic: lo <= hi, return mid on match',
      'Leftmost boundary: lo < hi, hi = mid when arr[mid] >= target',
      'Answer search: replace comparison with a feasibility predicate',
    ],
    pitfalls: [
      'Infinite loop from wrong mid rounding or bound update',
      'Mixing up leftmost vs rightmost boundary conditions',
      'Using it on an unsorted / non-monotonic domain',
    ],
    edgeCases: ['Target absent', 'Duplicates', 'Single element', 'All equal'],
    prerequisites: [],
    related: ['two-pointers-opposite', 'monotonic-stack'],
    prompt: 'binary_search(arr, target) and leftmost(arr, target) insertion point',
    template: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

def leftmost(arr, target):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
    workedExample: {
      problem: 'LeetCode 875 - Koko Eating Bananas (search on the answer)',
      approach:
        'The eating speed is monotonic: if speed s finishes in time, so does any speed > s. Binary search the smallest feasible speed with a predicate.',
      code: `import math
def min_eating_speed(piles, h):
    def hours(speed):
        return sum(math.ceil(p / speed) for p in piles)
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours(mid) <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    },
    recognitionCues: [
      'Find a target in a sorted array in log time',
      'Smallest divisor / capacity / speed that satisfies a limit',
      'First bad version',
    ],
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    category: 'Recursion',
    icon: 'fa-solid fa-code-branch',
    accent: PINK,
    difficulty: 'advanced',
    summary:
      'Explore choices recursively, undoing each choice after recursing - the engine for subsets, permutations, and constraint puzzles.',
    triggers: [
      'Generate all subsets / permutations / combinations',
      'Constraint satisfaction: N-Queens, Sudoku, word search',
      '"Find all ways / all valid configurations"',
    ],
    complexity: { time: 'Exponential (e.g. O(2^n) subsets)', space: 'O(n) recursion depth' },
    keyIdeas: [
      'Recursive helper carries the current path/state',
      'Record a solution at the right base case',
      'For each choice: apply, recurse, then undo (backtrack)',
      'A start index or used[] prevents reusing elements',
    ],
    pitfalls: [
      'Appending the path by reference instead of a copy (path[:])',
      'Forgetting to undo the choice after recursion',
      'Wrong start index -> duplicates or missing cases',
    ],
    edgeCases: ['Empty input', 'Duplicates requiring skip logic', 'Single element'],
    prerequisites: ['tree-traversal'],
    related: ['tree-traversal', 'dynamic-programming'],
    prompt: 'subsets(nums) -> all subsets (the power set)',
    template: `def subsets(nums):
    res = []
    def backtrack(start, path):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res`,
    recognitionCues: [
      'Generate all subsets of a set',
      'All permutations of a list',
      'Place N queens on a board without conflicts',
    ],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic programming',
    category: 'Dynamic programming',
    icon: 'fa-solid fa-table-cells',
    accent: PINK,
    difficulty: 'advanced',
    summary:
      'Solve overlapping subproblems once - top-down with memoization or bottom-up with a table.',
    triggers: [
      'Optimal value (min/max/count of ways) with overlapping subproblems',
      'Choices at each step where greedy fails',
      'Recurrence like f(i) depends on f(i-1), f(i-2), ...',
    ],
    complexity: { time: 'O(states x transitions)', space: 'O(states)' },
    keyIdeas: [
      'Define the state and what its value means',
      'Write the recurrence and base cases',
      'Top-down: recurse + cache (functools.cache)',
      'Bottom-up: fill a table from base cases; often reduce to O(1) rolling vars',
    ],
    pitfalls: [
      'Ill-defined state -> wrong transitions',
      'Missing or wrong base cases',
      'Recomputing without memoization (exponential blowup)',
    ],
    edgeCases: ['n = 0 or 1', 'Empty input', 'Single choice available'],
    prerequisites: ['backtracking'],
    related: ['backtracking', 'prefix-sum'],
    prompt: 'climb(n) top-down memoized and climb_dp(n) bottom-up (climbing stairs)',
    template: `from functools import cache

@cache
def climb(n):            # top-down memoization
    if n <= 2:
        return n
    return climb(n - 1) + climb(n - 2)

def climb_dp(n):         # bottom-up tabulation
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    workedExample: {
      problem: 'LeetCode 322 - Coin Change (min coins)',
      approach:
        'dp[a] = fewest coins to make amount a. For each amount, try every coin and take 1 + best of the remainder. Unreachable stays at infinity.',
      code: `def coin_change(coins, amount):
    dp = [0] + [float('inf')] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    },
    recognitionCues: [
      'Fewest coins to make an amount',
      'Number of distinct ways to climb stairs',
      'Longest increasing subsequence',
    ],
  },
  {
    id: 'trie',
    title: 'Trie (prefix tree)',
    category: 'Trees',
    icon: 'fa-solid fa-sitemap',
    accent: AMBER,
    difficulty: 'advanced',
    summary:
      'A character-branching tree that makes prefix insert/search/startsWith O(word length).',
    triggers: [
      'Many prefix queries / autocomplete',
      'Word dictionary with wildcard or prefix search',
      'Replace-words / longest-prefix problems',
    ],
    complexity: { time: 'O(L) per op', space: 'O(total chars)', note: 'L = word length' },
    keyIdeas: [
      'Node holds children dict and an is_end flag',
      'Insert: walk/create a child per character, mark last as end',
      'Search: walk children; missing char -> not found',
      'startsWith is search without the is_end check',
    ],
    pitfalls: [
      'Confusing "word exists" (is_end) with "prefix exists"',
      'Forgetting to set is_end on the final node',
      'Using an array[26] when the alphabet is not just lowercase a-z',
    ],
    edgeCases: ['Empty string', 'Word that is a prefix of another', 'Repeated inserts'],
    prerequisites: ['tree-traversal'],
    related: ['tree-traversal', 'backtracking'],
    prompt: 'Trie with insert(word) and search(word)',
    template: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            node = node.children.setdefault(c, TrieNode())
        node.is_end = True

    def search(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                return False
            node = node.children[c]
        return node.is_end`,
    recognitionCues: [
      'Implement autocomplete / a word dictionary',
      'Search words with . wildcards',
      'Longest word built one character at a time',
    ],
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's shortest path",
    category: 'Graphs',
    icon: 'fa-solid fa-route',
    accent: RED,
    difficulty: 'advanced',
    summary:
      'Greedily expand the closest unsettled node using a min-heap to find shortest paths with non-negative weights.',
    triggers: [
      'Shortest path in a WEIGHTED graph with non-negative weights',
      'Minimum cost / time to reach nodes from a source',
      'Network delay, cheapest flights (with tweaks)',
    ],
    complexity: { time: 'O(E log V)', space: 'O(V + E)' },
    keyIdeas: [
      'dist array of infinity, dist[src] = 0',
      'Min-heap of (distance, node); pop the closest',
      'Skip stale entries where popped d > dist[u]',
      'Relax each edge: if d + w < dist[v], update and push',
    ],
    pitfalls: [
      'Using it with NEGATIVE edges (use Bellman-Ford instead)',
      'Not skipping stale heap entries -> wrong or slow',
      'Forgetting weights - this is not plain BFS',
    ],
    edgeCases: ['Unreachable nodes stay at infinity', 'Single node', 'Multiple equal-cost paths'],
    prerequisites: ['graph-traversal', 'top-k-heap'],
    related: ['graph-traversal', 'top-k-heap'],
    prompt: 'dijkstra(graph, src, n) where graph[u] = list of (v, w)',
    template: `import heapq

def dijkstra(graph, src, n):
    dist = [float('inf')] * n
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
    recognitionCues: [
      'Minimum time for a signal to reach all nodes',
      'Cheapest path in a weighted graph',
      'Shortest path where edges have different costs',
    ],
  },
  {
    id: 'union-find',
    title: 'Union-Find (DSU)',
    category: 'Graphs',
    icon: 'fa-solid fa-object-group',
    accent: RED,
    difficulty: 'advanced',
    summary:
      'Track disjoint sets with near-constant find/union via path compression and union by rank.',
    triggers: [
      'Connected components / "are these connected?"',
      "Kruskal's MST, redundant connection, accounts merge",
      'Dynamic connectivity as edges arrive',
    ],
    complexity: { time: 'O(alpha(n)) per op', space: 'O(n)', note: 'near-constant' },
    keyIdeas: [
      'parent[i] = i initially; rank/size all 0/1',
      'find(x): follow parents to the root, compressing along the way',
      'union(x, y): attach the smaller tree under the larger root',
      'Same root means same component',
    ],
    pitfalls: [
      'Skipping path compression / union by rank -> O(n) chains',
      'Comparing parent[x] == parent[y] instead of find(x) == find(y)',
      'Not initializing parent for every node',
    ],
    edgeCases: ['Self-union', 'Already-connected union', 'All nodes separate'],
    prerequisites: ['graph-traversal'],
    related: ['graph-traversal', 'dijkstra'],
    prompt: 'UnionFind with find(x) (path compression) and union(x, y) (by rank)',
    template: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True`,
    recognitionCues: [
      'Count connected components in a graph',
      'Detect a redundant edge that forms a cycle',
      'Number of provinces / friend circles',
    ],
  },
]

export const PATTERN_BY_ID: Record<string, Pattern> = PATTERNS.reduce(
  (acc, p) => {
    acc[p.id] = p
    return acc
  },
  {} as Record<string, Pattern>,
)

/** Distinct categories in catalog order. */
export const PATTERN_CATEGORIES: string[] = PATTERNS.reduce<string[]>((acc, p) => {
  if (!acc.includes(p.category)) acc.push(p.category)
  return acc
}, [])
