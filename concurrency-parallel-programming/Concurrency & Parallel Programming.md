# Concurrency & Parallel Programming for .NET Developers
## Compact Learning Guide with Prompts

> Each section has a prompt. Paste it to generate full content. Compact format — concept + .NET angle.

---

## Table of Contents

1. [Foundations of Concurrency](#1-foundations-of-concurrency)
   - 1.1 [Concurrency vs Parallelism vs Async](#11-concurrency-vs-parallelism-vs-async)
   - 1.2 [Why Concurrency Is Hard](#12-why-concurrency-is-hard)
   - 1.3 [Amdahl's Law & Gustafson's Law](#13-amdahls-law)
   - 1.4 [CPU-Bound vs I/O-Bound Work](#14-cpu-bound-vs-io-bound)
   - 1.5 [The Free Lunch Is Over — Multicore Era](#15-multicore-era)
   - 1.6 [Concurrency Models Overview](#16-concurrency-models-overview)

2. [Threads & the Thread Pool](#2-threads--the-thread-pool)
   - 2.1 [OS Threads — Cost & Limits](#21-os-threads)
   - 2.2 [Thread Pool — Reuse & Work Queue](#22-thread-pool)
   - 2.3 [ThreadPool Starvation — Causes & Detection](#23-threadpool-starvation)
   - 2.4 [ThreadPool Tuning — SetMinThreads, SetMaxThreads](#24-threadpool-tuning)
   - 2.5 [Work Stealing — .NET's ThreadPool Internals](#25-work-stealing)
   - 2.6 [Thread-Local Storage — `ThreadLocal<T>`](#26-thread-local-storage)

3. [Tasks & the TPL](#3-tasks--tpl)
   - 3.1 [Task vs Thread — Key Differences](#31-task-vs-thread)
   - 3.2 [Task Creation — `Task.Run`, `Task.Factory.StartNew`](#32-task-creation)
   - 3.3 [Task Status & Lifecycle](#33-task-status--lifecycle)
   - 3.4 [Task Continuations — `ContinueWith`](#34-task-continuations)
   - 3.5 [Task Combinators — `WhenAll`, `WhenAny`, `WhenEach`](#35-task-combinators)
   - 3.6 [ValueTask — Low-Allocation Async](#36-valuetask)
   - 3.7 [Task Scheduling — `TaskScheduler`](#37-task-scheduling)
   - 3.8 [Unwrapping Tasks — `Task<Task>` Pitfall](#38-unwrapping-tasks)

4. [async/await In Depth](#4-asyncawait-in-depth)
   - 4.1 [async/await State Machine — What the Compiler Generates](#41-state-machine)
   - 4.2 [SynchronizationContext — What It Is & Why It Matters](#42-synchronizationcontext)
   - 4.3 [ConfigureAwait(false) — When & Why](#43-configureawait)
   - 4.4 [Async All the Way — Avoiding async over sync](#44-async-all-the-way)
   - 4.5 [Async Void — The Dangerous Pattern](#45-async-void)
   - 4.6 [Async in Constructors, Properties, Dispose](#46-async-edge-cases)
   - 4.7 [Async Streams — IAsyncEnumerable\<T\>](#47-async-streams)
   - 4.8 [Async Disposable — IAsyncDisposable](#48-async-disposable)
   - 4.9 [Awaiting Custom Awaitables](#49-custom-awaitables)

5. [Cancellation](#5-cancellation)
   - 5.1 [CancellationToken — Design & Usage](#51-cancellationtoken)
   - 5.2 [CancellationTokenSource — Create, Cancel, Dispose](#52-cancellationtokensource)
   - 5.3 [Linked Cancellation Tokens](#53-linked-tokens)
   - 5.4 [Cooperative Cancellation Patterns](#54-cooperative-cancellation)
   - 5.5 [Cancellation in Async Streams](#55-cancellation-async-streams)
   - 5.6 [Timeout via CancellationToken vs `Task.WhenAny`](#56-timeout-patterns)

6. [Synchronization Primitives in .NET](#6-synchronization-primitives-net)
   - 6.1 [`lock` / `Monitor` — Fast In-Process Mutex](#61-lock-monitor)
   - 6.2 [`SemaphoreSlim` — Async-Compatible Throttling](#62-semaphore-slim)
   - 6.3 [`ManualResetEventSlim` & `AutoResetEvent`](#63-reset-events)
   - 6.4 [`CountdownEvent` — Wait for N Operations](#64-countdown-event)
   - 6.5 [`Barrier` — Phase Synchronization](#65-barrier)
   - 6.6 [`ReaderWriterLockSlim` — Read-Heavy Workloads](#66-rwlock)
   - 6.7 [`SpinLock` & `SpinWait` — Busy-Wait Primitives](#67-spinlock-spinwait)
   - 6.8 [`Interlocked` — Atomic Operations](#68-interlocked)
   - 6.9 [`Volatile` — Memory Visibility](#69-volatile)

7. [Lock-Free & Wait-Free Programming](#7-lock-free--wait-free)
   - 7.1 [Why Lock-Free? — Performance & Deadlock Avoidance](#71-why-lock-free)
   - 7.2 [Compare-And-Swap (CAS) — The Foundation](#72-compare-and-swap)
   - 7.3 [ABA Problem](#73-aba-problem)
   - 7.4 [Lock-Free Stack (Treiber Stack)](#74-lock-free-stack)
   - 7.5 [Lock-Free Queue (Michael-Scott Queue)](#75-lock-free-queue)
   - 7.6 [Memory Ordering in Lock-Free Code](#76-memory-ordering)
   - 7.7 [Concurrent Collections in .NET — Internals](#77-concurrent-collections-internals)

8. [Concurrent Collections](#8-concurrent-collections)
   - 8.1 [`ConcurrentDictionary<K,V>` — Design & Gotchas](#81-concurrent-dictionary)
   - 8.2 [`ConcurrentQueue<T>` — Lock-Free FIFO](#82-concurrent-queue)
   - 8.3 [`ConcurrentStack<T>` — Lock-Free LIFO](#83-concurrent-stack)
   - 8.4 [`ConcurrentBag<T>` — Unordered, Thread-Local](#84-concurrent-bag)
   - 8.5 [`BlockingCollection<T>` — Bounded Producer-Consumer](#85-blocking-collection)
   - 8.6 [`ImmutableCollections` for Concurrency](#86-immutable-collections)
   - 8.7 [When to Use Which Concurrent Collection](#87-collection-selection-guide)

9. [Channels](#9-channels)
   - 9.1 [Channel\<T\> — Async Producer-Consumer](#91-channel)
   - 9.2 [Bounded vs Unbounded Channels](#92-bounded-vs-unbounded)
   - 9.3 [Single vs Multiple Readers/Writers](#93-channel-modes)
   - 9.4 [Channel Pipeline Patterns](#94-channel-pipelines)
   - 9.5 [Channel vs BlockingCollection vs ConcurrentQueue](#95-channel-comparison)
   - 9.6 [Backpressure with Bounded Channels](#96-backpressure)

10. [Parallel Programming — Data Parallelism](#10-data-parallelism)
    - 10.1 [Parallel.For & Parallel.ForEach](#101-parallel-for-foreach)
    - 10.2 [Parallel.ForEachAsync (.NET 6+)](#102-parallel-foreachasync)
    - 10.3 [Partitioning Strategies](#103-partitioning-strategies)
    - 10.4 [Thread-Local State in Parallel Loops](#104-thread-local-parallel)
    - 10.5 [PLINQ — Parallel LINQ](#105-plinq)
    - 10.6 [PLINQ Ordering, Partitioning, Merging](#106-plinq-advanced)
    - 10.7 [When Parallelism Hurts — Overhead & False Sharing](#107-when-parallelism-hurts)

11. [Parallel Programming — Task Parallelism](#11-task-parallelism)
    - 11.1 [Task Parallel Library — Task Graph Execution](#111-task-graph)
    - 11.2 [Dataflow — TPL Dataflow Library](#112-tpl-dataflow)
    - 11.3 [ActionBlock, TransformBlock, BufferBlock](#113-dataflow-blocks)
    - 11.4 [Linking Blocks & Completion Propagation](#114-linking-blocks)
    - 11.5 [Dataflow vs Channel\<T\>](#115-dataflow-vs-channel)

12. [The .NET Memory Model](#12-net-memory-model)
    - 12.1 [Memory Model Fundamentals — Visibility & Ordering](#121-memory-model-fundamentals)
    - 12.2 [Happens-Before Relationship](#122-happens-before)
    - 12.3 [Compiler & CPU Reordering](#123-reordering)
    - 12.4 [Memory Barriers in .NET — `Thread.MemoryBarrier`](#124-memory-barriers)
    - 12.5 [`volatile` vs `Volatile.Read/Write` vs `Interlocked`](#125-volatile-comparison)
    - 12.6 [Double-Checked Locking — Pattern & Pitfalls](#126-double-checked-locking)
    - 12.7 [The .NET Memory Model vs Java Memory Model](#127-net-vs-java-mm)

13. [Common Concurrency Bugs](#13-common-concurrency-bugs)
    - 13.1 [Race Conditions — Detection & Prevention](#131-race-conditions)
    - 13.2 [Deadlocks — Patterns in .NET](#132-deadlocks-net)
    - 13.3 [Async Deadlock — `.Result` and `.Wait()` Trap](#133-async-deadlock)
    - 13.4 [Starvation — ThreadPool & Lock Starvation](#134-starvation)
    - 13.5 [Livelock](#135-livelock)
    - 13.6 [Torn Reads — Non-Atomic Multi-Word Operations](#136-torn-reads)
    - 13.7 [Closure Capture Bugs in Parallel Loops](#137-closure-capture-bugs)
    - 13.8 [Testing Concurrent Code](#138-testing-concurrent-code)

14. [async/await Performance](#14-asyncawait-performance)
    - 14.1 [Cost of async/await — Allocation & State Machine](#141-async-cost)
    - 14.2 [Hot Path Optimization — `ValueTask` & `IValueTaskSource`](#142-valuetask-optimization)
    - 14.3 [Avoiding Unnecessary `await` — Sync Fast Path](#143-sync-fast-path)
    - 14.4 [Pooling Async State Machines](#144-pooling-state-machines)
    - 14.5 [Measuring async Overhead with BenchmarkDotNet](#145-benchmarking-async)

15. [Reactive Programming](#15-reactive-programming)
    - 15.1 [Reactive Extensions (Rx.NET) — Observable Streams](#151-rxnet-overview)
    - 15.2 [Observable vs IAsyncEnumerable — When to Use Each](#152-observable-vs-iasyncenumerable)
    - 15.3 [Subjects — Hot vs Cold Observables](#153-subjects)
    - 15.4 [Key Rx Operators — Throttle, Debounce, Buffer, Window, Merge](#154-rx-operators)
    - 15.5 [Backpressure in Rx.NET](#155-rx-backpressure)
    - 15.6 [Testing Rx Pipelines with TestScheduler](#156-testing-rx)

16. [Actor Model](#16-actor-model)
    - 16.1 [Actor Model Concepts — Actors, Messages, Mailboxes](#161-actor-concepts)
    - 16.2 [Microsoft Orleans — Virtual Actors](#162-orleans)
    - 16.3 [Akka.NET — Classic Actor Model](#163-akkanet)
    - 16.4 [Actor Model vs Thread Pool vs Channel Pipelines](#164-actor-comparison)

17. [Concurrency in ASP.NET Core](#17-concurrency-aspnet-core)
    - 17.1 [Request Handling — One Task per Request](#171-request-model)
    - 17.2 [Shared State in ASP.NET Core — What's Safe](#172-shared-state)
    - 17.3 [IMemoryCache & IDistributedCache Thread Safety](#173-cache-thread-safety)
    - 17.4 [Singleton, Scoped, Transient in Concurrent Context](#174-di-lifetimes-concurrency)
    - 17.5 [Rate Limiting in ASP.NET Core (.NET 7+)](#175-rate-limiting)
    - 17.6 [Concurrent Request Patterns — Fan-Out, Fan-In](#176-fan-out-fan-in)

18. [High-Performance Concurrency Patterns](#18-high-performance-patterns)
    - 18.1 [LMAX Disruptor Pattern](#181-disruptor-pattern)
    - 18.2 [Single-Producer Single-Consumer (SPSC) Ring Buffer](#182-spsc-ring-buffer)
    - 18.3 [Object Pooling for Concurrency](#183-object-pooling)
    - 18.4 [False Sharing — Cache Line Padding](#184-false-sharing)
    - 18.5 [Thread Affinity & NUMA-Aware Concurrency](#185-numa-concurrency)
    - 18.6 [Measuring Concurrency Performance](#186-measuring-concurrency)

---

## Section Prompts

### 1. Foundations

#### 1.1 Concurrency vs Parallelism vs Async
```
Explain three related but distinct concepts: Concurrency (dealing with multiple things at once — structure: interleaving on one core is still concurrent), Parallelism (doing multiple things at once — requires multiple cores, subset of concurrency), Async (non-blocking execution — a thread doesn't block while waiting, doesn't necessarily mean parallel). Show concrete .NET examples: async/await on single-core = concurrent not parallel, Parallel.For on 8 cores = parallel, Node.js = concurrent but not parallel. Explain why conflating these causes incorrect mental models and bugs. Draw the Venn diagram.
```

#### 1.2 Why Concurrency Is Hard
```
Explain the fundamental difficulties of concurrent programming: non-determinism (timing-dependent execution order), shared mutable state (the root of most bugs), partial failure (one thread fails, others continue), visibility (changes not immediately visible to other threads without synchronization), ordering (operations may reorder), and exponential state space (n threads × m states = n^m combinations to reason about). Show a 5-line race condition in C# that looks obviously correct. Explain why testing can't prove correctness in concurrent code (Heisenbugs). This section should motivate careful design, not fear.
```

#### 1.3 Amdahl's Law
```
Explain Amdahl's Law: speedup S = 1 / (F + (1-F)/N) where F = serial fraction, N = processors. Show that 5% serial code limits speedup to 20x regardless of cores. Cover implications: find and reduce serial bottlenecks before adding more cores. Cover Gustafson's Law (reframes: as problem size grows, serial fraction shrinks — parallelism scales with problem size). Show .NET implications: GC stop-the-world pauses are serial — reason why Server GC scales better (multiple GC threads). Calculate theoretical max speedup for a .NET batch job with 10% serial code.
```

#### 1.4 CPU-Bound vs I/O-Bound
```
Explain CPU-bound work (compute: limited by processor speed — sorting, encryption, image processing) vs I/O-bound work (waiting for external systems: disk, network, database). Explain different solutions: CPU-bound → parallelism (Task.Run, Parallel.For, more cores), I/O-bound → async (await, non-blocking — more threads don't help, they'll all just block). Show the cardinal rule: don't use Task.Run for I/O-bound work (wastes thread), don't use just async for CPU-bound work (doesn't use more cores). Mixed: async I/O + parallel CPU processing. Show how to identify with dotnet-counters.
```

#### 1.5 The Multicore Era
```
Explain the shift: pre-2005, clock speeds doubled every 18 months (free lunch — programs got faster without changes). Post-2005, clock speeds plateaued, core counts doubled instead. The free lunch is over — sequential programs don't automatically speed up. Cover that .NET has evolved to exploit multicore: ThreadPool, async/await, PLINQ, TPL, SIMD. Show processor trends (Intel/AMD core count history). Explain that .NET developers who write blocking synchronous code can't exploit modern hardware. Cover the consequences: cloud costs scale with cores not clock speed.
```

#### 1.6 Concurrency Models Overview
```
Survey concurrency models with .NET relevance: Shared Memory with Locks (traditional — Thread + Monitor, easy to get wrong), Message Passing (CSP — Channel<T>, Go channels, Erlang), Actor Model (each actor has own state, communicates via messages — Orleans, Akka.NET), Reactive Streams (push-based event streams — Rx.NET), async/await (sequential-looking async code — .NET's primary model), Software Transactional Memory (STM — not in mainstream .NET), and Data Parallelism (parallel loops, PLINQ). Show that .NET supports all models. Explain when to use each.
```

---

### 2. Threads & the Thread Pool

#### 2.1 OS Threads
```
Explain OS thread costs: creation (~10µs, 1MB default stack on Windows, 8MB on Linux), context switch (~1-10µs depending on cache state), memory overhead (stack + OS TCB + TLS). Show that 1000 threads = 1GB stack memory. Explain that threads are NOT free — creating one per request in a web server is fundamentally flawed. Cover maximum useful thread count (≈ cores for CPU-bound, limited by memory and context-switch overhead for I/O-bound). Show Thread class usage is appropriate only for: long-running background loops, foreground threads needing specific priority/apartment state, or OS thread properties. Otherwise use ThreadPool/Task.
```

#### 2.2 Thread Pool
```
Explain .NET ThreadPool: pool of pre-created OS threads, work items queued to them (eliminates creation overhead). Architecture: global queue (FIFO) + per-thread local queues (LIFO — cache friendly), hill-climbing algorithm (adjusts thread count by monitoring throughput — adds 1 thread every 500ms if throughput improves). Cover thread injection rate: pool won't starve but grows slowly — blocking calls delay injection. Show ThreadPool.QueueUserWorkItem (low-level), Task.Run (preferred). Cover I/O thread pool (separate pool for I/O completion callbacks — not for user work). Show ThreadPool.GetAvailableThreads/GetMaxThreads.
```

#### 2.3 ThreadPool Starvation
```
Explain ThreadPool starvation: all threads blocked (sync I/O, Thread.Sleep, long-held locks) → new work can't execute → requests time out or accumulate. Show classic starvation pattern: Task.Run(() => someAsyncMethod().Result) × 100 → pool exhausted. Diagnosis: dotnet-counters show ThreadPool.Queue.Length growing, ThreadPool.Thread.Count high but CPU low. Fix: never block ThreadPool threads — use async/await throughout. Show ThreadPool.SetMinThreads as workaround for legacy code (pre-warms threads to avoid injection delay, not a real fix for blocking code). Show EventSource ThreadPoolDequeue events for starvation detection.
```

#### 2.4 ThreadPool Tuning
```
Explain ThreadPool tuning parameters: ThreadPool.SetMinThreads(workers, completionPorts) — pre-warm worker and I/O completion threads, reduces injection latency at startup (set to number of concurrent expected requests for web apps), ThreadPool.SetMaxThreads (rarely needed — caps at some safe limit). Cover environment variables: DOTNET_ThreadPool_UnfairSemiOrderedLocalQueues, DOTNET_THREADPOOL_QUEUEDEBUG. Show that increasing min threads helps bursty workloads (avoids 500ms hill-climbing delay). Cover AppContext.SetSwitch for ThreadPool behavior. Show impact with benchmark: latency spike at startup without SetMinThreads.
```

#### 2.5 Work Stealing
```
Explain .NET ThreadPool work-stealing: each thread has a local deque (double-ended queue), pushes/pops from its own tail (LIFO — cache warm for continuation-of-same-work), other threads steal from head (FIFO — oldest work, avoids starving long-queued items). Benefits: natural load balancing without central lock, cache locality for parent-child task pairs (child executes on same thread as parent before parent continues). Show ConcurrentExclusiveSchedulerPair for exclusive vs concurrent task scheduling. Explain why Task.Run(() => child) often executes inline — child steals the calling thread. Show TaskCreationOptions.HideScheduler and TaskCreationOptions.LongRunning.
```

#### 2.6 ThreadLocal Storage
```
Cover ThreadLocal<T> for per-thread state: each thread gets its own independent instance (factory function called once per thread), prevents sharing and synchronization overhead. Use cases: per-thread Random (System.Random is not thread-safe), per-thread buffers, per-thread database connections (anti-pattern for async), per-thread formatters. Show ThreadLocal<T> with isThreadLocal=true for tracking all values. Cover [ThreadStatic] attribute (older approach, no initialization — surprising default value behavior on non-first threads). Explain that async/await may resume on different thread — ThreadLocal<T> values don't follow async continuations. Use AsyncLocal<T> for async flow.
```

---

### 3. Tasks & the TPL

#### 3.1 Task vs Thread
```
Explain key differences: Thread = OS thread (1MB stack, kernel object), Task = logical unit of work (scheduled on ThreadPool, lightweight, composable). Task doesn't equal thread: multiple tasks may run on one thread (serialized), or one task may run on multiple threads (via continuations). Task provides composition (WhenAll, WhenAny), cancellation, exception propagation, and return values. Show that Task is the right abstraction for 99% of concurrent work — Thread for the 1% needing specific thread properties. Cover Task.Status, Task.Exception (AggregateException wrapping). Show Task.CompletedTask, Task.FromResult<T> for pre-completed tasks.
```

#### 3.2 Task Creation
```
Compare task creation methods: Task.Run(action) (queues to ThreadPool, unwraps inner Task if async — preferred for CPU-bound), Task.Factory.StartNew(action, options) (more control — TaskCreationOptions.LongRunning creates dedicated thread, TaskCreationOptions.AttachedToParent for nested tasks), new Task(action) then .Start() (rarely needed), Task.FromResult<T> (pre-completed, no allocation in .NET 6+ for common values), Task.CompletedTask (cached singleton). Show Task.Factory.StartNew pitfalls: doesn't unwrap Task<Task> (use Task.Run or Unwrap()), scheduler inheritance. When to use LongRunning: blocking work > 1 second that can't be made async.
```

#### 3.3 Task Status & Lifecycle
```
Explain Task state machine: Created → WaitingForActivation → WaitingToRun → Running → RanToCompletion / Faulted / Canceled. Show TaskStatus enum. Cover Task.IsCompleted (true for all terminal states), Task.IsCompletedSuccessfully (.NET 5+), Task.IsFaulted, Task.IsCanceled. Explain AggregateException wrapping: Task.Exception contains AggregateException, await unwraps first inner exception. Cover Task.Wait() vs await (Wait blocks thread, await suspends), unobserved exceptions (TaskScheduler.UnobservedTaskException event). Show how to propagate cancellation: OperationCanceledException caught → Task transitions to Canceled state.
```

#### 3.4 Task Continuations
```
Explain ContinueWith: schedule work to run after task completes. Cover TaskContinuationOptions (OnlyOnRanToCompletion, OnlyOnFaulted, NotOnCanceled), passing state to avoid closure allocation, ExecuteSynchronously (run continuation on completing thread). Show why await is almost always better than ContinueWith: cleaner code, proper SynchronizationContext handling, exception propagation. Cover cases where ContinueWith is still useful: attaching to non-async task, complex branching based on task outcome, fire-and-forget with exception handling. Show Task.ContinueWith + Unwrap for async continuations without await.
```

#### 3.5 Task Combinators
```
Cover Task combinators: Task.WhenAll(tasks) (wait for all, collect results, first exception propagates on await but all exceptions in AggregateException), Task.WhenAny(tasks) (returns first completed task — use for timeout pattern, hedging, first-response wins), Task.WhenEach (.NET 9 — iterate tasks as they complete), Task.WaitAll (blocking — avoid on ThreadPool), Task.WaitAny (blocking). Show WhenAll for parallel fan-out (parallel API calls), WhenAny for timeout implementation, WhenEach for streaming results as available. Cover exception handling in WhenAll (use try/catch around await, access .Exception for all failures).
```

#### 3.6 ValueTask
```
Explain ValueTask<T>: struct (stack-allocated vs Task heap-allocated), designed for frequently-synchronous code paths (like reading from a buffer that's usually available). Rules: await ValueTask only once, don't call GetAwaiter().GetResult() if may be async, don't store and await later. Cover IValueTaskSource<T> for fully pool-based state machine. Show when to use: cache reads (usually hits synchronously), stream reads (buffer often has data). Show when NOT to use: multiple awaits, stored tasks, rarely-synchronous paths (overhead without benefit). Benchmark: ValueTask vs Task for 95% synchronous path. Cover .AsTask() for converting when Task features needed.
```

#### 3.7 Task Scheduling
```
Explain TaskScheduler: controls where/how tasks execute. Built-in: ThreadPoolTaskScheduler (default), SynchronizationContextTaskScheduler (marshals to captured context). Custom schedulers: TaskScheduler.FromCurrentSynchronizationContext() (UI thread), ConcurrentExclusiveSchedulerPair (exclusive = serialized access, concurrent = parallel). Show custom LimitedConcurrencyLevelTaskScheduler. Cover TaskScheduler.UnobservedTaskException for catching unobserved exceptions. Explain that Task.Run always uses ThreadPool scheduler (ignores current scheduler — important: inner Task.Run in a limited-concurrency context escapes the limit). Show how TaskScheduler interacts with async/await.
```

#### 3.8 Unwrapping Tasks
```
Explain the Task<Task> anti-pattern: Task.Factory.StartNew(async () => await something) returns Task<Task>, outer task completes when async lambda starts (not finishes). Show bugs: awaiting outer task = await the start, not the completion. Fix: Task.Run (unwraps automatically), or .Unwrap() extension method. Show similar pattern with continuations: ContinueWith(async t => ...) returns Task<Task> — use Unwrap(). Cover the pattern in practice: collection of Task<Task> when incorrectly projecting async lambdas. This is one of the most common async bugs — show clearly with before/after.
```

---

### 4. async/await In Depth

#### 4.1 State Machine
```
Explain what the compiler generates for async methods: a struct implementing IAsyncStateMachine with a state field (int — tracks where execution is), all local variables become fields (hoisted from stack to heap), awaited expression result stored in field, MoveNext() called on each resume. Show a simple async method and its decompiled state machine (use SharpLab.io). Explain why async methods allocate (state machine struct boxed to heap — unless elided by JIT for synchronously-completing methods). Cover AsyncMethodBuilder and how .NET 6+ struct-based state machines reduce allocations. Show how this explains why async methods have overhead vs synchronous.
```

#### 4.2 SynchronizationContext
```
Explain SynchronizationContext: abstraction for scheduling continuations on a specific thread. Types: null/default (ThreadPool — continuations go to any ThreadPool thread), WindowsFormsSynchronizationContext (continuations on UI thread), AspNetSynchronizationContext (old ASP.NET — one request at a time), DispatcherSynchronizationContext (WPF). Show that await captures current SynchronizationContext and resumes on it by default. Explain the classic ASP.NET deadlock: .Result inside async method → context captured → continuation waits for context → context waiting for .Result → deadlock. Show that ASP.NET Core has no SynchronizationContext — why this eliminated the common deadlock.
```

#### 4.3 ConfigureAwait(false)
```
Explain ConfigureAwait(false): tells awaiter not to capture/resume on SynchronizationContext — resumes on any ThreadPool thread. When to use: library code (never needs UI/request context, avoids capturing overhead, prevents deadlock if called from context-heavy code), performance-critical paths (context capture has overhead). When NOT to use: code that accesses UI elements after await, code that needs HttpContext or ClaimsPrincipal after await in ASP.NET Core (though ASP.NET Core has no SC, flow via AsyncLocal — ConfigureAwait(false) doesn't break this). Cover the rule: use ConfigureAwait(false) everywhere in library code, application code can often skip it.
```

#### 4.4 Async All the Way
```
Explain "async all the way" principle: once async, the entire call chain should be async — mixing sync and async causes deadlocks, defeats purpose of async. Show sync-over-async anti-patterns: .Result, .Wait(), GetAwaiter().GetResult() (block thread waiting for async result — deadlock risk, wastes thread). Cover async-over-sync anti-patterns: wrapping sync CPU work in Task.Run needlessly (fake async — just moves blocking to another thread). Show cases where blocking is unavoidable (static constructors, property getters) and how to handle safely (lazy initialization, synchronous fallback). Show how to refactor a blocking synchronous call chain to async.
```

#### 4.5 Async Void
```
Explain async void: fire-and-forget async method, exceptions are unobserved (go to AppDomain.UnhandledException — process crashes in many hosts), can't be awaited, no way to know when it completes. When async void is the ONLY option: event handlers (required signature void). All other uses are bugs. Show the pattern: async void EventHandler calls async Task method (thin wrapper). Cover IAsyncDisposable and ICommand patterns for avoiding async void. Show that ASP.NET Core won't surface async void exceptions properly. Use Analyzer rule CA2008 to detect. Cover wrapping async void in try/catch with proper error reporting.
```

#### 4.6 Async Edge Cases
```
Cover async in unusual places: async constructors (not supported — use static async factory method or lazy initialization), async properties (not supported — use method, or if event-driven use INotifyPropertyChanged + background Task), async Dispose (IAsyncDisposable.DisposeAsync — await using, don't block in Dispose()), async in LINQ (ToListAsync, ForEachAsync — don't use async lambda in Select without Unwrap), async in locks (can't await inside lock — use SemaphoreSlim as async lock), async Main (supported in C# 7.1+ — static async Task Main). Show each pattern with correct implementation.
```

#### 4.7 Async Streams
```
Explain IAsyncEnumerable<T> (.NET Core 3+): async iteration with yield return in async methods, consume with await foreach. Use cases: streaming data from DB (IAsyncEnumerable from EF Core), streaming HTTP responses, reading from Channel<T>. Show producer (async IAsyncEnumerable with yield), consumer (await foreach with cancellation). Cover IAsyncEnumerator<T> interface. Show that LINQ doesn't work on IAsyncEnumerable — use System.Linq.Async NuGet or manual iteration. Cover WithCancellation(ct) and ConfigureAwait(false) on await foreach. Show converting IAsyncEnumerable to Channel, to List (ToListAsync), to streaming HTTP response (SSE).
```

#### 4.8 Async Disposable
```
Explain IAsyncDisposable: for async cleanup (closing network connections, flushing buffers, draining channels). Implementation: DisposeAsync returns ValueTask. Use: await using statement/declaration. Cover combined sync+async dispose (implement both IDisposable and IAsyncDisposable, sync Dispose calls .DisposeAsync().AsTask().GetAwaiter().GetResult() if no better option, or just complete async work synchronously as fallback). Show DisposeAsync in a database connection, stream, Channel<T>. Cover that ASP.NET Core DI supports IAsyncDisposable for scoped services. Show SafeAsyncDisposable base class pattern.
```

#### 4.9 Custom Awaitables
```
Show how to create custom awaitables: implement GetAwaiter() extension or instance method returning a type implementing INotifyCompletion (OnCompleted) + IsCompleted + GetResult(). Show a YieldAwaitable (Task.Yield() internally), a DelayAwaitable, and a socket-read awaitable. Cover ICriticalNotifyCompletion for performance. Explain that async/await works on ANY awaitable — not just Task. Show that .NET's own await-able types: Task, ValueTask, Task<T>, ValueTask<T>, ConfiguredTaskAwaitable. Cover why understanding awaitables helps optimize async performance (custom awaitables can avoid heap allocation).
```

---

### 5. Cancellation

#### 5.1 CancellationToken
```
Explain CancellationToken: read-only struct, token passed to cancellable operations. Properties: IsCancellationRequested (poll), CanBeCanceled (false for None token — avoid checking overhead), None (a never-cancellable default). Methods: Register (callback on cancellation), ThrowIfCancellationRequested (throw OperationCanceledException if canceled). Design principle: accept CancellationToken on every async method, pass through to all sub-operations. Show that OperationCanceledException is not a bug — it's the normal cancellation path. Cover Task transitioning to Canceled state on OCE. Show CancellationToken.None for optional cancellation parameters.
```

#### 5.2 CancellationTokenSource
```
Explain CancellationTokenSource: creates and controls cancellation. CTS.Token gets the token. CTS.Cancel() triggers cancellation (synchronously calls all registered callbacks). CTS.CancelAfter(timeout) for timeout-based cancellation. CTS.Dispose() to release OS timer. Show patterns: using declaration for CTS (auto-dispose), CreateLinkedTokenSource for combining, checking for disposal (ObjectDisposedException after cancel). Cover the ordering: cancel the source, wait for async work, dispose source. Show timeout pattern with CTS.CancelAfter vs Task.WhenAny(task, Task.Delay(timeout)). Cover new TimeoutToken factory methods in .NET 8.
```

#### 5.3 Linked Tokens
```
Explain CancellationTokenSource.CreateLinkedTokenSource(token1, token2): creates a new CTS that cancels when either source cancels. Use cases: request cancellation + user cancellation + global shutdown cancellation (link all three), per-operation timeout (link request token + new timeout token). Show 3-token link pattern for ASP.NET Core: HttpContext.RequestAborted + user's cancel button token + application shutdown token. Cover that linked CTS must be disposed separately from source tokens. Show that linking many tokens has no performance cliff — it's just a chain of registrations.
```

#### 5.4 Cooperative Cancellation Patterns
```
Cover patterns for implementing cancellation cooperatively: polling (check ct.IsCancellationRequested in tight loops — for CPU-bound work), throwing (ct.ThrowIfCancellationRequested() — cleaner), passing to awaitable (most async APIs accept CancellationToken — let them handle it), registration (ct.Register(cleanup) for cleanup on cancel), WaitHandle (ct.WaitHandle for interop with WaitHandle-based APIs). Show CPU-bound parallel loop with cancellation: Parallel.ForEach with ParallelOptions.CancellationToken. Cover that cancellation is best-effort — not all operations are immediately cancellable.
```

#### 5.5 Cancellation in Async Streams
```
Show cancellation patterns for IAsyncEnumerable<T>: pass CancellationToken to the producing method, use [EnumeratorCancellation] attribute on the parameter so WithCancellation(ct) flows correctly, check cancellation inside the async iterator. Show await foreach with cancellation: await foreach (var item in source.WithCancellation(ct)). Cover that canceling an async stream throws OperationCanceledException out of the foreach. Show timeout on async stream using CTS.CancelAfter. Cover the combined pattern: IAsyncEnumerable producer that reads from network + cancellation that stops both the foreach and the underlying connection.
```

#### 5.6 Timeout Patterns
```
Cover timeout implementation patterns in .NET: CancellationTokenSource.CancelAfter (simplest, best for most cases), Task.WhenAny(work, Task.Delay(timeout)) (timeout race — doesn't cancel work, just stops waiting — usually wrong), CancellationTokenSource.CreateLinkedTokenSource(requestToken, timeoutCts.Token) (links request and timeout — cancels underlying work), HttpClient.Timeout (wraps CancelAfter internally), PeriodicTimer for recurring with cancellation. Show the anti-pattern: Task.WhenAny without cancellation (work continues in background, wasting resources). Show the correct pattern: always cancel the work, then handle OperationCanceledException.
```

---

### 6. Synchronization Primitives in .NET

#### 6.1 lock / Monitor
```
Comprehensive guide to lock and Monitor in .NET: lock(obj) {} = Monitor.Enter(obj) + try/finally Monitor.Exit(obj). Reentrancy (same thread can re-acquire — lock is reentrant). Monitor.TryEnter(obj, timeout) for bounded wait. Monitor.Wait(obj) / Monitor.Pulse(obj) / Monitor.PulseAll(obj) for condition variables (Wait releases lock + sleeps, Pulse wakes one waiter + waiter must re-acquire lock). Performance: uncontended lock ~10ns, contended ~1µs (kernel mode switch). Show lock on private readonly field (not on 'this', not on type, not on string — explain why). Cover Lock class (.NET 9 — semantic equivalent of lock but non-recursive option, faster).
```

#### 6.2 SemaphoreSlim
```
Deep dive into SemaphoreSlim: counting semaphore, initialCount (initial available permits), maxCount (cap). WaitAsync (async-compatible — don't block on Wait() in async code), Release(count) to return multiple permits. Use cases: limit concurrent HTTP calls (SemaphoreSlim(10) = max 10 concurrent), limit concurrent DB connections, rate limiting. Show the async mutex pattern: SemaphoreSlim(1, 1) as a non-reentrant async mutex (lock doesn't work across awaits). Cover: always Release in finally block, CurrentCount for monitoring. Show throttled parallel download with SemaphoreSlim. Explain why SemaphoreSlim is preferred over Semaphore for in-process use (no kernel object — faster).
```

#### 6.3 Reset Events
```
Cover ManualResetEventSlim (signal once, all waiters released until manually reset — like a gate), AutoResetEvent (signal once, one waiter released, auto-resets — like a turnstile), ManualResetEvent (kernel-based, cross-process capable). Show WaitAsync (.NET 6+ via TaskCompletionSource wrapper or use AsyncManualResetEvent from AsyncEx NuGet for proper async support). Use cases: ManualResetEventSlim for "ready" signal (initialization complete, all waiters proceed), AutoResetEvent for work-available signal (producer signals, one consumer wakes). Cover CountdownEvent for waiting for N signals. Show that EventWaitHandle is base for both MRE and ARE.
```

#### 6.4 CountdownEvent
```
Explain CountdownEvent: initialized to N, each Signal() decrements, Wait() blocks until 0. Use cases: wait for N parallel operations to complete (alternative to Task.WhenAll when tasks aren't known upfront), barrier-like synchronization for non-task parallel code. Show AddCount/TryAddCount for dynamically adding signals. Compare with Task.WhenAll (preferred when using Tasks), Barrier (for repeated phases), SemaphoreSlim (different semantics). Show WaitAsync via wrapping. Cover Reset for reuse. Practical example: parallel data processing where worker count is dynamic.
```

#### 6.5 Barrier
```
Explain Barrier: synchronizes N threads through repeated phases. Each thread calls SignalAndWait() at phase end — all threads wait until all reach the barrier, then all proceed to next phase. PostPhaseAction runs between phases (on one thread). Use cases: parallel algorithms with phases (parallel sort with merge phases, simulation steps), N-body simulation, game loop with multiple parallel update stages. Show C# implementation with Barrier. Cover Barrier.AddParticipant/RemoveParticipant for dynamic participant count. Explain that Barrier maps to the parallel algorithm concept of "barrier synchronization" and is similar to MPI_Barrier.
```

#### 6.6 ReaderWriterLockSlim
```
Explain ReaderWriterLockSlim: multiple concurrent readers OR one exclusive writer. Methods: EnterReadLock/ExitReadLock, EnterWriteLock/ExitWriteLock, EnterUpgradeableReadLock (can upgrade to write without releasing read lock — prevents other readers/writers between check and update). Show benchmark: RWLS vs lock at different read/write ratios — RWLS wins when >90% reads. Cover LockRecursionPolicy (NoRecursion default — prevents reentrancy bugs, Supports Recursion for compatibility). Show the correct usage pattern with try/finally for exit. Cover that RWLS is NOT async-compatible — use alternative for async code (SemaphoreSlim or AsyncReaderWriterLock from AsyncEx).
```

#### 6.7 SpinLock & SpinWait
```
Explain SpinLock (struct — no heap alloc, busy-wait mutex): Enter/Exit, TryEnter with timeout. Use when lock held < ~50ns and thread count ≤ core count (otherwise burning CPU for nothing). Show SpinLock usage for protecting single-field updates in hot path. Explain SpinWait (adaptive wait — spins using Thread.SpinWait (PAUSE instruction, reduces power/heat), then Thread.Yield, then Thread.Sleep(0), then Thread.Sleep(1) — backoff strategy). Show SpinWait in lock-free polling loops. Cover that SpinWait is what Interlocked + retry loops should use. Show SpinWait.SpinUntil for condition polling. Benchmark SpinLock vs Monitor for 10ns critical section.
```

#### 6.8 Interlocked
```
Deep dive into System.Threading.Interlocked: Increment/Decrement (atomic ±1, returns new value), Add (atomic += n), Exchange (atomic swap, returns old value), CompareExchange (CAS — swap if current == expected, returns actual old value), Read (atomic 64-bit read on 32-bit OS), And/Or (.NET 5+, atomic bitwise). Show CAS loop pattern: do { old = field; } while (Interlocked.CompareExchange(ref field, newValue, old) != old). Cover that CAS is the primitive behind all lock-free algorithms. Show Interlocked.CompareExchange<T> for reference types. Explain memory ordering: Interlocked operations are sequentially consistent (full fence). Performance: ~10-30 cycles vs 2-5 cycles for non-atomic.
```

#### 6.9 volatile
```
Explain volatile in C# precisely: prevents compiler/JIT from caching field value in register (ensures fresh read), generates acquire fence on read and release fence on write — NOT a full memory barrier, NOT atomic for 64-bit on 32-bit systems. Use cases: stop flag (bool _shouldStop), published reference (set to non-null once, read many times), double-checked locking (volatile ref to instance). Show what volatile does NOT provide: atomicity for compound operations (read-modify-write still needs Interlocked), sequential consistency (use Interlocked/lock for that). Cover Volatile.Read<T>/Volatile.Write<T> (same semantics, works on locals and array elements). Show the correct double-checked locking pattern with volatile.
```

---

### 7. Lock-Free & Wait-Free

#### 7.1 Why Lock-Free
```
Explain lock-free programming goals: avoid OS thread blocking (no kernel mode switch on contention), no deadlock possible (no locks to deadlock on), progress guarantee (at least one thread makes progress even if others are delayed), better scalability under contention. Show benchmark: under high contention, Interlocked CAS outperforms Mutex by 10-100x. Cover that lock-free is harder to write correctly, harder to test, and only worthwhile for specific hot paths. Cover wait-free (every thread makes progress in bounded steps — even stronger, rarely practical) vs lock-free (some thread makes progress — more common). Show .NET's concurrent collections as examples.
```

#### 7.2 Compare-And-Swap
```
Explain CAS as the fundamental lock-free primitive: atomically compare memory location to expected value, if match then swap to new value, return old value. Show the retry loop pattern: read → compute new value → CAS(ref, new, expected) → retry if CAS failed (another thread modified). Cover hardware: x86 LOCK CMPXCHG instruction, ARM LDREX/STREX. Show implementing a lock-free counter, lock-free push (stack), lock-free enqueue (queue). Explain that CAS retry under contention causes "spinning" — not truly non-blocking under high contention. Show Interlocked.CompareExchange as .NET's CAS. Cover why CAS is not composable (can't atomically update two separate locations).
```

#### 7.3 ABA Problem
```
Explain ABA problem: thread reads A, is preempted, another thread changes A→B→A, first thread's CAS succeeds because value is A again — but state has changed. Show a concrete example with a lock-free stack: pop reads head node A, another thread pops A (frees it) and pushes new node A' at same address — original thread's CAS sees "A" (reused address) but it's the wrong node. Solutions: tagged pointers (add version counter — compare address+version), garbage collection eliminates address reuse (why .NET managed code rarely hits ABA), hazard pointers (delay node reclamation). Explain that ABA mostly affects unmanaged memory; .NET GC prevents address reuse.
```

#### 7.4 Lock-Free Stack
```
Implement Treiber Stack (lock-free stack) in C# using Interlocked.CompareExchange: Push (read head, create new node pointing to head, CAS head to new node), Pop (read head, CAS head to head.Next). Show that GC prevents ABA. Handle null head (empty stack). Show SpinWait in retry loop for backoff under contention. Cover that ConcurrentStack<T> in .NET IS a Treiber stack. Show performance vs lock-based stack under different contention levels. Explain the non-blocking progress: even if one thread is paused, others can still push/pop. Cover limitations: no efficient random access, no bulk operations.
```

#### 7.5 Lock-Free Queue
```
Explain Michael-Scott Queue (lock-free FIFO): two Interlocked.CompareExchange operations — one for tail (enqueue) and one for head (dequeue). Cover the dummy node (sentinel) that simplifies empty queue handling. Show enqueue: read tail, CAS tail.Next to new node, swing tail forward. Show dequeue: read head.Next (first real node), CAS head to head.Next, return old head.Next value. Cover that ConcurrentQueue<T> in .NET uses a segmented array approach (more cache-friendly than pointer-per-node). Show that lock-free queue is complex to implement correctly — prefer ConcurrentQueue<T> or Channel<T> in practice.
```

#### 7.6 Memory Ordering in Lock-Free Code
```
Explain memory ordering requirements for lock-free algorithms: lock-free code must reason about CPU and compiler reordering. Show that volatile + Interlocked provide: volatile read = acquire fence (no reads/writes after can move before), volatile write = release fence (no reads/writes before can move after), Interlocked = full fence (sequentially consistent). Cover the publish pattern: write data fields (need release fence), then write pointer (volatile). Read pattern: read pointer (volatile/acquire), then read data. Show that locks provide acquire on entry, release on exit — lock-free code must explicitly manage these semantics. Use Volatile.Read/Write for surgical fencing.
```

#### 7.7 Concurrent Collections Internals
```
Explain .NET concurrent collection implementations: ConcurrentStack<T> (Treiber stack with Interlocked), ConcurrentQueue<T> (segmented array — 32-element segments added atomically, enqueue/dequeue use per-segment Interlocked ops, very cache-friendly vs pointer-chain), ConcurrentDictionary<K,V> (striped locking — 31 locks, bucket % 31 = which lock, fine-grained vs global lock), ConcurrentBag<T> (thread-local WorkStealingQueue — each thread has own list, steal from others when empty — excellent for same-thread produce-consume). Show why each design was chosen. Cover memory layout and performance implications.
```

---

### 8. Concurrent Collections

#### 8.1 ConcurrentDictionary
```
Deep dive into ConcurrentDictionary<K,V>: O(1) average for Get/Add/Update, striped locking (31 stripes — contention only between threads hitting same stripe), thread-safe atomic operations (GetOrAdd, AddOrUpdate, TryAdd, TryUpdate, TryRemove). Cover GetOrAdd pitfall: factory may be called multiple times under concurrency (value constructed but discarded if another thread wins race — factory must be side-effect free or use lazy pattern). Show GetOrAdd(key, Lazy<V>) pattern for expensive factories. Cover AddOrUpdate for thread-safe counter increment: AddOrUpdate(key, 1, (k, old) => old + 1). Cover ConcurrentDictionary.Count (acquires all locks — O(n) cost).
```

#### 8.2 ConcurrentQueue\<T\>
```
Explain ConcurrentQueue<T>: lock-free MPMC (multi-producer multi-consumer) FIFO queue, O(1) Enqueue/TryDequeue, segments of 32 elements (cache-line friendly), no fixed capacity (grows by adding segments). Show usage: Enqueue, TryDequeue, TryPeek, Count (approximate — races), IsEmpty. Cover that ConcurrentQueue is best for: high-throughput task queues, producer-consumer where blocking is not needed. Compare to Channel<T> (ConcurrentQueue lacks async, backpressure, and completion notification — Channel<T> preferred for most new code). Show using ConcurrentQueue as a bounded work queue with Interlocked count check.
```

#### 8.3 ConcurrentStack\<T\>
```
Explain ConcurrentStack<T>: lock-free LIFO stack using linked list + Interlocked CAS, O(1) Push/TryPop, O(n) PushRange/TryPopRange (batch push/pop more efficient than loop). Show TryPop, TryPeek, PushRange(IEnumerable). Cover that ConcurrentStack is best for work-stealing-like patterns where LIFO order improves cache locality. Compare to stack via ConcurrentBag (ConcurrentBag is unordered — use Stack when LIFO matters). Show TryPopRange for bulk dequeue. Cover Clear (not atomic — briefly inconsistent). Explain that ConcurrentStack<T> is internally the Treiber Stack algorithm.
```

#### 8.4 ConcurrentBag\<T\>
```
Explain ConcurrentBag<T>: unordered collection, each thread has thread-local list (O(1) Add and TryTake when same thread adds and removes), stealing from other threads when local list empty. Best case: thread that adds also removes (producer-consumer on same thread — e.g., object pool). Worst case: different threads adding and removing (constant stealing — poor performance). Show the classic misuse: one producer thread + many consumer threads (ConcurrentQueue is better). Show good use: parallel processing where each worker feeds itself (each thread creates work, processes from own list). Cover TryPeek. Show ObjectPool<T> implementation using ConcurrentBag.
```

#### 8.5 BlockingCollection\<T\>
```
Explain BlockingCollection<T>: blocking producer-consumer wrapper around IProducerConsumerCollection<T> (default ConcurrentQueue). Add (blocks if full — bounded capacity), Take (blocks if empty), TryAdd/TryTake with timeout, CompleteAdding (marks no more producers — consumers drain then get InvalidOperationException), GetConsumingEnumerable (foreach that blocks waiting for items, exits when completed+empty). Show bounded BlockingCollection for backpressure. Cover multiple producers with CompleteAdding from last producer. Compare to Channel<T> (Channel is async-compatible, no blocking — prefer Channel for new async code). Show legacy code migration from BlockingCollection to Channel.
```

#### 8.6 Immutable Collections for Concurrency
```
Explain ImmutableDictionary, ImmutableList, ImmutableArray, ImmutableHashSet: thread-safe reads without locks (structural sharing — modifications create new collection, old is unchanged). Show the publish pattern: volatile/Interlocked.Exchange(ref _dict, newDict) to atomically swap entire collection. Use cases: read-heavy config (rarely updated, many concurrent readers), snapshot semantics (take a snapshot of state), functional patterns. Show ImmutableDictionary.Builder for efficient batch creation. Cover performance: ImmutableDictionary O(log n) vs Dictionary O(1) — only use when thread-safety-without-lock is worth the overhead. Show FrozenDictionary (.NET 8 — immutable, faster lookup than ImmutableDictionary).
```

#### 8.7 Collection Selection Guide
```
Provide a decision guide for concurrent collection choice: multiple threads reading (regular Dictionary + lock or ImmutableDictionary), multiple threads writing to dictionary (ConcurrentDictionary), producer-consumer FIFO queue (Channel<T> for async, BlockingCollection for sync-blocking, ConcurrentQueue for non-blocking), producer-consumer LIFO (ConcurrentStack), unordered add/take same-thread pattern (ConcurrentBag / ObjectPool), sorted concurrent (SortedDictionary + ReaderWriterLockSlim), high-throughput message pipeline (Channel<T> with bounded capacity for backpressure). Table format: scenario → recommended collection → alternative → avoid.
```

---

### 9. Channels

#### 9.1 Channel\<T\>
```
Explain Channel<T> (.NET Core 2.1+): async producer-consumer pipe. ChannelWriter<T> (WriteAsync, TryWrite, Complete, TryComplete), ChannelReader<T> (ReadAsync, TryRead, WaitToReadAsync, ReadAllAsync as IAsyncEnumerable). Channel.CreateUnbounded<T>() and Channel.CreateBounded<T>(capacity). Show complete producer-consumer example with async foreach on ReadAllAsync. Explain that Channel<T> replaced most BlockingCollection uses (Channel is async-native, no thread blocking). Cover completion: producer calls Complete() → consumer drains → ReadAllAsync ends normally. Error: TryComplete(exception) → consumer sees exception on next read. Show Channel as the backbone of async pipeline patterns.
```

#### 9.2 Bounded vs Unbounded Channels
```
Compare bounded and unbounded channels: Unbounded (never blocks writer — WriteAsync completes immediately, backpressure relies on consumer speed — memory grows unboundedly under slow consumer), Bounded (blocks/drops/errors when full — provides backpressure). BoundedChannelFullMode: Wait (WriteAsync awaits until space — true backpressure), DropWrite (silently discard newest), DropOldest (discard oldest — useful for telemetry), DropNewest. Show that Bounded+Wait is the correct default for pipeline stages (prevents memory explosion). Explain why unbounded is appropriate: producer is already rate-limited externally, or temporary bursts expected. Show memory behavior of unbounded under slow consumer.
```

#### 9.3 Channel Modes
```
Explain Channel options: SingleReader (optimize for one consumer — eliminates ConcurrentQueue overhead), SingleWriter (optimize for one producer), AllowSynchronousContinuations (continuation runs synchronously on writer's thread — higher throughput, risk of stack overflow in deep pipelines). Show performance difference: SPSC (single producer, single consumer) Channel with both Single flags is significantly faster than MPMC. Cover that AllowSynchronousContinuations can cause surprising behavior (writer's await resumes doing consumer work). Show capacity selection: buffer enough to smooth bursts but not so much that backpressure is defeated.
```

#### 9.4 Channel Pipelines
```
Build a multi-stage processing pipeline with Channel<T>: Stage1 → Channel → Stage2 → Channel → Stage3. Each stage reads from input channel, processes, writes to output channel. Show how to wire stages, handle completion propagation (each stage completes its output when input completes), and handle errors (catch + TryComplete with exception). Show parallel stage (multiple consumers on one channel — simply start multiple consumer tasks). Cover fan-out (one reader, write to multiple channels), fan-in (multiple channels, one reader via Task.WhenAny or linked source). Show a complete image processing pipeline example.
```

#### 9.5 Channel vs BlockingCollection vs ConcurrentQueue
```
Compare in a table and narrative: Channel<T> (async-native, backpressure, completion signal, IAsyncEnumerable, .NET Core 2.1+ — best for new async code), BlockingCollection<T> (sync-blocking, completion signal, GetConsumingEnumerable, bounded, wraps any IProducerConsumerCollection — best for sync code or legacy), ConcurrentQueue<T> (no completion, no blocking, no async — raw queue, best when polling or used as building block). Show migration: BlockingCollection → Channel<T> pattern. Cover Channel in gRPC streaming (natural fit — bidirectional streaming = two Channels). Show when ConcurrentQueue is still right: polling-based consumers, building custom sync primitives.
```

#### 9.6 Backpressure with Bounded Channels
```
Explain backpressure as a first-class concern: without it, fast producers overwhelm slow consumers → unbounded memory growth → OOM. Show how bounded Channel with BoundedChannelFullMode.Wait implements backpressure automatically: fast producer blocks on WriteAsync, slow consumer runs at its own pace. Extend to multi-stage pipelines: each stage's bounded channel provides backpressure upstream. Show a telemetry pipeline where dropping oldest (DropOldest mode) is appropriate (prefer recent data). Cover that async backpressure is superior to sync backpressure (no threads blocked, just awaiting). Show monitoring: channel capacity, current count, drop rate as metrics.
```

---

### 10. Data Parallelism

#### 10.1 Parallel.For & ForEach
```
Explain Parallel.For (parallel integer range, supports break via ParallelLoopState.Break/Stop) and Parallel.ForEach (parallel enumerable, partition-based). Cover ParallelOptions: MaxDegreeOfParallelism (limit parallelism — important: -1 = unlimited = all cores, set to Environment.ProcessorCount - 1 to leave one for UI/OS), CancellationToken, TaskScheduler. Show thread-local state (localInit, body with localSum, localFinally — pattern for parallel reduce/sum). Cover exception handling (all exceptions collected in AggregateException). Show when to use: CPU-bound work per item > ~1µs, independent items (no shared state), collection known upfront.
```

#### 10.2 Parallel.ForEachAsync
```
Explain Parallel.ForEachAsync (.NET 6+): async-compatible parallel foreach — runs async body with bounded parallelism. Signature: ForEachAsync(source, options, async (item, ct) => { ... }). Show the pattern for parallel async I/O with bounded concurrency (replacing SemaphoreSlim throttle pattern). Explain MaxDegreeOfParallelism controls concurrent async operations (not OS threads). Cover CancellationToken propagation. Show Parallel.ForEachAsync vs SemaphoreSlim+Task.WhenAll (ForEachAsync cleaner, handles async enumerable sources). Cover exception handling: all exceptions collected, first propagated on await. Show processing IAsyncEnumerable source.
```

#### 10.3 Partitioning Strategies
```
Explain partitioning in Parallel.For/ForEach: how work is divided among threads. Default partitioner: range partitioning for arrays/lists (each thread gets contiguous chunk — cache friendly), chunk partitioning for IEnumerable (threads take small chunks from shared queue). Custom partitioners: OrderablePartitioner<T>, Partitioner.Create with load balancing options. Cover chunk size trade-off (small = better load balance, large = less overhead). Show custom static range partitioner for CPU-bound matrix processing. Cover Partitioner.Create(array, loadBalance: true) for dynamic chunk sizing. Explain why default partitioning is good enough for most cases.
```

#### 10.4 Thread-Local State in Parallel Loops
```
Show thread-local accumulation pattern in Parallel.ForEach: localInit() creates per-thread state (e.g., int sum = 0), body(item, state, local) processes item and returns new local state, localFinally(local) merges thread-local result into shared result (requires Interlocked or lock for the merge step). Show parallel sum, parallel word count, parallel min/max. Explain why this pattern avoids per-item locking (thread-local accumulation = no contention, single merge at end). Cover that localFinally is called once per thread, not once per item. Show benchmark: thread-local vs Interlocked per item — 10-100x difference under high core count.
```

#### 10.5 PLINQ
```
Explain PLINQ (Parallel LINQ): add .AsParallel() to any LINQ query. Partitions source, runs query stages in parallel, merges results. Cover operators: AsParallel, AsSequential (opt out specific stages), AsOrdered (preserve input order — performance cost), WithDegreeOfParallelism, WithCancellation, WithExecutionMode (ForceParallelism bypasses PLINQ's "is it worth it?" check), WithMergeOptions (FullyBuffered vs NotBuffered for streaming). Show that PLINQ automatically decides to run sequentially for small inputs. Cover exception handling (AggregateException). Show a CPU-bound data transformation pipeline with PLINQ.
```

#### 10.6 PLINQ Advanced
```
Cover PLINQ ordering, partitioning, and merging in depth: AsOrdered preserves input order (adds merge overhead — use only when needed), OrderBy within PLINQ query (different from AsOrdered — post-parallel sort), custom partitioner (Partitioner.Create — for data with non-uniform processing time), merge options (FullyBuffered = output all at once after all parallel work, AutoBuffered = output in chunks, NotBuffered = output as soon as each result ready — use for streaming). Show ForAll (terminal operator that avoids merge — fastest when result order doesn't matter and side-effects are thread-safe). Show PLINQ for image batch processing.
```

#### 10.7 When Parallelism Hurts
```
Cover cases where parallelism is counterproductive: work per item too small (overhead of coordination > savings — benchmark first), false sharing (parallel threads writing to adjacent struct fields in array — cache line ping-pong → slower than sequential), I/O-bound work (parallel threads all blocking → no speedup, use async), small datasets (parallelism overhead exceeds work), sequential dependencies (result of item N needed for item N+1), non-thread-safe shared state (requires locking → serialized execution). Show benchmark: parallel vs sequential for 10ns CPU work per item (parallel is slower). Provide a "is parallelism worth it" checklist.
```

---

### 11. Task Parallelism

#### 11.1 Task Graph Execution
```
Explain task dependency graphs in the TPL: antecedents, continuations, and complex DAG execution. Show building a task DAG: T1 and T2 run in parallel, T3 depends on both (ContinueWhenAll), T4 depends on T3. Cover TaskFactory.ContinueWhenAll and ContinueWhenAny. Show that task graphs naturally express complex parallel workflows without explicit thread management. Cover that async/await creates implicit task graphs (each await = potential parallel branch). Show flattening: Task.WhenAll([t1, t2]).ContinueWith(t3). Compare to workflow engines (TPL is ad hoc, Dapr/Temporal for persistent workflows). Cover task graph visualization with concurrency visualizer.
```

#### 11.2 TPL Dataflow Library
```
Explain TPL Dataflow (System.Threading.Tasks.Dataflow NuGet — built into .NET): pipeline of processing blocks, messages flow through blocks asynchronously, built-in buffering and throttling. Key concepts: blocks have input/output buffers, async processing, configurable parallelism per block, propagate completion and faults. Use cases: ETL pipelines, event processing, batch processing with back pressure. Show a complete pipeline: BufferBlock → TransformBlock → ActionBlock. Cover fault propagation (fault in one block propagates downstream). Show why Dataflow is appropriate for complex pipelines vs simple Channel pipelines.
```

#### 11.3 Dataflow Blocks
```
Cover key TPL Dataflow blocks: ActionBlock<T> (consumes, no output — terminal sink, configurable parallelism via ExecutionDataflowBlockOptions.MaxDegreeOfParallelism), TransformBlock<TIn, TOut> (transforms input to output, async-compatible, bounded buffer), TransformManyBlock<TIn, TOut> (one input → many outputs, like SelectMany), BufferBlock<T> (queue with async offering/receiving — can connect as source or target), BatchBlock<T> (collects N items then outputs as array — useful for batching DB writes), JoinBlock<T1,T2> (waits for one item from each source, outputs tuple), WriteOnceBlock<T> (caches first value). Show each with a practical example.
```

#### 11.4 Linking Blocks & Completion
```
Show TPL Dataflow block linkage: LinkTo(target) connects output of one block to input of next, IDisposable unlink handle. Cover PropagateCompletion (DataflowLinkOptions — when source completes, target completes too), filter predicates in LinkTo (route messages to different targets based on content), linking with completion propagation through entire pipeline. Show completion handling: await block.Completion for last block to know when pipeline is done. Cover faulting: exception in block → block Completion faults → if PropagateCompletion set, downstream faults too. Show building a branching pipeline (one source, two targets based on predicate).
```

#### 11.5 Dataflow vs Channel\<T\>
```
Compare TPL Dataflow and Channel<T>: Channel (simpler API, lower overhead, just a queue — you write the plumbing code), Dataflow (higher-level blocks with built-in parallelism control, buffering, linking, completion propagation — less boilerplate for complex pipelines). Dataflow advantages: built-in per-block parallelism, declarative linking, join blocks, batch blocks. Channel advantages: lower overhead, simpler, composable with any async code, IAsyncEnumerable. Use Dataflow for: complex pipeline topology, need batch/join blocks, per-stage parallelism control. Use Channel for: simple producer-consumer, want full control, prefer explicit async code. Show same pipeline in both.
```

---

### 12. The .NET Memory Model

#### 12.1 Memory Model Fundamentals
```
Explain .NET memory model: defines what values are visible when. Key guarantees: volatile writes are visible to volatile reads (acquire/release), lock release makes all writes visible to next lock acquire, Interlocked operations are fully sequentially consistent. Non-guarantees: ordinary field writes may not be immediately visible to other threads (compiler can cache in register, CPU can reorder). Show that the .NET memory model is stronger than C++ and weaker than Java's sequential consistency by default. Cover ECMA-335 CLI spec memory model. Explain why this matters: data races on non-volatile, non-locked fields can produce stale reads — not undefined behavior (unlike C++) but not guaranteed fresh either.
```

#### 12.2 Happens-Before
```
Explain happens-before relationship: if A happens-before B, all writes in A are visible to B. Established by: lock release happens-before next acquire of same lock, volatile write happens-before subsequent volatile read of same field, Thread.Start happens-before first action of new thread, last action of thread happens-before Thread.Join returns, Task completes happens-before awaiting Task's continuation. Show that without happens-before, two threads can observe different orderings of writes. Show the implications: shared data only safe when proper happens-before is established. Cover how async/await continuations maintain happens-before (completion of task happens-before continuation).
```

#### 12.3 Compiler & CPU Reordering
```
Explain reordering at two levels: compiler reordering (optimizer moves reads/writes — prevented by volatile, Interlocked, or memory barriers), CPU reordering (out-of-order execution, store buffers — x86 only allows store-load reordering, ARM allows more). Show a concrete example: two threads, thread 1 writes x then y, thread 2 reads y then x — thread 2 might see y updated but x not updated on ARM. Show how volatile prevents this. Explain that most .NET developers don't need to think about this if they use: lock, Interlocked, volatile, or async/await — these all provide appropriate barriers. Cover when you DO need to think about it: custom lock-free algorithms.
```

#### 12.4 Memory Barriers in .NET
```
Explain memory barriers: Thread.MemoryBarrier() (full fence — no loads/stores can move across, both acquire and release semantics), Volatile.Read<T> (acquire semantics — reads after can't move before), Volatile.Write<T> (release semantics — writes before can't move after), Interlocked (full fence). Show the publish-subscribe pattern using Volatile: write data then Volatile.Write pointer (release), Volatile.Read pointer then read data (acquire). Cover that Thread.MemoryBarrier() is rarely needed directly — use Volatile or Interlocked. Show when Thread.MemoryBarrier() is appropriate: between unrelated volatile operations that need ordering, in custom lock implementations.
```

#### 12.5 volatile vs Volatile vs Interlocked
```
Compare three levels of memory guarantees in .NET: volatile keyword (per-field — every read/write on that field gets acquire/release, prevents register caching), Volatile.Read/Write (per-access — surgical acquire/release on any variable, works on array elements and locals, preferred over volatile keyword for clarity), Interlocked (full sequential consistency — CAS and atomic arithmetic, no weaker option). Decision guide: volatile field for simple flags read/written by multiple threads, Volatile.Read/Write for one-off protection of a specific access, Interlocked for atomic arithmetic or CAS loops. Cover that none of these replace a lock for compound operations.
```

#### 12.6 Double-Checked Locking
```
Show double-checked locking pattern in .NET: check without lock (fast path), lock, check again (prevents multiple init), initialize. The volatile requirement: the singleton reference MUST be volatile — without it, JIT/CPU can publish partially constructed object. Show the classic broken version (no volatile), the broken Java version (before Java 5 MM), and the correct C# version with volatile. Cover that Lazy<T> is preferred over manual DCL (implements it correctly, thread-safe by default). Show LazyInitializer.EnsureInitialized for non-class scenarios. Cover why DCL is needed despite being complex: avoids lock on every read after initialization.
```

#### 12.7 .NET vs Java Memory Model
```
Compare .NET and Java memory models: both guarantee sequential consistency for volatile/synchronized operations. Java: volatile provides full sequential consistency (stricter than C# volatile which is just acquire/release), final fields have special guarantee (visible after construction without synchronization). .NET: volatile is acquire/release (weaker than Java volatile), lock provides sequential consistency. C#: no equivalent to Java final field guarantee for readonly fields — readonly only prevents reassignment, doesn't guarantee visibility. Explain why this rarely matters in practice (both use volatile + lock for shared state). Show the one practical difference: Java volatile atomically updating long is spec'd, .NET long requires Interlocked on 32-bit.
```

---

### 13. Common Concurrency Bugs

#### 13.1 Race Conditions
```
Show 5 common race condition patterns in .NET: check-then-act (if (!dict.ContainsKey(k)) dict.Add(k, v) — use ConcurrentDictionary.TryAdd), read-modify-write (count++ — use Interlocked.Increment), compound action (get value, compute, set value — use ConcurrentDictionary.AddOrUpdate), lazy initialization (if (singleton == null) singleton = new() — use Lazy<T>), collection iteration during modification (foreach + Add — use lock or snapshot). Show each as a realistic bug in C# code, not a toy example. Cover that races are non-deterministic — may only appear under load or specific timing. Show how to use lock or appropriate concurrent API to fix each.
```

#### 13.2 Deadlocks in .NET
```
Show .NET-specific deadlock patterns: AB-BA lock ordering (lock A then B in one thread, lock B then A in another — fix: always acquire locks in same order), lock inside lock with callback (lock A, call event handler that acquires A — fix: don't call unknown code under lock), Monitor.Wait without loop (if instead of while — spurious wakeup causes incorrect state — fix: always loop), lock + async (await inside lock blocks thread but doesn't release lock — other threads waiting can't enter — fix: use SemaphoreSlim as async lock). Show each as code + fix. Provide a deadlock prevention checklist.
```

#### 13.3 Async Deadlock
```
Show async deadlocks in depth: the classic .GetResult()/.Wait() deadlock. Scenario 1: UI SynchronizationContext captured, .Wait() blocks UI thread, continuation needs UI thread to resume → deadlock. Scenario 2: old ASP.NET one-at-a-time context, same pattern. Show exactly why it deadlocks with a diagram. Fixes: async all the way, ConfigureAwait(false) in library code (doesn't help if called from sync context with .Wait()), use GetAwaiter().GetResult() only in truly synchronous contexts with no SynchronizationContext. Cover why ASP.NET Core largely eliminated this (no SynchronizationContext). Show detecting async deadlock: all threads waiting, no progress, deadlock on context.
```

#### 13.4 Starvation
```
Cover starvation patterns in .NET: ThreadPool thread starvation (all threads blocking → new work starves → add SetMinThreads workaround + fix blocking code), lock starvation (thread repeatedly loses CAS race under high contention — spinlock with backoff helps, or use fair lock), PLINQ/Parallel starvation (one partition's work takes much longer — use finer partitioning), async continuation starvation (continuation never scheduled because scheduler is overwhelmed). Show diagnosis with dotnet-counters: ThreadPool queue growing, CPU underutilized. Cover priority inversion (low priority thread holds lock needed by high priority thread) and priority inheritance concept.
```

#### 13.5 Livelock
```
Show livelock examples in .NET: two threads each retrying a CAS operation in response to the other's success — never both succeed, each keeps retrying indefinitely. Fix: exponential backoff with jitter (SpinWait provides this adaptively). Show distributed system livelock: two services each back off and retry simultaneously — they always collide. Fix: jitter in retry policies (Polly.WaitAndRetry with jitter). Cover the detection challenge: unlike deadlock (no progress + threads waiting), livelock shows CPU activity and threads running — looks busy but makes no progress. Show how to detect with task profiling: methods called many times but no observable output.
```

#### 13.6 Torn Reads
```
Explain torn reads: non-atomic multi-word reads can observe partial writes. Examples: reading a 64-bit long on 32-bit system (two 32-bit reads, writer can interleave after first read), reading a Guid (16 bytes — 4 separate reads, writer can update between), reading a struct with multiple fields. Show C# torn read example: struct {int X; int Y;} where reader sees X from before update and Y from after. Fixes: Interlocked.Read for long on 32-bit, lock for structs, volatile doesn't help (prevents caching but not tearing on multi-word types), use Interlocked.Exchange for swapping reference types atomically.
```

#### 13.7 Closure Capture Bugs
```
Show closure capture bugs in parallel loops: classic C# closure capture loop variable bug — Parallel.For(0, 10, i => results[i] = Compute(i)) — no bug here. But: tasks created in loop with lambda capturing loop var — all lambdas capture same variable, see final value. Show the bug: List<Task> tasks; for(int i=0; i<10; i++) tasks.Add(Task.Run(() => Process(i))); — all tasks run Process(10). Fix: copy to local (int local = i; Task.Run(() => Process(local))). Cover LINQ Select with async lambda (common pattern — var tasks = items.Select(x => ProcessAsync(x)); await Task.WhenAll(tasks) — correct, x is captured per element, not shared).
```

#### 13.8 Testing Concurrent Code
```
Cover approaches to testing concurrent code: stress testing (run concurrent operations repeatedly — finds timing bugs, not deterministic), deterministic testing (control thread scheduling — Coyote framework from Microsoft for systematic concurrency testing), property-based testing (generate random concurrent scenarios), unit testing with Task and SemaphoreSlim to create deterministic timing, ConcurrentQueue/Channel stress test patterns. Show Coyote: replace Task with Coyote Task, run with coyote test tool — systematically explores thread interleavings. Cover that locks, Interlocked, and concurrent collections are unit-testable but concurrent behavior requires stress or systematic exploration.
```

---

### 14. async/await Performance

#### 14.1 Cost of async/await
```
Explain async/await overhead: state machine struct (typically 40-100 bytes, boxed to heap when first real suspension occurs — allocation), captured ExecutionContext (allocates copy on suspension — can be suppressed with ExecutionContext.SuppressFlow), SynchronizationContext capture (acquire/release overhead). Show that synchronously-completing async methods have near-zero overhead (JIT elides state machine). Measure with BenchmarkDotNet: awaiting a completed Task vs direct call — ~100ns overhead per suspension. Cover that async has essentially zero overhead for I/O-bound code (I/O latency dominates). Overhead matters only for frequently-called CPU-bound async methods (use synchronous or ValueTask).
```

#### 14.2 ValueTask Optimization
```
Show ValueTask optimization for hot paths: return ValueTask.FromResult(value) for synchronous fast path (no allocation), return new ValueTask(task) for async slow path (allocates only when actually async), IValueTaskSource<T> for complete pool-based state machine (advanced — avoid allocation on both paths). Show PoolingAsyncValueTaskMethodBuilder (.NET 6+): [AsyncMethodBuilder(typeof(PoolingAsyncValueTaskMethodBuilder))] attribute pools the state machine object. Benchmark synchronous path: Task-based method vs ValueTask — ValueTask ~0 alloc vs Task ~88 bytes. Show realistic use case: cache read that usually hits (synchronous), occasionally misses (async fetch).
```

#### 14.3 Sync Fast Path
```
Show the sync fast path pattern for async methods: check if result is available synchronously, return ValueTask.FromResult if so, otherwise go async. Examples: SocketStream.ReadAsync (checks if buffer has data), CancellationToken (check IsCancellationRequested before async wait), Channel.ReadAsync (check if item available). Show the pattern: if (TryGetResult(out var result)) return new ValueTask<T>(result); else return SlowPathAsync(); Cover that this is the primary optimization opportunity in high-throughput async code. Show BenchmarkDotNet confirming 10x+ improvement. Cover short-circuit evaluation as the general principle.
```

#### 14.4 Pooling State Machines
```
Explain async state machine pooling (.NET 6+): PoolingAsyncValueTaskMethodBuilder (worker:CTP → pool of state machine objects → return to pool on completion → zero allocation per call). Cover the attribute: [AsyncMethodBuilder(typeof(PoolingAsyncValueTaskMethodBuilder<>))] on async method. Show that .NET runtime uses this internally in hot paths (Socket.ReceiveAsync, etc.). Cover limitations: state machine fields must not be captured by external code after completion, returned to pool on completion only. Show benchmark: regular async Task vs pooled ValueTask — allocation goes to zero for frequent synchronous completions. Explain when not to pool: if caller holds reference to incomplete task across suspension.
```

#### 14.5 Benchmarking Async
```
Show how to correctly benchmark async code with BenchmarkDotNet: async Benchmark methods (supported — returns Task or ValueTask), measuring allocation with [MemoryDiagnoser], isolating async overhead from actual work (use pre-completed Task for baseline), measuring throughput vs latency. Cover common mistakes: benchmarking async in Debug build, not controlling GC between measurements, forgetting that BenchmarkDotNet uses task continuation sampling. Show a benchmark comparing: synchronous method, async-but-synchronous (no real await), async with I/O (mock with Task.Delay(0)), and true I/O async. Cover measuring contention: vary thread count, observe throughput degradation.
```

---

### 15. Reactive Programming

#### 15.1 Rx.NET Overview
```
Explain Reactive Extensions (Rx.NET): library for composing asynchronous and event-based programs using observable sequences. Core: IObservable<T> (push-based stream — producer pushes values, errors, completion), IObserver<T> (consumer: OnNext, OnError, OnCompleted). Contrast with IEnumerable (pull) and IAsyncEnumerable (async pull). Show Observable.Create, Observable.FromEventPattern, Observable.Interval, Observable.Timer, Subscribe. Cover that Rx is excellent for: UI event handling, real-time data streams, complex async coordination (debounce user input, combine multiple event sources). Show hot vs cold observables. Cover that Rx has a learning curve but powerful composition operators.
```

#### 15.2 Observable vs IAsyncEnumerable
```
Compare IObservable<T> (push — producer controls timing, hot streams possible, backpressure via custom operators) vs IAsyncEnumerable<T> (async pull — consumer controls timing, always cold, built-in backpressure via await, language support with await foreach, simpler). Use IAsyncEnumerable when: sequential async data (DB results, file lines, HTTP streaming), caller controls pace, simple pipeline. Use IObservable when: event streams (UI events, sensor data), time-based operators (debounce, throttle, buffer by time), hot multicasted streams, complex temporal queries (join streams by time). Cover converting between them (Observable.ToAsyncEnumerable, IAsyncEnumerable<T>.ToObservable via System.Reactive.Linq).
```

#### 15.3 Subjects
```
Explain subjects: both IObservable<T> and IObserver<T> — bridge between imperative and reactive. Subject<T> (multicast, hot — new subscriber sees only future values), BehaviorSubject<T> (stores latest value — new subscribers immediately get current value, useful for state), ReplaySubject<T> (replays last N values to new subscribers — useful for event sourcing), AsyncSubject<T> (only emits final value on completion — like Task). Show patterns: Subject<T> as an event bus (publish via OnNext, subscribe multiple observers), BehaviorSubject<T> for current state (price feed, sensor reading). Cover that subjects are often a smell (prefer Observable.Create for cold streams).
```

#### 15.4 Key Rx Operators
```
Cover essential Rx operators: Where (filter), Select (transform), Throttle (emit after X silence — UI search box), Debounce (same as Throttle in some impls — check Rx.NET naming), Buffer (collect into batches by count or time), Window (observable of observables by count/time), Merge (combine multiple observables into one), Switch (when source emits new observable, switch to it — cancel previous), CombineLatest (emit when either source emits, with latest from both), Zip (pair elements 1:1), Take/Skip, DistinctUntilChanged, Scan (running aggregate), Retry, Catch. Show each with a practical use case. Cover that Rx operators are composable — chain them.
```

#### 15.5 Rx Backpressure
```
Explain backpressure in Rx: IObservable is push-based — producer pushes at its own rate, consumer must keep up. Rx doesn't have built-in backpressure (unlike reactive streams specification). Solutions: Buffer (batch fast emissions — consumer handles batches), Sample (emit latest value per time window — drops intermediates), Throttle/Debounce (rate limit), ObserveOn(Scheduler.Default) (buffers and dispatches on scheduler — but still unbounded memory), custom backpressure via Subject + flow control. Explain why IAsyncEnumerable has natural backpressure (consumer's await controls pace). Show when to use Rx backpressure operators vs switching to IAsyncEnumerable.
```

#### 15.6 Testing Rx Pipelines
```
Show testing Rx pipelines with TestScheduler: replace real time with virtual time, advance scheduler manually, verify emissions at specific virtual times. Show testing Throttle: create cold observable, subscribe with TestScheduler, advance time, assert emissions. Cover TestScheduler vs HistoricalScheduler. Show using Microsoft.Reactive.Testing (TestScheduler, ReactiveTest, OnNext/OnError/OnCompleted factories, ITestableObserver). Cover testing hot observables (Subject<T>), testing error handling (OnError scenarios), testing completion. Show that TestScheduler makes time-dependent Rx code deterministically testable — no Thread.Sleep in tests.
```

---

### 16. Actor Model

#### 16.1 Actor Concepts
```
Explain the actor model: actors are the fundamental unit of computation. Each actor has: a mailbox (message queue), private state (not shared with other actors), and behavior (how it reacts to messages). Actors communicate only via messages (no shared memory). Key properties: location transparency (actors can be local or remote — same API), fault isolation (actor failure doesn't propagate unless actor supervises another), natural concurrency (each actor processes one message at a time — no locks needed for actor state). Show that actors eliminate shared mutable state (each actor owns its state, only one message processed at a time). Compare to threads (actors are cheaper — thousands of actors per thread).
```

#### 16.2 Microsoft Orleans
```
Explain Microsoft Orleans: virtual actor framework. Grains (actors) are virtual — always exist, never explicitly created/destroyed, auto-activated on first call, auto-deactivated when idle. Grain identity: type + key (Guid/string/int). Orleans manages: grain placement across cluster, activation/deactivation lifecycle, state persistence (via grain state + storage providers), timers and reminders (scheduled work), streams (publish-subscribe across grains). Show a simple grain (interface + implementation + state), silo setup, grain client call. Cover Orleans for: distributed stateful services, game backends, IoT state management, distributed workflows. Orleans runs on .NET — natural choice for C# teams.
```

#### 16.3 Akka.NET
```
Explain Akka.NET: port of JVM Akka actor framework. Explicit actor hierarchy (ActorSystem → ActorRef tree), supervisor strategies (OneForOne, AllForOne — restart, stop, escalate on child failure), actor lifecycle (preStart, postStop, preRestart, postRestart), routing (round-robin, random, broadcast, consistent-hash), remote actors (same API, different machines), clustering (Akka.Cluster). Show a simple actor (Receive<T> pattern matching), ActorSystem.ActorOf, ActorRef.Tell/Ask. Cover Akka.Streams for reactive stream processing. Compare Orleans (simpler, virtual actors, managed placement) vs Akka.NET (explicit, more control, supervision hierarchy). Choose based on: Orleans for stateful services, Akka.NET for explicit control.
```

#### 16.4 Actor Model Comparison
```
Compare actor model with other .NET concurrency approaches: Thread Pool + Locks (shared state, explicit sync — error-prone at scale), Channel<T> pipelines (simple producer-consumer, no location transparency, no fault isolation), Rx.NET (event streams, no state per subscriber, complex temporal ops), TPL Dataflow (pipeline topology, bounded, no location transparency), Orleans/Akka.NET (distributed actors, state per actor, fault isolation, location transparency). Decision guide: local CPU-bound parallelism → Parallel/PLINQ, local async pipelines → Channel<T>, event processing → Rx.NET, complex pipeline topology → Dataflow, distributed stateful services → Orleans, fine-grained fault isolation → Akka.NET.
```

---

### 17. Concurrency in ASP.NET Core

#### 17.1 Request Handling Model
```
Explain ASP.NET Core request handling: each request gets a Task on the ThreadPool (not a dedicated thread), one logical "thread of execution" per request (no concurrent access to same HttpContext), async I/O means request yields ThreadPool thread while awaiting (handles 10K+ concurrent requests with few threads). Show that Controller actions are NOT thread-safe with each other (different requests on different threads) but ARE single-threaded per request (no concurrent access within one request unless explicitly created). Explain IActionResult composition, middleware pipeline as sequential async chain. Cover gRPC server streaming as concurrent within one request (stream + cancellation monitor).
```

#### 17.2 Shared State in ASP.NET Core
```
Explain what shared state is safe/unsafe: safe (readonly after startup — configuration, compiled Regex, static lookup tables), safe with proper sync (IMemoryCache, ConcurrentDictionary, Interlocked counters), unsafe without sync (regular Dictionary, List<T>, simple int counter across requests). Show common bugs: static counter incremented with ++ (race condition), static list accumulating request data (race condition). Cover that Singleton services are shared across all requests — must be thread-safe. Scoped services are per-request — not shared between concurrent requests (safe). Transient — new instance each time (safe). Show scoped-in-singleton bug (capturing scoped DbContext in singleton — wrong lifetime).
```

#### 17.3 Cache Thread Safety
```
Explain IMemoryCache thread safety: GetOrCreate is not atomic (multiple threads can execute factory — "cache stampede" / "thundering herd"). Fix: use GetOrCreateAsync with SemaphoreSlim per key, or use Lazy<Task<T>> as cache value. Cover IDistributedCache (Redis/SQL) thread safety: Get/Set are atomic per operation but not across operations — implement optimistic concurrency with ETag/version for read-modify-write. Show MemoryCache.GetOrCreate with factory called only once (aspirational but not guaranteed under race). Show LazyCache NuGet as a correct implementation. Cover cache invalidation concurrency: multiple threads invalidating and re-populating simultaneously.
```

#### 17.4 DI Lifetimes & Concurrency
```
Explain DI lifetime concurrency implications: Singleton (one instance, shared across all requests — must be thread-safe: use ConcurrentDictionary, Interlocked, lock, or design as immutable), Scoped (one instance per request — safe within one request, but don't share scoped instances across requests or capture in singletons), Transient (new instance each time — generally safe but expensive if creates connections). Show the captured scoped service in singleton bug (CapturedScopedService pattern — will fail under concurrent requests). Cover IServiceScopeFactory for creating scopes in singleton services. Show HttpClientFactory as a properly designed singleton with internal concurrency.
```

#### 17.5 Rate Limiting
```
Cover ASP.NET Core rate limiting middleware (.NET 7+): AddRateLimiter, algorithms (FixedWindowLimiter, SlidingWindowLimiter, TokenBucketLimiter, ConcurrencyLimiter), partition by client (IP, user, API key — RateLimitPartition.GetFixedWindowLimiter), applying to endpoints ([EnableRateLimiting] attribute or RequireRateLimiting()), rejection response (OnRejected callback — return 429 with Retry-After header), chaining multiple policies. Show IP-based rate limiting configuration. Cover that rate limiting is per-instance (use Redis for distributed rate limiting). Show relationship to SemaphoreSlim-based manual throttling (middleware approach is cleaner). Cover rate limit headers (RateLimit-Limit, RateLimit-Remaining).
```

#### 17.6 Fan-Out Fan-In Patterns
```
Show concurrent request patterns in ASP.NET Core: fan-out (one request spawns multiple parallel async calls — Task.WhenAll for parallel API calls, PLINQ for CPU-bound parallel processing), fan-in (aggregate results from multiple sources), hedged requests (send to two endpoints, use first response — Task.WhenAny + cancel loser), scatter-gather (fan-out to multiple services, aggregate results, apply timeout to entire operation). Show complete fan-out example: product page loading price + inventory + recommendations in parallel (3x faster than sequential). Cover error handling in fan-out: AggregateException from WhenAll, partial success strategies, circuit breakers per downstream service.
```

---

### 18. High-Performance Patterns

#### 18.1 LMAX Disruptor Pattern
```
Explain LMAX Disruptor: high-performance inter-thread messaging (millions of messages/second). Key insight: ring buffer with sequence numbers (no locks, no GC pressure — fixed size preallocated), producers claim sequence number (Interlocked), write to slot, publish. Consumers watch sequence number, read when published. Works without locks because: ring buffer never shrinks/grows, no memory allocation per message, CPU prefetching works well on sequential ring buffer, cache-line padding prevents false sharing. Show .NET implementation (Disruptor-net NuGet). Cover when Disruptor is appropriate: ultra-low-latency financial trading, high-frequency event processing. Compare to Channel<T> (Channel is simpler, Disruptor is faster for extreme throughput).
```

#### 18.2 SPSC Ring Buffer
```
Implement a lock-free Single-Producer Single-Consumer (SPSC) ring buffer in C#: fixed-size array, head and tail indices (Volatile.Read/Write sufficient — no Interlocked needed for SPSC). Producer: write to tail slot, Volatile.Write(tail, tail+1). Consumer: read head slot, Volatile.Write(head, head+1). Full check: (tail - head) == size. Empty check: tail == head. Show that SPSC is significantly faster than MPMC (ConcurrentQueue) because no CAS contention. Benchmark: SPSC vs Channel<T> (SPSC: ~10ns/message vs Channel: ~100ns). Cover use cases: audio/video processing pipelines, game engine input handling, sensor data ingestion.
```

#### 18.3 Object Pooling
```
Show object pooling for high-concurrency .NET: Microsoft.Extensions.ObjectPool (ObjectPool<T>, DefaultObjectPoolPolicy, PooledObjectPolicy<T> — custom create/return logic), ArrayPool<T>.Shared (for byte/T[] arrays), MemoryPool<T>.Shared. Show pooling heavy objects: HttpClient (don't pool — use IHttpClientFactory), StringBuilder (pool via ObjectPool), database connections (pooled by ADO.NET driver), byte buffers (ArrayPool — most impactful). Cover ThreadLocal<T> as an alternative (per-thread instance — no contention), AsyncLocal<T> (doesn't work across async boundaries). Show measuring allocation reduction with BenchmarkDotNet MemoryDiagnoser. Cover pool sizing and maximum size policy.
```

#### 18.4 False Sharing
```
Show false sharing impact and solutions in .NET: two threads updating adjacent fields in a struct/array share a 64-byte cache line — writes from one thread invalidate other's cached line — 10-100x slowdown. Show benchmark: int[] shared array, two threads each updating arr[0] and arr[1] vs arr[0] and arr[64]. Fix 1: pad struct to 64 bytes ([StructLayout(Size=64)] or [CacheLineAligned] .NET 9). Fix 2: use thread-local accumulators, merge at end. Fix 3: reorganize data (SoA layout — separate arrays per field). Show that false sharing is invisible in code — only shows in profiling (cache miss rate). Cover that CPU cache line = 64 bytes on x86/ARM — padding to this size eliminates false sharing.
```

#### 18.5 Thread Affinity & NUMA
```
Explain NUMA (Non-Uniform Memory Access): multi-socket systems have memory close to each socket's CPUs (local — fast) and far from others (remote — 1.5-2x slower). Thread affinity: pin thread to specific CPU/NUMA node. Cover that .NET's ThreadPool is NUMA-aware (localizes work queues to NUMA nodes). Show Thread.BeginThreadAffinity/EndThreadAffinity for COM STA affinity. Cover numactl on Linux for NUMA-aware process binding. Cover that most .NET developers don't need manual NUMA control — ThreadPool handles it. Show when manual NUMA matters: processing huge in-memory datasets where NUMA boundary crossing dominates (cache-line-aware data layout + NUMA allocation).
```

#### 18.6 Measuring Concurrency Performance
```
Show how to measure concurrent code performance: BenchmarkDotNet with [ThreadingDiagnoser] (shows context switches, lock contentions), HardwareCounters for cache misses and branch mispredictions, varying thread count to find scalability ceiling (Amdahl's Law in practice). Cover Concurrency Visualizer (VS extension — shows thread activity, blocking, context switches for a .NET process), dotnet-trace (event-based timeline of ThreadPool, GC, contention). Show scalability plot: X = thread count, Y = throughput — should rise then plateau (ideal) or drop (contention / false sharing). Cover Little's Law (concurrency = throughput × latency) for capacity planning.
```

---

## Quick Reference: Choosing the Right Concurrency Tool

| Scenario | Recommended |
|---|---|
| CPU-bound parallelism | `Parallel.For`, `PLINQ`, `Task.Run` + `WhenAll` |
| I/O-bound concurrent | `async/await` + `Task.WhenAll` |
| Producer-consumer (async) | `Channel<T>` (bounded for backpressure) |
| Producer-consumer (sync) | `BlockingCollection<T>` |
| Throttle concurrent ops | `SemaphoreSlim(N)` + `WaitAsync` |
| Async mutex | `SemaphoreSlim(1,1)` |
| Cross-request shared state | `ConcurrentDictionary`, `Interlocked` |
| Atomic counter | `Interlocked.Increment` |
| Read-heavy shared data | `ReaderWriterLockSlim` |
| Publish single value | `TaskCompletionSource<T>` |
| One-time initialization | `Lazy<T>` |
| Per-thread state | `ThreadLocal<T>` |
| Async flow-through state | `AsyncLocal<T>` |
| Timeout | `CancellationTokenSource.CancelAfter` |
| Parallel async foreach | `Parallel.ForEachAsync` |
| Event streams | `IObservable<T>` (Rx.NET) |
| Streaming async data | `IAsyncEnumerable<T>` |
| Complex pipeline topology | `TPL Dataflow` |
| Distributed stateful actors | `Microsoft Orleans` |
| Wait for N completions | `CountdownEvent` or `Task.WhenAll` |
| Phase-based parallel | `Barrier` |
| Object reuse | `ObjectPool<T>`, `ArrayPool<T>` |

---

*Version 1.0 — .NET 8 / C# 12*