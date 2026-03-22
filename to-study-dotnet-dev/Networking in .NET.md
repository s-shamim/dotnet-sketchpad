# Networking in .NET
## A Comprehensive Learning Guide

> **How to use this document:** Each section contains a *prompt* you can paste into an AI assistant (or ask me directly) to generate the full content for that topic. Topics are organized from foundational concepts to advanced implementations.

---

## Table of Contents

1. [Networking Fundamentals](#1-networking-fundamentals)
   - 1.1 [How the Internet Works — Big Picture](#11-how-the-internet-works)
   - 1.2 [The OSI Model — 7 Layers Explained](#12-the-osi-model)
   - 1.3 [The TCP/IP Model — Practical Reality](#13-the-tcpip-model)
   - 1.4 [Network Topologies and Infrastructure](#14-network-topologies)
   - 1.5 [Packets, Frames, and Data Encapsulation](#15-packets-frames-and-encapsulation)
   - 1.6 [Bandwidth, Latency, Throughput & Jitter](#16-bandwidth-latency-throughput--jitter)

2. [IP Addressing](#2-ip-addressing)
   - 2.1 [IPv4 — Structure, Classes, and CIDR](#21-ipv4)
   - 2.2 [Subnetting — Masks, Ranges, and Calculations](#22-subnetting)
   - 2.3 [Public vs Private IP Addresses (RFC 1918)](#23-public-vs-private-ip)
   - 2.4 [NAT — Network Address Translation](#24-nat)
   - 2.5 [IPv6 — Structure, Types, and Adoption](#25-ipv6)
   - 2.6 [IPv4 vs IPv6 Dual-Stack in .NET](#26-ipv4-vs-ipv6-in-net)
   - 2.7 [Working with IP Addresses in .NET (`IPAddress`, `IPNetwork`)](#27-ip-addresses-in-net)

3. [DNS — Domain Name System](#3-dns)
   - 3.1 [How DNS Works — Resolution Process](#31-how-dns-works)
   - 3.2 [DNS Record Types (A, AAAA, CNAME, MX, TXT, SRV, PTR)](#32-dns-record-types)
   - 3.3 [DNS Hierarchy — Root, TLD, Authoritative Servers](#33-dns-hierarchy)
   - 3.4 [DNS Caching and TTL](#34-dns-caching-and-ttl)
   - 3.5 [DNS Security (DNSSEC, DNS over HTTPS, DNS over TLS)](#35-dns-security)
   - 3.6 [DNS Resolution in .NET (`Dns`, `DnsEndPoint`)](#36-dns-in-net)
   - 3.7 [Custom DNS Resolution with `IHttpClientFactory`](#37-custom-dns-resolution)

4. [TCP — Transmission Control Protocol](#4-tcp)
   - 4.1 [TCP Overview — Reliability and Ordering](#41-tcp-overview)
   - 4.2 [TCP Three-Way Handshake](#42-tcp-three-way-handshake)
   - 4.3 [TCP Four-Way Teardown](#43-tcp-four-way-teardown)
   - 4.4 [TCP Flow Control and Sliding Window](#44-tcp-flow-control)
   - 4.5 [TCP Congestion Control (Slow Start, AIMD, CUBIC, BBR)](#45-tcp-congestion-control)
   - 4.6 [TCP Connection States (TIME_WAIT, CLOSE_WAIT, etc.)](#46-tcp-connection-states)
   - 4.7 [TCP Keep-Alive](#47-tcp-keep-alive)
   - 4.8 [Raw TCP with `TcpClient` and `TcpListener` in .NET](#48-tcp-in-net)

5. [UDP — User Datagram Protocol](#5-udp)
   - 5.1 [UDP Overview — Speed vs Reliability Trade-off](#51-udp-overview)
   - 5.2 [When to Use UDP (DNS, VoIP, Gaming, Video Streaming)](#52-when-to-use-udp)
   - 5.3 [UDP Broadcast and Multicast](#53-udp-broadcast-and-multicast)
   - 5.4 [Building Reliability on Top of UDP (QUIC, WebRTC, custom ARQ)](#54-reliability-on-udp)
   - 5.5 [UDP with `UdpClient` in .NET](#55-udp-in-net)
   - 5.6 [Multicast with `UdpClient` in .NET](#56-multicast-in-net)

6. [HTTP/1.1](#6-http11)
   - 6.1 [HTTP Request/Response Structure](#61-http-requestresponse-structure)
   - 6.2 [HTTP Methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)](#62-http-methods)
   - 6.3 [HTTP Status Codes — Full Reference](#63-http-status-codes)
   - 6.4 [HTTP Headers — Common and Security-Relevant](#64-http-headers)
   - 6.5 [HTTP Persistent Connections and Keep-Alive](#65-http-persistent-connections)
   - 6.6 [HTTP Pipelining](#66-http-pipelining)
   - 6.7 [Content Negotiation (Accept, Content-Type)](#67-content-negotiation)
   - 6.8 [HTTP Cookies — Mechanics and Security Flags](#68-http-cookies)
   - 6.9 [HTTP Caching (Cache-Control, ETag, Last-Modified)](#69-http-caching)
   - 6.10 [HTTP Redirects (301, 302, 307, 308)](#610-http-redirects)

7. [HTTP/2](#7-http2)
   - 7.1 [HTTP/2 Overview — Why It Was Created](#71-http2-overview)
   - 7.2 [Multiplexing and Streams](#72-multiplexing-and-streams)
   - 7.3 [Header Compression (HPACK)](#73-header-compression-hpack)
   - 7.4 [Server Push](#74-server-push)
   - 7.5 [HTTP/2 in .NET — `HttpClient` and Kestrel](#75-http2-in-net)
   - 7.6 [gRPC over HTTP/2 in .NET](#76-grpc-over-http2)

8. [HTTP/3 and QUIC](#8-http3-and-quic)
   - 8.1 [QUIC Protocol — Design and Goals](#81-quic-protocol)
   - 8.2 [HTTP/3 vs HTTP/2 — Key Differences](#82-http3-vs-http2)
   - 8.3 [0-RTT Connection Establishment](#83-0-rtt-connection)
   - 8.4 [Head-of-Line Blocking Solved](#84-head-of-line-blocking)
   - 8.5 [HTTP/3 and QUIC in .NET (`MsQuic`)](#85-http3-quic-in-net)

9. [HttpClient in .NET](#9-httpclient-in-net)
   - 9.1 [HttpClient Architecture and Socket Reuse](#91-httpclient-architecture)
   - 9.2 [The `IHttpClientFactory` Pattern](#92-ihttpclientfactory)
   - 9.3 [Named and Typed HttpClients](#93-named-and-typed-httpclient)
   - 9.4 [Request/Response Pipeline and `DelegatingHandler`](#94-delegatinghandler-pipeline)
   - 9.5 [Configuring Timeouts, Retries, and Circuit Breakers](#95-timeouts-retries-circuit-breakers)
   - 9.6 [Handling Redirects, Authentication, and Proxies](#96-redirects-auth-proxies)
   - 9.7 [Sending and Receiving JSON (`System.Net.Http.Json`)](#97-httpclient-json)
   - 9.8 [Streaming Large Responses with HttpClient](#98-streaming-responses)
   - 9.9 [HttpClient with Polly and Microsoft.Extensions.Http.Resilience](#99-httpclient-resilience)
   - 9.10 [Unit Testing HttpClient with `MockHttpMessageHandler`](#910-testing-httpclient)

10. [REST API Design](#10-rest-api-design)
    - 10.1 [REST Principles — Constraints and Richardson Maturity Model](#101-rest-principles)
    - 10.2 [URL Design and Resource Naming](#102-url-design)
    - 10.3 [HTTP Verbs Semantics — Idempotency and Safety](#103-http-verbs-semantics)
    - 10.4 [API Versioning Strategies](#104-api-versioning)
    - 10.5 [Pagination, Filtering, and Sorting](#105-pagination-filtering-sorting)
    - 10.6 [HATEOAS](#106-hateoas)
    - 10.7 [Problem Details (RFC 7807) for Error Responses](#107-problem-details)
    - 10.8 [Building REST APIs in ASP.NET Core](#108-rest-aspnet-core)
    - 10.9 [Minimal APIs in .NET 6+](#109-minimal-apis)

11. [WebSockets](#11-websockets)
    - 11.1 [WebSocket Protocol — Handshake and Framing](#111-websocket-protocol)
    - 11.2 [WebSockets vs HTTP Polling vs Server-Sent Events](#112-websocket-vs-polling-vs-sse)
    - 11.3 [WebSocket Server with ASP.NET Core](#113-websocket-server-aspnet-core)
    - 11.4 [WebSocket Client with `ClientWebSocket` in .NET](#114-websocket-client-net)
    - 11.5 [SignalR — Abstraction over WebSockets](#115-signalr)
    - 11.6 [SignalR Scaling — Redis Backplane and Azure SignalR Service](#116-signalr-scaling)
    - 11.7 [WebSocket Security Considerations](#117-websocket-security)

12. [Server-Sent Events (SSE)](#12-server-sent-events)
    - 12.1 [SSE Protocol — Format and Browser Support](#121-sse-protocol)
    - 12.2 [SSE vs WebSockets — When to Use Each](#122-sse-vs-websockets)
    - 12.3 [Implementing SSE in ASP.NET Core](#123-sse-aspnet-core)
    - 12.4 [SSE for AI Streaming Responses](#124-sse-ai-streaming)

13. [gRPC](#13-grpc)
    - 13.1 [gRPC Overview — Protocol Buffers and HTTP/2](#131-grpc-overview)
    - 13.2 [Protobuf — Schema Definition and Code Generation](#132-protobuf)
    - 13.3 [gRPC Service Types (Unary, Server Streaming, Client Streaming, Bidirectional)](#133-grpc-service-types)
    - 13.4 [gRPC in .NET — `Grpc.AspNetCore` and `Grpc.Net.Client`](#134-grpc-in-net)
    - 13.5 [gRPC Interceptors (Middleware for gRPC)](#135-grpc-interceptors)
    - 13.6 [gRPC-Web — Browser Compatibility](#136-grpc-web)
    - 13.7 [gRPC vs REST vs GraphQL — Comparison](#137-grpc-vs-rest-vs-graphql)
    - 13.8 [gRPC Error Handling and Status Codes](#138-grpc-error-handling)

14. [GraphQL](#14-graphql)
    - 14.1 [GraphQL Overview — Schema, Queries, Mutations, Subscriptions](#141-graphql-overview)
    - 14.2 [GraphQL vs REST — Trade-offs](#142-graphql-vs-rest)
    - 14.3 [N+1 Problem and DataLoader Pattern](#143-n1-problem-and-dataloader)
    - 14.4 [GraphQL in .NET with Hot Chocolate](#144-graphql-hot-chocolate)
    - 14.5 [GraphQL Security (Query Depth Limiting, Introspection)](#145-graphql-security)

15. [Sockets & Low-Level Networking](#15-sockets--low-level-networking)
    - 15.1 [Berkeley Sockets API — History and Concepts](#151-berkeley-sockets)
    - 15.2 [Socket Types (Stream, Datagram, Raw)](#152-socket-types)
    - 15.3 [Blocking vs Non-Blocking vs Asynchronous I/O](#153-blocking-vs-async-io)
    - 15.4 [The `Socket` Class in .NET — Full API](#154-socket-class-in-net)
    - 15.5 [High-Performance Sockets with `SocketAsyncEventArgs`](#155-socketasynceventargs)
    - 15.6 [System.Net.Sockets `Socket` vs `TcpClient` vs `UdpClient`](#156-socket-vs-tcpclient-vs-udpclient)
    - 15.7 [Unix Domain Sockets in .NET](#157-unix-domain-sockets)

16. [Network I/O and Performance in .NET](#16-network-io-and-performance)
    - 16.1 [I/O Completion Ports and the .NET Thread Pool](#161-io-completion-ports)
    - 16.2 [`async`/`await` with Network I/O — Best Practices](#162-async-await-network-io)
    - 16.3 [`System.IO.Pipelines` — High-Throughput I/O](#163-systemio-pipelines)
    - 16.4 [`SocketsHttpHandler` and Connection Pooling](#164-socketshttphandler)
    - 16.5 [Memory Pooling with `MemoryPool<T>` and `ArrayPool<T>`](#165-memory-pooling)
    - 16.6 [Reducing Allocations with `Span<T>` in Network Code](#166-span-in-network-code)
    - 16.7 [Benchmarking Network Code with BenchmarkDotNet](#167-benchmarking)

17. [Load Balancing & Reverse Proxies](#17-load-balancing--reverse-proxies)
    - 17.1 [Load Balancing Algorithms (Round Robin, Least Connections, IP Hash)](#171-load-balancing-algorithms)
    - 17.2 [Layer 4 vs Layer 7 Load Balancing](#172-l4-vs-l7-load-balancing)
    - 17.3 [Reverse Proxy Pattern and Use Cases](#173-reverse-proxy-pattern)
    - 17.4 [YARP — Yet Another Reverse Proxy in .NET](#174-yarp)
    - 17.5 [Nginx and HAProxy with .NET Applications](#175-nginx-haproxy-net)
    - 17.6 [Health Checks for Load Balancers in ASP.NET Core](#176-health-checks)
    - 17.7 [Sticky Sessions and Session Affinity](#177-sticky-sessions)

18. [API Gateways & Service Mesh](#18-api-gateways--service-mesh)
    - 18.1 [API Gateway Pattern — Responsibilities and Benefits](#181-api-gateway-pattern)
    - 18.2 [Ocelot — API Gateway in .NET](#182-ocelot)
    - 18.3 [Rate Limiting in ASP.NET Core (Built-in .NET 7+)](#183-rate-limiting-aspnet-core)
    - 18.4 [Service Mesh Concepts (Istio, Linkerd, Envoy)](#184-service-mesh)
    - 18.5 [mTLS in a Service Mesh](#185-mtls-service-mesh)
    - 18.6 [Sidecar Pattern and .NET Applications](#186-sidecar-pattern)

19. [Resilience Patterns for Network Communication](#19-resilience-patterns)
    - 19.1 [Transient Fault Handling — Why Networks Fail](#191-transient-fault-handling)
    - 19.2 [Retry Pattern with Exponential Backoff and Jitter](#192-retry-pattern)
    - 19.3 [Circuit Breaker Pattern](#193-circuit-breaker-pattern)
    - 19.4 [Timeout Pattern](#194-timeout-pattern)
    - 19.5 [Bulkhead Pattern](#195-bulkhead-pattern)
    - 19.6 [Fallback Pattern](#196-fallback-pattern)
    - 19.7 [Polly — Resilience Library for .NET](#197-polly)
    - 19.8 [Microsoft.Extensions.Http.Resilience (.NET 8+)](#198-microsoft-resilience)
    - 19.9 [Hedging Requests](#199-hedging)

20. [Proxies, Tunneling & VPNs](#20-proxies-tunneling--vpns)
    - 20.1 [Forward Proxy vs Reverse Proxy](#201-forward-vs-reverse-proxy)
    - 20.2 [HTTP CONNECT Tunneling](#202-http-connect-tunneling)
    - 20.3 [SOCKS Proxies](#203-socks-proxies)
    - 20.4 [Configuring Proxies in .NET `HttpClient`](#204-proxies-in-net)
    - 20.5 [Corporate Proxy Considerations for .NET Apps](#205-corporate-proxy)
    - 20.6 [VPN Concepts (IPSec, WireGuard, OpenVPN)](#206-vpn-concepts)
    - 20.7 [Network Namespaces and Container Networking](#207-container-networking)

21. [Protocols Reference](#21-protocols-reference)
    - 21.1 [SMTP, IMAP, POP3 — Email Protocols in .NET (`MailKit`)](#211-email-protocols)
    - 21.2 [FTP and SFTP in .NET (`FluentFTP`, `SSH.NET`)](#212-ftp-sftp)
    - 21.3 [SSH Protocol and Remote Execution in .NET (`SSH.NET`)](#213-ssh-in-net)
    - 21.4 [MQTT — Lightweight Messaging for IoT (`MQTTnet`)](#214-mqtt)
    - 21.5 [AMQP and RabbitMQ in .NET](#215-amqp-rabbitmq)
    - 21.6 [NTP — Network Time Protocol](#216-ntp)
    - 21.7 [ICMP — Ping and Traceroute in .NET](#217-icmp-ping)
    - 21.8 [DHCP — Dynamic Host Configuration](#218-dhcp)

22. [Network Diagnostics & Observability](#22-network-diagnostics--observability)
    - 22.1 [Wireshark — Capturing and Analysing Traffic](#221-wireshark)
    - 22.2 [netstat, ss, and tcpdump](#222-netstat-ss-tcpdump)
    - 22.3 [Distributed Tracing with OpenTelemetry in .NET](#223-opentelemetry)
    - 22.4 [Network Metrics — What to Monitor](#224-network-metrics)
    - 22.5 [Logging HTTP Traffic with `HttpMessageHandler`](#225-logging-http-traffic)
    - 22.6 [Health Checks and Readiness/Liveness Probes in ASP.NET Core](#226-health-checks)
    - 22.7 [Network-Level Debugging in .NET (DiagnosticSource, Activity)](#227-diagnosticsource)

23. [Network Security](#23-network-security)
    - 23.1 [Common Network Attacks (MITM, Replay, Spoofing, DDoS)](#231-common-network-attacks)
    - 23.2 [HTTPS Everywhere and HSTS](#232-https-and-hsts)
    - 23.3 [CORS — Cross-Origin Resource Sharing in ASP.NET Core](#233-cors)
    - 23.4 [Content Security Policy (CSP)](#234-content-security-policy)
    - 23.5 [Security Headers Reference (X-Frame-Options, X-Content-Type-Options, etc.)](#235-security-headers)
    - 23.6 [DDoS Mitigation Strategies](#236-ddos-mitigation)
    - 23.7 [Firewall Rules and Network Segmentation](#237-firewall-and-segmentation)
    - 23.8 [Network Security in Kubernetes with Network Policies](#238-kubernetes-network-policies)

24. [Service Discovery & Configuration](#24-service-discovery--configuration)
    - 24.1 [Service Discovery Patterns (Client-Side, Server-Side)](#241-service-discovery-patterns)
    - 24.2 [DNS-Based Service Discovery](#242-dns-based-service-discovery)
    - 24.3 [Consul for Service Discovery in .NET](#243-consul)
    - 24.4 [Kubernetes Service Discovery and DNS](#244-kubernetes-service-discovery)
    - 24.5 [.NET Aspire — Service Discovery Built-in](#245-dotnet-aspire)

25. [Cloud Networking for .NET Developers](#25-cloud-networking)
    - 25.1 [VPC / VNet — Virtual Private Cloud Networking](#251-virtual-private-cloud)
    - 25.2 [Azure Networking for .NET Apps (App Service, AKS, VNet Integration)](#252-azure-networking)
    - 25.3 [AWS Networking for .NET Apps (VPC, ALB, ECS/EKS)](#253-aws-networking)
    - 25.4 [CDN — Content Delivery Networks](#254-cdn)
    - 25.5 [Private Endpoints and Private Link](#255-private-endpoints)
    - 25.6 [Network Performance in Cloud (Latency between Regions, AZs)](#256-cloud-network-performance)

---

## Section Prompts

> Copy any prompt below and send it to generate the full content for that section.

---

### 1. Networking Fundamentals

#### 1.1 How the Internet Works
```
Explain how the internet works at a high level for a software developer: physical infrastructure (cables, routers, IXPs), the role of ISPs, how a packet travels from a browser to a server and back, and the key protocols involved at each step. Include what happens when you type a URL and press Enter (DNS resolution, TCP handshake, HTTP request, TLS). Relate each step to what a .NET developer can observe or control.
```

#### 1.2 The OSI Model
```
Explain the OSI 7-layer model: Physical, Data Link, Network, Transport, Session, Presentation, Application. For each layer: describe its responsibility, the protocols that operate there, and the units of data (bits, frames, packets, segments). Include how the OSI layers map to real .NET classes (e.g., Socket = Transport/Network, HttpClient = Application). Explain why developers say "it's a layer X problem."
```

#### 1.3 The TCP/IP Model
```
Explain the TCP/IP 4-layer model (Link, Internet, Transport, Application) and how it differs from OSI. Explain why the TCP/IP model is the one actually used in practice. Map protocols to layers: Ethernet/Wi-Fi, IP/ICMP, TCP/UDP, HTTP/DNS/TLS. Show how a .NET HTTP request maps through these layers. Include a diagram description showing encapsulation/decapsulation.
```

#### 1.4 Network Topologies
```
Explain common network topologies (bus, star, ring, mesh, hybrid) and their real-world relevance. Cover LAN, WAN, MAN, and how data centers and cloud providers structure their networks. Explain spine-leaf architecture used in modern data centers. Relate this to .NET developers deploying to Azure/AWS: understanding availability zones, regions, and why cross-AZ traffic has latency.
```

#### 1.5 Packets, Frames, and Encapsulation
```
Explain data encapsulation in networking: how application data is wrapped in a TCP segment, then an IP packet, then an Ethernet frame as it travels down the stack. Show the byte structure of an IP packet header and TCP segment header. Explain fragmentation and MTU (Maximum Transmission Unit). Cover how Wireshark can show all these layers. Include a .NET example using Socket to observe raw data.
```

#### 1.6 Bandwidth, Latency, Throughput & Jitter
```
Define and explain bandwidth, latency (RTT), throughput, and jitter. Cover why latency matters more than bandwidth for many applications, the speed-of-light limit, and what contributes to latency (propagation, transmission, processing, queuing). Include Little's Law and its impact on API design. Show how to measure these metrics in .NET (Stopwatch, HttpClient timing, Ping). Discuss the latency numbers every developer should know.
```

---

### 2. IP Addressing

#### 2.1 IPv4
```
Explain IPv4 addresses: 32-bit structure, dotted decimal notation, historical class-based addressing (A/B/C/D/E), why classful addressing was abandoned, CIDR notation (192.168.1.0/24), and network vs host portions. Cover loopback (127.0.0.1), link-local (169.254.x.x), and broadcast addresses. Include a subnet cheat sheet. Show how .NET represents IPv4 with IPAddress.
```

#### 2.2 Subnetting
```
Teach subnetting from scratch: subnet masks, calculating network address, broadcast address, first/last usable host, and number of hosts per subnet. Walk through examples with /24, /25, /28, /30 prefixes. Cover VLSM (Variable Length Subnet Masking). Include a step-by-step subnetting guide and a reference table of common CIDR prefixes. Show IPNetwork2 usage in .NET for subnet calculations.
```

#### 2.3 Public vs Private IP Addresses
```
Explain the distinction between public and private IP addresses: RFC 1918 private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), why they were created, and what happens when a device with a private IP tries to reach the internet. Cover special ranges: loopback, link-local, APIPA, multicast (224.0.0.0/4), and documentation ranges. Include practical implications for .NET applications in containers and cloud.
```

#### 2.4 NAT
```
Explain Network Address Translation (NAT): Source NAT (SNAT), Destination NAT (DNAT), PAT (Port Address Translation / NAT overload), and how a single public IP serves many devices. Cover NAT traversal challenges for peer-to-peer applications (STUN, TURN, ICE). Explain how NAT affects .NET applications: why server-bound connections work but incoming connections from the internet require port forwarding.
```

#### 2.5 IPv6
```
Explain IPv6: 128-bit structure, colon-hexadecimal notation, address compression (::), address types (unicast, multicast, anycast), global unicast (2000::/3), link-local (fe80::/10), loopback (::1), and the lack of broadcast. Cover IPv6 header improvements over IPv4, SLAAC (auto-configuration), and NDP (replaces ARP). Show the current adoption landscape and challenges. Include IPv6 in cloud environments.
```

#### 2.6 IPv4 vs IPv6 Dual-Stack in .NET
```
Explain dual-stack networking and how .NET handles it. Cover how IPAddress.IPv6Any and socket dual-stack mode works (IPv4-mapped IPv6 addresses like ::ffff:192.168.1.1). Show how Kestrel handles dual-stack binding, how HttpClient selects IPv4 vs IPv6 (Happy Eyeballs algorithm), and how to explicitly configure IPv4 or IPv6 preferences in .NET. Include diagnostic tips for IPv6 issues.
```

#### 2.7 IP Addresses in .NET
```
Comprehensive guide to the IPAddress, IPEndPoint, IPNetwork, and DnsEndPoint classes in .NET. Cover: parsing IP addresses, checking address families, creating endpoints, using the new IPNetwork struct (.NET 8+) for CIDR range checks, iterating addresses in a subnet. Include practical examples: validating user-supplied IPs, checking if an IP is in a private range, binding sockets to specific IPs.
```

---

### 3. DNS

#### 3.1 How DNS Works
```
Walk through a complete DNS resolution: browser cache → OS cache → recursive resolver → root nameserver → TLD nameserver → authoritative nameserver. Explain iterative vs recursive queries. Show the full UDP/TCP exchange with actual packet contents description. Cover what happens on failure (NXDOMAIN, SERVFAIL, timeout). Relate this to .NET: how Dns.GetHostAddressesAsync() works behind the scenes.
```

#### 3.2 DNS Record Types
```
Explain all major DNS record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification, SPF, DKIM, DMARC), NS (nameserver), SOA (zone authority), SRV (service discovery), PTR (reverse DNS), CAA (certificate authority), and HTTPS/SVCB records. For each: explain the format, use case, and how to look it up with dig/nslookup. Show how SRV records are used for .NET service discovery.
```

#### 3.3 DNS Hierarchy
```
Explain the DNS hierarchy: the root zone (.), TLD servers (.com, .net, .io), second-level domains, and subdomains. Cover DNS zones, zone files, and zone transfer (AXFR). Explain how domain registration works (registrar → registry → root). Cover Anycast and how DNS servers can be globally distributed. Explain why DNS is often called "the internet's phone book."
```

#### 3.4 DNS Caching and TTL
```
Explain DNS caching: TTL values, negative caching (NXDOMAIN TTL), the OS resolver cache, browser cache, and how low TTLs enable rapid failover. Cover the trade-off between low TTL (agility) and high TTL (performance). Explain DNS propagation delays. In .NET context: explain the HttpClient connection pooling and DNS cache interaction, the SocketsHttpHandler.PooledConnectionIdleTimeout setting, and how to force DNS re-resolution.
```

#### 3.5 DNS Security
```
Cover DNS security threats (DNS spoofing/cache poisoning, DNS hijacking, DNS amplification DDoS) and defenses. Explain DNSSEC: digital signing of DNS records, chain of trust, and DS records. Cover DNS over HTTPS (DoH) and DNS over TLS (DoT): how they prevent interception, browser/OS support, and privacy implications. Show how to configure DoH in a .NET application. Explain why DNSSEC adoption has been slow.
```

#### 3.6 DNS in .NET
```
Comprehensive guide to DNS in .NET using System.Net.Dns: GetHostAddressesAsync, GetHostEntryAsync, GetHostNameAsync. Cover DnsEndPoint for deferred resolution, how SocketsHttpHandler resolves DNS for HttpClient, and the DNS refresh issue with long-lived HttpClient instances. Show how to build a custom DNS resolver. Cover new .NET APIs for DNS resolution and best practices for containerized applications.
```

#### 3.7 Custom DNS Resolution
```
Show how to implement custom DNS resolution in .NET's HttpClient using SocketsHttpHandler.ConnectCallback. Cover use cases: DNS-based load balancing, testing with custom DNS, forcing specific IP addresses, implementing DNS caching with expiry. Show a complete example with SocketsHttpHandler that resolves DNS manually and rotates between multiple IPs. Explain how this interacts with connection pooling.
```

---

### 4. TCP

#### 4.1 TCP Overview
```
Explain TCP's core guarantees: reliable delivery, in-order delivery, error detection, flow control, and congestion control. Explain how TCP achieves these via sequence numbers, acknowledgments, and retransmission. Cover TCP segments: SYN, ACK, FIN, RST, PSH, URG flags. Explain what connection-oriented means. Compare to UDP. Discuss when TCP's overhead is and isn't worth it for .NET applications.
```

#### 4.2 TCP Three-Way Handshake
```
Walk through the TCP three-way handshake byte by byte: client SYN (with ISN), server SYN-ACK (with its ISN and acknowledgment), client ACK. Explain Initial Sequence Numbers (ISN) and why they're randomized (security). Cover the time cost of the handshake (1 RTT). Explain SYN cookies (protection against SYN flood). Show how TLS adds another 1-2 RTTs. Relate to .NET: what happens during TcpClient.ConnectAsync().
```

#### 4.3 TCP Four-Way Teardown
```
Explain the TCP four-way connection termination: FIN from initiator, ACK from receiver, FIN from receiver, ACK from initiator. Cover the TIME_WAIT state (why it lasts 2*MSL ≈ 4 minutes), why it exists, and the port exhaustion problem when making many short connections. Explain RST (abrupt termination). Show how to observe connection states in .NET and on the OS (netstat). Cover keep-alive and its role.
```

#### 4.4 TCP Flow Control
```
Explain TCP flow control using the receive window (rwnd): how the receiver advertises available buffer space, what happens when the window shrinks to zero, and Window Scaling Option (for high-bandwidth networks). Explain the relationship between buffer sizes and throughput. Cover TCP buffer tuning and how .NET's Socket.ReceiveBufferSize and SendBufferSize map to kernel buffers. Include the bandwidth-delay product formula.
```

#### 4.5 TCP Congestion Control
```
Explain TCP congestion control algorithms: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery. Cover AIMD (Additive Increase Multiplicative Decrease). Explain modern algorithms: CUBIC (Linux default), BBR (Google's bandwidth-based), and QUIC's congestion control. Explain how packet loss triggers congestion response vs delay-based detection. Cover implications for .NET applications on high-latency or lossy networks.
```

#### 4.6 TCP Connection States
```
Explain all TCP connection states: CLOSED, LISTEN, SYN_SENT, SYN_RECEIVED, ESTABLISHED, FIN_WAIT_1, FIN_WAIT_2, CLOSE_WAIT, CLOSING, LAST_ACK, TIME_WAIT. Draw the state machine transitions. Explain common problems: stuck in CLOSE_WAIT (application bug — not reading/closing socket), TIME_WAIT port exhaustion, and half-open connections. Show how to diagnose using netstat/ss and how .NET socket options help.
```

#### 4.7 TCP Keep-Alive
```
Explain TCP keep-alive: what it is, how it detects dead connections (sends probes after idle period), OS-level parameters (tcp_keepalive_time, tcp_keepalive_intvl, tcp_keepalive_probes), and application-level keep-alive vs TCP keep-alive. Show how to enable TCP keep-alive in .NET using Socket.SetSocketOption() and TcpClient. Discuss keep-alive in HttpClient, gRPC, and database connections. Cover when keep-alive is essential (NAT timeouts, firewalls).
```

#### 4.8 TCP in .NET
```
Comprehensive guide to TCP networking in .NET using TcpClient, TcpListener, and the underlying Socket. Cover: creating a TCP server with TcpListener, accepting clients asynchronously, reading/writing streams, handling disconnections, configuring TCP options (NoDelay/Nagle algorithm, keep-alive, buffer sizes). Include a complete echo server and client example. Explain when to use TcpClient vs raw Socket, and when to step up to higher-level abstractions.
```

---

### 5. UDP

#### 5.1 UDP Overview
```
Explain UDP: connectionless, no guaranteed delivery, no ordering, no flow control, minimal header (8 bytes vs TCP's 20+). Cover UDP's advantages: low overhead, no handshake latency, multicast support, and no head-of-line blocking. Explain the UDP checksum. Compare UDP vs TCP with a decision matrix. Cover why stateless protocols and query-response patterns (DNS, DHCP, SNMP) prefer UDP.
```

#### 5.2 When to Use UDP
```
Provide a practical guide to when UDP is appropriate: real-time media (VoIP, video conferencing), online gaming (position updates), DNS, DHCP, NTP, multicast, and tunneling. For each use case, explain why packet loss is acceptable or handled at the application layer. Cover QUIC as UDP with reliability built on top. Show the performance difference vs TCP with .NET benchmarks. Discuss UDP in microservices (metrics via statsd/UDP).
```

#### 5.3 UDP Broadcast and Multicast
```
Explain UDP broadcast (limited, directed) and multicast. Cover IGMP (group membership), multicast address ranges (224.0.0.0/4), well-known multicast addresses (mDNS: 224.0.0.251), and TTL scoping. Explain multicast vs broadcast vs unicast trade-offs. Show .NET examples: sending a UDP broadcast with UdpClient, joining a multicast group, and building a simple peer discovery mechanism using multicast.
```

#### 5.4 Reliability on UDP
```
Explain how protocols build reliability on top of UDP: sequence numbers, ACKs, retransmission, selective acknowledgment, and windowing. Cover QUIC (multiplexed reliable streams over UDP), WebRTC data channels, ENet, KCP, and custom ARQ protocols. Discuss why QUIC chose UDP rather than a new transport protocol (middlebox ossification problem). Show a simple stop-and-wait ARQ implementation using UdpClient in .NET.
```

#### 5.5 UDP in .NET
```
Comprehensive guide to UDP in .NET using UdpClient and Socket. Cover: sending/receiving datagrams, handling the connectionless nature, async patterns (ReceiveAsync, SendAsync), setting socket options (broadcast, TTL, buffer sizes), handling large datagrams vs MTU, and error handling. Include a complete UDP client/server example. Explain the difference between UdpClient connected mode and unconnected mode.
```

#### 5.6 Multicast in .NET
```
Show how to implement UDP multicast in .NET: joining a multicast group with UdpClient.JoinMulticastGroup(), leaving the group, sending to a multicast address, selecting the network interface, and TTL configuration. Build a working service discovery example where .NET services announce themselves via multicast and clients discover them. Cover common pitfalls (firewall rules, loopback multicast, interface selection on multi-homed machines).
```

---

### 6. HTTP/1.1

#### 6.1 HTTP Request/Response Structure
```
Explain the full structure of an HTTP/1.1 request and response: request line (method, path, version), headers, blank line, body. Show real raw HTTP messages for GET and POST. Explain transfer encoding (chunked), content encoding (gzip, br), and how to read HTTP/1.1 at the wire level with Wireshark or nc. Show how to inspect raw HTTP in .NET using HttpClient with logging or DelegatingHandler.
```

#### 6.2 HTTP Methods
```
Explain all HTTP methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, TRACE, CONNECT. For each: define semantics, idempotency (can repeat without side effects), safety (no side effects), and typical use cases. Explain the importance of correct method usage for caching, proxies, and API design. Include how ASP.NET Core routing maps methods to controller actions and how HttpClient sends each method.
```

#### 6.3 HTTP Status Codes
```
Complete reference for HTTP status codes organized by class: 1xx (informational), 2xx (success: 200, 201, 202, 204, 206), 3xx (redirection: 301, 302, 304, 307, 308), 4xx (client errors: 400, 401, 403, 404, 409, 410, 422, 429), 5xx (server errors: 500, 502, 503, 504). For each important code: explain when to use it, common mistakes, and how to return it in ASP.NET Core. Cover RFC 7807 Problem Details.
```

#### 6.4 HTTP Headers
```
Cover important HTTP headers organized by category: general (Date, Cache-Control, Connection), request (Host, Accept, Authorization, User-Agent, If-None-Match, If-Modified-Since, X-Forwarded-For), response (Content-Type, Location, Set-Cookie, WWW-Authenticate, ETag, Vary), and security (Strict-Transport-Security, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options). Show how to set and read headers in ASP.NET Core and HttpClient.
```

#### 6.5 HTTP Persistent Connections
```
Explain HTTP persistent connections (Keep-Alive): how HTTP/1.0 opened a new TCP connection per request, how HTTP/1.1 reuses connections by default, the Connection header, and timeouts. Explain the performance impact of connection establishment (TCP + TLS handshake latency). Cover connection pooling in .NET HttpClient, SocketsHttpHandler connection lifetime settings, and why HttpClient should be reused. Include a connection limit discussion.
```

#### 6.6 HTTP Pipelining
```
Explain HTTP/1.1 pipelining: sending multiple requests without waiting for responses, head-of-line blocking (why pipelining was abandoned in practice), and why browsers disabled it. Explain how HTTP/2 multiplexing solved the problem pipelining tried to address. Show why HTTP/1.1 clients like HttpClient don't pipeline and how to simulate concurrent requests in .NET with Task.WhenAll.
```

#### 6.7 Content Negotiation
```
Explain HTTP content negotiation: the Accept header (media types, q-values), Accept-Encoding (gzip, br, deflate), Accept-Language, and server responses with Content-Type and Vary. Show how ASP.NET Core implements content negotiation for JSON/XML responses. Cover how to add custom formatters, configure Brotli/Gzip response compression middleware, and how HttpClient handles compressed responses automatically.
```

#### 6.8 HTTP Cookies
```
Explain HTTP cookies: the Set-Cookie response header, the Cookie request header, cookie attributes (Domain, Path, Expires/Max-Age, Secure, HttpOnly, SameSite). Cover SameSite values (Strict, Lax, None) and their CSRF implications. Show how to set and read cookies in ASP.NET Core. Cover third-party cookies and the browser deprecation trend. Include cookie security best practices for authentication cookies.
```

#### 6.9 HTTP Caching
```
Comprehensive guide to HTTP caching: freshness (max-age, Expires), validation (ETag, Last-Modified, If-None-Match, If-Modified-Since), Cache-Control directives (no-cache, no-store, private, public, must-revalidate, stale-while-revalidate), the Vary header, and cache invalidation. Show how to implement server-side HTTP caching in ASP.NET Core using ResponseCachingMiddleware, IMemoryCache, and IDistributedCache. Cover cache-busting for static assets.
```

#### 6.10 HTTP Redirects
```
Explain HTTP redirects: 301 (permanent), 302 (found/temporary), 303 (see other, POST to GET), 307 (temporary, preserve method), 308 (permanent, preserve method). Cover the historical confusion between 301/302 and why 307/308 were added. Show how HttpClient follows redirects (AllowAutoRedirect), how to detect redirect loops, and how ASP.NET Core generates redirect responses. Cover HSTS and UseHttpsRedirection middleware.
```

---

### 7. HTTP/2

#### 7.1 HTTP/2 Overview
```
Explain why HTTP/2 was created: the problems with HTTP/1.1 (head-of-line blocking, redundant headers, connection limits). Cover HTTP/2's history (SPDY → HTTP/2), the binary framing layer, the requirement for TLS in practice (h2 vs h2c), and the performance improvements. Explain the HTTP/2 frame types. Include HTTP/2 adoption statistics and browser support. Show how to confirm a connection is using HTTP/2 in .NET.
```

#### 7.2 Multiplexing and Streams
```
Explain HTTP/2 multiplexing in depth: how multiple streams share one TCP connection, stream IDs (odd for client-initiated, even for server-initiated), stream states, flow control per-stream and per-connection, and stream priority (now deprecated in favor of extensible priorities). Explain why multiplexing eliminates HTTP-level head-of-line blocking (but not TCP-level). Show how .NET HttpClient handles concurrent HTTP/2 requests over one connection.
```

#### 7.3 Header Compression (HPACK)
```
Explain HPACK header compression: static table (common headers predefined), dynamic table (headers learned during session), Huffman encoding. Show an example of how a repeated Authorization header compresses to a single byte. Discuss CRIME/BREACH attacks (why compressing secrets alongside attacker-controlled data is dangerous). Explain QPACK (HTTP/3's equivalent). Show header size impact in .NET HTTP/2 applications.
```

#### 7.4 Server Push
```
Explain HTTP/2 Server Push: the concept of pushing resources before the client requests them (e.g., pushing CSS before the browser parses HTML), the PUSH_PROMISE frame, and why the promise must come before the response. Cover the failure of Server Push in practice (Chrome removing support, cache issues, guessing what to push). Show how to implement server push in ASP.NET Core. Discuss alternatives (103 Early Hints, Resource Hints).
```

#### 7.5 HTTP/2 in .NET
```
Comprehensive guide to HTTP/2 in .NET: enabling HTTP/2 in Kestrel, configuring HttpClient for HTTP/2 (HttpVersion, HttpVersionPolicy), HTTP/2 connection pooling behavior, debugging with HttpEventSource, and testing HTTP/2 connections. Cover the HTTP/2 cleartext (h2c) support limitations in .NET. Include configuration for HTTP/2 in Azure App Service and behind Nginx. Show the performance difference with HTTP/1.1 in a benchmark.
```

#### 7.6 gRPC over HTTP/2
```
Explain why gRPC chose HTTP/2 as its transport: framing maps to protobuf messages, multiplexing supports many RPCs on one connection, flow control, bidirectional streaming. Cover how gRPC uses HTTP/2 headers (content-type: application/grpc, grpc-status, grpc-message), trailers for status codes, and how gRPC streaming maps to HTTP/2 streams. This sets up the deeper gRPC section. Show the HTTP/2 frames in a gRPC call using Wireshark.
```

---

### 8. HTTP/3 and QUIC

#### 8.1 QUIC Protocol
```
Explain QUIC: built on UDP, integrates TLS 1.3, provides multiple streams without TCP head-of-line blocking, connection migration (survive IP changes), and faster connection establishment. Cover QUIC's history (Google QUIC → IETF QUIC → RFC 9000), the connection ID (enables migration), packet number spaces, and how QUIC handles loss recovery differently from TCP. Explain why QUIC was built over UDP rather than a new transport protocol.
```

#### 8.2 HTTP/3 vs HTTP/2
```
Compare HTTP/3 and HTTP/2: same application-layer semantics but different transport, QPACK header compression replacing HPACK, how HTTP/3 solves TCP head-of-line blocking, connection migration for mobile clients, and 0-RTT resumption. Cover HTTP/3 discovery (Alt-Svc header, HTTPS DNS record). Show adoption statistics and performance improvements in real-world conditions (packet loss scenarios). Discuss when HTTP/2 might still be preferred.
```

#### 8.3 0-RTT Connection Establishment
```
Explain 0-RTT (zero round-trip time) connection resumption in QUIC/TLS 1.3: how it works (session ticket, pre-shared key), the performance benefit (no handshake latency), and the replay attack risk (why 0-RTT data should be idempotent). Compare: TCP+TLS 1.2 (3 RTT), TCP+TLS 1.3 (2 RTT), QUIC (1 RTT initial, 0 RTT resume). Show how 0-RTT is configured in .NET QUIC and what requests are safe to send as 0-RTT.
```

#### 8.4 Head-of-Line Blocking
```
Explain head-of-line blocking at two levels: HTTP/1.1 (only one request at a time per connection), HTTP/2 (multiple streams but one TCP connection, a dropped packet blocks all streams), and HTTP/3/QUIC (dropped packet only blocks the affected stream). Include a visual explanation showing streams and packet loss scenarios. Explain why this matters for high-latency or lossy networks. Show empirical measurements demonstrating HTTP/3's advantage under packet loss.
```

#### 8.5 HTTP/3 and QUIC in .NET
```
Guide to HTTP/3 and QUIC in .NET: the MsQuic library integration, enabling HTTP/3 in Kestrel (UseQuic, alt-svc header), configuring HttpClient for HTTP/3 (HttpVersion 3.0), the System.Net.Quic API for custom QUIC applications, platform requirements (Windows 11/Server 2022, Linux with MsQuic). Include configuration examples, how to verify a connection is using HTTP/3, and current limitations in .NET's HTTP/3 support.
```

---

### 9. HttpClient in .NET

#### 9.1 HttpClient Architecture
```
Explain HttpClient's internal architecture: the HttpMessageHandler chain, SocketsHttpHandler as the default inner handler (replaces HttpClientHandler on .NET Core), connection pooling (one pool per endpoint), DNS resolution and connection lifetime (PooledConnectionLifetime), and why HttpClient instances should be reused (socket exhaustion with new instances). Include the classic mistake of wrapping HttpClient in using() and its consequences.
```

#### 9.2 IHttpClientFactory
```
Explain IHttpClientFactory and why it was introduced: managing HttpClient lifetime, DNS refresh (PooledConnectionLifetime), handler rotation, and integration with DI. Cover the three usage patterns: basic factory (CreateClient), named clients, and typed clients. Show setup in Program.cs with AddHttpClient(). Explain how IHttpClientFactory manages a pool of HttpMessageHandler instances and their lifetimes. Include logging integration.
```

#### 9.3 Named and Typed HttpClient
```
Deep dive into named and typed HttpClient patterns with IHttpClientFactory. Show creating a named client with base address, default headers, and timeout configuration. Show creating a typed client (a class wrapping HttpClient injected via DI) with Refit or manual implementation. Cover when to use each pattern. Include a complete example of a typed client for a third-party API with authentication, retry, and timeout configured.
```

#### 9.4 DelegatingHandler Pipeline
```
Explain the DelegatingHandler middleware pipeline in HttpClient: how handlers chain together (like ASP.NET Core middleware but for outgoing requests), how to create custom handlers, and common uses: logging, authentication (adding Bearer tokens), correlation ID propagation, request/response manipulation, and mock testing. Show a complete pipeline: LoggingHandler → AuthHandler → RetryHandler → SocketsHttpHandler. Include how to register delegating handlers with IHttpClientFactory.
```

#### 9.5 Timeouts, Retries, and Circuit Breakers
```
Cover resilience configuration for HttpClient: HttpClient.Timeout (overall request timeout), CancellationToken for per-request timeout, the difference between connect timeout and read timeout in SocketsHttpHandler, configuring retries with Polly (transient HTTP errors: 408, 429, 5xx), exponential backoff with jitter, and circuit breaker pattern to stop calling a failing service. Show complete Polly configuration with IHttpClientFactory and the newer Microsoft.Extensions.Http.Resilience API.
```

#### 9.6 Redirects, Auth, and Proxies
```
Cover HttpClient's handling of redirects (AllowAutoRedirect, max redirects, cross-origin redirect behavior), authentication schemes (Basic, Digest, NTLM, Negotiate via ICredentials, Bearer via DelegatingHandler), and proxy configuration (IWebProxy, system proxy, NoProxy bypass list). Show how to configure each in HttpClientHandler/SocketsHttpHandler. Include common issues: redirect stripping Authorization header, NTLM on Linux, and corporate proxy detection.
```

#### 9.7 HttpClient JSON
```
Comprehensive guide to System.Net.Http.Json extensions (GetFromJsonAsync, PostAsJsonAsync, PutAsJsonAsync, ReadFromJsonAsync). Cover: making typed JSON requests, custom JsonSerializerOptions, handling errors (EnsureSuccessStatusCode vs manual checking), streaming JSON (IAsyncEnumerable), and working with JsonDocument/JsonNode for dynamic responses. Show a complete CRUD client for a REST API using the JSON extension methods with proper error handling.
```

#### 9.8 Streaming Responses
```
Show how to stream large HTTP responses in .NET: HttpCompletionOption.ResponseHeadersRead, reading the response stream progressively, cancellation support, and memory efficiency. Cover downloading large files, streaming JSON arrays with System.Text.Json streaming API, and server-sent events (SSE) parsing. Show how to report download progress. Compare memory allocation between reading full response vs streaming. Include a real-world download with retry on interruption.
```

#### 9.9 HttpClient with Resilience
```
Comprehensive guide to the new Microsoft.Extensions.Http.Resilience NuGet package (.NET 8+): AddStandardResilienceHandler (combines retry, circuit breaker, timeout, rate limiter, hedging), AddStandardHedgingHandler, customizing individual strategies, and observability with OpenTelemetry. Compare to raw Polly v8 integration. Show migration from Polly v7 to the new resilience API. Include a production-ready HttpClient configuration.
```

#### 9.10 Testing HttpClient
```
Show how to unit test code that uses HttpClient: using MockHttpMessageHandler (RichardSzalay.MockHttp or manual implementation), testing with WireMock.Net for integration testing, testing IHttpClientFactory-based code, verifying request content and headers, and simulating errors (timeouts, 5xx, network failures). Include patterns for injecting mock handlers in typed client tests. Cover contract testing approaches.
```

---

### 10. REST API Design

#### 10.1 REST Principles
```
Explain REST's six constraints: client-server, stateless, cacheable, uniform interface, layered system, and code on demand. Explain the Richardson Maturity Model (Level 0: POX, Level 1: Resources, Level 2: HTTP Verbs, Level 3: HATEOAS). Cover what "RESTful" really means vs how most "REST APIs" actually work. Discuss when REST is the right choice vs RPC or GraphQL. Relate each constraint to ASP.NET Core implementation patterns.
```

#### 10.2 URL Design
```
Cover REST URL design best practices: resources as nouns (not verbs), plural resource names, hierarchical relationships (/users/{id}/orders), avoiding verbs in paths, query parameters for filtering/sorting/pagination, case conventions (kebab-case for paths), versioning in URLs vs headers, and stable URL guarantees. Include an anti-patterns table. Show how to configure ASP.NET Core routing for clean URLs.
```

#### 10.3 HTTP Verbs Semantics
```
Deep dive into HTTP verb semantics for REST APIs: GET (safe + idempotent), PUT (idempotent replace), PATCH (partial update, not necessarily idempotent), POST (create or trigger action), DELETE (idempotent), HEAD and OPTIONS. Explain why idempotency matters for retries. Cover the PUT vs PATCH debate, JSON Patch (RFC 6902), and JSON Merge Patch (RFC 7396). Show ASP.NET Core examples implementing each verb correctly.
```

#### 10.4 API Versioning
```
Compare API versioning strategies: URL path versioning (/v1/users), query string (?api-version=1.0), header versioning (Api-Version: 1), and content negotiation (Accept: application/vnd.myapi.v1+json). Discuss trade-offs (discoverability, cacheability, client complexity). Show implementation using Asp.Versioning.Http (formerly Microsoft.AspNetCore.Mvc.Versioning): versioning Minimal APIs and controllers, deprecating versions, version discovery endpoints.
```

#### 10.5 Pagination, Filtering, and Sorting
```
Cover API pagination strategies: offset pagination (?skip=20&take=10), cursor/keyset pagination (more efficient for large datasets), and page-based (?page=2&pageSize=10). Include Link headers (RFC 5988) for navigation. Show filtering (?status=active&createdAfter=2024-01-01), sorting (?sort=createdAt:desc), and field selection (?fields=id,name). Implement all these in ASP.NET Core with query model binding and EF Core. Include OData as an alternative.
```

#### 10.6 HATEOAS
```
Explain HATEOAS (Hypermedia as the Engine of Application State): self-describing APIs where responses include links to related actions, HAL (Hypertext Application Language) format, the benefits (discoverability, decoupling) and why most REST APIs skip it. Show a practical HATEOAS implementation in ASP.NET Core with HAL-formatted responses. Discuss when HATEOAS actually provides value vs when it's over-engineering.
```

#### 10.7 Problem Details
```
Explain RFC 7807 Problem Details for HTTP APIs: the ProblemDetails JSON structure (type, title, status, detail, instance), how it standardizes error responses, extension fields, and the application/problem+json content type. Show how ASP.NET Core's built-in ProblemDetails support works (UseProblemDetails, IProblemDetailsService), customizing problem details, adding validation errors, and how .NET 7+ improved the default error responses. Include client-side handling.
```

#### 10.8 REST APIs in ASP.NET Core
```
Comprehensive guide to building REST APIs in ASP.NET Core with controllers: routing (attribute routing, route templates, route constraints), model binding (from body, route, query, header), model validation (DataAnnotations, FluentValidation), response formatting, action filters, and exception handling middleware. Cover controller vs ControllerBase, ApiController attribute behavior (automatic 400 responses, binding source inference). Include a complete CRUD API example.
```

#### 10.9 Minimal APIs
```
Comprehensive guide to ASP.NET Core Minimal APIs (.NET 6+): defining routes with MapGet/MapPost/MapPut/MapDelete, route parameters and query strings, dependency injection in route handlers, returning IResult, grouping routes with RouteGroupBuilder, middleware and filters for minimal APIs, and OpenAPI/Swagger integration. Compare Minimal APIs vs Controllers (performance, code organization, feature parity). Show a complete REST API with Minimal APIs including validation and error handling.
```

---

### 11. WebSockets

#### 11.1 WebSocket Protocol
```
Explain the WebSocket protocol: the upgrade handshake (HTTP/1.1 Upgrade request, 101 Switching Protocols response), the WebSocket frame format (FIN bit, opcode, masking key, payload length), frame types (text, binary, ping, pong, close), and the close handshake. Show the raw HTTP upgrade exchange. Explain how WebSocket solves the limitations of HTTP polling. Cover WebSocket extensions (permessage-deflate compression).
```

#### 11.2 WebSocket vs Polling vs SSE
```
Compare real-time communication approaches: short polling (repeated HTTP requests), long polling (held-open requests), Server-Sent Events (one-way server push over HTTP), and WebSockets (full duplex). For each: explain the mechanism, overhead, browser support, proxy compatibility, and scalability characteristics. Include a decision matrix. Cover when WebSockets are overkill and SSE or long polling is sufficient. Include .NET implementation considerations for each.
```

#### 11.3 WebSocket Server in ASP.NET Core
```
Show how to implement a WebSocket server in ASP.NET Core: enabling WebSocket middleware (UseWebSockets), accepting WebSocket connections (HttpContext.WebSockets.AcceptWebSocketAsync), the receive/send loop, handling message fragmentation, managing multiple clients, graceful shutdown, and error handling. Include a complete chat server example. Cover connection lifecycle, ping/pong keep-alive, and what happens when clients disconnect unexpectedly.
```

#### 11.4 WebSocket Client in .NET
```
Show how to implement a WebSocket client in .NET using ClientWebSocket: connecting to a WebSocket server (ConnectAsync), sending text and binary messages, the receive loop with cancellation, handling close frames, and reconnection logic. Include a complete example. Cover WebSocket subprotocols negotiation, adding HTTP headers to the handshake (for auth), and proxy support. Show how to test WebSocket clients with a mock server.
```

#### 11.5 SignalR
```
Comprehensive guide to ASP.NET Core SignalR: Hub model, client/server method invocation, groups, connection management, JavaScript and .NET clients, transport negotiation (WebSockets → Server-Sent Events → Long Polling), Hub filters, strongly typed hubs, and streaming (IAsyncEnumerable, ChannelReader). Show a complete real-time notification system. Cover authentication and authorization in SignalR. Explain when to use raw WebSockets vs SignalR.
```

#### 11.6 SignalR Scaling
```
Explain SignalR scaling challenges (each server only knows its own connections) and solutions: Redis backplane (all servers share messages via pub/sub), Azure SignalR Service (offloads connection management), and Kubernetes sticky sessions. Show configuration for Redis backplane and Azure SignalR Service in ASP.NET Core. Cover sticky sessions with Nginx/YARP. Explain the trade-offs and costs of each approach. Include health monitoring for SignalR connections.
```

#### 11.7 WebSocket Security
```
Cover WebSocket security: the Origin header and CSRF protection (WebSocket handshake doesn't send cookies by default in cross-origin), authentication strategies (token in subprotocol, query string, or first message), authorization on the Hub, input validation for WebSocket messages, rate limiting connections and messages, and DoS protection (message size limits, connection limits). Show secure SignalR configuration in ASP.NET Core.
```

---

### 12. Server-Sent Events

#### 12.1 SSE Protocol
```
Explain the SSE protocol: the text/event-stream content type, event format (data:, event:, id:, retry: fields), multi-line data, named events, the Last-Event-ID header for reconnection, and browser auto-reconnect behavior. Show raw SSE stream examples. Cover the EventSource browser API. Explain SSE's limitations: one-directional (server to client only), HTTP/1.1 connection limit per domain (solved by HTTP/2 multiplexing). Compare to WebSockets.
```

#### 12.2 SSE vs WebSockets
```
Detailed comparison of SSE and WebSockets: use cases (notifications, live feeds, dashboards vs chat, gaming, collaboration), protocol overhead, proxy/firewall friendliness (SSE is plain HTTP), reconnection (SSE built-in vs WebSocket manual), browser support, server resource usage (SSE cheaper for unidirectional), and HTTP/2 compatibility. Build a decision guide. Include hybrid approaches (SSE for server push + HTTP POST for client messages).
```

#### 12.3 SSE in ASP.NET Core
```
Show how to implement Server-Sent Events in ASP.NET Core: setting the correct headers (Content-Type: text/event-stream, Cache-Control: no-cache), writing events to the response stream, keeping the connection alive, client disconnection detection via CancellationToken, and using IAsyncEnumerable as an event source. Include a complete real-time dashboard example. Cover HTTP/2 SSE behavior (multiple SSE streams over one connection). Show how to test SSE endpoints.
```

#### 12.4 SSE for AI Streaming
```
Show how to implement AI response streaming using SSE in .NET: building an ASP.NET Core endpoint that streams tokens from an AI model (e.g., calling Anthropic or OpenAI API and forwarding the stream), parsing SSE events on the client side in JavaScript, and handling errors mid-stream. Cover the "data: [DONE]" pattern used by OpenAI-compatible APIs. Include retry handling and backpressure. Show both the server implementation and a JavaScript EventSource consumer.
```

---

### 13. gRPC

#### 13.1 gRPC Overview
```
Explain gRPC: its origin at Google (Stubby), how it uses Protocol Buffers for serialization and HTTP/2 as transport, the .proto IDL, code generation, and why it's popular for microservices. Compare gRPC to REST: binary vs JSON, strict contract vs loose, generated clients vs hand-written, browser limitations vs universal REST support. Cover gRPC's performance advantages and when to choose it. Show a simple .proto file and generated C# code.
```

#### 13.2 Protobuf
```
Deep dive into Protocol Buffers: the .proto file syntax (messages, fields, field numbers, scalar types, enums, nested messages, repeated fields, oneof, maps, Any, Timestamp, Duration), wire format (varint, fixed32, fixed64, length-delimited), forward/backward compatibility rules (adding fields safely, never reusing field numbers), and the code generation pipeline (protoc + grpc_csharp_plugin). Show common patterns: pagination, error details, timestamps.
```

#### 13.3 gRPC Service Types
```
Explain all four gRPC service types with .proto definitions and C# implementations: Unary (single request, single response — like a function call), Server Streaming (single request, stream of responses — like subscribing to events), Client Streaming (stream of requests, single response — like uploading a large file), and Bidirectional Streaming (both sides stream — like a chat). Include real-world use cases for each. Show complete .NET examples.
```

#### 13.4 gRPC in .NET
```
Comprehensive .NET gRPC guide: setting up a gRPC server with Grpc.AspNetCore, creating a gRPC client with Grpc.Net.Client, configuring the .proto build pipeline (.csproj settings), service implementation, channel configuration (TLS, keep-alive, max message size), client factory pattern with IHttpClientFactory, and deadline/cancellation propagation. Show a complete end-to-end example with a server, a client, and shared proto definitions.
```

#### 13.5 gRPC Interceptors
```
Explain gRPC interceptors (equivalent to middleware): client-side and server-side interceptors, the interceptor chain, and implementing cross-cutting concerns (logging, authentication, tracing, retry, error handling). Show concrete interceptor implementations: a logging interceptor that logs request/response, an auth interceptor that adds Bearer tokens to outgoing calls, and an exception-to-status mapping interceptor. Show registration in .NET.
```

#### 13.6 gRPC-Web
```
Explain the browser compatibility problem with gRPC (browsers can't control HTTP/2 trailers, required for gRPC status) and gRPC-Web as the solution. Cover the gRPC-Web protocol differences, the Grpc.AspNetCore.Web package for server support, and the Grpc.Net.Client.Web package for browser WASM clients. Show a complete Blazor WASM client consuming a gRPC service. Discuss gRPC-Web vs REST for Blazor apps.
```

#### 13.7 gRPC vs REST vs GraphQL
```
Comprehensive comparison of gRPC, REST, and GraphQL across: contract definition (protobuf / OpenAPI / SDL), type safety, client generation, browser support, streaming, performance (serialization speed, payload size), tooling ecosystem, learning curve, versioning, and use cases. Build a decision matrix. Explain why microservices often use gRPC internally and REST externally, and when GraphQL makes sense for either.
```

#### 13.8 gRPC Error Handling
```
Explain gRPC status codes (OK, CANCELLED, UNKNOWN, INVALID_ARGUMENT, NOT_FOUND, PERMISSION_DENIED, UNAUTHENTICATED, UNAVAILABLE, etc.) and when to use each. Cover rich error details (google.rpc.Status with details Any field), the RpcException in .NET, interceptor-based error handling, mapping domain exceptions to gRPC status codes, and client-side error handling. Show how to include validation errors and error metadata in gRPC responses.
```

---

### 14. GraphQL

#### 14.1 GraphQL Overview
```
Explain GraphQL: the schema definition language (types, queries, mutations, subscriptions, interfaces, unions, enums), how queries let clients specify exactly what data they need, introspection, the single endpoint model, and the N+1 problem. Show a complete schema and example queries. Cover the GraphQL execution model. Explain subscriptions over WebSockets. Compare to REST's fixed-shape responses.
```

#### 14.2 GraphQL vs REST
```
Detailed comparison of GraphQL and REST: over-fetching/under-fetching, multiple roundtrips (REST) vs single query (GraphQL), versioning (REST explicit vs GraphQL schema evolution), caching (REST HTTP cache vs GraphQL persisted queries), tooling (GraphiQL, Apollo DevTools), type safety, file uploads, real-time (GraphQL subscriptions vs REST SSE), and performance (N+1 problem). Build a decision guide for .NET architects.
```

#### 14.3 N+1 Problem and DataLoader
```
Explain the N+1 query problem in GraphQL: fetching a list of items then making a separate DB query per item to resolve a nested field. Show the problem with examples (fetching 100 orders, then 100 separate customer lookups). Explain the DataLoader pattern: batching and caching requests within a single execution. Show implementation with Hot Chocolate's DataLoader. Cover deferred execution and how it integrates with async .NET code.
```

#### 14.4 GraphQL in .NET with Hot Chocolate
```
Comprehensive guide to Hot Chocolate (.NET GraphQL server): defining a schema with code-first and schema-first approaches, resolvers, dependency injection, filtering/sorting/pagination (built-in middleware), subscriptions with WebSockets, persisted queries, and authentication/authorization. Show a complete .NET API with Hot Chocolate, EF Core as the data source, and DataLoader for efficient querying. Cover Banana Cake Pop (Hot Chocolate's IDE).
```

#### 14.5 GraphQL Security
```
Cover GraphQL-specific security concerns: introspection exposure in production (disable or restrict), query depth limiting (prevent deeply nested queries that are expensive), query complexity analysis, field-level authorization, injection via queries (input validation), batching attacks, and rate limiting GraphQL endpoints. Show how to implement depth limiting and complexity analysis in Hot Chocolate. Cover CSRF protection for GraphQL endpoints.
```

---

### 15. Sockets & Low-Level Networking

#### 15.1 Berkeley Sockets
```
Explain the Berkeley Sockets API origin (BSD Unix, 1983), why it became the universal networking API, the socket lifecycle (socket → bind → listen → accept / connect → send/recv → close), the file descriptor model on Unix, and how .NET's Socket class wraps the OS API. Cover the difference between blocking and non-blocking socket calls at the OS level. Show the correspondence between BSD socket functions and .NET Socket methods.
```

#### 15.2 Socket Types
```
Explain socket types: SOCK_STREAM (TCP, connection-oriented, reliable), SOCK_DGRAM (UDP, connectionless, unreliable), SOCK_RAW (raw IP packets, requires root/admin), and SOCK_SEQPACKET (less common). Cover address families: AF_INET (IPv4), AF_INET6 (IPv6), AF_UNIX (Unix domain sockets). Show when each combination is used. Include IPPROTO values. Demonstrate creating each socket type in .NET.
```

#### 15.3 Blocking vs Async I/O
```
Explain I/O models: blocking I/O (thread blocks waiting for data), non-blocking I/O (returns immediately, poll for readiness), I/O multiplexing (select/poll/epoll — monitor multiple sockets), signal-driven I/O, and asynchronous I/O (completion notification). Explain how .NET's async/await maps to OS async I/O (IOCP on Windows, epoll on Linux via .NET's managed threadpool). Show why async I/O enables high scalability without many threads.
```

#### 15.4 Socket Class in .NET
```
Comprehensive guide to System.Net.Sockets.Socket in .NET: constructors (AddressFamily, SocketType, ProtocolType), async methods (ConnectAsync, AcceptAsync, ReceiveAsync, SendAsync with SocketAsyncEventArgs), socket options (SetSocketOption), binding and listening, the Socket.Select method for multiplexing, graceful vs abortive shutdown (Shutdown + Close vs immediate Close), and error handling (SocketException). Include a complete async TCP server example.
```

#### 15.5 SocketAsyncEventArgs
```
Explain SocketAsyncEventArgs for high-performance socket programming: the object pool pattern (reusing EventArgs objects to avoid allocations), the completion callback model, the synchronous completion path (when SendAsync/ReceiveAsync returns false), and how this pattern is used in high-throughput servers. Show the performance difference vs regular async/await sockets. Include a complete implementation of a buffer pool + SocketAsyncEventArgs server handling thousands of connections.
```

#### 15.6 Socket vs TcpClient vs UdpClient
```
Compare the three levels of TCP/UDP networking in .NET: raw Socket (maximum control, most complex), TcpClient/TcpListener (TCP abstraction with NetworkStream), and UdpClient (UDP abstraction). Show side-by-side implementations of the same echo server/client at each level. Include a feature comparison table. Explain when to use each level: raw Socket for protocols with specific requirements, TcpClient for most TCP use cases, UdpClient for simple UDP.
```

#### 15.7 Unix Domain Sockets
```
Explain Unix Domain Sockets (UDS): IPC mechanism using filesystem paths instead of network addresses, why they're faster than TCP loopback (no network stack), use cases (same-machine communication, Docker sidecar containers, database connections). Show how to create a UDS server and client in .NET using AddressFamily.Unix. Cover the Kestrel Unix socket endpoint, connecting to PostgreSQL via UDS, and Docker volume-mounted sockets.
```

---

### 16. Network I/O and Performance

#### 16.1 I/O Completion Ports
```
Explain Windows I/O Completion Ports (IOCP) and their Unix equivalents (epoll, kqueue): the OS mechanism that enables async I/O without blocking threads. Explain how .NET's ThreadPool and async I/O use IOCP/epoll under the hood. Cover completion port queues, callback threads, and the .NET thread pool's I/O threads. Explain why async/await for I/O doesn't consume a thread while waiting. Include the impact on ASP.NET Core's request processing model.
```

#### 16.2 async/await with Network I/O
```
Best practices for async/await with network I/O in .NET: always use async all the way (avoid .Result and .Wait()), CancellationToken propagation, avoiding async over sync wrappers (Task.Run for CPU-bound only), ConfigureAwait(false) in libraries, using IAsyncEnumerable for streaming, and common async pitfalls (async void, missing awaits, deadlocks in sync context). Show before/after code. Cover ValueTask for high-frequency low-allocation async paths.
```

#### 16.3 System.IO.Pipelines
```
Explain System.IO.Pipelines: the Pipe, PipeReader, PipeWriter, and PipeScheduler types, how they avoid buffer copying (the reader and writer share memory), the backpressure mechanism, and why Pipelines are faster than Stream for high-throughput parsing. Show how Kestrel uses Pipelines internally. Build a custom TCP server that uses a Pipe to parse a line-based protocol efficiently. Compare to Stream-based approach with allocation benchmarks.
```

#### 16.4 SocketsHttpHandler
```
Deep dive into SocketsHttpHandler: connection pool settings (MaxConnectionsPerServer, PooledConnectionLifetime, PooledConnectionIdleTimeout, ConnectTimeout), DNS resolution control (ConnectCallback), custom SSL configuration (SslOptions), proxy settings, HTTP/2 and HTTP/3 settings, and performance tuning. Show how to configure SocketsHttpHandler for high-throughput API clients. Explain why SocketsHttpHandler replaced HttpClientHandler as the default.
```

#### 16.5 Memory Pooling
```
Explain memory pooling for network code: ArrayPool<T> (renting and returning byte arrays for network buffers), MemoryPool<T> (IMemoryOwner pattern), and why pooling reduces GC pressure in high-throughput scenarios. Show correct usage: renting a buffer, using it with NetworkStream.ReadAsync/WriteAsync, and returning it (try/finally or IDisposable). Cover MemoryPool.Shared vs custom pools. Include a benchmark showing allocation reduction with pooling.
```

#### 16.6 Span in Network Code
```
Show how to use Span<T>, Memory<T>, and ReadOnlySpan<T> in network code to avoid allocations: reading into stack-allocated buffers, slicing received data without copying, parsing binary protocols with BinaryPrimitives, and writing to network streams with ReadOnlyMemory<byte>. Show Socket.ReceiveAsync(Memory<byte>) and Socket.SendAsync(ReadOnlyMemory<byte>) overloads. Include a zero-copy binary protocol parser using Span.
```

#### 16.7 Benchmarking Network Code
```
Show how to benchmark network code in .NET using BenchmarkDotNet: setting up benchmarks for HTTP clients (avoiding network round-trips in micro-benchmarks), using in-process servers for socket benchmarks, measuring allocations (MemoryDiagnoser), comparing HttpClient configurations, and interpreting results. Cover common benchmarking mistakes (JIT warmup, GC interference, socket setup overhead). Include a real benchmark comparing streaming vs buffered HTTP responses.
```

---

### 17. Load Balancing & Reverse Proxies

#### 17.1 Load Balancing Algorithms
```
Explain load balancing algorithms: Round Robin (equal distribution), Weighted Round Robin, Least Connections (send to server with fewest active connections), Least Response Time, IP Hash (session affinity by IP), Random, and Power of Two Choices. For each: explain the algorithm, use cases, and failure scenarios. Include a comparison table. Discuss consistent hashing for cache-friendly load balancing. Relate to Azure Load Balancer, AWS ALB/NLB, and Nginx configuration.
```

#### 17.2 L4 vs L7 Load Balancing
```
Compare Layer 4 (transport) and Layer 7 (application) load balancing: L4 routes based on IP/port (faster, no TLS termination, no content inspection), L7 routes based on HTTP headers/URL/cookies (content-based routing, TLS termination, session affinity, health checks aware of HTTP responses). Cover examples: AWS NLB (L4) vs ALB (L7), Nginx stream (L4) vs http (L7) modules. Explain when to use each for .NET applications.
```

#### 17.3 Reverse Proxy Pattern
```
Explain the reverse proxy pattern: what it is, how it differs from a forward proxy, and its benefits (TLS termination, load balancing, caching, compression, DDoS protection, A/B routing, canary deployments). Cover common reverse proxies: Nginx, HAProxy, Caddy, Envoy, and Traefik. Explain how X-Forwarded-For, X-Forwarded-Proto, and X-Real-IP headers work and how ASP.NET Core's ForwardedHeaders middleware handles them.
```

#### 17.4 YARP
```
Comprehensive guide to YARP (Yet Another Reverse Proxy): a .NET-native reverse proxy library. Cover YARP architecture (config-driven vs programmatic), route and cluster configuration, load balancing policies, session affinity, health checks, transforms (modifying requests/responses), middleware integration, and custom routing logic. Include a complete YARP setup that proxies traffic to multiple .NET backends. Compare to Nginx for .NET microservice scenarios.
```

#### 17.5 Nginx and HAProxy with .NET
```
Show how to configure Nginx as a reverse proxy for ASP.NET Core applications: proxy_pass configuration, upstream blocks, SSL termination, WebSocket proxying (proxy_http_version 1.1, Upgrade header), HTTP/2 to backend, and buffer settings. Show equivalent HAProxy configuration. Cover the ASP.NET Core ForwardedHeaders middleware configuration to correctly read client IPs and protocol. Include Docker Compose examples with Nginx + ASP.NET Core.
```

#### 17.6 Health Checks
```
Comprehensive guide to ASP.NET Core health checks: AddHealthChecks(), MapHealthChecks(), writing custom IHealthCheck implementations, built-in checks (database, Redis, RabbitMQ via AspNetCore.HealthChecks.* packages), health check filtering for liveness vs readiness vs startup probes, returning structured JSON responses, and integrating with Kubernetes probes. Show how to configure health check endpoints for load balancer integration.
```

#### 17.7 Sticky Sessions
```
Explain sticky sessions (session affinity): why they're needed (in-memory session state, WebSocket connections), how they work (cookie-based, IP-based), the failure mode (server down loses session), and alternatives (distributed cache, stateless JWT, SignalR Redis backplane). Show how to configure sticky sessions in ASP.NET Core with ARR Affinity (Azure App Service), Nginx's ip_hash, and YARP's session affinity. Explain the trade-offs and when to avoid sticky sessions.
```

---

### 18. API Gateways & Service Mesh

#### 18.1 API Gateway Pattern
```
Explain the API Gateway pattern: single entry point for all client requests, responsibilities (routing, authentication, rate limiting, request aggregation, protocol translation, caching, analytics), and how it differs from a reverse proxy. Cover the Backend for Frontend (BFF) pattern. Discuss trade-offs (single point of failure, bottleneck, development coupling). Show how API Gateways fit in .NET microservices architectures alongside ASP.NET Core services.
```

#### 18.2 Ocelot
```
Comprehensive guide to Ocelot — the .NET API Gateway library: route configuration (downstream and upstream paths), load balancing, authentication (JWT verification at gateway), rate limiting, request aggregation, header transformation, quality of service (circuit breaker), service discovery integration (Consul, Eureka), and caching. Show a complete Ocelot configuration for a microservices application. Compare Ocelot to YARP and cloud-native API gateways.
```

#### 18.3 Rate Limiting in ASP.NET Core
```
Comprehensive guide to ASP.NET Core rate limiting (.NET 7+): the RateLimiterOptions API, built-in algorithms (Fixed Window, Sliding Window, Token Bucket, Concurrency Limiter), per-client rate limiting using partitioned limiters (by IP, by user ID, by API key), global vs per-endpoint limits, rejection response customization (429 status, Retry-After header), and integration with IHttpContextAccessor for client identification. Include production-ready configuration examples.
```

#### 18.4 Service Mesh
```
Explain service mesh concepts: the control plane vs data plane, the sidecar proxy model (Envoy), and the three main service meshes (Istio, Linkerd, Consul Connect). Cover what a service mesh provides that application code doesn't have to: mTLS between services, observability (distributed tracing, metrics), traffic management (canary, circuit breaking), and policy enforcement. Explain when a service mesh is worth the operational complexity for .NET microservices.
```

#### 18.5 mTLS in a Service Mesh
```
Explain how service meshes implement mutual TLS automatically: certificate issuance (SPIFFE/SPIRE, Istio's Citadel), certificate rotation, the sidecar intercepting traffic and terminating TLS, and service-to-service identity (SPIFFE ID). Show how to enable Istio mTLS for a .NET microservice without changing application code. Cover PeerAuthentication and DestinationRule configurations. Explain the difference between mesh-level mTLS and application-level mTLS.
```

#### 18.6 Sidecar Pattern
```
Explain the sidecar pattern in containerized .NET applications: a sidecar container that runs alongside the main application container in the same Pod, handling cross-cutting concerns. Cover use cases: service mesh proxy (Envoy/Linkerd), log shipping, config synchronization, secret injection, and protocol translation. Show a Kubernetes Pod spec with a .NET app and an Envoy sidecar. Discuss .NET Aspire's approach to sidecars.
```

---

### 19. Resilience Patterns

#### 19.1 Transient Fault Handling
```
Explain why transient faults are inevitable in distributed systems: network timeouts, temporary service unavailability, throttling, DNS hiccups, connection pool exhaustion, and partial failures. Cover the difference between transient faults (safe to retry) and permanent faults (not safe to retry). Define what constitutes a retryable HTTP status code. Explain the importance of idempotency for safe retries. Introduce the resilience pattern vocabulary used in the section.
```

#### 19.2 Retry Pattern
```
Explain the retry pattern: immediate retry, retry with fixed delay, exponential backoff (doubling delay), and exponential backoff with jitter (randomization to avoid thundering herd). Explain why jitter is critical in distributed systems. Show the retry formula with jitter. Cover retry budgets (max attempts, total timeout). Implement a retry policy with Polly v8 and Microsoft.Extensions.Http.Resilience. Show how to distinguish retryable vs non-retryable exceptions/status codes.
```

#### 19.3 Circuit Breaker Pattern
```
Explain the circuit breaker pattern: the three states (Closed, Open, Half-Open), transition triggers (failure threshold), the half-open probe request, and manual control. Explain why circuit breakers prevent cascade failures (failing fast instead of queuing requests to a dead service). Show a Polly circuit breaker implementation with state change events for logging/alerting. Cover the .NET 8 resilience pipeline approach. Include metrics and monitoring for circuit breaker state.
```

#### 19.4 Timeout Pattern
```
Explain timeout patterns: the importance of always having timeouts (resource exhaustion), global vs per-request timeouts, connect vs read timeouts, CancellationToken propagation through the call chain, and what happens when a timeout fires while a downstream request is in flight (the "timeout and continue" problem for non-idempotent operations). Show how to configure timeouts at multiple levels in .NET: HttpClient.Timeout, CancellationTokenSource, and Polly timeout strategy.
```

#### 19.5 Bulkhead Pattern
```
Explain the bulkhead pattern (named after ship compartments): isolating resources so failure in one area doesn't exhaust resources for another. Cover thread pool bulkheads (Semaphore-based) and connection pool bulkheads (max connections per downstream service). Show Polly's BulkheadPolicy and the concurrency limiter in .NET 7+. Explain how bulkheads complement circuit breakers. Include a real-world example: separating bulk processing calls from user-facing API calls.
```

#### 19.6 Fallback Pattern
```
Explain the fallback pattern: providing an alternative response when the primary call fails. Cover fallback types: cached response, default value, alternative service, degraded response. Show Polly fallback policy implementation. Discuss the cascade failure risk of fallbacks (a broken fallback silently hides errors). Cover cache-aside pattern as a fallback source. Include a .NET example: returning cached data when a live API call fails, with proper cache invalidation.
```

#### 19.7 Polly
```
Comprehensive guide to Polly v8: the new ResiliencePipeline API (replacing the old PolicyWrap), pipeline strategies (retry, circuit breaker, timeout, rate limiter, bulkhead, fallback, hedging), building pipelines with ResiliencePipelineBuilder, executing synchronously and asynchronously, context passing (ResilienceContext), telemetry and event handling, and integration with IHttpClientFactory and DI. Show a production-ready resilience pipeline for an external HTTP dependency.
```

#### 19.8 Microsoft.Extensions.Http.Resilience
```
Deep dive into Microsoft.Extensions.Http.Resilience (.NET 8+): AddStandardResilienceHandler (the opinionated out-of-the-box pipeline with sensible defaults), AddStandardHedgingHandler, customizing individual strategies within the standard handler, configuring via IOptions, and telemetry integration with OpenTelemetry. Compare to raw Polly v8. Show migration from the older Microsoft.Extensions.Http.Polly package. Include configuration options and observability setup.
```

#### 19.9 Hedging
```
Explain the hedging strategy (also called speculative execution): sending the same request to multiple backends or retrying before the original times out, taking the first successful response. Cover the trade-off (extra load on backends vs reduced tail latency). Explain hedging delay (start hedge after P95 latency, not immediately). Show Microsoft.Extensions.Http.Resilience hedging handler configuration. Cover when hedging is appropriate (idempotent GET requests, read replicas).
```

---

### 20. Proxies, Tunneling & VPNs

#### 20.1 Forward vs Reverse Proxy
```
Explain the conceptual difference between forward and reverse proxies: forward proxy sits in front of clients (client knows about it, used for filtering, caching, anonymity — like corporate proxies), reverse proxy sits in front of servers (client unaware, used for load balancing, TLS termination, caching). Cover transparent vs explicit proxies. Include real-world examples of each. Relate to how .NET apps interact with both types.
```

#### 20.2 HTTP CONNECT Tunneling
```
Explain HTTP CONNECT tunneling: how clients use an HTTP proxy to establish a TCP tunnel to any destination (used for HTTPS through HTTP proxies), the CONNECT method request/response exchange, and how TLS negotiation happens after the tunnel is established. Show how .NET HttpClient uses CONNECT when routed through an HTTP proxy for HTTPS requests. Cover CONNECT in the context of WebSocket proxying and SSH tunneling.
```

#### 20.3 SOCKS Proxies
```
Explain SOCKS proxies (SOCKS4, SOCKS4a, SOCKS5): how they differ from HTTP proxies (protocol agnostic, TCP/UDP tunneling), authentication in SOCKS5, DNS resolution options, and use cases (Tor, corporate networks, SSH dynamic port forwarding). Show how to configure SOCKS5 proxy support in .NET HttpClient using SocketsHttpHandler.UseProxy and a custom WebProxy or third-party library (since .NET doesn't natively support SOCKS5). Cover SOCKS in testing and development.
```

#### 20.4 Proxies in .NET
```
Comprehensive guide to proxy configuration in .NET: system proxy detection (WebRequest.DefaultWebProxy, HttpClient automatic system proxy), configuring explicit proxy with WebProxy, proxy bypass lists (NoProxy), per-HttpClient proxy configuration via SocketsHttpHandler, proxy authentication (Basic, NTLM), and configuring proxy in containers (HTTP_PROXY, HTTPS_PROXY, NO_PROXY environment variables). Include corporate proxy troubleshooting tips.
```

#### 20.5 Corporate Proxy Considerations
```
Cover common issues .NET applications face in corporate networks with proxies: SSL inspection (MITM proxy with custom root CA — adding to trust store in .NET), NTLM/Kerberos proxy authentication, proxy bypass for internal services, container networking and proxy env vars, NuGet and dotnet restore through proxies, and Docker pull through proxies. Show how to configure .NET for all common corporate proxy scenarios. Include diagnostic steps for proxy connectivity issues.
```

#### 20.6 VPN Concepts
```
Explain VPN concepts: what a VPN does (extends a private network over a public one, encrypts traffic, hides source IP), tunnel protocols (IPSec — IKEv2/ESP, OpenVPN — TLS-based, WireGuard — modern, fast, simple), split tunneling, full tunneling, and site-to-site vs remote access VPNs. Cover how VPNs affect .NET application networking: routing, DNS resolution changes, and MTU issues (fragmentation in tunnels). Relate to Azure VPN Gateway and AWS VPN.
```

#### 20.7 Container Networking
```
Explain container networking fundamentals: Docker's network modes (bridge, host, overlay, macvlan, none), container-to-container communication on the same host (bridge network), cross-host communication (overlay with VXLAN), and DNS within Docker networks. Cover Kubernetes networking: Pod networking (each Pod gets its own IP), Service types (ClusterIP, NodePort, LoadBalancer, ExternalName), kube-proxy, CNI plugins (Calico, Flannel, Cilium). Show how .NET apps discover and communicate with other services in Docker and Kubernetes.
```

---

### 21. Protocols Reference

#### 21.1 Email Protocols in .NET
```
Explain SMTP (sending: ports 25/465/587, STARTTLS, authentication), IMAP (reading mail with folder sync, IDLE for push, ports 143/993), and POP3 (downloading mail, ports 110/995). Cover email security: SPF, DKIM, and DMARC records. Show how to send email in .NET using MailKit (the recommended library since SmtpClient is deprecated): sending HTML email with attachments, reading inbox with IMAP, and handling OAuth for Gmail/Microsoft 365.
```

#### 21.2 FTP and SFTP in .NET
```
Explain FTP (unencrypted, active vs passive modes, firewalls and data channels), FTPS (FTP with TLS), and SFTP (completely different protocol — SSH File Transfer Protocol). Cover why plain FTP should never be used and when SFTP vs FTPS is appropriate. Show .NET implementations: FluentFTP for FTPS (with examples: upload, download, list directory, progress reporting) and SSH.NET for SFTP. Cover common issues: passive mode, certificate validation, and large file transfers.
```

#### 21.3 SSH in .NET
```
Explain SSH protocol concepts: public key authentication, host key verification (preventing MITM), SSH channels, port forwarding (local, remote, dynamic), and the SCP/SFTP subsystems. Show how to use SSH.NET in .NET: connecting with password and key-based auth, executing commands, uploading/downloading files via SFTP, local port forwarding (tunneling database connections), and handling host key verification. Cover key format conversions (OpenSSH vs PuTTY).
```

#### 21.4 MQTT in .NET
```
Explain MQTT: publish/subscribe pattern, broker model, topics and wildcards (# and +), QoS levels (0: at most once, 1: at least once, 2: exactly once), retained messages, will messages (last will and testament), persistent sessions, and MQTT 5.0 improvements. Cover use cases: IoT sensors, home automation, telemetry. Show MQTTnet usage in .NET: connecting to a broker (Mosquitto), subscribing to topics, publishing messages, QoS configuration, and building a simple IoT data ingestion pipeline.
```

#### 21.5 AMQP and RabbitMQ in .NET
```
Explain AMQP (Advanced Message Queuing Protocol): exchanges (direct, fanout, topic, headers), queues, bindings, routing keys, acknowledgments, and durability. Cover RabbitMQ as the most popular AMQP broker. Show .NET usage with RabbitMQ.Client: connecting to RabbitMQ, declaring exchanges and queues, publishing messages, consuming with push-based (EventingBasicConsumer) and pull-based consumers, manual acknowledgment, and dead letter exchanges. Cover MassTransit as a higher-level abstraction.
```

#### 21.6 NTP
```
Explain NTP (Network Time Protocol): stratum levels, the reference clock hierarchy, time synchronization algorithm, clock drift correction, and how NTP achieves millisecond accuracy over the internet. Explain why accurate time matters for .NET applications: token expiration (JWT nbf/exp), distributed tracing timestamps, event ordering in distributed systems, and TLS certificate validity. Show how to query NTP from .NET using a UDP socket. Cover clock skew issues in cloud VMs and containers.
```

#### 21.7 ICMP and Ping in .NET
```
Explain ICMP (Internet Control Message Protocol): message types (Echo Request/Reply, Destination Unreachable, TTL Exceeded, Redirect), how ping works (ICMP Echo), how traceroute works (TTL manipulation), and ICMP in firewalls. Show how to use System.Net.NetworkInformation.Ping in .NET: async ping, setting TTL, timeout, and buffer size. Cover PingReply analysis. Show a traceroute implementation in .NET using ICMP with increasing TTL. Cover ICMP rate limiting and firewall blocks.
```

#### 21.8 DHCP
```
Explain DHCP (Dynamic Host Configuration Protocol): the DORA process (Discover, Offer, Request, Acknowledge), lease duration, renewal and rebinding, DHCP options (default gateway, DNS servers, NTP servers), static reservations (IP-by-MAC), and DHCPv6. Explain why .NET developers need to understand DHCP: debugging connectivity issues in VMs and containers, link-local fallback (APIPA), and Docker/Kubernetes IPAM. Cover DHCP relay agents for routed networks.
```

---

### 22. Network Diagnostics & Observability

#### 22.1 Wireshark
```
Practical Wireshark guide for .NET developers: capturing traffic (interface selection, capture filters), navigating the packet list/details/bytes panes, display filters (http, tcp.port == 443, ip.addr == x.x.x.x, http.request.method == "POST"), following TCP streams, decrypting TLS (using SSL key log file with SSLKEYLOGFILE env var in .NET), analyzing HTTP/2 frames, timing analysis, and exporting data. Include specific workflows: debugging a slow API call, finding dropped connections, inspecting gRPC traffic.
```

#### 22.2 netstat, ss, and tcpdump
```
Practical guide to network diagnostic tools: netstat (connection states, listening ports, routing table — legacy), ss (modern replacement: faster, more info, socket stats), tcpdump (command-line packet capture, filter syntax, writing pcaps for Wireshark), lsof (files/sockets by process), and curl (verbose HTTP debugging with -v and --trace). Show common diagnostic workflows for .NET apps: finding what's listening on a port, checking connection states, capturing traffic without Wireshark, debugging connection refused errors.
```

#### 22.3 OpenTelemetry in .NET
```
Comprehensive guide to distributed tracing with OpenTelemetry in .NET: adding OpenTelemetry packages, configuring tracing (ActivitySource, automatic instrumentation for HttpClient and ASP.NET Core), exporting to Jaeger/Zipkin/OTLP, propagating trace context (W3C TraceContext, B3), manual span creation for custom operations, and metrics/logs integration. Show how to trace a full request through microservices. Cover sampling strategies and the performance impact.
```

#### 22.4 Network Metrics
```
Cover the key network metrics to monitor for .NET applications: request rate (RPS), error rate (4xx/5xx percentage), latency percentiles (P50, P95, P99, P99.9), connection pool utilization, DNS resolution time, TLS handshake time, time to first byte (TTFB), and bandwidth utilization. Show how to collect these metrics using ASP.NET Core metrics (System.Diagnostics.Metrics), Prometheus + Grafana, and Application Insights. Include example dashboards and alert thresholds.
```

#### 22.5 Logging HTTP Traffic
```
Show how to log HTTP traffic in .NET applications: enabling HttpClient request/response logging with ILogger, implementing a custom DelegatingHandler for detailed logging (including headers and body), using Microsoft.Extensions.Http.Logging, filtering out sensitive headers (Authorization, Cookie), redacting PII, and structured logging with Serilog/Seq. Cover ASP.NET Core request logging middleware. Include a production-safe logging configuration that captures enough to debug issues without logging secrets.
```

#### 22.6 Health Checks and Probes
```
Comprehensive guide to ASP.NET Core health checks for observability: designing liveness (is the process alive?), readiness (is it ready to accept traffic?), and startup probes, implementing custom health checks (database connectivity, downstream API reachability, memory usage), health check UI (AspNetCore.HealthChecks.UI), Kubernetes probe configuration for .NET apps, and health check output formatting. Include a complete health check configuration for a production .NET microservice.
```

#### 22.7 DiagnosticSource and Activity
```
Explain .NET's DiagnosticSource and Activity APIs: how they power distributed tracing, how HttpClient and ASP.NET Core emit diagnostic events, subscribing to DiagnosticSource events for custom monitoring, Activity (spans) and ActivitySource, W3C TraceContext propagation, and how OpenTelemetry builds on Activity. Show how to listen to HttpClient diagnostic events to log request timing, trace IDs, and errors. Cover the relationship between Activity, ILogger, and OpenTelemetry.
```

---

### 23. Network Security

#### 23.1 Common Network Attacks
```
Explain common network attacks relevant to .NET developers: Man-in-the-Middle (interception, SSL stripping), replay attacks (token/session reuse), IP spoofing, ARP poisoning (LAN attacks), DNS spoofing/cache poisoning, SYN flood (DDoS), amplification attacks (DNS/NTP/SSDP DDoS), and BGP hijacking. For each: explain how the attack works, what it compromises, and the defenses. Focus on what .NET developers can do at the application layer to mitigate these.
```

#### 23.2 HTTPS and HSTS
```
Explain HTTPS (HTTP over TLS): why it's mandatory for all applications today, what it protects (confidentiality, integrity, authentication of server), what it doesn't protect (traffic volume, timing, destination IP). Cover HSTS (HTTP Strict Transport Security): the Strict-Transport-Security header, max-age, includeSubDomains, preload lists, and how HSTS prevents SSL stripping. Show ASP.NET Core configuration: UseHttpsRedirection, UseHsts, AddHsts with configuration. Cover HSTS preloading.
```

#### 23.3 CORS in ASP.NET Core
```
Explain CORS (Cross-Origin Resource Sharing): the same-origin policy, preflight requests (OPTIONS), the CORS headers (Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Access-Control-Max-Age), simple vs complex requests. Show ASP.NET Core CORS configuration: AddCors, UseCors, named policies, default policy, per-endpoint CORS, and the danger of Access-Control-Allow-Origin: * with credentials. Cover CORS common mistakes and security implications.
```

#### 23.4 Content Security Policy
```
Explain Content Security Policy (CSP): how it prevents XSS by restricting what resources can load, directive syntax (default-src, script-src, style-src, img-src, connect-src, frame-src, etc.), nonces and hashes for inline scripts, report-only mode for testing, and the report-uri/report-to directives. Show how to configure CSP in ASP.NET Core middleware. Cover common CSP challenges (third-party scripts, inline styles from libraries) and how to build a strong CSP incrementally.
```

#### 23.5 Security Headers
```
Complete security headers reference and ASP.NET Core implementation: HSTS (Strict-Transport-Security), X-Frame-Options (clickjacking protection, superseded by CSP frame-ancestors), X-Content-Type-Options: nosniff (MIME type sniffing), Referrer-Policy, Permissions-Policy (formerly Feature-Policy), Cross-Origin-Opener-Policy, Cross-Origin-Embedder-Policy, and Cross-Origin-Resource-Policy. For each: explain the attack it prevents, recommended value, and browser support. Show NWebsec or manual middleware implementation.
```

#### 23.6 DDoS Mitigation
```
Explain DDoS attack types (volumetric, protocol, application-layer) and mitigation strategies available to .NET developers: rate limiting (ASP.NET Core built-in rate limiter), IP-based blocking, CAPTCHA for suspicious traffic, connection limits, request size limits, ASP.NET Core request timeouts, and upstream mitigation (CDN DDoS protection, cloud provider DDoS services like Azure DDoS Protection, AWS Shield, Cloudflare). Include specific ASP.NET Core configurations for application-layer DDoS resilience.
```

#### 23.7 Firewall and Segmentation
```
Explain network segmentation and defense-in-depth: why internal services shouldn't be directly accessible from the internet, DMZ architecture, and micro-segmentation. Cover network security groups (Azure NSG, AWS Security Groups) as virtual firewalls for .NET deployments. Explain ingress/egress rules, the principle of least privilege for network access. Show Kubernetes NetworkPolicy examples restricting .NET microservice communication. Cover the zero-trust principle for network security.
```

#### 23.8 Kubernetes Network Policies
```
Comprehensive guide to Kubernetes NetworkPolicy for .NET microservices: the default allow-all behavior, how network policies work (label selectors, ingress/egress rules), implementing a default-deny policy, allowing specific service-to-service communication, egress to external services, namespace isolation, and debugging network policy issues. Show practical NetworkPolicy manifests for a typical .NET microservices application. Cover CNI requirements (Calico, Cilium support policies; Flannel does not).
```

---

### 24. Service Discovery & Configuration

#### 24.1 Service Discovery Patterns
```
Explain service discovery patterns: the problem (services have dynamic IPs in cloud/containers), client-side discovery (client queries registry, does load balancing), server-side discovery (client calls load balancer, which queries registry), and the service registry itself (Consul, Eureka, etcd, Kubernetes DNS). Compare patterns: trade-offs in coupling, load balancing flexibility, and infrastructure requirements. Relate to how .NET microservices discover each other in different environments.
```

#### 24.2 DNS-Based Service Discovery
```
Explain DNS-based service discovery: using DNS SRV records to advertise service endpoints (hostname + port + priority + weight), how Kubernetes uses DNS (servicename.namespace.svc.cluster.local), headless services for direct Pod addressing, and ExternalName services. Show how to configure .NET applications to resolve services via DNS in both Kubernetes and Docker Compose. Cover the DNS caching problem in .NET and using SocketsHttpHandler.PooledConnectionLifetime to force DNS refresh.
```

#### 24.3 Consul
```
Explain HashiCorp Consul for service discovery: agent architecture (server vs client agents), service registration (JSON config vs API), health checks (HTTP, TCP, script, TTL), DNS interface (servicename.service.consul), HTTP API for service lookup, Key/Value store for configuration, and Consul Connect (service mesh). Show how to register a .NET service with Consul, query Consul from .NET, and integrate with IHttpClientFactory for automatic service address resolution.
```

#### 24.4 Kubernetes Service Discovery
```
Comprehensive guide to Kubernetes service discovery for .NET: ClusterIP services (stable virtual IP, kube-proxy load balancing), DNS resolution (short names within namespace, FQDNs), Endpoints and EndpointSlices, headless services for StatefulSets, ExternalName for external dependencies, and how to configure .NET apps to use Kubernetes service names. Cover environment variable injection (legacy), DNS preferred approach, and using the Kubernetes API from .NET (KubernetesClient library).
```

#### 24.5 .NET Aspire
```
Explain .NET Aspire: the opinionated cloud-ready app stack for building observable, production-ready distributed .NET applications. Cover the AppHost project (orchestration), service defaults (telemetry, health checks, service discovery built-in), component integrations (Redis, PostgreSQL, RabbitMQ, Azure services), service discovery via IServiceDiscovery, the Aspire Dashboard, and deployment to Azure Container Apps. Show how Aspire solves service discovery between .NET projects in development and production.
```

---

### 25. Cloud Networking for .NET Developers

#### 25.1 Virtual Private Cloud
```
Explain VPC (AWS) / VNet (Azure) concepts: CIDR allocation, subnets (public vs private), route tables, internet gateways, NAT gateways, VPC peering, Transit Gateway/VNet peering. Explain why proper VPC design matters for .NET application security and latency. Cover the typical architecture: public subnets for load balancers, private subnets for application servers and databases. Include sizing recommendations and a reference architecture for a .NET web application.
```

#### 25.2 Azure Networking for .NET
```
Practical guide to Azure networking for .NET apps: Virtual Networks and subnets, Network Security Groups (NSGs), Azure Load Balancer vs Application Gateway vs Front Door, App Service VNet Integration, Private Endpoints for databases and Azure services (no public internet for SQL/Storage/Key Vault), Service Endpoints, Azure DNS private zones, and Azure Container Apps networking. Show how to configure secure networking for a typical .NET web app on Azure.
```

#### 25.3 AWS Networking for .NET
```
Practical guide to AWS networking for .NET apps: VPCs and subnets, Security Groups vs NACLs, ELB (ALB vs NLB — when to use each), AWS PrivateLink for private service access, VPC Endpoints for AWS services (S3, DynamoDB without internet), Route 53 for DNS and health-based routing, ECS/EKS networking (awsvpc mode, service mesh with App Mesh), and RDS in private subnets. Show a production-ready .NET deployment architecture on AWS.
```

#### 25.4 CDN
```
Explain CDNs (Content Delivery Networks): edge nodes, origin servers, cache population (pull vs push), cache keys (URL + Vary headers), cache invalidation, origin shield, dynamic content acceleration (TCP optimization, TLS session reuse), and WebSocket/streaming support. Cover major CDNs (Cloudflare, Azure CDN/Front Door, AWS CloudFront) and their .NET integration. Show how to configure cache headers in ASP.NET Core for CDN-friendly caching and how to serve static assets from a CDN.
```

#### 25.5 Private Endpoints
```
Explain Private Endpoints / AWS PrivateLink: connecting to PaaS services (databases, storage, service bus) over private IP addresses within a VNet instead of the public internet. Cover DNS configuration for private endpoints (private DNS zones overriding public DNS), use cases (eliminating public exposure of databases), and the performance/security benefits. Show how to configure .NET applications to connect to Azure SQL, Azure Storage, and Azure Key Vault via private endpoints.
```

#### 25.6 Cloud Network Performance
```
Cover cloud network performance considerations for .NET developers: cross-region latency (always measure — 50-300ms between regions), cross-AZ latency (typically 1-3ms, but generates inter-AZ bandwidth costs), colocation of services (keep compute near data), accelerated networking (SR-IOV bypassing hypervisor), placement groups (AWS cluster placement), proximity placement groups (Azure), and how to design .NET microservices topologies to minimize latency and egress costs.
```

---

## Quick Reference: .NET Networking APIs

| Use Case | .NET API / Library | Notes |
|---|---|---|
| HTTP client | `HttpClient` + `IHttpClientFactory` | Always use factory in DI |
| REST API server | ASP.NET Core (Controllers / Minimal APIs) | |
| gRPC client & server | `Grpc.Net.Client` / `Grpc.AspNetCore` | Requires HTTP/2 |
| WebSocket server | ASP.NET Core WebSocket middleware | Or use SignalR |
| WebSocket client | `ClientWebSocket` | Built into .NET |
| Real-time (abstracted) | SignalR (`Microsoft.AspNetCore.SignalR`) | Multi-transport |
| TCP client | `TcpClient` / `Socket` | |
| TCP server | `TcpListener` / `Socket` | |
| UDP | `UdpClient` / `Socket` | |
| Low-level high-perf sockets | `SocketAsyncEventArgs` | Avoid allocations |
| High-throughput I/O | `System.IO.Pipelines` | Kestrel uses this |
| DNS resolution | `System.Net.Dns` | |
| ICMP Ping | `System.Net.NetworkInformation.Ping` | |
| Reverse proxy | YARP (`Microsoft.ReverseProxy`) | .NET native |
| Retry / circuit breaker | Polly v8 / `Microsoft.Extensions.Http.Resilience` | .NET 8+ |
| Rate limiting | `Microsoft.AspNetCore.RateLimiting` | .NET 7+ built-in |
| Email | MailKit (NuGet) | SmtpClient deprecated |
| SFTP / SSH | SSH.NET (NuGet) | |
| FTP/FTPS | FluentFTP (NuGet) | |
| MQTT | MQTTnet (NuGet) | |
| AMQP / RabbitMQ | RabbitMQ.Client / MassTransit | |
| GraphQL | Hot Chocolate (NuGet) | |
| Distributed tracing | OpenTelemetry .NET | |

---

## Quick Reference: Port Numbers

| Protocol | Default Port | Notes |
|---|---|---|
| HTTP | 80 | |
| HTTPS | 443 | |
| HTTP/3 (QUIC) | 443 (UDP) | |
| gRPC | 443 (HTTPS) / custom | Uses HTTP/2 |
| WebSocket (ws://) | 80 | HTTP Upgrade |
| WebSocket (wss://) | 443 | HTTPS Upgrade |
| SMTP | 25 / 465 / 587 | 587 for submission |
| IMAP | 143 / 993 | 993 with TLS |
| POP3 | 110 / 995 | 995 with TLS |
| FTP | 21 (control) / 20 (data) | Avoid plain FTP |
| SFTP | 22 | SSH subsystem |
| SSH | 22 | |
| DNS | 53 (UDP/TCP) | DoH: 443, DoT: 853 |
| DHCP | 67 (server) / 68 (client) | |
| NTP | 123 (UDP) | |
| MQTT | 1883 / 8883 (TLS) | |
| AMQP | 5672 / 5671 (TLS) | |
| Redis | 6379 | |
| PostgreSQL | 5432 | |
| SQL Server | 1433 | |

---

*Document version: 1.0 — Covers .NET 6 / .NET 8 LTS and ASP.NET Core 6–8*