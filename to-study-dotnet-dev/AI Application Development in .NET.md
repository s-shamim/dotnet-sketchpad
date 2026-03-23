# AI Application Development in .NET
## Compact Learning Guide with Prompts

> Each section has a prompt. Paste it to generate full content.
> 🟢 **Stable** — patterns won't change significantly
> 🟡 **Mostly Stable** — concepts stable, APIs/libraries evolve
> 🔴 **Verify** — active development, check current state before building

---

## Table of Contents

1. [.NET AI Ecosystem Overview](#1-net-ai-ecosystem)
   - 1.1 🟡 [Microsoft.Extensions.AI — The Unified Abstraction](#11-meai)
   - 1.2 🟡 [Semantic Kernel — Orchestration Framework](#12-semantic-kernel)
   - 1.3 🟡 [ML.NET — Classical ML in .NET](#13-mlnet)
   - 1.4 🟡 [ONNX Runtime — Run Any Model in .NET](#14-onnx-runtime)
   - 1.5 🟡 [Calling LLM APIs — OpenAI, Azure OpenAI, Anthropic](#15-llm-apis)
   - 1.6 🟢 [When to Build vs Buy — AI Decisions](#16-build-vs-buy)

2. [Calling LLM APIs from .NET](#2-calling-llm-apis)
   - 2.1 🟡 [OpenAI .NET SDK — Setup & Chat Completions](#21-openai-sdk)
   - 2.2 🟡 [Azure OpenAI — Enterprise LLM in .NET](#22-azure-openai)
   - 2.3 🟡 [Anthropic Claude API from .NET](#23-anthropic-api)
   - 2.4 🟡 [Microsoft.Extensions.AI — Provider-Agnostic Calls](#24-meai-calls)
   - 2.5 🟢 [Streaming Responses — IAsyncEnumerable & SSE](#25-streaming)
   - 2.6 🟢 [Handling Errors, Retries & Rate Limits](#26-errors-retries)
   - 2.7 🟢 [Token Counting & Cost Management](#27-token-cost)
   - 2.8 🟡 [Local Models — Ollama, LM Studio from .NET](#28-local-models)

3. [Semantic Kernel In Depth](#3-semantic-kernel)
   - 3.1 🟡 [Kernel — The Central Orchestrator](#31-kernel)
   - 3.2 🟡 [Plugins & Functions — Extending LLM Capabilities](#32-plugins-functions)
   - 3.3 🟡 [Semantic Functions — Prompt Templates](#33-semantic-functions)
   - 3.4 🟡 [Native Functions — C# Code as LLM Tools](#34-native-functions)
   - 3.5 🟡 [Filters — Middleware for AI Calls](#35-sk-filters)
   - 3.6 🔴 [Planner — Automated Task Planning](#36-planner)
   - 3.7 🟡 [Memory & Vector Store Abstraction](#37-sk-memory)
   - 3.8 🟡 [Semantic Kernel Agents](#38-sk-agents)

4. [RAG — Retrieval-Augmented Generation](#4-rag)
   - 4.1 🟢 [RAG Architecture — Indexing & Retrieval Pipeline](#41-rag-architecture)
   - 4.2 🟢 [Document Loading & Parsing](#42-document-loading)
   - 4.3 🟢 [Chunking Strategies in Practice](#43-chunking-practice)
   - 4.4 🟡 [Embedding Pipeline in .NET](#44-embedding-pipeline)
   - 4.5 🟡 [Vector Store Integration — pgvector, Qdrant, Azure AI Search](#45-vector-stores-net)
   - 4.6 🟢 [Query Processing & Retrieval](#46-query-retrieval)
   - 4.7 🟡 [Hybrid Search in .NET](#47-hybrid-search-net)
   - 4.8 🟡 [Re-Ranking in .NET](#48-reranking-net)
   - 4.9 🟢 [RAG Response Generation & Citation](#49-rag-generation)
   - 4.10 🟡 [Advanced RAG — HyDE, RAG-Fusion, Parent Retrieval](#410-advanced-rag)

5. [Function Calling & Tool Use](#5-function-calling)
   - 5.1 🟡 [Function Calling — How It Works](#51-function-calling-how)
   - 5.2 🟡 [Defining Tools in .NET](#52-defining-tools)
   - 5.3 🟡 [Automatic vs Manual Tool Invocation](#53-auto-vs-manual)
   - 5.4 🟡 [Parallel Tool Calls](#54-parallel-tool-calls)
   - 5.5 🟢 [Tool Safety — Validating LLM-Requested Actions](#55-tool-safety)
   - 5.6 🟡 [Tool Calling with Semantic Kernel](#56-sk-tool-calling)

6. [Structured Output & Data Extraction](#6-structured-output)
   - 6.1 🟡 [JSON Mode & Structured Output APIs](#61-json-mode)
   - 6.2 🟢 [Designing Schemas for LLM Output](#62-schema-design)
   - 6.3 🟡 [Constrained Generation Approaches](#63-constrained-generation)
   - 6.4 🟢 [Document Information Extraction Patterns](#64-extraction-patterns)
   - 6.5 🟢 [Validation & Retry for Structured Output](#65-validation-retry)

7. [AI Agents in .NET](#7-agents)
   - 7.1 🟢 [What Is an Agent — Perceive, Plan, Act Loop](#71-what-is-agent)
   - 7.2 🟡 [ReAct Pattern — Reasoning + Acting](#72-react-pattern)
   - 7.3 🟡 [Semantic Kernel Agent Framework](#73-sk-agent-framework)
   - 7.4 🔴 [Multi-Agent Systems — Collaboration Patterns](#74-multi-agent)
   - 7.5 🟢 [Agent Memory — Short-Term, Long-Term, Episodic](#75-agent-memory)
   - 7.6 🟢 [Human-in-the-Loop — When Agents Need Approval](#76-human-in-loop)
   - 7.7 🟢 [Agent Safety — Preventing Runaway Agents](#77-agent-safety)
   - 7.8 🔴 [AutoGen & Assistants API Patterns](#78-autogen-assistants)

8. [ML.NET — Classical ML in Production](#8-mlnet)
   - 8.1 🟡 [ML.NET Architecture — MLContext, Pipeline, Estimators](#81-mlnet-architecture)
   - 8.2 🟡 [Data Loading & Transformation in ML.NET](#82-data-loading)
   - 8.3 🟡 [Binary & Multiclass Classification in ML.NET](#83-classification-mlnet)
   - 8.4 🟡 [Regression in ML.NET](#84-regression-mlnet)
   - 8.5 🟡 [Anomaly Detection in ML.NET](#85-anomaly-detection)
   - 8.6 🟡 [Text Classification & Sentiment in ML.NET](#86-text-mlnet)
   - 8.7 🟡 [AutoML in ML.NET — Model Builder](#87-automl-mlnet)
   - 8.8 🟡 [Model Deployment in ASP.NET Core with ML.NET](#88-mlnet-deployment)

9. [ONNX Runtime in .NET](#9-onnx)
   - 9.1 🟡 [What ONNX Is — The Universal Model Format](#91-what-is-onnx)
   - 9.2 🟡 [Running Inference with InferenceSession](#92-ort-inference)
   - 9.3 🟡 [Exporting Models to ONNX](#93-export-onnx)
   - 9.4 🟡 [Execution Providers — CPU, CUDA, DirectML, CoreML](#94-execution-providers)
   - 9.5 🟡 [Optimizing ONNX Models — Quantization, Graph Optimization](#95-onnx-optimization)
   - 9.6 🟡 [Running Hugging Face Models in .NET via ONNX](#96-hf-onnx-net)
   - 9.7 🟡 [ONNX Runtime GenAI — LLM Inference in .NET](#97-onnx-genai)

10. [Embeddings in .NET Applications](#10-embeddings-net)
    - 10.1 🟡 [Generating Embeddings — API vs Local](#101-generating-embeddings)
    - 10.2 🟡 [Semantic Search Implementation](#102-semantic-search)
    - 10.3 🟢 [Similarity Scoring & Thresholds](#103-similarity-scoring)
    - 10.4 🟡 [pgvector with EF Core — Embeddings in PostgreSQL](#104-pgvector-ef)
    - 10.5 🟡 [Qdrant .NET SDK](#105-qdrant-net)
    - 10.6 🟡 [Azure AI Search — Hybrid Search in Azure](#106-azure-ai-search)
    - 10.7 🟢 [Embedding Cache — Avoid Repeated API Calls](#107-embedding-cache)
    - 10.8 🟢 [Batch Embedding — Processing Documents at Scale](#108-batch-embedding)

11. [Prompt Management & Versioning](#11-prompt-management)
    - 11.1 🟢 [Prompts Are Code — Version Control Discipline](#111-prompts-as-code)
    - 11.2 🟡 [Prompt Templates in .NET — Handlebars, Liquid, Prompty](#112-prompt-templates)
    - 11.3 🟢 [Prompt Testing — Unit Tests for Prompts](#113-prompt-testing)
    - 11.4 🟡 [A/B Testing Prompts in Production](#114-ab-testing-prompts)
    - 11.5 🟡 [Prompt Storage — File, Database, Azure Prompt Flow](#115-prompt-storage)

12. [Conversation Management](#12-conversation-management)
    - 12.1 🟢 [Conversation History — Structure & Roles](#121-conversation-history)
    - 12.2 🟢 [Context Window Management — Truncation Strategies](#122-context-management)
    - 12.3 🟢 [Message Summarization — Compress Long Conversations](#123-summarization)
    - 12.4 🟢 [Session Storage — Where to Persist Conversations](#124-session-storage)
    - 12.5 🟡 [Multi-Turn State in ASP.NET Core](#125-multiturn-aspnet)

13. [LLM Observability & Monitoring](#13-llm-observability)
    - 13.1 🟢 [What to Log — Requests, Responses, Metadata](#131-what-to-log)
    - 13.2 🟡 [OpenTelemetry for LLM Calls — Semantic Conventions](#132-otel-llm)
    - 13.3 🟢 [Cost Tracking — Token Usage per Feature/User](#133-cost-tracking)
    - 13.4 🟢 [Latency Monitoring — P50/P99 for LLM Calls](#134-latency-monitoring)
    - 13.5 🟡 [LLM Tracing Tools — Langfuse, Phoenix, LangSmith](#135-llm-tracing)
    - 13.6 🟢 [Output Monitoring — Sampling & Quality Checks](#136-output-monitoring)
    - 13.7 🟡 [Alerting on LLM Failures & Degradation](#137-alerting-llm)

14. [AI Safety & Content Moderation in .NET](#14-safety-moderation)
    - 14.1 🟢 [Input Validation for AI Applications](#141-input-validation-ai)
    - 14.2 🟡 [Content Moderation APIs — Azure Content Safety, OpenAI Moderation](#142-moderation-apis)
    - 14.3 🟢 [Output Filtering — Blocking Harmful Responses](#143-output-filtering)
    - 14.4 🟢 [Prompt Injection Defense in .NET](#144-prompt-injection-defense)
    - 14.5 🟡 [Guardrails Libraries](#145-guardrails)
    - 14.6 🟢 [Rate Limiting AI Features — Preventing Abuse](#146-rate-limiting-ai)
    - 14.7 🟢 [Audit Logging for AI Compliance](#147-audit-logging-ai)

15. [Fine-Tuning & Model Customization](#15-fine-tuning-net)
    - 15.1 🟢 [When Fine-Tuning Is Worth It](#151-when-fine-tune)
    - 15.2 🟡 [Fine-Tuning via Azure OpenAI API](#152-azure-openai-ft)
    - 15.3 🟡 [Fine-Tuning via OpenAI API](#153-openai-ft)
    - 15.4 🟢 [Preparing Fine-Tuning Data — JSONL Format](#154-ft-data-prep)
    - 15.5 🟡 [Evaluating Fine-Tuned Models](#155-evaluating-ft)
    - 15.6 🔴 [Running Fine-Tuned Open Models Locally](#156-lora-adapters-net)

16. [ASP.NET Core AI Integration Patterns](#16-aspnet-ai-patterns)
    - 16.1 🟢 [AI Service Architecture — Where AI Fits in ASP.NET Core](#161-ai-architecture)
    - 16.2 🟢 [DI Registration for AI Services](#162-di-ai-services)
    - 16.3 🟢 [Async Patterns — LLM Calls in Controllers & Services](#163-async-llm-patterns)
    - 16.4 🟡 [Streaming SSE from ASP.NET Core AI Endpoints](#164-streaming-sse-aspnet)
    - 16.5 🟢 [Background AI Processing — IHostedService Patterns](#165-background-ai)
    - 16.6 🟢 [Caching AI Responses — When & How](#166-caching-ai)
    - 16.7 🟡 [AI Feature Flags — Safe Rollout of AI Features](#167-ai-feature-flags)

17. [Building AI-Powered APIs](#17-ai-apis)
    - 17.1 🟢 [Designing AI API Endpoints — Sync vs Async Pattern](#171-ai-api-design)
    - 17.2 🟢 [Idempotency for AI Requests](#172-idempotency-ai)
    - 17.3 🟢 [Pagination & Streaming for Long AI Responses](#173-pagination-streaming)
    - 17.4 🟢 [Exposing AI Capabilities — API Design Best Practices](#174-ai-api-best-practices)
    - 17.5 🟡 [Multi-Modal API Endpoints — Accepting Images & Text](#175-multimodal-api)
    - 17.6 🟡 [Webhook Patterns for Long-Running AI Tasks](#176-webhooks-ai)

18. [Evaluation & Testing AI Applications](#18-eval-testing)
    - 18.1 🟢 [Unit Testing AI-Dependent Code](#181-unit-testing-ai)
    - 18.2 🟢 [Mocking LLM Calls in Tests](#182-mocking-llm)
    - 18.3 🟢 [Regression Testing — Detecting Prompt Regressions](#183-regression-testing)
    - 18.4 🟡 [Automated Evaluation Pipeline in .NET](#184-eval-pipeline)
    - 18.5 🟡 [Evals with Microsoft.Extensions.AI](#185-evals-meai)
    - 18.6 🟢 [Canary Deployment for AI Features](#186-canary-ai)
    - 18.7 🟡 [Tracing & Debugging AI Pipelines](#187-tracing-debugging)

19. [Performance & Cost Optimization](#19-performance-cost)
    - 19.1 🟢 [Latency Optimization — Sources & Fixes](#191-latency-optimization)
    - 19.2 🟡 [Prompt Caching — Reduce Repeated Computation](#192-prompt-caching)
    - 19.3 🟡 [Semantic Caching — Cache by Meaning Not Exact Match](#193-semantic-caching)
    - 19.4 🟢 [Batching LLM Requests — Throughput vs Latency](#194-batching-requests)
    - 19.5 🟡 [Model Selection for Cost/Quality Tradeoff](#195-model-selection)
    - 19.6 🟡 [Edge Inference — Running Small Models Locally in .NET](#196-edge-inference)
    - 19.7 🟢 [Token Optimization — Reduce Input/Output Tokens](#197-token-optimization)

20. [Production AI Application Patterns](#20-production-patterns)
    - 20.1 🟢 [AI Production Checklist Before Launch](#201-production-checklist)
    - 20.2 🟢 [Graceful Degradation When AI Is Down](#202-graceful-degradation)
    - 20.3 🟢 [Multi-Provider Strategy — Fallback & Load Balancing](#203-multi-provider)
    - 20.4 🟢 [Privacy & Data Handling in AI Applications](#204-privacy-ai)
    - 20.5 🟡 [AI Gateway Pattern — Centralized LLM Management](#205-ai-gateway)
    - 20.6 🟡 [LLM Proxy — LiteLLM, Portkey from .NET](#206-llm-proxy)
    - 20.7 🟢 [Incident Response for AI Features](#207-incident-response-ai)
    - 20.8 🔴 [Agentic Application Deployment Considerations](#208-agentic-deployment)

---

## Section Prompts

### 1. .NET AI Ecosystem

#### 1.1 🟡 Microsoft.Extensions.AI
```
Explain Microsoft.Extensions.AI (MEAI): the unified abstraction layer for AI in .NET. Core interfaces: IChatClient (send messages, get completions, streaming), IEmbeddingGenerator<TInput, TEmbedding> (generate embeddings), ChatMessage/ChatRole (conversation model). Design: provider-agnostic — same code works with OpenAI, Azure OpenAI, Anthropic, Ollama via different implementations. DI integration: AddChatClient(), AddEmbeddingGenerator() extension methods. Middleware pipeline: IChatClient decorators for logging, caching, retry, function invocation — same pattern as HttpClient DelegatingHandler. Show complete setup: register Azure OpenAI or OpenAI provider, inject IChatClient into service, send messages. Cover that MEAI is the recommended way to write AI code in .NET going forward — avoids vendor lock-in. Note: 🟡 — MEAI is relatively new (2024), API may still evolve. Verify current NuGet package and namespace (Microsoft.Extensions.AI).
```

#### 1.2 🟡 Semantic Kernel
```
Explain Semantic Kernel (SK): Microsoft's open-source LLM orchestration framework for .NET. Purpose: orchestrate multiple AI capabilities — LLM calls, embeddings, memory, tool use, agents. Core concepts: Kernel (central object — register AI services, plugins, invoke functions), Plugin (group of AI or C# functions), KernelFunction (single callable function), KernelArguments (pass data into functions). DI integration: AddKernel(), AddOpenAIChatCompletion(). Show a complete ASP.NET Core registration and usage of a simple prompt via kernel.InvokePromptAsync(). Cover SK vs MEAI: SK builds on MEAI (uses IChatClient internally), SK adds orchestration, plugins, and agents. Cover when to use SK (complex orchestration, plugin ecosystem, agents) vs just MEAI (simple LLM calls, maximum flexibility). Note: 🟡 — SK API is stable in broad strokes but evolves between minor versions. Always verify against current documentation.
```

#### 1.3 🟡 ML.NET
```
Explain ML.NET: Microsoft's open-source ML framework for .NET. Purpose: classical ML directly in .NET without Python. Capabilities: binary/multiclass classification, regression, clustering, anomaly detection, recommendation, text featurization, time-series forecasting, computer vision via ONNX. Key differentiator: full .NET native (NuGet package, no Python runtime), tight ASP.NET Core integration, ModelBuilder for GUI-based training. Architecture: MLContext (entry point), IDataView (lazy data abstraction), pipeline of estimators (transformers + trainers), trained ITransformer = prediction model. Model deployment: save as zip, load at prediction time via PredictionEngine<TInput, TOutput>, use PredictionEnginePool for thread-safe web scenarios. When to choose ML.NET: .NET-only team, don't want Python infrastructure, need same-process inference, classical ML on tabular data (fraud, churn, demand forecasting). Note: 🟡 — ML.NET is stable but less actively evolved than Python ML ecosystem. Verify current trainer names and API.
```

#### 1.4 🟡 ONNX Runtime
```
Explain ONNX Runtime (ORT) in .NET: run ML models trained in any framework (PyTorch, TensorFlow, scikit-learn, HuggingFace) directly in .NET. ONNX: standard model exchange format. ORT: optimized cross-platform inference engine. Why it matters: no Python runtime in production, run state-of-the-art models (BERT, Whisper, YOLO, DistilBERT) in your .NET service. NuGet packages: Microsoft.ML.OnnxRuntime (CPU), Microsoft.ML.OnnxRuntime.Gpu (CUDA). Core API: new InferenceSession(modelPath), create input OrtValue tensors, session.Run(inputs), parse output tensors. Execution providers: CPU (default), CUDA (NVIDIA), DirectML (Windows GPU), CoreML (Apple Silicon), TensorRT (NVIDIA maximum performance). Use cases: classification, NER, embeddings, object detection, speech-to-text (Whisper). OnnxRuntime.GenAI: newer package for LLM inference (Phi-3, LLaMA). Note: 🟡 — ORT is mature and stable for inference, GenAI extension is newer. Verify NuGet package versions.
```

#### 1.5 🟡 LLM API Landscape
```
Survey LLM APIs callable from .NET: OpenAI (GPT-4o, GPT-4o-mini, embeddings — via Azure.AI.OpenAI or openai NuGet — direct API key auth), Azure OpenAI (same OpenAI models in your Azure subscription — enterprise compliance, VNET, managed identity, content filtering — Azure.AI.OpenAI NuGet), Anthropic Claude (claude-3-5-sonnet, claude-3-haiku — Anthropic.SDK community NuGet or direct HTTP calls), Google Gemini (Vertex AI .NET SDK or Google.Cloud.AIPlatform), Cohere (embed, rerank, chat), Mistral AI, local via Ollama (OpenAI-compatible API at localhost:11434 — phi3, llama3, mistral). Authentication: API keys in Azure Key Vault (never in code), managed identity for Azure OpenAI (recommended). Note: 🟡 — specific model names, pricing, and which models are best change monthly. Focus on patterns for calling these APIs rather than memorizing specific model names. Verify current models before choosing.
```

#### 1.6 🟢 Build vs Buy
```
Provide a decision framework for AI choices in .NET: Cloud API (OpenAI, Azure OpenAI, Anthropic) — pros: latest models, minimal setup, no infrastructure, best quality; cons: data leaves your control, per-token cost scales with usage, latency of network call, rate limits. Self-hosted open source (LLaMA 3, Mistral, Phi-3 via Ollama/vLLM) — pros: full data control, flat infrastructure cost, no rate limits; cons: smaller/weaker models than frontier APIs, infrastructure to manage, your team updates models. In-process (ML.NET, ONNX Runtime, small ONNX models) — pros: lowest latency, full data control, no per-call cost; cons: limited to smaller models, more setup. Decision factors: data sensitivity (medical/legal → self-hosted or dedicated Azure with no-training-on-your-data), cost at scale (high volume → self-hosted cheaper after break-even), quality needs (complex reasoning → frontier API), latency (<100ms → small local model). Recommendation: start with cloud API for speed, optimize later. GPT-4o-mini handles 70% of tasks at fraction of GPT-4o cost — always benchmark before over-provisioning model tier.
```

---

### 2. Calling LLM APIs

#### 2.1 🟡 OpenAI .NET SDK
```
Show the official OpenAI .NET SDK in detail: NuGet package OpenAI. Setup: new OpenAIClient(new ApiKeyCredential(apiKey)), or configure via options. Chat Completions: var chatClient = openAIClient.GetChatClient("gpt-4o-mini"), var completion = await chatClient.CompleteChatAsync(new List<ChatMessage> { ... }). Building messages: ChatMessage.CreateSystemMessage(text), ChatMessage.CreateUserMessage(text), ChatMessage.CreateAssistantMessage(text). Request options: new ChatCompletionOptions { Temperature = 0.7f, MaxOutputTokenCount = 1000 }. Parsing response: completion.Value.Content[0].Text, completion.Value.Usage.InputTokenCount, completion.Value.FinishReason. DI registration: services.AddSingleton(sp => new OpenAIClient(...)).AddSingleton(sp => sp.GetRequiredService<OpenAIClient>().GetChatClient("gpt-4o-mini")). Show embedding calls: EmbeddingClient, GenerateEmbeddingAsync, returning float[]. Note: 🟡 — OpenAI SDK API surface evolves. Show complete working code examples. Verify package version for current class names.
```

#### 2.2 🟡 Azure OpenAI
```
Show Azure OpenAI from .NET: NuGet Azure.AI.OpenAI. Key differences from OpenAI SDK: AzureOpenAIClient instead of OpenAIClient, endpoint URL is your Azure resource URL, deployment name (set in Azure) replaces model name in GetChatClient(deploymentName). Authentication options: new AzureKeyCredential(apiKey) for key auth, new DefaultAzureCredential() for managed identity (recommended for Azure-hosted apps). Full setup: new AzureOpenAIClient(new Uri(endpoint), new DefaultAzureCredential()), then same API as OpenAI SDK. Configuration pattern: read endpoint and deployment from IConfiguration, register in DI. Azure-specific features: built-in content filtering (configurable per category), private endpoints / VNET integration, data residency guarantees, no training on your data (Enterprise Agreement), RBAC (Cognitive Services OpenAI User role). Show appsettings.json with endpoint + deployment names, DI registration with managed identity, complete chat call. Recommend Azure OpenAI over direct OpenAI for enterprise .NET apps on Azure. Note: 🟡 — SDK versions follow Azure API updates.
```

#### 2.3 🟡 Anthropic Claude API
```
Show calling Anthropic Claude from .NET: two approaches. Direct HTTP (most stable): POST https://api.anthropic.com/v1/messages with headers (x-api-key, anthropic-version: 2023-06-01, content-type: application/json), body: {model, max_tokens, system, messages}. Parse response: content[0].text. Typed wrapper using Anthropic.SDK community NuGet: AnthropicClient, MessagesRequest, MessagesResponse. Claude-specific features: system prompt is top-level field (not a message), max_tokens required (no default), extended thinking (claude-3-7-sonnet enables internal reasoning traces before responding). Via MEAI: use IChatClient bridge if available for provider-agnostic code. Model selection: claude-3-haiku-* (fast, cheap, good for simple tasks), claude-3-5-sonnet-* (balanced, most capable for price), claude-3-opus-* (highest quality). Show complete HTTP-based implementation with HttpClient + System.Text.Json. Note: 🟡 — community .NET SDK may lag behind API. Direct HTTP more stable. Verify model names as Anthropic releases frequently.
```

#### 2.4 🟡 MEAI Provider-Agnostic Calls
```
Show Microsoft.Extensions.AI (MEAI) for provider-agnostic LLM calls: NuGet Microsoft.Extensions.AI + provider package. Register: services.AddOpenAIChatCompletion("gpt-4o-mini", apiKey) or services.AddAzureOpenAIChatCompletion(deployment, endpoint, credential). Inject IChatClient into services. Basic call: var response = await chatClient.CompleteAsync(new[] { new ChatMessage(ChatRole.User, prompt) }). Access result: response.Message.Text. Streaming: await foreach (var update in chatClient.CompleteStreamingAsync(messages)) { Console.Write(update.Text); }. Options: new ChatOptions { Temperature = 0.7f, MaxOutputTokens = 500 }. Middleware pipeline: chatClient.AsBuilder().UseLogging(logger).UseFunctionInvocation().UseOpenTelemetry().Build(). IEmbeddingGenerator<string, Embedding<float>>: GenerateAsync(texts) for embeddings. Show switching provider by changing DI registration only — zero application code changes. Show MockChatClient for testing. Note: 🟡 — MEAI is actively developed. Interface contract is stabilizing. Verify Microsoft.Extensions.AI package version.
```

#### 2.5 🟢 Streaming Responses
```
Show streaming LLM responses in .NET for better UX. Why stream: users see first token in ~300ms instead of waiting 5-10s for full response — dramatically better perceived performance. MEAI streaming: await foreach (var update in chatClient.CompleteStreamingAsync(messages, options)) { yield return update.Text; }. ASP.NET Core SSE endpoint: set response headers (Content-Type: text/event-stream, Cache-Control: no-cache, X-Accel-Buffering: no), await foreach loop writing "data: {chunk}\n\n" and flushing. Show complete Minimal API streaming endpoint returning SSE. Blazor streaming: bind to IAsyncEnumerable<string>, update UI as tokens arrive. SignalR streaming: StreamAsChannelAsync to push tokens to browser. Show passing CancellationToken from HttpContext.RequestAborted through the LLM call — cancel stream when client disconnects. Handle streaming errors: try/catch around await foreach, send error event. Cover that streaming requires disabling response buffering in reverse proxies (Nginx: proxy_buffering off, IIS: set response buffering mode). This is 🟢 — the IAsyncEnumerable pattern for streaming is stable .NET infrastructure.
```

#### 2.6 🟢 Errors, Retries & Rate Limits
```
Cover resilient LLM API calls in .NET: error types and handling. HTTP 429 (rate limited — respect Retry-After header, exponential backoff + jitter), HTTP 500/503 (transient service error — retry with backoff), HTTP 400 (bad request — bad prompt, token limit exceeded — don't retry, fix the input), HTTP 401 (auth error — don't retry, fix credentials), connection timeout (retry). Build resilience pipeline with Polly v8: ResiliencePipeline wrapping IChatClient calls — RetryStrategyOptions (retry 429 and 5xx, read Retry-After header for delay), TimeoutStrategyOptions (per-call timeout 30-120s), CircuitBreakerStrategyOptions (open circuit on high error rate). Show parsing Retry-After header value from HttpRequestException. Show Microsoft.Extensions.Http.Resilience applied to HttpClient-based AI clients. Cover that different LLM APIs have different rate limit policies (tokens per minute, requests per minute — both can trigger 429). Cover that 400 errors often mean prompt too long — count tokens before sending. This is 🟢 — Polly resilience pattern is stable regardless of which LLM API you use.
```

#### 2.7 🟢 Token Counting & Cost
```
Cover token management and cost control for .NET AI applications. Counting tokens: Microsoft.ML.Tokenizers NuGet (TiktokenTokenizer for OpenAI-compatible models, LlamaTokenizer for open models), tokenizer.CountTokens(text) before sending. Why count: avoid 400 errors from exceeding context window, estimate cost before calling API, implement per-user budgets. Cost formula: (input_tokens × input_price_per_1M + output_tokens × output_price_per_1M) / 1_000_000. Read usage from response: response.Usage.InputTokenCount, response.Usage.OutputTokenCount. Track cost per request: log to structured logging (Serilog), aggregate in OpenTelemetry metrics (Counter per model per endpoint). Per-user limits: IDistributedCache to track token usage per userId per day, reject if over limit. Show complete cost tracking middleware for IChatClient. Cover rough estimation without tokenizer: English text ≈ 0.75 tokens per word, 1 token ≈ 4 characters. Cover that input tokens typically cost less than output tokens — design prompts to minimize output length when quality allows. This is 🟢 — cost tracking pattern is stable.
```

#### 2.8 🟡 Local Models via Ollama
```
Show running LLMs locally from .NET using Ollama: install Ollama (ollama.ai), pull a model (ollama pull phi3 / ollama pull llama3.2 / ollama pull mistral), Ollama exposes OpenAI-compatible REST API at http://localhost:11434/v1. .NET integration via OpenAI SDK: new OpenAIClient(new Uri("http://localhost:11434/v1"), new ApiKeyCredential("ollama")), then identical API to OpenAI SDK. Via MEAI: UseOllama() or configure as OpenAI-compatible. Model selection for local: Phi-3-mini (3.8B params, 2.3GB, fast, surprisingly capable), Llama-3.2-3B (small, very fast), Mistral-7B (good instruction following), CodeLlama (code tasks). Use cases for local models: development without API costs, privacy-sensitive data that can't leave the machine, offline capability, CI/CD integration tests without API calls. LM Studio alternative: GUI-based, also OpenAI-compatible API. Limitations vs cloud: slower (without GPU), weaker models, must manage updates manually. Note: 🟡 — Ollama is current standard but tooling evolves. Specific best local models change. Verify which models are currently recommended.
```

---

### 3. Semantic Kernel

#### 3.1 🟡 The Kernel
```
Show Semantic Kernel Kernel setup and usage in .NET. Builder pattern: var builder = Kernel.CreateBuilder(); builder.AddOpenAIChatCompletion("gpt-4o-mini", apiKey); builder.AddOpenAITextEmbeddingGeneration("text-embedding-3-small", apiKey); var kernel = builder.Build(). ASP.NET Core DI: services.AddKernel().AddOpenAIChatCompletion(...) — injects Kernel as singleton. Invoking a prompt: var result = await kernel.InvokePromptAsync("Summarize: {{$input}}", new KernelArguments { ["input"] = text }). Direct service access: var chatService = kernel.GetRequiredService<IChatCompletionService>(). Kernel clone with overrides: kernel.Clone() then replace service — useful for per-request model selection. Kernel events: FunctionInvoking, FunctionInvoked hooks. Show complete ASP.NET Core setup with DI: register kernel with Azure OpenAI, inject into service, call prompt. Cover that the kernel is a DI container for AI services — think of it as IServiceProvider specialized for AI. Note: 🟡 — builder method names and DI extension method signatures change between SK releases. Verify current package (Microsoft.SemanticKernel).
```

#### 3.2 🟡 Plugins & Functions
```
Show SK Plugins in detail: a plugin is a class containing [KernelFunction]-annotated methods. Create plugin class: public class OrderPlugin { [KernelFunction] [Description("Get the status of an order")] public async Task<string> GetOrderStatus([Description("The order ID to check")] string orderId) { ... } }. Register: kernel.Plugins.AddFromType<OrderPlugin>() or kernel.Plugins.AddFromObject(new OrderPlugin(db)). Function metadata: name defaults to method name, description used by LLM to decide when to call, parameter descriptions crucial for correct LLM invocation. Built-in plugins: TimePlugin (current date/time), HttpPlugin (HTTP requests), ConversationSummaryPlugin. OpenAPI auto-import: await kernel.Plugins.AddFromOpenApiAsync("PetStore", new Uri("https://petstore.swagger.io/v2/swagger.json")) — creates functions from every API endpoint. Show registering plugin with dependencies via DI: AddFromType<T>() resolves constructor params from kernel's service provider. Cover that [Description] attributes are the LLM's documentation — write them clearly and specifically. Note: 🟡 — plugin registration APIs stable but verify current attribute names.
```

#### 3.3 🟡 Semantic Functions
```
Show SK semantic functions (prompt templates) in .NET: inline creation, file-based, and Prompty format. Inline: KernelFunction summarizeFunc = kernel.CreateFunctionFromPrompt("Summarize the following in 3 bullet points:\n{{$input}}", new PromptExecutionSettings { MaxTokens = 300 }). Handlebars template: {{#if condition}}...{{/if}}, {{#each items}}{{this}}{{/each}}. Loading from files: kernel.ImportPluginFromPromptDirectory("./Plugins/SupportPlugin") loads YAML files with prompt + metadata. Prompty format (.prompty file): YAML front matter (name, description, model, sample) + Jinja2-style template body — cross-platform prompt format. PromptExecutionSettings per provider: OpenAIPromptExecutionSettings (Temperature, MaxTokens, TopP, StopSequences), AzureOpenAIPromptExecutionSettings. Show complete function from file: create config.json (name, description, input variables), skprompt.txt (the prompt), load and invoke. Cover that file-based prompts enable version control and non-developer editing. Note: 🟡 — template format and settings classes evolve. Prompty is the direction Microsoft is pushing. Verify current recommended format.
```

#### 3.4 🟡 Native Functions
```
Show SK native functions (C# methods as LLM tools) best practices. Essential pattern: [KernelFunction] attribute makes the method callable by LLM, [Description] on method and each parameter is what the LLM reads. Return types: string or serializable object (SK serializes to JSON). Full example: [KernelFunction][Description("Search the product catalog by keyword")] public async Task<string> SearchProducts([Description("Keyword to search for in product names and descriptions")] string keyword, [Description("Maximum number of results to return, default 5")] int maxResults = 5). Complex parameter: [Description("The product to create as JSON")] string productJson — then deserialize inside method. Error handling: return error message as string rather than throwing — LLM can incorporate error and respond gracefully. Async support: fully async, return Task<string>. Injected services: [FromKernelServices] on constructor params — SK resolves from kernel DI. Cover that the quality of [Description] attributes directly determines how well the LLM uses the function. Note: 🟡 — attribute names and FromKernelServices pattern may change. Verify current SK version.
```

#### 3.5 🟡 SK Filters
```
Show SK Filters as middleware for AI pipelines: implement IFunctionInvocationFilter for before/after every function call. Interface: Task OnFunctionInvocationAsync(FunctionInvocationContext context, Func<FunctionInvocationContext, Task> next). Context contains: Function (metadata), Arguments (inputs), Result (set this to override result), Exception. Register: kernel.FunctionInvocationFilters.Add(new LoggingFilter(logger)) or via DI AddSingleton<IFunctionInvocationFilter, LoggingFilter>(). Show complete logging filter: log function name, input arguments, start time; call next(context); log result and duration. Show authorization filter: check if current user has permission to call this function (read from context or ambient user context), throw UnauthorizedAccessException if not. Show caching filter: hash function name + arguments as cache key, return cached result if available, store new result. IPromptRenderFilter: hook before/after rendering a prompt template — useful for logging rendered prompts (with sensitive data redaction). IAutoFunctionInvocationFilter: hook around automatic tool invocation loop. Note: 🟡 — filter interfaces stable but verify registration API.
```

#### 3.6 🔴 SK Planner
```
Explain SK planning and function orchestration: the mechanism by which SK/LLM decides which functions to call and in what order. Current recommended approach (FunctionChoiceBehavior): set FunctionChoiceBehavior.Auto() in PromptExecutionSettings — LLM automatically selects and calls registered plugin functions. kernel.InvokePromptAsync("Book a meeting with John tomorrow at 2pm for 1 hour", new KernelArguments(new OpenAIPromptExecutionSettings { FunctionChoiceBehavior = FunctionChoiceBehavior.Auto() })). MaximumAutoInvokeAttempts: limit function call iterations (default varies — set explicitly). Manual function selection: FunctionChoiceBehavior.Required(functions) or FunctionChoiceBehavior.None(). Legacy planners (largely deprecated — do not use for new code): SequentialPlanner, StepwisePlanner, HandlebarsPlanner — all replaced by LLM-native function calling. Note: 🔴 — planning API in SK has undergone significant changes between versions. Legacy planners were removed and replaced. The current approach (FunctionChoiceBehavior) may also evolve. Always check current SK release notes before implementing. This is the most volatile part of SK.
```

#### 3.7 🟡 SK Memory & Vector Store
```
Show SK vector store abstraction for RAG: IVectorStore and IVectorStoreRecordCollection<TKey, TRecord> interfaces. Define a record: public class DocumentChunk { [VectorStoreRecordKey] public string Id { get; set; } [VectorStoreRecordData] public string Text { get; set; } [VectorStoreRecordData] public string Source { get; set; } [VectorStoreRecordVector(Dimensions: 1536)] public ReadOnlyMemory<float> Embedding { get; set; } }. Register store: services.AddQdrantVectorStore(host) or services.AddInMemoryVectorStore() for testing. Operations: collection.UpsertAsync(chunk), collection.GetAsync(id), collection.VectorizedSearchAsync(queryVector, new VectorSearchOptions { Top = 5 }). ITextSearch: higher-level abstraction — plug into SK for automatic RAG via text query (handles embedding + search). VolatileMemoryStore: in-memory for development. Note: 🟡 — SK vector store API was completely redesigned (formerly IMemoryStore, now IVectorStore). This is a breaking change between SK versions. Always verify current API. The abstraction concept is stable but the interface names and methods have changed significantly.
```

#### 3.8 🟡 SK Agents
```
Show Semantic Kernel Agent Framework: higher-level abstraction for autonomous AI. ChatCompletionAgent: var agent = new ChatCompletionAgent { Kernel = kernel, Name = "SupportAgent", Instructions = "You are a helpful customer support agent. Use the available tools to help customers.", Arguments = new KernelArguments(new OpenAIPromptExecutionSettings { FunctionChoiceBehavior = FunctionChoiceBehavior.Auto() }) }. Running: var thread = new ChatHistoryAgentThread(); await foreach (var message in agent.InvokeAsync(new ChatMessageContent(AuthorRole.User, userQuery), thread)) { Console.WriteLine(message.Content); }. AgentGroupChat: multiple agents with selection strategy (who speaks next) and termination strategy (when to stop). Example: TechWriterAgent + ReviewerAgent in group chat — writer drafts, reviewer critiques, termination after N rounds or approval keyword. Persistent threads: store and restore thread history between invocations. Show complete customer service agent with database search tool and escalation tool. Note: 🟡 — Agent Framework is relatively new in SK and APIs are still evolving. Concepts (agent + tools + thread) are stable; specific class names may change.
```

---

### 4. RAG

#### 4.1 🟢 RAG Architecture
```
Explain RAG architecture end-to-end for .NET developers: two distinct phases with different concerns. Indexing pipeline (offline, run once or incrementally): Load documents (PDF, DOCX, HTML, DB records) → Parse to text → Split into chunks (200-1000 tokens each with overlap) → Generate embedding vector per chunk → Store (chunk text + embedding + metadata) in vector database. Query pipeline (online, every user request): Receive user question → (optionally) rewrite/expand query → Embed the query → Search vector DB for top-K similar chunks → (optionally) re-rank results → Build context string from retrieved chunks → Send system prompt + context + question to LLM → LLM generates answer grounded in retrieved context → Return answer (optionally with source citations). Why RAG beats alternatives: cheaper than putting all docs in context (only relevant chunks), fresher than fine-tuning (add new docs anytime), more accurate than pure LLM (grounded in retrieved text), attributable (cite sources). This is 🟢 — the two-pipeline architecture is a stable pattern regardless of which LLM or vector store you use.
```

#### 4.2 🟢 Document Loading & Parsing
```
Cover document loading and text extraction for .NET RAG pipelines. PDFs: PdfPig NuGet (free, open-source — PdfDocument, page.GetWords() for text extraction, preserves reading order), Azure AI Document Intelligence (cloud — handles complex PDFs with tables, forms, mixed content — Azure.AI.FormRecognizer NuGet). Word files: DocumentFormat.OpenXml (Microsoft — read DOCX body paragraphs), Aspose.Words (commercial, most capable). HTML: HtmlAgilityPack (most popular — HtmlDocument, SelectNodes for text), AngleSharp (W3C-compliant HTML parser). Markdown: Markdig NuGet (parse to AST, extract plain text). Plain text: File.ReadAllTextAsync. Email: MimeKit for .eml parsing. Web crawling: HttpClient + HtmlAgilityPack. Key considerations: extract text structure (headings become metadata), strip navigation/footer noise, handle encoding issues. Metadata to attach: source URL or file path, title, author, date, section heading. Show complete DocumentLoader abstraction with implementations per format. This is 🟢 — document parsing patterns are stable; specific library versions update but interfaces don't change meaningfully.
```

#### 4.3 🟢 Chunking in Practice
```
Show chunking implementations in .NET with concrete code. Recursive character splitter (best general approach): try to split at paragraph (\n\n), then sentence (\n), then word ( ), then character — result chunks respect natural boundaries. Fixed-size with overlap: split every N tokens, last M tokens of previous chunk = first M tokens of next — use Microsoft.ML.Tokenizers to count tokens accurately. Semantic chunking: embed each sentence, split where consecutive sentence similarity drops below threshold — higher quality, more expensive. Show complete ChunkingService class: takes document text + metadata, returns IEnumerable<Chunk> (text, chunkIndex, sourceId, startChar, endChar, heading). Optimal chunk sizes: 256 tokens for precise retrieval, 512 for balanced, 1024 for more context per chunk. Overlap: 10-15% overlap prevents losing answer split across boundary. Metadata enrichment: prepend section title to each chunk (improves retrieval). Parent document retriever: store small chunks for precise retrieval, also store parent larger chunk — return parent to LLM for more context. This is 🟢 — chunking strategies are established best practices that don't change with model updates.
```

#### 4.4 🟡 Embedding Pipeline in .NET
```
Show embedding pipeline implementation in .NET: IEmbeddingGenerator<string, Embedding<float>> from MEAI, or direct API calls. Batch processing: embed many chunks at once rather than one at a time — OpenAI embedding API accepts batch of up to 2048 strings — 10-100x faster than individual calls. Show pipeline: read chunks from Channel<Chunk> (producer fills from document processor), batch into groups of 100, call GenerateAsync(batchTexts), zip embeddings back to chunks, write to vector store. Rate limiting: implement token bucket or use Polly rate limiter to stay within embedding API limits (tokens per minute). Incremental indexing: SHA-256 hash of chunk text as cache key — skip embedding if hash already in vector store (IDistributedCache or dedicated table). Embedding dimensions: text-embedding-3-small supports 256/512/1536 dimensions — smaller = faster search, lower quality. Show cost calculation: text-embedding-3-small = $0.02/1M tokens — very cheap. Error handling: retry on 429, log failures with chunk ID for reprocessing. Note: 🟡 — MEAI IEmbeddingGenerator is stable interface, specific model recommendations and prices change.
```

#### 4.5 🟡 Vector Store Integration
```
Show vector store integrations for .NET RAG. pgvector with Npgsql: install pgvector extension, add vector column (HasColumnType("vector(1536)") in EF Core), cosine distance search (1 - (embedding <=> @query_embedding) as similarity ORDER BY embedding <=> @query_embedding LIMIT 5). Qdrant .NET SDK: new QdrantClient(host), client.CreateCollectionAsync(name, new VectorParams { Size = 1536, Distance = Distance.Cosine }), client.UpsertPointsAsync with PointStruct (id + vector + payload), client.SearchAsync(collectionName, queryVector, limit: 10, filter: new Filter { ... }). Azure AI Search: SearchIndex with vector field, SearchClient.SearchAsync with VectorQuery, supports hybrid (vector + keyword) natively. For each: show complete setup, upsert, and search with metadata filtering. Metadata filtering: filter by source document ID, date range, category before or during vector search — critical for multi-tenant RAG (only search user's own documents). Note: 🟡 — specific vector DB client API versions change. pgvector and Qdrant are the most commonly used in .NET. Verify current SDK versions.
```

#### 4.6 🟢 Query Processing & Retrieval
```
Show retrieval implementation in .NET RAG systems. Basic retrieval: embed query → search vector store → return top-K chunks. Query preprocessing: lowercase, remove special characters, expand abbreviations (optional — LLM can often handle raw queries). Embedding the query: same model used for document indexing — use cached embedding if query seen before. Vector search call: return top-10 to top-50 candidates (retrieve more, filter down). Minimum similarity score: filter results below cosine similarity threshold (0.65-0.75 typical — below = probably irrelevant). Context assembly: format retrieved chunks with source labels: "Source [1]: {chunk1.text}\nSource [2]: {chunk2.text}\n..." Handling no results: if no chunks above threshold, respond with "I don't have information about that in my knowledge base" — don't hallucinate. Show complete RetrievalService: takes query string, returns List<RetrievalResult> with text, score, and metadata. Multi-query retrieval: send query to LLM, ask it to generate 3-5 query variants, retrieve for all, deduplicate by chunk ID. This is 🟢 — retrieval patterns are stable regardless of which vector store or LLM you use.
```

#### 4.7 🟡 Hybrid Search in .NET
```
Show hybrid search implementations in .NET RAG: combining dense vector search with sparse BM25 keyword search for better coverage. Azure AI Search (easiest for Azure stacks): SearchClient.SearchAsync with SearchText (BM25 keyword search) + VectorizableTextQuery (vector search) — Azure handles fusion automatically with RRF. Qdrant sparse + dense: create collection with both sparse and dense vector configs, index BM25 sparse vector alongside dense embedding, use Query API with prefetch for both. pgvector + PostgreSQL full-text search: SQL query combining ts_rank(to_tsvector(text), plainto_tsquery(@query)) with embedding cosine distance, normalize both scores to [0,1], weighted sum. Manual RRF: function rrf_score(rank) = 1 / (60 + rank), for each document: total_score = rrf(dense_rank) + rrf(sparse_rank), sort by total_score. Show BM25 sparse vector creation using ML.NET tokenizer. Cover that hybrid search typically improves RAG precision by 10-20% — catches exact term matches (product codes, names) that dense search misses. Note: 🟡 — vector store APIs for hybrid search change. Azure AI Search hybrid is most polished for .NET.
```

#### 4.8 🟡 Re-Ranking in .NET
```
Show re-ranking in .NET RAG pipelines: two-stage retrieval. Stage 1 (fast ANN retrieval): get top-50 candidates from vector store. Stage 2 (slow re-ranking): run cross-encoder model to get precise relevance score for each candidate, return top-5. Cohere Rerank API: POST https://api.cohere.com/v2/rerank, body: { model: "rerank-v3.5", query, documents: [text1, text2...], top_n: 5 }, returns ranked results with relevance_score. Show HttpClient call to Cohere Rerank, deserialize response, filter by minimum score. Azure AI Search semantic ranker: built-in — set SemanticSearch property on SearchOptions — no extra call needed. Local cross-encoder via ONNX: download ms-marco-MiniLM-L-6-v2 in ONNX format, tokenize (query, document) pair, run ORT inference, sigmoid of output = relevance score. Performance comparison: without re-ranking (answer in top-5 60% of time), with re-ranking (85%) — significant improvement. Note: 🟡 — Cohere model names change, ONNX cross-encoder models update. Pattern is stable.
```

#### 4.9 🟢 RAG Generation & Citation
```
Show RAG response generation with source attribution in .NET. System prompt design: "You are a helpful assistant. Answer questions using ONLY the information provided in the context below. If the answer is not in the context, say 'I don't have information about that in my knowledge base.' Cite sources as [Source N] when using information." Context construction: number each retrieved chunk, prepend source label: string.Join("\n\n", chunks.Select((c, i) => $"[Source {i+1}] {c.Text}")). Full prompt: system prompt + "\n\nContext:\n" + context + "\n\nQuestion: " + userQuery. Parse citations: regex match \[Source \d+\] in response, map index to chunk metadata (URL, document title, page number). Citation UI: display answer text with clickable citation badges [1][2][3], clicking opens source document. Groundedness check: optional second LLM call "Is this response fully supported by the provided context? Answer Yes or No and explain." Show complete RAG chat endpoint: retrieval → context construction → LLM call → citation parsing → response DTO. Cover that without citations, enterprise users can't verify answers — citations are essential for trust. This is 🟢 — prompt pattern and citation parsing are stable techniques.
```

#### 4.10 🟡 Advanced RAG Patterns
```
Cover advanced RAG patterns for quality improvement. HyDE (Hypothetical Document Embeddings): generate a hypothetical answer with LLM, embed that answer for retrieval (finds conceptually relevant chunks that match answer format not question format) — one extra LLM call but improves recall. RAG-Fusion: generate 3-5 query variants with LLM, retrieve for each independently, fuse ranked lists with RRF — covers multiple aspects of question. Parent Document Retriever: index small chunks (128 tokens) for precise retrieval, return larger parent chunk (512 tokens) to LLM for more context — best of both worlds. Contextual compression: after retrieval, use LLM to extract only relevant sentences from each chunk before sending to final LLM — reduces context noise. FLARE (Forward-Looking Active Retrieval): LLM generates, then triggers retrieval when generating uncertain text — iterative retrieve-and-generate. Multi-vector retrieval: store multiple embeddings per chunk (chunk + summary + hypothetical questions it answers) — richer retrieval. Show HyDE implementation: one extra generateHypotheticalAnswer() call, embed result, use for retrieval. Note: 🟡 — these are established but not universal patterns. Measure improvement on your specific use case before adding complexity.
```

---

### 5. Function Calling

#### 5.1 🟡 How Function Calling Works
```
Explain function calling mechanism in LLMs for .NET developers. Protocol: (1) send conversation messages + tools array (each tool has name, description, parameter JSON schema) to LLM API, (2) LLM response either has finish_reason="tool_calls" (LLM wants to call a function) with tool_calls array in the message, or finish_reason="stop" (LLM is done), (3) for tool_calls: your code executes each function, creates ToolMessage with result, appends to conversation, calls LLM API again, (4) LLM incorporates results, may call more functions or produce final answer. Tool definition JSON schema: {type: "function", function: {name, description, parameters: {type: "object", properties: {paramName: {type, description}}, required: [...]}}. LLM never executes code — it produces structured JSON representing the call, your code runs it. Multiple iterations possible. Show the full conversation loop in .NET code. Cover that tool descriptions are prompts to the LLM — quality of descriptions determines quality of tool use. Note: 🟡 — function calling API is stable across providers but specific request/response field names vary slightly.
```

#### 5.2 🟡 Defining Tools in .NET
```
Show tool definition approaches in .NET. MEAI AIFunction: AIFunctionFactory.Create(methodInfo, description) or AIFunctionFactory.Create(async (string city) => await weatherService.GetWeather(city), "GetWeather", "Get current weather for a city"). OpenAI SDK tool: ChatTool.CreateFunctionTool("GetWeather", "Get current weather for a city", BinaryData.FromString("""{"type":"object","properties":{"city":{"type":"string","description":"City name"}},"required":["city"]}""")). Semantic Kernel: [KernelFunction][Description] attributes — auto-generates tool definitions. JSON Schema generation: use JsonSchemaExporter or manual BinaryData.FromObjectAsJson with SchemaObject. Enum constraints: {"type": "string", "enum": ["celsius", "fahrenheit"]} — constrains LLM to valid options. Optional parameters: only required names in "required" array. Complex object parameters: nested schema definition. Show generating tool definition from a C# method using reflection + XML doc comments. Cover that tool name should be PascalCase verb (GetWeather, SearchProducts, CreateOrder), description should explain when to call it not just what it does. Note: 🟡 — MEAI AIFunction API stable, OpenAI SDK JSON schema approach stable.
```

#### 5.3 🟡 Auto vs Manual Tool Invocation
```
Compare and show both tool invocation patterns. Automatic invocation (simpler): MEAI UseToolInvocation() middleware wraps IChatClient, detects tool_calls, invokes registered AIFunctions, sends results back, loops until stop — all transparent to calling code. client.AsBuilder().UseFunctionInvocation().Build() — then just CompleteAsync() as normal, framework handles the loop. MaximumFunctionCallsPerRequest to prevent infinite loops. Semantic Kernel: FunctionChoiceBehavior.Auto() — same concept. Manual invocation (more control): check response.FinishReason == ChatFinishReason.ToolCalls, loop through response.ToolCalls, execute each function by name lookup in Dictionary<string, Func<...>>, build ToolCallResultMessage, append to history, call LLM again. Show complete manual loop. When to use manual: need human approval before executing, need to log each tool call to audit DB, need custom error messages per function, need to handle partial failures (some tools succeed, some fail). Cover that auto-invocation is appropriate for most cases — use manual for security-sensitive operations. Note: 🟡 — MEAI middleware API evolving. Show both patterns.
```

#### 5.4 🟡 Parallel Tool Calls
```
Show parallel tool call handling in .NET. LLM request: when multiple independent tool calls needed, LLM returns array of tool_calls in single response (e.g., GetWeather("London") + GetWeather("Paris") + GetWeather("Berlin") — three calls simultaneously). Detection: response.ToolCalls.Count > 1. Parallel execution: var tasks = response.ToolCalls.Select(tc => ExecuteToolAsync(tc)).ToList(); var results = await Task.WhenAll(tasks) — all tools execute in parallel. Result collection: create ToolResultMessage for each tool_call matching by ToolCallId (not position). Append all results, send back to LLM. Error handling per tool: catch exceptions per tool call, send error message as that tool's result — LLM continues with available results. Show complete parallel invocation loop in C#. Ordering: results don't need to be in same order as tool_calls — match by ToolCallId. Cover that parallel execution significantly reduces latency when multiple independent lookups needed. Note: 🟡 — parallel tool calls support varies by model (GPT-4o supports it, some models are sequential only). Verify with your model.
```

#### 5.5 🟢 Tool Safety
```
Cover security for LLM-driven tool invocation in .NET. Threat model: LLM decides which tools to call and with what arguments — user or attacker can influence this via prompt injection. Risks: unauthorized tool calls (prompt injection says "also call DeleteOrder"), path traversal in file tools (ReadFile("../secrets")), scope escalation (user's query accesses another user's data), unintended side effects (irreversible actions). Defense patterns: resource ownership validation (in every tool, verify that requested resource belongs to authenticated user — never trust LLM-provided IDs without DB verification), argument validation (sanitize and validate every argument before execution, reject paths outside allowed directories), action audit log (log every tool invocation with user identity, arguments, result — for security review and compliance), read-only tools by default (make tools that modify state require explicit confirm=true argument — LLM must intentionally set it), human approval for sensitive actions (before DeleteOrder or SendEmail, require explicit user confirmation — show action to user, await approval), tool scope restriction (register only tools relevant to current context — don't expose admin tools to regular users). This is 🟢 — security patterns are stable best practices regardless of which LLM or SK version.
```

#### 5.6 🟡 Tool Calling with Semantic Kernel
```
Show SK-specific tool calling patterns. Auto invocation: kernel.InvokePromptAsync("Find me a 3-star hotel in Paris under $100 per night", new KernelArguments(new OpenAIPromptExecutionSettings { FunctionChoiceBehavior = FunctionChoiceBehavior.Auto() })). Manual function choice: FunctionChoiceBehavior.Required(kernel.Plugins["HotelPlugin"]["SearchHotels"]) forces LLM to call specific function. Accessing invocation history: SKInferenceEventArgs captures each function call — subscribe to kernel events. Filter pattern for tool security: IAutoFunctionInvocationFilter — called before each auto-invoked function, can inspect arguments and throw to abort. Show complete example: register HotelPlugin with SearchHotels and BookHotel functions, auto-invocation prompt, IAutoFunctionInvocationFilter that validates user has permission to book, logs each call. Cover that SK's built-in auto-invocation loop handles tool result injection and continuation automatically — less boilerplate than manual. Note: 🟡 — FunctionChoiceBehavior API is current approach but may evolve. Verify SK release notes.
```

---

### 6. Structured Output

#### 6.1 🟡 JSON Mode & Structured Output APIs
```
Show structured JSON output from LLMs in .NET. Three levels of strictness: Prompt-only (ask nicely for JSON — unreliable, sometimes adds markdown fences), JSON Mode (force valid JSON output — OpenAI: ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat() — valid JSON guaranteed, schema not enforced), Structured Output / JSON Schema (force output matching specific schema — OpenAI gpt-4o-mini and above: ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(jsonSchemaFormatName, BinaryData.FromObjectAsJson(schema), strictSchemaEnabled: true) — schema compliance guaranteed). Show all three approaches with C# code. Show extracting typed object: JsonSerializer.Deserialize<MyResponseDto>(completion.Value.Content[0].Text). Schema generation from C# class: JsonSerializerOptions + schema reflection. MEAI approach: await chatClient.CompleteAsync<MyResponseDto>(messages) — auto-generates schema from type, auto-deserializes response. Note: 🟡 — structured output API is stable (OpenAI and Azure OpenAI both support it) but MEAI generic approach may change. Verify current method name for typed completion.
```

#### 6.2 🟢 Designing Schemas for LLM Output
```
Cover schema design for reliable LLM structured output. Design principles: keep schemas simple (fewer fields = fewer mistakes), use descriptive field names (customerName not cn), avoid deeply nested objects (LLMs struggle with deep nesting), use enums for constrained choices (status: "pending"|"approved"|"rejected" not free string), add field descriptions in JSON Schema description property (LLM reads these). Example: document classification schema with fields: category (enum), confidence (0-1 float), extractedEntities (array of {type, value, position}), summary (string max 200 chars), requiresHumanReview (boolean). Nullable vs required: mark truly optional fields as nullable (null = not applicable), required = must always be present. Arrays: specify minItems/maxItems to prevent hallucinated extra items. Date format: specify "format": "date" or "date-time" in schema — LLM will use ISO 8601. Common pitfall: schema too complex → LLM hallucinates fields → validation fails → retry needed. Show a well-designed extraction schema vs an over-engineered one. This is 🟢 — schema design principles are stable best practices independent of model or API.
```

#### 6.3 🟡 Constrained Generation
```
Cover approaches to constrained LLM output beyond JSON mode: Outlines library (Python — grammar-based constrained decoding, regex and JSON Schema enforcement, not natively .NET), LM-Format-Enforcer (Python — similar). For .NET: local models via ONNX (harder to constrain), rely on JSON Schema mode (OpenAI/Azure — most practical for .NET), prompt engineering with examples (few-shot JSON examples + instruction). Guidance library (Microsoft research — C# implementation — interleaves generation with constraints — experimental). Practical .NET approach: use structured output API where available (OpenAI, Azure OpenAI), for other models use JSON mode + strict validation. Fallback when schema violated: parse attempt → if fails, extract with regex patterns → if still fails, retry with explicit correction prompt ("Your previous response was not valid JSON. Please respond with only valid JSON matching this schema:"). Show complete validation-and-retry pattern: try JsonSerializer.Deserialize → on JsonException, send correction prompt, retry up to 3 times. Note: 🟡 — this area is evolving (more providers adding structured output). Verify current provider support.
```

#### 6.4 🟢 Document Information Extraction
```
Show document information extraction patterns in .NET using LLMs. Entity extraction: extract named entities from text — define schema (persons, organizations, dates, amounts), use structured output. Form data extraction: extract fields from unstructured form text — define expected fields as schema with optional fields for partial extraction. Receipt/invoice extraction: amount, vendor, date, line items — structured output schema. Classification + extraction combined: classify document type AND extract relevant fields for that type. Two-pass approach: (1) classify document type with cheap fast model, (2) extract type-specific fields with targeted prompt + schema. Chunked extraction for long documents: split long document, extract from each chunk, merge results (deduplication needed). Confidence scoring: include confidence field in schema, filter low-confidence extractions for human review. Show complete invoice extraction pipeline: parse PDF → chunk if long → extract to InvoiceDto (vendor, date, amount, lineItems, currency) → validate totals → return result. Show accuracy improvement with few-shot examples in the prompt. This is 🟢 — extraction patterns are stable; specific model performance varies.
```

#### 6.5 🟢 Validation & Retry for Structured Output
```
Show robust validation and retry for structured output in .NET. Validation layers: JSON validity (JsonSerializer.Deserialize — catch JsonException), schema compliance (System.Text.Json schema validation or JsonSchemaValidator), business rule validation (required fields populated, amounts positive, dates valid, enums in allowed set). Retry strategy: on validation failure, construct correction prompt including the invalid response and specific error ("The previous response had: [validation error]. Please try again with valid JSON matching the schema."). Show ValidationResult with error details, RetryWithCorrectionAsync that includes original + error in retry prompt. Max retries: 2-3 attempts — if still failing after 3, fall back to manual processing. Telemetry: track retry rate per schema type (high retry rate = prompt or schema design issue). Common failures: markdown fences around JSON (strip with regex before parsing), extra fields (use JsonSerializer with JsonIgnoreCondition.WhenWritingNull or ignore unknown fields), null where non-null expected (make field nullable or improve prompt). Show utility method CleanJsonResponse(string response) that strips markdown fences. This is 🟢 — validation and retry patterns are stable best practices.
```

---

### 7. AI Agents

#### 7.1 🟢 What Is an Agent
```
Explain AI agents for .NET developers: an agent is a system that perceives its environment, decides actions, and executes them — autonomously completing multi-step tasks. Perceive: receive input (user message, tool results, external events), update internal state. Plan/Decide: determine what action to take next (LLM provides the reasoning, decides which tool to call or whether to respond). Act: execute the chosen action (call a function, search the web, write to DB, send an email). Loop: repeat until task is complete or needs human input. Simple agent: LLM + tools + loop. Agentic behavior: multiple tool calls, branching based on results, handling errors, multi-step completion. Example: "Schedule a meeting with the team about Q3 review" → agent: checks calendar availability → finds conflicts → proposes times → sends invites — all autonomously. Key requirement: reliable tool execution + good error handling. This is 🟢 — the perceive-plan-act loop is a stable conceptual framework. Specific implementation approaches are 🟡-🔴.
```

#### 7.2 🟡 ReAct Pattern
```
Show ReAct (Reasoning + Acting) pattern implementation in .NET. Pattern: LLM interleaves thoughts (reasoning) with actions (tool calls). Each step: Thought (LLM explains its reasoning), Action (LLM calls a tool), Observation (tool result returned), repeat until Thought says "I have enough information to answer." System prompt for ReAct: "You are an agent that solves tasks step by step. Think about what you need to do before taking an action. Available tools: {tool descriptions}. Format: Thought: [your reasoning] Action: [tool name]({arguments}) Observation: [tool result will appear here]". Parsing: extract Action from response, execute tool, inject Observation, continue. Modern approach: use native function calling instead of manual parsing — LLM's function calling capability implements ReAct automatically (each tool_call is an Action, tool result is Observation). Show both approaches. Cover that explicit Thought steps improve reasoning quality (chain-of-thought) for complex tasks. Semantic Kernel implements this via FunctionChoiceBehavior.Auto + tool filters that log reasoning. Note: 🟡 — ReAct with native function calling is the current recommended approach. Manual ReAct parsing is legacy but still seen.
```

#### 7.3 🟡 SK Agent Framework
```
Show Semantic Kernel Agent Framework in practice. Single agent: new ChatCompletionAgent { Kernel = kernel, Name = "ResearchAgent", Instructions = "Research the given topic using available tools and provide a comprehensive summary with citations.", Arguments = new KernelArguments(new OpenAIPromptExecutionSettings { FunctionChoiceBehavior = FunctionChoiceBehavior.Auto() }) }. Add tools via kernel plugins. Invoke: AgentThread thread = new(); await foreach (var response in agent.InvokeAsync(new ChatMessageContent(AuthorRole.User, userInput), thread)) { HandleMessage(response); }. Thread persistence: serialize/deserialize ChatHistory from thread for multi-session persistence. Multi-agent via AgentGroupChat: var chat = new AgentGroupChat(writerAgent, editorAgent) { ExecutionSettings = new AgentGroupChatSettings { TerminationStrategy = new ApprovalTerminationStrategy() } }; await foreach (var content in chat.InvokeAsync()) { Console.WriteLine(content.Content); }. Show termination strategies: keyword detection ("APPROVED"), maximum turn count, custom logic. Note: 🟡 — SK Agent API is relatively new (added 2024) and actively evolving. API signatures may change. Verify Microsoft.SemanticKernel.Agents package.
```

#### 7.4 🔴 Multi-Agent Systems
```
Explain multi-agent system patterns for .NET: multiple specialized agents collaborating on complex tasks. Common patterns: Manager-Worker (orchestrator agent breaks down task, delegates to specialist agents — DataAnalysisAgent, ReportWriterAgent, ReviewerAgent), Critic-Actor (one agent produces, another critiques — loop until quality threshold), Parallel Agents (fan out same query to multiple specialized agents, synthesizer combines), Pipeline (output of one agent = input to next). Communication: in-process via shared Channel<AgentMessage>, via message broker (RabbitMQ/Kafka for distributed agents), via shared memory store. Coordination: shared context (all agents read/write same state), message passing (agents send typed messages). Challenges: context size grows with multi-agent conversation, agents can loop indefinitely, hard to debug, cost multiplies with agent count. Show SK AgentGroupChat as multi-agent within process. Cover that multi-agent systems are powerful but complex — start with single agent + many tools before adding agents. Note: 🔴 — multi-agent frameworks and best practices are rapidly evolving. Microsoft AutoGen, SK Agents, LangGraph all offer different patterns. Evaluate current options before committing to a framework.
```

#### 7.5 🟢 Agent Memory
```
Cover memory types for AI agents in .NET: Short-term memory (in-context — conversation history held in ChatHistory — limited by context window, lost on session end — simplest approach, use for single session tasks), Long-term memory (persistent storage — vector DB of past interactions, facts, user preferences — retrieved based on relevance via similarity search — enables remembering across sessions), Episodic memory (logs of past agent actions and outcomes — enables learning from past tasks — "I tried this approach before and it failed"), Working memory (current task context — shared state across agent steps, passed as context or stored in temporary KV store). Implementation in .NET: short-term via ChatHistory in memory (IHostedService + ConcurrentDictionary<sessionId, ChatHistory>), long-term via vector store (embed important facts, retrieve similar context for new query), episodic via structured logging (append-only log of agent actions). Cover memory summarization: when ChatHistory exceeds token budget, summarize older messages with LLM, replace with summary. This is 🟢 — memory taxonomy is stable; specific implementation libraries vary.
```

#### 7.6 🟢 Human-in-the-Loop
```
Cover human-in-the-loop patterns for production agents: when agents should pause and ask for human approval. When to require human approval: irreversible actions (send email, delete record, make payment, deploy code), high-stakes decisions (anything with significant business impact), uncertain actions (agent confidence below threshold, ambiguous instructions), first-time patterns (agent wants to take an action it has never done before). Implementation patterns: approval channel (agent publishes ApprovalRequest to queue, human reviews via dashboard, approves/rejects, agent receives result via callback), interrupt and wait (agent pauses execution, signals via SignalR/webhook that approval needed, resumes when approved), staged execution (agent plans full task and shows plan, human approves plan, agent executes without further interruption). Show approval workflow in ASP.NET Core: agent creates PendingAction in DB, returns response to user ("I'll send that email — please confirm"), user confirms via POST /agents/{sessionId}/approve, IHostedService resumes agent. Cover timeout: if no human response in N minutes, cancel or default-deny. This is 🟢 — HITL is a fundamental safety pattern that won't change conceptually.
```

#### 7.7 🟢 Agent Safety
```
Cover safety controls for .NET AI agents — preventing runaway or harmful behavior. Iteration limits: MaximumAutoInvokeAttempts (SK), manual loop counter — hard limit on tool call iterations per user request (5-20 typical). Timeout: CancellationToken with overall agent timeout (30-120 seconds) — kill agent if taking too long. Tool rate limiting: SemaphoreSlim per tool type — max N calls to SearchWeb per session, prevents agents from hammering external APIs. Scope constraints: only register tools appropriate for the current user and context — don't expose admin tools to regular users. Action logging: every tool call logged with timestamp, user identity, arguments, result — for audit and anomaly detection. Budget enforcement: track LLM token usage per session, kill agent if exceeding budget (prevents runaway cost). Output scanning: scan agent output for sensitive data before returning (regex for SSNs, credit cards, passwords). Sandboxing tool execution: run code execution tools in isolated process/container. Circuit breaker: if agent calls same tool 3 times with same arguments (stuck loop), break and return error. This is 🟢 — safety patterns are stable best practices that apply regardless of agent framework.
```

#### 7.8 🔴 AutoGen & Assistants API
```
Cover AutoGen and OpenAI Assistants API from .NET. Microsoft AutoGen (.NET): framework for multi-agent conversations — AssistantAgent (LLM-based), ConversableAgent (can receive/send messages), UserProxyAgent (represents human), GroupChat (multiple agents + termination condition). Python-first but .NET port available. Show creating two-agent workflow: UserProxy + AssistantAgent, AutoGen manages the conversation loop. OpenAI Assistants API: stateful agent API — create Assistant (instructions + tools + model), create Thread (conversation), add Message to Thread, create Run (execute), poll Run status, retrieve Messages. Persistent threads: OpenAI stores conversation history (no ChatHistory management needed). Built-in tools: code_interpreter (executes Python), file_search (RAG over uploaded files). Show complete Assistants API workflow from .NET via HttpClient or OpenAI SDK. SK AgentGroupChat vs AutoGen: SK is .NET-native and integrates with SK plugins, AutoGen has more mature multi-agent patterns. Note: 🔴 — both AutoGen .NET and Assistants API are evolving rapidly. Assistants API still marked beta by OpenAI. Framework choices for multi-agent are unsettled. Verify current API status and stability before building production systems.
```

---

### 8. ML.NET

#### 8.1 🟡 ML.NET Architecture
```
Show ML.NET architecture and core concepts. MLContext: the entry point for all ML.NET operations — one per application (non-thread-safe for model training, thread-safe for prediction). IDataView: lazy data abstraction — reads from CSV, DB, in-memory — schema-aware, doesn't load all data into memory. Pipeline: chain of estimators — IEstimator transforms data or trains model. Trained model = ITransformer — applies transformation to new data. Key components: LoadersAndSavers (read/write data), Transforms (feature engineering — text featurization, normalization, encoding), Trainers (ML algorithms — FastTree, SdcaLogisticRegression, LightGbm). Training flow: context.Data.LoadFromTextFile<T>() → build pipeline (transforms + trainer) → pipeline.Fit(trainingData) → ITransformer. Prediction: PredictionEngine<TInput, TOutput>.Predict(input). Thread-safe prediction for web: PredictionEnginePool<T, P> (registered in DI, manages pool of PredictionEngines). Note: 🟡 — ML.NET API is stable for core functionality. Verify specific trainer and transform class names for your version.
```

#### 8.2 🟡 Data Loading & Transformation
```
Show ML.NET data loading and transformation pipeline. Data loading: LoadFromTextFile<T>(path, separatorChar: ',', hasHeader: true) for CSV, LoadFromEnumerable<T>(collection) for in-memory, custom IDataView for DB. Data schema: POCO class with [LoadColumn(index)] attributes or column name mapping. Transforms: NormalizeMeanVariance (scale numeric features), OneHotEncoding (categorical to binary), FeaturizeText (text to TF-IDF numeric features), CopyColumns, DropColumns, ReplaceMissingValues, SelectColumns. Feature concatenation: Concatenate("Features", "NumericFeature1", "NumericFeature2", "EncodedCategory") — combines columns into single "Features" vector for trainer. Complete pipeline: var pipeline = context.Transforms.FeaturizeText("TextFeatures", "ReviewText") .Append(context.Transforms.NormalizeMeanVariance("Features")) .Append(context.Transforms.Concatenate("Features", "NumericFeatures", "TextFeatures")) .AppendCacheCheckpoint(context) .Append(trainer). Show training on CSV with mixed numeric + text features. Note: 🟡 — transform class names are stable but new transforms added in each release.
```

#### 8.3 🟡 Classification in ML.NET
```
Show binary and multiclass classification in ML.NET. Binary classification (true/false — spam/not spam, fraud/not fraud): var trainer = context.BinaryClassification.Trainers.SdcaLogisticRegression(labelColumnName: "Label", featureColumnName: "Features") or FastTree or LightGbm. Label column must be bool. Evaluate: context.BinaryClassification.Evaluate(testData), returns BinaryClassificationMetrics (Accuracy, AUC, F1, AreaUnderPrecisionRecallCurve). Multiclass (3+ categories — product category, sentiment 5-star): var trainer = context.MulticlassClassification.Trainers.SdcaMaximumEntropy() or LightGbm. Label column must be key type (StringToKey transform). Evaluate: MulticlassClassificationMetrics (MacroAccuracy, MicroAccuracy, LogLoss, ConfusionMatrix). Show complete example: predict customer churn (binary) from features (tenure, monthly charge, contract type). Calibration for probabilities: context.BinaryClassification.Calibrators.Platt(). PredictionOutput class: bool PredictedLabel, float Probability, float Score. Note: 🟡 — trainer names and evaluation metric properties stable. New trainers added. Verify LightGbm NuGet package.
```

#### 8.4 🟡 Regression in ML.NET
```
Show regression in ML.NET. Trainers: FastForest (robust, handles non-linearity), FastTree (gradient boosted trees), LightGbm (fastest, often best quality), Sdca (linear — fast, interpretable). Label column: float type. Complete example: predict house price from features (bedrooms, sqft, location_encoded, age). Pipeline: load data → encode categorical (neighborhood) → normalize numeric → concatenate features → regression trainer. Evaluate: context.Regression.Evaluate(testData) — RegressionMetrics: RSquared, MeanAbsoluteError, MeanSquaredError, RootMeanSquaredError, LossFunction. PredictionOutput: float Score (the predicted value). Show R-squared interpretation: 0.85 means model explains 85% of variance. Show feature importance from FastTree model. Time series forecasting: context.Forecasting.ForecastBySsa() — Singular Spectrum Analysis for time series. Note: 🟡 — regression trainers are stable. LightGBM requires separate Microsoft.ML.LightGbm NuGet. Verify SSA forecasting NuGet package.
```

#### 8.5 🟡 Anomaly Detection in ML.NET
```
Show anomaly detection in ML.NET for production scenarios. Use cases: fraud detection, equipment failure prediction, network intrusion, quality control outliers. Time series anomaly detection: SrCnn (Spectral Residual + CNN — detects spikes and change points in time series), IidSpike (independent data — spike detection), IidChangePoint (change point detection). Static anomaly detection: RandomizedPca (PCA-based — unsupervised — learns normal data distribution, flags deviations). Complete example: detect anomalous server metrics (CPU spikes, unusual latency). SrCnn: context.AnomalyDetection.DetectEntireAnomalyBySrCnn(data, "Score", "Prediction", "Value"). Output: IsAnomaly, Score, ExpectedValue. Integration with monitoring: IHostedService reads time series metrics from DB, runs anomaly detection periodically, sends alert if anomaly detected. Note: 🟡 — anomaly detection trainers are stable functionality. SrCnn requires Microsoft.ML.TimeSeries NuGet. Verify current package dependencies.
```

#### 8.6 🟡 Text Classification in ML.NET
```
Show text classification and sentiment analysis in ML.NET. Built-in text featurization: FeaturizeText converts raw text to TF-IDF numeric features, handles tokenization, n-grams, word weighting. Sentiment example: var pipeline = context.Transforms.Text.FeaturizeText("Features", "ReviewText") .Append(context.BinaryClassification.Trainers.SdcaLogisticRegression()). Training data: List<SentimentData> { new { ReviewText = "Great product!", Sentiment = true }, ... }. Deep learning text classification via ONNX: load ONNX model from Hugging Face (DistilBERT fine-tuned for sentiment), preprocess text to token IDs, run OnnxTransformer, interpret output logits. Compare: TF-IDF (fast, no GPU, works with 1000+ examples, less accurate on complex text) vs ONNX fine-tuned model (more accurate, requires GPU or slower CPU, pre-trained). ProductReview classification: 5-star prediction using TF-IDF + FastForest on text features. Show complete training, saving, loading, and predicting pipeline. Note: 🟡 — text featurization in ML.NET works but Hugging Face models via ONNX often outperform it significantly.
```

#### 8.7 🟡 AutoML in ML.NET
```
Show AutoML in ML.NET: automatically searches for best algorithm and hyperparameters. API: context.Auto().CreateBinaryClassificationExperiment(30) — runs for 30 seconds, tries multiple algorithms. Configure experiment: ExperimentSettings with MaxExperimentTimeInSeconds, OptimizingMetric, CancellationToken. Execute: var result = experiment.Execute(trainData, labelColumnName: "Label"). Best model: result.BestRun.Model. All runs: result.RunDetails with metrics per algorithm tried. Model Builder (VS Extension): GUI-based — right-click project → Add ML Model → select scenario (sentiment, classification, regression) → choose data → AutoML runs → generates C# code. Supported scenarios in Model Builder: Binary Classification, Multiclass, Regression, Recommendation, Image Classification, Object Detection, Text Classification, Forecasting. When to use AutoML: don't know which algorithm to use, want to quickly benchmark options, non-ML developer needing a working model. Limitations: AutoML is slower than targeted algorithm selection, may not find best model for complex scenarios. Note: 🟡 — AutoML API is stable, Model Builder extension updates with Visual Studio.
```

#### 8.8 🟡 ML.NET Deployment in ASP.NET Core
```
Show ML.NET model deployment in ASP.NET Core. Save trained model: context.Model.Save(model, trainingData.Schema, "model.zip"). Load in ASP.NET Core: services.AddPredictionEnginePool<TInput, TOutput>(options => options.UseModelFromFile("model.zip")) — auto-loads and manages pool of PredictionEngines for thread safety. Inject: inject PredictionEnginePool<SentimentData, SentimentPrediction> into controller/service. Predict: var prediction = predictionEnginePool.Predict(input). Controller endpoint: POST /api/predict returns SentimentPrediction. Warm-up: call Predict once on startup to JIT-compile the model. Model hot-reload: UseModelFromUri or watch file system for model.zip updates — swap without restart. Performance: PredictionEngine is not thread-safe (PredictionEnginePool manages multiple instances — one per request), single prediction ~1-10ms on CPU (no GPU needed for classical ML). Memory: loaded model in memory, typically 10-100MB depending on complexity. Show complete Minimal API with ML.NET sentiment prediction. Note: 🟡 — PredictionEnginePool DI integration is stable. Verify Microsoft.Extensions.ML NuGet package.
```

---

### 9. ONNX Runtime

#### 9.1 🟡 What Is ONNX
```
Explain ONNX (Open Neural Network Exchange) for .NET developers. ONNX: standard format for ML models — trained in any framework (PyTorch, TensorFlow, scikit-learn, Hugging Face), exported to .onnx file, run in any ONNX-compatible runtime on any platform. Why it matters for .NET: run state-of-the-art ML models without Python in production, single inference library supports hundreds of model architectures, significant performance optimization via graph optimizations and hardware-specific execution providers. Model ecosystem: Hugging Face Model Hub (thousands of pre-exported ONNX models), ONNX Model Zoo, custom exports. ONNX graph: computational graph of operations (nodes = math ops, edges = tensors) — runtime executes this graph efficiently. Advantages over other approaches: no Python runtime needed, cross-platform (Windows/Linux/Mac/ARM), hardware acceleration (CPU/GPU/NPU), model is a single .onnx file (easy deployment), active optimization by hardware vendors (NVIDIA, AMD, Intel, Microsoft, Apple all optimize for ONNX). Show where ONNX fits: ML.NET uses ONNX internally for deep learning, Semantic Kernel can use local ONNX models. Note: 🟡 — ONNX standard is stable; specific model formats and opset versions evolve.
```

#### 9.2 🟡 Running ONNX Inference
```
Show ONNX Runtime inference in .NET step by step. NuGet: Microsoft.ML.OnnxRuntime. Basic inference: var session = new InferenceSession("model.onnx"), create input tensors, var outputs = session.Run(inputs), extract output tensor. Input tensor creation: OrtValue.CreateTensorValueFromMemory(data, shape) where data is float[], long[], or string[], shape is long[]. Named inputs: session.InputNames shows expected input names, create NamedOnnxValue collection. Output extraction: outputs["output_name"].AsEnumerable<float>() or .AsTensor<float>(). SessionOptions: SessionOptions opts = new(); opts.GraphOptimizationLevel = GraphOptimizationLevel.ORT_ENABLE_ALL; opts.EnableMemoryPattern = true. Inference session reuse: create once per application, reuse across requests — InferenceSession is thread-safe. Show complete text classification example: tokenize text to input_ids and attention_mask (long tensors), run BERT ONNX model, softmax output logits to class probabilities. Note: 🟡 — ORT API is stable for core inference. OrtValue API (newer) replaces NamedOnnxValue for better performance. Verify current recommended API.
```

#### 9.3 🟡 Exporting Models to ONNX
```
Show how to export trained models to ONNX format from Python for use in .NET. PyTorch: torch.onnx.export(model, sample_input, "model.onnx", opset_version=17, input_names=["input_ids", "attention_mask"], output_names=["logits"], dynamic_axes={"input_ids": {0: "batch", 1: "seq_len"}}). Scikit-learn: sklearn2onnx library (skl2onnx) — convert_sklearn(clf, initial_type, target_opset=17). Hugging Face Transformers: optimum library (from optimum.exporters.onnx import main_export) — handles tokenizer and model export together. HuggingFace Hub ONNX: many models have pre-exported ONNX versions in onnx/ folder — download directly. Dynamic axes: set batch_size and sequence_length as dynamic for variable input sizes. Opset version: use 17 or 18 for best compatibility with ORT. Validation: run Python and .NET inference on same input, compare outputs — catch export bugs early. Show complete export script for a text classifier + download from Hub. Note: 🟡 — export APIs stable in concept but optimum library and opset recommendations change with model updates.
```

#### 9.4 🟡 Execution Providers
```
Cover ONNX Runtime execution providers for hardware acceleration. CPU (default): all platforms, no extra config, good baseline performance. CUDA (NVIDIA GPU): OrtCUDAProviderOptions, requires CUDA + cuDNN installed, Microsoft.ML.OnnxRuntime.Gpu NuGet, add CUDA EP: options.AppendExecutionProvider_CUDA(). DirectML (Windows GPU): uses DirectX 12, works on NVIDIA/AMD/Intel on Windows, Microsoft.ML.OnnxRuntime.DirectML NuGet, good for Windows deployment without CUDA. CoreML (Apple Silicon): macOS/iOS, uses Neural Engine, options.AppendExecutionProvider_CoreML(). TensorRT (NVIDIA): maximum GPU performance, requires TensorRT installed, model compilation step on first run. ONNXRuntime on ARM: automatic CPU EP with NEON optimizations — good for Raspberry Pi, mobile. EP selection strategy: dev machine (CPU EP), production server with NVIDIA GPU (CUDA EP), Azure Windows VM (DirectML), ARM edge device (CPU with NEON). Show EP configuration with fallback: try CUDA, fall back to CPU. Performance comparison: BERT inference — CPU 200ms, DirectML 40ms, CUDA 15ms. Note: 🟡 — EP API stable but package names and CUDA version requirements change.
```

#### 9.5 🟡 Optimizing ONNX Models
```
Cover ONNX model optimization for .NET deployment. ORT graph optimizations: SessionOptions.GraphOptimizationLevel (ORT_ENABLE_ALL — fuses operations, eliminates redundant ops — always enable in production), SaveOptimizedModel to serialize optimized graph. Quantization (reduce precision to speed up inference): dynamic quantization (INT8 weights, FP32 activations — smaller model, faster on CPU — quantize_dynamic in Python), static quantization (INT8 weights and activations — requires calibration data — best performance), FP16 (keep FP16 weights — fast on modern GPUs). ORT Quantization tool: quantize_dynamic(model_path, quantized_path) in Python. Size/performance impact: BERT FP32 (440MB) → INT8 dynamic quantized (110MB), inference 2-4x faster on CPU. ORT Extensions: pre/post processing operators for text and image models. Execution providers as optimization: CUDA + TensorRT for maximum GPU performance. Memory optimization: IntraOpNumThreads, InterOpNumThreads (set to CPU count), EnableMemoryPattern, EnableCpuMemArena. Note: 🟡 — quantization APIs in Python ORT change. Verify current quantization approach for your model type.
```

#### 9.6 🟡 HuggingFace Models in .NET
```
Show running Hugging Face Transformers models in .NET via ONNX. Download ONNX model: many HF models have onnx/ folder in repository — download model.onnx and tokenizer files (tokenizer.json, tokenizer_config.json, vocab.txt). Tokenization in .NET: Microsoft.ML.Tokenizers NuGet — BertTokenizer, Cl100kBase, LlamaTokenizer. Create input tensors from token IDs and attention mask. Run inference. Post-process output (argmax for classification, softmax for probabilities). Popular model types: DistilBERT (text classification, sentiment, NER — small, fast, ONNX available), MiniLM (sentence embeddings — all-MiniLM-L6-v2 — fast, high quality, 22MB), BERT (larger, more accurate), Phi-3-mini (small LLM — 3.8B params). Show complete sentiment analysis: download DistilBERT ONNX → tokenize → run → decode. Show sentence embedding: download all-MiniLM-L6-v2 ONNX → tokenize → run → mean pool output → normalize. Cover that running locally means: no API costs, full privacy, ~100-500ms latency on CPU (vs ~200ms API call). Note: 🟡 — specific model recommendations change as better models are released. Verify MTEB leaderboard for current best embedding models.
```

#### 9.7 🟡 ONNX Runtime GenAI
```
Show ONNX Runtime GenAI for LLM inference in .NET: Microsoft.ML.OnnxRuntimeGenAI NuGet. Purpose: run quantized LLMs (Phi-3, LLaMA, Mistral) locally in .NET without Python. Model setup: download Phi-3-mini-4k-instruct-onnx from Hugging Face (includes model.onnx, model weights as onnx_data files, genai_config.json). Inference: var model = new Model(modelPath); var tokenizer = new Tokenizer(model); var sequences = tokenizer.Encode(prompt); var generatorParams = new GeneratorParams(model); generatorParams.SetInputSequences(sequences); generatorParams.SetSearchOption("max_length", 200); var generator = new Generator(model, generatorParams); while (!generator.IsDone()) { generator.ComputeLogits(); generator.GenerateNextToken(); var token = tokenizer.Decode(generator.GetSequence(0)[^1..]); Console.Write(token); }. Streaming: tokens produced one at a time in the while loop — update UI incrementally. Model sizes: Phi-3-mini-4k-int4 (~2GB) fits on most PCs. Note: 🟡 — OnnxRuntime GenAI is actively developed (2024 release). API may change between versions. Verify current API — NuGet package and class names have changed in recent releases.
```

---

### 10. Embeddings in .NET

#### 10.1 🟡 Generating Embeddings
```
Show embedding generation in .NET. Via API (recommended for quality): OpenAI text-embedding-3-small via EmbeddingClient: GenerateEmbeddingAsync(text) → EmbeddingMetric, .ToFloats(). Azure OpenAI embedding deployment. MEAI IEmbeddingGenerator<string, Embedding<float>>: await generator.GenerateAsync(new[] { text1, text2 }) → IList<Embedding<float>>, each .Vector is ReadOnlyMemory<float>. Via ONNX (local, privacy, no cost): load all-MiniLM-L6-v2 or similar ONNX embedding model, tokenize, run inference, mean-pool output hidden states, L2-normalize. API model selection: text-embedding-3-small (1536 dims, cheap $0.02/1M, good quality), text-embedding-3-large (3072 dims, more expensive, better quality), ada-002 (legacy, 1536 dims — use text-embedding-3-small instead). Batch size: embed 100 texts at once (API accepts up to 2048 per request), much faster than individual calls. Response caching: Redis cache with SHA-256 hash of text as key, TTL 24h — for frequently re-embedded texts (system prompts, common queries). Note: 🟡 — embedding model names and pricing change. MEAI IEmbeddingGenerator API stable in concept.
```

#### 10.2 🟡 Semantic Search
```
Show complete semantic search implementation in .NET. Search flow: user query → embed query (same model as indexing) → cosine similarity search in vector store → return top-K most similar chunks → format results. Embedding query: same IEmbeddingGenerator used for indexing. Similarity search: pgvector: SELECT id, text, 1 - (embedding



INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - INCOMPLETE - 
