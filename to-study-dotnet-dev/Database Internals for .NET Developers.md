# Database Internals for .NET Developers
## Compact Learning Guide with Prompts

> Each section has a prompt. Paste it to generate full content. Compact format — concept + .NET angle.

---

## Table of Contents

1. [How Databases Work — Big Picture](#1-how-databases-work)
   - 1.1 [Database Architecture — Components & Layers](#11-database-architecture)
   - 1.2 [Storage Engine vs Query Engine](#12-storage-vs-query-engine)
   - 1.3 [Row-Oriented vs Column-Oriented Storage](#13-row-vs-column-storage)
   - 1.4 [In-Memory vs Disk-Based Databases](#14-in-memory-vs-disk)
   - 1.5 [OLTP vs OLAP — Design Trade-offs](#15-oltp-vs-olap)
   - 1.6 [Database Internals Relevance for .NET Developers](#16-relevance-for-net)

2. [Storage Internals](#2-storage-internals)
   - 2.1 [Pages & Disk Layout — The Fundamental Unit](#21-pages--disk-layout)
   - 2.2 [Heap Files — Unordered Row Storage](#22-heap-files)
   - 2.3 [Slotted Pages — Variable-Length Row Storage](#23-slotted-pages)
   - 2.4 [Buffer Pool — In-Memory Page Cache](#24-buffer-pool)
   - 2.5 [Page Eviction — Clock & LRU Policies](#25-page-eviction)
   - 2.6 [Write-Ahead Log (WAL) — Crash Consistency](#26-wal)
   - 2.7 [Checkpointing](#27-checkpointing)
   - 2.8 [File Formats — How Databases Store Data on Disk](#28-file-formats)

3. [Indexing](#3-indexing)
   - 3.1 [Why Indexes Exist — Full Table Scan vs Index Scan](#31-why-indexes)
   - 3.2 [B-Tree Index — Structure, Splits, Merges](#32-b-tree-index)
   - 3.3 [B+ Tree — Leaf Node Linking & Range Scans](#33-b-plus-tree)
   - 3.4 [Hash Index — O(1) Point Lookups](#34-hash-index)
   - 3.5 [Clustered vs Non-Clustered Index](#35-clustered-vs-non-clustered)
   - 3.6 [Covering Index — Index-Only Scans](#36-covering-index)
   - 3.7 [Composite Index — Column Order Matters](#37-composite-index)
   - 3.8 [Partial Index — Index a Subset of Rows](#38-partial-index)
   - 3.9 [Index on Expressions & Computed Columns](#39-expression-index)
   - 3.10 [Full-Text Index](#310-full-text-index)
   - 3.11 [Bitmap Index — For Low-Cardinality Columns](#311-bitmap-index)
   - 3.12 [Index Maintenance — Fragmentation & Rebuild](#312-index-maintenance)
   - 3.13 [Indexing Strategy for .NET / EF Core](#313-indexing-in-net)

4. [Query Execution](#4-query-execution)
   - 4.1 [Query Lifecycle — Parse, Plan, Execute](#41-query-lifecycle)
   - 4.2 [Query Parser & AST](#42-query-parser)
   - 4.3 [Query Optimizer — Cost-Based Optimization](#43-query-optimizer)
   - 4.4 [Statistics — How the Optimizer Estimates Rows](#44-statistics)
   - 4.5 [Query Execution Plans — Reading EXPLAIN](#45-execution-plans)
   - 4.6 [Join Algorithms — Nested Loop, Hash Join, Merge Join](#46-join-algorithms)
   - 4.7 [Sorting — External Sort & Sort Spill to Disk](#47-sorting)
   - 4.8 [Aggregation — Hash Aggregation & Stream Aggregation](#48-aggregation)
   - 4.9 [Execution Plan Caching & Parameterization](#49-plan-caching)
   - 4.10 [Analysing Query Plans from EF Core in .NET](#410-ef-core-plans)

5. [Transactions & ACID](#5-transactions--acid)
   - 5.1 [ACID Properties — What Each Guarantees](#51-acid)
   - 5.2 [Atomicity — All or Nothing](#52-atomicity)
   - 5.3 [Consistency — Application-Level Invariants](#53-consistency)
   - 5.4 [Isolation — Concurrent Transaction Behavior](#54-isolation)
   - 5.5 [Durability — Surviving Crashes](#55-durability)
   - 5.6 [Transaction Lifecycle — Begin, Commit, Rollback](#56-transaction-lifecycle)
   - 5.7 [Savepoints — Partial Rollback](#57-savepoints)
   - 5.8 [Transactions in .NET — ADO.NET, EF Core, TransactionScope](#58-transactions-net)

6. [Isolation Levels & Concurrency Anomalies](#6-isolation-levels)
   - 6.1 [Concurrency Anomalies — Dirty Read, Non-Repeatable Read, Phantom Read](#61-concurrency-anomalies)
   - 6.2 [Read Uncommitted](#62-read-uncommitted)
   - 6.3 [Read Committed — The Common Default](#63-read-committed)
   - 6.4 [Repeatable Read](#64-repeatable-read)
   - 6.5 [Serializable — Strongest Isolation](#65-serializable)
   - 6.6 [Snapshot Isolation — MVCC-Based](#66-snapshot-isolation)
   - 6.7 [Choosing Isolation Level in .NET](#67-isolation-level-net)

7. [Locking & Concurrency Control](#7-locking--concurrency-control)
   - 7.1 [Pessimistic Locking — Lock Before Access](#71-pessimistic-locking)
   - 7.2 [Lock Types — Shared, Exclusive, Update, Intent](#72-lock-types)
   - 7.3 [Lock Granularity — Row, Page, Table](#73-lock-granularity)
   - 7.4 [Lock Escalation](#74-lock-escalation)
   - 7.5 [Deadlocks in Databases — Detection & Retry](#75-database-deadlocks)
   - 7.6 [Optimistic Locking — Check Before Commit](#76-optimistic-locking)
   - 7.7 [MVCC — Multi-Version Concurrency Control](#77-mvcc)
   - 7.8 [SELECT FOR UPDATE / SKIP LOCKED Patterns](#78-select-for-update)
   - 7.9 [Optimistic Concurrency in EF Core — RowVersion / ConcurrencyToken](#79-optimistic-concurrency-net)

8. [MVCC In Depth](#8-mvcc-in-depth)
   - 8.1 [MVCC Fundamentals — Keeping Old Versions](#81-mvcc-fundamentals)
   - 8.2 [PostgreSQL MVCC — xmin, xmax, VACUUM](#82-postgres-mvcc)
   - 8.3 [SQL Server Snapshot Isolation — Version Store in tempdb](#83-sqlserver-snapshot)
   - 8.4 [MySQL InnoDB MVCC — Undo Logs & Purge](#84-mysql-mvcc)
   - 8.5 [MVCC Garbage Collection — The Hidden Cost](#85-mvcc-gc)
   - 8.6 [Long-Running Transactions — MVCC Bloat](#86-mvcc-bloat)

9. [Storage Engines](#9-storage-engines)
   - 9.1 [B-Tree Storage Engines — InnoDB, SQL Server](#91-btree-engines)
   - 9.2 [LSM-Tree — Log-Structured Merge Tree](#92-lsm-tree)
   - 9.3 [LSM Components — MemTable, SSTable, Compaction](#93-lsm-components)
   - 9.4 [RocksDB — LSM in Practice](#94-rocksdb)
   - 9.5 [Comparing B-Tree vs LSM — Write vs Read Trade-offs](#95-btree-vs-lsm)
   - 9.6 [Append-Only Logs & Immutable Storage](#96-append-only)
   - 9.7 [Fractal Tree & Bw-Tree](#97-fractal-bw-tree)

10. [SQL Query Patterns & Performance](#10-sql-performance)
    - 10.1 [N+1 Query Problem — Detection & Fix](#101-n-plus-1)
    - 10.2 [Pagination — OFFSET vs Keyset/Cursor](#102-pagination)
    - 10.3 [Bulk Insert / Update / Delete](#103-bulk-operations)
    - 10.4 [CTEs vs Subqueries vs Temp Tables vs TVFs](#104-cte-vs-subquery)
    - 10.5 [Window Functions — ROW_NUMBER, RANK, LAG, LEAD](#105-window-functions)
    - 10.6 [UPSERT — INSERT … ON CONFLICT / MERGE](#106-upsert)
    - 10.7 [Avoiding SELECT * — Column Projection](#107-select-star)
    - 10.8 [Query Hints & Force Index](#108-query-hints)
    - 10.9 [Stored Procedures vs Application Queries](#109-stored-procedures)
    - 10.10 [SQL Anti-Patterns](#1010-sql-anti-patterns)

11. [EF Core Internals](#11-ef-core-internals)
    - 11.1 [EF Core Architecture — DbContext, Change Tracker, Provider](#111-ef-core-architecture)
    - 11.2 [Change Tracking — Snapshot vs Proxy](#112-change-tracking)
    - 11.3 [Query Translation — LINQ to SQL](#113-query-translation)
    - 11.4 [Compiled Queries — Avoiding Repeated Translation](#114-compiled-queries)
    - 11.5 [AsNoTracking — Read-Only Queries](#115-asnotracking)
    - 11.6 [Loading Strategies — Eager, Lazy, Explicit](#116-loading-strategies)
    - 11.7 [Raw SQL in EF Core — FromSqlRaw, ExecuteSqlRaw](#117-raw-sql)
    - 11.8 [Bulk Operations in EF Core — ExecuteUpdate, ExecuteDelete (.NET 7+)](#118-bulk-ef)
    - 11.9 [EF Core Migrations — How They Work](#119-migrations)
    - 11.10 [DbContext Lifetime & Pooling](#1110-dbcontext-pooling)

12. [Connection Management](#12-connection-management)
    - 12.1 [Connection Pooling — How It Works](#121-connection-pooling)
    - 12.2 [Connection Pool Sizing](#122-pool-sizing)
    - 12.3 [Connection Strings & Security](#123-connection-strings)
    - 12.4 [Connection Pool Exhaustion — Diagnosis & Fix](#124-pool-exhaustion)
    - 12.5 [Async Database Access — Why It Matters](#125-async-database)
    - 12.6 [Resilient Connections — Retry Policies](#126-resilient-connections)

13. [Schema Design](#13-schema-design)
    - 13.1 [Normalization — 1NF, 2NF, 3NF, BCNF](#131-normalization)
    - 13.2 [Denormalization — When & Why](#132-denormalization)
    - 13.3 [Primary Keys — Natural vs Surrogate, UUID vs Int](#133-primary-keys)
    - 13.4 [Foreign Keys & Referential Integrity](#134-foreign-keys)
    - 13.5 [NULL Semantics & Three-Valued Logic](#135-null-semantics)
    - 13.6 [Data Types — Choosing Correctly](#136-data-types)
    - 13.7 [Soft Delete vs Hard Delete](#137-soft-delete)
    - 13.8 [Temporal Tables — History & Audit](#138-temporal-tables)
    - 13.9 [Schema Design for EF Core — Conventions & Fluent API](#139-schema-ef-core)

14. [Replication & High Availability](#14-replication--ha)
    - 14.1 [Replication Fundamentals — Why & How](#141-replication-fundamentals)
    - 14.2 [Synchronous vs Asynchronous Replication](#142-sync-vs-async-replication)
    - 14.3 [Statement-Based vs Row-Based vs Logical Replication](#143-replication-types)
    - 14.4 [Read Replicas — Scale Reads in .NET](#144-read-replicas-net)
    - 14.5 [Failover & Automatic Promotion](#145-failover)
    - 14.6 [Replication Lag — Causes & Handling in .NET](#146-replication-lag)

15. [Sharding & Partitioning](#15-sharding--partitioning)
    - 15.1 [Table Partitioning — Horizontal Partitioning](#151-table-partitioning)
    - 15.2 [Sharding — Application-Level Horizontal Scaling](#152-sharding)
    - 15.3 [Sharding Strategies — Range, Hash, Directory](#153-sharding-strategies)
    - 15.4 [Cross-Shard Queries & Transactions](#154-cross-shard)
    - 15.5 [Consistent Hashing — Shard Rebalancing](#155-consistent-hashing)
    - 15.6 [Sharding in .NET Applications](#156-sharding-net)

16. [Distributed Databases & NewSQL](#16-distributed-databases)
    - 16.1 [CAP Theorem — Consistency, Availability, Partition Tolerance](#161-cap-theorem)
    - 16.2 [PACELC — Extended CAP](#162-pacelc)
    - 16.3 [Distributed Transactions — 2PC & Saga Pattern](#163-distributed-transactions)
    - 16.4 [CockroachDB & YugabyteDB — Distributed SQL](#164-distributed-sql)
    - 16.5 [Google Spanner — TrueTime & External Consistency](#165-spanner)
    - 16.6 [Saga Pattern in .NET](#166-saga-net)

17. [NoSQL Databases](#17-nosql)
    - 17.1 [Document Databases — MongoDB](#171-document-databases)
    - 17.2 [Key-Value Stores — Redis](#172-key-value-redis)
    - 17.3 [Wide-Column Stores — Cassandra](#173-wide-column)
    - 17.4 [Graph Databases — Neo4j](#174-graph-databases)
    - 17.5 [Time-Series Databases — InfluxDB, TimescaleDB](#175-time-series)
    - 17.6 [Search Engines — Elasticsearch, Meilisearch](#176-search-engines)
    - 17.7 [Choosing SQL vs NoSQL for .NET Projects](#177-sql-vs-nosql)

18. [Database Performance Tuning](#18-performance-tuning)
    - 18.1 [Finding Slow Queries — pg_stat_statements, DMVs, Slow Query Log](#181-finding-slow-queries)
    - 18.2 [Index Usage Analysis](#182-index-analysis)
    - 18.3 [Query Plan Analysis — Seq Scan, Index Scan, Hash Join Cost](#183-plan-analysis)
    - 18.4 [Table Statistics & ANALYZE / UPDATE STATISTICS](#184-statistics-maintenance)
    - 18.5 [Connection Overhead & PgBouncer / ProxySQL](#185-connection-poolers)
    - 18.6 [Caching Strategies — Query Cache, Result Cache, Application Cache](#186-caching-strategies)
    - 18.7 [Database Benchmarking — pgbench, sysbench, HammerDB](#187-benchmarking)
    - 18.8 [Performance Tuning EF Core Queries](#188-tuning-ef-core)

19. [Specific Databases for .NET](#19-specific-databases)
    - 19.1 [SQL Server — Features, DMVs, Always On](#191-sql-server)
    - 19.2 [PostgreSQL — Features, Extensions, pg_stat](#192-postgresql)
    - 19.3 [MySQL / MariaDB — InnoDB, Replication](#193-mysql)
    - 19.4 [SQLite — Embedded, Write Locking, WAL Mode](#194-sqlite)
    - 19.5 [Redis in .NET — StackExchange.Redis](#195-redis-net)
    - 19.6 [MongoDB in .NET — Driver, LINQ Provider](#196-mongodb-net)
    - 19.7 [Cosmos DB — Partition Keys, RU/s, Change Feed](#197-cosmos-db)

20. [Database Reliability & Operations](#20-reliability--operations)
    - 20.1 [Backup Strategies — Full, Incremental, Point-in-Time](#201-backup-strategies)
    - 20.2 [Database Migrations in Production — Zero Downtime](#202-production-migrations)
    - 20.3 [Connection Draining & Rolling Restarts](#203-rolling-restarts)
    - 20.4 [Database Observability — Metrics, Logs, Tracing](#204-db-observability)
    - 20.5 [Schema Migrations with EF Core in CI/CD](#205-ef-core-migrations-cicd)

---

## Section Prompts

### 1. How Databases Work

#### 1.1 Database Architecture
```
Explain relational database architecture top-to-bottom: client connection layer (TCP/Unix socket, wire protocol like PostgreSQL protocol or TDS), SQL interface layer (parser, analyzer), query processing layer (optimizer, executor), transaction & concurrency layer (lock manager, MVCC), storage layer (buffer pool, WAL, storage engine). Cover that each query travels through all layers. Show that understanding this stack explains why some queries are slow (optimizer choice), why some blocks occur (lock manager), and why data survives crashes (WAL + storage). Relate each layer to what EF Core and ADO.NET interact with from .NET.
```

#### 1.2 Storage Engine vs Query Engine
```
Explain separation of storage engine (how data is stored, retrieved, and made durable — buffer pool, page format, B-Tree, WAL) and query engine (how queries are parsed, optimized, and executed — optimizer, executor, joins). Cover that MySQL has pluggable storage engines (InnoDB default, MyISAM legacy, RocksDB via plugin), PostgreSQL has one storage engine with pluggable index access methods (btree, hash, GiST, GIN, BRIN, SPGIST). Show that SQL Server has a single integrated engine. Explain why knowing the storage engine matters: InnoDB vs MyISAM has huge transactional and locking differences that affect .NET app behavior.
```

#### 1.3 Row vs Column Storage
```
Explain row-oriented storage (tuple stored together — page has rows: [id, name, age], [id, name, age] — fast for OLTP single-row reads) vs column-oriented (each column stored separately — page has one column: [id, id, id], [name, name, name] — fast for OLAP aggregate queries on few columns, excellent compression). Show why column stores compress better (same column = similar values = run-length encoding). Cover hybrid (PAX — partitioned attributes across — groups columns within row blocks). .NET relevance: PostgreSQL is row-oriented, Redshift/BigQuery/ClickHouse are column-oriented. Use case: read 3 columns from 10M rows → column store reads 3 column files vs row store reads all 10M rows.
```

#### 1.4 In-Memory vs Disk-Based
```
Compare in-memory databases (Redis, VoltDB, H2 in-memory, SQLite :memory: — all data in RAM, no I/O latency, extremely fast) vs disk-based (PostgreSQL, SQL Server, MySQL — data on disk, buffer pool caches hot pages). Cover that in-memory databases still need durability (Redis AOF/RDB, VoltDB snapshots + command log). Explain that "in-memory" for disk databases means buffer pool — hot data effectively in RAM. Show .NET patterns: Redis for session/cache (pure in-memory), PostgreSQL for durable OLTP (disk with hot buffer pool). Cover SQLite in-memory mode for test databases — fast test teardown. Cover memory footprint: in-memory = all data must fit in RAM.
```

#### 1.5 OLTP vs OLAP
```
Compare OLTP (Online Transaction Processing — many concurrent short transactions, row-oriented storage, heavily indexed, optimized for point reads/writes — web app database, ERP) and OLAP (Online Analytical Processing — few complex analytical queries over large data, column-oriented, few indexes but full scans, optimized for aggregations — data warehouse, reporting). Cover HTAP (Hybrid — TiDB, SingleStore — both in one database). Show that running OLAP queries on OLTP databases is a common .NET performance mistake: complex reports on operational PostgreSQL or SQL Server can lock tables, consume I/O, slow down app queries. Solution: read replicas, ETL to data warehouse, or CQRS with separate read model.
```

#### 1.6 Relevance for .NET
```
Explain why database internals matter for .NET developers: slow EF Core queries (index missing, N+1, bad join plan), connection pool exhaustion (too many concurrent queries, long-running transactions), deadlocks (lock ordering, transaction scope too large), data loss bugs (not understanding transaction isolation), migration failures (zero-downtime requires understanding locks). Show that most .NET production incidents involve the database. Provide a "when internals matter" checklist: query taking > 100ms, connection pool at limit, deadlock exceptions, replication lag growing. Cover that understanding internals makes you a 10x better .NET developer even if you never implement a storage engine.
```

---

### 2. Storage Internals

#### 2.1 Pages & Disk Layout
```
Explain database pages: fixed-size unit of I/O (typically 8KB SQL Server/PostgreSQL, 16KB MySQL InnoDB). All reads and writes go through pages — even reading one row reads entire page. Page header (page type, free space offset, LSN, checksum), page body (rows/index entries), free space, page trailer. Cover page cache (buffer pool) — if page in memory, no disk I/O. Show that understanding pages explains: why reading 1 row can be as expensive as reading many rows on same page, why fragmenting rows across many pages is bad (many page reads), why page fill factor matters (leave room for inserts vs pack tightly for reads). Relate to .NET: EF Core retrieving a 10-column row vs 2-column row — may read same page.
```

#### 2.2 Heap Files
```
Explain heap file organization: rows stored in insertion order (no inherent sort), pages with rows in arbitrary positions. Insertion adds to last page (or finds free space via free space map). Updates may need to move row if new row is larger (or use forwarding pointers). Deletes mark row as deleted (dead tuple in PostgreSQL — VACUUM reclaims). Show that heap files with no index = full table scan (reads every page). Cover that PostgreSQL's primary storage is always a heap file (unlike SQL Server/MySQL InnoDB which use clustered B-Trees). Explain why heap + secondary index requires two lookups: index to find row location, heap to fetch actual row (unless covering index).
```

#### 2.3 Slotted Pages
```
Explain slotted page structure: header with slot array (array of offsets pointing to each row on the page), rows stored from bottom up, free space in the middle. Variable-length rows (VARCHAR, TEXT) fit naturally. Slot array allows reordering rows without updating index pointers (index stores slot number, not byte offset). Cover page split: when page is full, new page is allocated, half rows moved (B-Tree splits propagate up). Show that slotted pages explain how databases handle variable-length strings efficiently without wasted space. Cover page compaction (moving rows to remove fragmentation within a page — triggered by VACUUM in PostgreSQL).
```

#### 2.4 Buffer Pool
```
Explain buffer pool (page cache): in-memory cache of disk pages. All reads/writes go through buffer pool — if page in pool, no disk I/O. Components: page frame array (fixed-size memory), page table (mapping page_id → frame), dirty bit (page modified, not yet written to disk), pin count (page in use, don't evict). Read path: check page table → if hit, return frame; if miss, evict a page (LRU/Clock), read from disk, add to table. Write path: modify in buffer pool (dirty bit set), write to disk asynchronously (or on eviction or checkpoint). Show that buffer pool hit rate (typically 99%+) is critical — low hit rate = lots of disk I/O = slow queries.
```

#### 2.5 Page Eviction
```
Cover page eviction policies: LRU (Least Recently Used — evict page not accessed longest, implemented as linked list, O(1) with hash map), Clock/Second Chance (approximate LRU — clock hand sweeps, gives second chance to recently accessed pages — cheaper than LRU), LRU-K (evict page whose K-th most recent access is oldest — resists sequential scan pollution). Cover the sequential scan problem: large table scan brings many pages into buffer pool, evicting hot pages (LRU struggles here). PostgreSQL uses a clock-sweep variant with separate buffers for large sequential scans (ring buffer policy). SQL Server uses LRU-K variant. .NET impact: large EF Core queries loading entire tables evict cached hot data.
```

#### 2.6 WAL
```
Explain Write-Ahead Log: log records written BEFORE data pages modified on disk. Recovery: on crash, replay WAL from last checkpoint to restore committed transactions, undo uncommitted ones. WAL format: LSN (Log Sequence Number), transaction ID, before/after values, page affected. WAL enables: atomicity (undo uncommitted via WAL), durability (redo from WAL on crash), replication (ship WAL to replica — PostgreSQL streaming replication), point-in-time recovery (replay WAL to specific timestamp). Show that fsync of WAL on commit is what makes durability expensive (disk write per commit). Cover group commit: batch multiple transactions' WAL writes → one fsync for many commits.
```

#### 2.7 Checkpointing
```
Explain checkpointing: periodically write all dirty buffer pool pages to disk + record checkpoint LSN in WAL. Recovery only needs WAL from last checkpoint (not entire WAL). Checkpoint types: sharp (pause all writes, flush all dirty pages — old), fuzzy (mark start and end LSN, flush pages that were dirty at start — used in practice, no pause). Cover checkpoint frequency trade-off: frequent checkpoints → shorter recovery time, more I/O during operation; infrequent → longer recovery, less I/O. Show that PostgreSQL checkpoint_completion_target spreads flush over time. .NET impact: checkpoint I/O spike can cause latency spikes — tune in production (monitor with pg_stat_bgwriter, SQL Server checkpoint DMVs).
```

#### 2.8 File Formats
```
Cover how databases organize data on disk: PostgreSQL (one file per relation, 1GB segments, separate TOAST table for large values, WAL in pg_wal directory), SQL Server (MDF primary data file + NDF secondary files + LDF log file — fixed extent allocation), SQLite (single file, page-based, WAL mode = separate WAL file). Cover that understanding file layout helps: SQLite WAL mode is faster for concurrent reads, PostgreSQL table bloat from dead tuples (VACUUM needed), SQL Server data file pre-allocation. Show .NET considerations: SQLite file locking for concurrent access (WAL mode allows concurrent reads), PostgreSQL tablespaces for placing tables on different storage tiers.
```

---

### 3. Indexing

#### 3.1 Why Indexes Exist
```
Explain the fundamental problem: tables can have millions of rows, finding specific rows without index = read every row (O(n) full table scan). Index = separate data structure mapping key values to row locations, enabling O(log n) lookup. Show cost with numbers: 10M rows × 100 bytes = ~1GB. Full scan reads 1GB. B-Tree index on int column: height ~4, reads 4 pages (~32KB). Index makes it 30,000x faster. Cover that indexes have costs: extra storage, slower inserts/updates/deletes (must update index too), optimizer may choose wrong index. Rule: index columns used in WHERE, JOIN ON, ORDER BY — but don't over-index write-heavy tables.
```

#### 3.2 B-Tree Index
```
Explain B-Tree structure: self-balancing tree where each node contains multiple keys (branching factor B, typically 100-1000 for disk B-Trees — keeps height low). Internal nodes: keys + child pointers. Leaf nodes: keys + data pointers (or data itself for clustered). All leaves at same depth → O(log n) guaranteed. Insertion: find leaf, insert key, split if full (propagate up). Deletion: remove key, merge/redistribute if underfull. B-Tree properties: O(log n) search/insert/delete, good for range queries, works with inequality operators (>, <, BETWEEN). Cover that height is typically 3-4 for tables with millions of rows (B = 100, 100^4 = 100M entries in 4 levels).
```

#### 3.3 B+ Tree
```
Explain B+ Tree differences from B-Tree: all data stored in leaf nodes (internal nodes contain only routing keys — no data pointers), leaf nodes linked as a doubly linked list (enables efficient range scans — follow leaf chain without backtracking). Advantages: higher branching factor (internal nodes store only keys, more keys per node → lower height), efficient range queries (scan leaf chain after finding start key), better cache behavior (sequential leaf reads). All major databases (PostgreSQL, MySQL InnoDB, SQL Server) use B+ Tree for indexes. Show how range query works: find start leaf via tree traversal, scan leaf chain forward. Show how SELECT * FROM orders WHERE date BETWEEN '2024-01-01' AND '2024-12-31' uses a B+ Tree date index efficiently.
```

#### 3.4 Hash Index
```
Explain hash indexes: hash key → bucket address, O(1) average point lookup but NO support for range queries (hash destroys order). Use cases: equality-only lookups (=, IN), NOT for >, <, BETWEEN, LIKE 'prefix%'. Cover implementations: PostgreSQL hash indexes (crash-safe since v10, O(1) lookup, not WAL-logged in older versions), MySQL MEMORY engine hash indexes, Redis (entire store is hash-based). Cover hash collision handling (linear probing, separate chaining). Show performance: hash index beats B-Tree for pure equality lookups (O(1) vs O(log n)) but most workloads mix equality + range, so B-Tree dominates. .NET: rarely specify hash index explicitly, but understand when optimizer might use one.
```

#### 3.5 Clustered vs Non-Clustered
```
Explain clustered index: the table IS the index — rows stored in index order (B+ Tree with actual rows in leaf nodes). One per table. InnoDB and SQL Server always have one (default = primary key). Advantages: range scans on clustering key avoid heap lookup (data is in index leaves). Disadvantages: random insertion order = page splits and fragmentation (UUID primary key causes this). Non-clustered index: separate structure from heap, leaf nodes contain key + row pointer (heap address or clustering key). Looking up non-index columns requires heap fetch (key lookup). PostgreSQL: no clustered index concept — always heap + secondary indexes (though CLUSTER command rewrites table in index order, not maintained). .NET: EF Core default int PK = clustered in SQL Server (good), UUID PK = clustered (fragmentation risk).
```

#### 3.6 Covering Index
```
Explain covering index (index-only scan): index contains all columns needed by query — no heap fetch needed. Example: SELECT name, email FROM users WHERE email = ? — if index on (email) INCLUDE (name), query answered entirely from index (index-only scan in EXPLAIN). Benefits: avoids random I/O to heap, reads fewer bytes (index more compact than full row). Show creating covering index with INCLUDE clause (SQL Server, PostgreSQL 11+). Show index that covers query by including all projected columns. .NET EF Core tip: frequently run reporting queries → create covering index matching exact LINQ projection. Measure with EXPLAIN: "Index Only Scan" vs "Index Scan" (Index Scan still fetches heap).
```

#### 3.7 Composite Index
```
Explain composite (multi-column) index: index on (col1, col2, col3) — ordered first by col1, then col2, then col3 within same col1 values. Leftmost prefix rule: index on (a, b, c) supports queries on (a), (a, b), (a, b, c) — but NOT (b), (c), (b, c) alone. Column order matters: put most selective (highest cardinality) column first for point queries, put range/equality split at equality columns then range column. Show concrete examples: index on (status, created_at) for WHERE status = 'active' ORDER BY created_at — equality first, range/sort second. Show EF Core HasIndex(e => new { e.Status, e.CreatedAt }). Cover index skip scan (PostgreSQL 16+ — can use index even without leading column in some cases).
```

#### 3.8 Partial Index
```
Explain partial index: index with WHERE clause — indexes only rows matching the predicate. Example: CREATE INDEX idx_orders_pending ON orders(created_at) WHERE status = 'pending'. Advantages: smaller index (only active/relevant rows), faster maintenance (fewer index entries to update), optimizer can use it for matching queries. Use cases: soft-delete tables (index WHERE deleted_at IS NULL — excludes deleted rows), status-based queries (index WHERE status = 'active'), non-null queries (index WHERE email IS NOT NULL). Show PostgreSQL and SQL Server (filtered index) syntax. Show EF Core: HasIndex(e => e.CreatedAt).HasFilter("status = 'pending'"). Measure size difference: 10M rows, 1% pending → partial index 100x smaller than full index.
```

#### 3.9 Expression Index
```
Explain expression/function-based indexes: index on a computed expression not a column. Examples: index on LOWER(email) for case-insensitive email lookup, index on EXTRACT(YEAR FROM created_at) for year-based queries, index on (price * quantity) for computed column. PostgreSQL supports any immutable expression. SQL Server uses computed columns + index. MySQL uses expression indexes (8.0+). Show that queries MUST use same expression in WHERE to use the index (LOWER(email) = LOWER(?) uses the index, email ILIKE ? may not). Show EF Core: HasIndex(e => e.Email.ToLower()). Cover that expression indexes can be large — measure selectivity. Immutability requirement: function must return same result for same input.
```

#### 3.10 Full-Text Index
```
Explain full-text search indexes: inverted index mapping words → documents containing them. Process: tokenize text, normalize (lowercase, stem), index word → list of (doc_id, position). Enables: keyword search (CONTAINS, MATCH AGAINST, @@), phrase search, proximity search, ranking by relevance. Cover implementations: PostgreSQL (tsvector, GIN index on tsvector), SQL Server (Full-Text Search service), MySQL (FULLTEXT index on CHAR/VARCHAR/TEXT). Compare to LIKE '%keyword%' (no index, full table scan — never use for search). .NET: PostgreSQL with EF Core — EF.Functions.ToTsVector, Npgsql.EntityFrameworkCore.PostgreSQL. Elasticsearch for advanced search (separate search index from operational DB). Show indexing and querying tsvector in PostgreSQL.
```

#### 3.11 Bitmap Index
```
Explain bitmap indexes: for low-cardinality columns (few distinct values — status, gender, boolean). One bitmap per distinct value: bit i = 1 if row i has that value. AND/OR operations across bitmaps are fast (SIMD-friendly). Bitmap index sizes: 1 bit per row per distinct value (vs B-Tree: ~8 bytes per row). Example: status column with 3 values (active, inactive, pending) — 3 bitmaps, each n/8 bytes (vs B-Tree index ~8n bytes for n rows). Disadvantage: terrible for high-cardinality (unique values → bitmap per value = massive), poor for frequent updates (bitmap updates are expensive). Used in: Oracle (native bitmap indexes), PostgreSQL (internally for combining multiple B-Tree indexes with BitmapAnd/BitmapOr), data warehouses. Show PostgreSQL EXPLAIN showing BitmapAnd combining two indexes.
```

#### 3.12 Index Maintenance
```
Cover index fragmentation and maintenance: B-Tree fragmentation from random inserts (pages not full, logical order != physical order — extra disk seeks for range scans). Measuring fragmentation: PostgreSQL pgstattuple extension, SQL Server sys.dm_db_index_physical_stats. Fixing: REINDEX / ALTER INDEX REBUILD (locks table — heavy), VACUUM + autovacuum (PostgreSQL — reclaims dead tuples, doesn't rebuild B-Tree), ALTER INDEX REORGANIZE (SQL Server — online, partial defrag). Show fill factor: leave N% free space for future inserts (fill_factor=80 in PostgreSQL, FILLFACTOR in SQL Server). .NET impact: fragmented indexes → slower queries → EF Core queries degrade over time. Schedule maintenance during low-traffic windows.
```

#### 3.13 Indexing in .NET / EF Core
```
Practical indexing guide for EF Core: creating indexes (HasIndex), composite indexes (HasIndex(e => new { e.A, e.B })), unique indexes (IsUnique()), covering indexes (HasIndex().IncludeProperties()), filtered/partial indexes (HasFilter()), database-generated migrations include indexes. Show EF Core migration-generated CREATE INDEX SQL. Cover: always index foreign keys (EF Core does NOT add FK indexes automatically — add manually), index columns used in Where() clauses, index columns used in OrderBy() for pagination. Show using ef dbcontext scaffold or migrations to verify indexes. Cover EF.Functions for database-specific operations that leverage specific index types. Anti-pattern: too many indexes on write-heavy tables (INSERT benchmark with 0 vs 10 indexes — show write overhead).
```

---

### 4. Query Execution

#### 4.1 Query Lifecycle
```
Walk through a query's lifecycle: SQL string arrives → Lexer (tokenize: SELECT, *, FROM, users, WHERE, id, =, 1) → Parser (build Abstract Syntax Tree) → Analyzer/Binder (resolve table/column names, check types, verify permissions) → Optimizer (generate plan alternatives, estimate costs, choose best plan) → Executor (execute plan, fetch rows, apply joins, return results). Cover that the optimizer is where most performance decisions happen. Show that EF Core sends SQL strings to this pipeline (LINQ → SQL string → DB pipeline). Cover plan caching: parsed+optimized plan cached by parameter shape (same plan reused for different parameter values). Show that .NET string-interpolated queries (SQL injection risk) also break plan caching.
```

#### 4.2 Query Parser & AST
```
Explain query parsing: lexical analysis (tokenize SQL into keywords, identifiers, literals), syntax analysis (parse tokens into Abstract Syntax Tree per SQL grammar), semantic analysis (validate table/column names against catalog, resolve star expansion to column list, check types). Show a simple SELECT and its AST (SelectStatement → TargetList → FromClause → WhereClause). Cover parse errors vs semantic errors (different stages). Explain that parsing is CPU-bound and relatively fast (~0.1ms) for most queries. Cover prepared statements (parse + analyze once, execute many times — saves repeated parsing). Show .NET: parameterized queries via ADO.NET (@param) and EF Core (always parameterized) = prepared statement benefits.
```

#### 4.3 Query Optimizer
```
Explain cost-based query optimizer: enumerates possible execution plans (different join orders, join algorithms, index choices, access methods), estimates cost of each (using statistics — row counts, column value distributions), chooses minimum-cost plan. Cover search space explosion: n-table join has n! possible orders (pruned with dynamic programming — Selinger algorithm). Cover heuristics for large queries (genetic algorithm in PostgreSQL for >8 tables). Cover rule-based optimizations (always applied: push predicates down, eliminate redundant sorts). Show that optimizer estimates are wrong sometimes → bad plan choices → slow queries. .NET: LINQ query complexity affects optimizer — complex chained LINQ may generate suboptimal SQL (use SQL Server Query Store / pg_stat_statements to see generated SQL).
```

#### 4.4 Statistics
```
Explain database statistics: metadata about table data used by optimizer for row count estimates. Column-level stats: distinct value count (n_distinct), most common values + their frequencies, histogram (distribution of values in ranges). Table-level: row count, page count. Histograms: equi-depth (each bucket same row count), equi-width (each bucket same value range). Show that stale statistics → bad estimates → wrong plan. PostgreSQL: ANALYZE collects stats (autovacuum does this automatically), pg_statistic system table, pg_stats view. SQL Server: UPDATE STATISTICS (auto-update on 20% table change). .NET impact: bulk load data without ANALYZE → optimizer sees old stats → sequential scan instead of index scan. Run ANALYZE after large data loads.
```

#### 4.5 Execution Plans
```
Teach reading query execution plans (EXPLAIN / EXPLAIN ANALYZE in PostgreSQL, SET SHOWPLAN_ALL / query plan in SQL Server, EXPLAIN in MySQL). Cover: node types (Seq Scan, Index Scan, Index Only Scan, Hash Join, Nested Loop, Merge Join, Sort, Hash Aggregate), estimated vs actual rows (large discrepancy = stale stats or bad estimate), cost format (startup_cost..total_cost), actual time (ms per node), loops (node executed N times). Show EXPLAIN ANALYZE output for a join query. Cover plan for common problems: Seq Scan on large table (missing index), Hash Join with large hash table (memory spill), nested loop on large outer table (bad join order). .NET: use EF Core logging to print SQL, then run EXPLAIN manually.
```

#### 4.6 Join Algorithms
```
Explain three join algorithms: Nested Loop Join (for each row in outer, scan inner for matches — O(n×m), good for small tables or indexed inner), Hash Join (build hash table from smaller relation, probe with larger relation — O(n+m) if fits in memory, needs memory, good for large equi-joins), Merge Join (sort both relations, merge-sort-style — O(n log n + m log m) but O(n+m) if pre-sorted via index, good for pre-sorted data). When each is chosen: nested loop → small table or index available, hash join → large unsorted tables, merge join → pre-sorted or index-ordered. Show EXPLAIN output for each. Cover hash join memory spill to disk. .NET: understanding joins helps diagnose why EF Core Include() is slow on large sets.
```

#### 4.7 Sorting
```
Explain database sorting: in-memory sort (quicksort/mergesort if data fits in work_mem/sort buffer), external sort (N-way merge when data doesn't fit — reads/writes temporary files). Cost of sort: O(n log n) in-memory, O(n log n) with disk I/O for external sort (much slower). Cover sort elimination: if data already ordered by index, no sort needed (merge join, ORDER BY matching an index). Show that ORDER BY without LIMIT on large tables is expensive even with index (index scan + sort). Cover work_mem (PostgreSQL per-operation memory, not per-connection — set too low → lots of disk spills, set too high → OOM on many connections). .NET: EF Core .OrderBy() generates ORDER BY SQL — ensure index supports it or expect sort cost.
```

#### 4.8 Aggregation
```
Explain aggregation algorithms: Hash Aggregation (build hash table of group keys, accumulate aggregates — O(n) per group, O(n) memory — good for unsorted data), Stream Aggregation (requires data sorted by group key — O(n) time, O(1) memory — good when data already sorted). Show EXPLAIN output for GROUP BY query — Hash Aggregate vs Group Aggregate. Cover aggregate pushdown (SUM computed during scan before join — reduces data). Cover window functions (computed over a frame without collapsing rows — requires sort + window execution). .NET: EF Core .GroupBy() can generate GROUP BY SQL or client-side grouping (watch for ClientEvaluation warning in older EF Core — check generated SQL).
```

#### 4.9 Plan Caching & Parameterization
```
Explain query plan caching: parsed + optimized plan stored in plan cache, reused for identical query shape (same SQL structure, different parameter values). Why it matters: optimization takes 1-10ms — caching avoids repeated optimization. Parameterization requirement: queries with literals (WHERE id = 123) get separate cache entry per value → cache pollution (1000 distinct IDs = 1000 plans). Solution: always use parameters (WHERE id = @id or $1). .NET: EF Core always parameterizes (safe), ADO.NET with parameters = single plan per query shape, raw SQL with string interpolation = plan cache pollution + SQL injection. Cover parameter sniffing (SQL Server — plan cached with first parameter's statistics may be bad for other parameters — use OPTIMIZE FOR UNKNOWN or local variables to fix).
```

#### 4.10 EF Core Query Plans
```
Show how to analyze EF Core-generated SQL and its execution plan: enable EF Core query logging (optionally with sensitive data logging), copy generated SQL, run EXPLAIN ANALYZE in pgAdmin / Azure Data Studio / SSMS. Show common EF Core query patterns and their SQL: Include() → LEFT JOIN, Where().Select() → WHERE + column list, Skip().Take() → OFFSET FETCH, GroupBy() → GROUP BY, Count() → SELECT COUNT(*). Cover EF Core query interceptors for capturing SQL + automatically running EXPLAIN. Show using MiniProfiler NuGet for ASP.NET Core to profile queries per request. Cover EF Core compiled queries (EF.CompileQuery) for repeatedly executed hot paths.
```

---

### 5. Transactions & ACID

#### 5.1 ACID
```
Explain ACID properties concisely with .NET examples: Atomicity (all operations in transaction succeed or all fail — EF Core SaveChanges() — if exception thrown, all changes rolled back), Consistency (transaction brings database from one valid state to another — FK constraints, CHECK constraints enforced at commit), Isolation (concurrent transactions don't see each other's intermediate state — isolation level determines exactly what they can see), Durability (committed transactions survive crashes — WAL + fsync ensure data on disk). Show that ACID is why databases are trusted for financial transactions. Cover that NoSQL databases often relax ACID (MongoDB multi-document transactions are optional, Cassandra is eventually consistent).
```

#### 5.2 Atomicity
```
Explain atomicity implementation: undo log (record before-images of modified data, rollback by applying undo), WAL (write-ahead log records changes, committed = all WAL written + fsync). Rollback: apply undo log entries in reverse. Crash recovery: redo committed transactions from WAL, undo uncommitted transactions using undo log. Show that atomicity makes partial failures impossible: either all 3 account updates commit or none do. .NET: wrapping multiple EF Core operations in a transaction ensures atomicity (context.Database.BeginTransactionAsync()). Cover that EF Core SaveChanges() is itself a transaction (all tracked changes committed atomically). Cover that NOT using transactions for multi-step operations risks partial success.
```

#### 5.3 Consistency
```
Explain consistency: transaction leaves database in a state satisfying all defined constraints (CHECK constraints, NOT NULL, UNIQUE, FOREIGN KEY, triggers). Consistency is partially an application-level responsibility (business rules not expressible as DB constraints must be enforced by app code). Show that consistency != isolation (two separate properties). Cover that consistency is enforced at commit time (within transaction, constraints may be violated transiently — DEFERRED constraints in PostgreSQL). .NET: EF Core model validation + database constraints both enforce consistency. Show Fluent API constraints: IsRequired(), HasMaxLength(), HasCheckConstraint(). Cover that EF Core model constraints and database constraints should be in sync (EF Core generates CREATE TABLE with constraints from model).
```

#### 5.4 Isolation
```
Explain isolation: the I in ACID — concurrent transactions appear to execute serially (strongest form = serializable). Why difficult: serial execution = no concurrency = slow. Solution: allow some overlap but prevent specific anomalies. Cover the isolation spectrum: Read Uncommitted (fastest, allows dirty reads) → Read Committed (default in most DBs) → Repeatable Read (MySQL InnoDB default) → Serializable (strongest, slowest). Show that each level prevents specific anomalies. Cover that MVCC gives read isolation without blocking (readers don't block writers, writers don't block readers). .NET: EF Core uses database default isolation level unless explicitly set — understand your database's default.
```

#### 5.5 Durability
```
Explain durability: committed data survives system crashes, power failures, and restarts. Implementation: WAL flushed to disk (fsync) before commit acknowledged to client. Risks to durability: filesystem write caching (OS buffers writes — disable with O_DIRECT or fsync), battery-backed write cache on controller (usually safe), RAID controller without BBU. Show that durability has performance cost: every commit requires disk write (fsync ≈ 1-10ms on HDD, 0.1ms on NVMe). Tuning: synchronous_commit=off in PostgreSQL (risk losing last few transactions — acceptable for some use cases, not financial). .NET: default ADO.NET commits are durable — don't change unless you understand the trade-off. Cover group commit optimization.
```

#### 5.6 Transaction Lifecycle
```
Show transaction lifecycle: BEGIN (start transaction, get transaction ID), SQL statements (read/write within transaction — changes visible only to this transaction), COMMIT (write WAL, fsync, mark committed — changes visible to others) or ROLLBACK (apply undo log, discard changes). Cover autocommit mode (each statement is its own transaction — default in most clients). Cover transaction ID management (PostgreSQL xid wraparound problem — counter wraps after 2^32 transactions — requires VACUUM FREEZE before wraparound). .NET: EF Core context.Database.BeginTransactionAsync() / CommitAsync() / RollbackAsync(). Cover using TransactionScope (distributed transaction, .NET-level — wraps multiple ADO.NET connections). Cover that long-running transactions cause problems (lock contention, MVCC bloat).
```

#### 5.7 Savepoints
```
Explain savepoints: named points within a transaction allowing partial rollback. SAVEPOINT name, ROLLBACK TO SAVEPOINT name (rolls back to that point, transaction continues), RELEASE SAVEPOINT name (removes savepoint). Use cases: nested operation that might fail (retry inner operation without losing outer work), batch processing (checkpoint after each N rows — on error, rollback to checkpoint not entire batch). Cover that savepoints don't reduce lock duration. Show .NET: IDbTransaction.Save("sp1"), IDbTransaction.Rollback("sp1") in ADO.NET. EF Core: context.Database.CreateSavepointAsync(), RollbackToSavepointAsync(). Cover that savepoints are underused in .NET — useful for retry patterns within long transactions.
```

#### 5.8 Transactions in .NET
```
Comprehensive transaction guide in .NET: ADO.NET (connection.BeginTransaction(), command.Transaction = tx, tx.Commit()/Rollback()), EF Core (context.Database.BeginTransactionAsync(), SaveChangesAsync() within transaction, UseTransaction() to share existing ADO.NET transaction), TransactionScope (System.Transactions — wraps multiple operations, escalates to DTC for multi-connection — avoid for modern .NET). Show patterns: SaveChanges() is its own transaction (no explicit transaction needed for single unit of work), explicit transaction for multiple SaveChanges() calls. Cover isolation level setting: context.Database.BeginTransactionAsync(IsolationLevel.ReadCommitted). Cover avoiding TransactionScope with async (async/await + TransactionScope has thread affinity issues — use DbContext transaction instead).
```

---

### 6. Isolation Levels

#### 6.1 Concurrency Anomalies
```
Explain the three classic concurrency anomalies: Dirty Read (read uncommitted data from another transaction — data may be rolled back later), Non-Repeatable Read (read same row twice in one transaction, get different values because another transaction committed an update between reads), Phantom Read (run same query twice, get different rows because another transaction committed inserts/deletes). Show concrete examples of each with two concurrent transactions. Cover the additional anomaly: Write Skew (transaction reads data, makes decision, writes based on decision — but the read data changed before write commits — e.g., two doctors both seeing a scheduling constraint as satisfied, both going off-call). Cover that higher isolation prevents more anomalies at cost of concurrency.
```

#### 6.2 Read Uncommitted
```
Explain Read Uncommitted: weakest isolation, allows dirty reads (read data not yet committed — may be rolled back). Practically almost never used (dirty reads violate data integrity for most applications). MySQL InnoDB: reads are non-locking even at Read Uncommitted, writes still acquire locks. Use case: approximate reporting on live data where stale/dirty reads are acceptable (count rows approximately, no financial data). PostgreSQL doesn't truly implement Read Uncommitted (treats it as Read Committed — no dirty reads anyway due to MVCC). .NET: IsolationLevel.ReadUncommitted — avoid for any data integrity requirement. NOLOCK hint in SQL Server is equivalent and equally dangerous (can return duplicate rows, missing rows, not just dirty reads).
```

#### 6.3 Read Committed
```
Explain Read Committed: default in PostgreSQL, SQL Server, Oracle. Prevents dirty reads (only see committed data). Allows non-repeatable reads and phantom reads. Implementation: take shared lock for duration of read (release after row read — not held to end of transaction), or MVCC snapshot per statement (PostgreSQL). Show non-repeatable read example: read account balance (100), another transaction updates to 200 and commits, read balance again in same transaction → sees 200. .NET implication: re-reading data in same transaction may return different values — don't cache query results and assume they're still valid. Cover that Read Committed is appropriate for most OLTP workloads (high concurrency, no long analysis).
```

#### 6.4 Repeatable Read
```
Explain Repeatable Read: prevents dirty reads and non-repeatable reads. Once a row is read, same value seen throughout transaction. Allows phantom reads (new rows from other transactions may appear). MySQL InnoDB default. Implementation: hold shared locks until end of transaction (locking) OR take MVCC snapshot at transaction start (PostgreSQL/MySQL — snapshot isolation). Show phantom read example: query "WHERE balance > 100" sees 5 rows, another transaction inserts a row with balance 150 and commits, same query sees 6 rows (new phantom). .NET: use Repeatable Read when re-reading data within transaction must see consistent values (inventory checks, balance reads that influence decisions). PostgreSQL Repeatable Read actually prevents phantoms too (via MVCC).
```

#### 6.5 Serializable
```
Explain Serializable isolation: strongest level, concurrent transactions produce same result as some serial execution order. Prevents all anomalies including phantoms and write skew. Implementation: lock-based (predicate locks — lock on range of values, not just rows — expensive), Serializable Snapshot Isolation (SSI — used in PostgreSQL — MVCC + tracking read/write dependencies, aborts transactions that violate serializability). Show that SSI allows high concurrency (rarely aborts in practice). Trade-off: serialization failures (transaction aborted, must retry). .NET: IsolationLevel.Serializable + retry on serialization failure (SqlException 40001 / PostgreSQL 40001 serialization_failure). Cover that most applications don't need Serializable — use Repeatable Read + explicit locking where needed.
```

#### 6.6 Snapshot Isolation
```
Explain Snapshot Isolation: transaction sees consistent snapshot of database as of transaction start time. Implemented via MVCC. Prevents dirty reads, non-repeatable reads, phantom reads. Allows write skew (two transactions read overlapping data, both write based on read — neither sees the other's write — results in inconsistent state). SQL Server: READ_COMMITTED_SNAPSHOT (each statement gets snapshot) and SNAPSHOT (transaction-level snapshot). PostgreSQL: Repeatable Read = Snapshot Isolation. Advantages: readers never block writers, writers never block readers, high concurrency. Cover write skew example: two transactions both check "at least one doctor on call" → both conclude safe to go off-call → neither on call. Fix: Serializable or explicit locking (SELECT FOR UPDATE).
```

#### 6.7 Isolation Level in .NET
```
Practical guide to choosing isolation levels in .NET: Read Committed (default — good for most web app CRUD operations), Repeatable Read (when re-reading data in same transaction must be consistent — inventory reservation, account balance operations), Serializable (when write skew is a concern — use with retry logic), Snapshot (SQL Server — high-concurrency read-heavy workloads without blocking). Show EF Core: context.Database.BeginTransactionAsync(IsolationLevel.RepeatableRead). Show ADO.NET: connection.BeginTransaction(IsolationLevel.Snapshot). Cover that isolation level is per-transaction not per-connection. Provide a decision table. Cover that READ_COMMITTED_SNAPSHOT in SQL Server (database-level setting) changes default behavior of all connections.
```

---

### 7. Locking & Concurrency Control

#### 7.1 Pessimistic Locking
```
Explain pessimistic locking: assume conflicts will occur, acquire locks before accessing data. Prevents conflicts by blocking other transactions. Lock types: shared (read lock — multiple transactions can hold simultaneously), exclusive (write lock — only one transaction). Lock protocols: 2-Phase Locking (2PL) — acquire all locks before releasing any (growing phase then shrinking phase) — guarantees serializability. Cover that 2PL can deadlock. Show that pessimistic locking is appropriate when: conflict probability is high, transactions are short (minimize lock hold time), consistency is critical (financial). .NET: SELECT FOR UPDATE (PostgreSQL) = pessimistic read lock, explicit transaction + lock table. Show EF Core pessimistic locking via raw SQL or FromSqlRaw("SELECT ... FOR UPDATE").
```

#### 7.2 Lock Types
```
Cover lock types in SQL Server (richest lock system): Shared (S — for reads, compatible with other S locks), Exclusive (X — for writes, incompatible with everything), Update (U — prevents S→X deadlocks, compatible with S but not other U or X), Intent (IS, IX, IU — signal intent at coarser granularity, allow finer locks), Schema Modification (Sch-M), Bulk Update (BU). Show compatibility matrix. Cover PostgreSQL lock modes: ACCESS SHARE, ROW SHARE, ROW EXCLUSIVE, SHARE UPDATE EXCLUSIVE, SHARE, SHARE ROW EXCLUSIVE, EXCLUSIVE, ACCESS EXCLUSIVE. Show which SQL commands acquire which locks. .NET: knowing lock types helps diagnose blocking queries (sp_who2 / pg_locks shows lock types).
```

#### 7.3 Lock Granularity
```
Explain lock granularity: database → table → page → row → column. Coarse granularity (table lock): simple, no overhead tracking many locks, but low concurrency (only one transaction at a time). Fine granularity (row lock): high concurrency, but overhead tracking millions of locks. Cover page-level locks (intermediate — balance). Show lock manager memory: each lock entry = ~100 bytes. 1M row locks = 100MB just for lock table. Cover that lock granularity affects deadlock frequency (fine-grained locks → more locks held → more deadlock opportunities). .NET: most row-level operations use row locks in InnoDB and SQL Server (default). Avoid table-level operations (DDL, TRUNCATE) in concurrent systems.
```

#### 7.4 Lock Escalation
```
Explain lock escalation: when transaction holds many fine-grained locks, database escalates to coarser lock (e.g., 5000 row locks → one table lock). Purpose: reduce memory overhead. SQL Server: escalates row/page locks to table lock at threshold (~5000 locks). Risk: escalation blocks all other transactions on that table. Symptoms: blocking chains suddenly grow when large updates run. Prevention: use NOLOCK (risky — see dirty reads), disable escalation for specific tables (ALTER TABLE … SET LOCK_ESCALATION = DISABLE), process in smaller batches (fewer locks per transaction). .NET: EF Core batch deletes/updates in large sets may trigger escalation — break into chunks with SaveChanges every N records. Monitor with sys.dm_exec_requests, sys.dm_os_wait_stats.
```

#### 7.5 Database Deadlocks
```
Explain database deadlocks: two transactions each holding a lock the other needs. Detection: wait-for graph (cycle = deadlock — database detects in milliseconds, kills one transaction — victim chosen by least cost). Show classic AB-BA deadlock: T1 locks row A then tries B, T2 locks row B then tries A. Prevention strategies: access tables/rows in consistent order (application-level), keep transactions short, use appropriate isolation level. Retry pattern: SqlException 1205 (SQL Server deadlock victim) / PostgreSQL 40P01 → retry transaction. .NET: wrap database operations in retry policy (Polly + IsTransient check for deadlock error codes). EF Core EnableRetryOnFailure() handles this automatically for SQL Server. Monitor: SQL Server system_health session, PostgreSQL log_lock_waits.
```

#### 7.6 Optimistic Locking
```
Explain optimistic locking: assume conflicts are rare, don't lock on read, check at commit time if data has changed. Implementation: version column (increment on each update), timestamp, or checksum. Update pattern: SELECT row + version, compute new values, UPDATE WHERE version = original_version — if 0 rows affected, conflict (another transaction updated first). Better concurrency than pessimistic (no blocking on reads), but conflict = retry cost. Appropriate when: conflict probability is low, read-heavy workloads, long operations where holding locks would be too costly. .NET: EF Core ConcurrencyToken / RowVersion (IsRowVersion() in Fluent API) — DbUpdateConcurrencyException thrown on conflict. Show retry handler for optimistic concurrency in EF Core.
```

#### 7.7 MVCC
```
Explain Multi-Version Concurrency Control: instead of locking, keep multiple versions of each row. Readers see consistent snapshot of past versions, writers create new versions. No reader-writer blocking (readers see old version while writer creates new version). Cover version chain: each row has transaction ID that created it + transaction ID that deleted/updated it. Snapshot: transaction only sees rows where create_txid <= my_snapshot_txid AND delete_txid > my_snapshot_txid (or null). Advantages: high read concurrency, no reader-writer contention. Disadvantages: storage overhead (old versions pile up), GC needed (VACUUM in PostgreSQL, purge in MySQL). .NET: MVCC is transparent — all major databases (PostgreSQL, MySQL InnoDB, SQL Server with snapshot) use it.
```

#### 7.8 SELECT FOR UPDATE / SKIP LOCKED
```
Show SELECT FOR UPDATE: acquires exclusive row lock during read, preventing other transactions from modifying or reading with FOR UPDATE until commit. Use cases: queue processing (SELECT job FOR UPDATE SKIP LOCKED — skip jobs locked by other workers, prevents double-processing), inventory reservation (SELECT stock FOR UPDATE, check quantity, decrement — prevents oversell). SKIP LOCKED: skip rows locked by other transactions instead of blocking (multiple workers process queue concurrently). NOWAIT: fail immediately instead of waiting. Show PostgreSQL/SQL Server syntax. .NET: EF Core raw SQL for SELECT FOR UPDATE (not natively supported in LINQ), or use database-specific FromSqlRaw. Show queue processor pattern.
```

#### 7.9 Optimistic Concurrency in EF Core
```
Complete EF Core optimistic concurrency guide: RowVersion (byte[] mapped to rowversion/timestamp in SQL Server — auto-incremented by DB on each update), ConcurrencyToken (any column treated as concurrency check — useful for ETag-based APIs). Configuration: IsRowVersion() in Fluent API, [Timestamp] attribute. EF Core behavior: generates WHERE id = @id AND rowversion = @original_rowversion — if 0 rows affected, throws DbUpdateConcurrencyException. Handling conflict: catch DbUpdateConcurrencyException, access Entry.OriginalValues / Entry.CurrentValues / Entry.GetDatabaseValues() to resolve conflict (client wins, database wins, or merge). Show complete conflict resolution strategy. Cover PostgreSQL: use xmin system column as concurrency token.
```

---

### 8. MVCC In Depth

#### 8.1 MVCC Fundamentals
```
Explain MVCC implementation: each row has metadata (PostgreSQL: xmin = txid that inserted row, xmax = txid that deleted/updated row). Read: scan rows where xmin <= my_snapshot AND xmax > my_snapshot (row was created before my snapshot and not yet deleted when my snapshot taken). Write: INSERT creates new row version (new xmin), DELETE sets xmax, UPDATE = DELETE old + INSERT new. Snapshot: taken at transaction start (Repeatable Read) or statement start (Read Committed). Show how two transactions see different versions of same row. Cover that MVCC means old row versions accumulate — need periodic cleanup (garbage collection).
```

#### 8.2 PostgreSQL MVCC
```
Explain PostgreSQL MVCC implementation: xmin/xmax as 32-bit transaction IDs in each tuple header (8 bytes overhead per row). Visibility rules: tuple visible if xmin committed AND (xmax is invalid OR xmax not committed). pg_clog (commit log) tracks which xids are committed. Cover VACUUM: scans table, finds dead tuples (xmax committed, no active transactions that need old version), marks space as reusable. VACUUM FREEZE: sets xmin to frozen (special value — prevents xid wraparound). Autovacuum: background process running VACUUM automatically. Cover bloat: high update/delete rate without VACUUM → table grows with dead tuples → slower sequential scans → disk waste. Monitor: pg_stat_user_tables.n_dead_tup.
```

#### 8.3 SQL Server Snapshot Isolation
```
Explain SQL Server's snapshot isolation via version store in tempdb: when row is modified under snapshot isolation, old version stored in tempdb (not in the row itself like PostgreSQL). Row in data file has version pointer to tempdb chain. Read: follow version chain to find correct version for snapshot. Benefits: old versions don't bloat main tables (unlike PostgreSQL). Disadvantages: tempdb becomes bottleneck under high modification rates, version store cleanup overhead. Show enabling: ALTER DATABASE SET READ_COMMITTED_SNAPSHOT ON (default = Read Committed uses MVCC) and ALLOW_SNAPSHOT_ISOLATION ON. .NET: with READ_COMMITTED_SNAPSHOT, all Read Committed queries use MVCC — no read blocking. Monitor tempdb version store size: sys.dm_tran_version_store_space_usage.
```

#### 8.4 MySQL InnoDB MVCC
```
Explain MySQL InnoDB MVCC: undo logs store old row versions (clustered B-Tree has roll_ptr pointing to undo log chain). Read: follow undo log chain to find version visible to transaction's ReadView (active transaction list at snapshot time). Purge thread: background cleanup of undo logs no longer needed by any active transaction. Cover that InnoDB undo logs are in the undo tablespace (undo_001, undo_002). Long-running transactions prevent purge → undo log grows → history list length grows → slower reads (must follow longer chains). Monitor: SHOW ENGINE INNODB STATUS — shows History list length (should be < 1000; > 10000 = long-running transaction problem). .NET: avoid long-running MySQL transactions — undo log bloat causes all queries to slow down.
```

#### 8.5 MVCC Garbage Collection
```
Cover MVCC GC as a critical operational concern: PostgreSQL VACUUM (must run regularly — autovacuum default settings often insufficient for high-write tables), MySQL InnoDB purge thread (automatic but can fall behind under load), SQL Server version store cleanup (automatic but tempdb can fill up). Show symptoms of MVCC GC falling behind: PostgreSQL — table bloat (pg_total_relation_size growing without data growth), MySQL — high history list length, SQL Server — tempdb full. Tuning: PostgreSQL increase autovacuum_vacuum_scale_factor for large tables, increase autovacuum workers. MySQL: increase innodb_purge_threads. .NET operations that cause GC lag: long-running transactions, batch jobs that hold transactions open.
```

#### 8.6 MVCC Bloat & Long Transactions
```
Explain MVCC bloat from long-running transactions: snapshot must remain consistent for entire transaction duration → all versions created after snapshot must be kept → GC can't clean up old versions until transaction commits. Show scenario: reporting query running for 30 minutes → all writes during those 30 minutes kept as old versions → massive bloat. Mitigation: break long reports into batches with shorter transactions, use read replica for long reporting queries, set statement_timeout (kill long queries automatically). Show how to find long-running transactions: PostgreSQL pg_stat_activity.state = 'idle in transaction' with large duration, MySQL SHOW PROCESSLIST. .NET: ensure EF Core contexts are short-lived (use using statements), don't hold DbContext across HTTP requests.
```

---

### 9. Storage Engines

#### 9.1 B-Tree Storage Engines
```
Explain B-Tree storage engines (InnoDB, SQL Server): primary key is a clustered B-Tree (data in leaf nodes), all secondary indexes reference primary key (not heap address). Advantages: primary key lookups extremely fast (one B-Tree traversal), range scans on primary key efficient (leaf chain). Disadvantages: secondary index lookup requires two B-Tree traversals (secondary index → primary key → clustered B-Tree), random primary key inserts (UUID) cause page splits and fragmentation. Cover InnoDB specifics: fixed 16KB pages, adaptive hash index (AHI — caches hot B-Tree lookups), change buffer (defers secondary index updates). SQL Server: 8KB pages, fill factor, IAM pages. .NET: prefer sequential PKs (int identity, newsequentialid()) over UUID for write performance.
```

#### 9.2 LSM-Tree
```
Explain Log-Structured Merge Tree (LSM): write-optimized storage engine. All writes go to in-memory buffer (MemTable — balanced BST or skip list), periodically flushed to immutable sorted files (SSTables) on disk. Reads: check MemTable, then check SSTables from newest to oldest (bloom filter to skip most SSTables). Background compaction merges SSTables (eliminates outdated versions, maintains sorted order). Write amplification: each byte written multiple times (MemTable → SSTable → compaction merges). Read amplification: may read multiple SSTables for one key. Used in: RocksDB, LevelDB, Cassandra, ScyllaDB, InfluxDB (TSM variant). Write-heavy workloads benefit most (time-series, event logs, activity feeds).
```

#### 9.3 LSM Components
```
Cover LSM-Tree components: MemTable (in-memory — RedBlack tree or skip list, O(log n) reads/writes, flushed when full to L0 SSTable), SSTable (Sorted String Table — immutable sorted file on disk, bloom filter to avoid unnecessary reads, index to skip to key), WAL for MemTable durability (MemTable is in-memory — WAL ensures durability without fsync per write), Compaction (merge SSTables, deduplicate keys, remove tombstones — leveled compaction vs size-tiered compaction). Cover bloom filter role: probabilistic "is key in this SSTable?" — false positive possible, false negative impossible. .NET: understanding LSM helps when choosing Cassandra (LSM) vs PostgreSQL (B-Tree) for write patterns.
```

#### 9.4 RocksDB
```
Explain RocksDB: Facebook's embedded LSM-Tree engine (forked from LevelDB). Used in: MyRocks (MySQL storage engine), CockroachDB, TiKV, Kafka message storage, Flink state backend. Features: column families (separate key namespaces), bloom filters, block cache (LRU), compression (Snappy/Zstd per level), point lookups, range scans, transactions. Performance: 500K writes/second per node typical. Cover RocksDB configuration tuning (block_cache_size, write_buffer_size, max_write_buffer_number, compaction style). .NET: RocksDb NuGet (unofficial .NET binding to RocksDB C library) for embedded storage. Cover when to use embedded RocksDB in .NET: high-throughput local state store, embedded cache, local queue.
```

#### 9.5 B-Tree vs LSM
```
Compare B-Tree and LSM storage engines across key dimensions: Write throughput (LSM wins — sequential writes to MemTable + WAL, B-Tree = random writes to pages + WAL), Read throughput (B-Tree wins for point reads — O(log n) with one pass; LSM may check multiple SSTables), Write amplification (B-Tree: 1 write to page + WAL; LSM: data written multiple times during compaction), Read amplification (B-Tree: O(log n); LSM: varies with compaction strategy), Space amplification (LSM has dead data until compaction), Range scans (B-Tree leaf chain = fast; LSM merge of multiple SSTables = slower). Decision: heavy write workload → LSM; balanced read/write OLTP → B-Tree.
```

#### 9.6 Append-Only Logs
```
Explain append-only (immutable) storage: writes always append new entries, never modify in-place. Log-structured storage for events, time-series, audit logs. Examples: Apache Kafka (append-only log partitions), PostgreSQL WAL, Datomic (immutable fact database), event sourcing stores. Benefits: maximum write throughput (sequential I/O), natural audit trail, easy replication (just replicate the log), simple concurrency (no update conflicts). Disadvantages: storage grows forever (need compaction/retention policy), reads may need log replay. .NET: append-only log pattern for event sourcing — EventStoreDB (purpose-built), PostgreSQL with INSERT-only pattern + periodic archival.
```

#### 9.7 Fractal Tree & Bw-Tree
```
Cover advanced tree structures: Fractal Tree (TokuDB/Percona TokuDB — B-Tree variant with message buffers at each internal node, defers writes to reduce random I/O — excellent write performance, better than LSM for reads), Bw-Tree (Microsoft LLAMA/Hekaton/Azure Cosmos DB index — latch-free B-Tree using delta records, CAS for lock-free updates, high concurrency on multicore). Show that these are used in production databases but rarely need deep understanding for application developers. Cover that CosmosDB internally uses Bw-Tree for its index. .NET relevance: understanding that Cosmos DB's indexing strategy stems from Bw-Tree helps explain its consistency/performance characteristics.
```

---

### 10. SQL Performance Patterns

#### 10.1 N+1 Query Problem
```
Explain N+1: loading N parent entities then issuing one query per entity to load children = N+1 total queries. Example: load 100 orders (1 query), then for each order load its items (100 queries) = 101 queries vs 1 JOIN query. Show the EF Core lazy loading trap (navigation property access triggers query per entity). Detection: SQL logging shows repeating parameterized queries. Fix options: Eager loading (Include(o => o.Items) → JOIN), explicit loading (context.Entry(order).Collection(o => o.Items).LoadAsync()), select-in loading (load all children for all parents in one query — AsSplitQuery() in EF Core 5+). Show EF Core AsSplitQuery() for large Include chains that produce massive Cartesian joins. Cover that N+1 is the #1 EF Core performance bug.
```

#### 10.2 Pagination
```
Compare pagination strategies: OFFSET/LIMIT (SQL: OFFSET 10000 LIMIT 10 — DB must scan and discard 10000 rows — O(offset) cost, slow for large offsets, inconsistent under concurrent inserts/deletes), Keyset/Cursor (WHERE id > last_seen_id LIMIT 10 — O(log n) index lookup, stable, fast for any page depth — requires unique sort key). Show that OFFSET pagination at page 1000 reads and discards 10,000 rows. Keyset pagination reads exactly 10 rows regardless of page depth. EF Core: OFFSET = .Skip(N).Take(M) → OFFSET N ROWS FETCH NEXT M ROWS, Keyset = .Where(e => e.Id > lastId).Take(M). Show EF Core keyset pagination with EFCore.NamingConventions or X.Pagedlist.EFCore. Cover cursor-based pagination for APIs (encode cursor as opaque token).
```

#### 10.3 Bulk Operations
```
Show bulk insert/update/delete patterns in .NET: Bulk INSERT options — SqlBulkCopy (ADO.NET — fastest for SQL Server, 100K rows/sec+), PostgreSQL COPY (fastest PostgreSQL bulk load), EF Core AddRange (generates individual INSERTs — slow for large sets), EF Core Bulk Extensions (3rd party NuGet — generates SET-based SQL). Bulk UPDATE: UPDATE FROM (SQL Server), UPDATE with JOIN (MySQL), UPDATE ... FROM (PostgreSQL). Bulk DELETE: DELETE with subquery or JOIN. EF Core 7+: ExecuteUpdate/ExecuteDelete for set-based operations without loading entities. Show benchmark: 10,000 rows — individual INSERT vs SqlBulkCopy (100x faster). Cover TVP (Table-Valued Parameters in SQL Server — pass set of rows as parameter).
```

#### 10.4 CTEs vs Subqueries vs Temp Tables vs TVFs
```
Compare SQL query building blocks: CTE (WITH clause — named subquery, can be referenced multiple times in query, recursive CTEs for hierarchies — SQL Server materializes only sometimes, PostgreSQL always inlines by default in older versions), Subquery (inline — correlated subquery is O(n×m), uncorrelated is fine), Temp Table (#temp in SQL Server, CREATE TEMP TABLE in PostgreSQL — statistics collected, can be indexed, good for multi-step processing), TVF (Table-Valued Function — parameterized view — inline TVF is optimized by optimizer, multi-statement TVF is black box with estimated 1 row). .NET: EF Core supports CTEs via raw SQL, temp tables via ExecuteSqlRaw, subqueries via nested LINQ. Choose based on: reuse (CTE/TVF), multi-step (temp table), simple filter (subquery).
```

#### 10.5 Window Functions
```
Explain window functions: compute values over a "window" of related rows without collapsing them (unlike GROUP BY). Functions: ROW_NUMBER() (unique sequential number per partition), RANK() (same rank for ties, gaps after ties), DENSE_RANK() (same rank for ties, no gaps), LAG(col, n) (value from N rows before), LEAD(col, n) (value from N rows ahead), SUM/AVG/COUNT OVER (running total/average), FIRST_VALUE/LAST_VALUE (first/last in window), NTILE(n) (divide into N buckets). PARTITION BY (divide into groups), ORDER BY (order within group), ROWS/RANGE BETWEEN (frame definition). Show practical examples: running total of sales, row number for deduplication, year-over-year comparison with LAG. EF Core: EF.Functions window functions or raw SQL.
```

#### 10.6 UPSERT
```
Explain UPSERT: atomic insert-or-update. PostgreSQL: INSERT ... ON CONFLICT (target) DO UPDATE SET col = EXCLUDED.col (conflict on PK or unique index → update). SQL Server: MERGE statement (complex, prone to race conditions — use with caution), or INSERT ... WHERE NOT EXISTS (not truly atomic). MySQL: INSERT ... ON DUPLICATE KEY UPDATE, REPLACE INTO (delete + insert). Cover that MERGE in SQL Server has race condition bugs under concurrent load — avoid or wrap in serializable transaction. .NET: EF Core ExecuteSqlRaw for UPSERT SQL, or use database-specific libraries. Show pattern for "upsert counter" (ON CONFLICT (key) DO UPDATE SET count = table.count + 1). Cover that EF Core AddOrUpdate is not a true database UPSERT.
```

#### 10.7 Avoiding SELECT *
```
Explain why SELECT * is harmful: fetches unnecessary columns (wastes network bandwidth, memory, I/O), prevents covering indexes (optimizer can't use index-only scan if extra columns needed), breaks views and queries when schema changes (column added = more data returned), makes code fragile (column order matters in some ORMs). Show that projecting only needed columns (SELECT id, name FROM users) → smaller row size → more rows per page → better buffer pool efficiency. EF Core: .Select(u => new { u.Id, u.Name }) generates projected SQL (not SELECT *). Cover that EF Core's default .ToList() generates SELECT with all mapped columns — use projection for read models. Cover that DTO projection with Select() is more efficient than loading entity then mapping.
```

#### 10.8 Query Hints & Force Index
```
Cover query hints as a last resort: force index (USE INDEX in MySQL, WITH (INDEX(idx_name)) in SQL Server, set enable_seqscan=off in PostgreSQL session), join hints (FORCE ORDER, LOOP JOIN, HASH JOIN in SQL Server), parallelism hints (MAXDOP in SQL Server, max_parallel_workers_per_gather in PostgreSQL). Cover when hints are needed: optimizer chooses wrong plan due to bad statistics, parameter sniffing, or complex query structure. Cover dangers: hints lock plan choice (stats may change, hint becomes wrong), maintenance burden. Better solutions before hints: UPDATE STATISTICS / ANALYZE, create better indexes, simplify query, use Query Store plan forcing (SQL Server). .NET: use hints via raw SQL or EF Core interceptors.
```

#### 10.9 Stored Procedures vs Application Queries
```
Compare stored procedures (SQL Server/PostgreSQL functions) vs application-side queries: stored procedures — reduced network round-trips (multiple SQL in one call), plan precompiled and cached, security (EXECUTE permission without table access), harder to version/deploy (separate DB change), harder to test, business logic in DB. Application queries — easier testing, version control with code, ORM support, easier refactoring. Modern consensus: put data manipulation in app (ORMs handle well), use stored procedures for: batch operations reducing round-trips, legacy migration, security isolation. .NET: EF Core FromSqlRaw for SP calls, or use Dapper for raw SQL. Cover that EF Core's LINQ-to-SQL approach reduces need for stored procedures.
```

#### 10.10 SQL Anti-Patterns
```
Cover 10 SQL anti-patterns common in .NET: (1) NOLOCK hint (dirty reads, phantom reads — don't use), (2) Wildcard first LIKE '%value%' (can't use index — use full-text search), (3) Functions on indexed columns in WHERE (YEAR(date) = 2024 kills index — use date BETWEEN), (4) OR on multiple columns (prevents index use — consider UNION ALL), (5) Correlated subquery in SELECT (runs per row — use JOIN or window function), (6) SELECT DISTINCT to hide duplicates (symptoms of bad JOIN — fix the join), (7) Implicit type conversion in WHERE (column type mismatch — prevent index use), (8) Not handling NULL correctly (NULL != NULL, use IS NULL/IS NOT NULL), (9) Cursor for row-by-row processing (use set-based SQL instead), (10) Non-deterministic ORDER BY without unique column (inconsistent pagination). Show EF Core equivalents for each.
```

---

### 11. EF Core Internals

#### 11.1 EF Core Architecture
```
Explain EF Core layered architecture: DbContext (unit of work + identity map — tracks entities), DbSet<T> (access point for queries on entity type), Change Tracker (tracks entity state — Unchanged, Added, Modified, Deleted, Detached), Model Builder (builds the entity model from configurations — Fluent API, data annotations, conventions), Query Pipeline (LINQ → expression tree → SQL translation → result materialization), Database Provider (abstracts database specifics — SqlServer, Npgsql, SQLite, Cosmos, etc.), Connection Management (opens/closes connections per query or SaveChanges). Show how a LINQ query flows through these layers. Cover that understanding architecture helps diagnose performance issues (change tracker overhead, query translation surprises).
```

#### 11.2 Change Tracking
```
Explain EF Core change tracking: Snapshot tracking (default — EF takes snapshot of entity property values when loaded, compares on SaveChanges to detect changes — DetectChanges() called implicitly), Proxy tracking (generates runtime proxy class that intercepts property setters to detect changes immediately — requires virtual properties, not recommended), No tracking (AsNoTracking() — no snapshot stored, entities detached). Cover performance: snapshot tracking has memory overhead (stores original values) and CPU overhead (DetectChanges compares all tracked entities). For read-only queries: always use AsNoTracking() — reduces memory by ~50% and avoids DetectChanges cost. Show that context.ChangeTracker.Entries() exposes tracked entities for debugging.
```

#### 11.3 Query Translation
```
Explain LINQ to SQL translation: EF Core builds expression tree from LINQ method chain, translates to SQL using IQueryable provider pattern. Cover that EF Core evaluates as much as possible server-side (in SQL), falls back to client-side for untranslatable expressions. Show common translation pitfalls: calling unmapped methods in Where() (forces client evaluation of entire result set), complex expressions that can't translate, database-specific functions (use EF.Functions.*). Show how to log generated SQL (AddDbContextFactory with logging, UseLoggerFactory). Cover expression tree internals: Where() adds WhereExpression, Select() adds ProjectionExpression — EF Core visits tree to build SQL. Show that compiled queries (EF.CompileQuery) cache translation result.
```

#### 11.14 Compiled Queries
```
Explain EF Core compiled queries: LINQ query is translated to SQL on first execution (expression tree → SQL translation — takes ~1-5ms per unique query shape). Compiled queries pre-translate and cache the translation. EF.CompileQuery() / EF.CompileAsyncQuery() returns a delegate. Call delegate with DbContext + parameters to execute. Benefit: eliminates translation overhead on every call — significant for frequently-called simple queries in high-throughput APIs. Show benchmark: regular query vs compiled query — ~1ms vs ~0.01ms per call. Show pattern: static compiled query delegate, called from service. Cover that compiled queries require exact parameter types. Cover that EF Core 6+ has improved query caching that reduces need for explicit compilation (but compiled queries still faster for absolute hot paths).
```

#### 11.15 AsNoTracking
```
Deep dive into AsNoTracking(): disables change tracking for query results, entities returned are in Detached state, no snapshot stored, DetectChanges not called for these entities. Benefits: ~30-50% less memory (no original values snapshot), faster materialization, smaller ChangeTracker. Use when: read-only operations (API GET endpoints, reports), entities not modified and saved. Avoid when: entities will be modified via SaveChanges (no tracking = changes not detected). Show AsNoTrackingWithIdentityResolution() (.NET 5+) — no tracking but still deduplicates entities (same entity referenced by multiple related entities → one instance — unlike plain AsNoTracking which may create duplicates). Show that AsNoTracking is the default for NoTrackingQueryBehavior option on the context.
```

#### 11.6 Loading Strategies
```
Compare EF Core loading strategies: Eager Loading (Include/ThenInclude — generates JOIN, loads related data in one query — good for always-needed relations), Explicit Loading (context.Entry(entity).Collection.LoadAsync() — load relation on demand after entity is tracked — good for conditional loading), Lazy Loading (navigation property access triggers automatic query — requires proxy or ILazyLoader injection — dangerous in web apps: N+1 by default, hidden queries, no async support without proxies). Cover Split Query (.AsSplitQuery() — loads each Include in separate query instead of JOIN — avoids Cartesian product blowup for multiple collections). Decision: eager for known-needed, explicit for conditional, never lazy in web APIs. Show performance comparison.
```

#### 11.7 Raw SQL in EF Core
```
Cover raw SQL in EF Core: FromSqlRaw / FromSqlInterpolated (returns IQueryable<T> — results tracked, can be composed with further LINQ — only works with entity types matching DbSet), ExecuteSqlRaw / ExecuteSqlInterpolated (non-query — INSERT/UPDATE/DELETE, returns affected row count). Cover SqlQuery<T>() (.NET 7+ — return arbitrary types from SQL, not just entity types). Cover security: FromSqlInterpolated / ExecuteSqlInterpolated safely parameterize (use for user input), FromSqlRaw / ExecuteSqlRaw require manual parameterization (use for table/column names only). Show pattern: complex report query with FromSqlRaw returning projection DTO via SqlQuery. Cover Dapper alongside EF Core for complex queries.
```

#### 11.8 Bulk Operations in EF Core
```
Cover bulk operations in EF Core 7+: ExecuteUpdate (set-based UPDATE without loading entities — WHERE + SET in one SQL), ExecuteDelete (set-based DELETE without loading entities). Examples: context.Users.Where(u => u.IsInactive).ExecuteDeleteAsync(), context.Products.Where(p => p.Category == "Old").ExecuteUpdateAsync(s => s.SetProperty(p => p.Price, p => p.Price * 0.9m)). Cover that these bypass Change Tracker (no entity loading, no events, no concurrency tokens). Cover third-party bulk extension libraries (EFCore.BulkExtensions, Z.EntityFramework.Extensions) for more scenarios. Show benchmark: Delete 10,000 rows — load then delete (N queries) vs ExecuteDelete (1 query) — 100x+ faster.
```

#### 11.9 EF Core Migrations
```
Explain how EF Core migrations work: snapshot of model stored (Migrations/ModelSnapshot.cs), new migration = diff between snapshot and current model → generates Up()/Down() C# migration code → applied to DB as SQL. Cover migration commands: dotnet ef migrations add, dotnet ef database update, dotnet ef migrations script (generate SQL script for production). Cover that migrations are code — review generated SQL before applying. Cover migration strategies: apply on startup (context.Database.MigrateAsync() — simple but risky for production), CI/CD scripts (generate idempotent script, apply as deployment step). Cover migration squashing (too many migrations — consolidate). Cover data migrations (seed data, transform existing data — in migration's Up() method).
```

#### 11.10 DbContext Pooling
```
Explain DbContext pooling: instead of creating/disposing DbContext per request (allocates ~100 objects), pool reuses DbContext instances. AddDbContextPool<T>(options, poolSize) — returns pooled context on request, resets and returns to pool after request (clears change tracker, local data). Benefits: reduces allocations significantly in high-throughput APIs (~30% allocation reduction in benchmarks). Limitations: state added to DbContext subclass NOT cleared between uses (add per-request init logic in OnConfiguring override or IDbContextPooledObjectPolicy). Cover IDbContextFactory<T> for creating contexts outside DI (background services, parallel work, long-running operations). Show AddDbContextPool configuration and benchmark vs AddDbContext.
```

---

### 12. Connection Management

#### 12.1 Connection Pooling
```
Explain database connection pooling: creating a new TCP connection + authenticating takes ~10-100ms. Pooling reuses connections. ADO.NET connection pool: opened per connection string, maintains min/max connections, connection checked out on open, returned to pool on close/dispose. Show that SqlConnection.Open() + connection.Dispose() does NOT destroy the connection — returns to pool. Pool lifecycle: idle connections closed after timeout, new connections created up to max. Cover that connection pool is per process per connection string — changing connection string parameter order creates separate pool. .NET: always dispose DbConnection (using statement / await using), never hold connection open longer than needed. Cover that EF Core manages connection lifecycle automatically.
```

#### 12.2 Pool Sizing
```
Explain connection pool sizing: too small → pool exhaustion (threads waiting for connection), too large → database overwhelmed (too many concurrent queries). Optimal size = number of concurrent queries database can handle efficiently (typically cores × 2-4 for PostgreSQL). Cover Little's Law: pool_size = throughput × avg_connection_hold_time. ADO.NET defaults: max pool size = 100. Show that 100 connections × 10 databases = 1000 connections to one PostgreSQL (exceeds practical limit). PgBouncer/ProxySQL as connection poolers (server-side pooling — pool between app and database → fewer actual database connections). Cover Npgsql multiplexing (.NET — multiple commands over one physical connection). .NET: set Max Pool Size appropriately, not blindly high.
```

#### 12.3 Connection Strings & Security
```
Cover connection string security in .NET: never hardcode credentials (in appsettings.json checked into git — common mistake), use environment variables or secrets management (Azure Key Vault, AWS Secrets Manager, .NET Secret Manager for dev). Cover connection string parameters: timeout settings (Connect Timeout, Command Timeout), pool settings (Minimum Pool Size, Maximum Pool Size), TLS (Encrypt=True, TrustServerCertificate=False for SQL Server, SSL Mode=Require for PostgreSQL). Cover that connection string should NOT be logged — exclude from log output. Cover IDbConnectionFactory pattern for injecting connection factory instead of connection string. Show managed identity connection (no password in connection string — Azure AD auth for SQL Server/PostgreSQL in Azure).
```

#### 12.4 Pool Exhaustion
```
Explain connection pool exhaustion: all connections in use, new requests wait (timeout → InvalidOperationException "timeout expired waiting for a connection from the pool"). Causes: long-running transactions hold connections, async deadlocks (threads blocked waiting for connection while holding async context), too many concurrent requests, leaked connections (not disposed). Diagnosis: monitor pool metrics (SqlConnection pooling performance counters, Npgsql metrics), watch for "waiting for connection" in slow queries. Fixes: dispose connections promptly, reduce transaction scope, increase pool size (short-term), add PgBouncer (long-term), optimize slow queries (reduce connection hold time). .NET: EF Core DbContext scoped per request → connection returned after request → correct pattern.
```

#### 12.5 Async Database Access
```
Explain why async database access matters: synchronous database calls block ThreadPool threads while waiting for query response (10ms query = 10ms blocked thread), limits throughput on same thread count. Async (await command.ExecuteReaderAsync()) frees ThreadPool thread during query execution — thread can serve other requests. Impact: with 100ms average query time, sync approach = 1 request per thread (10 threads = 10 RPS), async = 100+ RPS with same 10 threads (thread freed while waiting for DB). Show that EF Core has full async API (ToListAsync, SaveChangesAsync, FindAsync, FirstOrDefaultAsync). Rule: always use async database calls in ASP.NET Core. Cover that using wrong sync methods in async context causes ThreadPool starvation.
```

#### 12.6 Resilient Connections
```
Show resilient database connection patterns in .NET: EF Core built-in retry (EnableRetryOnFailure() for SQL Server — handles transient errors: connection failure, timeout, deadlock), Npgsql NodaTime retry (EnableRetryOnFailure for PostgreSQL). Cover Polly for custom retry: transient SQL errors (timeout, connection reset), exponential backoff with jitter (avoid thundering herd on DB restart). Show transient error detection: SqlException.Number for SQL Server (1205 deadlock, -2 timeout), PostgreSQL SQLSTATE codes. Cover circuit breaker for database (Polly CircuitBreaker — stop hammering failed DB, allow recovery). Show resilience pipeline: retry(3) + circuit breaker + timeout. .NET: AddDbContext + EnableRetryOnFailure is minimum viable resilience.
```

---

### 13. Schema Design

#### 13.1 Normalization
```
Explain normalization forms concisely: 1NF (atomic values — no repeating groups, no arrays in columns), 2NF (1NF + no partial dependency — non-key attributes depend on entire composite key, not just part of it), 3NF (2NF + no transitive dependency — non-key attributes depend only on key, not on other non-key attributes), BCNF (3NF + every determinant is a candidate key — stricter). Show a denormalized orders table (order_id, customer_name, customer_email, product_name, product_price, quantity) → normalize to customers, products, orders, order_items. Cover that 3NF is typically the target for OLTP. Cover that normalization trade-off: more tables → more joins (performance cost but update anomaly prevention). .NET: EF Core model often reflects 3NF naturally (separate entities per domain concept).
```

#### 13.2 Denormalization
```
Explain strategic denormalization: intentionally introducing redundancy to improve read performance. Techniques: storing precomputed aggregates (user.order_count — avoid COUNT every read), flattening joins (embedding foreign key data — customer_name in orders — avoid join for simple displays), duplicating data for different access patterns (CQRS read model). When to denormalize: read performance is critical, data is written infrequently relative to reads, joins are expensive. Risks: update anomalies (must update redundant data consistently), application complexity (maintaining consistency). .NET patterns: maintain denormalized fields via EF Core event handlers or database triggers. Cover CQRS as systematic denormalization — separate write model (normalized) and read model (denormalized for specific queries).
```

#### 13.3 Primary Keys
```
Cover primary key choices: Auto-increment integer (int/bigint IDENTITY — simple, sequential, good clustered index key, predictable, not globally unique), UUID/GUID (globally unique, no coordination needed, random UUIDs → index fragmentation, predictable UUIDs → sequential safe), COMB/ULIDsequential UUID (UUID prefix = timestamp → sorted → no fragmentation — newsequentialid() in SQL Server, UUID v7 in PostgreSQL 17+, ULID). Cover trade-offs: int PK → fragmentation-free clustered index, readable, but requires coordination (auto-increment). UUID → distributed-friendly, no coordination, but 16 bytes vs 4/8 bytes (larger foreign keys, more index space). EF Core: HasKey(), ValueGeneratedOnAdd(), UseHiLo() for batched identity. Recommendation: int for single-server, ULID/sequential UUID for distributed.
```

#### 13.4 Foreign Keys
```
Explain foreign keys: referential integrity constraint (value in FK column must exist in referenced table or be NULL). Actions: RESTRICT (reject referencing row — prevents orphans), CASCADE DELETE (delete child rows when parent deleted), CASCADE UPDATE (update FK when PK updated), SET NULL (set FK to NULL on parent delete), SET DEFAULT. Performance: FK check on insert/update = lookup in referenced table (needs index on PK — usually already exists), FK check on parent delete = lookup in child table (needs index on FK column in child — NOT added by EF Core by default). Index FK columns! Show EF Core: HasForeignKey(), OnDelete(DeleteBehavior.Cascade). Cover that FK constraints catch data integrity bugs at DB level — don't disable for "performance" without measurement.
```

#### 13.5 NULL Semantics
```
Explain SQL NULL three-valued logic: NULL means unknown, not empty/zero. NULL != NULL (SQL: NULL = NULL is NULL, not TRUE — use IS NULL). Any arithmetic with NULL = NULL. Any comparison with NULL = NULL (not TRUE or FALSE — rows with NULL in WHERE condition are excluded). Cover NULL in aggregate functions (COUNT(*) counts NULLs, COUNT(col) excludes NULLs, SUM/AVG ignore NULLs). Cover COALESCE (first non-null value), NULLIF (return NULL if two values equal — prevent divide by zero). Cover NOT IN with NULLs (NOT IN (1, 2, NULL) = no rows returned — NULL poisons NOT IN). .NET: EF Core maps null to DB NULL for nullable types, handles null comparison correctly. Watch for HasValue checks in LINQ producing correct IS NULL SQL.
```

#### 13.6 Data Types
```
Cover choosing data types correctly: integers (INT vs BIGINT — prefer BIGINT for auto-increment PKs to avoid overflow at 2.1B rows, costs only 4 extra bytes), strings (VARCHAR(n) vs TEXT — PostgreSQL: both same performance, SQL Server: TEXT deprecated, nvarchar for Unicode, varchar for ASCII — use correct character set), dates (DATE for dates only, TIMESTAMP for datetime — always store UTC, use timestamptz in PostgreSQL), money (DECIMAL(19,4) or database money type — never float/double for currency), booleans (BIT in SQL Server, BOOLEAN in PostgreSQL), JSON (JSONB in PostgreSQL — indexed, binary storage vs JSON — text, slower). .NET: EF Core maps C# types to DB types — configure explicitly for precision (HasPrecision(19, 4) for decimal money fields).
```

#### 13.7 Soft Delete
```
Cover soft delete pattern: instead of deleting rows, set deleted_at timestamp or is_deleted flag. Benefits: audit trail, data recovery, reference integrity (FKs don't break). Costs: every query needs WHERE deleted_at IS NULL filter, indexes must include or filter soft-deleted rows, table grows unboundedly. Implementation options: application-level filter (add to every query — error-prone), EF Core Global Query Filter (modelBuilder.Entity<T>().HasQueryFilter(e => !e.IsDeleted) — automatic WHERE on every query, ignored with IgnoreQueryFilters()), database-level view (CREATE VIEW active_users AS SELECT * WHERE deleted_at IS NULL). Cover partial index for soft delete (CREATE INDEX ... WHERE deleted_at IS NULL — index only active rows). .NET: EF Core Global Query Filter is the best approach.
```

#### 13.8 Temporal Tables
```
Explain temporal tables / system-versioned tables: DB automatically tracks row history (valid_from, valid_to timestamps). INSERT/UPDATE/DELETE recorded in history table. Query history: SELECT ... FOR SYSTEM_TIME AS OF '2024-01-01'. SQL Server: native temporal tables (SYSTEM_VERSIONING = ON). PostgreSQL: temporal_tables extension or application-level implementation with triggers. Benefits: audit trail without application code, point-in-time queries, compliance requirements. Cover that EF Core 6+ supports SQL Server temporal tables: IsTemporal(), ToTable().IsTemoral(), querying history with TemporalAsOf/TemporalBetween/TemporalFromTo/TemporalContainedIn/TemporalAll. Show a complete temporal table scenario: audit log, regulatory requirement, "what did the data look like yesterday?"
```

#### 13.9 Schema Design for EF Core
```
Cover EF Core schema design conventions and Fluent API: conventions (PK naming: Id or TypeId → auto-detected, string → nvarchar(max) in SQL Server, not null by default), Fluent API overrides (HasMaxLength, HasColumnType, HasDefaultValue, IsRequired, HasIndex, HasForeignKey, HasComputedColumnSql). Cover that EF Core conventions are good defaults but production schemas need explicit configuration (max length for varchar columns, decimal precision, timestamp UTC handling). Show common EF Core schema pitfalls: nvarchar(max) everywhere (prefer explicit length), missing FK indexes, missing unique constraints, GUID PKs without sequencing. Cover value converters for custom type mappings (Enums, value objects). Show a production-ready entity configuration with all best practices.
```

---

### 14. Replication & HA

#### 14.1 Replication Fundamentals
```
Explain replication: copy data from primary (leader) to one or more replicas (followers). Purpose: high availability (failover), read scaling (distribute reads), disaster recovery (replica in different region), analytics (run reports on replica, not primary). Cover replica lag: time between primary write and replica having same data. Replication modes: synchronous (primary waits for replica acknowledgment before committing — zero lag, slower writes), asynchronous (primary commits, replica catches up later — lag possible, faster writes). Cover that most databases default to async replication. .NET considerations: connecting to replica for reads must account for possible stale data (acceptable for eventual consistency scenarios, not for read-your-own-writes).
```

#### 14.2 Sync vs Async Replication
```
Compare synchronous and asynchronous replication: Synchronous (primary waits for at least one replica to confirm write before responding to client — zero RPO/data loss but write latency = primary + network + replica, replica failure blocks primary writes). Asynchronous (primary commits immediately, streams changes to replica — replica may be behind by seconds or more — low write latency but replica may be stale and lose data on primary failure). Semi-synchronous (wait for one replica, not all — balance). Cover PostgreSQL: synchronous_standby_names for synchronous replication, WAL streaming for async. SQL Server: Always On Availability Groups (sync or async per replica). .NET: read-your-writes consistency requires reading from primary or adding delay after write.
```

#### 14.3 Replication Types
```
Cover replication methods: Statement-based (replicate SQL statements — non-deterministic functions cause divergence, triggers/stored procedures may differ — MySQL default before 5.7, now row-based default), Row-based (replicate actual row changes — exact, safe, but generates more data for large updates), Logical replication (PostgreSQL — decode WAL into logical changes, replicate selectively by table, works across versions and to non-PostgreSQL systems — Debezium uses this for CDC), Physical/binary replication (exact disk block copy — fast, same version required — PostgreSQL streaming replication default). Cover CDC (Change Data Capture) — event stream of all database changes — used for event sourcing, cache invalidation, ETL. .NET: Debezium → Kafka → .NET consumer pattern for CDC.
```

#### 14.4 Read Replicas in .NET
```
Show using read replicas in .NET: separate connection string for read replica, read-only queries (reports, GET requests) → replica, write queries + transactions → primary. EF Core: two DbContext configurations (primary and replica), or interceptors to route based on query type. Cover MultipleActiveResultSets interaction. Show connection string for replica in SQL Server Always On (ApplicationIntent=ReadOnly → routes to readable secondary). Cover that read replicas can be stale — implement retry or fallback to primary if stale data causes issues. Show the pattern: primary DbContext for commands, replica DbContext for queries (CQRS physical separation). Cover load balancing across multiple replicas (round-robin via client or via load balancer / PgBouncer).
```

#### 14.5 Failover & Promotion
```
Explain failover: primary fails → replica promoted to new primary. Automatic failover via orchestrator (Patroni for PostgreSQL, SQL Server Always On AG listener, AWS RDS Multi-AZ, Azure SQL Business Critical). Manual failover for planned maintenance. Cover split-brain risk: both nodes think they're primary (resolved by fencing — STONITH, preventing old primary from writing). Cover RTO (Recovery Time Objective — how long to failover, typically 10-60 seconds for auto failover), RPO (Recovery Point Objective — data loss, 0 for sync, seconds for async). .NET: connection strings should use virtual IP / listener (not primary's actual IP) so reconnect after failover works automatically. Cover retry logic for connection errors during failover.
```

#### 14.6 Replication Lag
```
Explain replication lag: delay between primary commit and replica having same data. Causes: network latency, replica I/O bound, replica CPU bound, replication serialization (MySQL single-threaded replication → bottleneck), large transactions. Measuring lag: PostgreSQL pg_stat_replication.write_lag/replay_lag, MySQL Seconds_Behind_Master, CloudWatch/Azure Monitor replication lag metric. Consequences in .NET: read from replica immediately after write → may get stale data (read-your-own-writes violation). Mitigations: route writes + immediate reads to primary (session consistency), add delay after write before reading replica, implement version tracking (write returns version, reader waits until replica reaches that version). Cover that lagging replica can also indicate primary is under pressure.
```

---

### 15. Sharding & Partitioning

#### 15.1 Table Partitioning
```
Explain table partitioning: divide large table into smaller partitions (same schema, logically one table). Partition by: range (date-based — orders_2024_q1, orders_2024_q2), list (region — us_orders, eu_orders), hash (even distribution). Benefits: partition pruning (queries filtered on partition key only read relevant partitions — huge scan reduction), easier archival (drop old partition instead of DELETE), parallel query across partitions. Cover PostgreSQL declarative partitioning (PARTITION BY RANGE/LIST/HASH), SQL Server table partitioning (partition function + scheme). .NET: partitioning is transparent to app — same EF Core queries, optimizer handles partition pruning. Show EXPLAIN showing partition pruning. Cover that partition key must be in WHERE clause for pruning to work.
```

#### 15.2 Sharding
```
Explain sharding: horizontal scaling — distribute data across multiple separate database instances (each shard is an independent database). Each shard stores subset of data. Enables scaling beyond single machine capacity. Complexity: queries across shards require application-level fan-out, transactions across shards are distributed transactions (avoid or use Saga pattern), schema changes must be applied to all shards, resharding is painful. When to shard: table doesn't fit on one server (>500GB-1TB), write throughput exceeds one server's capacity. When NOT to shard: table fits on one server, queries are cross-shard (everything becomes slow), team lacks distributed systems expertise. .NET: sharding requires application-level routing logic — no transparent ORM support.
```

#### 15.3 Sharding Strategies
```
Cover sharding strategies: Range sharding (shard by value range — users 1-1M on shard 1, 1M-2M on shard 2 — simple routing but hot spots if recent IDs are hot), Hash sharding (shard = hash(key) % num_shards — even distribution, but range queries touch all shards), Directory/Lookup sharding (separate lookup service maps key to shard — flexible but lookup is single point of failure), Geographic sharding (users in EU → EU shard — data sovereignty compliance). Cover hotspot problem: new users created sequentially → most writes go to last shard. Fix: hash sharding or pre-assigned ID ranges. Show .NET sharding implementation: custom IDbConnectionFactory that maps entity ID to connection string.
```

#### 15.4 Cross-Shard Queries & Transactions
```
Explain cross-shard problems: query spanning multiple shards requires fan-out (query each shard, merge results in application — expensive), transactions across shards require 2PC or Saga pattern (complex, slow), cross-shard JOINs are impossible natively (load data from both shards, join in application). Mitigations: design shard key to colocate related data (all user's data on same shard — user-based sharding), denormalize to avoid cross-shard joins, use global secondary indexes (some NewSQL DBs support this). .NET: implement fan-out in application: query each shard in parallel (Task.WhenAll), aggregate results. Cover that cross-shard queries are slow by nature — design schema to avoid them.
```

#### 15.5 Consistent Hashing
```
Explain consistent hashing: solves the problem of resharding. Regular hash sharding: adding shard requires remapping (hash(key) % N+1) → most keys move. Consistent hashing: arrange hash space as ring (0-2^32), each shard owns range on ring, adding shard → only keys in that shard's range move (average N/(N+1) keys move). Cover virtual nodes (each physical shard has multiple points on ring — better load balance). Used in: Cassandra, DynamoDB, memcached (ketama). .NET: implement consistent hash ring in sharding library or use Cassandra SDK (handles internally). Cover rebalancing: when new shard added, move data in background, then redirect traffic.
```

#### 15.6 Sharding in .NET
```
Show sharding implementation patterns in .NET: shard router (maps entity key to DbContext/connection string), ShardedDbContextFactory (creates DbContext for correct shard based on entity ID), tenant-based sharding (multi-tenant SaaS — each tenant on separate shard — shard selected from tenant context). Show ASP.NET Core middleware extracting tenant from JWT, injecting correct connection string into DbContext. Cover libraries: Marten (PostgreSQL-based document/event store with sharding support), ShardingCore (EF Core sharding extension). Cover that most production sharding in .NET is custom — no standard solution. Show fan-out query across all shards for cross-shard aggregate. Cover shard migrations: deploy schema changes to all shards simultaneously.
```

---

### 16. Distributed Databases

#### 16.1 CAP Theorem
```
Explain CAP theorem: distributed system can guarantee at most 2 of 3: Consistency (every read gets most recent write or error), Availability (every request gets a response — no error), Partition Tolerance (system continues operating when network partition occurs). Since network partitions are inevitable, choose CA vs CP during partition: CP systems (reject requests to avoid inconsistency — ZooKeeper, HBase, etcd), AP systems (return potentially stale data — Cassandra, DynamoDB, CouchDB), CA is only possible without partitions (single-node databases). Cover that CAP is about partitions specifically — in normal operation all three can hold. Explain PACELC for more nuanced trade-offs. .NET: PostgreSQL is CP (sacrifices availability for consistency during partition).
```

#### 16.2 PACELC
```
Explain PACELC: extension of CAP — during Partition, choose between Availability and Consistency; Else (no partition), choose between Latency and Consistency. Most databases trade consistency for latency in normal operation. Cover classifications: Cassandra = PA/EL (available during partition, low latency without partition — eventual consistency), DynamoDB = PA/EL (same), PostgreSQL = PC/EC (consistent during partition, consistent without partition — higher latency from MVCC+WAL). Cover that PACELC is more practical than CAP for choosing databases for .NET applications. Show decision: need strong consistency and can tolerate latency → PostgreSQL/CockroachDB; need low latency, can tolerate eventual consistency → Cassandra/DynamoDB.
```

#### 16.3 Distributed Transactions
```
Cover distributed transactions: transactions spanning multiple services or databases. 2PC (Two-Phase Commit): coordinator asks all participants to prepare (phase 1), then commits if all prepared (phase 2) — atomic but blocking (coordinator failure → participants blocked), slow (two round-trips). Saga pattern: sequence of local transactions with compensating transactions for rollback — eventually consistent but no ACID. Saga types: choreography (events trigger next step), orchestration (central coordinator calls each step). Cover that 2PC is rarely used in modern microservices (blocking, coordinator SPOF). Saga is the dominant pattern. .NET: MassTransit Saga, NServiceBus Saga, Wolverine Saga — state machine implementations. Cover outbox pattern (write message and DB change atomically — ensure message sent if commit succeeds).
```

#### 16.4 Distributed SQL
```
Explain NewSQL / distributed SQL databases: CockroachDB (PostgreSQL wire-compatible, Raft-based consensus per range, serializable isolation, geo-distribution, automatic sharding, 2-5ms for local, 50-200ms for geo-distributed), YugabyteDB (PostgreSQL + Cassandra APIs, DocDB storage, Raft consensus, ACID with distributed transactions). Benefits: horizontal scaling + SQL + ACID (best of both worlds). Limitations: higher latency than single-node (consensus round-trips), complex operational model, higher cost. Cover when to use: global applications needing data locality compliance, scales beyond single PostgreSQL server, need SQL semantics with horizontal write scaling. .NET: CockroachDB is PostgreSQL-compatible → Npgsql works, EF Core works with minor adaptations.
```

#### 16.5 Google Spanner
```
Explain Google Spanner: globally distributed database with external consistency (stronger than serializable — transactions have globally meaningful timestamps, no read-your-own-writes issues across regions). Key innovations: TrueTime (GPS + atomic clocks in data centers — bounded clock uncertainty, used for globally consistent timestamps), Paxos consensus per shard, global secondary indexes. Latency: ~5ms single-region, ~50-100ms multi-region. Used at Google for AdWords, YouTube. Spanner-inspired: CockroachDB (logical clocks instead of TrueTime), AlloyDB. .NET: Cloud Spanner client library for .NET (Google.Cloud.Spanner.Data), EF Core provider (Google.Cloud.Spanner.EntityFrameworkCore). Relevant when building globally distributed systems at extreme scale.
```

#### 16.6 Saga Pattern in .NET
```
Show Saga pattern implementation in .NET: orchestration saga (MassTransit SagaStateMachine — defines states, events, transitions, compensation), choreography saga (events trigger handlers which publish next events — no central coordinator). Show a complete e-commerce order saga: PlaceOrder → ReserveInventory → ChargePayment → ShipOrder, with compensation: if ChargePayment fails → ReleaseInventory → FailOrder. Cover saga state persistence (MassTransit stores saga state in database — EF Core, Redis, MongoDB). Cover idempotency (saga steps must be idempotent — retried on failure — use idempotency keys). Cover timeout handling (saga expires if step doesn't complete in time). Show outbox pattern integration (write saga event + DB change atomically).
```

---

### 17. NoSQL Databases

#### 17.1 Document Databases
```
Explain document databases (MongoDB, CouchDB, Firestore): store JSON/BSON documents instead of rows. Schema-flexible (each document can have different structure). Embedded documents for related data (order embeds items — no join needed). Atomicity: per-document atomic operations (multi-document transactions available in MongoDB 4.0+). Query: find documents by field value, nested field, array element. Indexes on any field including nested. Cover MongoDB .NET driver: IMongoCollection<T>, FindAsync with filters, InsertOneAsync, UpdateOneAsync with update operators ($set, $push, $inc). EF Core Cosmos DB provider for MongoDB-like pattern. When to use: flexible schema (content management, product catalog with variable attributes), hierarchical data, rapid iteration. When not: complex joins between collections, reporting.
```

#### 17.2 Key-Value Stores
```
Cover Redis as the dominant key-value store: in-memory, O(1) get/set, rich data structures (string, list, hash, set, sorted set, stream, JSON, TimeSeries). Use cases in .NET: session storage (IDistributedCache → Redis), caching (frequently-read slow data — cache-aside pattern), rate limiting (INCR + EXPIRE pattern), pub/sub (Redis channels for notifications), distributed locks (SETNX + EXPIRE or Redlock algorithm), leaderboards (sorted set), job queues (Redis-backed Hangfire, BullMQ equivalent). StackExchange.Redis for .NET: IDatabase.StringGetAsync/StringSetAsync, HashGetAsync/HashSetAsync. Cover Redis persistence (RDB snapshots + AOF log — not a primary database). Cover Redis Cluster for horizontal scaling. Cover Valkey (Redis fork after license change).
```

#### 17.3 Wide-Column Stores
```
Explain wide-column stores (Cassandra, HBase, ScyllaDB): rows identified by partition key (determines shard), each row can have many columns (variable, sparse), rows within partition sorted by clustering key. Optimized for: write-heavy workloads (LSM-Tree storage), time-series data, IoT, event logs. Cassandra: no joins, no transactions across partitions, eventual consistency by default (tunable with consistency levels), designed for multi-datacenter. CQL (Cassandra Query Language) similar to SQL but limited. .NET: DataStax C# driver. Design philosophy: model around query patterns first (denormalize for each query). Cover that bad partition key → hot partitions → performance degradation. When to use: time-series, event logs, high write throughput, multi-region.
```

#### 17.4 Graph Databases
```
Explain graph databases (Neo4j, Amazon Neptune, TigerGraph): native storage of nodes and relationships. Traversal: O(depth) regardless of data size (vs SQL JOIN which scans tables). Use cases: social networks (friends of friends), recommendation engines (users who bought X also bought Y), fraud detection (transaction network analysis), knowledge graphs, access control (complex permission hierarchies). Neo4j Cypher query language: MATCH (u:User)-[:FOLLOWS]->(f:User) WHERE u.name = 'Alice' RETURN f. .NET: Neo4j.Driver for .NET. Cover when graph DB wins vs SQL: recursive relationships (org hierarchies in SQL = expensive recursive CTE, graph = fast traversal), variable-depth relationship queries. Cover that most use cases don't need graph DB — PostgreSQL recursive CTEs handle many graph queries.
```

#### 17.5 Time-Series Databases
```
Explain time-series databases (InfluxDB, TimescaleDB, Prometheus, QuestDB): optimized for time-stamped data (metrics, events, sensor readings). Characteristics: high write throughput (millions of data points/second), time-based queries (range queries, downsampling, aggregation over time windows), automatic retention policies (delete old data), compression (similar values in time series compress extremely well). TimescaleDB: PostgreSQL extension (hypertables, continuous aggregates, time bucketing) — SQL interface + time-series optimization. InfluxDB: TSM storage engine (write-optimized), Flux query language. Prometheus: pull-based metrics collection, PromQL. .NET: use TimescaleDB with Npgsql for SQL familiarity, InfluxDB.Client for InfluxDB, OpenTelemetry for metrics. Cover time_bucket() for aggregation.
```

#### 17.6 Search Engines
```
Cover search engines (Elasticsearch, OpenSearch, Meilisearch, Typesense, Algolia) as specialized databases for full-text search: inverted index (token → document list), relevance scoring (BM25, TF-IDF), faceting (aggregate counts by field value), highlighting (show matching text in context), fuzzy matching (typo tolerance), geospatial queries. Not a primary database — sync from operational DB (CDC or application dual-write). .NET: NEST (Elasticsearch .NET client), Elastic.Clients.Elasticsearch (new official client). Meilisearch is simpler, developer-friendly alternative for medium datasets. Cover the pattern: write to PostgreSQL (source of truth) → sync to Elasticsearch (search index) → search queries → Elasticsearch, data queries → PostgreSQL. Cover eventual consistency in search index.
```

#### 17.7 SQL vs NoSQL for .NET
```
Provide a practical decision guide for SQL vs NoSQL in .NET projects: use SQL (PostgreSQL/SQL Server) for: ACID transactions required, complex relational queries, reporting/analytics, team familiar with SQL, compliance requirements (audit trail, foreign keys), unknown future query patterns. Use NoSQL for specific patterns: MongoDB for flexible schema + hierarchical data, Redis for caching + session, Cassandra for high-write time-series, Elasticsearch for full-text search, Neo4j for deep graph traversal. Cover polyglot persistence: use multiple databases for different concerns (PostgreSQL for orders, Redis for sessions, Elasticsearch for search — each database for what it does best). Cover operational complexity of polyglot. Most .NET startups: start with PostgreSQL + Redis, add others only as specific need is proven.
```

---

### 18. Performance Tuning

#### 18.1 Finding Slow Queries
```
Show how to find slow queries: PostgreSQL — pg_stat_statements (aggregate stats per query shape: total_time, calls, mean_time, rows — find highest total_time queries, not just slowest single query), slow query log (log_min_duration_statement = 1000ms), pg_stat_activity for running queries (find queries > N seconds). SQL Server — Query Store (GUI in SSMS, tracks plan changes), sys.dm_exec_query_stats (query stats since startup), sys.dm_exec_requests (currently running). MySQL — slow query log (slow_query_log = 1, long_query_time = 1), performance_schema.events_statements_summary. .NET: Application Insights / OpenTelemetry captures query duration per database call — find slow requests, then drill into DB queries. Show pg_stat_statements output analysis.
```

#### 18.2 Index Usage Analysis
```
Show how to analyze index usage: PostgreSQL — pg_stat_user_indexes (idx_scan count — unused indexes have 0 scans, drop them), pg_stat_user_tables (seq_scan vs idx_scan ratio — high seq_scan on large tables = missing index), pg_statio_user_indexes (idx_blks_hit/read — cache hit rate), EXPLAIN ANALYZE for specific query. SQL Server — sys.dm_db_index_usage_stats (user_seeks, user_scans, user_lookups, user_updates — seeks = good, scans = full index scans), missing index DMVs (sys.dm_db_missing_index_details). MySQL — SHOW INDEX FROM table, information_schema.STATISTICS. .NET workflow: find slow query → EXPLAIN ANALYZE → identify seq scan → check pg_stat_user_indexes for existing coverage → create missing index → verify EXPLAIN ANALYZE uses new index.
```

#### 18.3 Plan Analysis
```
Teach reading query execution plans for performance diagnosis: PostgreSQL EXPLAIN ANALYZE output — cost (estimated optimizer cost units, relative not absolute), actual time (real ms, both startup and total), rows (estimated vs actual — large discrepancy = bad statistics), loops (node executed N times — nested loop shows multiplication). Key nodes to look for: Seq Scan on large table (missing index), Hash Join with batches (spilling to disk — not enough work_mem), Sort with external sort (not enough work_mem), Nested Loop with large row count (bad join order). Show a concrete slow query EXPLAIN output, identify the problem, show fix. Cover that explain.depesz.com and explain.dalibo.com visualize PostgreSQL EXPLAIN output.
```

#### 18.4 Statistics Maintenance
```
Cover database statistics maintenance: PostgreSQL — ANALYZE (collects column statistics, runs automatically via autovacuum), pg_statistic (raw stats), pg_stats (friendly view), default_statistics_target (100 — increase to 500 for skewed distributions to get better histograms). SQL Server — UPDATE STATISTICS (full or sampled scan), auto-update threshold (20% rows change for tables <500K rows — for large tables, auto-update is slow to trigger), Query Store plan regression detection. MySQL — ANALYZE TABLE, innodb_stats_persistent. When to manually analyze: after bulk load (autovacuum has delay), after large DELETE/UPDATE (stats may be stale before autovacuum runs). .NET workflow after bulk EF Core operations: run ANALYZE via ExecuteSqlRaw.
```

#### 18.5 Connection Poolers
```
Cover server-side connection poolers: PgBouncer (PostgreSQL — transaction pooling: connection returned to pool after each transaction, many clients share few server connections, supports thousands of client connections → tens of server connections, recommended for all PostgreSQL deployments), ProxySQL (MySQL — query routing, read/write splitting, query caching, connection pooling), Pgpool-II (PostgreSQL — connection pooling + load balancing + replication management). Transaction vs session pooling: transaction mode (connection released per transaction — statements can't use session-level features like prepared statements), session mode (connection held per client session — less sharing). .NET: configure Npgsql with Max Pool Size matching PgBouncer's max_client_conn divided by instance count. Cover that PgBouncer + connection_limit = safer than high ADO.NET pool size.
```

#### 18.6 Caching Strategies
```
Cover caching layers for database performance: query result cache (application-level — Redis, IMemoryCache — cache SELECT results, invalidate on write), materialized views (DB-level precomputed query result — PostgreSQL REFRESH MATERIALIZED VIEW, SQL Server indexed views — fast reads, stale until refreshed), HTTP cache (ETag/Last-Modified for API responses), CDN (static/semi-static content). Cache patterns: cache-aside (read → miss → load from DB → store in cache), write-through (write to cache and DB simultaneously), write-behind (write to cache, async flush to DB). Cache invalidation strategies: TTL (simple, may be stale), event-driven (invalidate on data change — Redis pub/sub + cache bust), version-based. .NET: IDistributedCache + Redis for distributed cache, IMemoryCache for local. Show cache-aside with EF Core + Redis.
```

#### 18.7 Database Benchmarking
```
Cover database benchmarking tools: pgbench (PostgreSQL built-in — TPC-B-like workload, custom scripts for specific query patterns, measures TPS and latency), sysbench (MySQL/PostgreSQL — OLTP benchmark, fileio benchmark, threads benchmark), HammerDB (TPC-C/TPC-H for SQL Server/Oracle/PostgreSQL — realistic OLTP/OLAP workloads), wrk/k6/Gatling (HTTP-level benchmarking that exercises DB through app). Show pgbench commands: initialize, run standard workload, run custom script. Cover benchmark methodology: warm-up period (allow buffer pool to fill), steady-state measurement, vary concurrency (find optimal connection count vs TPS curve), isolate DB from app for pure DB benchmarks. .NET: benchmark DB layer separately from HTTP layer using Respawn for DB reset between runs.
```

#### 18.8 Tuning EF Core Queries
```
Systematic guide to tuning EF Core queries: (1) Log and review generated SQL (all queries, check for N+1 patterns), (2) Add AsNoTracking() for read-only queries, (3) Project only needed columns (.Select(e => new { e.Id, e.Name })), (4) Use compiled queries for hot paths, (5) Replace Include() causing Cartesian explosion with AsSplitQuery(), (6) Add appropriate database indexes for frequently filtered/sorted columns, (7) Use ExecuteUpdate/ExecuteDelete for bulk operations, (8) Avoid client-side evaluation (check for warning logs), (9) Use raw SQL (FromSqlRaw) for complex queries that don't translate well, (10) Enable connection pooling and DbContext pooling. Show before/after SQL for each optimization. Provide a tuning checklist.
```

---

### 19. Specific Databases

#### 19.1 SQL Server for .NET
```
SQL Server-specific features relevant for .NET: Always On Availability Groups (HA + readable secondaries — configure ApplicationIntent=ReadOnly in connection string for read replica), Query Store (track plan regressions — enable by default in SQL Server 2022, view in SSMS), In-Memory OLTP (memory-optimized tables — for extremely high-throughput OLTP — special EF Core support), columnstore indexes (for analytical queries on OLTP data — SQL Server HTAP), Change Data Capture (built-in CDC — track changes without triggers), PolyBase (query external data sources). DMVs for monitoring: sys.dm_exec_requests, sys.dm_os_wait_stats, sys.dm_db_index_usage_stats. EF Core Microsoft.EntityFrameworkCore.SqlServer package — SQL Server-specific features exposed via extension methods.
```

#### 19.2 PostgreSQL for .NET
```
PostgreSQL-specific features for .NET: JSONB (binary JSON with indexing — GIN index on JSONB for fast JSON queries, EF Core Npgsql JSONB mapping), Arrays (native array type — avoid normalization for simple lists), Full-Text Search (tsvector + GIN index — EF Core Npgsql extensions), Range types (daterange, tstzrange — EF Core Npgsql mapping), pg_stat_statements (query analytics — enable in shared_preload_libraries), PostGIS (geospatial — EF Core NetTopologySuite for spatial queries), LISTEN/NOTIFY (pub/sub — Npgsql OpenReplicationChannel for CDC). Extensions: TimescaleDB, pgvector (vector similarity for AI embeddings), pg_partman (partition management). Npgsql NuGet: connection string parameters for pooling, multiplexing (multiple commands over one connection), Unix socket support.
```

#### 19.3 MySQL / MariaDB
```
MySQL/MariaDB features for .NET: InnoDB (default — ACID, row-level locking, FK support, MVCC), EXPLAIN FORMAT=JSON for machine-readable plans, binary log (CDC source for Debezium), JSON type (MySQL 5.7+), window functions (MySQL 8.0+), generated columns (computed columns with optional indexing), pt-query-digest (Percona tool for slow query analysis), MySQL Router (connection routing for InnoDB Cluster). MariaDB differences: Aria storage engine, Spider engine (sharding), Galera Cluster (sync multi-primary replication). .NET: MySql.Data (Oracle), MySqlConnector (community — better async, MIT license — recommended), Pomelo.EntityFrameworkCore.MySql (EF Core provider). Cover that MySQL treats SELECT as non-transactional in some modes — check transaction_isolation setting.
```

#### 19.4 SQLite for .NET
```
Cover SQLite in .NET: embedded database (single file, no server), perfect for: testing (in-memory :memory:, fast teardown), mobile apps (Xamarin, MAUI), desktop apps (local storage), edge computing. WAL mode: enable for concurrent reads + one writer (PRAGMA journal_mode=WAL) — much better concurrent performance than default journal mode. Write locking: SQLite allows only one writer at a time (serialized writes — not suitable for high-concurrency write workloads). Performance tips: use transactions for bulk writes (1000x faster than auto-commit per write), appropriate cache size (PRAGMA cache_size), memory-mapped I/O (PRAGMA mmap_size). EF Core: Microsoft.EntityFrameworkCore.Sqlite, in-memory testing with UseInMemoryDatabase(). Show testing pattern: SQLite in-memory EF Core for fast integration tests without Docker.
```

#### 19.5 Redis in .NET
```
Comprehensive Redis in .NET guide using StackExchange.Redis: ConnectionMultiplexer (manage once, share across app — not IDisposable per request), IDatabase (GetAsync, SetAsync with TTL, HashGetAsync, ListPushAsync, SetAddAsync, SortedSetAddAsync), ISubscriber (pub/sub channels), pipelining (batch commands — reduces round-trips), transactions (MULTI/EXEC — limited), Lua scripts (atomic multi-command execution). Cover IDistributedCache (Microsoft abstraction — SetAsync/GetAsync with byte[] — less expressive but swappable). Cover common .NET patterns: session storage, cache-aside with sliding expiration, distributed locks (StackExchange.Redis lock extension or Redlock.net), rate limiter (INCR + EXPIRE per key), Pub/Sub for cross-instance notifications. Cover Redis connection resilience (reconnect on failure, circuit breaker). Cover keyspace design (prefix:type:id naming convention).
```

#### 19.6 MongoDB in .NET
```
MongoDB in .NET using official driver: MongoClient → IMongoDatabase → IMongoCollection<T>. CRUD: InsertOneAsync, FindAsync with FilterDefinition<T>, UpdateOneAsync with UpdateDefinition<T> ($set, $push, $inc operators), DeleteOneAsync. Query patterns: Builders<T>.Filter (type-safe filters — Eq, Gt, In, ElemMatch), Builders<T>.Update, Builders<T>.Projection. Aggregation pipeline: Match → Group → Sort → Project (powerful analytics). Indexes: CreateIndexAsync with IndexKeysDefinition (ascending, descending, text, geospatial). Transactions (multi-document — requires replica set). EF Core Cosmos provider has similar document model. Cover Marten (PostgreSQL-based document/event store — MongoDB-compatible API on top of JSONB — keeps SQL benefits). Show MongoDB change streams for real-time CDC in .NET.
```

#### 19.7 Cosmos DB
```
Cover Azure Cosmos DB for .NET: multi-model (Core SQL API, MongoDB API, Cassandra API, Gremlin, Table), globally distributed, multi-master, 99.999% availability SLA. Key concepts: database → container (collection) → items (documents), partition key (MUST be chosen carefully — determines physical partition = 10GB max, ~10K RU/s max per logical partition), RU/s (Request Units — normalized cost metric: 1 RU = 1KB GET by PK), throughput (provisioned RU/s per container or shared across containers). SDK: Microsoft.Azure.Cosmos (CosmosClient → Container → CreateItemAsync, ReadItemAsync, QueryAsync). EF Core provider (Microsoft.EntityFrameworkCore.Cosmos — limited compared to SQL). Cover change feed for event-driven processing. Cover partition key selection rules: high cardinality, even distribution, not a hotspot. Cover cost optimization: serverless vs provisioned, autoscale.
```

---

### 20. Reliability & Operations

#### 20.1 Backup Strategies
```
Cover database backup strategies: Full backup (entire database — baseline, large, infrequent), Incremental backup (changes since last backup — small, fast, requires chain to restore), Differential backup (changes since last full — middle ground), WAL/Log shipping (continuous — near-zero RPO). Point-in-time recovery (PITR): restore full backup + replay WAL to specific timestamp — requires continuous WAL archiving. Tools: pg_dump/pg_basebackup (PostgreSQL), SQL Server BACKUP DATABASE, mysqldump/xtrabackup (MySQL). Cloud: automated backups in RDS/Azure SQL/Cloud SQL. Restore testing: critical — backups are worthless without verified restores. .NET operations: ensure backup retention meets recovery requirements, test restore quarterly. Cover that logical backups (pg_dump) are portable but slow, physical backups (pg_basebackup) are fast but same version.
```

#### 20.2 Zero-Downtime Migrations
```
Cover zero-downtime schema migration strategies: Expand-Contract pattern (backward-compatible changes in phases — never break existing app). Phase 1 (Expand): add new column/table (nullable or with default — doesn't break old code), deploy new app code that writes to both old and new. Phase 2 (Migrate): backfill data to new column in batches. Phase 3 (Contract): remove old column after verifying no reads. Specific patterns: rename column (add new, copy data, switch code, drop old — never rename directly), add NOT NULL column (add nullable, backfill, add NOT NULL constraint), add index CONCURRENTLY (PostgreSQL — builds index without locking). .NET: EF Core migrations that lock tables are dangerous — use raw SQL with CONCURRENTLY, batch backfills. Cover that deploying migration and app code must account for mixed versions during rollout.
```

#### 20.3 Connection Draining & Rolling Restarts
```
Explain connection draining for database maintenance: before restarting/failover, stop accepting new connections, wait for existing queries to complete. Patterns: set max_connections to 0 for new connections (database-level), maintenance mode in load balancer (remove DB from pool), transaction draining timeout (kill queries after N seconds). Cover rolling restarts for DB clusters: replica first, then primary (with failover). Cover that .NET connection pools hold connections open — after DB restart, pool has stale connections (SqlConnection.ClearPool() / Npgsql pool reset). Cover connection retry logic: on connection failure, clear pool and retry with backoff. Show that EnableRetryOnFailure() handles this automatically in EF Core. Cover health checks for database availability in ASP.NET Core.
```

#### 20.4 Database Observability
```
Cover database observability for .NET applications: metrics (connection pool usage — PooledConnections, ConnectionsOpened/Closed via EventCounters/OpenTelemetry, query duration histogram, error rate), logs (slow query log, deadlock log, error log — structured logging recommended), tracing (OpenTelemetry database spans — query text, duration, affected rows — visible in Jaeger/Zipkin/Application Insights). Npgsql + OpenTelemetry: automatic span creation per query. EF Core + DiagnosticSource: CommandExecuted events for query tracking. Show OpenTelemetry configuration for database tracing in ASP.NET Core. Cover pg_stat_statements as in-database observability. Cover Application Insights SQL dependency tracking. Show dashboarding key DB metrics in Grafana.
```

#### 20.5 EF Core Migrations in CI/CD
```
Show EF Core migration strategies for CI/CD: (1) dotnet ef migrations script --idempotent → generates idempotent SQL script → apply in deployment pipeline, (2) context.Database.MigrateAsync() at startup → automatic but risky for production (blocks startup, no rollback), (3) Separate migration runner (Docker container running migration → exit, then app starts), (4) DbUp / FluentMigrator as alternatives (SQL-based, more control). Cover migration table (__EFMigrationsHistory) — tracks applied migrations. Cover migration validation in CI: run ef migrations list, check pending migrations fail CI if any exist. Cover rollback: EF Core has no built-in rollback — Down() method, but unreliable for data migrations — prefer forward-only migrations with compensating changes. Show GitHub Actions workflow for migration deployment.
```

---

## Quick Reference: Database Choices for .NET

| Use Case | Recommended | Why |
|---|---|---|
| General OLTP | PostgreSQL | ACID, rich features, open source |
| Windows-native | SQL Server | Deep .NET integration, SSMS tooling |
| Embedded / Testing | SQLite | No server, fast, EF Core support |
| Distributed SQL | CockroachDB | PostgreSQL-compatible, auto-sharding |
| Caching / Session | Redis | In-memory, fast, rich data structures |
| Full-Text Search | Elasticsearch / Meilisearch | Inverted index, relevance scoring |
| Document / Flexible Schema | MongoDB / Marten | BSON documents, no schema migration |
| Time-Series / Metrics | TimescaleDB / InfluxDB | Optimized for time-stamped data |
| Graph Traversal | Neo4j / Amazon Neptune | O(depth) traversal, relationship queries |
| Cloud Native (Azure) | Cosmos DB + Azure SQL | Managed, globally distributed |
| Event Sourcing | EventStoreDB / Marten | Append-only, optimized event stream |
| Queue / Pub-Sub | Redis Streams / RabbitMQ | Not a DB — but common companion |

---

## Quick Reference: EF Core Performance Checklist

| Issue | Fix |
|---|---|
| N+1 queries | `Include()` or `AsSplitQuery()` |
| Full table scan | Add index on WHERE/JOIN/ORDER BY columns |
| Slow read-only queries | Add `AsNoTracking()` |
| Loading all columns | `.Select()` projection |
| Bulk operations slow | `ExecuteUpdate()` / `ExecuteDelete()` / `SqlBulkCopy` |
| Repeated identical queries | Compiled queries (`EF.CompileQuery`) |
| Offset pagination slow | Keyset pagination (WHERE id > lastId) |
| Connection pool exhaustion | Use async, reduce transaction scope |
| DbContext tracking overhead | DbContext pooling (`AddDbContextPool`) |
| Migration locks table | Use `CONCURRENTLY` index, expand-contract |

---

*Version 1.0 — EF Core 8 / PostgreSQL 16 / SQL Server 2022*