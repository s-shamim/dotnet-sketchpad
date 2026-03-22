# Computer Systems for .NET Developers
## Bits, Bytes, Data Representation & Computer Architecture

> **How to use this document:** Each section contains a *prompt* you can paste into an AI assistant (or ask me directly) to generate the full content for that topic. Topics progress from the ground up — binary foundations → data types → memory → CPU → .NET runtime internals.

---

## Table of Contents

1. [Binary & Number Systems](#1-binary--number-systems)
   - 1.1 [Why Computers Use Binary](#11-why-computers-use-binary)
   - 1.2 [Binary (Base-2) — Structure and Counting](#12-binary-base-2)
   - 1.3 [Octal (Base-8) — Usage and Conversion](#13-octal-base-8)
   - 1.4 [Hexadecimal (Base-16) — The Developer's Base](#14-hexadecimal-base-16)
   - 1.5 [Converting Between Bases — Algorithms and Shortcuts](#15-converting-between-bases)
   - 1.6 [Number Base Arithmetic (Adding, Subtracting in Binary/Hex)](#16-number-base-arithmetic)
   - 1.7 [Number Bases in .NET (`Convert`, `ToString`, `Parse` with radix)](#17-number-bases-in-net)

2. [Bits, Bytes & Data Units](#2-bits-bytes--data-units)
   - 2.1 [Bit, Nibble, Byte — Definitions and Origins](#21-bit-nibble-byte)
   - 2.2 [SI vs Binary Prefixes (KB vs KiB, MB vs MiB)](#22-si-vs-binary-prefixes)
   - 2.3 [Data Size Reference — From Bits to Petabytes](#23-data-size-reference)
   - 2.4 [Bit Ordering — MSB vs LSB](#24-bit-ordering-msb-vs-lsb)
   - 2.5 [Byte Ordering — Endianness (Big-Endian vs Little-Endian)](#25-endianness)
   - 2.6 [Endianness in .NET (`BinaryPrimitives`, `BitConverter`)](#26-endianness-in-net)

3. [Logic Gates & Boolean Algebra](#3-logic-gates--boolean-algebra)
   - 3.1 [Boolean Algebra — Laws and Identities](#31-boolean-algebra)
   - 3.2 [Logic Gates — AND, OR, NOT, XOR, NAND, NOR, XNOR](#32-logic-gates)
   - 3.3 [Truth Tables and Circuit Diagrams](#33-truth-tables)
   - 3.4 [Boolean Algebra in Code — Bitwise Operations in .NET](#34-bitwise-operations-in-net)
   - 3.5 [Practical Uses of XOR (Swapping, Encryption, Checksums)](#35-practical-uses-of-xor)
   - 3.6 [De Morgan's Laws and Simplification](#36-de-morgans-laws)

4. [Bitwise Operations in .NET](#4-bitwise-operations-in-net)
   - 4.1 [AND (`&`) — Masking and Clearing Bits](#41-and-masking)
   - 4.2 [OR (`|`) — Setting Bits](#42-or-setting-bits)
   - 4.3 [XOR (`^`) — Toggling and Comparing Bits](#43-xor-toggling)
   - 4.4 [NOT (`~`) — Complement and Inversion](#44-not-complement)
   - 4.5 [Left Shift (`<<`) — Multiplication by Powers of 2](#45-left-shift)
   - 4.6 [Right Shift (`>>`) — Division and Sign Extension](#46-right-shift)
   - 4.7 [Unsigned Right Shift (`>>>`) in C# 11+](#47-unsigned-right-shift)
   - 4.8 [Bit Manipulation Patterns and Tricks](#48-bit-manipulation-patterns)
   - 4.9 [Bit Manipulation with `System.Numerics.BitOperations`](#49-bitoperations-in-net)

5. [Integer Representation](#5-integer-representation)
   - 5.1 [Unsigned Integers — Range and Overflow](#51-unsigned-integers)
   - 5.2 [Sign-Magnitude Representation — Why It's Problematic](#52-sign-magnitude)
   - 5.3 [One's Complement — History and Limitations](#53-ones-complement)
   - 5.4 [Two's Complement — The Universal Standard](#54-twos-complement)
   - 5.5 [Two's Complement Arithmetic — Addition, Subtraction, Negation](#55-twos-complement-arithmetic)
   - 5.6 [Integer Overflow — Behavior and Consequences](#56-integer-overflow)
   - 5.7 [Integer Types in .NET (`byte`, `short`, `int`, `long`, `nint`)](#57-integer-types-in-net)
   - 5.8 [Checked vs Unchecked Arithmetic in C#](#58-checked-unchecked)
   - 5.9 [`BigInteger` — Arbitrary Precision in .NET](#59-biginteger)

6. [Floating-Point Representation](#6-floating-point-representation)
   - 6.1 [Why Floating-Point is Hard — The Core Problem](#61-why-floating-point-is-hard)
   - 6.2 [IEEE 754 Standard — Single (32-bit) and Double (64-bit)](#62-ieee-754)
   - 6.3 [Anatomy of a Float — Sign, Exponent, Mantissa (Fraction)](#63-anatomy-of-a-float)
   - 6.4 [Special Values — NaN, Infinity, Negative Zero, Subnormals](#64-special-values)
   - 6.5 [Floating-Point Precision Errors — Why `0.1 + 0.2 != 0.3`](#65-precision-errors)
   - 6.6 [Catastrophic Cancellation and Rounding Modes](#66-catastrophic-cancellation)
   - 6.7 [`float`, `double`, and `decimal` in .NET — When to Use Which](#67-float-double-decimal-net)
   - 6.8 [`Half` — 16-bit Float in .NET 6+](#68-half-in-net)
   - 6.9 [Comparing Floats Correctly in C# (Epsilon, Relative Tolerance)](#69-comparing-floats)
   - 6.10 [`BitConverter` and `Unsafe` for Float Bit Manipulation in .NET](#610-float-bit-manipulation)

7. [Fixed-Point & Decimal Arithmetic](#7-fixed-point--decimal-arithmetic)
   - 7.1 [Fixed-Point Numbers — Concept and Use Cases](#71-fixed-point-numbers)
   - 7.2 [The `decimal` Type in .NET — Internal Representation](#72-decimal-in-net)
   - 7.3 [Why `decimal` for Money — Avoiding Float Errors](#73-decimal-for-money)
   - 7.4 [Rounding Modes in .NET (`MidpointRounding`)](#74-rounding-modes)
   - 7.5 [Arbitrary Precision Decimal Libraries](#75-arbitrary-precision-decimal)

8. [Character Encoding](#8-character-encoding)
   - 8.1 [ASCII — The 7-Bit Foundation](#81-ascii)
   - 8.2 [Extended ASCII and Code Pages — The Chaos Before Unicode](#82-extended-ascii)
   - 8.3 [Unicode — Code Points, Planes, and the BMP](#83-unicode)
   - 8.4 [UTF-8 — Variable-Length Encoding, Byte Structure](#84-utf-8)
   - 8.5 [UTF-16 — Surrogate Pairs and the .NET String Format](#85-utf-16)
   - 8.6 [UTF-32 — Fixed-Width, Rarely Used](#86-utf-32)
   - 8.7 [BOM (Byte Order Mark) — Purpose and Problems](#87-bom)
   - 8.8 [Normalization Forms (NFC, NFD, NFKC, NFKD)](#88-normalization-forms)
   - 8.9 [String Encoding in .NET (`System.Text.Encoding`)](#89-encoding-in-net)
   - 8.10 [`Rune`, `char`, and `string` in .NET — Unicode Correctness](#810-rune-char-string)
   - 8.11 [Encoding Pitfalls — Mojibake, Replacement Characters, Truncation](#811-encoding-pitfalls)

9. [Binary Encoding Schemes](#9-binary-encoding-schemes)
   - 9.1 [Why Binary-to-Text Encoding Exists](#91-why-binary-to-text-encoding)
   - 9.2 [Base64 — Algorithm, Alphabet, and Padding](#92-base64)
   - 9.3 [Base64 URL-Safe Variant](#93-base64-url-safe)
   - 9.4 [Base32 — Use Cases (TOTP, human-readable IDs)](#94-base32)
   - 9.5 [Base16 / Hex Encoding](#95-base16-hex)
   - 9.6 [Base85 / Ascii85](#96-base85)
   - 9.7 [Base64 in .NET (`Convert.ToBase64String`, `Base64Url`)](#97-base64-in-net)
   - 9.8 [Streaming Base64 with `System.Buffers.Text.Base64`](#98-streaming-base64)
   - 9.9 [Common Base64 Mistakes (Padding, URL-safe confusion, double-encoding)](#99-base64-mistakes)

10. [Data Serialization Formats](#10-data-serialization-formats)
    - 10.1 [Text vs Binary Serialization — Trade-offs](#101-text-vs-binary)
    - 10.2 [JSON — Structure, Encoding Rules, and Unicode Escaping](#102-json)
    - 10.3 [XML — Structure and Encoding Declarations](#103-xml)
    - 10.4 [Protocol Buffers (Protobuf) — Binary Wire Format](#104-protobuf)
    - 10.5 [MessagePack — Compact Binary JSON Alternative](#105-messagepack)
    - 10.6 [CBOR — Concise Binary Object Representation](#106-cbor)
    - 10.7 [Avro and Parquet — Data Pipeline Formats](#107-avro-parquet)
    - 10.8 [Serialization in .NET (`System.Text.Json`, `XmlSerializer`, `BinaryFormatter`)](#108-serialization-in-net)
    - 10.9 [Custom Binary Serialization with `BinaryPrimitives` and `Span<T>`](#109-custom-binary-serialization)

11. [Memory Layout & Management](#11-memory-layout--management)
    - 11.1 [The Memory Hierarchy — Registers, Cache, RAM, Disk](#111-memory-hierarchy)
    - 11.2 [Stack vs Heap — What Lives Where and Why](#112-stack-vs-heap)
    - 11.3 [Value Types vs Reference Types in .NET](#113-value-types-vs-reference-types)
    - 11.4 [Struct Layout and Field Alignment (Padding and Packing)](#114-struct-layout)
    - 11.5 [`StructLayout` Attribute in .NET — Explicit, Sequential, Auto](#115-structlayout)
    - 11.6 [Object Header and Method Table — How .NET Objects Look in Memory](#116-object-header)
    - 11.7 [Boxing and Unboxing — The Hidden Allocation](#117-boxing-unboxing)
    - 11.8 [Memory-Mapped Files in .NET](#118-memory-mapped-files)
    - 11.9 [Pointers and `unsafe` Code in C#](#119-unsafe-code)
    - 11.10 [`sizeof`, `Marshal.SizeOf`, and `Unsafe.SizeOf` — Measuring Type Sizes](#1110-sizeof)

12. [Pointers & Memory Addressing](#12-pointers--memory-addressing)
    - 12.1 [Virtual Memory — Address Spaces and Pages](#121-virtual-memory)
    - 12.2 [Pointers — What They Are, Arithmetic, Dereferencing](#122-pointers)
    - 12.3 [Null Pointers and Null References](#123-null-pointers)
    - 12.4 [`ref`, `out`, `in` — Managed References in C#](#124-ref-out-in)
    - 12.5 [`ref struct` and Stack-Only Types](#125-ref-struct)
    - 12.6 [`Span<T>` and `Memory<T>` — Safe Pointer Abstractions](#126-span-memory)
    - 12.7 [`unsafe` Pointers, `fixed` Statement, and Pinning in .NET](#127-unsafe-pointers)
    - 12.8 [`NativeMemory` — Allocating Unmanaged Memory in .NET 6+](#128-nativememory)
    - 12.9 [Interop with Native Code — `Marshal`, `DllImport`, `LibraryImport`](#129-interop)

13. [The .NET Memory Model & Garbage Collector](#13-net-memory-model--garbage-collector)
    - 13.1 [.NET Memory Regions — Small Object Heap, Large Object Heap, POH](#131-net-memory-regions)
    - 13.2 [Garbage Collection — Mark, Sweep, and Compact](#132-garbage-collection)
    - 13.3 [GC Generations (Gen0, Gen1, Gen2) and the Generational Hypothesis](#133-gc-generations)
    - 13.4 [Finalizers and `IDisposable` — Deterministic Cleanup](#134-finalizers-idisposable)
    - 13.5 [The `Dispose` Pattern and `using` Statements](#135-dispose-pattern)
    - 13.6 [Weak References and `WeakReference<T>`](#136-weak-references)
    - 13.7 [GC Pressure — What Causes It and How to Reduce It](#137-gc-pressure)
    - 13.8 [Server GC vs Workstation GC](#138-server-vs-workstation-gc)
    - 13.9 [Pinned Object Heap (POH) in .NET 5+](#139-pinned-object-heap)
    - 13.10 [GC Diagnostics — `dotnet-counters`, `dotnet-dump`, PerfView](#1310-gc-diagnostics)

14. [CPU Architecture Essentials](#14-cpu-architecture-essentials)
    - 14.1 [CPU Components — ALU, Registers, Control Unit, Cache](#141-cpu-components)
    - 14.2 [Instruction Set Architecture (ISA) — x86-64 vs ARM64](#142-isa)
    - 14.3 [Registers — General Purpose, Flags, Instruction Pointer](#143-registers)
    - 14.4 [The Fetch-Decode-Execute Cycle](#144-fetch-decode-execute)
    - 14.5 [CPU Pipelining — Stages and Hazards](#145-cpu-pipelining)
    - 14.6 [Branch Prediction — How It Works and Why It Matters](#146-branch-prediction)
    - 14.7 [Out-of-Order Execution and Speculative Execution](#147-out-of-order-execution)
    - 14.8 [SIMD — Single Instruction, Multiple Data](#148-simd)
    - 14.9 [SIMD in .NET (`System.Runtime.Intrinsics`, `Vector<T>`, `Vector256<T>`)](#149-simd-in-net)

15. [CPU Caches & Memory Performance](#15-cpu-caches--memory-performance)
    - 15.1 [Cache Hierarchy — L1, L2, L3 and Latency Numbers](#151-cache-hierarchy)
    - 15.2 [Cache Lines — Size, Loading, and the Spatial Locality Principle](#152-cache-lines)
    - 15.3 [Cache Associativity — Direct-Mapped, Set-Associative, Fully Associative](#153-cache-associativity)
    - 15.4 [Cache Misses — Cold, Capacity, Conflict](#154-cache-misses)
    - 15.5 [False Sharing — The Hidden Performance Killer in Concurrent Code](#155-false-sharing)
    - 15.6 [Data-Oriented Design — Cache-Friendly Code in .NET](#156-data-oriented-design)
    - 15.7 [Prefetching and Hardware vs Software Prefetch](#157-prefetching)
    - 15.8 [Measuring Cache Performance in .NET (BenchmarkDotNet, hardware counters)](#158-measuring-cache-performance)

16. [Memory Ordering & Concurrency at the Hardware Level](#16-memory-ordering--concurrency)
    - 16.1 [CPU Memory Reordering — Why It Happens](#161-cpu-memory-reordering)
    - 16.2 [Memory Barriers / Fences — Acquire, Release, Full Fence](#162-memory-barriers)
    - 16.3 [The .NET Memory Model — What is Guaranteed](#163-net-memory-model)
    - 16.4 [`volatile` in C# — What It Does and Doesn't Do](#164-volatile-in-csharp)
    - 16.5 [`Interlocked` — Atomic Operations in .NET](#165-interlocked)
    - 16.6 [`Unsafe` and `Volatile.Read` / `Volatile.Write`](#166-volatile-read-write)
    - 16.7 [Lock-Free Data Structures and the ABA Problem](#167-lock-free)
    - 16.8 [MESI Cache Coherence Protocol](#168-mesi-protocol)

17. [Instruction-Level & JIT Details in .NET](#17-instruction-level--jit-details)
    - 17.1 [How .NET Executes Code — IL → JIT → Native](#171-il-to-jit)
    - 17.2 [Common Intermediate Language (CIL/IL) — Reading IL Code](#172-reading-il)
    - 17.3 [JIT Compilation — Tiered Compilation (Tier 0, Tier 1, Tier 2)](#173-tiered-compilation)
    - 17.4 [AOT Compilation — Native AOT in .NET 7+](#174-native-aot)
    - 17.5 [JIT Optimizations — Inlining, Loop Unrolling, Dead Code Elimination](#175-jit-optimizations)
    - 17.6 [Reading Disassembly — SharpLab and Disasmo](#176-reading-disassembly)
    - 17.7 [Method Inlining — Rules and `[MethodImpl]` Hints](#177-method-inlining)
    - 17.8 [Stack Frame Layout and Calling Conventions](#178-stack-frames)

18. [Bit Fields, Flags & Packed Data](#18-bit-fields-flags--packed-data)
    - 18.1 [Bit Fields — Packing Multiple Values into One Integer](#181-bit-fields)
    - 18.2 [Enum Flags in C# — `[Flags]` Attribute and Bitwise Enum Operations](#182-enum-flags)
    - 18.3 [Packed Pixel Formats (ARGB, RGB565) — Reading and Writing](#183-packed-pixel-formats)
    - 18.4 [Binary Protocols — Parsing Fixed-Width Binary Frames](#184-binary-protocols)
    - 18.5 [Network Byte Order and `IPAddress.NetworkToHostOrder`](#185-network-byte-order)
    - 18.6 [`BitArray` in .NET — Collections of Bits](#186-bitarray)
    - 18.7 [Custom Bit-Packed Structs with `StructLayout` and `BitConverter`](#187-bit-packed-structs)

19. [Hashing & Checksums at the Bit Level](#19-hashing--checksums-at-the-bit-level)
    - 19.1 [What Makes a Good Hash Function — Avalanche, Distribution](#191-hash-function-properties)
    - 19.2 [CRC (Cyclic Redundancy Check) — Algorithm and Uses](#192-crc)
    - 19.3 [Checksum Algorithms (Adler-32, Fletcher)](#193-checksum-algorithms)
    - 19.4 [Non-Cryptographic Hashes (xxHash, MurmurHash, FNV)](#194-non-crypto-hashes)
    - 19.5 [`GetHashCode()` in .NET — Contract, Pitfalls, and Custom Implementations](#195-gethashcode)
    - 19.6 [`HashCode` Struct in .NET — Building Composite Hash Codes](#196-hashcode-struct)
    - 19.7 [Hashing with `System.IO.Hashing` (xxHash32, xxHash64, Crc32)](#197-systemio-hashing)

20. [Compression](#20-compression)
    - 20.1 [Compression Fundamentals — Entropy, Lossless vs Lossy](#201-compression-fundamentals)
    - 20.2 [Run-Length Encoding (RLE) — Simplest Compression](#202-rle)
    - 20.3 [Huffman Coding — Frequency-Based Variable-Length Codes](#203-huffman-coding)
    - 20.4 [LZ77 / LZ78 / LZW — Dictionary-Based Compression](#204-lz-compression)
    - 20.5 [Deflate, Zlib, and Gzip — Layered Compression Standards](#205-deflate-gzip)
    - 20.6 [Brotli — Modern Web Compression](#206-brotli)
    - 20.7 [LZ4, Zstandard (zstd) — High-Speed Compression](#207-lz4-zstd)
    - 20.8 [Compression in .NET (`GZipStream`, `BrotliStream`, `ZLibStream`)](#208-compression-in-net)
    - 20.9 [When to Compress — Trade-offs of CPU vs Bandwidth](#209-when-to-compress)

21. [Error Detection & Correction](#21-error-detection--correction)
    - 21.1 [Why Errors Happen — Bit Flips, Noise, Cosmic Rays](#211-why-errors-happen)
    - 21.2 [Parity Bits — Simple Single-Bit Error Detection](#212-parity-bits)
    - 21.3 [Hamming Code — Single-Error Correction, Double-Error Detection](#213-hamming-code)
    - 21.4 [CRC — Burst Error Detection](#214-crc-error-detection)
    - 21.5 [Reed-Solomon Codes — CD/DVD/QR Code Error Correction](#215-reed-solomon)
    - 21.6 [LDPC and Turbo Codes — Modern FEC](#216-ldpc-turbo)
    - 21.7 [ECC Memory and Storage Checksums (ZFS, RAID)](#217-ecc-memory)
    - 21.8 [Checksums and Hashes for Data Integrity in .NET](#218-integrity-in-net)

22. [Data Structures at the Memory Level](#22-data-structures-at-the-memory-level)
    - 22.1 [Arrays — Contiguous Memory, Cache Performance, and Bounds Checking](#221-arrays)
    - 22.2 [Linked Lists — Pointer Chasing and Cache Unfriendliness](#222-linked-lists)
    - 22.3 [Hash Tables — Buckets, Load Factor, Open vs Closed Addressing](#223-hash-tables)
    - 22.4 [Trees — BST, AVL, Red-Black, B-Trees (used in databases)](#224-trees)
    - 22.5 [Memory Layout of .NET Collections (`List<T>`, `Dictionary<T,K>`, `Stack<T>`)](#225-net-collections-memory)
    - 22.6 [Struct-of-Arrays vs Array-of-Structs — Cache Implications](#226-soa-vs-aos)
    - 22.7 [`ArrayPool<T>` and `MemoryPool<T>` — Avoiding Allocations](#227-array-pool)
    - 22.8 [`Span<T>` and `Memory<T>` as Zero-Copy Data Views](#228-span-memory-views)

23. [Text Processing at the Byte Level](#23-text-processing-at-the-byte-level)
    - 23.1 [String Internals in .NET — `string` as UTF-16 Array](#231-string-internals)
    - 23.2 [String Interning in .NET](#232-string-interning)
    - 23.3 [`ReadOnlySpan<char>` — Zero-Allocation String Processing](#233-readonlyspan-char)
    - 23.4 [`StringBuilder` vs String Concatenation — Allocation Patterns](#234-stringbuilder)
    - 23.5 [Searching Bytes — `IndexOf`, `SequenceEqual` with Spans](#235-searching-bytes)
    - 23.6 [Parsing Binary Data — `BinaryPrimitives` and `BitConverter`](#236-parsing-binary-data)
    - 23.7 [Writing a Binary Protocol Parser in .NET with `Span<T>`](#237-binary-protocol-parser)
    - 23.8 [Text Encoding Conversion — `Encoding.Convert` and `TranscodingStream`](#238-text-encoding-conversion)

24. [Performance & Low-Level Optimization in .NET](#24-performance--low-level-optimization)
    - 24.1 [Measure First — Profiling Tools (dotnet-trace, PerfView, Rider Profiler)](#241-profiling-tools)
    - 24.2 [Allocation-Free Code — Techniques and Patterns](#242-allocation-free-code)
    - 24.3 [Value Types vs Reference Types for Performance](#243-value-vs-reference-performance)
    - 24.4 [`stackalloc` — Stack Allocation for Small Buffers](#244-stackalloc)
    - 24.5 [Inlining, Devirtualization, and JIT Hints (`AggressiveInlining`)](#245-jit-hints)
    - 24.6 [SIMD Vectorization in .NET — Auto-Vectorization and Manual](#246-simd-vectorization)
    - 24.7 [Benchmarking with BenchmarkDotNet — Memory Diagnoser, Hardware Counters](#247-benchmarkdotnet)
    - 24.8 [Writing Cache-Friendly .NET Code](#248-cache-friendly-code)
    - 24.9 [Reducing GC Pressure — Object Pooling, Struct Tuning, Spans](#249-reducing-gc-pressure)
    - 24.10 [`System.Runtime.CompilerServices.Unsafe` — When and How to Use It](#2410-unsafe-compilerservices)

25. [Interoperability & Platform Considerations](#25-interoperability--platform-considerations)
    - 25.1 [P/Invoke — Calling Native Libraries from .NET](#251-pinvoke)
    - 25.2 [COM Interop in .NET](#252-com-interop)
    - 25.3 [Platform-Specific Data Sizes (`nint`, `nuint`, pointer size)](#253-platform-data-sizes)
    - 25.4 [Cross-Platform Endianness Handling in .NET](#254-cross-platform-endianness)
    - 25.5 [Working with C Structs from .NET — `Marshal` and Blittable Types](#255-blittable-types)
    - 25.6 [Memory Alignment Requirements — `[StructLayout(Pack=1)]` and SIMD Alignment](#256-memory-alignment)
    - 25.7 [`IMemoryOwner<T>` and Native Memory Interop in .NET 6+](#257-imemoryowner)

---

## Section Prompts

> Copy any prompt below and send it to generate the full content for that section.

---

### 1. Binary & Number Systems

#### 1.1 Why Computers Use Binary
```
Explain why computers use binary (base-2) rather than decimal or other bases. Cover the physical reason (transistors as switches — two stable states), why binary is noise-resistant (voltage thresholds), a brief history of analog vs digital computing, and why other bases like base-10 or base-3 were explored but abandoned. Explain what "digital" means. Connect this to what a .NET developer sees: all data in memory is ultimately bits, and understanding binary unlocks understanding of integers, floats, encoding, and bitwise operations.
```

#### 1.2 Binary (Base-2)
```
Teach binary from scratch: positional notation (each position is a power of 2), counting in binary, converting decimal to binary (division algorithm) and binary to decimal (sum of powers of 2). Show binary representations for 0–15 as a reference table. Explain why binary numbers get long quickly and why hex is used as a shorthand. Include exercises. Show .NET examples using Convert.ToString(n, 2) and Convert.ToInt32("1011", 2).
```

#### 1.3 Octal (Base-8)
```
Explain octal (base-8): digit set (0–7), positional notation (powers of 8), conversion between octal and binary (3 bits per octal digit), and conversion to/from decimal. Cover where octal appears in practice: Unix file permissions (chmod 755), some legacy systems, and C/C++ literals (0755). Show how to work with octal in .NET using Convert.ToString(n, 8) and Convert.ToInt32("755", 8). Explain why octal is less common than hex today.
```

#### 1.4 Hexadecimal (Base-16)
```
Teach hexadecimal (base-16): the digit set (0–9, A–F), why hex is a natural fit for binary (4 bits per hex digit), conversions between hex, binary, and decimal. Include a conversion table for 0x0–0xF. Cover where hex appears in practice for .NET developers: memory addresses, color codes (#RRGGBB), hash outputs, GUIDs, byte arrays in debuggers, and hex literals in C# (0x1A2B). Show .NET examples: Convert, ToString("X2"), string.Format, $"{value:X}".
```

#### 1.5 Converting Between Bases
```
Provide algorithms for converting between any pair of bases: decimal↔binary, decimal↔hex, binary↔hex (the fast way — group 4 bits), hex↔octal (via binary). Include worked examples for each. Cover signed number conversion (handle two's complement). Show shortcut patterns developers use mentally (e.g., 0xFF = 255, 0x80 = 128, 0x10 = 16). Provide a .NET utility covering all conversions. Include a table of commonly useful values (powers of 2 from 2^0 to 2^32, hex equivalents).
```

#### 1.6 Number Base Arithmetic
```
Show how to add, subtract, and multiply in binary and hexadecimal with carry/borrow. Include worked examples side-by-side with decimal equivalents. Explain why binary addition is the basis of all CPU arithmetic. Cover overflow in binary addition (what happens when the result doesn't fit). Explain hex addition as used in hash computation and checksum mental arithmetic. Show how C# integer arithmetic maps to these operations at the hardware level.
```

#### 1.7 Number Bases in .NET
```
Comprehensive guide to base conversions in .NET: Convert.ToString(int, int) for binary/octal/hex output, Convert.ToInt32(string, int) for parsing, the "X", "x", "B" (binary in .NET 8) format specifiers, parsing hex strings with int.Parse("FF", NumberStyles.HexNumber), formatting byte arrays as hex strings efficiently, and the new Convert.ToHexString() / Convert.FromHexString() in .NET 5+. Show all common patterns with complete code. Include a comparison of performance approaches for hex encoding.
```

---

### 2. Bits, Bytes & Data Units

#### 2.1 Bit, Nibble, Byte
```
Define bit (binary digit), nibble (4 bits — one hex digit), and byte (8 bits). Explain the origin of "byte" (coined at IBM), why 8 bits became the standard, and what historical systems used different word sizes. Explain a "word" (native integer size of CPU — 16/32/64 bit). Cover the relationship between nibbles and hex digits. Show how .NET's primitive types map to byte counts (byte = 1, short = 2, int = 4, long = 8). Include a visual of one byte showing all 8 bit positions with MSB/LSB labels.
```

#### 2.2 SI vs Binary Prefixes
```
Explain the confusion between SI prefixes and binary prefixes: kilobyte (KB) = 1000 bytes (SI) vs kibibyte (KiB) = 1024 bytes (IEC), and why this matters (Windows reports disk sizes in binary, drives are sold in decimal, creating apparent "missing" space). Cover the full prefix table: kilo/kibi, mega/mebi, giga/gibi, tera/tebi, peta/pebi. Show real-world examples of the discrepancy. Show how to format byte sizes with correct prefixes in .NET.
```

#### 2.3 Data Size Reference
```
Create a comprehensive data size reference table from bits to petabytes with both binary and decimal definitions, approximate equivalents (e.g., "1 MB ≈ a 1-minute MP3"), and real-world size examples (a tweet, a photo, a movie, a hard drive). Include sizes relevant to .NET developers: pointer size (4 or 8 bytes), int (4), long (8), GUID (16), SHA-256 hash (32), typical stack size (1MB), typical L1 cache (32KB), typical L3 cache (8MB). Explain why these sizes matter for performance.
```

#### 2.4 Bit Ordering — MSB vs LSB
```
Explain bit ordering: Most Significant Bit (MSB) and Least Significant Bit (LSB), bit numbering conventions (bit 0 = LSB or MSB depending on context — clarify both). Cover LSB-first vs MSB-first bit transmission in serial protocols (UART, SPI, USB). Explain how bit ordering interacts with byte ordering (endianness is separate from bit ordering). Show how bit position affects bitwise operations in .NET. Include diagrams of a byte with labeled bit positions.
```

#### 2.5 Endianness
```
Explain endianness: big-endian (most significant byte first — network byte order, SPARC, PowerPC), little-endian (least significant byte first — x86, x64, ARM in LE mode), and bi-endian CPUs. Show a concrete example: the 32-bit integer 0x12345678 in memory at address 0x1000 for both orderings. Cover where endianness matters: file formats, network protocols, binary serialization, and cross-platform data exchange. Explain why x86 is little-endian (historical reasons). Show endianness traps in C code and equivalent .NET scenarios.
```

#### 2.6 Endianness in .NET
```
Comprehensive .NET guide to endianness: BitConverter.IsLittleEndian to detect platform endianness, BinaryPrimitives (ReadInt32BigEndian, ReadInt32LittleEndian, WriteInt32BigEndian, WriteInt32LittleEndian — all in System.Buffers.Binary) for endianness-safe reading/writing, IPAddress.NetworkToHostOrder and HostToNetworkOrder for network byte order. Show how to write a cross-platform binary file reader that correctly handles endianness. Cover MemoryMarshal for reinterpreting byte spans. Include pitfalls of using BitConverter directly in cross-platform code.
```

---

### 3. Logic Gates & Boolean Algebra

#### 3.1 Boolean Algebra
```
Teach Boolean algebra: variables (true/false, 1/0), the three fundamental operations (AND, OR, NOT), derived operations (XOR, NAND, NOR), and the laws: identity (A AND 1 = A), null (A AND 0 = 0), idempotent (A AND A = A), complement (A AND NOT A = 0), commutativity, associativity, distributivity, absorption, and double negation. Explain how Boolean algebra is the mathematical foundation of digital logic and how it maps to C# operators (&, |, ^, ~, &&, ||, !). Include truth tables for each operation.
```

#### 3.2 Logic Gates
```
Explain the seven fundamental logic gates: AND, OR, NOT (inverter), NAND, NOR, XOR, XNOR. For each: show the schematic symbol, truth table, Boolean expression, and physical CMOS implementation concept. Explain why NAND and NOR are "universal gates" (any circuit can be built from only NAND gates). Show how an adder circuit is built from XOR and AND gates. Connect to .NET: bitwise operators (&, |, ^, ~) are direct implementations of AND, OR, XOR, NOT on all bits in parallel.
```

#### 3.3 Truth Tables
```
Explain truth tables as a complete enumeration of all input/output combinations for a Boolean function. Show how to construct truth tables for complex expressions. Cover minterms, maxterms, and Sum-of-Products (SOP) / Product-of-Sums (POS) forms. Explain Karnaugh maps for simplifying Boolean expressions. Show a practical example: designing the logic for a simple multiplexer. Connect to .NET: show how switch expressions and conditional chains can be optimized by thinking in Boolean algebra.
```

#### 3.4 Bitwise Operations in .NET
```
Show how Boolean logic gates map directly to C# bitwise operators: & (AND), | (OR), ^ (XOR), ~ (NOT), with side-by-side truth tables and operator behavior tables. Explain the difference between bitwise (&, |) and logical (&&, ||) operators in C# — bitwise always evaluates both sides, no short-circuit. Show how these operators work on all 8/16/32/64 bits in parallel on int/long. Include a reference table of common bit manipulation tasks and their bitwise operation solutions.
```

#### 3.5 Practical Uses of XOR
```
Cover the surprisingly many practical uses of XOR: in-place swapping without a temp variable (and why it fails for same-variable case), XOR-based bit toggling, XOR for finding the single non-duplicate element in an array (classic interview problem), XOR checksum, XOR cipher (Vernam cipher / one-time pad), RAID-5 parity calculation, CRC polynomial division, and XOR swap in linked list reversal. Show each with C# code. Explain why XOR is its own inverse (A XOR B XOR B = A).
```

#### 3.6 De Morgan's Laws
```
Explain De Morgan's Laws: NOT(A AND B) = NOT A OR NOT B, and NOT(A OR B) = NOT A AND NOT B. Show proof via truth tables. Demonstrate how they're used to simplify Boolean expressions and to convert between AND-logic and OR-logic representations. Show practical applications in C# code: rewriting complex if conditions in positive vs negative form, optimizing flag checks, and understanding how NOT conditions are distributed in LINQ queries. Include bitwise De Morgan's: ~(a & b) == (~a | ~b).
```

---

### 4. Bitwise Operations in .NET

#### 4.1 AND — Masking
```
Deep dive into the bitwise AND operator in C#: how it works (output bit is 1 only if both input bits are 1), masking to extract specific bits (ANDing with a mask), testing whether a bit is set (value & mask) != 0, clearing bits (value & ~mask), and checking power-of-two alignment (x & (n-1) == 0). Show a complete mask cookbook: extracting bytes from an int, reading nibbles, checking even/odd (x & 1), and reading flag enums. Include real-world .NET examples from BCL source code.
```

#### 4.2 OR — Setting Bits
```
Deep dive into bitwise OR: how it works (output is 1 if either bit is 1), setting specific bits (value | mask), combining flags (FileAccess.Read | FileAccess.Write), building packed integers from components (pixel ARGB values), and OR with shift for bit field construction. Show real .NET examples: constructing an RGBA color value, combining enum flags, building a network packet header. Cover the difference between | and || and why | is used for enum flags (non-short-circuit needed for side-effect-free flags).
```

#### 4.3 XOR — Toggling
```
Deep dive into XOR (exclusive OR): how it works (output is 1 if inputs differ), toggling specific bits (value ^ mask), comparing bit patterns (non-zero result means they differ), self-inverse property (a ^ b ^ b == a), and why XOR is useful in cryptography (perfect secrecy with XOR cipher). Cover XOR in .NET: toggling flags, computing differences between bitmasks, XOR hashing, and CryptographicOperations.FixedTimeEquals (XOR-based comparison to prevent timing attacks). Include the XOR linked list trick.
```

#### 4.4 NOT — Complement
```
Explain bitwise NOT in C# (~): one's complement (inverts all bits), how it relates to two's complement negation (-x == ~x + 1), creating bit masks (~0 == all ones, ~mask inverts a mask for clearing). Cover the common C# gotcha: ~0 on an int gives -1 (all bits set), not 255 — because int is 32 bits. Show uses: creating complement masks, inverting flags, and bit field operations. Explain the difference between bitwise NOT (~) and logical NOT (!) in C#.
```

#### 4.5 Left Shift
```
Deep dive into left shift (<<) in C#: multiplying by powers of 2 (n << k == n * 2^k), how it works bit-by-bit (bits move left, zeros fill right), overflow behavior (bits shifted out are lost), and shift on signed vs unsigned types. Cover practical uses: building bitmasks (1 << n to set bit n), packing values into bit fields, fast multiplication by constants, and computing powers of 2. Cover the C# rule: shift count is modulo type width (1 << 32 == 1 << 0 for int). Show .NET examples.
```

#### 4.6 Right Shift
```
Deep dive into right shift (>>) in C#: arithmetic vs logical right shift, how signed integers sign-extend on >> (preserves sign for negative numbers — arithmetic shift), unsigned integers fill with zeros (logical shift). Show division by powers of 2 (n >> k ≈ n / 2^k, but rounds toward negative infinity for negatives). Cover extracting high bytes, reading packed fields, and sign extension. Explain the C# behavior: >> on signed types is arithmetic (sign bit propagates), while >> on unsigned types is logical. Include gotchas with negative numbers.
```

#### 4.7 Unsigned Right Shift in C# 11
```
Explain the new unsigned right shift operator (>>>) introduced in C# 11: why it was added (previously you had to cast to uint to get logical right shift on int), how it always fills with zeros regardless of sign, and when to use it vs >>. Show use cases: extracting high bytes from negative integers, implementing hash functions that need unsigned shift, and SIMD-like operations. Compare the same operation written with C# 10 cast workaround vs C# 11 >>> operator.
```

#### 4.8 Bit Manipulation Patterns
```
A cookbook of essential bit manipulation patterns with C# implementations: test if bit N is set, set bit N, clear bit N, toggle bit N, get lowest set bit, clear lowest set bit, isolate lowest set bit (x & -x), count set bits (popcount), check if power of 2 (x > 0 && (x & (x-1)) == 0), round up to next power of 2, reverse bits in a byte, swap nibbles, sign extend from N bits, and rotate left/right. For each: show the formula, explain why it works, and provide a C# method.
```

#### 4.9 BitOperations in .NET
```
Comprehensive guide to System.Numerics.BitOperations in .NET: PopCount (count set bits), LeadingZeroCount, TrailingZeroCount, Log2 (integer log base 2), RoundUpToPowerOf2, RotateLeft, RotateRight, and IsPow2. Explain the hardware instructions they map to (POPCNT, BSR, BSF, LZCNT, TZCNT, ROL, ROR on x86). Show performance benefits over manual bit manipulation. Include use cases: counting set bits for Hamming weight, finding the highest set bit for logarithm, rotating for hash mixing. Cover .NET 8 additions.
```

---

### 5. Integer Representation

#### 5.1 Unsigned Integers
```
Explain unsigned integers: range formula (0 to 2^N - 1), overflow behavior (wraps around modulo 2^N), use cases (indices, sizes, bit masks, hash values, network byte fields), and unsigned types in C# (byte, ushort, uint, ulong, nuint). Cover why C# doesn't have unsigned int as the default (Java decision and its criticisms). Explain modular arithmetic and why overflow wrapping is mathematically clean for unsigned integers. Show common patterns: array indexing, buffer offsets, color channel values (0–255).
```

#### 5.2 Sign-Magnitude Representation
```
Explain sign-magnitude representation: the sign bit (MSB = 0 for positive, 1 for negative) and remaining bits as magnitude. Show the range (-(2^(N-1)-1) to +(2^(N-1)-1)), the two representations of zero (+0 and -0), and the problem with arithmetic (addition doesn't just add bits — you must check signs). Explain why this was used in early computers and why it was abandoned in favor of two's complement. Show why sign-magnitude is still used in IEEE 754 floating point (for the sign bit).
```

#### 5.3 One's Complement
```
Explain one's complement representation: negate by inverting all bits, the range (-(2^(N-1)-1) to +(2^(N-1)-1)), two zeros problem (+0 = 0000, -0 = 1111), and the end-around carry needed for addition. Show examples of arithmetic. Explain where one's complement is still used: the Internet Checksum (IP, TCP, UDP headers use one's complement addition), and ICMP checksums. Show how to compute an Internet checksum in .NET.
```

#### 5.4 Two's Complement
```
Deep dive into two's complement: how to compute it (invert all bits, add 1), the asymmetric range (e.g., -128 to 127 for 8 bits — one more negative than positive), why there's one representation of zero, and why it's the universal standard (addition and subtraction work without special cases). Show the two's complement number circle. Prove that addition works correctly for mixed positive/negative numbers. Explain the minimum value edge case (MIN_INT = -MIN_INT). Show examples in C# with sbyte, short, int, long.
```

#### 5.5 Two's Complement Arithmetic
```
Show how two's complement enables hardware simplicity: addition is the same circuit for signed and unsigned (the hardware doesn't know the sign — it's an interpretation), subtraction is addition with negation (a - b = a + (-b) = a + ~b + 1), and how the carry flag vs overflow flag distinguish unsigned overflow from signed overflow. Work through arithmetic examples. Show the connection to C#: unchecked int arithmetic uses two's complement wrapping, how int.MinValue / -1 throws in checked mode, and the division edge case.
```

#### 5.6 Integer Overflow
```
Explain integer overflow: what happens when arithmetic exceeds the representable range, wraparound behavior in two's complement (unchecked), and real-world overflow bugs (including security vulnerabilities). Cover the famous examples: Ariane 5 rocket explosion (integer overflow), integer overflow in hash maps, and CVE examples. Show C# overflow behavior for signed vs unsigned types, the difference between checked and unchecked contexts, and how to detect overflow without using checked (for performance-sensitive code). Cover overflow in loop indices.
```

#### 5.7 Integer Types in .NET
```
Complete reference for integer types in .NET: byte (0–255), sbyte (-128–127), short (-32768–32767), ushort (0–65535), int (-2^31 to 2^31-1), uint, long (-2^63 to 2^63-1), ulong, nint/nuint (platform-dependent pointer-sized). Show their sizes, ranges, CLR type names (System.Int32, etc.), and storage in memory. Cover which types are CLS-compliant. Explain nint/nuint (.NET 5+): when to use them (interop, pointer arithmetic). Include a type selection guide: when to use each based on range, performance, and convention.
```

#### 5.8 Checked vs Unchecked in C#
```
Explain C# checked and unchecked contexts: checked throws OverflowException on integer overflow (useful for safety), unchecked silently wraps (default, useful for performance and intentional wrapping). Cover checked/unchecked operators and blocks, the compiler default (unchecked for expressions, checked for constants), and how to use the /checked compiler option. Show use cases for intentional wrapping (hash functions, custom numeric types). Include how checked interacts with unchecked blocks in nested code. Show performance difference.
```

#### 5.9 BigInteger
```
Explain System.Numerics.BigInteger: arbitrary-precision integer with no overflow, internal representation (sign-magnitude with uint[] array), performance characteristics (much slower than int/long for large numbers, O(n²) for multiplication of large values), and use cases: cryptography (RSA key generation, modular exponentiation), mathematical algorithms (factorial, Fibonacci to arbitrary precision), and working with numbers larger than ulong. Show common operations: arithmetic, modular arithmetic (ModPow), GCD, bit operations, and conversion to/from byte arrays (big-endian and little-endian).
```

---

### 6. Floating-Point Representation

#### 6.1 Why Floating-Point is Hard
```
Explain the fundamental problem with floating-point: most decimal fractions cannot be represented exactly in binary (just as 1/3 can't be written exactly in decimal). Show that 0.1 in binary is a repeating fraction: 0.0001100110011... Cover how this causes accumulation errors in arithmetic and why equality comparison of floats is problematic. Introduce the concept of relative vs absolute error. Explain why floating-point is still used despite these limitations (range, performance, hardware support). This section motivates the rest of the floating-point chapter.
```

#### 6.2 IEEE 754
```
Deep dive into the IEEE 754 standard: the two main formats (single-precision / binary32 and double-precision / binary64), the bit layouts, exponent bias (127 for float, 1023 for double), the implicit leading 1 bit in the mantissa (normalized numbers), and the encoding rules. Show how to encode and decode a specific decimal number (e.g., 3.14) step by step into IEEE 754 binary. Include a table of key values (max, min normal, min subnormal, epsilon) for both float and double. Map to C# float and double.
```

#### 6.3 Anatomy of a Float
```
Explain the three fields of an IEEE 754 float: sign bit (1 bit), exponent field (8 bits for float, 11 for double), and mantissa/fraction field (23 bits for float, 52 for double). Show the formula: value = (-1)^sign × 1.mantissa × 2^(exponent - bias). Work through encoding 12.375, -0.5, and a number close to 0.1. Show how to use BitConverter and unsafe code in C# to inspect the raw bits of a float. Cover how the range and precision relate to bit counts (float: ~7 decimal digits, double: ~15-16 decimal digits).
```

#### 6.4 Special Values
```
Explain IEEE 754 special values: positive and negative infinity (overflow result, 1/0), NaN (Not a Number — 0/0, sqrt(-1), operations involving NaN propagate), quiet NaN vs signaling NaN, negative zero (-0 == +0 but 1/-0 = -∞), and subnormal (denormalized) numbers (gradual underflow near zero). Cover how C# handles each: float.IsNaN(), float.IsInfinity(), float.IsPositiveInfinity(), double.NaN comparisons (NaN != NaN), and how NaN propagates through arithmetic. Show the bit patterns for each special value.
```

#### 6.5 Floating-Point Precision Errors
```
Explain floating-point precision errors in depth: why 0.1 + 0.2 != 0.3, loss of significance (catastrophic cancellation), rounding modes (round to nearest even as default), error accumulation in loops, and the difference between relative and absolute error. Show C# examples demonstrating each error type. Include the "what developers should know" summary: never use == for floats, use epsilon comparison, prefer decimal for money, and know that the order of operations affects results (floating point is not associative). Show epsilon comparison implementations.
```

#### 6.6 Catastrophic Cancellation
```
Explain catastrophic cancellation: when subtracting two nearly equal floating-point numbers causes dramatic loss of significant digits. Show a concrete example (computing (1 + ε) - 1 for small ε). Cover the quadratic formula example (b² - 4ac near zero). Show numerically stable reformulations. Explain Kahan summation algorithm for accurate floating-point summation of many values. Cover fused multiply-add (FMA) and its .NET support (MathF.FusedMultiplyAdd). Show C# examples with before/after accuracy comparison.
```

#### 6.7 float, double, and decimal in .NET
```
Compare C#'s three non-integer numeric types: float (32-bit IEEE 754, ~7 digits, fast, GPU/graphics), double (64-bit IEEE 754, ~15-16 digits, default for scientific), and decimal (128-bit decimal floating point, ~28-29 digits, no binary representation error, slow, financial). Show the range, precision, and internal representation of each. Provide a decision guide: use double for scientific/engineering, float for graphics and performance-sensitive code (SIMD), decimal for money/financial calculations. Show operations unique to each type: Math vs MathF, decimal's rounding.
```

#### 6.8 Half in .NET 6+
```
Explain the System.Half type (.NET 6+): 16-bit IEEE 754 half-precision float (1 sign, 5 exponent, 10 mantissa bits), range (~6.1×10⁻⁵ to 65504), precision (~3.3 decimal digits), and its primary use case (machine learning, GPU computations, storage of large float arrays). Show conversion to/from float and double, arithmetic operations, special values, and performance considerations. Cover the BFloat16 format (used in ML frameworks) and how it differs from IEEE Half. Show how Half reduces memory usage in ML applications.
```

#### 6.9 Comparing Floats in C#
```
Explain why == is wrong for floating-point comparison and provide correct alternatives: absolute epsilon comparison (|a - b| < epsilon — when to use, what epsilon value to choose), relative epsilon comparison (|a - b| / max(|a|, |b|) < epsilon — better for large numbers), ULP (Units in the Last Place) comparison (most mathematically rigorous), and the MathF.Abs / Math.Abs helper. Show C# implementations of each comparison method. Cover edge cases: comparing with zero, NaN (use float.IsNaN), infinity, and negative zero. Include a reusable FloatComparer utility.
```

#### 6.10 Float Bit Manipulation in .NET
```
Show how to inspect and manipulate the raw bits of floating-point values in .NET: BitConverter.SingleToInt32Bits and Int32BitsToSingle (.NET 4.8+), BitConverter.DoubleToInt64Bits and Int64BitsToDouble, using Unsafe.As<float, int>(ref value) for zero-copy reinterpretation, and MemoryMarshal.Cast<float, int>(span) for span-based manipulation. Cover use cases: fast inverse square root (Quake III trick), detecting NaN by bit pattern, stripping the sign bit for absolute value, and implementing custom float serialization. Show how .NET JIT generates optimal code for bit reinterpretation.
```

---

### 7. Fixed-Point & Decimal Arithmetic

#### 7.1 Fixed-Point Numbers
```
Explain fixed-point number representation: a conceptual integer with an implicit binary point at a fixed position (e.g., 8.8 format for one byte integer and one byte fraction). Show examples: Q8.8, Q16.16, Q4.12 formats. Cover fixed-point arithmetic: addition (same as integer), multiplication (need to shift right by fractional bits), and division. Explain use cases: embedded systems without FPUs, DSP audio processing, games (N64 used 16.16 fixed point), and financial calculations. Show how to implement Q16.16 fixed-point arithmetic in C# using int/long.
```

#### 7.2 The decimal Type in .NET
```
Explain the internal representation of C#'s decimal type: 128-bit structure (1 sign bit, 96-bit integer coefficient, scaling factor 0–28), how it represents values as integers divided by powers of 10 (not powers of 2), range (~±7.9×10²⁸) and precision (28-29 significant digits). Show how 0.1 is represented exactly in decimal (coefficient = 1, scale = 1). Cover the Decimal struct fields (lo, mid, hi, flags), the GetBits() method, and Decimal.TruncateTo28DigitPrecision behavior. Explain why decimal arithmetic is exact for decimal fractions but not for 1/3.
```

#### 7.3 decimal for Money
```
Explain why decimal (not double or float) must be used for financial calculations in .NET. Show concrete examples of float/double errors that would cause incorrect financial calculations (penny rounding errors accumulating). Cover proper decimal usage for money: rounding to 2 decimal places with Math.Round(d, 2, MidpointRounding.AwayFromZero), choosing MidpointRounding modes, avoiding implicit conversions between decimal and float/double (they can reintroduce error), and the performance cost of decimal (10-20x slower than double). Recommend using a Money value object or NodaMoney library.
```

#### 7.4 Rounding Modes in .NET
```
Explain all rounding modes available in .NET via MidpointRounding: AwayFromZero (schoolbook rounding: 2.5→3, -2.5→-3), ToEven (banker's rounding: 2.5→2, 3.5→4 — round to nearest even, reduces statistical bias), ToZero (truncate), ToNegativeInfinity (floor), ToPositiveInfinity (ceiling). Show the mathematical definitions. Explain when each mode is appropriate: AwayFromZero (everyday), ToEven (financial, scientific — reduces accumulation error), floor/ceiling (range calculations). Cover Math.Round, Math.Floor, Math.Ceiling, Math.Truncate, and decimal.Round overloads.
```

#### 7.5 Arbitrary Precision Decimal
```
Cover arbitrary-precision decimal arithmetic beyond System.Decimal: the need (actuarial calculations, compiler development, arbitrary-precision math), available .NET libraries (BigDecimal implementations, Mpfr.NET, MathNet.Numerics, BigRational). Show how to implement a simple BigDecimal using BigInteger for the coefficient and int for the scale. Cover the MPFR approach (arbitrary precision floating point with specified precision in bits). Explain trade-offs: memory and CPU cost grow with precision. Show a .NET example computing π to 100 decimal places.
```

---

### 8. Character Encoding

#### 8.1 ASCII
```
Explain ASCII (American Standard Code for Information Interchange): 7-bit encoding (0–127), printable characters (32–126), control characters (0–31: CR, LF, TAB, NUL, ESC), and the DEL character (127). Include the full ASCII table with decimal, hex, and character columns. Explain the design decisions: why uppercase letters start at 64 (0x40), how upper/lowercase differ by only one bit (bit 5), why digits start at 48. Show ASCII in .NET: casting char to int, (char)65 == 'A', char.IsLetter(), and string comparison with ASCII semantics.
```

#### 8.2 Extended ASCII and Code Pages
```
Explain the problem with ASCII: only covers English. Cover the various solutions: ISO 8859-x code pages (Latin-1/ISO-8859-1 for Western European, etc.), Windows code pages (CP1252, CP1251 for Cyrillic), OEM code pages (CP437 — original IBM PC). Explain "mojibake" (garbled text from mismatched encoding/decoding). Show the confusion caused by hundreds of incompatible 8-bit encodings. Explain why this chaos motivated Unicode. Show code page handling in .NET: Encoding.GetEncoding("windows-1252"), legacy encoding support via System.Text.Encoding.CodePages NuGet package.
```

#### 8.3 Unicode
```
Explain Unicode: the universal character standard covering 1.1 million code points (U+0000 to U+10FFFF), organized into 17 planes (Plane 0 = Basic Multilingual Plane, Plane 1 = Supplementary Multilingual Plane for emoji/historic scripts), assigned vs unassigned code points (~150,000 assigned), and categories (letters, digits, symbols, control, surrogate, private use). Explain the difference between a code point and a code unit. Cover Unicode scalar values. Explain why Unicode has multiple encodings (UTF-8, UTF-16, UTF-32) and the difference between the Unicode standard and its encodings.
```

#### 8.4 UTF-8
```
Deep dive into UTF-8 encoding: the variable-length design (1–4 bytes per code point), the encoding table (1 byte for U+0000–U+007F, 2 bytes for U+0080–U+07FF, 3 bytes for U+0800–U+FFFF, 4 bytes for U+10000–U+10FFFF), the leading byte pattern (11xxxxxx for multi-byte starts), continuation bytes (10xxxxxx), self-synchronization property, and backward compatibility with ASCII. Show encoding/decoding of specific characters (€ = E2 82 AC, emoji 😀 = F0 9F 98 80). Explain why UTF-8 is the dominant encoding on the web and in Linux. Show UTF-8 in .NET.
```

#### 8.5 UTF-16
```
Explain UTF-16: 2-byte code units, the Basic Multilingual Plane encoded directly (1 code unit), and characters outside the BMP encoded as surrogate pairs (2 code units — 4 bytes total). Explain surrogate pair ranges (high surrogates: U+D800–U+DBFF, low surrogates: U+DC00–U+DFFF). Show how surrogate pairs are decoded back to code points. Explain why .NET strings use UTF-16 internally (historical reasons — Windows API, Java legacy). Cover the implications: char in C# is a UTF-16 code unit, not a Unicode code point, so a single emoji requires 2 chars. Show string.Length vs actual code point count.
```

#### 8.6 UTF-32
```
Explain UTF-32: fixed-width 4 bytes per code point, simplest to work with (random access, O(1) indexing into code points), but 2-4x more memory than UTF-8. Cover big-endian and little-endian variants (UTF-32BE, UTF-32LE). Explain where UTF-32 is used: Linux/Mac C wchar_t (4 bytes on these platforms), some internal processing engines, and its rarity in transmission/storage. Show .NET's UTF-32 encoding: Encoding.UTF32, converting strings to UTF-32 byte arrays, and the memory overhead comparison.
```

#### 8.7 BOM
```
Explain the Byte Order Mark (BOM): what it is (the Unicode character U+FEFF encoded at the start of a file), its original purpose (detect byte order for UTF-16), why it's used in UTF-8 (not needed for byte order but added by some Windows tools for identification), and why it causes problems (breaks scripts, tools, HTTP headers, JSON, XML files). Show how .NET handles BOM: Encoding.UTF8 (no BOM), new UTF8Encoding(true) (with BOM), StreamReader auto-detection, and how to strip BOM in code. Explain Microsoft's evolution from recommending BOM to discouraging it.
```

#### 8.8 Normalization Forms
```
Explain Unicode normalization: why the same visual character can have multiple binary representations (e.g., é as a single precomposed character U+00E9 vs e + combining acute accent U+0301 — different bytes, same appearance). Cover the four normalization forms: NFC (Canonical Decomposition followed by Canonical Composition — most compact, web-preferred), NFD (Canonical Decomposition), NFKC (Compatibility Decomposition + Composition), NFKD. Show why normalization matters for string comparison, database storage, and cryptographic hashing. Show .NET: string.Normalize(), IsNormalized(), StringComparer options.
```

#### 8.9 Encoding in .NET
```
Comprehensive guide to System.Text.Encoding in .NET: Encoding.UTF8, Encoding.Unicode (UTF-16 LE), Encoding.UTF32, Encoding.ASCII, GetBytes(), GetString(), GetByteCount(), GetCharCount(), Encoder/Decoder stateful objects for streaming, TranscodingStream for format conversion, and detecting encoding (no reliable detection — explain why). Cover the new UTF-8 String Literals in C# 11 (u8 suffix: "hello"u8 returns ReadOnlySpan<byte>). Show encoding pipeline for HTTP request body processing. Include fallback behaviors (EncoderFallback for unmappable characters).
```

#### 8.10 Rune, char, and string in .NET
```
Explain the three levels of text in .NET: char (UTF-16 code unit, may be half a surrogate pair), Rune (.NET 5+ — a Unicode scalar value, a complete code point), and string (sequence of chars in UTF-16). Show why iterating a string with foreach gives chars, not Rune, and how surrogate pairs can split. Show correct Unicode iteration using string.EnumerateRunes(), Rune.DecodeFromUtf16(), Rune.IsLetter(), Rune.GetUnicodeCategory(). Cover TextElement (grapheme cluster — user-perceived character) via StringInfo. Build a Unicode-correct character counter in C#.
```

#### 8.11 Encoding Pitfalls
```
Cover the most common character encoding pitfalls in .NET development: mojibake (decoding with wrong encoding), the BOM causing mysterious question marks, treating string.Length as character count (wrong for emoji), byte truncation in the middle of multi-byte sequences, confusing UTF-16 char with Unicode code point, writing binary data into a StreamWriter (encoding corruption), incorrect use of ASCIIEncoding (silently replaces non-ASCII with ?), HTML entity encoding vs URL encoding vs Unicode escape confusion, and Base64 encoding binary then trying to UTF-8 decode it. Show each pitfall with a C# example and the fix.
```

---

### 9. Binary Encoding Schemes

#### 9.1 Why Binary-to-Text Encoding Exists
```
Explain why binary-to-text encoding is necessary: many systems only handle printable ASCII (email (SMTP was 7-bit), HTTP headers, JSON strings, XML, command-line arguments, URLs). Cover historical context: UUENCODE (Unix), BinHex (Mac), MIME multipart encoding for email attachments. Explain the design trade-off: all binary-to-text encodings expand the data size (Base64 = 33% larger, Base16 = 100% larger). Show the problem: a PNG image or TLS certificate contains bytes that aren't valid in a JSON string — they need to be encoded. Motivate Base64 as the dominant solution.
```

#### 9.2 Base64
```
Deep dive into Base64 encoding: the 64-character alphabet (A–Z, a–z, 0–9, +, /), why 64 (2^6 = fits in 6 bits), the encoding process (take 3 bytes → 4 Base64 characters), padding with = for input not divisible by 3, and decoding. Show step-by-step encoding of "Man" → "TWFu" and "Ma" → "TWE=". Explain why Base64 expands by 33% (3 bytes become 4 chars). Cover the Base64 alphabet design. Show encoding of binary data (a PNG header, a TLS certificate). Implement encode/decode from scratch in C# to understand the algorithm.
```

#### 9.3 Base64 URL-Safe Variant
```
Explain Base64 URL-safe encoding (Base64url): why the standard + and / characters are problematic in URLs and filenames (+ means space in query strings, / is a path separator), the replacement characters (- for +, _ for /), and the optional removal of = padding (since = is also URL-special). Cover where Base64url is used: JWT tokens (header.payload.signature), OAuth 2.0 PKCE code_challenge, URL-safe file names, and cookie values. Show .NET implementation: Base64UrlEncoder, System.Buffers.Text.Base64Url (.NET 8+), and the manual replace approach for older .NET.
```

#### 9.4 Base32
```
Explain Base32 encoding: the 32-character alphabet (A–Z, 2–7 in RFC 4648, or custom Crockford alphabet 0–9, A–Z minus I/L/O/U for human readability), encoding 5 bits per character, why it's less dense than Base64 (20% larger than Base64), and its advantages: case-insensitive, no special URL characters, fewer visually confusing characters. Cover where Base32 is used: TOTP/HOTP secret keys (Google Authenticator seeds), content-addressed storage, human-readable IDs, and some DNS-based encoding. Show .NET Base32 implementation (no built-in — implement from scratch).
```

#### 9.5 Base16 / Hex Encoding
```
Explain Base16 (hexadecimal) encoding as the simplest binary-to-text scheme: each byte becomes exactly 2 hex characters, no padding, no special alphabet — just 0-9 and A-F (or a-f). Cover where hex encoding is used: hash outputs (SHA-256 produces 64 hex chars), color codes (#RRGGBB), MAC addresses, IPv6 addresses, debugging output, and certificate thumbprints. Show .NET implementations: Convert.ToHexString() and Convert.FromHexString() (.NET 5+), BitConverter.ToString() (with dashes — less useful), and a fast Span-based hex encoder/decoder. Compare performance of various approaches.
```

#### 9.6 Base85
```
Explain Base85 (Ascii85): encodes 4 bytes as 5 ASCII characters (denser than Base64 at only 25% overhead vs 33%), the z special case (4 zero bytes = single 'z'), the ASCII character range used (33–117). Cover variants: RFC 1924 Base85 (used in IPv6 address encoding), btoa format (used in PostScript and PDF), and ZeroMQ's Z85. Explain the math: 85^5 > 2^32. Show where Base85 appears: PDF binary streams, git binary patches, ZeroMQ message encoding. Show a C# implementation since there's no built-in support.
```

#### 9.7 Base64 in .NET
```
Comprehensive .NET guide to Base64: Convert.ToBase64String() and Convert.FromBase64String() (string-based, allocates), System.Buffers.Text.Base64 static class (span-based, zero-allocation: EncodeToUtf8, DecodeFromUtf8, GetMaxEncodedToUtf8Length), the new Base64Url class in .NET 8 (EncodeToString, DecodeFromChars), and HttpServerUtility.UrlTokenEncode (legacy). Show how to Base64-encode a file without loading it all into memory (streaming approach). Include a benchmark comparing Convert vs System.Buffers.Text.Base64 for large payloads. Cover common use cases: embedding images in CSS/HTML, encoding binary in JSON.
```

#### 9.8 Streaming Base64
```
Show how to encode and decode Base64 in a streaming fashion in .NET without loading all data into memory: using System.Buffers.Text.Base64 with a rental buffer loop, implementing a Base64Stream wrapper over a Stream, and using the ICryptoTransform pattern (ToBase64Transform and FromBase64Transform with CryptoStream for streaming Base64). Show a complete example: streaming a large file to a Base64-encoded response in ASP.NET Core. Explain the flush boundary issue (Base64 boundary is every 3 bytes — partial writes need buffering).
```

#### 9.9 Base64 Mistakes
```
Cover the most common Base64 mistakes developers make: double-encoding (Base64-encoding something already Base64-encoded), padding errors (missing or extra = causing decode failure), using standard Base64 in URLs (+ and / break things — use Base64url), confusing Base64 with encryption (Base64 is NOT encryption), trying to UTF-8 decode Base64 output (it's ASCII, not arbitrary bytes), incorrect handling of line breaks (MIME Base64 wraps at 76 chars, RFC 4648 doesn't), and whitespace handling differences between implementations. Show each mistake with a C# example and the correct approach.
```

---

### 10. Data Serialization Formats

#### 10.1 Text vs Binary Serialization
```
Compare text-based serialization (JSON, XML, CSV) and binary serialization (Protobuf, MessagePack, CBOR, Avro): human readability vs compactness, parsing complexity, schema evolution, versioning, type safety, performance (CPU and memory), and ecosystem support. Include a benchmark comparison of JSON vs Protobuf vs MessagePack for a typical message payload (size, serialization speed, deserialization speed). Provide a decision matrix: when to use each format. Relate to .NET: what libraries support each format and their maturity.
```

#### 10.2 JSON
```
Explain JSON at the encoding level: the six value types (string, number, boolean, null, array, object), string escaping rules (Unicode \uXXXX, control characters, \", \\), number representation (no distinction between int and float at the format level — just "number"), and the ASCII superset guarantee of JSON (safe for HTTP). Cover JSON encoding edge cases: large integers lose precision in JavaScript (Number.MAX_SAFE_INTEGER), Unicode escaping of non-ASCII, and JSON with comments (not standard). Show System.Text.Json in .NET: JsonSerializer, JsonDocument, Utf8JsonReader/Writer, source generation.
```

#### 10.3 XML
```
Explain XML encoding: the document structure, encoding declaration (<?xml version="1.0" encoding="UTF-8"?>), character escaping (&amp; &lt; &gt; &apos; &quot;), CDATA sections, namespaces, and the relationship between XML and Unicode. Cover XML encoding pitfalls: null bytes not allowed in XML, non-standard control characters, and surrogate pairs in XML. Show .NET XML APIs: XmlSerializer, XDocument (LINQ to XML), XmlReader/XmlWriter for streaming. Cover XmlDocument vs XDocument trade-offs and when to use each.
```

#### 10.4 Protobuf Wire Format
```
Explain the Protocol Buffer binary wire format: field tags (field number + wire type), wire types (varint: 0, 64-bit: 1, length-delimited: 2, 32-bit: 5), varint encoding (7 bits per byte, MSB as continuation bit), zigzag encoding for signed integers (sint32, sint64), fixed-size types (fixed32, fixed64), length-delimited fields (strings, bytes, embedded messages), and packed repeated fields. Show the byte-by-byte encoding of a simple message. Explain forward/backward compatibility rules (unknown fields preserved, added fields are optional). Show how to inspect raw protobuf bytes in C#.
```

#### 10.5 MessagePack
```
Explain MessagePack binary format: the type system (nil, bool, int, float, str, bin, array, map, ext), format families (positive fixint, fixstr, fixarray, fixmap for compact small values), and how it compares to JSON (same data model but binary, typically 50-70% smaller). Cover MessagePack's variable-length integers and why it's more space-efficient than Protobuf for small values. Show .NET usage with MessagePack-CSharp: serializing POCOs with [MessagePackObject] attribute, schema-less mode, custom formatters, and streaming. Include a size comparison benchmark.
```

#### 10.6 CBOR
```
Explain CBOR (Concise Binary Object Representation, RFC 7049/8949): designed as a binary JSON (same data model — numbers, strings, byte strings, arrays, maps, booleans, null), self-describing (no schema needed), and IANA-standardized. Cover CBOR major types (unsigned int, negative int, byte string, text string, array, map, tag, special/float), indefinite-length encoding, and the semantic tags system (for dates, URIs, bignum, MIME, etc.). Show .NET usage with System.Formats.Cbor (.NET 6+): CborWriter and CborReader. Cover where CBOR is used: FIDO2/WebAuthn (passkeys), COSE, IoT protocols (CoAP).
```

#### 10.7 Avro and Parquet
```
Explain Avro and Parquet as data pipeline serialization formats. Avro: schema-based binary format with schema embedded or separately stored, row-oriented, designed for Hadoop/Kafka, schema evolution rules (added fields with defaults, removed fields with defaults), and RPC support. Parquet: columnar binary format optimized for analytical queries (reads only needed columns), compression per column, dictionary encoding, and run-length encoding. Show .NET: Apache.Avro NuGet and Parquet.Net. Explain when each is used: Avro for streaming (Kafka), Parquet for analytics (Spark, Athena, data lakes).
```

#### 10.8 Serialization in .NET
```
Comprehensive guide to serialization in .NET: System.Text.Json (modern, performant, AOT-compatible, source generation), Newtonsoft.Json (feature-rich, widely used), XmlSerializer, DataContractSerializer, BinaryFormatter (deprecated/removed — why it was dangerous), and MemoryPack (.NET 7+ high-performance binary). Cover source-generated JSON serialization in .NET 6+ for AOT and performance, custom JsonConverter, handling polymorphism (JsonPolymorphic in .NET 7), and serialization performance tips. Include a comparison table of all .NET serialization options.
```

#### 10.9 Custom Binary Serialization
```
Show how to implement custom binary serialization in .NET using BinaryPrimitives and Span<T>: writing a fixed-format binary protocol (similar to a network packet header), reading and writing integers in specific byte orders, handling variable-length strings (length-prefixed), and frame/packet delimitation. Build a complete binary serializer/deserializer for a sample message type. Show use cases: high-performance inter-process communication, game state serialization, custom network protocols. Include benchmarks comparing custom binary vs System.Text.Json for the same data.
```

---

### 11. Memory Layout & Management

#### 11.1 Memory Hierarchy
```
Explain the computer memory hierarchy and latency numbers every developer should know: CPU registers (~0.5ns), L1 cache (~1ns, 32-64KB), L2 cache (~4ns, 256KB-4MB), L3 cache (~10-40ns, 4-32MB), DRAM/RAM (~60-100ns), NVMe SSD (~100µs), HDD (~5-10ms), and network round-trip (~1ms local, ~100ms internet). Include Peter Norvig's famous "Numbers Every Programmer Should Know" table. Explain the 100x gap between cache and RAM. Show how this hierarchy influences .NET collection choices and data structure design decisions.
```

#### 11.2 Stack vs Heap
```
Explain the stack and heap in .NET programs: the stack (LIFO, fast allocation/deallocation by moving stack pointer, limited size ~1MB default, stores method frames — local variables and return addresses), and the heap (dynamic allocation, managed by GC, large but slower, stores all objects). Cover what lives where in C#: value type locals → stack, reference type instances → heap, value types inside classes → heap with the class. Explain stack overflow (infinite recursion or large stack allocations). Show how to set thread stack size. Visualize a call stack with a diagram.
```

#### 11.3 Value Types vs Reference Types in .NET
```
Deep dive into value types (struct, enum, primitive types) and reference types (class, interface, delegate, array) in .NET: the fundamental semantic difference (copy vs reference semantics), where they're allocated (stack for locals vs heap for instances — with important nuances), how assignment works, equality semantics (value equality by default for structs vs reference equality for classes), and boxing. Cover struct guidelines (immutable, ≤16 bytes), when to use struct vs class (performance vs semantics), and how records (record struct, record class) fit in. Show memory layout diagrams.
```

#### 11.4 Struct Layout and Alignment
```
Explain struct layout in .NET: field alignment (each field aligned to its own size — int aligned to 4 bytes, double to 8), padding inserted by CLR to maintain alignment, how to calculate struct size with padding, and the impact on memory usage (a struct with bool+int might be 8 bytes, not 5, due to padding). Show examples with different field orderings and their sizes using Unsafe.SizeOf<T>(). Explain why field ordering matters for size: put largest fields first to minimize padding. Show Marshal.SizeOf vs Unsafe.SizeOf differences.
```

#### 11.5 StructLayout in .NET
```
Explain the [StructLayout] attribute in C#: LayoutKind.Sequential (fields in declaration order, for P/Invoke), LayoutKind.Explicit (fields at specified byte offsets using [FieldOffset] — for unions and binary protocol parsing), LayoutKind.Auto (CLR reorders for optimal packing — default for managed structs). Show [StructLayout(LayoutKind.Explicit)] for creating C-style unions in C# (overlapping fields at offset 0 — useful for reading raw float bits). Cover Pack parameter for removing padding. Include a complete example of parsing a binary file header using LayoutKind.Sequential.
```

#### 11.6 .NET Object Memory Layout
```
Explain how .NET objects are laid out in memory: the object header (2 words — sync block index/lock state, and method table pointer), the method table pointer (points to type info, vtable), then the instance fields. Show that every object has at minimum 16 bytes overhead (on 64-bit). Cover array layout (object header + length field + elements). Explain how the GC uses object headers. Show how to inspect object memory layout using ObjectLayoutInspector NuGet or unsafe pointer arithmetic. Cover how the JIT accesses fields via offsets from the object pointer.
```

#### 11.7 Boxing and Unboxing
```
Explain boxing (wrapping a value type in a heap-allocated object) and unboxing (extracting the value type from the box) in .NET: when boxing occurs implicitly (assigning int to object, adding int to ArrayList, using interface on struct), the performance cost (allocation, GC pressure, indirection), and how to avoid it (use generics List<T> instead of ArrayList, constrained generic calls prevent boxing for interfaces). Show IL-level evidence of boxing (box/unbox opcodes). Measure boxing allocation cost with BenchmarkDotNet. Cover nullable value types (Nullable<T>) and their boxing behavior.
```

#### 11.8 Memory-Mapped Files
```
Explain memory-mapped files in .NET: mapping a file (or shared memory) directly into the process address space, allowing file access as if it were memory (pointer/span access rather than read/write calls). Cover MemoryMappedFile.CreateFromFile, MemoryMappedFile.CreateNew (for shared memory between processes), ViewAccessor, and ViewStream. Show use cases: parsing large binary files without loading into RAM, high-performance IPC between processes (shared memory), and implementing simple databases. Include a complete example of reading a large binary file using memory-mapped access.
```

#### 11.9 unsafe Code in C#
```
Explain unsafe code in C#: what it enables (raw pointers, pointer arithmetic, fixed statement, stackalloc), why it exists (P/Invoke, performance-critical code, interop with unmanaged libraries), and the safety trade-offs (bypasses GC tracking, manual memory management, buffer overflows possible). Cover the `unsafe` keyword on methods and blocks, the /unsafe compiler flag. Show pointer basics: int* p = &x, *p dereference, p++ arithmetic, and pointer-to-struct field access. Explain the fixed statement for pinning managed objects. Show when unsafe is warranted vs when Span<T> is sufficient.
```

#### 11.10 sizeof, Marshal.SizeOf, Unsafe.SizeOf
```
Explain the three ways to measure type sizes in .NET: sizeof(T) (compile-time constant for primitive types and blittable structs — managed layout), Marshal.SizeOf<T>() (unmanaged/interop layout, includes pack settings, may differ from managed layout), and Unsafe.SizeOf<T>() (runtime, works for any type including generics, returns managed layout size). Show when each gives different results (struct with pack=1 vs default padding). Include a reference showing sizes of all built-in types. Show how to use these for buffer allocation in binary serialization.
```

---

### 12. Pointers & Memory Addressing

#### 12.1 Virtual Memory
```
Explain virtual memory: each process gets its own virtual address space (0 to 2^64 on 64-bit), the OS maps virtual pages to physical RAM pages via the page table, demand paging (pages loaded from disk on access), page faults, and memory protection between processes. Cover virtual address layout for a .NET process (code, stack, heap, DLLs). Explain why two processes can have the same virtual address but different physical pages. Cover large address awareness and memory limits (32-bit ~2GB user space, 64-bit ~128TB virtual space). Show how to query process memory usage in .NET.
```

#### 12.2 Pointers
```
Explain pointers at a conceptual level: a pointer is a variable that stores a memory address, pointer types (int* points to int), pointer dereferencing (*p reads the value), pointer arithmetic (p++ advances by sizeof(*p) bytes), and the NULL pointer (address 0 — invalid to dereference). Show pointer arithmetic in C (and C# unsafe) with examples. Explain why pointer arithmetic is unsafe (no bounds checking, buffer overflows). Show how pointers enable efficient array traversal and struct manipulation. Build the conceptual foundation before moving to .NET Span<T> as the safe alternative.
```

#### 12.3 Null Pointers
```
Explain null references and null pointers: the billion-dollar mistake (Tony Hoare's self-described error), null pointer dereference (NullReferenceException in .NET), null as absence of reference vs value. Cover C#'s evolution: nullable reference types (C# 8+ with #nullable enable), null-conditional operator (?.), null-coalescing operator (??), null-coalescing assignment (??=), and the is not null pattern. Explain the difference between null, Nullable<T>, and Option/Maybe patterns. Cover the NullReferenceException vs NullPointerException distinction and how .NET generates them.
```

#### 12.4 ref, out, and in
```
Explain C#'s managed references: ref (pass by reference — caller's variable is aliased, readable and writable), out (output parameter — must be assigned before return, unread on entry), and in (read-only reference — pass large struct without copy, no modification). Cover ref locals and ref returns (.NET Core 3+) for returning references into arrays or structs. Show the IL behind ref parameters (uses managed pointers). Cover SkipLocalsInit for performance. Explain how ref differs from unsafe pointers (GC tracks managed refs). Show real-world use cases for each.
```

#### 12.5 ref struct
```
Explain ref struct in C#: a struct that can only live on the stack (cannot be boxed, cannot be a field in a class, cannot be captured in a lambda or async method). Explain why this restriction exists (the struct may contain managed pointers to stack memory — like Span<T> does — and allowing it on the heap would be unsafe). Cover Span<T> and ReadOnlySpan<T> as the canonical ref struct. Show when to create custom ref structs (high-performance parsers, stack-allocated buffers). Cover the ByRefLikeAttribute that marks ref structs in IL.
```

#### 12.6 Span and Memory
```
Deep dive into Span<T> and Memory<T> in .NET: Span<T> as a type-safe, memory-safe, allocation-free view over any contiguous memory (managed array, stack memory, native memory), the operations (indexing, slicing, CopyTo, Fill, SequenceEqual), Span's ref struct restriction (stack only), and Memory<T> as the heap-safe equivalent (can be stored in fields, used in async). Cover ReadOnlySpan<T> and ReadOnlyMemory<T>. Show how to create Spans from arrays, strings (AsSpan), stackalloc, and native memory (unsafe). Include a performance comparison showing zero-copy parsing with Span.
```

#### 12.7 unsafe Pointers and fixed
```
Explain the fixed statement in C# unsafe code: pinning a managed object so the GC doesn't move it during pointer access, the types that can be pinned (arrays, strings, structs), and the scope of pinning. Show fixed(byte* p = array) pattern. Explain why pinning is expensive for the GC (prevents compaction), and why the Pinned Object Heap (POH) was added. Show unsafe pointer operations: array element access via pointer vs indexer (performance difference), struct field access via pointer, and pointer casting. Cover GCHandle.Alloc with GCHandleType.Pinned as an alternative.
```

#### 12.8 NativeMemory
```
Explain NativeMemory in .NET 6+: allocating, reallocating, and freeing unmanaged (native) memory outside the GC heap. Cover NativeMemory.Alloc, NativeMemory.AllocZeroed, NativeMemory.Realloc, NativeMemory.Free, NativeMemory.AlignedAlloc, NativeMemory.AlignedFree. Explain use cases: large buffers that shouldn't trigger GC, interop with native code, SIMD-aligned memory. Compare to Marshal.AllocHGlobal (older equivalent). Show how to create a Span<T> over native memory using unsafe. Cover the IMemoryOwner<T> pattern for wrapping native allocations.
```

#### 12.9 Interop with Native Code
```
Comprehensive .NET interop guide: P/Invoke with [DllImport] (marshaling rules — how .NET types map to C types), the new [LibraryImport] (source-generated, AOT-compatible, .NET 7+), marshaling strings (LPStr, LPWStr, LPUTF8Str, in/out/ref), marshaling arrays and pointers, struct marshaling (blittable vs non-blittable), SafeHandle for resource safety, COM interop basics, and the performance cost of marshaling. Include a complete P/Invoke example calling a C library function. Explain why LibraryImport is preferred over DllImport for new code.
```

---

### 13. .NET Memory Model & Garbage Collector

#### 13.1 .NET Memory Regions
```
Explain the .NET managed heap memory regions: Small Object Heap (SOH) for objects <85KB, divided into Gen0/Gen1/Gen2 segments; Large Object Heap (LOH) for objects ≥85KB (collected with Gen2, not compacted by default); Pinned Object Heap (POH, .NET 5+) for objects that need to be pinned without affecting GC compaction; and the method table/code heap. Show how to observe these regions with dotnet-counters and GC.GetGCMemoryInfo(). Explain the LOH fragmentation problem and how ArrayPool mitigates it.
```

#### 13.2 Garbage Collection
```
Explain .NET garbage collection: the tri-color mark-and-sweep algorithm (white = unreachable, gray = reachable but children unscanned, black = reachable, children scanned), how the GC identifies roots (stack variables, static fields, GC handles), the sweeping phase (reclaiming white objects), and the compaction phase (moving surviving objects to eliminate fragmentation, updating all references). Cover stop-the-world pauses and concurrent GC. Explain how the GC knows object sizes (method table contains size info). Show the GC notification API and GC.Collect() (and why to avoid it).
```

#### 13.3 GC Generations
```
Explain the generational hypothesis (most objects die young) and .NET's three-generation GC: Gen0 (new objects, collected frequently, ~256KB budget), Gen1 (buffer between Gen0 and Gen2, ~2MB), Gen2 (long-lived objects, collected rarely). Cover generation promotion (surviving a collection promotes to next generation), ephemeral segment, and why Gen0/Gen1 collections are fast (small heap, collected together). Show how to observe generation collection counts with GC.CollectionCount(0/1/2). Include the performance implication: keep hot objects in Gen0 (short-lived).
```

#### 13.4 Finalizers and IDisposable
```
Explain finalizers (destructors) in C#: the ~ClassName() syntax, when finalizers run (non-deterministically, on the finalizer thread, after GC marks object as unreachable), the two-GC-collection delay for finalizable objects, and why finalizers are slow. Cover IDisposable for deterministic cleanup, the Dispose pattern, and SafeHandle as the preferred approach for native resources. Explain the GC.SuppressFinalize() call in Dispose (avoids double-cleanup). Cover DisposeAsync and IAsyncDisposable for async cleanup. Include a memory leak example from forgetting to dispose.
```

#### 13.5 Dispose Pattern
```
Show the complete IDisposable implementation pattern in C#: the basic pattern (public Dispose(), protected virtual Dispose(bool disposing) for derived class support), disposing managed resources (other IDisposable objects) vs unmanaged resources (native handles), the finalizer as safety net, and GC.SuppressFinalize. Show the modern simplified version (sealed class, no virtual Dispose needed). Cover using statement and using declaration syntax. Show IAsyncDisposable with await using. Explain the "dispose cascade" problem and how to handle it with ownership semantics.
```

#### 13.6 Weak References
```
Explain weak references in .NET: a reference that doesn't prevent the GC from collecting the object, short vs long weak references (short doesn't resurrect via finalizer, long does), WeakReference<T> (preferred over non-generic WeakReference), and the TryGetTarget() pattern. Cover use cases: caches that don't prevent eviction (WeakReference-based cache), event handlers without memory leaks (WeakEventManager pattern), and observer patterns. Show the common weak event pattern in WPF. Explain ConditionalWeakTable<TKey, TValue> for attaching data to objects without preventing collection.
```

#### 13.7 GC Pressure
```
Explain what causes GC pressure and its performance impact: allocation rate (faster allocation = more frequent Gen0 GC), LOH fragmentation (large allocations without compaction), pinning (prevents compaction), finalizers (extra GC cycle), and long-lived objects promoted to Gen2. Provide a toolkit for reducing GC pressure: object pooling (ObjectPool<T>, ArrayPool<T>), struct instead of class for short-lived data, Span<T> to avoid allocations, pre-allocating collections to avoid resizing, string interning, and StringBuilder for string building. Measure GC pressure with BenchmarkDotNet MemoryDiagnoser.
```

#### 13.8 Server vs Workstation GC
```
Explain the two main .NET GC modes: Workstation GC (optimized for responsiveness, single GC thread, uses less memory) and Server GC (optimized for throughput, one GC thread per logical CPU core, scales with cores, higher memory usage). Cover configuration: <GarbageCollectionAdaptationMode>, <ServerGarbageCollection> in .csproj, and runtime.json. Explain Concurrent GC (background GC) and how it reduces pause times. Cover GC modes for different workloads: interactive apps (workstation), ASP.NET Core servers (server GC). Show how to verify GC mode at runtime.
```

#### 13.9 Pinned Object Heap
```
Explain the Pinned Object Heap (POH) introduced in .NET 5: why it was created (pinned objects in the SOH prevent compaction, causing fragmentation), how it works (objects allocated here are always treated as pinned, separate heap that doesn't compact), and how to use it (GCHandle.Alloc with GCHandleType.Pinned still works, but stackalloc and MemoryMarshal patterns now often preferred). Cover the main use case: I/O buffers that need to be pinned for native interop. Show before/after fragmentation comparison with benchmarks.
```

#### 13.10 GC Diagnostics
```
Practical guide to diagnosing GC issues in .NET: dotnet-counters (live GC metrics: Gen0/1/2 collection count, heap size, allocation rate), dotnet-dump (heap analysis: dumpheap -stat, gcroot for finding references preventing collection), PerfView (GC event analysis, allocation call stacks), Visual Studio Memory Profiler, and JetBrains dotMemory. Show a complete diagnosis workflow for a memory leak: observe symptoms → collect dotnet-dump → analyze with dotnet-dump analyze → identify retained objects → find GC roots. Include commands and screenshot descriptions.
```

---

### 14. CPU Architecture Essentials

#### 14.1 CPU Components
```
Explain the key CPU components at a software-relevant level: ALU (Arithmetic Logic Unit — integer arithmetic, bitwise ops), FPU (Floating-Point Unit), registers (ultrafast storage inside the CPU), cache hierarchy (L1/L2/L3 — bridging speed between CPU and RAM), control unit (fetches and decodes instructions), and the memory bus. Cover modern additions: SIMD units (SSE, AVX), branch predictor, out-of-order execution engine, and multiple execution ports. Show how a C# method becomes instructions that exercise these components. Avoid excessive hardware depth — focus on what a .NET developer can influence.
```

#### 14.2 Instruction Set Architecture
```
Explain ISA concepts: the contract between software and hardware, CISC (Complex Instruction Set Computer — x86, many complex instructions) vs RISC (Reduced Instruction Set Computer — ARM, RISC-V, simple fixed-width instructions), and the current landscape (x86-64 dominates desktop/server, ARM64 dominates mobile and increasingly server/Mac). Cover .NET's cross-ISA support: same IL runs on x86-64, ARM64, WASM. Explain why ISA matters for .NET developers: SIMD intrinsics are ISA-specific, JIT generates different code per ISA, some APIs detect ISA at runtime.
```

#### 14.3 Registers
```
Explain CPU registers for x86-64: general-purpose registers (RAX, RBX, RCX, RDX, RSI, RDI, RSP, RBP, R8-R15), their 32/16/8-bit sub-registers (EAX, AX, AL, AH), the instruction pointer (RIP), flags register (RFLAGS — zero flag, carry flag, overflow flag, sign flag), and SIMD registers (XMM0-XMM15, YMM0-YMM15, ZMM0-ZMM31). Explain calling convention register usage (which are caller-saved vs callee-saved). Show how the JIT assigns .NET locals to registers vs stack slots. Cover ARM64 equivalents (X0-X30, SP, PC, NZCV flags).
```

#### 14.4 Fetch-Decode-Execute Cycle
```
Explain the classic fetch-decode-execute cycle: fetch (load instruction from memory at address in instruction pointer), decode (identify the instruction type and operands), execute (perform the operation in ALU/FPU), writeback (store result to register/memory). Show how this maps to a simple C# expression: a = b + c becomes load b, load c, add, store a. Explain how pipelining parallelizes these stages. Cover the role of the instruction cache (I-cache) and data cache (D-cache) in this cycle. Show how branch prediction fits into the cycle.
```

#### 14.5 CPU Pipelining
```
Explain CPU instruction pipelining: running multiple instructions simultaneously at different pipeline stages (similar to an assembly line), the ideal throughput of 1 instruction per clock cycle, and pipeline hazards that break this ideal: structural hazards (resource conflicts), data hazards (read-after-write dependency — RAW), and control hazards (branches). Explain stalls and forwarding (bypassing). Show how the JIT and CPU handle common data dependencies. Cover modern CPU pipelines (14-19 stages for x86-64). Explain pipeline depth vs frequency trade-off (deeper pipelines enable higher clock speeds but more branch misprediction penalty).
```

#### 14.6 Branch Prediction
```
Explain branch prediction: the CPU speculatively executes code on one path of a branch before the branch condition is resolved (to keep the pipeline full), the branch predictor's state machine (bimodal predictor, tournament predictor), misprediction cost (typically 10-20 cycles to flush speculative work), and Spectre vulnerability (speculative execution across privilege boundaries). Show how to write branch-predictor-friendly C# code: sorting data before branching on it (famous branchless sort example), avoiding unpredictable branches in hot loops, and using ternary/conditional moves. Show BenchmarkDotNet evidence.
```

#### 14.7 Out-of-Order Execution
```
Explain out-of-order execution (OoOE): the CPU dynamically reorders instructions to avoid stalls (executing independent instructions while waiting for a long-latency operation like a cache miss), the reorder buffer (ROB), register renaming (eliminating false dependencies), and the retirement stage (committing results in program order). Cover Tomasulo's algorithm conceptually. Explain how OoOE interacts with the .NET memory model: the CPU may reorder memory operations, which is why volatile and Interlocked exist. Show why lock-free code is hard to write correctly.
```

#### 14.8 SIMD
```
Explain SIMD (Single Instruction, Multiple Data): processing multiple data elements with one instruction (e.g., adding 8 floats simultaneously with AVX), SIMD register widths (SSE: 128-bit, AVX: 256-bit, AVX-512: 512-bit), and data types (packed bytes, shorts, ints, floats, doubles). Explain the performance benefit: 4x speedup for 256-bit floats over scalar code (theoretically). Cover where SIMD is used: image processing, audio DSP, machine learning, string searching, and cryptography. This section motivates the detailed .NET SIMD section below.
```

#### 14.9 SIMD in .NET
```
Comprehensive guide to SIMD in .NET: Vector<T> (hardware-agnostic, width determined at runtime), System.Runtime.Intrinsics with Vector128<T> and Vector256<T> (fixed width), hardware intrinsic classes (Sse2, Avx2, AdvSimd for ARM — with IsSupported checks), and automatic vectorization by the JIT. Show concrete examples: summing a float array with Vector<float>, searching for a byte in a span with Vector<byte>, and a SIMD-accelerated dot product. Explain the cross-platform approach (Vector<T> with fallback vs ISA-specific). Cover .NET 8 additions and Vector512. Include benchmarks showing speedup.
```

---

### 15. CPU Caches & Memory Performance

#### 15.1 Cache Hierarchy
```
Explain the CPU cache hierarchy in detail: L1 instruction cache (I-cache) and L1 data cache (D-cache, ~32KB, ~4 cycle latency), L2 unified cache (~256KB-1MB, ~12 cycle latency), L3 shared cache (4-32MB, ~40 cycle latency), and main DRAM (~200 cycle latency). Cover inclusive vs exclusive cache policies, NUMA (Non-Uniform Memory Access — cache latency depends on which CPU core accesses which memory bank), and the dramatic impact of a cache miss. Include "Latency Numbers Every Programmer Should Know" table (Jeff Dean's version, updated). Show how these numbers dictate .NET data structure choice.
```

#### 15.2 Cache Lines
```
Explain cache lines: the unit of data transfer between RAM and cache (64 bytes on x86-64 and ARM), how the CPU always loads 64 bytes even if only 1 byte is needed, and the spatial locality principle (accessing nearby memory is "free" if the cache line is already loaded). Show how array traversal is cache-friendly (sequential access prefetches cache lines) while random access is not (pointer chasing in linked lists = cache miss per node). Include a benchmark showing sequential vs random array access performance difference. Show how to align structures to cache line boundaries using [StructLayout].
```

#### 15.3 Cache Associativity
```
Explain cache associativity: direct-mapped cache (each memory address maps to exactly one cache set — prone to conflict misses), fully associative cache (any line can go anywhere — expensive hardware), and N-way set-associative (compromise — each address maps to one set with N possible slots — used in practice, L1 is typically 8-way). Explain conflict misses: two addresses that map to the same set evict each other repeatedly (stride-based cache thrashing). Show a C# example where accessing an array with stride equal to the cache size causes conflict misses vs prime stride.
```

#### 15.4 Cache Misses
```
Explain the three types of cache misses: compulsory/cold misses (first access to a line — unavoidable), capacity misses (working set larger than cache — reduce by fitting data in cache), and conflict misses (multiple addresses map to same set — avoid by changing strides or data layout). Cover cache miss costs and their impact on application performance. Show how to diagnose cache misses: hardware performance counters (via BenchmarkDotNet HardwareCounters, Linux perf stat, Intel VTune). Provide concrete C# examples of each miss type and how to fix them.
```

#### 15.5 False Sharing
```
Explain false sharing: when two threads write to different variables that happen to reside on the same cache line, causing the cache line to ping-pong between CPU cores (each write invalidates the other core's copy). Show a dramatic performance example: two threads each incrementing their own counter, but the counters are adjacent in an array — massive slowdown. Show the fix: padding structs to fill a cache line using [StructLayout] with Size=64, [CacheLineAligned] attribute in .NET 9, or simply adding dummy padding fields. Include BenchmarkDotNet evidence. Cover false sharing in thread-local storage.
```

#### 15.6 Data-Oriented Design
```
Explain data-oriented design (DoD) for .NET developers: organizing data for cache efficiency rather than object-oriented abstraction. Cover Structure of Arrays (SoA) vs Array of Structures (AoS): SoA is cache-friendly when processing one field of many objects (e.g., updating all X positions), AoS is cache-friendly when processing all fields of one object. Show a concrete comparison: a particle system with 100,000 particles, measuring DoD vs OOP approach with BenchmarkDotNet. Cover memory packing (use smaller types where possible, sort by size). Explain ECS (Entity Component System) game architecture as DoD at scale.
```

#### 15.7 Prefetching
```
Explain hardware prefetching: the CPU's prefetch unit automatically detects sequential or strided access patterns and loads upcoming cache lines proactively. Cover why sequential array access is faster than it "should be" (prefetcher compensates). Explain software prefetching: explicitly loading a future cache line with PREFETCHT0 instruction (exposed as Sse.Prefetch0() in .NET). Show when software prefetch helps: pointer-chasing traversal where the hardware prefetcher can't predict the next address. Explain why prefetch can hurt if used incorrectly (pollutes cache). Show a .NET linked list traversal with software prefetch.
```

#### 15.8 Measuring Cache Performance
```
Show how to measure cache performance in .NET applications: BenchmarkDotNet with [HardwareCounters] attribute (InstructionRetired, CacheMisses, BranchMispredictions, LlcMisses), Linux perf stat for cache miss counters, Visual Studio Diagnostic Tools, Intel VTune Profiler, and AMD uProf. Show a complete workflow: suspect code → add benchmarks → observe cache miss counters → apply DoD fix → verify improvement. Include example output interpretation. Cover the memory bandwidth limit: show how to calculate theoretical memory bandwidth and compare to measured throughput for cache-bound code.
```

---

### 16. Memory Ordering & Concurrency at Hardware Level

#### 16.1 CPU Memory Reordering
```
Explain why CPUs reorder memory operations: out-of-order execution, write buffers (stores are buffered and may be committed out of order), and store-load reordering (a store followed by a load to a different address may execute in reverse). Cover the x86-64 Total Store Order (TSO) memory model (strong — only store-load reordering allowed), and ARM's weaker memory model (allows load-load, store-store, and store-load reordering). Show a concrete example where two threads reading and writing shared flags without synchronization can produce unexpected results even with no compiler reordering.
```

#### 16.2 Memory Barriers
```
Explain memory barriers (fences): instructions that prevent reordering across the barrier. Cover barrier types: LoadLoad (prevents load moving after barrier past another load), StoreStore (prevents store reordering), LoadStore, StoreLoad (full barrier — most expensive), and acquire/release semantics. Explain acquire (no load/store after can move before — used on lock acquire and read side), release (no load/store before can move after — used on lock release and write side), and sequential consistency (both). Show how these map to .NET's Thread.MemoryBarrier(), Volatile.Read/Write, and Interlocked operations.
```

#### 16.3 .NET Memory Model
```
Explain the .NET memory model guarantees: all memory writes are visible to all threads eventually, volatile reads/writes have acquire/release semantics, Interlocked operations are fully sequentially consistent, lock blocks have acquire (on entry) and release (on exit) semantics, and the JIT is not allowed to reorder volatile accesses. Contrast with the C# language memory model vs the CLR memory model. Cover what is NOT guaranteed (ordinary reads/writes can be reordered relative to each other). Explain the ECMA-335 memory model specification. Show common lock-free patterns that rely on these guarantees.
```

#### 16.4 volatile in C#
```
Deep dive into the volatile keyword in C#: what it guarantees (prevents compiler and JIT reordering around the access, generates acquire/release memory barriers), what it doesn't guarantee (not atomic for 64-bit values on 32-bit systems, not a substitute for Interlocked), and common misconceptions. Show the IL generated for volatile reads (volatile. prefix). Cover when to use volatile: a stop flag (bool _stop), published reference (object that once written is read-only). Show the double-checked locking pattern and why volatile is needed. Explain why volatile is usually the wrong choice and Interlocked or lock is better.
```

#### 16.5 Interlocked
```
Comprehensive guide to System.Threading.Interlocked: Increment, Decrement (atomic add by ±1), Add (atomic add of any value), Exchange (atomic swap), CompareExchange (CAS — the primitive for all lock-free algorithms), Read (atomic 64-bit read on 32-bit systems), And, Or (atomic bitwise ops, .NET 5+). Explain Compare-And-Swap (CAS): the foundation of all lock-free algorithms (compare current value to expected, swap with new value only if equal). Show implementing a lock-free stack using CAS. Explain the ABA problem. Compare Interlocked performance vs lock for different contention levels.
```

#### 16.6 Volatile.Read and Volatile.Write
```
Explain Volatile.Read<T> and Volatile.Write<T> in System.Threading: the typed, generic versions of volatile access that work for any type (not just fields marked volatile), the acquire semantics of Read and release semantics of Write, and when to use them vs volatile fields. Cover the difference: volatile field = every access has barrier, Volatile.Read/Write = explicit barrier at specific access points (more surgical). Show how to implement a published-object pattern (write a reference then make it visible to other threads). Cover MemoryBarrier() for full fence when needed.
```

#### 16.7 Lock-Free Data Structures
```
Explain lock-free data structures: the goal (progress guarantee — at least one thread makes progress, unlike lock-based where one blocked thread stops all), using CAS as the primitive, and common algorithms. Cover lock-free stack (Treiber stack), lock-free queue (Michael-Scott queue), and why they're hard: ABA problem (address reused — use versioned pointers or hazard pointers), memory reclamation (when is it safe to free?). Show .NET's ConcurrentStack<T>, ConcurrentQueue<T>, and ConcurrentDictionary<T,V> as pre-built lock-free/low-lock collections. Explain when to use lock-free vs lock-based.
```

#### 16.8 MESI Cache Coherence
```
Explain the MESI cache coherence protocol: the four states a cache line can be in (Modified — dirty exclusive, Exclusive — clean exclusive, Shared — clean shared, Invalid — not present/stale), the state transitions on reads and writes, how coherence is maintained across CPU cores via the interconnect, and why false sharing is so expensive (a write to a Shared line invalidates all other copies, forcing a read miss). Show the connection to .NET: why lock-free code must account for coherence overhead, and why CAS is expensive (acquires exclusive ownership of the cache line).
```

---

### 17. Instruction-Level & JIT Details in .NET

#### 17.1 IL to JIT
```
Explain the .NET execution pipeline: C# source → compiler → CIL bytecode (.dll), CIL → JIT (just-in-time compiler) → native machine code at runtime, and the RyuJIT compiler. Cover why .NET uses JIT (portability, runtime optimization), the warm-up cost (first call to a method compiles it), and tiered compilation. Show how to inspect CIL using ildasm, ILSpy, or dotnet-ildasm. Explain PGO (Profile-Guided Optimization) in .NET 6+: the JIT uses runtime information to optimize hot paths. Cover ahead-of-time (AOT) as the alternative to JIT.
```

#### 17.2 Reading IL Code
```
Teach how to read CIL (Common Intermediate Language): the stack-based execution model (operands pushed/popped from evaluation stack), common opcodes (ldarg, ldloc, stloc, ldc.i4, add, mul, ret, call, callvirt, newobj, box, unbox), and control flow opcodes (br, brtrue, brfalse, switch). Show a simple C# method and its IL side by side. Show arithmetic, method calls, and a simple loop in IL. Cover how to use SharpLab.io to view IL for any C# snippet. Explain why understanding IL helps debug unexpected behavior (boxing, virtual dispatch overhead).
```

#### 17.3 Tiered Compilation
```
Explain .NET tiered compilation: Tier 0 (quick JIT, minimal optimization, instruments for PGO), Tier 1 (fully optimized, recompiles hot methods after profiling), and Tier 1 PGO (uses runtime call counts and type information for speculative optimizations). Cover Dynamic PGO in .NET 6+: inline caches, type guarding, and loop cloning based on observed types. Show how tiered compilation affects startup time (fast at start, speeds up over time). Explain how to disable tiering (DOTNET_TieredCompilation=0) for consistent benchmarking. Cover ReadyToRun (R2R) pre-compiled code.
```

#### 17.4 Native AOT
```
Explain Native AOT compilation in .NET 7+: compiling .NET apps to self-contained native binaries (no JIT at runtime), the benefits (fast startup, small memory, no JIT warm-up), and limitations (no runtime code generation, restricted reflection, limited dynamic loading, subset of .NET APIs). Cover PublishSingleFile vs NativeAOT, trimming (removing unused code), and the ILC (Intermediate Language Compiler) toolchain. Show how to publish a .NET console app and ASP.NET Core app with Native AOT. Explain use cases: CLI tools, microservices, AWS Lambda/Azure Functions where cold start matters.
```

#### 17.5 JIT Optimizations
```
Explain key JIT optimizations relevant to .NET developers: method inlining (eliminates call overhead — show size/complexity limits), dead code elimination (removes unreachable code), constant folding (computes constant expressions at compile time), loop invariant code motion (hoists loop-invariant computations out of loops), loop unrolling (reduces branch overhead for small loops), devirtualization (replaces virtual call with direct call when type is known — huge speedup), and bounds check elimination (removes array index checks when provably safe). Show code examples that trigger vs prevent each optimization using SharpLab.
```

#### 17.6 Reading Disassembly
```
Teach how to read x86-64 assembly output for .NET code: common instructions (mov, add, sub, imul, cmp, jmp, je, jne, call, ret, push, pop, lea), register naming conventions, memory addressing modes ([rbp-8] for local variable, [rax+16] for field access), and how to map assembly back to C# constructs. Tools: SharpLab.io (view JIT output for any C# snippet online), Disasmo VS extension, BenchmarkDotNet [DisassemblyDiagnoser]. Show a complete C# method → JIT assembly mapping. Cover how to identify inlining, bounds check elimination, and SIMD in the output.
```

#### 17.7 Method Inlining
```
Deep dive into JIT method inlining in .NET: the performance benefit (eliminates call overhead, enables further optimizations like constant propagation into the callee), the JIT's inlining heuristics (IL size limit ~32 bytes for "aggressive," method complexity, recursive methods never inlined), [MethodImpl(MethodImplOptions.AggressiveInlining)] to suggest inlining, [MethodImpl(MethodImplOptions.NoInlining)] to prevent it, and how to verify inlining happened (Disasmo, SharpLab). Show cases where inlining can hurt (instruction cache pressure from very large methods). Cover virtual method devirtualization as inlining enabler.
```

#### 17.8 Stack Frame Layout
```
Explain x86-64 stack frame layout: the stack pointer (RSP), base pointer (RBP), return address, saved registers, local variables, and shadow space (Windows x64 calling convention). Show how a C# method's local variables are laid out in the stack frame. Cover the calling convention: which arguments go in registers (RCX, RDX, R8, R9 on Windows; RDI, RSI, RDX, RCX, R8, R9 on Linux), which spill to stack, and who is responsible for saving which registers (caller-saved vs callee-saved). Show how to interpret a stack trace at the assembly level. Cover how tail calls eliminate stack frame growth.
```

---

### 18. Bit Fields, Flags & Packed Data

#### 18.1 Bit Fields
```
Explain bit fields: packing multiple small values into a single integer to save memory and improve cache performance. Show examples: packing year/month/day into a 32-bit int (11 bits for year, 4 for month, 5 for day), network packet flags (TCP flags: SYN, ACK, FIN, RST, PSH, URG in 6 bits), and RGB color in 16 bits (R=5, G=6, B=5 bits — RGB565 format). Provide a C# bit field helper struct using shifts and masks. Show read/write operations. Compare to [StructLayout(LayoutKind.Explicit)] union approach. Explain the memory savings and performance trade-offs.
```

#### 18.2 Enum Flags in C#
```
Explain the [Flags] attribute for bitwise enum operations in C#: defining flag enums (each value should be a power of 2 or zero), combining flags with |, checking flags with HasFlag() or bitwise &, removing flags with &~, the None value (0), and the All value (all flags combined). Show common pitfalls: HasFlag() on non-flags enum, performance of HasFlag() (uses reflection pre-.NET 5, now a JIT intrinsic), and the enum.HasFlag() vs bitwise & performance debate. Cover [Flags] with combination values (e.g., ReadWrite = Read | Write). Include a complete example of a file permissions enum.
```

#### 18.3 Packed Pixel Formats
```
Explain packed pixel formats as a practical bit manipulation example: ARGB32 (8 bits each for Alpha, Red, Green, Blue packed into a 32-bit int — 0xAARRGGBB), RGB565 (5 bits R, 6 bits G, 5 bits B in 16 bits), and BGRA layout (used by Windows GDI). Show how to pack and unpack pixel components using shifts and masks in C#. Build a Color struct that converts between ARGB, HTML hex (#RRGGBB), and float (0.0–1.0) representations. Show how to process a pixel array in-place using Span<uint> for performance. Cover .NET's System.Drawing.Color and SkiaSharp color types.
```

#### 18.4 Binary Protocols
```
Show how to parse fixed-width binary protocol frames in .NET: reading fields of specific sizes and byte orders from a byte span (using BinaryPrimitives for endianness-correct reads), parsing a Ethernet/IP/TCP-like header struct, handling bit fields within bytes (extracting flags from flag byte), and building a complete binary frame parser. Show the difference between a packet with fixed header + variable body and a TLV (Type-Length-Value) encoding. Include a real example: parsing a binary DNS response packet.
```

#### 18.5 Network Byte Order
```
Explain network byte order (big-endian, per RFC 791 and Unix convention) and host byte order (little-endian on x86): why network protocols use big-endian, the htons/htonl/ntohs/ntohl functions in C, and the .NET equivalents. Show IPAddress.NetworkToHostOrder(short/int/long) and IPAddress.HostToNetworkOrder(). Explain BinaryPrimitives.ReadInt16BigEndian as the modern approach. Build a complete example parsing raw TCP/IP packet bytes showing network-to-host byte order conversion for each multi-byte field.
```

#### 18.6 BitArray in .NET
```
Explain System.Collections.BitArray: a space-efficient boolean array backed by int[] (32 booleans per int), bitwise operations (AND, OR, XOR, NOT between two BitArrays), Get/Set individual bits, Length property, and CopyTo. Compare memory: 1000 bool[] = ~1000 bytes, BitArray(1000) = ~128 bytes. Show use cases: Sieve of Eratosthenes (prime numbers), bloom filter, permission bitmaps, and dense boolean flags. Show limitations: no Span support, boxing in some operations. Cover the performance trade-off vs raw int/long bit manipulation for hot paths.
```

#### 18.7 Bit-Packed Structs
```
Show how to create memory-efficient bit-packed structs in C# using [StructLayout(LayoutKind.Sequential)] with BitConverter for parsing, and manual bit field properties with get/set accessors using shifts and masks. Build a complete example: a DateTime-like struct that packs year (12 bits), month (4 bits), day (5 bits), hour (5 bits), minute (6 bits) into 32 bits — total 4 bytes vs DateTime's 8 bytes. Show a network packet header struct. Include unit tests. Compare to the C bitfield approach and why C# doesn't have native bitfield syntax.
```

---

### 19. Hashing & Checksums at the Bit Level

#### 19.1 Hash Function Properties
```
Explain what makes a good (non-cryptographic) hash function for data structures: determinism (same input → same output), uniformity/distribution (outputs spread evenly across the range), avalanche effect (small input change → large output change), speed, and low collision rate. Cover the birthday paradox and its implication for expected collisions: with N buckets and N insertions, expect ~N(1-e^-1) ≈ 0.63N buckets to be occupied. Explain the difference between hash quality and cryptographic security. Introduce the hash table load factor and why poor hash functions cause clustering.
```

#### 19.2 CRC
```
Explain CRC (Cyclic Redundancy Check): the mathematical foundation (polynomial division over GF(2)), common CRC polynomials (CRC-8, CRC-16, CRC-32/ISO-HDLC as used in Ethernet/ZIP/PNG, CRC-32C as used in iSCSI/SCTP), the reflected bit order convention, and the lookup table optimization (precompute 256 entries, then process one byte per iteration). Explain what CRC detects (single-bit errors, burst errors up to polynomial degree), what it doesn't (adversarial corruption). Show a CRC-32 implementation in C# and compare to System.IO.Hashing.Crc32.
```

#### 19.3 Checksum Algorithms
```
Explain Adler-32 (used in zlib/PNG): the two running sums (A = sum of bytes mod 65521, B = sum of A values mod 65521), combined into a 32-bit value — simple and fast. Explain Fletcher-16/32 (similar to Adler but different modulus and combination). Compare Adler-32 vs CRC-32: Adler-32 is faster (no table lookup) but weaker (misses some error patterns). Show C# implementations. Cover where each is used in practice: Adler-32 in zlib headers (PNG), CRC-32 in Ethernet frames and ZIP files, Fletcher in some embedded protocols. Show System.IO.Hashing namespace.
```

#### 19.4 Non-Cryptographic Hashes
```
Explain non-cryptographic hash functions for hash tables and data processing: FNV-1a (simple, good distribution, 32/64-bit), MurmurHash3 (excellent avalanche, widely used), xxHash32/64/128 (extremely fast, hardware-accelerated via SIMD), SipHash (faster than crypto hashes, but keyed for DoS resistance — used in Rust HashMap, Python dict). Show benchmarks comparing speed vs quality. Show C# implementations via System.IO.Hashing (xxHash32, xxHash64, xxHash3) and NuGet packages. Cover the hash flooding attack (DoS via collision-heavy input) and why .NET's Dictionary uses randomized seeds.
```

#### 19.5 GetHashCode in .NET
```
Explain the GetHashCode() contract in .NET: if two objects are equal (by Equals()), they must have the same hash code; hash codes must be stable within an AppDomain run; two unequal objects may have the same hash code (collision is allowed). Cover pitfalls: GetHashCode() on mutable fields (objects change hash when modified — breaks Dictionary/HashSet), returning constant 0 (legal but O(n) dictionary), and the default GetHashCode() for reference types (identity-based). Show how Dictionary<TKey, TValue> uses GetHashCode() internally. Cover string.GetHashCode() randomization (per-process seeding in .NET Core).
```

#### 19.6 HashCode Struct
```
Explain System.HashCode (.NET Standard 2.1+): a struct for combining multiple values into a hash code. Cover the Add<T>() method (accumulates values), ToHashCode() (finalizes), and the static Combine<T1..T8>() overloads for up to 8 fields. Show how to implement GetHashCode() for a record/struct with multiple fields using HashCode.Combine(). Explain the internal algorithm (xxHash32-based with random seed). Show how to hash collections (order-dependent: add each element, order-independent: sort first or XOR combine). Cover the IEqualityComparer<T> interface and custom comparers for Dictionary.
```

#### 19.7 System.IO.Hashing
```
Comprehensive guide to System.IO.Hashing (.NET 6+): xxHash32, xxHash64, xxHash3, Crc32, Crc64, the common IHashAlgorithm interface, appending data (Append methods for incremental hashing), GetCurrentHash for non-destructive read, and the static hash methods for single-call hashing. Show how to hash a stream using Append in a loop. Compare performance of System.IO.Hashing vs a crypto hash (SHA256) for the same data — show the dramatic speed difference. Show use cases: file integrity checksums (non-security), cache keys, content deduplication.
```

---

### 20. Compression

#### 20.1 Compression Fundamentals
```
Explain compression theory: Shannon entropy (minimum bits needed to represent data given its probability distribution), redundancy (patterns that entropy coding can exploit), lossless vs lossy compression. Cover why some files don't compress (already compressed: JPEG, MP4, ZIP), why text compresses well (high redundancy in natural language and code), and the compression ratio vs speed vs memory trade-off triangle. Explain the two main approaches: statistical (Huffman, arithmetic coding — assign shorter codes to frequent symbols) and dictionary (LZ — replace repeated strings with references). Relate to .NET stream compression APIs.
```

#### 20.2 RLE
```
Explain Run-Length Encoding (RLE): replacing runs of repeated bytes/values with (count, value) pairs, PackBits format (used in TIFF and classic Mac file system), and RLE for images (BMP, PCX, early fax). Show a C# RLE encoder/decoder implementation. Explain where RLE excels (binary images, simple graphics) and fails (natural language, already-compressed data). Cover RLE variants: pixel RLE for image data, font RLE for bitmap fonts, and audio RLE for silence detection. Explain how RLE is used as a component in more complex codecs (JPEG uses RLE for AC coefficient runs).
```

#### 20.3 Huffman Coding
```
Explain Huffman coding: building an optimal prefix-free code where shorter codes are assigned to more frequent symbols. Walk through the algorithm: count symbol frequencies, build a min-heap of nodes, repeatedly merge two lowest-frequency nodes, assign 0/1 to left/right branches, read off codes by tracing root to leaf. Show that Huffman is optimal among prefix-free codes. Cover the canonical Huffman code (used in DEFLATE for compact tree storage), adaptive Huffman, and why Huffman is one component in most compression schemes. Implement a basic Huffman encoder in C#.
```

#### 20.4 LZ Compression
```
Explain Lempel-Ziv compression: the key insight (replace repeated strings with backward references into a sliding window). Cover LZ77 (sliding window: reference = offset + length into previous output), LZ78 (dictionary: build a dictionary of phrases), and LZW (dictionary-based, used in GIF and old TIFF — legal issues). Explain the sliding window and dictionary trade-offs. Show a simple LZ77 implementation concept in C#. Explain why LZ-based compression compresses code and text so well (programs have many repeated keywords and patterns). Cover LZ as the backbone of deflate, LZ4, and zstd.
```

#### 20.5 Deflate, Zlib, and Gzip
```
Explain the deflate format: combination of LZ77 (back-references) and Huffman coding (code the symbols and lengths/distances). Cover the deflate block types (uncompressed, fixed Huffman, dynamic Huffman), and how dynamic Huffman trees are transmitted at the start of each block. Explain the layering: deflate (raw compressed data) + zlib wrapper (Adler-32 checksum + 2-byte header) + gzip wrapper (CRC-32, filename, OS metadata). Show .NET: DeflateStream, ZLibStream (.NET 6+), GZipStream — the layering, when to use which. Cover gzip vs zip (zip is a container for multiple files with individual gzip streams).
```

#### 20.6 Brotli
```
Explain Brotli (RFC 7932): Google's compression format designed for web content, combining a static dictionary of common HTML/CSS/JS strings (120 entries covering common web patterns), an LZ77-style sliding window (max 16MB vs deflate's 32KB), Huffman coding, and second-order context modeling. Show that Brotli achieves 15-25% better compression than gzip at comparable speeds. Cover browser support (Accept-Encoding: br), when to use Brotli vs gzip (Brotli for static pre-compressed assets, both for dynamic), and .NET: BrotliStream (for streaming), BrotliEncoder/BrotliDecoder (for buffers). Cover ASP.NET Core Brotli compression middleware.
```

#### 20.7 LZ4 and Zstandard
```
Explain LZ4 and Zstandard (zstd) as the modern speed-focused compression formats. LZ4: extremely fast (multi-GB/s decompression), moderate compression ratio, simple LZ-based algorithm, used in databases (RocksDB, ClickHouse), Docker layers, and OS swap. Zstandard: excellent compression ratio matching or beating zlib, much faster than zlib, dictionary support for repeated small messages (critical for RPC/messaging), developed by Facebook. Show .NET support: K4os.Compression.LZ4 NuGet for LZ4, ZstdSharp/Zstandard.Net for zstd. Include a benchmark comparison table of ratio, speed, and memory for all formats.
```

#### 20.8 Compression in .NET
```
Comprehensive guide to .NET compression APIs: GZipStream (gzip format, wraps DeflateStream), DeflateStream (raw deflate), ZLibStream (.NET 6+, zlib format with header/checksum), BrotliStream (streaming brotli), BrotliEncoder/BrotliDecoder (buffer-based brotli, optimal quality setting). Cover the compress/decompress pattern (wrap output stream for compression, wrap input stream for decompression), memory/span-based compression (no stream allocation), compression level (Fastest, Optimal, SmallestSize, NoCompression), and async compression. Show ASP.NET Core response compression middleware configuration for dynamic compression.
```

#### 20.9 When to Compress
```
Provide a practical decision guide for when to use compression in .NET applications: HTTP response compression (text/HTML/JSON: yes, images/videos: no — already compressed), database storage (JSONB compression, LOB compression), message queues (compress payloads >1KB), log files (compress old logs), API request bodies (gzip POST bodies for large payloads), and inter-service communication (Protobuf instead of JSON is more effective than compressing JSON). Cover the CPU vs bandwidth trade-off and when compression helps vs hurts (small payloads, already compressed data, CPU-bound services).
```

---

### 21. Error Detection & Correction

#### 21.1 Why Errors Happen
```
Explain why bit errors occur: thermal noise in electronics, cosmic rays (high-energy particles flipping bits — happens more in DRAM than many realize), electromagnetic interference, transmission medium degradation (radio, fiber), alpha particle emissions from chip packaging, and wear in flash storage (bit flip probability increases as cells age). Explain the distinction between soft errors (bit flip, data not physically damaged) and hard errors (physical defect). Cover error rates: DRAM has ~1 bit flip per GB per month without ECC. Motivate why storage and network protocols need error detection and correction.
```

#### 21.2 Parity Bits
```
Explain parity bits: the simplest error detection scheme, adding one bit such that the total number of 1-bits is even (even parity) or odd (odd parity). Show how to compute parity: XOR all bits (popcount mod 2). Cover capabilities: detects any odd number of bit flips, cannot detect even number of flips, cannot locate the error (no correction). Extend to 2D parity (matrix parity): can both detect and correct single-bit errors, detect (not correct) 2-bit errors. Show 2D parity with an 8x8 bit grid. Implement parity computation in C# using BitOperations.PopCount() and XOR.
```

#### 21.3 Hamming Code
```
Explain Hamming codes: the first single-error correcting code (1950), placing parity bits at power-of-2 positions to create overlapping parity groups that uniquely identify the error position. Walk through Hamming(7,4): 4 data bits + 3 parity bits, which positions are parity bits (1, 2, 4), how each parity bit covers specific data bits, encoding a 4-bit message, introducing a single-bit error, and decoding to find and fix the error position. Extend to Hamming(8,4) (SECDED — single error correct, double error detect by adding an overall parity bit). Implement Hamming(7,4) encode/decode in C#.
```

#### 21.4 CRC for Error Detection
```
Explain CRC as a burst error detector: polynomial division in GF(2), the generator polynomial determines what errors are detected, common polynomials and their error detection capabilities (CRC-32 detects: all 1/2/3-bit errors, all odd-bit errors, all burst errors up to 32 bits). Cover CRC in Ethernet frames (CRC-32), USB (CRC-16), and SD cards (CRC-16). Explain why CRC is error detection, not correction (you know an error occurred but not where). Show that a bad CRC triggers retransmission at the protocol layer. Show how Ethernet and TCP/IP use CRC32/checksum together.
```

#### 21.5 Reed-Solomon Codes
```
Explain Reed-Solomon error correction: a block code that can correct multiple errors and erasures, based on polynomial evaluation over Galois fields. Cover how RS codes work conceptually (the message is a polynomial, codeword is evaluations at multiple points — any k of n points can reconstruct the polynomial). Cover real-world applications: CDs (CIRC with 2-layer RS), DVDs (cross-interleaved RS), QR codes (RS allowing up to 30% of codeword corruption with level H), deep-space communication (Voyager), RAID-6 (2 RS parity disks). Explain why RS codes are "the code that saved digital media." Show the QR code RS level selection in .NET ZXing.
```

#### 21.6 LDPC and Turbo Codes
```
Explain modern forward error correction (FEC) codes used in communications: Turbo codes (1993, near Shannon limit, used in 3G/4G LTE), LDPC (Low-Density Parity-Check, near Shannon limit, used in 5G NR, Wi-Fi 802.11n/ac, DVB-S2, NVMe). Cover the concept of sparse parity-check matrices and iterative belief propagation decoding. Explain the Shannon limit (theoretical maximum information rate for a given noise level). Discuss where these appear in contexts relevant to .NET developers: NVMe SSDs use LDPC internally, Wi-Fi uses LDPC, and streaming protocols may use FEC. No deep math required.
```

#### 21.7 ECC Memory and Storage Checksums
```
Explain ECC (Error-Correcting Code) memory: DIMM modules with extra chips that store Hamming/SEC-DED codes, hardware ECC controller corrects single-bit errors silently and reports double-bit errors, and why ECC matters for server reliability (cosmic ray bit flips). Cover storage checksums: ZFS (end-to-end checksums for every block, can detect and heal silent data corruption using RAID-Z redundancy), BTRFS (similar approach), and NVMe's end-to-end data protection (T10 DIF). Explain why checksums in storage differ from network checksums (storage keeps data for years, not seconds). Relate to why .NET applications should checksum critical stored data.
```

#### 21.8 Integrity in .NET
```
Show how to implement data integrity verification in .NET applications: computing SHA-256 checksums of files for distribution, verifying database record integrity (storing a hash with the record to detect tampering), streaming checksum computation for large files (incremental hashing with IncrementalHash), using Crc32 for fast non-security checksums (System.IO.Hashing), and detecting file corruption in a local cache. Build a complete file integrity manifest (compute hashes for a directory, save to JSON, verify later). Cover HMAC for authenticated integrity (tamper detection, not just error detection).
```

---

### 22. Data Structures at the Memory Level

#### 22.1 Arrays
```
Explain arrays at the memory level: contiguous block of identically-sized elements, element access by address = base + index × element_size (O(1)), spatial locality (iterating sequentially loads one cache line per few elements), hardware prefetcher efficiency, and bounds checking overhead in .NET (CLR inserts bounds checks that JIT eliminates when provably safe). Cover multidimensional arrays (row-major layout in .NET — T[,] vs jagged T[][] with different performance characteristics). Show how the JIT eliminates bounds checks in common patterns. Compare array vs List<T> memory layout and access patterns.
```

#### 22.2 Linked Lists
```
Explain linked lists at the memory level: each node is a separate heap allocation, nodes scattered throughout memory, cache behavior (each node access is likely a cache miss — pointer chasing), O(n) traversal means O(n) cache misses vs array's O(n/64) cache line loads. Show benchmark: iterating LinkedList<T> vs List<T> for 1 million elements (linked list can be 10-100x slower due to cache misses). Explain when linked lists are actually used (O(1) insertion/deletion at known position, frequent modification mid-list, dequeue). Show LinkedList<T> in .NET. Discuss alternatives: ArrayDeque, circular buffer.
```

#### 22.3 Hash Tables
```
Explain hash tables at the memory level: an array of buckets indexed by hash code % bucket count, open addressing (linear probing, quadratic probing, robin hood hashing — elements stored in the array itself) vs separate chaining (each bucket is a linked list or array). Cover load factor, rehashing (when to grow — typically at 75% full for open addressing), the performance cliff at high load factor. Explain .NET's Dictionary<TKey, TValue> implementation (open addressing with prime-numbered bucket count in older versions, power-of-2 with Fibonacci hashing in .NET 6+). Cover HashSet<T> as a set backed by the same structure.
```

#### 22.4 Trees
```
Explain tree data structures at the memory level: BST (binary search tree — each node has left/right child pointers, random memory layout, poor cache behavior), self-balancing trees (AVL, Red-Black — used in SortedDictionary<T,K> in .NET), and B-trees/B+ trees (wide nodes that fit multiple keys in one cache line — used in databases). Explain why B-trees dominate in databases (cache-efficient, reduce disk I/O). Cover trie/prefix trees for string data. Show SortedDictionary<T,K> (Red-Black tree), SortedList<T,K> (sorted array — better cache for reads), and their performance characteristics.
```

#### 22.5 .NET Collections Memory Layout
```
Explain the internal memory layout of common .NET collections: List<T> (backing T[] array, Count, Capacity, doubles on overflow), Dictionary<TKey,TValue> (int[] _buckets array pointing into Entry[] _entries array — the entries are stored contiguously), Stack<T> (T[] array, top pointer), Queue<T> (circular buffer T[] array, head/tail pointers), HashSet<T> (same as Dictionary without values). Show how to avoid resizing allocations (pre-size with constructor capacity). Explain ImmutableDictionary and why it's a tree internally. Cover CollectionsMarshal.AsSpan(list) for zero-copy List<T> access.
```

#### 22.6 SoA vs AoS
```
Explain Structure of Arrays (SoA) vs Array of Structures (AoS) and their cache performance implications. AoS: typical OOP layout — array of objects, each object has all its fields. SoA: separate arrays for each field — float[] X, float[] Y, float[] Z instead of Vector3[]. Show the performance difference: updating all X positions of 100,000 entities processes 100,000 × 4 bytes = 400KB contiguously (SoA, fits in L2), vs 100,000 × 12 bytes = 1.2MB spread out in AoS (doesn't fit in L2). Include a BenchmarkDotNet comparison. Explain when to use each (SoA for data-processing, AoS for objects with rich behavior). Show .NET struct-of-arrays pattern.
```

#### 22.7 ArrayPool and MemoryPool
```
Comprehensive guide to buffer pooling in .NET to avoid GC pressure: ArrayPool<T>.Shared (rent and return byte arrays, thread-safe, buckets by power-of-2 sizes), ArrayPool<T>.Create() (custom pools with specific max size and array per bucket), MemoryPool<T>.Shared (returns IMemoryOwner<T> — implements IDisposable for safe return), and CommunityToolkit.HighPerformance's SpanOwner<T> and MemoryOwner<T>. Show correct usage patterns: rent → use → return in try/finally. Cover the danger of using a returned array. Include a benchmark showing allocation reduction with pooling for a high-throughput HTTP middleware scenario.
```

#### 22.8 Span and Memory as Zero-Copy Views
```
Show advanced patterns for zero-copy data processing in .NET using Span<T> and Memory<T>: parsing a binary file format without copying data (slice the original Span), building a CSV parser that returns ReadOnlySpan<char> rows and fields (no string allocation), splitting a large buffer into logical segments without copying, and implementing a ring buffer. Cover SequenceReader<T> (built on ReadOnlySequence<T> — handles non-contiguous memory). Show how ASP.NET Core's request body reading uses Memory<byte> for zero-copy HTTP parsing. Include allocation counts using BenchmarkDotNet MemoryDiagnoser.
```

---

### 23. Text Processing at the Byte Level

#### 23.1 String Internals in .NET
```
Explain how .NET strings are stored in memory: the String object layout (object header, method table pointer, length field as int, then UTF-16 chars as char[]). Show that a string with N characters takes ~26 + 2N bytes on 64-bit (object overhead + length + chars). Explain immutability (strings are sealed and immutable — modifications create new strings), null terminator (CLR adds a null char for P/Invoke compatibility but it's not counted in Length), and string reference semantics. Cover .NET 5+ string improvements and UTF-8 support. Show how to observe string memory usage in a dotnet-dump.
```

#### 23.2 String Interning
```
Explain string interning in .NET: the intern pool (a dictionary mapping string content to a single shared instance), automatic interning of compile-time string literals, string.Intern() (add to intern pool), string.IsInterned() (check if interned, return interned instance if so), and reference equality for interned strings (same content → same reference). Show when interning saves memory (many duplicate strings — e.g., column names in a table parser). Cover the trade-off: interned strings are never GC'd (memory leak risk for dynamic strings). Explain why modern .NET code rarely needs manual interning (prefer Dictionary<string, string> deduplicated cache instead).
```

#### 23.3 ReadOnlySpan<char>
```
Show how to use ReadOnlySpan<char> for zero-allocation string processing in .NET: splitting without allocating substrings (MemoryExtensions.Split/.TryReadTo), trimming (AsSpan().Trim()), searching (IndexOf, Contains, StartsWith, EndsWith on spans), parsing numbers from spans (int.TryParse(span), double.TryParse(span)), and building a zero-allocation CSV parser that processes a large file line by line with no string allocations per field. Include a BenchmarkDotNet comparison showing string vs ReadOnlySpan<char> allocation counts for a parsing scenario.
```

#### 23.4 StringBuilder vs Concatenation
```
Explain the performance and memory characteristics of string building approaches in C#: string concatenation with + (creates a new string per +, O(n²) for n concatenations in a loop), string.Concat() and string.Format() (better for small fixed number), StringBuilder (amortized O(n), internal char[] that doubles — like List<T>), string.Create() (.NET 6+, allocate exact size upfront with writer action), DefaultInterpolatedStringHandler (compiler uses this for interpolated strings since C# 10), and Span-based approaches. Show memory allocation benchmarks for each. Include the compiler's transformation of + chains.
```

#### 23.5 Searching Bytes and Chars
```
Show efficient searching in byte and char spans in .NET: IndexOf on Span<byte>/Span<char> (JIT uses SIMD when available), SequenceEqual for equality comparison (also SIMD-accelerated), MemoryExtensions.IndexOf, Contains, StartsWith, EndsWith. Cover the SIMD acceleration in .NET's built-in search (VPCMPEQB instruction vectorizes byte searching). Compare StringComparison options (Ordinal, OrdinalIgnoreCase, InvariantCulture). Show how to search for a pattern (Boyer-Moore conceptually, and why Span.IndexOf is typically sufficient). Include benchmarks showing SIMD speedup for searching.
```

#### 23.6 Parsing Binary Data
```
Show how to parse binary data in .NET using BinaryPrimitives and BitConverter: reading integers of various sizes and endianness from byte spans (BinaryPrimitives.ReadInt32BigEndian, ReadUInt16LittleEndian, etc.), reading floats (BinaryPrimitives.ReadSingleBigEndian in .NET 7+), reading from a MemoryStream (BinaryReader), and working with raw structs via MemoryMarshal.Read<T>(). Build a complete binary file parser for a known format (e.g., PNG file header with signature, IHDR chunk). Show the BinaryReader approach vs Span-based approach, including allocation and performance differences.
```

#### 23.7 Binary Protocol Parser in .NET
```
Build a complete binary protocol parser in .NET using System.IO.Pipelines and Span<T>: a length-prefixed framing protocol (4-byte big-endian length + payload), parsing frames from a PipeReader, handling partial reads (frame not yet fully received), processing multiple frames from one read, and backpressure. Show the SequenceReader<byte> API for parsing from non-contiguous memory. Implement a TLV (Type-Length-Value) parser. Compare the Pipelines approach vs Stream approach for performance and correctness. This section ties together Pipelines, BinaryPrimitives, Span, and protocol design.
```

#### 23.8 Text Encoding Conversion
```
Show how to convert between text encodings in .NET: Encoding.Convert(srcEncoding, dstEncoding, bytes), TranscodingStream (.NET 5+ — wraps a stream to convert encoding on the fly), and efficient pipelines for large file transcoding. Show converting a Latin-1 encoded legacy file to UTF-8, detecting (best-effort) encoding of a file (StreamReader with BOM detection, chardet-style heuristics), and re-encoding a large CSV from Windows-1252 to UTF-8 without loading the entire file into memory. Cover the fallback behavior for unmappable characters (EncoderFallback: Replace, Exception, BestFit).
```

---

### 24. Performance & Low-Level Optimization in .NET

#### 24.1 Profiling Tools
```
Practical guide to performance profiling tools for .NET: dotnet-trace (cross-platform CPU profiling, ETW on Windows, EventPipe everywhere), dotnet-counters (live runtime metrics — GC, thread pool, JIT, ASP.NET Core request rate), dotnet-dump (memory heap analysis), PerfView (Windows — deepest ETW analysis, GC event timelines, allocation call stacks), JetBrains dotTrace/dotMemory, Visual Studio Diagnostic Tools, and Linux perf + speedscope. Show a complete profiling workflow: observe symptom → capture trace → open in PerfView/speedscope → identify hot path → measure with BenchmarkDotNet → fix → verify.
```

#### 24.2 Allocation-Free Code
```
Practical guide to writing allocation-free code in .NET: avoiding LINQ in hot paths (use foreach + manual filter), using structs instead of classes for short-lived data, using Span<T> instead of arrays for temporary buffers, stackalloc for small temporary buffers, avoiding string concatenation in hot paths (use Span or string.Create), avoiding boxing (use generic interfaces, don't assign structs to object/interface without care), using value tasks (ValueTask<T>) for frequently-completing async operations, and pooling objects (ObjectPool<T>). Show a before/after refactoring of a hot path with BenchmarkDotNet MemoryDiagnoser measurements.
```

#### 24.3 Value vs Reference Type Performance
```
Provide a nuanced guide to choosing value types (struct) vs reference types (class) for performance: structs avoid heap allocation and GC pressure but copying is expensive for large structs (>16 bytes rule of thumb), struct equality requires override of Equals/GetHashCode, structs in arrays are contiguous (cache-friendly), classes have 16-byte overhead per object (on 64-bit), and interface dispatch on structs causes boxing. Show benchmarks: passing a small struct by value vs reference, iterating struct array vs class array (cache line differences), and the boxing cost of interface calls on structs. Cover the record struct as the modern immutable struct pattern.
```

#### 24.4 stackalloc
```
Explain stackalloc in C#: allocating memory on the stack instead of the heap (instant allocation/deallocation, no GC), the syntax (Span<byte> buf = stackalloc byte[128]), the limitation (only for value types, limited stack size — stay under ~1KB to be safe), and when to use it (small temporary buffers, parsing, formatting). Show how stackalloc with Span<byte> is safe (vs the old unsafe byte* version), integrates with ReadOnlySpan, and works with BinaryPrimitives. Cover the LocalsInit attribute for skipping zero-initialization. Include a benchmark showing stackalloc vs ArrayPool for various buffer sizes.
```

#### 24.5 Inlining and JIT Hints
```
Explain JIT hints in C#: [MethodImpl(MethodImplOptions.AggressiveInlining)] to strongly suggest inlining (when the method is small but JIT won't inline due to heuristics), [MethodImpl(MethodImplOptions.NoInlining)] to prevent inlining (when you want clean call stacks for profiling or diagnostics), [MethodImpl(MethodImplOptions.AggressiveOptimization)] (Tier 1 from first call, skip Tier 0). Cover devirtualization: how the JIT can convert a virtual call to a direct call when the concrete type is known (sealed classes, local variables), and how [MethodImpl] enables this. Show SharpLab evidence. Cover Vector.IsHardwareAccelerated.
```

#### 24.6 SIMD Vectorization
```
Show how to write SIMD-vectorized code in .NET: auto-vectorization (when the JIT automatically vectorizes simple loops — conditions: no data dependencies, no branches, Span<T> indexing), manual vectorization with Vector<T> (portable, adapts to platform), and explicit intrinsics (Vector256<float>, Avx.Add() — maximum control, ISA-specific). Show a complete example: summing a float[] with scalar loop, Vector<float> loop, and Avx.Add() intrinsics, with benchmarks showing the speedup. Cover ISA detection (Avx2.IsSupported) and fallback paths. Show common patterns: dot product, min/max, byte searching.
```

#### 24.7 BenchmarkDotNet
```
Comprehensive guide to BenchmarkDotNet for .NET micro-benchmarking: setting up benchmarks ([Benchmark], [Setup], [GlobalSetup], [Params]), running benchmarks correctly (always run in Release mode, correct targeting), the Memory Diagnoser ([MemoryDiagnoser]) for allocation tracking, Disassembly Diagnoser ([DisassemblyDiagnoser(printSource: true)]) for JIT output, Hardware Counters ([HardwareCounters(HardwareCounter.CacheMisses)]), and comparing multiple implementations. Cover common benchmarking mistakes (measuring startup, not isolating GC, using wrong job). Include a complete benchmark class comparing string parsing approaches. Show how to interpret results (mean, error, StdDev, alloc).
```

#### 24.8 Cache-Friendly .NET Code
```
Practical guide to writing cache-friendly code in .NET: use arrays instead of linked lists for sequential processing, iterate in row-major order for 2D arrays (T[row, col] not T[col, row]), pack hot fields together in structs (fields accessed together should be in the same struct/class), separate hot and cold fields (rarely used fields into a separate "cold" companion object), use SoA layout for data-heavy processing, prefer value types in arrays over reference types (avoid pointer chasing), and keep hot data structures under cache size. Show each pattern with a benchmark demonstrating the cache performance difference.
```

#### 24.9 Reducing GC Pressure
```
Comprehensive guide to GC pressure reduction techniques in .NET: object pooling (ObjectPool<T> from Microsoft.Extensions.ObjectPool, custom pools with ConcurrentBag/ConcurrentQueue), ArrayPool<T> for byte arrays, avoiding LINQ allocations in hot paths (IEnumerable<T> allocates enumerator, captured lambda allocates closure), using struct enumerators (foreach on List<T> doesn't box because List<T>.Enumerator is a struct), ValueTask<T> instead of Task<T> for frequently-synchronous async methods, and string deduplication (GC.RegisterForFullGCNotification, or Dictionary-based dedup). Measure with dotnet-counters Gen0/Gen1 collection rate.
```

#### 24.10 System.Runtime.CompilerServices.Unsafe
```
Explain System.Runtime.CompilerServices.Unsafe: a collection of low-level, unsafe operations that bypass normal .NET safety checks. Cover: Unsafe.As<TFrom, TTo>(ref value) (reinterpret a reference — reinterpret a float as int without copying), Unsafe.SizeOf<T>() (sizeof for any type including generics), Unsafe.Add/Subtract (pointer arithmetic on managed references), Unsafe.Read/Write (reading/writing arbitrary memory locations), Unsafe.NullRef<T> / IsNullRef (null managed references), and Unsafe.SkipInit<T> (skip initialization of a local). Show use cases: zero-copy float bit manipulation, fast struct copying, and extreme performance parsing. Explain when these are appropriate vs dangerous.
```

---

### 25. Interoperability & Platform Considerations

#### 25.1 P/Invoke
```
Comprehensive guide to P/Invoke in .NET: the [DllImport] attribute (function name, calling convention, charset), marshaling primitive types (int ↔ int32_t, bool ↔ BOOL vs bool, string ↔ LPWSTR), marshaling structs (blittable vs non-blittable, In/Out, ref vs pointer), marshaling arrays (fixed-size vs variable, LPArray), SafeHandle for native handle lifetime management, and the new [LibraryImport] (.NET 7+ source-generated marshaling, AOT-compatible, no runtime marshaling overhead). Show a complete example calling a Win32 function (CreateFile or GetSystemInfo) and a cross-platform example calling a libc function.
```

#### 25.2 COM Interop
```
Explain COM (Component Object Model) interop in .NET: the COM programming model (interface-based, reference counting via IUnknown, GUID-identified interfaces), Runtime Callable Wrappers (RCW — .NET wrapper around COM objects), COM-Callable Wrappers (CCW — COM wrapper around .NET objects), and the Primary Interop Assembly (PIA). Cover COM interop in practice: using Microsoft Office interop assemblies, WMI (Windows Management Instrumentation) via ManagementObject, and legacy COM components. Cover the NoPIA approach (embed interop types). Explain why COM interop is mostly legacy — prefer Windows Runtime (WinRT) for modern Windows APIs.
```

#### 25.3 Platform-Specific Data Sizes
```
Explain platform-dependent types in .NET: nint and nuint (pointer-sized integers — 32-bit on 32-bit systems, 64-bit on 64-bit systems), IntPtr and UIntPtr (older equivalents), and why pointer-sized types matter for interop (matching the size of SIZE_T, HANDLE, and pointer parameters in Win32 APIs). Cover RuntimeInformation.OSArchitecture and RuntimeInformation.ProcessArchitecture for runtime platform detection. Explain unsafe.SizeOf<IntPtr>() == 8 on 64-bit. Show how platform-specific sizes affect binary protocol compatibility and struct layouts for cross-platform data exchange.
```

#### 25.4 Cross-Platform Endianness
```
Show how to write cross-platform binary code in .NET that handles endianness correctly: using BinaryPrimitives (ReadInt32BigEndian/LittleEndian, WriteInt32BigEndian/LittleEndian) instead of BitConverter (platform-dependent), checking BitConverter.IsLittleEndian only when necessary, IPAddress.NetworkToHostOrder for network protocols, and MemoryMarshal.Cast for reading typed spans (endianness caveat). Build a cross-platform binary file reader that correctly reads a format with specified byte order. Show the common bug: using BitConverter on a big-endian format on a little-endian machine. Include a test that verifies endianness-correct behavior on any platform.
```

#### 25.5 Blittable Types and Marshal
```
Explain blittable types in .NET interop: types that have the same memory representation in managed and unmanaged memory (can be "pinned" and passed directly to native code without marshaling). Blittable: byte, sbyte, short, ushort, int, uint, long, ulong, float, double, arrays of blittable types, structs with only blittable fields and StructLayout. Non-blittable: bool (different sizes), char (UTF-16 in .NET vs char in C), string, arrays of non-blittable. Show how to use Marshal.StructureToPtr, Marshal.PtrToStructure, and GCHandle.Alloc for passing structs to native code. Explain why blittable types are faster in P/Invoke.
```

#### 25.6 Memory Alignment
```
Explain memory alignment requirements: why data must be aligned (processors access memory in aligned words — misaligned access is slow or causes a fault on some architectures), natural alignment (T must be at address divisible by sizeof(T)), and SIMD alignment (AVX requires 32-byte alignment for best performance, though modern Intel CPUs handle unaligned with a small penalty). Show how to control alignment in .NET: [StructLayout(Pack=1)] to remove padding (breaks alignment for interop), NativeMemory.AlignedAlloc for SIMD-aligned native buffers, and [FieldOffset] for explicit alignment. Cover how .NET's GC ensures proper alignment of managed objects.
```

#### 25.7 IMemoryOwner and Native Memory
```
Explain the IMemoryOwner<T> pattern for safe native memory management in .NET: the interface (Memory<T> Memory, IDisposable), how it provides a Dispose-pattern wrapper around native memory allocations, implementing a custom NativeMemoryManager<T> that wraps NativeMemory.Alloc and frees on Dispose, and integrating with the Memory<T>/Span<T> ecosystem. Show how System.IO.Pipelines uses IMemoryOwner internally. Cover MemoryPool<T> as a factory for IMemoryOwner. Include a complete example: allocating a SIMD-aligned native buffer wrapped as IMemoryOwner<float> for use with AVX operations.
```

---

## Quick Reference: .NET Low-Level APIs

| Use Case | .NET API | Notes |
|---|---|---|
| Base conversions | `Convert.ToString(n, 2/8/16)` | Binary, octal, hex |
| Hex encode/decode | `Convert.ToHexString()` / `FromHexString()` | .NET 5+ |
| Base64 encode/decode | `Convert.ToBase64String()` / `System.Buffers.Text.Base64` | Use Base64 for spans |
| Base64Url | `System.Buffers.Text.Base64Url` | .NET 8+ |
| Endianness-safe reads | `System.Buffers.Binary.BinaryPrimitives` | |
| Bit operations | `System.Numerics.BitOperations` | PopCount, LeadingZeroCount, etc. |
| Checked arithmetic | `checked { }` block / `checked()` operator | |
| Arbitrary precision int | `System.Numerics.BigInteger` | |
| Float bit manipulation | `BitConverter.SingleToInt32Bits()` | |
| Composite hash code | `System.HashCode.Combine()` | |
| Fast checksums | `System.IO.Hashing.Crc32` / `xxHash32` | .NET 6+ |
| GC inspection | `System.GC.GetGCMemoryInfo()` | |
| Object pooling | `Microsoft.Extensions.ObjectPool` | |
| Array pooling | `System.Buffers.ArrayPool<T>.Shared` | |
| Stack allocation | `stackalloc` + `Span<T>` | |
| Span-based I/O | `System.IO.Pipelines` | |
| Unsafe type reinterpret | `System.Runtime.CompilerServices.Unsafe.As<>()` | |
| Native memory | `System.Runtime.InteropServices.NativeMemory` | .NET 6+ |
| Struct layout control | `[StructLayout]`, `[FieldOffset]` | |
| P/Invoke (modern) | `[LibraryImport]` | .NET 7+ |
| SIMD portable | `System.Numerics.Vector<T>` | |
| SIMD explicit | `System.Runtime.Intrinsics.Vector256<T>` | ISA-specific |
| Compression | `GZipStream`, `BrotliStream`, `ZLibStream` | |
| Unicode iteration | `string.EnumerateRunes()`, `Rune` | |
| Encoding convert | `System.Text.Encoding` / `TranscodingStream` | |
| Platform detection | `System.Runtime.InteropServices.RuntimeInformation` | |

---

## Quick Reference: Numeric Type Sizes & Ranges

| C# Type | CLR Type | Size | Range / Notes |
|---|---|---|---|
| `bool` | System.Boolean | 1 byte | true / false |
| `byte` | System.Byte | 1 byte | 0 to 255 |
| `sbyte` | System.SByte | 1 byte | -128 to 127 |
| `short` | System.Int16 | 2 bytes | -32,768 to 32,767 |
| `ushort` | System.UInt16 | 2 bytes | 0 to 65,535 |
| `int` | System.Int32 | 4 bytes | -2,147,483,648 to 2,147,483,647 |
| `uint` | System.UInt32 | 4 bytes | 0 to 4,294,967,295 |
| `long` | System.Int64 | 8 bytes | ±9.2 × 10¹⁸ |
| `ulong` | System.UInt64 | 8 bytes | 0 to 18.4 × 10¹⁸ |
| `nint` | System.IntPtr | 4 or 8 bytes | Platform pointer size |
| `nuint` | System.UIntPtr | 4 or 8 bytes | Platform pointer size |
| `float` | System.Single | 4 bytes | ±3.4×10³⁸, ~7 decimal digits |
| `double` | System.Double | 8 bytes | ±1.7×10³⁰⁸, ~15-16 decimal digits |
| `decimal` | System.Decimal | 16 bytes | ±7.9×10²⁸, 28-29 decimal digits |
| `Half` | System.Half | 2 bytes | ±65504, ~3.3 decimal digits (.NET 6+) |
| `char` | System.Char | 2 bytes | UTF-16 code unit (U+0000–U+FFFF) |
| `BigInteger` | System.Numerics.BigInteger | Variable | Arbitrary precision |

---

*Document version: 1.0 — Covers .NET 6 / .NET 8 LTS, C# 11/12, and software-layer computer systems concepts*