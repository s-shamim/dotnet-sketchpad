# Algorithms & Data Structures for .NET Developers
## Compact Learning Guide with Prompts

> Each section has a prompt. Paste it to generate full content. Compact format — covers concept + .NET angle.

---

## Table of Contents

1. [Foundations](#1-foundations)
   - 1.1 [Why Algorithms Matter](#11-why-algorithms-matter)
   - 1.2 [Big-O Notation](#12-big-o-notation)
   - 1.3 [Time vs Space Complexity](#13-time-vs-space-complexity)
   - 1.4 [Best / Average / Worst Case](#14-best--average--worst-case)
   - 1.5 [Amortized Analysis](#15-amortized-analysis)
   - 1.6 [Recursion & the Call Stack](#16-recursion--the-call-stack)
   - 1.7 [Iteration vs Recursion in .NET](#17-iteration-vs-recursion-in-net)
   - 1.8 [Benchmarking Algorithms with BenchmarkDotNet](#18-benchmarking-with-benchmarkdotnet)

2. [Arrays & Strings](#2-arrays--strings)
   - 2.1 [Array Internals & Cache Behavior](#21-array-internals)
   - 2.2 [Two-Pointer Technique](#22-two-pointer-technique)
   - 2.3 [Sliding Window](#23-sliding-window)
   - 2.4 [Prefix Sums](#24-prefix-sums)
   - 2.5 [Kadane's Algorithm — Max Subarray](#25-kadanes-algorithm)
   - 2.6 [String Searching — Naive, KMP, Boyer-Moore](#26-string-searching)
   - 2.7 [Span-Based Array & String Algorithms in .NET](#27-span-based-algorithms)

3. [Linked Lists](#3-linked-lists)
   - 3.1 [Singly & Doubly Linked Lists](#31-singly--doubly-linked-lists)
   - 3.2 [Fast & Slow Pointer (Floyd's Cycle Detection)](#32-fast--slow-pointer)
   - 3.3 [Reversing a Linked List](#33-reversing-a-linked-list)
   - 3.4 [Merge Two Sorted Lists](#34-merge-two-sorted-lists)
   - 3.5 [LinkedList\<T\> in .NET — When to Actually Use It](#35-linkedlistt-in-net)

4. [Stacks & Queues](#4-stacks--queues)
   - 4.1 [Stack — LIFO, Uses, Implementation](#41-stack)
   - 4.2 [Queue — FIFO, Circular Buffer](#42-queue)
   - 4.3 [Monotonic Stack](#43-monotonic-stack)
   - 4.4 [Deque (Double-Ended Queue)](#44-deque)
   - 4.5 [Priority Queue — Min/Max Heap](#45-priority-queue)
   - 4.6 [Stack\<T\>, Queue\<T\>, PriorityQueue\<T,P\> in .NET](#46-net-stack-queue-priorityqueue)

5. [Hash Tables & Sets](#5-hash-tables--sets)
   - 5.1 [Hash Table Internals — Buckets, Load Factor, Collision Resolution](#51-hash-table-internals)
   - 5.2 [Open Addressing vs Separate Chaining](#52-open-vs-separate-chaining)
   - 5.3 [Hash Functions — Distribution & Avalanche](#53-hash-functions)
   - 5.4 [Hash-Based Problem Patterns (frequency count, two-sum, grouping)](#54-hash-patterns)
   - 5.5 [Dictionary\<K,V\>, HashSet\<T\>, FrozenDictionary in .NET](#55-net-hash-collections)
   - 5.6 [Custom IEqualityComparer\<T\>](#56-custom-iequalitycomparer)

6. [Trees](#6-trees)
   - 6.1 [Binary Tree — Structure, Traversals (In/Pre/Post/Level-Order)](#61-binary-tree-traversals)
   - 6.2 [Binary Search Tree (BST) — Insert, Search, Delete](#62-binary-search-tree)
   - 6.3 [BST Balance — Why It Matters](#63-bst-balance)
   - 6.4 [AVL Tree — Rotations & Balance Factor](#64-avl-tree)
   - 6.5 [Red-Black Tree — Properties & Use in .NET](#65-red-black-tree)
   - 6.6 [Segment Tree — Range Queries & Updates](#66-segment-tree)
   - 6.7 [Fenwick Tree (Binary Indexed Tree)](#67-fenwick-tree)
   - 6.8 [Trie (Prefix Tree) — Autocomplete, Spell Check](#68-trie)
   - 6.9 [SortedDictionary\<K,V\>, SortedSet\<T\> in .NET](#69-net-sorted-collections)

7. [Heaps](#7-heaps)
   - 7.1 [Binary Heap — Min/Max, Heapify, Heap Property](#71-binary-heap)
   - 7.2 [Heap Sort](#72-heap-sort)
   - 7.3 [K-th Largest/Smallest Element Pattern](#73-kth-element-pattern)
   - 7.4 [Merge K Sorted Lists Using Heap](#74-merge-k-sorted-lists)
   - 7.5 [PriorityQueue\<T,P\> in .NET 6+](#75-priorityqueue-in-net)

8. [Sorting Algorithms](#8-sorting-algorithms)
   - 8.1 [Bubble, Selection, Insertion Sort — O(n²)](#81-quadratic-sorts)
   - 8.2 [Merge Sort — Divide & Conquer, Stable, O(n log n)](#82-merge-sort)
   - 8.3 [Quick Sort — Pivot, Partition, O(n log n) average](#83-quick-sort)
   - 8.4 [Heap Sort — In-Place, O(n log n)](#84-heap-sort)
   - 8.5 [Counting Sort, Radix Sort, Bucket Sort — O(n)](#85-linear-sorts)
   - 8.6 [Tim Sort — .NET's Array.Sort() Algorithm](#86-timsort)
   - 8.7 [Sorting in .NET — Array.Sort, LINQ OrderBy, IComparer\<T\>](#87-sorting-in-net)
   - 8.8 [Stable vs Unstable Sort](#88-stable-vs-unstable)

9. [Searching Algorithms](#9-searching-algorithms)
   - 9.1 [Linear Search — O(n)](#91-linear-search)
   - 9.2 [Binary Search — O(log n), Preconditions](#92-binary-search)
   - 9.3 [Binary Search Variants (first/last occurrence, rotated array)](#93-binary-search-variants)
   - 9.4 [Interpolation & Exponential Search](#94-interpolation-exponential-search)
   - 9.5 [Binary Search in .NET — Array.BinarySearch, Span.BinarySearch](#95-binary-search-in-net)

10. [Graph Algorithms — Fundamentals](#10-graph-fundamentals)
    - 10.1 [Graph Representations — Adjacency List, Matrix, Edge List](#101-graph-representations)
    - 10.2 [BFS — Breadth-First Search](#102-bfs)
    - 10.3 [DFS — Depth-First Search](#103-dfs)
    - 10.4 [Topological Sort (Kahn's & DFS-based)](#104-topological-sort)
    - 10.5 [Cycle Detection — Directed & Undirected](#105-cycle-detection)
    - 10.6 [Connected Components & Union-Find (Disjoint Set Union)](#106-union-find)
    - 10.7 [Graphs in .NET — No Built-in, Practical Implementations](#107-graphs-in-net)

11. [Graph Algorithms — Shortest Paths](#11-shortest-paths)
    - 11.1 [Dijkstra's Algorithm — Single-Source, Non-Negative Weights](#111-dijkstra)
    - 11.2 [Bellman-Ford — Negative Weights & Cycle Detection](#112-bellman-ford)
    - 11.3 [Floyd-Warshall — All-Pairs Shortest Path](#113-floyd-warshall)
    - 11.4 [A* Search — Heuristic-Guided Pathfinding](#114-a-star)
    - 11.5 [BFS for Unweighted Shortest Path](#115-bfs-shortest-path)

12. [Graph Algorithms — Advanced](#12-advanced-graph-algorithms)
    - 12.1 [Minimum Spanning Tree — Kruskal's & Prim's](#121-minimum-spanning-tree)
    - 12.2 [Strongly Connected Components — Kosaraju's & Tarjan's](#122-scc)
    - 12.3 [Bipartite Graph Detection](#123-bipartite-detection)
    - 12.4 [Network Flow — Ford-Fulkerson, Max-Flow Min-Cut](#124-network-flow)

13. [Dynamic Programming](#13-dynamic-programming)
    - 13.1 [DP Fundamentals — Overlapping Subproblems & Optimal Substructure](#131-dp-fundamentals)
    - 13.2 [Memoization (Top-Down) vs Tabulation (Bottom-Up)](#132-memoization-vs-tabulation)
    - 13.3 [Classic 1D DP Problems (Fibonacci, Climbing Stairs, House Robber)](#133-1d-dp)
    - 13.4 [Classic 2D DP Problems (Grid Paths, LCS, Edit Distance)](#134-2d-dp)
    - 13.5 [Knapsack — 0/1, Unbounded, Bounded](#135-knapsack)
    - 13.6 [Longest Increasing Subsequence (LIS) — O(n log n)](#136-lis)
    - 13.7 [Interval DP & String DP](#137-interval-string-dp)
    - 13.8 [DP on Trees & Graphs](#138-dp-on-trees-graphs)
    - 13.9 [DP in .NET — Memoization with Dictionary, Span for Tabulation](#139-dp-in-net)

14. [Greedy Algorithms](#14-greedy-algorithms)
    - 14.1 [Greedy Strategy — When It Works & When It Doesn't](#141-greedy-strategy)
    - 14.2 [Activity Selection / Interval Scheduling](#142-interval-scheduling)
    - 14.3 [Huffman Coding (revisited as greedy)](#143-huffman-as-greedy)
    - 14.4 [Coin Change (Greedy vs DP)](#144-coin-change)
    - 14.5 [Dijkstra as Greedy](#145-dijkstra-as-greedy)

15. [Divide & Conquer](#15-divide--conquer)
    - 15.1 [D&C Pattern — Split, Recurse, Merge](#151-dc-pattern)
    - 15.2 [Merge Sort as D&C](#152-merge-sort-dc)
    - 15.3 [Binary Search as D&C](#153-binary-search-dc)
    - 15.4 [Fast Exponentiation (Exponentiation by Squaring)](#154-fast-exponentiation)
    - 15.5 [Karatsuba Multiplication](#155-karatsuba)
    - 15.6 [Closest Pair of Points](#156-closest-pair)

16. [Backtracking](#16-backtracking)
    - 16.1 [Backtracking Pattern — Try, Recurse, Undo](#161-backtracking-pattern)
    - 16.2 [Permutations & Combinations](#162-permutations-combinations)
    - 16.3 [Subsets / Power Set](#163-subsets)
    - 16.4 [N-Queens Problem](#164-n-queens)
    - 16.5 [Sudoku Solver](#165-sudoku-solver)
    - 16.6 [Word Search on a Grid](#166-word-search)
    - 16.7 [Backtracking in .NET — Stack vs Recursion, Pruning](#167-backtracking-in-net)

17. [Advanced Data Structures](#17-advanced-data-structures)
    - 17.1 [Skip List — Probabilistic Sorted Structure](#171-skip-list)
    - 17.2 [Bloom Filter — Probabilistic Set Membership](#172-bloom-filter)
    - 17.3 [HyperLogLog — Approximate Cardinality](#173-hyperloglog)
    - 17.4 [LRU Cache — Design & Implementation](#174-lru-cache)
    - 17.5 [LFU Cache](#175-lfu-cache)
    - 17.6 [Disjoint Set Union (Union-Find) with Path Compression & Union by Rank](#176-dsu-advanced)
    - 17.7 [Monotonic Queue & Deque](#177-monotonic-queue)
    - 17.8 [Sparse Table — O(1) Range Min/Max Queries](#178-sparse-table)

18. [String Algorithms](#18-string-algorithms)
    - 18.1 [KMP — Knuth-Morris-Pratt Pattern Matching](#181-kmp)
    - 18.2 [Rabin-Karp — Rolling Hash String Search](#182-rabin-karp)
    - 18.3 [Z-Algorithm](#183-z-algorithm)
    - 18.4 [Manacher's Algorithm — Longest Palindromic Substring in O(n)](#184-manachers)
    - 18.5 [Suffix Arrays & Suffix Trees](#185-suffix-arrays)
    - 18.6 [Edit Distance (Levenshtein) — Full DP Solution](#186-edit-distance)
    - 18.7 [String Algorithms in .NET — MemoryExtensions, Regex, Span](#187-string-algorithms-net)

19. [Mathematical Algorithms](#19-mathematical-algorithms)
    - 19.1 [GCD & LCM — Euclidean Algorithm](#191-gcd-lcm)
    - 19.2 [Sieve of Eratosthenes — Prime Numbers](#192-sieve)
    - 19.3 [Modular Arithmetic — ModPow, ModInverse](#193-modular-arithmetic)
    - 19.4 [Fast Exponentiation](#194-fast-exp)
    - 19.5 [Combinatorics — nCr, Factorials, Pascal's Triangle](#195-combinatorics)
    - 19.6 [Bit Manipulation Tricks (revisited as algorithms)](#196-bit-tricks)
    - 19.7 [Math Algorithms in .NET — BigInteger, Math, MathF](#197-math-in-net)

20. [Algorithm Design in .NET Context](#20-algorithm-design-in-net)
    - 20.1 [LINQ as Algorithm Primitives — Performance Tradeoffs](#201-linq-performance)
    - 20.2 [IEnumerable vs ICollection vs IList — Choosing the Right Abstraction](#202-collection-abstractions)
    - 20.3 [Immutable Collections in .NET](#203-immutable-collections)
    - 20.4 [Concurrent Collections — ConcurrentDictionary, ConcurrentQueue, etc.](#204-concurrent-collections)
    - 20.5 [Memory-Efficient Algorithms with Span\<T\> & ArrayPool](#205-memory-efficient-algorithms)
    - 20.6 [Parallel Algorithms — PLINQ, Parallel.For, Parallel.ForEachAsync](#206-parallel-algorithms)
    - 20.7 [Channel\<T\> — Producer/Consumer Pipelines](#207-channel-pipelines)

---

## Section Prompts

### 1. Foundations

#### 1.1 Why Algorithms Matter
```
Explain why algorithms matter for .NET developers beyond interviews: real examples of algorithm choice affecting production performance (wrong sort on hot path, linear search on large collection, O(n²) string concat). Show that List.Contains is O(n) but HashSet.Contains is O(1). Explain how knowing complexity guides collection choice. Keep it practical, skip theory-for-theory's-sake.
```

#### 1.2 Big-O Notation
```
Teach Big-O notation concisely: definition (upper bound on growth rate as n→∞), common classes (O(1), O(log n), O(n), O(n log n), O(n²), O(2^n), O(n!)), how to derive Big-O from code (count loops, recursive calls). Include a complexity cheat sheet table. Show examples in C# — what makes a LINQ query O(n²). Cover drop constants and lower-order terms rule. Skip formal proofs.
```

#### 1.3 Time vs Space Complexity
```
Explain time vs space complexity trade-off with concrete .NET examples: caching computed values to trade memory for speed (memoization), using a HashSet to trade memory for O(1) lookup, sorting in-place vs with auxiliary array. Cover auxiliary space vs total space. Show the space complexity of common .NET operations (recursion stack depth = O(depth) space). Include a trade-off decision guide.
```

#### 1.4 Best / Average / Worst Case
```
Explain best/average/worst case with examples: QuickSort (best O(n log n), worst O(n²) with bad pivot), Dictionary lookup (best/average O(1), worst O(n) with all collisions), binary search (best O(1), worst O(log n)). Explain why worst-case matters for reliability and average-case for practical performance. Cover how .NET's Dictionary handles worst-case (randomized hash seed since .NET Core to prevent hash flooding attacks).
```

#### 1.5 Amortized Analysis
```
Explain amortized analysis: the average cost per operation over a sequence, even if individual ops vary. Cover List<T> dynamic array growth (individual Add is O(n) when resizing, but amortized O(1) because doubling strategy spreads cost). Cover StringBuilder similarly. Show the accounting method intuitively. Include Stack with multipop as another example. Show how to use EnsureCapacity() in .NET to avoid amortized cost when size is known upfront.
```

#### 1.6 Recursion & the Call Stack
```
Explain recursion and the call stack: each recursive call adds a stack frame (local vars + return address), stack depth limit (~10,000 frames typical on .NET before StackOverflowException), base cases, and the risk of infinite recursion. Show factorial, Fibonacci, and tree traversal as examples. Explain tail recursion (no .NET TCO guarantee — mention). Show StackOverflowException is non-recoverable in .NET and how to convert deep recursion to iteration with an explicit stack.
```

#### 1.7 Iteration vs Recursion in .NET
```
Show how to convert recursive algorithms to iterative using an explicit Stack<T>: DFS tree traversal recursive → iterative, recursive fibonacci → iterative with two variables, recursive merge sort → iterative (bottom-up). Explain when recursion is fine (shallow depth, clarity > perf) vs when to convert (deep recursion, hot path). Cover that .NET 7+ has no tail-call optimization guarantee (unlike F#). Show the iterative DFS with Stack<T> pattern fully.
```

#### 1.8 Benchmarking with BenchmarkDotNet
```
Show how to benchmark algorithm comparisons in .NET using BenchmarkDotNet: comparing O(n) vs O(log n) search, measuring List<T>.Contains vs HashSet<T>.Contains at various n, using [Params] for input size sweep, plotting results. Cover common mistakes: benchmarking in Debug mode, not warming up, measuring in a tight loop without preventing dead-code elimination. Show how to interpret mean/median/alloc output. Include a concrete before/after showing algorithm improvement measured properly.
```

---

### 2. Arrays & Strings

#### 2.1 Array Internals
```
Explain arrays in .NET at the memory level relevant to algorithms: contiguous memory → cache-friendly sequential access, O(1) index access, O(n) insert/delete (shift), bounds check elimination by JIT in simple loops. Cover multidimensional T[,] (row-major, cache-friendly row iteration) vs jagged T[][] (pointer indirection, cache miss per row). Show Span<T> for zero-copy array slicing in algorithms. Cover CollectionsMarshal.AsSpan(list) to get List<T> backing array as span.
```

#### 2.2 Two-Pointer Technique
```
Explain the two-pointer technique: two indices moving through array, O(n) instead of O(n²) brute force. Cover patterns: opposite ends (palindrome check, two-sum in sorted array, container with most water), same direction (remove duplicates in-place, move zeros), and fast/slow (linked list cycle). Show 4-5 C# implementations. Explain precondition (usually sorted array or specific structure). Include when two-pointer doesn't work.
```

#### 2.3 Sliding Window
```
Explain sliding window: maintain a window [left, right] expanding/shrinking to satisfy a condition, O(n) instead of O(n²) for subarray problems. Cover fixed-size window (max sum of k elements) and variable-size window (longest substring without repeating chars, minimum window substring). Show C# implementations. Explain the expand-right/shrink-left pattern. Cover using Dictionary/HashSet inside the window for character frequency tracking.
```

#### 2.4 Prefix Sums
```
Explain prefix sums: precompute cumulative sums so range sum queries become O(1) instead of O(n). Show prefix[i] = prefix[i-1] + arr[i], range sum = prefix[r] - prefix[l-1]. Extend to 2D prefix sums for matrix range queries. Cover difference arrays (range update in O(1), query in O(n)). Show C# implementations. Cover use cases: running totals, range frequency queries, subarray sum equals k (with HashMap). Connect to .NET's LINQ Aggregate/Scan pattern.
```

#### 2.5 Kadane's Algorithm
```
Explain Kadane's algorithm for maximum subarray sum: O(n), single pass, track current_sum and max_sum. Show the state machine: extend current subarray or start new one (max(arr[i], current_sum + arr[i])). Cover variants: max product subarray, circular array max sum. Show C# implementation. Explain why greedy works here (optimal substructure of the subproblem). Extend to returning the subarray indices, not just the sum.
```

#### 2.6 String Searching
```
Cover string searching algorithms: Naive O(n*m), KMP O(n+m) with failure function, Boyer-Moore O(n/m) average with bad-character and good-suffix heuristics, and Rabin-Karp O(n+m) average with rolling hash. Explain when each is appropriate. Show KMP failure function computation and search in C#. Cover .NET's built-in string.IndexOf (uses a variant of Boyer-Moore-Horspool), Span.IndexOf (SIMD-accelerated). Show when to use Regex vs manual search.
```

#### 2.7 Span-Based Algorithms
```
Show how to implement common array/string algorithms using Span<T> and ReadOnlySpan<char> in .NET for zero-allocation processing: in-place two-pointer on Span<int>, sliding window on ReadOnlySpan<char> without string allocation, binary search on ReadOnlySpan<T> using MemoryExtensions.BinarySearch, and splitting a string into tokens with MemoryExtensions.Split. Benchmark Span-based vs string/array-based implementations showing allocation difference.
```

---

### 3. Linked Lists

#### 3.1 Singly & Doubly Linked Lists
```
Explain singly (next pointer only) and doubly linked lists (prev + next) at the implementation level: node struct, head/tail pointers, O(1) insert/delete at known position, O(n) search, O(n) access by index. Show C# node class and basic operations. Cover memory: each node = separate heap allocation → cache-unfriendly traversal. Show why .NET's LinkedList<T> is a doubly linked list. Cover when linked lists beat arrays: O(1) insert at cursor position, frequent mid-list modification.
```

#### 3.2 Fast & Slow Pointer
```
Explain Floyd's cycle detection (tortoise & hare): fast pointer moves 2 steps, slow moves 1, they meet iff cycle exists. Show cycle detection, finding cycle start (reset one pointer to head, advance both by 1), and cycle length. Extend to: find middle of linked list (fast reaches end when slow is at middle), check if linked list is palindrome (find middle, reverse second half, compare). Show C# implementations. Cover applications beyond linked lists: detecting cycles in functional sequences.
```

#### 3.3 Reversing a Linked List
```
Explain in-place linked list reversal: iterative (three-pointer: prev, curr, next — O(n) time, O(1) space) and recursive (O(n) time, O(n) space on call stack). Show C# implementations. Cover variants: reverse between positions L and R, reverse in groups of K, check palindrome using reversal. Explain why in-place reversal is a common technique: appears in many harder problems as a sub-step. Show how understanding this builds intuition for other pointer manipulation problems.
```

#### 3.4 Merge Two Sorted Lists
```
Show merging two sorted linked lists into one sorted list: iterative (dummy head node simplifies edge cases, compare heads, advance winner) O(n+m) time O(1) space. Show recursive version O(n+m) time O(n+m) space. Extend to merge K sorted lists using a min-heap (PriorityQueue<T,P>): O(n log k) time. Show C# implementations. Explain why dummy head node is a key technique for cleaner linked list code (avoids special-casing empty/head).
```

#### 3.5 LinkedList\<T\> in .NET
```
Explain .NET's LinkedList<T>: doubly linked list, O(1) AddFirst/AddLast/Remove(node), O(n) Find, LinkedListNode<T> gives O(1) insert before/after. Show real use cases: LRU cache implementation (LinkedList + Dictionary for O(1) all operations), undo/redo buffer, playlist. Benchmark LinkedList<T> vs List<T> traversal to show cache miss cost. Explain when LinkedList<T> is actually worth it vs always defaulting to List<T>.
```

---

### 4. Stacks & Queues

#### 4.1 Stack
```
Explain stack (LIFO): push, pop, peek, O(1) all ops. Cover use cases: function call stack, DFS traversal, undo/redo, expression parsing (balanced parentheses, evaluate postfix), backtracking. Show C# implementation with Stack<T>. Show classic problems: valid parentheses, daily temperatures, next greater element. Explain why stack is the natural data structure for DFS and recursive-to-iterative conversions.
```

#### 4.2 Queue
```
Explain queue (FIFO): enqueue, dequeue, peek, O(1) all ops with circular buffer. Cover use cases: BFS traversal, task scheduling, sliding window maximum, rate limiting. Show C# Queue<T>. Cover circular buffer implementation (avoids O(n) shift on dequeue). Show BFS with Queue<T> for shortest path in unweighted graph. Explain why queue is natural for BFS and level-order tree traversal.
```

#### 4.3 Monotonic Stack
```
Explain monotonic stack: stack that maintains elements in monotonically increasing or decreasing order. Show the pattern: iterate array, while stack top violates monotonicity pop and process, then push current. Cover problems: next greater element, largest rectangle in histogram, trapping rain water, daily temperatures. Show O(n) amortized analysis (each element pushed/popped at most once). Implement 3 problems in C# with Stack<int> (storing indices, not values).
```

#### 4.4 Deque
```
Explain deque (double-ended queue): O(1) push/pop at both ends. Cover use cases: sliding window maximum (maintain indices of useful elements), palindrome check, BFS with priority. Show sliding window maximum with deque: maintain decreasing deque of indices, pop front when out of window, pop back while back < current — O(n) total. Show C# with LinkedList<T> as deque or the dedicated Deque pattern. Cover .NET 9's new Deque<T> if available.
```

#### 4.5 Priority Queue
```
Explain priority queue / binary heap: min-heap (parent ≤ children), O(log n) insert and extract-min, O(1) peek-min, O(n) build from array (heapify). Cover use cases: Dijkstra, merge K sorted lists, top K elements, median of stream (two heaps trick). Show max-heap via negating priorities. Cover heap sort as a side effect of understanding heaps.
```

#### 4.6 .NET Stack, Queue, PriorityQueue
```
Comprehensive guide to .NET's built-in Stack<T>, Queue<T>, PriorityQueue<TElement, TPriority> (.NET 6+). Cover Stack<T> internals (backed by T[]), Queue<T> internals (circular buffer T[]), PriorityQueue<T,P> internals (quaternary heap for cache efficiency). Show PriorityQueue custom comparer via constructor. Cover thread-safe alternatives: ConcurrentStack<T>, ConcurrentQueue<T>. Explain why PriorityQueue<T,P> uses separate element and priority (allows changing priority). Show Enqueue, Dequeue, Peek, EnqueueDequeue.
```

---

### 5. Hash Tables & Sets

#### 5.1 Hash Table Internals
```
Explain hash table internals: hash function maps key to bucket index (hash % capacity), collision handling (separate chaining or open addressing), load factor (entries/capacity), rehashing when load factor exceeds threshold (typically 0.75). Show that .NET's Dictionary<K,V> uses open addressing (entries array + buckets array). Explain why a bad hash function degrades O(1) to O(n). Cover the hash flooding attack and .NET's randomized string hash seed defense.
```

#### 5.2 Open vs Separate Chaining
```
Compare open addressing (linear probing, quadratic probing, double hashing — all stored in one array, cache-friendly) and separate chaining (each bucket is a list — handles high load well, wastes pointer memory). Show .NET Dictionary uses a hybrid: entries stored in flat array (cache-friendly), buckets are indices into entries array. Cover clustering in linear probing. Explain why .NET switched from chaining to open addressing for cache performance. Show deletion tombstone issue in open addressing.
```

#### 5.3 Hash Functions
```
Cover hash function requirements for hash tables: determinism, uniformity, avalanche (small input change → large output change), speed. Show why string.GetHashCode() changes between process runs (.NET Core randomization). Cover FNV-1a, xxHash, and Fibonacci hashing (multiply by golden ratio) for integer keys. Explain hash code combining for composite keys. Show the danger of using only XOR to combine hashes (XOR is commutative — order-insensitive, bad for (a,b) vs (b,a)). Show HashCode.Combine() as the correct approach.
```

#### 5.4 Hash-Based Patterns
```
Cover the most common hash table algorithm patterns: frequency count (count occurrences of each element), two-sum (store complements in HashSet), grouping (group anagrams, group by property), seen-before tracking (duplicate detection, cycle detection), and prefix sum + HashMap (subarray sum = k). Show C# implementations. Explain that most "O(n) with extra space" solutions use a hash map to avoid nested loops. Cover when to use Dictionary vs HashSet.
```

#### 5.5 .NET Hash Collections
```
Comprehensive guide to .NET hash-based collections: Dictionary<K,V> (key-value, O(1) average), HashSet<T> (set operations: UnionWith, IntersectWith, ExceptWith, IsSubsetOf, O(n) for set ops), FrozenDictionary<K,V> (.NET 8+, immutable, faster lookups via perfect hashing), FrozenSet<T>, OrderedDictionary (preserves insertion order, .NET 8+). Cover CollectionsMarshal.GetValueRefOrAddDefault for zero-lookup-then-update. Show performance characteristics and when to use each.
```

#### 5.6 Custom IEqualityComparer\<T\>
```
Show how to implement custom IEqualityComparer<T> for Dictionary/HashSet: when needed (case-insensitive string keys, value-equality for classes, tuple keys), implementing Equals and GetHashCode correctly (if Equals returns true, GetHashCode must return same value). Show StringComparer.OrdinalIgnoreCase as a built-in example. Cover EqualityComparer<T>.Default. Show a custom comparer for a Point struct comparing by distance-from-origin. Include unit tests for the comparer contract.
```

---

### 6. Trees

#### 6.1 Binary Tree Traversals
```
Explain binary tree structure (left, right, value) and all traversals: In-order (left→root→right → sorted order for BST), Pre-order (root→left→right → copy/serialize tree), Post-order (left→right→root → delete tree, evaluate expression), Level-order/BFS (level by level → find level, zigzag traversal). Show recursive and iterative C# implementations. Cover Morris traversal (O(1) space in-order using threaded pointers). Explain which traversal to use for which problems.
```

#### 6.2 Binary Search Tree
```
Explain BST property: left subtree values < node < right subtree. Show insert (O(log n) average), search (O(log n) average), and delete (three cases: leaf, one child, two children → replace with in-order successor). Explain that in-order traversal of BST gives sorted sequence. Cover validation (check BST property is maintained through subtree, not just parent). Show C# implementation. Cover BST problems: lowest common ancestor, kth smallest element, BST to sorted doubly linked list.
```

#### 6.3 BST Balance
```
Explain why BST balance matters: sorted input → O(n) degenerate BST (linked list), random input → O(log n). Show how balanced BSTs maintain O(log n) height. Cover height vs balance factor. Explain that unbalanced BST is a common interview trap. Motivate AVL and Red-Black trees. Show height calculation and balance factor check in C#. Cover the concept of self-balancing without going into rotation details (save for AVL).
```

#### 6.4 AVL Tree
```
Explain AVL tree: self-balancing BST where |height(left) - height(right)| ≤ 1 for every node. Cover balance factor calculation, the four rotation cases (LL, RR, LR, RL — single and double rotations), and when each triggers. Walk through an insertion that causes rebalancing. Show O(log n) guaranteed height. Implement rotations in C#. Explain why AVL is more strictly balanced than Red-Black (faster lookups, slower insertions). Cover where AVL is used: database indexes, in-memory sorted maps.
```

#### 6.5 Red-Black Tree
```
Explain Red-Black tree: 5 properties (root is black, no two consecutive reds, equal black-height on all paths, etc.), why it's less strictly balanced than AVL (up to 2x height difference), fewer rotations on insert/delete → preferred for frequent updates. Explain that .NET's SortedDictionary<K,V> and SortedSet<T> are Red-Black trees internally. Show the invariants and recoloring concept without full implementation. Explain why Red-Black is preferred in practice (Java TreeMap, C++ std::map, .NET SortedDictionary).
```

#### 6.6 Segment Tree
```
Explain segment tree: tree where each node stores aggregate (sum, min, max) of a range of the array. Build in O(n), point update in O(log n), range query in O(log n). Show array representation (1-indexed, node i has children 2i and 2i+1). Implement range sum query with point update in C#. Extend to lazy propagation (deferred range updates). Cover use cases: range minimum query, range sum, range maximum, frequency queries. Show why segment tree beats prefix sum when updates are needed.
```

#### 6.7 Fenwick Tree
```
Explain Fenwick tree (Binary Indexed Tree): simpler than segment tree, prefix sum with point update both O(log n), uses bit manipulation (parent of i = i - (i & -i), next of i = i + (i & -i)), O(n) space. Show implementation in C# (add, prefix_sum, range_sum). Compare to segment tree: Fenwick is simpler code, less memory, only works for invertible operations (sum, XOR — not min/max without modification). Show order-of-magnitude smaller constant than segment tree. Use case: counting inversions, rank queries.
```

#### 6.8 Trie
```
Explain trie (prefix tree): each node = one character, path from root to node = prefix, O(m) insert/search where m = string length. Cover use cases: autocomplete, spell check, IP routing (binary trie), word search. Show implementation with TrieNode (Dictionary<char, TrieNode> or char[26] for lowercase letters). Cover compressed trie (radix tree) to save space. Show counting words with prefix, finding all words matching pattern. Implement in C# with insert and search.
```

#### 6.9 .NET Sorted Collections
```
Cover .NET's sorted collections: SortedDictionary<K,V> (Red-Black tree, O(log n) all ops, ordered iteration), SortedList<K,V> (sorted array, O(log n) lookup via binary search, O(n) insert, better cache but worse modification), SortedSet<T> (Red-Black tree set, GetViewBetween for range queries). Compare with Dictionary (unsorted, O(1) vs sorted O(log n)). Show when to use each: SortedDictionary for frequent updates + ordered iteration, SortedList for mostly-read sorted data, SortedSet for set operations on ordered data.
```

---

### 7. Heaps

#### 7.1 Binary Heap
```
Explain binary heap: complete binary tree stored in array (parent at i, children at 2i+1, 2i+2), min-heap property (parent ≤ children). Cover heapify-up (insert — bubble up) O(log n), heapify-down (extract-min — sink down) O(log n), build heap from array O(n) (heapify-down from n/2 to 0 — not O(n log n)). Show array representation. Implement min-heap in C# from scratch. Cover max-heap via negation. Show heap invariant maintenance visually with an example.
```

#### 7.2 Heap Sort
```
Explain heap sort: build max-heap O(n), repeatedly extract-max and place at end O(n log n). Total O(n log n) in-place, O(1) extra space. Show C# implementation. Explain why heap sort isn't used in practice despite good complexity: poor cache performance (heap accesses jump around in memory), worse constant than quicksort. Cover why knowing heap sort matters (shows understanding of heaps + shows in-place O(n log n) exists).
```

#### 7.3 K-th Element Pattern
```
Show the heap pattern for top-K / K-th element problems: K-th largest element using min-heap of size K (maintain K largest seen), K-th smallest using max-heap, top K frequent elements (heap of (count, element) pairs). Explain why min-heap for top-K (the heap keeps the K largest, root = K-th largest). Show O(n log k) time vs O(n log n) sort. Implement in C# with PriorityQueue<T,P>. Cover QuickSelect for O(n) average K-th element without heap.
```

#### 7.4 Merge K Sorted Lists
```
Show merging K sorted lists/arrays using a min-heap: push (value, list_index, element_index) for each list's first element, extract-min, push next from same list. O(n log k) where n = total elements. Show C# with PriorityQueue<(int val, int li, int ei), int>. Cover merge K sorted files (external sort), merge K sorted iterables. Extend to "smallest range covering K lists" problem. Explain why heap is better than sorting all (O(n log n) → O(n log k)).
```

#### 7.5 PriorityQueue in .NET 6+
```
Comprehensive guide to .NET 6+ PriorityQueue<TElement, TPriority>: separate element and priority (allows arbitrary types for both), default min-priority (lowest priority number = highest priority), Enqueue, Dequeue, Peek, EnqueueDequeue, TryDequeue, Count, UnorderedItems. Show custom priority comparer via constructor. Cover common patterns: Dijkstra with PriorityQueue, scheduling tasks by deadline, event-driven simulation. Explain internal implementation (quaternary heap for cache performance). Show that there's no built-in max-heap — negate int priorities or implement custom comparer.
```

---

### 8. Sorting Algorithms

#### 8.1 Quadratic Sorts
```
Explain bubble sort (adjacent swaps, O(n²), stable, good for nearly-sorted with early termination), selection sort (find min, place at front, O(n²), unstable, minimizes swaps), insertion sort (shift elements right to insert in correct position, O(n²) worst but O(n) nearly-sorted, stable, good for small arrays). Show C# implementations. Explain why insertion sort is used for small n (< 16) in production hybrid sorts. Cover the concept of inversions as a measure of "sortedness."
```

#### 8.2 Merge Sort
```
Explain merge sort: divide array in half recursively, merge two sorted halves. O(n log n) always, stable, O(n) auxiliary space. Show merge step (two-pointer merge into temp array). Show top-down recursive and bottom-up iterative implementations in C#. Cover external merge sort (for data larger than RAM). Explain why merge sort is preferred for linked lists (no random access needed for merge). Cover merge sort variants: natural merge sort (exploits existing runs), k-way merge.
```

#### 8.3 Quick Sort
```
Explain quick sort: pick pivot, partition into < pivot and > pivot, recurse. O(n log n) average, O(n²) worst (sorted array with first-element pivot). Cover pivot selection: first element (bad), last element (bad), random (good), median-of-three (better). Show Lomuto and Hoare partition schemes in C#. Cover three-way partitioning (Dutch National Flag) for many duplicates. Explain why quicksort is fast in practice (cache-friendly, small constant, in-place). Cover introsort (quicksort + heapsort fallback).
```

#### 8.4 Heap Sort
```
Revisit heap sort in sorting context: O(n log n) guaranteed, O(1) space (unlike merge sort), unstable. Show full implementation using array-based heap. Explain where heap sort appears: introsort (used in .NET Array.Sort) uses heap sort as fallback when quicksort depth exceeds 2*log(n). Cover why heap sort is rarely used standalone but is critical as a worst-case guarantee component.
```

#### 8.5 Linear Sorts
```
Explain O(n) sorting algorithms that beat O(n log n) lower bound by not using comparisons: counting sort (count occurrences, works for small integer range — O(n + k)), radix sort (sort digit by digit using stable sort, O(d*(n+k))), bucket sort (distribute into buckets, sort each, O(n) average). Show C# implementations. Explain why these have limits: counting sort needs bounded range, radix sort needs decomposable keys. Show radix sort for sorting IP addresses, dates, strings.
```

#### 8.6 TimSort
```
Explain TimSort: hybrid algorithm used in Python, Java, and .NET's Array.Sort — identifies natural runs (already-sorted sequences), extends short runs with insertion sort, merges runs using merge sort. O(n log n) worst, O(n) nearly-sorted. Cover run detection, minimum run length (minrun calculation), and galloping mode (exponential search for merge acceleration). Explain why TimSort is excellent for real data (often partially sorted). Show that .NET's Array.Sort<T> uses introspective sort (introsort + insertion sort) not TimSort — clarify the distinction.
```

#### 8.7 Sorting in .NET
```
Comprehensive .NET sorting guide: Array.Sort<T> (introsort — quicksort + heapsort + insertion sort, unstable), List<T>.Sort (same), Array.Sort with IComparer<T> or Comparison<T> delegate, LINQ OrderBy (uses stable sort, allocates new IEnumerable), Span<T>.Sort (.NET 5+, unstable in-place), MemoryExtensions.Sort. Cover stable sorting in .NET: Array.Sort is unstable, OrderBy is stable (preserves equal-element order). Show custom sort with Comparison<T> lambda. Cover sorting by multiple keys with ThenBy. Show CollectionsMarshal for List span sort.
```

#### 8.8 Stable vs Unstable Sort
```
Explain stable sort (preserves relative order of equal elements — "John age 25 stays before Mary age 25 if sorted by age") vs unstable. Explain why stability matters: multi-key sorting (sort by name, then by age — stable sort on age preserves name order), UI grids (re-sorting shouldn't reorder equal rows). Show that .NET's Array.Sort is unstable but LINQ's OrderBy is stable. Show how to get stable sort without LINQ: sort (index, value) pairs, break ties by index. Cover when instability doesn't matter (primitives, single key).
```

---

### 9. Searching Algorithms

#### 9.1 Linear Search
```
Explain linear search: O(n), works on unsorted data, simple. Cover SIMD-accelerated linear search in .NET (Span.IndexOf uses SIMD on x86 — searching bytes/chars is very fast despite O(n) complexity). Show that for small arrays (< 8 elements), linear search beats binary search due to constant factors and cache. Cover the LINQ FirstOrDefault / Any / Contains as linear searches. Show when linear search is the right choice.
```

#### 9.2 Binary Search
```
Explain binary search: O(log n), requires sorted data, halves search space each step. Cover the off-by-one pitfalls (left ≤ right vs left < right, mid = left + (right-left)/2 to avoid overflow). Show iterative and recursive C# implementations. Cover the template: find exact value, find first true in sorted bool array (lower bound), find last true (upper bound). Explain that most binary search bugs are off-by-one errors — show how to think about loop invariants to avoid them.
```

#### 9.3 Binary Search Variants
```
Show binary search variants beyond simple find: find first occurrence of target (keep searching left after finding), find last occurrence, find insertion point, search in rotated sorted array (find pivot, binary search correct half), search in matrix (treat as 1D array or staircase search), find minimum in rotated array, peak element. Show the "binary search on answer" technique (binary search on the solution space, not the array). Implement 4-5 variants in C#.
```

#### 9.4 Interpolation and Exponential Search
```
Explain interpolation search: like binary search but probe position estimated by value distribution (probe = low + (high-low) * (target-arr[low])/(arr[high]-arr[low])). O(log log n) average for uniformly distributed data, O(n) worst. Cover exponential search (find range where element exists by doubling, then binary search) — useful for unbounded/infinite sorted sequences. Show C# implementations. Explain when interpolation search is worth it vs standard binary search.
```

#### 9.5 Binary Search in .NET
```
Comprehensive .NET binary search guide: Array.BinarySearch<T> (returns index or bitwise complement of insertion point if not found — ~result for insert position), List<T>.BinarySearch, MemoryExtensions.BinarySearch on Span/ReadOnlySpan, SortedList and SortedDictionary as binary-search-based collections, SortedSet.GetViewBetween for range queries. Cover the return value semantics (~result) for insertion point. Show custom IComparer<T> with BinarySearch. Cover common pitfall: BinarySearch on unsorted array gives undefined results.
```

---

### 10. Graph Fundamentals

#### 10.1 Graph Representations
```
Cover three graph representations: adjacency list (List<int>[] or Dictionary<int, List<int>>, O(V+E) space, efficient for sparse graphs, O(degree) neighbor iteration), adjacency matrix (int[,] or bool[,], O(V²) space, O(1) edge existence check, efficient for dense graphs), and edge list (List<(int, int)>, O(E) space, good for sorting edges). Show C# implementations. Cover directed vs undirected, weighted (include weight in adjacency list), and how to choose representation. Show .NET's lack of built-in graph types.
```

#### 10.2 BFS
```
Explain BFS: explore all neighbors at distance d before d+1, uses Queue, O(V+E) time. Show visited array/set to avoid cycles. Cover BFS applications: shortest path in unweighted graph, level-order tree traversal, finding connected components, 0-1 BFS (deque-based for 0/1 weights). Show C# implementation with Queue<int> and bool[] visited. Extend to bidirectional BFS (faster for shortest path between two nodes). Cover BFS on grid (4/8 directional with bounds checking).
```

#### 10.3 DFS
```
Explain DFS: go as deep as possible before backtracking, uses Stack (or recursion), O(V+E). Cover DFS applications: cycle detection, topological sort, connected components, SCC, finding paths, flood fill. Show recursive and iterative (explicit Stack<int>) C# implementations. Cover DFS coloring (white/gray/black) for directed graph cycle detection. Show DFS on grid (flood fill, island counting). Explain pre-order and post-order DFS visit times and their applications.
```

#### 10.4 Topological Sort
```
Explain topological sort: linear ordering of vertices where for every edge u→v, u comes before v. Only valid for DAGs (directed acyclic graphs). Cover Kahn's algorithm (BFS-based: start with in-degree-0 nodes, reduce in-degree of neighbors, O(V+E)) and DFS-based (add to result stack on post-visit, reverse, O(V+E)). Show C# implementations. Cover applications: task scheduling, build dependency order, course prerequisites. Show how to detect cycle (Kahn's: not all nodes processed → cycle exists).
```

#### 10.5 Cycle Detection
```
Cover cycle detection for undirected graphs (DFS with parent tracking — visited neighbor that isn't parent = cycle; Union-Find) and directed graphs (DFS with 3-color — gray = in current path, black = done; or Kahn's topological sort). Show C# implementations for both. Cover detecting cycle in a linked list (Floyd's, already covered). Explain why directed graph cycle detection needs 3-color vs undirected 2-color. Show all three approaches with complexity analysis.
```

#### 10.6 Union-Find
```
Explain Disjoint Set Union (DSU/Union-Find): data structure for connected components, O(α(n)) ≈ O(1) amortized per operation with path compression + union by rank. Cover find (with path compression — flatten tree), union (attach smaller rank tree under larger). Show C# implementation. Cover applications: Kruskal's MST, detecting cycles in undirected graph, dynamic connectivity, counting connected components. Show the difference with/without optimizations (O(n) vs O(α(n)) per operation).
```

#### 10.7 Graphs in .NET
```
Cover practical graph implementation in .NET without a built-in graph type: adjacency list as Dictionary<T, List<T>>, weighted graph as Dictionary<T, List<(T neighbor, int weight)>>, or using arrays for integer vertex graphs (int[][] or List<int>[]). Show a reusable Graph<T> class with AddEdge, BFS, DFS methods. Cover QuikGraph NuGet library for production use. Show how to model real problems as graphs (grid as graph, dependencies as graph, social network). Cover memory efficiency of different representations for large graphs.
```

---

### 11. Shortest Paths

#### 11.1 Dijkstra
```
Explain Dijkstra's algorithm: single-source shortest paths for non-negative weights, greedy BFS with priority queue. O((V+E) log V) with binary heap. Show relaxation: if dist[u] + w(u,v) < dist[v], update dist[v]. Walk through an example. Show C# implementation with PriorityQueue<int, int> (vertex, distance). Cover path reconstruction (parent array). Explain why negative weights break Dijkstra (greedy assumption fails). Cover Dijkstra on dense graphs (O(V²) with simple array, faster than heap for dense).
```

#### 11.2 Bellman-Ford
```
Explain Bellman-Ford: single-source shortest paths with negative weights, O(VE). Relax all edges V-1 times (longest shortest path has V-1 edges). Show negative cycle detection (run one more relaxation — if any distance updates, negative cycle exists). Show C# implementation. Cover SPFA (Bellman-Ford with queue optimization, O(kE) average but O(VE) worst). Explain when to use Bellman-Ford vs Dijkstra: negative weights, need cycle detection. Cover applications: currency arbitrage detection (negative log of exchange rates).
```

#### 11.3 Floyd-Warshall
```
Explain Floyd-Warshall: all-pairs shortest paths, O(V³) time, O(V²) space. DP: dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]) for each intermediate vertex k. Show C# implementation with 2D array. Cover negative cycle detection (dp[i][i] < 0 → negative cycle). Cover path reconstruction (predecessor matrix). Explain when Floyd-Warshall is appropriate: small graphs (V < 500), need all pairs, dense graphs. Cover transitive closure as a special case (reachability).
```

#### 11.4 A* Search
```
Explain A* search: informed search using heuristic f(n) = g(n) + h(n) where g = cost so far, h = estimated cost to goal. O(b^d) where b = branching factor, d = depth. Admissible heuristic (never overestimates) guarantees optimal path. Cover common heuristics: Manhattan distance (grid, no diagonals), Euclidean distance (Euclidean space), Chebyshev (grid with diagonals). Show C# implementation with PriorityQueue. Compare to Dijkstra (A* = Dijkstra + heuristic). Cover applications: pathfinding in games, navigation, routing.
```

#### 11.5 BFS for Unweighted Shortest Path
```
Show BFS as O(V+E) optimal solution for unweighted shortest path (no need for Dijkstra's O((V+E)logV) overhead). Cover multi-source BFS (start BFS from multiple sources simultaneously — useful for "nearest X" problems). Show word ladder problem (BFS on word graph). Cover 0-1 BFS with deque (edge weight 0 or 1 — push 0-weight to front, 1-weight to back). Show BFS for shortest path in grid with obstacles. Explain when BFS is sufficient and when to use Dijkstra.
```

---

### 12. Advanced Graph Algorithms

#### 12.1 Minimum Spanning Tree
```
Explain MST: spanning tree with minimum total edge weight, used for network design, clustering, approximation algorithms. Cover Kruskal's (sort edges by weight, add if doesn't form cycle using DSU, O(E log E)) and Prim's (greedy BFS from any node using min-heap, O(E log V)). Show C# implementations of both. Cover when to prefer each: Kruskal for sparse graphs (edge-sorted), Prim for dense graphs (adj matrix). Cover applications: network routing, image segmentation, cluster analysis.
```

#### 12.2 Strongly Connected Components
```
Explain SCCs in directed graphs: maximal subgraph where every vertex is reachable from every other. Cover Kosaraju's algorithm (DFS to get finish order, transpose graph, DFS in reverse finish order — O(V+E)) and Tarjan's algorithm (single DFS using low-link values and stack, O(V+E)). Show C# implementation of Tarjan's (more commonly implemented). Cover applications: finding cycles in directed graphs, 2-SAT problem, condensation DAG. Explain why SCCs are the building block for many directed graph problems.
```

#### 12.3 Bipartite Detection
```
Explain bipartite graphs: vertices split into two groups, edges only between groups (no edges within group). Cover 2-coloring with BFS/DFS: try to color graph with 2 colors, conflict = not bipartite. O(V+E). Show C# implementation. Cover applications: matching problems (job assignments, students to classes), checking if graph has odd-length cycles (bipartite ↔ no odd cycles). Show Hungarian algorithm concept for maximum bipartite matching.
```

#### 12.4 Network Flow
```
Explain max flow: find maximum flow from source to sink through a network with capacities. Cover Ford-Fulkerson (repeatedly find augmenting paths, O(E * max_flow)), Edmonds-Karp (Ford-Fulkerson with BFS for augmenting path, O(VE²)), and the residual graph concept. Cover max-flow min-cut theorem. Show applications: maximum bipartite matching, project selection, image segmentation. Show C# implementation of Edmonds-Karp. Cover why this is important despite being rarely implemented directly (more often use a library).
```

---

### 13. Dynamic Programming

#### 13.1 DP Fundamentals
```
Explain dynamic programming: solve problems by breaking into overlapping subproblems, store results to avoid recomputation. Two properties required: overlapping subproblems (same subproblems recur) and optimal substructure (optimal solution built from optimal subproblems). Distinguish from divide & conquer (D&C subproblems don't overlap). Show Fibonacci as the canonical example: naive O(2^n), memoized O(n), tabulated O(n). Explain DP as "careful brute force" — enumerate all subproblems, solve each once.
```

#### 13.2 Memoization vs Tabulation
```
Compare memoization (top-down: recursive + cache, natural recursive structure, only computes needed subproblems) vs tabulation (bottom-up: iterative + table, fills all subproblems in order, better cache behavior, avoids recursion overhead). Show both for coin change and longest common subsequence. Cover space optimization in tabulation (rolling array for 1D DP, two rows for 2D DP). Explain that memoization in C# uses Dictionary<(int,int), int> or array-based cache. Show that tabulation is usually faster in .NET (no recursion overhead, better cache, no Dictionary overhead).
```

#### 13.3 Classic 1D DP
```
Implement and explain 5 classic 1D DP problems: Fibonacci (build-up), Climbing Stairs (ways to reach nth stair), House Robber (max non-adjacent sum), Jump Game (can reach end), and Coin Change (fewest coins for amount). For each: define subproblem, recurrence relation, base cases, code in C#, complexity. Show space optimization where applicable (O(1) space for Fibonacci, O(n) for Coin Change). These 5 problems cover the main 1D DP patterns.
```

#### 13.4 Classic 2D DP
```
Implement and explain classic 2D DP: Unique Paths in grid (paths from top-left to bottom-right), Longest Common Subsequence (LCS), Edit Distance (Levenshtein — insert, delete, replace), 0/1 Knapsack, and Minimum Path Sum in grid. For each: define dp[i][j], recurrence, base cases, C# code. Show row-by-row tabulation. Cover space optimization (LCS and edit distance can use 2 rows). Explain how 2D DP = extending 1D DP to two varying parameters.
```

#### 13.5 Knapsack Variants
```
Cover knapsack variants: 0/1 Knapsack (each item used at most once — dp[i][w] = max value with first i items and capacity w), Unbounded Knapsack (each item infinite times — Coin Change variant), Bounded Knapsack (each item limited count), and Fractional Knapsack (greedy, not DP). Show C# implementations. Cover space optimization for 0/1 (iterate weight backwards to avoid using item twice). Show Coin Change as unbounded knapsack. Show Target Sum as variant. Cover subset sum (boolean knapsack).
```

#### 13.6 Longest Increasing Subsequence
```
Cover LIS: O(n²) DP (dp[i] = LIS ending at index i) and O(n log n) patience sorting (maintain sorted tails array, binary search for insertion position). Show C# implementations of both. Cover printing the actual subsequence (not just length). Extend to longest non-decreasing subsequence, longest bitonic subsequence. Explain O(n log n) trick: tails array doesn't represent actual LIS but its length is correct — explain why. Show Russian Doll Envelopes as 2D LIS application.
```

#### 13.7 Interval and String DP
```
Cover interval DP (dp[i][j] = answer for subproblem on range [i,j]): Matrix Chain Multiplication (optimal parenthesization), Burst Balloons, and Palindrome Partitioning. Show the pattern: iterate length from small to large, try all split points. Cover string DP: Palindromic Substrings / Longest Palindromic Subsequence, Regular Expression Matching, Wildcard Matching. Show C# implementations. Explain the "reduce to smaller interval" intuition for interval DP.
```

#### 13.8 DP on Trees and Graphs
```
Cover DP on trees (rerooting technique, subtree DP): Tree Diameter (max path through subtree), Maximum Path Sum, Binary Tree Maximum Path Sum, House Robber III (rob nodes without adjacent). Show dp[node] represents answer for subtree rooted at node. Cover DP on DAGs (natural because topological order gives computation order). Show C# recursive implementations with memoization. Explain rerooting: run one DFS to get downward dp, second DFS to combine with upward contribution.
```

#### 13.9 DP in .NET
```
Show practical DP implementation patterns in .NET: memoization with Dictionary<(int, int), long> vs int[,] (array is 10-100x faster), using Span<int> for 1D tabulation, stackalloc for small DP tables, ArrayPool for large temporary DP arrays, avoiding LINQ inside DP inner loops. Show memory layout: row-major 2D array access pattern for cache efficiency (dp[i,j] better than dp[i][j] for sequential row access). Cover parallel DP (some DP problems have independent subproblems — show Parallel.For where applicable).
```

---

### 14. Greedy Algorithms

#### 14.1 Greedy Strategy
```
Explain greedy: at each step make locally optimal choice, never reconsider. Works when greedy choice property holds (local optimal leads to global optimal) and optimal substructure exists. Show when greedy fails: coin change with arbitrary denominations (need DP), 0/1 knapsack (need DP). Show when greedy works: activity selection, Huffman coding, Dijkstra, MST. Key insight: prove greedy works via exchange argument (assume optimal solution differs, show you can swap to greedy choice without worsening). Practical: try greedy first, fall back to DP if it fails.
```

#### 14.2 Interval Scheduling
```
Cover interval problems with greedy: Activity Selection (maximize non-overlapping intervals — sort by end time, greedily pick earliest-ending), Interval Scheduling Maximization, Minimum Number of Meeting Rooms (sort by start, use min-heap of end times), Merge Overlapping Intervals (sort by start, merge if overlap), and Non-overlapping Intervals (minimum removals). Show C# implementations. Explain why sorting by end time (not start) is the key insight for activity selection. Cover "greedy stays ahead" proof concept.
```

#### 14.3 Huffman as Greedy
```
Revisit Huffman coding from a greedy algorithm perspective: at each step merge the two least-frequent nodes (greedy choice), building optimal prefix-free code. Prove optimality via exchange argument. Implement Huffman encoder in C# using PriorityQueue<HuffmanNode, int>. Show frequency analysis, tree construction, code table generation. Connect to compression: Huffman is the greedy optimal solution to the variable-length encoding problem. Cover canonical Huffman for compact storage.
```

#### 14.4 Coin Change Greedy vs DP
```
Show when greedy works for coin change (US denominations: 25, 10, 5, 1 — greedy always optimal) and when it doesn't (denominations 1, 3, 4 — greedy picks 4+1+1=3 coins for 6, DP finds 3+3=2 coins). Prove greedy works for canonical coin systems (each denomination divides next). Explain why this example is important: it's the classic case showing greedy and DP solve different problems. Show C# implementations of both approaches. Cover Chicken McNugget theorem as related problem.
```

#### 14.5 Dijkstra as Greedy
```
Explain Dijkstra as a greedy algorithm: at each step pick the unvisited vertex with smallest known distance (greedy choice). Show the proof that this greedy choice is safe for non-negative weights: once a node is extracted from the priority queue, its distance is final (no shorter path can be found later because all future paths go through already-processed nodes with ≥ current distance). Show why negative edges break this. Unify Dijkstra with the greedy framework to build intuition for "when can I commit to the current best choice?"
```

---

### 15. Divide & Conquer

#### 15.1 D&C Pattern
```
Explain divide & conquer: divide problem into independent subproblems, solve recursively, combine results. Three steps: divide (split into subproblems), conquer (recurse), combine (merge results). Cover Master Theorem for recurrence analysis: T(n) = aT(n/b) + f(n). Show cases: T(n) = 2T(n/2) + O(n) → O(n log n) (merge sort), T(n) = 2T(n/2) + O(1) → O(n) (binary search), T(n) = 8T(n/2) + O(n²) → O(n³) (naive matrix multiply). Contrast with DP: D&C subproblems are independent (no overlap).
```

#### 15.2 Merge Sort as D&C
```
Already covered in sorting — here focus on the D&C analysis: recurrence T(n) = 2T(n/2) + O(n), Master Theorem → O(n log n). Cover count inversions using merge sort (during merge, if right element placed before left elements, add count of remaining left elements). Show C# inversion count implementation. Cover external merge sort for large files (divide into chunks, sort each, k-way merge). Explain why merge sort is the natural D&C algorithm (perfectly balanced divide, linear combine).
```

#### 15.3 Binary Search as D&C
```
Frame binary search as D&C: divide search space in half (O(log n) depth), only recurse on one half (not both — O(1) combine). Recurrence T(n) = T(n/2) + O(1) → O(log n). Cover binary search on answer (monotonic predicate): "is it possible to achieve X?" becomes binary searchable when the answer is monotone (false false false TRUE TRUE TRUE). Show examples: find minimum capacity to ship packages in D days, find kth smallest in sorted matrix. C# implementations.
```

#### 15.4 Fast Exponentiation
```
Explain exponentiation by squaring: x^n in O(log n) instead of O(n). If n even: x^n = (x²)^(n/2). If n odd: x^n = x * x^(n-1). Show recursive and iterative implementations in C#. Extend to matrix exponentiation: compute Fibonacci in O(log n) using matrix power. Show BigInteger.ModPow as .NET's built-in fast modular exponentiation. Cover applications: RSA encryption, large Fibonacci numbers, fast polynomial evaluation.
```

#### 15.5 Karatsuba Multiplication
```
Explain Karatsuba algorithm: multiply two n-digit numbers in O(n^1.585) instead of O(n²) schoolbook multiplication. Key insight: reduce 4 n/2-digit multiplications to 3 using (a+b)(c+d) = ac + ad + bc + bd, then ad+bc = (a+b)(c+d) - ac - bd. Show recursive implementation in C#. Explain that BigInteger in .NET uses more advanced algorithms (Toom-Cook, Schönhage–Strassen for very large). Discuss why this matters for cryptography (RSA with 2048-bit keys).
```

#### 15.6 Closest Pair of Points
```
Explain closest pair of points: naive O(n²), D&C O(n log n). Divide points by x-coordinate, find closest pair in each half, check strip of width 2*min_distance around dividing line. Key insight: at most 8 points in any 2δ×δ rectangle, so strip check is O(n). Show C# implementation. Explain this is a classic D&C problem showing a non-obvious combine step. Cover applications: collision detection preprocessing, clustering, Voronoi diagram construction. Discuss how this generalizes to k-d trees for nearest-neighbor search.
```

---

### 16. Backtracking

#### 16.1 Backtracking Pattern
```
Explain backtracking: systematic search through all possibilities by building solution incrementally, abandoning ("pruning") paths that can't lead to valid solution. Template: choose → explore → unchoose. Distinguish from brute force (backtracking prunes — explores fewer paths). Show the state space tree visualization. Cover pruning strategies: constraint checking before recursing, early termination on found solution, pruning by bound (branch & bound). Explain that backtracking is essentially DFS on the solution space.
```

#### 16.2 Permutations and Combinations
```
Implement permutations (all orderings of n elements — n! results, O(n*n!) time) and combinations (all size-k subsets — nCk results) using backtracking in C#. Show the "used" boolean array for permutations and "start index" technique for combinations. Cover permutations with duplicates (sort first, skip if same value already used at this level). Show C# implementations using List<int> for current path and List<List<int>> for results. Cover iterative approaches using lexicographic ordering.
```

#### 16.3 Subsets / Power Set
```
Show generating all subsets (power set) of a set using backtracking: at each element choose include/exclude, 2^n subsets. Show both backtracking approach and bit-manipulation approach (iterate 0 to 2^n-1, bit i = include element i). Cover subsets with duplicates (sort, skip duplicate values at same recursion level). Show C# implementations. Cover applications: generating all test cases, combinatorial optimization search spaces, feature selection. Explain that subset generation is the foundation for many exponential algorithms.
```

#### 16.4 N-Queens
```
Implement N-Queens: place N queens on N×N board with no two attacking each other. Backtracking: place queens row by row, check column and diagonal conflicts. O(N!) with good pruning. Show bitmask optimization (use three integers for column, left-diagonal, right-diagonal attack sets — O(1) conflict check). Show C# implementation returning all solutions or just count. Cover N-Queens II (count solutions only). Explain why N-Queens is the canonical backtracking problem: clear constraints, tree structure, good pruning.
```

#### 16.5 Sudoku Solver
```
Implement sudoku solver with backtracking and constraint propagation: find first empty cell, try digits 1-9, check row/column/box validity, recurse, backtrack. Add constraint propagation: if a cell has only one possible value, fill it immediately (naked single). Show C# with O(9^81) worst case but typically fast due to pruning. Cover arc consistency (forward checking: when placing a value, check if remaining cells still have valid options). This example shows how backtracking + constraint propagation handles NP-complete problems practically.
```

#### 16.6 Word Search
```
Implement word search: find word in 2D character grid using backtracking DFS. Mark visited cells (in-place modification of grid to avoid extra space, restore on backtrack). Handle direction arrays for 4/8 directional search. Optimize: check trie for valid prefixes to prune early (especially for finding all words — "Word Search II"). Show C# implementation. Cover grid-based backtracking as a general pattern: similar to maze solving, flood fill. Explain the "mark-then-restore" pattern for in-place visited tracking.
```

#### 16.7 Backtracking in .NET
```
Show practical backtracking implementation considerations in .NET: using List<T> vs array for path (List for variable depth, array for fixed depth), avoiding LINQ inside backtracking hot loop, using Span<T> for copying state, IEnumerable<T> with yield return for lazy enumeration of results (generate results on-demand without storing all), converting deep recursion to iterative with explicit Stack<T> for large search spaces. Show how to implement backtracking as IAsyncEnumerable<T> for cancellable long-running searches.
```

---

### 17. Advanced Data Structures

#### 17.1 Skip List
```
Explain skip list: probabilistic sorted data structure, multiple levels of linked lists for O(log n) search/insert/delete average. Each element promoted to higher levels with probability p (typically 0.5). Search: start at highest level, go right until overshoot, drop down. O(log n) expected, O(n) worst (unlikely). Compare to balanced BST: simpler to implement, concurrent-friendly (no rotations). Cover that .NET's ConcurrentDictionary doesn't use skip list but it's used in Redis for sorted sets. Show C# implementation sketch.
```

#### 17.2 Bloom Filter
```
Explain Bloom filter: space-efficient probabilistic set membership test. Multiple hash functions, bit array. Insert: set bits at all hash positions. Query: check all bits (if any 0 → definitely not in set, all 1 → probably in set). No false negatives, false positive rate tunable by bit array size and hash count. Show false positive probability formula: (1 - e^(-kn/m))^k. Cover use cases: database query optimization (avoid disk read if key definitely absent), caching (don't cache items that won't be re-requested), spell checkers. Show C# implementation.
```

#### 17.3 HyperLogLog
```
Explain HyperLogLog: approximate cardinality (count distinct) of large datasets using O(log log n) space (typically ~12KB for 1% error). Key insight: the maximum number of leading zeros in hash values estimates log₂(cardinality). Uses multiple registers and harmonic mean to reduce variance. O(1) per element. Show Redis's PFADD/PFCOUNT as real-world usage. Cover use cases: counting unique visitors, unique queries, network flow analysis where exact count isn't worth the memory. Show .NET sketch-based cardinality implementation concept.
```

#### 17.4 LRU Cache
```
Implement LRU (Least Recently Used) cache: O(1) get and put. Data structure: HashMap (key → node) + Doubly Linked List (for access order). Get: return value, move node to front (most recently used). Put: add to front, if capacity exceeded, remove from back (least recently used). Show C# implementation using Dictionary<int, LinkedListNode<(int key, int val)>> + LinkedList<(int, int)>. Cover LRU in .NET: IMemoryCache uses LRU internally. Cover thread-safe LRU using ConcurrentDictionary + lock.
```

#### 17.5 LFU Cache
```
Implement LFU (Least Frequently Used) cache: O(1) all operations using two HashMaps and a doubly linked list. Map1: key → (value, frequency). Map2: frequency → LinkedList of keys at that frequency. Track min_frequency. On access: move key from freq list to freq+1 list. On eviction: remove LRU from min_freq list. Show C# implementation. Compare LRU vs LFU: LFU is better for power-law access distributions (few items accessed many times), LRU for recency-based access patterns. Cover applications in caching systems.
```

#### 17.6 DSU Advanced
```
Show optimized Union-Find with both path compression (find: make all nodes on path point directly to root) and union by rank (attach smaller rank tree under larger rank root). Prove O(α(n)) amortized complexity (α = inverse Ackermann — grows extremely slowly, ≤ 4 for any practical n). Show C# implementation. Cover rollback DSU (union by rank only, no path compression, allows undoing unions — needed for offline dynamic connectivity). Cover weighted DSU (track relative values between nodes).
```

#### 17.7 Monotonic Queue/Deque
```
Explain monotonic deque: deque maintaining elements in monotonic (increasing or decreasing) order. Show sliding window maximum: maintain decreasing deque of indices, pop front when out of window, pop back while smaller than current — O(n) total. Show C# implementation with LinkedList<int> as deque. Cover monotonic queue applications: sliding window min/max, largest rectangle in histogram (variant), maximum of all subarrays of size k. Explain amortized O(1) per element (each element enqueued and dequeued at most once).
```

#### 17.8 Sparse Table
```
Explain sparse table: data structure for O(1) range minimum/maximum queries after O(n log n) preprocessing. Build table[i][j] = min of array[i..i+2^j-1] (range of length 2^j starting at i). Query range [l, r]: find k = floor(log2(r-l+1)), return min(table[l][k], table[r-2^k+1][k]) — ranges overlap but min is idempotent. O(n log n) build, O(1) query, O(n log n) space. Show C# implementation. Compare to segment tree (O(log n) query but supports updates). Use case: RMQ in LCA algorithms, offline range queries.
```

---

### 18. String Algorithms

#### 18.1 KMP
```
Explain KMP (Knuth-Morris-Pratt): O(n+m) string matching by precomputing failure function (longest proper prefix that is also suffix for each prefix of pattern). Failure function prevents redundant comparisons. Show failure function construction and search in C#. Explain the key insight: when mismatch at pattern[j], don't start from pattern[0] but pattern[fail[j-1]] — partial match already done. Compare to naive O(n*m). Cover KMP for finding all occurrences. Explain why KMP's failure function is also called "partial match table."
```

#### 18.2 Rabin-Karp
```
Explain Rabin-Karp: rolling hash for O(n+m) average string search. Hash pattern, compute hash of each window using rolling hash (subtract outgoing char, add incoming char, multiply — O(1) per slide). If hashes match, verify with character comparison (to handle collisions). O(n+m) average, O(nm) worst (many collisions). Show C# implementation with polynomial rolling hash (Horner's method). Cover double hashing to reduce collision probability. Cover multi-pattern search (Aho-Corasick is better, but Rabin-Karp with set of pattern hashes gives O(n + Σm)).
```

#### 18.3 Z-Algorithm
```
Explain Z-algorithm: for each position i, Z[i] = length of longest substring starting at i that is also a prefix of the string. O(n). Show construction using Z-box (maintained window [l, r] of rightmost Z-box). Use for pattern matching: concatenate pattern + '$' + text, compute Z array, positions in text part where Z[i] = pattern.length are matches. O(n+m) like KMP but often simpler to implement. Show C# implementation. Cover applications: find all occurrences, count distinct substrings, string compression.
```

#### 18.4 Manacher's Algorithm
```
Explain Manacher's algorithm: O(n) longest palindromic substring. Expands palindromes using previously computed info (mirror palindromes across center). Transform string to handle even-length palindromes (insert '#' between chars). Maintain rightmost palindrome boundary [c, r]. For each center i: if within boundary, initialize with mirror, then expand. Show C# implementation. Compare to O(n²) expand-around-center approach. Cover counting all palindromic substrings. Explain the key invariant: use mirror to avoid re-expanding known palindromes.
```

#### 18.5 Suffix Arrays
```
Explain suffix array: sorted array of all suffixes of a string. O(n log²n) naive construction (sort suffixes with comparison using ranks), O(n log n) DC3/Skew algorithm. Suffix array enables O(m log n) pattern search (binary search on sorted suffixes) and many string operations. Cover LCP array (longest common prefix between adjacent suffixes) construction. Show applications: counting distinct substrings (n*(n+1)/2 - Σlcp[i]), longest repeated substring, string compression. Show C# implementation of O(n log²n) approach. Cover .NET string has no built-in suffix structure — use for competitive programming.
```

#### 18.6 Edit Distance
```
Implement Levenshtein edit distance: minimum insertions, deletions, substitutions to transform string A to B. 2D DP: dp[i][j] = edit distance between A[0..i] and B[0..j]. Recurrence: if chars match, dp[i][j] = dp[i-1][j-1], else min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+1). O(nm) time, O(nm) space, optimize to O(min(n,m)) space with rolling rows. Show C# implementation. Cover path reconstruction (traceback for actual edit operations). Cover applications: spell checking, DNA sequence alignment, fuzzy string matching, diff tools. Show MemoryExtensions in .NET doesn't have built-in edit distance — implement it.
```

#### 18.7 String Algorithms in .NET
```
Practical guide to string algorithm tools in .NET: MemoryExtensions.IndexOf/Contains/StartsWith on spans (SIMD-accelerated), Regex with RegexOptions.Compiled and source-generated Regex (.NET 7+), StringComparer variants (Ordinal fastest, InvariantCulture for rules-based, CurrentCulture for user-visible), Span<char> for zero-allocation parsing, ReadOnlySpan.Split for allocation-free tokenization. Cover FuzzySharp NuGet for Levenshtein/fuzzy matching. Show benchmark: compiled Regex vs IndexOf vs manual parsing for different use cases.
```

---

### 19. Mathematical Algorithms

#### 19.1 GCD and LCM
```
Explain Euclidean algorithm for GCD: gcd(a, b) = gcd(b, a % b), base case gcd(a, 0) = a. O(log(min(a,b))). Extended Euclidean: finds x, y such that ax + by = gcd(a,b) — used for modular inverse. LCM: lcm(a,b) = a*b/gcd(a,b). Show C# implementations. Cover binary GCD (no division, uses shifts) for performance. Cover .NET: BigInteger has no built-in GCD (.NET 7+ added one?) — implement manually. Applications: fraction simplification, scheduling (task periods to LCM), RSA key generation.
```

#### 19.2 Sieve of Eratosthenes
```
Explain Sieve of Eratosthenes: find all primes up to n in O(n log log n). Mark composites by iterating multiples starting from p². Show C# implementation with BitArray (memory-efficient). Cover segmented sieve for large n (process in segments fitting in cache). Cover linear sieve O(n) (each composite marked exactly once). Show prime counting and prime factorization using sieve. Applications: generating primes for hash functions, RSA prime testing, counting primes in range. Show that .NET has no built-in prime sieve.
```

#### 19.3 Modular Arithmetic
```
Cover modular arithmetic for competitive programming and cryptography: (a+b) % m, (a*b) % m (use long to avoid overflow), modular inverse (a^(-1) mod m = a^(m-2) mod m when m is prime — Fermat's little theorem), Chinese Remainder Theorem concept. Show C# implementations using BigInteger.ModPow for large exponents. Cover modular inverse via extended Euclidean. Explain why working mod 10^9+7 (prime) is standard in competitive programming. Show .NET's BigInteger.ModPow for cryptographic use.
```

#### 19.4 Fast Exponentiation
```
(Covered in D&C section 15.4 — here focus on modular fast exponentiation and matrix exponentiation.) Show modular fast power: (base^exp) % mod in O(log exp). Show matrix exponentiation: raise a 2x2 matrix to the nth power in O(k³ log n) — compute Fibonacci(n) in O(log n). Show linear recurrence solved via matrix exponentiation: any linear recurrence f(n) = c1*f(n-1) + ... + ck*f(n-k) becomes matrix power. C# implementations with long[][] for matrix. Cover Int128 (.NET 7+) to avoid overflow in intermediate computations.
```

#### 19.5 Combinatorics
```
Cover combinatorics formulas with C# implementations: nCr (binomial coefficient — Pascal's triangle DP, O(n²) time O(n²) space, or O(r) iterative), nPr (permutations), precomputing factorials mod p for large nCr. Show Pascal's triangle implementation. Cover Catalan numbers (valid bracket sequences, BST shapes). Cover stars and bars. Show BigInteger for exact large combinatorics. Applications: probability calculations, counting valid configurations, DP coefficient calculation. Show Math.Combinations approach.
```

#### 19.6 Bit Manipulation as Algorithms
```
Show bit manipulation as algorithmic tools beyond basic operations: using bits to represent subsets in DP (bitmask DP: dp[mask] = answer using exactly the elements in mask), XOR-based algorithms (find two missing numbers using XOR), bitwise tricks in competitive programming (x&(x-1) clears lowest set bit — count set bits loop, check power of 2), Brian Kernighan's algorithm (bit counting), and Gray code generation. Show C# implementations. Cover when bitmask DP is applicable: small n (≤20), need to enumerate subsets efficiently.
```

#### 19.7 Math in .NET
```
Comprehensive guide to math utilities in .NET: Math class (Abs, Min, Max, Pow, Sqrt, Log, Floor, Ceiling, Round), MathF (float equivalents, faster on some architectures), Math.DivRem (.NET 6+ returns both quotient and remainder), Math.BigMul (64×64→128 bit multiply via Int128), Int128/UInt128 (.NET 7+ — 128-bit integers), BigInteger for arbitrary precision, System.Numerics.BitOperations (covered earlier), Math.Clamp, Math.CopySign, Math.FusedMultiplyAdd. Show common patterns: safe integer overflow detection, fast modular arithmetic, prime testing with BigInteger.IsProbablyPrime.
```

---

### 20. Algorithm Design in .NET Context

#### 20.1 LINQ Performance
```
Cover LINQ performance characteristics: IEnumerable<T> is lazy (no computation until enumerated), multiple enumerations = multiple computations (use ToList/ToArray to materialize), LINQ allocates enumerator objects (struct enumerators in List<T> avoid boxing but LINQ chains box), LINQ with closures allocates per-call. Show common LINQ pitfalls: calling Count() on IEnumerable that traverses (use Length/Count property), repeated Where+First (combine), LINQ in tight loops. Show when LINQ is fine vs when to use manual loops. Benchmark LINQ vs manual for hot paths.
```

#### 20.2 Collection Abstractions
```
Guide to choosing the right .NET collection abstraction: IEnumerable<T> (lazy, forward-only, minimum contract), ICollection<T> (adds Count and Contains), IList<T> (adds index access), IReadOnlyList<T> (read-only indexed access), ISet<T> (set operations). Show that accepting IEnumerable<T> is too loose (caller may pass IQueryable, causing multiple SQL queries), accepting IReadOnlyList<T> is better for indexed access. Cover Span<T>/ReadOnlySpan<T> for method parameters accepting contiguous memory. Show a decision tree for parameter type choice.
```

#### 20.3 Immutable Collections
```
Cover System.Collections.Immutable: ImmutableArray<T> (backed by array, O(1) index, O(n) add — creates new array), ImmutableList<T> (AVL tree, O(log n) all ops), ImmutableDictionary<K,V> (hash array mapped trie, O(log n)), ImmutableHashSet<T>. Explain structural sharing (new collection shares most of old tree). Show when immutable collections are worth it: thread safety, undo/redo, persistent data structures, functional patterns. Cover builder pattern (ToBuilder() / ToImmutable()) for batch modification. Benchmark vs mutable collections.
```

#### 20.4 Concurrent Collections
```
Cover .NET concurrent collections for multi-threaded algorithm implementations: ConcurrentDictionary<K,V> (striped locking, O(1) average, GetOrAdd/AddOrUpdate atomic), ConcurrentQueue<T> (lock-free FIFO), ConcurrentStack<T> (lock-free LIFO), ConcurrentBag<T> (unordered, thread-local for producer-consumer same thread), BlockingCollection<T> (bounded blocking wrapper). Show producer-consumer pipeline with BlockingCollection. Cover ConcurrentDictionary.GetOrAdd pitfall (factory may be called multiple times). Show when Channel<T> is better than BlockingCollection.
```

#### 20.5 Memory-Efficient Algorithms
```
Show memory-efficient algorithm patterns in .NET: in-place algorithms (sort in-place with Span<T>.Sort, two-pointer reversal), streaming algorithms (process one element at a time without loading all data — Count(), Sum() via LINQ or manual), generator-based algorithms (IEnumerable<T> with yield return for lazy infinite sequences — Fibonacci generator, prime generator), and external sorting (merge sort chunks from disk). Show reducing space complexity from O(n) to O(1) for specific algorithms. Cover iterators as lazy computation in C#.
```

#### 20.6 Parallel Algorithms
```
Cover parallel algorithm implementations in .NET: PLINQ (AsParallel(), .WithDegreeOfParallelism(), .AsOrdered() for ordered parallel), Parallel.For/ForEach (data parallelism with partitioner), Parallel.ForEachAsync (.NET 6+ for async work), Task.WhenAll for independent async computations. Show parallel merge sort using Task. Cover when parallelism helps vs hurts: need enough work per element (>1µs), independent elements (no shared state). Show Partitioner.Create for custom load balancing. Cover concurrent reduction with Interlocked.Add.
```

#### 20.7 Channel Pipelines
```
Show Channel<T> for producer-consumer algorithm pipelines in .NET: Channel.CreateBounded<T> (backpressure), Channel.CreateUnbounded<T>, ChannelWriter.WriteAsync, ChannelReader.ReadAllAsync (IAsyncEnumerable). Build a multi-stage processing pipeline: read → transform → filter → output as linked channels. Show how to implement parallel pipeline stages. Cover cancellation propagation through channels. Compare Channel<T> to BlockingCollection<T> (Channel is async-native, no blocking). Show how pipelines can implement streaming algorithms naturally.
```

---

## Quick Reference: Complexity Cheat Sheet

| Structure / Algorithm | Access | Search | Insert | Delete | Space |
|---|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| List\<T\> (amortized) | O(1) | O(n) | O(1)* | O(n) | O(n) |
| LinkedList\<T\> | O(n) | O(n) | O(1)† | O(1)† | O(n) |
| Stack\<T\> / Queue\<T\> | O(1) top | O(n) | O(1)* | O(1) | O(n) |
| Dictionary\<K,V\> | O(1) avg | O(1) avg | O(1) avg | O(1) avg | O(n) |
| SortedDictionary\<K,V\> | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| PriorityQueue\<T,P\> | O(1) min | O(n) | O(log n) | O(log n) | O(n) |
| Binary Search (sorted arr) | — | O(log n) | — | — | O(1) |
| BFS / DFS | — | O(V+E) | — | — | O(V) |
| Dijkstra | — | O((V+E)logV) | — | — | O(V) |
| Merge Sort | — | — | — | — | O(n log n) / O(n) |
| Quick Sort (avg) | — | — | — | — | O(n log n) / O(log n) |
| Heap Sort | — | — | — | — | O(n log n) / O(1) |

\* amortized † at known position

---

*Version 1.0 — .NET 8 / C# 12*