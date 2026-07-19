import type { LanguageId, RowTone, SyntaxCategory } from '@/types'
import { SYNTAX_ROWS } from './syntaxRows'

type Tone = Record<LanguageId, RowTone>

// Reusable tone patterns (green = concise/Python-like, red = verbose/different,
// purple/neutral = modern gradual typing).
const SAME: Tone = {
  python: 'good',
  csharp: 'good',
  typescript: 'good',
  rust: 'good',
}
const tone = (
  python: RowTone,
  csharp: RowTone,
  typescript: RowTone,
  rust: RowTone,
): Tone => ({ python, csharp, typescript, rust })

export const SYNTAX_CATEGORIES: SyntaxCategory[] = [
  {
    title: 'Core language constructs',
    rows: SYNTAX_ROWS,
  },
  {
    title: 'Collections',
    rows: [
      {
        topic: 'Set / HashSet',
        tone: SAME,
        code: {
          python: `s = set()
s.add(1)
1 in s
s.discard(1)`,
          csharp: `var s = new HashSet<int>();
s.Add(1);
s.Contains(1);
s.Remove(1);`,
          typescript: `const s = new Set<number>();
s.add(1);
s.has(1);
s.delete(1);`,
          rust: `use std::collections::HashSet;
let mut s = HashSet::new();
s.insert(1);
s.contains(&1);
s.remove(&1);`,
        },
      },
      {
        topic: 'Stack (LIFO)',
        tone: SAME,
        code: {
          python: `stack = []
stack.append(1)
top = stack[-1]
stack.pop()`,
          csharp: `var stack = new Stack<int>();
stack.Push(1);
int top = stack.Peek();
stack.Pop();`,
          typescript: `const stack: number[] = [];
stack.push(1);
const top = stack[stack.length - 1];
stack.pop();`,
          rust: `let mut stack: Vec<i32> = Vec::new();
stack.push(1);
let top = *stack.last().unwrap();
stack.pop();`,
        },
      },
      {
        topic: 'Queue (FIFO)',
        tone: tone('good', 'good', 'bad', 'good'),
        code: {
          python: `from collections import deque
q = deque()
q.append(1)
front = q.popleft()`,
          csharp: `var q = new Queue<int>();
q.Enqueue(1);
int front = q.Dequeue();`,
          typescript: `const q: number[] = [];
q.push(1);
const front = q.shift(); // O(n)!`,
          rust: `use std::collections::VecDeque;
let mut q = VecDeque::new();
q.push_back(1);
let front = q.pop_front();`,
        },
      },
      {
        topic: 'Deque (double-ended)',
        tone: tone('good', 'neutral', 'bad', 'good'),
        code: {
          python: `from collections import deque
d = deque()
d.appendleft(1); d.append(2)
d.popleft(); d.pop()`,
          csharp: `var d = new LinkedList<int>();
d.AddFirst(1); d.AddLast(2);
d.RemoveFirst(); d.RemoveLast();`,
          typescript: `const d: number[] = [];
d.unshift(1); d.push(2); // unshift O(n)
d.shift(); d.pop();`,
          rust: `use std::collections::VecDeque;
let mut d = VecDeque::new();
d.push_front(1); d.push_back(2);
d.pop_front(); d.pop_back();`,
        },
      },
      {
        topic: 'Heap / Priority Queue',
        tone: tone('good', 'good', 'bad', 'good'),
        code: {
          python: `import heapq
h = []
heapq.heappush(h, 3)
smallest = heapq.heappop(h)
# max-heap: push -x`,
          csharp: `var pq = new PriorityQueue<string, int>();
pq.Enqueue("task", priority);
string x = pq.Dequeue();`,
          typescript: `// No built-in heap.
// Use a library (e.g. @datastructures-js/priority-queue)
// or implement one over an array.`,
          rust: `use std::collections::BinaryHeap;
let mut h = BinaryHeap::new(); // max-heap
h.push(3);
let largest = h.pop();
// min-heap: use std::cmp::Reverse(x)`,
        },
      },
      {
        topic: 'Tuple / Pair',
        tone: SAME,
        code: {
          python: `pair = (1, "a")
x, y = pair
first = pair[0]`,
          csharp: `var pair = (1, "a");
var (x, y) = pair;
int first = pair.Item1;`,
          typescript: `const pair: [number, string] = [1, "a"];
const [x, y] = pair;
const first = pair[0];`,
          rust: `let pair: (i32, &str) = (1, "a");
let (x, y) = pair;
let first = pair.0;`,
        },
      },
      {
        topic: '2D array / matrix init',
        tone: tone('good', 'bad', 'bad', 'neutral'),
        code: {
          python: `rows, cols = 3, 4
grid = [[0] * cols for _ in range(rows)]
grid[1][2] = 5`,
          csharp: `int[,] grid = new int[3, 4];
grid[1, 2] = 5;
// jagged: int[][] g = new int[3][];`,
          typescript: `const grid: number[][] =
  Array.from({ length: 3 }, () => Array(4).fill(0));
grid[1][2] = 5;`,
          rust: `let mut grid = vec![vec![0; 4]; 3];
grid[1][2] = 5;`,
        },
      },
      {
        topic: 'Frequency map / counter',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `from collections import Counter
freq = Counter(arr)
freq[x] += 1`,
          csharp: `var freq = new Dictionary<int, int>();
foreach (var x in arr)
    freq[x] = freq.GetValueOrDefault(x) + 1;`,
          typescript: `const freq = new Map<number, number>();
for (const x of arr)
  freq.set(x, (freq.get(x) ?? 0) + 1);`,
          rust: `use std::collections::HashMap;
let mut freq = HashMap::new();
for x in &arr { *freq.entry(x).or_insert(0) += 1; }`,
        },
      },
      {
        topic: 'Sort map by value',
        tone: tone('good', 'neutral', 'neutral', 'bad'),
        code: {
          python: `# top entries by count, desc
top = sorted(freq.items(),
             key=lambda kv: -kv[1])`,
          csharp: `var top = freq
    .OrderByDescending(kv => kv.Value)
    .ToList();`,
          typescript: `const top = [...freq.entries()]
  .sort((a, b) => b[1] - a[1]);`,
          rust: `let mut top: Vec<_> = freq.iter().collect();
top.sort_by(|a, b| b.1.cmp(a.1));`,
        },
      },
    ],
  },
  {
    title: 'Iteration & access',
    rows: [
      {
        topic: 'Slicing / subarray',
        tone: tone('good', 'neutral', 'good', 'neutral'),
        code: {
          python: `sub = arr[1:4]    # indices 1..3
rev = arr[::-1]
first3 = arr[:3]`,
          csharp: `var sub = arr[1..4];        // C# 8+
var first3 = arr.Take(3).ToArray();`,
          typescript: `const sub = arr.slice(1, 4);
const rev = [...arr].reverse();`,
          rust: `let sub = &arr[1..4];
let rev: Vec<_> = arr.iter().rev().collect();`,
        },
      },
      {
        topic: 'Enumerate (index + value)',
        tone: tone('good', 'bad', 'good', 'good'),
        code: {
          python: `for i, x in enumerate(arr):
    print(i, x)`,
          csharp: `for (int i = 0; i < arr.Length; i++)
    Console.WriteLine($"{i} {arr[i]}");`,
          typescript: `arr.forEach((x, i) => console.log(i, x));`,
          rust: `for (i, x) in arr.iter().enumerate() {
    println!("{} {}", i, x);
}`,
        },
      },
      {
        topic: 'Zip / parallel iterate',
        tone: tone('good', 'neutral', 'bad', 'good'),
        code: {
          python: `for a, b in zip(list1, list2):
    print(a, b)`,
          csharp: `foreach (var (a, b) in list1.Zip(list2))
    Console.WriteLine($"{a} {b}");`,
          typescript: `list1.forEach((a, i) => {
  const b = list2[i];
});`,
          rust: `for (a, b) in list1.iter().zip(list2.iter()) {
    println!("{} {}", a, b);
}`,
        },
      },
      {
        topic: 'Sorting (default)',
        tone: tone('good', 'good', 'bad', 'good'),
        code: {
          python: `arr.sort()          # in place
new = sorted(arr)   # copy`,
          csharp: `Array.Sort(arr);
list.Sort();`,
          typescript: `arr.sort((a, b) => a - b); // must pass comparator!`,
          rust: `arr.sort();`,
        },
      },
      {
        topic: 'Sort with custom key',
        tone: tone('good', 'neutral', 'good', 'neutral'),
        code: {
          python: `# by 2nd field, descending
arr.sort(key=lambda x: -x[1])`,
          csharp: `arr = arr.OrderByDescending(x => x.Item2)
          .ToArray();`,
          typescript: `arr.sort((a, b) => b[1] - a[1]);`,
          rust: `arr.sort_by(|a, b| b.1.cmp(&a.1));
// or arr.sort_by_key(|x| x.1)`,
        },
      },
      {
        topic: 'min / max / sum',
        tone: tone('good', 'good', 'neutral', 'neutral'),
        code: {
          python: `mn = min(arr); mx = max(arr)
total = sum(arr)`,
          csharp: `int mn = arr.Min(), mx = arr.Max();
int total = arr.Sum();`,
          typescript: `const mn = Math.min(...arr);
const total = arr.reduce((a, b) => a + b, 0);`,
          rust: `let mn = *arr.iter().min().unwrap();
let total: i32 = arr.iter().sum();`,
        },
      },
      {
        topic: 'Reverse in place',
        tone: SAME,
        code: {
          python: `arr.reverse()       # in place
rev = arr[::-1]     # copy`,
          csharp: `Array.Reverse(arr);
list.Reverse();`,
          typescript: `arr.reverse();       // in place
const rev = [...arr].reverse();`,
          rust: `arr.reverse();       // in place`,
        },
      },
      {
        topic: 'any / all',
        tone: tone('good', 'good', 'neutral', 'good'),
        code: {
          python: `any(x > 0 for x in arr)
all(x > 0 for x in arr)`,
          csharp: `arr.Any(x => x > 0);
arr.All(x => x > 0);`,
          typescript: `arr.some(x => x > 0);
arr.every(x => x > 0);`,
          rust: `arr.iter().any(|&x| x > 0);
arr.iter().all(|&x| x > 0);`,
        },
      },
      {
        topic: 'Filter / map / comprehension',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `evens = [x for x in arr if x % 2 == 0]
squares = [x * x for x in arr]`,
          csharp: `var evens = arr.Where(x => x % 2 == 0);
var squares = arr.Select(x => x * x);`,
          typescript: `const evens = arr.filter(x => x % 2 === 0);
const squares = arr.map(x => x * x);`,
          rust: `let evens: Vec<_> =
    arr.iter().filter(|&&x| x % 2 == 0).collect();
let squares: Vec<_> = arr.iter().map(|x| x * x).collect();`,
        },
      },
    ],
  },
  {
    title: 'Conversions & numbers',
    rows: [
      {
        topic: 'Int <-> char (ASCII)',
        tone: tone('good', 'good', 'neutral', 'neutral'),
        code: {
          python: `code = ord('a')   # 97
ch = chr(97)      # 'a'`,
          csharp: `int code = (int)'a';
char ch = (char)97;`,
          typescript: `const code = 'a'.charCodeAt(0);
const ch = String.fromCharCode(97);`,
          rust: `let code = 'a' as u32;   // 97
let ch = 97u8 as char;   // 'a'`,
        },
      },
      {
        topic: 'String <-> number',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `n = int("42")
s = str(42)
f = float("3.14")`,
          csharp: `int n = int.Parse("42");
string s = 42.ToString();`,
          typescript: `const n = parseInt("42", 10);
const s = String(42);`,
          rust: `let n: i32 = "42".parse().unwrap();
let s = 42.to_string();`,
        },
      },
      {
        topic: 'Integer division & modulo',
        tone: tone('good', 'neutral', 'bad', 'good'),
        code: {
          python: `q = 7 // 2   # 3  (floor)
r = 7 % 2    # 1`,
          csharp: `int q = 7 / 2;  // 3 (truncates)
int r = 7 % 2;  // 1`,
          typescript: `const q = Math.trunc(7 / 2); // / is float!
const r = 7 % 2;`,
          rust: `let q = 7 / 2;  // 3
let r = 7 % 2;  // 1`,
        },
      },
      {
        topic: 'Infinity / sentinels',
        tone: SAME,
        code: {
          python: `INF = float('inf')
NEG = float('-inf')`,
          csharp: `double INF = double.PositiveInfinity;
int MAX = int.MaxValue;`,
          typescript: `const INF = Infinity;
const MAX = Number.MAX_SAFE_INTEGER;`,
          rust: `let inf = f64::INFINITY;
let max = i32::MAX;`,
        },
      },
      {
        topic: 'Math (abs, pow, sqrt, gcd)',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `abs(-5); pow(2, 10)
import math
math.isqrt(16); math.gcd(12, 8)`,
          csharp: `Math.Abs(-5); Math.Pow(2, 10);
Math.Sqrt(16);
// gcd: implement or use BigInteger.GreatestCommonDivisor`,
          typescript: `Math.abs(-5); Math.pow(2, 10);
Math.sqrt(16);
// no built-in gcd`,
          rust: `(-5i32).abs(); 2i32.pow(10);
(16f64).sqrt();
// gcd via crate or manual loop`,
        },
      },
      {
        topic: 'min / max with key',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `# element with largest 2nd field
best = max(arr, key=lambda x: x[1])`,
          csharp: `var best = arr
    .OrderByDescending(x => x.Item2)
    .First();`,
          typescript: `const best = arr.reduce((a, b) =>
  b[1] > a[1] ? b : a);`,
          rust: `let best = arr.iter()
    .max_by_key(|x| x.1).unwrap();`,
        },
      },
      {
        topic: 'Ceil division',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `import math
math.ceil(a / b)   # or -(-a // b)`,
          csharp: `(a + b - 1) / b;   // for positives`,
          typescript: `Math.ceil(a / b);`,
          rust: `a.div_ceil(b);     // (a + b - 1) / b`,
        },
      },
      {
        topic: 'Clamp value to range',
        tone: tone('good', 'good', 'bad', 'good'),
        code: {
          python: `y = max(lo, min(x, hi))`,
          csharp: `int y = Math.Clamp(x, lo, hi);`,
          typescript: `const y = Math.max(lo, Math.min(x, hi));`,
          rust: `let y = x.clamp(lo, hi);`,
        },
      },
    ],
  },
  {
    title: 'Expressions & null handling',
    rows: [
      {
        topic: 'Ternary / conditional',
        tone: SAME,
        code: {
          python: `y = "pos" if x > 0 else "neg"`,
          csharp: `var y = x > 0 ? "pos" : "neg";`,
          typescript: `const y = x > 0 ? "pos" : "neg";`,
          rust: `let y = if x > 0 { "pos" } else { "neg" };`,
        },
      },
      {
        topic: 'Null / None / Option',
        tone: tone('good', 'good', 'good', 'neutral'),
        code: {
          python: `if x is None: ...
y = x if x is not None else default`,
          csharp: `if (x == null) { }
var y = x ?? fallback;`,
          typescript: `if (x == null) { }
const y = x ?? fallback;`,
          rust: `match x { Some(v) => ..., None => ... }
let y = x.unwrap_or(fallback);`,
        },
      },
      {
        topic: 'Swap two values',
        tone: tone('good', 'good', 'good', 'bad'),
        code: {
          python: `a, b = b, a`,
          csharp: `(a, b) = (b, a);`,
          typescript: `[a, b] = [b, a];`,
          rust: `std::mem::swap(&mut a, &mut b);`,
        },
      },
      {
        topic: 'Membership / contains',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `if x in arr: ...
if key in d: ...`,
          csharp: `if (list.Contains(x)) { }
if (dict.ContainsKey(key)) { }`,
          typescript: `if (arr.includes(x)) { }
if (key in obj) { }`,
          rust: `if arr.contains(&x) { }
if map.contains_key(&key) { }`,
        },
      },
    ],
  },
  {
    title: 'Strings',
    rows: [
      {
        topic: 'Split / join',
        tone: SAME,
        code: {
          python: `parts = s.split(",")
joined = ",".join(parts)`,
          csharp: `var parts = s.Split(',');
string joined = string.Join(",", parts);`,
          typescript: `const parts = s.split(",");
const joined = parts.join(",");`,
          rust: `let parts: Vec<&str> = s.split(',').collect();
let joined = parts.join(",");`,
        },
      },
      {
        topic: 'Substring / char access',
        tone: tone('good', 'neutral', 'good', 'bad'),
        code: {
          python: `sub = s[1:4]
first = s[0]`,
          csharp: `string sub = s.Substring(1, 3);
char first = s[0];`,
          typescript: `const sub = s.substring(1, 4);
const first = s[0];`,
          rust: `let sub = &s[1..4];
let first = s.chars().next().unwrap();`,
        },
      },
      {
        topic: 'Contains / index / replace',
        tone: SAME,
        code: {
          python: `"b" in s
s.find("b")      # -1 if absent
s.replace("a", "b")`,
          csharp: `s.Contains("b");
s.IndexOf("b");
s.Replace("a", "b");`,
          typescript: `s.includes("b");
s.indexOf("b");
s.replaceAll("a", "b");`,
          rust: `s.contains("b");
s.find("b"); // Option<usize>
s.replace("a", "b");`,
        },
      },
      {
        topic: 'Char is alphanumeric (isalnum)',
        tone: tone('good', 'neutral', 'bad', 'good'),
        code: {
          python: `c.isalnum()   # letters or digits
c.isalpha()   # letters only`,
          csharp: `char.IsLetterOrDigit(c);
char.IsLetter(c);`,
          typescript: `/[a-zA-Z0-9]/.test(c); // no built-in
/[a-zA-Z]/.test(c);`,
          rust: `c.is_alphanumeric();
c.is_alphabetic();`,
        },
      },
      {
        topic: 'Char is digit / numeric (isdigit)',
        tone: tone('good', 'neutral', 'bad', 'good'),
        code: {
          python: `c.isdigit()          # '0'..'9'
int(c)               # char -> int`,
          csharp: `char.IsDigit(c);
int d = c - '0';`,
          typescript: `/[0-9]/.test(c); // or:
c >= '0' && c <= '9';`,
          rust: `c.is_ascii_digit();
c.to_digit(10);      // Option<u32>`,
        },
      },
      {
        topic: 'Char is upper / lower (isupper)',
        tone: tone('good', 'neutral', 'bad', 'good'),
        code: {
          python: `c.isupper()
c.islower()`,
          csharp: `char.IsUpper(c);
char.IsLower(c);`,
          typescript: `c === c.toUpperCase() && c !== c.toLowerCase();
c === c.toLowerCase() && c !== c.toUpperCase();`,
          rust: `c.is_uppercase();
c.is_lowercase();`,
        },
      },
      {
        topic: 'Upper / lower case string',
        tone: SAME,
        code: {
          python: `s.upper()
s.lower()`,
          csharp: `s.ToUpper();
s.ToLower();`,
          typescript: `s.toUpperCase();
s.toLowerCase();`,
          rust: `s.to_uppercase();
s.to_lowercase();`,
        },
      },
      {
        topic: 'Trim / strip whitespace',
        tone: SAME,
        code: {
          python: `s.strip()          # both ends
s.lstrip(); s.rstrip()`,
          csharp: `s.Trim();
s.TrimStart(); s.TrimEnd();`,
          typescript: `s.trim();
s.trimStart(); s.trimEnd();`,
          rust: `s.trim();
s.trim_start(); s.trim_end();`,
        },
      },
      {
        topic: 'Starts / ends with, count',
        tone: SAME,
        code: {
          python: `s.startswith("ab")
s.endswith("z")
s.count("a")`,
          csharp: `s.StartsWith("ab");
s.EndsWith("z");
s.Count(ch => ch == 'a');`,
          typescript: `s.startsWith("ab");
s.endsWith("z");
[...s].filter(ch => ch === "a").length;`,
          rust: `s.starts_with("ab");
s.ends_with("z");
s.matches('a').count();`,
        },
      },
      {
        topic: 'Repeat / build string',
        tone: tone('good', 'good', 'good', 'neutral'),
        code: {
          python: `"ab" * 3          # "ababab"
"".join(chars)`,
          csharp: `new string('a', 3);
new string(chars);`,
          typescript: `"ab".repeat(3);
chars.join("");`,
          rust: `"ab".repeat(3);
chars.iter().collect::<String>();`,
        },
      },
    ],
  },
  {
    title: 'Bit manipulation',
    rows: [
      {
        topic: 'Bitwise operators',
        tone: tone('good', 'good', 'neutral', 'good'),
        code: {
          python: `a & b; a | b; a ^ b; ~a
a << 1; a >> 1`,
          csharp: `a & b; a | b; a ^ b; ~a;
a << 1; a >> 1;`,
          typescript: `a & b; a | b; a ^ b; ~a;
a << 1; a >> 1; // 32-bit ints`,
          rust: `a & b; a | b; a ^ b; !a;
a << 1; a >> 1;`,
        },
      },
      {
        topic: 'Check / set / clear bit',
        tone: SAME,
        code: {
          python: `bit = (x >> i) & 1
x |= (1 << i)    # set
x &= ~(1 << i)   # clear`,
          csharp: `int bit = (x >> i) & 1;
x |= (1 << i);
x &= ~(1 << i);`,
          typescript: `const bit = (x >> i) & 1;
x |= (1 << i);
x &= ~(1 << i);`,
          rust: `let bit = (x >> i) & 1;
x |= 1 << i;
x &= !(1 << i);`,
        },
      },
      {
        topic: 'Count set bits',
        tone: tone('good', 'neutral', 'bad', 'good'),
        code: {
          python: `bin(x).count("1")
# or x.bit_count()  (3.10+)`,
          csharp: `System.Numerics.BitOperations
      .PopCount((uint)x);`,
          typescript: `let c = 0;
while (x) { c += x & 1; x >>>= 1; }`,
          rust: `x.count_ones();`,
        },
      },
    ],
  },
  {
    title: 'Hashing / Counter',
    rows: [
      {
        topic: 'Build frequency map',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `from collections import Counter
freq = Counter("aabbc")   # {'a':2,'b':2,'c':1}`,
          csharp: `var freq = new Dictionary<char, int>();
foreach (var c in "aabbc")
    freq[c] = freq.GetValueOrDefault(c) + 1;`,
          typescript: `const freq = new Map<string, number>();
for (const c of "aabbc")
  freq.set(c, (freq.get(c) ?? 0) + 1);`,
          rust: `use std::collections::HashMap;
let mut freq = HashMap::new();
for c in "aabbc".chars() { *freq.entry(c).or_insert(0) += 1; }`,
        },
      },
      {
        topic: 'Get with default',
        tone: tone('good', 'good', 'good', 'neutral'),
        code: {
          python: `count = freq.get(key, 0)`,
          csharp: `int count = freq.GetValueOrDefault(key, 0);`,
          typescript: `const count = freq.get(key) ?? 0;`,
          rust: `let count = *freq.get(&key).unwrap_or(&0);`,
        },
      },
      {
        topic: 'Group by / bucketed lists',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `from collections import defaultdict
groups = defaultdict(list)
groups[key].append(val)`,
          csharp: `var groups = new Dictionary<string, List<int>>();
if (!groups.ContainsKey(key))
    groups[key] = new List<int>();
groups[key].Add(val);`,
          typescript: `const groups = new Map<string, number[]>();
if (!groups.has(key)) groups.set(key, []);
groups.get(key)!.push(val);`,
          rust: `use std::collections::HashMap;
let mut groups: HashMap<String, Vec<i32>> = HashMap::new();
groups.entry(key).or_default().push(val);`,
        },
      },
    ],
  },
  {
    title: 'Binary search built-ins',
    rows: [
      {
        topic: 'Lower bound (bisect_left)',
        tone: tone('good', 'neutral', 'bad', 'good'),
        code: {
          python: `import bisect
i = bisect.bisect_left(arr, x)
# first index with arr[i] >= x`,
          csharp: `int i = Array.BinarySearch(arr, x);
if (i < 0) i = ~i;   // insertion point`,
          typescript: `// no built-in; hand-rolled:
let lo = 0, hi = arr.length;
while (lo < hi) {
  const m = (lo + hi) >> 1;
  if (arr[m] < x) lo = m + 1; else hi = m;
}`,
          rust: `let i = arr.partition_point(|&v| v < x);
// first index with arr[i] >= x`,
        },
      },
      {
        topic: 'Upper bound (bisect_right)',
        tone: tone('good', 'bad', 'bad', 'good'),
        code: {
          python: `import bisect
i = bisect.bisect_right(arr, x)
# first index with arr[i] > x`,
          csharp: `// first index with arr[i] > x
int lo = 0, hi = arr.Length;
while (lo < hi) {
    int m = (lo + hi) / 2;
    if (arr[m] <= x) lo = m + 1; else hi = m;
}`,
          typescript: `let lo = 0, hi = arr.length;
while (lo < hi) {
  const m = (lo + hi) >> 1;
  if (arr[m] <= x) lo = m + 1; else hi = m;
}`,
          rust: `let i = arr.partition_point(|&v| v <= x);
// first index with arr[i] > x`,
        },
      },
      {
        topic: 'Insert keeping sorted',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `import bisect
bisect.insort(arr, x)`,
          csharp: `int i = Array.BinarySearch(list.ToArray(), x);
if (i < 0) i = ~i;
list.Insert(i, x);`,
          typescript: `let lo = 0, hi = arr.length;
while (lo < hi) {
  const m = (lo + hi) >> 1;
  if (arr[m] < x) lo = m + 1; else hi = m;
}
arr.splice(lo, 0, x);`,
          rust: `let i = arr.partition_point(|&v| v < x);
arr.insert(i, x);`,
        },
      },
    ],
  },
  {
    title: 'Common idioms',
    rows: [
      {
        topic: 'Two-pointer skip non-alnum',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `while l < r and not s[l].isalnum():
    l += 1
while l < r and not s[r].isalnum():
    r -= 1`,
          csharp: `while (l < r && !char.IsLetterOrDigit(s[l])) l++;
while (l < r && !char.IsLetterOrDigit(s[r])) r--;`,
          typescript: `const ok = (c: string) => /[a-z0-9]/i.test(c);
while (l < r && !ok(s[l])) l++;
while (l < r && !ok(s[r])) r--;`,
          rust: `while l < r && !s[l].is_alphanumeric() { l += 1; }
while l < r && !s[r].is_alphanumeric() { r -= 1; }`,
        },
      },
      {
        topic: 'Grid neighbor directions',
        tone: SAME,
        code: {
          python: `for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
    nr, nc = r + dr, c + dc`,
          csharp: `int[][] dirs = {new[]{1,0},new[]{-1,0},
                new[]{0,1},new[]{0,-1}};
foreach (var d in dirs) { int nr=r+d[0], nc=c+d[1]; }`,
          typescript: `const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
for (const [dr, dc] of dirs) {
  const nr = r + dr, nc = c + dc;
}`,
          rust: `let dirs = [(1,0),(-1,0),(0,1),(0,-1)];
for (dr, dc) in dirs { let (nr, nc) = (r + dr, c + dc); }`,
        },
      },
      {
        topic: 'Memoization / cache',
        tone: tone('good', 'bad', 'bad', 'bad'),
        code: {
          python: `from functools import lru_cache
@lru_cache(maxsize=None)
def dp(i): ...`,
          csharp: `var memo = new Dictionary<int, int>();
int Dp(int i) {
    if (memo.TryGetValue(i, out var v)) return v;
    return memo[i] = /* compute */ 0;
}`,
          typescript: `const memo = new Map<number, number>();
function dp(i: number): number {
  if (memo.has(i)) return memo.get(i)!;
  const v = /* compute */ 0;
  memo.set(i, v); return v;
}`,
          rust: `use std::collections::HashMap;
let mut memo: HashMap<i32, i32> = HashMap::new();
// check memo.get(&i) before computing`,
        },
      },
      {
        topic: 'Prefix sum',
        tone: tone('good', 'neutral', 'neutral', 'neutral'),
        code: {
          python: `from itertools import accumulate
prefix = [0] + list(accumulate(arr))
# range sum [l, r) = prefix[r] - prefix[l]`,
          csharp: `var prefix = new int[arr.Length + 1];
for (int i = 0; i < arr.Length; i++)
    prefix[i + 1] = prefix[i] + arr[i];`,
          typescript: `const prefix = [0];
for (const x of arr)
  prefix.push(prefix[prefix.length - 1] + x);`,
          rust: `let mut prefix = vec![0; arr.len() + 1];
for i in 0..arr.len() {
    prefix[i + 1] = prefix[i] + arr[i];
}`,
        },
      },
    ],
  },
]
