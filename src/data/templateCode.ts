import type { LanguageId } from '@/types'

/** Full reference implementations keyed by exact template title. */
export const TEMPLATE_CODE: Record<
  string,
  Partial<Record<LanguageId, string>>
> = {
  'Two pointers: one input, opposite ends': {
    python: `def two_sum(nums, target):
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
    csharp: `int[] TwoSum(int[] nums, int target) {
    int left = 0, right = nums.Length - 1;
    while (left < right) {
        int s = nums[left] + nums[right];
        if (s == target) return new[] { left, right };
        if (s < target) left++;
        else right--;
    }
    return new[] { -1, -1 };
}`,
    typescript: `function twoSum(nums: number[], target: number): number[] {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const s = nums[left] + nums[right];
    if (s === target) return [left, right];
    if (s < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
    rust: `fn two_sum(nums: &[i32], target: i32) -> (usize, usize) {
    let (mut left, mut right) = (0, nums.len() - 1);
    while left < right {
        let s = nums[left] + nums[right];
        if s == target { return (left, right); }
        if s < target { left += 1; } else { right -= 1; }
    }
    (0, 0)
}`,
  },

  'Two pointers: two inputs, advance both': {
    python: `def merge(a, b):
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
    csharp: `List<int> Merge(int[] a, int[] b) {
    var res = new List<int>();
    int i = 0, j = 0;
    while (i < a.Length && j < b.Length)
        res.Add(a[i] <= b[j] ? a[i++] : b[j++]);
    while (i < a.Length) res.Add(a[i++]);
    while (j < b.Length) res.Add(b[j++]);
    return res;
}`,
    typescript: `function merge(a: number[], b: number[]): number[] {
  const res: number[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length)
    res.push(a[i] <= b[j] ? a[i++] : b[j++]);
  return res.concat(a.slice(i), b.slice(j));
}`,
    rust: `fn merge(a: &[i32], b: &[i32]) -> Vec<i32> {
    let (mut i, mut j) = (0, 0);
    let mut res = Vec::new();
    while i < a.len() && j < b.len() {
        if a[i] <= b[j] { res.push(a[i]); i += 1; }
        else { res.push(b[j]); j += 1; }
    }
    res.extend_from_slice(&a[i..]);
    res.extend_from_slice(&b[j..]);
    res
}`,
  },

  'Sliding window': {
    python: `def longest_unique(s):
    seen = {}
    left = best = 0
    for right, c in enumerate(s):
        if c in seen and seen[c] >= left:
            left = seen[c] + 1
        seen[c] = right
        best = max(best, right - left + 1)
    return best`,
    csharp: `int LongestUnique(string s) {
    var seen = new Dictionary<char, int>();
    int left = 0, best = 0;
    for (int right = 0; right < s.Length; right++) {
        char c = s[right];
        if (seen.TryGetValue(c, out int idx) && idx >= left)
            left = idx + 1;
        seen[c] = right;
        best = Math.Max(best, right - left + 1);
    }
    return best;
}`,
    typescript: `function longestUnique(s: string): number {
  const seen = new Map<string, number>();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (seen.has(c) && seen.get(c)! >= left) left = seen.get(c)! + 1;
    seen.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    rust: `use std::collections::HashMap;
fn longest_unique(s: &str) -> usize {
    let mut seen: HashMap<char, usize> = HashMap::new();
    let (mut left, mut best) = (0usize, 0usize);
    for (right, c) in s.chars().enumerate() {
        if let Some(&idx) = seen.get(&c) {
            if idx >= left { left = idx + 1; }
        }
        seen.insert(c, right);
        best = best.max(right - left + 1);
    }
    best
}`,
  },

  'Build a prefix sum': {
    python: `def build_prefix(arr):
    prefix = [0] * (len(arr) + 1)
    for i, x in enumerate(arr):
        prefix[i + 1] = prefix[i] + x
    return prefix

# range sum [l, r] inclusive:
def range_sum(prefix, l, r):
    return prefix[r + 1] - prefix[l]`,
    csharp: `int[] BuildPrefix(int[] arr) {
    var prefix = new int[arr.Length + 1];
    for (int i = 0; i < arr.Length; i++)
        prefix[i + 1] = prefix[i] + arr[i];
    return prefix;
}
// range sum [l, r] inclusive:
int RangeSum(int[] p, int l, int r) => p[r + 1] - p[l];`,
    typescript: `function buildPrefix(arr: number[]): number[] {
  const prefix = new Array(arr.length + 1).fill(0);
  for (let i = 0; i < arr.length; i++)
    prefix[i + 1] = prefix[i] + arr[i];
  return prefix;
}
// range sum [l, r] inclusive:
const rangeSum = (p: number[], l: number, r: number) => p[r + 1] - p[l];`,
    rust: `fn build_prefix(arr: &[i32]) -> Vec<i32> {
    let mut prefix = vec![0; arr.len() + 1];
    for (i, &x) in arr.iter().enumerate() {
        prefix[i + 1] = prefix[i] + x;
    }
    prefix
}
// range sum [l, r] inclusive = prefix[r + 1] - prefix[l]`,
  },

  'Efficient string building': {
    python: `parts = []
for i in range(n):
    parts.append(str(i))
result = "".join(parts)`,
    csharp: `var sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.Append(i);
string result = sb.ToString();`,
    typescript: `const parts: string[] = [];
for (let i = 0; i < n; i++) parts.push(String(i));
const result = parts.join("");`,
    rust: `let mut s = String::new();
for i in 0..n {
    s.push_str(&i.to_string());
}`,
  },

  'Linked list: fast and slow pointer': {
    python: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    csharp: `bool HasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    typescript: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    rust: `use std::rc::Rc;
use std::cell::RefCell;
type Link = Option<Rc<RefCell<ListNode>>>;

fn has_cycle(head: Link) -> bool {
    let (mut slow, mut fast) = (head.clone(), head);
    while let Some(f) = fast.clone() {
        match f.borrow().next.clone() {
            Some(f2) => {
                fast = f2.borrow().next.clone();
                slow = slow.and_then(|s| s.borrow().next.clone());
                if let (Some(a), Some(b)) = (&slow, &fast) {
                    if Rc::ptr_eq(a, b) { return true; }
                }
            }
            None => return false,
        }
    }
    false
}`,
  },

  'Reversing a linked list': {
    python: `def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    csharp: `ListNode Reverse(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        var next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    typescript: `function reverse(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    rust: `fn reverse(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut prev = None;
    let mut curr = head;
    while let Some(mut node) = curr {
        curr = node.next.take();
        node.next = prev;
        prev = Some(node);
    }
    prev
}`,
  },

  'Find number of subarrays that fit an exact criteria': {
    python: `def subarray_sum(nums, k):
    count = running = 0
    seen = {0: 1}
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count`,
    csharp: `int SubarraySum(int[] nums, int k) {
    int count = 0, running = 0;
    var seen = new Dictionary<int, int> { { 0, 1 } };
    foreach (int x in nums) {
        running += x;
        if (seen.TryGetValue(running - k, out int c)) count += c;
        seen[running] = seen.GetValueOrDefault(running) + 1;
    }
    return count;
}`,
    typescript: `function subarraySum(nums: number[], k: number): number {
  let count = 0, running = 0;
  const seen = new Map<number, number>([[0, 1]]);
  for (const x of nums) {
    running += x;
    count += seen.get(running - k) ?? 0;
    seen.set(running, (seen.get(running) ?? 0) + 1);
  }
  return count;
}`,
    rust: `use std::collections::HashMap;
fn subarray_sum(nums: &[i32], k: i32) -> i32 {
    let (mut count, mut running) = (0, 0);
    let mut seen = HashMap::new();
    seen.insert(0, 1);
    for &x in nums {
        running += x;
        count += *seen.get(&(running - k)).unwrap_or(&0);
        *seen.entry(running).or_insert(0) += 1;
    }
    count
}`,
  },

  'Monotonic increasing stack': {
    python: `def next_greater(nums):
    res = [-1] * len(nums)
    stack = []  # indices
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x
        stack.append(i)
    return res`,
    csharp: `int[] NextGreater(int[] nums) {
    var res = new int[nums.Length];
    Array.Fill(res, -1);
    var stack = new Stack<int>();
    for (int i = 0; i < nums.Length; i++) {
        while (stack.Count > 0 && nums[stack.Peek()] < nums[i])
            res[stack.Pop()] = nums[i];
        stack.Push(i);
    }
    return res;
}`,
    typescript: `function nextGreater(nums: number[]): number[] {
  const res = new Array(nums.length).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i])
      res[stack.pop()!] = nums[i];
    stack.push(i);
  }
  return res;
}`,
    rust: `fn next_greater(nums: &[i32]) -> Vec<i32> {
    let mut res = vec![-1; nums.len()];
    let mut stack: Vec<usize> = Vec::new();
    for i in 0..nums.len() {
        while let Some(&top) = stack.last() {
            if nums[top] < nums[i] { res[top] = nums[i]; stack.pop(); }
            else { break; }
        }
        stack.push(i);
    }
    res
}`,
  },

  'Binary tree: DFS (recursive) • DFS (iterative) • BFS': {
    python: `def inorder(root, out):
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
    csharp: `void Inorder(TreeNode root, List<int> outList) {
    if (root == null) return;
    Inorder(root.left, outList);
    outList.Add(root.val);
    Inorder(root.right, outList);
}
List<int> Bfs(TreeNode root) {
    var res = new List<int>();
    if (root == null) return res;
    var q = new Queue<TreeNode>();
    q.Enqueue(root);
    while (q.Count > 0) {
        var node = q.Dequeue();
        res.Add(node.val);
        if (node.left != null) q.Enqueue(node.left);
        if (node.right != null) q.Enqueue(node.right);
    }
    return res;
}`,
    typescript: `function inorder(root: TreeNode | null, out: number[]): void {
  if (!root) return;
  inorder(root.left, out);
  out.push(root.val);
  inorder(root.right, out);
}
function bfs(root: TreeNode | null): number[] {
  const res: number[] = [];
  if (!root) return res;
  const q: TreeNode[] = [root];
  while (q.length) {
    const node = q.shift()!;
    res.push(node.val);
    if (node.left) q.push(node.left);
    if (node.right) q.push(node.right);
  }
  return res;
}`,
    rust: `use std::rc::Rc;
use std::cell::RefCell;
use std::collections::VecDeque;
type Tree = Option<Rc<RefCell<TreeNode>>>;

fn inorder(root: &Tree, out: &mut Vec<i32>) {
    if let Some(node) = root {
        let n = node.borrow();
        inorder(&n.left, out);
        out.push(n.val);
        inorder(&n.right, out);
    }
}
fn bfs(root: Tree) -> Vec<i32> {
    let mut res = Vec::new();
    let mut q = VecDeque::new();
    if let Some(r) = root { q.push_back(r); }
    while let Some(node) = q.pop_front() {
        let n = node.borrow();
        res.push(n.val);
        if let Some(l) = &n.left { q.push_back(l.clone()); }
        if let Some(r) = &n.right { q.push_back(r.clone()); }
    }
    res
}`,
  },

  'Graph: DFS (recursive/iterative) • BFS': {
    python: `from collections import deque

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
    csharp: `void Dfs(List<int>[] graph, int node, HashSet<int> seen) {
    seen.Add(node);
    foreach (int next in graph[node])
        if (!seen.Contains(next)) Dfs(graph, next, seen);
}
HashSet<int> Bfs(List<int>[] graph, int start) {
    var seen = new HashSet<int> { start };
    var q = new Queue<int>();
    q.Enqueue(start);
    while (q.Count > 0) {
        int node = q.Dequeue();
        foreach (int next in graph[node])
            if (seen.Add(next)) q.Enqueue(next);
    }
    return seen;
}`,
    typescript: `function dfs(graph: number[][], node: number, seen: Set<number>): void {
  seen.add(node);
  for (const next of graph[node])
    if (!seen.has(next)) dfs(graph, next, seen);
}
function bfs(graph: number[][], start: number): Set<number> {
  const seen = new Set<number>([start]);
  const q = [start];
  while (q.length) {
    const node = q.shift()!;
    for (const next of graph[node])
      if (!seen.has(next)) { seen.add(next); q.push(next); }
  }
  return seen;
}`,
    rust: `use std::collections::{HashSet, VecDeque};
fn dfs(graph: &Vec<Vec<usize>>, node: usize, seen: &mut HashSet<usize>) {
    seen.insert(node);
    for &next in &graph[node] {
        if !seen.contains(&next) { dfs(graph, next, seen); }
    }
}
fn bfs(graph: &Vec<Vec<usize>>, start: usize) -> HashSet<usize> {
    let mut seen = HashSet::from([start]);
    let mut q = VecDeque::from([start]);
    while let Some(node) = q.pop_front() {
        for &next in &graph[node] {
            if seen.insert(next) { q.push_back(next); }
        }
    }
    seen
}`,
  },

  'Find top k elements with heap': {
    python: `import heapq

def top_k(nums, k):
    # min-heap of size k -> k largest
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h  # the k largest, ascending`,
    csharp: `int[] TopK(int[] nums, int k) {
    var pq = new PriorityQueue<int, int>(); // min-heap
    foreach (int x in nums) {
        pq.Enqueue(x, x);
        if (pq.Count > k) pq.Dequeue();
    }
    var res = new List<int>();
    while (pq.Count > 0) res.Add(pq.Dequeue());
    return res.ToArray();
}`,
    typescript: `function topK(nums: number[], k: number): number[] {
  // No built-in heap: sort desc, take k (O(n log n)).
  return [...nums].sort((a, b) => b - a).slice(0, k);
}`,
    rust: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
fn top_k(nums: &[i32], k: usize) -> Vec<i32> {
    let mut heap = BinaryHeap::new(); // min-heap via Reverse
    for &x in nums {
        heap.push(Reverse(x));
        if heap.len() > k { heap.pop(); }
    }
    heap.into_iter().map(|Reverse(x)| x).collect()
}`,
  },

  'Binary search + variants (leftmost / rightmost / predicate)': {
    python: `def binary_search(arr, target):
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
    csharp: `int BinarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.Length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
int Leftmost(int[] arr, int target) {
    int lo = 0, hi = arr.Length;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
    typescript: `function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    rust: `fn binary_search(arr: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i32, arr.len() as i32 - 1);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let v = arr[mid as usize];
        if v == target { return mid; }
        if v < target { lo = mid + 1; } else { hi = mid - 1; }
    }
    -1
}`,
  },

  Backtracking: {
    python: `def subsets(nums):
    res = []
    def backtrack(start, path):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res`,
    csharp: `IList<IList<int>> Subsets(int[] nums) {
    var res = new List<IList<int>>();
    void Backtrack(int start, List<int> path) {
        res.Add(new List<int>(path));
        for (int i = start; i < nums.Length; i++) {
            path.Add(nums[i]);
            Backtrack(i + 1, path);
            path.RemoveAt(path.Count - 1);
        }
    }
    Backtrack(0, new List<int>());
    return res;
}`,
    typescript: `function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  const backtrack = (start: number, path: number[]) => {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };
  backtrack(0, []);
  return res;
}`,
    rust: `fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    fn backtrack(start: usize, nums: &[i32],
                 path: &mut Vec<i32>, res: &mut Vec<Vec<i32>>) {
        res.push(path.clone());
        for i in start..nums.len() {
            path.push(nums[i]);
            backtrack(i + 1, nums, path, res);
            path.pop();
        }
    }
    let mut res = Vec::new();
    backtrack(0, nums, &mut Vec::new(), &mut res);
    res
}`,
  },

  'Dynamic Programming: Top-down (memoization) & Bottom-up (tabulation)': {
    python: `from functools import cache

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
    csharp: `Dictionary<int, int> memo = new();
int Climb(int n) {                 // top-down
    if (n <= 2) return n;
    if (memo.TryGetValue(n, out int v)) return v;
    return memo[n] = Climb(n - 1) + Climb(n - 2);
}
int ClimbDp(int n) {               // bottom-up
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    return b;
}`,
    typescript: `const memo = new Map<number, number>();
function climb(n: number): number {        // top-down
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  const r = climb(n - 1) + climb(n - 2);
  memo.set(n, r);
  return r;
}
function climbDp(n: number): number {       // bottom-up
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) { const c = a + b; a = b; b = c; }
  return b;
}`,
    rust: `use std::collections::HashMap;
fn climb(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {   // top-down
    if n <= 2 { return n; }
    if let Some(&v) = memo.get(&n) { return v; }
    let r = climb(n - 1, memo) + climb(n - 2, memo);
    memo.insert(n, r);
    r
}
fn climb_dp(n: u64) -> u64 {                              // bottom-up
    if n <= 2 { return n; }
    let (mut a, mut b) = (1u64, 2u64);
    for _ in 3..=n { let c = a + b; a = b; b = c; }
    b
}`,
  },

  'Build a trie (prefix tree)': {
    python: `class TrieNode:
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
    csharp: `class TrieNode {
    public Dictionary<char, TrieNode> Children = new();
    public bool IsEnd;
}
class Trie {
    private readonly TrieNode root = new();
    public void Insert(string word) {
        var node = root;
        foreach (char c in word) {
            if (!node.Children.ContainsKey(c))
                node.Children[c] = new TrieNode();
            node = node.Children[c];
        }
        node.IsEnd = true;
    }
    public bool Search(string word) {
        var node = root;
        foreach (char c in word)
            if (!node.Children.TryGetValue(c, out node)) return false;
        return node.IsEnd;
    }
}`,
    typescript: `class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
}
class Trie {
  root = new TrieNode();
  insert(word: string): void {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) node.children.set(c, new TrieNode());
      node = node.children.get(c)!;
    }
    node.isEnd = true;
  }
  search(word: string): boolean {
    let node = this.root;
    for (const c of word) {
      if (!node.children.has(c)) return false;
      node = node.children.get(c)!;
    }
    return node.isEnd;
  }
}`,
    rust: `use std::collections::HashMap;
#[derive(Default)]
struct TrieNode {
    children: HashMap<char, TrieNode>,
    is_end: bool,
}
impl TrieNode {
    fn insert(&mut self, word: &str) {
        let mut node = self;
        for c in word.chars() {
            node = node.children.entry(c).or_default();
        }
        node.is_end = true;
    }
    fn search(&self, word: &str) -> bool {
        let mut node = self;
        for c in word.chars() {
            match node.children.get(&c) {
                Some(n) => node = n,
                None => return false,
            }
        }
        node.is_end
    }
}`,
  },

  "Dijkstra's shortest path": {
    python: `import heapq

def dijkstra(graph, src, n):   # graph[u] = list of (v, w)
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
    csharp: `int[] Dijkstra(List<(int v, int w)>[] graph, int src, int n) {
    var dist = new int[n];
    Array.Fill(dist, int.MaxValue);
    dist[src] = 0;
    var pq = new PriorityQueue<int, int>();
    pq.Enqueue(src, 0);
    while (pq.Count > 0) {
        int u = pq.Dequeue();
        foreach (var (v, w) in graph[u]) {
            if (dist[u] != int.MaxValue && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.Enqueue(v, dist[v]);
            }
        }
    }
    return dist;
}`,
    typescript: `function dijkstra(
  graph: [number, number][][], src: number, n: number,
): number[] {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const pq: [number, number][] = [[0, src]]; // [dist, node]
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;
    if (d > dist[u]) continue;
    for (const [v, w] of graph[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
    rust: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
fn dijkstra(graph: &Vec<Vec<(usize, u32)>>, src: usize, n: usize) -> Vec<u32> {
    let mut dist = vec![u32::MAX; n];
    dist[src] = 0;
    let mut pq = BinaryHeap::new();
    pq.push(Reverse((0u32, src)));
    while let Some(Reverse((d, u))) = pq.pop() {
        if d > dist[u] { continue; }
        for &(v, w) in &graph[u] {
            if d + w < dist[v] {
                dist[v] = d + w;
                pq.push(Reverse((dist[v], v)));
            }
        }
    }
    dist
}`,
  },

  'Union Find (Disjoint Set Union)': {
    python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True`,
    csharp: `class UnionFind {
    private readonly int[] parent, rank;
    public UnionFind(int n) {
        parent = new int[n]; rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int Find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
    public bool Union(int a, int b) {
        int ra = Find(a), rb = Find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) (ra, rb) = (rb, ra);
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }
}`,
    typescript: `class UnionFind {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(a: number, b: number): boolean {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    return true;
  }
}`,
    rust: `struct UnionFind {
    parent: Vec<usize>,
    rank: Vec<usize>,
}
impl UnionFind {
    fn new(n: usize) -> Self {
        UnionFind { parent: (0..n).collect(), rank: vec![0; n] }
    }
    fn find(&mut self, mut x: usize) -> usize {
        while self.parent[x] != x {
            self.parent[x] = self.parent[self.parent[x]];
            x = self.parent[x];
        }
        x
    }
    fn union(&mut self, a: usize, b: usize) -> bool {
        let (mut ra, mut rb) = (self.find(a), self.find(b));
        if ra == rb { return false; }
        if self.rank[ra] < self.rank[rb] { std::mem::swap(&mut ra, &mut rb); }
        self.parent[rb] = ra;
        if self.rank[ra] == self.rank[rb] { self.rank[ra] += 1; }
        true
    }
}`,
  },
}
