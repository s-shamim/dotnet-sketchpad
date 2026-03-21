# Cryptography & Security in .NET
## A Comprehensive Learning Guide

> **How to use this document:** Each section contains a *prompt* you can paste into an AI assistant (or ask me directly) to generate the full content for that topic. Topics are organized from foundational concepts to advanced implementations.

---

## Table of Contents

1. [Foundations of Cryptography](#1-foundations-of-cryptography)
   - 1.1 [What is Cryptography?](#11-what-is-cryptography)
   - 1.2 [Core Security Goals (CIA Triad + Non-Repudiation)](#12-core-security-goals)
   - 1.3 [Cryptographic Primitives Overview](#13-cryptographic-primitives-overview)
   - 1.4 [Plaintext, Ciphertext, Keys & Algorithms](#14-plaintext-ciphertext-keys--algorithms)
   - 1.5 [Kerckhoffs's Principle & Security by Obscurity](#15-kerckhoffss-principle)

2. [Encoding vs Encryption vs Hashing](#2-encoding-vs-encryption-vs-hashing)
   - 2.1 [Encoding (Base64, Hex, URL Encoding)](#21-encoding)
   - 2.2 [Encryption (Reversible with Key)](#22-encryption)
   - 2.3 [Hashing (One-Way Function)](#23-hashing)
   - 2.4 [When to Use Which — Decision Guide](#24-when-to-use-which)

3. [Symmetric Encryption](#3-symmetric-encryption)
   - 3.1 [How Symmetric Encryption Works](#31-how-symmetric-encryption-works)
   - 3.2 [Block Ciphers vs Stream Ciphers](#32-block-ciphers-vs-stream-ciphers)
   - 3.3 [AES (Advanced Encryption Standard)](#33-aes)
   - 3.4 [Cipher Modes: ECB, CBC, CFB, OFB, CTR, GCM](#34-cipher-modes)
   - 3.5 [Padding Schemes (PKCS7, ANSI X.923)](#35-padding-schemes)
   - 3.6 [Initialization Vectors (IV) and Nonces](#36-initialization-vectors-and-nonces)
   - 3.7 [Key Management for Symmetric Keys](#37-key-management-for-symmetric-keys)
   - 3.8 [Symmetric Encryption in .NET (`Aes`, `AesGcm`)](#38-symmetric-encryption-in-net)

4. [Asymmetric (Public-Key) Encryption](#4-asymmetric-encryption)
   - 4.1 [How Public-Key Cryptography Works](#41-how-public-key-cryptography-works)
   - 4.2 [RSA — Algorithm, Key Sizes, Use Cases](#42-rsa)
   - 4.3 [Elliptic Curve Cryptography (ECC)](#43-elliptic-curve-cryptography)
   - 4.4 [Diffie-Hellman Key Exchange](#44-diffie-hellman-key-exchange)
   - 4.5 [ECDH — Elliptic Curve Diffie-Hellman](#45-ecdh)
   - 4.6 [Hybrid Encryption (Combining Symmetric + Asymmetric)](#46-hybrid-encryption)
   - 4.7 [Asymmetric Encryption in .NET (`RSA`, `ECDiffieHellman`)](#47-asymmetric-encryption-in-net)

5. [Cryptographic Hash Functions](#5-cryptographic-hash-functions)
   - 5.1 [Properties of a Secure Hash Function](#51-properties-of-a-secure-hash-function)
   - 5.2 [MD5 — History, Weaknesses, Why Not to Use](#52-md5)
   - 5.3 [SHA-1 — Deprecation Story](#53-sha-1)
   - 5.4 [SHA-2 Family (SHA-256, SHA-384, SHA-512)](#54-sha-2-family)
   - 5.5 [SHA-3 / Keccak](#55-sha-3--keccak)
   - 5.6 [BLAKE2 / BLAKE3](#56-blake2--blake3)
   - 5.7 [Hashing in .NET (`SHA256`, `SHA512`, `HashAlgorithm`)](#57-hashing-in-net)

6. [Password Hashing & Key Derivation](#6-password-hashing--key-derivation)
   - 6.1 [Why Regular Hashing is Wrong for Passwords](#61-why-regular-hashing-is-wrong-for-passwords)
   - 6.2 [Salting — Purpose and Implementation](#62-salting)
   - 6.3 [PBKDF2 — Algorithm and Parameters](#63-pbkdf2)
   - 6.4 [bcrypt — Design and Work Factor](#64-bcrypt)
   - 6.5 [scrypt — Memory-Hard Hashing](#65-scrypt)
   - 6.6 [Argon2 — Winner of the Password Hashing Competition](#66-argon2)
   - 6.7 [Password Hashing in .NET (`Rfc2898DeriveBytes`, ASP.NET Core Identity)](#67-password-hashing-in-net)

7. [Message Authentication Codes (MAC)](#7-message-authentication-codes)
   - 7.1 [What is a MAC and Why It Matters](#71-what-is-a-mac-and-why-it-matters)
   - 7.2 [HMAC — Hash-Based MAC](#72-hmac)
   - 7.3 [CMAC / OMAC — Cipher-Based MAC](#73-cmac--omac)
   - 7.4 [Poly1305](#74-poly1305)
   - 7.5 [Authenticated Encryption with Associated Data (AEAD)](#75-aead)
   - 7.6 [HMAC in .NET (`HMACSHA256`, `HMACSHA512`)](#76-hmac-in-net)

8. [Digital Signatures](#8-digital-signatures)
   - 8.1 [How Digital Signatures Work](#81-how-digital-signatures-work)
   - 8.2 [RSA Signatures (PKCS#1 v1.5 vs PSS)](#82-rsa-signatures)
   - 8.3 [DSA — Digital Signature Algorithm](#83-dsa)
   - 8.4 [ECDSA — Elliptic Curve DSA](#84-ecdsa)
   - 8.5 [EdDSA / Ed25519](#85-eddsa--ed25519)
   - 8.6 [Digital Signatures in .NET (`RSA.SignData`, `ECDsa`)](#86-digital-signatures-in-net)

9. [X.509 Certificates & Public Key Infrastructure (PKI)](#9-x509-certificates--pki)
   - 9.1 [What is a Certificate?](#91-what-is-a-certificate)
   - 9.2 [Certificate Authority (CA), Root CA, Intermediate CA](#92-certificate-authority)
   - 9.3 [Certificate Chain of Trust](#93-certificate-chain-of-trust)
   - 9.4 [Certificate Revocation (CRL, OCSP)](#94-certificate-revocation)
   - 9.5 [Self-Signed Certificates — Use Cases & Risks](#95-self-signed-certificates)
   - 9.6 [Working with X.509 in .NET (`X509Certificate2`, `X509Store`)](#96-x509-in-net)
   - 9.7 [Creating Certificates with .NET (`CertificateRequest`)](#97-creating-certificates-in-net)

10. [TLS / SSL — Secure Communication](#10-tls--ssl)
    - 10.1 [TLS Handshake — Step by Step](#101-tls-handshake)
    - 10.2 [TLS 1.2 vs TLS 1.3 — Key Differences](#102-tls-12-vs-tls-13)
    - 10.3 [Cipher Suites — What They Mean](#103-cipher-suites)
    - 10.4 [Certificate Pinning](#104-certificate-pinning)
    - 10.5 [Mutual TLS (mTLS)](#105-mutual-tls)
    - 10.6 [TLS in .NET (`HttpClient`, `SslStream`, `HttpClientHandler`)](#106-tls-in-net)
    - 10.7 [Configuring Kestrel with TLS in ASP.NET Core](#107-kestrel-tls-aspnet-core)

11. [Key Exchange & Key Agreement Protocols](#11-key-exchange--key-agreement)
    - 11.1 [The Key Distribution Problem](#111-the-key-distribution-problem)
    - 11.2 [Diffie-Hellman Key Exchange — Deep Dive](#112-diffie-hellman-deep-dive)
    - 11.3 [ECDH in Practice](#113-ecdh-in-practice)
    - 11.4 [Forward Secrecy (Perfect Forward Secrecy)](#114-forward-secrecy)
    - 11.5 [Key Derivation Functions (HKDF, KDF)](#115-key-derivation-functions)
    - 11.6 [Key Exchange in .NET (`ECDiffieHellman`)](#116-key-exchange-in-net)

12. [Random Number Generation](#12-random-number-generation)
    - 12.1 [Pseudo-Random vs Cryptographically Secure Random](#121-prng-vs-csprng)
    - 12.2 [Why `System.Random` is Dangerous for Security](#122-why-systemrandom-is-dangerous)
    - 12.3 [Entropy Sources](#123-entropy-sources)
    - 12.4 [CSPRNG in .NET (`RandomNumberGenerator`)](#124-csprng-in-net)

13. [Secrets Management & Key Storage](#13-secrets-management--key-storage)
    - 13.1 [Where NOT to Store Secrets (Code, Config Files)](#131-where-not-to-store-secrets)
    - 13.2 [.NET Secret Manager (Development)](#132-net-secret-manager)
    - 13.3 [Environment Variables Best Practices](#133-environment-variables)
    - 13.4 [Azure Key Vault Integration in .NET](#134-azure-key-vault)
    - 13.5 [AWS Secrets Manager / HashiCorp Vault](#135-aws-secrets-manager--hashicorp-vault)
    - 13.6 [Windows DPAPI (`ProtectedData`)](#136-windows-dpapi)

14. [ASP.NET Core Data Protection API](#14-aspnet-core-data-protection)
    - 14.1 [What is the Data Protection API?](#141-what-is-the-data-protection-api)
    - 14.2 [Key Ring Management & Rotation](#142-key-ring-management)
    - 14.3 [Protecting and Unprotecting Payloads](#143-protecting-payloads)
    - 14.4 [Persisting Keys (File System, Azure, Redis)](#144-persisting-keys)
    - 14.5 [Configuring Data Protection in ASP.NET Core](#145-configuring-data-protection)
    - 14.6 [Data Protection for Cookie Encryption](#146-data-protection-for-cookies)

15. [JSON Web Tokens (JWT)](#15-json-web-tokens)
    - 15.1 [JWT Structure — Header, Payload, Signature](#151-jwt-structure)
    - 15.2 [JWT Signing Algorithms (HS256, RS256, ES256)](#152-jwt-signing-algorithms)
    - 15.3 [JWT Vulnerabilities (none algorithm, alg confusion)](#153-jwt-vulnerabilities)
    - 15.4 [JWT Best Practices](#154-jwt-best-practices)
    - 15.5 [JWT in .NET (`System.IdentityModel.Tokens.Jwt`)](#155-jwt-in-net)
    - 15.6 [Validating JWTs in ASP.NET Core](#156-validating-jwts-aspnet-core)

16. [OAuth 2.0 & OpenID Connect (OIDC)](#16-oauth-20--openid-connect)
    - 16.1 [OAuth 2.0 Roles and Grant Types](#161-oauth-20-roles-and-grant-types)
    - 16.2 [Authorization Code Flow + PKCE](#162-authorization-code-flow--pkce)
    - 16.3 [Client Credentials Flow](#163-client-credentials-flow)
    - 16.4 [OpenID Connect — Authentication on Top of OAuth](#164-openid-connect)
    - 16.5 [Implementing OAuth 2.0 Client in .NET](#165-oauth-20-client-in-net)
    - 16.6 [Securing APIs with Bearer Tokens in ASP.NET Core](#166-securing-apis-with-bearer-tokens)

17. [Secure Coding Practices in .NET](#17-secure-coding-practices-in-net)
    - 17.1 [Timing Attacks and Constant-Time Comparison](#171-timing-attacks)
    - 17.2 [Secure String Handling (`SecureString`, Span)](#172-secure-string-handling)
    - 17.3 [Zeroing Out Sensitive Memory](#173-zeroing-sensitive-memory)
    - 17.4 [Avoiding Common Cryptographic Mistakes](#174-avoiding-cryptographic-mistakes)
    - 17.5 [Dependency Vulnerability Scanning (`dotnet audit`)](#175-dependency-scanning)

18. [Hashing for Non-Security Purposes](#18-hashing-for-non-security-purposes)
    - 18.1 [Checksums (CRC32, Adler-32)](#181-checksums)
    - 18.2 [Non-Cryptographic Hash Functions (MurmurHash, xxHash)](#182-non-cryptographic-hash-functions)
    - 18.3 [Content Integrity Verification](#183-content-integrity-verification)
    - 18.4 [Hashing for Deduplication and Caching](#184-hashing-for-deduplication)

19. [Post-Quantum Cryptography](#19-post-quantum-cryptography)
    - 19.1 [Why Quantum Computers Threaten Current Cryptography](#191-quantum-threat)
    - 19.2 [NIST Post-Quantum Standards (CRYSTALS-Kyber, CRYSTALS-Dilithium)](#192-nist-post-quantum-standards)
    - 19.3 [Harvest Now, Decrypt Later Attacks](#193-harvest-now-decrypt-later)
    - 19.4 [Migration Strategies and .NET Roadmap](#194-migration-strategies)

20. [Cryptography Compliance & Standards](#20-compliance--standards)
    - 20.1 [FIPS 140-2 / 140-3 — What It Means for .NET](#201-fips-140)
    - 20.2 [NIST Guidelines for Cryptographic Key Management](#202-nist-guidelines)
    - 20.3 [GDPR and Cryptography Requirements](#203-gdpr)
    - 20.4 [PCI-DSS Cryptographic Requirements](#204-pci-dss)
    - 20.5 [Enabling FIPS Mode in .NET](#205-fips-mode-in-net)

---

## Section Prompts

> Copy any prompt below and send it to generate the full content for that section.

---

### 1. Foundations of Cryptography

#### 1.1 What is Cryptography?
```
Explain what cryptography is, covering its history from ancient ciphers (Caesar, Vigenère) to modern cryptography. Include why it matters in software development today, the difference between classical and modern cryptography, and a brief overview of the two main branches: symmetric and asymmetric. Keep it approachable for a software developer new to the topic.
```

#### 1.2 Core Security Goals (CIA Triad + Non-Repudiation)
```
Explain the CIA Triad (Confidentiality, Integrity, Availability) and Non-Repudiation in the context of cryptography. For each property, describe what it means, which cryptographic tools achieve it (e.g., encryption for confidentiality, MACs for integrity), and give a real-world example. Include how these properties apply in .NET applications.
```

#### 1.3 Cryptographic Primitives Overview
```
Give an overview of cryptographic primitives: hash functions, symmetric ciphers, asymmetric ciphers, MACs, and digital signatures. Explain how they relate to each other and how they are composed into protocols. Include a table summarizing each primitive, its purpose, and its .NET class counterpart.
```

#### 1.4 Plaintext, Ciphertext, Keys & Algorithms
```
Define and explain the core vocabulary of cryptography: plaintext, ciphertext, encryption key, decryption key, algorithm, and cipher. Explain the difference between an algorithm (e.g., AES) and a mode of operation (e.g., CBC). Include a simple diagram description and a .NET code snippet demonstrating these concepts with AES.
```

#### 1.5 Kerckhoffs's Principle
```
Explain Kerckhoffs's Principle and why it is foundational to modern cryptography. Contrast it with "security by obscurity." Provide real-world examples of systems that violated this principle and the consequences. Explain what this means for .NET developers choosing or implementing cryptographic algorithms.
```

---

### 2. Encoding vs Encryption vs Hashing

#### 2.1 Encoding
```
Explain encoding in the context of security. Cover Base64, Hex (Base16), and URL encoding. Clarify that encoding is NOT security. Show .NET code examples using Convert.ToBase64String, BitConverter, and Uri.EscapeDataString. Include common misuses where developers incorrectly treat encoding as encryption.
```

#### 2.2 Encryption
```
Explain encryption as a reversible transformation requiring a key. Cover the difference between symmetric and asymmetric encryption. Include a simple .NET AES encryption/decryption example. Highlight what "secure encryption" requires beyond just calling an encrypt function (IV, authenticated encryption, key management).
```

#### 2.3 Hashing
```
Explain cryptographic hashing as a one-way function. Cover the avalanche effect, collision resistance, and preimage resistance. Show .NET examples using SHA256 to hash a string. Explain why hashes cannot be "decrypted" and address the misconception around rainbow tables and unsalted hashes.
```

#### 2.4 When to Use Which — Decision Guide
```
Create a practical decision guide for .NET developers on when to use encoding, encryption, or hashing. Use a decision tree format. Cover common scenarios: storing passwords, transmitting sensitive data, verifying file integrity, generating tokens, signing data. Include an anti-patterns table showing common mistakes and the correct approach.
```

---

### 3. Symmetric Encryption

#### 3.1 How Symmetric Encryption Works
```
Explain how symmetric encryption works conceptually. Cover the shared secret model, key sizes, and why key exchange is the hard problem. Include a diagram description of encrypt/decrypt flow. Discuss the advantages (speed) and disadvantages (key distribution problem) compared to asymmetric encryption. Give .NET context.
```

#### 3.2 Block Ciphers vs Stream Ciphers
```
Explain the difference between block ciphers and stream ciphers. Cover how block ciphers (like AES) process fixed-size blocks and how stream ciphers (like ChaCha20) process data byte-by-byte. Include use cases for each, performance characteristics, and what .NET provides for each type. Show a brief ChaCha20 example if available.
```

#### 3.3 AES
```
Provide a deep dive into AES (Advanced Encryption Standard). Cover its history (Rijndael competition), internals (SubBytes, ShiftRows, MixColumns, AddRoundKey), key sizes (128, 192, 256-bit), and security status. Include .NET code using System.Security.Cryptography.Aes showing key generation, encryption, and decryption. Explain when to choose 128 vs 256-bit keys.
```

#### 3.4 Cipher Modes
```
Explain AES cipher modes: ECB, CBC, CFB, OFB, CTR, and GCM. For each mode: describe how it works, its security properties, whether it provides authentication, and its weaknesses. Include the famous ECB penguin example. Recommend GCM as the modern default and show a full .NET AesGcm example with tag verification.
```

#### 3.5 Padding Schemes
```
Explain why block ciphers require padding and how PKCS#7 padding works. Cover what a padding oracle attack is and why it's dangerous. Explain why GCM mode eliminates the need for padding concerns. Show .NET examples with PaddingMode.PKCS7 and explain when padding errors can leak information.
```

#### 3.6 Initialization Vectors and Nonces
```
Explain what an Initialization Vector (IV) and nonce are, why they must be random/unique, and what happens when they are reused (IV reuse attacks, nonce reuse in GCM). Include rules for IV generation in .NET using RandomNumberGenerator. Explain the difference between a nonce (number used once) and an IV in the context of different cipher modes.
```

#### 3.7 Key Management for Symmetric Keys
```
Cover best practices for symmetric key management: key generation, storage, rotation, and destruction. Explain key derivation from passwords (PBKDF2) vs direct key generation. Cover how to store keys securely in .NET applications using Azure Key Vault, Windows DPAPI, and the ASP.NET Core Data Protection API. Include a key rotation strategy example.
```

#### 3.8 Symmetric Encryption in .NET
```
Provide a comprehensive .NET guide to symmetric encryption using System.Security.Cryptography. Cover: creating an Aes instance, generating keys and IVs, encrypting streams and byte arrays, using AesGcm for authenticated encryption, and CryptoStream for large data. Include full working C# examples and explain which .NET classes are available in .NET 6/7/8+.
```

---

### 4. Asymmetric Encryption

#### 4.1 How Public-Key Cryptography Works
```
Explain public-key cryptography from first principles: the concept of key pairs, trapdoor functions, and why knowing the public key doesn't reveal the private key. Use the padlock analogy. Cover typical use cases: encrypting messages, key exchange, and digital signatures. Explain why asymmetric encryption is slow and typically used to encrypt symmetric keys (hybrid encryption).
```

#### 4.2 RSA
```
Deep dive into RSA encryption: its mathematical basis (prime factorization), key generation process, PKCS#1 v1.5 vs OAEP padding, key sizes and security levels, and known vulnerabilities. Include .NET code using RSA class for encryption/decryption with OAEP padding. Explain when RSA is appropriate vs when to prefer ECC.
```

#### 4.3 Elliptic Curve Cryptography
```
Explain Elliptic Curve Cryptography (ECC): the mathematics of elliptic curves over finite fields, why smaller key sizes provide equivalent security to RSA, common curves (P-256, P-384, Curve25519), and ECDH vs ECDSA use cases. Include .NET examples using ECDsa and ECDiffieHellman classes. Explain why Curve25519/Ed25519 are preferred for new systems.
```

#### 4.4 Diffie-Hellman Key Exchange
```
Explain the Diffie-Hellman key exchange protocol step by step using both the color-mixing analogy and the mathematical explanation. Cover discrete logarithm problem, DH parameters (p, g), ephemeral vs static DH, and DHE in TLS. Include a .NET example and explain why DH alone doesn't authenticate parties (man-in-the-middle attack).
```

#### 4.5 ECDH
```
Explain Elliptic Curve Diffie-Hellman (ECDH) as the ECC equivalent of DH. Show a complete .NET example where two parties generate ECDH key pairs, exchange public keys, and derive a shared secret. Cover ephemeral ECDH (ECDHE) for forward secrecy, curve selection (P-256 vs X25519), and how the shared secret is then used with a KDF.
```

#### 4.6 Hybrid Encryption
```
Explain hybrid encryption: why we combine asymmetric and symmetric encryption, the typical pattern (encrypt a symmetric key with RSA/ECDH, then encrypt data with AES), and how TLS uses this approach. Build a complete .NET example of hybrid encryption: generate RSA key pair, encrypt an AES key with RSA OAEP, encrypt data with AES-GCM, then decrypt end-to-end.
```

#### 4.7 Asymmetric Encryption in .NET
```
Comprehensive .NET guide to asymmetric cryptography in System.Security.Cryptography. Cover: RSA key generation and export (PEM, PKCS8, XML), RSACryptoServiceProvider vs RSA.Create(), ECDiffieHellman for key agreement, importing/exporting keys across formats, and common pitfalls. Include .NET 6+ improvements to cryptographic APIs. Provide full working examples.
```

---

### 5. Cryptographic Hash Functions

#### 5.1 Properties of a Secure Hash Function
```
Explain the four properties of a cryptographic hash function: pre-image resistance, second pre-image resistance, collision resistance, and the avalanche effect. Explain what "breaking" a hash function means in each context. Include the birthday paradox and how it affects collision probability. Show why these properties matter for specific use cases in .NET applications.
```

#### 5.2 MD5
```
Cover MD5: its history, how it works at a high level, the discovery of practical collisions, and why it should never be used for security purposes in 2024. Show what MD5 is still acceptable for (non-security checksums). Include .NET code and the warning that MD5 throws in FIPS mode. Link to famous collision examples (Flame malware).
```

#### 5.3 SHA-1
```
Cover SHA-1: its design, the SHAttered attack (2017 practical collision), Google's deprecation, and why browsers and CAs no longer accept SHA-1 certificates. Explain when SHA-1 was deprecated in .NET and by browsers. Show migration path to SHA-256. Include .NET code showing SHA1 usage and the replacement.
```

#### 5.4 SHA-2 Family
```
Deep dive into the SHA-2 family: SHA-224, SHA-256, SHA-384, SHA-512, SHA-512/256. Explain the Merkle–Damgård construction, internal compression function, and length extension attacks (and how HMAC mitigates them). Provide a comparison table of output sizes, security levels, and performance. Include .NET examples using SHA256, SHA384, SHA512.
```

#### 5.5 SHA-3 / Keccak
```
Explain SHA-3 (Keccak): why NIST ran a competition after SHA-2 concerns, the sponge construction that differentiates it from SHA-2, the SHA-3 variants (SHA3-256, SHA3-512, SHAKE128, SHAKE256). Compare SHA-2 vs SHA-3 security and performance. Cover .NET support status (available from .NET 5+). Include code examples.
```

#### 5.6 BLAKE2 / BLAKE3
```
Explain BLAKE2 and BLAKE3: their design goals (faster than MD5, more secure than SHA-2), variants (BLAKE2b, BLAKE2s), and how BLAKE3 improves parallelism. Compare performance benchmarks against SHA-256. Explain why BLAKE3 is increasingly popular for non-NIST use cases. Cover .NET support via NuGet (Blake3 package) with examples.
```

#### 5.7 Hashing in .NET
```
Comprehensive .NET guide to hashing using System.Security.Cryptography. Cover: HashAlgorithm base class, SHA256/SHA512 creation patterns, hashing streams vs byte arrays, the new one-shot static methods (SHA256.HashData() in .NET 5+), incremental hashing with IncrementalHash, and performance tips. Include full examples and a benchmark comparison.
```

---

### 6. Password Hashing & Key Derivation

#### 6.1 Why Regular Hashing is Wrong for Passwords
```
Explain why using SHA-256 or MD5 to hash passwords is insecure. Cover brute-force attacks, dictionary attacks, rainbow tables, and GPU acceleration. Show how fast a modern GPU can crack unsalted SHA-256 hashes. Explain what properties a password hashing function needs (slowness, memory hardness). This should motivate the rest of the section.
```

#### 6.2 Salting
```
Explain what a salt is, how it prevents rainbow table attacks and identical password detection, how to generate a cryptographically secure salt in .NET using RandomNumberGenerator, and how to store salt + hash. Include a complete .NET example. Explain common salt mistakes: predictable salts, reusing salts, and too-short salts.
```

#### 6.3 PBKDF2
```
Explain PBKDF2 (Password-Based Key Derivation Function 2): how it works (HMAC iteration), the role of iteration count, salt, and output length. Discuss choosing appropriate iteration counts (NIST recommendations). Explain its weakness (GPU parallelizable). Show complete .NET example using Rfc2898DeriveBytes with SHA-256. Cover using it for both password hashing and key derivation.
```

#### 6.4 bcrypt
```
Explain bcrypt: its design by Niels Provos and David Mazières, the Blowfish cipher base, the cost factor, and why it's memory-resistant enough to slow GPUs. Cover the 72-byte input limit and its implications. Show .NET implementation using BCrypt.Net-Next NuGet package. Explain how to choose and migrate cost factors over time.
```

#### 6.5 scrypt
```
Explain scrypt: its design as a memory-hard password hashing function, the N/r/p parameters and their effects, why memory hardness matters against ASICs and FPGAs. Compare scrypt vs bcrypt and PBKDF2. Cover .NET availability (Konscious.Security.Cryptography or Libsodium.NET). Include a working example with recommended parameters.
```

#### 6.6 Argon2
```
Explain Argon2: the winner of the Password Hashing Competition (PHC), its three variants (Argon2d, Argon2i, Argon2id), and its parameters (time cost, memory cost, parallelism). Explain why Argon2id is the current recommended choice. Show .NET implementation using the Konscious.Security.Cryptography.Argon2 package. Provide OWASP-recommended parameters.
```

#### 6.7 Password Hashing in .NET
```
Practical .NET guide to password hashing. Cover: ASP.NET Core Identity's PasswordHasher<T> (what algorithm it uses, how it evolved across versions), Rfc2898DeriveBytes for PBKDF2, and integrating Argon2 or bcrypt via NuGet. Show a complete password registration and verification flow. Include a migration strategy for upgrading hash algorithms without forcing all users to reset passwords.
```

---

### 7. Message Authentication Codes (MAC)

#### 7.1 What is a MAC and Why It Matters
```
Explain what a Message Authentication Code (MAC) is, how it differs from a hash and a digital signature, and what attacks it prevents (tampering, forgery). Cover the Encrypt-then-MAC, MAC-then-Encrypt, and Encrypt-and-MAC approaches and why Encrypt-then-MAC is recommended. Explain the "authentication without confidentiality" use case.
```

#### 7.2 HMAC
```
Deep dive into HMAC (Hash-based MAC): the construction (nested hashing with key), why a naive keyed hash (H(key || message)) is vulnerable to length extension, and how HMAC avoids it. Cover HMAC-SHA256 vs HMAC-SHA512. Show .NET code using HMACSHA256 for API request signing. Include timing-safe comparison to prevent timing attacks during verification.
```

#### 7.3 CMAC / OMAC
```
Explain CMAC (Cipher-based MAC) and OMAC as block-cipher-based MACs. Cover when to use CMAC vs HMAC (hardware crypto accelerators, AES-native environments). Discuss CMAC in the context of AES-CMAC used in some protocols. Cover .NET availability.
```

#### 7.4 Poly1305
```
Explain Poly1305 as a high-speed one-time MAC designed by Bernstein. Cover its mathematical basis (polynomial evaluation), why it's a "one-time" MAC requiring a unique key per message, and its combination with ChaCha20 (ChaCha20-Poly1305 AEAD). Cover .NET support status.
```

#### 7.5 AEAD
```
Explain Authenticated Encryption with Associated Data (AEAD): why it combines confidentiality and integrity in one primitive, how GCM works (CTR mode + GHASH), the role of the authentication tag, what "associated data" is and when to use it. Show complete .NET AesGcm examples with associated data. Explain the catastrophic consequences of nonce reuse in GCM.
```

#### 7.6 HMAC in .NET
```
Comprehensive .NET guide to HMAC using System.Security.Cryptography. Cover: HMACSHA256, HMACSHA512, key generation, computing HMACs over streams, verifying HMACs with CryptographicOperations.FixedTimeEquals to prevent timing attacks, using HMAC for API authentication (signing headers), and the new one-shot HMAC methods in .NET 6+.
```

---

### 8. Digital Signatures

#### 8.1 How Digital Signatures Work
```
Explain how digital signatures work: private key signs (hash of message), public key verifies. Cover why this provides non-repudiation and integrity. Explain the typical flow: hash the message, sign the hash, verify by checking the signature against the public key and recomputed hash. Contrast with MAC (shared secret vs key pair). Give real-world examples: code signing, email signing (S/MIME), document signing.
```

#### 8.2 RSA Signatures
```
Explain RSA digital signatures: PKCS#1 v1.5 signature scheme vs RSA-PSS (Probabilistic Signature Scheme). Cover why PSS is recommended over PKCS#1 v1.5, the role of the salt in PSS, and how to choose signature algorithms. Show .NET code using RSA.SignData and RSA.VerifyData with both padding modes. Explain key size recommendations for signatures.
```

#### 8.3 DSA
```
Explain the Digital Signature Algorithm (DSA): its mathematical basis (discrete logarithm in subgroups), the role of k (per-signature nonce) and the catastrophic failure if k is reused or predictable (Sony PS3 hack). Cover DSA parameter sizes and NIST approval status. Show .NET DSA usage and why ECDSA is generally preferred today.
```

#### 8.4 ECDSA
```
Explain ECDSA (Elliptic Curve Digital Signature Algorithm): its advantages over RSA/DSA (smaller keys, faster), the curves used (P-256, P-384, secp256k1), and the same k-reuse vulnerability as DSA. Cover ECDSA in TLS certificates and code signing. Show complete .NET examples using ECDsa.SignData and ECDsa.VerifyData.
```

#### 8.5 EdDSA / Ed25519
```
Explain EdDSA and Ed25519: designed to avoid the k-reuse vulnerability by deriving k deterministically, Twisted Edwards curves, performance advantages. Cover Ed448 as well. Explain why Ed25519 is increasingly preferred for new systems (SSH keys, Signal Protocol, WireGuard). Show .NET support (available from .NET 5+ via ECDsa with Oid or via BouncyCastle).
```

#### 8.6 Digital Signatures in .NET
```
Comprehensive .NET guide to digital signatures. Cover: RSA.SignData/VerifyData, ECDsa.SignData/VerifyData, loading keys from PEM files, signing files and streams, SignedXml for XML signatures, and using certificates for signing. Include a real-world example: signing an API request payload and verifying it on the server. Cover .NET 5+ improvements.
```

---

### 9. X.509 Certificates & PKI

#### 9.1 What is a Certificate?
```
Explain X.509 certificates: what data they contain (subject, issuer, public key, validity period, extensions, signature), the ASN.1/DER encoding, common certificate file formats (PEM, DER, PFX/P12, CRT, CER), and how a certificate binds an identity to a public key. Show how to read a certificate in .NET using X509Certificate2 and inspect its properties.
```

#### 9.2 Certificate Authority
```
Explain the Certificate Authority hierarchy: Root CA, Intermediate CA, and leaf (end-entity) certificates. Cover how CAs validate identity (DV, OV, EV certificates), the CA/Browser Forum rules, and what Let's Encrypt changed in the ecosystem. Explain why intermediate CAs exist and the risks of a compromised Root CA. Relate this to the Windows/macOS/Linux certificate trust stores.
```

#### 9.3 Certificate Chain of Trust
```
Explain certificate chain validation: how a browser or .NET application validates a certificate by building a chain to a trusted root, the role of AIA (Authority Information Access) for chain building, and what happens when a certificate is self-signed. Walk through the validation steps .NET performs. Show how to validate a certificate chain programmatically using X509Chain.
```

#### 9.4 Certificate Revocation
```
Explain certificate revocation: why a certificate might need to be revoked (key compromise), Certificate Revocation Lists (CRL), Online Certificate Status Protocol (OCSP), OCSP Stapling, and the hard problem of revocation checking. Cover the DigiNotar incident. Show how to check revocation status in .NET using X509Chain with X509RevocationMode.
```

#### 9.5 Self-Signed Certificates
```
Explain self-signed certificates: what they are, legitimate use cases (development, internal services, mTLS), and the risks of bypassing validation. Cover common developer mistakes (disabling SSL validation in HttpClient). Show how to generate a self-signed certificate in .NET using CertificateRequest, add it to the trust store for development, and configure Kestrel to use it.
```

#### 9.6 X.509 in .NET
```
Comprehensive .NET guide to X509Certificate2: loading certificates from files, PFX/PEM, the cert store (X509Store), exporting certificates, accessing the private key, and using certificates for signing and TLS. Cover the X509Certificate2Collection, finding certificates by thumbprint, and the new PEM loading APIs in .NET 5+. Include working code examples.
```

#### 9.7 Creating Certificates in .NET
```
Show how to create X.509 certificates programmatically in .NET using CertificateRequest. Cover: generating a self-signed certificate, creating a CA certificate, issuing a certificate signed by a CA, adding Subject Alternative Names (SANs), setting key usage extensions, and exporting to PEM/PFX. Include a complete example creating a mini PKI: root CA → intermediate CA → leaf certificate.
```

---

### 10. TLS / SSL

#### 10.1 TLS Handshake
```
Walk through the TLS 1.3 handshake step by step: ClientHello, ServerHello, key exchange (ECDHE), certificate verification, Finished messages, and session key derivation. Explain what information is encrypted at each stage. Contrast with TLS 1.2 (more round trips, more flexibility). Include a sequence diagram description. Explain session resumption (session tickets, PSK).
```

#### 10.2 TLS 1.2 vs TLS 1.3
```
Compare TLS 1.2 and TLS 1.3: removed features in 1.3 (RSA key exchange, weak cipher suites, renegotiation), performance improvements (1-RTT vs 2-RTT, 0-RTT), and the security improvements. Explain why TLS 1.0 and 1.1 are deprecated. Cover .NET's TLS version configuration and how to enforce TLS 1.2 minimum in HttpClient and Kestrel.
```

#### 10.3 Cipher Suites
```
Explain what a cipher suite is (key exchange + authentication + cipher + MAC). Decode a real cipher suite string like TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384. Cover how TLS 1.3 simplified cipher suites. Show how to configure allowed cipher suites in .NET on Windows (SslStream) and Linux (OpenSSL via .NET). Recommend modern secure cipher suites.
```

#### 10.4 Certificate Pinning
```
Explain certificate pinning and public key pinning: what problem they solve (rogue CA issuance), how to implement them, the risks (pin expiration locking out users), and mobile vs server scenarios. Show how to implement certificate pinning in .NET HttpClient using HttpClientHandler.ServerCertificateCustomValidationCallback. Cover HPKP's failure and modern alternatives.
```

#### 10.5 Mutual TLS
```
Explain mutual TLS (mTLS): both client and server present certificates, use cases (service-to-service authentication, zero trust), how it differs from regular TLS. Show a complete .NET example: configuring Kestrel to require client certificates, configuring HttpClient to send a client certificate, and validating the client certificate on the server side.
```

#### 10.6 TLS in .NET
```
Comprehensive guide to TLS in .NET: SslStream for low-level TLS, HttpClient configuration (TLS version, certificate validation, client certificates), ServicePointManager (legacy) vs HttpClientHandler/SocketsHttpHandler, TLS debugging with Wireshark. Cover common TLS errors and their causes. Show how to properly configure HttpClient for production security.
```

#### 10.7 Kestrel TLS in ASP.NET Core
```
Show how to configure TLS in ASP.NET Core's Kestrel server: loading certificates from files and the cert store, configuring TLS protocols and cipher suites, HTTP/2 with TLS, configuring SNI (Server Name Indication) for multiple certificates, and HTTPS redirection middleware. Cover appsettings.json vs code configuration for certificates.
```

---

### 11. Key Exchange & Key Agreement

#### 11.1 The Key Distribution Problem
```
Explain the key distribution problem in symmetric cryptography: how do two parties establish a shared secret over an insecure channel without prior contact? Trace the history from physical key exchange to Diffie-Hellman. Explain why this problem motivated public-key cryptography. Cover the role of PKI in solving authentication alongside key exchange.
```

#### 11.2 Diffie-Hellman Deep Dive
```
Deep dive into Diffie-Hellman: the mathematical steps with actual small numbers, the discrete logarithm problem, safe primes, DH parameter generation, and the importance of parameter size. Explain small subgroup attacks and why using standard named groups (RFC 3526) is recommended. Cover finite-field DH vs elliptic curve DH performance.
```

#### 11.3 ECDH in Practice
```
Walk through a complete ECDH key agreement in .NET: Alice generates ECDH key pair, Bob generates ECDH key pair, they exchange public keys, both derive the same shared secret. Show the code end-to-end using ECDiffieHellman.Create(). Cover deriving an AES key from the shared secret using HKDF. Explain authenticated ECDH (signing the public key to prevent MITM).
```

#### 11.4 Forward Secrecy
```
Explain Perfect Forward Secrecy (PFS): what it means (compromise of long-term key doesn't compromise past sessions), how ephemeral key exchange provides it (DHE, ECDHE), and why it's important against "harvest now, decrypt later" attacks. Show how TLS 1.3 mandates forward secrecy. Explain the performance trade-off and why it's worth it.
```

#### 11.5 Key Derivation Functions
```
Explain Key Derivation Functions (KDFs): the difference between password-based KDFs (PBKDF2, Argon2) and extract-and-expand KDFs (HKDF). Explain HKDF (RFC 5869): the extract step (create a pseudorandom key from input keying material) and expand step (derive multiple keys). Show .NET code using HKDF (available from .NET 5+) to derive encryption and MAC keys from a shared secret.
```

#### 11.6 Key Exchange in .NET
```
Comprehensive .NET guide to key exchange using ECDiffieHellman: generating key pairs, exporting/importing public keys, deriving shared secrets, choosing curves (P-256 vs P-384 vs X25519 status in .NET). Show how to build a simple encrypted communication channel using ECDH + AES-GCM end to end. Cover key serialization for storage or transmission.
```

---

### 12. Random Number Generation

#### 12.1 PRNG vs CSPRNG
```
Explain the difference between Pseudo-Random Number Generators (PRNG) and Cryptographically Secure Pseudo-Random Number Generators (CSPRNG). Cover how PRNGs are seeded and why predictability is a problem in security. Explain what makes a CSPRNG secure (unpredictability, backtracking resistance). Cover Linux /dev/urandom, Windows CryptGenRandom, and their relationship to .NET APIs.
```

#### 12.2 Why System.Random is Dangerous
```
Explain why System.Random is not safe for security purposes in .NET: its predictable seed, how its output can be inferred from a few values, real-world vulnerabilities caused by using System.Random for tokens/passwords/session IDs. Show a concrete example of predicting System.Random output. Explain what .NET 6 changed about System.Random seeding.
```

#### 12.3 Entropy Sources
```
Explain entropy in the context of random number generation: what entropy is, how the OS collects entropy (hardware events, timing), what happens on low-entropy systems (VMs at startup), and the VM entropy problem. Cover hardware RNGs (RDRAND instruction). Explain how .NET's RandomNumberGenerator sources entropy on different platforms.
```

#### 12.4 CSPRNG in .NET
```
Comprehensive .NET guide to secure random number generation using System.Security.Cryptography.RandomNumberGenerator. Cover: generating random bytes, generating random integers in a range, generating random strings (tokens, passwords), generating GUIDs securely. Show the new RandomNumberGenerator static methods in .NET 6+. Include a utility class for common secure random generation tasks.
```

---

### 13. Secrets Management & Key Storage

#### 13.1 Where NOT to Store Secrets
```
Explain the top mistakes in secrets storage: hardcoded in source code, in appsettings.json checked into git, in environment variables on shared systems, in log files, in error messages. Cover the git history problem (even deleted secrets persist). Show real breach examples. Explain what qualifies as a secret: API keys, connection strings, certificates, encryption keys.
```

#### 13.2 .NET Secret Manager
```
Explain .NET's Secret Manager tool for development: how it works (user secrets stored outside the project directory), the dotnet user-secrets commands, how secrets flow into IConfiguration, and its limitations (dev-only, not encrypted at rest). Show setup in a .NET project and how to transition to a proper secrets vault for production.
```

#### 13.3 Environment Variables
```
Cover environment variables as a secrets approach: 12-factor app methodology, how to inject env vars in Docker, Kubernetes secrets, and Azure App Service. Explain the limitations (visible in process listings, inherited by child processes, logged by accident). Show how .NET reads environment variables via IConfiguration and the proper way to use them without leaking.
```

#### 13.4 Azure Key Vault
```
Complete guide to Azure Key Vault integration in .NET: Key Vault concepts (secrets, keys, certificates), setting up Key Vault with managed identity (no credentials needed), using the Azure.Security.KeyVault.Secrets package, integrating with IConfiguration via Azure.Extensions.AspNetCore.Configuration.Secrets, and caching to avoid rate limits. Include a full ASP.NET Core example.
```

#### 13.5 AWS Secrets Manager / HashiCorp Vault
```
Cover AWS Secrets Manager and HashiCorp Vault as alternatives to Azure Key Vault. For AWS: using AWSSDK.SecretsManager in .NET, IAM roles for EC2/Lambda, secret rotation. For HashiCorp Vault: the AppRole auth method, dynamic secrets, using VaultSharp in .NET. Include a comparison table of features and use cases.
```

#### 13.6 Windows DPAPI
```
Explain Windows Data Protection API (DPAPI): machine-level vs user-level protection, how it uses the Windows credential infrastructure, the ProtectedData class in .NET, and use cases (protecting keys at rest on Windows). Show .NET examples using ProtectedData.Protect and ProtectedData.Unprotect. Explain ASP.NET Core's Data Protection integration with DPAPI for key ring encryption.
```

---

### 14. ASP.NET Core Data Protection

#### 14.1 What is the Data Protection API?
```
Explain the ASP.NET Core Data Protection API: its purpose (cookie encryption, anti-forgery tokens, session data), how it abstracts key management, the IDataProtector and IDataProtectionProvider interfaces, and the protect/unprotect pattern. Compare to the old MachineKey approach in ASP.NET. Explain the default behavior and what happens if not configured explicitly.
```

#### 14.2 Key Ring Management
```
Explain the ASP.NET Core Data Protection key ring: key generation (automatic every 90 days), key expiration, key activation delay, key revocation, and the default in-memory key ring. Explain why in-memory keys are a problem for web farms and application restarts. Cover key ring inspection using IKeyManager.
```

#### 14.3 Protecting Payloads
```
Show how to use IDataProtector to protect and unprotect payloads in ASP.NET Core. Cover: creating purpose-specific protectors, protecting byte arrays and strings, time-limited protection (ITimeLimitedDataProtector), and what happens when unprotecting fails (CryptographicException). Include real-world examples: protecting a password reset token, protecting a remember-me cookie value.
```

#### 14.4 Persisting Keys
```
Cover the options for persisting Data Protection keys: file system, Azure Blob Storage, Redis, SQL Server (Entity Framework), and Registry (Windows). Show configuration code for each. Explain key encryption at rest using Azure Key Vault, Windows DPAPI, and X.509 certificates. Cover how to choose persistence and encryption strategies for different deployment scenarios.
```

#### 14.5 Configuring Data Protection
```
Show complete ASP.NET Core Data Protection configuration code: setting the application name (critical for distributed systems), setting key lifetime, configuring persistence and encryption, disabling automatic key generation. Cover common configuration mistakes that cause decryption failures after deployment. Include a configuration checklist for production.
```

#### 14.6 Data Protection for Cookies
```
Explain how ASP.NET Core uses Data Protection to encrypt authentication cookies. Cover: the relationship between AddAuthentication, AddCookie, and Data Protection, what cookie encryption protects against, configuring cookie security (HttpOnly, Secure, SameSite), and how to properly configure Data Protection so cookie decryption survives server restarts and scale-out. Show a complete secure cookie auth configuration.
```

---

### 15. JSON Web Tokens (JWT)

#### 15.1 JWT Structure
```
Explain the structure of a JWT: three Base64url-encoded parts (header, payload, signature) separated by dots. Decode a real JWT. Cover standard claims (iss, sub, aud, exp, nbf, iat, jti), the header alg and typ fields, and the signature construction. Explain the difference between JWS (signed), JWE (encrypted), and JWK (key format). Show how to decode a JWT in .NET.
```

#### 15.2 JWT Signing Algorithms
```
Compare JWT signing algorithms: HS256/HS384/HS512 (HMAC symmetric), RS256/RS384/RS512 (RSA), ES256/ES384/ES512 (ECDSA), PS256/PS384/PS512 (RSA-PSS). Explain when to use symmetric vs asymmetric algorithms (single service vs microservices/public APIs). Cover the jwks_uri endpoint for public key distribution. Show .NET configuration examples for each.
```

#### 15.3 JWT Vulnerabilities
```
Cover critical JWT vulnerabilities: the "alg: none" attack, algorithm confusion (RS256 → HS256 using public key as HMAC secret), weak HS256 secrets, JWT without expiration, missing audience validation, and SQL injection via JWT claims. For each vulnerability, show the attack and the fix. Reference OWASP JWT Security Cheat Sheet. Show how proper .NET validation prevents these attacks.
```

#### 15.4 JWT Best Practices
```
Comprehensive JWT security best practices: always validate signature, validate all claims (exp, iss, aud), use short expiration times, implement refresh tokens properly, store tokens securely (httpOnly cookies vs localStorage), use JTI for token revocation, prefer RS256/ES256 for public-facing APIs, avoid storing sensitive data in payload. Show how to implement each in .NET/ASP.NET Core.
```

#### 15.5 JWT in .NET
```
Guide to generating and validating JWTs in .NET using System.IdentityModel.Tokens.Jwt. Show: creating a JwtSecurityToken with claims, signing with a symmetric and asymmetric key, validating tokens with TokenValidationParameters, handling validation exceptions, and extracting claims after validation. Cover Microsoft.IdentityModel.JsonWebTokens (the newer, faster alternative).
```

#### 15.6 Validating JWTs in ASP.NET Core
```
Show how to configure JWT Bearer authentication in ASP.NET Core: AddAuthentication().AddJwtBearer(), TokenValidationParameters configuration (ValidIssuer, ValidAudience, IssuerSigningKey, ClockSkew), loading signing keys from JWKS endpoint, custom token validators, and testing JWT auth. Include a complete working example with a token endpoint and a protected API endpoint.
```

---

### 16. OAuth 2.0 & OpenID Connect

#### 16.1 OAuth 2.0 Roles and Grant Types
```
Explain OAuth 2.0 roles (Resource Owner, Client, Authorization Server, Resource Server) and the four main grant types (Authorization Code, Implicit, Resource Owner Password, Client Credentials). Cover why Implicit is deprecated, why ROPC is discouraged, and when to use each remaining grant type. Draw the authorization code flow with sequence diagram description.
```

#### 16.2 Authorization Code Flow + PKCE
```
Deep dive into Authorization Code Flow with PKCE (Proof Key for Code Exchange): the problem PKCE solves (authorization code interception), the code_verifier and code_challenge construction (SHA-256), the complete flow with all HTTP requests/responses. Show implementation in a .NET app using Microsoft.AspNetCore.Authentication.OpenIdConnect or a manual implementation.
```

#### 16.3 Client Credentials Flow
```
Explain the Client Credentials flow for service-to-service authentication: when to use it, the token request (client_id, client_secret, scope), token caching and renewal. Show a complete .NET implementation using HttpClient to obtain and use client credentials tokens. Cover using IHttpClientFactory with automatic token management via Microsoft.Extensions.Http.Resilience or IdentityModel.
```

#### 16.4 OpenID Connect
```
Explain OpenID Connect (OIDC) as an authentication layer on top of OAuth 2.0: the ID token (JWT) vs access token, the UserInfo endpoint, the discovery document (/.well-known/openid-configuration), scopes (openid, profile, email), and how OIDC provides identity while OAuth provides authorization. Show how to integrate OIDC login in ASP.NET Core.
```

#### 16.5 OAuth 2.0 Client in .NET
```
Show how to implement an OAuth 2.0 client in .NET: using IdentityModel NuGet package for token management, HttpClient extensions for token acquisition, token caching, refresh token handling, and Duende.AccessTokenManagement for advanced scenarios. Include examples for both Authorization Code (web app) and Client Credentials (API-to-API) flows.
```

#### 16.6 Securing APIs with Bearer Tokens
```
Complete guide to securing ASP.NET Core APIs with Bearer tokens: AddAuthentication().AddJwtBearer() configuration, [Authorize] attribute, policy-based authorization, resource-based authorization, validating scopes and roles from token claims, and handling 401/403 responses correctly. Include a worked example with multiple authorization policies.
```

---

### 17. Secure Coding Practices in .NET

#### 17.1 Timing Attacks
```
Explain timing attacks in cryptographic contexts: how an attacker can infer secret information from response time differences (e.g., string comparison exiting early on first mismatch). Show how to exploit a timing vulnerability in a naive HMAC verification. Explain constant-time comparison and show .NET implementation using CryptographicOperations.FixedTimeEquals. Cover other timing oracles: padding oracles, early exit comparisons.
```

#### 17.2 Secure String Handling
```
Cover secure string handling in .NET: the problem with regular strings (immutable, GC'd unpredictably, heap dumps), SecureString (purpose, limitations, deprecation trajectory in .NET), using Span<byte> and stackalloc for sensitive data, pinning memory with GCHandle, and handling passwords in APIs (char[] vs string). Show practical .NET patterns for minimizing secret exposure in memory.
```

#### 17.3 Zeroing Sensitive Memory
```
Explain why zeroing sensitive data in memory matters (cold boot attacks, process memory dumps, swap files). Show .NET techniques: Array.Clear(), CryptographicOperations.ZeroMemory(), using `fixed` keyword and P/Invoke RtlSecureZeroMemory on Windows. Cover the .NET garbage collector challenge: values may be copied before zeroing. Discuss the limits of memory zeroing in managed languages.
```

#### 17.4 Avoiding Cryptographic Mistakes
```
Cover the top cryptographic implementation mistakes in .NET: hardcoded keys/IVs, using ECB mode, reusing IVs/nonces, rolling your own crypto, ignoring authentication (using AES-CBC without HMAC), using outdated algorithms (DES, 3DES, RC4, MD5 for security), insufficient key sizes, using System.Random for cryptographic purposes, and ignoring certificate validation. For each: show the bad code, explain the risk, show the fix.
```

#### 17.5 Dependency Scanning
```
Cover dependency vulnerability management in .NET: dotnet list package --vulnerable, GitHub Dependabot, OWASP Dependency-Check, Snyk, and NuGet audit. Explain how vulnerable cryptography dependencies (e.g., old BouncyCastle versions, JWT libraries with vulnerabilities) can undermine security. Show how to set up automated scanning in CI/CD pipelines. Cover NuGet package signing verification.
```

---

### 18. Hashing for Non-Security Purposes

#### 18.1 Checksums
```
Explain checksums (CRC32, Adler-32, CRC64): their purpose (error detection, not security), how they differ from cryptographic hashes (fast, not collision resistant), and where they're appropriate (file transfer integrity, network protocol error detection). Show .NET examples using Force.Crc32 NuGet or implementing CRC32. Explain why checksums must never be used for security.
```

#### 18.2 Non-Cryptographic Hash Functions
```
Explain non-cryptographic hash functions: MurmurHash, xxHash, FNV, SipHash. Cover why they're designed for speed and distribution (not security), use cases (hash maps, bloom filters, sharding), and the difference from cryptographic hashes. Show .NET usage via System.IO.Hashing (xxHash32, xxHash64, Crc32) available from .NET 6+. Explain SipHash as a defense against hash flooding attacks.
```

#### 18.3 Content Integrity Verification
```
Show how to use cryptographic hashing for content integrity: computing SHA-256 checksums of files, verifying downloaded files against published hashes, implementing ETag-style content change detection, and verifying software packages. Show practical .NET code for file hashing (streaming large files), comparing hashes, and generating hash manifests.
```

#### 18.4 Hashing for Deduplication
```
Cover hashing for deduplication and caching scenarios: content-addressable storage (like Git objects), deduplicating file storage, cache key generation from content, and bloom filters. Discuss the trade-offs between hash speed and collision probability for non-security uses. Show .NET examples using xxHash for fast content hashing in high-throughput scenarios.
```

---

### 19. Post-Quantum Cryptography

#### 19.1 Quantum Threat
```
Explain why quantum computers threaten current cryptography: Shor's algorithm breaking RSA, ECC, and DH (factoring and discrete logarithm), Grover's algorithm weakening symmetric keys (doubling required key size). Explain the current state of quantum computing (where we are today vs the "cryptographically relevant quantum computer" threshold). Clarify what is and isn't threatened.
```

#### 19.2 NIST Post-Quantum Standards
```
Explain the NIST Post-Quantum Cryptography standardization process and the selected algorithms: CRYSTALS-Kyber (ML-KEM, for key encapsulation), CRYSTALS-Dilithium (ML-DSA, for signatures), FALCON (FN-DSA), and SPHINCS+ (SLH-DSA). For each: explain the mathematical basis, security level, performance, and use case. Cover the availability roadmap for .NET and BouncyCastle.
```

#### 19.3 Harvest Now, Decrypt Later
```
Explain the "harvest now, decrypt later" (HNDL) threat: adversaries recording encrypted traffic today to decrypt once quantum computers exist. Discuss which data is most at risk (long-lived secrets, health records, financial data, government communications). Explain why this threat is relevant even before large quantum computers exist. Cover what organizations should do now.
```

#### 19.4 Migration Strategies
```
Cover quantum-safe migration strategies for .NET applications: cryptographic agility (designing systems to swap algorithms), hybrid schemes (combining classical + post-quantum), prioritizing long-lived key material, and the migration timeline. Discuss .NET's post-quantum roadmap and available libraries (BouncyCastle, open-quantum-safe/liboqs .NET bindings). Include a migration checklist.
```

---

### 20. Compliance & Standards

#### 20.1 FIPS 140
```
Explain FIPS 140-2 and 140-3: what it is (US federal standard for cryptographic modules), validation levels (1-4), what it means for software (approved algorithms only), and the approved algorithm list. Explain the implications for .NET: which algorithms are FIPS-approved, what breaks in FIPS mode (MD5, DES, RC2), and what customers/contracts require FIPS compliance. Cover the CNG (Windows Cryptography API Next Generation) as the FIPS-compliant provider.
```

#### 20.2 NIST Guidelines
```
Summarize key NIST cryptographic guidelines relevant to .NET developers: SP 800-57 (key management), SP 800-131A (algorithm transitions and deprecations), SP 800-38D (GCM mode), and SP 800-132 (password-based key derivation). Provide a practical summary: current approved algorithms, minimum key sizes, and algorithm deprecation timeline. Link to specific NIST publications.
```

#### 20.3 GDPR
```
Cover GDPR cryptography requirements: pseudonymization and encryption as data protection measures, what constitutes adequate protection for data breaches (encrypted data may not require breach notification), requirements for data at rest and in transit, key management requirements, and the right to erasure (crypto-shredding). Show .NET implementation patterns for GDPR-compliant data protection.
```

#### 20.4 PCI-DSS
```
Cover PCI-DSS cryptographic requirements for payment applications: strong cryptography requirements for cardholder data, key management requirements, prohibited algorithms, TLS requirements (minimum TLS 1.2), and key rotation. Translate PCI-DSS requirements into concrete .NET implementation guidance. Cover the impact on choosing algorithms, key sizes, and storage approaches.
```

#### 20.5 FIPS Mode in .NET
```
Show how to enable and test FIPS mode in .NET: the environment variable DOTNET_SYSTEM_SECURITY_ALLOWRC2ALGORITHM and related flags, Windows FIPS policy (Group Policy / Registry), testing FIPS compliance in unit tests, and what throws when FIPS is enabled. Include a compatibility checklist for FIPS-mode .NET applications and how to replace non-FIPS algorithms with approved equivalents.
```

---

## Quick Reference: Algorithm Recommendations

| Use Case | Recommended | Avoid |
|---|---|---|
| Symmetric Encryption | AES-256-GCM | DES, 3DES, RC4, AES-ECB |
| Password Hashing | Argon2id, bcrypt | MD5, SHA-256 (unsalted), SHA-1 |
| General Hashing | SHA-256, SHA-512, BLAKE3 | MD5, SHA-1 |
| HMAC | HMAC-SHA256, HMAC-SHA512 | HMAC-MD5 |
| Asymmetric Encryption | RSA-OAEP (2048+), ECDH P-256 | RSA-PKCS1v1.5 |
| Digital Signatures | ECDSA P-256, Ed25519, RSA-PSS | RSA-PKCS1v1.5, DSA |
| Key Derivation (Password) | PBKDF2 (600k+ iterations), Argon2id | MD5crypt, DES crypt |
| Key Derivation (Key Material) | HKDF | Direct use of shared secret |
| Secure Random | RandomNumberGenerator | System.Random, Math.Random |
| TLS | TLS 1.3, TLS 1.2 (with ECDHE+AEAD) | TLS 1.0, TLS 1.1, SSL 3.0 |

---

*Document version: 1.0 — Covers .NET 6 / .NET 8 LTS and ASP.NET Core 6–8*