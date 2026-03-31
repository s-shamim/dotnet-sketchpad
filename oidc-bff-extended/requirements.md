# OIDC BFF Extended — Requirements Document

A 5-app demo demonstrating a production-like OIDC / BFF (Backend-for-Frontend) architecture using .NET 10 file-based apps, Duende Identity Server, and a custom BFF token-relay pattern — with **Inventory Management** as the resource domain.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Browser (User)                                     │
└────────────┬──────────────────────────────────────────┬────────────────────┘
             │                                          │
             ▼ 5201                                     ▼ 5204
    ┌─────────────────┐                      ┌─────────────────────┐
    │   Shell App     │                      │   Identity UI App   │
    │  (static FE)    │                      │  (static FE, login  │
    │  App 1 · 5201   │                      │   form + logout)    │
    └────────┬────────┘                      │   App 4 · 5204      │
             │ fetch /bff/*                  └──────────┬──────────┘
             ▼ 5205                                     │ fetch
    ┌─────────────────┐                                 │ /api/ids/login
    │   BFF Backend   │                                 ▼ 5203
    │  (token relay,  │◄──────── OIDC code flow ──► ┌──────────────────┐
    │  GUID sessions) │                             │ Identity Server  │
    │  App 5 · 5205   │                             │ (Duende IDS,     │
    └────────┬────────┘                             │  no UI)          │
             │ HttpClient + Bearer                  │  App 3 · 5203    │
             ▼ 5202                                 └──────────────────┘
    ┌─────────────────┐
    │  Inventory API  │
    │  (JWT-protected │
    │   CRUD)         │
    │  App 2 · 5202   │
    └─────────────────┘
```

---

## 2. App Inventory

| #   | App              | Folder             | Port         | Has UI        |
| --- | ---------------- | ------------------ | ------------ | ------------- |
| 1   | Shell (FE)       | `shell/`           | `5201` HTTPS | ✅ React SPA  |
| 2   | Inventory API    | `inventory-api/`   | `5202` HTTPS | ❌ API only   |
| 3   | Identity Server  | `identity-server/` | `5203` HTTPS | ❌ API only   |
| 4   | Identity UI (FE) | `identity-ui/`     | `5204` HTTPS | ✅ Login form |
| 5   | BFF Backend      | `bff/`             | `5205` HTTPS | ❌ API only   |

---

## 3. Authentication Flow

```
Step 1: User visits Shell (5201) → not authenticated → clicks "Login"
Step 2: Shell redirects browser to → BFF /bff/login (5205)
Step 3: BFF issues OIDC Challenge → browser redirected to Identity Server
           /connect/authorize?client_id=bff-client&response_type=code&scope=openid+profile+inventory
           &redirect_uri=https://bff.localhost:5205/bff/signin-oidc
           &code_challenge=...&code_challenge_method=S256&state=...
Step 4: Identity Server (5203) resolves login → redirects browser to
           Identity UI (5204) /login.html?returnUrl=<encoded-authorize-url>
Step 5: Identity UI (5204) JSX form POSTs credentials to
           POST https://identity.localhost:5203/api/ids/login   { credentials: 'include' }
           ← returns { redirectUrl: "<authorize-continue-url>" }
Step 6: Identity UI JS does window.location.href = redirectUrl
           → browser navigates to 5203 authorize endpoint
           → IDS sets its session cookie and completes the authorize request
           → IDS redirects browser to callback:
           https://bff.localhost:5205/bff/signin-oidc?code=...&state=...
Step 7: BFF OIDC middleware handles /bff/signin-oidc callback:
           - Exchanges code for tokens (back-channel POST to /connect/token on 5203)
           - Stores tokens in ASP.NET session (Cookie scheme)
           - Redirects to /bff/signin-complete
Step 8: BFF /bff/signin-complete handler:
           - Retrieves access_token from the OIDC Cookie session (GetTokenAsync)
           - Generates a new random GUID as the session key
           - Stores GUID → { AccessToken, Sub, Name, ExpiresAt } in ConcurrentDictionary
           - Sets a bff-session cookie (HttpOnly, Secure, SameSite=Lax) containing the GUID
           - Signs out of the OIDC Cookie scheme (clears server-side token cookie)
           - Redirects browser back to Shell (https://shell.localhost:5201)
Step 9: Shell fetches GET /bff/user with credentials:include
           - BFF reads the bff-session cookie, looks up the GUID in the ConcurrentDictionary
           - Returns { authenticated: true, name: "...", sub: "..." }
Step 10: Shell renders user info card + inventory list via GET /bff/api/items
```

---

## 4. App Details

### App 1 — Shell (`shell/`)

**Role:** Main user-facing SPA. Static file server only — `App.cs` serves `wwwroot/` with no backend logic.

**Stack:**
- `#:sdk Microsoft.NET.Sdk.Web`
- Port: `5201` HTTPS
- No NuGet packages beyond the SDK

**UI (`wwwroot/index.html` + `script.jsx`):**
- On load: `GET https://bff.localhost:5205/bff/user` (with `credentials:'include'`)
- **Unauthenticated state:** Hero section, welcome text, "Sign in" ghost button that navigates to `https://bff.localhost:5205/bff/login`
- **Authenticated state:**
  - User info card (name, sub, "sign out" link → `https://bff.localhost:5205/bff/logout`)
  - Inventory table: fetches `GET https://bff.localhost:5205/bff/api/items` with `credentials:'include'`
  - "Add item" form (name, quantity, category, price) — posts to `POST https://bff.localhost:5205/bff/api/items`
  - Delete button per row — calls `DELETE https://bff.localhost:5205/bff/api/items/{id}`
- Theme Dropdown + dark mode Toggle per design system (zinc default, 4 themes)

---

### App 2 — Inventory API (`inventory-api/`)

**Role:** JWT-protected resource API with inventory items CRUD.

**Stack:**
- `#:sdk Microsoft.NET.Sdk.Web`
- `#:package Microsoft.AspNetCore.Authentication.JwtBearer@10.*`
- Port: `5202` HTTPS

**Data Model:**
```csharp
record InventoryItem(int Id, string Name, int Quantity, string Category, decimal Price);
```

**Seeded Items (startup):**
```
1: Wireless Mouse     | qty: 50  | category: Electronics | price: 29.99
2: Standing Desk      | qty: 12  | category: Furniture   | price: 349.00
3: USB-C Hub          | qty: 75  | category: Electronics | price: 49.99
4: Ergonomic Chair    | qty: 8   | category: Furniture   | price: 499.00
5: Whiteboard Markers | qty: 200 | category: Supplies    | price: 8.99
```

**Endpoints (all require JWT Bearer):**

| Method   | Path              | Description    |
| -------- | ----------------- | -------------- |
| `GET`    | `/api/items`      | List all items |
| `GET`    | `/api/items/{id}` | Get item by ID |
| `POST`   | `/api/items`      | Create item    |
| `PUT`    | `/api/items/{id}` | Update item    |
| `DELETE` | `/api/items/{id}` | Delete item    |

**JWT Configuration:**
- Authority: `https://identity.localhost:5203`
- Audience: `inventory-api`
- `RequireHttpsMetadata: false` (self-signed dev cert)
- Adds CORS policy allowing origin `https://bff.localhost:5205` (BFF makes server-to-server calls, but CORS still needed)

---

### App 3 — Identity Server (`identity-server/`)

**Role:** Sole OIDC authority. Issues access tokens, manages the authorization code flow, serves discovery document and token endpoints.

**Stack:**
- `#:sdk Microsoft.NET.Sdk.Web`
- `#:package Duende.IdentityServer@7.*`
- Port: `5203` HTTPS

**IDS Configuration:**

```
IssuerUri:   https://identity.localhost:5203
LoginUrl:    https://identity-ui.localhost:5204/login.html     ← Identity UI
LogoutUrl:   https://identity-ui.localhost:5204/logout.html
ErrorUrl:    https://identity-ui.localhost:5204/error.html

PAR (Pushed Authorization Request): DISABLED
  Reason: .NET OIDC middleware defaults to UseIfAvailable and sends PAR
  when advertised; without full PAR wiring this breaks the authorize request.
```

**Client — `bff-client`:**

| Setting                  | Value                                                |
| ------------------------ | ---------------------------------------------------- |
| `ClientId`               | `bff-client`                                         |
| `ClientSecret`           | `bff-secret` (SHA-256 hashed)                        |
| `AllowedGrantTypes`      | `Code`                                               |
| `RequirePkce`            | `true`                                               |
| `RequireConsent`         | `false`                                              |
| `RedirectUris`           | `https://bff.localhost:5205/bff/signin-oidc`         |
| `PostLogoutRedirectUris` | `https://bff.localhost:5205/bff/post-logout`         |
| `FrontChannelLogoutUri`  | `https://bff.localhost:5205/bff/frontchannel-logout` |
| `AllowedScopes`          | `openid`, `profile`, `inventory`                     |
| `AllowOfflineAccess`     | `false` (no refresh tokens in this demo)             |

**Identity Resources:** `openid`, `profile`

**API Scope:** `inventory` (display name: "Inventory API")

**API Resource:** `inventory-api` (audience claim), scopes: `inventory`

**Test Users:**
```
alice / alice  →  name: Alice Smith, email: alice@example.com
bob   / bob    →  name: Bob Jones,   email: bob@example.com
```

**IDS Interaction Endpoints (replace Razor Pages):**

| Method | Path              | Description                                                                               |
| ------ | ----------------- | ----------------------------------------------------------------------------------------- |
| `GET`  | `/api/ids/login`  | Resolve login context from `?returnUrl=` → returns `{ returnUrl, clientName, loginHint }` |
| `POST` | `/api/ids/login`  | Validate credentials, sign in to IDS cookie, return `{ redirectUrl }`                     |
| `GET`  | `/api/ids/logout` | Complete IDS server-side sign-out, return `{ redirectUrl }`                               |

**CORS:** Allow origin `https://identity-ui.localhost:5204` (Identity UI) with credentials.

---

### App 4 — Identity UI (`identity-ui/`)

**Role:** Purely a static file server for the login UI. `App.cs` has no backend logic — no IDS packages, no auth middleware.

**Stack:**
- `#:sdk Microsoft.NET.Sdk.Web`
- Port: `5204` HTTPS
- No NuGet packages

**Files (`wwwroot/`):**

- **`login.html`** — React login form
  - On load: `GET https://identity.localhost:5203/api/ids/login?returnUrl=<decoded-returnUrl>` (credentials: include)
    → shows `clientName` if present, `loginHint` pre-fills username
  - Submit: `POST https://identity.localhost:5203/api/ids/login` body `{ username, password, returnUrl }`
    → on success: `window.location.href = response.redirectUrl`
  - Error display below form
  - Test credentials hint: `alice / alice` or `bob / bob`

- **`logout.html`** — Handles IDS post-sign-out
  - On load: `GET https://identity.localhost:5203/api/ids/logout?logoutId=<from-query>` (credentials: include)
  - On success: `window.location.href = response.redirectUrl`

- **`error.html`** — Generic error page, reads `?errorId` from query string

---

### App 5 — BFF (`bff/`)

**Role:** Custom Backend-for-Frontend. Manages the OIDC code flow on behalf of the Shell, stores access tokens server-side keyed by GUID, and proxies all resource API requests.

**Stack:**
- `#:sdk Microsoft.NET.Sdk.Web`
- `#:package Microsoft.AspNetCore.Authentication.OpenIdConnect@10.*`
- `#:package Microsoft.AspNetCore.Authentication.Cookies@10.*`
- Port: `5205` HTTPS

**Session Store:**
```csharp
// In-memory GUID → session mapping (no Duende BFF, no IDistributedCache)
ConcurrentDictionary<string, BffSession> Sessions = new();

record BffSession(string AccessToken, string Sub, string Name, DateTimeOffset ExpiresAt);
```

**OIDC Configuration:**
```
DefaultScheme:          Cookie ("bff.oidc")
DefaultChallengeScheme: OpenIdConnect

OIDC:
  Authority:     https://identity.localhost:5203
  ClientId:      bff-client
  ClientSecret:  bff-secret
  ResponseType:  code
  UsePkce:       true
  SaveTokens:    true
  CallbackPath:  /bff/signin-oidc

  Scopes: openid, profile, inventory

Cookie:
  Name: bff.oidc
  Path: /bff        ← scoped so it doesn't bleed to other paths
```

**Endpoints:**

| Method   | Path                   | Description                                                                            |
| -------- | ---------------------- | -------------------------------------------------------------------------------------- |
| `GET`    | `/bff/login`           | Issues OIDC challenge → redirects to IDS                                               |
| `GET`    | `/bff/signin-oidc`     | OIDC callback — handled by middleware                                                  |
| `GET`    | `/bff/signin-complete` | Post-callback: creates GUID session, sets `bff-session` cookie, redirects to Shell     |
| `GET`    | `/bff/post-logout`     | IDS post-logout redirect: clears GUID session + cookie, redirects to Shell             |
| `GET`    | `/bff/user`            | Returns `{ authenticated, name, sub }` from GUID session (never 401s)                  |
| `GET`    | `/bff/logout`          | Looks up GUID session, removes it, clears cookie, initiates IDS end-session            |
| `GET`    | `/bff/api/items`       | Proxied → `GET https://api.localhost:5202/api/items` with `Authorization: Bearer <at>` |
| `POST`   | `/bff/api/items`       | Proxied → `POST https://api.localhost:5202/api/items`                                  |
| `PUT`    | `/bff/api/items/{id}`  | Proxied → `PUT https://api.localhost:5202/api/items/{id}`                              |
| `DELETE` | `/bff/api/items/{id}`  | Proxied → `DELETE https://api.localhost:5202/api/items/{id}`                           |

**`bff-session` Cookie:**
- `HttpOnly: true` — inaccessible to JavaScript
- `Secure: true` — HTTPS only
- `SameSite: Lax`
- Value: GUID string (not the access token)

**CORS:** Allow origin `https://shell.localhost:5201` (Shell) with credentials.

---

## 5. CORS Matrix

| Origin                                             | Target                                       | Allow?           | Credentials |
| -------------------------------------------------- | -------------------------------------------- | ---------------- | ----------- |
| `https://identity-ui.localhost:5204` (Identity UI) | `https://identity.localhost:5203` (IDS)      | ✅               | Yes         |
| `https://shell.localhost:5201` (Shell)             | `https://bff.localhost:5205` (BFF)           | ✅               | Yes         |
| `https://bff.localhost:5205` (BFF)                 | `https://api.localhost:5202` (Inventory API) | server-to-server | N/A         |
| Any other                                          | Any app                                      | ❌               | —           |

---

## 6. Security Notes

- **Access tokens never reach the browser.** The Shell only holds a short-lived, opaque GUID cookie.
- **HTTPS enforced on all apps.** Kestrel is configured with `ListenLocalhost(port, o => o.UseHttps())`.
- **PAR disabled on IDS.** .NET OIDC middleware's `UseIfAvailable` behavior would break the authorize request without full PAR wiring.
- **HttpOnly + Secure cookies.** The `bff-session` cookie is `HttpOnly` (no JS access) and `Secure` (HTTPS-only transport).
- **No refresh tokens.** `AllowOfflineAccess = false` on the client. This simplifies the demo; refresh token rotation would be the next hardening step.
- **Server certificate validation disabled locally.** All `HttpClient` instances use `ServerCertificateCustomValidationCallback = (_, _, _, _) => true` because all apps share a self-signed dev cert.
- **In-memory session store.** The BFF uses `ConcurrentDictionary` — all sessions are lost on restart. A production BFF would use `IDistributedCache` (Redis, etc.).
- **In-memory inventory data.** The API uses `ConcurrentDictionary<int, InventoryItem>` seeded at startup. A production app would use EF Core + a persistent database.
- **`*.localhost` subdomains require a wildcard TLS certificate.** The .NET dev cert (`dotnet dev-certs https --trust`) only covers `localhost`, not `shell.localhost` etc. For local development without browser cert warnings, generate a trusted wildcard cert: `mkcert -install && mkcert localhost '*.localhost'`. Alternatively, launch each app with `dotnet run --urls http://...` to use HTTP — but you must also change the `bff-session` cookie `Secure` flag to `false` and update `RequireHttpsMetadata` on JWT validation.

---

## 7. Startup Order

Apps are independent processes. Start them in this order to avoid connection errors on first request:

```
1. identity-server   (5203) — must be up before anything tries to authenticate
2. identity-ui       (5204) — can start any time, but 5203 must be reachable for login to work
3. inventory-api     (5202) — must be up before BFF proxies to it
4. bff               (5205) — OIDC middleware fetches IDS discovery doc on startup
5. shell             (5201) — must be last; calls BFF and everything must be running
```

---

## 8. File Structure

```
oidc-bff-extended/
├── requirements.md              ← this file
│
├── shell/                       ← App 1: Shell (FE), port 5201
│   ├── App.cs
│   ├── app.run.json
│   ├── appsettings.json
│   └── wwwroot/
│       ├── index.html
│       ├── script.jsx
│       └── themes.css
│
├── inventory-api/               ← App 2: Inventory API, port 5202
│   ├── App.cs
│   ├── app.run.json
│   └── appsettings.json
│
├── identity-server/             ← App 3: Identity Server (Duende IDS), port 5203
│   ├── App.cs
│   ├── app.run.json
│   └── appsettings.json
│
├── identity-ui/                 ← App 4: Identity UI (FE), port 5204
│   ├── App.cs
│   ├── app.run.json
│   ├── appsettings.json
│   └── wwwroot/
│       ├── login.html
│       ├── logout.html
│       └── error.html
│
└── bff/                         ← App 5: BFF Backend, port 5205
    ├── App.cs
    ├── app.run.json
    └── appsettings.json
```

---

## 9. NuGet Package Summary

| App             | Packages                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| shell           | (none — SDK only)                                                                                            |
| inventory-api   | `Microsoft.AspNetCore.Authentication.JwtBearer@10.*`                                                         |
| identity-server | `Duende.IdentityServer@7.*`                                                                                  |
| identity-ui     | (none — SDK only)                                                                                            |
| bff             | `Microsoft.AspNetCore.Authentication.OpenIdConnect@10.*`, `Microsoft.AspNetCore.Authentication.Cookies@10.*` |

All apps use `#:sdk Microsoft.NET.Sdk.Web` and `#:property PublishAot=false`.
