# Design Patterns & Architecture for .NET Developers
## Compact Learning Guide with Prompts

> Each section has a prompt. Paste it to generate full content. Compact format — concept + .NET angle.

---

## Table of Contents

1. [Design Pattern Foundations](#1-foundations)
   - 1.1 [What Design Patterns Are — And Aren't](#11-what-patterns-are)
   - 1.2 [GoF Pattern Categories — Creational, Structural, Behavioral](#12-gof-categories)
   - 1.3 [Pattern vs Principle vs Practice](#13-pattern-vs-principle)
   - 1.4 [When NOT to Use Patterns — Over-Engineering](#14-when-not-to-use)
   - 1.5 [Patterns in the .NET BCL — Recognizing Them in the Wild](#15-patterns-in-bcl)

2. [SOLID Principles](#2-solid)
   - 2.1 [Single Responsibility Principle](#21-srp)
   - 2.2 [Open/Closed Principle](#22-ocp)
   - 2.3 [Liskov Substitution Principle](#23-lsp)
   - 2.4 [Interface Segregation Principle](#24-isp)
   - 2.5 [Dependency Inversion Principle](#25-dip)
   - 2.6 [SOLID in Practice — Common Violations & Fixes in .NET](#26-solid-net)

3. [Creational Patterns](#3-creational)
   - 3.1 [Singleton — One Instance, Global Access](#31-singleton)
   - 3.2 [Factory Method — Subclasses Decide Instantiation](#32-factory-method)
   - 3.3 [Abstract Factory — Families of Related Objects](#33-abstract-factory)
   - 3.4 [Builder — Step-by-Step Complex Object Construction](#34-builder)
   - 3.5 [Prototype — Clone Rather Than New](#35-prototype)
   - 3.6 [Object Pool — Reuse Expensive Objects](#36-object-pool)
   - 3.7 [Dependency Injection — The Modern Creational Pattern](#37-dependency-injection)

4. [Structural Patterns](#4-structural)
   - 4.1 [Adapter — Bridge Incompatible Interfaces](#41-adapter)
   - 4.2 [Bridge — Decouple Abstraction from Implementation](#42-bridge)
   - 4.3 [Composite — Tree Structures, Uniform Treatment](#43-composite)
   - 4.4 [Decorator — Add Responsibilities Dynamically](#44-decorator)
   - 4.5 [Facade — Simplified Interface to Complex Subsystem](#45-facade)
   - 4.6 [Flyweight — Share Common State, Reduce Memory](#46-flyweight)
   - 4.7 [Proxy — Surrogate with Extra Behavior](#47-proxy)

5. [Behavioral Patterns](#5-behavioral)
   - 5.1 [Chain of Responsibility — Pass Request Along a Chain](#51-chain-of-responsibility)
   - 5.2 [Command — Encapsulate Request as Object](#52-command)
   - 5.3 [Iterator — Sequential Access Without Exposing Internals](#53-iterator)
   - 5.4 [Mediator — Centralize Communication](#54-mediator)
   - 5.5 [Memento — Capture and Restore State](#55-memento)
   - 5.6 [Observer — Notify Dependents of State Change](#56-observer)
   - 5.7 [State — Behavior Changes with State](#57-state)
   - 5.8 [Strategy — Interchangeable Algorithms](#58-strategy)
   - 5.9 [Template Method — Define Skeleton, Subclasses Fill In](#59-template-method)
   - 5.10 [Visitor — Add Operations Without Changing Classes](#510-visitor)
   - 5.11 [Interpreter — Grammar for a Language](#511-interpreter)

6. [Concurrency Patterns](#6-concurrency-patterns)
   - 6.1 [Active Object — Async Method Invocation](#61-active-object)
   - 6.2 [Monitor Object — Synchronized Method Access](#62-monitor-object)
   - 6.3 [Half-Sync/Half-Async](#63-half-sync-half-async)
   - 6.4 [Thread Pool Pattern](#64-thread-pool-pattern)
   - 6.5 [Producer-Consumer Pattern](#65-producer-consumer)
   - 6.6 [Read-Write Lock Pattern](#66-read-write-lock-pattern)
   - 6.7 [Scheduler Pattern](#67-scheduler-pattern)

7. [Dependency Injection & IoC](#7-di-ioc)
   - 7.1 [Inversion of Control — The Principle](#71-ioc)
   - 7.2 [Dependency Injection — Constructor, Property, Method](#72-di-types)
   - 7.3 [Service Lifetimes — Singleton, Scoped, Transient](#73-lifetimes)
   - 7.4 [Service Registration Patterns in .NET](#74-registration-patterns)
   - 7.5 [Factory Registration & Conditional Resolution](#75-factory-conditional)
   - 7.6 [Decorator Pattern via DI](#76-decorator-di)
   - 7.7 [Keyed Services (.NET 8+)](#77-keyed-services)
   - 7.8 [Testing with DI — Mocking & Fakes](#78-testing-di)
   - 7.9 [Anti-Patterns — Service Locator, Captive Dependency](#79-di-anti-patterns)

8. [Domain-Driven Design (DDD)](#8-ddd)
   - 8.1 [DDD Core Concepts — Ubiquitous Language, Bounded Context](#81-ddd-core)
   - 8.2 [Entities — Identity Over Time](#82-entities)
   - 8.3 [Value Objects — Equality by Value](#83-value-objects)
   - 8.4 [Aggregates — Consistency Boundaries](#84-aggregates)
   - 8.5 [Domain Events — Side Effects in the Domain](#85-domain-events)
   - 8.6 [Repositories — Collection-Like Persistence](#86-repositories)
   - 8.7 [Domain Services — Logic That Doesn't Belong to Entities](#87-domain-services)
   - 8.8 [Application Services — Orchestrating Use Cases](#88-application-services)
   - 8.9 [Specifications Pattern](#89-specifications)
   - 8.10 [DDD with EF Core — Mapping the Domain Model](#810-ddd-ef-core)

9. [Clean Architecture](#9-clean-architecture)
   - 9.1 [Clean Architecture — Layers & Dependency Rule](#91-clean-architecture)
   - 9.2 [Domain Layer — Pure Business Logic](#92-domain-layer)
   - 9.3 [Application Layer — Use Cases & Ports](#93-application-layer)
   - 9.4 [Infrastructure Layer — Adapters & Persistence](#94-infrastructure-layer)
   - 9.5 [Presentation Layer — Controllers, Minimal APIs, gRPC](#95-presentation-layer)
   - 9.6 [Cross-Cutting Concerns — Logging, Validation, Auth](#96-cross-cutting)
   - 9.7 [Clean Architecture in .NET — Project Structure](#97-clean-architecture-net)
   - 9.8 [Testing in Clean Architecture](#98-testing-clean-arch)

10. [Hexagonal Architecture (Ports & Adapters)](#10-hexagonal)
    - 10.1 [Hexagonal Architecture — Core Idea](#101-hexagonal-core)
    - 10.2 [Ports — Defining the Application Boundary](#102-ports)
    - 10.3 [Adapters — Primary (Driving) & Secondary (Driven)](#103-adapters)
    - 10.4 [Hexagonal vs Clean Architecture — Relationship](#104-hexagonal-vs-clean)
    - 10.5 [Hexagonal in .NET — Practical Structure](#105-hexagonal-net)

11. [CQRS & MediatR](#11-cqrs-mediatr)
    - 11.1 [CQRS — Commands vs Queries](#111-cqrs-commands-queries)
    - 11.2 [MediatR — In-Process Mediator](#112-mediatr)
    - 11.3 [Commands, Queries, and Notifications in MediatR](#113-mediatr-commands-queries)
    - 11.4 [MediatR Pipeline Behaviors — Cross-Cutting Concerns](#114-pipeline-behaviors)
    - 11.5 [Validation with FluentValidation + MediatR](#115-validation-mediatr)
    - 11.6 [CQRS Without MediatR — When to Skip It](#116-cqrs-without-mediatr)

12. [Repository & Unit of Work](#12-repository-uow)
    - 12.1 [Repository Pattern — Abstracting Data Access](#121-repository)
    - 12.2 [Generic vs Specific Repositories](#122-generic-specific)
    - 12.3 [Unit of Work — Coordinating Multiple Repositories](#123-unit-of-work)
    - 12.4 [Repository + EF Core — Is It Worth It?](#124-repository-ef-core)
    - 12.5 [Specification Pattern with Repositories](#125-specification-repository)

13. [Event-Driven Patterns](#13-event-driven)
    - 13.1 [Domain Events — In-Process Events](#131-domain-events-inprocess)
    - 13.2 [Integration Events — Cross-Service Events](#132-integration-events)
    - 13.3 [Event Dispatcher Pattern in .NET](#133-event-dispatcher)
    - 13.4 [Transactional Outbox — Reliable Event Publishing](#134-transactional-outbox)
    - 13.5 [Event Aggregator Pattern](#135-event-aggregator)
    - 13.6 [Publish-Subscribe in .NET — MediatR Notifications, MassTransit](#136-pubsub-net)

14. [Functional Patterns in C#](#14-functional-patterns)
    - 14.1 [Immutability — Records and Init-Only Properties](#141-immutability)
    - 14.2 [Option / Maybe — Avoiding Null](#142-option-maybe)
    - 14.3 [Result Pattern — Explicit Error Handling](#143-result-pattern)
    - 14.4 [Railway-Oriented Programming](#144-railway-oriented)
    - 14.5 [Monads in C# — Practical Applications](#145-monads-csharp)
    - 14.6 [Functional Pipelines — LINQ as a Pipeline](#146-functional-pipelines)
    - 14.7 [Pure Functions & Side Effect Isolation](#147-pure-functions)

15. [Enterprise Integration Patterns (EIP)](#15-eip)
    - 15.1 [Message Channel — Point-to-Point & Pub/Sub](#151-message-channel)
    - 15.2 [Message Router — Content-Based Routing](#152-message-router)
    - 15.3 [Message Translator — Data Format Conversion](#153-message-translator)
    - 15.4 [Aggregator — Collecting Related Messages](#154-aggregator)
    - 15.5 [Splitter — One Message to Many](#155-splitter)
    - 15.6 [Scatter-Gather — Fan-Out & Merge](#156-scatter-gather)
    - 15.7 [Process Manager / Saga](#157-process-manager)
    - 15.8 [Competing Consumers](#158-competing-consumers)
    - 15.9 [EIP in .NET — MassTransit, Rebus](#159-eip-net)

16. [Architectural Patterns](#16-architectural-patterns)
    - 16.1 [Layered Architecture — N-Tier](#161-layered-architecture)
    - 16.2 [Microkernel Architecture — Plugin Systems](#162-microkernel)
    - 16.3 [Pipe and Filter Architecture](#163-pipe-filter)
    - 16.4 [Event-Driven Architecture — Event Bus, Event Mesh](#164-event-driven-arch)
    - 16.5 [Space-Based Architecture — Tuple Spaces](#165-space-based)
    - 16.6 [Serverless Architecture Patterns](#166-serverless)
    - 16.7 [Modular Monolith — The Middle Ground](#167-modular-monolith)

17. [API Design Patterns](#17-api-design)
    - 17.1 [RESTful Resource Design](#171-restful-design)
    - 17.2 [Request-Response vs Fire-and-Forget](#172-request-response)
    - 17.3 [Long-Running Operations — Async API Pattern](#173-async-api)
    - 17.4 [Idempotency Keys — Safe Retries](#174-idempotency-keys)
    - 17.5 [Pagination Patterns — Offset vs Cursor](#175-pagination-patterns)
    - 17.6 [Versioning Strategies — URL, Header, Media Type](#176-api-versioning)
    - 17.7 [Hypermedia — HATEOAS in Practice](#177-hateoas)
    - 17.8 [Problem Details — RFC 7807](#178-problem-details)

18. [Testing Patterns](#18-testing-patterns)
    - 18.1 [Test Pyramid — Unit, Integration, E2E](#181-test-pyramid)
    - 18.2 [AAA Pattern — Arrange, Act, Assert](#182-aaa-pattern)
    - 18.3 [Test Doubles — Mocks, Stubs, Fakes, Spies](#183-test-doubles)
    - 18.4 [Builder Pattern for Test Data](#184-test-data-builder)
    - 18.5 [Object Mother Pattern](#185-object-mother)
    - 18.6 [Test Fixture Patterns](#186-test-fixtures)
    - 18.7 [Property-Based Testing — FsCheck](#187-property-based)
    - 18.8 [Architecture Testing — NetArchTest](#188-architecture-testing)
    - 18.9 [Mutation Testing — Stryker.NET](#189-mutation-testing)
    - 18.10 [Consumer-Driven Contract Testing — Pact.NET](#1810-contract-testing)

19. [Performance Patterns](#19-performance-patterns)
    - 19.1 [Cache-Aside Pattern](#191-cache-aside)
    - 19.2 [Read-Through & Write-Through Cache](#192-read-write-through)
    - 19.3 [Write-Behind (Write-Back) Cache](#193-write-behind)
    - 19.4 [Lazy Loading vs Eager Loading](#194-lazy-vs-eager)
    - 19.5 [Throttling Pattern — Controlling Resource Use](#195-throttling)
    - 19.6 [Competing Consumers — Scale Out Processing](#196-competing-consumers-perf)
    - 19.7 [Static Content Hosting & CDN Pattern](#197-cdn-pattern)
    - 19.8 [Data Locality — Keep Compute Near Data](#198-data-locality)

20. [Refactoring Patterns & Code Smells](#20-refactoring)
    - 20.1 [Code Smells Taxonomy](#201-code-smells)
    - 20.2 [Extract Method & Extract Class](#202-extract)
    - 20.3 [Replace Conditional with Polymorphism](#203-replace-conditional)
    - 20.4 [Introduce Parameter Object](#204-parameter-object)
    - 20.5 [Replace Primitive with Value Object](#205-primitive-to-value-object)
    - 20.6 [Strangler Fig for Code — Incremental Replacement](#206-strangler-code)
    - 20.7 [Feature Flags — Safe Deployment Patterns](#207-feature-flags)

---

## Section Prompts

### 1. Foundations

#### 1.1 What Patterns Are
```
Explain what design patterns are: reusable solutions to recurring design problems, not code to copy but templates for thinking. Origins: GoF book (1994) — 23 patterns. Distinguish: pattern (solution template — Strategy pattern), idiom (.NET-specific convention — using statement for IDisposable), principle (SOLID — general guideline), architecture (Clean Architecture — structural approach). Cover that patterns have trade-offs — they add indirection and complexity. Explain pattern vocabulary: Context (when pattern applies), Problem (what problem it solves), Solution (structure of the solution), Consequences (trade-offs). Show how recognizing patterns in code aids comprehension. Cover that design patterns are a communication tool — saying "use Strategy here" communicates a complete design to other developers.
```

#### 1.2 GoF Categories
```
Explain the three GoF pattern categories: Creational (object creation — hide instantiation complexity: Singleton, Factory Method, Abstract Factory, Builder, Prototype), Structural (composing objects/classes — larger structures from parts: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy), Behavioral (algorithms and responsibility assignment — communication between objects: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor, Interpreter). For each category give one sentence on what problems it solves. Show that most patterns solve the problem of managing change — which parts change independently, which stay stable. Cover the additional "concurrency patterns" category added post-GoF.
```

#### 1.3 Pattern vs Principle vs Practice
```
Distinguish pattern (solution to recurring problem — Observer, Strategy, Repository), principle (guideline for design decisions — SOLID, DRY, YAGNI, KISS), practice (concrete technique — TDD, code review, pair programming), and architecture (high-level structural choice — Clean Architecture, microservices, event sourcing). Show how they relate: principles guide decisions, patterns implement principles, practices apply patterns, architecture organizes patterns. Cover DRY (Don't Repeat Yourself — duplication is about knowledge, not code), YAGNI (You Aren't Gonna Need It — don't add speculative features), KISS (Keep It Simple, Stupid — prefer simpler solutions). Show how YAGNI prevents premature pattern application. Show how DRY motivates Strategy and Template Method.
```

#### 1.4 When NOT to Use Patterns
```
Cover over-engineering with patterns: applying patterns to simple problems adds complexity without benefit. Anti-patterns: FactoryFactory (factory that creates factories — rarely needed), AbstractionLayerAbstractionLayer (abstractions of abstractions — indirection without value), PatternOrgy (every class is a pattern — imposes ceremony on simple logic). Signs of over-engineering: more infrastructure code than business logic, simple feature requires touching 10 files, can't explain what a class does in one sentence. Cover YAGNI: don't add Strategy pattern for one algorithm variant, don't add Abstract Factory when only one product family exists. .NET specific: don't wrap DbContext in Repository+UoW if EF Core is your only persistence — DbContext IS the repository and unit of work. Apply patterns to solve real problems, not to demonstrate knowledge.
```

#### 1.5 Patterns in the .NET BCL
```
Identify design patterns in the .NET Base Class Library: Iterator (IEnumerable<T> + foreach — Iterator pattern), Observer (events + EventHandler, IObservable<T>/IObserver<T> — Observer pattern), Strategy (Comparison<T> delegate, IComparer<T> — Strategy pattern), Decorator (Stream → CryptoStream → BufferedStream → FileStream stacked — Decorator pattern), Facade (File.ReadAllText — Facade over FileStream complexity), Factory Method (DbProviderFactory — Factory Method), Builder (StringBuilder, UriBuilder, WebHostBuilder — Builder pattern), Template Method (abstract base classes with virtual methods — Template Method), Composite (IEnumerable<IEnumerable<T>> — Composite), Chain of Responsibility (ASP.NET Core middleware pipeline). Show each with code example. This makes patterns concrete and relatable.
```

---

### 2. SOLID

#### 2.1 SRP
```
Explain Single Responsibility Principle: a class should have only one reason to change — one job, one actor that owns it. "One reason to change" is better framing than "does one thing" (ambiguous). Cover classic violations: God class (handles persistence, business logic, formatting, validation all in one), mixing infrastructure and domain concerns (service that fetches from DB, applies business rules, sends email, logs — 4 reasons to change). Show refactoring: extract EmailSender, OrderValidator, OrderRepository from OrderService. Cover that SRP is about cohesion — things that change together stay together, things that change independently separate. .NET example: splitting a fat Controller into Controller (HTTP concerns) + Service (business logic) + Repository (data access).
```

#### 2.2 OCP
```
Explain Open/Closed Principle: software entities should be open for extension, closed for modification. Adding new behavior should not require changing existing code — extend via new classes, not modification. Cover classic violation: switch on type or enum that grows with each new case (every new payment type requires modifying PaymentProcessor switch — fragile). Fix with Strategy pattern: IPaymentStrategy implemented by CreditCardStrategy, PayPalStrategy, CryptoStrategy — new payment type = new class, no modification to PaymentProcessor. Cover that OCP is achieved via: polymorphism (Strategy, Template Method), composition (add new Decorators), configuration (behavior via parameters). .NET: ASP.NET Core middleware pipeline (add middleware without modifying existing). Cover that OCP is aspirational — some modification is always needed, minimize it.
```

#### 2.3 LSP
```
Explain Liskov Substitution Principle: subtypes must be substitutable for their base types without altering correctness. If S is a subtype of T, objects of type S must behave correctly wherever T is expected. Classic violation: Rectangle → Square (Square constrains setWidth to also set Height — violates Rectangle contract that Width and Height are independent). Cover precondition strengthening (subtype can't require more than base — IEnumerable<T>.Count() doesn't require random access), postcondition weakening (subtype must deliver at least what base promised), invariant violation (subtype violates base class invariants). .NET: ReadOnlyCollection<T> correctly substitutes ICollection<T> (throws on write — this is expected and documented). Cover that LSP violations are often symptoms of wrong inheritance hierarchy — prefer composition.
```

#### 2.4 ISP
```
Explain Interface Segregation Principle: clients should not be forced to depend on methods they don't use. Fat interfaces force implementors to stub unused methods. Classic violation: IAnimal with Eat(), Sleep(), Fly(), Swim() — Dog must implement Fly() returning NotImplementedException. Fix: split into ICanFly, ICanSwim, ICanEat — Dog implements ICanEat and ICanSwim. Cover that ISP applies to both interface definitions and to client dependencies (don't inject IOrderService with 20 methods when you only use GetById()). .NET: IQueryable<T> vs IEnumerable<T> — ISP in BCL. Cover role interfaces (small, focused interfaces for specific roles). Cover that ISP reduces test coupling (test only depends on methods under test, not unrelated methods). Show IRepository<T> vs IReadRepository<T> + IWriteRepository<T> for ISP.
```

#### 2.5 DIP
```
Explain Dependency Inversion Principle: high-level modules should not depend on low-level modules — both should depend on abstractions. Abstractions should not depend on details — details should depend on abstractions. Classic violation: OrderService directly instantiates SqlOrderRepository — high-level depends on low-level, can't swap storage, can't unit test. Fix: IOrderRepository interface, OrderService depends on interface, SqlOrderRepository implements interface — dependency injected. Cover "inversion" — traditionally high-level calls low-level, DIP inverts this — both depend on abstraction, direction of dependency inverted. DIP enables: testing (inject mock), extensibility (swap implementation), DI frameworks. .NET: ASP.NET Core DI is built entirely on DIP. Cover that DIP ≠ DI (DIP is principle, DI is one mechanism to implement it — service locator is another, though anti-pattern).
```

#### 2.6 SOLID in Practice
```
Show common SOLID violations in .NET and fixes: SRP violation (fat service class touching DB, sending email, logging — extract classes), OCP violation (if/else chain growing per new case — Strategy or Policy pattern), LSP violation (NotImplementedException in subclass — wrong inheritance, use composition), ISP violation (injecting entire IOrderService for one method — inject specific interface or delegate), DIP violation (new keyword for dependencies in business logic — inject via constructor). Show the refactoring for each. Cover that SOLID is a means to an end (maintainability, testability) not a goal itself. Cover that strict SOLID can over-engineer simple code. Show real ASP.NET Core codebase before and after applying SOLID principles. Cover that SOLID works best at medium complexity — trivial apps don't need it, complex apps need it desperately.
```

---

### 3. Creational Patterns

#### 3.1 Singleton
```
Explain Singleton pattern: ensure one instance, provide global access. Implementation options: lazy initialization with double-checked locking (volatile + lock), Lazy<T> (simplest thread-safe in .NET — preferred), static readonly field (eager initialization — simple, safe). Problems with Singleton: global state (makes testing hard — can't isolate), tight coupling (callers depend on concrete Singleton), hidden dependencies (callers don't declare their dependency), concurrency issues (shared mutable state). Show the Singleton anti-pattern vs Singleton via DI (register as AddSingleton<T> in .NET DI — same single instance per container, but injectable, testable, mockable). Cover that DI Singleton is almost always better than GoF Singleton. Cover when true Singleton makes sense: thread-safe caches, configuration objects, loggers. Show Lazy<T> implementation.
```

#### 3.2 Factory Method
```
Explain Factory Method: define interface for creating objects, let subclasses decide which class to instantiate. Defer instantiation to subclasses. Structure: Creator class with abstract FactoryMethod(), ConcreteCreator overrides FactoryMethod() to return ConcreteProduct. .NET examples: ILoggerFactory.CreateLogger<T>(), DbProviderFactory.CreateConnection(), Stream-derived factories. Distinguish from Simple Factory (not a GoF pattern — static method that creates objects — less flexible but simpler). Cover when to use: when base class can't anticipate which class to instantiate, when subclasses should control instantiation, when you need to encapsulate creation logic. Show a .NET Notification system: INotificationCreator with CreateNotification() → EmailNotificationCreator, SmsNotificationCreator, PushNotificationCreator — client code uses creator interface, unaware of concrete type.
```

#### 3.3 Abstract Factory
```
Explain Abstract Factory: create families of related objects without specifying concrete classes. Guarantees products from same family work together. Structure: AbstractFactory interface with multiple CreateX() methods, ConcreteFactory implements all create methods for one product family, client uses only AbstractFactory interface. Classic example: UI widget factory (IWidgetFactory with CreateButton(), CreateCheckbox(), CreateDialog() → WindowsWidgetFactory, MacWidgetFactory, LinuxWidgetFactory — client creates widgets without knowing OS). .NET example: database abstraction (IDbFactory with CreateConnection(), CreateCommand(), CreateParameter() → SqlServerDbFactory, PostgresDbFactory). Compare to Factory Method: Abstract Factory creates families, Factory Method creates one product type. Cover that Abstract Factory can be complex — use when product families must be consistent.
```

#### 3.4 Builder
```
Explain Builder pattern: construct complex objects step by step, same construction process can produce different representations. Structure: Builder interface (BuildPartA, BuildPartB, GetResult), ConcreteBuilder, Director (orchestrates building), Product. .NET examples: StringBuilder (AddChar/Append methods, ToString for product), UriBuilder, WebHostBuilder, HttpClient builder in DI. Cover Fluent Builder variant (method chaining — builder.WithName("x").WithAge(25).Build() — popular in .NET — no Director needed, builder IS the director). Cover when to use: constructing complex objects with many optional parts, same construction steps produce different results, telescoping constructors (many constructor overloads). Show a .NET Email message builder: IEmailBuilder.To().From().Subject().Body().WithAttachment().Build(). Cover that Builder is also used for test data creation (Test Data Builder pattern).
```

#### 3.5 Prototype
```
Explain Prototype pattern: create new objects by cloning existing ones. Useful when object creation is expensive or complex. Types: shallow clone (copy top-level object, share references to nested objects), deep clone (recursively copy all nested objects — expensive but independent). .NET: ICloneable interface (shallow clone by convention — poorly designed interface, avoid), MemberwiseClone() (protected shallow clone in Object), custom deep clone (serialization-based: JsonSerializer.Deserialize(JsonSerializer.Serialize(obj))), record with keyword (non-destructive mutation — prototype-like). Cover prototype registry (cache of pre-built prototypes — clone from registry, customize). .NET record: var updated = original with { Name = "New Name" } — creates copy with changed property (shallow). Cover when to use: expensive initialization (DB query, network fetch — clone result), many similar objects with slight variations.
```

#### 3.6 Object Pool
```
Explain Object Pool pattern: reuse expensive-to-create objects instead of creating and destroying them. Pool maintains collection of ready-to-use objects, client checks out object, uses it, returns to pool. Use cases: database connections (ADO.NET connection pool), thread pool, byte buffers (ArrayPool<T>). .NET: ArrayPool<T>.Shared (rent/return byte arrays — eliminates allocation), ObjectPool<T> (Microsoft.Extensions.ObjectPool — configurable pool with policy for create and return), MemoryPool<T> (IMemoryOwner pattern). Show ObjectPool<T> usage: inject IObjectPool<T>, pool.Get() / pool.Return(). Cover pool sizing (too small = wait, too large = wasted memory), object reset on return (must reset state before returning), leaking objects (not returning to pool — causes pool exhaustion). Cover that ArrayPool is one of the most impactful performance improvements in .NET hot paths.
```

#### 3.7 Dependency Injection
```
Explain DI as the modern creational pattern: instead of objects creating their dependencies (tight coupling), dependencies injected from outside (loose coupling). Types: constructor injection (dependencies in constructor — most common, makes dependencies explicit, required dependencies), property injection (set after construction — optional dependencies, harder to test), method injection (dependency per method call — varies per call). .NET DI container (IServiceCollection, IServiceProvider): AddSingleton/AddScoped/AddTransient, BuildServiceProvider, automatic resolution of constructor parameters. Cover constructor injection as default for mandatory dependencies, property injection for optional. Cover DI vs service locator (anti-pattern — hides dependencies, call IServiceProvider.GetService() inside classes = service locator). Integrate with factory, strategy patterns. Show complete DI setup for ASP.NET Core.
```

---

### 4. Structural Patterns

#### 4.1 Adapter
```
Explain Adapter pattern: convert interface of a class into another interface clients expect. Makes incompatible interfaces work together. Types: object adapter (holds adaptee reference — composition — more flexible), class adapter (multiple inheritance — not possible in C# except with interfaces). .NET examples: DataAdapter (ADO.NET — adapts DataReader to DataSet), IEnumerable<T> → IQueryable<T> adapters (AsQueryable()), legacy code integration (wrap old API behind new interface). Show .NET example: adapt ILogger to a third-party logging interface, adapt payment gateway API to IPaymentProcessor interface. Cover two-way adapter (adapts in both directions — rare). Distinguish from Facade (Facade simplifies interface, Adapter makes incompatible interfaces compatible). Cover that Adapter is the anti-corruption layer pattern in DDD when applied to infrastructure.
```

#### 4.2 Bridge
```
Explain Bridge pattern: decouple abstraction from implementation — both can vary independently. Abstraction holds reference to Implementor. Structure: Abstraction → RefinedAbstraction, Implementor → ConcreteImplementorA/B. Classic example: Shape × Renderer — Shape (abstraction) has Renderer (implementor) — Circle+Vector, Circle+Raster, Square+Vector, Square+Raster without 4 subclasses (2+2 via Bridge). .NET relevance: TextWriter → StringWriter, StreamWriter (Bridge — abstraction is TextWriter, implementations are different backing stores), ILogger + ILoggerProvider (abstraction is ILogger, implementations are different providers). Cover when to use: want to avoid permanent binding between abstraction and implementation, both abstraction and implementation should be extensible via subclassing, implementation details hidden from client. Show database driver abstraction: IDbCommand abstraction, SqlCommand/NpgsqlCommand implementations.
```

#### 4.3 Composite
```
Explain Composite pattern: compose objects into tree structures, treat individual objects and compositions uniformly. Component interface implemented by both Leaf and Composite. Composite holds collection of Components. Classic example: file system (File and Directory both implement IFileSystemNode — Directory contains Files and Directories — operations like GetSize() work uniformly). .NET examples: Expression trees (Expression class hierarchy — BinaryExpression contains two Expression children, ConstantExpression is leaf), UI component trees (WPF Visual hierarchy), XML/HTML DOM. Show menu system: IMenuItem → MenuItem (leaf), MenuGroup (composite with List<IMenuItem>). Cover that Composite works best when tree structure is fundamental to the domain. Cover transparency vs safety trade-off (Component has Add/Remove = transparent but nonsensical on Leaf vs Component without = safe but requires casting).
```

#### 4.4 Decorator
```
Explain Decorator pattern: attach additional responsibilities to object dynamically. Alternative to subclassing. Decorator wraps component, adds behavior before/after delegation. .NET examples: Stream hierarchy (FileStream → BufferedStream → CryptoStream — each adds buffering or encryption without modifying FileStream), ILogger decorators (add correlation ID, add timing), DelegatingHandler in HttpClient (wrap inner handler with auth, retry, logging). Show creating a decorator: IOrderRepository → CachingOrderRepository (wraps SqlOrderRepository, adds cache). Distinguish from Inheritance (inheritance = static at compile time, Decorator = dynamic at runtime, multiple decorators can be stacked). Cover that DI can compose decorators automatically (Scrutor NuGet for .NET DI decorator registration). Show stacking decorators: LoggingOrderRepository(CachingOrderRepository(SqlOrderRepository)).
```

#### 4.5 Facade
```
Explain Facade pattern: provide simplified interface to complex subsystem. Facade knows which subsystem classes to call and in what order — client doesn't need to know. .NET examples: File.ReadAllText() (Facade over FileStream, StreamReader, encoding, disposal), HttpClient (Facade over socket management, connection pooling, HTTP protocol), ASP.NET Core minimal API helpers. Cover that Facade doesn't prevent access to subsystem (clients can bypass Facade for advanced use), Facade just simplifies common use cases. Facade vs Adapter: Facade simplifies, Adapter converts. Facade vs Mediator: Facade is one-directional (subsystem unaware of Facade), Mediator is two-way (colleagues know mediator). Show building a Facade for a payment processing workflow: PaymentFacade.ProcessPayment() wraps ValidateCard + ChargeCard + CreateReceipt + SendConfirmation.
```

#### 4.6 Flyweight
```
Explain Flyweight pattern: use sharing to efficiently support large numbers of fine-grained objects. Split state into intrinsic (shared, stored in flyweight) and extrinsic (context-specific, passed in by client). Factory manages flyweight pool. .NET examples: string interning (string pool — same string literal → same object), char objects in text editors (character glyph shared, position is extrinsic). Show a game example: TreeType flyweight (name, color, texture — shared) + Tree (x, y position — extrinsic, not shared) — millions of trees, few TreeType objects. Cover when to use: app uses huge number of similar objects, storage costs are high, most object state can be made extrinsic. .NET: intern strings manually for high-frequency repeated strings (string.Intern()), use struct for small value types to avoid heap allocation (natural flyweight via stack allocation), FrozenDictionary for immutable lookup tables.
```

#### 4.7 Proxy
```
Explain Proxy pattern: surrogate that controls access to another object. Same interface as subject, intercepts calls. Proxy types: Virtual Proxy (lazy initialization — create expensive object only when needed), Remote Proxy (local representation of remote object — gRPC generated client is a proxy), Protection Proxy (access control — check permissions before delegating), Caching Proxy (cache results of expensive operations), Smart Reference (add behavior on access — reference counting, audit logging). .NET examples: Castle DynamicProxy (generates runtime proxy for any interface — used by EF Core lazy loading, mocking frameworks like Moq), DispatchProxy (built-in .NET proxy generation), gRPC client stubs (remote proxy), EF Core lazy loading proxies (virtual proxy for navigation properties). Show building an audit proxy for a service that logs all method calls without modifying the service.
```

---

### 5. Behavioral Patterns

#### 5.1 Chain of Responsibility
```
Explain Chain of Responsibility: pass request along chain of handlers, each decides to handle or pass along. Decouples sender from receiver. .NET examples: ASP.NET Core middleware pipeline (each middleware decides to handle or call next), DelegatingHandler in HttpClient, Exception handler chain (try/catch hierarchy). Show building a request validation chain: AnonymousRequest → AuthenticateMiddleware → AuthorizeMiddleware → RateLimitMiddleware → RouteToHandler. Cover that CoR can be linear (each handler passes to next) or tree (branching). Cover ordered pipeline where each handler always calls next (middleware) vs early exit (authentication stops chain on 401). Show a discount calculation chain: VIPDiscount → SeasonalDiscount → BulkDiscount — each applies its discount if applicable. .NET: IMiddleware interface, use with Use/Run/Map.
```

#### 5.2 Command
```
Explain Command pattern: encapsulate request as object — parameterize clients with different requests, queue/log requests, support undo. Structure: Command interface (Execute, Undo), ConcreteCommand (stores receiver + action), Invoker (calls Execute), Receiver (does actual work). .NET examples: MediatR IRequest + IRequestHandler (Command pattern), Task/delegate (encapsulated unit of work), ICommand in WPF/MAUI (UI command binding), database migrations (each migration is a command with Up/Down). Show text editor undo/redo: ITextCommand → InsertTextCommand, DeleteTextCommand, FormatTextCommand — CommandHistory stack for undo. Cover macro commands (composite of commands). Cover that Commands enable: undo/redo, transaction scripts, queued execution, logging of operations. Show MediatR command dispatch as Command pattern.
```

#### 5.3 Iterator
```
Explain Iterator pattern: provide sequential access to elements without exposing underlying representation. .NET has this built-in: IEnumerable<T> + IEnumerator<T> = Iterator pattern. yield return generates iterator state machine (compiler-generated Iterator). Show custom iterator with yield: infinite Fibonacci sequence, lazy file line reader (reads one line at a time — memory efficient), paged API caller (fetches pages lazily on demand). Cover external vs internal iterators (external: caller controls iteration, IEnumerator; internal: iterator controls, ForEach method with callback). Cover that LINQ is built on IEnumerable<T> — all LINQ operators are iterators with lazy evaluation. Show IAsyncEnumerable<T> for async iteration (await foreach). Cover that custom iterators should use yield for simplicity over manual IEnumerator implementation.
```

#### 5.4 Mediator
```
Explain Mediator pattern: define object that encapsulates how objects interact — reduce direct dependencies between objects (colleagues). Colleagues communicate through mediator, not directly. .NET examples: MediatR (in-process mediator — IMediator.Send dispatches to single handler, Publish to multiple handlers), ASP.NET Core routing (mediator between HTTP request and handler), EventAggregator (Prism — UI components communicate through event aggregator). Show chat room: IMediator (ChatRoom) with Send(message, sender), Users send via mediator — users don't reference each other. Cover that Mediator trades direct coupling for mediator coupling (mediator becomes complex if it handles too much logic — keep it thin). MediatR: command dispatching (IRequestHandler<TCommand>), notification broadcasting (INotificationHandler<TNotification>). Show MediatR setup and usage.
```

#### 5.5 Memento
```
Explain Memento pattern: capture and externalize object's internal state so it can be restored later, without violating encapsulation. Structure: Originator (creates/restores from Memento), Memento (stores state — opaque to others), Caretaker (stores Mementos, doesn't inspect them). .NET examples: undo/redo in text editors, snapshot in distributed systems, form state preservation, game save states. Show a text editor implementation: Editor.CreateSnapshot() → TextSnapshot (stores text + cursor position, internal class so state is encapsulated), Editor.Restore(snapshot). Cover that records in C# are natural mementos (immutable value snapshots). Cover storage efficiency (incremental mementos — store only changes vs full snapshots). Cover that .NET transaction systems (EF Core change tracking) implement a form of memento. Show with IUndoable interface.
```

#### 5.6 Observer
```
Explain Observer pattern: define one-to-many dependency — when one object changes state, all dependents notified automatically. .NET has multiple implementations: C# events (delegate-based observer — publisher += subscriber, publisher -= subscriber, event args for data), IObservable<T>/IObserver<T> (Rx.NET base — push-based reactive streams), INotifyPropertyChanged (WPF/MAUI data binding — ObservableCollection), EventHandler<T>. Cover event vs IObservable<T>: events are .NET-native (simpler, can't compose), IObservable<T> is composable (Rx operators — throttle, merge, filter). Cover weak event pattern (prevent memory leaks from event subscriptions). Show domain events as Observer: DomainEventDispatcher notifies all handlers. Cover unsubscription importance (memory leaks from forgotten -= or unsubscribed IDisposable from Subscribe). Show event ordering guarantees (none by default — don't rely on order).
```

#### 5.7 State
```
Explain State pattern: allow object to alter behavior when internal state changes — object appears to change its class. Context delegates to current State object. State objects handle behavior for their state. Classic example: vending machine (Idle → HasMoney → DispensingItem states — each state handles coin inserted, dispense pressed differently). .NET examples: workflow engines, order state machine (Placed → Confirmed → Shipped → Delivered → Cancelled), HTTP connection state machine. Show Order state machine: IOrderState (Handle method), PlacedState, ConfirmedState, ShippedState — Order.CurrentState.Handle(command). Compare to switch/if chain on enum (State pattern is extensible — add state without modifying existing code, OCP). Cover that MassTransit SagaStateMachine is the State pattern at distributed system scale. Show simple State machine with transitions and guard conditions.
```

#### 5.8 Strategy
```
Explain Strategy pattern: define family of algorithms, encapsulate each one, make them interchangeable. Strategy lets algorithm vary independently from clients. .NET examples: IComparer<T> / Comparison<T> (sorting strategy), IEqualityComparer<T>, validation strategies, pricing strategies, serialization strategies. Show payment processing: IPaymentStrategy → CreditCardStrategy, PayPalStrategy, CryptoStrategy — PaymentProcessor uses IPaymentStrategy. Cover strategy selection: inject in constructor, pass per method call, select at runtime via factory. Compare to Template Method (Template Method = inheritance, Strategy = composition — prefer composition). Cover function-as-strategy (Func<T, TResult> in .NET — pass lambda as strategy — simplest form). Show how ASP.NET Core middleware ordering is a form of strategy composition. Cover that OCP is implemented via Strategy (open for extension — new strategy, closed for modification — processor unchanged).
```

#### 5.9 Template Method
```
Explain Template Method: define skeleton of algorithm in base class, defer some steps to subclasses. Subclasses override specific steps without changing algorithm structure. Structure: Abstract class with Template Method (calls abstract and hook methods in order), abstract methods (must override), hook methods (optionally override — have default implementation). .NET examples: ApplicationBuilderMiddlewareExtensions (template for request pipeline setup), XmlSerializer, Stream abstract class (Read/Write abstract, CopyTo template method). Show data import: DataImporter<T> with Import() template (Open, ParseHeader, ParseRows, Close) — CsvImporter overrides ParseHeader/ParseRow, JsonImporter overrides differently. Cover Hollywood Principle (don't call us, we'll call you — base calls subclass). Compare Strategy: Template Method = inheritance (compile-time), Strategy = composition (runtime). Cover that Template Method is classic OOP — Strategy preferred in modern C# (avoids inheritance coupling).
```

#### 5.10 Visitor
```
Explain Visitor pattern: add new operations to object structure without changing the classes. Double dispatch: visitor.Visit(element) + element.Accept(visitor). .NET examples: expression tree visitors (ExpressionVisitor in System.Linq.Expressions — used by EF Core to translate LINQ to SQL), Roslyn SyntaxVisitor (C# compiler API — visit C# AST nodes). Show compiler-like scenario: IShapeVisitor with VisitCircle(Circle), VisitSquare(Square), VisitTriangle(Triangle) — Area calculation visitor, Perimeter visitor, Render visitor — add new operation without touching shapes. Cover when to use: object structure rarely changes but operations on it change frequently, want to gather state during traversal. Cover that Visitor and Composite often used together. Cover open/closed: adding new operations is easy (new Visitor), adding new element types is hard (all visitors need new method). Compare with switch on type (Visitor is extensible, switch needs modification).
```

#### 5.11 Interpreter
```
Explain Interpreter pattern: define grammar for a language and provide interpreter to deal with that grammar. Each grammar rule is a class, expressions composed of sub-expressions. .NET examples: regular expressions (Regex — interprets regex language), LINQ query expressions (interpreted into SQL by EF Core), expression trees (IQueryable composition). Show simple boolean expression interpreter: IExpression → AndExpression, OrExpression, NotExpression, VariableExpression — evaluate(context) traverses expression tree. Cover that Interpreter is rarely used directly (complex grammar = performance issues, hard to maintain) — prefer parser generators (ANTLR) or embedded DSLs. Cover that Roslyn (C# compiler) is a massive Interpreter implementation. .NET: Sprache NuGet for parser combinators, build small DSLs. Cover rule engines as Interpreter (process configurable business rules).
```

---

### 6. Concurrency Patterns

#### 6.1 Active Object
```
Explain Active Object pattern: decouple method execution from method invocation for objects that reside in their own thread of control. Caller invokes method, gets Future/Task back immediately, method executes asynchronously in object's own thread. Components: Proxy (public interface, creates MethodRequests), Scheduler (orders and dispatches MethodRequests), Servant (actual implementation), Future (result placeholder). .NET mapping: async/await is Active Object pattern at language level (calling async method returns Task immediately, method executes asynchronously, await gets result). Show explicit Active Object: class with private Channel<Func<Task>> and background worker loop — all method calls enqueued, single-threaded execution in background (no locking needed for internal state). Cover use case: single-threaded actor (each active object has own message queue — Orleans grain = Active Object at distributed scale).
```

#### 6.2 Monitor Object
```
Explain Monitor Object pattern: synchronize concurrent method execution to ensure only one method executes within an object at a time, and allow methods to schedule their execution based on conditions. Components: synchronized methods (acquire monitor lock on entry), monitor condition variables (wait/notify). .NET mapping: lock statement + Monitor.Wait/Pulse = Monitor Object pattern. Show bounded buffer as Monitor Object: lock(_lock) in Enqueue/Dequeue, Monitor.Wait when full/empty, Monitor.Pulse when item added/removed. Cover that C# Monitor class directly implements this pattern. Cover that async Monitor Object uses SemaphoreSlim (1,1) + SemaphoreSlim-based condition variables for async-compatible synchronized object. Cover that Monitor Object is the foundation of most thread-safe class implementations. Show how ASP.NET Core controller's per-request scope achieves monitor-like semantics for request state.
```

#### 6.3 Half-Sync/Half-Async
```
Explain Half-Sync/Half-Async pattern: separate synchronous and asynchronous processing in a concurrent system. Async layer (I/O layer — event-driven, non-blocking, handles I/O completion events), Sync layer (handles requests synchronously — simple programming model, may block), Queue (decouples layers). .NET mapping: async I/O layer (epoll/IOCP callbacks → async completions) feeding into synchronous or async work processing layer. ASP.NET Core: Kestrel (async I/O with epoll/IOCP — half async) → request handler code (sync or async — half sync). ThreadPool: I/O completion threads (async half) → worker threads (sync half). Show explicit HS/HA: async receiver enqueues to Channel<T>, sync or async processor reads from Channel and processes. Cover that this pattern explains ASP.NET Core's threading model: async I/O, async handlers, ThreadPool workers.
```

#### 6.4 Thread Pool Pattern
```
Explain Thread Pool pattern: manage a pool of worker threads, submit tasks to pool, pool assigns tasks to idle threads. Eliminates thread creation/destruction overhead. .NET: ThreadPool (QueueUserWorkItem, unsafe QueueUserWorkItem), Task.Run (submits to ThreadPool), Parallel.For (uses ThreadPool with partitioning). Cover thread pool sizing: minimum threads (pre-warm with SetMinThreads to avoid hill-climbing delay), maximum threads (cap to prevent memory exhaustion), work-stealing (per-thread local queue + global queue). Cover I/O thread pool (separate from worker pool — for I/O completion callbacks). Cover thread pool starvation (all threads blocked — ThreadPool.SetMinThreads as workaround, fix blocking code). Show custom task scheduler (LimitedConcurrencyLevelTaskScheduler — constrains parallelism). Cover that Channel<T> + background worker is an explicit thread pool pattern you control.
```

#### 6.5 Producer-Consumer Pattern
```
Explain Producer-Consumer pattern: decouple producers (generate work items) from consumers (process work items) via a shared buffer/queue. Benefits: different rates (producer faster than consumer — queue buffers), decoupled lifecycle (producer and consumer can be independent), parallelism (multiple producers + consumers). .NET implementations: Channel<T> (async-native, backpressure via bounded capacity — preferred), BlockingCollection<T> (sync blocking — legacy), TPL Dataflow BufferBlock<T> + ActionBlock<T> (pipeline), ConcurrentQueue<T> + polling (less elegant). Show ASP.NET Core background processing: HTTP endpoints enqueue to Channel<T>, IHostedService consumer processes from Channel. Cover that bounded Channel provides natural backpressure (producer awaits when channel full). Cover worker count tuning (CPU-bound: #cores workers, I/O-bound: more workers).
```

#### 6.6 Read-Write Lock Pattern
```
Cover Read-Write Lock in .NET: allow concurrent reads, exclusive writes. ReaderWriterLockSlim (entering read lock, write lock, upgradeable read lock — try/finally pattern required). When to use: read-heavy shared state (>10:1 read:write ratio — otherwise lock overhead not worth it). Performance comparison: lock (exclusive always) vs ReaderWriterLockSlim (concurrent reads) — show benchmark at different read ratios. Async variant: no built-in async RWLock in .NET — AsyncReaderWriterLock from AsyncEx NuGet (Nito.AsyncEx). Show thread-safe in-memory cache with RWLock: readers get concurrent access, writes get exclusive. Cover that ConcurrentDictionary is often better than Dictionary + RWLock (ConcurrentDictionary uses striped locking, very low contention). Cover upgradeable lock: read, then upgrade to write atomically without releasing — use for check-then-write patterns.
```

#### 6.7 Scheduler Pattern
```
Explain Scheduler pattern: control the order in which concurrent operations execute. Access to shared resources scheduled by scheduler based on policy (priority, fairness, time-slicing). .NET implementations: TaskScheduler (abstract — LimitedConcurrencyLevelTaskScheduler, SynchronizationContextTaskScheduler), ConcurrentExclusiveSchedulerPair (exclusive access vs concurrent — readers and writers scheduled appropriately), PeriodicTimer + IHostedService (periodic scheduling), Quartz.NET (cron-based scheduling with persistence), Hangfire (background job scheduling). Show LimitedConcurrencyLevelTaskScheduler: only N tasks execute concurrently (throttle CPU-intensive work without starving thread pool). Show ConcurrentExclusiveSchedulerPair: schedule writes as exclusive tasks, reads as concurrent tasks (natural RW semantics). Cover that Scheduler pattern is at the heart of all concurrency management.
```

---

### 7. Dependency Injection & IoC

#### 7.1 IoC
```
Explain Inversion of Control: principle that control flow is inverted compared to traditional programming. Traditional: your code calls library code. IoC: framework calls your code (callbacks, event handlers, virtual methods). IoC container: framework that creates and wires your objects. Forms of IoC: Dependency Injection (framework injects dependencies), Template Method (framework calls your override), Event-Driven (framework calls your event handler), Service Locator (your code asks framework for dependency — anti-pattern of IoC). Cover Hollywood Principle again. Cover that IoC ≠ DI (IoC is broader principle, DI is one implementation). .NET: ASP.NET Core is IoC framework — it creates your controllers, services, calls your middleware, calls your Configure() methods. Cover that IoC containers are a solution to wiring complexity — not required for DI (can do manual DI / Pure DI without container).
```

#### 7.2 DI Types
```
Compare DI injection types: Constructor Injection (dependencies in constructor parameters — explicit, required dependencies, testable, .NET DI default — can't create object without dependencies), Property Injection (public settable properties injected by framework — optional dependencies, allows circular dependencies — more flexible but dependencies not obvious, fragile), Method Injection (dependency passed as method parameter — per-call dependency, useful when dependency varies per call). Cover that .NET DI container only supports constructor injection natively (no property injection without attributes or custom factory). Cover that constructor injection makes dependencies explicit — prefer it. Cover that too many constructor parameters is a code smell (SRP violation — too many responsibilities). Cover that DI vs new: use DI for services (stateless, shared), use new for entities/value objects/DTOs (per-call, data-oriented).
```

#### 7.3 Service Lifetimes
```
Explain .NET DI service lifetimes: Singleton (one instance per DI container — shared across all requests, all threads — must be thread-safe, avoid mutable state or protect with lock/Interlocked), Scoped (one instance per scope — in ASP.NET Core one per HTTP request — new scope = new instance, DbContext is scoped — not thread-safe, scoped to one request at a time), Transient (new instance every resolution — stateless services, no thread concerns, highest memory overhead). Show lifetime diagram: container → scopes → resolutions. Cover captive dependency anti-pattern (Singleton depends on Scoped — Scoped outlives its intended scope → stale state, shared across requests). .NET: IServiceScopeFactory to create scopes in Singleton services (background workers needing scoped services). Cover that incorrect lifetimes are a common source of bugs (DbContext as Singleton → shared across requests → exceptions).
```

#### 7.4 Registration Patterns
```
Cover .NET DI registration patterns: simple registration (AddTransient/AddScoped/AddSingleton<IService, Implementation>()), factory registration (AddTransient<IService>(sp => new Service(sp.GetRequiredService<IDep>()))), open generic registration (AddScoped(typeof(IRepository<>), typeof(Repository<>))), delegate factory (register Func<T> for conditional creation), IOptions<T> pattern (register configuration binding), module-based registration (extension methods per feature — builder.AddPaymentServices()). Cover convention-based registration (Scrutor NuGet — scan assembly for types implementing IService → register automatically). Cover that extension method per feature/module scales better than one huge Program.cs registration block. Show IServiceCollection extension method for feature module registration.
```

#### 7.5 Factory & Conditional Resolution
```
Cover factory and conditional resolution patterns: register Func<T> factory (inject Func<IPaymentGateway> factory, call factory to create on demand — useful for transient services in singleton context), register factory interface (IPaymentGatewayFactory with Create(string type) — type-based strategy), named services via dictionary (Dictionary<string, IService> registered, resolve by key), Keyed Services (.NET 8 — AddKeyedSingleton("stripe", ...) + [FromKeyedServices("stripe")]), conditional registration (check environment, register different implementation in Development vs Production). Cover that factory registration is essential when: need to delay creation, need multiple instances from singleton context, need different instances based on runtime data. Show Func<string, INotificationService> factory for type-based notification routing.
```

#### 7.6 Decorator via DI
```
Show the Decorator pattern implemented via .NET DI: Scrutor NuGet Decorate method (Decorate<IOrderRepository, CachingOrderRepository>() — wraps existing registration automatically), manual decoration (builder.AddSingleton<SqlOrderRepository>() + builder.AddSingleton<IOrderRepository>(sp => new CachingOrderRepository(sp.GetRequiredService<SqlOrderRepository>()))), decoration chain (multiple decorators wrapped — Logging(Caching(SqlRepository))). Show a complete example: IOrderRepository → SqlOrderRepository (persistence) → CachingOrderRepository (caching layer) → LoggingOrderRepository (audit). Cover that Decorator via DI keeps decorators focused (each does one thing), enables easy addition/removal of decorators, maintains testability. Cover pipeline behaviors in MediatR as decorator pattern on command/query handlers.
```

#### 7.7 Keyed Services
```
Show Keyed Services in .NET 8+: AddKeyedSingleton<T>("key", implementation), AddKeyedScoped, AddKeyedTransient, [FromKeyedServices("key")] attribute in constructors, IKeyedServiceProvider for programmatic resolution. Use cases: multiple implementations of same interface (IPaymentGateway keyed by "stripe", "paypal", "crypto" — resolve by payment method string), environment-specific services (keyed by environment name), versioned services. Show before (.NET 7 — workaround with dictionary or factory) vs after (.NET 8 — clean keyed resolution). Cover that Keyed Services replace many IEnumerable<IService> + type-check workarounds. Show ASP.NET Core controller injecting keyed services. Cover that keyed services work with all lifetimes (Singleton, Scoped, Transient). Cover IKeyedServiceProvider for dynamic key resolution at runtime.
```

#### 7.8 Testing with DI
```
Show testing patterns with .NET DI: constructor injection enables mock injection (new OrderService(mockRepo.Object) — no DI container needed for unit tests), WebApplicationFactory for integration tests (override services with test doubles — builder.ConfigureTestServices(services => services.AddScoped<IPaymentGateway, FakePaymentGateway>())), Fake implementations (simple implementations for testing — FakeRepository<T> storing in memory), mock frameworks (Moq, NSubstitute — generate mocks from interfaces), TestServer for HTTP integration tests. Cover that DI makes code testable — SUT only depends on interfaces. Cover test service registrations (separate test DI setup). Cover that overriding specific services while keeping real implementations for others enables focused integration tests. Show replacing EF Core with in-memory SQLite for integration tests.
```

#### 7.9 DI Anti-Patterns
```
Cover DI anti-patterns: Service Locator (inject IServiceProvider and call GetService inside class — hides dependencies, like global state with extra steps — use only in framework infrastructure code), Bastard Injection (constructor takes both DI parameters and new-ed dependencies — mix of DI and hard-coded — choose one), Control Freak (class creates its own dependencies with new — non-injectable, non-testable), Ambient Context (ThreadLocal/static DI container — global state via DI — threading issues), Captive Dependency (Singleton holding Scoped dependency — Scoped lives longer than intended scope), Constrained Construction (constructor parameters restricted — RegisterFactory workaround). Cover each anti-pattern with code example and fix. Cover that Service Locator is sometimes unavoidable in legacy code integration — minimize its use and document why.
```

---

### 8. Domain-Driven Design

#### 8.1 DDD Core Concepts
```
Explain core DDD concepts: Ubiquitous Language (common vocabulary shared between domain experts and developers — used in code, meetings, documentation — Order not CustomerOrder or PurchaseRecord), Bounded Context (explicit boundary where domain model applies — same term may mean different things across contexts), Context Map (relationships between bounded contexts — Partnership, Shared Kernel, Customer-Supplier, Conformist, ACL, Published Language), Strategic vs Tactical design (strategic = bounded contexts, context maps; tactical = entities, aggregates, domain services). Cover why DDD: complex domains with intricate business rules benefit most. Cover when DDD is overkill (simple CRUD apps, reporting systems, admin panels). Cover that DDD is a thinking tool, not a technology — no NuGet required. Show Event Storming as technique to discover bounded contexts.
```

#### 8.2 Entities
```
Explain DDD Entities: objects defined by identity (id) rather than attributes — two entities with same attributes are different if they have different IDs. Identity persists through state changes (order is same order even after address changes). Examples: Order, Customer, Product, Employee. Implementation in .NET: base Entity<TId> class (Id property, Equals/GetHashCode by Id, domain events collection), strongly-typed IDs (record OrderId(Guid Value) — type safety prevents passing CustomerId where OrderId expected). Cover entity equality: by ID not by value. Cover entity lifecycle: created, modified, eventually deleted. Cover that entities should be rich domain objects (not anemic data bags) — they contain behavior, not just data. Show example of a rich Order entity with business methods (AddItem, RemoveItem, Submit, Cancel — not just setters).
```

#### 8.3 Value Objects
```
Explain DDD Value Objects: objects defined by their attributes, no identity, immutable. Two VOs with same attributes are equal. Examples: Money (amount + currency), Address, DateRange, Email, PhoneNumber, Coordinates, Color. Properties: no identity, immutability (can't change — create new VO with different values), structural equality (compare by all attributes), self-validation (constructor validates — can't create invalid VO). .NET implementation: record struct (best — immutable by default, structural equality, C# 9+) or record class (heap allocation, structural equality). Show Money value object: record Money(decimal Amount, Currency Currency) with validation in factory method, Add/Subtract methods returning new Money. Cover that VOs replace primitive obsession (string email → Email VO with validation). Show EF Core value object mapping (OwnsOne for complex VOs, column mapping for simple). Cover that VOs are natural candidates for strongly-typed primitives.
```

#### 8.4 Aggregates
```
Explain DDD Aggregates: cluster of entities and value objects treated as a single unit for data changes. Aggregate Root (the "main" entity — external references only to root, not to inner entities). Invariants enforced within aggregate boundary. One transaction per aggregate (Saga for cross-aggregate). Aggregate design rules: reference other aggregates by ID only (not object reference), keep aggregates small (large aggregates = contention), model by transactional consistency boundary (what must be consistent together). Show Order aggregate: Order (root) → OrderItems (entities inside aggregate), Customer is separate aggregate referenced by CustomerId. Cover that aggregate size is the hardest design decision in DDD. Cover optimistic concurrency per aggregate (version/timestamp on root). Show EF Core aggregate mapping (DbSet<Order> only — not DbSet<OrderItem>). Cover domain events published by aggregate root.
```

#### 8.5 Domain Events
```
Explain Domain Events: something important that happened in the domain. Events are immutable (happened in past — OrderPlaced, PaymentFailed, ItemShipped). Events communicate state changes across bounded contexts. Two types: in-process domain events (within same aggregate/service transaction — trigger immediate side effects), integration events (cross-service — published to message broker after commit). Show domain event pattern: IDomainEvent marker interface, Entity base class with List<IDomainEvent> events, RaiseDomainEvent() method, save changes publishes events. Dispatch options: pre-save (within transaction — side effects can fail transaction), post-save (after transaction — best for decoupling). Show MediatR INotification dispatch after EF Core SaveChanges via interceptor. Cover event naming (past tense — OrderPlaced not PlaceOrder, OrderFailed not OrderFailure).
```

#### 8.6 Repositories
```
Explain DDD Repositories: collection-like abstraction for aggregate persistence. Repository interface in domain layer (IOrderRepository with GetById, Add, Update, Remove — no persistence specifics), implementation in infrastructure layer. Repository per aggregate root (not per entity — OrderRepository gives access to Order aggregate, not OrderItem directly). Repository characteristics: in-memory illusion (domain doesn't know about DB), complete aggregate (loads full aggregate, saves full aggregate), no queries returning parts of aggregate (use separate read models for queries). Cover Generic Repository debate: generic IRepository<T> is often too generic (Add/Update/Delete per type — but queries differ per aggregate — prefer specific repository interfaces with domain-meaningful methods). Cover that EF Core DbContext is already a repository — adding another layer is optional (DDD purists: yes, pragmatists: no).
```

#### 8.7 Domain Services
```
Explain Domain Services: operations that don't naturally belong to an entity or value object. Signs you need a domain service: operation involves multiple aggregates, operation requires external data that shouldn't be in the domain. Examples: TransferFunds (involves two Account aggregates), PricingService (calculates price from Product + Customer + promotions), InventoryAllocator (allocates inventory from multiple warehouses). Properties: stateless, named after domain operation, takes domain objects as parameters, returns domain result. Distinguish from Application Services: Domain Service contains domain logic (calculation, rules), Application Service orchestrates (calls repository, calls domain service, publishes events, handles transaction). .NET: interfaces in domain layer, implementations in domain or infrastructure depending on dependencies. Cover that thin domain services that just delegate to entity methods are unnecessary — put logic in entity.
```

#### 8.8 Application Services
```
Explain Application Services: orchestrate use cases. One application service per use case or one class per bounded context with multiple methods. Responsibilities: load aggregates from repositories, call domain logic (entity methods, domain services), publish domain/integration events, handle cross-cutting concerns (logging, validation, transactions). Application services should NOT contain business logic — delegate to domain objects. Show application service for PlaceOrder use case: load Customer aggregate, load Product aggregates for each item, call Order.Create(customerId, items), save via IOrderRepository, publish OrderPlacedEvent. Cover that Application Services = CQRS Commands. Cover Transaction Script vs Domain Model: Transaction Script (simple procedural application service, acceptable for simple use cases), Domain Model (rich entities with behavior, for complex domains). Show the difference.
```

#### 8.9 Specification Pattern
```
Explain Specification pattern: encapsulate business rules/query logic into reusable, composable predicate objects. ISpecification<T> with IsSatisfiedBy(T entity) and ToExpression() for DB querying. Composite specifications: AndSpecification, OrSpecification, NotSpecification — combine specifications with &&, ||, !. Benefits: named business rules (ActiveCustomerSpecification vs if(c.IsActive && c.LastPurchase > DateTime.Now.AddMonths(-6))), reusable (same spec in validation + query), composable. .NET: Specification pattern with Expression<Func<T, bool>> for LINQ/EF Core (ToExpression() returns expression tree for DB querying, IsSatisfiedBy uses compiled expression for in-memory). Show combining specs: new ActiveCustomerSpecification().And(new PremiumCustomerSpecification()). Ardalis.Specification NuGet. Cover that Specification avoids magic query methods on Repository (GetActiveCustomers, GetActiveCustomersByRegion, etc.) — use generic Find(spec) instead.
```

#### 8.10 DDD with EF Core
```
Show DDD aggregate mapping with EF Core: private setters (properties with { get; private set; } — EF Core sets via reflection or backing fields), owned entities (OwnsOne for value objects — Address owned by Customer), shadow properties (audit fields not in domain model), restricted access to child entities (no public DbSet<OrderItem> — accessed only through Order.Items), table splitting (map aggregate root + owned entities to same table), value conversions (convert strongly-typed IDs: OrderId to Guid for DB). Cover that EF Core 8+ has excellent DDD support (complex types, primitive collections). Cover that loading aggregates: eager loading with Include (consistent aggregate loading), explicit loading (load on access). Cover that rich domain model + EF Core requires configuration to prevent EF from persisting non-domain properties. Show Fluent API configuration for a DDD Order aggregate.
```

---

### 9. Clean Architecture

#### 9.1 Clean Architecture
```
Explain Clean Architecture (Uncle Bob): concentric circles with Dependency Rule (source code dependencies point inward — outer layers depend on inner layers, inner layers know nothing about outer). Layers: Entities (innermost — enterprise business rules — domain model, value objects, aggregates), Use Cases (application business rules — application services, commands/queries — orchestrate entities), Interface Adapters (convert data for outer/inner layers — controllers, presenters, gateways/repository implementations), Frameworks & Drivers (outermost — frameworks, DBs, web, UI — ASP.NET Core, EF Core, SQL Server). Cover Dependency Rule strictly: domain layer imports nothing from infrastructure, application layer imports nothing from EF Core. Cover that Clean Architecture is a set of principles — implementations vary. Cover similarities to Hexagonal (ports and adapters). Show .NET project structure.
```

#### 9.2 Domain Layer
```
Explain the Domain (Entities) layer: contains enterprise business rules — the most stable, most important layer. Contents: domain entities (Order, Customer, Product — rich with behavior), value objects (Money, Address, Email — immutable), aggregates (Order aggregate root), domain events (OrderPlaced, PaymentFailed), repository interfaces (IOrderRepository — interface only, no implementation), domain services (PricingService interface), domain exceptions (OrderNotFoundException, InsufficientInventoryException), specifications. Dependencies: NONE — no EF Core, no ASP.NET Core, no infrastructure concerns. NuGet packages: none (pure C#, maybe MediatR contracts for domain events). Show that domain layer is a standalone class library with zero external dependencies. Cover that testability comes from this purity — domain logic tested without any infrastructure setup.
```

#### 9.3 Application Layer
```
Explain the Application (Use Cases) layer: contains application-specific business rules — orchestrates entities to implement use cases. Contents: commands (PlaceOrderCommand + PlaceOrderCommandHandler), queries (GetOrderByIdQuery + GetOrderByIdQueryHandler), DTOs (request/response models), application service interfaces (IEmailService — interface only), validation (FluentValidation validators), mapping (AutoMapper profiles, manual mapping), application exceptions (OrderAlreadyExistsException). Dependencies: Domain layer only (no EF Core, no HTTP, no infrastructure). .NET: MediatR for command/query dispatch, FluentValidation for input validation, AutoMapper/Mapster for DTO mapping. Cover that application layer defines ports (interfaces for infrastructure) — Port = IOrderRepository, IEmailService, IPaymentGateway — infrastructure provides adapters. Show PlaceOrderCommandHandler.
```

#### 9.4 Infrastructure Layer
```
Explain Infrastructure layer: adapters implementing ports defined in Application/Domain. Contents: EF Core DbContext and configurations, repository implementations, external API clients, email service implementation, file storage, message broker publishers. Dependencies: Application layer + Domain layer + all the external libraries (EF Core, HttpClient, SMTP). Cover that infrastructure is the only place allowed to reference EF Core, SQL Server, Redis. Registration: IServiceCollection extension method that registers all infrastructure services. Show OrderRepository implementing IOrderRepository using DbContext. Cover that infrastructure should be thin (map to/from domain model, delegate business logic to domain). Cover infrastructure testing (integration tests against real DB with Testcontainers, mocked external APIs). Show ApplicationDbContext with entity configurations using Fluent API for DDD mappings.
```

#### 9.5 Presentation Layer
```
Explain Presentation layer: entry points into the application. Types: Web API (ASP.NET Core controllers / Minimal APIs), gRPC server (Grpc.AspNetCore service implementations), Blazor (pages/components), Worker Services (IHostedService consuming messages), CLI (command-line entry point). Responsibilities: parse HTTP requests, validate input (model binding validation), call application layer (send commands/queries via MediatR), map to HTTP response, handle exceptions (global exception handler middleware). Dependencies: Application layer + domain DTOs. Cover that Presentation layer should be thin — no business logic. Cover that controller action = command dispatch to MediatR. Show ASP.NET Core minimal API endpoints mapped to MediatR commands. Show global exception handler (IExceptionHandler in .NET 8) mapping domain exceptions to appropriate HTTP status codes.
```

#### 9.6 Cross-Cutting Concerns
```
Cover cross-cutting concerns in Clean Architecture: Logging (ILogger injected at each layer, structured logging with correlation IDs, MediatR pipeline behavior for handler logging), Validation (FluentValidation + MediatR pipeline behavior — validates before handler runs, returns ValidationProblemDetails), Exception Handling (global middleware + IExceptionHandler mapping domain exceptions to HTTP responses), Authorization (MediatR pipeline behavior checks authorization before handler, or ASP.NET Core policies), Caching (MediatR pipeline behavior caches query results, invalidation on command), Transactions (MediatR pipeline behavior wraps handler in transaction, commits on success, rolls back on exception). Show MediatR IPipelineBehavior<TRequest, TResponse> implementing each concern. Cover that pipeline behaviors replace AOP (Aspect-Oriented Programming) in Clean Architecture.
```

#### 9.7 Clean Architecture .NET Structure
```
Show a practical .NET Clean Architecture project structure: Solution → Domain project (class library, no dependencies), Application project (class library, depends on Domain), Infrastructure project (class library, depends on Application + Domain + EF Core + external libs), Presentation project (ASP.NET Core, depends on Application + Infrastructure for DI registration). Folder structure within each project. Show project references (csproj). Cover that Infrastructure and Presentation depend on Application (not vice versa). Show that tests mirror the structure: Domain.Tests (pure unit tests, no mocking needed), Application.Tests (mock Infrastructure interfaces), Infrastructure.Tests (integration tests with real DB via Testcontainers), Presentation.Tests (WebApplicationFactory integration tests). Cover template: Ardalis Clean Architecture template, Jason Taylor Clean Architecture template as reference implementations.
```

#### 9.8 Testing in Clean Architecture
```
Show testing strategy for Clean Architecture: Domain layer (pure unit tests — no mocking, no DI — just instantiate entities and call methods, fast), Application layer (unit tests with mocked interfaces — mock IOrderRepository, IEmailService — test command/query handler logic), Infrastructure layer (integration tests — real DB, real Redis, Testcontainers for ephemeral containers), Presentation layer (WebApplicationFactory integration tests — full stack but controlled — replace specific infrastructure with fakes). Cover that Clean Architecture makes each layer independently testable. Show domain test: Order.AddItem() test (pure — no infrastructure). Show application test: PlaceOrderCommandHandler test with mock IOrderRepository. Show infrastructure test: SqlOrderRepository test with Testcontainers PostgreSQL. Cover test data builders per layer. Cover that Clean Architecture enables 80% unit tests, 15% integration, 5% E2E (fast test suite).
```

---

### 10. Hexagonal Architecture

#### 10.1 Hexagonal Core
```
Explain Hexagonal Architecture (Ports and Adapters, Alistair Cockburn 2005): application core in the center, surrounded by ports (interfaces), adapters on the outside (implementations). Key insight: application should be equally driveable by tests, UI, or other applications — application doesn't depend on any delivery mechanism. Two sides: left/driving side (adapters driving the application — HTTP, CLI, test — use application via ports), right/driven side (adapters driven by application — DB, messaging, external APIs — implement ports). Cover that "hexagon" is just a shape showing multiple ports — not literally 6 sides. Cover the key benefit: swap any adapter without changing application core. Cover that Hexagonal and Clean Architecture solve the same problem with different vocabulary (domain = application core, ports = use case interfaces, adapters = infrastructure).
```

#### 10.2 Ports
```
Explain Ports in Hexagonal Architecture: interfaces defining how the application can be used (Primary Ports) and what the application needs from outside (Secondary Ports). Primary Ports (driving — left side): use case interfaces (IPlaceOrderUseCase, IGetOrderQuery) — adapters call through these to drive the application. Secondary Ports (driven — right side): interfaces the application calls outward (IOrderRepository, IEmailNotifier, IPaymentGateway) — adapters implement these to be driven by application. Port design: ports are defined by what the application needs (not by what the infrastructure provides — IOrderRepository.GetById not ISqlRepository.ExecuteQuery). Cover that ports are defined in the application core — adapters are outside. Show PlaceOrderPort (primary) and OrderRepositoryPort (secondary) in .NET.
```

#### 10.3 Adapters
```
Explain Adapters in Hexagonal Architecture: bridge between the application core and the outside world. Primary Adapters (left/driving — implement nothing, call primary ports): REST Controller (calls IPlaceOrderUseCase), CLI command handler, test harness (calls ports directly — enables testing without HTTP). Secondary Adapters (right/driven — implement secondary ports): SqlOrderRepository (implements IOrderRepository), SmtpEmailNotifier (implements IEmailNotifier), StripePaymentGateway (implements IPaymentGateway), InMemoryOrderRepository (for testing). Cover adapter transformation: REST adapter maps HTTP request to domain command, SQL adapter maps domain entity to DB row. Cover that adapters are infrastructure — can be swapped without touching application core. .NET: adapter = class in Infrastructure project implementing interface defined in Application/Domain project.
```

#### 10.4 Hexagonal vs Clean Architecture
```
Compare Hexagonal and Clean Architecture: both separate business logic from infrastructure, both use interfaces (ports/repositories) to invert dependencies, both enable adapter swapping, both make applications testable without real infrastructure. Differences: Hexagonal focuses on two sides (driving vs driven — test and production adapters), Clean Architecture adds explicit layers with strict dependency rule (entities → use cases → adapters → infrastructure), Clean Architecture is more prescriptive about layer structure, Hexagonal is more about interaction patterns. In practice: Clean Architecture uses ports-and-adapters thinking for infrastructure (secondary ports), but adds more structure. Many .NET projects labeled "Clean Architecture" use Hexagonal thinking at the infrastructure boundary. Choose: Hexagonal for simpler conceptual model, Clean Architecture for explicit layering guidance. Both are better than unstructured layered architecture.
```

#### 10.5 Hexagonal in .NET
```
Show Hexagonal Architecture in .NET project structure: Core project (application + domain — use case interfaces, domain model, secondary port interfaces), Infrastructure projects (one per adapter type — WebApi project, SqlServer project, Redis project, Email project), Tests project (uses Core directly via InMemory adapters). Show wiring in Program.cs: register Core services, register infrastructure adapters (AddSqlOrderRepository, AddSmtpEmailService). Cover that each infrastructure project only depends on Core — independently deployable and testable. Show testing with in-memory adapters: PlaceOrderUseCase tests with InMemoryOrderRepository and RecordingEmailNotifier (spy). Show how adding new adapter (gRPC endpoint) requires no changes to Core. Cover that this structure naturally enables multi-tenancy (different adapters per tenant) and multi-channel (HTTP, gRPC, CLI same core).
```

---

### 11. CQRS & MediatR

#### 11.1 CQRS Commands vs Queries
```
Explain CQRS (Command Query Responsibility Segregation): separate write operations (commands) from read operations (queries). Commands: change state, return nothing or minimal acknowledgment, named with imperative verb (PlaceOrder, CancelOrder, UpdateCustomerEmail), one handler per command, may trigger domain events. Queries: read state, return data, no side effects, named with noun (GetOrderById, ListCustomerOrders, OrderSummary), can have optimized read model (bypass domain layer, query DB directly with Dapper/raw SQL for performance). Benefits: read model optimized independently (denormalized, indexed differently), write model focused on invariants, independently scalable, clearer intent (is this changing state or just reading?). Cover that CQRS spectrum: simple (same DB, separate handlers) to complex (separate read/write DBs + eventual consistency). Start simple.
```

#### 11.2 MediatR
```
Explain MediatR: in-process mediator pattern implementation. IMediator.Send(IRequest<T>) → single IRequestHandler<TRequest, TResponse> handles. IMediator.Publish(INotification) → all INotificationHandler<T> handle. Core use case: decouple controller/service from handler — controller sends command without knowing who handles it. Benefits: handlers focused (single purpose), easy to add pipeline behaviors (logging, validation, transactions around all handlers), testable (test handler in isolation). Costs: indirection (follow the code requires knowing MediatR dispatch), performance overhead (reflection, boxing — measure if hot path), over-use (every method → command/query overkill for simple CRUD). .NET: MediatR NuGet + MediatR.Extensions.Microsoft.DependencyInjection. Show a complete command + handler + controller. Cover notification vs request: notification = fire-and-forget to many handlers, request = get response from one handler.
```

#### 11.3 MediatR Commands and Queries
```
Show MediatR commands and queries with best practices: command (record PlaceOrderCommand(Guid CustomerId, IEnumerable<OrderItemDto> Items) : IRequest<OrderId>), command handler (PlaceOrderCommandHandler : IRequestHandler<PlaceOrderCommand, OrderId> — loads aggregates, calls domain, saves, publishes events), query (record GetOrderByIdQuery(Guid OrderId) : IRequest<OrderDto>), query handler (GetOrderByIdQueryHandler — can bypass domain layer, query DB directly with Dapper for flat DTO). Cover that query handlers often skip domain model (load from DB directly to DTO — simpler, faster). Cover return types: command returns created ID or void, query returns DTO (never domain entity). Cover validation: FluentValidation validator per command registered in DI. Cover that .NET records are perfect for commands/queries (immutable, value equality for testing).
```

#### 11.4 MediatR Pipeline Behaviors
```
Show MediatR pipeline behaviors (IPipelineBehavior<TRequest, TResponse>): cross-cutting concerns applied to all handlers. Common behaviors: LoggingBehavior (log request, response, duration — wrap Handle() with stopwatch), ValidationBehavior (run FluentValidation validators before handler — throw ValidationException on failure), TransactionBehavior (begin DB transaction before handler, commit after, rollback on exception), CachingBehavior (cache query results with sliding expiration — only for queries implementing ICacheable), ExceptionHandlingBehavior (catch domain exceptions, translate to application exceptions). Ordering: behaviors execute in registration order (outer to inner for setup, inner to outer for cleanup). Show registration order: Transaction → Validation → Logging → Handler. Cover that behaviors replace AOP in MediatR. Show conditional behaviors (behavior only applies to commands implementing ITransactional interface).
```

#### 11.5 Validation with MediatR
```
Show FluentValidation + MediatR validation pipeline: define AbstractValidator<PlaceOrderCommand>, register validators (AddValidatorsFromAssembly), ValidationBehavior<TRequest, TResponse> IPipelineBehavior runs validators before handler (IValidator<TRequest>.ValidateAsync — throw ValidationException with failures if any). Controller/global exception handler catches ValidationException, maps to 400 ProblemDetails with field errors. Cover that validation in application layer validates application input (not domain invariants — those are in entities). Domain invariants: enforced in entity/aggregate constructors/methods (throw domain exceptions). Application validation: required fields, format validation, exists-in-DB checks. Cover AbstractValidator<T>.RuleFor(x => x.CustomerId).NotEmpty().WithMessage("Customer ID required"), .MustAsync((id, ct) => customerRepo.ExistsAsync(id, ct)).WithMessage("Customer not found"). Show complete validation flow.
```

#### 11.6 CQRS Without MediatR
```
Show CQRS without MediatR: direct service injection is simpler for many cases. Approach 1: separate command service and query service (IOrderCommandService + IOrderQueryService — inject directly in controllers). Approach 2: vertical slice (IPlaceOrderUseCase + IGetOrderByIdQuery as specific interfaces — inject exactly the interface needed). Benefits of no MediatR: less indirection (follow code directly), no reflection overhead, simpler debugging, less ceremony. When to use MediatR: many commands/queries (MediatR simplifies pipeline behaviors for all), need decoupled notification broadcasting (INotification), need dynamic handler dispatch. When to skip: small apps (<10 commands), team unfamiliar with MediatR, performance-critical paths (avoid reflection). Show the two approaches side by side. Cover that CQRS is the principle, MediatR is an optional implementation tool.
```

---

### 12. Repository & Unit of Work

#### 12.1 Repository Pattern
```
Explain Repository pattern (DDD/Martin Fowler): collection-like abstraction for aggregate persistence. Provides domain-meaningful access to aggregates. Interface in domain/application layer, implementation in infrastructure. Methods: Add(aggregate), GetById(id), Remove(aggregate), and domain-specific finders (GetActiveOrdersByCustomer(customerId)). Cover that Repository hides persistence mechanism (SQL, NoSQL, in-memory — same interface). Cover in-memory illusion: code reads like working with an in-memory collection, not a database. .NET: define IOrderRepository in Application/Domain, implement SqlOrderRepository in Infrastructure using EF Core. Cover that Repository should work with complete aggregates (load full aggregate — eager load children, not lazy). Cover that simple repositories are just thin wrappers — add repository only if testability or abstraction has clear value.
```

#### 12.2 Generic vs Specific Repositories
```
Compare generic IRepository<T> (GetById, Add, Update, Delete for any T) and specific IOrderRepository (GetById, Add, GetActiveByCustomer, GetOverdueOrders). Generic advantages: less code (one interface, multiple type arguments), applies DRY. Generic disadvantages: too general (every aggregate has unique query needs not expressible in generic), forces same interface on all aggregates, often grows with special methods breaking the abstraction, leads to leaking query logic into application layer. Specific advantages: domain-meaningful interface, clearly expresses what queries are needed, each aggregate has correct methods. Recommendation: specific repositories per aggregate root with meaningful method names. Cover that EF Core DbContext.Set<T>() is a generic repository — avoid wrapping it with another generic repository (redundant layer). Show IOrderRepository with only domain-relevant methods.
```

#### 12.3 Unit of Work
```
Explain Unit of Work pattern: tracks changes to domain objects during business transaction, coordinates writes in single commit. Benefits: batch DB writes (single transaction), tracks changes consistently, coordinates multiple repositories. .NET: EF Core DbContext IS the Unit of Work — it tracks all entity changes, SaveChanges() commits all at once. Explicit UoW pattern: IUnitOfWork with IOrderRepository Orders, ICustomerRepository Customers, SaveChangesAsync() — wrap DbContext, expose repository properties. Cover that adding UoW on top of EF Core is often redundant (DbContext already is UoW). Cover when explicit UoW adds value: abstraction for testing (mock IUnitOfWork), multiple DbContext coordination, non-EF persistence. Show implementing IUnitOfWork wrapping EF DbContext. Cover that UoW scope should match business transaction scope (one HTTP request = one UoW in ASP.NET Core via scoped DbContext).
```

#### 12.4 Repository + EF Core Debate
```
Cover the contentious Repository + EF Core question: arguments FOR adding Repository over EF Core (testability — mock repository for unit tests without DB, abstraction — swap persistence technology, separation of concerns — application layer doesn't depend on EF Core, DDD alignment — aggregate loading via repository), arguments AGAINST (EF Core DbContext is already a repository and unit of work, double abstraction adds complexity, EF Core queries in repository return IQueryable leaking abstraction, harder to optimize than direct EF Core usage, mocking IQueryable is complex). Pragmatic answer: if domain has rich business logic justifying DDD (use Repository for proper DDD boundaries), if app is primarily CRUD with complex queries (use EF Core directly — no Repository), if tests need to run without DB (use Repository abstraction + in-memory fake). Show both approaches.
```

#### 12.5 Specification + Repository
```
Show Specification pattern combined with Repository: generic Find(ISpecification<T>) method replaces explosion of specific finder methods. ISpecification<T>: Criteria (Expression<Func<T, bool>> for EF Core), Includes (includes for eager loading), OrderBy, Take/Skip (for pagination). Repository: IEnumerable<T> Find(ISpecification<T> spec) → applies spec to DbSet. Advantages: reusable specs (ActiveOrderSpec used in repo and in-memory validation), composable (AndSpec.And(PremiumCustomerSpec)), testable (spec logic tested independently of DB), repository stays thin. Show Ardalis.Specification NuGet (complete Specification implementation for EF Core). Show building an ActivePremiumOrderSpecification. Cover that Specification reduces magic find methods proliferation. Cover that Specification can also be used for business rule validation (check spec.IsSatisfiedBy(entity) on aggregate).
```

---

### 13. Event-Driven Patterns

#### 13.1 Domain Events In-Process
```
Explain in-process domain events: notifications published within same process/transaction when something significant happens in domain. Raised by aggregates (Order.RaiseDomainEvent(new OrderPlacedEvent(this.Id, customerId))). Dispatched after SaveChanges (ensures events only fire if transaction committed — not before). Handlers in Application layer: INotificationHandler<OrderPlacedEvent> sends welcome email, INotificationHandler<OrderPlacedEvent> initiates payment processing. .NET pattern: IDomainEventDispatcher called in DbContext.SaveChangesAsync override (after base.SaveChangesAsync) — dispatches all domain events collected in entities. Cover that domain events are synchronous by default (in-process, before HTTP response) — move to integration events for async. Show MediatR INotification for domain event dispatch. Cover that in-process domain events should not span transactions (each handler in same transaction scope, or use integration events for cross-service).
```

#### 13.2 Integration Events
```
Explain Integration Events: events published to message broker for cross-service communication. Published AFTER transaction commits (Outbox Pattern ensures reliability). Properties: published to message broker (Kafka, RabbitMQ, Azure Service Bus), consumed by other services, schema must be stable and versioned, serialized (JSON, Protobuf, Avro). Distinction from Domain Events: domain events are in-process/technical, integration events are cross-service/public contracts. Mapping: domain event (OrderPlaced) → integration event (OrderPlacedIntegrationEvent) — may have different schema (integration event is the public API). Show the flow: aggregate raises OrderPlacedDomainEvent → domain event handler writes OrderPlacedIntegrationEvent to Outbox → Outbox relay publishes to message broker → other services consume. Cover that integration events are versioned and backward-compatible (once published, consumers may depend on schema).
```

#### 13.3 Event Dispatcher
```
Show implementing an event dispatcher in .NET: IDomainEventDispatcher.DispatchAsync(IReadOnlyCollection<IDomainEvent> events), MediatR-based implementation (publish each event as INotification), DomainEventsInterceptor for EF Core (override SaveChangesAsync: collect events from all tracked entities, call base.SaveChangesAsync(), dispatch events — ensuring events only fire on successful save). Cover that dispatcher collects events from all entity.DomainEvents before clearing them (avoid double dispatch on retries). Show clearing domain events after dispatch (entity.ClearDomainEvents()). Cover ordering: domain events dispatched in the order raised. Cover that dispatcher is infrastructure concern but events and interfaces are domain/application. Show registering all INotificationHandler<T> implementations via AddMediatR (automatic handler discovery).
```

#### 13.4 Transactional Outbox
```
Show Transactional Outbox implementation in .NET: OutboxMessage table (Id, Type, Data, CreatedAt, ProcessedAt), write to OutboxMessage in same EF Core transaction as business data (same DbContext.SaveChanges), IHostedService poller reads unprocessed messages, publishes to broker (MassTransit/RabbitMQ/Kafka), marks as processed. Show EF Core integration: override SaveChangesAsync to automatically write domain events to OutboxMessage table. Show OutboxProcessor IHostedService: select top N unprocessed messages, deserialize type and data, publish to broker, mark processed. Cover idempotency: published message may be delivered twice (broker failure between publish and mark processed) — consumers must be idempotent. Show MassTransit Outbox (built-in EF Core Outbox — near zero custom code). Cover that CAP NuGet (.NET) also provides Outbox + broker integration.
```

#### 13.5 Event Aggregator
```
Explain Event Aggregator pattern: central hub that all events go through — publishers don't know subscribers, subscribers don't know publishers. Different from Observer (Observer: subject and observers know each other), Mediator (Mediator: colleagues know mediator), Event Aggregator (completely decoupled — aggregator is anonymous hub). .NET implementations: Prism EventAggregator (WPF/MAUI — UI event decoupling), MediatR Publish (in-process event aggregator), Reactive Extensions Subject<T> (IObservable + IObserver combined — any number subscribe). Show Prism EventAggregator for MAUI: EventAggregator.GetEvent<OrderPlacedEvent>().Publish(order), EventAggregator.GetEvent<OrderPlacedEvent>().Subscribe(handler). Cover weak reference subscriptions (prevent memory leaks). Compare to domain event pattern: Event Aggregator is simpler, domain events are more DDD-aligned.
```

#### 13.6 Pub/Sub in .NET
```
Cover Publish-Subscribe patterns in .NET: in-process pub/sub (MediatR INotification + multiple INotificationHandler<T> — each handler independent, parallel execution option, synchronous by default), reactive pub/sub (Rx.NET Subject<T> — push-based observable, operators, backpressure), messaging pub/sub (MassTransit topic/exchange — cross-service, durable, at-least-once). Show MediatR notification with multiple handlers (OrderPlacedNotification → EmailNotificationHandler, InventoryReservationHandler, AnalyticsHandler — all run on one command dispatch). Cover parallel notification dispatch (MediatR allows configuring parallel handlers). Cover MassTransit publish (PublishContext, routing to multiple consumers via message type). Cover differences: in-process is synchronous (handlers run before response), messaging is async (handlers run eventually). Show choosing between them based on consistency requirements.
```

---

### 14. Functional Patterns in C#

#### 14.1 Immutability
```
Explain immutability in C#: objects whose state cannot be changed after creation. Benefits: thread-safety (no mutation = no race conditions), predictability (value doesn't change unexpectedly), easier reasoning (function doesn't modify inputs). C# features: record (immutable by default with init-only properties, with for non-destructive mutation), readonly struct (immutable value type), init accessor (can only be set during object initialization), ImmutableList/Dictionary (System.Collections.Immutable), required modifier (C# 11 — required init-only property). Show record Person(string FirstName, string LastName) — positional record with init-only properties, var updated = person with { FirstName = "Jane" }. Cover that immutability enables: memoization (same input = same output), safe sharing across threads, easy equality (compare by value). Cover that immutability works best for value objects and DTOs.
```

#### 14.2 Option / Maybe
```
Explain Option/Maybe type: represent presence or absence of a value without null. Two states: Some(value) or None. Benefits: forces explicit handling of absence (no NullReferenceException), makes nullability visible in type system. .NET: nullable reference types (#nullable enable — T? — compile-time null warnings), no built-in Option type (use LanguageExt NuGet, Optional NuGet, or custom). Show custom Option<T>: record Option<T> with implicit conversion from T, Match method, Map/Bind for transformation. Show Find pattern: Option<Order> GetById(Guid id) — caller must handle None case. Cover Option vs null: Option is explicit (caller knows result may be absent), null is implicit (caller may forget to check). Cover that C# nullable reference types (#nullable enable) approximate Option — use them as baseline. Cover that Option is most valuable when team adopts it consistently.
```

#### 14.3 Result Pattern
```
Explain Result pattern: explicit error handling without exceptions. Result<T, TError> (Success(value) or Failure(error)) makes errors part of type signature — caller must handle both paths. Benefits: errors visible in code (no hidden exception paths), composition (chain operations with errors short-circuiting), no exceptions for expected errors (domain validation, not-found). .NET: no built-in Result type — use OneOf NuGet, LanguageExt, ErrorOr NuGet, FluentResults NuGet, or custom. Show Result<Order, OrderError>: match { success => ok(success.Value), failure => badRequest(failure.Error) }. Cover Result vs exceptions: exceptions for unexpected (infrastructure failures, programming errors), Result for expected domain errors (validation failed, not found, business rule violation). Show chaining: PlaceOrder returns Result, ConfirmPayment takes Result input (short-circuits on failure). Cover ErrorOr<T> NuGet as popular .NET choice.
```

#### 14.4 Railway-Oriented Programming
```
Explain Railway-Oriented Programming (Scott Wlaschin): visualize code as two-track railway — success track and failure track. Normal operations on success track. Errors switch to failure track. Subsequent operations skipped on failure track. Implementation with Result: Bind (chain Result-returning functions — skip if failure), Map (transform success value — skip if failure), Tap (side effect on success — skip if failure). Show a pipeline: ValidateOrder → CheckInventory → ProcessPayment → SendConfirmation — each step may fail, subsequent steps skipped on failure. Cover that ROP eliminates nested if/else error checking (happy path is linear, errors handled uniformly). Show with FluentResults or custom Result chain. Cover that ROP is most valuable for multi-step pipelines where each step may fail for different reasons. Cover .NET 9 functional method chaining patterns.
```

#### 14.5 Monads in C#
```
Explain monads practically in C#: a design pattern for chaining operations in a context. A monad is any type with: unit/return (wrap value), bind/flatMap/SelectMany (chain operations). .NET monads: IEnumerable<T> (SelectMany chains sequences — LINQ is monadic), Task<T> (await chains async operations), Nullable<T> (?. chains nullable operations), Option<T> (Bind chains option-returning operations), Result<T,E> (Bind chains result-returning operations). Show that await is monadic: Task<int> a = ...; Task<string> b = a.ContinueWith(t => t.Result.ToString()) vs await a; var b = a.ToString() — same composition, different syntax. Cover that IEnumerable + LINQ is the most-used monad in .NET code. Cover that understanding monads helps understand LINQ, async/await, and functional libraries. Avoid academic math — focus on practical chaining pattern.
```

#### 14.6 Functional Pipelines
```
Show functional pipeline patterns in C#: LINQ as data transformation pipeline (source.Where(filter).Select(transform).GroupBy(key).OrderBy(sort) — each operation is pure, lazy), method chaining with extension methods (builder pattern as functional pipeline), pipe operator simulation (no native pipe in C#, use extension methods or custom Pipe<T> extension). Show processing order records pipeline: orders.Where(Active).Select(ToDto).Take(pageSize). Cover that functional pipelines are: composable (each stage is independent), lazy (LINQ doesn't execute until enumerated), testable (test each transformation independently). Cover that ASP.NET Core middleware is a functional pipeline (each middleware is a function: HttpContext → next → Task). Cover LINQ composition across layers (IQueryable pipeline built in application, executed in infrastructure). Cover that functional pipelines + immutable data = naturally thread-safe.
```

#### 14.7 Pure Functions
```
Explain pure functions: same inputs → same outputs, no side effects (no mutation, no I/O, no exceptions). Benefits: testable (no mocking needed — just call with inputs, assert outputs), composable, parallelizable (no shared state), cacheable (memoize pure functions), predictable. Isolating side effects: push side effects to the edges (I/O at boundaries, pure core — Functional Core, Imperative Shell). Show a domain service as pure function: CalculateDiscount(order, customer, promotions) → Money — no DB calls, no emails, just computation. Cover that pure functions are testable without any setup (no mocks, no DI, no DB). Show .NET application layering with pure core: domain layer = pure (entities + value objects + domain services), application layer = orchestrates pure core with side-effectful infrastructure, infrastructure = all side effects. Cover memoization with pure functions (ConcurrentDictionary.GetOrAdd for thread-safe memoization).
```

---

### 15. Enterprise Integration Patterns

#### 15.1 Message Channel
```
Explain Message Channel pattern (EIP): pipe connecting sender and receiver. Types: Point-to-Point Channel (exactly one receiver per message — work queue), Publish-Subscribe Channel (all subscribers receive copy — event notification), Datatype Channel (all messages of same type on one channel — type-based routing), Dead Letter Channel (undeliverable messages — DLQ), Guaranteed Delivery Channel (durable persistence — messages survive broker restart), Invalid Message Channel (malformed messages routed here). .NET: RabbitMQ queues (Point-to-Point), exchanges (Pub/Sub), Azure Service Bus queues vs topics, Kafka topics (Point-to-Point with consumer groups, Pub/Sub with multiple groups). Show using MassTransit to configure endpoint topology mapping to channels. Cover that channel selection is fundamental to messaging architecture.
```

#### 15.2 Message Router
```
Explain Message Router pattern: route message to correct channel based on content or metadata. Types: Content-Based Router (inspect message content, route to appropriate handler — if order.Amount > 1000, route to FraudCheck channel), Message Filter (only pass messages meeting criteria — discard others), Splitter (split one message into many), Recipient List (route to multiple channels), Dynamic Router (routing rules configurable at runtime). .NET: MassTransit message routing (route by message type automatically), RabbitMQ topic exchange routing (route by routing key pattern), custom routing in consumer (read message, decide next action). Show content-based router: consume all orders, route large orders to fraud check topic, normal orders to fulfillment topic. Cover that message routers should be thin (routing logic only, no business logic). Show MassTransit routing slip for dynamic routing.
```

#### 15.3 Message Translator
```
Explain Message Translator (EIP): translate message format between applications with different data formats. Acts as adapter between messaging systems. Types: Envelope Wrapper (wrap message in envelope with metadata), Claim Check (store large payload externally, pass reference in message — S3 claim check), Content Enricher (add missing data from external sources — enrich order with customer details), Content Filter (remove unnecessary fields — filter PII before external routing), Format Translator (JSON → XML, v1 schema → v2 schema). .NET: MassTransit message serialization pipeline (transformers), custom consumer that reads and republishes translated message, AutoMapper for DTO translation, Schema Registry upcasting. Show Claim Check with Azure Blob: large payload stored in Blob, message contains URI reference — consumer fetches payload from Blob. Cover that translators should be stateless and testable.
```

#### 15.4 Aggregator
```
Explain Aggregator pattern (EIP): collect and store individual messages until complete set received, then release combined message. Use cases: collect all line items for an order (split and aggregate), collect votes and release when all received, wait for N parallel processing results and combine. Components: correlation identifier (how to match related messages), completeness condition (when to release — count, timeout, sentinel message), aggregation strategy (how to combine). .NET: MassTransit has no built-in aggregator — implement with Redis/DB-backed state store (store partial aggregation, check completeness). Show Saga as aggregator: OrderItemsAggregateSaga collects ItemShipped events until all items shipped, then publishes OrderFullyShipped. Cover timeout handling (release partial aggregate after deadline). Cover that Aggregator is stateful — must persist state for reliability.
```

#### 15.5 Splitter
```
Explain Splitter pattern: split one message containing multiple items into individual messages. Use cases: order with multiple items → one message per item, batch file → individual records, bulk request → individual requests. Types: simple splitter (one input message → N output messages), resequencer (splitter inverse — restore order after parallel processing), composed message processor (splitter → parallel processing → aggregator). .NET: MassTransit Batch (consume batch, publish individual messages), custom consumer (receive batch, publish N individual messages). Show processing a batch import file: consume BatchImportedEvent (contains file path), read file, publish ImportItemCommand for each row. Cover that splitter output should include correlation ID to match with aggregator if needed. Cover that Splitter enables parallelism (items processed independently in parallel).
```

#### 15.6 Scatter-Gather
```
Explain Scatter-Gather pattern: broadcast request to multiple recipients (scatter), aggregate responses (gather). Use cases: price comparison (request price from N providers simultaneously, return best), search aggregation (query N search indexes, merge results), distributed computation (split work across nodes, aggregate results). Components: Scatter (publish request to all recipients), Gather (aggregate/Aggregator waiting for all/enough responses), Timeout (don't wait forever — accept partial results after timeout). .NET: Task.WhenAll for in-process scatter-gather (parallel HttpClient calls to N services), MassTransit routing slip for distributed scatter-gather. Show product price comparison: PublishToAll(PriceRequestedEvent), PriceResponseAggregator collects N responses with 5s timeout, returns best price. Cover hedging as scatter-gather where first response wins (send to 3 servers, use fastest, cancel others).
```

#### 15.7 Process Manager / Saga
```
Explain Process Manager (EIP) / Saga pattern: coordinate complex multi-step processes involving multiple services/systems. Maintains process state, knows which step is next, handles failures with compensations. Difference from Orchestration Saga: Process Manager is a pure EIP routing construct (doesn't contain domain logic — just coordinates message flow), Orchestration Saga contains domain-level coordination logic. .NET: MassTransit SagaStateMachine is both Process Manager and Saga (state machine coordinates process + contains some coordination logic). Show a multi-step order fulfillment Process Manager: OrderPlaced → InventoryReserved → PaymentCharged → ShippingInitiated — each step triggered by previous step's completion event, failures route to compensation flow. Cover persistence (process state in DB — survives restarts), correlation (correlate related messages via ID), timeout (auto-cancel if step not completed in time).
```

#### 15.8 Competing Consumers
```
Explain Competing Consumers pattern: multiple consumers competing to process messages from same queue. One message processed by exactly one consumer (first to receive wins). Benefits: horizontal scaling (add more consumers to increase throughput), fault tolerance (consumer crashes, others continue), work distribution (slow consumer processes less). .NET: any queue-based consumer runs in parallel when multiple instances deployed (RabbitMQ, Azure Service Bus, Kafka with consumer group). Show that Kubernetes deployment with 3 replicas = 3 competing consumers. Cover prefetch count (how many messages consumer receives before ACK — higher = more parallelism within one consumer). Cover that Competing Consumers is natural for work queues (tasks, job processing, import pipelines). Cover ordering constraint (competing consumers break message ordering — use Kafka partition assignment for ordered processing). Show MassTransit concurrent consumer limit (UseConcurrentMessageLimit).
```

#### 15.9 EIP in .NET
```
Map EIP patterns to .NET libraries: MassTransit (Message Router, Scatter-Gather, Competing Consumers, Saga/Process Manager, Dead Letter handling, Outbox, middleware pipeline), Rebus (simpler than MassTransit, supports multiple transports, similar patterns), NServiceBus (enterprise-grade, Saga, Polymorphic routing, all EIP patterns), Azure Service Bus SDK (sessions for ordered processing, transactions, DLQ). Show MassTransit endpoint configuration mapping to EIP channels. Cover that MassTransit is the most popular .NET messaging abstraction (RabbitMQ, Kafka, Azure Service Bus, SQS, AmazonMQ all supported). Show building a complete order processing system using EIP patterns and MassTransit. Cover that EIP vocabulary (channels, routers, translators) maps directly to MassTransit concepts (endpoints, routing, middleware). Cover Rebus as lighter alternative for simpler use cases.
```

---

### 16. Architectural Patterns

#### 16.1 Layered Architecture
```
Explain N-Tier / Layered Architecture: horizontal layers with dependency rule (each layer depends only on layer below). Classic 3-Tier: Presentation (UI, Controllers) → Business Logic (Services, Domain) → Data Access (Repositories, ORM). Extended to N layers. Benefits: separation of concerns, familiar to developers, clear layer ownership. Problems: anemic domain model (business logic leaks to service layer, domain is just data bags), changes ripple through all layers (DB column change → repository → service → controller), coupling to DB schema, hard to test (layers tightly coupled). Cover that Layered Architecture works for simple CRUD but struggles with complex business logic. Show evolution: Layered → Clean Architecture (flip dependency — business logic doesn't depend on data layer). Cover that many "Layered" apps are actually distributed monoliths when the "layers" become separate deployable services.
```

#### 16.2 Microkernel Architecture
```
Explain Microkernel (Plugin) Architecture: core system (kernel) + plug-in modules. Core: minimal functionality, stable, defines extension points. Plugins: independent, extend core functionality, can be added/removed at runtime. Examples: Eclipse IDE (plugin system), VS Code extensions, browser extensions, .NET MEF (Managed Extensibility Framework). .NET: MEF (System.ComponentModel.Composition — export/import attributes for plugin discovery), .NET Generic Host (IHostedService plugins), ASP.NET Core middleware (each middleware is a plugin to the pipeline). Show building a reporting engine with plugin architecture: IReportPlugin interface, plugins discovered and loaded at runtime (MEF or custom assembly loading). Cover that microkernel isolates core from plugins — core changes don't break plugins (stable core = good OCP example). Cover that microkernel works well for extensible product software (ERP, CMS, developer tools).
```

#### 16.3 Pipe and Filter
```
Explain Pipe and Filter Architecture: processing in a sequence of independent filter steps connected by pipes (data flows through). Each filter: reads input from pipe, transforms, writes to next pipe. Filters are: independent (don't know other filters), composable (any filter can connect to any compatible filter), reusable. Examples: Unix pipes (ls | grep | sort | head), LINQ pipeline, ASP.NET Core middleware, Kafka Streams. .NET: IEnumerable<T> LINQ (each operator is a filter), async pipeline with Channel<T> (each stage is a filter reading from input Channel, writing to output Channel), TPL Dataflow (TransformBlock as filter, BufferBlock as pipe). Show a document processing pipeline: ReadDocument → ParseContent → ExtractEntities → EnrichFromDB → IndexToSearch — each stage reads from previous Channel, processes, writes to next Channel. Cover that Pipe and Filter is excellent for data processing and ETL workloads.
```

#### 16.4 Event-Driven Architecture
```
Explain Event-Driven Architecture (EDA) broadly: services communicate through events, not direct calls. Two patterns: Event Notification (services notify of state changes — receiver decides what to do — loose coupling, but hard to see full flow), Event-Carried State Transfer (events carry full state — no need to call back for data — enables temporal decoupling), Event Sourcing (events ARE the state — append-only log). Event Mesh: infrastructure for routing events across services (Kafka, Azure Event Hubs, AWS EventBridge). Cover EDA benefits: temporal decoupling, resilience (events queued if consumer down), scalability (consumers scale independently), extensibility (add new consumer without modifying producer). Cover EDA challenges: eventual consistency, complex error handling, debugging across services. .NET: MassTransit/Kafka for event publishing, MediatR for in-process events, EventStoreDB for event sourcing.
```

#### 16.5 Space-Based Architecture
```
Explain Space-Based Architecture: achieve near-infinite scalability by eliminating central database as bottleneck. Components: Processing Units (application servers — contain in-memory data grid, business logic), Virtualized Middleware (messaging grid, data grid, processing grid — coordinates PUs), Data Pumps (async writes from in-memory grid to DB — non-blocking writes). Each PU has own copy of data — reads from local memory (no DB read latency), writes go to DB asynchronously. Used in: high-frequency trading, large-scale gaming, real-time analytics. .NET relevance: Microsoft Orleans (virtual actor model — each grain has own in-memory state — Space-Based-like), Redis as in-memory grid with async persistence. Cover that Space-Based is complex and expensive — justified only for extreme scale. Cover that .NET Cache-Aside pattern with Redis + async DB write is a simplified version.
```

#### 16.6 Serverless Patterns
```
Cover serverless architecture patterns for .NET: Function-as-a-Service (Azure Functions, AWS Lambda — stateless function per event, billed per invocation), cold start mitigation (pre-warmed instances, .NET Native AOT for fast startup), serverless patterns (HTTP trigger for API, Queue trigger for async work, Timer trigger for scheduled, Event Grid for reactive, Durable Functions for stateful workflows). Show Durable Functions patterns: Function Chaining (sequential steps), Fan-Out/Fan-In (parallel work + aggregation), Async HTTP API (202 Accepted + polling), Monitor (poll until condition met), Human Interaction (wait for external approval). Cover that serverless shifts infrastructure management to cloud — tradeoffs: cold starts, timeout limits, stateless constraints. Cover that .NET Native AOT reduces Lambda cold starts (100ms vs 1s+ for JIT). Show a complete Durable Functions order processing workflow in .NET.
```

#### 16.7 Modular Monolith
```
Explain Modular Monolith: single deployable unit with strong internal module boundaries. Not a microservices architecture, not a big ball of mud. Modules: separate assemblies or namespaces, each module owns its domain, modules communicate via interfaces and domain events (no direct reference between module internals), shared nothing (no shared DB tables between modules — each module has own DB schema). Benefits vs microservices: simpler deployment (one process), in-process calls (no network), ACID transactions across modules, simpler debugging. Benefits vs unstructured monolith: clear ownership, independent module development, refactorable into microservices. .NET: separate C# projects per module (enforces compilation-time independence), shared event bus for inter-module events (MediatR in-process), separate EF Core DbContext per module. Show project structure. Cover extracting modules to microservices when justified (Strangler Fig at module level).
```

---

### 17. API Design Patterns

#### 17.1 RESTful Resource Design
```
Cover RESTful resource design: nouns not verbs (/orders not /createOrder), resource hierarchy (/orders/{id}/items), stable URLs (don't change after clients adopt), proper HTTP methods (GET/POST/PUT/PATCH/DELETE with correct semantics), status codes (201 Created with Location header, 204 No Content for DELETE). Cover sub-resources vs query parameters (filter with params: /orders?status=active, sub-resource for relationship: /orders/{id}/items). Cover resource naming: plural nouns (/orders), lowercase, hyphens for multi-word (/order-items), avoid deeply nested (/orders/{id}/items not /customers/{cid}/orders/{oid}/items/{iid}). Show ASP.NET Core Minimal API routes following these conventions. Cover that REST is a style guide not a strict standard — be consistent within your API. Cover that "RESTful" ≠ HTTP CRUD — REST includes statelessness, cacheability, HATEOAS.
```

#### 17.2 Request-Response vs Fire-and-Forget
```
Compare API interaction patterns: Request-Response (client sends request, waits for response — synchronous — simple, immediate feedback, couples client to server availability), Fire-and-Forget (client sends request, gets immediate acknowledgment, result delivered later via callback/webhook/polling — asynchronous — decoupled, resilient, complex client). Decision factors: response needed immediately (checkout total, search results → request-response), operation takes long time (video processing, report generation, email sending → fire-and-forget), operation may fail and needs retry (payment processing → consider async), client can be disconnected (mobile push notifications → async). ASP.NET Core: request-response = synchronous controller action, fire-and-forget = enqueue to MassTransit + return 202 Accepted. Cover that mixing patterns in same API is valid (fast operations sync, slow async).
```

#### 17.3 Async API Pattern
```
Show Long-Running Operations / Async API pattern (202 Accepted): client submits request → server returns 202 Accepted with job ID + status URL (Location header), client polls status URL → server returns {status: "processing"} or {status: "completed", result: ...}. Or: webhook callback (server calls client URL when done). .NET: ASP.NET Core endpoint returns 202 + starts background job (MassTransit / Hangfire / BackgroundService), polling endpoint checks job status from Redis/DB. Show complete flow: POST /reports → 202 Accepted + Location: /reports/{jobId}, GET /reports/{jobId} → {status: "completed", result: {url: "/reports/{jobId}/download"}}. Cover retry-after header (tell client when to poll next). Cover that 202 with polling is REST-native async pattern. Cover SignalR as push-based alternative (server pushes completion instead of client polling).
```

#### 17.4 Idempotency Keys
```
Explain idempotency keys for safe retries: client generates unique key per operation, sends in header (Idempotency-Key: uuid), server stores result of first execution, subsequent requests with same key return cached result. Critical for: payment processing (double charge on retry), order creation (duplicate orders), any non-idempotent operation that must be retried safely. Server implementation: check if idempotency key exists in cache (Redis) → return cached response; if not, execute operation, store result with key and TTL. Cover that response must be stored (not just "processed"), cover TTL (how long to remember — 24 hours typical). Show ASP.NET Core idempotency middleware. Cover Stripe API as reference implementation. Cover that GET/DELETE are naturally idempotent — only POST/PUT/PATCH with side effects need idempotency keys. Show generating idempotency keys client-side in .NET HttpClient.
```

#### 17.5 Pagination Patterns
```
Cover pagination patterns: Offset pagination (SKIP N TAKE M — simple, widely understood, slow for large offsets, inconsistent under concurrent writes), Keyset/Cursor pagination (WHERE id > lastId TAKE M — fast at any depth, stable under writes, requires unique sort key, can't jump to arbitrary page), Page-based (page=2&size=20 — maps to offset internally), Token-based (opaque cursor token encodes position — best for API clients — hides implementation). Show ASP.NET Core endpoint with keyset pagination: GET /orders?afterId={lastOrderId}&limit=20 → returns orders + nextCursor. Cover that cursor should be opaque to client (base64 encode internal state). Cover total count: expensive for keyset, possible for offset (add extra count query). Show EF Core keyset: .Where(o => o.Id > lastId).Take(pageSize). Cover infinite scroll vs page buttons (keyset for infinite scroll, offset for page buttons).
```

#### 17.6 API Versioning
```
Show API versioning strategies: URL path (/v1/orders — simple, visible, cache-friendly, forces client to update URL), Query string (?api-version=1.0 — optional, doesn't change URL), Header (Api-Version: 1.0 — clean URL, not cacheable by default, harder to test in browser), Media type (Accept: application/vnd.myapi.v1+json — RESTful purists, complex). .NET: Asp.Versioning NuGet (supports all strategies, configure in one place), ApiVersion attribute on controller, [MapToApiVersion], deprecated versions. Cover versioning scope: full API version vs endpoint version (some endpoints stable, others evolve). Cover that major version changes break contracts, minor are additive. Cover sunset header (Deprecation: true, Sunset: Sat, 01 Jan 2025 00:00:00 GMT — tell clients when version ends). Show migration path: new version alongside old, traffic monitoring, sunset old version.
```

#### 17.7 HATEOAS
```
Explain HATEOAS (Hypermedia as the Engine of Application State): API responses include links to related actions. Client discovers available operations from response, not from documentation. Example: GET /orders/123 returns order + links: {self: /orders/123, cancel: /orders/123/cancel, pay: /orders/123/payment}. Available links reflect current state (only cancel link if order is cancellable, not if already shipped). Benefits: client decoupled from server URL structure, evolve API without client changes, self-documenting. Implementation: Siren media type, HAL (Hypertext Application Language — _links object in response), or custom link format. .NET: Halcyon NuGet (HAL format), custom link generation with IUrlHelper. Cover that HATEOAS is rarely implemented in practice (complexity vs value), but partial HATEOAS (add key links without full discovery) is useful for large public APIs. Cover Richardson Maturity Model Level 3 (HATEOAS).
```

#### 17.8 Problem Details
```
Show RFC 7807 Problem Details as standard error format: JSON object with type (URI — identifies error type), title (human-readable summary), status (HTTP status code), detail (human-readable explanation specific to occurrence), instance (URI identifying specific occurrence). Extension fields for domain-specific info (validation errors, trace IDs). .NET: ProblemDetails class built into ASP.NET Core, automatic ProblemDetails for model validation errors ([ApiController] + UseExceptionHandler with ProblemDetails). Show ValidationProblemDetails with errors dictionary (field → error messages array). Show domain exception → ProblemDetails mapping via IExceptionHandler (.NET 8). Cover that Problem Details standardizes error format across APIs — clients can programmatically distinguish error types (type URI acts as error code). Show adding trace ID to ProblemDetails for support correlation. Cover Content-Type: application/problem+json for proper content negotiation.
```

---

### 18. Testing Patterns

#### 18.1 Test Pyramid
```
Explain Test Pyramid: base (many unit tests — fast, isolated, cheap), middle (integration tests — test multiple components together), top (few E2E tests — slow, fragile, expensive). Rationale: unit tests catch most bugs cheaply, integration tests catch wiring bugs, E2E tests verify complete user journeys. .NET test counts guidance: 70% unit (milliseconds each), 20% integration (seconds each), 10% E2E (minutes each). Modern variant: Test Trophy (Kent Dodds — integration tests in the middle, fewer pure unit tests — more realistic). Cover what each level tests: unit (pure business logic, algorithms), integration (service + real DB, service + real queue, HTTP endpoints with real DI), E2E (browser automation with Playwright, API smoke tests). Cover that integration tests with Testcontainers (real DB in Docker) replace many E2E tests. .NET: xUnit, NUnit, MSTest — all equivalent for test pyramid.
```

#### 18.2 AAA Pattern
```
Explain AAA (Arrange-Act-Assert) pattern: standard unit test structure. Arrange (set up SUT, create test data, configure mocks), Act (call the method under test — single call), Assert (verify expected outcomes — one concept per test ideally). Cover the single-Act principle (one action per test — makes failures obvious). Cover test naming: MethodName_StateUnderTest_ExpectedBehavior or Given_When_Then. Show that each AAA section should be visually separated (blank lines). Cover overly complex Arrange (code smell — test harder to understand, SUT may have too many dependencies). Cover multiple assertions per test (acceptable if testing one concept with multiple assertions, not if testing multiple unrelated things). Cover that .NET's xUnit [Fact] for single test, [Theory] + [InlineData] for parameterized tests. Show a complete well-structured AAA test.
```

#### 18.3 Test Doubles
```
Cover test doubles (Meszaros terminology): Dummy (passed but never used — satisfies parameter requirement), Stub (returns pre-configured responses — control SUT's indirect inputs — IOrderRepository stub returns specific order), Fake (working but simplified implementation — InMemoryOrderRepository, FakeEmailService), Mock (verifiable — configured with expectations, verified — Moq setup + verify), Spy (records calls for later assertion — real implementation with recording). Show Moq: Mock<IOrderRepository>.Setup(r => r.GetByIdAsync(orderId)).ReturnsAsync(order), Mock<IEmailService>.Verify(e => e.SendOrderConfirmationAsync(orderId, email), Times.Once()). Cover that over-mocking = fragile tests (coupling to implementation). Prefer Fakes over Mocks when fake is simple. Prefer real implementations (SQLite in-memory, test containers) over mocks for DB. NSubstitute as Moq alternative (slightly cleaner syntax).
```

#### 18.4 Test Data Builder
```
Explain Test Data Builder pattern: fluent builder for creating test objects with reasonable defaults that can be overridden. OrderBuilder.AnOrder().WithCustomer(customerId).WithItems(3).WithStatus(OrderStatus.Placed).Build(). Benefits: readable tests (express intent, not mechanics), maintainable (default values in one place — schema changes require only builder updates, not every test), flexible (override only relevant fields). Show .NET implementation: OrderBuilder class with fluent methods returning this, Build() creating Order. Cover Bogus NuGet (generates realistic fake data — names, emails, addresses, with seed for reproducibility — faker.Name.FirstName()). Cover that Test Data Builders work with both entities and DTOs. Show combining: OrderBuilder.AnOrder().Build() for happy path, OrderBuilder.AnOverdueOrder().Build() for specific scenario. Cover that Builders are most valuable when objects have many properties.
```

#### 18.5 Object Mother
```
Explain Object Mother pattern: class that knows how to create domain objects for testing. Differs from Builder (static factory methods, less flexible, great for named scenarios). OrderMother.PlacedOrder() → returns a fully configured placed order, OrderMother.ShippedOrder() → shipped order. Benefits: named scenarios (intent-revealing), reuse (one place for common test object creation). Show .NET implementation: static class with static factory methods returning domain objects. Cover that Object Mother and Builder complement each other: Object Mother for named common scenarios, Builder for custom variations. Cover that Object Mother methods should reflect domain scenarios (not technical states). Cover combined use: var order = OrderBuilder.From(OrderMother.PlacedOrder()).WithCustomer(specificCustomer).Build(). Cover that Object Mothers become a shared vocabulary for the team — "create a placed order" means something specific.
```

#### 18.6 Test Fixtures
```
Cover test fixture patterns in .NET: xUnit: IClassFixture<T> (shared fixture per test class — database connection shared across tests in class), ICollectionFixture<T> (shared fixture across multiple test classes — [Collection] attribute), constructor/Dispose for per-test setup/teardown. NUnit: [OneTimeSetUp]/[OneTimeTearDown] for class-scoped setup, [SetUp]/[TearDown] for method-scoped. MSTest: [ClassInitialize]/[ClassCleanup], [TestInitialize]/[TestCleanup]. Cover Testcontainers for .NET (Testcontainers NuGet — spin up real PostgreSQL/Redis/RabbitMQ in Docker for integration tests — dispose = container removed — no persistent test DB needed). Show DatabaseFixture with Testcontainers: create container once per test class, clean DB between tests (Respawn NuGet — fast DB reset). Cover test parallelism (xUnit runs test classes in parallel by default — shared state = race conditions).
```

#### 18.7 Property-Based Testing
```
Explain property-based testing: instead of specific examples, define properties that must hold for any valid input, test framework generates hundreds of cases. Example: any valid order total must equal sum of item prices (property — tested with 100 random orders). Advantages over example-based: finds edge cases you didn't think of, provides much more coverage per test, forces thinking in invariants. .NET: FsCheck (F# inspired, works from C# — Arbitrary generators, Prop.ForAll), CsCheck (pure C# implementation). Show property: AddOrder(items).Total == items.Sum(i => i.Price * i.Quantity) — FsCheck generates random item lists. Cover shrinking (when failure found, FsCheck minimizes input to smallest failing case — excellent bug diagnosis). Cover that properties test invariants: commutativity (a+b = b+a), idempotency (apply twice = apply once), round-trip (serialize then deserialize = original). Show combining property-based with unit tests (unit tests for specific business rules, property-based for mathematical properties).
```

#### 18.8 Architecture Testing
```
Show architecture testing with NetArchTest.Rules: enforce architectural constraints as tests (ensures architecture degrades gracefully, not suddenly). Rules: types in Domain layer have no dependencies on Infrastructure (Types().That().ResideInNamespace("MyApp.Domain").ShouldNot().HaveDependencyOn("MyApp.Infrastructure")), controllers don't use DbContext directly (Types().That().HaveNameEndingWith("Controller").ShouldNot().HaveDependencyOn("Microsoft.EntityFrameworkCore")), all services are in correct namespace. Benefits: architecture documented as tests (not just diagrams), violations caught in CI, new developers can't accidentally break boundaries. Cover that NetArchTest checks compilation-time dependencies (references). Cover NDepend for more advanced dependency analysis. Show a complete architecture test suite verifying Clean Architecture layer dependencies. Cover that architecture tests are cheap to run (milliseconds) and prevent expensive architectural debt.
```

#### 18.9 Mutation Testing
```
Explain mutation testing: automatically introduce bugs (mutants) into code, run test suite against each mutant — if tests still pass, the mutant survived (tests are missing). Mutation score = killed mutants / total mutants. Mutants: change > to >=, flip && to ||, remove method call, change return value. Why: 100% code coverage doesn't mean good tests (tests may not assert anything meaningful) — mutation testing reveals test quality. .NET: Stryker.NET (dotnet stryker command — runs mutations, reports surviving mutants, shows which lines lack meaningful assertions). Cover that mutation testing is slow (each mutation = full test run) — run on CI, not local. Cover that not all surviving mutants are real problems (equivalent mutants = behavior-identical code changes). Cover targeting mutation testing at critical business logic (not infrastructure boilerplate). Show interpreting Stryker report: surviving mutants show exactly where assertions are missing.
```

#### 18.10 Contract Testing
```
Explain Consumer-Driven Contract Testing: consumer defines what it needs from an API (contract), provider tests verify they satisfy all consumer contracts. Benefits: catch API breaking changes before they reach production, consumers and providers can evolve independently, no shared test environment needed. Pact: consumer writes Pact test (defines expected requests/responses), Pact file (JSON) shared with provider, provider verifies Pact file in its test suite. .NET: PactNet NuGet (both consumer and provider sides). Show consumer test: define interaction (given order exists, when GET /orders/123, then 200 with specific body), generate Pact file. Show provider test: start API, replay Pact interactions, verify responses match. Cover Pact Broker (central repository for Pact files — PactFlow SaaS or self-hosted). Cover that contract testing replaces many E2E tests. Cover that .NET providers must register provider states (given: "order exists" → seed test DB with order).
```

---

### 19. Performance Patterns

#### 19.1 Cache-Aside Pattern
```
Explain Cache-Aside (Lazy Loading) pattern: application code manages cache explicitly. Read: check cache → if hit return, if miss load from DB → store in cache → return. Write: write to DB → invalidate cache (or update cache). Benefits: only cached data accessed recently, resilient (cache miss = DB call, cache failure = graceful degradation), flexible TTL per item. .NET: IMemoryCache (local, single instance), IDistributedCache / Redis (distributed, multi-instance). Show complete cache-aside: check IDistributedCache.GetStringAsync, deserialize, return; on miss: query DB, serialize, IDistributedCache.SetStringAsync with TTL, return. Cover TTL selection (how stale is acceptable?). Cover cache stampede (many simultaneous misses — SemaphoreSlim per key to allow only one DB call). Cover that cache invalidation is hard — use short TTL + eventual consistency rather than complex invalidation. Show Microsoft.Extensions.Caching integration.
```

#### 19.2 Read-Through & Write-Through
```
Explain Read-Through and Write-Through cache patterns: cache sits in front of DB, application only talks to cache. Read-Through: cache fetches from DB on miss automatically (application doesn't know about miss — cache handles it). Write-Through: every write goes to cache AND DB synchronously — cache always current, no stale reads, slower writes. Write-Around: writes go to DB, bypass cache — next read is a cache miss (for write-heavy, read-rare data). Compare to Cache-Aside: Cache-Aside = app manages cache explicitly, Read/Write-Through = cache manages itself (app talks to cache abstraction). .NET: no built-in read-through/write-through abstraction — implement via IRepository decorator (cache layer wraps DB layer transparently). Redis Cache can be configured as write-through. Cover that write-through increases write latency (must write both cache and DB) — weigh against consistency benefits.
```

#### 19.3 Write-Behind Cache
```
Explain Write-Behind (Write-Back) pattern: write to cache immediately, write to DB asynchronously later. Fast writes (return as soon as cache is updated, DB write happens in background), eventual persistence (risk of data loss if cache fails before DB write). Use cases: high-write, read-heavy workloads where DB write latency is a bottleneck (activity feed counters, view counts, game scores). Implementation: write to Redis, background worker reads from Redis write queue, flushes to DB in batches (more efficient than one DB write per update). Cover data loss risk: cache failure between write and DB flush = data loss. Mitigation: Redis AOF persistence (Redis writes to disk — reduces loss window), replication. .NET: custom IHostedService that periodically flushes Redis write queue to DB. Cover that Write-Behind trades durability for performance — use only where loss is acceptable (counters, non-critical metrics).
```

#### 19.4 Lazy vs Eager Loading
```
Cover Lazy vs Eager Loading performance patterns: Eager Loading (load related data upfront in one query — Include in EF Core — reduces round trips, loads potentially unneeded data), Lazy Loading (load related data on first access — N+1 queries risk — simple code, avoid in high-throughput scenarios), Explicit Loading (load on demand when needed — controlled — no N+1 if done carefully). .NET EF Core patterns: Include() / ThenInclude() for eager, .Entry().Collection().LoadAsync() for explicit. Performance guide: fetch only what's needed (projection > Include for read scenarios — .Select(o => new OrderDto {...}) is fastest), use AsSplitQuery() when Include causes Cartesian explosion, use explicit loading for conditional related data. Cover that lazy loading via proxies is dangerous in web APIs (N+1 by default, no visibility). Cover that the best loading strategy depends on access patterns — measure with actual query counts.
```

#### 19.5 Throttling Pattern
```
Explain Throttling pattern: control rate of resource consumption. Client-side throttling (limit own request rate to API), server-side throttling (limit requests received per client). Client-side: rate limiter per outbound API (SemaphoreSlim-based token bucket, track requests per second, wait if rate exceeded). Server-side: ASP.NET Core rate limiting middleware (.NET 7+). Cover exponential backoff on 429 Too Many Requests response (respect Retry-After header). Show client-side throttle with channel: all requests go to channel (bounded), worker drains at max-requests-per-second rate. Cover throttling policy per client tier (free tier: 100 req/min, paid tier: 10,000 req/min). Cover adaptive throttling (reduce rate when seeing high latency from downstream — prevent overloading recovering service). Show Polly rate limiter strategy for outbound calls. Cover that throttling differs from rate limiting (throttling = slow down, rate limiting = reject excess).
```

#### 19.6 Competing Consumers for Scale
```
Explain Competing Consumers pattern for performance: scale processing by running multiple consumers against same queue. Linear scaling (2x consumers ≈ 2x throughput up to saturation). Use: CPU-bound processing (image resize, PDF generation — scale consumers to core count), I/O-bound processing (API calls, DB queries — scale consumers well beyond core count). .NET: multiple IHostedService instances (separate threads), Kubernetes Horizontal Pod Autoscaler (scale based on queue depth metric), Azure Functions scale controller (auto-scales based on queue length). Cover consumer count tuning: CPU-bound (consumers = CPU cores), I/O-bound (consumers = concurrency that saturates I/O without overwhelming downstream). Cover that too many consumers can overload downstream (DB, external API) — throttle consumer concurrency. Show Hangfire with BackgroundJobServerOptions.WorkerCount, MassTransit consumer concurrent message limit.
```

#### 19.7 Static Content Hosting & CDN
```
Cover Static Content Hosting and CDN pattern: serve static files from edge servers near users instead of origin server. CDN: global network of edge servers, caches static content, serves from nearest PoP (Point of Presence) — drastically reduces latency (100ms → 5ms), offloads origin server (90% of traffic served from CDN), absorbs traffic spikes. .NET implementation: Azure Static Web Apps / Azure Blob Storage + Azure CDN, AWS S3 + CloudFront, Cloudflare. Cache headers: Cache-Control: public, max-age=31536000 (1 year) for versioned assets (hashed filenames), Cache-Control: no-cache for HTML (check for updates). Content: HTML, CSS, JS, images, fonts, downloadable files. .NET Core: app.UseStaticFiles() for local serving + cache headers, or publish static files to CDN. Cover cache busting (append hash to filename — style.abc123.css — old filename = old cache entry). Cover that CDN also provides DDoS protection, SSL termination, and WAF.
```

#### 19.8 Data Locality
```
Explain Data Locality pattern: keep computation near data to minimize data transfer cost. Principles: move computation to data (not data to computation), colocate services with their primary databases (same cloud region, ideally same AZ), cache at the edge (compute cache near where it's consumed), partition data so queries hit local partition. .NET examples: run EF Core queries close to DB (not transferring large result sets over network — push filtering, sorting, grouping to DB via LINQ-to-SQL), colocate Azure Function with Azure SQL in same region, use Redis local to compute cluster (not cross-datacenter). Cover NUMA (Non-Uniform Memory Access) in multi-socket servers: keep computation on same NUMA node as its data. Cover that cloud egress costs make data locality financially important (cross-region data transfer costs money). Cover that microservices should own their data (locality at service level — no cross-service DB reads).
```

---

### 20. Refactoring Patterns & Code Smells

#### 20.1 Code Smells
```
Cover Martin Fowler's code smells taxonomy: Bloaters (Long Method, Large Class, Long Parameter List, Data Clumps, Primitive Obsession — classes/methods too big), OO Abusers (Switch Statements, Temporary Field, Refused Bequest, Alternative Classes with Different Interfaces — poor OOP use), Change Preventers (Divergent Change, Shotgun Surgery, Parallel Inheritance Hierarchies — each change requires many edits), Dispensables (Comments, Duplicate Code, Lazy Class, Data Class, Dead Code, Speculative Generality — unnecessary code), Couplers (Feature Envy, Inappropriate Intimacy, Message Chains, Middle Man — over-coupling). Show each smell in C# code. Cover that smells are indicators (may be acceptable in context — evaluate before refactoring). Cover that smells compound (Long Method + Large Class + Primitive Obsession = god class anti-pattern).
```

#### 20.2 Extract Method & Class
```
Show Extract Method and Extract Class refactoring: Extract Method (take code fragment, put in new method with explaining name — reduces Long Method smell, improves readability), Extract Class (take part of class into new class — reduces Large Class smell, improves SRP). Show step-by-step Extract Method in C#: identify cohesive code block, determine parameters and return value, create method, replace block with method call. Show Extract Class: identify cohesive group of fields and methods, create new class, move fields and methods, update references. Cover Replace Magic Number with Constant (extract magic literal to named constant). Cover Replace Temp with Query (replace temp variable with method call — enables lazy evaluation). Show Rider/Visual Studio automated refactoring. Cover that extractions improve testability (extracted methods can be tested independently) and readability (explaining name communicates intent).
```

#### 20.3 Replace Conditional with Polymorphism
```
Show Replace Conditional with Polymorphism: switch on type/enum replaced with class hierarchy where each class handles its own behavior. Before: switch(order.Status) { case Placed: ..., case Confirmed: ..., case Shipped: ... }. After: Order.Handle(command) → polymorphic dispatch via OrderState (PlacedState, ConfirmedState, ShippedState each handle differently). Steps: identify which code varies by type, create abstract class/interface, create subclass per type, move type-specific behavior to subclass, replace conditional with polymorphic call. Cover that this implements OCP (add new type = new class, not modified switch). Cover Replace Constructor with Factory Method as enabler (factory creates correct subclass). Cover that not all conditionals need polymorphism (simple predicates → keep as conditionals, complex per-type behavior → polymorphism). Show Strategy pattern as a polymorphism-replacing-conditional example.
```

#### 20.4 Parameter Object
```
Show Introduce Parameter Object refactoring: when multiple parameters always appear together (function(startDate, endDate, minAmount, maxAmount)), replace with parameter object (function(DateRange dateRange, AmountRange amountRange)). Benefits: reduces method signature complexity, enables validation on the parameter object, reuse the grouping. Show creating DateRange record (StartDate, EndDate) with validation (EndDate > StartDate). Cover that Parameter Object often becomes a Value Object (DateRange with Contains(Date), Overlaps(DateRange) — behavior follows the data). Cover Preserve Whole Object (pass object instead of extracting its properties — customer.Name, customer.Email → customer). Show that reducing method parameters improves readability and reduces risk of argument order bugs. Cover that Parameter Object also documents the "concept" — DateRange is a named domain concept, not just two dates.
```

#### 20.5 Primitive Obsession to Value Object
```
Show Replace Primitive with Value Object: strings, ints, decimals used where domain concepts should be (string email → Email, decimal price → Money, string status → OrderStatus enum/type). Benefits: validation at creation (can't create invalid Email), business methods on the type (Email.Domain, Money.Add(Money)), prevents mixing incompatible types (can't pass CustomerId where OrderId expected). Show step-by-step: identify primitive representing domain concept, create Value Object class with validation in constructor/factory, replace primitive with VO. Show Email record with factory method: public static Result<Email> Create(string value). Show Money with currency-aware addition. Cover that Primitive Obsession is the most impactful smell to fix (directly improves domain model clarity). Cover strongly-typed IDs: record OrderId(Guid Value) — prevents passing wrong ID type. Show EF Core Value Object mapping.
```

#### 20.6 Strangler Fig for Code
```
Explain Strangler Fig for code-level incremental replacement (vs service-level in microservices). Incrementally replace legacy code without big-bang rewrite. Steps: identify component to replace, build new implementation alongside old, route new usage to new implementation (often via interface), gradually migrate all callers, delete old implementation. Key: both implementations live side-by-side during transition — rollback is possible. Show replacing a direct SQL repository with EF Core: add IOrderRepository interface, create EF Core implementation, route new feature development through interface, gradually move existing callers, remove old SQL code. Cover feature flag gating (new implementation behind flag — test in production with subset of users, rollback by disabling flag). Show that Strangler Fig reduces risk vs full rewrite (incremental, always releasable). Cover that this applies to framework migrations (WebForms → Blazor, .NET Framework → .NET Core).
```

#### 20.7 Feature Flags
```
Cover Feature Flag (Feature Toggle) pattern: conditional code paths controlled by configuration without deployment. Types: Release Flags (hide incomplete features in production — ship often, release safely), Experiment Flags (A/B testing — measure user behavior), Ops Flags (operational kill switch — disable expensive feature under load), Permission Flags (per-user feature access — beta users). .NET: Microsoft.FeatureManagement NuGet (IFeatureManager.IsEnabledAsync("NewCheckout"), [FeatureGate("Feature")] attribute, appsettings.json and Azure App Configuration as flag stores). Show: IFeatureManager.IsEnabledAsync("NewOrderProcessing") → route to new or old code path. Cover flag lifecycle: flags should be temporary (long-lived flags = tech debt — remove flag and old code once rollout complete). Cover testing with flags (test both paths). Cover that feature flags enable trunk-based development (always ship to main, flags hide incomplete work). Show percentage rollout filter (10% of users → new feature).
```

---

## Quick Reference: Pattern Selection Guide

| Problem | Pattern |
|---|---|
| Create object without specifying class | Factory Method, Abstract Factory |
| One instance globally | Singleton via DI (AddSingleton) |
| Complex object construction | Builder |
| Make incompatible interfaces work | Adapter |
| Add behavior dynamically | Decorator |
| Simplify complex subsystem | Facade |
| Share state, reduce memory | Flyweight |
| Control object access | Proxy |
| Vary algorithm at runtime | Strategy |
| Notify multiple objects | Observer / Events |
| Pass request through chain | Chain of Responsibility (Middleware) |
| Encapsulate command with undo | Command |
| Object behavior varies by state | State |
| Define algorithm skeleton | Template Method |
| Centralize communication | Mediator / MediatR |
| Add operations to object structure | Visitor |
| Tree structure, uniform treatment | Composite |
| Decouple abstraction from impl | Bridge |
| Capture and restore state | Memento |
| Complex business logic | DDD (Aggregates, Domain Services) |
| Use case orchestration | Application Service / MediatR Command |
| Testable clean separation | Clean Architecture / Hexagonal |
| Read vs Write separation | CQRS |
| Persistent abstraction | Repository |
| Cross-cutting concerns | Pipeline Behavior / Decorator |
| Error handling without exceptions | Result Pattern |
| Avoid null | Option/Maybe, Nullable Reference Types |
| Audit trail + replay | Event Sourcing |
| Cross-service reliability | Outbox Pattern |
| Scaling consumers | Competing Consumers |
| Fast reads | Cache-Aside, Read-Through |
| Safely deploy new features | Feature Flags |

---

## Quick Reference: Architecture Decision

| Scenario | Recommendation |
|---|---|
| Simple CRUD API (<10 entities) | Minimal API + EF Core + no patterns |
| Medium complexity app | Clean Architecture + MediatR + EF Core |
| Complex domain with business rules | DDD + Clean Architecture + Event Sourcing |
| Highly scalable service | Hexagonal + CQRS + separate read/write DBs |
| Legacy modernization | Strangler Fig + Anti-Corruption Layer |
| Plugin/extensible product | Microkernel + MEF |
| Data processing pipeline | Pipe and Filter + Channel<T> |
| Team of 1-3 | Modular Monolith |
| Team of 10-50 per service | Microservices with clear DDD boundaries |
| Multiple clients (web+mobile) | BFF Pattern per client |

---

*Version 1.0 — .NET 8 / C# 12*