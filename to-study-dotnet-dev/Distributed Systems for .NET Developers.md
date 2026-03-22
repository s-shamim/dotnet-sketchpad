# Distributed Systems for .NET Developers
## Compact Learning Guide with Prompts

> Each section has a prompt. Paste it to generate full content. Compact format — concept + .NET angle.

---

## Table of Contents

1. [Foundations of Distributed Systems](#1-foundations)
   - 1.1 [Why Distributed Systems — Benefits & Costs](#11-why-distributed)
   - 1.2 [Fallacies of Distributed Computing](#12-fallacies)
   - 1.3 [The Eight Fallacies — Practical Implications for .NET](#13-eight-fallacies-net)
   - 1.4 [Latency vs Bandwidth vs Throughput](#14-latency-bandwidth-throughput)
   - 1.5 [Synchronous vs Asynchronous Communication](#15-sync-vs-async)
   - 1.6 [Distributed System Models — Async, Partial Synchrony, Synchrony](#16-system-models)

2. [Consistency Models](#2-consistency-models)
   - 2.1 [Why Consistency Is Hard — Concurrent Writes, Replication](#21-why-consistency-hard)
   - 2.2 [Linearizability — Strongest Consistency](#22-linearizability)
   - 2.3 [Sequential Consistency](#23-sequential-consistency)
   - 2.4 [Causal Consistency](#24-causal-consistency)
   - 2.5 [Eventual Consistency — The Trade-off](#25-eventual-consistency)
   - 2.6 [Read-Your-Own-Writes & Monotonic Read Consistency](#26-session-consistency)
   - 2.7 [Consistency in .NET — Choosing the Right Model](#27-consistency-net)

3. [CAP & PACELC Theorems](#3-cap-pacelc)
   - 3.1 [CAP Theorem — Deep Dive](#31-cap-deep-dive)
   - 3.2 [Understanding Partition Tolerance](#32-partition-tolerance)
   - 3.3 [CP vs AP System Design Choices](#33-cp-vs-ap)
   - 3.4 [PACELC — Latency vs Consistency Trade-off](#34-pacelc)
   - 3.5 [Database Positioning on CAP/PACELC](#35-db-positioning)
   - 3.6 [Practical CAP in .NET Microservices](#36-cap-net-microservices)

4. [Time & Ordering in Distributed Systems](#4-time--ordering)
   - 4.1 [The Problem with Clocks — Clock Skew & Drift](#41-clock-problems)
   - 4.2 [Logical Clocks — Lamport Timestamps](#42-lamport-timestamps)
   - 4.3 [Vector Clocks — Detecting Causal Relationships](#43-vector-clocks)
   - 4.4 [Hybrid Logical Clocks (HLC)](#44-hybrid-logical-clocks)
   - 4.5 [Google TrueTime — Bounded Clock Uncertainty](#45-truetime)
   - 4.6 [Event Ordering in .NET Distributed Systems](#46-event-ordering-net)

5. [Consensus Algorithms](#5-consensus)
   - 5.1 [The Consensus Problem — Why It's Hard](#51-consensus-problem)
   - 5.2 [FLP Impossibility — Consensus in Async Systems](#52-flp-impossibility)
   - 5.3 [Paxos — Single-Decree & Multi-Paxos](#53-paxos)
   - 5.4 [Raft — Understandable Consensus](#54-raft)
   - 5.5 [Raft Leader Election & Log Replication](#55-raft-details)
   - 5.6 [Raft in Practice — etcd, CockroachDB, TiKV](#56-raft-in-practice)
   - 5.7 [Byzantine Fault Tolerance (BFT) — PBFT, BFT in Blockchain](#57-bft)

6. [Replication Patterns](#6-replication)
   - 6.1 [Leader-Follower (Primary-Replica) Replication](#61-leader-follower)
   - 6.2 [Multi-Leader Replication — Conflict Resolution](#62-multi-leader)
   - 6.3 [Leaderless Replication — Dynamo-Style](#63-leaderless)
   - 6.4 [Quorum Reads & Writes (R + W > N)](#64-quorum)
   - 6.5 [Replication Lag & Read-After-Write Consistency](#65-replication-lag)
   - 6.6 [Anti-Entropy & Gossip Protocols](#66-anti-entropy-gossip)
   - 6.7 [CRDT — Conflict-Free Replicated Data Types](#67-crdt)

7. [Partitioning & Sharding](#7-partitioning)
   - 7.1 [Horizontal Partitioning — Sharding Strategies](#71-sharding-strategies)
   - 7.2 [Consistent Hashing — Minimal Resharding](#72-consistent-hashing)
   - 7.3 [Virtual Nodes — Improved Load Balance](#73-virtual-nodes)
   - 7.4 [Hot Spots & Skewed Workloads](#74-hot-spots)
   - 7.5 [Secondary Indexes on Partitioned Data](#75-secondary-indexes-partitioned)
   - 7.6 [Cross-Partition Queries & Scatter-Gather](#76-cross-partition)

8. [Distributed Transactions](#8-distributed-transactions)
   - 8.1 [Why Distributed Transactions Are Hard](#81-why-hard)
   - 8.2 [Two-Phase Commit (2PC) — Protocol & Failures](#82-2pc)
   - 8.3 [Three-Phase Commit (3PC)](#83-3pc)
   - 8.4 [Saga Pattern — Local Transactions + Compensation](#84-saga-pattern)
   - 8.5 [Choreography vs Orchestration Sagas](#85-choreography-vs-orchestration)
   - 8.6 [Outbox Pattern — Guaranteed Message Delivery](#86-outbox-pattern)
   - 8.7 [Saga Implementation in .NET — MassTransit, NServiceBus](#87-saga-net)

9. [Distributed Locking](#9-distributed-locking)
   - 9.1 [Why Distributed Locks Are Needed](#91-why-distributed-locks)
   - 9.2 [Redis-Based Locking — Redlock Algorithm](#92-redlock)
   - 9.3 [Database-Based Distributed Locking](#93-db-locking)
   - 9.4 [ZooKeeper / etcd-Based Locking](#94-zookeeper-etcd-locking)
   - 9.5 [Fencing Tokens — Safety Under Lock Loss](#95-fencing-tokens)
   - 9.6 [Distributed Locking in .NET](#96-distributed-locking-net)

10. [Service Discovery & Load Balancing](#10-service-discovery)
    - 10.1 [Client-Side vs Server-Side Discovery](#101-discovery-patterns)
    - 10.2 [DNS-Based Service Discovery](#102-dns-discovery)
    - 10.3 [Consul — Service Registry & Health Checks](#103-consul)
    - 10.4 [Kubernetes Service Discovery — ClusterDNS, Endpoints](#104-k8s-discovery)
    - 10.5 [Load Balancing Algorithms in Distributed Systems](#105-lb-algorithms)
    - 10.6 [.NET Aspire — Built-in Service Discovery](#106-aspire-discovery)
    - 10.7 [gRPC Load Balancing](#107-grpc-lb)

11. [Resilience Patterns](#11-resilience)
    - 11.1 [Failure Modes in Distributed Systems](#111-failure-modes)
    - 11.2 [Retry Pattern — Exponential Backoff & Jitter](#112-retry)
    - 11.3 [Circuit Breaker — Fail Fast, Recover Gracefully](#113-circuit-breaker)
    - 11.4 [Bulkhead — Isolate Failures](#114-bulkhead)
    - 11.5 [Timeout — Bounded Latency](#115-timeout)
    - 11.6 [Fallback & Degraded Mode](#116-fallback)
    - 11.7 [Hedging — Redundant Requests](#117-hedging)
    - 11.8 [Rate Limiting & Throttling](#118-rate-limiting)
    - 11.9 [Polly & Microsoft.Extensions.Http.Resilience in .NET](#119-polly-net)

12. [Messaging & Event-Driven Architecture](#12-messaging)
    - 12.1 [Message Brokers — Why & What](#121-message-brokers)
    - 12.2 [Message Queue vs Pub/Sub vs Event Streaming](#122-queue-pubsub-streaming)
    - 12.3 [At-Most-Once, At-Least-Once, Exactly-Once Delivery](#123-delivery-semantics)
    - 12.4 [Idempotent Consumers — Handling Duplicate Messages](#124-idempotency)
    - 12.5 [Message Ordering — Partitioned Order Guarantees](#125-message-ordering)
    - 12.6 [Dead Letter Queues (DLQ) & Poison Messages](#126-dlq)
    - 12.7 [Backpressure in Messaging Systems](#127-backpressure)
    - 12.8 [Schema Evolution — Backward & Forward Compatibility](#128-schema-evolution)

13. [Apache Kafka for .NET Developers](#13-kafka)
    - 13.1 [Kafka Architecture — Brokers, Topics, Partitions, Offsets](#131-kafka-architecture)
    - 13.2 [Kafka Producers — Batching, Compression, Acks](#132-kafka-producers)
    - 13.3 [Kafka Consumers — Consumer Groups, Offset Management](#133-kafka-consumers)
    - 13.4 [Kafka Exactly-Once Semantics — Transactions & Idempotent Producer](#134-kafka-eos)
    - 13.5 [Kafka Streams — Stream Processing on Kafka](#135-kafka-streams)
    - 13.6 [Kafka in .NET — Confluent.Kafka](#136-kafka-net)
    - 13.7 [Kafka Schema Registry & Avro in .NET](#137-schema-registry-net)

14. [RabbitMQ for .NET Developers](#14-rabbitmq)
    - 14.1 [RabbitMQ Architecture — Exchanges, Queues, Bindings](#141-rabbitmq-architecture)
    - 14.2 [Exchange Types — Direct, Fanout, Topic, Headers](#142-exchange-types)
    - 14.3 [Durability, Persistence & Publisher Confirms](#143-durability-confirms)
    - 14.4 [Consumer Acknowledgments & Prefetch](#144-consumer-acks)
    - 14.5 [RabbitMQ in .NET — RabbitMQ.Client, MassTransit](#145-rabbitmq-net)
    - 14.6 [RabbitMQ vs Kafka — When to Use Each](#146-rabbitmq-vs-kafka)

15. [Event Sourcing & CQRS](#15-event-sourcing-cqrs)
    - 15.1 [Event Sourcing — State as Event Log](#151-event-sourcing)
    - 15.2 [Projections & Read Models](#152-projections)
    - 15.3 [Snapshots — Avoiding Full Replay](#153-snapshots)
    - 15.4 [Event Schema Evolution](#154-event-schema-evolution)
    - 15.5 [CQRS — Separate Read and Write Models](#155-cqrs)
    - 15.6 [CQRS + Event Sourcing Together](#156-cqrs-es)
    - 15.7 [Event Sourcing in .NET — Marten, EventStoreDB](#157-es-net)

16. [API Gateway & BFF Patterns](#16-api-gateway-bff)
    - 16.1 [API Gateway Pattern — Responsibilities](#161-api-gateway-pattern)
    - 16.2 [Backend for Frontend (BFF) Pattern](#162-bff-pattern)
    - 16.3 [YARP as API Gateway in .NET](#163-yarp-gateway)
    - 16.4 [Ocelot API Gateway](#164-ocelot)
    - 16.5 [Rate Limiting & Auth at the Gateway](#165-gateway-security)
    - 16.6 [Request Aggregation — Reducing Client Trips](#166-request-aggregation)

17. [Service Mesh](#17-service-mesh)
    - 17.1 [Service Mesh Concepts — Sidecar & Data Plane](#171-service-mesh-concepts)
    - 17.2 [Istio — Traffic Management & mTLS](#172-istio)
    - 17.3 [Linkerd — Lightweight Service Mesh for .NET](#173-linkerd)
    - 17.4 [eBPF-Based Service Mesh — Cilium](#174-cilium)
    - 17.5 [Observability via Service Mesh](#175-mesh-observability)
    - 17.6 [When to Use a Service Mesh with .NET](#176-when-service-mesh)

18. [Observability in Distributed Systems](#18-observability)
    - 18.1 [The Three Pillars — Logs, Metrics, Traces](#181-three-pillars)
    - 18.2 [Distributed Tracing — Trace Context Propagation](#182-distributed-tracing)
    - 18.3 [OpenTelemetry in .NET — Instrumentation & Export](#183-otel-net)
    - 18.4 [Structured Logging in Distributed Systems](#184-structured-logging)
    - 18.5 [Metrics — Counters, Histograms, Gauges](#185-metrics)
    - 18.6 [Alerting on Distributed System Failures](#186-alerting)
    - 18.7 [Correlation IDs & Request Tracing in ASP.NET Core](#187-correlation-ids)
    - 18.8 [Chaos Engineering — Testing Resilience](#188-chaos-engineering)

19. [Leader Election & Coordination](#19-coordination)
    - 19.1 [Leader Election — Why Needed](#191-leader-election)
    - 19.2 [Bully Algorithm](#192-bully-algorithm)
    - 19.3 [ZooKeeper — Coordination Service](#193-zookeeper)
    - 19.4 [etcd — Distributed Key-Value & Coordination](#194-etcd)
    - 19.5 [Leader Election in .NET — Redis, etcd](#195-leader-election-net)
    - 19.6 [Distributed Cron / Scheduled Tasks](#196-distributed-cron)

20. [Microservices Patterns](#20-microservices)
    - 20.1 [Microservices vs Monolith — Trade-offs](#201-microservices-vs-monolith)
    - 20.2 [Strangler Fig Pattern — Incremental Migration](#202-strangler-fig)
    - 20.3 [Anti-Corruption Layer](#203-anti-corruption-layer)
    - 20.4 [Shared Database Anti-Pattern](#204-shared-database)
    - 20.5 [Service Boundaries — Domain-Driven Design & Bounded Contexts](#205-bounded-contexts)
    - 20.6 [Data Consistency Across Services](#206-data-consistency-across-services)
    - 20.7 [Versioning & Backward Compatibility in Microservices](#207-versioning-microservices)
    - 20.8 [.NET Aspire — Cloud-Native .NET Stack](#208-dotnet-aspire)

---

## Section Prompts

### 1. Foundations

#### 1.1 Why Distributed Systems
```
Explain why distributed systems exist: scalability (single machine has limits — CPU, memory, disk, network), high availability (single machine = single point of failure, distribute = survive failures), geographic distribution (latency — serve users from nearby regions), specialization (different components with different resource needs on different hardware). Cover the costs: complexity (network failures, partial failures, ordering), operational overhead (many machines vs one), debugging difficulty (non-deterministic, distributed state). Show the .NET evolution: monolith → multiple instances (horizontal scale) → microservices. Establish that distributed systems are chosen for specific reasons — not by default. Cover "distributed monolith" anti-pattern.
```

#### 1.2 Fallacies of Distributed Computing
```
Explain the 8 Fallacies of Distributed Computing (Peter Deutsch, Sun Microsystems) as the foundational mindset shift: (1) The network is reliable, (2) Latency is zero, (3) Bandwidth is infinite, (4) The network is secure, (5) Topology doesn't change, (6) There is one administrator, (7) Transport cost is zero, (8) The network is homogeneous. Explain why each is a fallacy with real examples. Show how assuming these fallacies leads to: missing retry logic, missing timeouts, synchronous calls across services, no circuit breakers, hardcoded IPs. Cover that most distributed system bugs stem from ignoring these fallacies. This section frames why all the subsequent patterns exist.
```

#### 1.3 Eight Fallacies for .NET
```
Map each fallacy to concrete .NET/C# mistakes and fixes: Reliable network → always add retry policies (Polly), handle HttpRequestException; Zero latency → profile cross-service calls (10ms vs 0.1ms local), use async, batch requests; Infinite bandwidth → minimize payload size, use binary protocols (Protobuf vs JSON), pagination; Secure network → always use TLS, mutual TLS between services, never trust inbound data; Static topology → use service discovery (not hardcoded IPs), DNS-based discovery in .NET Aspire; One administrator → deployment automation, immutable infrastructure; Zero transport cost → profile network costs on cloud (egress costs money), colocate related services; Homogeneous network → handle different serializations, different protocol versions, NuGet version mismatches.
```

#### 1.4 Latency vs Bandwidth vs Throughput
```
Distinguish latency (time for one request: RTT — round trip time, typically 0.1ms LAN, 1ms same DC, 50ms cross-region, 150ms cross-continent), bandwidth (maximum data rate: Gbps of network link), throughput (actual data transferred per second — ≤ bandwidth, depends on protocol overhead). Explain Little's Law: throughput = concurrency / latency — doubling latency halves throughput for fixed concurrency. Cover that latency is often the bottleneck (not bandwidth) for request-response APIs. Latency numbers every distributed systems developer should know: L1 cache hit 1ns, L2 4ns, RAM 60ns, SSD 150µs, HDD 10ms, LAN 500µs, WAN 150ms. .NET impact: show how 10 sequential service calls × 5ms each = 50ms minimum latency — parallelize with Task.WhenAll.
```

#### 1.5 Sync vs Async Communication
```
Compare synchronous (request-response — caller blocks waiting for response — tight coupling, predictable flow, easy reasoning) vs asynchronous (fire-and-forget or callback/event — caller continues immediately — loose coupling, better resilience, harder to reason about). Synchronous examples: REST API calls, gRPC unary calls. Asynchronous examples: message queue (Kafka, RabbitMQ), event bus, async webhooks. Trade-offs: sync = immediate response + feedback (errors propagate), blocking during downstream failure, cascading failures; async = decoupled (service can be down, messages queue), eventual consistency, complex error handling (no stack trace from original caller), harder to debug. .NET pattern: HttpClient for sync (with timeout + retry), Channel<T>/MassTransit for async. Decision: sync for queries needing immediate answer, async for commands that can be processed later.
```

#### 1.6 Distributed System Models
```
Cover formal distributed system models: Synchronous model (bounded message delay + bounded processing time — every message arrives within D time, every process responds within P time — assumption allows consensus), Asynchronous model (no bounds — message may take arbitrarily long, process may be arbitrarily slow — FLP impossibility applies — can't distinguish slow node from crashed node), Partial synchrony model (usually synchronous but occasionally not — practical model — Raft/Paxos designed for this). Cover failure models: crash-stop (node crashes and stops), crash-recovery (node crashes and recovers, possibly losing memory), Byzantine (node behaves arbitrarily, may lie). .NET developers need this to understand: why Raft can't guarantee progress in pure async model, why timeouts are needed, why quorums work.
```

---

### 2. Consistency Models

#### 2.1 Why Consistency Is Hard
```
Explain the fundamental challenge: in distributed systems, data is replicated for availability/performance, but concurrent writes to different replicas can diverge, and there's no global shared memory, only message passing with arbitrary delays. Show the two replica scenario: user A updates value on Replica 1, user B reads from Replica 2 before update propagates — sees stale data. This isn't a bug — it's physics (speed of light, network latency). Cover why strong consistency = coordination = latency (must wait for all replicas to agree before returning). Cover that consistency models define what readers can observe and what guarantees applications can rely on. Frame the spectrum: strong (linearizable) → weak (eventual) — choose based on application requirements.
```

#### 2.2 Linearizability
```
Explain linearizability (also called atomic consistency or strong consistency): the strongest consistency model. Every operation appears to take effect instantaneously at some point between invocation and response. All operations form a total order consistent with real time. Effect: system behaves as if there's one copy of data on a single machine. Requires: coordination (consensus) between replicas on every write. Cost: high latency (wait for quorum acknowledgment before returning), low availability during partitions (CP in CAP). Where used: etcd key-value, ZooKeeper, Spanner, single-leader database primary. .NET implication: Cosmos DB Strong consistency is linearizable — guarantees latest write is always read. Redis cluster is NOT linearizable by default (async replication to replicas).
```

#### 2.3 Sequential Consistency
```
Explain sequential consistency: weaker than linearizability. All operations appear in some sequential order (consistent across all processes) but this order doesn't need to respect real time (operation may appear to happen before it actually did). All processes agree on the same order. Stronger than causal, weaker than linearizable. Example: all processes see writes in same order, but order may not match wall clock. Where used: some multi-processor memory models, some distributed databases with total order broadcast. Compare to linearizability: linearizability requires real-time ordering (if op A completes before op B starts, A must appear before B in ordering), sequential consistency doesn't require this. .NET: Java memory model uses a form of sequential consistency for volatile variables.
```

#### 2.4 Causal Consistency
```
Explain causal consistency: preserves causal relationships — if A causally precedes B (A happened before B, or A's result was observed and influenced B), all processes see A before B. Concurrent operations (no causal relationship) may be seen in different orders by different processes. Weaker than sequential consistency, stronger than eventual. Implementation: vector clocks or version vectors track causal dependencies. Example: you post a reply to a comment — causal consistency ensures everyone who sees your reply also sees the original comment first. Where used: COPS (Cassandra-based), Amazon DynamoDB (optional), some MongoDB configurations. .NET relevance: most eventual consistent systems aspire to causal, few guarantee it. Useful for social/collaborative apps.
```

#### 2.5 Eventual Consistency
```
Explain eventual consistency: weakest useful consistency model. If no new updates are made to a given data item, eventually all accesses to that item will return the last updated value. No guarantee about when — could be milliseconds, could be minutes. Concurrent writes create conflicts that must be resolved (last-write-wins, merge). Enables: high availability, low latency (write to any replica, return immediately), partition tolerance. Where used: DNS, Cassandra (tunable), DynamoDB (default), CouchDB. Variants: eventual consistency is a spectrum — BASE (Basically Available, Soft state, Eventual consistency) vs ACID. .NET implication: reading from Cassandra may return stale data — application must handle. "Stale reads are OK" must be explicitly accepted by business requirements.
```

#### 2.6 Session Consistency
```
Cover session-level consistency guarantees important for application correctness: Read-Your-Own-Writes (after you write, you always read your own writes — your own session sees your updates immediately, regardless of replication lag), Monotonic Read (once you read a value, subsequent reads never return an older value — no going back in time), Monotonic Write (writes from one session appear in order they were issued), Writes Follow Reads (writes are ordered after reads in same session). These are weaker than full linearizability but sufficient for many applications. Implementation: route reads to same replica that received write (sticky routing), or use version tokens (write returns version, read waits for replica to reach that version). .NET: route authenticated user to specific DB shard, use optimistic version tracking.
```

#### 2.7 Consistency in .NET
```
Practical consistency model selection guide for .NET applications: use Linearizability for: distributed locks, leader election, counters with exact values, financial transactions (use Cosmos DB Strong, etcd, SQL with serializable isolation). Use Read-Your-Own-Writes for: user profile updates (user sees their own changes immediately — route reads to primary or use version check), shopping cart (user's own cart is always fresh). Use Eventual Consistency for: social feed, recommendation counts, view counters, analytics, search index updates (ok to be slightly stale). Show .NET implementation patterns: primary read for own writes (two connection strings), version token propagation (return version from write, pass in subsequent read request), Cache-Aside with invalidation. Cover that most ASP.NET Core apps accidentally use eventual consistency (read replica without knowing it).
```

---

### 3. CAP & PACELC

#### 3.1 CAP Deep Dive
```
Explain CAP theorem (Brewer 2000, proof by Gilbert & Lynch 2002): distributed system can guarantee at most 2 of: Consistency (every read gets most recent write or error — linearizability), Availability (every request gets response — non-error), Partition Tolerance (system operates despite network partition — some nodes can't communicate). Key insight: network partitions WILL happen (fallacy #1) — so real choice is between C and A during partition. Show concrete scenario: two nodes, network partition — if we require C, node 2 must reject reads (can't guarantee latest write from node 1). If we require A, node 2 returns stale data. Cover that "CA" without partition tolerance is only possible with a single node (no distribution). Cover that CAP is about behavior during partition, not during normal operation.
```

#### 3.2 Partition Tolerance
```
Explain partition tolerance in depth: a network partition means some nodes can't communicate with others (not total failure — partial failure). Why partitions happen: network switch failure, cable cut, packet loss exceeding retry budget, cloud AZ outage, software bugs causing dropped connections, overloaded network. Partition duration: milliseconds (transient packet loss) to minutes (hardware failure) to hours (AZ outage). Cover that partition tolerance is not a "choice" to opt into — partitions will occur, you must handle them. The real choice: during partition, do you prioritize serving requests (availability) at the cost of potentially stale data, or do you reject requests (consistency) to avoid serving stale data. Cover that "P" in CAP doesn't mean "can you tolerate partitions" — it means partitions WILL occur.
```

#### 3.3 CP vs AP Design
```
Explain CP and AP design choices: CP systems (ZooKeeper, etcd, HBase, CockroachDB with serializable — reject requests during partition to maintain consistency — safe for: coordination, configuration, leader election, financial transactions, anything where stale data is worse than unavailability), AP systems (Cassandra, DynamoDB, CouchDB — return potentially stale data during partition — safe for: social media, shopping carts, DNS, analytics, anything where availability is more important than perfect consistency). Cover that "CP" doesn't mean "always consistent" — just consistent during partitions. Cover that most real systems mix: use CP for critical operations, AP for high-volume operations. .NET: EF Core against PostgreSQL is CP; Redis cache reads are AP (may return stale).
```

#### 3.4 PACELC
```
Explain PACELC (Daniel Abadi, 2010): extends CAP. During Partition: choose Availability or Consistency. Else (no partition): choose Latency or Consistency. Most systems trade consistency for latency in normal operation (async replication — return before replica confirms). Classification: PA/EL (Cassandra, Riak, DynamoDB — available during partition, low latency without partition), PC/EC (HBase, BigTable, Spanner — consistent during partition, consistent without partition — high latency from synchronous replication), PA/EC (MongoDB — available during partition, consistent without partition with readConcern=majority). Show that PACELC is more practical for choosing a database than CAP. .NET: PostgreSQL = PC/EC (strong), Redis = PA/EL (fast), Cosmos DB tunable = varies.
```

#### 3.5 DB Positioning
```
Map popular databases to CAP/PACELC positions: PostgreSQL single-node (CA — not distributed), PostgreSQL with sync replica (PC — consistent primary, replica must confirm), MySQL InnoDB (PC), CockroachDB (PC/EC — Raft-based), MongoDB (PA/EC with majority reads), Cassandra (PA/EL — tunable consistency), DynamoDB (PA/EL — default, strong available as option), Redis cluster (PA/EL — async replication), etcd (PC/EC — Raft), ZooKeeper (PC/EC — ZAB protocol), Cosmos DB (tunable — Eventual=PA/EL, Strong=PC/EC, Session=middle ground), Azure SQL (PC/EC). Cover that most production .NET apps use PostgreSQL/SQL Server (effectively CP) + Redis (AP) — this combination is pragmatic for most use cases.
```

#### 3.6 CAP in .NET Microservices
```
Practical CAP decisions in .NET microservices: each microservice owns its database (different CAP choices per service based on requirements — Order Service needs CP, Product Catalog can use AP), cross-service operations must accept eventual consistency (2PC too expensive — use Saga), how to handle partition between your .NET service and its database (circuit breaker + fallback — return stale cache or degrade gracefully). Show concrete scenario: Payment service (CP — must be consistent, use PostgreSQL with sync replica), Feed service (AP — slight staleness OK, use Cassandra). Cover that distributed monolith with shared DB is CP by accident — moving to microservices forces explicit CAP decisions. Show Polly circuit breaker as the AP fallback mechanism.
```

---

### 4. Time & Ordering

#### 4.1 Clock Problems
```
Explain why distributed systems can't rely on wall clocks: clock skew (different nodes have different times — NTP synchronizes to ±milliseconds but can't eliminate skew), clock drift (clocks run at different speeds — quartz oscillators vary, temperature affects speed), NTP corrections (time can jump forward or backward — time goes backward briefly), leap seconds (UTC adds leap seconds causing applications to see 23:59:60). Show concrete bugs: sorting events by timestamp across nodes gives wrong order, TTL-based expiry fires too early/late on different nodes, certificate validity checks fail. Cover that monotonic clocks (CLOCK_MONOTONIC on Linux — System.Diagnostics.Stopwatch in .NET) don't skew but can't be compared across nodes. Show why vector clocks are needed instead of wall clocks for ordering.
```

#### 4.2 Lamport Timestamps
```
Explain Lamport logical clocks (1978): each node maintains counter C. On send event: C++, attach C to message. On receive event: C = max(C, received_C) + 1. On internal event: C++. Property: if event A causally precedes B (A happened-before B), then C(A) < C(B). Limitation: C(A) < C(B) does NOT mean A happened before B (can only infer in one direction). Can't detect concurrent events. Use case: establishing a total order of events (not causal order) for distributed log. Show .NET implementation: volatile int lamportClock, Interlocked.Increment, compare+update on receive. Cover why Lamport timestamps are simple but insufficient for detecting causality — leads to vector clocks.
```

#### 4.3 Vector Clocks
```
Explain vector clocks: each node maintains a vector of counters V[n] (one per node). On send: V[self]++, attach V. On receive from node j: V[self] = max(V[self], received_V) elementwise, then V[self]++. On internal event: V[self]++. Comparison: V_A < V_B iff all V_A[i] ≤ V_B[i] AND some V_A[j] < V_B[j] (A happened before B). V_A concurrent with V_B iff neither V_A < V_B nor V_B < V_A. Shows exactly which events are causally related and which are concurrent. Use case: conflict detection in distributed databases (DynamoDB version vectors), detecting causality violations. Limitation: vector size = number of nodes (grows). Cover version vectors (Amazon Dynamo style — detect concurrent writes). Show .NET implementation.
```

#### 4.4 Hybrid Logical Clocks
```
Explain Hybrid Logical Clocks (HLC): combine wall clock (physical time) with logical clock to get: events ordered by physical time when possible, logical clock breaks ties and handles backward jumps. HLC = (physical_time, logical_counter, node_id). Always greater than or equal to last known physical time. On message receipt: update to max(own_physical, received_physical), if tie increment logical counter. Benefits: timestamps are meaningful (close to real time), sortable by physical time, correct causal ordering. Used in: CockroachDB (HLC for MVCC timestamps), YugabyteDB. Cover that HLC eliminates the "timestamp can go backward" problem while maintaining close-to-real-time ordering. .NET: MassTransit uses system time — cover that for causal ordering you need HLC or vector clocks.
```

#### 4.5 TrueTime
```
Explain Google TrueTime: GPS + atomic clocks in Google data centers provide bounded clock uncertainty. TrueTime API returns interval [earliest, latest] — actual time is somewhere in this interval. Typical uncertainty: 1-7ms. Spanner uses TrueTime for external consistency: before committing, wait until TrueTime.after(commit_timestamp) — ensures no future transaction can have earlier timestamp, guaranteeing global ordering. Why this matters: enables linearizable distributed transactions without consensus round-trips (just wait for uncertainty to pass). Cover that CockroachDB approximates TrueTime with NTP + conservative uncertainty bound. Cover that TrueTime is why Spanner can claim external consistency at global scale. .NET: understanding TrueTime explains why Spanner/CockroachDB have slightly higher latency (waiting out uncertainty interval).
```

#### 4.6 Event Ordering in .NET
```
Practical event ordering patterns for .NET distributed systems: use event sequence numbers (database sequence or Redis INCR — total order within partition), use Kafka partition offsets (total order within partition, partial order across partitions), use event timestamps with conflict resolution (last-write-wins with HLC, vector clocks for concurrent detection). Show .NET: ASP.NET Core middleware adding X-Request-ID and X-Correlation-ID, MassTransit message headers for correlation. Cover event store with sequence numbers (EventStoreDB stream positions, Marten stream versions). Show how to detect and handle out-of-order events: sequence gap detection, event buffer with timeout, idempotent replay. Cover that absolute ordering across all events in a distributed system requires expensive coordination — design to not require it.
```

---

### 5. Consensus

#### 5.1 The Consensus Problem
```
Explain the consensus problem: N nodes must agree on one value despite failures. Requirements: validity (agreed value must have been proposed by some node), agreement (all correct nodes agree on same value), termination (every correct node eventually decides), integrity (a node decides at most once). Why consensus is fundamental to distributed systems: leader election (all nodes must agree who is leader), atomic commit (all nodes agree to commit or all abort), total-order broadcast (all nodes agree on message order — equivalent to consensus). Cover that consensus is expensive (requires at least one round-trip in synchronous model) but necessary for strong guarantees. Cover that you're using consensus whenever you use ZooKeeper, etcd, or distributed databases with strong consistency.
```

#### 5.2 FLP Impossibility
```
Explain FLP impossibility theorem (Fischer, Lynch, Paterson 1985): in a purely asynchronous distributed system, no deterministic consensus algorithm can guarantee termination if even ONE process can fail (crash-stop). Why: can't distinguish slow node from crashed node — might wait forever for it to respond. Practical implications: all consensus protocols (Paxos, Raft) rely on partial synchrony (usually messages arrive within timeout) or randomization (randomized consensus can terminate with probability 1). Cover that FLP doesn't mean consensus is impossible — it means you need either: synchrony assumptions (timeouts — Raft/Paxos), randomization (randomized Paxos), or weaker guarantees. .NET: every timeout in distributed .NET code is implicitly assuming partial synchrony to work around FLP.
```

#### 5.3 Paxos
```
Explain Paxos (Lamport 1998): single-decree Paxos reaches consensus on one value. Two phases: Prepare (proposer sends Prepare(n) to quorum, acceptors promise to accept no smaller n, return any accepted value), Accept (if no accepted value returned, propose own value; else propose highest-numbered accepted value, send Accept(n, v) to quorum, acceptors accept if n ≥ promised n). Leader elected implicitly (proposer with highest n). Multi-Paxos: leader remains leader for multiple instances (skip prepare phase after leadership established). Cover that Paxos is notoriously hard to understand and implement correctly — many variants exist. Cover that Raft was designed specifically to be more understandable. Historical relevance: Chubby (Google), Zab (ZooKeeper), most distributed databases use Paxos variants.
```

#### 5.4 Raft
```
Explain Raft (Ongaro & Ousterhout 2014): designed for understandability. Three roles: Leader (receives client requests, replicates log), Follower (passive — replicate leader's log), Candidate (transitioning to leader). State: current term (logical clock for elections), voted for (who I voted for in this term), log (ordered entries). Leader election: follower times out waiting for heartbeat → becomes candidate → requests votes (only candidates with up-to-date log win) → if majority votes → becomes leader. Log replication: leader appends to local log → sends AppendEntries to followers → entry committed when majority ACK → applied to state machine. Safety properties: election safety (at most one leader per term), leader completeness (committed entries always in future leaders' logs).
```

#### 5.5 Raft Details
```
Deep dive into Raft leader election and log replication: election timeout randomization (each follower has random timeout 150-300ms — reduces simultaneous candidates, split vote), election term increments (if candidate doesn't win, terms keep incrementing — liveness), log matching property (if two logs have same index+term entry, they're identical up to that index), commitment rule (leader commits when entry replicated to majority — not just acknowledged, stored), AppendEntries consistency check (follower rejects if previous entry doesn't match — guarantees log consistency). Cover joint consensus for membership changes (adding/removing nodes — two-phase approach). Cover Raft linearizability: read from leader only, or lease-based reads. Show Raft's cluster size vs fault tolerance: 3 nodes tolerates 1 failure, 5 nodes tolerates 2 failures.
```

#### 5.6 Raft in Practice
```
Cover Raft implementations used in production systems: etcd (Kubernetes backbone — stores cluster state, uses Raft for consistency), CockroachDB (Raft per range/shard — distributed SQL with per-shard consensus), TiKV (Raft per region — distributed key-value store backing TiDB), Consul (Raft for service catalog). Performance numbers: Raft can do ~10,000-100,000 ops/second (linearizable), limited by disk fsync latency (WAL write per commit). Show that .NET Aspire uses etcd for distributed configuration. Cover why Raft is used in Kubernetes: strong consistency for cluster state is critical (pod scheduling, service endpoints, RBAC). Cover split-brain prevention: majority quorum means ≤1 partition can have a leader.
```

#### 5.7 BFT
```
Explain Byzantine Fault Tolerance: handles nodes that behave arbitrarily (not just crash — can send different messages to different nodes, lie, collude). PBFT (Practical Byzantine Fault Tolerance): requires 3f+1 nodes to tolerate f Byzantine failures, 3 phases (pre-prepare, prepare, commit), O(n²) messages. Used in: permissioned blockchains (Hyperledger), some aerospace systems. Why rarely used in traditional distributed systems: expensive (quadratic messages), n≥4 for any fault tolerance, assumes <1/3 nodes compromised. Blockchain relevance: Bitcoin uses PoW (probabilistic BFT), Ethereum uses PoS (economic BFT). .NET relevance: most enterprise distributed systems don't need BFT (nodes are trusted, just unreliable) — crash-stop model with Raft is sufficient.
```

---

### 6. Replication

#### 6.1 Leader-Follower Replication
```
Explain leader-follower (primary-replica) replication: all writes go to leader, leader sends replication stream to followers, followers apply in same order. Synchronous replication (leader waits for follower ACK before confirming write — strong durability, slower writes, follower failure blocks writes), asynchronous replication (leader confirms before followers ACK — fast writes, follower may lag, failover may lose recent writes). Read scaling: route read queries to followers — eventual consistency (followers may be behind). Failover: follower promoted to leader on leader failure (manual or automatic via orchestrator — Patroni, MHA, ProxySQL). .NET: configure EF Core read replica with ApplicationIntent=ReadOnly (SQL Server) or separate connection string (PostgreSQL). Cover split-brain risk during failover.
```

#### 6.2 Multi-Leader Replication
```
Explain multi-leader (multi-master) replication: multiple nodes accept writes, each replicates to others. Advantages: write to nearest datacenter (low write latency), survive datacenter failure (other leaders available). Disadvantages: write conflicts (same key written to two leaders concurrently — who wins?). Conflict resolution strategies: last-write-wins (LWW — highest timestamp wins — loses concurrent writes, not great), application-level merge (application decides — custom logic), CRDT (conflict-free by design), avoid conflicts (route same user to same leader). Used in: multi-datacenter MySQL, CouchDB sync, Lotus Notes. .NET rarely uses multi-leader directly — cover that offline editing (mobile apps syncing to server) is conceptually multi-leader. Cover that conflict resolution must be deterministic and commutative.
```

#### 6.3 Leaderless Replication
```
Explain leaderless (Dynamo-style) replication: any node accepts writes, writes replicated to N nodes, reads from R nodes, writes require W acknowledgments. No leader election, no failover. Amazon Dynamo paper (2007) → Cassandra, Riak. Sloppy quorum: during partition, write to available nodes even if not "correct" replicas — hinted handoff when correct nodes recover. Read repair: on read, detect stale value and repair in background. Anti-entropy: background process compares replicas and syncs. Cover that W + R > N ensures at least one node in read quorum has latest write. Tunability: W=1 R=N (fast writes, slow reads), W=N R=1 (slow writes, fast reads), W=R=N/2+1 (balanced). .NET + Cassandra: configure consistency level per query.
```

#### 6.4 Quorum
```
Deep dive into quorum-based consistency: N = replication factor, W = write quorum (nodes that must acknowledge write), R = read quorum (nodes to read from). Consistency guarantee: if W + R > N, at least one node in read set has latest write. Common configurations: N=3, W=2, R=2 (balanced — tolerates 1 failure for both reads and writes), N=3, W=3, R=1 (strong writes, fast reads), N=3, W=1, R=3 (fast writes, slow reads). Cover that quorum still allows stale reads if write goes to non-overlapping nodes (sloppy quorum breaks strict W+R>N guarantee). Show Cassandra consistency levels: ONE, TWO, THREE, QUORUM (N/2+1), ALL, LOCAL_QUORUM, EACH_QUORUM. .NET + Cassandra: set ConsistencyLevel.Quorum for critical reads, ConsistencyLevel.One for high-throughput reads that can be stale.
```

#### 6.5 Replication Lag
```
Cover replication lag implications for application design: reading-your-own-writes problem (write to primary, read from replica before replication — see old value), monotonic read violation (read from different replicas, first replica newer than second — go back in time), phantom reads (aggregate query on replica while writes replicating). Solutions: route reads to primary immediately after write (session consistency), track write version, read from replica only if replica_version >= write_version (version-based routing), use read-your-own-writes buffer (cache recent writes client-side). .NET: after write, include version token in response, next request passes version token, routing layer ensures reading from replica at or past that version. Cover that monitoring replication lag is essential (pg_stat_replication.replay_lag, CloudWatch ReplicaLag).
```

#### 6.6 Anti-Entropy & Gossip
```
Explain anti-entropy: background reconciliation to detect and fix diverged replicas. Merkle trees (hash tree — hash each leaf = hash of data range, internal node = hash of children — compare tree roots, identify diverged subtrees efficiently without comparing all data). Gossip protocols: each node periodically picks random peer, exchanges state — information spreads like a rumor (exponential propagation — reaches all nodes in O(log N) rounds). Used in: Cassandra (gossip for cluster membership and failure detection), Bitcoin (gossip for transaction propagation), Kubernetes (kube-proxy gossip for service endpoints). Gossip properties: eventually consistent propagation, self-healing, no single point of failure. Cover SWIM protocol (Scalable Weakly-consistent Infection-style Membership) used in Consul, Kubernetes.
```

#### 6.7 CRDT
```
Explain Conflict-Free Replicated Data Types: data structures that can be replicated across nodes, updated concurrently, and always merged without conflicts — mathematically guaranteed convergence. Operation-based CRDT (CvRDT: state-based — merge operation must be commutative, associative, idempotent) and State-based CRDT (CmRDT: operation-based — each update is a commutative operation). Examples: G-Counter (grow-only counter — each node maintains own counter, sum = total), PN-Counter (increment + decrement — two G-counters), OR-Set (add + remove set — unique tags per add), LWW-Register (last-write-wins register with timestamp), RGA (Replicated Growable Array — collaborative text editing). Used in: Redis (CRDT support), Riak, collaborative editing (Google Docs uses similar approach), Automerge (CRDT library). .NET: DotNext.Net has CRDT implementations.
```

---

### 7. Partitioning

#### 7.1 Sharding Strategies
```
Cover sharding strategies: Range partitioning (shard by value range — user IDs 1-1M on shard 1, etc. — simple routing, but hot spots if recent IDs are sequential), Hash partitioning (shard = hash(key) % N — even distribution, no hot spots, but range queries touch all shards), List partitioning (shard by explicit value list — users in EU → EU shard, US → US shard — geographic compliance, uneven if populations differ), Composite partitioning (hash the range — first partition by range, then hash within range). Cover that choosing the shard key is the most important decision: should distribute writes evenly, should colocate related data (all user data on same shard), should allow efficient queries. .NET: custom ShardRouter maps entity key to database connection.
```

#### 7.2 Consistent Hashing
```
Explain consistent hashing: map hash space to a ring (0 to 2^32), each node placed at hash(node_id) on ring, a key's shard = first node clockwise on ring. Adding node: only keys between new node and its predecessor move. Removing node: only keys owned by that node move to successor. Properties: adding/removing one node moves only K/N keys on average (vs K·(1/N_old - 1/N_new) for modular hashing — much better). Used in: Cassandra, Dynamo, Chord, memcached (ketama), CDN routing. Cover that consistent hashing alone has uneven distribution (nodes may cluster on ring) — virtual nodes solve this. .NET: implement consistent hash ring for custom sharding or use Cassandra/Redis cluster (both use consistent hashing internally).
```

#### 7.3 Virtual Nodes
```
Explain virtual nodes (vnodes): each physical node owns multiple positions on consistent hash ring (e.g., 256 virtual nodes per physical node). Benefits: more even load distribution (256 points vs 1 → statistical averaging), easier rebalancing (when node added/removed, only 1/N of vnodes move per physical node), heterogeneous hardware (powerful nodes own more vnodes). Used in: Cassandra (vnodes default 256), DynamoDB (internal). Cover that virtual nodes increase replication complexity (need to track which physical nodes own which vnodes). Show that vnode count is a configuration parameter (more vnodes → better balance but more metadata). Cover that for .NET custom sharding, virtual nodes are worth implementing if physical node count changes frequently.
```

#### 7.4 Hot Spots
```
Explain hot spots and skewed workloads: certain shards receive disproportionate load (trending user, popular product, sequential IDs all going to same shard). Types: celebrity problem (one user with millions of followers — all their writes + reads on one shard), time-series hot spot (all events with same timestamp → same shard), sequential key hot spot (auto-increment IDs → all recent writes to same shard). Solutions: add random suffix to hot keys (user_id + random[0-9] → 10 shards for this user, merge on read), pre-sharding for known hot spots (celebrity accounts get dedicated shards), read replicas for hot read paths, caching hot data (Redis cache hot users' timelines). .NET: detect hot spots via metrics (one shard at 90% CPU while others at 10%), add sharding salt for hot partition keys.
```

#### 7.5 Secondary Indexes on Partitioned Data
```
Explain secondary index challenges with partitioned data: primary shard key enables O(1) routing for primary key lookups, but secondary index queries (find orders by customer email) must scatter to all shards (scatter-gather — fan out, merge results). Two approaches: local secondary index (each shard indexes its own data — scatter-gather reads, partition index updates), global secondary index (separate dedicated partition for the index — efficient reads but cross-shard write transactions for updates). DynamoDB: GSI (global) and LSI (local). Cassandra: secondary index = local (efficient) but scattered reads, materialized views = pre-computed queries. .NET: avoid secondary index queries in hot paths on partitioned data — denormalize data for access patterns (NoSQL design principle).
```

#### 7.6 Cross-Partition Queries
```
Cover scatter-gather queries across partitions: fan out query to all N shards in parallel, collect results, merge at coordinator. Cost: O(N) latency (all shards must respond before result ready), but parallel — actual latency = slowest shard (tail latency problem). Optimizations: push predicates to shards (filter before sending), push aggregations to shards (COUNT, SUM — reduce data transfer), use covering indexes on shards, limit result size with pagination. Cover that long-tail latency from one slow shard delays entire scatter-gather. Hedged requests (send to slow shard redundantly if not responded by P95 deadline). .NET: implement scatter-gather with Task.WhenAll, timeout individual shard requests, handle partial failures (return partial results or retry failed shards). Cover that scatter-gather is inherently expensive — design data model to avoid it.
```

---

### 8. Distributed Transactions

#### 8.1 Why Distributed Transactions Are Hard
```
Explain the distributed transaction problem: multiple independent services/databases, each with own local transactions. Need to either commit all or rollback all — but they can't share a transaction. Challenges: partial failure (service A committed, service B failed — inconsistent state), no shared transaction log, network can fail between services, coordination overhead. Cover the fundamental tension: ACID transactions within a service (easy — single DB), consistency across services (hard — requires coordination). Cover that 2PC solves it but is blocking and slow. Cover that the modern answer is: design to avoid distributed transactions where possible, use Saga pattern where unavoidable. .NET: TransactionScope with Distributed Transaction Coordinator (DTC) = 2PC — works but has issues in containers.
```

#### 8.2 Two-Phase Commit
```
Explain 2PC: Phase 1 (Prepare) — coordinator sends Prepare to all participants, each writes to durable log and responds Vote-Commit (if ready) or Vote-Abort (if can't commit). Phase 2 (Commit/Abort) — if all vote commit: coordinator sends Commit to all (participants commit and release locks); if any vote abort: coordinator sends Abort to all (participants rollback). Failure scenarios: participant crashes after voting commit but before receiving decision — waits indefinitely (blocked), coordinator crashes after some participants committed — inconsistent (heuristic decisions needed). Cover that 2PC is: blocking (participant holds locks while waiting for coordinator decision), slow (two round trips), single point of failure (coordinator). Why 2PC is avoided in microservices: blocking across service boundaries is unacceptable (10ms network × multiple services = hundreds of ms of lock holding).
```

#### 8.3 Three-Phase Commit
```
Explain 3PC: adds pre-commit phase to avoid blocking. Three phases: CanCommit (participants vote yes/no — no locks yet), PreCommit (coordinator tells participants to prepare to commit — participants acknowledge), DoCommit (actual commit). Recovery: if participant times out in PreCommit phase, it can safely commit (knows coordinator intended to commit and all agreed in CanCommit). Limitation: doesn't handle network partitions (coordinator and participant may make different decisions during partition). Cover that 3PC is rarely used in practice (network partitions make it no safer than 2PC, more complex). Most systems choose between 2PC (strong consistency, blocking) and Saga (eventual consistency, non-blocking). .NET: 3PC is theoretical background knowledge, not practically implemented.
```

#### 8.4 Saga Pattern
```
Explain Saga pattern: sequence of local transactions, each updating one service's database and publishing event/message to trigger next step. Compensating transactions (undo actions) if step fails — not true rollback, but semantic undo (cancel order, release inventory, refund charge). Properties: eventually consistent (not immediately consistent), no global lock, each local transaction commits immediately. Types: choreography (each service reacts to events, publishes own events — decentralized, no coordinator), orchestration (central coordinator tells each service what to do — easier to understand, single point of control). Cover that compensating transactions must be idempotent (may be called multiple times), semantic rollback may not perfectly undo (email sent can't be unsent — accept this or use two-phase rollout). .NET: MassTransit SagaStateMachine, NServiceBus Saga, Wolverine.
```

#### 8.5 Choreography vs Orchestration
```
Compare Saga types: Choreography (services react to domain events — OrderPlaced → InventoryService reserves → PaymentService charges → ShippingService dispatches — decentralized, no single point of failure, loose coupling, hard to visualize full flow, hard to debug across services). Orchestration (central Saga orchestrator tells each service what to do — OrderSaga: call InventoryService → call PaymentService → call ShippingService — centralized logic, easy to understand, single source of truth, orchestrator is SPOF if not HA). Cover hybrid approach (use orchestration for critical business flows, choreography for ancillary processes). .NET: MassTransit supports both — StateMachine (orchestration) and event-based (choreography). Show when to use each: complex business logic with many conditions → orchestration; simple notification flows → choreography.
```

#### 8.6 Outbox Pattern
```
Explain Outbox pattern: the dual-write problem — writing to DB and publishing message atomically. Without outbox: write to DB succeeds but message publish fails → DB updated, downstream service not notified (inconsistency). Outbox solution: in same DB transaction, write to business table AND write to outbox table (message content + destination). Separate relay process reads outbox, publishes to message broker, marks as published. Guarantees: message published if and only if DB committed. Message relay: polling (simple — read unsent messages every second), CDC (Change Data Capture — listen to DB WAL for outbox inserts — low latency, no polling overhead). .NET: MassTransit Outbox (EF Core integration — wraps SaveChanges to write to outbox table), Wolverine Outbox, custom implementation with IHostedService poller. Show complete outbox setup with EF Core + MassTransit.
```

#### 8.7 Saga in .NET
```
Show Saga implementations in .NET: MassTransit SagaStateMachine (states, events, behaviors, correlation — stored in SQL/Redis/MongoDB), NServiceBus Saga (long-running business process, NHibernate/NServiceBus persistence), Wolverine Saga (lightweight, EF Core backed). Show a complete Order Processing Saga: states (Created, InventoryReserved, PaymentCharged, Shipped, Completed, Failed), events (OrderPlaced, InventoryReserved, PaymentFailed), transitions, compensation (InventoryReleaseRequested on PaymentFailed). Cover saga persistence (must survive restart — store saga state in DB), timeouts (saga auto-cancels if payment not received within 30 minutes), idempotency (saga must handle duplicate messages). Show MassTransit saga registration with EF Core persistence. Cover testing Sagas with MassTransit InMemory test harness.
```

---

### 9. Distributed Locking

#### 9.1 Why Distributed Locks
```
Explain distributed lock use cases: prevent duplicate processing (only one worker processes a job), mutual exclusion for shared resource (only one service instance modifies a resource at a time), leader election (only one instance is "leader" at a time), rate limiting (coordinated rate across instances). Cover that distributed locks are harder than local locks: lock holder can crash (lock never released), network can partition (holder can't release, others can't acquire), clock skew (lease expiry may fire at wrong time). Cover that distributed locks should be used sparingly (complex, failure modes) — design to not need them: idempotent operations (retry-safe, no lock needed), optimistic locking (detect conflict at write time, retry), partitioned work (each worker owns distinct partition). .NET: when you need a distributed lock, choose carefully based on consistency requirements.
```

#### 9.2 Redlock
```
Explain Redlock algorithm (Redis): acquire lock on N/2+1 independent Redis nodes (not replicas — independent). Steps: record start time, acquire lock on each node (SET key value PX timeout NX — set if not exists with expiry), if majority acquired within validity time (timeout - elapsed - clock drift), lock is valid, validity = min_validity. Release: delete key on all nodes. Controversies: Martin Kleppmann argues Redlock is unsafe (clock jumps, process pauses invalidate assumptions), Antirez (Redis creator) argues it's fine for most use cases. Key issue: if process pauses after acquiring lock (GC pause, OS scheduling) and lock expires, two processes may hold lock simultaneously. Fix: fencing tokens (covered in 9.5). .NET: Redlock.net NuGet, StackExchange.Redis extension methods. Cover when Redlock is acceptable vs when fencing tokens are required.
```

#### 9.3 Database-Based Locking
```
Show database-based distributed locking patterns: advisory locks (PostgreSQL pg_try_advisory_lock — fast, session or transaction scoped, non-blocking), SELECT FOR UPDATE SKIP LOCKED (lock specific row — great for queue processing, each worker locks own job), optimistic locking with version column (no lock held — check version on update, retry on conflict). Show .NET patterns: PostgreSQL advisory lock for single-instance job scheduling (prevents two pods running same cron job simultaneously), SELECT FOR UPDATE SKIP LOCKED for queue processing (workers compete for jobs without blocking each other). Cover that DB-based locks are simpler than Redis-based (no separate infrastructure), but DB is now a dependency and connection pool limits concurrency. Show EF Core with raw SQL for advisory locks and SKIP LOCKED.
```

#### 9.4 ZooKeeper/etcd Locking
```
Cover locking with ZooKeeper and etcd: ZooKeeper ephemeral sequential nodes (create /lock/node-00000001 — lowest sequential node holds lock, others watch predecessor — leader election using znodes), etcd lease-based lock (create key with lease TTL, lock acquired if key created successfully, lease renewal keeps lock alive, expiry releases lock). etcd advantages over Redis for locking: strongly consistent (Raft), no clock skew issue, ephemeral keys tied to client session (client dies → etcd detects via keepalive → key deleted → lock released). .NET: etcd3api NuGet for etcd locking, Apache ZooKeeper .NET client. Cover Kubernetes uses etcd for all distributed coordination including leader election. Show etcd lock implementation with lease renewal background task.
```

#### 9.5 Fencing Tokens
```
Explain fencing tokens as solution to lock expiry race conditions: distributed lock grants client a monotonically increasing token number. Every write to shared resource includes the token. Resource (DB, file server) rejects writes with token lower than last seen. Prevents: lock holder pauses (GC, OS), lock expires, new holder acquires lock with higher token, old holder resumes and tries to write — rejected because resource already saw higher token. Show the scenario: client A gets token 33, pauses, lock expires, client B gets token 34 and writes, client A resumes and tries to write with token 33 — storage rejects (33 < 34). Implementation: lock service issues incrementing tokens, storage checks token on every write. .NET: implement fencing in PostgreSQL (WHERE lock_token > @current_token), in Redis (custom Lua script checking token).
```

#### 9.6 Distributed Locking in .NET
```
Show practical distributed locking in .NET: StackExchange.Redis for Redlock (using IDistributedLock from RedLock.net — acquire, execute critical section, release in finally), IDistributedLock abstraction (Medallion.Threading NuGet — supports Redis, PostgreSQL, SQL Server, Azure, file system — uniform API across backends), optimistic locking in EF Core (DbUpdateConcurrencyException, retry). Show choosing backend: development (file-based or SQLite advisory), production (Redis for performance, PostgreSQL for consistency). Show IHostedService-based single-instance job using distributed lock (run timer job on only one pod). Cover that lock-free design is always better when possible (idempotent operations + optimistic concurrency). Show distributed lock timeout and renewal pattern for long-running critical sections.
```

---

### 10. Service Discovery & Load Balancing

#### 10.1 Discovery Patterns
```
Explain service discovery patterns: client-side discovery (client queries registry for service instances, performs load balancing — Netflix Ribbon/Eureka, Consul + custom client — client has full control, more complex client code, client must handle failures), server-side discovery (client calls load balancer, LB queries registry — AWS ALB, Kubernetes Service, Nginx + Consul — simple client, LB is SPOF, less flexibility). Cover self-registration (service registers itself on startup, deregisters on shutdown — simple but requires service to know registry address) vs third-party registration (orchestrator registers services — Kubernetes does this — service doesn't need to know registry). .NET Aspire uses client-side discovery with IServiceDiscovery abstraction.
```

#### 10.2 DNS-Based Discovery
```
Explain DNS-based service discovery: service name resolves to one or more IPs (A records for instances, SRV records for host+port). Benefits: universal client support (no library needed — DNS is built into OS), works with existing tools. Limitations: DNS TTL caching delays updates (new instances may not be discovered for TTL seconds — typically 30-60s), no health checking in basic DNS (unhealthy IPs returned until DNS updated), no load balancing info in DNS (client must round-robin). Kubernetes DNS: service.namespace.svc.cluster.local resolves to ClusterIP (load balanced VIP). .NET HttpClient DNS behavior: SocketsHttpHandler.PooledConnectionLifetime forces periodic DNS refresh (default 15 minutes — too slow for microservices, set to 30-60s). Show configuring SocketsHttpHandler for proper DNS TTL respect.
```

#### 10.3 Consul
```
Cover HashiCorp Consul for service discovery and health checking: service registration (API or config file), health checks (HTTP endpoint, TCP, script, TTL), service catalog (query by service name, tag, health status), DNS interface (service-name.service.consul), HTTP API for service lookup, watches (notify on service change). Show .NET integration: Consul NuGet (ConsulClient — register service, query service catalog), IHttpClientFactory + custom handler resolving from Consul, or sidecar Envoy proxy doing Consul integration. Cover Consul Connect (service mesh — mTLS between services). Cover Consul KV store for distributed configuration. Cover Consul health check endpoint in ASP.NET Core: app.UseHealthChecks("/health") → Consul HTTP health check. Show graceful deregistration on shutdown.
```

#### 10.4 Kubernetes Service Discovery
```
Cover Kubernetes service discovery for .NET: ClusterIP Service (stable virtual IP, kube-proxy routes to Pods via iptables/IPVS), DNS (my-service.my-namespace.svc.cluster.local), headless Service (returns Pod IPs directly — for stateful sets, client-side load balancing), ExternalName (CNAME to external service). .NET in K8s: service name as HttpClient base URL (http://payment-service — K8s DNS resolves to ClusterIP), environment variable injection (PAYMENT_SERVICE_SERVICE_HOST), Kubernetes .NET client (KubernetesClient NuGet — watch Endpoints for pod IP changes). Cover Endpoint slices (K8s 1.21+ — replaces Endpoints for scale). Cover .NET Aspire in K8s (uses K8s DNS). Show how kube-proxy implements ClusterIP (iptables rules round-robin across Pod IPs).
```

#### 10.5 LB Algorithms in Distributed Systems
```
Cover load balancing algorithms: Round Robin (equal distribution, simple — ignores server load), Weighted Round Robin (servers have weight — allocate proportionally to capacity), Least Connections (send to server with fewest active connections — good for variable-duration requests), Least Response Time (Nginx Plus, AWS ALB — send to fastest server), IP Hash (same client → same server — session affinity), Random with Two Choices (pick 2 random servers, choose less loaded — approximates least connections with O(1) lookup), Consistent Hash (for caching — same key → same server). .NET: HttpClient with Polly hedging + multiple BaseAddresses (custom round-robin), YARP load balancing (built-in power-of-two, round-robin, first), gRPC client load balancing (subchannel per backend). Cover that L7 load balancing (HTTP-aware) is better than L4 for microservices.
```

#### 10.6 .NET Aspire Service Discovery
```
Cover .NET Aspire service discovery: AddServiceDiscovery() in AppHost, services registered by name, IServiceDiscovery resolves name to endpoint at runtime (reads from configuration or Kubernetes). Show AppHost resource registration: builder.AddProject<Projects.PaymentService>("payment-service") — Aspire injects endpoint URL as config. Client-side: IHttpClientFactory + AddServiceDiscovery() on HttpClient — named service resolved at call time. Show local development (Aspire resolves to localhost:port), Docker Compose (resolves to container name), Kubernetes (resolves to K8s Service DNS). Cover Aspire Components (Redis, PostgreSQL, RabbitMQ — added to AppHost, connection strings injected into services). Cover that Aspire service discovery is an abstraction over DNS, Consul, K8s — same code works everywhere.
```

#### 10.7 gRPC Load Balancing
```
Cover gRPC load balancing challenges: gRPC uses HTTP/2 with multiplexed streams — standard L4 load balancers see one TCP connection per client and route all streams to same server (defeating load balancing). Solutions: L7 gRPC-aware load balancer (Envoy, Nginx, YARP — inspects HTTP/2 frames, routes per-RPC), client-side load balancing (gRPC channel has SubChannel per backend — custom LoadBalancer picks SubChannel per call), headless Kubernetes service + client-side load balancing (get Pod IPs, connect to each). Show .NET gRPC client-side load balancing: GrpcChannel with DnsResolverFactory + RoundRobinLoadBalancer. Cover that gRPC via Envoy sidecar (service mesh) is the cleanest solution — transparent to .NET code. Show Grpc.Net.Client.LoadBalancing NuGet configuration.
```

---

### 11. Resilience Patterns

#### 11.1 Failure Modes
```
Cover failure modes in distributed systems: crash failure (node stops responding — detectable via timeout), omission failure (node receives messages but doesn't respond — partial failure), timing failure (node responds but outside expected time window — slow, not dead), Byzantine failure (node responds with incorrect results — corruption, bugs). Cover fail-stop vs crash-recovery. Network failure modes: packet loss, reorder, duplicate, corruption, partition, latency spike. Show that crash detection requires timeouts (can't distinguish crashed from slow — Raft heartbeat timeout). Cover cascading failure: one slow service causes upstream services to queue requests, exhaust thread pools, go down — chain reaction. .NET: every cross-service call is a potential failure point — handle each explicitly.
```

#### 11.2 Retry Pattern
```
Cover retry pattern: on transient failure, retry the operation after delay. What's retryable: transient network errors (connection reset, timeout), HTTP 503 (service unavailable), HTTP 429 (rate limited), database deadlock, transient infrastructure errors. NOT retryable: 400 (bad request — won't succeed), 401/403 (auth failure), 404 (not found), business logic errors. Retry strategies: immediate retry (rarely correct — hammers failing service), fixed delay (better — give service time to recover), exponential backoff (delay doubles each attempt — reduces load on recovering service), exponential backoff with jitter (adds randomness — prevents synchronized retry storms / thundering herd — use full jitter or decorrelated jitter). .NET: Polly v8 RetryStrategyOptions, Microsoft.Extensions.Http.Resilience AddStandardResilienceHandler. Show jitter formula.
```

#### 11.3 Circuit Breaker
```
Cover circuit breaker pattern: prevent repeated calls to a failing service — fail fast instead of waiting for timeout. States: Closed (normal — requests pass through, failures counted), Open (service is down — all requests fail immediately without calling service — gives service time to recover), Half-Open (after timeout — allow one probe request through — if succeeds, reset to Closed; if fails, reset to Open). Transition triggers: failure rate threshold (>50% failures in last 10 requests → Open), failure count threshold (5 consecutive failures → Open). Recovery timeout: how long to stay Open before trying Half-Open. Benefits: reduced latency during outage (fail in <1ms vs 30s timeout), prevents overload of recovering service, cascading failure prevention. .NET: Polly CircuitBreakerStrategyOptions, state change events for logging/alerting. Show combining retry + circuit breaker (retry first, circuit breaker wraps outside).
```

#### 11.4 Bulkhead
```
Cover bulkhead pattern: isolate resources per dependency — limit damage from one failing dependency. Thread pool bulkhead: separate thread pool per downstream service — if payment service is slow, uses its own pool, doesn't affect order service thread pool. Semaphore bulkhead: limit concurrent calls to a dependency (SemaphoreSlim(10) — max 10 concurrent payment calls). Benefits: failure in one dependency doesn't exhaust shared resources, other dependencies continue functioning. Show Polly BulkheadStrategyOptions (ConcurrencyLimit, QueueLimit — requests beyond limit rejected immediately). Cover that bulkhead is separate from circuit breaker — circuit breaker fails fast when service is down, bulkhead limits concurrent requests regardless of health. .NET: separate HttpClient instances per downstream service (each has own connection pool = natural bulkhead).
```

#### 11.5 Timeout
```
Cover timeout pattern for distributed systems: every external call must have bounded latency — without timeout, slow service causes indefinitely blocked caller. Timeout types: connection timeout (how long to wait for TCP connection establishment — typically 1-5s), request timeout (how long to wait for response — application-specific — P99 + buffer), per-retry timeout vs total timeout (per-retry timeout + retries can exceed total if not careful). Timeout challenges: what happens to downstream request after timeout (it may still be processing — non-idempotent requests should not be retried on timeout without idempotency key), timeout propagation (pass CancellationToken from outer request to inner service calls — if HTTP request times out, cancel downstream calls). .NET: HttpClient.Timeout (overall), CancellationToken per request, .NET 8 RequestTimeouts middleware per endpoint. Show CancellationToken propagation through all layers.
```

#### 11.6 Fallback & Degraded Mode
```
Cover fallback pattern: when primary operation fails, return alternative response. Types: return default/empty (empty recommendations instead of error), return cached value (stale data from cache when service down — last known good response), return from secondary service (CDN or secondary API when primary down), degrade functionality (show page without personalization when recommendation service down). Design for graceful degradation: identify which features are essential (checkout must work) vs nice-to-have (personalized recommendations can fail), build fallback for non-essential features. .NET: Polly FallbackStrategyOptions (configured result or exception type → fallback action), IMemoryCache for cached fallback. Show Netflix Hystrix-style degradation (show generic recommendations from cache when ML service down). Cover that fallbacks must be tested — fallback path often breaks silently.
```

#### 11.7 Hedging
```
Explain hedging (speculative execution): send same request to multiple backends, use first response, cancel others. Reduces tail latency (P99 → effectively P50 of min(2 servers)). Hedging delay: don't send immediately to both — wait P95 latency, then send hedge if no response yet (avoids wasted requests for fast responses). Types: parallel hedging (send simultaneously), sequential hedging (wait delay then add backup). Precondition: requests must be safe to execute multiple times (idempotent GET, reads) — don't hedge non-idempotent writes. .NET: Microsoft.Extensions.Http.Resilience AddStandardHedgingHandler (3 attempts, P95-based hedge delay), custom Polly HedgingStrategyOptions. Cover that hedging increases backend load by (1/P_hedge_probability)x — measure impact. Show hedging for database reads (primary + read replica — use whichever responds first).
```

#### 11.8 Rate Limiting
```
Cover rate limiting as distributed resilience: protect services from overload (your service), respect upstream limits (calling external APIs), prevent abuse (per-user limits). Algorithms: Fixed Window (count requests per window — simple, burst at window boundary), Sliding Window (smooth count across rolling period — more accurate), Token Bucket (tokens added at fixed rate, consumed per request — allows burst up to bucket size), Leaky Bucket (queue requests, process at fixed rate — strict rate, no bursts). Distributed rate limiting: single instance = in-memory counter (fast), scale-out = Redis counter (Interlocked via INCR with EXPIRE — consistent across instances). .NET: ASP.NET Core rate limiter middleware (.NET 7+), RedisRateLimiter for distributed. Cover sliding window in Redis (sorted set with timestamps, remove expired entries, count remaining).
```

#### 11.9 Polly & Microsoft.Extensions.Http.Resilience
```
Comprehensive guide to .NET resilience: Polly v8 (ResiliencePipeline, composable strategies — retry, circuit breaker, timeout, rate limiter, bulkhead, hedging, fallback), Microsoft.Extensions.Http.Resilience (.NET 8 — AddStandardResilienceHandler combines all strategies with sensible defaults, AddStandardHedgingHandler for hedging). Show production-ready resilience pipeline: timeout(30s) → retry(3, exponential backoff) → circuit breaker (50% failure rate, 30s open) → bulkhead (10 concurrent) → fallback (return cached). Polly Telemetry: MeteringEnricher for metrics, TelemetryOptions for events. Show HttpClient configuration with resilience: builder.Services.AddHttpClient<IPaymentClient, PaymentClient>().AddStandardResilienceHandler(options => { ... }). Cover Polly v8 migration from v7 (new API, ResiliencePipeline replaces Policy).
```

---

### 12. Messaging

#### 12.1 Message Brokers
```
Explain message brokers: middleware that decouples senders (producers) from receivers (consumers). Responsibilities: store messages (durably or transiently), route messages (topic, queue, subscription), deliver messages (push or pull), manage consumer groups, provide backpressure, handle failures (retries, DLQ). Benefits over direct service calls: temporal decoupling (producer and consumer don't need to be running simultaneously), load leveling (broker buffers bursts — consumer processes at its own rate), fan-out (one message to many consumers), replay (re-read historical messages). Cost: additional infrastructure, eventual consistency (message delivery has latency), ordering challenges, duplicate delivery. .NET: NServiceBus, MassTransit, Wolverine as abstractions over brokers (RabbitMQ, Kafka, Azure Service Bus, SQS).
```

#### 12.2 Queue vs Pub/Sub vs Streaming
```
Compare messaging models: Message Queue (point-to-point — one producer, one consumer per message, competing consumers for scale, message deleted after consumption — RabbitMQ queues, SQS, Azure Service Bus queues — use for task distribution, work queues), Pub/Sub (broadcast — one publisher, multiple independent subscribers each get all messages — RabbitMQ fanout exchange, SNS, Azure Service Bus topics — use for event notification, decoupled notification), Event Streaming (ordered log — all messages retained, consumers read at own offset, multiple consumers can re-read history, replay from beginning — Kafka, Azure Event Hubs, Kinesis — use for event sourcing, audit log, stream processing, CDC). Show decision guide: task = queue, notification = pub/sub, history + replay = streaming. .NET library mapping.
```

#### 12.3 Delivery Semantics
```
Explain message delivery guarantees: At-Most-Once (fire and forget — producer sends, broker doesn't ACK, may lose messages on broker crash — use for metrics/logging where loss is OK, highest performance), At-Least-Once (producer retries until ACK, consumer may receive duplicates — use for most business operations with idempotent consumers, standard in Kafka/RabbitMQ), Exactly-Once (no loss, no duplicates — requires distributed transaction or idempotent producer + transactional consumer — Kafka transactions provide EOS, very complex, high overhead — use only when absolutely necessary). Cover that "exactly-once" in distributed systems is extremely hard — most systems implement at-least-once + idempotent consumers to achieve effective exactly-once. .NET: MassTransit defaults to at-least-once.
```

#### 12.4 Idempotent Consumers
```
Explain idempotent message processing: consumer handles same message multiple times with same result (no duplicate side effects). Strategies: natural idempotency (operations that are inherently idempotent — SET value = X is idempotent, INCREMENT value is not), idempotency key (store processed message IDs in DB, reject duplicates — SELECT WHERE message_id = @id; if not exists, process and INSERT), conditional operations (UPDATE WHERE version = @expected — naturally idempotent, rejects duplicate with stale version), deduplication window (store message IDs for last N seconds/minutes — reject duplicates within window). Show .NET implementation: IDistributedCache for deduplication window, DB-backed message ID table. Cover that idempotency must consider ALL side effects (DB write, email sent, external API call — all must be idempotent or gated by same idempotency check).
```

#### 12.5 Message Ordering
```
Cover message ordering in distributed messaging: total order (all consumers see all messages in same order — single partition Kafka, Redis Streams — limited throughput), partition-level order (Kafka: messages with same key → same partition → in-order within partition, but relative order between partitions not guaranteed — scale by adding partitions, order within entity ID), no guarantee (parallel consumers, competing queues — best throughput, no order). Cover when ordering matters: sequential state changes (order placed → order confirmed → order shipped must be in order), idempotent processing reduces ordering requirements (if consumer can handle out-of-order with idempotency, ordering less critical). .NET Kafka: partition by entity ID (user ID, order ID) to colocate related messages on same partition and guarantee per-entity order.
```

#### 12.6 DLQ
```
Cover Dead Letter Queues: messages that fail processing repeatedly moved to DLQ for investigation. Retry policy: retry N times with backoff → move to DLQ. DLQ use cases: poison messages (bug in consumer — fix code, reprocess from DLQ), transient dependency failure (DB down — messages DLQ'd, DB recovers, replay DLQ), bad data (validation fails — requires data fix). DLQ management: monitor DLQ depth (alert on growth), DLQ dashboard (inspect failed messages), replay tool (move messages back to main queue after fix), analysis (detect patterns in failed messages). .NET: RabbitMQ dead letter exchange (x-dead-letter-exchange, x-message-ttl), Azure Service Bus DLQ (automatic after max delivery count), Kafka (no built-in DLQ — implement consumer retry topic + dead letter topic). MassTransit: _error queue is DLQ, _skipped for unrecognized messages.
```

#### 12.7 Backpressure
```
Explain backpressure in messaging: slow consumer, fast producer — queue grows without bound → memory exhaustion or disk full. Backpressure signals: broker returns error when full (producer must slow down), producer blocks until consumer catches up (TCP backpressure-style), producer drops messages (lossy — metrics/telemetry). Bounded queues: set maximum queue depth — reject new messages when full (producers must handle this). Consumer scaling: add consumer instances when queue depth grows (autoscaling). Flow control: Reactive Streams spec (backpressure via demand signaling — RxJava, Akka Streams). .NET: Channel<T>(BoundedChannelOptions) for in-process backpressure, RabbitMQ prefetch count (consumer tells broker max unacknowledged messages — broker doesn't overwhelm consumer), Kafka consumer poll controls rate. Cover that bounded channels + backpressure prevent OOM in .NET pipelines.
```

#### 12.8 Schema Evolution
```
Cover message schema evolution in distributed systems: consumers may run different versions than producers — must maintain compatibility. Types: backward compatibility (new consumer can read old messages — add fields with defaults, don't remove/rename required fields — consumers evolve first, then producers), forward compatibility (old consumer can read new messages — don't add required fields without default, don't change field types — producers evolve first, then consumers), full compatibility (both — add optional fields only, never rename/remove fields). Schema formats: Protobuf (field numbers — compatible if add new optional fields), Avro (schema registry validates compatibility), JSON (no enforced compatibility — risky). .NET: use Confluent Schema Registry + Avro/Protobuf for Kafka, XML schema versioning for legacy, OpenAPI for REST. Show Protobuf field deprecation and new field addition workflow.
```

---

### 13. Kafka for .NET

#### 13.1 Kafka Architecture
```
Explain Kafka architecture: Brokers (servers storing and serving data, typically 3-5 in cluster), Topics (logical log of events — like a database table but append-only), Partitions (topics split into N partitions — each partition is an ordered immutable log stored on one broker, unit of parallelism), Offsets (position in partition log — consumer tracks its offset, can replay from any offset), Consumer Groups (multiple consumers sharing partitions — each partition assigned to one consumer in group, N consumers + M partitions → min(N,M) consumers active), ZooKeeper/KRaft (cluster coordination — metadata storage). Cover retention: messages kept for configured period (default 7 days) or size — can replay historical messages. Cover replication: each partition has leader + follower replicas across brokers.
```

#### 13.2 Kafka Producers
```
Cover Kafka producer internals: RecordAccumulator (batch records before sending — linger.ms wait for more records, batch.size max bytes), Partitioner (choose partition: round-robin for null key, hash(key)%N for keyed messages — ensures same key → same partition), Compression (snappy/lz4/gzip/zstd — compresses batches — significant reduction for JSON), Acks (0: fire-and-forget, 1: leader ACK only, all/-1: all ISR replicas ACK — higher acks = lower throughput + better durability), Retries (automatic retry on retriable errors — configure max.in.flight.requests.per.connection=1 for ordering with retries). .NET: Confluent.Kafka ProducerBuilder, ProduceAsync, Flush(). Show high-throughput configuration vs reliable configuration trade-offs. Cover idempotent producer (enable.idempotence=true — deduplicates retries at broker, required for exactly-once).
```

#### 13.3 Kafka Consumers
```
Cover Kafka consumer internals: Consumer Group (group.id — partitions distributed among consumers in group), Partition Assignment (range, round-robin, sticky — sticky minimizes rebalancing), Rebalancing (consumer joins/leaves → partitions reassigned to group — brief pause in consumption, cooperative rebalance in recent versions reduces pause), Offset Management (auto.commit.interval.ms for async commit, manual commit for at-least-once — CommitSync after processing), Fetch (fetch.min.bytes, fetch.max.wait.ms — batch fetching for throughput). .NET: Confluent.Kafka ConsumerBuilder, Consume loop, manual offset commit, partition pause/resume. Cover consumer lag monitoring (offset behind latest — alert if lag grows). Cover that slow consumer causes rebalance (session.timeout.ms, max.poll.interval.ms). Show IHostedService-based Kafka consumer in ASP.NET Core.
```

#### 13.4 Kafka EOS
```
Explain Kafka Exactly-Once Semantics: Idempotent Producer (enable.idempotence=true — deduplicates duplicate produces due to retries, per-partition sequence numbers at broker — not cross-partition), Transactions (transactional.id — producer writes to multiple partitions atomically, consumer reads committed only with isolation.level=read_committed, enables read-process-write exactly-once). Pattern: consume → transform → produce in transaction → commit consumer offset in same transaction → atomically commits or aborts entire unit. Limitations: same Kafka cluster only (transactional writes to external systems need 2PC or Outbox), performance overhead (~3-10% throughput reduction), requires exactly one producer instance per transactional.id. .NET: Confluent.Kafka transaction API (BeginTransaction, CommitTransaction, AbortTransaction). Show Kafka Streams-style exactly-once with .NET.
```

#### 13.5 Kafka Streams
```
Cover Kafka Streams for stream processing: stateless operations (filter, map, flatMap — applied record-by-record), stateful operations (aggregations, joins — require local state stored in RocksDB), windowing (tumbling, hopping, sliding, session windows), joins (stream-stream: within time window, stream-table: latest table value per key, table-table: latest of both). KStream (record stream — each record is event), KTable (changelog stream — each record is latest value for key — like database table), GlobalKTable (replicated to all instances — for reference data joins). .NET: there's no official Kafka Streams .NET port — use Apache Flink .NET client, StreamsBuilder in Java, or custom processing in Confluent.Kafka consumer. Cover that simple transformations are better done in consumer code for .NET.
```

#### 13.6 Kafka in .NET
```
Comprehensive Confluent.Kafka .NET guide: producer (ProducerConfig, ProducerBuilder<TKey, TValue>, ProduceAsync, DeliveryResult, error handling), consumer (ConsumerConfig, ConsumerBuilder, Consume loop with CancellationToken, manual commit, assign vs subscribe), serialization (JsonSerializer, Avro via Confluent.SchemaRegistry.Serdes), AdminClient (create topics, describe cluster, list offsets). Show ASP.NET Core integration: IHostedService background consumer, IProducer singleton registration, health check for Kafka connectivity, graceful shutdown (consumer.Close()). Show MassTransit with Kafka transport (cleaner API, saga support, middleware pipeline). Cover error handling: DeliveryException, KafkaException, ConsumeException. Show consumer group rebalance handling (OnPartitionsAssigned, OnPartitionsRevoked callbacks).
```

#### 13.7 Schema Registry in .NET
```
Cover Confluent Schema Registry with Avro/Protobuf in .NET: Schema Registry stores schema definitions, validates compatibility on publish, serializes with schema ID reference (not full schema in message). Benefits: compact messages (schema ID = 4 bytes vs full schema), compatibility enforcement (reject incompatible schema evolution), schema-driven development. .NET: Confluent.SchemaRegistry.Serdes.Avro NuGet, AvroSerializer/AvroDeserializer, CachedSchemaRegistryClient (caches schemas locally). Show generating C# classes from Avro schema (avrogen tool). Cover Protobuf with Schema Registry. Cover schema compatibility levels (BACKWARD, FORWARD, FULL — set per subject). Show MassTransit with Confluent Schema Registry integration. Cover that Schema Registry is critical for multi-team Kafka deployments — enforces contract between producer and consumer teams.
```

---

### 14. RabbitMQ for .NET

#### 14.1 RabbitMQ Architecture
```
Explain RabbitMQ architecture: Broker (server — stores messages, routes via exchanges), Exchanges (routing rules — receive messages from publishers, route to queues via bindings), Queues (ordered message buffer — consumers subscribe, FIFO by default), Bindings (rules connecting exchange to queue — routing key patterns, headers), Consumers (subscribe to queue, receive messages), Virtual Hosts (logical isolation — separate exchanges + queues per vhost — multi-tenant isolation), Channels (lightweight connection multiplexing — multiple channels per TCP connection — don't create per-message). Message flow: publisher → exchange → binding (routing key match) → queue → consumer. Persistent messages survive broker restart (delivery-mode=2 + durable queue + durable exchange).
```

#### 14.2 Exchange Types
```
Cover RabbitMQ exchange types: Direct (route by exact routing key match — payment.processed → queues bound with payment.processed — point-to-point), Fanout (route to all bound queues regardless of routing key — broadcast — all consumers get copy — use for notifications), Topic (route by routing key pattern — *.order.* matches us.order.shipped — wildcards: * = one word, # = zero or more words — flexible routing), Headers (route by message header attributes instead of routing key — rarely used). Show binding examples for each. Default exchange (empty string — routes to queue with same name as routing key — direct to named queue). Dead Letter Exchange (DLX — messages rejected/expired routed to DLX — for DLQ implementation). .NET: AMQP.Client exchange declaration and binding. Show MassTransit exchange topology.
```

#### 14.3 Durability & Confirms
```
Cover RabbitMQ message durability and publisher confirms: durable exchange (survives broker restart), durable queue (survives broker restart), persistent message (delivery_mode=2 — persisted to disk before delivery). Publisher confirms: channel.ConfirmSelect() — broker ACKs after routing/persisting, producer awaits ACK (ConfirmPublishAsync or WaitForConfirms) — at-least-once delivery guarantee. Batch confirms: publish many messages, WaitForConfirmsOrDie() — all in batch confirmed at once. Performance: confirm mode has overhead (~10-20% throughput reduction vs no confirms — necessary for at-least-once). Cover that without confirms + durable messages, broker restart loses messages. .NET: RabbitMQ.Client IModel.ConfirmSelect(), IModel.BasicPublish with persistent=true. Show MassTransit handling durability.
```

#### 14.4 Consumer Acks & Prefetch
```
Cover consumer acknowledgments and prefetch control: basicAck (consumer acknowledges successful processing — broker deletes message), basicNack/basicReject (negative acknowledgment — requeue=true sends back to queue for retry, requeue=false goes to DLX), autoAck (broker deletes message on delivery before consumer processes — at-most-once — dangerous for most use cases). Prefetch count (basicQos — how many unacked messages consumer can hold — prevents overwhelming consumer with all queue messages — set to 1 for fair dispatch, higher for throughput). Show that prefetch=1 + manual ack = fair dispatch (slow consumer gets less work). .NET: RabbitMQ.Client IModel.BasicQos(prefetchCount), IModel.BasicAck/BasicNack in consumer. Cover that unacked messages held in memory — prefetch too high = OOM. Show MassTransit prefetch configuration.
```

#### 14.5 RabbitMQ in .NET
```
Comprehensive RabbitMQ .NET guide: RabbitMQ.Client (low-level — ConnectionFactory, IConnection, IChannel, declare exchange/queue, bind, publish, consume with EventingBasicConsumer or AsyncEventingBasicConsumer), MassTransit (high-level abstraction — consumers as IConsumer<T>, middleware pipeline, saga support, retry, outbox, topology configuration). Show ASP.NET Core integration: singleton IConnection, scoped IChannel per request, IHostedService background consumer. Cover graceful shutdown (channel.Close(), connection.Close()). Cover connection recovery (ConnectionFactory.AutomaticRecoveryEnabled = true — reconnects after broker restart). Show MassTransit Bus configuration with RabbitMQ. Cover MassTransit message routing conventions (exchange naming, queue naming). Show publisher confirms with MassTransit.
```

#### 14.6 RabbitMQ vs Kafka
```
Compare RabbitMQ and Kafka for .NET microservices: RabbitMQ (message broker — message deleted after consumption, complex routing via exchanges, push-based to consumers, lower throughput ~50K msg/sec, queue depth monitoring, mature .NET ecosystem, use for: task queues, RPC patterns, complex routing, work distribution), Kafka (event log — messages retained, consumers track own offset, pull-based, high throughput ~1M+ msg/sec, replay capability, event sourcing, stream processing, use for: event sourcing, CDC, audit log, cross-team event bus, analytics). Decision guide: need message routing complexity → RabbitMQ; need replay/history → Kafka; need stream processing → Kafka; need simple task queue → RabbitMQ; need ordered log → Kafka; need complex workflow coordination → RabbitMQ (with MassTransit). Many production systems use both (Kafka for event log, RabbitMQ for task distribution).
```

---

### 15. Event Sourcing & CQRS

#### 15.1 Event Sourcing
```
Explain Event Sourcing: instead of storing current state (UPDATE users SET name = 'Alice'), store the sequence of events that led to that state (UserRegistered{name:'Bob'}, UserNameChanged{name:'Alice'}). State = replay of all events. Benefits: complete audit trail (all changes recorded), event replay (rebuild state from scratch, create new projections), time travel (state at any point in past), debugging (what events caused this state?), event-driven integration (events are natural integration points). Challenges: event schema evolution (can't change past events), eventual consistency (projections lag behind events), query complexity (must rebuild state from events for queries — hence read models), large event stores for long-lived aggregates (mitigated by snapshots). .NET: EventStoreDB (purpose-built), Marten (PostgreSQL-backed), custom append-only table in EF Core.
```

#### 15.2 Projections & Read Models
```
Explain projections: event handlers that build read models (queryable state) from event streams. Read model is derived data — can be rebuilt from events at any time. Types: real-time projection (process events as they arrive, update read model — eventual consistency), on-demand projection (replay events to compute state when queried — accurate but slow for long streams), snapshot + projection (combine snapshot with recent events — balance speed and accuracy). Read model examples: UserProfile view (aggregates UserRegistered + UserNameChanged + UserEmailChanged), OrderHistory view (all orders for a user), SalesDashboard (aggregate daily totals from OrderPlaced events). .NET: EventStoreDB subscription + projection to PostgreSQL, Marten projections (IAggregateProjection, IProjection — live or async). Show subscribing to event stream and updating read model.
```

#### 15.3 Snapshots
```
Explain snapshots in event sourcing: periodic capture of aggregate state to avoid replaying all events from beginning. Snapshot every N events (e.g., every 50 events — replaying only events after snapshot). Snapshot storage: separate table/stream alongside event stream. Loading with snapshot: load latest snapshot → load events after snapshot position → apply events to snapshot state = current state. Trade-offs: additional storage (both snapshots and events), snapshot invalidation (if event schema changes, old snapshots may be invalid — version snapshots). When to use: aggregate has many events (order with 1000+ history changes), frequent reads of same aggregate. .NET: EventStoreDB metadata stream for snapshots, Marten document snapshot (UseOptimisticConcurrency + snapshot policy). Show snapshot + projection loading pattern.
```

#### 15.4 Event Schema Evolution
```
Cover event schema evolution challenges: events are immutable (committed to append-only log), but business requirements evolve (need to add fields, rename fields, change types). Strategies: upcasting (transform old event to new format during replay — UpcastingEventStore wraps reader), versioning events (OrderPlacedV1, OrderPlacedV2 — event type includes version — handlers for each version), optional fields with defaults (add fields as optional with sensible defaults — backward compatible), event splitting (split one event into two — upcaster converts old event to sequence of new events). Show NEventStore upcasting. Cover that event names should be business language not technical (UserDeactivated not UserIsActiveSetToFalse). Cover event catalog / event registry for team coordination. .NET: EventStoreDB IEventDataTransformation for upcasting.
```

#### 15.5 CQRS
```
Explain CQRS (Command Query Responsibility Segregation): separate read model and write model. Commands (change state — no return value or minimal acknowledgment — validated and handled by command handlers → update write model → publish events), Queries (read state — no side effects — served by read models optimized for specific queries). Benefits: independently scaled read and write sides, read models optimized for specific queries (denormalized, indexed differently), write model focused on business rules (normalized, validated). Variants: full CQRS (separate databases for read and write — eventual consistency), simple CQRS (separate read/write models but same database — simpler, less flexibility). .NET: MediatR for command/query routing (IRequest, IRequestHandler), separate command and query services. Cover that CQRS without event sourcing is valid (and simpler).
```

#### 15.6 CQRS + Event Sourcing
```
Show CQRS and Event Sourcing together: write side (command → aggregate loads from event store → validates → appends new events to event store → projections update read model from events), read side (query → read model → denormalized fast response). Benefits: complete audit trail, temporal queries, independently scalable read and write, multiple specialized read models. Challenges: eventual consistency between write and read sides, complex infrastructure, steep learning curve, testing complexity. Show the complete flow: CreateOrder command → OrderAggregate loads from EventStoreDB → validates → appends OrderCreated event → async projection updates OrdersReadModel table → query reads from OrdersReadModel. .NET: Marten as both event store and document database (same PostgreSQL DB — events + projections), EventStoreDB + separate read DB.
```

#### 15.7 Event Sourcing in .NET
```
Cover .NET event sourcing options: EventStoreDB (purpose-built — gRPC API, projections engine, subscriptions, catch-up and live), Marten (PostgreSQL-based — excellent for teams already using PostgreSQL — stores events as JSONB, built-in projections, identity map, snapshots), custom EF Core (append-only events table + projection tables — simple but limited). Show Marten: DocumentStore with event sourcing, IDocumentSession.Events.Append, IDocumentSession.Events.FetchStreamAsync, creating aggregate with Apply methods, live projection, async projection daemon. Show EventStoreDB: EventStoreClient.AppendToStreamAsync, EventStoreClient.SubscribeToStreamAsync for live projections, PersistentSubscription for competing consumers. Cover testing event sourced aggregates (replay events, verify state). Cover Marten vs EventStoreDB decision (Marten: simpler, PostgreSQL reuse; EventStoreDB: dedicated, more features, projections language).
```

---

### 16. API Gateway & BFF

#### 16.1 API Gateway Pattern
```
Explain API Gateway pattern: single entry point for all external client requests to microservices. Responsibilities: routing (proxy request to correct microservice), authentication (validate JWT/API key once — offload from each service), rate limiting (per-client throttling), SSL termination (TLS at gateway, HTTP internally), request aggregation (combine multiple service responses), transformation (adapt between external API contract and internal service contracts), load balancing, caching, logging/monitoring. Cover that gateway is a SPOF — must be HA, must not be a bottleneck. Cover that gateway should not contain business logic — pure infrastructure concern. Cover that BFF (Backend for Frontend) is a specialized gateway pattern per client type. .NET options: YARP, Ocelot, Azure API Management, AWS API Gateway.
```

#### 16.2 BFF Pattern
```
Explain Backend for Frontend (BFF): separate API gateway per client type (mobile BFF, web BFF, third-party BFF). Each BFF tailored to its client's needs — mobile BFF returns compact responses optimized for mobile bandwidth, web BFF returns richer responses. Benefits: client-specific optimization (no over-fetching/under-fetching), evolve independently per client, security isolation (mobile BFF only exposes mobile-relevant APIs), team ownership (mobile team owns mobile BFF). Costs: multiple gateways to maintain, code duplication if not careful. Cover that BFF prevents the "universal API" problem (one API trying to serve all clients). .NET: each BFF is its own ASP.NET Core project using YARP or HttpClient to call downstream services. Show web BFF aggregating responses from product, inventory, and pricing services for a product page.
```

#### 16.3 YARP as Gateway
```
Show YARP (Yet Another Reverse Proxy) as API Gateway in .NET: route configuration (Routes → Clusters — route matches path/host/method, cluster has one or more destinations), load balancing (round-robin, random, power-of-two, first), health checks (active + passive), transforms (request/response header modification, path rewriting, query string manipulation), middleware (ASP.NET Core middleware pipeline — add auth, rate limiting, logging as middleware). Show dynamic configuration (IProxyConfigProvider — load routes from DB or consul, hot reload). Show YARP as BFF: route /api/mobile/* to mobile cluster, /api/web/* to web cluster. Cover YARP extensions (ForwarderHttpClientFactory for custom HttpClient, ITransformProvider for custom transforms). Show JWT validation middleware before YARP forwarding. Cover YARP vs nginx (YARP is .NET native, customizable in C#; nginx is faster for simple proxying).
```

#### 16.4 Ocelot
```
Cover Ocelot API gateway for .NET: JSON-based configuration (ocelot.json — UpstreamPathTemplate, DownstreamPathTemplate, DownstreamHostAndPorts), features (routing, load balancing, authentication, rate limiting, QoS, caching, logging, tracing, response aggregation). Show ocelot.json configuration for routing, authentication with JWT bearer. Cover Ocelot aggregates (combine multiple downstream responses into one — AggregateRoute). Cover Consul/Eureka integration for dynamic downstream service discovery. Cover that Ocelot is configuration-heavy but straightforward — good for teams preferring configuration over code. Compare YARP vs Ocelot: YARP is code-first, more flexible, newer; Ocelot is config-first, more opinionated, more features out of box. Show production Ocelot deployment with multiple replicas and shared config in Redis.
```

#### 16.5 Gateway Security
```
Cover security at the API gateway layer: centralized authentication (validate JWT/API key once at gateway — don't validate in every service — reduces latency, single place to update auth logic), rate limiting per API key/user (gateway enforces before requests reach services), DDoS mitigation (gateway as first line of defense — WAF integration, request filtering), TLS termination (gateway handles TLS — services communicate over HTTP internally — simpler certificate management), IP allowlisting (restrict access to known IPs at gateway level), request sanitization (strip internal headers before forwarding — prevent client from setting X-Internal-User-Id). Show ASP.NET Core authentication middleware in YARP pipeline (validate JWT before forwarding). Cover that gateway security doesn't replace service-level authorization — defense in depth.
```

#### 16.6 Request Aggregation
```
Show request aggregation at the gateway: instead of client making 5 calls (product details, inventory, pricing, reviews, recommendations), gateway makes 5 parallel calls and returns aggregated response. Benefits: fewer client round trips (5 calls → 1), gateway knows which services to call and can parallelize, simpler client code. Implementation: YARP custom middleware with HttpClient fan-out (Task.WhenAll for parallel calls), Ocelot aggregation routes, custom BFF endpoint in ASP.NET Core. Cover timeout for aggregation (slowest service determines response time — set per-service timeout, return partial response if some services fail). Cover partial response strategy: return available data with indication of what failed vs fail entire request. Show .NET BFF aggregating with HttpClientFactory + Task.WhenAll + timeout + fallback per service.
```

---

### 17. Service Mesh

#### 17.1 Service Mesh Concepts
```
Explain service mesh: infrastructure layer that handles service-to-service communication. Sidecar pattern: each service pod has a sidecar proxy (Envoy) — all traffic in/out goes through sidecar. Application code talks to localhost, sidecar handles: mTLS (encrypt + authenticate all service traffic), load balancing, retries, circuit breaking, observability (metrics, traces, logs — without code changes), traffic management (canary, A/B testing). Control plane (Istio control plane, Linkerd control plane): configures sidecars, distributes certificates, collects telemetry. Data plane: sidecars that actually handle traffic. Benefits: security and observability without code changes, uniform policy enforcement. Costs: latency overhead (sidecar hop ~1ms), operational complexity, debugging difficulty.
```

#### 17.2 Istio
```
Cover Istio for .NET deployments: VirtualService (traffic routing rules — 20% to v2, redirect based on headers), DestinationRule (load balancing policy per service, connection pool settings, outlier detection/circuit breaker), PeerAuthentication (mTLS enforcement — PERMISSIVE allows plain + mTLS, STRICT requires mTLS), AuthorizationPolicy (L7 ACLs — only service A can call service B on GET /api/*). Show Istio RBAC for .NET microservices: only payment-service can call bank-api. Cover Istio traffic management for canary: 10% traffic to new version, 90% to stable. Cover that Istio requires more resources (Envoy sidecar + istiod control plane overhead). Cover that .NET apps work with Istio transparently — no code changes needed for mTLS, retries, and circuit breaking (but Polly in app provides additional resilience).
```

#### 17.3 Linkerd
```
Cover Linkerd as lightweight service mesh alternative to Istio: Rust-based proxy (ultra-low overhead — <1ms latency vs Envoy's 2-3ms), simpler operational model (no complex VirtualService/DestinationRule YAML), automatic mTLS (zero-config — all pods get mutual TLS), golden metrics (success rate, request rate, latency — automatically collected), service profiles (retry budgets per route, timeout per route, circuit breaking). .NET advantages: Linkerd works especially well with gRPC (.NET default for service-to-service) — HTTP/2 load balancing per-RPC rather than per-connection. Show injecting Linkerd sidecar into .NET deployment (kubectl annotate / linkerd inject). Cover that Linkerd is preferred for teams wanting service mesh benefits without Istio complexity. Cover that .NET with HttpClient works transparently with Linkerd mTLS.
```

#### 17.4 eBPF-Based Mesh
```
Explain eBPF-based networking (Cilium): instead of sidecar proxy per pod, use eBPF programs in Linux kernel to intercept and route traffic — no sidecar overhead, kernel-level enforcement. Cilium capabilities: network policies (L3/L4/L7 — deny specific service-to-service communication), service mesh without sidecars (Cilium Service Mesh — mTLS via eBPF kernel, not proxy), observability (Hubble — eBPF-based flow visibility, no sampling). Benefits over sidecar mesh: lower latency (kernel vs sidecar proxy), lower resource usage (no sidecar per pod), simpler operations. Current limitations: less mature feature set vs Istio, requires Linux kernel 5.x+. .NET relevance: emerging replacement for Istio in some organizations — understand direction of ecosystem. Cover that eBPF is transforming infrastructure tooling broadly.
```

#### 17.5 Mesh Observability
```
Cover service mesh observability advantages for .NET microservices: automatic distributed tracing without code instrumentation (Istio/Linkerd inject trace headers — Zipkin, Jaeger integration), golden signals per service per route (requests/sec, error rate, P50/P95/P99 latency — without adding metrics to .NET code), network topology visualization (Kiali for Istio, Linkerd dashboard — shows service graph with health), security posture visibility (which services have mTLS, certificate rotation, policy violations). Cover that mesh observability complements (not replaces) application-level observability — mesh sees network, application OpenTelemetry sees business logic. Show that .NET application adding OpenTelemetry + Istio mesh gives complete observability. Cover that mesh traces can be correlated with application traces via trace ID propagation.
```

#### 17.6 When to Use Service Mesh
```
Decision guide for service mesh adoption with .NET: use service mesh when: many microservices (>10 services — per-service security and observability code becomes unmanageable), security requirements (mTLS mandatory between services — zero-trust network), advanced traffic management needed (canary deployments, circuit breaking without code changes), compliance (audit all service communications). Don't use service mesh when: few services (2-5 — Polly + manual mTLS is simpler), team not familiar with K8s (mesh requires K8s expertise), low-latency requirements sensitive to sidecar overhead, small team (operational burden not worth it). Migration path: start with Linkerd (simpler), move to Istio if more features needed. .NET-specific: if already using Polly for resilience, mesh provides less incremental value for resilience — more value for security and observability.
```

---

### 18. Observability

#### 18.1 Three Pillars
```
Explain the three pillars of observability: Logs (structured records of events — what happened: "Order 123 placed at 14:32:01", queryable with Elasticsearch/Loki/Splunk, best for debugging), Metrics (numerical measurements over time — how the system is behaving: request rate, error rate, latency p99, CPU usage — queryable with Prometheus/DataDog, best for alerting and dashboards), Traces (end-to-end request path across services — why something happened: which service caused slow response, shows causality — queryable with Jaeger/Zipkin/Tempo, best for performance investigation). Cover that each pillar alone is insufficient: logs without metrics (can't alert), metrics without traces (can't pinpoint), traces without logs (can't see details). Modern observability: correlate all three via trace ID.
```

#### 18.2 Distributed Tracing
```
Explain distributed tracing: follow a request as it flows through multiple services. Trace (collection of spans representing full request journey), Span (single operation — HTTP call, DB query, function call — has: trace ID, span ID, parent span ID, operation name, start/end time, tags, logs, status). W3C TraceContext standard (traceparent: 00-traceId-spanId-flags header — propagated between services). Sampling: trace every request = too expensive (store + process overhead), sample 1-10% of requests (head-based sampling — decide at start), tail-based sampling (decide after seeing full trace — sample slow/error traces at 100%). .NET: OpenTelemetry automatic instrumentation for HttpClient, ASP.NET Core, gRPC, EF Core — traces created without code changes. Show trace visualization in Jaeger with .NET services.
```

#### 18.3 OpenTelemetry in .NET
```
Comprehensive OpenTelemetry .NET guide: install (OpenTelemetry, OpenTelemetry.Extensions.Hosting, OpenTelemetry.Instrumentation.AspNetCore, OpenTelemetry.Instrumentation.Http, OpenTelemetry.Exporter.Otlp), configure in Program.cs (AddOpenTelemetry().WithTracing(tracing => ...).WithMetrics(metrics => ...).WithLogging(logging => ...)), automatic instrumentation (ASP.NET Core request spans, HttpClient spans, EF Core DB spans — zero code changes), custom spans (ActivitySource for business operations — using var activity = activitySource.StartActivity("ProcessOrder")), custom metrics (Meter, Counter, Histogram), exporters (OTLP → Jaeger, Zipkin, Tempo, Prometheus, DataDog, Application Insights). Show complete OpenTelemetry setup for ASP.NET Core microservice. Cover baggage propagation for custom context.
```

#### 18.4 Structured Logging
```
Cover structured logging in distributed systems: JSON log format with consistent field names (timestamp, level, message, traceId, spanId, service, version) — enables correlation across services. Correlation: include trace ID in every log entry (ILogger with traceId in scope — HttpContext.TraceIdentifier or OpenTelemetry Activity.Current.TraceId). Show Serilog configuration for .NET: JSON output, Enrich.WithTraceIdentifier(), Enrich.WithSpanId(), outputTemplate with all fields. Log aggregation: ship to Elasticsearch (Logstash), Loki (Grafana stack), CloudWatch, Splunk. Cover log levels and when to use each (Debug for development, Information for business events, Warning for unexpected but recoverable, Error for operation failed, Critical for system failure). Cover that log volume at Information level in production can be expensive — use sampling or level adjustment per namespace.
```

#### 18.5 Metrics
```
Cover metrics in distributed systems: metric types (Counter — monotonically increasing: request count, error count; Gauge — current value: active connections, queue depth, memory usage; Histogram — distribution of values: request latency percentiles, payload sizes). RED method (Rate, Errors, Duration — key metrics for any service), USE method (Utilization, Saturation, Errors — for resource monitoring), Four Golden Signals (latency, traffic, errors, saturation — Google SRE). Prometheus format: counter, gauge, histogram, summary. .NET: System.Diagnostics.Metrics (Meter, Counter<T>, Histogram<T>, Gauge<T> — built-in, no NuGet), OpenTelemetry metrics exporter for Prometheus. Show custom .NET metrics: request processing time histogram, active WebSocket connections gauge, message processing counter. Show Prometheus scrape config for .NET app.
```

#### 18.6 Alerting
```
Cover alerting on distributed system failures: SLOs (Service Level Objectives — targets for reliability: 99.9% success rate, P99 < 500ms), SLIs (Service Level Indicators — measurements: actual success rate, actual P99), error budgets (how much unreliability you can afford: 99.9% = 8.7 hours/year allowed downtime). Alert types: symptom-based (alert on user impact — high error rate, high latency — actionable, fewer alerts), cause-based (alert on resource — high CPU, disk full — leading indicators, many alerts). Show Prometheus alerting rules (PrometheusRule in K8s, Alertmanager for routing to PagerDuty/Slack). Cover alert fatigue (too many alerts → ignored → useless) and alert quality (every alert must be actionable). .NET: Application Insights availability tests + alerts, CloudWatch alarms for Lambda/ECS.
```

#### 18.7 Correlation IDs
```
Show correlation ID implementation in ASP.NET Core microservices: generate unique correlation ID for each incoming request (if not already present in X-Correlation-ID header), propagate to all downstream calls (add X-Correlation-ID header to outgoing HttpClient requests via DelegatingHandler), include in all log entries (add to ILogger scope), include in trace context. Show implementation: middleware to read/generate X-Correlation-ID, ILogger scope with correlation ID, DelegatingHandler to propagate. Cover that OpenTelemetry's TraceID serves as correlation ID if using tracing — prefer TraceID over custom correlation ID (already propagated by OpenTelemetry instrumentations). Show correlation ID in structured logs → query all logs for a specific request across services in Elasticsearch/Loki.
```

#### 18.8 Chaos Engineering
```
Explain chaos engineering: intentionally inject failures into production (or production-like environments) to discover weaknesses before they cause incidents. Chaos experiments: network latency injection (50ms random delay between services), service failure (randomly kill one pod), resource exhaustion (inject CPU or memory pressure), network partition (block traffic between specific services). Principles: define steady state, hypothesize steady state will hold during experiment, inject chaos, observe, improve resilience. Tools: Chaos Monkey (Netflix, VMs), Chaos Mesh (K8s — network delay, pod kill, IO fault), Litmus Chaos (K8s), Azure Chaos Studio, AWS Fault Injection Simulator. .NET relevance: Netflix Simian Army inspired approach — kill random pods, inject network latency between .NET services. Show Chaos Mesh YAML for latency injection between .NET services. Cover game days (structured chaos experiments with team on standby).
```

---

### 19. Leader Election & Coordination

#### 19.1 Leader Election
```
Explain leader election: in a cluster of identical instances, choose one to be the "leader" for special responsibilities. Why needed: single scheduled job running (cron job must not run on all N instances simultaneously), master-slave coordination (one instance controls others), exclusive lock holder (only leader can write to shared resource), heartbeat sender (leader pings health endpoint). Requirements: only one leader at a time (safety), eventually someone is elected even after failures (liveness), leadership transfer on failure. Cover that leadership can be implicit (whoever holds a lock is leader) or explicit (consensus protocol elects leader and all nodes know who it is). .NET patterns: IHostedService checking leadership before executing, leadership token/lease approach.
```

#### 19.2 Bully Algorithm
```
Explain Bully Algorithm: simple leader election for synchronous networks. Process with highest ID that is alive becomes leader. When process P notices no leader: sends Election message to all processes with higher IDs, if no response → P becomes leader + sends Coordinator to all, if any higher-ID process responds → that process takes over election (bullies P out). Analysis: O(n²) messages, works for synchronous networks, doesn't handle network partitions well (split-brain if network partitions). Historical relevance: simple to understand, rarely used in production modern systems. Cover why more sophisticated algorithms (Raft, ZooKeeper ephemeral nodes) are preferred. Show as educational stepping stone to understanding why Raft was designed as it was.
```

#### 19.3 ZooKeeper
```
Cover ZooKeeper for distributed coordination: hierarchical namespace of znodes (like filesystem), types (persistent, ephemeral — deleted on client disconnect, sequential — auto-incrementing suffix), watches (notify on change — one-shot, re-register after each notification). Use cases: leader election (create ephemeral sequential node — lowest node is leader, watch predecessor), distributed locks (ephemeral node — client disconnects → lock released), configuration management (watch config znode — all services notified on change), service discovery (ephemeral znode per service instance — disappears on crash). Cover ZAB protocol (ZooKeeper Atomic Broadcast — similar to Paxos, provides total order broadcast). .NET: ZooKeeperNetEx NuGet. Cover that ZooKeeper is complex to operate — etcd often preferred for new deployments.
```

#### 19.4 etcd
```
Cover etcd for distributed coordination: strongly consistent key-value store (Raft-based), used as Kubernetes backbone. Features: watch (notify on key changes — similar to ZooKeeper watches), lease (TTL on keys — key deleted when lease expires and not renewed — used for leader election, service registration), transactions (compare-and-swap — CAS operations for atomic updates). Leader election with etcd: create key with lease TTL, renew lease periodically (keepalive), first to create wins, others watch and acquire on expiry. .NET: dotnet-etcd NuGet, etcd3api NuGet. Show leader election implementation: acquire lease → create election key → renew lease in background → resign by deleting key. Cover that Kubernetes uses etcd for all cluster state — etcd availability is critical for K8s cluster health.
```

#### 19.5 Leader Election in .NET
```
Show leader election implementations for .NET services: Redis-based (SET leadership_key instance_id NX PX 30000 — only set if not exists with 30s expiry, background task renews every 10s, on failure key expires and another instance wins), etcd-based (campaign API — purpose-built for election), Kubernetes leader election (k8s.io/client-go leader election via coordination.k8s.io/Lease resource — Kubernetes leader election NuGet for .NET, used by kube-controller-manager), Medallion.Threading for abstracted leader election. Show ASP.NET Core IHostedService that only runs when leader, passes CancellationToken to stop when leadership lost. Cover that leadership transitions should be quick (< 30s) — tune timeouts appropriately. Show monitoring: track leadership changes as metrics.
```

#### 19.6 Distributed Cron
```
Cover distributed scheduled task execution: preventing N instances of a service from all running the same cron job. Approaches: leader election (only leader runs all scheduled jobs — simple, but leader becomes bottleneck), distributed locking per job (acquire lock before running — lock expires after run — other instances skip if lock not acquired — each job independently distributed), external scheduler (Quartz.NET with clustering, Hangfire with Redis/SQL Server distributed mode — scheduler handles distribution), Kubernetes CronJob (K8s schedules one pod per cron execution — job pod runs to completion, natural distribution). Show Hangfire with SQL Server distributed mode (only one server processes job). Show Quartz.NET clustering with database (cluster members coordinate via DB). Cover .NET 8 TimeProvider abstraction for testable scheduled services.
```

---

### 20. Microservices Patterns

#### 20.1 Microservices vs Monolith
```
Compare monolith and microservices: Monolith (single deployable unit — simple deployment, easy debugging, in-process calls, ACID transactions, but: scales as a unit, slow deployment pipeline, technology locked, large blast radius for failures). Microservices (independently deployable services — independent scaling, independent deployment, technology diversity, fault isolation, but: network latency for cross-service calls, distributed transactions complexity, operational overhead, service discovery, eventual consistency). Cover that microservices are chosen for organizational and operational reasons, not just technical. Conway's Law: architecture mirrors communication structure — microservices work when teams mirror service boundaries. Cover that most organizations start with a modular monolith (logical separation without deployment separation) and extract services when needed.
```

#### 20.2 Strangler Fig Pattern
```
Explain Strangler Fig pattern (Martin Fowler): incrementally migrate from monolith to microservices by routing specific functionality to new services. Monolith remains running throughout migration — never big-bang rewrite. Pattern: identify feature to extract, build new microservice alongside monolith, route new requests to new service (via API gateway or proxy), monolith handles old requests, eventually all traffic on new service, old code removed. Steps: (1) intercept at edge (API gateway fronts monolith), (2) add new service handling new traffic, (3) gradually migrate old traffic, (4) retire monolith code. .NET migration: YARP or Ocelot as routing layer, route /api/payments/* to new PaymentService, rest to monolith. Cover that data migration is the hard part (DB is shared — extract service DB in parallel, sync temporarily, then cut over). 
```

#### 20.3 Anti-Corruption Layer
```
Explain Anti-Corruption Layer (DDD concept, Eric Evans): translation layer between your domain model and an external system's model. Prevents external system's concepts from polluting your domain. Use cases: integrating with legacy systems, consuming third-party APIs with different domain language, between two bounded contexts with different models. Implementation: adapter (wraps external API calls, translates responses to your model), facade (simplifies complex external interface), translator (maps external types to internal types). .NET: ACL as a separate class library (ExternalPaymentProvider → PaymentProvider through IPaymentGateway — your code only sees IPaymentGateway), ACL service that wraps external HTTP API. Cover that without ACL, external system changes break your domain model — ACL isolates the blast radius. Show how ACL enables switching external providers without changing domain logic.
```

#### 20.4 Shared Database Anti-Pattern
```
Explain shared database anti-pattern: multiple microservices using same database schema. Problems: tight coupling (services must coordinate schema changes), no independent deployment (DB schema change breaks all services), no polyglot persistence (forced to use one DB type), no independent scaling (can't scale DB for one service without affecting all), security issues (service A can accidentally write service B's tables). The "distributed monolith" — worst of both worlds. Correct pattern: each service owns its own database (separate schema, separate credentials, separate instance if needed), cross-service data access via API calls only. Cover that migrating from shared DB is hard but necessary — strategies: schema namespacing (service A owns tables prefixed A_), then separate schemas, then separate databases. Cover read replicas for cross-service reporting.
```

#### 20.5 Bounded Contexts & DDD
```
Cover Domain-Driven Design (DDD) bounded contexts for microservice boundaries: bounded context (explicit boundary within which a domain model applies — same word may mean different things in different contexts — Order in Sales context vs Order in Fulfillment context), ubiquitous language (team and code use same domain terms within a bounded context), context map (how bounded contexts relate — upstream/downstream, partnership, shared kernel, customer-supplier, conformist, anti-corruption layer). Microservice ≈ bounded context (one service per bounded context — not strictly required but good starting point). Event Storming (workshop technique — identify domain events, commands, aggregates, bounded contexts). .NET: separate projects per bounded context, shared kernel as NuGet package, anti-corruption layer projects for integration. Cover that getting boundaries right is harder than the technical implementation — invest in domain modeling.
```

#### 20.6 Data Consistency Across Services
```
Cover data consistency strategies across microservices: eventual consistency (acceptable for most data — order status visible within seconds, not milliseconds), Saga for transactional consistency (compensating transactions for multi-service operations), event-driven synchronization (service A publishes event, service B updates own read model — eventual consistent read model), API composition (combine data at query time via API calls — no data copying), CQRS read model built from events (service B projects service A events into own read model). Cover the fundamental rule: each service is the source of truth for its own data. Cover that trying to enforce strong consistency across services is the distributed monolith trap — design to embrace eventual consistency. Show patterns for different consistency requirements: high-consistency (reduce cross-service ops), lower-consistency (eventual + compensation).
```

#### 20.7 Versioning in Microservices
```
Cover API versioning and backward compatibility in microservices: API versioning strategies (URL versioning /v1/orders, header versioning Accept: application/vnd.myapi.v2+json — choose one, be consistent), consumer-driven contract testing (Pact.NET — consumer defines expected API contract, provider tests verify contract is met — prevents breaking changes), semantic versioning for service versions, API deprecation policy (maintain old version for N weeks after new version, deprecation header, sunset date). Message schema evolution (covered in messaging section — Protobuf/Avro for Kafka, versioned message types for RabbitMQ). Cover that breaking changes are sometimes necessary — provide migration path (parallel endpoints, migration guide, sunset timeline). Cover that internal service APIs can be more aggressive in evolution than external APIs. .NET: Asp.Versioning NuGet for REST API versioning, Pact.Net for contract testing.
```

#### 20.8 .NET Aspire
```
Cover .NET Aspire: opinionated cloud-ready stack for building distributed .NET applications. AppHost project (orchestrates components — database, cache, service bus, microservices — defines resources and their connections), Service Defaults (pre-configured health checks, OpenTelemetry, service discovery, resilience — added to each service as project reference), Dashboard (local development dashboard — service graph, logs, traces, metrics — replaces multiple tools), Components (pre-built integrations — AddRedis, AddPostgres, AddRabbitMQ, AddKafka — connection strings injected automatically). Show AppHost: AddProject<Projects.OrderService>("orders").WithReference(postgres).WithReference(redis). Cover that Aspire addresses the local development complexity of microservices (previously: multiple docker-compose files, manual service discovery). Cover deployment: Aspire manifest → K8s YAML, Azure Container Apps, or custom. Show complete Aspire AppHost for a .NET microservices application.
```

---

## Quick Reference: Distributed Systems Trade-offs

| Decision | Option A | Option B | Choose A When | Choose B When |
|---|---|---|---|---|
| Consistency vs Availability | CP (reject during partition) | AP (serve stale during partition) | Financial data, coordination | High availability, ok with stale |
| Sync vs Async communication | Synchronous REST/gRPC | Async messaging | Immediate response needed | Decoupling, resilience important |
| Strong vs Eventual consistency | Linearizable | Eventual | Counters, locks, elections | Social feed, analytics |
| 2PC vs Saga | 2PC (blocking) | Saga (eventual) | Small cluster, short txns | Microservices, long operations |
| Replication: Leader vs Leaderless | Leader-follower | Leaderless (Dynamo) | Simpler ops, SQL DBs | High availability, geo-distribution |
| Partitioning: Range vs Hash | Range | Hash | Range queries | Even write distribution |
| Service mesh vs Polly | Service mesh | Polly in app | Many services, need mTLS | Few services, simpler setup |
| Log vs State storage | Event sourcing | State (CRUD) | Audit trail, event replay needed | Simple CRUD, team unfamiliar with ES |

---

## Quick Reference: Pattern → .NET Library

| Pattern | .NET Library / Approach |
|---|---|
| Saga orchestration | MassTransit SagaStateMachine, NServiceBus, Wolverine |
| Outbox pattern | MassTransit Outbox, Wolverine Outbox |
| Message broker | MassTransit (abstracts RabbitMQ/Kafka/SQS/Azure) |
| Kafka streaming | Confluent.Kafka, MassTransit Kafka |
| Distributed lock | Medallion.Threading (Redis/PostgreSQL/SQL Server) |
| Circuit breaker | Polly v8, Microsoft.Extensions.Http.Resilience |
| Retry with backoff | Polly v8 RetryStrategyOptions |
| Service discovery | .NET Aspire, Consul NuGet, K8s DNS |
| API gateway | YARP, Ocelot |
| Leader election | Medallion.Threading, etcd3api, K8s leader election |
| Event sourcing | Marten (PostgreSQL), EventStoreDB client |
| CQRS | MediatR (command/query routing) |
| Distributed tracing | OpenTelemetry .NET |
| Health checks | ASP.NET Core HealthChecks |
| gRPC | Grpc.AspNetCore, Grpc.Net.Client |
| Structured logging | Serilog, NLog, Microsoft.Extensions.Logging |
| Scheduled tasks | Hangfire, Quartz.NET |

---

*Version 1.0 — .NET 8 / .NET Aspire 8*