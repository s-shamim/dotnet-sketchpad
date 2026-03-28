# REST Client — Feature Requirements

> Web-native REST client built as a .NET 10 file-based app with React 18 frontend.  
> All functional logic runs server-side in C#. The UI is purely presentational.

---

## Table of Contents

1. [Overview](#overview)  
2. [Architecture](#architecture)  
3. [Database Schema](#database-schema)  
4. [UI Layout — Option C (Activity Bar)](#ui-layout)  
5. [Feature Specifications](#feature-specifications)  
   - 5.1 [Request Execution](#51-request-execution)  
   - 5.2 [Collections & Folders](#52-collections--folders)  
   - 5.3 [Environments & Variables](#53-environments--variables)  
   - 5.4 [History](#54-history)  
   - 5.5 [Request Tabs](#55-request-tabs)  
   - 5.6 [Scripting DSL](#56-scripting-dsl)  
   - 5.7 [Script Autocomplete](#57-script-autocomplete)  
   - 5.8 [Console](#58-console)  
   - 5.9 [Settings & Preferences](#59-settings--preferences)  
6. [API Endpoints](#api-endpoints)  
7. [Inheritance & Merge Rules](#inheritance--merge-rules)  
8. [File Structure](#file-structure)  

---

## Overview

A browser-based HTTP client (similar to Postman/Insomnia) that runs as a local .NET web app. Key principles:

- **All logic in C#** — HTTP proxy, script execution, env interpolation, test assertions, import/export
- **UI is stateless** — React renders what the API returns; no business logic in JSX
- **SQLite persistence** — collections, environments, history, tabs, preferences stored in `app.db`
- **No build tools** — React 18 + Babel + Tailwind via CDN, JSX files loaded directly
- **Zero external JS dependencies** — no npm, no bundler

---

## Architecture

```
Browser (React 18)                    Server (ASP.NET + EF Core + SQLite)
┌──────────────────┐                  ┌──────────────────────────────────┐
│  TopBar          │                  │  Static Files (wwwroot/)         │
│  ActivityBar     │  ◄── fetch ──►   │  API Endpoints (/api/...)        │
│  SidePanel       │                  │  HTTP Proxy (/api/proxy)         │
│  RequestTabs     │                  │  Script Engine (DSL parser)      │
│  UrlBar          │                  │  Env Interpolation               │
│  InputPane       │                  │  EF Core + SQLite (app.db)       │
│  OutputPane      │                  └──────────────────────────────────┘
│  ConsolePanel    │
│  Modals          │
└──────────────────┘
```

**Run:** `dotnet run rest-client/App.cs` → `http://localhost:5111`

**Packages:**
```csharp
#:package Microsoft.EntityFrameworkCore.Sqlite@10.*
#:package Microsoft.EntityFrameworkCore.Design@10.*
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────┐
│                       Collection                        │
├─────────────────────────────────────────────────────────┤
│ Id              int          PK                         │
│ Name            string                                  │
│ Description     string       nullable                   │
│ Headers         string       json — default headers     │
│ AuthType        string       none|bearer|basic|api-key  │
│ AuthData        string       json — credentials         │
│ PreRequestScript string      nullable                   │
│ TestScript      string       nullable                   │
│ Settings        string       json — defaults            │
│ SortOrder       int                                     │
│ CreatedAt       datetime                                │
│ UpdatedAt       datetime                                │
└────────────┬────────────────────────┬────────────────────┘
             │ 1:N                    │ 1:N
             ▼                        ▼
┌────────────────────────┐  ┌────────────────────────────────────────────┐
│        Folder          │  │              Request                       │
├────────────────────────┤  ├────────────────────────────────────────────┤
│ Id            int   PK │  │ Id              int        PK              │
│ CollectionId  int   FK │  │ CollectionId    int        FK              │
│ ParentFolderId int  FK │  │ FolderId        int        FK nullable     │
│   (nullable, self-ref) │  │ Name            string                     │
│ Name          string   │  │ Method          string     GET|POST|...    │
│ SortOrder     int      │  │ Url             string                     │
├────────────────────────┤  │ Params          string     json            │
│ Folder ──┐ self-ref    │  │ Headers         string     json            │
│          │ 1:N         │  │ Body            string     nullable        │
│          ▼             │  │ BodyType        string     none|json|...   │
│   (nested folders)     │  │ AuthType        string     nullable        │
└────────────────────────┘  │ AuthData        string     json nullable   │
             │              │ PreRequestScript string    nullable        │
             │ 1:N          │ TestScript      string     nullable        │
             ▼              │ Settings        string     json            │
           Request          │ SortOrder       int                        │
                            │ CreatedAt       datetime                   │
                            │ UpdatedAt       datetime                   │
                            └──────────┬─────────────────────────────────┘
                                       │ 0..1
                                       ▼
                            ┌───────────────────────────────┐
                            │          OpenTab              │
                            ├───────────────────────────────┤
                            │ Id          int       PK      │
                            │ RequestId   int       FK null │
                            │ Name        string            │
                            │ Method      string            │
                            │ Url         string            │
                            │ IsActive    bool              │
                            │ SortOrder   int               │
                            │ DraftState  string   json     │
                            └───────────────────────────────┘

┌──────────────────────────────┐    ┌──────────────────────────────┐
│        Environment           │    │       HistoryEntry           │
├──────────────────────────────┤    ├──────────────────────────────┤
│ Id          int       PK     │    │ Id              int    PK    │
│ Name        string           │    │ Method          string       │
│ IsActive    bool             │    │ Url             string       │
│ CreatedAt   datetime         │    │ RequestHeaders  string json  │
│ UpdatedAt   datetime         │    │ RequestBody     string null  │
├──────────────────────────────┤    │ StatusCode      int          │
│         1:N                  │    │ StatusText      string       │
│         ▼                    │    │ ResponseHeaders string json  │
│ ┌──────────────────────────┐ │    │ ResponseBody    string null  │
│ │  EnvironmentVariable     │ │    │ DurationMs      int          │
│ ├──────────────────────────┤ │    │ ResponseSizeBytes int        │
│ │ Id             int    PK │ │    │ Timestamp       datetime     │
│ │ EnvironmentId  int    FK │ │    └──────────────────────────────┘
│ │ Key            string    │ │
│ │ InitialValue   string    │ │    ┌──────────────────────────────┐
│ │ CurrentValue   string    │ │    │        Preference            │
│ │ Enabled        bool      │ │    ├──────────────────────────────┤
│ │ SortOrder      int       │ │    │ Id    int     PK             │
│ └──────────────────────────┘ │    │ Key   string  unique         │
└──────────────────────────────┘    │ Value string                 │
                                    └──────────────────────────────┘
```

### Relationships

| From | To | Type | FK | Notes |
|---|---|---|---|---|
| Collection | Folder | 1:N | `Folder.CollectionId` | Top-level folders in collection |
| Folder | Folder | 1:N (self) | `Folder.ParentFolderId` | Unlimited nesting; null = root folder |
| Collection | Request | 1:N | `Request.CollectionId` | Every request belongs to a collection |
| Folder | Request | 1:N | `Request.FolderId` | Nullable — null means request is at collection root |
| Environment | EnvironmentVariable | 1:N | `EnvironmentVariable.EnvironmentId` | Variables scoped to environment |
| Request | OpenTab | 0..1 | `OpenTab.RequestId` | Nullable — null means unsaved tab |

### JSON Column Schemas

**Params / Headers (Request & Collection):**
```json
[
  { "id": 1, "key": "Authorization", "value": "Bearer {{token}}", "enabled": true },
  { "id": 2, "key": "Content-Type", "value": "application/json", "enabled": true }
]
```

**AuthData:**
```json
// bearer
{ "token": "{{api_key}}" }

// basic
{ "username": "admin", "password": "{{password}}" }

// api-key
{ "name": "X-API-Key", "value": "{{api_key}}", "addTo": "header" }
```

**Settings:**
```json
{
  "followRedirects": true,
  "verifySsl": false,
  "timeoutMs": 30000
}
```

**DraftState (OpenTab):**
```json
{
  "method": "POST",
  "url": "https://api.example.com/users",
  "params": [...],
  "headers": [...],
  "body": "{...}",
  "bodyType": "json",
  "auth": { "type": "bearer", "token": "..." }
}
```

---

## UI Layout

**Option C — Activity Bar** (VS Code pattern)

```
┌──────────────────────────────────────────────────────────────────┐
│ [+ New ▾]  [Workspace ▾]     🔍 Search...      [env▾] ⚙ 🎨 🌙  │  TopBar
├──┬─────────┬─────────────────────────────────────────────────────┤
│📁│ COLLCTNS│ [Request 1 ×] [Request 2 ×] [+]                    │  RequestTabs
│🌍│ 🔍 filtr│  My Request  ∙ coll/folder    [Save]               │  RequestShoulder
│📜│         │  [GET ▾] [ https://api.example.com/users  ] [Send] │  UrlBar
│  │ 📁 Users├────────────────────────┬────────────────────────────┤
│  │  GET /u │ [Params][Hdr][Body]    │ 200 OK · 142ms · 2.1KB    │
│  │  POST   │ [Auth][Script][Tests]  │ [Body][Headers][Tests]     │
│  │ 📁 Ordrs│ [Settings]            │                            │
│  │  GET /o │ ┌──────────────────┐   │ ┌────────────────────────┐ │
│  │         │ │                  │   │ │ { "data": [...] }      │ │
│  │         │ │  Input content   │ ⇔ │ │  Response content      │ │
│  │         │ │                  │   │ │                        │ │
│  │ [✏Edit] │ └──────────────────┘   │ └────────────────────────┘ │
│  │         ├────────────────────────┴────────────────────────────┤
│  │         │ ▲ Console  (5) [clear] [×]                          │  ConsolePanel
│  │         │ ✓ GET /users → 200 (142ms)                         │
└──┴─────────┴─────────────────────────────────────────────────────┘

◄──► Activity   Side        Main content area
     Bar 40px   Panel       (flex-1)
               240px
```

### Layout Components

| Component | Position | Behavior |
|---|---|---|
| **TopBar** | Fixed top, full width | `[+ New ▾]` dropdown (collection/request/env), workspace selector, centered search, env selector, settings gear, theme dropdown, dark/light toggle |
| **ActivityBar** | Far left, `w-10`, full height | 3 icon buttons: 📁 collections, 🌍 environments, 📜 history. Active = left border accent. Click same icon = collapse panel |
| **SidePanel** | Left of main, `w-60`, expandable | Content switches based on active panel. Has header with section name + close ×. Each section has own filter/actions |
| **RequestTabs** | Top of main area | Browser-style tabs with method badge, name, unsaved dot, close ×, add + button |
| **RequestShoulder** | Below tabs | Request name, breadcrumb (collection > folder), save/save-as button |
| **UrlBar** | Below shoulder | Method Dropdown + monospace URL input + Send button |
| **InputPane** | Left (horizontal) or top (vertical) | 7 tabs: params, headers, body, auth, scripts, tests, settings |
| **OutputPane** | Right (horizontal) or bottom (vertical) | Status bar + 3 tabs: body (pretty/raw), headers, test results |
| **Split divider** | Between input/output | Draggable. Single icon toggles horizontal ↔ vertical |
| **ConsolePanel** | Bottom of main area, collapsible | Log entries with status icons. `▲ console` tab when collapsed. Clear + close buttons |
| **EnvModal** | Modal overlay | Environment name + variable table (key/initial/current). Tab strip for multiple envs |
| **CollectionModal** | Modal overlay | Collection name + tabs: settings, headers, auth, scripts, tests, import |

### Layout Rules

- Full viewport height: `html, body, #root { height: 100%; overflow: hidden }`
- No empty space at bottom — flex column fills remaining space
- Split toggle is a **single icon** only — no text label
- Search input is **centered** in the top bar
- `[+ New ▾]` dropdown has 3 options: new collection, new request, new environment
- `[✏ Edit]` button on env pane opens EnvModal for that environment
- `[✏ Edit]` button on collection pane opens CollectionModal for that collection
- Default split: **horizontal** (input left, output right)

---

## Feature Specifications

### 5.1 Request Execution

**Flow:**
1. User clicks **Send**
2. UI sends a POST to `/api/proxy` with: method, URL, params, headers, body, auth, env ID, request ID
3. Server resolves:
   a. Merge collection headers + request headers (request wins on key conflict)
   b. Resolve auth (request auth overrides collection auth)
   c. Merge collection settings + request settings (request wins)
   d. Interpolate `{{varName}}` in URL, headers, body using active environment variables
   e. Run collection pre-request script, then request pre-request script
4. Server executes the HTTP request via `HttpClient`
5. Server runs collection test script, then request test script against the response
6. Server persists a HistoryEntry
7. Server returns response to UI: status, headers, body, duration, size, test results, script logs, updated env vars

**HTTP Methods:** GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

**Body Types:** none, json, form-data, raw

**Auth Types:** none, bearer token, basic auth, API key (header or query param)

**Timeout:** configurable per request (default 30s from settings)

### 5.2 Collections & Folders

**Collection:**
- Named container for requests
- Has **default headers, auth, pre-request script, test script, settings** inherited by all requests
- Editable via CollectionModal (tabs: settings, headers, auth, scripts, tests, import)
- Sortable (drag order persisted via `SortOrder`)

**Folder:**
- Named grouping within a collection
- Self-referencing hierarchy (unlimited nesting via `ParentFolderId`)
- Requests at collection root have `FolderId = null`
- Collapsed/expanded state managed in UI (not persisted)

**Import/Export:**
- Import from JSON (Postman v2.1 collection format)
- Export collection as JSON
- Import section in CollectionModal

### 5.3 Environments & Variables

**Environment:**
- Named variable set: `development`, `production`, `staging`, etc.
- Only one active at a time (`IsActive = true`)
- Switchable via env dropdown in TopBar or env pane radio-select

**Variables:**
- Each variable has: `key`, `initialValue`, `currentValue`, `enabled`, `sortOrder`
- `initialValue` — the exported/shared default
- `currentValue` — runtime override, **editable programmatically** by scripts
- `enabled` — can be toggled off without deleting
- Interpolation: `{{varName}}` replaced with `currentValue` (falls back to `initialValue`)

**Programmatic access (via DSL):**
```
set env accessToken = response.body.access_token
set env userId = jwt_payload(response.body.access_token).sub
```

Scripts update `currentValue` in the database. Changes are returned to the UI in the response payload so the env pane reflects updates immediately.

### 5.4 History

- Stores the last **100** request/response pairs (FIFO, oldest deleted)
- Each entry: method, URL, full request headers/body, full response headers/body, status, duration, size, timestamp
- Viewable in the History section of the SidePanel
- Clicking a history entry opens it as a new unsaved tab
- **Clear all** action available
- Full request/response detail viewable in the console detail view

### 5.5 Request Tabs

- Multiple requests open simultaneously (browser-tab pattern)
- Tab shows: method badge (color-coded) + name + unsaved dot + close ×
- `+` button adds new empty tab
- Tab state persisted in `OpenTab` table across sessions
- **DraftState:** when editing a saved request, unsaved changes stored in `DraftState` JSON. On save, merged back to `Request` row and `DraftState` clears

### 5.6 Scripting DSL

A declarative, line-based DSL parsed and executed server-side in C#. No external dependencies.

**Script locations** (execution order):
1. Collection pre-request script → before every request in that collection
2. Request pre-request script → before this specific request
3. *(HTTP request executes)*
4. Collection test script → after every request in that collection
5. Request test script → after this specific request

#### Assertion Syntax

```
# Status assertions
status == 200
status != 404
status >= 200
status < 300

# Header assertions
header content-type == application/json
header content-type contains json
header x-request-id != ""

# Body assertions (JSON dot-path)
body.success == true
body.data.users.length > 0
body.data.users[0].name == "Alice"
body.data.users[0].email contains "@"
body.message != null

# Duration assertion
duration < 500
```

**Operators:** `==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`

**Value types:** string (unquoted or double-quoted), number, `true`, `false`, `null`

#### Assignment Syntax

```
# Set environment variable from response body
set env accessToken = response.body.access_token
set env userId = response.body.data.user.id
set env orderId = response.body.orders[0].id

# Set from response header
set env requestId = response.header.x-request-id
set env rateLimit = response.header.x-ratelimit-remaining

# Set from decoded JWT payload
set env userId = jwt_payload(response.body.access_token).sub
set env tokenExpiry = jwt_payload(env.accessToken).exp
set env roles = jwt_payload(response.body.token).roles

# Set from current env var (copy/transform)
set env prevToken = env.accessToken

# Set request header (pre-request script only)
set header X-Timestamp = now()
set header X-Request-Id = uuid()
set header Authorization = "Bearer " + env.accessToken
```

#### Built-in Functions

| Function | Returns | Example |
|---|---|---|
| `uuid()` | Random UUID v4 string | `set header X-Req-Id = uuid()` |
| `now()` | ISO 8601 UTC timestamp | `set env timestamp = now()` |
| `timestamp()` | Unix epoch seconds (int) | `set env epoch = timestamp()` |
| `base64_encode(value)` | Base64 encoded string | `set env encoded = base64_encode(env.password)` |
| `base64_decode(value)` | Decoded string | `set env decoded = base64_decode(response.body.data)` |
| `jwt_payload(token)` | Decoded JWT payload object | `set env sub = jwt_payload(env.token).sub` |
| `sha256(value)` | SHA-256 hex digest | `set env hash = sha256(response.body.raw)` |
| `length(value)` | String length or array count | `body.items.length > 0` (also inline) |

#### Logging

```
log response.body.access_token
log "request completed"
log env.userId
```

Log output appears in the Console panel.

#### Comments

```
# This is a comment — ignored by the parser
```

#### Complete Script Example

```
# Pre-request script (on collection: "Auth API")
set header X-Timestamp = now()
set header X-Request-Id = uuid()

# Pre-request script (on request: "Login")
set header Content-Type = application/json

# Test script (on request: "Login")
status == 200
body.access_token != null
body.token_type == "Bearer"

set env accessToken = response.body.access_token
set env refreshToken = response.body.refresh_token
set env userId = jwt_payload(response.body.access_token).sub
set env tokenExpiry = jwt_payload(response.body.access_token).exp

log "login successful, userId: " + env.userId
```

#### C# Implementation Outline

```csharp
// Parser: split script into lines, classify each line
enum LineType { Comment, Assertion, SetEnv, SetHeader, Log }

record ScriptLine(LineType Type, string Raw, string[] Tokens);

// Executor: processes parsed lines against request/response context
class ScriptExecutor
{
    ScriptContext Context;  // holds request, response, env vars

    List<TestResult> RunAssertions(List<ScriptLine> lines);
    void RunAssignments(List<ScriptLine> lines);
    string ResolveValue(string expression);     // dot-path, function, literal
    object ResolveDotPath(string path, object root);  // body.users[0].name
    object CallFunction(string name, string arg);     // jwt_payload, uuid, etc.
}

record TestResult(string Description, bool Passed, string Expected, string Actual);
```

### 5.7 Script Autocomplete

Custom trigger-based dropdown in the script textarea. No external dependencies (~150-200 lines JSX).

**Completion sources:**

| User is typing... | Suggestions shown | Source |
|---|---|---|
| Line start (empty) | `set env`, `set header`, `status`, `header`, `body`, `duration`, `log` | Static keywords |
| `set env ` | List of current env variable names | Dynamic from active environment |
| `set env x = ` | `response.body.`, `response.header.`, `response.status`, `env.`, `uuid()`, `now()`, `timestamp()`, `jwt_payload()`, `base64_encode()`, `base64_decode()`, `sha256()` | Static + dynamic |
| `response.` | `body`, `header`, `status`, `statusText`, `duration` | Static |
| `response.body.` | Top-level keys from last response JSON | Dynamic from last response |
| `response.header.` | Header names from last response | Dynamic from last response |
| `env.` | Current environment variable names | Dynamic from active environment |
| After path, before value | `==`, `!=`, `>`, `<`, `>=`, `<=`, `contains` | Static operators |
| `header ` | Common header names: `content-type`, `authorization`, `x-request-id`, etc. | Static + response headers |

**Behavior:**
- Dropdown appears on trigger prefix, filters as user types
- `↑↓` arrow keys navigate, `Tab`/`Enter` accept, `Esc` dismiss
- Positioned below the cursor using a hidden mirror `<span>` for text measurement
- Max 8 items visible, scrollable if more

**Component:**
```jsx
<ScriptEditor
  value={script}
  onChange={setScript}
  completions={{
    envVars: ['accessToken', 'userId', 'baseUrl'],
    responseBodyKeys: ['token', 'user', 'roles'],
    responseHeaders: ['content-type', 'x-request-id'],
  }}
  placeholder="status == 200"
/>
```

### 5.8 Console

- Collapsible bottom panel (VS Code terminal pattern)
- When collapsed: `▲ console (N)` tab showing entry count
- When expanded: header with `console` label + count badge + `[clear]` + `[×]`

**Log entry types:**

| Icon | Color | Meaning |
|---|---|---|
| ✓ check-circle | green | Successful request (2xx) or passed test |
| ✕ x-circle | red | Failed request (4xx/5xx) or failed test |
| ⓘ info | gray | Log output from scripts |
| ⚠ warning | yellow | Non-critical issue (e.g., slow response) |

**Entry format:** `[timestamp] [icon] [message]`

Example entries:
```
14:32:05  ✓  GET https://api.example.com/users → 200 OK (142ms)
14:32:05  ✓  test: status is 200 — passed
14:32:05  ✓  test: has users — passed
14:32:05  ⓘ  login successful, userId: usr_abc123
14:30:12  ✕  DELETE /orders/5 → 404 Not Found (45ms)
14:30:12  ✕  test: status is 200 — failed (expected: 200, got: 404)
```

### 5.9 Settings & Preferences

**Preference keys** (stored in Preference table):

| Key | Values | Default |
|---|---|---|
| `splitDirection` | `horizontal`, `vertical` | `horizontal` |
| `consoleOpen` | `true`, `false` | `true` |
| `activePanel` | `collections`, `environments`, `history`, `null` | `collections` |
| `activeEnvId` | environment ID or `null` | first environment |
| `theme` | `zinc`, `arctic`, `stone`, `hc` | `zinc` |
| `mode` | `light`, `dark` | `light` |

**Request-level settings** (stored in Request.Settings / Collection.Settings):

| Setting | Type | Default |
|---|---|---|
| `followRedirects` | bool | `true` |
| `verifySsl` | bool | `false` |
| `timeoutMs` | int | `30000` |

---

## API Endpoints

### Collections

| Method | Path | Description |
|---|---|---|
| GET | `/api/collections` | List all collections with folders and requests |
| POST | `/api/collections` | Create collection |
| PUT | `/api/collections/{id}` | Update collection (name, headers, auth, scripts, settings) |
| DELETE | `/api/collections/{id}` | Delete collection and all its requests |

### Folders

| Method | Path | Description |
|---|---|---|
| POST | `/api/collections/{cid}/folders` | Create folder in collection |
| PUT | `/api/folders/{id}` | Rename/move folder |
| DELETE | `/api/folders/{id}` | Delete folder and move requests to parent |

### Requests

| Method | Path | Description |
|---|---|---|
| POST | `/api/collections/{cid}/requests` | Save new request to collection |
| PUT | `/api/requests/{id}` | Update saved request |
| DELETE | `/api/requests/{id}` | Delete request |
| PATCH | `/api/requests/reorder` | Batch update sort orders |

### Proxy

| Method | Path | Description |
|---|---|---|
| POST | `/api/proxy` | Execute HTTP request (merge, interpolate, script, send) |

**Proxy request body:**
```json
{
  "requestId": 1,         // nullable — for saved requests
  "collectionId": 1,      // nullable — for collection inheritance
  "method": "GET",
  "url": "https://api.example.com/users",
  "params": [...],
  "headers": [...],
  "body": null,
  "bodyType": "none",
  "auth": { "type": "bearer", "token": "{{api_key}}" },
  "preRequestScript": "set header X-Ts = now()",
  "testScript": "status == 200"
}
```

**Proxy response body:**
```json
{
  "status": 200,
  "statusText": "OK",
  "headers": { "content-type": "application/json", ... },
  "body": "{ ... }",
  "durationMs": 142,
  "sizeBytes": 2150,
  "testResults": [
    { "description": "status == 200", "passed": true },
    { "description": "body.users.length > 0", "passed": true }
  ],
  "scriptLogs": ["login successful, userId: usr_abc"],
  "envUpdates": [
    { "key": "accessToken", "currentValue": "eyJ..." }
  ]
}
```

### Environments

| Method | Path | Description |
|---|---|---|
| GET | `/api/environments` | List all environments with variables |
| POST | `/api/environments` | Create environment |
| PUT | `/api/environments/{id}` | Update environment (name, variables) |
| DELETE | `/api/environments/{id}` | Delete environment |
| PUT | `/api/environments/{id}/activate` | Set as active environment |

### History

| Method | Path | Description |
|---|---|---|
| GET | `/api/history` | List recent entries (max 100) |
| DELETE | `/api/history` | Clear all history |

### Tabs

| Method | Path | Description |
|---|---|---|
| GET | `/api/tabs` | List open tabs |
| POST | `/api/tabs` | Open new tab |
| PUT | `/api/tabs/{id}` | Update tab (draft state, active) |
| DELETE | `/api/tabs/{id}` | Close tab |
| PUT | `/api/tabs/{id}/activate` | Switch to tab |

### Preferences

| Method | Path | Description |
|---|---|---|
| GET | `/api/preferences` | Get all preferences as key-value map |
| PUT | `/api/preferences` | Batch update preferences |

---

## Inheritance & Merge Rules

When a request is sent, collection-level and request-level settings are merged:

### Headers (additive, request overrides)
1. Start with collection headers (enabled only)
2. Add request headers (enabled only)
3. If same key exists in both, **request value wins**
4. Auth-injected headers added last (can be overridden by explicit headers)

### Auth (request overrides entirely)
- If request has `AuthType` set (non-null, non-"none") → use request auth
- Otherwise → fall back to collection auth
- If neither → no auth

### Scripts (concatenated)
- Pre-request: collection script runs first, then request script
- Test: collection script runs first, then request script
- Both scripts share the same execution context (env vars set by collection script are visible to request script)

### Settings (shallow merge, request overrides)
```
merged = { ...collectionSettings, ...requestSettings }
```
Request values override collection defaults. Unset request fields inherit from collection.

---

## File Structure

```
rest-client/
├── App.cs                          ← C# backend (EF Core, API, proxy, script engine)
├── app.run.json                    ← port 5111
├── appsettings.json                ← connection string, app config
├── app.db                          ← SQLite database (auto-created)
└── wwwroot/
    ├── index.html                  ← CDN scripts, theme flash prevention
    ├── themes.css                  ← 4 themes × light/dark
    ├── app.jsx                     ← App shell, state, primitives, mount (loaded last)
    └── components/
        ├── TopBar.jsx              ← top shoulder bar
        ├── ActivityBar.jsx         ← thin icon rail
        ├── SidePanel.jsx           ← expandable panel (collections/env/history)
        ├── RequestTabs.jsx         ← browser-style request tabs
        ├── RequestShoulder.jsx     ← name, breadcrumb, save
        ├── UrlBar.jsx              ← method + URL + send
        ├── InputPane.jsx           ← params, headers, body, auth, scripts, tests, settings
        ├── OutputPane.jsx          ← response status, body, headers, test results
        ├── ConsolePanel.jsx        ← collapsible log panel
        ├── ScriptEditor.jsx        ← textarea with autocomplete overlay
        ├── EnvModal.jsx            ← environment editor modal
        └── CollectionModal.jsx     ← collection settings/import modal
```
