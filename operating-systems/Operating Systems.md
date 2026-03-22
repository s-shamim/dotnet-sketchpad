# Operating Systems for .NET Developers
## Compact Learning Guide with Prompts

> Each section has a prompt. Paste it to generate full content. Compact format — concept + .NET angle.

---

## Table of Contents

1. [OS Fundamentals](#1-os-fundamentals)
   - 1.1 [What an OS Does — Kernel vs Userspace](#11-what-an-os-does)
   - 1.2 [System Calls — The Kernel Boundary](#12-system-calls)
   - 1.3 [User Mode vs Kernel Mode](#13-user-mode-vs-kernel-mode)
   - 1.4 [Interrupts & Exceptions](#14-interrupts--exceptions)
   - 1.5 [Monolithic vs Microkernel vs Hybrid](#15-kernel-architectures)
   - 1.6 [The .NET Runtime's Relationship with the OS](#16-net-runtime-and-os)

2. [Processes](#2-processes)
   - 2.1 [Process vs Program — What's the Difference](#21-process-vs-program)
   - 2.2 [Process Address Space Layout](#22-process-address-space)
   - 2.3 [Process Control Block (PCB)](#23-process-control-block)
   - 2.4 [Process States — Created, Ready, Running, Blocked, Terminated](#24-process-states)
   - 2.5 [Process Creation — fork/exec on Linux, CreateProcess on Windows](#25-process-creation)
   - 2.6 [Process Termination & Exit Codes](#26-process-termination)
   - 2.7 [Zombie & Orphan Processes](#27-zombie-orphan-processes)
   - 2.8 [Process Management in .NET — `System.Diagnostics.Process`](#28-process-in-net)

3. [Threads](#3-threads)
   - 3.1 [Thread vs Process — Shared vs Private State](#31-thread-vs-process)
   - 3.2 [Thread Control Block & Stack](#32-thread-control-block)
   - 3.3 [User-Level vs Kernel-Level Threads](#33-user-vs-kernel-threads)
   - 3.4 [Thread Lifecycle — Create, Run, Block, Terminate](#34-thread-lifecycle)
   - 3.5 [Context Switching — Cost & What Gets Saved](#35-context-switching)
   - 3.6 [Green Threads / Fibers / Coroutines](#36-green-threads-coroutines)
   - 3.7 [.NET Thread Model — OS Threads, Thread Pool, async/await](#37-net-thread-model)
   - 3.8 [Thread in .NET — `Thread`, `ThreadPool`, `Task`](#38-thread-in-net)

4. [CPU Scheduling](#4-cpu-scheduling)
   - 4.1 [Scheduling Goals — Throughput, Latency, Fairness](#41-scheduling-goals)
   - 4.2 [Preemptive vs Non-Preemptive Scheduling](#42-preemptive-vs-non-preemptive)
   - 4.3 [FIFO / Round Robin / Priority Scheduling](#43-basic-scheduling-algorithms)
   - 4.4 [Multilevel Feedback Queue (MLFQ)](#44-mlfq)
   - 4.5 [Linux CFS — Completely Fair Scheduler](#45-linux-cfs)
   - 4.6 [Windows Scheduler](#46-windows-scheduler)
   - 4.7 [Thread Priority in .NET](#47-thread-priority-net)
   - 4.8 [.NET ThreadPool Scheduling & Work Stealing](#48-threadpool-work-stealing)

5. [Synchronization Primitives](#5-synchronization-primitives)
   - 5.1 [Race Conditions — What They Are & Why They Happen](#51-race-conditions)
   - 5.2 [Critical Section & Mutual Exclusion](#52-critical-section)
   - 5.3 [Mutex — OS-Level Mutual Exclusion](#53-mutex)
   - 5.4 [Semaphore — Counting Resource Permits](#54-semaphore)
   - 5.5 [Condition Variables — Wait & Signal](#55-condition-variables)
   - 5.6 [Monitors — Mutex + Condition Variable Combined](#56-monitors)
   - 5.7 [Spinlock — Busy-Wait Synchronization](#57-spinlock)
   - 5.8 [Read-Write Lock](#58-read-write-lock)
   - 5.9 [Synchronization in .NET — `lock`, `Monitor`, `Mutex`, `Semaphore`, `SemaphoreSlim`](#59-sync-in-net)

6. [Deadlocks](#6-deadlocks)
   - 6.1 [Deadlock — Four Necessary Conditions (Coffman)](#61-deadlock-conditions)
   - 6.2 [Deadlock Prevention](#62-deadlock-prevention)
   - 6.3 [Deadlock Avoidance — Banker's Algorithm](#63-deadlock-avoidance)
   - 6.4 [Deadlock Detection & Recovery](#64-deadlock-detection)
   - 6.5 [Livelock & Starvation](#65-livelock-starvation)
   - 6.6 [Deadlocks in .NET — Patterns & Detection](#66-deadlocks-in-net)

7. [Memory Management](#7-memory-management)
   - 7.1 [Physical vs Virtual Memory](#71-physical-vs-virtual-memory)
   - 7.2 [Paging — Pages, Frames, Page Tables](#72-paging)
   - 7.3 [Multi-Level Page Tables & TLB](#73-multilevel-page-tables)
   - 7.4 [Segmentation](#74-segmentation)
   - 7.5 [Demand Paging & Page Faults](#75-demand-paging)
   - 7.6 [Page Replacement Algorithms (OPT, LRU, Clock, FIFO)](#76-page-replacement)
   - 7.7 [Thrashing](#77-thrashing)
   - 7.8 [Huge Pages / Large Pages in .NET](#78-huge-pages-net)
   - 7.9 [Memory-Mapped Files in .NET — `MemoryMappedFile`](#79-memory-mapped-files-net)

8. [Virtual Memory Deep Dive](#8-virtual-memory-deep-dive)
   - 8.1 [Address Space Layout — Text, Data, BSS, Heap, Stack, mmap](#81-address-space-layout)
   - 8.2 [ASLR — Address Space Layout Randomization](#82-aslr)
   - 8.3 [Copy-on-Write (COW)](#83-copy-on-write)
   - 8.4 [Shared Memory Between Processes](#84-shared-memory)
   - 8.5 [Memory Overcommit](#85-memory-overcommit)
   - 8.6 [OOM Killer (Linux)](#86-oom-killer)
   - 8.7 [Process Memory Inspection in .NET](#87-memory-inspection-net)

9. [File Systems](#9-file-systems)
   - 9.1 [File System Concepts — Files, Directories, Inodes](#91-file-system-concepts)
   - 9.2 [File System Structures — FAT, ext4, NTFS, APFS](#92-file-system-structures)
   - 9.3 [File Descriptors & Handles](#93-file-descriptors)
   - 9.4 [Buffered vs Unbuffered I/O](#94-buffered-vs-unbuffered-io)
   - 9.5 [File Permissions & ACLs](#95-file-permissions)
   - 9.6 [Symbolic Links vs Hard Links](#96-symlinks-hard-links)
   - 9.7 [Journaling & Crash Consistency](#97-journaling)
   - 9.8 [File I/O in .NET — `FileStream`, `File`, `Path`, `Directory`](#98-file-io-net)
   - 9.9 [High-Performance File I/O in .NET — `RandomAccess`, `FileOptions`](#99-high-perf-file-io)

10. [I/O & Storage](#10-io--storage)
    - 10.1 [I/O Hardware — Polling, Interrupts, DMA](#101-io-hardware)
    - 10.2 [Block Devices vs Character Devices](#102-block-vs-character-devices)
    - 10.3 [Disk Scheduling Algorithms](#103-disk-scheduling)
    - 10.4 [Storage Hierarchy — HDD, SSD, NVMe](#104-storage-hierarchy)
    - 10.5 [Buffering, Caching, Spooling](#105-buffering-caching-spooling)
    - 10.6 [Async I/O — epoll, kqueue, IOCP](#106-async-io-os)
    - 10.7 [io_uring (Linux) and .NET](#107-io-uring-net)
    - 10.8 [I/O Performance in .NET — `FileOptions.Asynchronous`, `O_DIRECT`](#108-io-perf-net)

11. [Inter-Process Communication (IPC)](#11-inter-process-communication)
    - 11.1 [IPC Overview — Why Processes Need to Communicate](#111-ipc-overview)
    - 11.2 [Pipes — Anonymous & Named](#112-pipes)
    - 11.3 [Message Queues](#113-message-queues)
    - 11.4 [Shared Memory — Fastest IPC](#114-shared-memory-ipc)
    - 11.5 [Signals (Unix)](#115-signals)
    - 11.6 [Unix Domain Sockets](#116-unix-domain-sockets)
    - 11.7 [Memory-Mapped Files for IPC](#117-mmap-ipc)
    - 11.8 [IPC in .NET — Pipes, Shared Memory, gRPC, Named Pipes](#118-ipc-net)

12. [Signals & Posix](#12-signals--posix)
    - 12.1 [Unix Signals — SIGTERM, SIGKILL, SIGINT, SIGHUP](#121-unix-signals)
    - 12.2 [Signal Handlers](#122-signal-handlers)
    - 12.3 [Graceful Shutdown with SIGTERM in .NET](#123-graceful-shutdown-net)
    - 12.4 [POSIX vs Win32 API Differences for .NET Cross-Platform](#124-posix-win32-differences)

13. [OS-Level Security](#13-os-level-security)
    - 13.1 [Users, Groups & Permissions](#131-users-groups-permissions)
    - 13.2 [Privilege Escalation & sudo/UAC](#132-privilege-escalation)
    - 13.3 [Capabilities (Linux) vs Privileges (Windows)](#133-capabilities-vs-privileges)
    - 13.4 [Namespaces & Cgroups — Container Isolation](#134-namespaces-cgroups)
    - 13.5 [seccomp — Syscall Filtering](#135-seccomp)
    - 13.6 [SELinux / AppArmor — Mandatory Access Control](#136-mac)
    - 13.7 [Running .NET Apps with Least Privilege](#137-least-privilege-net)

14. [Containers & the OS](#14-containers--the-os)
    - 14.1 [How Docker Uses Linux Primitives](#141-docker-linux-primitives)
    - 14.2 [Namespaces — PID, Net, Mount, UTS, IPC, User](#142-namespaces)
    - 14.3 [Cgroups v1 & v2 — Resource Limits](#143-cgroups)
    - 14.4 [OCI Runtime & runc](#144-oci-runtime)
    - 14.5 [.NET in Containers — Memory Limits, CPU Limits, GC Tuning](#145-net-in-containers)

15. [OS Networking Internals](#15-os-networking-internals)
    - 15.1 [Kernel Network Stack — Socket Buffers, TCP State Machine](#151-kernel-network-stack)
    - 15.2 [Socket Syscalls — socket, bind, listen, accept, connect, send, recv](#152-socket-syscalls)
    - 15.3 [epoll / kqueue / IOCP — OS Async I/O Multiplexing](#153-io-multiplexing)
    - 15.4 [Zero-Copy Networking — sendfile, splice](#154-zero-copy-networking)
    - 15.5 [TCP Tuning — Kernel Parameters](#155-tcp-tuning)
    - 15.6 [How .NET's Kestrel Uses the OS Network Stack](#156-kestrel-os-network)

16. [Performance & Observability](#16-performance--observability)
    - 16.1 [OS Performance Tools — top, htop, vmstat, iostat, perf](#161-os-perf-tools)
    - 16.2 [Linux perf — CPU Profiling & Hardware Counters](#162-linux-perf)
    - 16.3 [strace & ltrace — Syscall Tracing](#163-strace-ltrace)
    - 16.4 [/proc and /sys Filesystems](#164-proc-sys-filesystems)
    - 16.5 [Flame Graphs](#165-flame-graphs)
    - 16.6 [Profiling .NET Apps at the OS Level](#166-profiling-net-os-level)
    - 16.7 [dotnet-trace, dotnet-counters, dotnet-dump](#167-dotnet-tools)

17. [Windows OS Specifics for .NET](#17-windows-os-specifics)
    - 17.1 [Windows Kernel Architecture](#171-windows-kernel)
    - 17.2 [Windows Handles & Objects](#172-windows-handles)
    - 17.3 [IOCP — I/O Completion Ports](#173-iocp)
    - 17.4 [Windows Registry](#174-windows-registry)
    - 17.5 [Windows Services & .NET Worker Services](#175-windows-services-net)
    - 17.6 [ETW — Event Tracing for Windows](#176-etw)
    - 17.7 [Windows Job Objects — Process Grouping & Limits](#177-job-objects)

18. [Linux OS Specifics for .NET](#18-linux-os-specifics)
    - 18.1 [Linux Kernel Architecture](#181-linux-kernel)
    - 18.2 [systemd & .NET Service Units](#182-systemd-net)
    - 18.3 [Linux Process Model — fork, exec, clone](#183-linux-process-model)
    - 18.4 [Linux Memory Model — mmap, brk, madvise](#184-linux-memory-model)
    - 18.5 [Linux File Descriptor Limits & ulimit](#185-fd-limits-ulimit)
    - 18.6 [Linux Network Tuning for .NET Apps](#186-linux-network-tuning)
    - 18.7 [eBPF — Programmable Kernel Observability](#187-ebpf)

---

## Section Prompts

### 1. OS Fundamentals

#### 1.1 What an OS Does
```
Explain what an OS does concisely: resource manager (CPU, memory, I/O, network), hardware abstraction layer, security enforcer, service provider. Cover kernel (privileged, always running) vs userspace (unprivileged, where .NET apps run). Explain why .NET apps can't directly access hardware — must go through OS. Show what happens when a .NET app calls File.ReadAllText: user code → BCL → syscall → kernel → driver → hardware → back. Keep hardware details minimal, focus on the abstraction boundary .NET developers interact with daily.
```

#### 1.2 System Calls
```
Explain system calls: the API between user programs and the kernel. Cover common syscall categories: process (fork, exec, exit), memory (mmap, brk), file (open, read, write, close), network (socket, connect, send, recv), synchronization (futex). Show syscall overhead: ~100ns context switch from user to kernel and back — explains why batching I/O operations matters. Show that .NET's File, Socket, Thread, and Memory classes all ultimately call OS syscalls. Cover how to observe syscalls made by a .NET process using strace (Linux) or ProcMon (Windows).
```

#### 1.3 User Mode vs Kernel Mode
```
Explain CPU privilege rings: Ring 0 (kernel — full hardware access), Ring 3 (user — restricted). Cover the mode switch on syscall (software interrupt or SYSCALL instruction, saves registers, switches stack, changes privilege level — ~100ns). Explain why this isolation matters: a bug in user code (your .NET app) can't corrupt kernel or other processes' memory. Cover what happens on null pointer dereference in .NET (segfault → OS sends SIGSEGV → CLR translates to NullReferenceException). Explain .NET running entirely in user mode.
```

#### 1.4 Interrupts & Exceptions
```
Explain hardware interrupts (async — NIC received packet, timer fired, disk read complete → CPU stops current work, saves state, runs interrupt handler), software interrupts/exceptions (sync — divide by zero, page fault, syscall instruction). Cover interrupt vectors, interrupt service routines, and deferred processing (top half vs bottom half). Explain how this drives async I/O: disk or NIC raises interrupt when done → OS wakes waiting thread → .NET Task completes. Show the connection: every await completion in .NET is ultimately driven by an OS interrupt.
```

#### 1.5 Kernel Architectures
```
Compare kernel designs: monolithic (Linux, Windows — all OS services in kernel space, fast but large attack surface), microkernel (Mach, QNX — minimal kernel, services in userspace, isolated but slower IPC), hybrid (Windows NT — microkernel-inspired but most services in kernel for performance), and exokernel/unikernel. Explain why this matters for .NET: on Linux, a bug in a kernel module can crash the system; on Windows, driver bugs trigger blue screens. Cover WSL2 (full Linux kernel in VM) vs WSL1 (syscall translation). Keep theoretical depth minimal.
```

#### 1.6 .NET Runtime and OS
```
Explain how the .NET runtime (CoreCLR) sits on top of the OS: the PAL (Platform Abstraction Layer) that wraps OS-specific calls, how the same C# code runs on Windows/Linux/macOS, what the runtime handles itself (GC, JIT, thread pool) vs what it delegates to OS (thread creation, memory allocation, file I/O, networking). Cover RuntimeInformation.IsOSPlatform, RuntimeInformation.OSDescription. Show how to write OS-conditional code in .NET. Explain that .NET's async I/O uses IOCP on Windows and epoll on Linux transparently.
```

---

### 2. Processes

#### 2.1 Process vs Program
```
Explain the distinction: program = static executable on disk, process = running instance with own address space, resources, and state. Multiple processes can run the same program simultaneously (each has own memory). Cover process isolation: one process can't read another's memory (virtual memory). Explain process ID (PID), parent process, and process tree. Show Process.GetCurrentProcess() and Process.GetProcessesByName() in .NET. Cover why isolation is important for reliability: one crashing process doesn't take down others.
```

#### 2.2 Process Address Space Layout
```
Explain virtual address space layout of a running process: text segment (executable code — read-only), data segment (initialized global/static variables), BSS segment (uninitialized globals — zero-filled), heap (grows up — dynamic allocation), memory-mapped region (shared libs, files), stack (grows down — function frames). Cover 64-bit address space (128TB usable on x86-64). Show where .NET fits: CLR code in text, managed heap in heap region, thread stacks. Use /proc/[pid]/maps (Linux) or Process Explorer (Windows) to observe a .NET process layout.
```

#### 2.3 Process Control Block
```
Explain the PCB (Process Control Block): OS data structure tracking all process state. Contents: PID, state (running/ready/blocked), CPU registers (saved on context switch), memory management info (page table pointer), open file descriptors, scheduling info (priority, CPU time used), signal handlers, resource limits. Explain that PCB is the OS's representation of a process — everything needed to pause and resume a process is here. Show what .NET's Process class exposes from the PCB: Id, Handle, Threads, MainModule, VirtualMemorySize64, WorkingSet64.
```

#### 2.4 Process States
```
Explain process state machine: New (being created), Ready (waiting for CPU), Running (on CPU), Blocked/Waiting (waiting for I/O or event), Terminated (finished). Show state transitions: scheduler dispatch (Ready→Running), preemption (Running→Ready), I/O request (Running→Blocked), I/O complete (Blocked→Ready). Explain that a .NET Thread.Sleep() → Blocked state (OS removes thread from scheduler), I/O await → Blocked (no thread consumed while waiting in async I/O), CPU-bound work → Running. Connect process states to .NET Task states.
```

#### 2.5 Process Creation
```
Cover process creation on Linux (fork: copies parent's address space with COW, then exec: replaces address space with new program — two-step), Windows (CreateProcess: single call, creates new address space, loads executable). Explain why fork+exec is Unix idiom (allows setup between fork and exec: redirecting stdin/stdout, setting env vars). Show .NET's Process.Start() which calls CreateProcess on Windows and fork+exec on Linux under the hood. Cover ProcessStartInfo: FileName, Arguments, RedirectStandardOutput, WorkingDirectory, Environment.
```

#### 2.6 Process Termination
```
Explain process termination: normal exit (main returns, Environment.Exit(), Process completes), abnormal exit (unhandled signal, access violation, OOM kill). Cover exit codes (0 = success, non-zero = error — convention not enforced). Show that on process exit, OS reclaims all resources (memory, file handles, sockets) regardless of what app does — but finalizers may not run. Cover AppDomain.UnhandledException, Environment.Exit() vs return from Main, and process exit in hosted .NET services. Show how to get exit code of child process with Process.ExitCode.
```

#### 2.7 Zombie & Orphan Processes
```
Explain zombie process: terminated but parent hasn't called wait() to read exit status — process table entry remains. Explain orphan process: parent dies before child — adopted by init/systemd (PID 1). Show why zombies accumulate if parent doesn't reap children (process table exhaustion). In .NET context: Process.WaitForExit() reaps child process. Show that neglecting to call WaitForExit() or Dispose() on a Process object can leave zombie processes on Linux. Cover the pattern for fire-and-forget child processes that clean up properly.
```

#### 2.8 Process in .NET
```
Comprehensive guide to System.Diagnostics.Process in .NET: Start a process (Process.Start with ProcessStartInfo), redirect stdin/stdout/stderr (RedirectStandardOutput + async reading to avoid deadlock), wait for completion (WaitForExit, WaitForExitAsync .NET 5+), kill/terminate (Kill, Kill(entireProcessTree)), read exit code, enumerate running processes (GetProcesses, GetProcessById), monitor memory and CPU usage (WorkingSet64, TotalProcessorTime). Cover the deadlock trap: reading stdout synchronously while process also writes stderr (buffers fill, deadlock). Show async reading pattern.
```

---

### 3. Threads

#### 3.1 Thread vs Process
```
Compare threads and processes: threads share address space (heap, globals, file descriptors), processes have separate address spaces. Thread creation ~10µs, process creation ~1ms. Thread context switch ~1µs, process context switch ~10µs (TLB flush). Thread communication via shared memory (fast, but needs sync), process communication via IPC (slower, safer isolation). Cover why web servers use threads (shared connection pool, shared cache) vs why browsers use processes (isolation — one tab crash doesn't kill others). Explain .NET's threading model.
```

#### 3.2 Thread Control Block
```
Explain thread control block (TCB): per-thread data the OS tracks. Contents: thread ID (TID), CPU register state (saved on context switch), stack pointer and stack memory, scheduling state and priority, thread-local storage (TLS) pointer, signal mask, errno (per-thread). Explain that each .NET Thread has a separate OS thread (1:1 model) with its own TCB and stack (~1MB default). Cover Thread.CurrentThread, Thread.ManagedThreadId vs native TID. Show how Thread.SetApartmentState maps to COM apartment model on Windows.
```

#### 3.3 User vs Kernel Threads
```
Cover threading models: 1:1 (user thread = kernel thread — Linux, Windows, .NET's Thread class — simple, OS schedules, blocks don't block process, but expensive for millions of threads), M:1 (many user threads on one kernel thread — green threads — fast creation, but one block blocks all), M:N (many user on many kernel — Go goroutines, Erlang — best of both, complex runtime). Explain why .NET chose 1:1 for Thread but M:N via async/await (thread pool with non-blocking I/O gives M:N benefits without a true M:N scheduler). Cover why goroutines aren't in .NET.
```

#### 3.4 Thread Lifecycle
```
Explain thread lifecycle: Created (Thread object exists, no OS thread yet), Started (OS thread created, ThreadStart delegate queued), Running (executing on CPU), Waiting/Blocked (Thread.Sleep, Monitor.Wait, I/O), Background vs Foreground (process exits when all foreground threads finish), Aborted (deprecated Thread.Abort), Stopped (execution complete). Show state transitions. Explain that ThreadPool threads are always background threads. Cover Thread.IsBackground, Thread.Join() for synchronization, Thread.IsAlive. Show why Thread.Abort() was removed in .NET Core (unsafe — can abort inside finally blocks).
```

#### 3.5 Context Switching
```
Explain context switch: OS pauses one thread (saves CPU registers, instruction pointer, stack pointer to TCB), loads another thread's state. Cost: ~1-10µs for thread context switch (register save/restore + possible TLB flush + cache warming). Explain voluntary (thread blocks on I/O, sleep, lock) vs involuntary (preemption — timer interrupt, higher priority thread wakes). Cover cache effects: after context switch, L1/L2 caches are cold for new thread — real cost is much higher than register save. Show how excessive context switching hurts .NET app throughput (why async/await beats blocking threads).
```

#### 3.6 Green Threads / Fibers / Coroutines
```
Explain lightweight concurrency: green threads (user-space scheduled threads — JVM early versions, Go goroutines — stack starts small ~2KB, grows), fibers (Windows user-mode cooperative threads — no OS scheduler, manual SwitchToFiber), coroutines (language-level — suspend/resume execution point). Cover that C# async/await compiles to a state machine (not true coroutines — no stack suspension). Compare Go goroutines (true M:N with growable stacks) vs C# async (stackless, allocation when state machine allocated). Explain why .NET 9 introduced experimental green thread work.
```

#### 3.7 .NET Thread Model
```
Explain .NET's layered concurrency model: OS threads (Thread class — heavyweight, 1MB stack, ~10µs creation), ThreadPool (reusable OS threads managed by CLR — work items queued), Tasks (logical units of work scheduled on ThreadPool), and async/await (state machine + non-blocking I/O — no thread consumed while awaiting I/O). Cover ThreadPool thread count (auto-tuned by hill-climbing algorithm), ThreadPool.SetMinThreads/SetMaxThreads. Explain why you should almost never use new Thread() in modern .NET — use Task.Run or async/await. Cover when Thread is still needed (foreground thread control, COM STA, background service loops).
```

#### 3.8 Thread in .NET
```
Practical .NET threading guide: Thread class (constructor, Start, Join, Sleep, IsBackground, Priority, Name, ThreadLocal<T>), ThreadPool (QueueUserWorkItem, ThreadPool.SetMinThreads to avoid starvation on blocking code), Task.Run (queues work on ThreadPool, returns awaitable Task), Parallel.For/ForEach (data parallelism). Cover thread naming for debugging (visible in debugger and profilers). Show ThreadLocal<T> for per-thread state (e.g., per-thread Random instances). Cover Thread.CurrentThread.ManagedThreadId for logging. Show ExecutionContext.SuppressFlow for performance in fire-and-forget scenarios.
```

---

### 4. CPU Scheduling

#### 4.1 Scheduling Goals
```
Explain CPU scheduling objectives and their conflicts: maximize CPU utilization (keep CPU busy), maximize throughput (jobs/second), minimize turnaround time (job submission to completion), minimize waiting time (time in ready queue), minimize response time (interactive apps), fairness (each process gets fair share). Explain why these conflict: maximizing throughput favors long CPU-bound jobs, minimizing response time favors short interactive jobs. Cover how these translate to .NET: ThreadPool optimizes throughput, async/await optimizes response time, real-time apps need predictable scheduling.
```

#### 4.2 Preemptive vs Non-Preemptive
```
Explain preemptive scheduling (OS can forcibly remove CPU from running process/thread — timer interrupt, higher priority arrival) vs non-preemptive/cooperative (process keeps CPU until it yields — early OS, Node.js event loop, .NET async continuation). Cover that modern OS (Linux, Windows) are preemptive — a runaway .NET thread consuming 100% CPU will be preempted. Explain async/await as cooperative within the thread pool (awaiting yields control back to scheduler — this is why async code plays nicely with other tasks on the same thread).
```

#### 4.3 Basic Scheduling Algorithms
```
Cover scheduling algorithms with concrete examples: FIFO/FCFS (simple, convoy effect — one long job blocks short jobs), SJF (shortest job first — optimal average wait, requires knowing job length), SRTF (preemptive SJF), Priority Scheduling (starvation risk — aging fixes it), Round Robin (time quantum — too small = too many context switches, too large = FIFO). Show how turnaround and waiting time are calculated for each. Explain that these are building blocks — real OSes use hybrids. Connect to .NET ThreadPool: it doesn't use pure Round Robin but work-stealing.
```

#### 4.4 MLFQ
```
Explain Multilevel Feedback Queue (MLFQ): multiple queues with different priorities, processes move between queues based on CPU behavior. New process starts at highest priority (assuming interactive). Uses full time quantum → demoted to lower priority (CPU-bound behavior). Yields CPU (I/O) → stays at high priority or promoted (interactive behavior). Periodic priority boost (prevent starvation). Explain MLFQ's key insight: learns job behavior dynamically without prior knowledge. Show that Linux and Windows use MLFQ variants. Connect to why I/O-heavy .NET web apps (interactive) get scheduled better than CPU-heavy batch jobs.
```

#### 4.5 Linux CFS
```
Explain Linux Completely Fair Scheduler: uses a red-black tree ordered by virtual runtime (vruntime), always runs the task with smallest vruntime (most behind on CPU time). Nice values adjust vruntime accumulation rate (lower nice = slower accumulation = more CPU). Targets a scheduling latency period (default 6ms) distributed among runnable tasks. Cover cgroups CPU quotas (limits total CPU time — relevant for containers). Explain that .NET on Linux is scheduled by CFS — setting Process.PriorityClass maps to nice values. Show that containerized .NET apps with CPU limits use CFS bandwidth controller.
```

#### 4.6 Windows Scheduler
```
Explain Windows scheduler: 32 priority levels (0-31), two classes (real-time: 16-31, variable: 0-15), MLFQ for variable priorities with priority boosts (foreground window boost, I/O completion boost, starvation prevention). Cover quantum (length varies: foreground gets 3x longer quantum in client Windows). Explain processor affinity, NUMA awareness. Show how .NET's Process.PriorityClass (Idle, BelowNormal, Normal, AboveNormal, High, RealTime) and Thread.Priority map to Windows priority levels. Cover SetThreadPriority implications for .NET ThreadPool threads.
```

#### 4.7 Thread Priority in .NET
```
Practical guide to thread priorities in .NET: Thread.Priority enum (Lowest, BelowNormal, Normal, AboveNormal, Highest), Process.PriorityClass for whole-process priority, ProcessThread.PriorityLevel for individual OS threads. Warn that raising thread priority can starve other threads/processes including the GC. Cover that ThreadPool threads should generally stay at Normal priority. Show setting high priority for time-sensitive .NET threads (audio processing, real-time data). Explain that Thread.Priority.Highest is still below real-time OS priority — for true real-time, use process priority class RealTime (dangerous on Windows).
```

#### 4.8 ThreadPool Work Stealing
```
Explain .NET ThreadPool's work-stealing scheduler: each thread has a local queue (LIFO for cache warmth), global queue, threads steal from other threads' queues when idle (FIFO from tail to avoid contention). Benefits: cache locality (thread continues recent work), load balancing (idle threads steal work). Cover hill-climbing algorithm (auto-tunes thread count by monitoring throughput — adds threads when throughput improves). Show ThreadPool.GetAvailableThreads, ThreadPool.GetMaxThreads. Explain why blocking ThreadPool threads is dangerous (pool grows to compensate, memory pressure). Cover Task.Yield() to release thread to pool.
```

---

### 5. Synchronization Primitives

#### 5.1 Race Conditions
```
Explain race conditions: outcome depends on timing of concurrent operations. Show classic example: two threads incrementing a shared counter (read-modify-write not atomic). Show that even i++ in C# is three operations at IL level (load, increment, store) — race possible. Cover that race conditions are non-deterministic (may work 99.99% of time, fail under load). Show how to detect races: ThreadSanitizer (Linux), Helgrind (Valgrind), .NET has no built-in race detector but Concurrency Visualizer in VS helps. Explain that async/await doesn't eliminate races (concurrent awaits on same state).
```

#### 5.2 Critical Section
```
Explain critical section: code that accesses shared resources, must execute atomically (only one thread at a time). Requirements: mutual exclusion (only one thread in CS), progress (if no thread in CS, any thread wanting to enter should enter in finite time), bounded waiting (thread can't wait forever). Show Peterson's algorithm as a software-only solution (historical, educational). Cover that hardware atomic instructions (CAS, test-and-set) enable efficient mutual exclusion. Explain that in .NET, lock { } marks critical sections — show what happens in IL (Monitor.Enter, try/finally, Monitor.Exit).
```

#### 5.3 Mutex
```
Explain mutex (mutual exclusion lock): OS-level synchronization primitive, only owner can release, recursive mutexes (same thread can lock multiple times), cross-process mutexes (named mutexes). Cover that mutex involves OS kernel (kernel mode switch on contended acquire — ~1µs). Compare to in-process monitors (faster for same-process sync). Show .NET Mutex class: named mutex for cross-process sync (Mutex("Global\\MyAppMutex")), ensuring single instance of an application. Cover Mutex.WaitOne timeout and AbandonedMutexException (owner died holding mutex). Contrast with lock/Monitor for same-process use.
```

#### 5.4 Semaphore
```
Explain semaphore: integer counter, P(wait) decrements (blocks if 0), V(signal) increments. Binary semaphore = mutex (but not owned — anyone can signal). Counting semaphore = resource pool (count = available resources). Cover use cases: connection pool (semaphore count = max connections), rate limiting, producer-consumer (empty/full semaphores). Show .NET Semaphore (kernel-based, cross-process) vs SemaphoreSlim (user-space spin first then kernel, same-process, async-compatible — WaitAsync()). Show SemaphoreSlim as the go-to for limiting concurrent async operations in .NET.
```

#### 5.5 Condition Variables
```
Explain condition variables: mechanism to wait for a condition to become true, always used with a mutex. Wait (atomically release mutex and sleep), Signal/Notify (wake one waiting thread), Broadcast/NotifyAll (wake all). Classic producer-consumer with condition variables. Explain spurious wakeups (threads can wake without signal — always recheck condition in while loop, not if). Show that Monitor.Wait/Pulse/PulseAll in .NET implement condition variables. Cover the pattern: lock → while(!condition) Monitor.Wait → do work → Monitor.Pulse. Contrast with ManualResetEventSlim.
```

#### 5.6 Monitors
```
Explain monitor = mutex + condition variable combined in one abstraction. Each object in .NET has a built-in monitor (sync block in object header). lock(obj) {} = Monitor.Enter + try/finally Monitor.Exit. Monitor.Wait releases lock and sleeps. Monitor.Pulse wakes one waiter, Monitor.PulseAll wakes all. Show a bounded buffer implementation using Monitor.Wait/Pulse. Cover Monitor.TryEnter with timeout to avoid deadlock. Explain that lock is implemented via Monitor but doesn't expose Wait/Pulse — need Monitor directly for full condition variable functionality. Cover lock statement expansion in IL.
```

#### 5.7 Spinlock
```
Explain spinlock: busy-wait — thread loops checking lock availability (no OS involvement, no context switch). Fast if lock held briefly (< ~100ns), wasteful if held long (burns CPU). Used in OS kernel, interrupt handlers, and high-performance lock-free code. Show SpinLock struct in .NET (value type, no heap alloc, Thread.SpinWait for PAUSE instruction to reduce power/contention). Cover SpinWait as an adaptive wait (spins first, then yields, then Thread.Sleep — exponential backoff). Show when to use SpinLock: protecting single variable update, locking for < 50ns. Contrast with lock (Monitor) for longer critical sections.
```

#### 5.8 Read-Write Lock
```
Explain read-write lock: multiple concurrent readers OR one exclusive writer. Improves throughput for read-heavy workloads. Cover writer starvation (many readers → writer never gets in), reader starvation (write-preferring policy), and upgradeable locks. Show ReaderWriterLockSlim in .NET: EnterReadLock, EnterWriteLock, EnterUpgradeableReadLock (holds upgradeable read, can upgrade to write without releasing). Cover TryEnterReadLock with timeout. Show benchmark: RWLock beats regular lock when reads >> writes. Explain why RWLock overhead means it only wins at high read-to-write ratios (>10:1).
```

#### 5.9 Sync in .NET
```
Comprehensive .NET synchronization guide: lock / Monitor (fast in-process mutex + CV), Mutex (cross-process named mutex), SemaphoreSlim (async-compatible counting semaphore — go-to for async throttling), Semaphore (kernel, cross-process), ManualResetEventSlim (async-compatible set/reset event, WaitAsync), AutoResetEvent, CountdownEvent (wait for N operations to complete), Barrier (synchronize N threads at a phase boundary), ReaderWriterLockSlim. Cover async-compatible primitives (.NET doesn't have async Mutex — use SemaphoreSlim(1,1) as async mutex). Show choosing the right primitive via a decision table.
```

---

### 6. Deadlocks

#### 6.1 Deadlock Conditions
```
Explain Coffman's four necessary conditions for deadlock (all must hold simultaneously): Mutual Exclusion (resource held exclusively), Hold and Wait (holds some resources, waits for others), No Preemption (resources can't be forcibly taken), Circular Wait (circular chain of processes waiting for each other). Show a concrete .NET deadlock: Thread A locks lockA then tries lockB, Thread B locks lockB then tries lockA — classic AB-BA deadlock. Explain that deadlock = all four conditions — preventing any one prevents deadlock. Diagrams: resource allocation graph with cycle = deadlock.
```

#### 6.2 Deadlock Prevention
```
Explain deadlock prevention by violating each Coffman condition: eliminate Mutual Exclusion (make resources sharable — not always possible), eliminate Hold-and-Wait (acquire all resources at once or release before requesting more — inefficient), allow Preemption (take resources from waiting process — works for CPU/memory, not locks), eliminate Circular Wait (total ordering of resource acquisition — always lock in same order). Show lock ordering as the practical .NET approach: always acquire lockA before lockB consistently. Cover static analysis tools that detect lock ordering violations. Show `lock (a) { lock (b) { } }` pattern and required consistency.
```

#### 6.3 Deadlock Avoidance
```
Explain Banker's Algorithm: before granting resource, check if safe state remains (a state where all processes can complete in some order). O(n²m) per request. Maintains available resources, allocation matrix, max demand matrix. Rarely used in practice (must know max demand in advance). Cover that .NET and OS don't use Banker's — they prevent or detect. Explain "safe state" concept: even if deadlock-free now, can we complete all processes? Show a simple example with 2 processes and 2 resource types. Focus on intuition, not the algorithm mechanics.
```

#### 6.4 Deadlock Detection & Recovery
```
Explain deadlock detection: periodically check for cycles in resource allocation graph (OS approach — Windows/Linux don't do this for mutexes). Detection algorithms: single-instance resources (DFS cycle detection), multi-instance (similar to Banker's but checks current allocation). Recovery: kill one or more deadlocked processes (databases do this), preempt resources (rollback), operator intervention. Cover that .NET has no built-in deadlock detection for Monitor/lock. Show using CancellationToken with SemaphoreSlim/WaitAsync and timeout to break potential deadlocks. Cover dotnet-dump + ClrMD for post-mortem deadlock analysis.
```

#### 6.5 Livelock & Starvation
```
Explain livelock: threads actively change state in response to each other but make no progress (two people stepping same way in a hallway). Show livelock example: two threads each releases lock when they see the other waiting, then both re-acquire, repeat. Cover starvation: thread ready to run but never scheduled (low-priority thread starved by high-priority threads, or writer starved by continuous readers). Show .NET examples: ThreadPool thread starvation from blocking (all threads blocked → new requests queue → timeout). Cover SemaphoreSlim FIFO ordering (prevents starvation). Show Polly retry with jitter to prevent livelock in distributed systems.
```

#### 6.6 Deadlocks in .NET
```
Cover common .NET deadlock patterns: AB-BA lock ordering, async deadlock (await inside lock, or .Result/.Wait() in async context — classic ASP.NET deadlock), SynchronizationContext deadlock (UI thread blocked on Task.Result while continuation needs UI thread), ThreadPool starvation deadlock (blocking ThreadPool threads, pool grows, runs out). Show each pattern and fix. Cover async deadlock: ConfigureAwait(false) or make entire call chain async. Show deadlock detection in production: dotnet-dump, WinDbg !dlk command, Visual Studio parallel stacks. Provide a deadlock prevention checklist.
```

---

### 7. Memory Management

#### 7.1 Physical vs Virtual Memory
```
Explain physical memory (actual RAM chips, byte-addressable, shared by all processes) vs virtual memory (each process sees its own address space — isolated, larger than physical RAM possible). Cover the MMU (Memory Management Unit) hardware that translates virtual → physical addresses on every memory access. Explain why virtual memory is essential: isolation (can't access other process memory), overcommit (sum of virtual memory > physical RAM), simplified addressing (each process thinks it has address space from 0). Show how .NET process's virtual address space relates to physical RAM — GC heap is virtual, actual pages loaded on demand.
```

#### 7.2 Paging
```
Explain paging: divide virtual address space into fixed-size pages (typically 4KB), physical RAM into frames. Page table maps virtual page number → physical frame number. Translation: VA = virtual page number (VPN) + offset, PA = frame number + offset. Cover present bit (page in RAM or on disk), dirty bit (page modified), accessed bit. Explain why 4KB pages: small enough for fine-grained allocation, large enough for few page table entries. Show that a .NET object's virtual address may map to any physical frame — OS manages this transparently. Cover page table size: 64-bit → multilevel tables needed.
```

#### 7.3 Multilevel Page Tables & TLB
```
Explain problem with single-level page table (4KB pages, 48-bit VA space → 512GB page table per process). Solution: multilevel page tables (x86-64 uses 4-level: PML4 → PDPT → PD → PT → frame — only allocate tables for used regions). Explain TLB (Translation Lookaside Buffer): hardware cache of recent VA→PA translations, ~1-2 cycle hit vs ~100 cycles page table walk. TLB miss → page table walk → TLB fill. Cover TLB shootdown (multi-core: changing page table requires invalidating TLB on all cores — expensive). Show why ASLR has TLB performance cost, and why huge pages reduce TLB pressure for .NET large heaps.
```

#### 7.4 Segmentation
```
Explain segmentation: divides address space into variable-size segments (code, data, stack, heap), each with own base+limit. Show x86 segmentation (CS, DS, SS, FS, GS registers — mostly vestigial in 64-bit mode except FS/GS for thread-local storage). Explain that modern OSes use paging, not segmentation, for memory protection. Cover FS register used by OS for thread-local storage (Linux: FS → TLS, Windows: FS/GS → TEB). Show that .NET's ThreadLocal<T> ultimately relies on OS TLS via FS/GS. Keep brief — segmentation is mostly historical for x86-64 context.
```

#### 7.5 Demand Paging & Page Faults
```
Explain demand paging: pages loaded into RAM only when accessed (not at process start). Page fault: CPU tries to access page not in RAM → MMU raises exception → OS page fault handler runs → loads page from disk (swap space or executable file) → resumes process. Types: minor fault (page in memory but not mapped — just update page table, fast), major fault (page on disk — disk read, slow ~5ms). Cover copy-on-write faults (write to shared page → OS copies page → minor fault). Show that .NET startup triggers many minor page faults (loading .NET assemblies). Explain working set vs resident set size.
```

#### 7.6 Page Replacement Algorithms
```
Cover page replacement when RAM full: OPT/Bélády (optimal — replace page used furthest in future, theoretical benchmark), FIFO (replace oldest — simple, Bélády's anomaly: more frames can give more faults), LRU (replace least recently used — good approximation of OPT, hard to implement exactly in hardware), Clock/NRU (approximates LRU using accessed bit — hardware-friendly), and LFU. Explain that OS uses Clock algorithm (Linux uses a variant). Cover working set model and thrashing prevention. Show that .NET apps with large heaps that don't fit in RAM will page fault heavily — monitor with vmstat/perfmon.
```

#### 7.7 Thrashing
```
Explain thrashing: process spends more time paging than executing (degree of multiprogramming too high → each process gets insufficient frames → constant page faults). Symptoms: CPU utilization drops despite high load (CPU waiting for I/O). Solutions: reduce multiprogramming (kill processes), working set model (allocate frames = current working set size), page fault frequency (adaptive allocation). Show that .NET apps thrash when their GC heap + other working set exceeds available RAM. Cover how to detect thrashing (vmstat si/so columns for swap in/out on Linux, Memory: Hard Faults/sec in Windows perfmon). Practical: size pods/VMs to fit app working set.
```

#### 7.8 Huge Pages in .NET
```
Explain huge pages (Linux: 2MB transparent huge pages, explicit hugetlbfs; Windows: large pages 2MB/1GB). Benefits: fewer TLB entries needed (1 huge page covers 512 regular pages), fewer page table entries, less TLB pressure for large heaps. Relevant for .NET apps with large GC heaps (hundreds of MB). Cover DOTNET_GCLargePages=1 environment variable to enable large pages for .NET GC heap. Show performance improvement for large heap .NET apps (reduced TLB miss rate). Cover transparent huge pages (THP) on Linux — automatic for large anonymous allocations. Cover trade-offs: huge pages can cause fragmentation, worse for small apps.
```

#### 7.9 Memory-Mapped Files in .NET
```
Cover MemoryMappedFile in .NET: map file into virtual address space (OS handles paging to/from disk), access file like memory (pointer/Span<byte>). Patterns: MemoryMappedFile.CreateFromFile (map existing file), CreateNew (anonymous for IPC), CreateOrOpen (named for cross-process). MemoryMappedViewAccessor (safe read/write), MemoryMappedViewStream (stream API), unsafe MemoryMappedViewAccessor.SafeMemoryMappedViewHandle.AcquirePointer for span access. Use cases: large file processing without loading all into RAM, shared memory IPC between .NET processes, implementing simple databases. Show parsing a large binary file with memory-mapped + Span<byte>.
```

---

### 8. Virtual Memory Deep Dive

#### 8.1 Address Space Layout
```
Explain detailed virtual address space layout for a 64-bit Linux process: 0-128TB user space (text at low addresses, then data/BSS, then heap growing up, mmap region growing down, then stack at top of user space). Cover /proc/self/maps format (address range, permissions rwxp, offset, device, inode, filename). Show that .NET's CLR code lives in mmap'd .so files, GC heap in anonymous mmap regions, thread stacks in mmap'd regions. Compare to Windows (PEB/TEB at specific addresses, modules at high addresses). Show how to read a .NET process's memory map using /proc/[pid]/maps or Process.VirtualMemorySize64.
```

#### 8.2 ASLR
```
Explain ASLR (Address Space Layout Randomization): OS randomizes base addresses of stack, heap, mmap regions, and executable (if PIE) at each process start. Goal: make buffer overflow exploits harder (can't hardcode addresses). Cover entropy: Linux 64-bit ASLR has 28 bits of randomness for mmap (268M possible positions). Cover .NET and ASLR: .NET assemblies are loaded as position-independent code on Linux (PIE), on Windows ASLR enabled by default. Show that debugging with ASLR can complicate address-based breakpoints. Cover ASLR bypass techniques (info leak vulnerabilities) — conceptually, not implementation.
```

#### 8.3 Copy-on-Write
```
Explain copy-on-write (COW): multiple processes share same physical pages (marked read-only), first write triggers page fault → OS copies page → process gets private copy. Used in fork (child shares all parent's pages via COW — only diverged pages get copied, fast fork), mmap MAP_PRIVATE (modifications stay private), and .NET string interning. Show memory savings from COW in containerized .NET apps (multiple containers sharing same .NET runtime pages). Cover /proc/pid/smaps (PSS = proportional share shows COW sharing). Explain why fork() after large heap allocation wastes memory (COW pages get dirtied by GC).
```

#### 8.4 Shared Memory Between Processes
```
Cover shared memory IPC: mmap MAP_SHARED (Linux — multiple processes map same file/anonymous memory, fastest IPC), POSIX shared memory (shm_open + mmap), Windows shared memory (CreateFileMapping + MapViewOfFile). Show .NET MemoryMappedFile for cross-process shared memory: producer writes, consumer reads via shared named mapping. Cover synchronization (shared memory has no built-in sync — use named Mutex or Semaphore). Show how to implement a lock-free ring buffer in shared memory using .NET MemoryMappedFile + Interlocked. Practical use cases: .NET diagnostic tools, local cache sharing, high-throughput local IPC.
```

#### 8.5 Memory Overcommit
```
Explain memory overcommit: Linux allows allocating more virtual memory than physical RAM + swap exists (overcommit_memory = 1 default). Virtual allocation succeeds immediately, physical pages allocated on first access. Applications can "allocate" more than available. Cover why: most allocations aren't fully used (malloc of 1GB array but only touch 10MB). Risk: physical memory can run out at access time → OOM killer. Cover overcommit settings (/proc/sys/vm/overcommit_memory: 0=heuristic, 1=always, 2=never). Show .NET implications: GC.GetGCMemoryInfo().TotalAvailableMemoryBytes may be optimistic under overcommit. Relevant for .NET in Kubernetes with memory limits.
```

#### 8.6 OOM Killer
```
Explain Linux OOM (Out of Memory) Killer: when system runs out of memory, kernel selects and kills a process to reclaim memory. Selection via OOM score (oom_score) — based on memory usage, runtime, priority. Can be influenced via oom_score_adj (-1000 = never kill, +1000 = kill first). Show that Kubernetes sends SIGKILL via OOM killer when container exceeds memory limit — .NET process killed without cleanup, no graceful shutdown. Cover DOTNET_GCConserveMemory (1-9) and GC.AddMemoryPressure for hinting. Show monitoring OOM events (dmesg | grep oom-kill, /var/log/kern.log). Cover setting .NET GC heap limit to stay within container limits.
```

#### 8.7 Memory Inspection in .NET
```
Show tools and APIs for inspecting .NET process memory: GC.GetGCMemoryInfo() (total available memory, committed, heap size, fragmented memory), Process.GetCurrentProcess().WorkingSet64 (RSS — resident physical memory), Process.VirtualMemorySize64 (virtual address space used), Process.PrivateMemorySize64 (private bytes — not shared). Cover dotnet-counters (System.Runtime/gc-heap-size, System.Runtime/working-set), dotnet-dump (heap analysis), PerfView (memory allocation analysis). Show /proc/self/status (VmRSS, VmSize, VmPeak) on Linux. Cover ClrMD for programmatic heap inspection. Explain the difference between committed, reserved, and physical memory.
```

---

### 9. File Systems

#### 9.1 File System Concepts
```
Explain core file system concepts: file (named sequence of bytes with metadata), directory (maps names to inodes), inode (file metadata: size, timestamps, permissions, pointers to data blocks — not the name), hard link (directory entry pointing to inode — multiple names for same inode), data blocks. Cover VFS (Virtual File System) layer in Linux — uniform API over different FS implementations. Show that .NET's File/FileInfo/Directory classes call VFS syscalls. Explain what FileInfo.Length actually does (stat syscall reads inode). Cover stat vs lstat (follow symlinks or not).
```

#### 9.2 File System Structures
```
Cover key file systems: FAT32 (simple, universal, no permissions, max 4GB file — USB drives), NTFS (Windows — ACLs, journaling, sparse files, alternate data streams, MFT), ext4 (Linux default — extents, journaling, max 16TB file), APFS (macOS/iOS — copy-on-write, snapshots, clones, native encryption), Btrfs (Linux — COW, snapshots, RAID, subvolumes), ZFS (integrity-focused — checksums, RAID-Z, snapshots). Show what .NET developers encounter: NTFS alternate data streams (Zone.Identifier marks downloaded files), ext4 for Linux deployments, APFS on macOS CI. Cover cross-platform file name case sensitivity (Linux: case-sensitive, Windows/macOS: usually case-insensitive).
```

#### 9.3 File Descriptors
```
Explain file descriptors (FDs): integer handle (0=stdin, 1=stdout, 2=stderr, then 3+ for opened files) maintained per-process by OS. FD is index into per-process FD table → OS file description (offset, flags, file pointer) → inode. Cover FD limits (default 1024 per process on Linux — ulimit -n, soft vs hard limit). Show that .NET FileStream wraps an OS file descriptor (SafeFileHandle). Cover FD inheritance on fork/exec (FD_CLOEXEC flag). Show why "too many open files" error happens and how to fix: increase ulimit, ensure streams are disposed. Monitor with /proc/pid/fd count. Show GC.Collect() doesn't close files — must Dispose().
```

#### 9.4 Buffered vs Unbuffered I/O
```
Explain I/O buffering layers: application buffer (StreamWriter, StreamReader), OS page cache (kernel buffer — all file I/O goes through by default), disk buffer (SSD/HDD write cache). Buffered I/O (default): reads/writes go to page cache, OS flushes asynchronously — fast but data may be lost on crash. Unbuffered/Direct I/O (O_DIRECT): bypasses page cache, goes directly to disk — slower but no double-buffering (good for databases). Synchronized I/O (O_SYNC, fsync): guarantees data on disk before return. Show .NET: FileStream with FileOptions.WriteThrough (no OS buffering of writes), File.OpenHandle with FileOptions.Asynchronous. Cover FileStream.Flush vs FileStream.Flush(flushToDisk:true) (calls fsync).
```

#### 9.5 File Permissions
```
Explain Unix file permissions: rwxrwxrwx (owner/group/other), octal notation (755 = rwxr-xr-x), execute bit on directories means "can traverse", setuid/setgid bits, sticky bit on directories. Cover ACLs (Access Control Lists — more granular than rwx, getfacl/setfacl). Show Windows NTFS permissions: DACL (Discretionary ACL — who can access), SACL (System ACL — auditing), permission inheritance. Show .NET cross-platform: File.GetUnixFileMode / File.SetUnixFileMode (.NET 7+), FileSystemAclExtensions (Windows ACLs). Cover why file permission errors happen in Docker containers (running as root vs non-root, volume mount ownership mismatch).
```

#### 9.6 Symlinks vs Hard Links
```
Explain symbolic links (symlink): file containing a path to another file, separate inode, can cross filesystems, can be dangling (target deleted), Directory.CreateSymbolicLink (.NET 6+). Hard links: additional directory entry pointing to same inode, same filesystem only, file "deleted" only when all hard links gone (inode reference count = 0). Show difference: ln vs ln -s, ls -la showing link count. Practical .NET: resolve symlinks with Path.GetFullPath or File.ResolveLinkTarget (.NET 6+). Cover NTFS junctions and reparse points (Windows equivalent of symlinks). Show NuGet packages linked into global cache via hard links for efficiency.
```

#### 9.7 Journaling
```
Explain journaling: before modifying file system structures, write changes to a journal (log), then apply. On crash, replay journal to restore consistency. Modes: writeback (only metadata journaled — fastest, data may be lost), ordered (metadata + ensures data written before metadata — default ext4), full (both data and metadata journaled — safest, slowest). Cover write barriers (ensures journal write committed before actual change). Explain that databases implement their own WAL (Write-Ahead Log) on top of FS journaling. Show .NET: FileStream.Flush(flushToDisk:true) guarantees data survives power loss. Relevant for implementing reliable state persistence in .NET services.
```

#### 9.8 File I/O in .NET
```
Comprehensive .NET file I/O guide: File static class (ReadAllText, WriteAllText, ReadAllBytes, AppendAllText — for simple one-shot operations), FileStream (for streaming, seeking, async I/O — use FileOptions.Asynchronous for true async), StreamReader/StreamWriter (text with encoding), BinaryReader/BinaryWriter (typed binary), Path (cross-platform path manipulation — Path.Combine, GetFileName, GetExtension, GetDirectoryName), Directory (enumerate, create, delete). Cover FileShare flags, FileMode (Create vs CreateNew vs Append vs OpenOrCreate). Show async file reading with ReadAsync on FileStream. Cover using/await using for proper disposal.
```

#### 9.9 High-Performance File I/O in .NET
```
Show high-performance file I/O patterns in .NET: RandomAccess class (.NET 6+ — scatter/gather I/O, ReadAsync(SafeFileHandle, buffers, fileOffset) for multiple reads in one syscall), FileOptions.Asynchronous (IOCP on Windows, io_uring on Linux .NET 7+), FileOptions.SequentialScan (hints OS to prefetch — for sequential reads), FileOptions.WriteThrough (bypass OS write cache), FileStream with large buffer (default 4KB — use 64KB-4MB for sequential large files), MemoryMappedFile for random access to large files. Benchmark: sequential FileStream vs RandomAccess vs MemoryMappedFile for 1GB file. Show pipeline: ReadAsync into ArrayPool buffer.
```

---

### 10. I/O & Storage

#### 10.1 I/O Hardware
```
Explain I/O hardware interaction methods: polling (CPU repeatedly checks device status — wastes CPU), interrupts (device signals CPU when ready — efficient, CPU does other work), DMA (Direct Memory Access — device transfers data directly to RAM without CPU involvement, CPU gets interrupt when done — for disk, network). Cover programmed I/O vs interrupt-driven vs DMA. Show that all modern disk and network I/O in .NET uses DMA + interrupts. Explain the path: FileStream.ReadAsync → kernel queues I/O → DMA transfer → interrupt → kernel wakes thread → Task completes. No CPU consumed during transfer.
```

#### 10.2 Block vs Character Devices
```
Explain device types: block devices (fixed-size blocks, random access, buffered by OS page cache — disks, SSDs, USB storage, exposed as /dev/sda), character devices (byte stream, sequential, no buffering — terminal, keyboard, serial port, /dev/tty). Cover how OS presents devices as files (Unix "everything is a file" philosophy). Show /dev directory. Explain why databases open disks as block devices with O_DIRECT (bypass page cache). Relate to .NET: FileStream for block devices, SerialPort for character devices. Cover /dev/null, /dev/zero, /dev/urandom as special character devices used in scripting.
```

#### 10.3 Disk Scheduling
```
Cover disk scheduling algorithms (mostly relevant for HDDs, less so SSDs): FCFS (fair, poor seek performance), SSTF (shortest seek time first — starvation), SCAN/Elevator (sweeps back and forth — fair), C-SCAN (circular scan — more uniform wait times), LOOK/C-LOOK (don't go all the way to edge). Explain that SSDs have no seek time — disk scheduling less critical but still relevant for queue depth and command reordering. Cover Linux I/O schedulers (mq-deadline, BFQ, none for NVMe). Show that .NET async I/O lets the OS and disk controller optimize ordering — don't artificially serialize I/O.
```

#### 10.4 Storage Hierarchy
```
Cover storage hierarchy and latency: CPU registers (< 1ns), L1 cache (1ns), L2 (4ns), L3 (40ns), DRAM (60-100ns), NVMe SSD (100µs), SATA SSD (500µs), HDD (5-10ms), network storage (1ms+). Cover NVMe: PCIe-attached SSD, queue depth 64K (vs SATA 32), parallel access, low latency. Explain why NVMe enables async I/O patterns that weren't worth it with HDDs. Cover storage classes for .NET workloads: use NVMe for hot data, SATA SSD for warm, HDD/object storage for cold. Show that .NET's async I/O can saturate NVMe with many concurrent operations — blocking I/O can't.
```

#### 10.5 Buffering, Caching, Spooling
```
Explain I/O buffering strategies: user-space buffer (StreamReader's internal buffer — reduces syscall count), kernel page cache (OS caches recently accessed disk blocks in RAM — transparent to app), write buffering (writes collected and flushed in batch), read-ahead (OS prefetches pages for sequential access). Cover caching: OS page cache (LRU eviction under memory pressure), file system metadata cache (dentry cache, inode cache). Cover spooling (Simultaneous Peripheral Operations OnLine — queuing I/O for slow devices like printers). Show .NET: StreamReader with large buffer, FileOptions.SequentialScan for read-ahead hint.
```

#### 10.6 Async I/O at the OS Level
```
Explain OS async I/O mechanisms: select/poll (check multiple FDs for readiness — O(n) scan), epoll (Linux — O(1) with event notification, used by Nginx, .NET Kestrel), kqueue (BSD/macOS equivalent of epoll), IOCP (Windows I/O Completion Ports — overlapped I/O, completion callbacks). Show epoll workflow: epoll_create, epoll_ctl (register FDs), epoll_wait (block until any FD ready). Explain that .NET's async/await for network I/O uses epoll on Linux and IOCP on Windows transparently via SocketAsyncEventArgs. Cover the C10K problem and how epoll solved it.
```

#### 10.7 io_uring and .NET
```
Explain io_uring (Linux 5.1+): modern async I/O interface using two ring buffers (submission queue, completion queue) shared between user and kernel — eliminates syscall overhead for I/O, supports batching, works for files (unlike epoll which is sockets-only). Cover io_uring advantages over epoll: works for regular files, vectored I/O, chained operations, no syscall per operation. Show .NET's adoption: .NET 6+ uses io_uring for file I/O on Linux (FileStream with async), .NET 7 uses it for network I/O via System.Net.Sockets. Cover IORING_OP_* operations. Show how to verify .NET is using io_uring on Linux.
```

#### 10.8 I/O Performance in .NET
```
Show I/O performance patterns in .NET: use FileOptions.Asynchronous (IOCP/io_uring — non-blocking), avoid sync I/O on async threads (File.ReadAllText in async context blocks ThreadPool thread), use large buffers (4KB default is too small for sequential I/O — use 64KB-4MB), scatter/gather I/O with RandomAccess (multiple buffers in one syscall), pipeline I/O with System.IO.Pipelines (producer-consumer with backpressure, no copy), FileOptions.WriteThrough only when durability needed (performance cost). Benchmark sequential FileStream vs PipeReader. Show async I/O keeps ThreadPool threads free for CPU work.
```

---

### 11. Inter-Process Communication

#### 11.1 IPC Overview
```
Explain why IPC is needed: processes have isolated address spaces (can't read each other's memory directly), need to communicate for microservices, plugin architectures, and multi-process apps. Cover IPC mechanisms by performance: shared memory (fastest — zero copy), pipes (moderate — kernel buffer), sockets (flexible — works local and remote), message queues, signals (limited data). Cover IPC by scope: same machine (all of above), cross-machine (only network). Show .NET IPC scenarios: diagnostics tools (dotnet-counters communicates via shared memory EventPipe), worker processes, browser/renderer separation. Relate to which .NET APIs to use.
```

#### 11.2 Pipes
```
Explain anonymous pipes: unidirectional byte stream between parent and child process (created before fork/Process.Start, one end given to child). Named pipes: bidirectional, identified by name, any processes can connect. Cover pipe buffering (fixed kernel buffer — writer blocks when full, reader blocks when empty). Show .NET: AnonymousPipeServerStream/AnonymousPipeClientStream (passing handle to child process via ProcessStartInfo argument), NamedPipeServerStream/NamedPipeClientStream (cross-process named pipes, supports async, supports messages vs byte stream via PipeTransmissionMode.Message). Show full IPC example: .NET parent → named pipe → .NET child process.
```

#### 11.3 Message Queues
```
Explain OS message queues: POSIX mq_open/mq_send/mq_receive (persistent, priority, max message size), System V message queues (older, complex). Cover that OS message queues are rarely used in .NET (limited features vs messaging systems). Practical .NET equivalent: Channel<T> (in-process), named pipe (local IPC), RabbitMQ/Azure Service Bus/Redis Streams (distributed). Cover Windows Messaging Queue (MSMQ) — legacy. Show Channel<T> as the modern in-process message queue: producer → Channel.Writer.WriteAsync → consumer → Channel.Reader.ReadAllAsync. Explain why Channel<T> is preferred over ConcurrentQueue for producer-consumer.
```

#### 11.4 Shared Memory IPC
```
Show shared memory as the fastest IPC (same physical pages mapped into multiple processes — no copying). Cover POSIX shared memory (shm_open + mmap on Linux/macOS), Windows shared memory (CreateFileMapping + MapViewOfFile). Show .NET MemoryMappedFile for cross-process shared memory: create with CreateOrOpen("MySharedMem", size) in server, open with OpenExisting("MySharedMem") in client. Cover synchronization (shared memory has no sync — use cross-process named Mutex or Semaphore). Show implementing a lock-free SPSC (single-producer single-consumer) ring buffer in shared memory using Interlocked. Measure throughput vs named pipes vs sockets.
```

#### 11.5 Signals
```
Explain Unix signals: asynchronous notifications sent to processes. Common signals: SIGTERM (terminate gracefully), SIGKILL (kill immediately — can't catch or ignore), SIGINT (Ctrl+C — interrupt), SIGHUP (terminal closed, reload config), SIGUSR1/2 (user-defined), SIGCHLD (child process changed state), SIGPIPE (broken pipe). Cover signal handling (signal() / sigaction()) and signal-safe functions (can only call async-signal-safe functions in handler). Show .NET: Console.CancelKeyPress for SIGINT, AppDomain.ProcessExit for SIGTERM/shutdown. Cover PosixSignalRegistration (.NET 6+) for SIGHUP/SIGUSR handlers. Show graceful shutdown pattern.
```

#### 11.6 Unix Domain Sockets
```
Explain Unix Domain Sockets (UDS): socket-like API but uses filesystem path instead of IP:port — faster than loopback TCP (no TCP/IP overhead, no network stack), supports passing file descriptors between processes (fd passing). Types: SOCK_STREAM (reliable, ordered — like TCP), SOCK_DGRAM (like UDP but reliable locally). Show .NET: Socket with AddressFamily.Unix, HttpClient with ConnectCallback to connect to UDS for HTTP, Kestrel listening on UDS endpoint. Use cases: Docker daemon (communicates via /var/run/docker.sock), PostgreSQL local connections, .NET aspire service communication. Show gRPC over UDS in .NET.
```

#### 11.7 Memory-Mapped Files for IPC
```
Show complete IPC pattern using MemoryMappedFile in .NET: server creates named mapping, writes to it; client opens named mapping, reads. Add synchronization via EventWaitHandle or Semaphore (named, cross-process). Show a lock-free notification approach: use a volatile field in shared memory + SpinWait for low-latency signaling. Cover MemoryMappedViewAccessor.Write vs using unsafe pointer via AcquirePointer. Measure latency: shared memory IPC < 1µs vs named pipes ~10µs vs TCP loopback ~50µs. Cover cleanup (disposing both ends, file deletion on Linux when last process closes).
```

#### 11.8 IPC in .NET
```
Practical .NET IPC decision guide: same process (Channel<T>, ConcurrentQueue), parent-child process (anonymous pipes, ProcessStartInfo redirect), any local processes (named pipes, MemoryMappedFile + named sync), local high-throughput (shared memory + Semaphore), cross-machine (gRPC, HTTP, message queue). Show full named pipe example: server reads commands, executes, writes responses. Cover .NET's IPC used internally: dotnet diagnostics protocol (IPC socket on Unix, named pipe on Windows), VS debugger attachment, dotnet-counters/dotnet-trace connecting to target process. Show using gRPC over UDS for typed local IPC.
```

---

### 12. Signals & POSIX

#### 12.1 Unix Signals
```
Comprehensive signal reference: SIGTERM (15 — request termination, default handler exits, catchable), SIGKILL (9 — force kill, uncatchable, use as last resort), SIGINT (2 — Ctrl+C), SIGHUP (1 — hangup/reload config), SIGQUIT (3 — quit with core dump), SIGSEGV (11 — segfault), SIGBUS (7 — bus error), SIGPIPE (13 — broken pipe, EPIPE errno), SIGALRM (14 — timer), SIGUSR1/2 (10/12 — user-defined), SIGCHLD (17 — child state change). Show kill command usage. Cover signal masking (block signals during critical sections). Explain that SIGKILL and SIGSTOP can never be caught or ignored.
```

#### 12.2 Signal Handlers
```
Explain signal handler constraints: signal handlers run asynchronously (interrupts normal execution at any point), so only async-signal-safe functions can be called (write(), but not printf(), malloc(), mutex operations). Explain that this severely limits what you can do in a signal handler — set a volatile flag and check in main loop. Cover self-pipe trick (write to pipe in signal handler, select on read end in main loop — converts async signal to synchronous I/O event). Show .NET's approach: PosixSignalRegistration wraps signal handling safely, runs callback on managed thread (not in signal handler context — .NET handles this complexity).
```

#### 12.3 Graceful Shutdown in .NET
```
Show complete graceful shutdown implementation in .NET: PosixSignalRegistration.Create(PosixSignal.SIGTERM, handler) for containerized apps, Console.CancelKeyPress for SIGINT, IHostedService.StopAsync for Worker/Web apps (IHost.RunAsync handles signals), CancellationToken propagation from host shutdown to all operations. Cover shutdown timeout (DOTNET_SHUTDOWNTIMEOUTSECONDS), drain in-flight requests (ASP.NET Core handles), checkpoint state before exit. Show Kubernetes SIGTERM flow: pod termination → SIGTERM sent → app has terminationGracePeriodSeconds → SIGKILL if not done. Show testing graceful shutdown locally.
```

#### 12.4 POSIX vs Win32 Differences
```
Cover key OS API differences for cross-platform .NET development: paths (/ vs \, Path.Combine handles both, avoid hardcoded separators), case sensitivity (Linux FS is case-sensitive — bugs that hide on Windows), line endings (LF vs CRLF — use Environment.NewLine or explicit handling), file permissions (Unix rwxrwxrwx has no Windows equivalent — platform-conditional code), signals (Unix rich signal set vs Windows limited signal support), process creation (fork+exec vs CreateProcess — Process.Start abstracts), environment variables (case-sensitive on Linux — common misconfiguration bug in containers). Show RuntimeInformation.IsOSPlatform usage.
```

---

### 13. OS-Level Security

#### 13.1 Users, Groups & Permissions
```
Cover Unix permission model: UID/GID, /etc/passwd, /etc/group, file ownership, effective vs real UID. Cover Windows: SID (Security Identifier), user accounts, security principals, NTFS permissions vs share permissions. Show .NET: Environment.UserName, WindowsIdentity.GetCurrent() (Windows), checking if running as root/admin (Unix: UID==0, Windows: IsUserAnAdmin() or WindowsPrincipal.IsInRole). Show setting file permissions from .NET (File.SetUnixFileMode .NET 7+, FileSystemAclExtensions). Cover why running as root/admin is dangerous — principle of least privilege.
```

#### 13.2 Privilege Escalation
```
Explain privilege escalation: gaining higher privileges than originally granted. Horizontal (access another user's resources), vertical (gain admin/root from regular user). Cover setuid bit (run executable with owner's privileges — sudo is setuid root), sudo (run command as root with audit trail), Linux capabilities (fine-grained privileges: CAP_NET_BIND_SERVICE to bind port 80 without root, CAP_SYS_PTRACE for debugging), Windows UAC (User Account Control — prompts for elevation). Show .NET: binding to port 80 on Linux requires CAP_NET_BIND_SERVICE or port redirect. Cover running .NET app as non-root in container (USER directive in Dockerfile).
```

#### 13.3 Linux Capabilities vs Windows Privileges
```
Explain Linux capabilities: divide root privileges into ~40 granular capabilities (CAP_NET_ADMIN, CAP_SYS_ADMIN, CAP_CHOWN, CAP_NET_BIND_SERVICE, etc.), each can be independently granted. Show checking capabilities: /proc/self/status CapEff field. Cover Docker: --cap-add, --cap-drop, capabilities in Kubernetes securityContext. Show .NET Docker pattern: run as non-root, add only needed capabilities. Windows privileges: SeDebugPrivilege, SeCreateSymbolicLinkPrivilege, SeTcbPrivilege — show WindowsIdentity for privilege checking. Cover why dropping all capabilities in containers improves security posture.
```

#### 13.4 Namespaces & Cgroups
```
Explain Linux namespaces: isolation mechanism for containers. PID namespace (process tree isolation — init is PID 1 inside container), Network namespace (separate network stack, interfaces, routing), Mount namespace (separate filesystem view), UTS namespace (separate hostname), IPC namespace (separate shared memory/semaphores), User namespace (map UIDs — run as root inside but unprivileged outside). Cover cgroups v2 (resource limits: CPU bandwidth, memory max, I/O throttle, PIDs limit). Show that Docker = namespaces + cgroups + chroot + security profiles. Explain implications for .NET: GC sees limited memory via cgroup limit, not total RAM.
```

#### 13.5 seccomp
```
Explain seccomp (Secure Computing Mode): kernel feature that filters syscalls a process can make. seccomp-bpf: BPF program evaluates each syscall, can allow/deny/kill/trap. Docker applies default seccomp profile (~300 syscalls allowed, ~64 blocked). Kubernetes allows custom profiles. Cover why seccomp matters: reduces attack surface (if vulnerability in .NET app, attacker can't call dangerous syscalls). Show common blocked syscalls (ptrace, keyctl, kexec_load). Explain that .NET runtime requires a specific set of syscalls — custom seccomp profiles must include them. Cover AppArmor and seccomp interaction in Docker.
```

#### 13.6 SELinux / AppArmor
```
Explain Mandatory Access Control: unlike DAC (owner sets permissions), MAC is system-wide policy enforced by OS even against root. SELinux (Red Hat/CentOS): labels on every file, process, port — policy defines allowed interactions, type enforcement. AppArmor (Ubuntu/Debian): path-based profiles, easier to configure, profiles per application. Cover common issues: .NET app denied permission despite running as correct user — SELinux/AppArmor policy violation. Show ausearch/audit2allow for SELinux troubleshooting. Show aa-status for AppArmor. Docker uses AppArmor profile by default. Most .NET teams encounter SELinux in RHEL/OpenShift deployments.
```

#### 13.7 Least Privilege for .NET Apps
```
Practical least-privilege guide for .NET applications: run as non-root in containers (USER in Dockerfile), use specific UID (not 0), drop all Linux capabilities (--cap-drop=all, add back only needed), use read-only filesystem where possible (--read-only in Docker), set seccomp profile, limit network access. Show .NET-specific considerations: .NET runtime needs /tmp for temp files, needs to read own assemblies, may need specific capabilities. Provide a secure Dockerfile template for .NET. Cover principle of least privilege in code: minimal database permissions, scoped API tokens, short-lived credentials. Show using managed identity instead of credentials in Azure.
```

---

### 14. Containers & the OS

#### 14.1 Docker Uses Linux Primitives
```
Explain Docker is not a VM: Docker uses Linux kernel features directly (namespaces for isolation, cgroups for resource limits, overlay filesystem for layers, chroot for root filesystem isolation). Container = namespaced + cgroup-limited process. Show container startup: create namespaces (unshare) → set up cgroup limits → mount overlay filesystem → exec init process. Contrast with VM: VM has full kernel, hypervisor overhead. Cover why containers start in milliseconds vs VMs in seconds. Explain that .NET in Docker = .NET process + Linux kernel features — no separate kernel, shares host kernel.
```

#### 14.2 Linux Namespaces
```
Explain all 8 Linux namespaces: PID (isolated PID space, PID 1 = container init), Network (own interfaces, routing, iptables), Mount (own filesystem view via bind mounts and overlayfs), UTS (hostname, domainname), IPC (System V IPC, POSIX MQ), User (UID mapping — root inside ≠ root outside), Cgroup (cgroup root isolation), Time (.NET 6+ Linux). Show unshare and nsenter commands. Cover network namespace: how Docker creates veth pair (virtual ethernet), connects to bridge. Show Kubernetes: each pod gets own network namespace (shared across containers in pod). Explain .NET container networking implications: loopback, container IP, service discovery.
```

#### 14.3 Cgroups
```
Explain cgroups v2 (now default in modern Linux): unified hierarchy, resource controllers per cgroup. Key controllers: cpu (weight and max bandwidth), memory (max, swap max, high watermark), io (max read/write rates), pids (max process count). Show that Kubernetes resource limits map to cgroup limits (resources.limits.memory → memory.max, resources.limits.cpu → cpu.max). Critical .NET implication: without DOTNET_GCHeapHardLimit or GC.AddMemoryPressure, .NET GC may not see container memory limit → grows heap until OOM killed. Show DOTNET_GCConserveMemory, container-aware GC (.NET 3+ reads cgroup limits automatically). Demonstrate memory.max enforcement.
```

#### 14.4 OCI Runtime & runc
```
Explain OCI (Open Container Initiative): standard for container image format and runtime. OCI Runtime Spec defines container lifecycle. runc: reference OCI runtime (creates namespaces, sets up cgroups, runs container process). containerd: higher-level daemon managing container lifecycle (used by Kubernetes). Docker = Docker daemon → containerd → runc. Show runc spec (config.json) containing namespace config, cgroup config, mounts, process to run. Cover alternative runtimes: crun (C, faster), gVisor (sandboxed kernel), Kata Containers (lightweight VM). .NET developers need this to understand "why is my container behaving oddly" — runc is where the magic happens.
```

#### 14.5 .NET in Containers
```
Comprehensive .NET container configuration: container-aware GC (automatically detects cgroup memory limit since .NET 3.0 — DOTNET_GCHeapHardLimitPercent to tune), CPU limit awareness (ThreadPool respects CPU quota — DOTNET_PROCESSOR_COUNT or Environment.ProcessorCount reflects quota), memory limits (set 75-80% of pod limit for GC heap, reserve rest for ThreadPool, native memory, overhead). Show recommended Dockerfile: use non-root, multi-stage build, health checks, proper SIGTERM handling. Cover .NET container-specific env vars: DOTNET_RUNNING_IN_CONTAINER=true, ASPNETCORE_URLS, DOTNET_GCConserveMemory. Show resource request vs limit rationale.
```

---

### 15. OS Networking Internals

#### 15.1 Kernel Network Stack
```
Explain kernel network stack layers: socket buffer (sk_buff in Linux) → transport layer (TCP/UDP) → IP layer → network device driver → NIC. Cover TCP state machine in the kernel (LISTEN, SYN_RCVD, ESTABLISHED, CLOSE_WAIT, TIME_WAIT — these are kernel states, shown by netstat/ss). Cover socket buffers: receive buffer (sk_rcvbuf) and send buffer (sk_sndbuf) — flow control. Show that .NET Socket.ReceiveBufferSize and SendBufferSize set these kernel buffers. Explain that async I/O works by: kernel receives data into socket buffer → notifies userspace via epoll/IOCP → .NET reads from buffer.
```

#### 15.2 Socket Syscalls
```
Map Berkeley socket syscalls to .NET operations: socket() → new Socket(), bind() → Socket.Bind(), listen() → Socket.Listen(), accept() → Socket.AcceptAsync(), connect() → Socket.ConnectAsync(), send()/write() → Socket.SendAsync(), recv()/read() → Socket.ReceiveAsync(), close() → Socket.Dispose(), setsockopt() → Socket.SetSocketOption(). Cover getsockname/getpeername for local/remote addresses. Show that TcpClient/TcpListener wrap Socket. Explain that HttpClient ultimately calls these syscalls. Cover that observing a .NET app's syscalls with strace reveals its I/O behavior (useful for debugging).
```

#### 15.3 I/O Multiplexing
```
Explain I/O multiplexing evolution: select (monitor up to 1024 FDs, O(n) scan each call — no scalability), poll (no FD limit, O(n) scan — slightly better), epoll (Linux — O(1) notification, level-triggered and edge-triggered modes, scales to millions of FDs). Show epoll data flow: epoll_create → epoll_ctl(EPOLL_CTL_ADD) for each socket → epoll_wait (blocks, returns ready FDs). Explain edge-triggered vs level-triggered: ET fires once on state change (must drain fully), LT fires while data available (simpler, default). Show that .NET Socket uses edge-triggered epoll internally. Cover kqueue (macOS/BSD equivalent) and IOCP (Windows).
```

#### 15.4 Zero-Copy Networking
```
Explain zero-copy networking: standard path (data: kernel buffer → copy to userspace buffer → copy to kernel socket buffer — 2 copies), zero-copy (data: file → kernel socket buffer directly — 0 copies). Linux sendfile() syscall (file → socket in kernel, bypasses userspace). splice() (pipe → socket). MSG_ZEROCOPY for send (userspace buffer used directly — needs completion notification). Cover .NET: RandomAccess.WriteAsync to send file, SocketTaskExtensions for zero-copy options. Show .NET Kestrel's use of sendfile for static files. Cover when zero-copy matters: high-throughput file serving, video streaming. Measure with strace output.
```

#### 15.5 TCP Tuning
```
Cover kernel TCP parameters relevant for .NET application performance: net.core.somaxconn (listen backlog — default 128, should be 1024-65535 for busy servers), net.ipv4.tcp_max_syn_backlog (SYN queue size), net.core.netdev_max_backlog (NIC queue depth), net.ipv4.tcp_tw_reuse (reuse TIME_WAIT sockets), net.ipv4.ip_local_port_range (ephemeral port range), SO_REUSEPORT (multiple sockets on same port — used by Kestrel for multi-worker), socket buffer sizes (net.core.rmem_max, wmem_max). Show sysctl commands. Cover Kubernetes: can't change kernel params in pods easily (need privileged or sysctl annotations).
```

#### 15.6 Kestrel and the OS Network Stack
```
Explain how ASP.NET Core's Kestrel uses OS networking: SocketTransport (default — uses Socket/SocketAsyncEventArgs → epoll/IOCP), SO_REUSEPORT for multi-listener (each worker thread gets own socket on same port — kernel distributes connections), SocketsHttpHandler connection pooling (multiple persistent connections to same endpoint — connection pool managed above OS sockets), Kestrel backlog tuning (ListenOptions.Backlog maps to listen() second argument). Cover Kestrel's buffer management (uses MemoryPool to avoid allocations per request, PipeReader/PipeWriter for request/response body). Show how one HTTPS request flows from NIC interrupt to C# controller.
```

---

### 16. Performance & Observability

#### 16.1 OS Performance Tools
```
Quick reference for OS performance tools: top/htop (CPU%, memory, load average, per-process), vmstat (memory, swap, I/O, CPU — overall system), iostat (disk I/O throughput and utilization per device), iotop (per-process I/O), nethogs (per-process network), iftop (network interface), free (memory: total, used, buffers/cache, available), df/du (disk usage), lsof (open files/sockets per process), ss/netstat (socket states), dmesg (kernel messages — OOM kills, hardware errors). Show interpreting vmstat output for a .NET app under load. Cover Windows equivalents: Task Manager, Resource Monitor, perfmon.
```

#### 16.2 Linux perf
```
Practical guide to Linux perf for .NET developers: perf stat (hardware counter summary — instructions, cache-misses, branch-misses for a .NET process), perf record (sample CPU at 99Hz — which function is hot), perf report (annotated call graph), perf top (live CPU profiler). Show perf stat on a .NET benchmark to see cache miss rate. Cover that perf needs debug symbols for .NET (export DOTNET_PerfMapEnabled=1 and DOTNET_EnableEventPipe=1, then perf sees .NET method names). Cover CPU flame graph generation (perf record → perf script → stackcollapse → flamegraph.pl). Show memory bandwidth measurement with perf.
```

#### 16.3 strace & ltrace
```
Explain strace (trace syscalls of a running process): attach to running process (strace -p PID), trace from start (strace -f program), count syscalls (strace -c), filter by syscall type (strace -e trace=file), show timing (strace -T). Useful for .NET: seeing which files .NET opens at startup, debugging "file not found" errors in containers, understanding I/O patterns, detecting unexpected network connections. Show interpreting strace output for a .NET File.ReadAllText call (openat → fstat → mmap → read → close). Cover ltrace for library calls. Cover Windows equivalents: Procmon (Process Monitor), API Monitor.
```

#### 16.4 /proc and /sys
```
Explain Linux /proc virtual filesystem: /proc/[pid]/status (process state, memory usage, UID, capabilities), /proc/[pid]/maps (virtual memory layout), /proc/[pid]/fd/ (open file descriptors), /proc/[pid]/net/tcp (socket connections), /proc/cpuinfo (CPU details), /proc/meminfo (memory breakdown), /proc/loadavg (load averages), /proc/sys/ (kernel parameters — tunable via sysctl). Show reading /proc from .NET: File.ReadAllText("/proc/self/status") for memory usage in Linux containers. Cover /sys/fs/cgroup for container resource info. Show how dotnet-counters reads /proc for some metrics.
```

#### 16.5 Flame Graphs
```
Explain flame graphs (Brendan Gregg): visualize CPU profiling call stacks, x-axis = alphabetical stack ordering (not time), y-axis = stack depth, width = proportion of time spent. Wider frame = more CPU. Reading: look for wide frames at top (most time), wide frames at bottom (common ancestors). Generate for .NET: dotnet-trace collect → convert to speedscope/flamegraph format, dotnet-trace with --format Speedscope for browser-based viewer. Cover off-CPU flame graphs (blocking analysis), memory flame graphs (allocation call stacks via BenchmarkDotNet or dotnet-trace). Show a real .NET web service flame graph with hot path identification.
```

#### 16.6 Profiling .NET at OS Level
```
Show profiling .NET applications at OS level: perf + DOTNET_PerfMapEnabled=1 (enable .NET JIT method map for perf), async profiling (dotnet-trace with --clreventlevel=verbose captures async state machine transitions), CPU sampling vs instrumentation trade-offs, profiling in production (dotnet-trace attach, minimal overhead modes). Cover correlating OS-level profiling (perf, strace) with .NET-level profiling (dotnet-trace, Application Insights). Show diagnosing "high CPU but low application work" (context switching, kernel time, GC). Show diagnosing "thread pool starvation" using dotnet-counters + OS thread monitoring.
```

#### 16.7 dotnet Diagnostic Tools
```
Comprehensive guide to .NET diagnostic CLI tools: dotnet-trace (CPU profiling, event collection, --process-id or child process, speedscope/chromium formats), dotnet-counters (live metrics: GC, JIT, ThreadPool, ASP.NET Core request rate, exception rate — monitor and collect modes), dotnet-dump (collect heap dump, analyze with dotnet-dump analyze: dumpheap, gcroot, dumpobj, threads, clrstack), dotnet-gcdump (GC-only heap dump, much smaller — use for memory leak analysis), dotnet-symbol (download debug symbols). Show complete workflows: memory leak investigation, CPU spike analysis, ThreadPool starvation diagnosis.
```

---

### 17. Windows OS Specifics

#### 17.1 Windows Kernel Architecture
```
Explain Windows NT kernel architecture: Hardware Abstraction Layer (HAL), kernel (executive, scheduler, VMM), Executive services (I/O Manager, Process Manager, Memory Manager, Security Reference Monitor, Object Manager), and user-mode subsystems (Win32, POSIX). Cover Windows objects (kernel objects: processes, threads, files, events, mutexes — reference-counted, accessed via handles). Explain WOW64 (32-bit process on 64-bit Windows). Cover kernel mode drivers (can crash entire system — blue screen). Show how .NET runs in Win32 subsystem, calls Win32 API, which calls NT native API. Cover USER vs GDI vs kernel components.
```

#### 17.2 Windows Handles
```
Explain Windows kernel objects and handles: handle = integer index into per-process handle table → kernel object (process, thread, file, event, mutex, semaphore, token). Object reference counted — last handle closed → object destroyed. SafeHandle in .NET wraps Windows handles safely (CriticalFinalizerObject — survives thread aborts, ensures closed on GC). Cover handle leaks (not closing handles → process handle table grows → "too many open files" equivalent). Show dotnet-dump or Sysinternals Handle.exe to find handle leaks in .NET. Cover DuplicateHandle for sharing across processes, CloseHandle equivalent via SafeHandle.Close()/Dispose().
```

#### 17.3 IOCP
```
Explain Windows I/O Completion Ports (IOCP): the most efficient async I/O mechanism on Windows. CreateIoCompletionPort associates file/socket with completion port and creates thread pool. Overlapped I/O (FILE_FLAG_OVERLAPPED): start async operation with OVERLAPPED struct → operation completes → OS posts completion packet to IOCP → thread pool thread wakes and processes it. Cover concurrency parameter (number of threads to run simultaneously — typically = CPU cores). Show that .NET's async I/O, Socket.ReceiveAsync, and ThreadPool all use IOCP on Windows. This is why async .NET scales on Windows — no thread per connection, just completion notifications.
```

#### 17.4 Windows Registry
```
Cover Windows Registry: hierarchical key-value store for OS and application configuration. Hives: HKLM (machine-wide, requires admin), HKCU (current user), HKCR (file associations), HKU (all users), HKCC (hardware profile). Value types: REG_SZ (string), REG_DWORD (32-bit int), REG_QWORD (64-bit), REG_BINARY, REG_MULTI_SZ (multi-string), REG_EXPAND_SZ (string with env var expansion). Show .NET: Microsoft.Win32.Registry class, RegistryKey.OpenBaseKey/OpenSubKey/GetValue/SetValue. Cover when .NET devs encounter registry: Windows Services config, COM registration, WCF, installer settings. Note: containerized .NET rarely uses Registry — prefer environment variables and config files.
```

#### 17.5 Windows Services & .NET Worker Services
```
Show implementing Windows Services with .NET Worker Services: IHostedService (StartAsync/StopAsync lifecycle), BackgroundService (long-running loop with CancellationToken), UseWindowsService() to install as Windows Service (.NET 6+ — uses SC.exe or installer), ServiceController for programmatic service management, EventLog integration. Cover service recovery options (restart on failure), service accounts (LocalSystem vs NetworkService vs dedicated account), interactive services. Compare to Linux systemd services (same code, different host extension: UseSystemd()). Show dotnet publish + sc.exe for deployment. Cover Windows Service debugging (attach to process after start).
```

#### 17.6 ETW
```
Explain ETW (Event Tracing for Windows): high-performance OS-level tracing infrastructure. Providers (kernel, CLR, app), controllers (PerfView, WPR, logman), consumers (real-time or log file). Cover .NET's CLR ETW providers: e2e trace of GC events, JIT events, exceptions, ThreadPool. Show PerfView as the premier .NET ETW tool: GC analysis (GC pause times, allocation stacks), CPU analysis (CPU flame graph), thread time analysis. Cover EventSource in .NET for writing custom ETW events. Show dotnet-trace using ETW on Windows internally. Cover Windows Performance Recorder (WPR) for kernel-level traces.
```

#### 17.7 Windows Job Objects
```
Explain Windows Job Objects: group processes, apply limits to the group. Limits: CPU rate (percentage), memory (working set, virtual), process count, UI restrictions (prevent spawning windows). Cover AssignProcessToJobObject. Job objects used by containers on Windows (HCS — Host Compute Service uses job objects for isolation). Show .NET: no direct Job Object API in BCL — use P/Invoke (CreateJobObject, AssignProcessToJobObject, SetInformationJobObject). Cover job inheritance (child processes automatically join parent's job). Show using Job Objects to implement process resource limits in .NET test harnesses or build systems. Cover that Kubernetes Windows containers use job objects for resource limits.
```

---

### 18. Linux OS Specifics

#### 18.1 Linux Kernel Architecture
```
Explain Linux kernel components: monolithic kernel, kernel subsystems (process scheduler, memory manager, VFS, networking stack, device drivers), loadable kernel modules (extend kernel without reboot), syscall interface (entry point for user processes). Cover kernel version numbering, LTS vs mainline kernels. Explain that .NET's PAL (Platform Abstraction Layer) uses Linux-specific syscalls (epoll, io_uring, clone, futex). Cover /proc/version and uname -r for kernel version. Show that .NET has minimum kernel version requirements. Cover eBPF (programmable kernel extension), kprobes/uprobes for dynamic tracing — increasingly important for .NET observability.
```

#### 18.2 systemd & .NET Services
```
Show running .NET apps as systemd services: .service unit file (ExecStart, User, WorkingDirectory, Environment, Restart=on-failure, RestartSec), UseSystemd() extension (.NET 6+ — integrates with systemd socket activation and watchdog), sd_notify (READY=1, WATCHDOG=1, STOPPING=1 — send status updates to systemd), journald integration (stdout → journal — use structured logging). Cover systemctl enable/start/stop/status/restart/reload, journalctl -u myservice -f (follow logs). Show socket activation: systemd creates socket, passes to .NET on startup — zero-downtime restart. Cover systemd hardening options (PrivateTmp, NoNewPrivileges, MemoryMax).
```

#### 18.3 Linux Process Model
```
Explain Linux process creation: fork() (clone current process, COW memory sharing, copy file descriptors), exec() (replace process image — loads new executable, resets memory, keeps PID), clone() (low-level fork with fine-grained control over what's shared — used to create threads: CLONE_VM + CLONE_FILES + CLONE_SIGHAND = thread). Cover that Linux threads are just processes sharing address space (no distinction in kernel — both are "tasks"). Show vfork() (optimization: child shares parent's address space until exec, parent blocks). Explain wait()/waitpid() for reaping. Show how .NET's Process.Start uses fork+exec on Linux and how this affects COW memory.
```

#### 18.4 Linux Memory Model
```
Cover Linux memory management syscalls: mmap() (map file or anonymous memory into address space — used for GC heap, mmapped files, shared memory), brk()/sbrk() (extend heap segment — used by malloc, less by .NET), madvise() (hint OS about memory usage: MADV_SEQUENTIAL, MADV_RANDOM, MADV_FREE, MADV_DONTNEED — return pages to OS without unmapping), mprotect() (change page permissions), msync() (flush mmap'd file changes to disk), munmap(). Show that .NET GC uses mmap for heap segments and madvise(MADV_FREE) to release unused pages back to OS. Cover MADV_HUGEPAGE for transparent huge pages.
```

#### 18.5 File Descriptor Limits & ulimit
```
Explain Linux FD limits: soft limit (current limit — can be raised up to hard limit by user), hard limit (ceiling — only root can raise). Default soft limit = 1024 (too low for busy servers). Show ulimit -n (show/set), /etc/security/limits.conf (persistent per-user), /proc/sys/fs/file-max (system-wide total). Show common error: "Too many open files" (EMFILE). Fix: ulimit -n 65536 in shell, or systemd LimitNOFILE=65536 in .service. Docker: --ulimit nofile=65536:65536. Cover FD leak detection: ls /proc/pid/fd | wc -l. Show .NET: unclosed FileStream, HttpClient, Socket → FD leak. Monitor with dotnet-counters (process.runtime.dotnet.file.descriptors).
```

#### 18.6 Linux Network Tuning for .NET
```
Cover Linux kernel network parameters for high-throughput .NET applications: net.core.somaxconn (listen backlog — set 65535 for Kestrel), net.ipv4.ip_local_port_range (ephemeral ports — 1024-65535 for many outgoing connections), net.ipv4.tcp_tw_reuse=1 (reuse TIME_WAIT sockets for outgoing connections), net.ipv4.tcp_fin_timeout=15 (reduce TIME_WAIT duration), net.core.rmem_max/wmem_max (socket buffer maximums — set 16MB for high-throughput), net.ipv4.tcp_slow_start_after_idle=0 (don't reduce CWND after idle — good for persistent HTTP/2 connections). Show sysctl.conf for persistence. Cover Kubernetes: sysctl annotations for pod-level settings.
```

#### 18.7 eBPF
```
Explain eBPF (extended Berkeley Packet Filter): programmable kernel subsystem. BPF programs run in a kernel sandbox (verified by JIT, safe — can't crash kernel), attached to tracepoints, kprobes, uprobes, network hooks. Tools: bcc (Python wrappers for BPF programs), bpftrace (high-level tracing language), Cilium (Kubernetes network policy via eBPF). .NET relevance: Pixie (eBPF-based .NET observability without instrumentation — traces HTTP, gRPC without code changes), continuous profiling with Parca/Pyroscope using eBPF. Cover attaching to .NET CLR uprobes. Show why eBPF is the future of production observability for .NET — zero-instrumentation performance profiling.
```

---

## Quick Reference: OS Concepts → .NET APIs

| OS Concept | .NET API / Mechanism |
|---|---|
| Process | `System.Diagnostics.Process` |
| Thread | `System.Threading.Thread` |
| Thread Pool | `System.Threading.ThreadPool`, `Task.Run` |
| Async I/O (IOCP/epoll) | `async/await`, `Socket.ReceiveAsync` |
| File Descriptor | `SafeFileHandle`, `FileStream` |
| Memory-Mapped File | `System.IO.MemoryMappedFiles.MemoryMappedFile` |
| Named Pipe | `System.IO.Pipes.NamedPipeServerStream` |
| Anonymous Pipe | `System.IO.Pipes.AnonymousPipeServerStream` |
| Mutex (cross-process) | `System.Threading.Mutex` |
| Semaphore (in-process) | `System.Threading.SemaphoreSlim` |
| Condition Variable | `System.Threading.Monitor.Wait/Pulse` |
| Read-Write Lock | `System.Threading.ReaderWriterLockSlim` |
| Signal (SIGTERM) | `System.Runtime.InteropServices.PosixSignalRegistration` |
| Graceful Shutdown | `IHostedService.StopAsync`, `IHostApplicationLifetime` |
| Shared Memory | `MemoryMappedFile.CreateOrOpen` |
| Unix Domain Socket | `Socket(AddressFamily.Unix, ...)` |
| Spin Wait | `System.Threading.SpinWait`, `System.Threading.SpinLock` |
| Atomic Operations | `System.Threading.Interlocked` |
| volatile memory order | `System.Threading.Volatile.Read/Write` |
| OS Platform Check | `System.Runtime.InteropServices.RuntimeInformation` |
| CPU/Memory Info | `System.Environment.ProcessorCount`, `GC.GetGCMemoryInfo()` |
| Process Memory | `Process.WorkingSet64`, `Process.VirtualMemorySize64` |
| ETW Events | `System.Diagnostics.Tracing.EventSource` |
| Performance Counters | `System.Diagnostics.PerformanceCounter` (Windows) |

---

*Version 1.0 — .NET 8 / Linux Kernel 6.x / Windows Server 2022*